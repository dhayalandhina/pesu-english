// OpenAI edition of the tutor (phone browser and Mac/PC app):
//   voice -> Realtime API over a WebSocket (24 kHz PCM16 both ways)
//   text  -> Chat Completions (correction cards, end-of-call report)
// connectLive() turns Realtime events into the same Gemini-style messages TutorBridge already handles,
// so captions, interruptions, correction cards and the report work the same for both providers.
import { genJSONWith, classifyError, errText } from './util.js';
import { PROVIDER_MODELS } from './state.js';

export const OPENAI_BASE = 'https://api.openai.com';
const TRANSCRIBERS = ['gpt-transcribe', 'gpt-4o-mini-transcribe', 'whisper-1']; // his words as text (captions, cards)
const BYTES_PER_MS = 48;   // 24 kHz x 16-bit mono
const PREROLL_MS = 120;    // the player waits ~90 ms before it starts, plus a little network slack

// Browsers can't set headers on a WebSocket, so OpenAI takes the key as a sub-protocol.
export function browserSocket(url, key) {
  return new WebSocket(url, ['realtime', `openai-insecure-api-key.${key}`]);
}

const b64Bytes = (s) => Math.floor((s.length * 3) / 4) - (s.endsWith('==') ? 2 : s.endsWith('=') ? 1 : 0);

function readText(d, f) {
  if (typeof d === 'string') f(d);
  else if (d instanceof ArrayBuffer || ArrayBuffer.isView(d)) f(new TextDecoder().decode(d));
  else if (d && typeof d.text === 'function') d.text().then(f);
}

function apiError(e) {
  const err = new Error(e?.message || e?.code || 'error');
  err.code = e?.code || e?.type || '';
  return err;
}

// One Realtime session: sends his audio/text up, turns the answers into bridge messages.
class RealtimeLink {
  constructor(ws, model, config, cb, done) {
    this.ws = ws;
    this.cfg = config || {};
    this.cb = cb;
    this.done = done;            // (err, session): once, when the session is ready or failed
    this.ready = false;
    this.closed = false;
    this.tIdx = 0;               // which transcription model
    this.reasoning = /^gpt-realtime-2/.test(model);
    this.resp = 'idle';          // idle | asked | active
    this.respId = null;
    this.again = false;          // answer again as soon as the current answer ends
    this.cutNext = false;
    this.cutResp = new Set();    // answers he talked over: drop whatever still arrives from them
    this.item = null;            // tutor audio he is hearing: { id, ms, end }
    this.marks = new Map();      // his speech item -> when he stopped talking (keeps the transcript in order)
    this.heldMs = 0;             // push-to-talk audio since the button went down
    this.n = 0;
    this.session = {
      sendRealtimeInput: (o) => this.input(o || {}),
      sendClientContent: ({ turns } = {}) => this.say((turns || []).flatMap((t) => t.parts || []).map((p) => p.text || '').join(' ')),
      close: () => this.close(),
    };
  }

  send(o) { if (!this.closed && this.ws.readyState === 1) this.ws.send(JSON.stringify(o)); }
  emit(m) { if (!this.closed && this.ready) this.cb.onmessage(m); }

  update() {
    const c = this.cfg;
    const input = {
      format: { type: 'audio/pcm', rate: 24000 },
      noise_reduction: { type: c.speaker ? 'far_field' : 'near_field' },
      turn_detection: c.ptt ? null : { type: 'semantic_vad', eagerness: c.eagerness || 'low', create_response: true, interrupt_response: true },
    };
    if (TRANSCRIBERS[this.tIdx]) input.transcription = { model: TRANSCRIBERS[this.tIdx] };
    const output = { format: { type: 'audio/pcm', rate: 24000 }, voice: c.voice || 'marin' };
    if (c.speed && c.speed !== 1) output.speed = c.speed;
    const session = { type: 'realtime', instructions: c.instructions || '', output_modalities: ['audio'], audio: { input, output } };
    if (this.reasoning) session.reasoning = { effort: 'low' };
    this.send({ type: 'session.update', event_id: 'pesu_setup', session });
  }

