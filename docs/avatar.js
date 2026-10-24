// The tutor's face: an original illustrated character that blinks, nods while listening,
// looks up while thinking, and moves its mouth with the real voice level while speaking.
const NS = 'http://www.w3.org/2000/svg';

const LOOKS = {
  priya: {
    skin: '#C88B5E', skinShade: '#A8704A', skinDeep: '#8E5B3B', hair: '#1F1512', hairHi: '#3A2A24',
    lip: '#9C4A4E', lipLo: '#B25C5E', cloth: '#1E7A74', clothDeep: '#145A55', trim: '#E2B04A', blush: '#D9766B',
    mouthY: 263, female: true,
  },
  arun: {
    skin: '#B97B50', skinShade: '#9B6440', skinDeep: '#7D4E31', hair: '#1B1310', hairHi: '#33261F',
    lip: '#8E4A45', lipLo: '#A65A52', cloth: '#9DB9DD', clothDeep: '#7E9DC4', trim: '#F4F6FA', blush: '#C97462',
    mouthY: 268, female: false,
  },
};

function el(tag, attrs, parent) {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs || {})) n.setAttribute(k, v);
  if (parent) parent.appendChild(n);
  return n;
}

export class Avatar {
  constructor(container, who = 'priya') {
    this.container = container;
    this.state = 'idle';     // idle | listening | thinking | speaking
    this.level = 0;          // tutor voice level 0..1 (set every frame by the call)
    this.userLevel = 0;      // learner mic level 0..1
    this.open = 0;
    this.smile = 0.6;
    this.gaze = { x: 0, y: 0 };
    this.gazeT = { x: 0, y: 0 };
    this.brow = 0;
    this.nod = 0;
    this.nodV = 0;
    this.nextBlink = 0;
    this.blinkAt = -1;
    this.nextSaccade = 0;
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.levelSource = null;
    this.userLevelSource = null;
    this.build(who);
    this.raf = requestAnimationFrame((t) => this.tick(t));
  }

  setWho(who) { if (who !== this.who) { this.svg.remove(); this.build(who); } }
  setState(s) { this.state = s; }
  destroy() { cancelAnimationFrame(this.raf); this.svg.remove(); }

