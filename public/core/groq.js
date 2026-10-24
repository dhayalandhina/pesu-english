// Groq edition of the tutor (free tier friendly). Groq has no voice-to-voice model, so a call is a pipeline:
//   his voice -> voice detection here -> Whisper (text) -> gpt-oss / Qwen (answer) -> the device's own voice
// connectLive() returns the same session shape as Gemini/OpenAI and emits the same bridge messages,
// plus { serverContent: { localSpeech: { text } } } for the call screen to speak with speechSynthesis.
import { genJSONWith, classifyError, errText } from './util.js';

export const GROQ_BASE = 'https://api.groq.com';
const STT_MODELS = ['whisper-large-v3-turbo', 'whisper-large-v3'];
const RATE = 16000;            // mic audio from the call screen (16 kHz PCM16)
const FRAME_MS = 50;
const PREROLL_FRAMES = 6;      // keep ~300 ms before speech starts
const MAX_UTTER_MS = 30000;
const HISTORY = 20;            // messages sent with each answer (keeps the free token limit safe)

const VOICE_NOTES = `

VOICE CALL NOTES (important)
- Your words are read aloud by a text-to-speech voice, and you hear him only through speech recognition.
- Write only what you would say out loud: plain short sentences. No emojis, no markdown, no lists, no stage directions.
- Say only your own next turn, at most three short sentences, then stop and wait for him to answer.
  Never write his lines, never answer for him, never carry on the conversation by yourself.
- Don't use "..." or "…"; finish every sentence.
- When he should repeat something, write exactly that English sentence in double quotes, like: Repeat after me: "I live in Coimbatore." (his screen shows only the quoted sentence).
- When you speak Tamil, write it in Thanglish (Tamil words in English letters, like "Neenga nalla pesureenga"), never in Tamil script: the voice can only read English letters.
- You cannot hear his accent. If a recognized word looks odd for the context, it may be a pronunciation slip: gently say the right word and ask him to repeat it.`;

// Whisper sometimes "hears" these in noise or silence
const HALLUCINATION = /^(thank you( (so much|very much))?|thanks( for watching)?|you|bye|okay|subtitles by.*|\.+)[.!]?$/i;

function b64ToBytes(b64) {
  if (typeof atob === 'function') {
    const s = atob(b64);
    const u = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
    return u;
  }
  return new Uint8Array(Buffer.from(b64, 'base64'));
}

function wav16k(frames) {
  let n = 0;
  for (const f of frames) n += f.length;
  const buf = new ArrayBuffer(44 + n * 2);
  const v = new DataView(buf);
  const str = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  str(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); str(8, 'WAVE'); str(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, RATE, true);
  v.setUint32(28, RATE * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); str(36, 'data'); v.setUint32(40, n * 2, true);
  let o = 44;
  for (const f of frames) for (let i = 0; i < f.length; i++, o += 2) v.setInt16(o, f[i], true);
  return buf;
}