  becomeReady() {
    // reconnect after a dropped line: give the new session the last part of the talk
    for (const h of this.cfg.history || []) {
      const tutor = h.role === 'assistant';
      this.send({ type: 'conversation.item.create', item: { type: 'message', role: tutor ? 'assistant' : 'user', content: [{ type: tutor ? 'output_text' : 'input_text', text: h.text }] } });
    }
    this.ready = true;
    this.done(null, this.session);
    this.emit({ sessionResumptionUpdate: { resumable: true, newHandle: 'replay' } });
  }

  onEvent(ev) {
    switch (ev.type) {
      case 'session.updated':
        if (!this.ready) this.becomeReady();
        break;
      case 'error':
        this.onError(ev.error || {});
        break;
      case 'input_audio_buffer.speech_started':
        this.onSpeech();
        break;
      case 'input_audio_buffer.speech_stopped':
      case 'input_audio_buffer.committed':
        if (ev.item_id && !this.marks.has(ev.item_id)) this.marks.set(ev.item_id, Date.now());
        break;
      case 'conversation.item.input_audio_transcription.completed': {
        const at = this.marks.get(ev.item_id);
        this.marks.delete(ev.item_id);
        const text = String(ev.transcript || '').trim();
        if (text) this.emit({ serverContent: { inputTranscription: { text, finished: true, at } } });
        break;
      }
      case 'conversation.item.input_audio_transcription.failed':
        this.marks.delete(ev.item_id);
        if (TRANSCRIBERS[this.tIdx + 1] && /model|not found|not supported|access/i.test(ev.error?.message || '')) {
          this.tIdx++;
          this.send({ type: 'session.update', session: { type: 'realtime', audio: { input: { transcription: { model: TRANSCRIBERS[this.tIdx] } } } } });
        }
        break;
      case 'response.created':
        this.resp = 'active';
        this.respId = ev.response?.id || null;
        if (this.cutNext) { this.cutNext = false; if (this.respId) this.cutResp.add(this.respId); }
        break;
      case 'response.output_audio.delta':
        this.onAudio(ev);
        break;
      case 'response.output_audio_transcript.delta':
        if (ev.delta && !this.cutResp.has(ev.response_id)) this.emit({ serverContent: { outputTranscription: { text: ev.delta } } });
        break;
      case 'response.done':
        this.onDone(ev.response || {});
        break;
      default:
        break;
    }
  }

  onError(e) {
    const what = `${e.param || ''} ${e.message || ''}`;
    if (!this.ready) {
      // a setting this account/model doesn't take: drop it and try again
      if (/transcri/i.test(what) && this.tIdx < TRANSCRIBERS.length) { this.tIdx++; this.update(); return; }
      if (/reasoning/i.test(what) && this.reasoning) { this.reasoning = false; this.update(); return; }
      this.fail(apiError(e));
      return;
    }
    if (String(e.event_id || '').startsWith('pesu_r')) {
      // our "answer now" was refused, usually because another answer is still running: ask again after it
      if (this.resp === 'asked') this.resp = 'idle';
      if (/active/i.test(`${e.code || ''} ${e.message || ''}`)) this.again = true;
    }
    const kind = classifyError(apiError(e));
    if (kind === 'billing' || kind === 'badkey') this.fatal(apiError(e));
  }

  onSpeech() {
    if (this.resp === 'active' && this.respId) this.cutResp.add(this.respId); // the server stops that answer itself
    if (this.playing()) { this.truncate(); this.emit({ serverContent: { interrupted: true } }); }
  }

  onAudio(ev) {
    if (!ev.delta || this.cutResp.has(ev.response_id)) return;
    const now = Date.now();
    if (!this.item || this.item.id !== ev.item_id) this.item = { id: ev.item_id, ms: 0, end: 0 };
    const ms = b64Bytes(ev.delta) / BYTES_PER_MS;
    this.item.end = Math.max(this.item.end, now + PREROLL_MS) + ms; // when the player will have finished it
    this.item.ms += ms;
    this.emit({ serverContent: { modelTurn: { parts: [{ inlineData: { data: ev.delta, mimeType: 'audio/pcm;rate=24000' } }] } } });
  }

