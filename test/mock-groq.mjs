// Offline stand-in for the Groq API (OpenAI-compatible REST under /openai/v1), used only for tests:
// models, Whisper transcriptions (multipart WAV), chat completions (conversation, cards, report).
import http from 'node:http';

const PORT = Number(process.env.MOCK_PORT || 9941);
const log = (...a) => console.log('[mock-groq]', ...a);
const stats = { transcriptions: [], chats: [], texts: [] };
const send = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); };

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.pathname === '/__stats') { send(res, 200, stats); return; }
  const key = String(req.headers.authorization || '').replace(/^Bearer /, '');
  if (!key.startsWith('gsk_') || key.includes('bad')) { send(res, 401, { error: { message: 'Invalid API Key', type: 'invalid_request_error', code: 'invalid_api_key' } }); return; }
  if (req.method === 'GET' && url.pathname === '/openai/v1/models') { send(res, 200, { object: 'list', data: [{ id: 'openai/gpt-oss-120b' }, { id: 'whisper-large-v3-turbo' }] }); return; }
  const chunks = [];
  req.on('data', (d) => chunks.push(d));
  req.on('end', () => {
    const body = Buffer.concat(chunks);
    if (url.pathname === '/openai/v1/audio/transcriptions') {
      // multipart: find the WAV header to check the audio format the app sends
      const i = body.indexOf('RIFF');
      const rate = i >= 0 ? body.readUInt32LE(i + 24) : 0;
      const bits = i >= 0 ? body.readUInt16LE(i + 34) : 0;
      const model = (String(body).match(/name="model"\r\n\r\n([^\r]+)/) || [])[1];
      stats.transcriptions.push({ type: String(req.headers['content-type'] || '').split(';')[0], rate, bits, bytes: body.length, model });
      send(res, 200, { text: ' Yesterday I go to market.' });
      return;
    }
    if (url.pathname === '/openai/v1/chat/completions') {
      const j = JSON.parse(String(body) || '{}');
      const all = JSON.stringify(j.messages || '');
      stats.chats.push({ model: j.model, json: j.response_format?.type || null, reasoning_effort: j.reasoning_effort ?? null, include_reasoning: j.include_reasoning ?? null, messages: (j.messages || []).length, voiceNotes: all.includes('VOICE CALL NOTES'), puriyala: all.includes("didn't understand") });
      let content;
      if (all.includes('check a beginner English learner')) {
        content = JSON.stringify({ items: [{ n: 1, said: 'Yesterday I go to market', better: 'Yesterday I went to the market.', tip: "Neththu nadandhadhu-ku 'went' (past)", kind: 'grammar' }] });
      } else if (all.includes('end-of-call report')) {
        content = JSON.stringify({ summary: 'Indraiku past tense practice pannom.', didWell: ['Clear ah pesineenga'], fixThese: [{ said: 'Yesterday I go to market', better: 'Yesterday I went to the market.', tip: "Neththu = past, 'went'" }], newWords: [{ word: 'vegetables', meaning: 'kaaikari' }], nextTime: "'-ed' verbs practice.", facts: ['Goes to the market'], mistakePatterns: ['Present tense for past'], level: 'A1', lessonCovered: true, memoryNote: 'Past tense next time.' });
      } else if (all.includes('Translate this English sentence')) {
        content = JSON.stringify({ meaning: /market/.test(all.split('Sentence:')[1] || '') ? 'Neththu naan market-ku ponen.' : 'Vanakkam, naan Dinesh.' });
      } else {
        const last = (j.messages || []).filter((m) => m.role === 'user').at(-1)?.content || '';
        stats.texts.push(last.slice(0, 120));
        content = last.includes('call just connected') ? 'Hi Dinesh! I am Priya. Repeat after me: "Hi, I am Dinesh."'
          : last.includes("didn't understand") ? 'Okay. Let me say it slowly. Yesterday I went to the market.'
            : 'Oh, you went to the market yesterday? Repeat after me: "Yesterday I went to the market."';
      }
      send(res, 200, { id: 'x', object: 'chat.completion', model: j.model, choices: [{ index: 0, message: { role: 'assistant', content }, finish_reason: 'stop' }] });
      return;
    }
    send(res, 404, { error: { message: 'not found' } });
  });
}).listen(PORT, '127.0.0.1', () => log(`mock groq on ${PORT}`));
