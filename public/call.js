// A live call: mic -> local server -> tutor, tutor voice -> speakers. Emits events for the UI.
const BARGE_RMS = 0.06;      // speaker mode: how loud he must speak to interrupt the tutor
const SPEECH_RMS = 0.025;    // rough "he is talking" level for the UI

function makeCtx(rate) {
  const AC = window.AudioContext || window.webkitAudioContext;
  try { return new AC({ sampleRate: rate, latencyHint: 'interactive' }); } catch { return new AC({ latencyHint: 'interactive' }); }
}

export class Call extends EventTarget {
  constructor({ mode, day, scene, settings, socketFactory, inRate = 16000 }) {
    super();
    this.inRate = inRate; // mic sample rate the tutor wants: Gemini 16 kHz, OpenAI 24 kHz
    this.mode = mode;
    this.day = day;
    this.scene = scene;
    this.settings = settings;
    this.socketFactory = socketFactory;
    this.ws = null;
    this.ready = false;
    this.ended = false;
    this.muted = false;
    this.pttActive = false;
    this.tutorPlaying = false;
    this.bargeIn = false;
    this.loudFrames = 0;
    this.micLevel = 0;
    this.lastSpeechAt = 0;
    this.heardSpeech = false;
    this.state = 'connecting';
    this.summaryWaiters = [];
    this.thinkTimer = null;
    this._ampBuf = null;
  }

  emit(type, detail) { this.dispatchEvent(new CustomEvent(type, { detail })); }

  setState(s) {
    if (s === this.state) return;
    this.state = s;
    this.emit('state', s);
  }

  async start() {
    // 1) audio contexts first, while we are still inside the tap (iPhone/Safari only allows sound to start here)
    this.capCtx = makeCtx(this.inRate);
    this.playCtx = makeCtx(24000);
    const resumed = Promise.all([this.capCtx.resume(), this.playCtx.resume()]).catch(() => {});
    // 2) microphone
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw Object.assign(new Error('no mediaDevices'), { name: 'NotFoundError' });
      this.mic = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
    } catch (e) {
      this.teardownAudio();
      const err = new Error('mic');
      err.kind = e && e.name === 'NotFoundError' ? 'nomic' : 'micdenied';
      throw err;
    }
    // 3) audio graph
    await resumed;
    const capUrl = new URL('./worklets/capture.js', import.meta.url).href;
    const playUrl = new URL('./worklets/playback.js', import.meta.url).href;
    await this.playCtx.audioWorklet.addModule(playUrl);
    let src;
    try {
      await this.capCtx.audioWorklet.addModule(capUrl);
      src = this.capCtx.createMediaStreamSource(this.mic);
    } catch {
      // some browsers can't mix a 16/24 kHz context with the mic's own rate: use the default rate and resample in the worklet
      try { this.capCtx.close(); } catch { /* ignore */ }
      this.capCtx = new (window.AudioContext || window.webkitAudioContext)({ latencyHint: 'interactive' });
      await this.capCtx.resume().catch(() => {});
      await this.capCtx.audioWorklet.addModule(capUrl);
      src = this.capCtx.createMediaStreamSource(this.mic);
    }
    this.capNode = new AudioWorkletNode(this.capCtx, 'pcm-capture', { processorOptions: { targetRate: this.inRate, chunkMs: 50 } });
    const sink = this.capCtx.createGain();
    sink.gain.value = 0;
    src.connect(this.capNode);
    this.capNode.connect(sink);
    sink.connect(this.capCtx.destination);
    this.capNode.port.onmessage = (e) => this.onMic(e.data.pcm, e.data.rms);

    this.playNode = new AudioWorkletNode(this.playCtx, 'pcm-player', { numberOfInputs: 0, outputChannelCount: [1], processorOptions: { inputRate: 24000, prerollMs: 90 } });
    this.analyser = this.playCtx.createAnalyser();
    this.analyser.fftSize = 1024;
    this.playNode.connect(this.analyser);
    this.analyser.connect(this.playCtx.destination);
    this.playNode.port.onmessage = (e) => {
      if (e.data.type !== 'state') return;
      this.tutorPlaying = e.data.playing;
      if (e.data.playing) { clearTimeout(this.thinkTimer); this.setState('speaking'); }
      else {
        this.bargeIn = false;
        this.loudFrames = 0;
        if (!this.ended && this.state === 'speaking') this.setState('listening');
      }
    };

