// Pesu English: screens and wiring.
import { LESSONS, SCENES, TIPS, WEEKS } from './lessons.js';
import { Avatar } from './avatar.js';
import { Call } from './call.js';
import { toThanglish } from './translit.js';
import { backend } from './backend.js';

const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const lessonById = (id) => LESSONS.find((l) => l.id === Number(id));
const TUTOR = { priya: { name: 'Priya', title: 'Priya miss' }, arun: { name: 'Arun', title: 'Arun sir' } };
const VOICES = {
  priya: [['', 'Default (Warm)'], ['Vindemiatrix', 'Gentle'], ['Achernar', 'Soft'], ['Aoede', 'Breezy']],
  arun: [['', 'Default (Friendly)'], ['Umbriel', 'Easy-going'], ['Iapetus', 'Clear'], ['Algieba', 'Smooth']],
};
const ERR = {
  nokey: 'API key innum set pannala. Settings-la key podunga.',
  badkey: 'API key work aagala. Settings-la pudhu key podunga.',
  quota: 'Indraiya free limit mudinjiduchu. Konja neram kazhichu (illana naalaiku) thirumba try pannunga.',
  region: 'Indha Google service unga area-la allow aagala.',
  model: 'Voice model kidaikkala. App-a update pannanum.',
  offline: 'Internet connection illa pola. Wi-Fi check panni thirumba try pannunga.',
  timeout: 'Connect aaga romba neram aagudhu. Internet check panni thirumba try pannunga.',
  micdenied: 'Mic permission kidaikkala. Mela address bar-la mic icon-a click panni "Allow" pannunga. Mac-na: System Settings, Privacy & Security, Microphone-la Chrome-a ON pannunga.',
  nomic: 'Mic kandupidikka mudiyala. Earphone illana mic-a connect pannitu thirumba try pannunga.',
  dropped: 'App-oda connection cut aayiduchu. Thirumba try pannunga.',
  unknown: 'Edho problem aayiduchu. Thirumba try pannunga.',
};

let S = null;          // state from the local server
let screen = 'home';
let avatar = null;
let call = null;
let callCtx = null;
let lastReport = null;
let toastT = 0;
let roleOpen = false;
let resetAsk = false;

// ---------------- utils ----------------
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('show'), 3200);
}
const name = () => (S && S.profile && S.profile.name) || 'Dinesh';
const tutor = () => TUTOR[(S && S.settings && S.settings.tutor) || 'priya'] || TUTOR.priya;
const showText = (t) => (S && S.settings.captions === 'tamil' ? String(t || '') : toThanglish(t));
const fmtMin = (m) => (m < 1 ? '1 nimisham-ku kammi' : `${Math.round(m)} nimisham`);
const fmtMinShort = (m) => (m < 1 ? '<1 min' : `${Math.round(m)} min`);
const plainSay = (s) => String(s).replace(/[[\]]/g, '').replace(/\{name\}/g, name()).replace(/\{city\}/g, (S && S.profile.city) || 'Coimbatore');
const stressHTML = (s) => esc(plainSay(s.replace(/\[/g, '\u0001').replace(/\]/g, '\u0002'))).replace(/\u0001([^\u0002]*)\u0002/g, (m, p) => `<b class="st">${p.toUpperCase()}</b>`);

function speakLocal(text) {
  try {
    if (!('speechSynthesis' in window)) return false;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const vs = speechSynthesis.getVoices() || [];
    const v = vs.find((x) => /en[-_]IN/i.test(x.lang) && /google|natural|veena|rishi/i.test(x.name)) || vs.find((x) => /en[-_](US|GB|IN)/i.test(x.lang)) || null;
    if (v) u.voice = v;
    u.lang = v ? v.lang : 'en-US';
    u.rate = 0.88;
    speechSynthesis.speak(u);
    return true;
  } catch { return false; }
}

const IC = {
  mic: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
  micOff: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 9.3V6a3 3 0 0 0-5.7-1.3M9 9v2a3 3 0 0 0 4.9 2.3M5 11a7 7 0 0 0 11.3 5.5M19 11a7 7 0 0 1-.6 2.8M12 18v3M3 3l18 18"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5c0 8.3 6.7 15 15 15l1.5-3.5-4-2-2 2a11 11 0 0 1-5-5l2-2-2-4z"/></svg>',
  end: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 14c5-4.5 13-4.5 18 0l-2.4 2.6-3.4-1.3v-2.5a12 12 0 0 0-6.4 0v2.5L5.4 16.6z"/></svg>',
  cam: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/></svg>',
  speaker: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>',
  back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
  gear: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  chart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
  home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
  flame: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1 4 5 5.5 5 11a5 5 0 0 1-10 0c0-2.5 1.2-4 2.5-5 .2 1.8 1 3 2.5 3.2C11 8 11 5 12 2z"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
};

// ---------------- presence: keeps the local server alive while this window is open ----------------
let presenceFails = 0;
function presence() {
  let ws;
  try { ws = new WebSocket(`${location.origin.replace(/^http/, 'ws')}/ws/presence`); } catch { return; }
  ws.onopen = () => { presenceFails = 0; $('#offline')?.remove(); };
  ws.onclose = () => {
    presenceFails++;
    if (presenceFails >= 3 && !$('#offline')) {
      const d = document.createElement('div');
      d.id = 'offline';
      d.className = 'offline';
      d.textContent = 'Pesu English app background-la nirpaattiduchu. Indha window-a close panni, app-a thirumba open pannunga.';
      document.body.appendChild(d);
    }
    setTimeout(presence, 3000);
  };
  setInterval(() => { if (ws.readyState === 1) ws.send('1'); }, 30000);
}

