// End-to-end test of the Groq path (phone edition), offline: mock Groq + Chromium as a Pixel phone with a fake mic.
// The device voice (speechSynthesis) is replaced by a recorder that reports start/end like the real one.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const { chromium, devices } = require(path.join(process.env.GLOBAL_NODE_MODULES, 'playwright'));
const OUT = process.env.SHOTS || '/tmp/pesu-shots-groq';
const SITE = path.join(ROOT, 'docs');
const PORT = 4797;
const MOCK = 9941;
const BASE = `http://localhost:${PORT}/pesu-english/`;
const WAV = '/tmp/pesu-fake-speech.wav';
fs.mkdirSync(OUT, { recursive: true });
if (!fs.existsSync(WAV)) { console.log('run test/e2e.mjs or test/e2e-openai.mjs first (they create the fake speech file)'); process.exit(1); }

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png' };
const site = http.createServer((req, res) => {
  const u = new URL(req.url, BASE);
  let rel = decodeURIComponent(u.pathname.slice('/pesu-english/'.length)) || 'index.html';
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.join(SITE, rel);
  if (!u.pathname.startsWith('/pesu-english/') || !file.startsWith(SITE) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, '127.0.0.1');
const mock = spawn(process.execPath, [path.join(ROOT, 'test/mock-groq.mjs')], { env: { ...process.env, MOCK_PORT: String(MOCK) }, stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const check = (name, ok, extra = '') => { results.push({ name, ok }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? `  (${extra})` : ''}`); };
const stats = async () => (await fetch(`http://127.0.0.1:${MOCK}/__stats`)).json();
// go to a screen: through the hamburger menu on phones, the nav row elsewhere
async function nav(page, to) {
  if (await page.isVisible('.burger')) { await page.click('.burger'); await page.click(`#menu .mitem[data-to="${to}"]`); }
  else await page.click(`.navs [data-to="${to}"]`);
}
async function waitFor(fn, ms, step = 200) {
  const end = Date.now() + ms;
  while (Date.now() < end) { try { const v = await fn(); if (v) return v; } catch { /* retry */ } await sleep(step); }
  return null;
}

let browser;
try {
  await sleep(600);
  browser = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', `--use-file-for-fake-audio-capture=${WAV}`, '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ ...devices['Pixel 7'] });
  await ctx.grantPermissions(['microphone'], { origin: `http://localhost:${PORT}` });
  await ctx.addInitScript((m) => {
    localStorage.setItem('pesu-base-url', m);
    // fake device voice: ~13 characters a second, with start/end events
    window.__spoken = [];
    window.__cut = 0;   // sentences stopped half-way
    const q = [];
    let cur = null;
    let timer = 0;
    const next = () => {
      if (cur || !q.length) return;
      cur = q.shift();
      const u = cur;
      setTimeout(() => {
        if (cur !== u) return;
        window.__spoken.push(u.text);
        if (u.onstart) u.onstart({});
        timer = setTimeout(() => { cur = null; if (u.onend) u.onend({}); next(); }, Math.max(300, u.text.length * 60));
      }, 30);
    };
    window.SpeechSynthesisUtterance = function (t) { this.text = String(t || ''); };
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { getVoices: () => [], cancel: () => { if (cur) window.__cut++; cur = null; clearTimeout(timer); q.length = 0; }, speak: (u) => { q.push(u); next(); } } });
  }, `http://127.0.0.1:${MOCK}`);
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  await page.goto(BASE);
  await page.waitForSelector('#key-in');
  check('setup offers the free Groq key first', /console\.groq\.com\/keys/.test(await page.innerHTML('main')));
  await page.fill('#key-in', 'gsk_bad_' + 'x'.repeat(40));
  await page.click('#key-btn');
  check('bad Groq key rejected', !!(await waitFor(async () => /work aagala/.test(await page.textContent('#key-msg')), 6000)));
  await page.fill('#key-in', 'gsk_test_' + 'a'.repeat(40));
  await page.click('#key-btn');
  await page.waitForSelector('#w-name', { timeout: 8000 });
  const cfg = await page.evaluate(() => JSON.parse(localStorage.getItem('pesu-config-v1') || '{}'));
  check('Groq key saved; provider = groq', cfg.provider === 'groq' && cfg.liveModels[0] === 'openai/gpt-oss-120b');
  await page.click('[data-act="finish-welcome"]');
  await page.waitForSelector('.hero');
  await page.click('.hero [data-act="start"]');
  await page.waitForSelector('#call-av svg');
  check('tutor greets with a question: device voice + question + sample answer on screen', !!(await waitFor(async () => { const T = await page.textContent('#captions'); return /How are you today\?/.test(T) && /I am fine, thank you\./.test(T) && /Naan nalla irukken/.test(T) && (await page.evaluate(() => window.__spoken.join(' '))).includes('Hi Dinesh'); }, 20000)));
  check('"speaking" state while the device voice talks', !!(await waitFor(async () => (await page.getAttribute('#status', 'data-s')) === 'speaking', 8000, 50)));
  const heard = await waitFor(async () => (await stats()).transcriptions.length > 0, 25000);
  check('his speech -> voice detection -> Whisper', !!heard);
  check('tutor answers his voice turn', !!(await waitFor(async () => (await page.evaluate(() => window.__spoken.join(' '))).includes('went to the market yesterday'), 15000)));
  check('correction card on the whiteboard', !!(await waitFor(async () => (await page.$$('#fixes .fix-card')).length > 0, 20000)));
  await page.screenshot({ path: `${OUT}/g01-call.png` });
  // the fake mic keeps talking every few seconds (like his voice + the speaker's echo): the tutor must still finish every sentence
  check('tutor finishes every sentence (mic not listening while she talks)', (await page.evaluate(() => window.__cut)) === 0, `cut=${await page.evaluate(() => window.__cut)} spoken=${await page.evaluate(() => window.__spoken.length)}`);
  const scr = await waitFor(async () => { const t = (await page.textContent('#captions .repeat')) || ''; return /Yesterday I went to the market\./.test(t) ? t : null; }, 15000);
  check('screen shows only the sentence to repeat (not the whole talk)', !!scr && !(await page.$('#captions .cap')), scr || '');
  check('Tamil meaning (Thanglish) under the sentence', !!(await waitFor(async () => /Neththu naan market-ku ponen/.test(await page.textContent('#captions .meaning')), 15000)));
  await page.click('[data-act="chip"][data-k="puriyala"]');
  // (the fake mic keeps talking, so the answer may cover both; what matters is that the tutor got the request)
  check('"Puriyala" request reaches the tutor and it answers', !!(await waitFor(async () => (await stats()).chats.some((x) => x.puriyala), 10000)) && !!(await waitFor(async () => (await page.evaluate(() => window.__spoken.length)) >= 3, 10000)));
  const st = await stats();
  const t = st.transcriptions[0] || {};
  check('Whisper upload: 16 kHz 16-bit WAV, multipart, whisper-large-v3-turbo', t.type === 'multipart/form-data' && t.rate === 16000 && t.bits === 16 && t.model === 'whisper-large-v3-turbo', JSON.stringify(t));
  const c = st.chats.find((x) => x.voiceNotes) || {};
  check('conversation: gpt-oss-120b, low reasoning hidden, voice notes in the prompt', c.model === 'openai/gpt-oss-120b' && c.reasoning_effort === 'low' && c.include_reasoning === false, JSON.stringify(c));
  check('cards: JSON mode on gpt-oss-20b', st.chats.some((x) => x.json === 'json_object' && x.model === 'openai/gpt-oss-20b'));
  await page.click('.hang');
  await page.waitForSelector('.stamp', { timeout: 30000 });
  check('report card + Day 1 complete', /Day 1 complete/.test(await page.textContent('.stamp')));
  await nav(page, 'settings');
  await page.waitForSelector('[data-act="backup"]');
  check('settings show Groq key + phone voice', /Groq API key/.test(await page.textContent('main')) && /Phone-oda voice/.test(await page.textContent('main')));
  const real = errors.filter((e) => !/status of 401/.test(e));
  check('no unexpected console errors', real.length === 0, real.slice(0, 5).join(' | '));
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
