// Offline stand-in for the Gemini API, used only for testing the app end to end:
//  - REST: models.list and generateContent (correction cards + end-of-call report)
//  - WebSocket: Live API (setup, kickoff, voice-activity on incoming audio, transcripts,
//    24 kHz audio replies, barge-in "interrupted", goAway + session resumption)
import http from 'node:http';
import { WebSocketServer } from 'ws';

const PORT = Number(process.env.MOCK_PORT || 9911);
const FAIL_FIRST = process.env.MOCK_FAIL_FIRST_MODEL === '1';
const GOAWAY_AFTER = Number(process.env.MOCK_GOAWAY_AFTER || 0);
const log = (...a) => console.log('[mock]', ...a);
const stats = { setups: [], resumes: 0, audioChunks: 0, maxRms: 0, utterances: 0, interrupts: 0, texts: [], checks: 0, summaries: 0 };

function tone(seconds, f0 = 210) {
  const rate = 24000;
  const n = Math.round(seconds * rate);
  const pcm = new Int16Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / rate;
    const syll = 0.55 + 0.45 * Math.sin(2 * Math.PI * 4.2 * t);   // syllable rhythm for the lip-sync
    const env = Math.min(1, t * 20, (seconds - t) * 20) * syll;
    const v = (Math.sin(2 * Math.PI * f0 * t) * 0.6 + Math.sin(2 * Math.PI * f0 * 2 * t) * 0.25 + Math.sin(2 * Math.PI * f0 * 3 * t) * 0.15) * env * 0.35;
    pcm[i] = Math.round(v * 32767);
  }
  return Buffer.from(pcm.buffer);
}

function reply(json, obj) {
  const body = JSON.stringify(obj);
  json.writeHead(200, { 'Content-Type': 'application/json' });
  json.end(body);
}

const server = http.createServer((req, res) => {
  // the phone edition calls Gemini straight from the browser, so the mock must allow cross-origin calls
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'content-type, x-goog-api-key');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  const url = new URL(req.url.replace(/\/{2,}/g, '/'), `http://localhost:${PORT}`);
  const key = req.headers['x-goog-api-key'] || url.searchParams.get('key') || '';
  if (url.pathname === '/__stats') { reply(res, stats); return; }
  if (key === 'BADKEY_aaaaaaaaaaaaaaaaaaaaaaaaaaaa') {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: { code: 400, message: 'API key not valid. Please pass a valid API key.', status: 'INVALID_ARGUMENT' } }));
    return;
  }
  if (req.method === 'GET' && /\/models$/.test(url.pathname)) {
    reply(res, { models: [{ name: 'models/gemini-3.8-live' }, { name: 'models/gemini-3.5-flash-lite' }, { name: 'models/gemini-3.8-flash' }] });
    return;
  }
  const m = url.pathname.match(/\/models\/([^/:]+):generateContent$/);
  if (req.method === 'POST' && m) {
    let body = '';
    req.on('data', (d) => { body += d; });
    req.on('end', () => {
      const j = JSON.parse(body || '{}');
      const prompt = JSON.stringify(j.contents || '');
      let out;
      if (prompt.includes('spoken sentences during a live practice call')) {
        stats.checks++;
        out = { items: [{ n: 1, said: 'Yesterday I go to market', better: 'Yesterday I went to the market.', tip: "Neththu nadandhadhu-ku 'went' (past)", kind: 'grammar' }] };
      } else if (prompt.includes('end-of-call report')) {
        stats.summaries++;
        out = {
          summary: 'Indraiku daily routine pathi pesineenga. Past tense konjam practice pannom.',
          didWell: ['Clear ah unga peru sonneenga', 'Teacher kelvikku full sentence-la pathil sonneenga'],
          fixThese: [{ said: 'Yesterday I go to market', better: 'Yesterday I went to the market.', tip: "Neththu = past, adhanaala 'went'" }],
          newWords: [{ word: 'every morning', meaning: 'dhinamum kaalaila' }, { word: 'usually', meaning: 'usual ah' }],
          nextTime: "'-ed' verbs innum practice pannunga.",
          facts: ['Goes to the market on weekends'],
          mistakePatterns: ["Uses present tense for past ('I go' for 'I went')", "Drops 'the' before places"],
          level: 'A1',
          lessonCovered: true,
          memoryNote: 'He went to the market yesterday; practise past tense next time.',
        };
      } else if (prompt.includes('The question to answer')) {
        stats.hints = (stats.hints || 0) + 1;
        out = { qTa: 'இன்று எப்படி இருக்கீங்க?', qTg: 'Innaiku eppadi irukkeenga?', answer: 'I am fine, thank you.', ta: 'நான் நல்லா இருக்கேன், நன்றி.', tg: 'Naan nalla irukken, nandri.' };
      } else if (prompt.includes('Translate this English sentence')) {
        stats.meanings = (stats.meanings || 0) + 1;
        out = { meaning: /market/.test(prompt.split('Sentence:')[1] || '') ? 'Neththu naan market-ku ponen.' : 'Vanakkam, naan Dinesh.', words: [{ w: 'market', ta: 'சந்தை', tg: 'sandhai' }, { w: 'yesterday', ta: 'நேற்று', tg: 'neththu' }] };
      } else out = { ok: true };
      reply(res, { candidates: [{ content: { role: 'model', parts: [{ text: JSON.stringify(out) }] }, finishReason: 'STOP' }], usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 10 } });
    });
    return;
  }
  res.writeHead(404);
  res.end('{}');
});

