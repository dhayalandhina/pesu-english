// The call screen shows only the sentence the tutor wants him to say. This picks it out of her words:
//  1) a sentence in double quotes, best one introduced by "say / repeat / try…" (not one quoting what he said)
//  2) otherwise the sentence right after "repeat after me", "say it with me", "can you say"… (spoken transcripts have no quotes)
const CUE = /\b(say|repeat|try|tell|practi[cs]e|read|copy|ask)\b[^“”".!?]{0,25}$/i;
const HIS = /\b(you|he) (said|told|say|wrote)\b[^“”".!?]{0,15}$/i;
const CUE_TAIL = /(?:repeat after me|repeat this|say (?:it |this )?(?:after|with) me|try saying|try to say|(?:can|could) you (?:please )?say|please say|now say|just say|you say|say this|say)\s*[:.,!-]?\s+[“"]?([^.!?“”"]{1,160}[.!?])/gi;
const TAMIL = /[\u0B80-\u0BFF]/;

const tidy = (s) => s.replace(/\s+([.!?,])/g, '$1').replace(/^[\s,;:-]+|[\s,;:-]+$/g, '').trim();

export function repeatTarget(text) {
  const t = String(text || '').replace(/\s+/g, ' ');
  let best = '';
  let bestScore = 0;
  for (const m of t.matchAll(/[“"]([^“”"]{1,200})[”"]/g)) {
    const s = tidy(m[1]);
    if (!/[A-Za-z]{2}/.test(s) || TAMIL.test(s)) continue;
    const before = t.slice(Math.max(0, m.index - 45), m.index);
    const cue = CUE.test(before);
    if (HIS.test(before)) continue;                       // "You said "I go to market"" is not for repeating
    if (!cue && s.split(' ').length < 2) continue;         // a lone quoted word needs a "say …" before it
    const score = cue ? 2 : 1;
    if (score >= bestScore) { best = s; bestScore = score; } // the latest one wins a tie
  }
  if (best) return best;
  let last = '';
  // the sentence must start with a capital letter ("say it again" is not a sentence to repeat)
  for (const m of t.matchAll(CUE_TAIL)) if (/^[A-Z]/.test(m[1]) && !TAMIL.test(m[1])) last = tidy(m[1]);
  return last;
}

// The question the tutor wants him to answer: the last question in her words, unless it is really a
// "say this" request ("Can you say 'I went'?") or a throwaway check ("Okay?", "Ready?").
const NOT_A_QUESTION = /^(okay|ok|ready|right|yes|alright|got it|understood|shall we|see)\b/i;
const SAY_REQUEST = /\b(say|repeat|try|read)\b/i;
export function questionOf(text) {
  const t = String(text || '').replace(/\s+/g, ' ');
  let last = '';
  for (const m of t.matchAll(/([^.!?]+\?)/g)) {
    const q = tidy(m[1]);
    const words = q.split(' ').length;
    if (words < 3 || words > 20 || TAMIL.test(q)) continue;
    if (NOT_A_QUESTION.test(q)) continue;
    if (/[“”"]/.test(q) && SAY_REQUEST.test(q)) continue;      // Can you say "..."?
    if (/^(can|could|will|would) you (please )?(say|repeat|try)/i.test(q)) continue;
    last = q;
  }
  return last;
}