function forSpeech(text) {
  return String(text || '')
    .replace(/\[[^\]]*\]|\([^)]*(laugh|smile|pause|sigh)[^)]*\)/gi, ' ')
    .replace(/[*_#`>~|]/g, ' ')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function sentences(text) {
  const out = [];
  for (const part of text.match(/[^.!?]+[.!?]*["'\u2019\u201D)\]]*\s*/g) || []) {
    const s = part.trim();
    if (!s) continue;
    if (out.length && (out[out.length - 1].length < 25 || s.length < 8)) out[out.length - 1] += ` ${s}`;
    else out.push(s);
  }
  return out;
}

// model-specific switches: keep thinking short (it's a live conversation) and out of the reply text
function modelParams(model, effort = 'low') {
  if (/gpt-oss/.test(model)) return { reasoning_effort: effort, include_reasoning: false };
  if (/qwen/.test(model)) return { reasoning_effort: 'none' };
  return {};
}

export function makeGroq(apiKey, { baseUrl = GROQ_BASE } = {}) {
  const base = `${String(baseUrl || GROQ_BASE).replace(/\/+$/, '')}/openai/v1`;
  const cooling = new Map();   // model -> time it can be used again (free-tier per-minute limits)

  async function rest(path, init = {}) {
    let r;
    try {
      r = await fetch(`${base}${path}`, { ...init, headers: { Authorization: `Bearer ${apiKey}`, ...(init.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...(init.headers || {}) } });
    } catch (e) {
      if (e?.name === 'AbortError') throw e;
      throw new Error(`network: ${e?.message || 'Failed to fetch'}`);
    }
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      const err = new Error(j?.error?.message || `HTTP ${r.status}`);
      err.status = r.status;
      err.code = j?.error?.code || j?.error?.type || '';
      err.retryAfter = Number(r.headers.get('retry-after')) || 0;
      throw err;
    }
    return j;
  }

  async function chat(models, messages, { json = false, maxTokens = 700, signal, effort = 'low' } = {}) {
    let lastErr;
    const now = Date.now();
    const ready = models.filter((m) => !(cooling.get(m) > now));
    for (const model of ready.length ? ready : models) {
      // free-tier output caps: Qwen allows 1000 output tokens a minute, so never ask for more than that
      const body = { model, messages, max_completion_tokens: Math.min(maxTokens, /qwen/.test(model) ? 1000 : 4096), ...modelParams(model, effort) };
      if (json) body.response_format = { type: 'json_object' };
      try {
        let j;
        try {
          j = await rest('/chat/completions', { method: 'POST', body: JSON.stringify(body), signal });
        } catch (e) {
          if (e.status !== 400 || !/reasoning|include_reasoning/i.test(e.message)) throw e;
          delete body.reasoning_effort; delete body.include_reasoning;
          j = await rest('/chat/completions', { method: 'POST', body: JSON.stringify(body), signal });
        }
        return { model, text: j.choices?.[0]?.message?.content || '' };
      } catch (e) {
        if (e?.name === 'AbortError') throw e;
        lastErr = e;
        const kind = classifyError(e);
        if (kind === 'quota') { cooling.set(model, Date.now() + (e.retryAfter || 30) * 1000); continue; }
        if (kind === 'model') continue;
        throw e;
      }
    }
    throw lastErr || new Error('no model');
  }

  async function transcribe(wav, signal) {
    let lastErr;
    for (const model of STT_MODELS) {
      const fd = new FormData();
      fd.append('file', new Blob([wav], { type: 'audio/wav' }), 'speech.wav');
      fd.append('model', model);
      fd.append('response_format', 'json');
      fd.append('temperature', '0');
      fd.append('prompt', 'An Indian learner speaking simple English, sometimes Tamil words.');
      try {
        const j = await rest('/audio/transcriptions', { method: 'POST', body: fd, signal });
        return String(j.text || '').trim();
      } catch (e) {
        if (e?.name === 'AbortError') throw e;
        lastErr = e;
        if (!['model', 'quota'].includes(classifyError(e))) throw e;
      }
    }
    throw lastErr;
  }

  function connectLive(model, config, cb) {
    const c = config || {};
    const models = [model, ...(c.fallbackModels || [])].filter((m, i, a) => m && a.indexOf(m) === i);
    const system = (c.instructions || '') + VOICE_NOTES;
    const history = [];
    let closed = false;
    let gen = 0;
    let abort = null;
    let queue = Promise.resolve();
    // voice detection
    let floor = 0;
    let inSpeech = false;
    let voiced = 0;
    let quiet = 0;
    let silence = 0;
    let voicedTotal = 0;
    let frames = [];
    let pre = [];
    let held = false;                     // push-to-talk button down

    const emit = (m) => { if (!closed) cb.onmessage(m); };
    const fatal = (e) => {
      if (closed) return;
      closed = true;
      cb.onclose({ code: 4000, reason: [e.code, e.message].filter(Boolean).join(': '), fatal: true });
    };
    // a new turn from him: drop an answer that is still being written (the call screen stops the voice itself)
    function stopTutor() {
      gen++;
      if (abort) { abort.abort(); abort = null; }
    }

    async function respond() {
      const my = ++gen;
      if (abort) abort.abort();
      const ac = new AbortController();
      abort = ac;
      let res;
      try {
        res = await chat(models, [{ role: 'system', content: system }, ...history.slice(-HISTORY)], { signal: ac.signal });
      } catch (e) {
        if (ac.signal.aborted || my !== gen) return;
        const kind = classifyError(e);
        if (['badkey', 'quota', 'region', 'billing'].includes(kind)) fatal(e);
        return;
      }
      if (my !== gen || closed) return;
      // one short turn: no "…" pauses, and never more than 4 sentences (models sometimes play both sides)
      const parts = sentences(forSpeech(res.text).replace(/\s*(\.{3,}|\u2026)\s*/g, '. ').replace(/^[.\s]+/, '')).slice(0, 4);
      const text = parts.join(' ').trim();
      if (!text) return;
      history.push({ role: 'assistant', content: text });
      for (const s of parts) emit({ serverContent: { localSpeech: { text: s } } });
      emit({ serverContent: { turnComplete: true } });
    }

    function heard(text, at) {
      emit({ serverContent: { inputTranscription: { text, finished: true, at } } });
      history.push({ role: 'user', content: text });
    }

    const unanswered = () => history.length > 0 && history[history.length - 1].role === 'user';

    function utterance(chunks, voicedMs, at) {
      if (voicedMs < 300) {         // a cough or a click: if that cut off an answer, answer anyway
        if (unanswered()) queue = queue.then(respond).catch(() => {});
        return;
      }
      const wav = wav16k(chunks);
      queue = queue.then(async () => {
        if (closed) return;
        let text = '';
        try { text = await transcribe(wav); } catch (e) {
          const kind = classifyError(e);
          if (['badkey', 'region'].includes(kind)) fatal(e);
        }
        if (!text || (voicedMs < 1200 && HALLUCINATION.test(text))) {
          if (unanswered()) await respond();
          return;
        }
        heard(text, at);
        await respond();
      }).catch(() => {});
    }

    function onAudio(b64) {
      const bytes = b64ToBytes(b64);
      const pcm = new Int16Array(bytes.buffer, bytes.byteOffset, bytes.length >> 1);
      let s = 0;
      for (let i = 0; i < pcm.length; i++) { const x = pcm[i] / 32768; s += x * x; }
      const rms = Math.sqrt(s / Math.max(1, pcm.length));
      const frame = new Int16Array(pcm);
      if (c.ptt) { if (held) { frames.push(frame); voicedTotal += rms > 0.01 ? FRAME_MS : 0; } return; }
      if (!inSpeech) {
        floor = floor ? floor * 0.95 + rms * 0.05 : rms;
        const thr = Math.max(0.012, Math.min(0.05, floor * 2.5));
        pre.push(frame);
        if (pre.length > PREROLL_FRAMES) pre.shift();
        if (rms > thr) { voiced += FRAME_MS; quiet = 0; } else { quiet += FRAME_MS; if (quiet > 200) voiced = 0; }
        if (voiced >= 150) {
          inSpeech = true;
          frames = pre.slice();
          pre = [];
          voicedTotal = voiced;
          silence = 0;
          stopTutor();                // he started talking: the tutor stops, like a real call
        }
        return;
      }
      frames.push(frame);
      const thr = Math.max(0.012, Math.min(0.05, floor * 2.5));
      if (rms > thr) { silence = 0; voicedTotal += FRAME_MS; } else silence += FRAME_MS;
      if (silence >= (c.silenceMs || 1200) || frames.length * FRAME_MS >= MAX_UTTER_MS) {
        inSpeech = false;
        voiced = 0;
        quiet = 0;
        utterance(frames, voicedTotal, Date.now() - silence);
        frames = [];
      }
    }

    const session = {
      sendRealtimeInput: (o = {}) => {
        if (closed) return;
        if (o.audio && o.audio.data) onAudio(o.audio.data);
        else if (typeof o.text === 'string' && o.text) {
          const text = o.text;
          stopTutor();
          queue = queue.then(() => { history.push({ role: 'user', content: text }); return respond(); }).catch(() => {});
        } else if (o.activityStart) { stopTutor(); held = true; frames = []; voicedTotal = 0; }
        else if (o.activityEnd) {
          if (held) { held = false; utterance(frames, voicedTotal, Date.now()); frames = []; }
        }
      },
      sendClientContent: ({ turns } = {}) => session.sendRealtimeInput({ text: (turns || []).flatMap((t) => t.parts || []).map((p) => p.text || '').join(' ') }),
      close: () => { closed = true; gen++; if (abort) abort.abort(); },
    };
    // nothing to connect to: the "session" is ready at once (the first answer will show if the key works)
    return Promise.resolve(session);
  }

  function genJSON(models, prompt, { maxOutputTokens = 2048 } = {}) {
    // cards, meanings and the report are not live: let the model think a little more (the talk itself stays on 'low')
    return genJSONWith(async (model, jsonMode) => (await chat([model], [{ role: 'user', content: prompt }], { json: jsonMode, maxTokens: Math.max(1024, maxOutputTokens * 2), effort: 'medium' })).text, models, prompt);
  }

  async function validate() {
    try {
      await rest('/models');
      return { ok: true };
    } catch (e) {
      return { ok: false, kind: classifyError(e), detail: errText(e).slice(0, 300) };
    }
  }

  return { connectLive, genJSON, validate };
}
