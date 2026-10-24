# Pesu English

Video call madhiri spoken English teacher, Tamil pesuravangalukku. Neenga pesunga, teacher (Priya miss / Arun sir) kettu voice-la pathil sollum, idaiyila pesunaalum kettukkum, thappu-va whiteboard-la sari pannum, puriyalana Tamil-la solli tharum. 30 naal course + free talk + role-play + doubt mode. Teacher munnaadi pesinadha nyaabagam vechu pesum.

Voice + brain: Google Gemini Live (`gemini-3.8-live`, free API key from https://aistudio.google.com/apikey).

## Two editions, same screens

| Edition | Where it runs | Key & data |
|---|---|---|
| **Phone (web app)** — `docs/` | Any HTTPS static host (GitHub Pages). Open on the phone → "Add to Home screen". | Key + progress stay in that phone's browser; audio goes only to Google. |
| **Mac / PC app** — `server.mjs` | Local Node server + Chrome app window (`packaging/build-mac.sh` makes `Pesu English.app` with bundled Node). | `~/Library/Application Support/Pesu English` (key file is mode 600). |

## Phone setup (once)

1. Open the hosted link on the phone (Chrome on Android, Safari on iPhone).
2. Paste the free Gemini key → **Save & check** → name/teacher → **Seri, aarambippom**.
3. Chrome menu → **Add to Home screen** (iPhone: Share → Add to Home Screen).
4. Another phone: Settings → **Vera phone-ku setup link copy** → send it privately (the link contains the key).
5. Settings → **Backup download / Restore** to move progress between phones.

## Develop

```bash
npm install
npm run serve                       # local server on http://localhost:4747 (no auto-shutdown)
node packaging/build-web.mjs        # rebuild the phone edition into docs/
bash packaging/build-mac.sh dist    # Mac app + zip (downloads Node, checks SHA256)
```

Tests (offline: mock Gemini + headless Chromium with a fake mic):

```bash
GLOBAL_NODE_MODULES=$(npm root -g) node test/e2e.mjs       # Mac/PC app, 23 checks
GLOBAL_NODE_MODULES=$(npm root -g) node test/e2e-web.mjs   # phone edition, 22 checks
node test/translit.test.mjs                                 # Tamil -> Thanglish captions
```

## Layout

- `public/core/` — shared: tutor prompts, call logic (`bridge.js`), data model
- `public/web/` — phone edition: direct Gemini Live WebSocket + REST, browser storage
- `public/` — screens, talking avatar, audio worklets, 30-day course data
- `lib/`, `server.mjs` — Mac/PC local server (official `@google/genai` SDK)

Free Gemini plan: Google may use the conversations to improve its products. Turn on billing in AI Studio if that matters.
