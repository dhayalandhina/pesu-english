// End-to-end test: real app server + offline mock Gemini + headless Chromium with a fake microphone.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const { chromium } = require(path.join(process.env.GLOBAL_NODE_MODULES, 'playwright'));
const OUT = process.env.SHOTS || '/tmp/pesu-shots';
const DATA = '/tmp/pesu-e2e-data';
const PORT = 4790;
const MOCK = 9911;
fs.rmSync(DATA, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

// speech-like test signal for the fake mic: 1.4 s of a voiced "aaa" with syllables, then 2.6 s silence (Chrome loops it)
function makeWav(file) {
  const rate = 48000;
  const n = rate * 4;
  const data = Buffer.alloc(n * 2);
  for (let i = 0; i < n; i++) {
    const t = i / rate;
    let v = 0;
    if (t < 1.4) {
      const f0 = 140 + 12 * Math.sin(2 * Math.PI * 3 * t);
      const syl = Math.max(0, Math.sin(2 * Math.PI * 4 * t)) ** 0.6;
      for (let h = 1; h <= 18; h++) {
        const f = f0 * h;
        const w = Math.exp(-((f - 700) ** 2) / (2 * 180 ** 2)) + 0.7 * Math.exp(-((f - 1200) ** 2) / (2 * 220 ** 2)) + 0.15;
        v += Math.sin(2 * Math.PI * f * t) * w / h ** 0.3;
      }
      v *= 0.12 * syl * Math.min(1, t * 30, (1.4 - t) * 30);
    }
    data.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(v * 32767))), i * 2);
  }
  const hdr = Buffer.alloc(44);
  hdr.write('RIFF', 0); hdr.writeUInt32LE(36 + data.length, 4); hdr.write('WAVE', 8); hdr.write('fmt ', 12);
  hdr.writeUInt32LE(16, 16); hdr.writeUInt16LE(1, 20); hdr.writeUInt16LE(1, 22); hdr.writeUInt32LE(rate, 24);
  hdr.writeUInt32LE(rate * 2, 28); hdr.writeUInt16LE(2, 32); hdr.writeUInt16LE(16, 34); hdr.write('data', 36); hdr.writeUInt32LE(data.length, 40);
  fs.writeFileSync(file, Buffer.concat([hdr, data]));
}
const WAV = '/tmp/pesu-fake-speech.wav';
makeWav(WAV);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const check = (name, ok, extra = '') => { results.push({ name, ok }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? `  (${extra})` : ''}`); };

const mock = spawn(process.execPath, [path.join(ROOT, 'test/mock-gemini.mjs')], { env: { ...process.env, MOCK_PORT: String(MOCK), MOCK_FAIL_FIRST_MODEL: '1', MOCK_GOAWAY_AFTER: '3' }, stdio: ['ignore', 'pipe', 'pipe'] });
let mockLog = '';
mock.stdout.on('data', (d) => { mockLog += d; });
mock.stderr.on('data', (d) => { mockLog += d; });
const srv = spawn(process.execPath, [path.join(ROOT, 'server.mjs'), '--serve', '--no-idle', '--data', DATA, '--port', String(PORT)], { env: { ...process.env, PESU_GEMINI_BASE_URL: `http://127.0.0.1:${MOCK}` }, stdio: ['ignore', 'pipe', 'pipe'] });
let srvLog = '';
srv.stdout.on('data', (d) => { srvLog += d; });
srv.stderr.on('data', (d) => { srvLog += d; });

const mockStats = async () => (await fetch(`http://127.0.0.1:${MOCK}/__stats`)).json();
async function waitFor(fn, ms, step = 200) {
  const end = Date.now() + ms;
  while (Date.now() < end) { try { const v = await fn(); if (v) return v; } catch { /* retry */ } await sleep(step); }
  return null;
}

let browser;
try {
  await waitFor(async () => (await fetch(`http://127.0.0.1:${PORT}/api/ping`)).ok, 8000);
  browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', `--use-file-for-fake-audio-capture=${WAV}`, '--autoplay-policy=no-user-gesture-required'],
  });
  const errors = [];
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, colorScheme: 'light' });
  await ctx.grantPermissions(['microphone', 'camera'], { origin: `http://localhost:${PORT}` });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  await page.goto(`http://localhost:${PORT}/`);

  // ----- setup -----
  await page.waitForSelector('#key-in');
  await page.screenshot({ path: `${OUT}/01-setup.png` });
  await page.fill('#key-in', 'BADKEY_aaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  await page.click('#key-btn');
  const badMsg = await waitFor(async () => { const t = await page.textContent('#key-msg'); return /work aagala/.test(t) ? t : null; }, 6000);
  check('bad API key is rejected with a clear message', !!badMsg, badMsg || '');
  await page.fill('#key-in', 'TESTKEY_aaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  await page.click('#key-btn');
  await page.waitForSelector('#w-name', { timeout: 8000 });
  check('good key saved -> welcome screen', true);
  const cfg = JSON.parse(fs.readFileSync(path.join(DATA, 'config.json'), 'utf8'));
  const mode = (fs.statSync(path.join(DATA, 'config.json')).mode & 0o777).toString(8);
  check('key stored only in local config with private file mode', cfg.apiKey.startsWith('TESTKEY') && mode === '600', `mode ${mode}`);
  await sleep(600);
  await page.screenshot({ path: `${OUT}/02-welcome.png` });
  await page.click('[data-act="finish-welcome"]');
  await page.waitForSelector('.hero');
  await sleep(700);
  await page.screenshot({ path: `${OUT}/03-home.png`, fullPage: true });
  check('home shows Day 1 class', /Day 1/.test(await page.textContent('.hero')));

  // ----- call -----
  await page.click('.hero [data-act="start"]');
  await page.waitForSelector('#call-av svg');
  const greeted = await waitFor(async () => /Hi Dinesh/.test(await page.textContent('#captions')), 15000);
  check('tutor greets first (kickoff) and caption shows it', !!greeted);
  const spoke = await waitFor(async () => (await page.getAttribute('#status', 'data-s')) === 'speaking', 8000, 50);
  check('status shows speaking while tutor audio plays', !!spoke);
  await sleep(500);
  await page.screenshot({ path: `${OUT}/04-call-speaking.png` });
  const mouth = await page.evaluate(() => {
    const paths = [...document.querySelectorAll('#call-av svg path')];
    return paths.map((p) => p.getAttribute('d')).filter((d) => d && d.startsWith('M') && d.includes('Q') && d.includes('Z')).length;
  });
  check('avatar mouth paths are drawn', mouth > 3);
  const userLine = await waitFor(async () => /Yesterday I go to market/.test(await page.textContent('#captions')), 20000);
  check('learner speech reached the tutor (fake mic -> server -> live) and came back as caption', !!userLine);
  const fix = await waitFor(async () => (await page.$$('#fixes .fix-card')).length > 0, 25000);
  check('correction card appears on the whiteboard', !!fix);
  await page.screenshot({ path: `${OUT}/05-call-fix.png` });
  await page.click('[data-act="chip"][data-k="puriyala"]');
  const chipSent = await waitFor(async () => (await mockStats()).texts.some((t) => t.includes("didn't understand")), 6000);
  check('"Puriyala" button sends the instruction to the tutor', !!chipSent);
  const resumed = await waitFor(async () => (await mockStats()).resumes >= 1, 60000);
  check('goAway -> session resumed with handle (call continues)', !!resumed);
  await sleep(2500);
  const st = await mockStats();
  check('model fallback: first model rejected, next one used', st.setups.length >= 2 && st.setups[0].model.endsWith('gemini-3.8-live') && st.setups[1].model.endsWith('gemini-3.1-flash-live-preview'), st.setups.map((s) => s.model.replace('models/', '')).join(' -> '));
  const s1 = st.setups[1] || {};
  check('setup sends system prompt, voice, transcription, VAD patience, compression', s1.hasSystem && s1.voice === 'Sulafat' && s1.inT && s1.outT && s1.cwc && s1.aad && s1.aad.silenceDurationMs === 1200, JSON.stringify(s1.aad));
  check('barge-in: speaking over the tutor interrupts it', st.interrupts >= 1, `interrupts=${st.interrupts}`);
  check('mic audio streamed at 16 kHz chunks', st.audioChunks > 20, `chunks=${st.audioChunks} maxRms=${st.maxRms.toFixed(3)}`);

  // ----- end -> report -----
  await page.click('.hang');
  await page.waitForSelector('.stamp', { timeout: 30000 });
  await sleep(700);
  await page.screenshot({ path: `${OUT}/06-report.png`, fullPage: true });
  check('report card shows Day 1 complete', /Day 1 complete/.test(await page.textContent('.stamp')));
  const data = JSON.parse(fs.readFileSync(path.join(DATA, 'pesu-data.json'), 'utf8'));
  check('progress + memory saved locally', data.progress.daysDone['1'] && data.memory.facts.length > 0 && data.notebook.length > 0 && data.sessions.length === 1);
  const files = fs.readdirSync(path.join(DATA, 'sessions'));
  check('transcript file saved', files.length === 1);

  await page.click('[data-act="go"][data-to="progress"]');
  await page.waitForSelector('.grid30');
  await sleep(300);
  await page.screenshot({ path: `${OUT}/07-progress.png`, fullPage: true });
  await page.click('[data-act="go"][data-to="settings"]');
  await page.waitForSelector('.seg');
  await page.click('[data-act="set"][data-k="micMode"][data-v="ptt"]');
  await sleep(300);
  await page.screenshot({ path: `${OUT}/08-settings.png`, fullPage: true });
  const saved = JSON.parse(fs.readFileSync(path.join(DATA, 'pesu-data.json'), 'utf8'));
  check('settings saved (push-to-talk)', saved.settings.micMode === 'ptt');

  // ----- push-to-talk call, narrow + dark -----
  const ctx2 = await browser.newContext({ viewport: { width: 420, height: 900 }, colorScheme: 'dark' });
  await ctx2.grantPermissions(['microphone', 'camera'], { origin: `http://localhost:${PORT}` });
  const p2 = await ctx2.newPage();
  p2.on('console', (m) => { if (m.type() === 'error') errors.push(`[p2] ${m.text()}`); });
  p2.on('pageerror', (e) => errors.push(`[p2] pageerror: ${e.message}`));
  await p2.goto(`http://localhost:${PORT}/`);
  await p2.waitForSelector('.hero');
  await sleep(500);
  await p2.screenshot({ path: `${OUT}/09-home-dark-narrow.png`, fullPage: true });
  await p2.click('.mode[data-act="start"][data-mode="free"]');
  await p2.waitForSelector('#ptt');
  await waitFor(async () => /Hi Dinesh/.test(await p2.textContent('#captions')), 15000);
  const before = (await mockStats()).audioChunks;
  await sleep(1500);
  const idle = (await mockStats()).audioChunks - before;
  check('push-to-talk: no mic audio sent while button is not held', idle === 0, `chunks=${idle}`);
  const box = await p2.$('#ptt');
  const bb = await box.boundingBox();
  await p2.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
  await p2.mouse.down();
  await sleep(1800);
  await p2.screenshot({ path: `${OUT}/10-call-ptt-dark-narrow.png`, fullPage: true });
  await p2.mouse.up();
  const sentWhileHeld = (await mockStats()).audioChunks - before;
  check('push-to-talk: audio sent while holding the button', sentWhileHeld > 10, `chunks=${sentWhileHeld}`);
  const setup2 = (await mockStats()).setups.at(-1);
  check('push-to-talk: automatic voice detection disabled in setup', setup2 && setup2.aad && setup2.aad.disabled === true);
  await p2.click('.hang');
  await p2.waitForSelector('.stamp, .hero', { timeout: 30000 });

  check('no console errors in the app', errors.length === 0, errors.slice(0, 5).join(' | '));
} catch (e) {
  console.log('TEST CRASH', e);
  results.push({ name: 'crash', ok: false });
} finally {
  if (browser) await browser.close();
  srv.kill('SIGTERM');
  mock.kill('SIGTERM');
  await sleep(300);
  fs.writeFileSync(`${OUT}/server.log`, srvLog);
  fs.writeFileSync(`${OUT}/mock.log`, mockLog);
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} checks passed`);
  process.exit(failed ? 1 : 0);
}