// ---------------- shell ----------------
function topbar() {
  const p = S.progress;
  const nav = (k, label, icon) => `<button class="nav ${screen === k ? 'on' : ''}" data-act="go" data-to="${k}" aria-label="${label}">${icon}<span>${label}</span></button>`;
  return `<header class="top">
    <div class="brand"><span class="logo" aria-hidden="true"></span>Pesu English</div>
    <div class="chips">
      <span class="chip" title="Course day">Day <b class="num">${p.allDone ? 30 : p.currentDay}</b> of 30</span>
      <span class="chip ${p.streak ? 'hot' : ''}" title="Thodarndhu practice panna naatkal">${IC.flame}<b class="num">${p.streak}</b> naal</span>
    </div>
    <nav class="navs">${nav('home', 'Home', IC.home)}${nav('progress', 'Progress', IC.chart)}${nav('settings', 'Settings', IC.gear)}</nav>
  </header>`;
}

function mountAvatar(sel, state = 'idle') {
  if (avatar) { avatar.destroy(); avatar = null; }
  const host = $(sel);
  if (!host) return;
  avatar = new Avatar(host, (S.settings && S.settings.tutor) || 'priya');
  avatar.setState(state);
}

function render() {
  const app = $('#app');
  if (!S) { app.innerHTML = '<div class="loading">Loading…</div>'; return; }
  if (!S.configured && screen !== 'settings') screen = 'setup';
  else if (S.configured && !S.onboarded && screen !== 'settings' && screen !== 'call') screen = 'welcome';
  if (screen === 'call') return; // call screen manages itself
  if (avatar) { avatar.destroy(); avatar = null; }
  if (screen === 'setup') { app.innerHTML = viewSetup(); return; }
  if (screen === 'welcome') { app.innerHTML = viewWelcome(); mountAvatar('#wel-av'); return; }
  if (screen === 'report') { app.innerHTML = topbar() + viewReport(); return; }
  if (screen === 'progress') { app.innerHTML = topbar() + viewProgress(); return; }
  if (screen === 'settings') { app.innerHTML = topbar() + viewSettings(); return; }
  app.innerHTML = topbar() + viewHome();
  mountAvatar('#home-av');
}

function go(to) {
  screen = to;
  roleOpen = false;
  resetAsk = false;
  render();
  window.scrollTo(0, 0);
}

// ---------------- setup (one time, for Dhina) ----------------
function viewSetup() {
  return `<main class="narrow stack">
    <div class="brand big"><span class="logo" aria-hidden="true"></span>Pesu English</div>
    <section class="card stack">
      <div><span class="label">Oru thadava setup</span><h1>Free Gemini API key podunga</h1></div>
      <p class="muted">Teacher-oda voice-um moolaiyum Google Gemini Live. Adhukku oru free API key venum. Oru thadava pannaa podhum.</p>
      <ol class="steps">
        <li><a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">aistudio.google.com/apikey</a> open pannunga (Google account-la login).</li>
        <li><b>Create API key</b> click pannunga, key-a copy pannunga.</li>
        <li>Keezha paste panni <b>Save &amp; check</b> pannunga.</li>
      </ol>
      <label class="label" for="key-in">API key</label>
      <div class="row"><input id="key-in" type="password" autocomplete="off" spellcheck="false" placeholder="AIza…" class="grow"><button class="btn" data-act="savekey" id="key-btn">Save &amp; check</button></div>
      <p class="xs muted" id="key-msg"></p>
      <p class="xs muted">${S.mode === 'web' ? 'Key indha phone / browser-la mattum save aagum; Google-ku mattum dhaan pogum.' : `Key indha computer-la mattum save aagum (${esc(S.dataDir)}).`} Free plan-la, Google indha pechu data-va avanga service improve panna use pannalaam.</p>
    </section>
  </main>`;
}

function viewWelcome() {
  const st = S.settings;
  const tutorBtn = (k) => `<button class="tutor-pick ${st.tutor === k ? 'on' : ''}" data-act="pick-tutor" data-k="${k}"><b>${TUTOR[k].title}</b><span>${k === 'priya' ? 'Warm, patient' : 'Friendly, calm'}</span></button>`;
  return `<main class="narrow stack">
    <div class="brand big"><span class="logo" aria-hidden="true"></span>Pesu English</div>
    <section class="card welcome">
      <div class="wel-av tile" id="wel-av"></div>
      <div class="stack">
        <div><span class="label">Vanakkam!</span><h1>Ungalukkaana English teacher ready</h1></div>
        <p>Video call madhiri: neenga pesunga, teacher kettu pathil sollum, thappu-va sari pannum, puriyalana Tamil-la solli tharum.</p>
        <div class="row">
          <div class="grow"><label class="label" for="w-name">Unga peru</label><input id="w-name" type="text" value="${esc(S.profile.name)}" autocomplete="off"></div>
          <div class="grow"><label class="label" for="w-city">Ooru</label><input id="w-city" type="text" value="${esc(S.profile.city)}" autocomplete="off"></div>
        </div>
        <div><span class="label">Teacher</span><div class="row">${tutorBtn('priya')}${tutorBtn('arun')}</div></div>
        <div class="tip">Earphone (mic irukkuradhu) pottu pesunga — teacher voice thirumba mic-la pogaadhu, pechu clear ah irukkum.</div>
        <button class="btn big" data-act="finish-welcome">Seri, aarambippom</button>
      </div>
    </section>
  </main>`;
}

