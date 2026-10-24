// Builds the phone edition (static site) into ./docs for GitHub Pages:
// same screens as the Mac app, but the call runs in the page and talks to Gemini directly.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'public');
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'docs'));

fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(SRC, OUT, { recursive: true });

const build = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
const index = path.join(OUT, 'index.html');
let html = fs.readFileSync(index, 'utf8');
html = html.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<meta name="pesu-mode" content="web">');
fs.writeFileSync(index, html);
const sw = path.join(OUT, 'sw.js');
fs.writeFileSync(sw, fs.readFileSync(sw, 'utf8').replace('__BUILD__', build));
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
console.log(`phone edition built in ${OUT} (build ${build})`);