const wss = new WebSocketServer({ noServer: true });
server.on('upgrade', (req, socket, head) => {
  if (!req.url.includes('BidiGenerateContent')) { socket.destroy(); return; }
  wss.handleUpgrade(req, socket, head, (ws) => onLive(ws));
});

function onLive(ws) {
  let speaking = false;       // tutor talking
  let streamTimer = null;
  let userSpeechMs = 0;
  let silenceMs = 0;
  let inSpeech = false;
  let turns = 0;
  let starts = 0;
  let gate = true;
  const send = (o) => { if (ws.readyState === 1) ws.send(JSON.stringify(o)); };

  function stopStream() { clearInterval(streamTimer); streamTimer = null; speaking = false; }

  function tutorSays(text) {
    stopStream();
    speaking = true;
    starts++;
    // goAway a moment into the Nth answer (answers can get cut by barge-in, so don't wait for one to finish)
    if (GOAWAY_AFTER && starts === GOAWAY_AFTER) setTimeout(() => { log('sending goAway'); send({ goAway: { timeLeft: '5s' } }); }, 1500);
    const audio = tone(1.4 + text.length / 60);
    const words = text.split(' ');
    const chunk = 2400 * 2; // 100 ms
    let off = 0;
    let wi = 0;
    streamTimer = setInterval(() => {
      if (off >= audio.length) {
        if (wi < words.length) send({ serverContent: { outputTranscription: { text: ` ${words.slice(wi).join(' ')}` } } });
        send({ serverContent: { generationComplete: true } });
        send({ serverContent: { turnComplete: true } });
        stopStream();
        turns++;
        gate = false;
        return;
      }
      const part = audio.subarray(off, off + chunk);
      off += chunk;
      send({ serverContent: { modelTurn: { parts: [{ inlineData: { mimeType: 'audio/pcm;rate=24000', data: part.toString('base64') } }] } } });
      if (wi < words.length && off % (chunk * 2) === 0) { send({ serverContent: { outputTranscription: { text: ` ${words[wi]}` } } }); wi++; }
    }, 95); // about real time, so his next sentence can overlap the answer (barge-in)
  }

  function userUtteranceDone() {
    stats.utterances++;
    send({ serverContent: { inputTranscription: { text: 'Yesterday I go' } } });
    send({ serverContent: { inputTranscription: { text: ' to market' } } });
    setTimeout(() => tutorSays('Repeat after me: Yesterday I went to the market. Oh, you went there yesterday?'), 300);
  }

  ws.on('message', (raw) => {
    let m;
    try { m = JSON.parse(String(raw)); } catch { return; }
    if (m.setup) {
      const model = String(m.setup.model || '');
      stats.setups.push({ model, hasSystem: !!m.setup.systemInstruction, system: JSON.stringify(m.setup.systemInstruction || '').slice(0, 20000), voice: m.setup.generationConfig?.speechConfig?.voiceConfig?.prebuiltVoiceConfig?.voiceName, aad: m.setup.realtimeInputConfig?.automaticActivityDetection, handle: m.setup.sessionResumption?.handle || null, inT: !!m.setup.inputAudioTranscription, outT: !!m.setup.outputAudioTranscription, cwc: !!m.setup.contextWindowCompression });
      if (FAIL_FIRST && model.endsWith('gemini-3.8-live')) { log('rejecting model', model); ws.close(1008, `${model} is not found for API version v1beta`); return; }
      if (m.setup.sessionResumption?.handle) { stats.resumes++; gate = false; }
      send({ setupComplete: {} });
      send({ sessionResumptionUpdate: { newHandle: `handle-${Date.now()}`, resumable: true } });
      return;
    }
    if (m.clientContent) {
      const text = JSON.stringify(m.clientContent.turns || '');
      stats.texts.push(text.slice(0, 160));
      if (speaking) { stopStream(); send({ serverContent: { interrupted: true } }); }
      if (text.includes('call just connected')) tutorSays('Hi Dinesh! I am Priya. How are you today?');
      else tutorSays('Okay. Let me say it slowly. Yesterday I went to the market.');
      return;
    }
    const ri = m.realtimeInput;
    if (!ri) return;
    if (ri.text) {
      const text = String(ri.text);
      stats.texts.push(text.slice(0, 160));
      if (speaking) { stopStream(); send({ serverContent: { interrupted: true } }); }
      if (text.includes('call just connected')) tutorSays('Hi Dinesh! I am Priya. How are you today?');
      else tutorSays('Okay. Let me say it slowly. Yesterday I went to the market.');
      return;
    }
    if (ri.activityStart) { inSpeech = true; userSpeechMs = 0; if (speaking) { stats.interrupts++; stopStream(); send({ serverContent: { interrupted: true } }); } return; }
    if (ri.activityEnd) { inSpeech = false; userUtteranceDone(); return; }
    if (ri.audioStreamEnd) return;
    if (ri.audio && ri.audio.data) {
      stats.audioChunks++;
      if (gate) return; // let the greeting finish before listening (the fake mic talks from the first second)
      const buf = Buffer.from(ri.audio.data, 'base64');
      const pcm = new Int16Array(buf.buffer, buf.byteOffset, buf.length / 2);
      let s = 0;
      for (let i = 0; i < pcm.length; i++) { const v = pcm[i] / 32768; s += v * v; }
      const rms = Math.sqrt(s / Math.max(1, pcm.length));
      stats.maxRms = Math.max(stats.maxRms, rms);
      const ms = (pcm.length / 16000) * 1000;
      if (rms > 0.02) {
        userSpeechMs += ms; silenceMs = 0;
        if (!inSpeech && userSpeechMs >= 100) {
          inSpeech = true;
          if (speaking) { stats.interrupts++; stopStream(); send({ serverContent: { interrupted: true } }); }
        }
      } else if (inSpeech) {
        silenceMs += ms;
        if (silenceMs > 500) { inSpeech = false; userSpeechMs = 0; userUtteranceDone(); }
      } else {
        // syllables have short gaps: only a longer quiet resets the "starting to talk" count
        silenceMs += ms;
        if (silenceMs > 200) userSpeechMs = 0;
      }
    }
  });
  ws.on('close', () => stopStream());
}

server.listen(PORT, '127.0.0.1', () => log(`mock gemini on ${PORT}`));
