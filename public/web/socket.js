// A WebSocket-shaped object for the call screen that runs the tutor call inside the page
// (phone edition), so the call screen code is the same as the Mac/PC app.
import { TutorBridge } from '../core/bridge.js';

function abToB64(buf) {
  const u8 = buf instanceof ArrayBuffer ? new Uint8Array(buf) : new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  let s = '';
  for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
  return btoa(s);
}
function b64ToAb(b64) {
  const s = atob(b64);
  const u8 = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) u8[i] = s.charCodeAt(i);
  return u8.buffer;
}

export class DirectSocket {
  constructor({ params, store, ai }) {
    this.readyState = 0;
    this.binaryType = 'arraybuffer';
    this.onmessage = null;
    this.onclose = null;
    this.onerror = null;
    this.onopen = null;
    const emit = (data) => { if (this.readyState === 1 && this.onmessage) this.onmessage({ data }); };
    this.bridge = new TutorBridge({
      params,
      store,
      connectLive: ai.connectLive,
      genJSON: ai.genJSON,
      log: (...a) => { if (localStorage.getItem('pesu-debug')) console.log('[pesu]', ...a); },
      out: {
        json: (obj) => emit(JSON.stringify(obj)),
        audio: (b64) => emit(b64ToAb(b64)),
        close: () => this.#closed(1000),
      },
    });
    setTimeout(() => {
      this.readyState = 1;
      if (this.onopen) this.onopen({});
      this.bridge.start();
    }, 0);
  }

  send(data) {
    if (this.readyState !== 1) return;
    if (typeof data === 'string') this.bridge.clientMessage(data);
    else this.bridge.audioIn(abToB64(data));
  }

  close() {
    if (this.readyState >= 2) return;
    this.bridge.clientClosed();
    this.#closed(1000);
  }

  #closed(code) {
    if (this.readyState === 3) return;
    this.readyState = 3;
    setTimeout(() => { if (this.onclose) this.onclose({ code }); }, 0);
  }
}
