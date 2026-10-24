// Tutor voice player: queue of 24 kHz PCM16 chunks -> speakers, with instant "clear" for interruptions.
class PcmPlayer extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const o = (options && options.processorOptions) || {};
    this.inRate = o.inputRate || 24000;
    this.step = this.inRate / sampleRate;       // input samples per output sample
    this.preroll = Math.round(sampleRate * (o.prerollMs || 90) / 1000);
    this.queue = [];
    this.head = 0;           // read index inside queue[0]
    this.frac = 0;           // fractional position for resampling
    this.queued = 0;         // output-rate samples waiting (approx.)
    this.playing = false;
    this.ending = false;     // server said the turn is complete: play out without waiting for preroll
    this.idleBlocks = 0;
    this.port.onmessage = (e) => {
      const m = e.data;
      if (m.type === 'push') {
        const pcm = new Int16Array(m.buf);
        const f = new Float32Array(pcm.length);
        for (let i = 0; i < pcm.length; i++) f[i] = pcm[i] / 0x8000;
        this.queue.push(f);
        this.queued += f.length / this.step;
        this.ending = false;
      } else if (m.type === 'clear') {
        this.queue = [];
        this.head = 0;
        this.frac = 0;
        this.queued = 0;
        this.ending = false;
        if (this.playing) { this.playing = false; this.port.postMessage({ type: 'state', playing: false, cleared: true }); }
      } else if (m.type === 'end') {
        this.ending = true;
      }
    };
  }

  nextSample() {
    // linear interpolation across chunk boundaries
    while (this.queue.length && this.head >= this.queue[0].length) {
      this.head -= this.queue[0].length;
      this.queue.shift();
    }
    if (!this.queue.length) return null;
    const cur = this.queue[0];
    const i = this.head;
    const a = cur[i];
    let b = a;
    if (i + 1 < cur.length) b = cur[i + 1];
    else if (this.queue.length > 1) b = this.queue[1][0];
    const v = a + (b - a) * this.frac;
    this.frac += this.step;
    const adv = Math.floor(this.frac);
    this.frac -= adv;
    this.head += adv;
    return v;
  }

  process(_inputs, outputs) {
    const out = outputs[0][0];
    if (!out) return true;
    if (!this.playing) {
      if (this.queue.length && (this.queued >= this.preroll || this.ending)) {
        this.playing = true;
        this.idleBlocks = 0;
        this.port.postMessage({ type: 'state', playing: true });
      } else {
        out.fill(0);
        return true;
      }
    }
    let got = 0;
    for (let i = 0; i < out.length; i++) {
      const v = this.nextSample();
      if (v === null) { out[i] = 0; } else { out[i] = v; got++; }
    }
    this.queued = Math.max(0, this.queued - got);
    if (got === 0) {
      this.idleBlocks++;
      // ~120 ms of nothing: the tutor finished (or the network paused) -> report idle
      if (this.idleBlocks * out.length > sampleRate * 0.12) {
        this.playing = false;
        this.queued = 0;
        this.port.postMessage({ type: 'state', playing: false });
      }
    } else {
      this.idleBlocks = 0;
    }
    return true;
  }
}
registerProcessor('pcm-player', PcmPlayer);
