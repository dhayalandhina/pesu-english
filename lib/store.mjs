// Local data on this computer: API key/config (private file) + learner progress/memory + call transcripts.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { migrateData, migrateConfig, resetProgress } from '../public/core/state.js';

export { dkey, addDays } from '../public/core/util.js';

export function resolveDataDir(argDir) {
  if (argDir) return path.resolve(argDir);
  if (process.env.PESU_DATA_DIR) return path.resolve(process.env.PESU_DATA_DIR);
  const home = os.homedir();
  if (process.platform === 'darwin') return path.join(home, 'Library', 'Application Support', 'Pesu English');
  if (process.platform === 'win32') return path.join(process.env.APPDATA || path.join(home, 'AppData', 'Roaming'), 'Pesu English');
  return path.join(process.env.XDG_CONFIG_HOME || path.join(home, '.config'), 'pesu-english');
}

export class Store {
  constructor(dir) {
    this.dir = dir;
    this.sessionsDir = path.join(dir, 'sessions');
    fs.mkdirSync(this.sessionsDir, { recursive: true });
    this.cfgFile = path.join(dir, 'config.json');
    this.dataFile = path.join(dir, 'pesu-data.json');
    this.instanceFile = path.join(dir, 'instance.json');
    this.logFile = path.join(dir, 'server.log');
    this.cfg = migrateConfig(this.#read(this.cfgFile, {}));
    this.data = migrateData(this.#read(this.dataFile, null));
  }

  #read(file, fallback) {
    try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
  }

  #write(file, obj, mode) {
    const tmp = `${file}.tmp-${process.pid}`;
    fs.writeFileSync(tmp, JSON.stringify(obj, null, 2), { mode: mode || 0o644 });
    fs.renameSync(tmp, file);
    if (mode) { try { fs.chmodSync(file, mode); } catch { /* best effort */ } }
  }

  saveConfig() { this.#write(this.cfgFile, this.cfg, 0o600); }
  save() { this.#write(this.dataFile, this.data); }

  saveSessionFile(id, rec) {
    try { this.#write(path.join(this.sessionsDir, `${id}.json`), rec); } catch { /* best effort */ }
  }

  resetProgress() {
    this.data = resetProgress(this.data);
    this.save();
  }

  readInstance() { return this.#read(this.instanceFile, null); }
  writeInstance(obj) { this.#write(this.instanceFile, obj); }
  clearInstance(pid) {
    try {
      const cur = this.readInstance();
      if (!cur || cur.pid === pid) fs.unlinkSync(this.instanceFile);
    } catch { /* gone already */ }
  }
}