  build(who) {
    this.who = LOOKS[who] ? who : 'priya';
    const L = LOOKS[this.who];
    this.L = L;
    const svg = el('svg', { viewBox: '0 0 360 400', class: 'avatar-svg', role: 'img', 'aria-label': this.who === 'arun' ? 'Arun, your English teacher' : 'Priya, your English teacher' });
    this.svg = svg;
    const defs = el('defs', {}, svg);
    const uid = Math.random().toString(36).slice(2, 7);
    this.uid = uid;

    // ---- body (breathes slightly) ----
    this.body = el('g', {}, svg);
    el('path', { d: 'M160,236 L155,334 L205,334 L200,236 Z', fill: L.skinShade }, this.body);
    if (L.female) {
      el('path', { d: 'M24,400 C40,338 98,312 154,305 Q180,350 206,305 C262,312 320,338 336,400 Z', fill: L.cloth }, this.body);
      el('path', { d: 'M154,305 Q180,350 206,305', fill: 'none', stroke: L.trim, 'stroke-width': 5, 'stroke-linecap': 'round' }, this.body);
      // pallu over the left shoulder
      el('path', { d: 'M62,348 C96,318 118,310 142,307 L262,400 L190,400 Z', fill: L.clothDeep }, this.body);
      el('path', { d: 'M62,348 C96,318 118,310 142,307', fill: 'none', stroke: L.trim, 'stroke-width': 4 }, this.body);
      // braid over the right shoulder with jasmine
      const braid = el('g', {}, this.body);
      for (let i = 0; i < 8; i++) {
        const x = 245 + i * 1.8 + (i % 2 ? 3.5 : -3.5);
        const y = 296 + i * 15;
        el('ellipse', { cx: x, cy: y, rx: 10.5 - i * 0.35, ry: 13, fill: i % 2 ? L.hairHi : L.hair, transform: `rotate(${i % 2 ? 34 : -34} ${x} ${y})` }, braid);
      }
    } else {
      el('path', { d: 'M24,400 C40,338 98,314 152,307 L180,330 L208,307 C262,314 320,338 336,400 Z', fill: L.cloth }, this.body);
      el('path', { d: 'M152,307 L180,352 L168,360 L140,318 Z', fill: L.trim }, this.body);
      el('path', { d: 'M208,307 L180,352 L192,360 L220,318 Z', fill: L.trim }, this.body);
      el('path', { d: 'M180,352 L180,400', stroke: L.clothDeep, 'stroke-width': 2 }, this.body);
      el('circle', { cx: 180, cy: 372, r: 3, fill: L.trim }, this.body);
      el('circle', { cx: 180, cy: 392, r: 3, fill: L.trim }, this.body);
    }

    // ---- head (sways, nods) ----
    this.head = el('g', {}, svg);
    if (L.female) {
      el('ellipse', { cx: 180, cy: 182, rx: 104, ry: 116, fill: L.hair }, this.head);
      // jasmine peeking behind the head
      [[262, 150], [270, 166], [274, 184], [272, 202], [266, 218]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 6.5, fill: '#FBF8EF', stroke: '#E6DEC8', 'stroke-width': 1 }, this.head));
    } else {
      el('ellipse', { cx: 180, cy: 170, rx: 94, ry: 100, fill: L.hair }, this.head);
    }
    // ears
    for (const x of [90, 270]) {
      el('ellipse', { cx: x, cy: 196, rx: 12, ry: 19, fill: L.skin }, this.head);
      el('ellipse', { cx: x + (x < 180 ? 3 : -3), cy: 197, rx: 5, ry: 10, fill: L.skinShade }, this.head);
      if (L.female) {
        el('circle', { cx: x, cy: 216, r: 5, fill: L.trim }, this.head);
        el('path', { d: `M${x - 6},224 Q${x},214 ${x + 6},224 L${x + 4},230 L${x - 4},230 Z`, fill: L.trim }, this.head);
      }
    }
    // face
    const faceD = L.female
      ? 'M180,92 C238,92 268,140 268,196 C268,254 230,300 180,300 C130,300 92,254 92,196 C92,140 122,92 180,92 Z'
      : 'M180,90 C240,90 270,138 270,194 C270,252 236,304 180,304 C124,304 90,252 90,194 C90,138 120,90 180,90 Z';
    el('path', { d: faceD, fill: L.skin }, this.head);
    // soft jaw shade
    el('path', { d: L.female ? 'M112,252 C132,290 160,300 180,300 C200,300 228,290 248,252 C230,282 206,292 180,292 C154,292 130,282 112,252 Z' : 'M110,250 C130,292 158,304 180,304 C202,304 230,292 250,250 C232,284 206,296 180,296 C154,296 128,284 110,250 Z', fill: L.skinShade, opacity: 0.35 }, this.head);
    // front hair
    if (L.female) {
      el('path', { d: 'M90,198 C84,128 124,80 180,80 C236,80 276,128 270,198 C262,160 246,128 214,114 Q194,106 180,122 Q166,106 146,114 C114,128 98,160 90,198 Z', fill: L.hair }, this.head);
      el('path', { d: 'M180,84 L180,118', stroke: L.hairHi, 'stroke-width': 2, 'stroke-linecap': 'round' }, this.head);
    } else {
      el('path', { d: 'M90,186 C86,120 128,76 184,76 C240,76 274,118 270,186 C262,148 244,124 214,118 C188,113 154,116 132,128 C112,140 98,160 90,186 Z', fill: L.hair }, this.head);
      el('path', { d: 'M132,128 C160,108 206,104 232,114', fill: 'none', stroke: L.hairHi, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.8 }, this.head);
    }
    // cheeks
    el('ellipse', { cx: 136, cy: 234, rx: 17, ry: 9, fill: L.blush, opacity: 0.22 }, this.head);
    el('ellipse', { cx: 224, cy: 234, rx: 17, ry: 9, fill: L.blush, opacity: 0.22 }, this.head);
    // brows
    this.brows = el('g', {}, this.head);
    const bw = L.female ? 4.5 : 6.5;
    el('path', { d: 'M134,166 Q153,155 172,163', fill: 'none', stroke: L.hair, 'stroke-width': bw, 'stroke-linecap': 'round' }, this.brows);
    el('path', { d: 'M188,163 Q207,155 226,166', fill: 'none', stroke: L.hair, 'stroke-width': bw, 'stroke-linecap': 'round' }, this.brows);
    // eyes
    this.eyes = [];
    for (const cx of [153, 207]) {
      const g = el('g', {}, this.head);
      const clipId = `eye-${uid}-${cx}`;
      const cp = el('clipPath', { id: clipId }, defs);
      el('ellipse', { cx, cy: 193, rx: 16, ry: 10.5 }, cp);
      el('ellipse', { cx, cy: 193, rx: 16, ry: 10.5, fill: '#FBF7F1' }, g);
      const iris = el('g', { 'clip-path': `url(#${clipId})` }, g);
      const ig = el('g', {}, iris);
      el('circle', { cx, cy: 193, r: 8.4, fill: '#4A2C1A' }, ig);
      el('circle', { cx, cy: 193, r: 4.2, fill: '#140B06' }, ig);
      el('circle', { cx: cx + 3, cy: 189.5, r: 2.3, fill: '#FFFFFF' }, ig);
      const lash = L.female
        ? `M${cx - 17},192 Q${cx},178 ${cx + 17},191 ${cx < 180 ? '' : `L${cx + 20},188`}`
        : `M${cx - 17},192 Q${cx},180 ${cx + 17},192`;
      el('path', { d: lash, fill: 'none', stroke: '#1E1512', 'stroke-width': L.female ? 3.4 : 2.6, 'stroke-linecap': 'round' }, g);
      if (L.female && cx < 180) el('path', { d: `M${cx - 17},192 L${cx - 20},188`, stroke: '#1E1512', 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
      el('path', { d: `M${cx - 13},200 Q${cx},205 ${cx + 13},200`, fill: 'none', stroke: L.skinShade, 'stroke-width': 1.4, opacity: 0.7 }, g);
      g.style.transformBox = 'fill-box';
      g.style.transformOrigin = 'center';
      this.eyes.push({ g, ig, cx });
    }
    // nose
    el('path', { d: 'M178,202 Q176,226 168,236 Q180,245 192,236', fill: 'none', stroke: L.skinDeep, 'stroke-width': 2.4, 'stroke-linecap': 'round', opacity: 0.75 }, this.head);
    if (L.female) el('circle', { cx: 180, cy: 150, r: 4, fill: '#A3123A' }, this.head);
    if (!L.female) {
      el('path', { d: 'M150,253 Q165,243 180,249 Q195,243 210,253 Q195,259 180,255 Q165,259 150,253 Z', fill: L.hair }, this.head);
    }
    // mouth
    this.mouth = el('g', {}, this.head);
    const mclip = el('clipPath', { id: `mouth-${uid}` }, defs);
    this.mInnerClip = el('path', { d: '' }, mclip);
    this.mInner = el('path', { d: '', fill: '#4A1518' }, this.mouth);
    const teethG = el('g', { 'clip-path': `url(#mouth-${uid})` }, this.mouth);
    this.mTeeth = el('rect', { x: 0, y: 0, width: 0, height: 0, rx: 2, fill: '#FBF7F2' }, teethG);
    this.mTongue = el('ellipse', { cx: 180, cy: 0, rx: 0, ry: 0, fill: '#C25A5E' }, teethG);
    this.mUpper = el('path', { d: '', fill: L.lip }, this.mouth);
    this.mLower = el('path', { d: '', fill: L.lipLo }, this.mouth);
    if (!L.female) this.head.appendChild(this.head.querySelector('path[d^="M150,253"]'));

    this.container.appendChild(svg);
    this.drawMouth(0, this.smile);
  }

  drawMouth(o, s) {
    const cx = 180;
    const cy = this.L.mouthY;
    const hx = 22 + o * 3;
    const cornerY = cy - 1 - s * 4;
    const upperMid = cy - 1 + s * 0.6 - o * 2;
    const lowerMid = cy + 0.6 + s * 1.6 + o * 20;
    const ctrl = (mid) => 2 * mid - cornerY;
    const L = `${cx - hx},${cornerY}`;
    const R = `${cx + hx},${cornerY}`;
    const inner = `M${L} Q${cx},${ctrl(upperMid)} ${R} Q${cx},${ctrl(lowerMid)} ${L} Z`;
    this.mInner.setAttribute('d', inner);
    this.mInnerClip.setAttribute('d', inner);
    const lipTop = upperMid - 5.5;
    this.mUpper.setAttribute('d', `M${L} Q${cx - hx * 0.5},${lipTop - 2.5} ${cx},${lipTop} Q${cx + hx * 0.5},${lipTop - 2.5} ${R} Q${cx},${ctrl(upperMid)} ${L} Z`);
    const lowOut = lowerMid + 7;
    this.mLower.setAttribute('d', `M${L} Q${cx},${ctrl(lowerMid)} ${R} Q${cx},${ctrl(lowOut)} ${L} Z`);
    const th = Math.min(o * 11, 7);
    this.mTeeth.setAttribute('x', cx - hx * 0.72);
    this.mTeeth.setAttribute('y', upperMid - 1);
    this.mTeeth.setAttribute('width', hx * 1.44);
    this.mTeeth.setAttribute('height', th);
    this.mTongue.setAttribute('cy', lowerMid - 1);
    this.mTongue.setAttribute('rx', hx * 0.5);
    this.mTongue.setAttribute('ry', o * 5);
  }

  tick(t) {
    this.raf = requestAnimationFrame((tt) => this.tick(tt));
    if (this.levelSource) this.level = this.levelSource();
    if (this.userLevelSource) this.userLevel = this.userLevelSource();
    const st = this.state;
    const speaking = st === 'speaking';

    // mouth from the real voice level
    const target = speaking ? Math.max(0, Math.min(1, (this.level - 0.012) * 7.5)) : 0;
    this.open += (target - this.open) * (target > this.open ? 0.6 : 0.28);
    const smileT = speaking ? 0.35 : st === 'thinking' ? 0.3 : 0.65;
    this.smile += (smileT - this.smile) * 0.08;
    this.drawMouth(this.open, this.smile);

    // blinking
    if (!this.nextBlink) this.nextBlink = t + 1500 + Math.random() * 2500;
    if (t >= this.nextBlink) { this.blinkAt = t; this.nextBlink = t + 2200 + Math.random() * 3800; }
    let b = 0;
    if (this.blinkAt >= 0) {
      const p = (t - this.blinkAt) / 150;
      b = p < 1 ? (p < 0.5 ? p * 2 : (1 - p) * 2) : 0;
    }
    for (const e of this.eyes) e.g.style.transform = `scaleY(${1 - 0.9 * b})`;

    // gaze
    if (st === 'thinking') this.gazeT = { x: 4.5, y: -4 };
    else if (t > this.nextSaccade) {
      this.nextSaccade = t + 900 + Math.random() * 2200;
      this.gazeT = speaking ? { x: (Math.random() - 0.5) * 3, y: (Math.random() - 0.5) * 1.5 } : { x: (Math.random() - 0.5) * 2, y: 0.8 };
    }
    this.gaze.x += (this.gazeT.x - this.gaze.x) * 0.15;
    this.gaze.y += (this.gazeT.y - this.gaze.y) * 0.15;
    for (const e of this.eyes) e.ig.setAttribute('transform', `translate(${this.gaze.x.toFixed(2)} ${this.gaze.y.toFixed(2)})`);

    // eyebrows
    const browT = st === 'thinking' ? -4 : st === 'listening' && this.userLevel > 0.04 ? -2 : speaking ? -this.open * 2.5 : 0;
    this.brow += (browT - this.brow) * 0.12;
    this.brows.setAttribute('transform', `translate(0 ${this.brow.toFixed(2)})`);

    // head motion
    if (this.reduced) {
      this.head.setAttribute('transform', '');
      this.body.setAttribute('transform', '');
      return;
    }
    if (st === 'listening' && this.userLevel > 0.05 && Math.abs(this.nodV) < 0.02 && Math.random() < 0.02) this.nodV = 0.22;
    this.nod += this.nodV;
    this.nodV -= this.nod * 0.08;
    this.nodV *= 0.86;
    const sway = Math.sin(t / 1900) * 1.1 + (speaking ? Math.sin(t / 380) * this.open * 1.4 : 0);
    const bob = Math.sin(t / 2600) * 1.2 + this.nod * 9 + (speaking ? this.open * 1.2 : 0);
    const tilt = st === 'thinking' ? 2.5 : st === 'listening' ? -1.2 : 0;
    this.tilt = (this.tilt || 0) + (tilt - (this.tilt || 0)) * 0.05;
    this.head.setAttribute('transform', `translate(0 ${bob.toFixed(2)}) rotate(${(sway + this.tilt).toFixed(2)} 180 310)`);
    const breath = 1 + Math.sin(t / 1700) * 0.006;
    this.body.setAttribute('transform', `translate(0 ${(400 * (1 - breath)).toFixed(2)}) scale(1 ${breath.toFixed(4)})`);
  }
}
