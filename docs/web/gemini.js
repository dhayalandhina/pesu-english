// Phone/browser edition: talk to Gemini directly from the page (no server). The API key never leaves
// this device except to Google. Live API over a raw WebSocket; text model over REST.
import { genJSONWith, classifyError, errText } from '../core/util.js';

export const DEFAULT_BASE = 'https://generativelanguage.googleapis.com';

function toSetup(model, cfg) {
  const setup = {
    model: model.startsWith('models/') ? model : `models/${model}`,
    generationConfig: { responseModalities: cfg.responseModalities || ['AUDIO'] },
  };
  if (cfg.speechConfig) setup.generationConfig.speechConfig = cfg.speechConfig;
  if (cfg.systemInstruction) setup.systemInstruction = { parts: [{ text: String(cfg.systemInstruction) }] };
  for (const k of ['inputAudioTranscription', 'outputAudioTranscription', 'realtimeInputConfig', 'contextWindowCompression', 'sessionResumption']) {
    if (cfg[k]) setup[k] = cfg[k];
  }
  return { setup };
}

export function makeGemini(apiKey, baseUrl = DEFAULT_BASE) {
  const base = baseUrl.replace(/\/+$/, '');
  const wsBase = base.replace(/^http/, 'ws');

  function connectLive(model, config, cb) {
    return new Promise((resolve, reject) => {
      let ready = false;
      let ws;
      try {
        ws = new WebSocket(`${wsBase}/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${encodeURIComponent(apiKey)}`);
      } catch (e) { reject(e); return; }
      ws.binaryType = 'arraybuffer';
      const dec = new TextDecoder();
      const session = {
        sendRealtimeInput: (o) => { if (ws.readyState === 1) ws.send(JSON.stringify({ realtimeInput: o })); },
        sendClientContent: ({ turns, turnComplete = true }) => { if (ws.readyState === 1) ws.send(JSON.stringify({ clientContent: { turns, turnComplete } })); },
        close: () => { try { ws.close(1000); } catch { /* ignore */ } },
      };
      const handle = (text) => {
        let msg;
        try { msg = JSON.parse(text); } catch { return; }
        if (!ready && msg.setupComplete) { ready = true; resolve(session); return; }
        cb.onmessage(msg);
      };
      ws.onopen = () => ws.send(JSON.stringify(toSetup(model, config)));
      ws.onmessage = (ev) => {
        const d = ev.data;
        if (typeof d === 'string') handle(d);
        else if (d instanceof ArrayBuffer) handle(dec.decode(d));
        else if (d && typeof d.text === 'function') d.text().then(handle);
      };
      ws.onerror = () => {};
      ws.onclose = (ev) => {
        if (!ready) {
          const e = new Error(ev.reason || (ev.code === 1006 ? 'network error' : `closed (${ev.code})`));
          e.code = ev.code;
          e.reason = ev.reason;
          reject(e);
          return;
        }
        cb.onclose({ code: ev.code, reason: ev.reason });
      };
    });
  }

  async function rest(path, init = {}) {
    let r;
    try {
      r = await fetch(`${base}${path}`, { ...init, headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey, ...(init.headers || {}) } });
    } catch (e) {
      const err = new Error(`network: ${e?.message || 'Failed to fetch'}`);
      throw err;
    }
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      const err = new Error(j?.error?.message || `HTTP ${r.status}`);
      err.status = j?.error?.status || r.status;
      throw err;
    }
    return j;
  }

  function genJSON(models, prompt, { temperature = 0.3, maxOutputTokens = 2048 } = {}) {
    return genJSONWith(async (model, jsonMode) => {
      const body = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature, maxOutputTokens, ...(jsonMode ? { responseMimeType: 'application/json' } : {}) },
      };
      const j = await rest(`/v1beta/models/${encodeURIComponent(model)}:generateContent`, { method: 'POST', body: JSON.stringify(body) });
      return (j.candidates?.[0]?.content?.parts || []).filter((p) => !p.thought).map((p) => p.text || '').join('');
    }, models, prompt);
  }

  async function validate() {
    try {
      await rest('/v1beta/models?pageSize=50');
      return { ok: true };
    } catch (e) {
      return { ok: false, kind: classifyError(e), detail: errText(e).slice(0, 300) };
    }
  }

  return { connectLive, genJSON, validate };
}