// ---------------- home ----------------
function viewHome() {
  const p = S.progress;
  const l = lessonById(p.currentDay) || LESSONS[0];
  const t = tutor();
  const last = S.sessions[0];
  const tip = TIPS[new Date().getDate() % TIPS.length];
  const heroText = p.allDone
    ? `<h1>30 naal course mudinjidhu!</h1><p>Ippo dhinamum ${esc(t.title)} kooda free-ah pesunga, illana role-play pannunga. Edha venumnaalum thirumba pannalaam.</p>`
    : `<span class="label">Indraiya class · Day ${l.id} · ${esc(WEEKS[l.wk] || '')}</span>
       <h1>${esc(l.t)}</h1>
       <p class="muted">${esc(l.en)} · ~15 nimisham</p>
       <p>${esc(plainSay(l.goal))}</p>`;
  return `<main class="wrap stack">
    <section class="hero">
      <div class="tile hero-tile" id="home-av"><span class="nametag">${esc(t.title)} · English teacher</span></div>
      <div class="hero-body stack">
        <p class="hello">Vanakkam ${esc(name())}! ${esc(t.title)} ready-aa irukkaanga.</p>
        ${heroText}
        <div class="row">
          ${p.allDone ? `<button class="btn big call" data-act="start" data-mode="free">${IC.phone} Pesa aarambippom</button>` : `<button class="btn big call" data-act="start" data-mode="lesson" data-day="${l.id}">${IC.phone} Class aarambippom</button>`}
        </div>
        <p class="xs muted">Mic-la nalla sathama pesunga. Teacher pesumbodhu idaiyila pesunaalum kettukkuvaanga.</p>
      </div>
    </section>

    <section class="modes">
      <button class="mode" data-act="start" data-mode="free"><b>Free-ah pesalaam</b><span>Unga naal, velai, family, cricket — edha pathi venumnaalum</span></button>
      <button class="mode ${roleOpen ? 'on' : ''}" data-act="toggle-role"><b>Role-play</b><span>Kadai, phone call, interview, doctor… real situation practice</span></button>
      <button class="mode" data-act="start" data-mode="doubt"><b>Doubt kelunga</b><span>Grammar, word meaning, "idha English-la eppadi?" — Tamil-la explain</span></button>
    </section>
    ${roleOpen ? `<section class="card stack"><span class="label">Edha practice pannalaam?</span><div class="scenes">${SCENES.map((s) => `<button class="scene" data-act="start" data-mode="role" data-scene="${s.id}"><b>${esc(s.t)}</b><span>${esc(s.d)}</span></button>`).join('')}</div></section>` : ''}

    <section class="grid2">
      <div class="card stack">
        <span class="label">Kadaisi class</span>
        ${last ? `<div><b>${esc(last.title)}</b> <span class="muted small">· ${esc(last.date)} · ${fmtMin(last.minutes)}</span></div><p>${esc(last.summary)}</p>${last.dayDone ? '<span class="ok">Day complete ✓</span>' : ''}` : '<p class="muted">Innum class illa. Mela irukkura "Class aarambippom" press pannunga!</p>'}
      </div>
      <div class="card stack">
        <span class="label">Mic test</span>
        <p class="small muted">"Hello, my name is ${esc(name())}" nu sollunga — bar nagarndhaa mic work aagudhu.</p>
        <div class="meter"><i id="meter-bar"></i></div>
        <button class="btn quiet" data-act="mictest" id="mictest-btn">${IC.mic} Mic test</button>
      </div>
    </section>
    <p class="pen tip-line">${esc(tip)}</p>
  </main>`;
}

let micTest = null;
async function toggleMicTest() {
  const btn = $('#mictest-btn');
  if (micTest) { micTest.stop(); micTest = null; if (btn) btn.innerHTML = `${IC.mic} Mic test`; return; }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const an = ctx.createAnalyser();
    an.fftSize = 512;
    ctx.createMediaStreamSource(stream).connect(an);
    const buf = new Float32Array(an.fftSize);
    let raf = 0;
    const loop = () => {
      an.getFloatTimeDomainData(buf);
      let s = 0;
      for (const v of buf) s += v * v;
      const rms = Math.sqrt(s / buf.length);
      const bar = $('#meter-bar');
      if (bar) bar.style.width = `${Math.min(100, rms * 600)}%`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    micTest = { stop: () => { cancelAnimationFrame(raf); stream.getTracks().forEach((t) => t.stop()); ctx.close(); const bar = $('#meter-bar'); if (bar) bar.style.width = '0'; } };
    if (btn) btn.textContent = 'Stop';
    setTimeout(() => { if (micTest) toggleMicTest(); }, 15000);
  } catch (e) {
    toast(ERR[e && e.name === 'NotFoundError' ? 'nomic' : 'micdenied']);
  }
}

// ---------------- call ----------------
function callLabel(mode, day, scene) {
  if (mode === 'lesson') { const l = lessonById(day); return l ? `Day ${l.id} · ${l.t}` : 'Class'; }
  if (mode === 'role') { const s = SCENES.find((x) => x.id === scene); return s ? `Role-play · ${s.t}` : 'Role-play'; }
  if (mode === 'doubt') return 'Doubt kelunga';
  return 'Free-ah pechu';
}

