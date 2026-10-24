// Smoke test for a built bundle: runs its server against the mock, validates a key, makes a short call.
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const APPDIR = process.argv[2];
const require = createRequire(path.join(APPDIR, 'server.mjs'));
const WebSocket = require('ws');
const PORT = 4811;
const DATA = '/tmp/pesu-smoke-data';
fs.rmSync(DATA, { recursive: true, force: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const mock = spawn(process.execPath, [path.resolve('test/mock-gemini.mjs')], { env: { ...process.env, MOCK_PORT: '9912' }, stdio: 'ignore' });
const srv = spawn(process.execPath, [path.join(APPDIR, 'server.mjs'), '--serve', '--no-idle', '--data', DATA, '--port', String(PORT)], { env: { ...process.env, PESU_GEMINI_BASE_URL: 'http://127.0.0.1:9912' }, stdio: 'inherit' });
let ok = true;
try {
  await sleep(1500);
  const r = await (await fetch(`http://localhost:${PORT}/api/key`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: `http://localhost:${PORT}` }, body: JSON.stringify({ apiKey: 'TESTKEY_aaaaaaaaaaaaaaaaaaaaaaaaaaaa' }) })).json();
  console.log('key accepted:', r.ok);
  ok = ok && r.ok;
  const ws = new WebSocket(`ws://localhost:${PORT}/ws/live?mode=lesson&day=3`, { headers: { Origin: `http://localhost:${PORT}` } });
  let ready = false; let audio = 0; let out = ''; let summary;
  ws.on('message', (d, bin) => {
    if (bin) { audio += d.length; return; }
    const m = JSON.parse(String(d));
    if (m.t === 'status' && m.s === 'ready') ready = true;
    if (m.t === 'out') out += m.text;
    if (m.t === 'summary') summary = m.data;
  });
  await sleep(4500);
  ws.send(JSON.stringify({ t: 'end' }));
  await sleep(1500);
  console.log('ready:', ready, '| audio bytes:', audio, '| tutor said:', out.trim());
  console.log('summary (null for a call where he did not speak):', summary === null ? 'null' : typeof summary);
  ok = ok && ready && audio > 10000 && /Hi Dinesh/.test(out) && summary !== undefined;
} catch (e) { console.log('error', e); ok = false; }
srv.kill('SIGTERM'); mock.kill('SIGTERM');
console.log(ok ? 'BUNDLE SMOKE: PASS' : 'BUNDLE SMOKE: FAIL');
process.exit(ok ? 0 : 1);
