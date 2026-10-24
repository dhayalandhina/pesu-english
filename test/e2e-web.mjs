// End-to-end test of the PHONE edition: static site (docs/) + mock Gemini (CORS) + Chromium as a Pixel phone with a fake mic.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const { chromium, devices } = require(path.join(process.env.GLOBAL_NODE_MODULES, 'playwright'));
const OUT = process.env.SHOTS || '/tmp/pesu-shots-web';
const SITE = path.join(ROOT, 'docs');
const PORT = 4795;
const MOCK = 9913;
const BASE = `http://localhost:${PORT}/pesu-english/`; // same sub-path shape as GitHub Pages
fs.mkdirSync(OUT, { recursive: true });
const WAV = '/tmp/pesu-fake-speech.wav'; // made by test/e2e.mjs
if (!fs.existsSync(WAV)) { console.log('run test/e2e.mjs first (it creates the fake speech file)'); process.exit(1); }

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
}).listen(PORT, '127.0.0.1');

const mock = spawn(process.execPath, [path.join(ROOT, 'test/mock-gemini.mjs')], { env: { ...process.env, MOCK_PORT: String(MOCK), MOCK_GOAWAY_AFTER: '3' }, stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const check = (name, ok, extra = '') => { results.push({ name, ok }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? `  (${extra})` : ''}`); };
const mockStats = async () => (await fetch(`http://127.0.0.1:${MOCK}/__stats`)).json();
async function waitFor(fn, ms, step = 200) {
  const end = Date.now() + ms;
  while (Date.now() < end) { try { const v = await fn(); if (v) return v; } catch { /* retry */ } await sleep(step); }
  return null;
}

let browser;
try {
  await sleep(800);
  browser = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', `--use-file-for-fake-audio-capture=${WAV}`, '--autoplay-policy=no-user-gesture-required'] });
  const phone = devices['Pixel 7'];
  const errors = [];
  const mk = async (scheme = 'light') => {
    const ctx = await browser.newContext({ ...phone, colorScheme: scheme });
    await ctx.grantPermissions(['microphone', 'camera'], { origin: `http://localhost:${PORT}` });
    await ctx.addInitScript((m) => { localStorage.setItem('pesu-base-url', m); }, `http://127.0.0.1:${MOCK}`);
    const page = await ctx.newPage();
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
    return { ctx, page };
  };

  const { page } = await mk();
  await page.goto(BASE);
  await page.waitForSelector('#key-in');
  check('phone edition loads under a sub-path (GitHub Pages shape)', true);
  const setupText = await page.textContent('main');
  check('setup says the key stays on this phone', /phone/.test(setupText));
  await page.screenshot({ path: `${OUT}/w01-setup.png` });
  await page.fill('#key-in', 'BADKEY_aaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  await page.click('#key-btn');
  check('bad key rejected (browser -> Gemini REST)', !!(await waitFor(async () => /work aagala/.test(await page.textContent('#key-msg')), 6000)));
  await page.fill('#key-in', 'TESTKEY_aaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  await page.click('#key-btn');
  await page.waitForSelector('#w-name', { timeout: 8000 });
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('pesu-config-v1') || '{}').apiKey || '');
  check('key saved in this browser only', stored.startsWith('TESTKEY'));
  await page.click('[data-act="finish-welcome"]');
  await page.waitForSelector('.hero');
  await sleep(600);
  await page.screenshot({ path: `${OUT}/w02-home.png`, fullPage: true });
  const audioMode = await page.evaluate(() => JSON.parse(localStorage.getItem('pesu-data-v1')).settings.audioMode);
  check('phone defaults to loudspeaker mode', audioMode === 'speaker', audioMode);
  const sw = await waitFor(async () => page.evaluate(async () => !!(await navigator.serviceWorker.getRegistration())), 6000);
  check('installable: service worker registered', !!sw);
  const manifestOk = await page.evaluate(async () => { const r = await fetch('manifest.webmanifest'); const m = await r.json(); return m.icons.some((i) => i.purpose === 'maskable') && m.start_url === '.'; });
  check('installable: manifest with maskable icon', manifestOk);

  // ----- call straight from the phone page -----
  await page.click('.hero [data-act="start"]');
  await page.waitForSelector('#call-av svg');
  check('tutor greets first (direct Live API from the browser)', !!(await waitFor(async () => /Hi Dinesh/.test(await page.textContent('#captions')), 15000)));
  check('speaking state while tutor audio plays', !!(await waitFor(async () => (await page.getAttribute('#status', 'data-s')) === 'speaking', 8000, 50)));
  await sleep(400);
  await page.screenshot({ path: `${OUT}/w03-call.png` });
  check('learner speech reached the tutor and came back as caption', !!(await waitFor(async () => /Yesterday I go to market/.test(await page.textContent('#captions')), 25000)));
  check('correction card on the whiteboard (browser -> text model)', !!(await waitFor(async () => (await page.$$('#fixes .fix-card')).length > 0, 25000)));
  await page.click('[data-act="chip"][data-k="puriyala"]');
  check('"Puriyala" sent to the tutor', !!(await waitFor(async () => (await mockStats()).texts.some((t) => t.includes("didn't understand")), 6000)));
  check('goAway -> session resumed from the browser', !!(await waitFor(async () => (await mockStats()).resumes >= 1, 30000)));
  const st = await mockStats();
  const s0 = st.setups[0] || {};
  check('browser setup message: system prompt, voice, transcripts, VAD, compression, model', s0.model === 'models/gemini-3.8-live' && s0.hasSystem && s0.voice === 'Sulafat' && s0.inT && s0.outT && s0.cwc && s0.aad && s0.aad.startOfSpeechSensitivity === 'START_SENSITIVITY_LOW', JSON.stringify(s0.aad));
  check('mic audio streamed from the phone page', st.audioChunks > 20, `chunks=${st.audioChunks}`);
  await page.screenshot({ path: `${OUT}/w04-call-fix.png`, fullPage: true });
  await page.click('.hang');
  await page.waitForSelector('.stamp', { timeout: 30000 });
  await sleep(600);
  await page.screenshot({ path: `${OUT}/w05-report.png`, fullPage: true });
  check('report card + Day 1 complete', /Day 1 complete/.test(await page.textContent('.stamp')));
  const data = await page.evaluate(() => JSON.parse(localStorage.getItem('pesu-data-v1')));
  check('progress, memory, notebook saved in the phone', data.progress.daysDone['1'] && data.memory.facts.length > 0 && data.notebook.length > 0 && data.sessions.length === 1);
  await page.click('[data-act="go"][data-to="settings"]');
  await page.waitForSelector('[data-act="backup"]');
  await sleep(300);
  await page.screenshot({ path: `${OUT}/w06-settings.png`, fullPage: true });
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 8000 }), page.click('[data-act="backup"]')]);
  const dlPath = path.join(OUT, 'backup.json');
  await dl.saveAs(dlPath);
  const backup = JSON.parse(fs.readFileSync(dlPath, 'utf8'));
  check('backup download contains progress', !!(backup.progress && backup.progress.daysDone['1']));

  // ----- setup link on a second phone + restore backup -----
  const { page: p2 } = await mk('dark');
  await p2.goto(`${BASE}#k=${encodeURIComponent('TESTKEY_bbbbbbbbbbbbbbbbbbbbbbbbbbbb')}`);
  await p2.waitForSelector('#w-name', { timeout: 10000 });
  check('setup link (#k=) sets the key on a new phone', true);
  check('key removed from the address bar after setup', !(await p2.evaluate(() => location.hash)));
  await p2.click('[data-act="finish-welcome"]');
  await p2.waitForSelector('.hero');
  await p2.click('[data-act="go"][data-to="settings"]');
  await p2.waitForSelector('#restore-file', { state: 'attached' });
  await p2.setInputFiles('#restore-file', dlPath);
  await p2.waitForSelector('.hero', { timeout: 8000 });
  await sleep(500);
  const restored = await p2.evaluate(() => JSON.parse(localStorage.getItem('pesu-data-v1')).progress.daysDone['1']);
  check('restore on the new phone brings back progress', !!restored);
  await p2.screenshot({ path: `${OUT}/w07-home-dark-restored.png`, fullPage: true });

  // the only expected browser error is the 400 from the deliberate bad-key check above
  const real = errors.filter((e) => !/status of 400/.test(e));
  check('no console errors (besides the deliberate bad-key 400)', real.length === 0 && errors.length <= 1, errors.slice(0, 5).join(' | '));
} catch (e) {
  console.log('TEST CRASH', e);
  results.push({ name: 'crash', ok: false });
} finally {
  if (browser) await browser.close();
  mock.kill('SIGTERM');
  site.close();
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} checks passed`);
  process.exit(failed ? 1 : 0);
}