  playing() { return !!this.item && this.item.end - Date.now() > 40; }

  // he cut the tutor off: tell the server how much he actually heard, so it doesn't think he heard the rest
  truncate() {
    const it = this.item;
    if (!it) return;
    this.item = null;
    const heard = Math.max(0, Math.min(it.ms, it.ms - (it.end - Date.now())));
    this.send({ type: 'conversation.item.truncate', item_id: it.id, content_index: 0, audio_end_ms: Math.floor(heard) });
  }

  onDone(r) {
    const cut = !!r.id && this.cutResp.has(r.id);
    if (r.id && r.id === this.respId) this.respId = null;
    this.resp = 'idle';
    if (r.status === 'failed') {
      const err = apiError(r.status_details?.error || { message: 'response failed' });
      if (['billing', 'badkey', 'quota', 'region'].includes(classifyError(err))) { this.fatal(err); return; }
    }
    if (!cut) this.emit({ serverContent: { turnComplete: true } });
    if (this.again) { this.again = false; this.respond(); }
  }

  // ---- from the bridge ----
  input(o) {
    if (o.audio && o.audio.data) {
      this.send({ type: 'input_audio_buffer.append', audio: o.audio.data });
      this.heldMs += b64Bytes(o.audio.data) / BYTES_PER_MS;
    } else if (typeof o.text === 'string') {
      this.say(o.text);
    } else if (o.activityStart) {          // push-to-talk: button down
      this.stopTutor();
      this.send({ type: 'input_audio_buffer.clear' });
      this.heldMs = 0;
    } else if (o.activityEnd) {            // button up: that's his turn
      if (this.heldMs >= 150) { this.send({ type: 'input_audio_buffer.commit' }); this.respond(); }
      this.heldMs = 0;
    }
  }

  say(text) {
    if (!text) return;
    this.stopTutor();
    this.send({ type: 'conversation.item.create', item: { type: 'message', role: 'user', content: [{ type: 'input_text', text }] } });
    this.respond();
  }

  respond() {
    if (this.resp !== 'idle') { this.again = true; return; }
    this.resp = 'asked';
    this.send({ type: 'response.create', event_id: `pesu_r${++this.n}` });
  }

  stopTutor() {
    if (this.playing()) { this.truncate(); this.emit({ serverContent: { interrupted: true } }); }
    if (this.resp === 'active') {
      if (this.respId) this.cutResp.add(this.respId);
      this.send({ type: 'response.cancel' });
    } else if (this.resp === 'asked') {
      this.cutNext = true;
      this.send({ type: 'response.cancel' });
    }
  }

  // ---- endings ----
  fail(err) {               // before the session was ready
    if (this.closed) return;
    this.closed = true;
    try { this.ws.close(1000); } catch { /* ignore */ }
    this.done(err);
  }

  fatal(err) {              // during the call, something that won't fix itself (no credit, key revoked)
    if (this.closed) return;
    this.closed = true;
    try { this.ws.close(1000); } catch { /* ignore */ }
    this.cb.onclose({ code: 4000, reason: [err.code, err.message].filter(Boolean).join(': '), fatal: true });
  }

  close() {
    this.closed = true;
    try { this.ws.close(1000); } catch { /* ignore */ }
  }

  onSocketClose(ev, why) {
    if (this.closed) return;
    this.closed = true;
    this.cb.onclose({ code: ev?.code, reason: ev?.reason || why || '' });
  }
}