function viewCall(mode, day, scene) {
  const t = tutor();
  const st = S.settings;
  const lesson = mode === 'lesson' ? lessonById(day) : null;
  const ptt = st.micMode === 'ptt';
  const chip = (k, label) => `<button class="pill" data-act="chip" data-k="${k}">${label}</button>`;
  return `<div class="call-screen">
    <header class="call-top">
      <button class="iconbtn" data-act="end-call" aria-label="Call-a mudi">${IC.back}</button>
      <div class="grow"><div class="xs muted">${esc(t.title)} kooda</div><div class="ttl">${esc(callLabel(mode, day, scene))}</div></div>
      <span class="chip num" id="timer">0:00</span>
    </header>
    <div class="call-grid">
      <section class="stage">
        <div class="tile call-tile" id="call-av">
          <span class="status" id="status"><i class="dot"></i><span id="status-text">Connect aagudhu…</span></span>
          <span class="nametag">${esc(t.title)} · English teacher</span>
          <div class="self" id="self"><span class="ring" id="self-ring"></span><span class="initial">${esc(name().slice(0, 1).toUpperCase())}</span><video id="self-cam" playsinline muted hidden></video></div>
        </div>
        <div class="captions" id="captions" aria-live="polite"><p class="cap-empty">Teacher pesumbodhu inga ezhuththu-la varum.</p></div>
        <div class="err" id="call-err" hidden></div>
        <div class="controls">
          ${ptt
            ? `<button class="talk" id="ptt" aria-label="Pidichu pesunga">${IC.mic}<span>Pidichu pesunga</span></button>`
            : `<button class="round" id="mute" data-act="mute" aria-pressed="false" aria-label="Mic off/on">${IC.mic}</button>`}
          <div class="pills">
            ${chip('puriyala', 'Puriyala')}${chip('slow', 'Mella pesunga')}${chip('repeat', 'Thirumba sollunga')}${chip('tamil', 'Tamil-la solren')}
          </div>
          <button class="round ${st.mirror ? 'on' : ''}" data-act="mirror" id="mirror-btn" aria-pressed="${st.mirror ? 'true' : 'false'}" aria-label="Kannaadi (camera)">${IC.cam}</button>
          <button class="hang" data-act="end-call">${IC.end}<span>Mudichikkalaam</span></button>
        </div>
      </section>
      <aside class="board">
        <div class="board-head"><span class="pen">Whiteboard</span><span class="xs muted">thappu-va inga ezhudhuvom</span></div>
        <div id="fixes" class="fixes"><p class="empty">Neenga pesura sentence-la thiruththam irundha, "better-ah ippadi sollalaam" nu inga varum.</p></div>
        ${lesson ? `<div class="board-sec"><span class="label">Indraiya sentences · touch panna teacher solluvaanga</span>${lesson.say.map((s) => `<button class="say" data-act="say" data-t="${esc(plainSay(s))}">${stressHTML(s)}</button>`).join('')}</div>` : ''}
        <div class="board-sec xs muted">Tips: ${ptt ? 'Space key-a pidichu pesalaam.' : 'M key = mic off/on.'} Earphone pottaa innum clear.</div>
      </aside>
    </div>
    <div class="ending" id="ending" hidden><div class="card stack center"><div class="spinner" aria-hidden="true"></div><b>Report card ready aagudhu…</b><span class="small muted">Indraiya pechu-va teacher paarththu ezhudhuraanga</span></div></div>
  </div>`;
}

const STATUS_TEXT = {
  connecting: 'Connect aagudhu…',
  listening: 'Kekkuraanga — neenga pesunga',
  thinking: 'Yosikkiraanga…',
  speaking: 'Pesuraanga…',
  reconnecting: 'Line konjam cut — thirumba connect aagudhu…',
};

async function startCall(mode, day, scene) {
  if (!S.configured) { go('setup'); return; }
  if (micTest) { micTest.stop(); micTest = null; }
  screen = 'call';
  if (avatar) { avatar.destroy(); avatar = null; }
  $('#app').innerHTML = viewCall(mode, day, scene);
  mountAvatar('#call-av', 'idle');
  const c = new Call({ mode, day, scene, settings: S.settings, socketFactory: (q) => backend.liveSocket(q) });
  keepAwake(true);
  call = c;
  callCtx = { mode, day, scene, lines: [], me: null, tu: null, started: 0, raf: 0, cam: null, muted: false, done: false };
  wireCall(c);
  avatar.levelSource = () => c.tutorLevel();
  avatar.userLevelSource = () => c.micLevel;
  uiLoop();
  if (S.settings.mirror) startMirror();
  try {
    await c.start();
  } catch (e) {
    showCallError(e.kind || 'unknown');
  }
}

function wireCall(c) {
  c.addEventListener('state', (e) => {
    const s = e.detail;
    if (avatar) avatar.setState(s === 'reconnecting' || s === 'connecting' ? (s === 'connecting' ? 'idle' : 'thinking') : s);
    const el = $('#status');
    if (el) el.dataset.s = s;
    const tx = $('#status-text');
    if (tx) {
      let txt = STATUS_TEXT[s] || '';
      if (s === 'listening' && S.settings.micMode === 'ptt') txt = 'Button-a pidichu pesunga';
      if (s === 'listening' && callCtx && callCtx.muted) txt = 'Mic off — pesa mic button press pannunga';
      tx.textContent = txt;
    }
  });
  c.addEventListener('status', (e) => {
    if (e.detail.s === 'ready' && !callCtx.started) callCtx.started = Date.now();
  });
  c.addEventListener('in', (e) => {
    if (!callCtx.me) { callCtx.me = { who: 'me', text: '' }; callCtx.lines.push(callCtx.me); }
    callCtx.me.text += e.detail;
    drawCaptions();
  });
  c.addEventListener('userDone', (e) => {
    if (callCtx.me) { callCtx.me.text = e.detail; callCtx.me = null; } else callCtx.lines.push({ who: 'me', text: e.detail });
    drawCaptions();
  });
  c.addEventListener('out', (e) => {
    if (!callCtx.tu) { callCtx.tu = { who: 'tutor', text: '' }; callCtx.lines.push(callCtx.tu); }
    callCtx.tu.text += e.detail;
    drawCaptions();
  });
  c.addEventListener('turn', () => { callCtx.tu = null; });
  c.addEventListener('interrupted', () => { if (callCtx.tu) { callCtx.tu.text += ' …'; callCtx.tu = null; drawCaptions(); } });
  c.addEventListener('fix', (e) => addFixes(e.detail));
  c.addEventListener('error', (e) => showCallError(e.detail.kind || 'unknown', e.detail.detail));
}

function drawCaptions() {
  const box = $('#captions');
  if (!box || !callCtx) return;
  const lines = callCtx.lines.slice(-4);
  const t = tutor();
  box.innerHTML = lines.map((l, i) => `<p class="cap ${l.who} ${i < lines.length - 2 ? 'old' : ''}"><span class="who">${l.who === 'me' ? esc(name()) : esc(t.name)}</span>${esc(showText(l.text).trim())}</p>`).join('');
}

