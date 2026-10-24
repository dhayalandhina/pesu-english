// End-to-end test of the OpenAI path, offline: mock OpenAI + headless Chromium with a fake mic.
//  Part 1: phone edition (static docs/ site, Pixel 7, call runs in the page)
//  Part 2: Mac/PC edition (local server, earphone mode, model fallback, push-to-talk)
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const { chromium, devices } = require(path.join(process.env.GLOBAL_NODE_MODULES, 'playwright'));
const OUT = process.env.SHOTS || '/tmp/pesu-shots-openai';
const SITE = path.join(ROOT, 'docs');
const DATA = '/tmp/pesu-e2e-openai-data';
const SITE_PORT = 4796;
const SRV_PORT = 4791;
const MOCK1 = 9921;
const MOCK2 = 9922;
const BASE = `http://localhost:${SITE_PORT}/pesu-english/`;
const GOOD = 'sk-test-' + 'a'.repeat(40);
fs.mkdirSync(OUT, { recursive: true });
fs.rmSync(DATA, { recursive: true, force: true });

// speech-like test signal for the fake mic: 1.4 s voiced + 2.6 s silence (Chrome loops it)
const WAV = '/tmp/pesu-fake-speech.wav';
if (!fs.existsSync(WAV)) {
  const rate = 48000;
  const n = rate * 4;
  const data = Buffer.alloc(n * 2);
  for (let i = 0; i < n; i++) {
    const t = i / rate;
    let v = 0;
    if (t < 1.4) {
      const f0 = 140 + 12 * Math.sin(2 * Math.PI * 3 * t);
      const syl = Math.max(0, Math.sin(2 * Math.PI * 4 * t)) ** 0.6;
      for (let h = 1; h <= 18; h++) { const f = f0 * h; const w = Math.exp(-((f - 700) ** 2) / (2 * 180 ** 2)) + 0.7 * Math.exp(-((f - 1200) ** 2) / (2 * 220 ** 2)) + 0.15; v += Math.sin(2 * Math.PI * f * t) * w / h ** 0.3; }
      v *= 0.12 * syl * Math.min(1, t * 30, (1.4 - t) * 30);
    }
    data.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(v * 32767))), i * 2);
  }
  const hdr = Buffer.alloc(44);
  hdr.write('RIFF', 0); hdr.writeUInt32LE(36 + data.length, 4); hdr.write('WAVE', 8); hdr.write('fmt ', 12);
  hdr.writeUInt32LE(16, 16); hdr.writeUInt16LE(1, 20); hdr.writeUInt16LE(1, 22); hdr.writeUInt32LE(rate, 24);
  hdr.writeUInt32LE(rate * 2, 28); hdr.writeUInt16LE(2, 32); hdr.writeUInt16LE(16, 34); hdr.write('data', 36); hdr.writeUInt32LE(data.length, 40);
  fs.writeFileSync(WAV, Buffer.concat([hdr, data]));
}

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.woff2': 'font/woff2' };
const site = http.createServer((req, res) => {
  const u = new URL(req.url, BASE);
  if (!u.pathname.startsWith('/pesu-english/')) { res.writeHead(404); res.end(); return; }
  let rel = decodeURIComponent(u.pathname.slice('/pesu-english/'.length)) || 'index.html';
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.join(SITE, rel);
  if (!file.startsWith(SITE) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end('nf'); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(SITE_PORT, '127.0.0.1');

const procs = [];
let srvLog = '';
let mockLog = '';
const startMock = (port, env) => { const p = spawn(process.execPath, [path.join(ROOT, 'test/mock-openai.mjs')], { env: { ...process.env, MOCK_PORT: String(port), ...env }, stdio: ['ignore', 'pipe', 'pipe'] }); p.stdout.on('data', (d) => { mockLog += `[${port}] ${d}`; }); p.stderr.on('data', (d) => { mockLog += `[${port}] ${d}`; }); procs.push(p); return p; };
startMock(MOCK1, { MOCK_DROP_AFTER: '3' });
startMock(MOCK2, { MOCK_MISSING_MODEL: 'gpt-realtime-2.1-mini' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const check = (name, ok, extra = '') => { results.push({ name, ok }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? `  (${extra})` : ''}`); };
const stats = async (port) => (await fetch(`http://127.0.0.1:${port}/__stats`)).json();
async function waitFor(fn, ms, step = 200) {
  const end = Date.now() + ms;
  while (Date.now() < end) { try { const v = await fn(); if (v) return v; } catch { /* retry */ } await sleep(step); }
  return null;
}

let browser;
try {
  await sleep(800);
  browser = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', `--use-file-for-fake-audio-capture=${WAV}`, '--autoplay-policy=no-user-gesture-required'] });
  const errors = [];
  const watch = (page, tag) => {
    page.on('console', (m) => { if (m.type() === 'error') errors.push(`${tag} ${m.text()}`); });
    page.on('pageerror', (e) => errors.push(`${tag} pageerror: ${e.message}`));
  };

  // ================= Part 1: phone edition =================
  const ctx = await browser.newContext({ ...devices['Pixel 7'], colorScheme: 'light' });
  await ctx.grantPermissions(['microphone', 'camera'], { origin: `http://localhost:${SITE_PORT}` });
  await ctx.addInitScript((m) => { localStorage.setItem('pesu-base-url', m); }, `http://127.0.0.1:${MOCK1}`);
  const page = await ctx.newPage();
  watch(page, '[phone]');
  await page.goto(BASE);
  await page.waitForSelector('#key-in');
  check('setup asks for an API key (Groq / OpenAI / Gemini)', /API key podunga/.test(await page.textContent('h1')));
  await page.screenshot({ path: `${OUT}/o01-setup.png` });
  await page.fill('#key-in', 'sk-bad-' + 'x'.repeat(40));
  await page.click('#key-btn');
  check('bad OpenAI key rejected', !!(await waitFor(async () => /work aagala/.test(await page.textContent('#key-msg')), 6000)));
  await page.fill('#key-in', 'sk-nocredit-' + 'x'.repeat(40));
  await page.click('#key-btn');
  const creditMsg = await waitFor(async () => { const t = await page.textContent('#key-msg'); return /credit/.test(t) ? t : null; }, 8000);
  check('key without credit -> "add credit" message (not saved)', !!creditMsg, creditMsg || '');
  await page.fill('#key-in', GOOD);
  await page.click('#key-btn');
  await page.waitForSelector('#w-name', { timeout: 8000 });
  const cfg = await page.evaluate(() => JSON.parse(localStorage.getItem('pesu-config-v1') || '{}'));
  check('good key saved in this browser; provider = openai', cfg.apiKey === GOOD && cfg.provider === 'openai' && cfg.liveModels[0] === 'gpt-realtime-2.1-mini', `${cfg.provider} ${cfg.liveModels}`);
  await page.click('[data-act="finish-welcome"]');
  await page.waitForSelector('.hero');

  await page.click('.hero [data-act="start"]');
  await page.waitForSelector('#call-av svg');
  check('tutor greets first (OpenAI Realtime from the browser); repeat sentence shows', !!(await waitFor(async () => /Hi, I am Dinesh/.test(await page.textContent('#captions')), 15000)));
  check('speaking state while tutor audio plays', !!(await waitFor(async () => (await page.getAttribute('#status', 'data-s')) === 'speaking', 8000, 50)));
  const shown = await waitFor(async () => { const t = await page.textContent('#captions'); return /Yesterday I went to the market\./.test(t) && !/Hi Dinesh!/.test(t) ? t : null; }, 25000);
  check('his voice turn answered; screen shows only the sentence to repeat', !!shown, shown || '');
  await page.screenshot({ path: `${OUT}/o02-call.png` });
  check('Tamil meaning (Thanglish) under the sentence', !!(await waitFor(async () => /Neththu naan market-ku ponen/.test(await page.textContent('#captions .meaning')), 15000)));
  check('correction card on the whiteboard (chat completions)', !!(await waitFor(async () => (await page.$$('#fixes .fix-card')).length > 0, 25000)));
  await page.click('[data-act="chip"][data-k="puriyala"]');
  check('"Puriyala" sent as a text turn', !!(await waitFor(async () => (await stats(MOCK1)).texts.some((t) => t.includes("didn't understand")), 6000)));
  const resumed = await waitFor(async () => { const s = await stats(MOCK1); return s.connections.length >= 2 && s.history.length > 0 ? s : null; }, 30000);
  check('dropped line -> reconnects and replays the recent talk', !!resumed, resumed ? `${resumed.history.length} items: ${resumed.history.map((h) => `${h.role}/${h.type}`).join(',')}` : '');
  const s1 = await stats(MOCK1);
  const u = s1.updates[0] || {};
  check('session: browser sub-protocol auth, model, Marin voice, 24 kHz in/out, audio only',
    s1.connections[0].via === 'subprotocol' && u.model === 'gpt-realtime-2.1-mini' && u.voice === 'marin' && u.format?.rate === 24000 && u.outFormat?.rate === 24000 && JSON.stringify(u.modalities) === '["audio"]' && u.instructions > 500, JSON.stringify(u).slice(0, 300));
  check('session: semantic VAD (patient), gpt-transcribe, far-field noise filter (phone speaker), low reasoning',
    u.td?.type === 'semantic_vad' && u.td?.eagerness === 'low' && u.transcription?.model === 'gpt-transcribe' && u.noise?.type === 'far_field' && u.reasoning?.effort === 'low');
  check('mic streamed as 24 kHz, 50 ms chunks', s1.audioChunks > 20 && s1.chunkBytes['2400'] > 10, `${JSON.stringify(s1.chunkBytes)} maxRms=${s1.maxRms.toFixed(3)}`);
  const cb = s1.chatBodies.find((b) => b.response_format === 'json_object') || {};
  check('text model: gpt-6-luna, JSON mode, low reasoning, no temperature', cb.model === 'gpt-6-luna' && cb.reasoning_effort === 'low' && cb.temperature === null && cb.max_completion_tokens >= 1024, JSON.stringify(cb));
  await page.click('.hang');
  await page.waitForSelector('.stamp', { timeout: 30000 });
  await sleep(500);
  await page.screenshot({ path: `${OUT}/o03-report.png`, fullPage: true });
  check('report card + Day 1 complete', /Day 1 complete/.test(await page.textContent('.stamp')));
  const tr = await page.evaluate(() => { const k = Object.keys(localStorage).find((x) => x.startsWith('pesu-session-')); return k ? JSON.parse(localStorage.getItem(k)).transcript : []; });
  const iMe = tr.findIndex((x) => x.who === 'me' && /Yesterday I go to market/.test(x.text));
  const iTu = tr.findIndex((x, i) => i > iMe && x.who === 'tutor' && /went to the market yesterday/.test(x.text));
  check('saved transcript keeps spoken order (his words before the answer, though they arrived later)', iMe >= 0 && iTu > iMe, tr.map((x) => x.who).join(','));
  const data = await page.evaluate(() => JSON.parse(localStorage.getItem('pesu-data-v1')));
  check('progress, memory, notebook saved in the phone', data.progress.daysDone['1'] && data.memory.facts.length > 0 && data.notebook.length > 0 && data.sessions.length === 1);
  await page.click('[data-act="go"][data-to="settings"]');
  await page.waitForSelector('[data-act="backup"]');
  const settingsText = await page.textContent('main');
  check('settings show OpenAI key + OpenAI voices', /OpenAI API key/.test(settingsText) && /gpt-realtime-2\.1-mini/.test(settingsText) && !!(await page.$('[data-k="voice"][data-v="coral"]')));
  await page.screenshot({ path: `${OUT}/o04-settings.png`, fullPage: true });

  // ================= Part 2: Mac/PC edition =================
  const srv = spawn(process.execPath, [path.join(ROOT, 'server.mjs'), '--serve', '--no-idle', '--data', DATA, '--port', String(SRV_PORT)], { env: { ...process.env, PESU_OPENAI_BASE_URL: `http://127.0.0.1:${MOCK2}` }, stdio: ['ignore', 'pipe', 'pipe'] });
  procs.push(srv);
  srv.stdout.on('data', (d) => { srvLog += d; });
  srv.stderr.on('data', (d) => { srvLog += d; });
  await waitFor(async () => (await fetch(`http://127.0.0.1:${SRV_PORT}/api/ping`)).ok, 8000);
  const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 860 }, colorScheme: 'dark' });
  await ctx2.grantPermissions(['microphone', 'camera'], { origin: `http://localhost:${SRV_PORT}` });
  const p2 = await ctx2.newPage();
  watch(p2, '[mac]');
  await p2.goto(`http://localhost:${SRV_PORT}/`);
  await p2.waitForSelector('#key-in');
  await p2.fill('#key-in', GOOD);
  await p2.click('#key-btn');
  await p2.waitForSelector('#w-name', { timeout: 8000 });
  const scfg = JSON.parse(fs.readFileSync(path.join(DATA, 'config.json'), 'utf8'));
  const mode = (fs.statSync(path.join(DATA, 'config.json')).mode & 0o777).toString(8);
  check('Mac: key in private config file, provider openai', scfg.apiKey === GOOD && scfg.provider === 'openai' && mode === '600', `mode ${mode}`);
  await p2.click('[data-act="finish-welcome"]');
  await p2.waitForSelector('.hero');
  await p2.click('.hero [data-act="start"]');
  await p2.waitForSelector('#call-av svg');
  // (the fake mic starts talking right away in earphone mode, so the greeting itself may get interrupted)
  check('Mac: tutor speaks first (kickoff -> answer, server -> OpenAI)', !!(await waitFor(async () => { const s = await stats(MOCK2); return s.texts.some((t) => t.includes('call just connected')) && s.responses >= 1; }, 15000)));
  check('Mac: his speech reached the tutor', !!(await waitFor(async () => /Yesterday I went to the market/.test(await p2.textContent('#captions')), 25000)));
  check('Mac: correction card', !!(await waitFor(async () => (await p2.$$('#fixes .fix-card')).length > 0, 25000)));
  // the answer is usually fully received but still playing when he talks over it: the app cuts it and truncates
  const barge = await waitFor(async () => { const s = await stats(MOCK2); return s.truncates.length >= 1 ? s : null; }, 30000);
  check('Mac: talking over the tutor interrupts it + tells OpenAI what he heard (truncate)', !!barge, barge ? `interrupts=${barge.interrupts} truncates=${JSON.stringify(barge.truncates.slice(0, 2))}` : '');
  const s2 = await stats(MOCK2);
  check('Mac: model fallback (2.1-mini missing -> gpt-realtime-mini, no reasoning field), header auth, earphone near-field',
    s2.updates[0]?.model === 'gpt-realtime-mini' && !s2.updates[0]?.reasoning && s2.connections[0]?.via === 'header' && s2.updates[0]?.noise?.type === 'near_field', JSON.stringify({ model: s2.updates[0]?.model, via: s2.connections[0]?.via, noise: s2.updates[0]?.noise }));
  await p2.screenshot({ path: `${OUT}/o05-mac-call.png` });
  await p2.click('.hang');
  await p2.waitForSelector('.stamp', { timeout: 30000 });
  check('Mac: report card', /Day 1 complete/.test(await p2.textContent('.stamp')));

  // push-to-talk
  await p2.click('[data-act="go"][data-to="settings"]');
  await p2.waitForSelector('.seg');
  await p2.click('[data-act="set"][data-k="micMode"][data-v="ptt"]');
  await sleep(300);
  await p2.click('[data-act="go"][data-to="home"]');
  await p2.waitForSelector('.hero');
  await p2.click('.mode[data-act="start"][data-mode="free"]');
  await p2.waitForSelector('#ptt');
  await waitFor(async () => /Hi, I am Dinesh/.test(await p2.textContent('#captions')), 15000);
  const before = (await stats(MOCK2)).audioChunks;
  await sleep(1500);
  check('PTT: no mic audio while the button is not held', (await stats(MOCK2)).audioChunks - before === 0);
  const bb = await (await p2.$('#ptt')).boundingBox();
  await p2.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
  const c0 = (await stats(MOCK2)).commits;
  await p2.mouse.down();
  await sleep(1800);
  await p2.mouse.up();
  const ptt = await waitFor(async () => { const s = await stats(MOCK2); return s.commits > c0 && s.clears > 0 ? s : null; }, 6000);
  check('PTT: voice detection off, clear on press, commit + answer on release', !!ptt && ptt.updates.at(-1)?.td === null, ptt ? `commits=${ptt.commits} clears=${ptt.clears}` : '');
  check('PTT: tutor answers the held turn', !!(await waitFor(async () => /Yesterday I went to the market/.test(await p2.textContent('#captions')), 15000)));
  await p2.click('.hang');
  await p2.waitForSelector('.stamp, .hero', { timeout: 30000 });

  // expected browser errors: the deliberate bad key (401) and no-credit key (429)
  const real = errors.filter((e) => !/status of (401|429)/.test(e));
  check('no unexpected console errors', real.length === 0, real.slice(0, 5).join(' | '));
} catch (e) {
  console.log('TEST CRASH', e);
  results.push({ name: 'crash', ok: false });
} finally {
  if (browser) await browser.close();
  for (const p of procs) p.kill('SIGTERM');
  site.close();
  await sleep(300);
  fs.writeFileSync(`${OUT}/server.log`, srvLog);
  fs.writeFileSync(`${OUT}/mock.log`, mockLog);
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} checks passed`);
  process.exit(failed ? 1 : 0);
}