    // 4) connect the call (local server, or directly from this page in the phone edition)
    const q = new URLSearchParams({ mode: this.mode });
    if (this.day) q.set('day', String(this.day));
    if (this.scene) q.set('scene', this.scene);
    const ws = this.socketFactory(q.toString());
    ws.binaryType = 'arraybuffer';
    this.ws = ws;
    ws.onmessage = (e) => this.onServer(e.data);
    ws.onclose = () => {
      const wasEnded = this.ended;
      this.ready = false;
      if (!wasEnded) { this.ended = true; if (!this.gotError) this.emit('error', { kind: 'dropped' }); }
      this.flushSummary(null);
      this.teardownAudio();
      this.emit('closed');
    };
    ws.onerror = () => {};
    this.setState('connecting');
  }

  micMode() { return this.settings.micMode === 'ptt' ? 'ptt' : 'auto'; }

  onServer(data) {
    if (data instanceof ArrayBuffer) {
      if (!this.playNode) return;
      this.playNode.port.postMessage({ type: 'push', buf: data }, [data]);
      return;
    }
    let m;
    try { m = JSON.parse(data); } catch { return; }
    switch (m.t) {
      case 'status':
        if (m.s === 'ready') { this.ready = true; this.setState(this.tutorPlaying ? 'speaking' : 'thinking'); }
        else if (m.s === 'reconnecting') this.setState('reconnecting');
        else if (m.s === 'connecting') this.setState('connecting');
        this.emit('status', m);
        break;
      case 'in':
        this.emit('in', { text: m.text, before: !!m.before });
        break;
      case 'userDone':
        this.emit('userDone', m.text);
        break;
      case 'out':
        this.emit('out', m.text);
        break;
      case 'turn':
        if (this.playNode) this.playNode.port.postMessage({ type: 'end' });
        this.emit('turn');
        break;
      case 'interrupted':
        this.clearPlayback();
        this.emit('interrupted');
        break;
      case 'fix':
        this.emit('fix', m.items || []);
        break;
      case 'error':
        this.gotError = true;
        this.emit('error', m);
        break;
      case 'summary':
        this.flushSummary(m.data);
        break;
      default:
        break;
    }
  }

  onMic(pcm, rms) {
    this.micLevel = rms;
    const now = performance.now();
    if (rms > SPEECH_RMS) { this.lastSpeechAt = now; this.heardSpeech = true; }
    if (!this.ws || this.ws.readyState !== 1 || !this.ready || this.ended || this.muted) return;

    if (this.micMode() === 'ptt') {
      if (this.pttActive) this.ws.send(pcm);
      return;
    }
    if (this.settings.audioMode === 'speaker' && this.tutorPlaying) {
      this.loudFrames = rms > BARGE_RMS ? this.loudFrames + 1 : 0;
      if (!this.bargeIn && this.loudFrames >= 4) { this.bargeIn = true; this.clearPlayback(); }
      if (!this.bargeIn) return;
    }
    this.ws.send(pcm);

    // "thinking" face: he spoke, then went quiet, and the tutor hasn't started yet
    if (!this.tutorPlaying && this.heardSpeech && now - this.lastSpeechAt > 650 && this.state === 'listening') {
      this.heardSpeech = false;
      this.setState('thinking');
      clearTimeout(this.thinkTimer);
      this.thinkTimer = setTimeout(() => { if (this.state === 'thinking' && !this.tutorPlaying) this.setState('listening'); }, 4000);
    }
    if (this.state === 'thinking' && rms > SPEECH_RMS * 1.6 && !this.tutorPlaying) this.setState('listening');
  }

  clearPlayback() {
    if (this.playNode) this.playNode.port.postMessage({ type: 'clear' });
    this.tutorPlaying = false;
  }

  // tutor voice level 0..1 for lip movement
  tutorLevel() {
    if (!this.analyser || !this.tutorPlaying) return 0;
    if (!this._ampBuf) this._ampBuf = new Float32Array(this.analyser.fftSize);
    this.analyser.getFloatTimeDomainData(this._ampBuf);
    let s = 0;
    for (let i = 0; i < this._ampBuf.length; i++) s += this._ampBuf[i] * this._ampBuf[i];
    return Math.sqrt(s / this._ampBuf.length);
  }

  sendJSON(obj) { if (this.ws && this.ws.readyState === 1) this.ws.send(JSON.stringify(obj)); }

  chip(kind, extra = {}) {
    if (!this.ready) return;
    this.clearPlayback();
    this.sendJSON({ t: 'text', kind, ...extra });
    this.setState('thinking');
    clearTimeout(this.thinkTimer);
    this.thinkTimer = setTimeout(() => { if (this.state === 'thinking' && !this.tutorPlaying) this.setState('listening'); }, 6000);
  }

  setMuted(m) {
    this.muted = m;
    if (m) this.sendJSON({ t: 'micOff' });
  }

  pttDown() {
    if (this.pttActive || !this.ready) return;
    this.pttActive = true;
    if (this.tutorPlaying) this.clearPlayback();
    this.sendJSON({ t: 'actStart' });
    this.setState('listening');
  }

  pttUp() {
    if (!this.pttActive) return;
    this.pttActive = false;
    this.sendJSON({ t: 'actEnd' });
    this.setState('thinking');
    clearTimeout(this.thinkTimer);
    this.thinkTimer = setTimeout(() => { if (this.state === 'thinking' && !this.tutorPlaying) this.setState('listening'); }, 5000);
  }

  flushSummary(data) {
    const w = this.summaryWaiters;
    this.summaryWaiters = [];
    for (const f of w) f(data);
    if (data !== undefined) this.summaryData = data;
  }

  // Ends the call; resolves with the report (or null) once the server has written it.
  end() {
    return new Promise((resolve) => {
      if (this.summaryData !== undefined && this.ended) { resolve(this.summaryData); return; }
      this.summaryWaiters.push(resolve);
      const wasEnded = this.ended;
      this.ended = true;
      this.clearPlayback();
      this.stopMic();
      if (!wasEnded && this.ws && this.ws.readyState === 1) this.sendJSON({ t: 'end' });
      else if (!this.ws || this.ws.readyState > 1) this.flushSummary(null);
      setTimeout(() => this.flushSummary(null), 60000);
    });
  }

  stopMic() {
    try { this.mic && this.mic.getTracks().forEach((t) => t.stop()); } catch { /* ignore */ }
  }

  teardownAudio() {
    this.stopMic();
    try { this.capCtx && this.capCtx.state !== 'closed' && this.capCtx.close(); } catch { /* ignore */ }
    try { this.playCtx && this.playCtx.state !== 'closed' && this.playCtx.close(); } catch { /* ignore */ }
    this.capCtx = null;
    this.playCtx = null;
    this.playNode = null;
    this.analyser = null;
  }
}