function addFixes(items) {
  const box = $('#fixes');
  if (!box || !items.length) return;
  box.querySelector('.empty')?.remove();
  for (const f of items) {
    const card = document.createElement('div');
    card.className = 'fix-card';
    card.innerHTML = `<div class="xs label">${f.kind === 'tamil' ? 'Neenga Tamil-la sonnadhu' : 'Neenga sonnadhu'}</div>
      <div class="said">${esc(showText(f.said))}</div>
      <div class="xs label">Better-ah ippadi sollalaam</div>
      <div class="better pen">${esc(f.better)}</div>
      ${f.tip ? `<div class="small">${esc(showText(f.tip))}</div>` : ''}
      <button class="btn soft sm" data-act="fix-say">${IC.speaker} ${esc(tutor().name)} solla kelunga</button>`;
    card.querySelector('button').dataset.said = f.said;
    card.querySelector('button').dataset.better = f.better;
    box.prepend(card);
  }
  while (box.children.length > 12) box.lastElementChild.remove();
}

function uiLoop() {
  if (!callCtx) return;
  const ring = $('#self-ring');
  if (ring && call) {
    const v = Math.min(1, call.micLevel * 9);
    ring.style.transform = `scale(${1 + v * 0.35})`;
    ring.style.opacity = String(0.25 + v * 0.75);
  }
  const tm = $('#timer');
  if (tm && callCtx.started) {
    const s = Math.floor((Date.now() - callCtx.started) / 1000);
    tm.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }
  callCtx.raf = requestAnimationFrame(uiLoop);
}

function showCallError(kind, detail) {
  const box = $('#call-err');
  if (!box) return;
  box.hidden = false;
  box.innerHTML = `<b>${esc(ERR[kind] || ERR.unknown)}</b>${detail && kind === 'unknown' ? `<div class="xs muted">${esc(detail)}</div>` : ''}
    <div class="row"><button class="btn sm" data-act="retry-call">Thirumba try pannunga</button>${kind === 'badkey' || kind === 'nokey' ? '<button class="btn quiet sm" data-act="go" data-to="settings">Settings</button>' : ''}<button class="btn quiet sm" data-act="leave-call">Home</button></div>`;
  if (avatar) avatar.setState('idle');
  const st = $('#status');
  if (st) st.dataset.s = 'error';
  const tx = $('#status-text');
  if (tx) tx.textContent = 'Connect aagala';
}

async function startMirror() {
  if (!callCtx || callCtx.cam) return;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240, facingMode: 'user' } });
    if (!callCtx) { stream.getTracks().forEach((t) => t.stop()); return; }
    callCtx.cam = stream;
    const v = $('#self-cam');
    if (v) { v.srcObject = stream; v.hidden = false; v.play().catch(() => {}); }
    $('#self')?.classList.add('cam');
  } catch {
    toast('Camera on aagala. Permission check pannunga.');
  }
}
function stopMirror() {
  if (!callCtx || !callCtx.cam) return;
  callCtx.cam.getTracks().forEach((t) => t.stop());
  callCtx.cam = null;
  const v = $('#self-cam');
  if (v) { v.srcObject = null; v.hidden = true; }
  $('#self')?.classList.remove('cam');
}

async function endCall(silent) {
  if (!call || !callCtx || callCtx.done) return;
  callCtx.done = true;
  const c = call;
  const ctx = callCtx;
  const hadStarted = !!ctx.started;
  if (!silent && hadStarted) { const e = $('#ending'); if (e) e.hidden = false; }
  const report = await c.end();
  cancelAnimationFrame(ctx.raf);
  stopMirror();
  keepAwake(false);
  call = null;
  callCtx = null;
  await refresh();
  if (report && !silent) { lastReport = report; screen = 'report'; render(); window.scrollTo(0, 0); }
  else if (!silent) { go('home'); if (hadStarted) toast('Romba short call — indha thadava report illa.'); }
}

// ---------------- report ----------------
function viewReport() {
  const r = lastReport;
  if (!r) return '<main class="wrap"><p>Report illa.</p></main>';
  const stamp = r.dayDone ? `Day ${r.day} complete!` : 'Very good!';
  const next = r.dayDone ? lessonById((r.day || 0) + 1) : null;
  return `<main class="wrap stack report">
    <section class="card stack center">
      <span class="stamp">${esc(stamp)}</span>
      <h1>${esc(r.title)}</h1>
      <p class="muted">${fmtMin(r.minutes)} pesineenga · ${esc(r.date)}</p>
      <p class="lead">${esc(showText(r.summary))}</p>
    </section>
    <div class="grid2">
      ${r.didWell && r.didWell.length ? `<section class="card stack"><span class="label">Neenga nalla pannadhu</span><ul class="ticks">${r.didWell.map((x) => `<li>${esc(showText(x))}</li>`).join('')}</ul></section>` : ''}
      ${r.newWords && r.newWords.length ? `<section class="card stack"><span class="label">Pudhu words</span>${r.newWords.map((w) => `<div class="word"><button class="lis" data-act="speak" data-t="${esc(w.word)}" aria-label="Kelunga">${IC.speaker}</button><b class="en">${esc(w.word)}</b><span class="muted small">${esc(showText(w.meaning))}</span></div>`).join('')}</section>` : ''}
    </div>
    ${r.fixThese && r.fixThese.length ? `<section class="card stack"><span class="label">Indha thappu-va sari pannunga</span>${r.fixThese.map((f) => `<div class="fix-row"><div class="said">${esc(showText(f.said))}</div><div class="row"><button class="lis" data-act="speak" data-t="${esc(f.better)}" aria-label="Kelunga">${IC.speaker}</button><span class="better pen">${esc(f.better)}</span></div>${f.tip ? `<div class="small">${esc(showText(f.tip))}</div>` : ''}</div>`).join('')}</section>` : ''}
    ${r.nextTime ? `<section class="sheet"><span class="pen">Adutha thadava: ${esc(showText(r.nextTime))}</span></section>` : ''}
    <div class="row">
      ${next ? `<button class="btn call" data-act="start" data-mode="lesson" data-day="${next.id}">${IC.phone} Adutha class: Day ${next.id}</button>` : ''}
      <button class="btn ${next ? 'quiet' : ''}" data-act="go" data-to="home">Home</button>
    </div>
    ${next ? '<p class="xs muted">Oru naalaiku oru class podhum. Energy irundha thodarunga!</p>' : ''}
  </main>`;
}

