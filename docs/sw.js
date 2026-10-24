// Phone edition: lets the app open fast and install like an app. Always tries the network first
// (so updates arrive right away) and falls back to the saved copy when offline.
const CACHE = 'pesu-english-20261024110621';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    try {
      const res = await fetch(req);
      if (res.ok) { const c = await caches.open(CACHE); c.put(req, res.clone()); }
      return res;
    } catch {
      const hit = await caches.match(req, { ignoreSearch: true });
      if (hit) return hit;
      if (req.mode === 'navigate') { const home = await caches.match('./index.html') || await caches.match('./'); if (home) return home; }
      throw new Error('offline');
    }
  })());
});
