#!/usr/bin/env node
// Pesu English: local server + launcher.
//   node server.mjs            -> start (or reuse) the background server and open the app window
//   node server.mjs --serve    -> run the server in the foreground (used by the launcher)
// Options: --data <dir>  --no-open  --no-idle  --port <n>
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { WebSocketServer } from 'ws';
import { Store, resolveDataDir } from './lib/store.mjs';
import { makeAI, validateKey } from './lib/textai.mjs';
import { createServerBridge } from './lib/live.mjs';
import { openWindow } from './lib/launch.mjs';
import { lessonById, sceneById } from './lib/prompts.mjs';
import { computeState as computeCoreState, applySettingsPatch, migrateData, setApiKey } from './public/core/state.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(ROOT, 'public');
const VERSION = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version;
const FIRST_PORT = 4747;
const IDLE_MS = 4 * 60 * 1000;

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(n);
const opt = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : undefined; };

const store = new Store(resolveDataDir(opt('--data')));

function log(...a) {
  const line = `[${new Date().toISOString()}] ${a.map((x) => (typeof x === 'string' ? x : JSON.stringify(x))).join(' ')}`;
  console.log(line);
}

function ping(port) {
  return new Promise((resolve) => {
    const req = http.get({ host: '127.0.0.1', port, path: '/api/ping', timeout: 900 }, (res) => {
      let s = '';
      res.on('data', (d) => { s += d; });
      res.on('end', () => { try { resolve(JSON.parse(s).app === 'pesu-english'); } catch { resolve(false); } });
    });
    req.on('timeout', () => { req.destroy(); resolve(false); });
    req.on('error', () => resolve(false));
  });
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const appUrl = (port) => `http://localhost:${port}/`;

// ---------------- launcher ----------------
async function launch() {
  const inst = store.readInstance();
  if (inst && inst.port && (await ping(inst.port))) {
    if (!flag('--no-open')) openWindow(appUrl(inst.port));
    return;
  }
  try { if (fs.existsSync(store.logFile) && fs.statSync(store.logFile).size > 2_000_000) fs.truncateSync(store.logFile, 0); } catch { /* ignore */ }
  const logFd = fs.openSync(store.logFile, 'a');
  const args = [path.join(ROOT, 'server.mjs'), '--serve'];
  if (opt('--data')) args.push('--data', opt('--data'));
  if (opt('--port')) args.push('--port', opt('--port'));
  const child = spawn(process.execPath, args, { detached: true, stdio: ['ignore', logFd, logFd], windowsHide: true, env: process.env });
  child.unref();
  for (let i = 0; i < 80; i++) {
    await sleep(150);
    const it = store.readInstance();
    if (it && it.pid === child.pid && (await ping(it.port))) {
      if (!flag('--no-open')) openWindow(appUrl(it.port));
      return;
    }
  }
  console.error(`Pesu English server start aagala. Log file: ${store.logFile}`);
  process.exitCode = 1;
}

// ---------------- server ----------------
function serve() {
  let port = Number(opt('--port')) || FIRST_PORT;
  const live = new Set();
  const presence = new Set();
  let lastActive = Date.now();
  let ai = null;
  let aiKey = '';
  const getAI = () => {
    if (!store.cfg.apiKey) return null;
    if (!ai || aiKey !== store.cfg.apiKey) { ai = makeAI(store.cfg.apiKey); aiKey = store.cfg.apiKey; }
    return ai;
  };

  const hostOk = (req) => {
    const h = String(req.headers.host || '').toLowerCase();
    return h === `localhost:${port}` || h === `127.0.0.1:${port}`;
  };
  const originOk = (req) => {
    const o = req.headers.origin;
    if (!o) return true;
    return o === `http://localhost:${port}` || o === `http://127.0.0.1:${port}`;
  };

  const MIME = {
    '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json',
    '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.wav': 'audio/wav',
  };

  function sendJSON(res, code, obj) {
    const body = JSON.stringify(obj);
    res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    res.end(body);
  }

  function readBody(req) {
    return new Promise((resolve, reject) => {
      let size = 0;
      const chunks = [];
      req.on('data', (c) => { size += c.length; if (size > 65536) { reject(new Error('too big')); req.destroy(); } else chunks.push(c); });
      req.on('end', () => { try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); } catch { reject(new Error('bad json')); } });
      req.on('error', reject);
    });
  }

  const computeState = () => computeCoreState(store.data, store.cfg, { version: VERSION, mode: 'server', dataDir: store.dir });

  async function api(req, res, url) {
    const p = url.pathname;
    if (req.method === 'GET' && p === '/api/ping') return sendJSON(res, 200, { app: 'pesu-english', version: VERSION });
    if (req.method === 'GET' && p === '/api/state') return sendJSON(res, 200, computeState());
    if (req.method !== 'POST') return sendJSON(res, 405, { error: 'method' });
    if (!originOk(req)) return sendJSON(res, 403, { error: 'origin' });
    let body;
    try { body = await readBody(req); } catch { return sendJSON(res, 400, { error: 'body' }); }

    if (p === '/api/key') {
      const key = String(body.apiKey || '').trim();
      if (!/^[A-Za-z0-9_\-.]{20,300}$/.test(key)) return sendJSON(res, 200, { ok: false, kind: 'format' });
      const v = await validateKey(key);
      if (!v.ok) return sendJSON(res, 200, { ok: false, kind: v.kind, detail: v.detail });
      setApiKey(store.cfg, key);
      store.saveConfig();
      log('API key saved');
      return sendJSON(res, 200, { ok: true, state: computeState() });
    }
    if (p === '/api/settings') {
      applySettingsPatch(store.data, body);
      store.save();
      return sendJSON(res, 200, { ok: true, state: computeState() });
    }
    if (p === '/api/import') {
      if (!body || typeof body.data !== 'object' || !body.data || !body.data.progress) return sendJSON(res, 200, { ok: false });
      store.data = migrateData(body.data);
      store.save();
      return sendJSON(res, 200, { ok: true, state: computeState() });
    }
    if (p === '/api/export') {
      return sendJSON(res, 200, { ok: true, data: store.data });
    }
    if (p === '/api/reset') {
      store.resetProgress();
      return sendJSON(res, 200, { ok: true, state: computeState() });
    }
    if (p === '/api/forget-key') {
      setApiKey(store.cfg, '');
      store.saveConfig();
      return sendJSON(res, 200, { ok: true, state: computeState() });
    }
    return sendJSON(res, 404, { error: 'not found' });
  }

  function serveStatic(req, res, url) {
    let rel = decodeURIComponent(url.pathname);
    if (rel === '/' || rel === '') rel = '/index.html';
    const file = path.normalize(path.join(PUBLIC, rel));
    if (!file.startsWith(PUBLIC + path.sep)) { res.writeHead(403); res.end(); return; }
    fs.stat(file, (err, st) => {
      if (err || !st.isFile()) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found'); return; }
      res.writeHead(200, {
        'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer',
      });
      fs.createReadStream(file).pipe(res);
    });
  }

  const server = http.createServer((req, res) => {
    if (!hostOk(req)) { res.writeHead(421); res.end('Misdirected'); return; }
    lastActive = Date.now();
    const url = new URL(req.url, `http://localhost:${port}`);
    if (url.pathname.startsWith('/api/')) {
      api(req, res, url).catch((e) => { log('api error', e?.message); sendJSON(res, 500, { error: 'server' }); });
      return;
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); res.end(); return; }
    serveStatic(req, res, url);
  });

  const wss = new WebSocketServer({ noServer: true, maxPayload: 1024 * 1024 });
  server.on('upgrade', (req, socket, head) => {
    if (!hostOk(req) || !originOk(req)) { socket.destroy(); return; }
    const url = new URL(req.url, `http://localhost:${port}`);
    if (url.pathname !== '/ws/live' && url.pathname !== '/ws/presence') { socket.destroy(); return; }
    wss.handleUpgrade(req, socket, head, (ws) => onSocket(ws, url));
  });

  function onSocket(ws, url) {
    lastActive = Date.now();
    if (url.pathname === '/ws/presence') {
      presence.add(ws);
      ws.on('message', () => { lastActive = Date.now(); });
      ws.on('close', () => { presence.delete(ws); lastActive = Date.now(); });
      ws.on('error', () => {});
      return;
    }
    const client = getAI();
    if (!client) { ws.send(JSON.stringify({ t: 'error', kind: 'nokey' })); ws.close(1000); return; }
    const mode = ['lesson', 'free', 'role', 'doubt'].includes(url.searchParams.get('mode')) ? url.searchParams.get('mode') : 'free';
    const params = { mode };
    if (mode === 'lesson') { const day = Number(url.searchParams.get('day')); params.day = lessonById(day) ? day : 1; }
    if (mode === 'role') { const sc = url.searchParams.get('scene'); params.scene = sceneById(sc) ? sc : 'friend'; }
    const bridge = createServerBridge({
      ai: client, store, ws, params, log: (...a) => log('[call]', ...a),
      onFinished: (b) => { live.delete(b); lastActive = Date.now(); },
    });
    bridge.ws = ws;
    live.add(bridge);
    ws.on('message', (data, isBinary) => {
      lastActive = Date.now();
      if (isBinary) bridge.audioIn(Buffer.from(data).toString('base64'));
      else bridge.clientMessage(String(data));
    });
    ws.on('close', () => bridge.clientClosed());
    ws.on('error', () => {});
    log(`[call] start mode=${mode}${params.day ? ` day=${params.day}` : ''}${params.scene ? ` scene=${params.scene}` : ''}`);
    bridge.start();
  }

  function shutdown(code = 0) {
    store.clearInstance(process.pid);
    for (const b of live) { try { b.ws.close(); } catch { /* ignore */ } }
    server.close();
    setTimeout(() => process.exit(code), 300).unref();
  }
  process.on('SIGINT', () => shutdown(0));
  process.on('SIGTERM', () => shutdown(0));

  if (!flag('--no-idle')) {
    setInterval(() => {
      if (presence.size || live.size) { lastActive = Date.now(); return; }
      if (Date.now() - lastActive > IDLE_MS) { log('idle, shutting down'); shutdown(0); }
    }, 20000).unref();
  }

  const tryListen = (attempt) => {
    const onErr = (e) => {
      if (e.code === 'EADDRINUSE' && attempt < 10) { port += 1; tryListen(attempt + 1); return; }
      log('listen failed', e.message);
      process.exit(1);
    };
    server.once('error', onErr);
    server.listen(port, '127.0.0.1', () => {
      server.removeListener('error', onErr);
      server.on('error', (e) => log('server error', e.message));
      store.writeInstance({ port, pid: process.pid, started: new Date().toISOString(), version: VERSION });
      log(`Pesu English ${VERSION} running at ${appUrl(port)} (data: ${store.dir})`);
    });
  };
  tryListen(0);
}

if (flag('--serve')) serve();
else launch();