// ---------------- progress ----------------
function viewProgress() {
  const p = S.progress;
  const done = Object.keys(p.daysDone).length;
  const maxMin = Math.max(10, ...p.week.map((w) => w.min));
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const bars = p.week.map((w, i) => {
    const h = Math.round((w.min / maxMin) * 96);
    const d = new Date(`${w.date}T12:00:00`);
    const x = 14 + i * 44;
    return `<rect x="${x}" y="${110 - h}" width="26" height="${Math.max(h, 2)}" rx="5" class="${w.min ? 'b' : 'b0'}"/><text x="${x + 13}" y="128" text-anchor="middle">${days[d.getDay()]}</text>${w.min ? `<text x="${x + 13}" y="${104 - h}" text-anchor="middle" class="v">${w.min < 1 ? '&lt;1' : Math.round(w.min)}</text>` : ''}`;
  }).join('');
  return `<main class="wrap stack">
    <h1>Unga progress</h1>
    <div class="stats">
      <div class="stat"><b class="num">${done}<small>/30</small></b><span>Days mudinjidhu</span></div>
      <div class="stat"><b class="num">${p.streak}</b><span>Streak (naal)</span></div>
      <div class="stat"><b class="num">${p.totalMinutes < 10 ? Math.round(p.totalMinutes * 10) / 10 : Math.round(p.totalMinutes)}</b><span>Mottham nimisham pesineenga</span></div>
      <div class="stat"><b>${esc(S.memory.level || '–')}</b><span>Level (A1 → A2 → B1)</span></div>
    </div>
    <section class="card stack"><div class="row sp"><h2>Indha vaaram</h2><span class="xs muted">nimisham / naal</span></div>
      <svg class="bars" viewBox="0 0 330 136" role="img" aria-label="Minutes practised in the last 7 days">${bars}</svg>
    </section>
    <section class="card stack"><h2>30 naal</h2><div class="grid30">${LESSONS.map((l) => `<span class="${p.daysDone[l.id] ? 'd' : l.id === p.currentDay ? 'n' : ''}" title="Day ${l.id}: ${esc(l.t)}">${l.id}</span>`).join('')}</div></section>
    <section class="card stack"><h2>Kadaisi classes</h2>${S.sessions.length ? `<div class="list">${S.sessions.slice(0, 12).map((s) => `<div class="it"><div><b>${esc(s.title)}</b> <span class="muted small">${esc(s.date)} · ${fmtMinShort(s.minutes)}${s.dayDone ? ' · ✓' : ''}</span><div class="small">${esc(showText(s.summary))}</div></div></div>`).join('')}</div>` : '<p class="empty">Innum class illa.</p>'}</section>
    <section class="card stack"><h2>Thiruththa notebook</h2>${S.notebook.length ? `<div class="list">${S.notebook.slice(0, 30).map((n) => `<div class="fix-row"><div class="said">${esc(showText(n.said))}</div><div class="row"><button class="lis" data-act="speak" data-t="${esc(n.better)}" aria-label="Kelunga">${IC.speaker}</button><span class="better pen">${esc(n.better)}</span></div>${n.tip ? `<div class="small">${esc(showText(n.tip))}</div>` : ''}</div>`).join('')}</div>` : '<p class="empty">Teacher sari panna sentences inga save aagum. Ivangala daily oru thadava sathama padinga.</p>'}</section>
    ${S.memory.facts.length ? `<section class="card stack"><h2>Teacher-ku unga pathi therinjadhu</h2><ul class="ticks">${S.memory.facts.map((f) => `<li>${esc(f)}</li>`).join('')}</ul><p class="xs muted">Adutha class-la idha vachu pesuvaanga.</p></section>` : ''}
  </main>`;
}

