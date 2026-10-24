// Which sentence does the call screen show? (node test/repeat.test.mjs)
import { repeatTarget, questionOf } from '../public/repeat.js';

const cases = [
  ['Sure, Dinesh. Say: “I’m not learning English.” Please repeat after me.', 'I’m not learning English.'],
  ['Good! You said, “I am learning English.” Now say, “I’m learning English every day.”', 'I’m learning English every day.'],
  ['Sari, naan sonna: “You went to the market yesterday?” Now repeat after me slowly: “What vegetables did you buy?”', 'What vegetables did you buy?'],
  ['That’s okay. Try saying: “My name is Dinesh.” When you’re ready, go ahead.', 'My name is Dinesh.'],
  ['Repeat after me. I live in Coimbatore.', 'I live in Coimbatore.'],
  ['Very good. Can you say: Nice to meet you?', 'Nice to meet you?'],
  ['Say it with me, Hello, my name is Dinesh.', 'Hello, my name is Dinesh.'],
  ['Say "think" slowly, with your tongue between your teeth.', 'think'],
  ['You said "I go to market". Good try!', ''],
  ['What did you eat for breakfast today?', ''],
  ['Can you say that again?', ''],
  ['Say it again, slowly.', ''],
  ['Repeat after me. Yesterday I went to the market. Then tell me what you bought.', 'Yesterday I went to the market.'],
  ['Oh, you went to the market yesterday? Repeat after me: “Yesterday I went to the market.”', 'Yesterday I went to the market.'],
  ['In Tamil we say “\u0BA8\u0BBE\u0BA9\u0BCD \u0BAA\u0BCB\u0BA9\u0BC7\u0BA9\u0BCD”. In English, say “I went.”', 'I went.'],
];
let ok = 0;
for (const [text, want] of cases) {
  const got = repeatTarget(text);
  const pass = got === want;
  if (pass) ok++;
  else console.log(`FAIL: ${JSON.stringify(text)}\n  want ${JSON.stringify(want)}\n  got  ${JSON.stringify(got)}`);
}
console.log(`repeat: ${ok}/${cases.length} ok`);
const qcases = [
  ['Hi Dinesh! I am Priya. How are you today?', 'How are you today?'],
  ['Good! Now tell me, what did you do yesterday?', 'Now tell me, what did you do yesterday?'],
  ['Repeat after me: “I live in Coimbatore.” Can you say it?', ''],
  ['Can you say that again?', ''],
  ['Okay? Let us start. What is your name?', 'What is your name?'],
  ['Repeat after me. Yesterday I went to the market. Then tell me what you bought.', ''],
  ['Nice. Where do you work, Dinesh? And what time do you start?', 'And what time do you start?'],
  ['Sari, puriyudhaa? Say “I am fine.”', ''],
  ['Oh, you went to the market yesterday? What did you buy there?', 'What did you buy there?'],
];
let qok = 0;
for (const [text, want] of qcases) {
  const got = questionOf(text);
  if (got === want) qok++;
  else console.log(`FAIL q: ${JSON.stringify(text)}\n  want ${JSON.stringify(want)}\n  got  ${JSON.stringify(got)}`);
}
console.log(`question: ${qok}/${qcases.length} ok`);
process.exit(ok === cases.length && qok === qcases.length ? 0 : 1);
