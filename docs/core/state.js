// Learner data model + the "state" the screens show. Shared by the server and the phone app.
import { dkey, addDays } from './util.js';

export const DEFAULT_MODELS = {
  // Voice-to-voice tutor. First one that works is used; the rest are fallbacks.
  liveModels: ['gemini-3.8-live', 'gemini-3.1-flash-live-preview', 'gemini-2.5-flash-native-audio-preview-12-2025'],
  // Fast text model for the live "better way to say it" cards.
  checkModels: ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-3.6-flash'],
  // End-of-call report + memory.
  summaryModels: ['gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-3.5-flash-lite'],
};

export function defaultSettings() {
  return {
    tutor: 'priya',        // priya | arun
    voice: '',             // empty = tutor's default voice
    speed: 'normal',       // normal | slow
    patience: 'normal',    // fast | normal | slow  (how long the tutor waits when he pauses)
    audioMode: 'earphone', // earphone | speaker
    micMode: 'auto',       // auto (like a phone call) | ptt (hold to talk)
    tamilHelp: 'normal',   // more | normal | less
    captions: 'thanglish', // thanglish | tamil
    mirror: false,
  };
}

export function defaultData() {
  return {
    v: 1,
    onboarded: false,
    profile: { name: 'Dinesh', city: 'Coimbatore' },
    settings: defaultSettings(),
    progress: { daysDone: {}, activity: {}, totalMinutes: 0 },
    memory: { level: '', facts: [], mistakes: [], notes: [] },
    sessions: [],
    notebook: [],
  };
}

const isObj = (o) => o && typeof o === 'object' && !Array.isArray(o);

export function migrateData(d) {
  const base = defaultData();
  if (!isObj(d)) return base;
  const out = Object.assign(base, d);
  out.profile = Object.assign(defaultData().profile, isObj(d.profile) ? d.profile : {});
  out.settings = Object.assign(defaultSettings(), isObj(d.settings) ? d.settings : {});
  out.progress = Object.assign(defaultData().progress, isObj(d.progress) ? d.progress : {});
  if (!isObj(out.progress.daysDone)) out.progress.daysDone = {};
  if (!isObj(out.progress.activity)) out.progress.activity = {};
  out.memory = Object.assign(defaultData().memory, isObj(d.memory) ? d.memory : {});
  for (const k of ['facts', 'mistakes', 'notes']) if (!Array.isArray(out.memory[k])) out.memory[k] = [];
  if (!Array.isArray(out.sessions)) out.sessions = [];
  if (!Array.isArray(out.notebook)) out.notebook = [];
  return out;
}

export function migrateConfig(c) {
  const cfg = Object.assign({ apiKey: '' }, DEFAULT_MODELS, isObj(c) ? c : {});
  for (const k of Object.keys(DEFAULT_MODELS)) {
    if (!Array.isArray(cfg[k]) || !cfg[k].length) cfg[k] = DEFAULT_MODELS[k].slice();
  }
  return cfg;
}

export function resetProgress(data) {
  return Object.assign(defaultData(), { profile: data.profile, settings: data.settings, onboarded: data.onboarded });
}

export function computeState(data, cfg, extra = {}) {
  const done = data.progress.daysDone || {};
  let currentDay = 30;
  for (let i = 1; i <= 30; i++) if (!done[i]) { currentDay = i; break; }
  const act = data.progress.activity || {};
  let k = dkey();
  if (!(act[k] > 0)) k = addDays(k, -1);
  let streak = 0;
  while (act[k] > 0) { streak++; k = addDays(k, -1); }
  const week = [];
  for (let i = 6; i >= 0; i--) { const dk = addDays(dkey(), -i); week.push({ date: dk, min: act[dk] || 0 }); }
  const key = cfg.apiKey || '';
  return {
    app: 'pesu-english',
    configured: !!key, keyHint: key ? `…${key.slice(-4)}` : '',
    onboarded: !!data.onboarded, profile: data.profile, settings: data.settings,
    progress: { daysDone: done, currentDay, allDone: Object.keys(done).length >= 30, streak, todayMinutes: act[dkey()] || 0, week, totalMinutes: data.progress.totalMinutes || 0, sessionsCount: data.sessions.length },
    memory: { level: data.memory.level, facts: data.memory.facts.slice(0, 12), mistakes: data.memory.mistakes },
    sessions: data.sessions.slice(0, 25),
    notebook: data.notebook.slice(0, 80),
    liveModel: cfg.liveModels[0],
    ...extra,
  };
}

const SETTINGS_ALLOWED = {
  tutor: ['priya', 'arun'], speed: ['normal', 'slow'], patience: ['fast', 'normal', 'slow'], audioMode: ['earphone', 'speaker'],
  micMode: ['auto', 'ptt'], tamilHelp: ['more', 'normal', 'less'], captions: ['thanglish', 'tamil'],
};
const VOICES = ['', 'Sulafat', 'Vindemiatrix', 'Achernar', 'Aoede', 'Kore', 'Leda', 'Achird', 'Umbriel', 'Iapetus', 'Puck', 'Charon', 'Algieba'];
const cleanName = (v, fb) => String(v || '').replace(/[^\p{L} .'-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 30) || fb;

export function applySettingsPatch(data, body) {
  if (!isObj(body)) return;
  if (isObj(body.profile)) {
    data.profile.name = cleanName(body.profile.name, data.profile.name || 'Dinesh');
    data.profile.city = cleanName(body.profile.city, data.profile.city || 'Coimbatore');
  }
  if (isObj(body.settings)) {
    for (const [k, allowed] of Object.entries(SETTINGS_ALLOWED)) {
      if (allowed.includes(body.settings[k])) data.settings[k] = body.settings[k];
    }
    if (VOICES.includes(body.settings.voice)) data.settings.voice = body.settings.voice;
    if (typeof body.settings.mirror === 'boolean') data.settings.mirror = body.settings.mirror;
  }
  if (body.onboarded === true) data.onboarded = true;
}
