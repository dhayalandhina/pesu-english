// Local-server host for a tutoring call: Gemini Live via the official SDK, audio to/from the app window.
import { TutorBridge } from '../public/core/bridge.js';
import { genJSON } from './textai.mjs';

export function createServerBridge({ ai, store, ws, params, log, onFinished }) {
  return new TutorBridge({
    params,
    log,
    onFinished,
    store: {
      get data() { return store.data; },
      get cfg() { return store.cfg; },
      save: () => store.save(),
      saveSession: (id, rec) => store.saveSessionFile(id, rec),
    },
    connectLive: (model, config, cb) => ai.live.connect({
      model,
      config,
      callbacks: {
        onopen: () => {},
        onmessage: cb.onmessage,
        onerror: (e) => log('upstream error:', e?.message || e?.error?.message || ''),
        onclose: cb.onclose,
      },
    }),
    genJSON: (models, prompt, opts) => genJSON(ai, models, prompt, opts),
    out: {
      json: (obj) => { if (ws.readyState === 1) ws.send(JSON.stringify(obj)); },
      audio: (b64) => { if (ws.readyState === 1) ws.send(Buffer.from(b64, 'base64'), { binary: true }); },
      close: () => { try { ws.close(1000, 'done'); } catch { /* ignore */ } },
    },
  });
}
