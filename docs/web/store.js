// Phone/browser edition: progress, memory and the API key are kept in this browser only.
import { migrateData, migrateConfig } from '../core/state.js';

const DK = 'pesu-data-v1';
const CK = 'pesu-config-v1';
const SK = 'pesu-session-';

function read(k) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } }
function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } }

export class WebStore {
  constructor() {
    const raw = read(DK);
    this.data = migrateData(raw);
    this.cfg = migrateConfig(read(CK) || {});
    this.persistent = write('pesu-probe', 1);
    try { localStorage.removeItem('pesu-probe'); } catch { /* ignore */ }
    if (!raw) {
      // phones are usually used on the loudspeaker; computers with earphones
      const coarse = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
      this.data.settings.audioMode = coarse ? 'speaker' : 'earphone';
    }
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
  }

  save() { write(DK, this.data); }
  saveConfig() { write(CK, this.cfg); }

  saveSession(id, rec) {
    if (!write(SK + id, rec)) return;
    try {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith(SK)).sort();
      for (const k of keys.slice(0, Math.max(0, keys.length - 10))) localStorage.removeItem(k);
    } catch { /* ignore */ }
  }
}
