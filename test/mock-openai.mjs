// Offline stand-in for the OpenAI API, used only for testing the app end to end:
//  - REST (CORS): models, chat completions (cards + report + key probe), realtime client secrets
//  - WebSocket /v1/realtime: session.update, text turns, server VAD on incoming 24 kHz audio,
//    late input transcription, streamed 24 kHz audio answers, cancel/truncate, dropped line
import http from 'node:http';
import { WebSocketServer } from 'ws';

const PORT = Number(process.env.MOCK_PORT || 9921);
const MISSING = process.env.MOCK_MISSING_MODEL || '';      // realtime model that "doesn't exist"
const DROP_AFTER = Number(process.env.MOCK_DROP_AFTER || 0); // close the socket after N answers (once)
const log = (...a) => console.log('[mock-openai]', ...a);
const stats = { connections: [], updates: [], texts: [], history: [], audioChunks: 0, chunkBytes: {}, maxRms: 0, interrupts: 0, truncates: [], cancels: 0, commits: 0, clears: 0, responses: 0, checks: 0, summaries: 0, probes: 0, chatBodies: [] };
let dropped = false;

function tone(seconds, f0 = 220) {
  const rate = 24000;
  const n = Math.round(seconds * rate);
  const pcm = new Int16Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / rate;
    const env = Math.min(1, t * 20, (seconds - t) * 20) * (0.55 + 0.45 * Math.sin(2 * Math.PI * 4.2 * t));
    pcm[i] = Math.round((Math.sin(2 * Math.PI * f0 * t) * 0.6 + Math.sin(4 * Math.PI * f0 * t) * 0.25) * env * 0.35 * 32767);
  }
  return Buffer.from(pcm.buffer);
}

const keyOf = (req) => {
  const auth = String(req.headers.authorization || '');
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  const proto = String(req.headers['sec-websocket-protocol'] || '').split(',').map((s) => s.trim()).find((s) => s.startsWith('openai-insecure-api-key.'));
  return proto ? proto.slice('openai-insecure-api-key.'.length) : '';
};
const send = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); };
const badKey = (res) => send(res, 401, { error: { message: 'Incorrect API key provided: sk-bad***. You can find your API key at https://platform.openai.com/account/api-keys.', type: 'invalid_request_error', param: null, code: 'invalid_api_key' } });
const noCredit = { message: 'You have no credits remaining. Add credits to continue using the API at https://platform.openai.com/settings/organization/billing/.', type: 'insufficient_quota', param: null, code: 'credit_balance_exhausted' };

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.pathname === '/__stats') { send(res, 200, stats); return; }
  const key = keyOf(req);
  if (!key.startsWith('sk-') || key.includes('bad')) { badKey(res); return; }
  if (req.method === 'GET' && url.pathname === '/v1/models') { send(res, 200, { object: 'list', data: [{ id: 'gpt-realtime-2.1-mini' }, { id: 'gpt-6-luna' }] }); return; }
  const mm = url.pathname.match(/^\/v1\/models\/(.+)$/);
  if (req.method === 'GET' && mm) {
    if (decodeURIComponent(mm[1]) === MISSING) send(res, 404, { error: { message: `The model \`${MISSING}\` does not exist or you do not have access to it.`, type: 'invalid_request_error', code: 'model_not_found' } });
    else send(res, 200, { id: decodeURIComponent(mm[1]), object: 'model' });
    return;
  }
  let body = '';
  req.on('data', (d) => { body += d; });
  req.on('end', () => {
    const j = (() => { try { return JSON.parse(body || '{}'); } catch { return {}; } })();
    if (req.method === 'POST' && url.pathname === '/v1/realtime/client_secrets') { send(res, 200, { value: 'ek_test_secret', expires_at: Math.floor(Date.now() / 1000) + 600, session: j.session || {} }); return; }
    if (req.method === 'POST' && url.pathname === '/v1/chat/completions') {
      if (key.includes('nocredit')) { send(res, 429, { error: noCredit }); return; }
      stats.chatBodies.push({ model: j.model, response_format: j.response_format?.type || null, reasoning_effort: j.reasoning_effort || null, max_completion_tokens: j.max_completion_tokens, temperature: j.temperature ?? null });
      const prompt = JSON.stringify(j.messages || '');
      let out;
      if (prompt.includes('check a beginner English learner')) {
        stats.checks++;
        out = { items: [{ n: 1, said: 'Yesterday I go to market', better: 'Yesterday I went to the market.', tip: "Neththu nadandhadhu-ku 'went' (past)", kind: 'grammar' }] };
      } else if (prompt.includes('end-of-call report')) {
        stats.summaries++;
        out = {
          summary: 'Indraiku daily routine pathi pesineenga. Past tense konjam practice pannom.',
          didWell: ['Clear ah unga peru sonneenga'],
          fixThese: [{ said: 'Yesterday I go to market', better: 'Yesterday I went to the market.', tip: "Neththu = past, adhanaala 'went'" }],
          newWords: [{ word: 'every morning', meaning: 'dhinamum kaalaila' }],
          nextTime: "'-ed' verbs innum practice pannunga.",
          facts: ['Goes to the market on weekends'],
          mistakePatterns: ["Uses present tense for past ('I go' for 'I went')"],
          level: 'A1',
          lessonCovered: true,
          memoryNote: 'Practise past tense next time.',
        };
      } else if (prompt.includes('The question to answer')) {
        stats.hints = (stats.hints || 0) + 1;
        out = { qTa: 'இன்று எப்படி இருக்கீங்க?', qTg: 'Innaiku eppadi irukkeenga?', answer: 'I am fine, thank you.', ta: 'நான் நல்லா இருக்கேன், நன்றி.', tg: 'Naan nalla irukken, nandri.' };
      } else if (prompt.includes('Translate this English sentence')) {
        stats.meanings = (stats.meanings || 0) + 1;
        out = { meaning: /market/.test(prompt.split('Sentence:')[1] || '') ? 'Neththu naan market-ku ponen.' : 'Vanakkam, naan Dinesh.', words: [{ w: 'market', ta: 'சந்தை', tg: 'sandhai' }, { w: 'yesterday', ta: 'நேற்று', tg: 'neththu' }] };
      } else { stats.probes++; out = { ok: true }; }
      send(res, 200, { id: 'chatcmpl-x', object: 'chat.completion', model: j.model, choices: [{ index: 0, message: { role: 'assistant', content: JSON.stringify(out) }, finish_reason: 'stop' }], usage: { prompt_tokens: 10, completion_tokens: 10 } });
      return;
    }
    send(res, 404, { error: { message: 'not found' } });
  });
});

