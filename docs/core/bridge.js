// One tutoring call, independent of where it runs (local server or phone browser).
// Adapters given by the host:
//   connectLive(model, config, {onmessage, onclose}) -> Promise<session{sendRealtimeInput, sendClientContent, close}>
//   genJSON(models, prompt, opts) -> Promise<{model, data}>
//   store: { data, cfg, save(), saveSession(id, record) }
//   out:   { json(obj), audio(base64Pcm24k), close() }   (towards the call screen)
import { buildSystemInstruction, kickoffText, chipText, checkPrompt, summaryPrompt, lessonById, sceneById, TUTORS } from './prompts.js';
import { classifyError, clean, words, dkey } from './util.js';

const PATIENCE_MS = { fast: 700, normal: 1200, slow: 2000 };
const CHECK_GAP_MS = 6500;   // keeps the free text-model quota safe (well under 15 requests/minute)
let lastCheckAt = 0;

function closeError(ev) {
  const reason = ev && (ev.reason || ev.message) ? String(ev.reason || ev.message) : '';
  const err = new Error(reason || `closed (${ev?.code ?? '?'})`);
  err.code = ev?.code;
  err.reason = reason;
  return err;
}

export class TutorBridge {
  constructor({ params, store, connectLive, genJSON, out, log, onFinished }) {
    this.params = params;
    this.store = store;
    this.connectLive = connectLive;
    this.genJSON = genJSON;
    this.out = out;
    this.log = log || (() => {});
    this.onFinished = onFinished;
    this.session = null;
    this.model = '';
    this.handle = null;
    this.gen = 0;
    this.resumes = 0;
    this.resuming = false;
    this.ending = false;
    this.readyAt = 0;
    this.transcript = [];
    this.curUser = null;
    this.curTutor = null;
    this.userIdle = null;
    this.goAwayTimer = null;
    this.checkQueue = [];
    this.checkTimer = null;
    this.checkBusy = false;
    this.fixes = [];
    this.id = new Date().toISOString().replace(/[:.]/g, '-');
    this.systemText = buildSystemInstruction(store.data, params);
  }

  // ---------- from the call screen ----------
  audioIn(b64) {
    if (!this.session || this.resuming || this.ending) return;
    try { this.session.sendRealtimeInput({ audio: { data: b64, mimeType: 'audio/pcm;rate=16000' } }); } catch { /* reconnecting */ }
  }

  clientMessage(raw) {
    let m = raw;
    if (typeof raw === 'string') { try { m = JSON.parse(raw); } catch { return; } }
    if (!m || typeof m !== 'object') return;
    if (m.t === 'end') { this.end('user'); return; }
    if (!this.session || this.ending) return;
    try {
      if (m.t === 'text') {
        const text = chipText(m.kind, m, this.store.data);
        if (text) this.instruct(text);
      } else if (m.t === 'actStart') this.session.sendRealtimeInput({ activityStart: {} });
      else if (m.t === 'actEnd') this.session.sendRealtimeInput({ activityEnd: {} });
      else if (m.t === 'micOff') this.session.sendRealtimeInput({ audioStreamEnd: true });
    } catch (e) { this.log('send failed', e?.message); }
  }

  clientClosed() { if (!this.ending) this.end('window-closed'); }

  instruct(text) {
    this.transcript.push({ who: 'app', text, t: Date.now() });
    if (!this.session) return;
    if (this.model.startsWith('gemini-3.8')) {
      this.session.sendClientContent({ turns: [{ role: 'user', parts: [{ text }] }], turnComplete: true });
    } else {
      this.session.sendRealtimeInput({ text });
    }
  }

