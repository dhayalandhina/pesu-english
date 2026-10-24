// Tamil script -> Thanglish (Tamil in English letters), for captions.
// Written with code points so this file itself stays plain ASCII.
const IND = { 0x0B85: 'a', 0x0B86: 'aa', 0x0B87: 'i', 0x0B88: 'ee', 0x0B89: 'u', 0x0B8A: 'oo', 0x0B8E: 'e', 0x0B8F: 'e', 0x0B90: 'ai', 0x0B92: 'o', 0x0B93: 'o', 0x0B94: 'au' };
const SIGN = { 0x0BBE: 'aa', 0x0BBF: 'i', 0x0BC0: 'ee', 0x0BC1: 'u', 0x0BC2: 'oo', 0x0BC6: 'e', 0x0BC7: 'e', 0x0BC8: 'ai', 0x0BCA: 'o', 0x0BCB: 'o', 0x0BCC: 'au', 0x0BD7: 'au' };
const PULLI = 0x0BCD;
const AYTHAM = 0x0B83;
const KA = 0x0B95, NGA = 0x0B99, CA = 0x0B9A, NYA = 0x0B9E, TTA = 0x0B9F, NNA = 0x0BA3, TA = 0x0BA4, NA = 0x0BA8, NNNA = 0x0BA9, PA = 0x0BAA, MA = 0x0BAE, RRA = 0x0BB1;
const CONS = {
  [KA]: 'k', [NGA]: 'ng', [CA]: 'ch', 0x0B9C: 'j', [NYA]: 'nj', [TTA]: 't', [NNA]: 'n', [TA]: 'th', [NA]: 'n', [NNNA]: 'n', [PA]: 'p',
  [MA]: 'm', 0x0BAF: 'y', 0x0BB0: 'r', [RRA]: 'r', 0x0BB2: 'l', 0x0BB3: 'l', 0x0BB4: 'zh', 0x0BB5: 'v', 0x0BB6: 'sh', 0x0BB7: 'sh', 0x0BB8: 's', 0x0BB9: 'h',
};
// first consonant of a doubled pair (e.g. the first "k" of "kk")
const GEM_FIRST = { [KA]: 'k', [CA]: '', [TTA]: 't', [TA]: '', [PA]: 'p', [RRA]: 't' };
// second consonant of a doubled pair
const GEM_SECOND = { [KA]: 'k', [CA]: 'ch', [TTA]: 't', [TA]: 'th', [PA]: 'p', [RRA]: 'r' };

const isTamil = (cp) => cp >= 0x0B80 && cp <= 0x0BFF;

function units(word) {
  const u = [];
  for (const ch of word) {
    const cp = ch.codePointAt(0);
    const last = u[u.length - 1];
    if (IND[cp]) u.push({ c: null, v: IND[cp] });
    else if (CONS[cp]) u.push({ c: cp, v: 'a' });
    else if (SIGN[cp] && last && last.c && last.v === 'a' && !last.signed) { last.v = SIGN[cp]; last.signed = true; }
    else if (cp === PULLI && last && last.c) last.v = '';
    else if (cp === AYTHAM) u.push({ c: null, v: 'h' });
    else if (cp >= 0x0BE6 && cp <= 0x0BEF) u.push({ c: null, v: String(cp - 0x0BE6) });
  }
  return u;
}

function romanize(word) {
  const u = units(word);
  let out = '';
  for (let i = 0; i < u.length; i++) {
    const x = u[i];
    if (!x.c) { out += x.v; continue; }
    const prev = u[i - 1];
    const next = u[i + 1];
    const start = i === 0;
    const prevVowel = !!prev && (prev.c === null || prev.v !== '');
    const after = (cp) => !!prev && prev.c === cp && prev.v === '';
    const firstOfPair = x.v === '' && !!next && next.c === x.c;
    const secondOfPair = after(x.c);
    let r = CONS[x.c];
    if (firstOfPair && x.c in GEM_FIRST) r = GEM_FIRST[x.c];
    else if (secondOfPair && x.c in GEM_SECOND) r = GEM_SECOND[x.c];
    else {
      switch (x.c) {
        case KA: r = after(NGA) ? 'g' : (prevVowel && !start ? 'g' : 'k'); break;
        case CA: r = after(NYA) ? 'j' : (start || prevVowel ? 's' : 'ch'); break;
        case TTA: r = after(NNA) ? 'd' : (prevVowel && !start ? 'd' : 't'); break;
        case TA: r = after(NA) ? 'dh' : (prevVowel && !start ? 'dh' : 'th'); break;
        case PA: r = after(MA) ? 'b' : 'p'; break;
        case RRA: r = x.v === '' && next && next.c === RRA ? 't' : (after(NNNA) ? 'dr' : 'r'); break;
        case NGA: r = x.v === '' && next && next.c === KA ? 'n' : 'ng'; break;
        case NYA: r = x.v === '' && next && next.c === CA ? 'n' : 'nj'; break;
        default: break;
      }
    }
    out += r + x.v;
  }
  return out;
}

export function hasTamil(text) { return /[஀-௿]/.test(String(text || '')); }

export function toThanglish(text) {
  const s = String(text || '');
  if (!hasTamil(s)) return s;
  let out = '';
  let word = '';
  for (const ch of s) {
    const cp = ch.codePointAt(0);
    if (isTamil(cp)) { word += ch; continue; }
    if (word) { out += romanize(word); word = ''; }
    out += ch;
  }
  if (word) out += romanize(word);
  return out;
}