const wss = new WebSocketServer({ noServer: true, handleProtocols: (protocols) => (protocols.has('realtime') ? 'realtime' : false) });
server.on('upgrade', (req, socket, head) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const key = keyOf(req);
  const model = url.searchParams.get('model') || '';
  const reject = (code, text) => { socket.write(`HTTP/1.1 ${code} ${text}\r\nContent-Type: application/json\r\nConnection: close\r\n\r\n{}`); socket.destroy(); };
  if (url.pathname !== '/v1/realtime') { reject(404, 'Not Found'); return; }
  if (!key.startsWith('sk-') && !key.startsWith('ek_')) { reject(401, 'Unauthorized'); return; }
  if (key.includes('bad')) { reject(401, 'Unauthorized'); return; }
  if (model === MISSING) { log('rejecting model', model); reject(404, 'Not Found'); return; }
  const via = req.headers.authorization ? 'header' : 'subprotocol';
  wss.handleUpgrade(req, socket, head, (ws) => onRealtime(ws, { model, via, key, origin: req.headers.origin || null }));
});

function onRealtime(ws, info) {
  const conn = { ...info, n: stats.connections.length + 1 };
  stats.connections.push(conn);
  const sendEv = (o) => { if (ws.readyState === 1) ws.send(JSON.stringify(o)); };
  let ids = 0;
  const id = (p) => `${p}_${conn.n}_${++ids}`;
  let session = {};
  let td = null;
  let resp = null;            // { id, timer, itemId }
  let lastUserText = '';
  let lastWasVoice = false;
  let inSpeech = false;
  let speechMs = 0;
  let silenceMs = 0;
  let bufMs = 0;
  let speechItem = null;
  let answers = 0;

  sendEv({ type: 'session.created', event_id: id('ev'), session: { type: 'realtime', model: info.model } });
  if (info.key.includes('nocredit')) { sendEv({ type: 'error', event_id: id('ev'), error: { ...noCredit, event_id: null } }); return; }

  function finish(status, reason) {
    if (!resp) return;
    clearInterval(resp.timer);
    const r = resp;
    resp = null;
    sendEv({ type: 'response.done', event_id: id('ev'), response: { id: r.id, object: 'realtime.response', status, status_details: status === 'completed' ? null : { type: status, reason }, usage: { total_tokens: 100 } } });
    if (status === 'completed') {
      answers++;
      if (DROP_AFTER && answers === DROP_AFTER && !dropped) { dropped = true; log('dropping the line'); setTimeout(() => ws.terminate(), 200); }
    }
  }

  function respond() {
    if (resp) { sendEv({ type: 'error', event_id: id('ev'), error: { type: 'invalid_request_error', code: 'conversation_already_has_active_response', message: 'Conversation already has an active response in progress.' } }); return; }
    stats.responses++;
    conn.responded = true;
    const text = lastWasVoice ? 'Oh, you went to the market yesterday? Repeat after me: “Yesterday I went to the market.”'
      : lastUserText.includes('call just connected') ? 'Hi Dinesh! I am Priya. How are you today?'
        : 'Okay. Let me say it slowly. Yesterday I went to the market.';
    lastWasVoice = false;
    const rid = id('resp');
    const itemId = id('item');
    sendEv({ type: 'response.created', event_id: id('ev'), response: { id: rid, object: 'realtime.response', status: 'in_progress' } });
    sendEv({ type: 'response.output_item.added', event_id: id('ev'), response_id: rid, output_index: 0, item: { id: itemId, type: 'message', role: 'assistant' } });
    const audio = tone(1.4 + text.length / 60);
    const words = text.split(' ');
    const chunk = 4800; // 100 ms
    let off = 0;
    let wi = 0;
    resp = { id: rid, itemId };
    resp.timer = setInterval(() => {
      if (off >= audio.length) {
        if (wi < words.length) sendEv({ type: 'response.output_audio_transcript.delta', event_id: id('ev'), response_id: rid, item_id: itemId, output_index: 0, content_index: 0, delta: ` ${words.slice(wi).join(' ')}` });
        sendEv({ type: 'response.output_audio.done', event_id: id('ev'), response_id: rid, item_id: itemId, output_index: 0, content_index: 0 });
        finish('completed');
        return;
      }
      const part = audio.subarray(off, off + chunk);
      off += chunk;
      sendEv({ type: 'response.output_audio.delta', event_id: id('ev'), response_id: rid, item_id: itemId, output_index: 0, content_index: 0, delta: part.toString('base64') });
      if (wi < words.length && off % (chunk * 2) === 0) { sendEv({ type: 'response.output_audio_transcript.delta', event_id: id('ev'), response_id: rid, item_id: itemId, output_index: 0, content_index: 0, delta: ` ${words[wi]}` }); wi++; }
    }, 40); // faster than real time, like the real API
  }

  function userTurnDone(itemId) {
    sendEv({ type: 'input_audio_buffer.committed', event_id: id('ev'), item_id: itemId, previous_item_id: null });
    // transcription comes a little after the answer has started, like the real thing
    setTimeout(() => sendEv({ type: 'conversation.item.input_audio_transcription.completed', event_id: id('ev'), item_id: itemId, content_index: 0, transcript: 'Yesterday I go to market', usage: { type: 'duration', seconds: 1 } }), 450);
    lastWasVoice = true;
  }

  ws.on('message', (raw) => {
    let m;
    try { m = JSON.parse(String(raw)); } catch { return; }
    switch (m.type) {
      case 'session.update': {
        const s = m.session || {};
        session = { ...session, ...s, audio: { input: { ...session.audio?.input, ...s.audio?.input }, output: { ...session.audio?.output, ...s.audio?.output } } };
        if (s.audio?.input && 'turn_detection' in s.audio.input) td = s.audio.input.turn_detection;
        stats.updates.push({ conn: conn.n, model: info.model, type: s.type, instructions: (s.instructions || '').length, modalities: s.output_modalities, format: s.audio?.input?.format, outFormat: s.audio?.output?.format, voice: s.audio?.output?.voice, speed: s.audio?.output?.speed ?? null, td: s.audio?.input?.turn_detection, transcription: s.audio?.input?.transcription, noise: s.audio?.input?.noise_reduction, reasoning: s.reasoning || null });
        sendEv({ type: 'session.updated', event_id: id('ev'), session });
        break;
      }
      case 'conversation.item.create': {
        const it = m.item || {};
        const text = (it.content || []).map((c) => c.text || '').join(' ');
        // on a reconnected line, items before the first answer are the replayed talk
        if (conn.n > 1 && !conn.responded) stats.history.push({ conn: conn.n, role: it.role, type: it.content?.[0]?.type, text: text.slice(0, 80) });
        else { stats.texts.push(text.slice(0, 160)); lastUserText = text; }
        sendEv({ type: 'conversation.item.added', event_id: id('ev'), item: { id: id('item'), ...it } });
        break;
      }
      case 'response.create':
        respond();
        break;
      case 'response.cancel':
        if (resp) { stats.cancels++; finish('cancelled', 'client_cancelled'); } else sendEv({ type: 'error', event_id: id('ev'), error: { type: 'invalid_request_error', code: 'response_cancel_not_active', message: 'Cancellation failed: no active response found', event_id: m.event_id || null } });
        break;
      case 'conversation.item.truncate':
        stats.truncates.push({ item: m.item_id, ms: m.audio_end_ms });
        sendEv({ type: 'conversation.item.truncated', event_id: id('ev'), item_id: m.item_id, content_index: 0, audio_end_ms: m.audio_end_ms });
        break;
      case 'input_audio_buffer.clear':
        stats.clears++;
        bufMs = 0;
        sendEv({ type: 'input_audio_buffer.cleared', event_id: id('ev') });
        break;
      case 'input_audio_buffer.commit':
        stats.commits++;
        if (bufMs < 100) { sendEv({ type: 'error', event_id: id('ev'), error: { type: 'invalid_request_error', code: 'input_audio_buffer_commit_empty', message: 'buffer too small' } }); break; }
        bufMs = 0;
        userTurnDone(id('item'));
        break;
      case 'input_audio_buffer.append': {
        stats.audioChunks++;
        const buf = Buffer.from(m.audio || '', 'base64');
        stats.chunkBytes[buf.length] = (stats.chunkBytes[buf.length] || 0) + 1;
        const pcm = new Int16Array(buf.buffer, buf.byteOffset, Math.floor(buf.length / 2));
        let s = 0;
        for (let i = 0; i < pcm.length; i++) { const v = pcm[i] / 32768; s += v * v; }
        const rms = Math.sqrt(s / Math.max(1, pcm.length));
        stats.maxRms = Math.max(stats.maxRms, rms);
        const ms = (pcm.length / 24000) * 1000;
        bufMs += ms;
        if (!td) break; // push-to-talk: no voice detection
        if (!answers && conn.n === 1) break; // let the greeting finish before listening (the fake mic talks from the first second)
        if (rms > 0.02) {
          speechMs += ms;
          silenceMs = 0;
          if (!inSpeech && speechMs >= 100) {
            inSpeech = true;
            speechItem = id('item');
            log(`conn ${conn.n}: speech started (responding=${!!resp})`);
            sendEv({ type: 'input_audio_buffer.speech_started', event_id: id('ev'), item_id: speechItem, audio_start_ms: 0 });
            if (resp) { stats.interrupts++; finish('cancelled', 'turn_detected'); }
          }
        } else if (inSpeech) {
          silenceMs += ms;
          if (silenceMs > 500) {
            inSpeech = false;
            speechMs = 0;
            log(`conn ${conn.n}: speech stopped`);
            sendEv({ type: 'input_audio_buffer.speech_stopped', event_id: id('ev'), item_id: speechItem, audio_end_ms: 0 });
            userTurnDone(speechItem);
            setTimeout(respond, 120);
          }
        } else {
          // syllables have short gaps: only a longer quiet resets the "starting to talk" count
          silenceMs += ms;
          if (silenceMs > 200) speechMs = 0;
        }
        break;
      }
      default:
        break;
    }
  });
  ws.on('close', () => { if (resp) clearInterval(resp.timer); });
}

server.listen(PORT, '127.0.0.1', () => log(`mock openai on ${PORT}`));
