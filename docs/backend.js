// Where the app's data and calls live:
//  - "server": the Mac/PC app (local server keeps the key and data on the computer)
//  - "web":    the phone edition hosted as a static site (key and data stay in this browser)
import { computeState, applySettingsPatch, resetProgress, migrateData } from './core/state.js';

const isWeb = document.querySelector('meta[name="pesu-mode"]')?.content === 'web';

async function post(path, body) {
  const r = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) });
  return r.json();
}

const serverBackend = {
  mode: 'server',
  state: () => fetch('api/state').then((r) => r.json()),
  saveKey: (apiKey) => post('api/key', { apiKey }),
  saveSettings: (patch) => post('api/settings', patch),
  reset: () => post('api/reset', {}),
  exportData: async () => (await post('api/export', {})).data,
  importData: (data) => post('api/import', { data }),
  liveSocket: (query) => {
    const u = new URL(`ws/live?${query}`, location.href);
    u.protocol = u.protocol === 'https:' ? 'wss:' : 'ws:';
    return new WebSocket(u.href);
  },
};

function webBackend() {
  let store = null;
  let mods = null;
  const load = async () => {
    if (!mods) {
      const [s, g, k] = await Promise.all([import('./web/store.js'), import('./web/gemini.js'), import('./web/socket.js')]);
      mods = { WebStore: s.WebStore, makeGemini: g.makeGemini, DEFAULT_BASE: g.DEFAULT_BASE, DirectSocket: k.DirectSocket };
      store = new mods.WebStore();
    }
    return mods;
  };
  const baseUrl = () => { try { return localStorage.getItem('pesu-base-url') || null; } catch { return null; } };
  const gem = (key) => mods.makeGemini(key, baseUrl() || mods.DEFAULT_BASE);
  const state = () => computeState(store.data, store.cfg, { mode: 'web', persistent: store.persistent });
  return {
    mode: 'web',
    state: async () => { await load(); return state(); },
    saveKey: async (apiKey) => {
      await load();
      const key = String(apiKey || '').trim();
      if (!/^[A-Za-z0-9_\-.]{20,200}$/.test(key)) return { ok: false, kind: 'format' };
      const v = await gem(key).validate();
      if (!v.ok) return v;
      store.cfg.apiKey = key;
      store.saveConfig();
      return { ok: true, state: state() };
    },
    saveSettings: async (patch) => { await load(); applySettingsPatch(store.data, patch); store.save(); return { ok: true, state: state() }; },
    reset: async () => { await load(); store.data = resetProgress(store.data); store.save(); return { ok: true, state: state() }; },
    exportData: async () => { await load(); return store.data; },
    importData: async (data) => {
      await load();
      if (!data || typeof data !== 'object' || !data.progress) return { ok: false };
      store.data = migrateData(data);
      store.save();
      return { ok: true, state: state() };
    },
    keyLink: async () => { await load(); return store.cfg.apiKey ? `${location.origin}${location.pathname}#k=${encodeURIComponent(store.cfg.apiKey)}` : ''; },
    liveSocket: (query) => {
      const q = new URLSearchParams(query);
      const params = { mode: q.get('mode') || 'free' };
      if (q.get('day')) params.day = Number(q.get('day'));
      if (q.get('scene')) params.scene = q.get('scene');
      return new mods.DirectSocket({ params, store, gemini: gem(store.cfg.apiKey) });
    },
  };
}

export const backend = isWeb ? webBackend() : serverBackend;
