// Which sentence does the call screen show? (node test/repeat.test.mjs)
import { repeatTarget } from '../public/repeat.js';

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
process.exit(ok === cases.length ? 0 : 1);