export function makeOpenAI(apiKey, { baseUrl = OPENAI_BASE, openSocket = browserSocket } = {}) {
  const base = String(baseUrl || OPENAI_BASE).replace(/\/+$/, '');
  const wsBase = base.replace(/^http/, 'ws');

  async function rest(path, init = {}) {
    let r;
    try {
      r = await fetch(`${base}${path}`, { ...init, headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', ...(init.headers || {}) } });
    } catch (e) {
      throw new Error(`network: ${e?.message || 'Failed to fetch'}`);
    }
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      const err = new Error(j?.error?.message || `HTTP ${r.status}`);
      err.status = r.status;
      err.code = j?.error?.code || j?.error?.type || '';
      throw err;
    }
    return j;
  }

  // the socket closed before the call started: find out why (browsers hide it) from the REST API
  async function diagnose(model, why) {
    if (/\b[45]\d\d\b/.test(why)) return new Error(why); // Node tells us the HTTP status
    try { await rest(`/v1/models/${encodeURIComponent(model)}`); return null; } catch (e) { return e; }
  }

  async function mintSecret(model) {
    const j = await rest('/v1/realtime/client_secrets', { method: 'POST', body: JSON.stringify({ expires_after: { anchor: 'created_at', seconds: 600 }, session: { type: 'realtime', model } }) });
    if (!j || !j.value) throw new Error('no client secret');
    return j.value;
  }

  function connectLive(model, config, cb) {
    return new Promise((resolve, reject) => {
      let settled = false;
      const done = (err, session) => {
        if (settled) return;
        settled = true;
        if (err) reject(err); else resolve(session);
      };
      const open = (key, usedSecret) => {
        let ws;
        try { ws = openSocket(`${wsBase}/v1/realtime?model=${encodeURIComponent(model)}`, key); } catch (e) { done(e); return; }
        try { ws.binaryType = 'arraybuffer'; } catch { /* ignore */ }
        const link = new RealtimeLink(ws, model, config, cb, done);
        let why = '';
        ws.onopen = () => link.update();
        ws.onmessage = (ev) => readText(ev.data, (t) => {
          let m;
          try { m = JSON.parse(t); } catch { return; }
          link.onEvent(m);
        });
        ws.onerror = (ev) => { why = String(ev?.message || ev?.error?.message || ''); };
        ws.onclose = (ev) => {
          if (link.ready || link.closed) { link.onSocketClose(ev, why); return; }
          link.closed = true;
          diagnose(model, why).then((err) => {
            if (err) { done(err); return; }
            // REST says the key and model are fine, so the browser socket refused the key itself:
            // try once more with a short-lived key made just for this call
            if (!usedSecret && openSocket === browserSocket) { mintSecret(model).then((s) => open(s, true), done); return; }
            const e = new Error(ev?.reason || why || 'network error');
            e.code = ev?.code;
            done(e);
          });
        };
      };
      open(apiKey, false);
    });
  }

  function genJSON(models, prompt, { maxOutputTokens = 2048 } = {}) {
    return genJSONWith(async (model, jsonMode) => {
      // these are reasoning models: the token budget includes the thinking, and temperature is fixed
      const body = { model, messages: [{ role: 'user', content: prompt }], max_completion_tokens: Math.max(1024, maxOutputTokens * 2), reasoning_effort: 'low' };
      if (jsonMode) body.response_format = { type: 'json_object' };
      let j;
      try {
        j = await rest('/v1/chat/completions', { method: 'POST', body: JSON.stringify(body) });
      } catch (e) {
        if (!/reasoning_effort/i.test(errText(e))) throw e;
        delete body.reasoning_effort;
        j = await rest('/v1/chat/completions', { method: 'POST', body: JSON.stringify(body) });
      }
      return j.choices?.[0]?.message?.content || '';
    }, models, prompt);
  }

  async function validate() {
    try {
      await rest('/v1/models');
    } catch (e) {
      // a restricted key may not be allowed to list models; the test call below still tells us if it works
      if (!(e.status === 403 && /scope|permission/i.test(e.message))) return { ok: false, kind: classifyError(e), detail: errText(e).slice(0, 300) };
    }
    // the key is real; a tiny text call also shows whether the account has credit (new accounts start with none)
    try {
      await genJSON(PROVIDER_MODELS.openai.checkModels, 'Reply with this JSON: {"ok":true}', { maxOutputTokens: 64 });
    } catch (e) {
      const kind = classifyError(e);
      if (kind === 'billing' || kind === 'badkey' || kind === 'region') return { ok: false, kind, detail: errText(e).slice(0, 300) };
    }
    return { ok: true };
  }

  return { connectLive, genJSON, validate };
}
