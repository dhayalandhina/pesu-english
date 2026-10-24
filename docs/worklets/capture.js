// Mic -> 16 kHz mono PCM16 chunks (about 50 ms each) + loudness, posted to the main thread.
class PcmCapture extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const o = (options && options.processorOptions) || {};
    this.target = o.targetRate || 16000;
    this.chunk = Math.round(this.target * (o.chunkMs || 50) / 1000);
    this.ratio = sampleRate / this.target; // input samples per output sample
    this.buf = new Int16Array(this.chunk);
    this.n = 0;
    this.pos = 0;      // fractional read position for resampling
    this.acc = 0;      // sum of squares for RMS
    this.prev = 0;
  }

  push(v) {
    const s = v < -1 ? -1 : v > 1 ? 1 : v;
    this.buf[this.n++] = s < 0 ? s * 0x8000 : s * 0x7fff;
    this.acc += s * s;
    if (this.n === this.chunk) {
      const rms = Math.sqrt(this.acc / this.chunk);
      const out = this.buf;
      this.port.postMessage({ pcm: out.buffer, rms }, [out.buffer]);
      this.buf = new Int16Array(this.chunk);
      this.n = 0;
      this.acc = 0;
    }
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || !input.length) return true;
    const ch = input[0];
    if (!ch) return true;
    if (this.ratio === 1) {
      for (let i = 0; i < ch.length; i++) this.push(ch[i]);
      return true;
    }
    if (Number.isInteger(this.ratio) && this.ratio > 1) {
      // average groups of samples (carried across blocks): a cheap low-pass before decimation, e.g. 48k -> 16k
      const r = this.ratio;
      for (let i = 0; i < ch.length; i++) {
        this.sum = (this.sum || 0) + ch[i];
        this.cnt = (this.cnt || 0) + 1;
        if (this.cnt === r) { this.push(this.sum / r); this.sum = 0; this.cnt = 0; }
      }
      return true;
    }
    // general case (e.g. 44.1k): linear interpolation
    while (this.pos < ch.length) {
      const i = Math.floor(this.pos);
      const f = this.pos - i;
      const a = i === 0 ? this.prev : ch[i - 1];
      const b = ch[i];
      this.push(a + (b - a) * f);
      this.pos += this.ratio;
    }
    this.pos -= ch.length;
    this.prev = ch[ch.length - 1];
    return true;
  }
}
registerProcessor('pcm-capture', PcmCapture);