// ---------------- settings ----------------
function seg(key, opts) {
  const cur = S.settings[key];
  return `<div class="seg" role="group">${opts.map(([v, l]) => `<button type="button" data-act="set" data-k="${key}" data-v="${v}" aria-pressed="${cur === v}">${esc(l)}</button>`).join('')}</div>`;
}
function viewSettings() {
  const st = S.settings;
  const voices = VOICES[st.tutor] || VOICES.priya;
  return `<main class="narrow stack">
    <h1>Settings</h1>
    <section class="card stack">
      <div class="row">
        <div class="grow"><label class="label" for="s-name">Peru</label><input id="s-name" type="text" value="${esc(S.profile.name)}" autocomplete="off"></div>
        <div class="grow"><label class="label" for="s-city">Ooru</label><input id="s-city" type="text" value="${esc(S.profile.city)}" autocomplete="off"></div>
      </div>
      <div><span class="label">Teacher</span>${seg('tutor', [['priya', 'Priya miss'], ['arun', 'Arun sir']])}</div>
      <div><span class="label">Voice</span><div class="seg wrapseg" role="group">${voices.map(([v, l]) => `<button type="button" data-act="set" data-k="voice" data-v="${v}" aria-pressed="${(st.voice || '') === v}">${esc(l)}</button>`).join('')}</div></div>
      <div><span class="label">Teacher pesura speed</span>${seg('speed', [['normal', 'Normal'], ['slow', 'Mella']])}</div>
      <div><span class="label">Neenga yosichu pesa evlo time wait pannanum</span>${seg('patience', [['fast', 'Konjam'], ['normal', 'Normal'], ['slow', 'Neraya']])}</div>
      <div><span class="label">Tamil help</span>${seg('tamilHelp', [['more', 'Adhigam'], ['normal', 'Normal'], ['less', 'Kammi']])}</div>
    </section>
    <section class="card stack">
      <div><span class="label">Audio</span>${seg('audioMode', [['earphone', 'Earphone (best)'], ['speaker', 'Speaker']])}<p class="xs muted">Speaker-na, teacher pesumbodhu konjam sathama pesunaa dhaan interrupt aagum.</p></div>
      <div><span class="label">Mic</span>${seg('micMode', [['auto', 'Phone call madhiri (auto)'], ['ptt', 'Button pidichu pesu']])}<p class="xs muted">Veettula sathham adhigam-na "Button pidichu pesu" use pannunga.</p></div>
      <div><span class="label">Tamil ezhuththu (captions)</span>${seg('captions', [['thanglish', 'Thanglish'], ['tamil', 'Tamil script']])}</div>
      <label class="check" for="s-mirror"><input type="checkbox" id="s-mirror" ${st.mirror ? 'checked' : ''}><span>Call-la kannaadi (camera) on pannu — vaai eppadi move aagudhu nu paakka. Video veliya pogaadhu, unga screen-la mattum.</span></label>
    </section>
    <section class="card stack">
      <span class="label">Gemini API key</span>
      <p class="small">${S.configured ? `Set aayirukku (${esc(S.keyHint)}). Model: ${esc(S.liveModel)}` : 'Innum set pannala.'}</p>
      <div class="row"><input id="key-in" type="password" autocomplete="off" spellcheck="false" placeholder="Pudhu key paste pannunga" class="grow"><button class="btn quiet" data-act="savekey" id="key-btn">Save &amp; check</button></div>
      <p class="xs muted" id="key-msg"></p>
      <p class="xs muted">${S.mode === 'web' ? 'Progress indha phone-la (indha browser-la) save aagum.' : `Data folder: ${esc(S.dataDir)}`}</p>
      ${S.mode === 'web' ? '<div class="row"><button class="btn quiet sm" data-act="copy-link">Vera phone-ku setup link copy</button></div><p class="xs muted">Indha link-la key irukku. Unga family-ku mattum anuppunga, vera yaarukkum share pannaadheenga.</p>' : ''}
    </section>
    <section class="card stack">
      <span class="label">Backup</span>
      <p class="small muted">Phone maathinaalum progress poga koodaadhu-na, backup file save pannunga. Pudhu phone-la "Restore" pannalaam.</p>
      <div class="row"><button class="btn quiet sm" data-act="backup">Backup download</button><button class="btn quiet sm" data-act="restore">Restore</button><input type="file" id="restore-file" accept="application/json,.json" hidden></div>
      ${resetAsk ? '<div class="banner stack"><b>Ellaa progress-um azhinjidum (key, settings irukkum). Sure-aa?</b><div class="row"><button class="btn red sm" data-act="reset-yes">Aamaa, reset</button><button class="btn quiet sm" data-act="reset-no">Vendaam</button></div></div>' : '<div><button class="btn quiet sm" data-act="reset">Progress-a reset pannunga</button></div>'}
    </section>
    <button class="btn" data-act="go" data-to="home">Home</button>
  </main>`;
}

// ---------------- actions ----------------
async function refresh() { S = await backend.state(); }
async function saveSettings(patch) {
  const r = await backend.saveSettings(patch);
  if (r && r.state) S = r.state;
}

