# Pesu English

Video call madhiri spoken English teacher, Tamil pesuravangalukku. Neenga pesunga, teacher (Priya miss / Arun sir) kettu voice-la pathil sollum, idaiyila pesunaalum kettukkum, thappu-va whiteboard-la sari pannum, puriyalana Tamil-la solli tharum. 30 naal course + free talk + role-play + doubt mode. Teacher munnaadi pesinadha nyaabagam vechu pesum.

Voice + brain, picked by the key you paste:

- **Groq** (`gsk_…`, free key from https://console.groq.com/keys): `whisper-large-v3-turbo` hears him, `openai/gpt-oss-120b` answers
  (Qwen / gpt-oss-20b fallbacks), the device's own voice speaks. Free tier is about one class a day.

- **OpenAI** (`sk-…`, https://platform.openai.com/api-keys, needs account credit): Realtime `gpt-realtime-2.1-mini` (voice, 24 kHz), `gpt-transcribe` (his words), `gpt-6-luna` (cards + report).
- **Gemini** (`AIza…`, free key from https://aistudio.google.com/apikey): Gemini Live `gemini-3.8-live` + flash models.

## Two editions, same screens

| Edition | Where it runs | Key & data |
|---|---|---|
| **Phone (web app)** — `docs/` | Any HTTPS static host (GitHub Pages). Open on the phone → "Add to Home screen". | Key + progress stay in that phone's browser; audio goes only to Google. |
| **Mac / PC app** — `server.mjs` | Local Node server + Chrome app window (`packaging/build-mac.sh` makes `Pesu English.app` with bundled Node). | `~/Library/Application Support/Pesu English` (key file is mode 600). |

## Android app (APK)

`android/` is a small WebView shell (no Gradle) that opens the hosted phone edition full screen and adds what a browser
normally gives it: mic/camera permission, screen kept on during a call, Android text-to-speech for the "listen" buttons,
backup to Downloads and the restore file picker. The app updates itself with the site; a new APK is only needed if `android/` changes.

```bash
ANDROID_BUILD_TOOLS=<build-tools/36> ANDROID_JAR=<platforms/android-35/android.jar> \
APK_KEYSTORE=<your .jks> APK_KS_PASS=<password> bash packaging/build-apk.sh dist
```

Install: copy `Pesu-English.apk` to the phone → open it → allow "Install unknown apps" for that file manager/WhatsApp → Install.

## What the call screen shows

Not the whole conversation: only what he should say back. When the tutor says "Repeat after me: …" the sentence appears big with its Tamil meaning and the key words (Tamil + Thanglish); when she asks a question, the question's meaning and a sample answer (English + Tamil + Thanglish) appear. The **Words** screen has 371 words in three levels with Tamil script, Thanglish, an example and a listen button; **Tips** explains how to learn step by step.

## Phone setup (once)

1. Open the hosted link on the phone (Chrome on Android, Safari on iPhone).
2. Paste the OpenAI key (or a Gemini key) → **Save & check** → name/teacher → **Seri, aarambippom**.
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

Tests (offline: mock Gemini / mock OpenAI + headless Chromium with a fake mic):

```bash
GLOBAL_NODE_MODULES=$(npm root -g) node test/e2e.mjs         # Mac/PC app on Gemini, 23 checks
GLOBAL_NODE_MODULES=$(npm root -g) node test/e2e-web.mjs     # phone edition on Gemini, 22 checks
GLOBAL_NODE_MODULES=$(npm root -g) node test/e2e-openai.mjs  # phone + Mac on OpenAI, 28 checks
GLOBAL_NODE_MODULES=$(npm root -g) node test/e2e-groq.mjs    # phone edition on Groq, 15 checks
node test/translit.test.mjs                                 # Tamil -> Thanglish captions
```

## Layout

- `public/core/` — shared: tutor prompts, call logic (`bridge.js`), data model, OpenAI Realtime adapter (`openai.js`), Groq pipeline (`groq.js`)
- `public/web/` — phone edition: direct Gemini Live WebSocket + REST, browser storage
- `public/` — screens, talking avatar, audio worklets, 30-day course data
- `lib/`, `server.mjs` — Mac/PC local server (official `@google/genai` SDK)

Free Gemini plan: Google may use the conversations to improve its products. Turn on billing in AI Studio if that matters.
OpenAI: pay-as-you-go from the account's credit balance; the key stays on the device and goes only to OpenAI.