  // ---------- Gemini Live ----------
  buildConfig(handle) {
    const st = this.store.data.settings || {};
    const tutor = TUTORS[st.tutor] || TUTORS.priya;
    const aad = st.micMode === 'ptt'
      ? { disabled: true }
      : {
          endOfSpeechSensitivity: 'END_SENSITIVITY_LOW',
          prefixPaddingMs: 200,
          silenceDurationMs: PATIENCE_MS[st.patience] || PATIENCE_MS.normal,
          ...(st.audioMode === 'speaker' ? { startOfSpeechSensitivity: 'START_SENSITIVITY_LOW' } : {}),
        };
    return {
      responseModalities: ['AUDIO'],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: st.voice || tutor.voice } } },
      systemInstruction: this.systemText,
      inputAudioTranscription: {},
      outputAudioTranscription: {},
      realtimeInputConfig: { automaticActivityDetection: aad },
      contextWindowCompression: { slidingWindow: {} },
      sessionResumption: handle ? { handle } : {},
    };
  }

  openSession(model, handle) {
    return new Promise((resolve, reject) => {
      const gen = ++this.gen;
      let settled = false;
      const timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        const e = new Error('timeout');
        e.code = 'timeout';
        reject(e);
      }, 20000);
      Promise.resolve().then(() => this.connectLive(model, this.buildConfig(handle), {
        onmessage: (msg) => { if (gen === this.gen) this.onUpstream(msg); },
        onclose: (ev) => {
          if (!settled) { settled = true; clearTimeout(timer); reject(closeError(ev)); return; }
          if (gen === this.gen) this.onUpstreamClose(ev);
        },
      })).then((s) => {
        if (settled) { try { s.close(); } catch { /* ignore */ } return; }
        settled = true;
        clearTimeout(timer);
        resolve(s);
      }).catch((e) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        reject(e);
      });
    });
  }

  async connectUpstream(resume) {
    const models = resume ? [this.model] : this.store.cfg.liveModels;
    let lastErr;
    for (const model of models) {
      try {
        this.session = await this.openSession(model, resume ? this.handle : null);
        this.model = model;
        this.log(`live session ${resume ? 'resumed' : 'started'} with ${model}`);
        return;
      } catch (e) {
        lastErr = e;
        const kind = classifyError(e);
        this.log(`live connect failed (${model}): ${kind} ${e?.message || ''}`);
        if (!resume && (kind === 'model' || kind === 'unknown')) continue;
        throw e;
      }
    }
    throw lastErr || new Error('no live model');
  }

  async start() {
    this.out.json({ t: 'status', s: 'connecting' });
    try {
      await this.connectUpstream(false);
    } catch (e) {
      this.fail(e);
      return;
    }
    this.readyAt = Date.now();
    this.out.json({ t: 'status', s: 'ready', model: this.model });
    this.instruct(kickoffText(this.store.data));
  }

  onUpstream(msg) {
    const sru = msg.sessionResumptionUpdate;
    if (sru && sru.resumable && sru.newHandle) this.handle = sru.newHandle;
    if (msg.goAway) this.onGoAway();
    const sc = msg.serverContent;
    if (!sc) return;

    const inT = sc.inputTranscription;
    if (inT && inT.text) this.userText(inT.text);
    if (inT && inT.finished) this.closeUser();

    if (sc.interrupted) {
      this.closeTutor(true);
      this.closeUser();
      this.out.json({ t: 'interrupted' });
    }

    const parts = (sc.modelTurn && sc.modelTurn.parts) || [];
    for (const part of parts) {
      const d = part.inlineData;
      if (d && d.data && (!d.mimeType || d.mimeType.startsWith('audio'))) {
        this.ensureTutor();
        this.out.audio(d.data);
      }
    }
    const outT = sc.outputTranscription;
    if (outT && outT.text) {
      this.ensureTutor();
      this.curTutor.text += outT.text;
      this.out.json({ t: 'out', text: outT.text });
    }
    if (sc.turnComplete) {
      this.closeTutor(false);
      this.closeUser();
      this.out.json({ t: 'turn' });
    }
  }

  userText(text) {
    if (!this.curUser) {
      this.curUser = { who: 'me', text: '', t: Date.now() };
      this.transcript.push(this.curUser);
    }
    this.curUser.text += text;
    this.out.json({ t: 'in', text });
    clearTimeout(this.userIdle);
    this.userIdle = setTimeout(() => { if (!this.curTutor) this.closeUser(); }, 4000);
  }

  ensureTutor() {
    if (!this.curTutor) {
      this.curTutor = { who: 'tutor', text: '', t: Date.now() };
      this.transcript.push(this.curTutor);
    }
  }

  closeTutor(interrupted) {
    if (!this.curTutor) return;
    if (interrupted) this.curTutor.interrupted = true;
    this.curTutor.text = clean(this.curTutor.text);
    this.curTutor = null;
  }

  closeUser() {
    clearTimeout(this.userIdle);
    const u = this.curUser;
    if (!u) return;
    this.curUser = null;
    u.text = clean(u.text);
    if (!u.text) { this.transcript = this.transcript.filter((x) => x !== u); return; }
    this.out.json({ t: 'userDone', text: u.text });
    const prevTutor = [...this.transcript].reverse().find((x) => x.who === 'tutor' && x.t < u.t);
    this.queueCheck(u.text, prevTutor ? prevTutor.text : '');
  }

  onGoAway() {
    if (this.goAwayTimer || this.resuming || this.ending) return;
    const tryNow = () => {
      if (this.curTutor && Date.now() - this.goAwayAt < 3000) { this.goAwayTimer = setTimeout(tryNow, 250); return; }
      this.goAwayTimer = null;
      this.resume('goaway');
    };
    this.goAwayAt = Date.now();
    this.goAwayTimer = setTimeout(tryNow, 100);
  }

  onUpstreamClose(ev) {
    if (this.ending) return;
    this.log(`upstream closed: ${ev?.code ?? ''} ${ev?.reason ?? ''}`);
    if (this.handle && this.resumes < 6) { this.resume('closed'); return; }
    this.fail(closeError(ev));
  }

  async resume(why) {
    if (this.resuming || this.ending) return;
    this.resuming = true;
    this.out.json({ t: 'status', s: 'reconnecting' });
    const old = this.session;
    this.session = null;
    this.gen++; // ignore anything the old connection still says
    try { old && old.close(); } catch { /* ignore */ }
    this.closeTutor(true);
    try {
      await this.connectUpstream(true);
      this.resumes++;
      this.log(`resumed after ${why}`);
      if (!this.ending) this.out.json({ t: 'status', s: 'ready', model: this.model });
    } catch (e) {
      this.fail(e);
    } finally {
      this.resuming = false;
    }
  }

  fail(e) {
    const kind = classifyError(e);
    this.log(`call failed: ${kind} ${e?.message || ''}`);
    this.out.json({ t: 'error', kind, detail: String(e?.message || '').slice(0, 240) });
    this.end('error');
  }

  // ---------- live correction cards ----------
  queueCheck(text, context) {
    if (words(text) < 3) return;
    this.checkQueue.push({ text, context });
    if (this.checkQueue.length > 3) this.checkQueue.shift();
    this.scheduleCheck();
  }

  scheduleCheck() {
    if (this.checkTimer || this.checkBusy || !this.checkQueue.length || this.ending) return;
    const wait = Math.max(0, lastCheckAt + CHECK_GAP_MS - Date.now());
    this.checkTimer = setTimeout(() => { this.checkTimer = null; this.runCheck(); }, wait);
  }

  async runCheck() {
    if (this.checkBusy || !this.checkQueue.length) return;
    const items = this.checkQueue.splice(0, 3);
    this.checkBusy = true;
    lastCheckAt = Date.now();
    try {
      const { data } = await this.genJSON(this.store.cfg.checkModels, checkPrompt(this.store.data, items), { temperature: 0.2, maxOutputTokens: 1024 });
      const out = [];
      for (const it of Array.isArray(data?.items) ? data.items : []) {
        const said = clean(it.said || items[(Number(it.n) || 1) - 1]?.text || '');
        const better = clean(it.better);
        if (!said || !better || said.toLowerCase().replace(/[^a-z ]/g, '') === better.toLowerCase().replace(/[^a-z ]/g, '')) continue;
        out.push({ said: said.slice(0, 300), better: better.slice(0, 300), tip: clean(it.tip).slice(0, 160), kind: ['grammar', 'word', 'tamil'].includes(it.kind) ? it.kind : 'grammar' });
      }
      if (out.length) {
        this.fixes.push(...out);
        this.out.json({ t: 'fix', items: out });
      }
    } catch (e) {
      this.log('check failed:', classifyError(e), e?.message || '');
    } finally {
      this.checkBusy = false;
      this.scheduleCheck();
    }
  }

  // ---------- end of call ----------
  async end(reason) {
    if (this.ending) return;
    this.ending = true;
    clearTimeout(this.goAwayTimer);
    clearTimeout(this.checkTimer);
    clearTimeout(this.userIdle);
    this.closeTutor(false);
    this.closeUser();
    const s = this.session;
    this.session = null;
    this.gen++;
    try { s && s.close(); } catch { /* ignore */ }

    const minutes = this.readyAt ? Math.round(((Date.now() - this.readyAt) / 60000) * 10) / 10 : 0;
    const spoke = this.transcript.some((x) => x.who === 'me' && words(x.text) >= 1);
    let report = null;
    if (this.readyAt && (minutes >= 0.3 || spoke)) {
      report = await this.makeReport(minutes, spoke).catch((e) => { this.log('report failed', e?.message); return null; });
    }
    this.out.json({ t: 'summary', data: report });
    try { this.out.close(); } catch { /* ignore */ }
    this.log(`call ended (${reason}), ${minutes} min`);
    if (this.onFinished) this.onFinished(this);
  }

  transcriptText() {
    const name = clean(this.store.data.profile?.name) || 'Dinesh';
    const lines = this.transcript
      .filter((x) => x.text && !(x.who === 'app' && x.text.startsWith('[The call just connected')))
      .map((x) => `${x.who === 'tutor' ? 'Teacher' : x.who === 'me' ? name : '[App]'}: ${x.text}${x.interrupted ? ' (interrupted)' : ''}`);
    let out = lines.join('\n');
    if (out.length > 14000) out = out.slice(out.length - 14000);
    return out;
  }

  async makeReport(minutes, spoke) {
    const d = this.store.data;
    const p = this.params;
    const lesson = p.mode === 'lesson' ? lessonById(p.day) : null;
    const scene = p.mode === 'role' ? sceneById(p.scene) : null;
    let ai = null;
    if (spoke) {
      try {
        const res = await Promise.race([
          this.genJSON(this.store.cfg.summaryModels, summaryPrompt(d, {
            mode: p.mode, day: p.day, lessonTitle: lesson?.en, sceneTitle: scene?.t, minutes, transcript: this.transcriptText(),
          }), { temperature: 0.3, maxOutputTokens: 4096 }),
          new Promise((_, rej) => setTimeout(() => rej(new Error('summary timeout')), 45000)),
        ]);
        ai = res.data || null;
      } catch (e) {
        this.log('summary failed:', classifyError(e), e?.message || '');
      }
    }
    const arr = (v, n) => (Array.isArray(v) ? v.slice(0, n) : []);
    const today = dkey();
    const fixThese = arr(ai?.fixThese, 3).map((f) => ({ said: clean(f?.said).slice(0, 300), better: clean(f?.better).slice(0, 300), tip: clean(f?.tip).slice(0, 160) })).filter((f) => f.said && f.better);
    if (!fixThese.length && this.fixes.length) fixThese.push(...this.fixes.slice(-3).map(({ said, better, tip }) => ({ said, better, tip })));
    const report = {
      id: this.id,
      date: today,
      at: new Date().toISOString(),
      mode: p.mode,
      day: p.mode === 'lesson' ? Number(p.day) : null,
      title: lesson ? lesson.t : scene ? scene.t : p.mode === 'doubt' ? 'Doubt kelvigal' : 'Free-ah pechu',
      minutes,
      summary: clean(ai?.summary) || (spoke ? 'Indraiku nalla practice pannineenga!' : 'Indraiku konjam dhaan pesineenga. Adutha thadava innum konjam pesunga!'),
      didWell: arr(ai?.didWell, 3).map(clean).filter(Boolean),
      fixThese,
      newWords: arr(ai?.newWords, 5).map((w) => ({ word: clean(w?.word).slice(0, 80), meaning: clean(w?.meaning).slice(0, 120) })).filter((w) => w.word),
      nextTime: clean(ai?.nextTime),
      memoryNote: clean(ai?.memoryNote),
      dayDone: false,
    };

    // progress
    const prog = d.progress;
    prog.activity[today] = Math.round(((prog.activity[today] || 0) + minutes) * 10) / 10;
    prog.totalMinutes = Math.round(((prog.totalMinutes || 0) + minutes) * 10) / 10;
    if (p.mode === 'lesson' && lesson && spoke && (ai?.lessonCovered === true || minutes >= 8)) {
      if (!prog.daysDone[lesson.id]) prog.daysDone[lesson.id] = today;
      report.dayDone = true;
    }

    // memory
    const mem = d.memory;
    const seen = new Set(mem.facts.map((f) => f.toLowerCase()));
    for (const f of arr(ai?.facts, 5).map(clean).filter(Boolean)) {
      if (!seen.has(f.toLowerCase())) { mem.facts.unshift(f.slice(0, 140)); seen.add(f.toLowerCase()); }
    }
    mem.facts = mem.facts.slice(0, 25);
    const pats = arr(ai?.mistakePatterns, 6).map(clean).filter(Boolean);
    if (pats.length) mem.mistakes = pats.map((x) => x.slice(0, 140));
    if (/^(A1|A2|B1|B2)$/.test(clean(ai?.level))) mem.level = clean(ai.level);
    if (report.memoryNote) mem.notes = [report.memoryNote, ...mem.notes].slice(0, 10);

    // notebook
    const nbSeen = new Set(d.notebook.map((n) => n.better.toLowerCase()));
    for (const f of [...this.fixes, ...fixThese]) {
      const key = f.better.toLowerCase();
      if (nbSeen.has(key)) continue;
      nbSeen.add(key);
      d.notebook.unshift({ date: today, said: f.said, better: f.better, tip: f.tip || '' });
    }
    d.notebook = d.notebook.slice(0, 200);

    d.sessions.unshift({
      id: report.id, date: report.date, at: report.at, mode: report.mode, day: report.day, title: report.title, minutes,
      summary: report.summary, memoryNote: report.memoryNote, dayDone: report.dayDone, fixes: fixThese.length,
    });
    d.sessions = d.sessions.slice(0, 60);
    this.store.save();
    this.store.saveSession(this.id, { report, model: this.model, transcript: this.transcript });
    return report;
  }
}