const ACT = {
  go: (b) => go(b.dataset.to),
  start: (b) => startCall(b.dataset.mode, b.dataset.day ? Number(b.dataset.day) : undefined, b.dataset.scene),
  'toggle-role': () => { roleOpen = !roleOpen; render(); },
  mictest: () => toggleMicTest(),
  speak: (b) => { if (!speakLocal(b.dataset.t)) toast('Indha browser-la voice play aagala.'); },
  savekey: async () => {
    const inp = $('#key-in');
    const msg = $('#key-msg');
    const btn = $('#key-btn');
    const key = (inp && inp.value || '').trim();
    if (!key) { msg.textContent = 'Key-a paste pannunga.'; return; }
    btn.disabled = true;
    msg.textContent = 'Check pannuren…';
    try {
      const r = await backend.saveKey(key);
      if (r.ok) { S = r.state; msg.textContent = 'Super! Key work aagudhu.'; toast('API key save aayiduchu'); go(S.onboarded ? 'home' : 'welcome'); return; }
      msg.textContent = r.kind === 'format' ? 'Idhu sariyaana key madhiri illa. Full key-a copy pannunga.' : (ERR[r.kind] || ERR.unknown) + (r.detail && r.kind === 'unknown' ? ` (${r.detail})` : '');
    } catch { msg.textContent = ERR.dropped; }
    btn.disabled = false;
  },
  'pick-tutor': async (b) => { await saveSettings({ settings: { tutor: b.dataset.k, voice: '' } }); const n = $('#w-name')?.value; const c = $('#w-city')?.value; render(); if (n) $('#w-name').value = n; if (c) $('#w-city').value = c; },
  'finish-welcome': async () => {
    await saveSettings({ profile: { name: $('#w-name').value, city: $('#w-city').value }, onboarded: true });
    go('home');
  },
  set: async (b) => {
    const patch = { [b.dataset.k]: b.dataset.v };
    if (b.dataset.k === 'tutor') patch.voice = '';
    await saveSettings({ settings: patch });
    render();
  },
  reset: () => { resetAsk = true; render(); },
  'reset-no': () => { resetAsk = false; render(); },
  'reset-yes': async () => { const r = await backend.reset(); if (r.state) S = r.state; resetAsk = false; toast('Progress reset aayiduchu'); go('home'); },
  backup: async () => {
    const data = await backend.exportData();
    const blob = new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `pesu-english-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
    toast('Backup file download aagudhu');
  },
  restore: () => $('#restore-file')?.click(),
  'copy-link': async () => {
    const link = backend.keyLink ? await backend.keyLink() : '';
    if (!link) { toast('Mudhalla key set pannunga'); return; }
    try { await navigator.clipboard.writeText(link); toast('Link copy aayiduchu — WhatsApp-la anna-ku anuppunga'); }
    catch { prompt('Indha link-a copy pannunga:', link); }
  },
  // call controls
  chip: (b) => { if (call) call.chip(b.dataset.k); },
  say: (b) => { if (call) call.chip('sentence', { text: b.dataset.t }); },
  'fix-say': (b) => { if (call) call.chip('fix', { said: b.dataset.said, better: b.dataset.better }); else speakLocal(b.dataset.better); },
  mute: () => toggleMute(),
  mirror: async () => {
    const on = !(callCtx && callCtx.cam);
    if (on) await startMirror(); else stopMirror();
    const btn = $('#mirror-btn');
    if (btn) { btn.classList.toggle('on', on); btn.setAttribute('aria-pressed', String(on)); }
    saveSettings({ settings: { mirror: on } });
  },
  'end-call': () => endCall(false),
  'leave-call': async () => { await endCall(true); go('home'); },
  'retry-call': async () => { const ctx = callCtx && { ...callCtx }; await endCall(true); if (ctx) startCall(ctx.mode, ctx.day, ctx.scene); else go('home'); },
};

function toggleMute() {
  if (!call || !callCtx) return;
  callCtx.muted = !callCtx.muted;
  call.setMuted(callCtx.muted);
  const b = $('#mute');
  if (b) { b.classList.toggle('off', callCtx.muted); b.setAttribute('aria-pressed', String(callCtx.muted)); b.innerHTML = callCtx.muted ? IC.micOff : IC.mic; }
  const tx = $('#status-text');
  if (tx && call.state === 'listening') tx.textContent = callCtx.muted ? 'Mic off — pesa mic button press pannunga' : STATUS_TEXT.listening;
}

document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-act]');
  if (!b || b.disabled) return;
  const f = ACT[b.dataset.act];
  if (!f) return;
  e.preventDefault();
  Promise.resolve(f(b, e)).catch((err) => { console.error(err); toast('Edho problem. Thirumba try pannunga.'); });
});

document.addEventListener('change', async (e) => {
  const t = e.target;
  if (t.id === 's-name' || t.id === 's-city') saveSettings({ profile: { name: $('#s-name').value, city: $('#s-city').value } });
  if (t.id === 's-mirror') saveSettings({ settings: { mirror: t.checked } });
  if (t.id === 'restore-file' && t.files && t.files[0]) {
    try {
      const data = JSON.parse(await t.files[0].text());
      const r = await backend.importData(data);
      if (r && r.ok) { S = r.state; toast('Backup restore aayiduchu'); go('home'); }
      else toast('Idhu Pesu English backup file illa.');
    } catch { toast('File-a padikka mudiyala.'); }
  }
});

// keep the phone screen on during a call (otherwise the mic stops when the screen sleeps)
let wakeLock = null;
async function keepAwake(on) {
  try {
    if (on && 'wakeLock' in navigator && document.visibilityState === 'visible') {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    } else if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
  } catch { /* not supported or refused */ }
}
document.addEventListener('visibilitychange', () => { if (call && document.visibilityState === 'visible' && !wakeLock) keepAwake(true); });

// push-to-talk: hold the big button or the Space key
document.addEventListener('pointerdown', (e) => {
  const b = e.target.closest('#ptt');
  if (!b || !call) return;
  e.preventDefault();
  b.setPointerCapture?.(e.pointerId);
  b.classList.add('down');
  call.pttDown();
});
const pttRelease = () => { const b = $('#ptt'); if (b) b.classList.remove('down'); if (call) call.pttUp(); };
document.addEventListener('pointerup', (e) => { if (e.target.closest('#ptt')) pttRelease(); });
document.addEventListener('pointercancel', (e) => { if (e.target.closest('#ptt')) pttRelease(); });
document.addEventListener('keydown', (e) => {
  if (!call || e.target.matches('input, textarea')) return;
  if (e.code === 'Space' && S.settings.micMode === 'ptt') { e.preventDefault(); if (!e.repeat) { $('#ptt')?.classList.add('down'); call.pttDown(); } }
  if (e.key === 'm' || e.key === 'M') { if (S.settings.micMode !== 'ptt') toggleMute(); }
});
document.addEventListener('keyup', (e) => {
  if (call && e.code === 'Space' && S.settings.micMode === 'ptt') { e.preventDefault(); pttRelease(); }
});
window.addEventListener('beforeunload', () => { if (call) call.end(); });

// ---------------- boot ----------------
(async function boot() {
  render();
  try { await refresh(); } catch { $('#app').innerHTML = `<div class="loading">${backend.mode === 'web' ? 'App load aagala. Page-a refresh pannunga.' : 'App server-oda connect aagala. Window-a close panni thirumba open pannunga.'}</div>`; return; }
  // phone edition: a setup link "…#k=KEY" from Dhina sets the key once, then the key is removed from the address bar
  if (backend.mode === 'web' && location.hash.startsWith('#k=')) {
    const key = decodeURIComponent(location.hash.slice(3));
    history.replaceState(null, '', location.pathname + location.search);
    const r = await backend.saveKey(key).catch(() => null);
    if (r && r.ok) { S = r.state; setTimeout(() => toast('Setup mudinjidhu — key save aayiduchu'), 300); }
    else setTimeout(() => toast('Setup link-la irukkura key work aagala.'), 300);
  }
  screen = S.configured ? (S.onboarded ? 'home' : 'welcome') : 'setup';
  render();
  if (backend.mode === 'server') presence();
  if (backend.mode === 'web' && 'serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  if ('speechSynthesis' in window) { try { speechSynthesis.getVoices(); } catch { /* ignore */ } }
})();
