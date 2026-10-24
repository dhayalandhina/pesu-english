// Opens the app in its own window (Chrome / Edge "app mode": no tabs, no address bar).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

function trySpawn(bins, args) {
  for (const bin of bins) {
    if (!bin) continue;
    try {
      if (!fs.existsSync(bin)) continue;
      const child = spawn(bin, args, { detached: true, stdio: 'ignore' });
      child.on('error', () => {});
      child.unref();
      return true;
    } catch { /* try next */ }
  }
  return false;
}

export function openWindow(url) {
  const args = [`--app=${url}`, '--window-size=1240,860', '--no-first-run', '--no-default-browser-check'];
  const home = os.homedir();
  if (process.platform === 'darwin') {
    const names = ['Google Chrome', 'Microsoft Edge', 'Brave Browser', 'Chromium', 'Vivaldi'];
    const bins = names.flatMap((n) => [`/Applications/${n}.app/Contents/MacOS/${n}`, `${home}/Applications/${n}.app/Contents/MacOS/${n}`]);
    if (trySpawn(bins, args)) return 'app-window';
    spawn('open', [url], { detached: true, stdio: 'ignore' }).unref();
    return 'browser';
  }
  if (process.platform === 'win32') {
    const pf = process.env.ProgramFiles;
    const pf86 = process.env['ProgramFiles(x86)'];
    const la = process.env.LOCALAPPDATA;
    const bins = [
      [pf, 'Google/Chrome/Application/chrome.exe'], [pf86, 'Google/Chrome/Application/chrome.exe'], [la, 'Google/Chrome/Application/chrome.exe'],
      [pf86, 'Microsoft/Edge/Application/msedge.exe'], [pf, 'Microsoft/Edge/Application/msedge.exe'],
    ].filter(([a]) => a).map(([a, b]) => path.join(a, b));
    if (trySpawn(bins, args)) return 'app-window';
    spawn('cmd', ['/c', 'start', '', url], { detached: true, stdio: 'ignore', windowsHide: true }).unref();
    return 'browser';
  }
  const bins = ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge', '/snap/bin/chromium'];
  if (trySpawn(bins, args)) return 'app-window';
  spawn('xdg-open', [url], { detached: true, stdio: 'ignore' }).unref();
  return 'browser';
}
