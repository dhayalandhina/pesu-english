// Pesu English — 30-day course data (Thanglish). Shared by the server (tutor prompts) and the app screens.
export const LESSONS = [
 {
  "id": 1,
  "wk": 1,
  "t": "Ungala pathi sollunga",
  "en": "Introduce yourself",
  "goal": "Indru mudivula, ungala pathi 4–5 sentence English-la solla mudiyum.",
  "teach": [
   "Tamil-la 'Naan {name}' nu solluvom. English-la 'I am {name}' — pesumbodhu short ah 'I'm {name}'. 'I'm' = 'aim' sound.",
   "Ooru: 'I'm from ___'. Ippo irukkura idam: 'I live in ___'.",
   "Velai: 'I work in a shop / an office' illana 'I'm a driver / a teacher'. Velai munnadi 'a' marakkaadheenga.",
   "Mudhal thadava paakkura aal kitta kadaisila: 'Nice to meet you.'",
   "Indha app-la CAPITAL letters-la irukkura part-a konjam strong ah sollunga (e.g. 'HI', 'NICE')."
  ],
  "ex": [
   [
    "Hi, I'm {name}.",
    "Vanakkam, naan {name}."
   ],
   [
    "I'm from Tamil Nadu.",
    "Naan Tamil Nadu-la irundhu."
   ],
   [
    "I live in {city}.",
    "Naan {city}-la irukken."
   ],
   [
    "I work in an office.",
    "Naan oru office-la velai seyyuren."
   ],
   [
    "I'm learning English.",
    "Naan English kathukkittu irukken."
   ],
   [
    "Nice to meet you.",
    "Ungala sandhichadhula sandhosham."
   ]
  ],
  "fix": [
   [
    "Myself {name}.",
    "I'm {name}.",
    "'Myself ___' native speakers solla maattaanga. 'I'm ___' dhaan sari."
   ],
   [
    "I am working in shop.",
    "I work in a shop.",
    "Permanent velai-ku 'I work'. 'shop' munnadi 'a' venum."
   ],
   [
    "My native is Madurai.",
    "I'm from Madurai.",
    "'My native' thappu. 'I'm from ___' illana 'My hometown is ___'."
   ]
  ],
  "sound": null,
  "say": [
   "[Hi], I'm {name}.",
   "I'm from [Tam]il [Na]du.",
   "I [live] in {city}.",
   "I'm [learn]ing [Eng]lish.",
   "[Nice] to [meet] you."
  ],
  "quiz": [
   {
    "q": "'Naan {name}' — English-la eppadi?",
    "o": [
     "Myself {name}.",
     "I'm {name}.",
     "I {name}."
    ],
    "a": 1,
    "y": "'I'm' (I am) dhaan sari. 'Myself {name}' Indian style — avoid pannunga."
   },
   {
    "q": "'I'm' eppadi pronounce pannuvom?",
    "o": [
     "aim",
     "im",
     "ai-yam"
    ],
    "a": 0,
    "y": "'I'm' = 'aim' — ore sound ah, fast ah."
   },
   {
    "q": "Order-la vainga: 'Naan Tamil Nadu-la irundhu.'",
    "w": [
     "I'm",
     "from",
     "Tamil",
     "Nadu"
    ],
    "y": "'I'm from' + ooru peru."
   },
   {
    "q": "Velai pathi sariyaana sentence:",
    "o": [
     "I work in a shop.",
     "I am work in shop.",
     "I working shop."
    ],
    "a": 0,
    "y": "'I work' + 'in a shop'. 'am work' thappu."
   },
   {
    "q": "Mudhal thadava oruthara paakkumbodhu kadaisila:",
    "o": [
     "Nice to meet you.",
     "Nice to see you again.",
     "Okay bye bye."
    ],
    "a": 0,
    "y": "First meeting = 'Nice to meet you'. Already therinjavanga-na 'Nice to see you'."
   }
  ],
  "build": [
   [
    "Naan {city}-la irukken.",
    "I live in {city}.",
    [
     "I'm in {city}.",
     "I stay in {city}.",
     "I am living in {city}."
    ]
   ],
   [
    "Naan English kathukkittu irukken.",
    "I'm learning English.",
    [
     "I am learning English."
    ]
   ],
   [
    "Ungala sandhichadhula sandhosham.",
    "Nice to meet you.",
    [
     "It's nice to meet you.",
     "Pleased to meet you.",
     "Glad to meet you."
    ]
   ]
  ],
  "talk": {
   "role": "a friendly new neighbour meeting him for the first time. Ask his name, where he is from, what work he does and what he likes.",
   "open": "Hi! I'm Sam. I just moved in next door. What's your name?",
   "goal": "Ungala pathi 3 answer sollunga."
  },
  "home": {
   "write": "Ungala pathi 4–5 sentence ezhudhunga: peru, ooru, velai, pidicha vishayam.",
   "task": "Mirror munnadi nindhu unga self-intro-va 3 thadava sathama sollunga."
  }
 },
 {
  "id": 2,
  "wk": 1,
  "t": "Idhu / Adhu",
  "en": "This, that, these, those",
  "goal": "Pakkathula & dhoorathula irukkura porul, aalunga pathi solla kathukkalam.",
  "teach": [
   "Pakkathula irukkura onnu = 'this' (idhu). Dhoorathula irukkura onnu = 'that' (adhu).",
   "Neraya irundha: pakkathula = 'these' (ivai), dhoorathula = 'those' (avai).",
   "Aala introduce panna: 'This is my brother.' / 'This is my friend, Ravi.'",
   "'this, that, they, mother' — 'th' sound: naakku nuni-ya rendu pal naduvula vechu, throat vibrate pannunga. 'dis' / 'dat' illa."
  ],
  "ex": [
   [
    "This is my phone.",
    "Idhu en phone."
   ],
   [
    "That is my house.",
    "Adhu en veedu."
   ],
   [
    "These are my friends.",
    "Ivanga en friends."
   ],
   [
    "Those shoes are nice.",
    "Andha shoes nalla irukku."
   ],
   [
    "This is my brother.",
    "Ivar en brother."
   ],
   [
    "What is that?",
    "Adhu enna?"
   ]
  ],
  "fix": [
   [
    "This is my friends.",
    "These are my friends.",
    "Neraya per irundha 'These are'."
   ],
   [
    "Dis is my phone.",
    "This is my phone.",
    "'th' — naakku pal naduvula. 'd' illa."
   ],
   [
    "That is mine phone.",
    "That is my phone.",
    "Porul kooda 'my'. Thaniya mattum 'mine' ('It's mine')."
   ]
  ],
  "sound": "th2",
  "say": [
   "[This] is my [phone].",
   "[That] is my [house].",
   "[These] are my [friends].",
   "My [moth]er and [fa]ther are [there]."
  ],
  "quiz": [
   {
    "q": "Pakkathula irukkura ONE porul:",
    "o": [
     "this",
     "that",
     "those"
    ],
    "a": 0,
    "y": "Pakkathula + onnu = 'this'."
   },
   {
    "q": "'Ivanga en friends' — English:",
    "o": [
     "This is my friends.",
     "These are my friends.",
     "Those is my friends."
    ],
    "a": 1,
    "y": "Neraya per + pakkathula = 'These are'."
   },
   {
    "q": "'this'-la 'th' sollumbodhu naakku enga?",
    "o": [
     "Rendu pal naduvula",
     "Mel vaai-la",
     "Udhattu mela"
    ],
    "a": 0,
    "y": "Naakku nuni pal naduvula + throat vibration."
   },
   {
    "q": "Order-la vainga: 'Adhu en veedu.'",
    "w": [
     "That",
     "is",
     "my",
     "house"
    ],
    "y": "Dhoorathula = 'That is ___'."
   },
   {
    "q": "'Adhu enna?' (dhoorathula irukkuradhu)",
    "o": [
     "What is this?",
     "What is that?",
     "What are these?"
    ],
    "a": 1,
    "y": "Dhoorathula + onnu = 'that'."
   }
  ],
  "build": [
   [
    "Idhu en bag.",
    "This is my bag.",
    [
     "This bag is mine."
    ]
   ],
   [
    "Andha car romba nalla irukku.",
    "That car is very nice.",
    [
     "That car is very good.",
     "That car is really nice.",
     "That car looks very nice."
    ]
   ],
   [
    "Ivanga en family.",
    "This is my family.",
    [
     "These are my family members."
    ]
   ]
  ],
  "talk": {
   "role": "a friend visiting his house for the first time, looking at things and family photos. Ask 'What is this?' and 'Who is that?' questions.",
   "open": "Wow, nice house! Who is that in the photo on the wall?",
   "goal": "'This is / That is' vachu answer pannunga."
  },
  "home": {
   "write": "Unga room-la irukkura 4 porul pathi ezhudhunga: 'This is my ___.' / 'That is my ___.'",
   "task": "Veettula 5 porul-a kaatti 'This is a ___' nu sathama sollunga."
  }
 },
 {
  "id": 3,
  "wk": 1,
  "t": "Dhinamum enna pannuveenga",
  "en": "Daily routine",
  "goal": "Dhinamum nadakkura vishayangala English-la solla kathukkalam.",
  "teach": [
   "Dhinamum nadakkura vishayam-ku simple verb: 'I wake up', 'I eat', 'I go'.",
   "Neram sollanum na 'at': 'at 6 o'clock', 'at 9'.",
   "Dhinamum = 'every day'. Usual ah = 'usually'. Eppovumey = 'always'.",
   "'think, three, thanks' — naakku pal naduvula, kaathu mattum oodhunga (vibration illa). 'tink' illa, 'think'."
  ],
  "ex": [
   [
    "I wake up at 6 o'clock.",
    "Naan 6 mani-ku ezhundhiruppen."
   ],
   [
    "I drink tea every morning.",
    "Dhinamum kaalaila tea kudippen."
   ],
   [
    "I go to work at 9.",
    "9 mani-ku velai-ku poven."
   ],
   [
    "I usually have lunch at 1.",
    "Usual ah 1 mani-ku saappiduven."
   ],
   [
    "I watch TV at night.",
    "Night TV paappen."
   ],
   [
    "I think English is easy.",
    "English easy-nu ninaikkiren."
   ]
  ],
  "fix": [
   [
    "I am waking up at 6 daily.",
    "I wake up at 6 every day.",
    "Dhinamum nadakkuradhu-ku 'am waking' illa — 'wake'."
   ],
   [
    "I go office.",
    "I go to the office.",
    "Oru idathukku pogumbodhu 'to' venum."
   ],
   [
    "I tink so.",
    "I think so.",
    "'th' — naakku veliya, kaathu oodhunga."
   ]
  ],
  "sound": "th1",
  "say": [
   "I [wake] [up] at [six] o'[clock].",
   "I [drink] [tea] [ev]ery [mor]ning.",
   "I [go] to [work] at [nine].",
   "I [think] [three] [things] are im[por]tant.",
   "I [watch] [TV] at [night]."
  ],
  "quiz": [
   {
    "q": "Dhinamum nadakkuradhu — sari:",
    "o": [
     "I wake up at 6.",
     "I am waking up at 6 daily.",
     "I woke up at 6 every day."
    ],
    "a": 0,
    "y": "Daily routine = simple verb ('wake up')."
   },
   {
    "q": "'Naan office-ku poven' — sari:",
    "o": [
     "I go office.",
     "I go to the office.",
     "I going office."
    ],
    "a": 1,
    "y": "'go to' + idam."
   },
   {
    "q": "Order-la vainga: 'Dhinamum kaalaila tea kudippen.'",
    "w": [
     "I",
     "drink",
     "tea",
     "every",
     "morning"
    ],
    "y": "Aal + verb + porul + eppo."
   },
   {
    "q": "'think'-la 'th' eppadi?",
    "o": [
     "Naakku pal naduvula, kaathu mattum",
     "'t' madhiri",
     "'d' madhiri"
    ],
    "a": 0,
    "y": "'think' — vibration illa, kaathu mattum."
   },
   {
    "q": "'Usual ah' — English-la:",
    "o": [
     "usually",
     "always",
     "never"
    ],
    "a": 0,
    "y": "usually = usual ah · always = eppovumey · never = eppovumey illa."
   }
  ],
  "build": [
   [
    "Naan dhinamum kaalaila 6 mani-ku ezhundhiruppen.",
    "I wake up at 6 every morning.",
    [
     "I get up at 6 every morning.",
     "Every morning I wake up at 6.",
     "I wake up at 6 o'clock every morning.",
     "I wake up every morning at 6."
    ]
   ],
   [
    "Naan 9 mani-ku velai-ku poven.",
    "I go to work at 9.",
    [
     "I go to work at 9 o'clock.",
     "I go to the office at 9."
    ]
   ],
   [
    "Naan night 10 mani-ku thoonguven.",
    "I go to bed at 10.",
    [
     "I sleep at 10.",
     "I go to sleep at 10.",
     "I sleep at 10 at night.",
     "I go to bed at 10 at night."
    ]
   ]
  ],
  "talk": {
   "role": "a friendly colleague asking about his daily routine: wake-up time, breakfast, going to work, evening and sleep.",
   "open": "Good morning! You look fresh today. What time do you usually wake up?",
   "goal": "Unga daily routine-a 3 sentence-la sollunga."
  },
  "home": {
   "write": "Unga oru naal routine-a 5 sentence-la ezhudhunga (kaalai muthal night varai).",
   "task": "Unga routine-a phone-la 1 minute record panni, thirumba kelunga."
  }
 },
 {
  "id": 4,
  "wk": 1,
  "t": "Avar / Avanga + s",
  "en": "He, she + -s",
  "goal": "Matravanga (avar / avanga) pathi correct ah solla kathukkalam.",
  "teach": [
   "He (avar), She (avanga), It (adhu) pathi pesumbodhu verb kooda 's' sekkanum: 'He works', 'She goes'.",
   "I / You / We / They-ku 's' illa: 'I work', 'They work'.",
   "Sila verbs maarum: have → has, go → goes, do → does.",
   "'school, station, start' — munnadi 'i' podaadheenga ('ischool' illa). 'sss' nu aarambichu direct ah sollunga."
  ],
  "ex": [
   [
    "My brother works in a bank.",
    "En brother bank-la velai seyyuraan."
   ],
   [
    "She goes to school by bus.",
    "Ava bus-la school-ku poraa."
   ],
   [
    "My father reads the newspaper every day.",
    "En appa dhinamum newspaper padippaar."
   ],
   [
    "He has a new bike.",
    "Avan kitta pudhu bike irukku."
   ],
   [
    "My mother cooks very well.",
    "En amma romba nalla samaippaanga."
   ],
   [
    "The shop opens at 10.",
    "Kadai 10 mani-ku thirakkum."
   ]
  ],
  "fix": [
   [
    "He go to work.",
    "He goes to work.",
    "He / She-ku 's' venum: 'goes'."
   ],
   [
    "She have a car.",
    "She has a car.",
    "He / She-ku 'has'."
   ],
   [
    "He is going to ischool.",
    "He goes to school.",
    "'school' — munnadi 'i' illa."
   ]
  ],
  "sound": "s",
  "say": [
   "She [goes] to [school] by [bus].",
   "He [has] a [new] [bike].",
   "My [fa]ther [speaks] [slow]ly.",
   "The [sta]tion is [ver]y [small].",
   "The [shop] [o]pens at [ten]."
  ],
  "quiz": [
   {
    "q": "My father ___ tea every morning.",
    "o": [
     "drink",
     "drinks",
     "drinking"
    ],
    "a": 1,
    "y": "Father = he → 'drinks'."
   },
   {
    "q": "She ___ a new phone.",
    "o": [
     "have",
     "has",
     "haves"
    ],
    "a": 1,
    "y": "She-ku 'has'."
   },
   {
    "q": "Sariyaana sentence:",
    "o": [
     "They works here.",
     "They work here.",
     "They working here."
    ],
    "a": 1,
    "y": "They-ku 's' illa."
   },
   {
    "q": "Order-la vainga: 'Ava school-ku poraa.'",
    "w": [
     "She",
     "goes",
     "to",
     "school"
    ],
    "y": "She + goes ('s' marakkaadheenga)."
   },
   {
    "q": "'school' eppadi aarambikkanum?",
    "o": [
     "sss-kool",
     "i-skool",
     "e-skool"
    ],
    "a": 0,
    "y": "Munnadi 'i' / 'e' sound podaadheenga."
   }
  ],
  "build": [
   [
    "En brother oru bank-la velai seyyuraan.",
    "My brother works in a bank.",
    [
     "My brother works at a bank.",
     "My younger brother works in a bank.",
     "My elder brother works in a bank."
    ]
   ],
   [
    "En amma dhinamum kovil-ku poovaanga.",
    "My mother goes to the temple every day.",
    [
     "My mother goes to temple every day.",
     "Every day my mother goes to the temple.",
     "My mom goes to the temple every day."
    ]
   ],
   [
    "Kadai 9 mani-ku thirakkum.",
    "The shop opens at 9.",
    [
     "The shop opens at 9 o'clock.",
     "The store opens at 9."
    ]
   ]
  ],
  "talk": {
   "role": "a curious friend asking about his family members: what each person does, where they live, what they like.",
   "open": "Tell me about your family! What does your father do?",
   "goal": "'He works / She goes' — 's' marakkaama sollunga."
  },
  "home": {
   "write": "Unga family-la 3 per pathi ezhudhunga: 'My ___ works / lives / likes ___.'",
   "task": "'school, station, start, small, speak' — 5 words-um 'i' illama 3 thadava sollunga."
  }
 },
 {
  "id": 5,
  "wk": 1,
  "t": "Kelvi kekkuradhu",
  "en": "Questions with do / does",
  "goal": "Matravanga kitta kelvi kekka kathukkalam — conversation-a neengale nadathalaam.",
  "teach": [
   "Tamil-la kelvi kadaisila '-aa?' ('Tea kudippeengalaa?'). English-la munnadi 'Do' podanum: 'Do you drink tea?'",
   "He / She-na 'Does': 'Does he work here?' — appo verb-ku 's' illa ('Does he works' thappu).",
   "Kelvi words: What (enna), Where (enga), When (eppo), Why (yen), How (eppadi), Who (yaar). Order: kelvi word + do + you + verb → 'Where do you live?'",
   "'v' sound: mel pal-a keezh udhattula lightly vechu 'vvv'. 'w' sound: udhadu round ('oo' madhiri), pal thodaadhu."
  ],
  "ex": [
   [
    "Do you like coffee?",
    "Ungalukku coffee pidikkumaa?"
   ],
   [
    "Where do you live?",
    "Neenga enga irukkeenga?"
   ],
   [
    "What do you do?",
    "Neenga enna velai pannureenga?"
   ],
   [
    "Does she speak English?",
    "Avanga English pesuvaangalaa?"
   ],
   [
    "Why do you want this job?",
    "Ungalukku indha velai yen venum?"
   ],
   [
    "How do you go to work?",
    "Velai-ku eppadi poveenga?"
   ]
  ],
  "fix": [
   [
    "You like coffee?",
    "Do you like coffee?",
    "Kelvi-ku munnadi 'Do'."
   ],
   [
    "Where you live?",
    "Where do you live?",
    "Kelvi word-ku apram 'do' venum."
   ],
   [
    "Does he works here?",
    "Does he work here?",
    "'Does' irundha verb-ku 's' illa."
   ]
  ],
  "sound": "vw",
  "say": [
   "Do you [like] [cof]fee?",
   "[Where] do you [live]?",
   "[What] do you [do]?",
   "Does she [speak] [Eng]lish?",
   "[Wa]ter is [ver]y im[por]tant."
  ],
  "quiz": [
   {
    "q": "'Ungalukku tea pidikkumaa?'",
    "o": [
     "You like tea?",
     "Do you like tea?",
     "Are you like tea?"
    ],
    "a": 1,
    "y": "Kelvi = 'Do' + you + verb."
   },
   {
    "q": "Sariyaana kelvi:",
    "o": [
     "Where you work?",
     "Where do you work?",
     "Where are you work?"
    ],
    "a": 1,
    "y": "Kelvi word + do + you + verb."
   },
   {
    "q": "___ your brother live in Chennai?",
    "o": [
     "Do",
     "Does",
     "Is"
    ],
    "a": 1,
    "y": "Brother = he → 'Does'."
   },
   {
    "q": "Order-la vainga: 'Neenga enna velai pannureenga?'",
    "w": [
     "What",
     "do",
     "you",
     "do"
    ],
    "y": "What + do + you + do (rendu 'do' varum!)."
   },
   {
    "q": "'very'-la 'v' eppadi?",
    "o": [
     "Mel pal keezh udhattula",
     "Rendu udhadum round ah",
     "Naakku pal naduvula"
    ],
    "a": 0,
    "y": "'v' = pal + udhadu. 'w' = udhadu round."
   }
  ],
  "build": [
   [
    "Neenga enga velai pannureenga?",
    "Where do you work?",
    []
   ],
   [
    "Ungalukku cricket pidikkumaa?",
    "Do you like cricket?",
    []
   ],
   [
    "Avar English pesuvaaraa?",
    "Does he speak English?",
    [
     "Can he speak English?"
    ]
   ]
  ],
  "talk": {
   "role": "a new colleague who joined today. Let HIM ask the questions: answer each question in one short sentence, then invite him to ask another question.",
   "open": "Hi, I'm Priya. I joined today. You can ask me anything!",
   "goal": "Neenga 3 kelvi kelunga (Do you...? / Where do you...?)."
  },
  "home": {
   "write": "Oru pudhu friend kitta kekka 5 kelvi ezhudhunga (Do you...? / Where do you...? / What do you...?).",
   "task": "'very, video, seven' & 'water, work, window' — mirror munnadi 3 thadava sollunga."
  }
 },
 {
  "id": 6,
  "wk": 1,
  "t": "Mudiyum / Mudiyaadhu",
  "en": "Can and can't",
  "goal": "Mudiyum, mudiyaadhu, permission kekkuradhu — 'can' vachu solla kathukkalam.",
  "teach": [
   "Mudiyum = 'can': 'I can drive.' Mudiyaadhu = 'can't': 'I can't swim.'",
   "'can' apram verb maaradhu: 'She can cook' ('She can cooks' thappu).",
   "Kelvi: 'Can you help me?' Permission: 'Can I sit here?'",
   "Tip: sentence-la 'can' soft ah ('kun'), 'can't' strong ah ('kaant') — appo dhaan vithyaasam puriyum.",
   "'f' sound: mel pal-a keezh udhattu mela vechu kaathu oodhunga. Udhadu moodina 'p' aaidum: 'coffee' (copy illa), 'phone'."
  ],
  "ex": [
   [
    "I can drive a car.",
    "Enakku car otta theriyum."
   ],
   [
    "I can't speak Hindi.",
    "Enakku Hindi pesa theriyaadhu."
   ],
   [
    "Can you help me, please?",
    "Konjam help panna mudiyumaa?"
   ],
   [
    "Can I come in?",
    "Ulla varalaamaa?"
   ],
   [
    "She can cook very well.",
    "Ava romba nalla samaippaa."
   ],
   [
    "Can I have a coffee, please?",
    "Oru coffee kidaikkumaa?"
   ]
  ],
  "fix": [
   [
    "I can able to come.",
    "I can come.",
    "'can' & 'able to' serththu vendaam. Onnu podhum."
   ],
   [
    "She can cooks.",
    "She can cook.",
    "'can' apram 's' illa."
   ],
   [
    "Can I get a copy? (coffee venum)",
    "Can I get a coffee?",
    "'coffee'-la 'f' — udhadu moodaadheenga."
   ]
  ],
  "sound": "f",
  "say": [
   "I can [drive] a [car].",
   "I [can't] [speak] [Hin]di.",
   "Can you [help] me, [please]?",
   "Can I [have] a [cof]fee?",
   "My [phone] is on the [ta]ble."
  ],
  "quiz": [
   {
    "q": "'Enakku neendha theriyaadhu.'",
    "o": [
     "I can't swim.",
     "I don't can swim.",
     "I not can swim."
    ],
    "a": 0,
    "y": "Mudiyaadhu = can't + verb."
   },
   {
    "q": "Sari:",
    "o": [
     "He can speaks English.",
     "He can speak English.",
     "He cans speak English."
    ],
    "a": 1,
    "y": "'can' apram verb maaradhu."
   },
   {
    "q": "Help polite ah kekka:",
    "o": [
     "Help me.",
     "Can you help me, please?",
     "You help me."
    ],
    "a": 1,
    "y": "'Can you ___, please?' = polite."
   },
   {
    "q": "Order-la vainga: 'Inga ukkaaralaamaa?'",
    "w": [
     "Can",
     "I",
     "sit",
     "here"
    ],
    "y": "Permission = 'Can I ___?'"
   },
   {
    "q": "'coffee'-la 'f' eppadi?",
    "o": [
     "Pal + keezh udhadu, kaathu",
     "Rendu udhadum moodi",
     "Naakku pal naduvula"
    ],
    "a": 0,
    "y": "'f' = mel pal keezh udhattula; 'p' illa."
   }
  ],
  "build": [
   [
    "Enakku Tamil-um English-um pesa theriyum.",
    "I can speak Tamil and English.",
    []
   ],
   [
    "Naalaiku vara mudiyaadhu.",
    "I can't come tomorrow.",
    [
     "I cannot come tomorrow.",
     "I can't come tomorrow, sorry.",
     "Sorry, I can't come tomorrow."
    ]
   ],
   [
    "Konjam mella pesa mudiyumaa?",
    "Can you speak slowly, please?",
    [
     "Can you speak slowly?",
     "Could you speak slowly, please?",
     "Could you speak more slowly?",
     "Can you speak a little slowly?",
     "Could you speak a little slower?"
    ]
   ]
  ],
  "talk": {
   "role": "a friend planning a Sunday trip with him. Ask what he can and can't do: drive, cook, swim, come on Sunday, bring something.",
   "open": "We're planning a trip this Sunday! Can you drive? We need one more driver.",
   "goal": "'I can / I can't' vachu answer pannunga."
  },
  "home": {
   "write": "Ungalukku mudinja 3 vishayam, mudiyaadha 2 vishayam ezhudhunga (I can... / I can't...).",
   "task": "'phone, coffee, food, office, family' — 5 words-um 'p' illama sollunga."
  }
 },
 {
  "id": 7,
  "wk": 1,
  "t": "Vaara revision: 1 minute intro",
  "en": "Week 1 review",
  "goal": "Indha vaaram kathukittadha serththu, 1 minute ungala pathi pesalaam.",
  "teach": [
   "Indha vaaram: I'm · This / That · daily routine · He / She + s · Do / Does kelvi · can / can't.",
   "1 minute intro format: 1) Peru, ooru 2) Velai 3) Daily routine 4) Family 5) Mudinjadhu / pidichadhu 6) 'Thank you'.",
   "Thappu varum — paravaa illa. Niruthaama pesuradhu dhaan mukkiyam."
  ],
  "ex": [
   [
    "Hi, I'm {name}. I'm from Tamil Nadu.",
    "Vanakkam, naan {name}. Tamil Nadu."
   ],
   [
    "I live in {city} with my family.",
    "En family kooda {city}-la irukken."
   ],
   [
    "I wake up early and go to work at 9.",
    "Seekiram ezhundhu 9 mani-ku velai-ku poven."
   ],
   [
    "My brother works in IT.",
    "En brother IT-la velai seyyuraan."
   ],
   [
    "I can drive, and I like cricket.",
    "Enakku drive panna theriyum, cricket pidikkum."
   ],
   [
    "I'm learning English every day. Thank you!",
    "Dhinamum English kathukkiren. Nandri!"
   ]
  ],
  "fix": [
   [
    "Myself {name}.",
    "I'm {name}.",
    "Self-intro 'I'm'-la aarambinga."
   ],
   [
    "He go to work.",
    "He goes to work.",
    "He / She-ku 's'."
   ],
   [
    "Where you live?",
    "Where do you live?",
    "Kelvi-la 'do' marakkaadheenga."
   ]
  ],
  "sound": null,
  "say": [
   "[Hi], I'm {name}. I'm from [Tam]il [Na]du.",
   "I [live] in {city} with my [fam]ily.",
   "I [wake] [up] [ear]ly and [go] to [work] at [nine].",
   "My [broth]er [works] in [IT].",
   "I'm [learn]ing [Eng]lish [ev]ery [day]. [Thank] you!"
  ],
  "quiz": [
   {
    "q": "My sister ___ in a bank.",
    "o": [
     "work",
     "works",
     "working"
    ],
    "a": 1,
    "y": "Sister = she → 'works'."
   },
   {
    "q": "___ he like tea?",
    "o": [
     "Do",
     "Does",
     "Is"
    ],
    "a": 1,
    "y": "He → 'Does'."
   },
   {
    "q": "'Ivanga en friends'",
    "o": [
     "These are my friends.",
     "This is my friends."
    ],
    "a": 0,
    "y": "Neraya per = 'These are'."
   },
   {
    "q": "Order-la vainga: 'Neenga enga irukkeenga?'",
    "w": [
     "Where",
     "do",
     "you",
     "live"
    ],
    "y": "Kelvi word + do + you + verb."
   },
   {
    "q": "I ___ swim. (theriyaadhu)",
    "o": [
     "can't",
     "don't can",
     "not can"
    ],
    "a": 0,
    "y": "Mudiyaadhu = 'can't'."
   }
  ],
  "build": [
   [
    "Naan dhinamum kaalaila walking poven.",
    "I go for a walk every morning.",
    [
     "I walk every morning.",
     "Every morning I go for a walk.",
     "I go walking every morning."
    ]
   ],
   [
    "En appa oru kadai vechirukkaaru.",
    "My father has a shop.",
    [
     "My father runs a shop.",
     "My father owns a shop.",
     "My dad has a shop."
    ]
   ],
   [
    "Ungalukku samaikka pidikkumaa?",
    "Do you like cooking?",
    [
     "Do you like to cook?"
    ]
   ]
  ],
  "talk": {
   "role": "a friendly person at a family function asking him to introduce himself fully. After each answer, ask one simple follow-up question.",
   "open": "Hi! Please tell me about yourself — your name, where you're from, and what you do.",
   "goal": "Unga 1-minute intro-va AI kitta sollunga."
  },
  "home": {
   "write": "Unga full self-intro-va 6–8 sentence-la ezhudhunga.",
   "task": "Phone-la 1 minute self-intro record pannunga. Naalaiku kettu, oru thappu kandu pidinga."
  }
 },
 {
  "id": 8,
  "wk": 2,
  "t": "Neththu nadandhadhu (-ed)",
  "en": "Past tense: -ed",
  "goal": "Neththu, pona vaaram nadandhadha solla kathukkalam.",
  "teach": [
   "Mudinja vishayam (past) — perumbaalum verb kooda '-ed': work → worked, play → played, call → called.",
   "Neththu = 'yesterday'. Pona vaaram = 'last week'. Rendu naal munnadi = '2 days ago'.",
   "'-ed' moonu vidha sound: 'worked' = workt (t), 'played' = playd (d), 'wanted' = want-id (id — 't' / 'd'-la mudiyura verb-ku mattum).",
   "'work-ed' nu thani ah sollaadheenga — 'workt' ore thadava."
  ],
  "ex": [
   [
    "I worked late yesterday.",
    "Neththu late ah velai pannen."
   ],
   [
    "We played cricket last Sunday.",
    "Pona Sunday cricket aadinom."
   ],
   [
    "She called me in the morning.",
    "Ava kaalaila enakku call pannaa."
   ],
   [
    "I watched a movie last night.",
    "Neththu night oru padam paathen."
   ],
   [
    "He started a new job.",
    "Avan pudhu velai aarambichaan."
   ],
   [
    "I waited for the bus for 20 minutes.",
    "Bus-ku 20 nimisham wait pannen."
   ]
  ],
  "fix": [
   [
    "Yesterday I work late.",
    "Yesterday I worked late.",
    "Neththu = past → '-ed'."
   ],
   [
    "I watch-ed a movie.",
    "I watched a movie.",
    "'-ed' thani ah sollaadheenga: 'watcht'."
   ],
   [
    "I am finished my work.",
    "I finished my work.",
    "Past-ku 'am' vendaam."
   ]
  ],
  "sound": "ed",
  "say": [
   "I [worked] [late] [yes]terday.",
   "We [played] [crick]et last [Sun]day.",
   "She [called] me in the [mor]ning.",
   "I [watched] a [mov]ie last [night].",
   "He [start]ed a [new] [job]."
  ],
  "quiz": [
   {
    "q": "Yesterday I ___ my friend.",
    "o": [
     "call",
     "called",
     "calling"
    ],
    "a": 1,
    "y": "Yesterday = past → 'called'."
   },
   {
    "q": "'worked' eppadi solluvom?",
    "o": [
     "workt",
     "work-ed",
     "work-id"
    ],
    "a": 0,
    "y": "'k'-ku apram '-ed' = 't' sound."
   },
   {
    "q": "'wanted' eppadi?",
    "o": [
     "want-id",
     "wantt",
     "want-ed-d"
    ],
    "a": 0,
    "y": "'t'-la mudinja verb-ku '-ed' = 'id'."
   },
   {
    "q": "Order-la vainga: 'Neththu oru padam paathen.'",
    "w": [
     "I",
     "watched",
     "a",
     "movie",
     "yesterday"
    ],
    "y": "Aal + past verb + porul + eppo."
   },
   {
    "q": "Sari:",
    "o": [
     "I am finished my work.",
     "I finished my work.",
     "I finish my work yesterday."
    ],
    "a": 1,
    "y": "Past = 'finished'. 'am' vendaam."
   }
  ],
  "build": [
   [
    "Neththu naan amma-ku call pannen.",
    "I called my mother yesterday.",
    [
     "Yesterday I called my mother.",
     "I called my mom yesterday.",
     "Yesterday I called my mom."
    ]
   ],
   [
    "Naanga pona vaaram Chennai-ku travel pannom.",
    "We traveled to Chennai last week.",
    [
     "We travelled to Chennai last week.",
     "Last week we traveled to Chennai.",
     "Last week we travelled to Chennai."
    ]
   ],
   [
    "Bus-ku 30 nimisham wait pannen.",
    "I waited for the bus for 30 minutes.",
    [
     "I waited 30 minutes for the bus.",
     "I waited for 30 minutes for the bus."
    ]
   ]
  ],
  "talk": {
   "role": "a friend asking what he did last weekend. Keep asking simple past questions like 'What did you do then?'.",
   "open": "Hey! How was your weekend? What did you do on Saturday?",
   "goal": "'-ed' verbs vachu neththu / pona vaaram nadandhadha sollunga."
  },
  "home": {
   "write": "Neththu neenga panna 5 vishayam ezhudhunga (worked, cooked, watched, called, cleaned...).",
   "task": "'worked, asked, helped, played, called, wanted' — sariyaana '-ed' sound-la sollunga."
  }
 },
 {
  "id": 9,
  "wk": 2,
  "t": "Maaridum past verbs",
  "en": "Past tense: went, ate, saw",
  "goal": "Adikkadi use pannura 'maaridum' verbs (went, ate, saw...) kathukkalam.",
  "teach": [
   "Sila verbs-ku '-ed' illa — muzhusa maaridum: go → went, eat → ate, see → saw, come → came, buy → bought.",
   "Innum: have → had, do → did, get → got, take → took, give → gave, make → made, say → said, tell → told.",
   "Dhinamum 5 verb sathama sollunga — oru vaarathula nyaabagam irukkum.",
   "'z' sound: 's' sollumbodhu throat vibrate pannunga (bee 'zzz'). 'was', 'is', 'busy', 'because' — ellaam 'z' sound."
  ],
  "ex": [
   [
    "I went to the market yesterday.",
    "Neththu market-ku ponen."
   ],
   [
    "We ate dosa for breakfast.",
    "Breakfast-ku dosa saaptom."
   ],
   [
    "I saw your brother at the bus stop.",
    "Unga brother-a bus stop-la paathen."
   ],
   [
    "She bought a new saree.",
    "Ava pudhu saree vaanginaa."
   ],
   [
    "He came home late.",
    "Avan late ah veettukku vandhaan."
   ],
   [
    "I was very busy last week.",
    "Pona vaaram romba busy ah irundhen."
   ]
  ],
  "fix": [
   [
    "I goed to the shop.",
    "I went to the shop.",
    "'go'-oda past = 'went'."
   ],
   [
    "Yesterday I buyed a phone.",
    "Yesterday I bought a phone.",
    "'buy'-oda past = 'bought'."
   ],
   [
    "I was went there.",
    "I went there.",
    "'was' + 'went' rendum vendaam."
   ]
  ],
  "sound": "z",
  "say": [
   "I [went] to the [mar]ket [yes]terday.",
   "We [ate] [dosa] for [break]fast.",
   "I [saw] your [broth]er at the [bus] stop.",
   "She [bought] a [new] [phone].",
   "I was [ver]y [bus]y because of [work]."
  ],
  "quiz": [
   {
    "q": "'go'-oda past:",
    "o": [
     "goed",
     "went",
     "gone"
    ],
    "a": 1,
    "y": "go → went."
   },
   {
    "q": "Neththu naan oru phone ___.",
    "o": [
     "buyed",
     "bought",
     "buy"
    ],
    "a": 1,
    "y": "buy → bought."
   },
   {
    "q": "Sari:",
    "o": [
     "I was went to Chennai.",
     "I went to Chennai.",
     "I am went to Chennai."
    ],
    "a": 1,
    "y": "Past = 'went' mattum podhum."
   },
   {
    "q": "Order-la vainga: 'Breakfast-ku dosa saaptom.'",
    "w": [
     "We",
     "ate",
     "dosa",
     "for",
     "breakfast"
    ],
    "y": "eat → ate."
   },
   {
    "q": "'busy'-la 's' eppadi sound aagum?",
    "o": [
     "z (vibration)",
     "s (kaathu mattum)",
     "j"
    ],
    "a": 0,
    "y": "'busy' = 'bizzy'."
   }
  ],
  "build": [
   [
    "Neththu naan kovil-ku ponen.",
    "I went to the temple yesterday.",
    [
     "Yesterday I went to the temple.",
     "I went to temple yesterday."
    ]
   ],
   [
    "Naanga hotel-la biryani saaptom.",
    "We ate biryani at a restaurant.",
    [
     "We had biryani at a restaurant.",
     "We ate biryani at a hotel.",
     "We had biryani at a hotel.",
     "We ate biryani in a restaurant.",
     "We ate biryani in a hotel."
    ]
   ],
   [
    "Ava enakku oru gift kuduthaa.",
    "She gave me a gift.",
    [
     "She gave a gift to me."
    ]
   ]
  ],
  "talk": {
   "role": "a friend asking about his last holiday or family function: where he went, what he ate, who he saw, what he bought.",
   "open": "Tell me about your last holiday! Where did you go?",
   "goal": "'went, ate, saw, bought' vachu sollunga."
  },
  "home": {
   "write": "Unga last trip / function pathi 5 sentence ezhudhunga (went, saw, ate, bought, came).",
   "task": "10 verbs (go-went, eat-ate, see-saw, come-came, buy-bought, have-had, do-did, get-got, take-took, give-gave) 2 thadava sathama sollunga."
  }
 },
 {
  "id": 10,
  "wk": 2,
  "t": "Did / Didn't",
  "en": "Past questions and 'not'",
  "goal": "Past-la kelvi kekka & 'illa' nu solla kathukkalam.",
  "teach": [
   "Past kelvi: 'Did' + aal + verb (simple form): 'Did you eat?' ('Did you ate' thappu).",
   "Past-la 'illa': 'didn't' + simple verb: 'I didn't go' ('didn't went' thappu).",
   "Short answer: 'Yes, I did.' / 'No, I didn't.'",
   "Sound: neela 'ee' (sheep, leave, seat) vs short 'i' (ship, live, sit). 'leave' (kilambu) vs 'live' (vaazhu) — meaning-e maarum!"
  ],
  "ex": [
   [
    "Did you eat?",
    "Saapteengalaa?"
   ],
   [
    "Did you sleep well?",
    "Nalla thoongineengalaa?"
   ],
   [
    "I didn't go to work today.",
    "Indru velai-ku pogala."
   ],
   [
    "He didn't call me.",
    "Avan enakku call pannala."
   ],
   [
    "Did she pay the bill?",
    "Ava bill kattinaalaa?"
   ],
   [
    "No, I didn't see him.",
    "Illa, avara paakkala."
   ]
  ],
  "fix": [
   [
    "Did you went?",
    "Did you go?",
    "'Did' apram simple verb."
   ],
   [
    "I didn't saw him.",
    "I didn't see him.",
    "'didn't' apram simple verb."
   ],
   [
    "You ate?",
    "Did you eat?",
    "Past kelvi-ku munnadi 'Did'."
   ]
  ],
  "sound": "vowel",
  "say": [
   "Did you [eat] [break]fast?",
   "I [did]n't [go] to [work] to[day].",
   "Did you [sleep] [well]?",
   "I [live] [here], but I [leave] at [six].",
   "[Please] [sit] in this [seat]."
  ],
  "quiz": [
   {
    "q": "___ you call him yesterday?",
    "o": [
     "Do",
     "Did",
     "Does"
    ],
    "a": 1,
    "y": "Yesterday = past → 'Did'."
   },
   {
    "q": "Sari:",
    "o": [
     "Did you went?",
     "Did you go?",
     "Did you going?"
    ],
    "a": 1,
    "y": "'Did' + simple verb."
   },
   {
    "q": "Sari:",
    "o": [
     "I didn't saw it.",
     "I didn't see it.",
     "I not saw it."
    ],
    "a": 1,
    "y": "'didn't' + simple verb."
   },
   {
    "q": "Order-la vainga: 'Neenga bill kattineengalaa?'",
    "w": [
     "Did",
     "you",
     "pay",
     "the",
     "bill"
    ],
    "y": "Did + you + verb."
   },
   {
    "q": "'leave' (kilambu) eppadi?",
    "o": [
     "leev (neelam)",
     "liv (short)"
    ],
    "a": 0,
    "y": "'leave' = neela 'ee'. 'live' = short 'i'."
   }
  ],
  "build": [
   [
    "Saapteengalaa?",
    "Did you eat?",
    [
     "Have you eaten?",
     "Did you have food?",
     "Did you have lunch?"
    ]
   ],
   [
    "Naan neththu TV paakkala.",
    "I didn't watch TV yesterday.",
    [
     "Yesterday I didn't watch TV.",
     "I did not watch TV yesterday."
    ]
   ],
   [
    "Neenga avara paatheengalaa?",
    "Did you see him?",
    [
     "Did you meet him?"
    ]
   ]
  ],
  "talk": {
   "role": "a caring family friend asking him yes/no questions about his day: did you eat, did you go to work, did you call your mother, did you sleep well.",
   "open": "Hi! Did you have breakfast this morning?",
   "goal": "'Yes, I did / No, I didn't' + oru extra vishayam sollunga."
  },
  "home": {
   "write": "Neththu neenga PANNAADHA 4 vishayam ezhudhunga: 'I didn't ___.'",
   "task": "'sheep–ship, seat–sit, leave–live, fool–full' — jodi jodi ah 3 thadava sollunga."
  }
 },
 {
  "id": 11,
  "wk": 2,
  "t": "Mariyaadhaiyaana English",
  "en": "Polite English",
  "goal": "Mariyaadhaiya, soft ah pesa kathukkalam — ellaarum virumbuvaanga.",
  "teach": [
   "Order madhiri kekka koodadhu: 'Give water' ✗ → 'Could I have some water, please?' ✓",
   "Request: 'Could you ___, please?' (romba polite) · 'Can you ___?' (friendly).",
   "Gavanam ezhukka: 'Excuse me'. Thappu pannina: 'Sorry' / 'I'm sorry'. Nandri: 'Thank you' / 'Thanks a lot'.",
   "Yaaraavadhu 'Thank you' sonna: 'You're welcome' / 'No problem'.",
   "Edhaavadhu offer panna: 'Would you like ___?' (___ venumaa?)."
  ],
  "ex": [
   [
    "Could you help me, please?",
    "Konjam help panna mudiyumaa?"
   ],
   [
    "Excuse me, is this seat free?",
    "Excuse me, indha seat free-aa?"
   ],
   [
    "Sorry, I'm late.",
    "Sorry, late aayiduchu."
   ],
   [
    "Would you like some tea?",
    "Tea venumaa?"
   ],
   [
    "Thank you so much for your help.",
    "Unga help-ku romba nandri."
   ],
   [
    "No problem. You're welcome.",
    "Paravaa illa. Welcome."
   ]
  ],
  "fix": [
   [
    "Do the needful.",
    "Could you please take care of this?",
    "'Do the needful' pazhaiya style. Enna venum nu clear ah kelunga."
   ],
   [
    "Give me one tea.",
    "Could I have a tea, please?",
    "'Give me' konjam rough. 'Could I have' polite."
   ],
   [
    "Kindly revert back.",
    "Please reply.",
    "'revert back' thappu. 'reply' podhum."
   ]
  ],
  "sound": null,
  "say": [
   "Could you [help] me, [please]?",
   "Ex[cuse] me, is this [seat] [free]?",
   "[Sor]ry, I'm [late].",
   "Would you [like] some [tea]?",
   "[Thank] you so [much] for your [help]."
  ],
  "quiz": [
   {
    "q": "Romba polite:",
    "o": [
     "Give me water.",
     "I want water.",
     "Could I have some water, please?"
    ],
    "a": 2,
    "y": "'Could I have ___, please?' = romba polite."
   },
   {
    "q": "Yaaro 'Thank you' sonna:",
    "o": [
     "You're welcome.",
     "Same to you.",
     "Okay thanks."
    ],
    "a": 0,
    "y": "'Thank you'-ku pathil: 'You're welcome' / 'No problem'."
   },
   {
    "q": "Bus-la seat kekka:",
    "o": [
     "Excuse me, is this seat free?",
     "Hey, seat?",
     "Give seat."
    ],
    "a": 0,
    "y": "'Excuse me' vachu aarambinga."
   },
   {
    "q": "Order-la vainga: 'Konjam help panna mudiyumaa?'",
    "w": [
     "Could",
     "you",
     "help",
     "me",
     "please"
    ],
    "y": "Could + you + verb + please."
   },
   {
    "q": "'Kindly revert back' — better:",
    "o": [
     "Please reply.",
     "Please revert.",
     "Kindly back."
    ],
    "a": 0,
    "y": "'reply' simple & correct."
   }
  ],
  "build": [
   [
    "Konjam kadhava moodureengalaa?",
    "Could you close the door, please?",
    [
     "Can you close the door, please?",
     "Could you please close the door?",
     "Can you please close the door?",
     "Could you close the door?"
    ]
   ],
   [
    "Excuse me, bus stand enga irukku?",
    "Excuse me, where is the bus stand?",
    [
     "Excuse me, where's the bus stand?",
     "Excuse me, where is the bus station?",
     "Excuse me, where's the bus station?"
    ]
   ],
   [
    "Late aanadhukku sorry.",
    "Sorry for being late.",
    [
     "Sorry I'm late.",
     "I'm sorry for being late.",
     "Sorry for the delay.",
     "I'm sorry I'm late."
    ]
   ]
  ],
  "talk": {
   "role": "a hotel receptionist. He is a guest and must make polite requests: a room, water, an extra towel, a wake-up call.",
   "open": "Good evening, sir. Welcome to Green Park Hotel. How can I help you?",
   "goal": "'Could you / Could I have ___, please?' use pannunga."
  },
  "home": {
   "write": "Office / kadai-la use panna 5 polite requests ezhudhunga (Could you...? / Could I...?).",
   "task": "Indru 3 thadava 'Thank you', 'Excuse me', 'Sorry' — English-la sollunga."
  }
 },
 {
  "id": 12,
  "wk": 2,
  "t": "Irukku / Illa + numbers",
  "en": "There is, there are",
  "goal": "'Irukku' nu solla & numbers / vilai clear ah solla kathukkalam.",
  "teach": [
   "Onnu irukku = 'There is': 'There is a bank near my house.' Neraya irukku = 'There are': 'There are 3 shops.'",
   "Illa = 'There isn't' / 'There aren't': 'There isn't any milk.'",
   "Kelvi: 'Is there an ATM here?' / 'Are there any buses?'",
   "Numbers: 13 = thir-TEEN (kadaisi part strong). 30 = THIR-ty (mudhal part strong). Vilai sollumbodhu idhu romba mukkiyam!"
  ],
  "ex": [
   [
    "There is a temple near my house.",
    "En veetu pakkathula oru kovil irukku."
   ],
   [
    "There are five people in my family.",
    "En family-la 5 per irukkom."
   ],
   [
    "Is there an ATM near here?",
    "Inga pakkathula ATM irukkaa?"
   ],
   [
    "There isn't any water in the bottle.",
    "Bottle-la thanni illa."
   ],
   [
    "It's fifteen rupees, not fifty.",
    "Idhu 15 rupees, 50 illa."
   ],
   [
    "There are thirty students in the class.",
    "Class-la 30 students irukkaanga."
   ]
  ],
  "fix": [
   [
    "There is many shops.",
    "There are many shops.",
    "Neraya irundha 'There are'."
   ],
   [
    "Here have a bank.",
    "There is a bank here.",
    "Tamil madhiri 'have' vendaam — 'There is'."
   ],
   [
    "In my family 5 members are there.",
    "There are 5 people in my family.",
    "'There are' munnadi varanum."
   ]
  ],
  "sound": null,
  "say": [
   "There's a [tem]ple near my [house].",
   "There are [five] [peo]ple in my [fam]ily.",
   "Is there an [ATM] near [here]?",
   "It's fif[teen] [ru]pees, [not] [fif]ty.",
   "Thir[teen] and [thir]ty are [dif]ferent."
  ],
  "quiz": [
   {
    "q": "___ two banks on this road.",
    "o": [
     "There is",
     "There are",
     "It have"
    ],
    "a": 1,
    "y": "Rendu (neraya) = 'There are'."
   },
   {
    "q": "'Inga ATM irukkaa?'",
    "o": [
     "Is there an ATM here?",
     "Here ATM is there?",
     "ATM have here?"
    ],
    "a": 0,
    "y": "Kelvi = 'Is there ___?'"
   },
   {
    "q": "13 — sariyaana stress:",
    "o": [
     "thir-TEEN",
     "THIR-teen"
    ],
    "a": 0,
    "y": "-teen numbers: kadaisi part strong."
   },
   {
    "q": "30 — sariyaana stress:",
    "o": [
     "THIR-ty",
     "thir-TY"
    ],
    "a": 0,
    "y": "-ty numbers: mudhal part strong."
   },
   {
    "q": "Order-la vainga: 'En family-la 5 per irukkom.'",
    "w": [
     "There",
     "are",
     "five",
     "people",
     "in",
     "my",
     "family"
    ],
    "y": "There are + evlo + yaar + enga."
   }
  ],
  "build": [
   [
    "En veetu pakkathula oru hospital irukku.",
    "There is a hospital near my house.",
    [
     "There's a hospital near my house.",
     "There is a hospital near my home.",
     "There's a hospital near my home."
    ]
   ],
   [
    "Fridge-la paal illa.",
    "There isn't any milk in the fridge.",
    [
     "There is no milk in the fridge.",
     "There's no milk in the fridge.",
     "There isn't milk in the fridge."
    ]
   ],
   [
    "Bus ticket 15 rupees.",
    "The bus ticket is 15 rupees.",
    [
     "The bus ticket costs 15 rupees.",
     "The ticket is 15 rupees."
    ]
   ]
  ],
  "talk": {
   "role": "a person who just moved to his area, asking what is there near his house: shops, hospital, bus stop, temple, park, ATM.",
   "open": "I just moved to your area. Is there a good supermarket near your house?",
   "goal": "'There is / There are' vachu unga area-va describe pannunga."
  },
  "home": {
   "write": "Unga area-la enna enna irukku nu 5 sentence ezhudhunga (There is / There are).",
   "task": "13–30, 14–40, 15–50, 16–60 — jodi jodi ah 3 thadava sollunga (stress maathi)."
  }
 },
 {
  "id": 13,
  "wk": 2,
  "t": "Phone-la pesuradhu",
  "en": "Phone call English",
  "goal": "Phone-la confident ah pesa — aarambam, message, mudivu.",
  "teach": [
   "Phone edutha udane: 'Hello, this is {name}.' ('Tell me' nu aarambikkaadheenga — rough ah kekkum.)",
   "Oruthar kitta pesa: 'Can I speak to Mr. Kumar, please?' Avar illana: 'Can I leave a message?'",
   "Kekkala-na: 'Sorry, could you repeat that?' / 'The line is not clear.'",
   "Mudikka: 'I'll call you back.' / 'Thanks for calling. Bye!'"
  ],
  "ex": [
   [
    "Hello, this is {name}.",
    "Hello, naan {name} pesuren."
   ],
   [
    "Can I speak to Mr. Kumar, please?",
    "Kumar sir kitta pesalaamaa?"
   ],
   [
    "He's not here right now.",
    "Avar ippo illa."
   ],
   [
    "Can I leave a message?",
    "Oru message sollalaamaa?"
   ],
   [
    "Sorry, the line is not clear.",
    "Sorry, line clear ah illa."
   ],
   [
    "I'll call you back in ten minutes.",
    "10 nimishathula thirumba call pannuren."
   ]
  ],
  "fix": [
   [
    "Tell me. (phone edutha udane)",
    "Hello, this is {name}.",
    "'Tell me' rough ah kekkum. Unga peru sollunga."
   ],
   [
    "I will call you after some time.",
    "I'll call you back in ten minutes.",
    "Evlo neram nu clear ah sollunga."
   ],
   [
    "Who is speaking?",
    "May I know who's calling?",
    "Polite ah kekkalam."
   ]
  ],
  "sound": null,
  "say": [
   "Hel[lo], this is {name}.",
   "Can I [speak] to Mr. [Ku]mar, [please]?",
   "Can I [leave] a [mes]sage?",
   "[Sor]ry, the [line] is [not] [clear].",
   "I'll [call] you [back] in [ten] [min]utes."
  ],
  "quiz": [
   {
    "q": "Phone edutha udane:",
    "o": [
     "Tell me.",
     "Hello, this is {name}.",
     "Who are you?"
    ],
    "a": 1,
    "y": "'Hello, this is ___' = polite & clear."
   },
   {
    "q": "Neenga kekkura aal illana:",
    "o": [
     "Can I leave a message?",
     "Where he went?",
     "Call him."
    ],
    "a": 0,
    "y": "'Can I leave a message?' — message vidalaam."
   },
   {
    "q": "Sariya kekkala-na:",
    "o": [
     "What?",
     "Sorry, could you repeat that?",
     "Again tell."
    ],
    "a": 1,
    "y": "'Sorry, could you repeat that?' = polite."
   },
   {
    "q": "Order-la vainga: 'Naan thirumba call pannuren.'",
    "w": [
     "I'll",
     "call",
     "you",
     "back"
    ],
    "y": "call + you + back."
   },
   {
    "q": "'Yaar pesuradhu?' — polite ah:",
    "o": [
     "Who is this?",
     "May I know who's calling?",
     "Who you?"
    ],
    "a": 1,
    "y": "'May I know who's calling?' romba polite."
   }
  ],
  "build": [
   [
    "Hello, naan {name} pesuren.",
    "Hello, this is {name}.",
    [
     "Hi, this is {name}.",
     "Hello, this is {name} speaking.",
     "Hello, {name} here.",
     "Hello, {name} speaking."
    ]
   ],
   [
    "Raju irukkaaraa? (phone-la)",
    "Is Raju there?",
    [
     "Can I speak to Raju?",
     "Can I speak to Raju, please?",
     "Is Raju available?",
     "Is Raju there, please?"
    ]
   ],
   [
    "Naan 5 nimishathula thirumba call pannuren.",
    "I'll call you back in 5 minutes.",
    [
     "I will call you back in 5 minutes.",
     "I'll call you back in five minutes."
    ]
   ]
  ],
  "talk": {
   "role": "a receptionist at 'Sri Ram Traders'. He calls to speak to the manager, Mr. Kumar, who is not available. Help him leave a message.",
   "open": "Good morning, Sri Ram Traders. How may I help you?",
   "goal": "Call aarambichu, Kumar sir-a kettu, message vittu, polite ah mudinga."
  },
  "home": {
   "write": "Oru phone call dialogue ezhudhunga (6 lines): neenga oruthara call panni appointment kekkureenga.",
   "task": "Adutha phone call-la (friend kitta kooda) 'Hello, this is {name}' nu aarambinga."
  }
 },
 {
  "id": 14,
  "wk": 2,
  "t": "Vaara revision: neththu kadhai",
  "en": "Week 2 review",
  "goal": "Past tense serththu, oru kadhai madhiri neththu nadandhadha sollalaam.",
  "teach": [
   "Past: -ed (worked, called) + maaridum verbs (went, ate, saw) + Did / didn't.",
   "Kadhai solla order words: 'First, ... Then, ... After that, ... Finally, ...'",
   "Polite words marakkaadheenga: please, thank you, sorry, excuse me."
  ],
  "ex": [
   [
    "First, I woke up at 6.",
    "Mudhalla 6 mani-ku ezhundhen."
   ],
   [
    "Then, I had coffee and checked my phone.",
    "Aprom coffee kudichu phone paathen."
   ],
   [
    "After that, I went to work by bus.",
    "Adhukku apram bus-la velai-ku ponen."
   ],
   [
    "In the evening, I called my friend.",
    "Saayangaalam en friend-ku call pannen."
   ],
   [
    "Finally, I watched TV and slept at 10.",
    "Kadaisila TV paathu 10 mani-ku thoonginen."
   ]
  ],
  "fix": [
   [
    "Yesterday I go to market.",
    "Yesterday I went to the market.",
    "Past = 'went' + 'the market'."
   ],
   [
    "I didn't went.",
    "I didn't go.",
    "'didn't' apram simple verb."
   ],
   [
    "Then after that I came.",
    "After that, I came.",
    "'Then' or 'After that' — onnu podhum."
   ]
  ],
  "sound": null,
  "say": [
   "[First], I [woke] [up] at [six].",
   "[Then], I [had] [cof]fee and [checked] my [phone].",
   "After [that], I [went] to [work] by [bus].",
   "In the [eve]ning, I [called] my [friend].",
   "[Fi]nally, I [watched] [TV] and [slept] at [ten]."
  ],
  "quiz": [
   {
    "q": "Yesterday she ___ to the temple.",
    "o": [
     "go",
     "went",
     "goes"
    ],
    "a": 1,
    "y": "Yesterday = past → 'went'."
   },
   {
    "q": "___ you see the match?",
    "o": [
     "Did",
     "Do",
     "Was"
    ],
    "a": 0,
    "y": "Past kelvi = 'Did'."
   },
   {
    "q": "Sari:",
    "o": [
     "Then after that I slept.",
     "After that, I slept."
    ],
    "a": 1,
    "y": "Onnu podhum."
   },
   {
    "q": "Order-la vainga: 'Bus-la velai-ku ponen.'",
    "w": [
     "I",
     "went",
     "to",
     "work",
     "by",
     "bus"
    ],
    "y": "by + vandi: 'by bus', 'by train'."
   },
   {
    "q": "'Kadaisila' — English-la:",
    "o": [
     "Finally",
     "Firstly",
     "Lastly ago"
    ],
    "a": 0,
    "y": "Finally = kadaisila."
   }
  ],
  "build": [
   [
    "Mudhalla naan tiffin saapitten.",
    "First, I had breakfast.",
    [
     "First I had breakfast.",
     "First, I ate breakfast.",
     "First I ate breakfast."
    ]
   ],
   [
    "Adhukku apram naan kadai-ku ponen.",
    "After that, I went to the shop.",
    [
     "After that I went to the shop.",
     "Then I went to the shop.",
     "After that, I went to the store."
    ]
   ],
   [
    "Saayangaalam naan friends kooda cricket aadinen.",
    "In the evening, I played cricket with my friends.",
    [
     "I played cricket with my friends in the evening.",
     "In the evening I played cricket with friends."
    ]
   ]
  ],
  "talk": {
   "role": "a friend asking him to tell the full story of his yesterday, step by step. After each answer ask what happened next.",
   "open": "Tell me about your day yesterday, from morning to night!",
   "goal": "First / Then / After that / Finally vachu sollunga."
  },
  "home": {
   "write": "Neththu full day — 6 to 8 sentence ezhudhunga (First, Then, After that, Finally).",
   "task": "Adha phone-la record panni kelunga; '-ed' sounds sariya irukka nu paarunga."
  }
 },
 {
  "id": 15,
  "wk": 3,
  "t": "Ippo nadakkuradhu (-ing)",
  "en": "Present continuous",
  "goal": "Ippo nadandhuttu irukkuradha solla kathukkalam.",
  "teach": [
   "Ippo nadandhuttu irukkuradhu = am / is / are + verb-ing: 'I'm working.' 'She's cooking.' 'They're playing.'",
   "Ippo = 'now', 'right now'.",
   "Dhinamum (routine) = 'I work'. Ippo nadakkuradhu = 'I'm working'. Rendum vera vera.",
   "Sila verbs-ku '-ing' podamaattom: know, like, want, need, have (sondham): 'I know' ✓ 'I am knowing' ✗. 'I have a question' ✓ 'I am having a doubt' ✗."
  ],
  "ex": [
   [
    "I'm watching TV now.",
    "Naan ippo TV paathuttu irukken."
   ],
   [
    "She's cooking dinner.",
    "Ava dinner samaichuttu irukkaa."
   ],
   [
    "They're playing outside.",
    "Avanga veliya vilayaadittu irukkaanga."
   ],
   [
    "I'm waiting for the bus.",
    "Naan bus-ku wait pannittu irukken."
   ],
   [
    "I have a question.",
    "Enakku oru kelvi irukku."
   ],
   [
    "What are you doing?",
    "Enna pannittu irukkeenga?"
   ]
  ],
  "fix": [
   [
    "I am having a doubt.",
    "I have a question.",
    "'have' (sondham)-ku '-ing' illa. 'doubt' badhila 'question'."
   ],
   [
    "I am knowing him.",
    "I know him.",
    "'know'-ku '-ing' illa."
   ],
   [
    "He working now.",
    "He's working now.",
    "'is' vidaadheenga."
   ]
  ],
  "sound": null,
  "say": [
   "I'm [watch]ing [TV] [now].",
   "She's [cook]ing [din]ner.",
   "I'm [wait]ing for the [bus].",
   "I [have] a [ques]tion.",
   "[What] are you [do]ing?"
  ],
  "quiz": [
   {
    "q": "Ippo: 'Naan saapittuttu irukken.'",
    "o": [
     "I eat.",
     "I'm eating.",
     "I eating."
    ],
    "a": 1,
    "y": "Ippo = am + -ing."
   },
   {
    "q": "Sari:",
    "o": [
     "I am knowing English.",
     "I know English."
    ],
    "a": 1,
    "y": "'know'-ku '-ing' illa."
   },
   {
    "q": "Sari:",
    "o": [
     "I am having a doubt.",
     "I have a question."
    ],
    "a": 1,
    "y": "'I have a question' dhaan natural."
   },
   {
    "q": "Order-la vainga: 'Enna pannittu irukkeenga?'",
    "w": [
     "What",
     "are",
     "you",
     "doing"
    ],
    "y": "What + are + you + -ing."
   },
   {
    "q": "My brother ___ right now.",
    "o": [
     "sleeps",
     "is sleeping",
     "sleeping"
    ],
    "a": 1,
    "y": "right now = is + -ing."
   }
  ],
  "build": [
   [
    "Naan ippo velai pannittu irukken.",
    "I'm working now.",
    [
     "I am working now.",
     "I'm working right now.",
     "I am working right now."
    ]
   ],
   [
    "Neenga enna pannittu irukkeenga?",
    "What are you doing?",
    [
     "What are you doing now?",
     "What are you doing right now?"
    ]
   ],
   [
    "Enakku oru kelvi irukku.",
    "I have a question.",
    [
     "I have one question.",
     "I've got a question."
    ]
   ]
  ],
  "talk": {
   "role": "a friend who calls him on the phone and asks what he and his family are doing right now.",
   "open": "Hi! I'm calling to say hello. What are you doing right now?",
   "goal": "'I'm ___ing' vachu answer pannunga."
  },
  "home": {
   "write": "Indha nimisham unga veettula yaar yaar enna pannittu irukkaanga — 5 sentence ezhudhunga.",
   "task": "Indru 3 thadava 'I'm ___ing' nu ungalukke sollikonga (e.g. 'I'm walking')."
  }
 },
 {
  "id": 16,
  "wk": 3,
  "t": "Naalaiku & plans",
  "en": "Future: going to, will",
  "goal": "Naalaiku, adutha vaaram — plans pathi solla kathukkalam.",
  "teach": [
   "Already plan pannadhu = 'going to': 'I'm going to visit my uncle tomorrow.'",
   "Ippo mudivu pannuradhu / promise = 'will' ('I'll'): 'I'll call you.' 'I'll help you.'",
   "Time words: tomorrow (naalaiku), next week (adutha vaaram), tonight (indru night), soon (seekiram).",
   "'will' + simple verb: 'I will go' ('I will going' thappu)."
  ],
  "ex": [
   [
    "I'm going to buy a bike next month.",
    "Adutha maasam bike vaanga poren."
   ],
   [
    "We're going to visit Ooty this summer.",
    "Indha summer Ooty-ku poga porom."
   ],
   [
    "I'll call you tonight.",
    "Indru night call pannuren."
   ],
   [
    "Don't worry, I'll help you.",
    "Kavalai padaadheenga, naan help pannuren."
   ],
   [
    "It's going to rain.",
    "Mazhai vara pogudhu."
   ],
   [
    "What are you going to do tomorrow?",
    "Naalaiku enna panna poreenga?"
   ]
  ],
  "fix": [
   [
    "I will going tomorrow.",
    "I will go tomorrow.",
    "'will' apram simple verb."
   ],
   [
    "Tomorrow I go to Chennai. (plan)",
    "I'm going to Chennai tomorrow.",
    "Plan-ku 'going to' / '-ing'."
   ],
   [
    "I'll do it surely.",
    "I'll definitely do it.",
    "'surely' badhila 'definitely'."
   ]
  ],
  "sound": null,
  "say": [
   "I'm going to [buy] a [bike] next [month].",
   "We're going to [vis]it [Oo]ty this [sum]mer.",
   "I'll [call] you to[night].",
   "[Don't] [wor]ry, I'll [help] you.",
   "It's going to [rain]."
  ],
  "quiz": [
   {
    "q": "Promise: 'Naan call pannuren.'",
    "o": [
     "I'll call you.",
     "I call you tomorrow.",
     "I calling you."
    ],
    "a": 0,
    "y": "Promise = 'I'll' + verb."
   },
   {
    "q": "Sari:",
    "o": [
     "I will going.",
     "I will go.",
     "I will goes."
    ],
    "a": 1,
    "y": "'will' + simple verb."
   },
   {
    "q": "Plan: 'Adutha vaaram Madurai poga porom.'",
    "o": [
     "We're going to visit Madurai next week.",
     "We visit Madurai next week will."
    ],
    "a": 0,
    "y": "Plan = 'going to'."
   },
   {
    "q": "Order-la vainga: 'Naan oru bike vaanga poren.'",
    "w": [
     "I'm",
     "going",
     "to",
     "buy",
     "a",
     "bike"
    ],
    "y": "I'm going to + verb."
   },
   {
    "q": "'Kandippa pannuren':",
    "o": [
     "I'll surely do.",
     "I'll definitely do it.",
     "I do surely."
    ],
    "a": 1,
    "y": "'definitely' = kandippa."
   }
  ],
  "build": [
   [
    "Naalaiku naan doctor kitta poren.",
    "I'm going to see the doctor tomorrow.",
    [
     "I'm going to the doctor tomorrow.",
     "Tomorrow I'm going to the doctor.",
     "I'm going to see a doctor tomorrow.",
     "I will go to the doctor tomorrow.",
     "I will see the doctor tomorrow."
    ]
   ],
   [
    "Kavalai padaadheenga, naan paathukkuren.",
    "Don't worry, I'll take care of it.",
    [
     "Don't worry, I will take care of it.",
     "Don't worry, I'll handle it.",
     "Don't worry, I'll manage it."
    ]
   ],
   [
    "Indru night mazhai varum.",
    "It's going to rain tonight.",
    [
     "It will rain tonight.",
     "It is going to rain tonight."
    ]
   ]
  ],
  "talk": {
   "role": "a friend asking about his plans for the coming weekend and next month.",
   "open": "Any plans for this weekend? What are you going to do?",
   "goal": "'I'm going to / I'll' vachu unga plans sollunga."
  },
  "home": {
   "write": "Adutha vaaram unga plans — 5 sentence ezhudhunga (going to / will).",
   "task": "Indru 2 promise English-la sollunga: 'I'll ___.'"
  }
 },
 {
  "id": 17,
  "wk": 3,
  "t": "a / an / the",
  "en": "Articles",
  "goal": "Tamil-la illaadha 'a / an / the' — eppo podanum nu kathukkalam.",
  "teach": [
   "Mudhal thadava sollura, ethaavadhu onnu = 'a': 'I bought a phone.'",
   "Vowel sound (a, e, i, o, u sound) munnadi 'an': 'an apple', 'an office', 'an hour' ('h' silent).",
   "Rendaavadhu thadava / rendu perukkum therinjadhu = 'the': 'The phone is very good.'",
   "Ore oru porul & therinja idangal: 'the sun', 'the moon', 'the bus stand', 'the market'.",
   "Velai sollumbodhu 'a' venum: 'I'm a teacher' ('I'm teacher' thappu)."
  ],
  "ex": [
   [
    "I have a car.",
    "Enakku oru car irukku."
   ],
   [
    "I ate an apple.",
    "Oru apple saapitten."
   ],
   [
    "The car is red.",
    "Andha car red colour."
   ],
   [
    "He is an engineer.",
    "Avar oru engineer."
   ],
   [
    "Close the door, please.",
    "Kadhava moodunga."
   ],
   [
    "I'll be there in an hour.",
    "Oru mani nerathula anga irupen."
   ]
  ],
  "fix": [
   [
    "I am teacher.",
    "I'm a teacher.",
    "Velai munnadi 'a'."
   ],
   [
    "I bought a umbrella.",
    "I bought an umbrella.",
    "Vowel sound munnadi 'an'."
   ],
   [
    "Sun is very hot.",
    "The sun is very hot.",
    "Ore oru sun → 'the'."
   ]
  ],
  "sound": null,
  "say": [
   "I [have] a [car].",
   "I [ate] an [ap]ple.",
   "He's an engi[neer].",
   "[Close] the [door], [please].",
   "I'll be [there] in an [hour]."
  ],
  "quiz": [
   {
    "q": "I'm ___ driver.",
    "o": [
     "a",
     "an",
     "the"
    ],
    "a": 0,
    "y": "Velai munnadi 'a' ('driver' — 'd' sound)."
   },
   {
    "q": "She ate ___ orange.",
    "o": [
     "a",
     "an",
     "the"
    ],
    "a": 1,
    "y": "'orange' — vowel sound → 'an'."
   },
   {
    "q": "___ sun rises in the east.",
    "o": [
     "A",
     "An",
     "The"
    ],
    "a": 2,
    "y": "Ore oru sun → 'The'."
   },
   {
    "q": "I'll come in ___ hour.",
    "o": [
     "a",
     "an"
    ],
    "a": 1,
    "y": "'hour'-la 'h' silent — 'our' sound → 'an'."
   },
   {
    "q": "Order-la vainga: 'Avar oru engineer.'",
    "w": [
     "He",
     "is",
     "an",
     "engineer"
    ],
    "y": "'engineer' — vowel sound → 'an'."
   }
  ],
  "build": [
   [
    "Naan oru pudhu phone vaanginen.",
    "I bought a new phone.",
    [
     "I got a new phone.",
     "I have bought a new phone."
    ]
   ],
   [
    "Avanga oru teacher.",
    "She is a teacher.",
    [
     "She's a teacher."
    ]
   ],
   [
    "Kadhava thirangunga.",
    "Open the door, please.",
    [
     "Please open the door.",
     "Open the door.",
     "Could you open the door?",
     "Could you open the door, please?",
     "Can you open the door, please?"
    ]
   ]
  ],
  "talk": {
   "role": "a friend asking him to describe things he bought recently and things in his house. Use a/an/the correctly in your own sentences.",
   "open": "Did you buy anything new this month? Tell me about it!",
   "goal": "a / an / the correct ah podunga."
  },
  "home": {
   "write": "Unga veettula irukkura 5 porul pathi ezhudhunga — 'I have a/an ___. The ___ is ___.'",
   "task": "Indru kann-la paakkura 10 porul-ku 'a' or 'an' sollunga (an umbrella, a chair...)."
  }
 },
 {
  "id": 18,
  "wk": 3,
  "t": "Word stress",
  "en": "The strong part of a word",
  "goal": "Words-la sariyaana part-a strong ah sollunga — appo dhaan clear ah puriyum.",
  "teach": [
   "Periya words-la oru part mattum strong ah (konjam sathama, konjam neelama) sollanum. Adhu dhaan 'stress'.",
   "Indha app-la CAPITAL part dhaan strong: hoTEL, imPORtant, deVELopment.",
   "Thappana stress-la word-e maari kekkum — 'HO-tel' illa, 'ho-TEL'.",
   "Tip: Cambridge Dictionary-la word-a theduna, ' mark-ku apram irukkura part dhaan strong. Audio-vum kekkalaam."
  ],
  "ex": [
   [
    "hotel",
    "ho-TEL ('HO-tel' illa)"
   ],
   [
    "important",
    "im-POR-tant"
   ],
   [
    "comfortable",
    "KUMF-ta-bul (3 part dhaan!)"
   ],
   [
    "vegetable",
    "VEJ-ta-bul"
   ],
   [
    "education",
    "ed-yu-KAY-shun"
   ],
   [
    "photography",
    "fuh-TOG-ruh-fee"
   ]
  ],
  "fix": [
   [
    "deve-LOP-ment",
    "de-VEL-op-ment",
    "2-vadhu part strong."
   ],
   [
    "ca-TE-go-ry",
    "CAT-e-go-ry",
    "Mudhal part strong."
   ],
   [
    "pur-CHASE",
    "PUR-chase",
    "Mudhal part strong ('PUR-chis')."
   ]
  ],
  "sound": "stress",
  "say": [
   "The ho[tel] is [ver]y [com]fortable.",
   "This is [ver]y im[por]tant.",
   "Pho[tog]raphy is my [hob]by.",
   "[Veg]etables are [good] for [health].",
   "Edu[ca]tion is [ver]y im[por]tant."
  ],
  "quiz": [
   {
    "q": "hotel:",
    "o": [
     "HO-tel",
     "ho-TEL"
    ],
    "a": 1,
    "y": "ho-TEL — 2-vadhu part strong."
   },
   {
    "q": "important:",
    "o": [
     "IM-por-tant",
     "im-POR-tant",
     "im-por-TANT"
    ],
    "a": 1,
    "y": "im-POR-tant."
   },
   {
    "q": "comfortable:",
    "o": [
     "com-FOR-ta-ble",
     "KUMF-ta-bul"
    ],
    "a": 1,
    "y": "KUMF-ta-bul — mudhal part, 3 part mattum."
   },
   {
    "q": "education:",
    "o": [
     "ed-u-CA-tion",
     "ED-u-ca-tion",
     "e-DU-ca-tion"
    ],
    "a": 0,
    "y": "'-tion' words: adhukku munnadi irukkura part strong."
   },
   {
    "q": "photography:",
    "o": [
     "PHO-to-gra-phy",
     "pho-TOG-ra-phy"
    ],
    "a": 1,
    "y": "pho-TOG-ra-phy. Aana 'PHO-to-graph'!"
   }
  ],
  "build": [
   [
    "Indha hotel romba comfortable ah irukku.",
    "This hotel is very comfortable.",
    [
     "The hotel is very comfortable.",
     "This hotel is really comfortable."
    ]
   ],
   [
    "Health romba mukkiyam.",
    "Health is very important.",
    [
     "Good health is very important.",
     "Health is really important."
    ]
   ],
   [
    "Enakku vegetables pidikkum.",
    "I like vegetables.",
    [
     "I love vegetables."
    ]
   ]
  ],
  "talk": {
   "role": "a friend chatting about hotels, food and travel. Use words like hotel, comfortable, vegetables, important, photography in your questions.",
   "open": "Do you like staying in hotels? What makes a hotel comfortable for you?",
   "goal": "Stress words sariya sollunga (ho-TEL, KUMF-ta-bul)."
  },
  "home": {
   "write": "5 sentence ezhudhunga: hotel, important, comfortable, vegetable, education — ovvonnum oru sentence-la.",
   "task": "Cambridge Dictionary-la 5 words thedi, audio kettu, stress mark paarunga."
  }
 },
 {
  "id": 19,
  "wk": 3,
  "t": "in / on / at",
  "en": "Time and place words",
  "goal": "Neram & idam sollumbodhu 'in / on / at' correct ah podalaam.",
  "teach": [
   "NERAM: 'at' = exact neram (at 5 o'clock, at night). 'on' = naal / date (on Monday, on 5th June). 'in' = maasam, varusham, periya neram (in June, in 2025, in the morning).",
   "IDAM: 'in' = ulla (in the bag, in Chennai). 'on' = mela (on the table, on the wall). 'at' = oru point / idam (at the bus stop, at home, at work).",
   "Nyaabagam vechukka: at = point · on = surface / naal · in = box / periya area."
  ],
  "ex": [
   [
    "I wake up at 6 o'clock.",
    "6 mani-ku ezhundhiruppen."
   ],
   [
    "The meeting is on Monday.",
    "Meeting Monday."
   ],
   [
    "My birthday is in May.",
    "En birthday May maasam."
   ],
   [
    "The keys are on the table.",
    "Saavi table mela irukku."
   ],
   [
    "My phone is in my bag.",
    "Phone bag ulla irukku."
   ],
   [
    "I'm at the bus stop.",
    "Naan bus stop-la irukken."
   ]
  ],
  "fix": [
   [
    "on the morning",
    "in the morning",
    "Kaalai, saayangaalam = 'in the ___'. Aana 'at night'."
   ],
   [
    "at Monday",
    "on Monday",
    "Naal = 'on'."
   ],
   [
    "in home",
    "at home",
    "'at home', 'at work' — fixed."
   ]
  ],
  "sound": null,
  "say": [
   "The [meet]ing is on [Mon]day at [ten].",
   "My [birth]day is in [May].",
   "The [keys] are on the [ta]ble.",
   "I'm at the [bus] stop [now].",
   "I [work] in the [mor]ning and [rest] at [night]."
  ],
  "quiz": [
   {
    "q": "___ Sunday",
    "o": [
     "in",
     "on",
     "at"
    ],
    "a": 1,
    "y": "Naal = 'on'."
   },
   {
    "q": "___ 7 o'clock",
    "o": [
     "in",
     "on",
     "at"
    ],
    "a": 2,
    "y": "Exact neram = 'at'."
   },
   {
    "q": "___ the evening",
    "o": [
     "in",
     "on",
     "at"
    ],
    "a": 0,
    "y": "'in the morning / evening'."
   },
   {
    "q": "The cat is ___ the box. (ulla)",
    "o": [
     "in",
     "on",
     "at"
    ],
    "a": 0,
    "y": "Ulla = 'in'."
   },
   {
    "q": "I'm ___ home.",
    "o": [
     "in",
     "on",
     "at"
    ],
    "a": 2,
    "y": "'at home' — fixed."
   }
  ],
  "build": [
   [
    "Naan Sunday velai-ku poga maatten.",
    "I don't go to work on Sundays.",
    [
     "I don't work on Sundays.",
     "I don't go to work on Sunday.",
     "I don't work on Sunday."
    ]
   ],
   [
    "Bus 7:30-ku varum.",
    "The bus comes at 7:30.",
    [
     "The bus will come at 7:30.",
     "The bus arrives at 7:30.",
     "The bus comes at 7.30."
    ]
   ],
   [
    "Unga phone table mela irukku.",
    "Your phone is on the table.",
    []
   ]
  ],
  "talk": {
   "role": "a friend fixing a meeting time and place with him this week. Ask which day, what time and where.",
   "open": "Let's meet this week! Which day is good for you, and what time?",
   "goal": "'on Monday / at 5 / at the bus stand' correct ah sollunga."
  },
  "home": {
   "write": "Unga indha vaara schedule — 5 sentence ezhudhunga (in / on / at).",
   "task": "Veettula 5 porul enga irukku nu sollunga (on the table, in the bag...)."
  }
 },
 {
  "id": 20,
  "wk": 3,
  "t": "Kadai-la English",
  "en": "Shopping English",
  "goal": "Kadai-la vilai kekka, size kekka, polite ah bargain panna.",
  "teach": [
   "Vilai: 'How much is this?' (onnu) / 'How much are these?' (neraya).",
   "Vera size / colour: 'Do you have this in a bigger size?' / '…in blue?'",
   "Pottu paakka: 'Can I try this on?' Vaanga mudivu: 'I'll take it.'",
   "Polite bargain: 'Can you give me a discount?' / 'Is this the best price?'",
   "Pay: 'Can I pay by card?' / 'Do you accept UPI?'"
  ],
  "ex": [
   [
    "How much is this shirt?",
    "Indha shirt evlo?"
   ],
   [
    "Do you have this in a bigger size?",
    "Idhula periya size irukkaa?"
   ],
   [
    "Can I try this on?",
    "Idha pottu paakkalaamaa?"
   ],
   [
    "It's a little expensive.",
    "Konjam vilai adhigam."
   ],
   [
    "Is this the best price?",
    "Idhu dhaan last price-aa?"
   ],
   [
    "Can I pay by UPI?",
    "UPI-la pay pannalaamaa?"
   ]
  ],
  "fix": [
   [
    "How much cost?",
    "How much is it?",
    "'How much is it?' illana 'How much does it cost?'"
   ],
   [
    "Give one kg tomato.",
    "Can I have one kilo of tomatoes, please?",
    "Polite ah + 'tomatoes' (neraya)."
   ],
   [
    "It's too costly.",
    "It's too expensive.",
    "'expensive' dhaan common."
   ]
  ],
  "sound": null,
  "say": [
   "[How] [much] is this [shirt]?",
   "Do you [have] this in a [big]ger [size]?",
   "Can I [try] this [on]?",
   "It's a [lit]tle ex[pen]sive.",
   "Can I [pay] by [UPI]?"
  ],
  "quiz": [
   {
    "q": "Vilai kekka:",
    "o": [
     "How much is this?",
     "How much cost?",
     "What rate this?"
    ],
    "a": 0,
    "y": "'How much is this?'"
   },
   {
    "q": "Dress-a pottu paakka:",
    "o": [
     "Can I try this on?",
     "Can I wear check?",
     "Try can?"
    ],
    "a": 0,
    "y": "'try on' = pottu paakkuradhu."
   },
   {
    "q": "Neraya porul vilai:",
    "o": [
     "How much is these?",
     "How much are these?"
    ],
    "a": 1,
    "y": "Neraya = 'are these'."
   },
   {
    "q": "Order-la vainga: 'Idhu blue-la irukkaa?'",
    "w": [
     "Do",
     "you",
     "have",
     "this",
     "in",
     "blue"
    ],
    "y": "'Do you have this in ___?'"
   },
   {
    "q": "Vaanga mudivu pannitteenga:",
    "o": [
     "I'll take it.",
     "I am taking now it.",
     "I take."
    ],
    "a": 0,
    "y": "'I'll take it.' = vaangikkuren."
   }
  ],
  "build": [
   [
    "Indha shoes evlo?",
    "How much are these shoes?",
    [
     "How much do these shoes cost?",
     "How much are the shoes?",
     "How much are these?"
    ]
   ],
   [
    "Konjam discount kudunga.",
    "Can you give me a discount, please?",
    [
     "Can you give me a discount?",
     "Could you give me a discount?",
     "Could you give me a small discount?",
     "Please give me a discount."
    ]
   ],
   [
    "Card-la pay pannalaamaa?",
    "Can I pay by card?",
    [
     "Can I pay with a card?",
     "Can I pay with card?",
     "Do you accept cards?",
     "Can I pay by credit card?"
    ]
   ]
  ],
  "talk": {
   "role": "a shopkeeper in a clothes shop. Quote prices in rupees, offer sizes and colours, and give a small discount if he asks politely.",
   "open": "Hello sir, welcome! What are you looking for today?",
   "goal": "Vilai kettu, size kettu, discount kettu vaangunga."
  },
  "home": {
   "write": "Oru shop dialogue ezhudhunga — 6 lines (neenga + shopkeeper).",
   "task": "Adutha thadava kadai-ku pogumbodhu oru sentence English-la kelunga: 'How much is this?'"
  }
 },
 {
  "id": 21,
  "wk": 3,
  "t": "Vaara revision: plans",
  "en": "Week 3 review",
  "goal": "Ippo (-ing), plans (going to / will), a / an / the, in / on / at — serththu pesalaam.",
  "teach": [
   "Ippo: 'I'm working.' Plan: 'I'm going to ___.' Promise: 'I'll ___.'",
   "a / an (mudhal thadava), the (therinjadhu).",
   "Neram & idam: at 5, on Monday, in May · at home, in Chennai, on the table."
  ],
  "ex": [
   [
    "Right now, I'm learning English.",
    "Ippo English kathukkittu irukken."
   ],
   [
    "Next month, I'm going to start a new course.",
    "Adutha maasam oru pudhu course aarambikka poren."
   ],
   [
    "On Sunday, we're going to visit my aunt.",
    "Sunday aunty veettukku poga porom."
   ],
   [
    "I'll call you at 7.",
    "7 mani-ku call pannuren."
   ],
   [
    "I'm going to buy a phone. The old one is broken.",
    "Phone vaanga poren. Pazhaiyadhu odanjiduchu."
   ]
  ],
  "fix": [
   [
    "I am going to went.",
    "I am going to go.",
    "'going to' + simple verb."
   ],
   [
    "I'll calling you.",
    "I'll call you.",
    "'will' + simple verb."
   ],
   [
    "on 7 o'clock",
    "at 7 o'clock",
    "Exact neram = 'at'."
   ]
  ],
  "sound": null,
  "say": [
   "[Right] [now], I'm [learn]ing [Eng]lish.",
   "Next [month], I'm going to [start] a [new] [course].",
   "On [Sun]day, we're going to [vis]it my [aunt].",
   "I'll [call] you at [sev]en.",
   "The [old] [phone] is [bro]ken."
  ],
  "quiz": [
   {
    "q": "Promise:",
    "o": [
     "I'll help you.",
     "I'm helping you tomorrow will."
    ],
    "a": 0,
    "y": "Promise = 'I'll' + verb."
   },
   {
    "q": "___ Monday ___ 9 a.m.",
    "o": [
     "on / at",
     "at / on",
     "in / at"
    ],
    "a": 0,
    "y": "Naal = on, neram = at."
   },
   {
    "q": "I saw ___ elephant. ___ elephant was huge.",
    "o": [
     "an / The",
     "a / An",
     "the / A"
    ],
    "a": 0,
    "y": "Mudhal thadava 'an', apram 'The'."
   },
   {
    "q": "Order-la vainga: '7 mani-ku call pannuren.'",
    "w": [
     "I'll",
     "call",
     "you",
     "at",
     "seven"
    ],
    "y": "call + you + at + neram."
   },
   {
    "q": "Ippo nadakkuradhu:",
    "o": [
     "I'm cooking now.",
     "I cook now."
    ],
    "a": 0,
    "y": "Ippo = am + -ing."
   }
  ],
  "build": [
   [
    "Adutha varusham naan oru car vaanga poren.",
    "I'm going to buy a car next year.",
    [
     "Next year I'm going to buy a car.",
     "I am going to buy a car next year.",
     "I will buy a car next year.",
     "Next year, I'm going to buy a car."
    ]
   ],
   [
    "Ippo naan saapittuttu irukken, aprom call pannuren.",
    "I'm eating now. I'll call you later.",
    [
     "I'm eating right now, I'll call you later.",
     "I am eating now, I will call you later.",
     "I'm eating now, I'll call you later."
    ]
   ],
   [
    "Sunday naan kovil-ku poren.",
    "I'm going to the temple on Sunday.",
    [
     "On Sunday I'm going to the temple.",
     "I will go to the temple on Sunday.",
     "I'm going to temple on Sunday."
    ]
   ]
  ],
  "talk": {
   "role": "an old friend asking what he is doing these days and what his plans are for this year.",
   "open": "It's been a while! What are you doing these days, and what are your plans for this year?",
   "goal": "Ippo + plans rendum sollunga."
  },
  "home": {
   "write": "Indha varusham unga 3 goals ezhudhunga: 'I'm going to ___ because ___.'",
   "task": "Unga plans pathi 1 minute record pannunga."
  }
 },
 {
  "id": 22,
  "wk": 4,
  "t": "Vazhi kekkuradhu",
  "en": "Asking for directions",
  "goal": "Pudhu idathula confident ah vazhi kekka & help kekka.",
  "teach": [
   "Aarambikka: 'Excuse me, …'",
   "Kekka: 'Where is the ___?' / 'How do I get to ___?' / 'Is it far from here?'",
   "Pathil words: go straight (nera po), turn left / right (left / right thirumbu), next to (pakkathula), opposite (edhirla), near (kitta).",
   "Purinjadha confirm pannunga: 'So, I go straight and turn left?' Mudikka: 'Thank you so much!'"
  ],
  "ex": [
   [
    "Excuse me, where is the railway station?",
    "Excuse me, railway station enga irukku?"
   ],
   [
    "How do I get to the bus stand?",
    "Bus stand-ku eppadi poradhu?"
   ],
   [
    "Go straight and turn left.",
    "Nera poyi left-la thirumbunga."
   ],
   [
    "It's next to the bank.",
    "Bank pakkathula irukku."
   ],
   [
    "It's opposite the temple.",
    "Kovil-ku edhirla irukku."
   ],
   [
    "Is it far from here?",
    "Inga irundhu dhooramaa?"
   ]
  ],
  "fix": [
   [
    "Where is railway station?",
    "Where is the railway station?",
    "'the' marakkaadheenga."
   ],
   [
    "How to go bus stand?",
    "How do I get to the bus stand?",
    "Kelvi format: 'How do I get to ___?'"
   ],
   [
    "It's opposite to the bank.",
    "It's opposite the bank.",
    "'opposite' apram 'to' vendaam."
   ]
  ],
  "sound": null,
  "say": [
   "Ex[cuse] me, [where] is the [rail]way [sta]tion?",
   "[How] do I [get] to the [bus] stand?",
   "Go [straight] and [turn] [left].",
   "It's [next] to the [bank].",
   "Is it [far] from [here]?"
  ],
  "quiz": [
   {
    "q": "Vazhi kekka:",
    "o": [
     "How do I get to the market?",
     "How to go market?"
    ],
    "a": 0,
    "y": "'How do I get to ___?'"
   },
   {
    "q": "'Edhirla':",
    "o": [
     "opposite",
     "next to",
     "behind"
    ],
    "a": 0,
    "y": "opposite = edhirla · next to = pakkathula · behind = pinnadi."
   },
   {
    "q": "'Nera ponga':",
    "o": [
     "Go straight.",
     "Go street.",
     "Straight go."
    ],
    "a": 0,
    "y": "'Go straight.'"
   },
   {
    "q": "Order-la vainga: 'Hospital enga irukku?'",
    "w": [
     "Where",
     "is",
     "the",
     "hospital"
    ],
    "y": "Where + is + the + idam."
   },
   {
    "q": "Sari:",
    "o": [
     "It's opposite to the bank.",
     "It's opposite the bank."
    ],
    "a": 1,
    "y": "'opposite' apram 'to' illa."
   }
  ],
  "build": [
   [
    "Excuse me, inga ATM enga irukku?",
    "Excuse me, where is the ATM?",
    [
     "Excuse me, where's the ATM?",
     "Excuse me, is there an ATM near here?",
     "Excuse me, where is the ATM here?",
     "Excuse me, is there an ATM here?"
    ]
   ],
   [
    "Bank pakkathula irukku.",
    "It's next to the bank.",
    [
     "It is next to the bank.",
     "It's near the bank."
    ]
   ],
   [
    "Railway station inga irundhu dhooramaa?",
    "Is the railway station far from here?",
    [
     "Is the station far from here?",
     "Is the railway station far?"
    ]
   ]
  ],
  "talk": {
   "role": "a local person on the street. He is new in town and asks for directions to the hospital, the bus stand and a hotel. Give simple directions.",
   "open": "You look a little lost. Can I help you?",
   "goal": "Vazhi kettu, purinjadha confirm pannunga."
  },
  "home": {
   "write": "Unga veettula irundhu pakkathula irukkura bus stop-ku vazhi — 5 sentence ezhudhunga.",
   "task": "Map paathu oru idathukku English directions sathama sollunga."
  }
 },
 {
  "id": 23,
  "wk": 4,
  "t": "Pidichadhu & karuththu",
  "en": "Likes and opinions",
  "goal": "Pidichadhu, pidikkaadhadhu, unga karuththu — reason-oda sollalaam.",
  "teach": [
   "Pidikkum: 'I like ___' · Romba pidikkum: 'I love ___' · Pidikkaadhu: 'I don't like ___' · Romba pidikkaadhu: 'I hate ___'.",
   "'like' apram verb vandha '-ing': 'I like cooking.'",
   "Karuththu: 'I think ___' / 'In my opinion, ___'. Othukka: 'I agree.' Othukkala: 'I don't think so.' / 'I'm not sure.'",
   "Reason sollunga: '___ because ___'."
  ],
  "ex": [
   [
    "I love South Indian food.",
    "Enakku South Indian food romba pidikkum."
   ],
   [
    "I don't like crowded places.",
    "Koottamaana idam enakku pidikkaadhu."
   ],
   [
    "I like watching old movies.",
    "Pazhaiya padam paakka pidikkum."
   ],
   [
    "I think English is useful for everyone.",
    "English ellaarukkum useful-nu ninaikkiren."
   ],
   [
    "I agree with you.",
    "Neenga solradhu sari."
   ],
   [
    "I'm not sure about that.",
    "Adhu pathi enakku sure ah theriyala."
   ]
  ],
  "fix": [
   [
    "I like to cricket.",
    "I like cricket.",
    "'I like cricket' illana 'I like playing cricket'."
   ],
   [
    "I am liking this.",
    "I like this.",
    "'like'-ku '-ing' illa."
   ],
   [
    "According to me, it's good.",
    "I think it's good.",
    "'According to me' Indian style. 'I think' / 'In my opinion'."
   ]
  ],
  "sound": null,
  "say": [
   "I [love] [South] [In]dian [food].",
   "I [don't] [like] [crowd]ed [pla]ces.",
   "I [like] [watch]ing [old] [mov]ies.",
   "I [think] [Eng]lish is [use]ful.",
   "I a[gree] with you."
  ],
  "quiz": [
   {
    "q": "Sari:",
    "o": [
     "I like play cricket.",
     "I like playing cricket."
    ],
    "a": 1,
    "y": "'like' + verb-ing."
   },
   {
    "q": "Sari:",
    "o": [
     "I am liking it.",
     "I like it."
    ],
    "a": 1,
    "y": "'like'-ku '-ing' illa."
   },
   {
    "q": "Othukkaama polite ah:",
    "o": [
     "You are wrong.",
     "I don't think so.",
     "No no no."
    ],
    "a": 1,
    "y": "'I don't think so' = soft ah 'illa'."
   },
   {
    "q": "Order-la vainga: 'Enakku samaikka pidikkaadhu.'",
    "w": [
     "I",
     "don't",
     "like",
     "cooking"
    ],
    "y": "I + don't like + verb-ing."
   },
   {
    "q": "'According to me' badhila:",
    "o": [
     "In my opinion",
     "As per me",
     "To me according"
    ],
    "a": 0,
    "y": "'In my opinion' / 'I think'."
   }
  ],
  "build": [
   [
    "Enakku mazhai romba pidikkum.",
    "I love the rain.",
    [
     "I love rain.",
     "I really like the rain.",
     "I like rain very much.",
     "I really like rain."
    ]
   ],
   [
    "Enakku samaikka pidikkaadhu.",
    "I don't like cooking.",
    [
     "I don't like to cook."
    ]
   ],
   [
    "Neenga sonnadhu sari-nu ninaikkiren.",
    "I think you're right.",
    [
     "I think you are right.",
     "I agree with you.",
     "I think you're correct."
    ]
   ]
  ],
  "talk": {
   "role": "a friend chatting about favourite food, movies, cricket and places. Ask him why, share your own opinion, and ask if he agrees.",
   "open": "What's your favourite food? And why do you like it?",
   "goal": "'I like / I love / I think / because' use pannunga."
  },
  "home": {
   "write": "Ungalukku pidicha 3, pidikkaadha 2 vishayam — reason-oda ezhudhunga ('because').",
   "task": "Oru vishayam pathi 'I think ___ because ___' nu 3 sentence sollunga."
  }
 },
 {
  "id": 24,
  "wk": 4,
  "t": "Compare pannuradhu",
  "en": "Bigger, better, the best",
  "goal": "Rendu porul / ooru / aala compare panni pesa kathukkalam.",
  "teach": [
   "Chinna words: '-er' / 'the -est': big → bigger → the biggest; cheap → cheaper → the cheapest.",
   "Periya words: 'more' / 'the most': expensive → more expensive → the most expensive.",
   "Special: good → better → the best; bad → worse → the worst.",
   "Compare panna 'than': 'Chennai is bigger than Madurai.' ('more bigger' thappu)."
  ],
  "ex": [
   [
    "This phone is cheaper than that one.",
    "Indha phone andha phone-a vida vilai kammi."
   ],
   [
    "Chennai is bigger than Madurai.",
    "Madurai-a vida Chennai periyadhu."
   ],
   [
    "Gold is more expensive than silver.",
    "Silver-a vida gold vilai adhigam."
   ],
   [
    "My mother's cooking is the best.",
    "En amma samayal dhaan best."
   ],
   [
    "Today is hotter than yesterday.",
    "Neththa vida indru veyil adhigam."
   ],
   [
    "This is the worst traffic.",
    "Idhu dhaan romba mosamaana traffic."
   ]
  ],
  "fix": [
   [
    "more bigger",
    "bigger",
    "'-er' irundha 'more' vendaam."
   ],
   [
    "more better",
    "better",
    "'better' thaniya podhum."
   ],
   [
    "He is taller from me.",
    "He is taller than me.",
    "Compare = 'than'."
   ]
  ],
  "sound": null,
  "say": [
   "This [phone] is [cheap]er than [that] [one].",
   "[Gold] is more ex[pen]sive than [sil]ver.",
   "My [moth]er's [cook]ing is the [best].",
   "To[day] is [hot]ter than [yes]terday.",
   "He is [tall]er than [me]."
  ],
  "quiz": [
   {
    "q": "Sari:",
    "o": [
     "more bigger",
     "bigger",
     "biggest than"
    ],
    "a": 1,
    "y": "big → bigger."
   },
   {
    "q": "good → ?",
    "o": [
     "gooder",
     "better",
     "more good"
    ],
    "a": 1,
    "y": "good → better → the best."
   },
   {
    "q": "A car is ___ than a bike.",
    "o": [
     "more expensive",
     "expensiver",
     "most expensive"
    ],
    "a": 0,
    "y": "Periya word → 'more ___ than'."
   },
   {
    "q": "Order-la vainga: 'Avan ennai vida uyaram.'",
    "w": [
     "He",
     "is",
     "taller",
     "than",
     "me"
    ],
    "y": "___-er + than."
   },
   {
    "q": "Sari:",
    "o": [
     "She is smarter from me.",
     "She is smarter than me."
    ],
    "a": 1,
    "y": "'than' dhaan."
   }
  ],
  "build": [
   [
    "Bus-a vida train vegama pogum.",
    "The train is faster than the bus.",
    [
     "A train is faster than a bus.",
     "Trains are faster than buses.",
     "The train is quicker than the bus."
    ]
   ],
   [
    "Indha kadai dhaan ooru-laye best.",
    "This shop is the best in town.",
    [
     "This is the best shop in town.",
     "This shop is the best in the town.",
     "This is the best shop in the town."
    ]
   ],
   [
    "Indha varusham pona varushatha vida nalla irukku.",
    "This year is better than last year.",
    []
   ]
  ],
  "talk": {
   "role": "a friend who can't decide between two things (bike or scooter, tea or coffee, city or village). Ask him to compare and give his opinion.",
   "open": "I'm confused — should I buy a bike or a scooter? Which is better, in your opinion?",
   "goal": "'-er than / more ___ than / the best' use pannunga."
  },
  "home": {
   "write": "Rendu ooru-va (illana rendu phone) compare panni 5 sentence ezhudhunga.",
   "task": "Veettula 3 porul-a compare panni sollunga (This bag is bigger than...)."
  }
 },
 {
  "id": 25,
  "wk": 4,
  "t": "Pannanum / Pannalaam",
  "en": "Have to, must, should",
  "goal": "Kattayam pannanum, pannina nalladhu (advice) — solla kathukkalam.",
  "teach": [
   "Kandippa pannanum (kattayam) = 'have to' / 'must': 'I have to go to work.' He / She-na 'has to'.",
   "Advice (pannina nalladhu) = 'should': 'You should drink more water.'",
   "Pannakoodaadhu = 'shouldn't': 'You shouldn't drive fast.'",
   "Avasiyam illa = 'don't have to': 'You don't have to come.' Kavanam: 'mustn't' = koodavey koodaadhu — vera meaning!",
   "Pronunciation: 'have to' = 'haf-tuh'."
  ],
  "ex": [
   [
    "I have to go now.",
    "Naan ippo kilambanum."
   ],
   [
    "She has to wake up early.",
    "Ava seekiram ezhundhirikkanum."
   ],
   [
    "You should see a doctor.",
    "Neenga doctor-a paakkuradhu nalladhu."
   ],
   [
    "You shouldn't eat too much sugar.",
    "Sugar romba saapida koodaadhu."
   ],
   [
    "You must wear a helmet.",
    "Helmet kandippa podanum."
   ],
   [
    "You don't have to pay now.",
    "Ippo pay panna thevai illa."
   ]
  ],
  "fix": [
   [
    "He have to go.",
    "He has to go.",
    "He / She-ku 'has to'."
   ],
   [
    "You should to rest.",
    "You should rest.",
    "'should' apram 'to' illa."
   ],
   [
    "I must to go.",
    "I must go.",
    "'must' apram 'to' illa."
   ]
  ],
  "sound": null,
  "say": [
   "I [have] to [go] [now].",
   "You should [see] a [doc]tor.",
   "You [should]n't [drive] [fast].",
   "You [must] [wear] a [hel]met.",
   "You [don't] [have] to [pay] [now]."
  ],
  "quiz": [
   {
    "q": "She ___ to work on Saturday.",
    "o": [
     "have",
     "has",
     "having"
    ],
    "a": 1,
    "y": "She → 'has to'."
   },
   {
    "q": "Advice:",
    "o": [
     "You should drink water.",
     "You should to drink water."
    ],
    "a": 0,
    "y": "'should' + verb ('to' illa)."
   },
   {
    "q": "'Neenga vara thevai illa':",
    "o": [
     "You mustn't come.",
     "You don't have to come."
    ],
    "a": 1,
    "y": "'mustn't' = koodaadhu · 'don't have to' = thevai illa."
   },
   {
    "q": "Order-la vainga: 'Neenga doctor-a paakkanum.'",
    "w": [
     "You",
     "should",
     "see",
     "a",
     "doctor"
    ],
    "y": "should + verb."
   },
   {
    "q": "'have to' eppadi pronounce?",
    "o": [
     "haf-tuh",
     "hav-too"
    ],
    "a": 0,
    "y": "'have to' = 'haf-tuh'."
   }
  ],
  "build": [
   [
    "Naan 6 mani-ku veettukku poganum.",
    "I have to go home at 6.",
    [
     "I have to reach home by 6.",
     "I must go home at 6.",
     "I need to go home at 6.",
     "I have to be home at 6."
    ]
   ],
   [
    "Neenga dhinamum walk pannanum (adhu nalladhu).",
    "You should walk every day.",
    [
     "You should go for a walk every day.",
     "You should walk daily."
    ]
   ],
   [
    "Ippo pay panna vendaam.",
    "You don't have to pay now.",
    [
     "You don't need to pay now.",
     "No need to pay now."
    ]
   ]
  ],
  "talk": {
   "role": "a friend who feels tired and stressed all the time and asks him for advice. Let him give advice with should / shouldn't / have to.",
   "open": "I feel tired all the time these days. What should I do?",
   "goal": "'You should / You shouldn't' vachu advice kudunga."
  },
  "home": {
   "write": "Nalla health-ku 5 advice ezhudhunga: 'You should ___' / 'You shouldn't ___'.",
   "task": "Indru veettula 2 'I have to ___' sentence sollunga."
  }
 },
 {
  "id": 26,
  "wk": 4,
  "t": "English rhythm",
  "en": "Strong and weak words",
  "goal": "Native madhiri flow — mukkiyamaana words strong, chinna words fast.",
  "teach": [
   "Tamil-la ovvoru word-um same weight. English-la mukkiyamaana words (noun, verb, adjective) STRONG; chinna words (a, the, to, of, and, is) weak & fast.",
   "Example: 'I'm GOing to the MARket' — 'to the' fast ah 'tuh-thuh'.",
   "Words-a serththu pesunga: 'an apple' = 'a-napple', 'pick it up' = 'pi-ki-tup'.",
   "Practice: strong words-la mattum kai thattunga — rhythm thaana varum."
  ],
  "ex": [
   [
    "I'm going to the market.",
    "GO, MAR strong · 'to the' fast."
   ],
   [
    "Can I have a cup of tea?",
    "'cup of' = 'kup-uv' serththu."
   ],
   [
    "What do you want?",
    "'what do you' = 'wha-duh-yuh'."
   ],
   [
    "Pick it up.",
    "'pi-ki-tup' — serththu."
   ],
   [
    "Come on in.",
    "'kuh-mo-nin'."
   ],
   [
    "Not at all.",
    "'no-ta-tall'."
   ]
  ],
  "fix": [
   [
    "I. AM. GO-ING. TO. THE. MAR-KET.",
    "I'm GOing to the MARket.",
    "Chinna words-a fast ah sollunga."
   ],
   [
    "a apple",
    "an apple ('a-napple')",
    "Vowel munnadi 'an' — serththu."
   ],
   [
    "Cup. Of. Tea.",
    "Cup of tea ('kup-uv-tea')",
    "'of' weak ah."
   ]
  ],
  "sound": null,
  "say": [
   "I'm [go]ing to the [mar]ket.",
   "Can I [have] a [cup] of [tea]?",
   "[What] do you [want] to [eat]?",
   "[Pick] it [up], [please].",
   "It's [not] a [big] [prob]lem."
  ],
  "quiz": [
   {
    "q": "'I'm going to the market' — strong words:",
    "o": [
     "going, market",
     "to, the",
     "I'm, to"
    ],
    "a": 0,
    "y": "Mukkiyamaana words = strong."
   },
   {
    "q": "'a cup of tea'-la 'of' eppadi?",
    "o": [
     "weak 'uv'",
     "strong 'OFF'"
    ],
    "a": 0,
    "y": "Chinna words weak ah."
   },
   {
    "q": "Rhythm practice-ku best:",
    "o": [
     "Strong words-la kai thatturadhu",
     "Ovvoru word-um same speed",
     "Romba fast ah pesuradhu"
    ],
    "a": 0,
    "y": "Kai thattina rhythm thaana varum."
   },
   {
    "q": "'an apple' serththu:",
    "o": [
     "a-napple",
     "an . apple",
     "a apple"
    ],
    "a": 0,
    "y": "Words serththu pesunga."
   },
   {
    "q": "Order-la vainga: 'Oru cup tea kidaikkumaa?'",
    "w": [
     "Can",
     "I",
     "have",
     "a",
     "cup",
     "of",
     "tea"
    ],
    "y": "Can I have + porul."
   }
  ],
  "build": [
   [
    "Ungalukku enna saapida venum?",
    "What do you want to eat?",
    [
     "What would you like to eat?"
    ]
   ],
   [
    "Adhu periya problem illa.",
    "It's not a big problem.",
    [
     "It is not a big problem.",
     "It's not a big deal.",
     "That's not a big problem.",
     "It is not a big deal."
    ]
   ],
   [
    "Oru glass thanni kidaikkumaa?",
    "Can I have a glass of water?",
    [
     "Can I have a glass of water, please?",
     "Could I have a glass of water?",
     "Could I have a glass of water, please?",
     "May I have a glass of water?"
    ]
   ]
  ],
  "talk": {
   "role": "a waiter at Cafe Blue. He orders food and drinks. Speak naturally so he hears weak words.",
   "open": "Hi! Welcome to Cafe Blue. What would you like to have?",
   "goal": "Strong words-a mattum stress panni order pannunga."
  },
  "home": {
   "write": "Oru restaurant order dialogue ezhudhunga — 6 lines.",
   "task": "Indraiya 'say' sentences-a kai thattikittu 3 thadava sollunga."
  }
 },
 {
  "id": 27,
  "wk": 4,
  "t": "Velai idathula English",
  "en": "Work English",
  "goal": "Velai idathula boss / colleagues kooda mariyaadhaiya, clear ah pesa.",
  "teach": [
   "Leave kekka: 'Can I take leave on Friday?' / 'I'm not feeling well, so I'd like to take the day off.'",
   "Velai mudinjadhu: 'I've finished the work.' Innum mudiyala: 'I'm still working on it.'",
   "Time kekka: 'Can I have one more day?' / 'I'll finish it by tomorrow.' (Deadline-ku 'by' — 'till' illa.)",
   "Puriyala-na: 'Could you explain that again?' Help: 'Could you help me with this?'"
  ],
  "ex": [
   [
    "Good morning, sir. Can I talk to you for a minute?",
    "Vanakkam sir, oru nimisham pesalaamaa?"
   ],
   [
    "Can I take leave on Friday?",
    "Friday leave edukkalaamaa?"
   ],
   [
    "I'll finish it by tomorrow.",
    "Naalaiku-kulla mudichiduven."
   ],
   [
    "I'm still working on it.",
    "Innum adhula velai pannittu irukken."
   ],
   [
    "Could you explain that again?",
    "Thirumba explain panna mudiyumaa?"
   ],
   [
    "Sorry, I made a mistake. I'll fix it.",
    "Sorry, thappu pannitten. Sari pannuren."
   ]
  ],
  "fix": [
   [
    "I am having fever, so I want leave.",
    "I have a fever, so I'd like to take leave.",
    "'I have a fever'. 'I'd like to' polite."
   ],
   [
    "Please do the needful.",
    "Could you please help with this?",
    "Enna venum nu clear ah kelunga."
   ],
   [
    "I will finish it till tomorrow.",
    "I'll finish it by tomorrow.",
    "Deadline-ku 'by'."
   ]
  ],
  "sound": null,
  "say": [
   "Can I [talk] to you for a [min]ute?",
   "Can I [take] [leave] on [Fri]day?",
   "I'll [fin]ish it by to[mor]row.",
   "I'm [still] [work]ing on it.",
   "[Sor]ry, I [made] a mis[take]. I'll [fix] it."
  ],
  "quiz": [
   {
    "q": "Deadline:",
    "o": [
     "I'll finish it by Friday.",
     "I'll finish it till Friday."
    ],
    "a": 0,
    "y": "Deadline = 'by'."
   },
   {
    "q": "Leave polite ah:",
    "o": [
     "I want leave tomorrow.",
     "Can I take leave tomorrow?",
     "Give leave tomorrow."
    ],
    "a": 1,
    "y": "'Can I take leave ___?'"
   },
   {
    "q": "Innum mudiyala:",
    "o": [
     "I'm still working on it.",
     "It is under process going on."
    ],
    "a": 0,
    "y": "'I'm still working on it.'"
   },
   {
    "q": "Order-la vainga: 'Thirumba explain panna mudiyumaa?'",
    "w": [
     "Could",
     "you",
     "explain",
     "that",
     "again"
    ],
    "y": "Could you + verb + again."
   },
   {
    "q": "Sari:",
    "o": [
     "I am having fever.",
     "I have a fever."
    ],
    "a": 1,
    "y": "Udambu sari illana: 'I have a ___'."
   }
  ],
  "build": [
   [
    "Naalaiku enakku leave venum.",
    "Can I take leave tomorrow?",
    [
     "I need leave tomorrow.",
     "I would like to take leave tomorrow.",
     "Can I take a day off tomorrow?",
     "I need a day off tomorrow.",
     "I'd like to take leave tomorrow."
    ]
   ],
   [
    "Report-a Friday-kulla anuppiduren.",
    "I'll send the report by Friday.",
    [
     "I will send the report by Friday."
    ]
   ],
   [
    "Sorry sir, naan thappu pannitten.",
    "Sorry sir, I made a mistake.",
    [
     "I'm sorry sir, I made a mistake.",
     "Sorry, I made a mistake.",
     "Sorry sir, it was my mistake."
    ]
   ]
  ],
  "talk": {
   "role": "his manager at work. Ask about the status of a task, ask why it is late, and discuss a leave request.",
   "open": "Good morning. How is the work going? Can you finish it today?",
   "goal": "Status sollunga, time kelunga, polite ah irunga."
  },
  "home": {
   "write": "Boss-ku oru leave request message ezhudhunga (4–5 sentence).",
   "task": "Adutha thadava velai-la oru sentence English-la sollunga: 'I'll finish it by ___.'"
  }
 },
 {
  "id": 28,
  "wk": 4,
  "t": "Experience & 'have done'",
  "en": "Present perfect",
  "goal": "Experience & 'ippo dhaan mudinjadhu' solla kathukkalam.",
  "teach": [
   "have / has + 3rd form (done, eaten, seen, gone, been): 'I have finished.' → 'I've finished'.",
   "Ippo dhaan mudinjadhu: 'I've just eaten.' Innum illa: 'I haven't eaten yet.'",
   "Experience: 'Have you ever been to Delhi?' — 'Yes, I have.' / 'No, I've never been there.'",
   "Evlo naala: 'for' + kaalam (for 2 years) · 'since' + aarambicha point (since 2020)."
  ],
  "ex": [
   [
    "I've just finished my work.",
    "Ippo dhaan velai mudichen."
   ],
   [
    "Have you eaten?",
    "Saapteengalaa?"
   ],
   [
    "I haven't seen that movie yet.",
    "Andha padam innum paakkala."
   ],
   [
    "Have you ever been to Delhi?",
    "Neenga eppovaavadhu Delhi poyirukkeengalaa?"
   ],
   [
    "I've lived here for ten years.",
    "Pathu varushama inga irukken."
   ],
   [
    "I've known him since school.",
    "School-la irundhe avara theriyum."
   ]
  ],
  "fix": [
   [
    "I am here since 2015.",
    "I've been here since 2015.",
    "'since / for' kooda 'have been'."
   ],
   [
    "I have went.",
    "I have gone.",
    "have + 3rd form ('gone')."
   ],
   [
    "Did you ever go to Ooty?",
    "Have you ever been to Ooty?",
    "Experience-ku 'Have you ever'."
   ]
  ],
  "sound": null,
  "say": [
   "I've [just] [fin]ished my [work].",
   "I [have]n't [seen] that [mov]ie [yet].",
   "Have you [ev]er been to [Del]hi?",
   "I've [lived] [here] for [ten] [years].",
   "I've [known] him since [school]."
  ],
  "quiz": [
   {
    "q": "Sari:",
    "o": [
     "I have went.",
     "I have gone.",
     "I have go."
    ],
    "a": 1,
    "y": "have + 3rd form."
   },
   {
    "q": "I've lived here ___ 5 years.",
    "o": [
     "since",
     "for",
     "from"
    ],
    "a": 1,
    "y": "Kaalam = 'for'."
   },
   {
    "q": "I've known her ___ 2019.",
    "o": [
     "since",
     "for"
    ],
    "a": 0,
    "y": "Aarambicha point = 'since'."
   },
   {
    "q": "Order-la vainga: 'Neenga eppovaavadhu Goa poyirukkeengalaa?'",
    "w": [
     "Have",
     "you",
     "ever",
     "been",
     "to",
     "Goa"
    ],
    "y": "Have you ever been to + idam."
   },
   {
    "q": "Sari:",
    "o": [
     "I am working here since 2018.",
     "I have been working here since 2018."
    ],
    "a": 1,
    "y": "'since' kooda 'have been'."
   }
  ],
  "build": [
   [
    "Naan innum saapidala.",
    "I haven't eaten yet.",
    [
     "I have not eaten yet.",
     "I haven't had food yet."
    ]
   ],
   [
    "Naan 5 varushama indha company-la velai seyyuren.",
    "I've been working in this company for 5 years.",
    [
     "I have been working in this company for 5 years.",
     "I've worked in this company for 5 years.",
     "I have been working at this company for 5 years.",
     "I've worked at this company for 5 years.",
     "I have worked in this company for 5 years."
    ]
   ],
   [
    "Neenga eppovaavadhu flight-la poyirukkeengalaa?",
    "Have you ever traveled by plane?",
    [
     "Have you ever travelled by plane?",
     "Have you ever been on a plane?",
     "Have you ever traveled by flight?",
     "Have you ever travelled by flight?",
     "Have you ever flown?"
    ]
   ]
  ],
  "talk": {
   "role": "a friendly traveller asking about his experiences: places he has been to, foods he has tried, things he has never done.",
   "open": "I love travelling! Have you ever been to Kerala?",
   "goal": "'I have / I've never / for / since' use pannunga."
  },
  "home": {
   "write": "Unga life experiences pathi 5 sentence ezhudhunga (I've been to..., I've never...).",
   "task": "'Have you ever...?' — 3 kelvi family kitta English-la kelunga."
  }
 },
 {
  "id": 29,
  "wk": 4,
  "t": "Interview English",
  "en": "Job interview",
  "goal": "Interview-la calm ah, confident ah, clear ah answer panna.",
  "teach": [
   "'Tell me about yourself' = 4 part: 1) Peru & ooru 2) Padippu 3) Velai experience 4) Ungal strength & goal. 60–90 seconds podhum.",
   "Strength: 'I'm hardworking and I learn quickly.' Weakness (positive ah): 'I'm improving my English every day.'",
   "'Why should we hire you?' — 'Because I have experience in ___ and I'm reliable.'",
   "Mudikka: 'Thank you for this opportunity.'"
  ],
  "ex": [
   [
    "Good morning. Thank you for having me.",
    "Vanakkam. Ennai koopittadhukku nandri."
   ],
   [
    "I'm {name}, and I'm from Tamil Nadu.",
    "Naan {name}, Tamil Nadu."
   ],
   [
    "I have five years of experience in sales.",
    "Sales-la 5 varusham experience irukku."
   ],
   [
    "My strength is that I'm hardworking and honest.",
    "Kashtapattu, nermaiya velai seyven — adhu en strength."
   ],
   [
    "I'm improving my English every day.",
    "Dhinamum en English-a improve pannikkittu irukken."
   ],
   [
    "Thank you for this opportunity.",
    "Indha vaaippukku nandri."
   ]
  ],
  "fix": [
   [
    "I am completed my degree.",
    "I completed my degree.",
    "'am' vendaam — 'I completed'."
   ],
   [
    "I am having 5 years experience.",
    "I have 5 years of experience.",
    "'I have ___ years of experience'."
   ],
   [
    "I am a hard worker person.",
    "I'm a hard worker.",
    "'person' extra. 'I'm hardworking' kooda sari."
   ]
  ],
  "sound": null,
  "say": [
   "[Good] [mor]ning. [Thank] you for [hav]ing me.",
   "I [have] [five] [years] of ex[pe]rience.",
   "I'm hard[work]ing and I [learn] [quick]ly.",
   "I'm im[prov]ing my [Eng]lish [ev]ery [day].",
   "[Thank] you for this oppor[tu]nity."
  ],
  "quiz": [
   {
    "q": "Sari:",
    "o": [
     "I am having 5 years experience.",
     "I have 5 years of experience."
    ],
    "a": 1,
    "y": "'I have ___ years of experience'."
   },
   {
    "q": "Self-intro aarambam:",
    "o": [
     "Myself {name}.",
     "I'm {name}."
    ],
    "a": 1,
    "y": "'I'm ___' dhaan."
   },
   {
    "q": "Weakness — positive ah:",
    "o": [
     "I have no weakness.",
     "I'm improving my public speaking.",
     "I am weak in everything."
    ],
    "a": 1,
    "y": "Weakness + adha improve pannuradhu sollunga."
   },
   {
    "q": "Order-la vainga: 'Indha vaaippukku nandri.'",
    "w": [
     "Thank",
     "you",
     "for",
     "this",
     "opportunity"
    ],
    "y": "Thank you for + vishayam."
   },
   {
    "q": "'Tell me about yourself' — evlo neram?",
    "o": [
     "60–90 seconds",
     "10 seconds",
     "10 minutes"
    ],
    "a": 0,
    "y": "Short & clear — 1 to 1.5 minutes."
   }
  ],
  "build": [
   [
    "Enakku sales-la 3 varusham experience irukku.",
    "I have 3 years of experience in sales.",
    [
     "I have three years of experience in sales.",
     "I've got 3 years of experience in sales.",
     "I have 3 years' experience in sales."
    ]
   ],
   [
    "Naan seekiram kathukkuven.",
    "I learn quickly.",
    [
     "I'm a quick learner.",
     "I am a quick learner.",
     "I learn things quickly.",
     "I learn fast."
    ]
   ],
   [
    "Indha vaaippukku nandri.",
    "Thank you for this opportunity.",
    [
     "Thanks for this opportunity.",
     "Thank you for the opportunity."
    ]
   ]
  ],
  "talk": {
   "role": "a polite HR interviewer for an office job. Ask standard questions one at a time: tell me about yourself, your strengths, your weakness, why this job, when can you join.",
   "open": "Good morning! Please have a seat. Let's start — can you tell me about yourself?",
   "goal": "Calm ah, full sentence-la answer pannunga."
  },
  "home": {
   "write": "Unga 'Tell me about yourself' answer-a 8–10 sentence-la ezhudhunga.",
   "task": "Adha mirror munnadi 3 thadava sollunga, phone-la record pannunga."
  }
 },
 {
  "id": 30,
  "wk": 4,
  "t": "Final: 2 minute pechu",
  "en": "Your 2-minute talk",
  "goal": "30 naal kathukittadhu ellaam serththu 2 minute pesalaam. Neenga ready!",
  "teach": [
   "Indha 30 naal-la: self-intro, present, past, future, kelvi, polite English, phone, shopping, vazhi, karuththu, office, interview — ellaam kathukitteenga!",
   "Ini dhinamum: 1) 10 nimisham revision 2) Oru AI role-play 3) 5 sentence ezhudhuradhu 4) Oru English video kekkuradhu.",
   "Real aalunga kooda pesunga — friends, office, Free4Talk (free website). Thappu varum — adhu dhaan kathukkura vazhi.",
   "Fluent aaga 6–12 maasam dhinamum practice venum. Neenga already aarambichitteenga!"
  ],
  "ex": [
   [
    "Let me tell you about myself.",
    "Ennai pathi solren."
   ],
   [
    "Every day, I practice English for one hour.",
    "Dhinamum 1 mani neram English practice pannuren."
   ],
   [
    "Last month, I learned how to talk about my day.",
    "Pona maasam en naala pathi pesa kathukitten."
   ],
   [
    "Next year, I'm going to speak English at work.",
    "Adutha varusham velai-la English pesa poren."
   ],
   [
    "I think practice is more important than talent.",
    "Talent-a vida practice dhaan mukkiyam-nu ninaikkiren."
   ],
   [
    "Thank you for listening!",
    "Kettadhukku nandri!"
   ]
  ],
  "fix": [
   [
    "Myself {name}.",
    "I'm {name}.",
    "Eppovumey 'I'm ___'."
   ],
   [
    "He go / She have",
    "He goes / She has",
    "He / She-ku 's'."
   ],
   [
    "I am having a doubt.",
    "I have a question.",
    "'have'-ku '-ing' illa."
   ]
  ],
  "sound": null,
  "say": [
   "Let me [tell] you about my[self].",
   "[Ev]ery [day], I [prac]tice [Eng]lish for [one] [hour].",
   "Next [year], I'm going to [speak] [Eng]lish at [work].",
   "I [think] [prac]tice is more im[por]tant than [tal]ent.",
   "[Thank] you for [lis]tening!"
  ],
  "quiz": [
   {
    "q": "Yesterday I ___ to Chennai.",
    "o": [
     "go",
     "went",
     "have gone"
    ],
    "a": 1,
    "y": "Yesterday = 'went'."
   },
   {
    "q": "She ___ a car.",
    "o": [
     "have",
     "has"
    ],
    "a": 1,
    "y": "She → 'has'."
   },
   {
    "q": "___ you ever been to Mumbai?",
    "o": [
     "Did",
     "Have",
     "Do"
    ],
    "a": 1,
    "y": "Experience = 'Have you ever'."
   },
   {
    "q": "I'll call you ___ 6 o'clock.",
    "o": [
     "in",
     "on",
     "at"
    ],
    "a": 2,
    "y": "Exact neram = 'at'."
   },
   {
    "q": "Order-la vainga: 'Naan dhinamum English pesa poren.'",
    "w": [
     "I'm",
     "going",
     "to",
     "speak",
     "English",
     "every",
     "day"
    ],
    "y": "I'm going to + verb + eppo."
   }
  ],
  "build": [
   [
    "Naan dhinamum English practice pannuven.",
    "I practice English every day.",
    [
     "I practise English every day.",
     "I practice English daily.",
     "I practise English daily."
    ]
   ],
   [
    "Thappu varum, aanaa naan niruththa maatten.",
    "I'll make mistakes, but I won't stop.",
    [
     "I will make mistakes, but I will not stop.",
     "I make mistakes, but I won't stop.",
     "I will make mistakes, but I won't stop."
    ]
   ],
   [
    "Ippo enakku English pesa confidence irukku.",
    "Now I'm confident speaking English.",
    [
     "I'm confident speaking English now.",
     "Now I am confident in speaking English.",
     "Now I'm confident about speaking English.",
     "Now I feel confident speaking English."
    ]
   ]
  ],
  "talk": {
   "role": "a friendly examiner on his Day 30. Ask him to talk about himself, his English journey and his plans, ask simple follow-ups, and encourage him warmly.",
   "open": "Congratulations on reaching Day 30! Tell me — how has your English journey been?",
   "goal": "2 minute muzhusa pesunga!"
  },
  "home": {
   "write": "'My English journey' — 10 sentence ezhudhunga.",
   "task": "2-minute talk record panni, Day 7 recording kooda compare pannunga. Improvement kandippa kekkum!"
  }
 }
];

export const SOUNDS = [
 {
  "id": "th1",
  "g": "th",
  "n": "'th' — think",
  "how": [
   "Naakku nuni-ya rendu pal naduvula konjam veliya vechu kaathu oodhunga.",
   "Throat vibrate aaga koodadhu — kaathu mattum.",
   "'tink' / 'dink' nu sollaadheenga."
  ],
  "words": [
   "think",
   "thanks",
   "three",
   "Thursday",
   "birthday",
   "month",
   "both",
   "nothing"
  ],
  "pairs": [
   [
    "thin",
    "tin"
   ],
   [
    "three",
    "tree"
   ],
   [
    "thank",
    "tank"
   ],
   [
    "both",
    "boat"
   ],
   [
    "thought",
    "taught"
   ],
   [
    "math",
    "mat"
   ]
  ]
 },
 {
  "id": "th2",
  "g": "th",
  "n": "'th' — this",
  "how": [
   "Same position — naakku pal naduvula.",
   "Ippo throat vibrate aaganum (kazhuthula kai vechu paarunga).",
   "'dis' / 'dat' illa — 'this' / 'that'."
  ],
  "words": [
   "this",
   "that",
   "they",
   "there",
   "mother",
   "father",
   "together",
   "weather"
  ],
  "pairs": [
   [
    "they",
    "day"
   ],
   [
    "then",
    "den"
   ],
   [
    "those",
    "doze"
   ],
   [
    "there",
    "dare"
   ],
   [
    "though",
    "dough"
   ],
   [
    "breathe",
    "breed"
   ]
  ]
 },
 {
  "id": "vw",
  "g": "v·w",
  "n": "'v' & 'w' — very, west",
  "how": [
   "'v': mel pal-a keezh udhatta lightly thottu 'vvv' (vibration).",
   "'w': rendu udhadum round ('oo' madhiri), pal thodaadhu.",
   "Tamil 'va' rendukkum naduvula — idha pirichu sollanum."
  ],
  "words": [
   "very",
   "video",
   "village",
   "seven",
   "water",
   "work",
   "window",
   "week"
  ],
  "pairs": [
   [
    "vest",
    "west"
   ],
   [
    "vine",
    "wine"
   ],
   [
    "vet",
    "wet"
   ],
   [
    "verse",
    "worse"
   ],
   [
    "vow",
    "wow"
   ],
   [
    "veil",
    "whale"
   ]
  ]
 },
 {
  "id": "f",
  "g": "f",
  "n": "'f' — coffee",
  "how": [
   "Mel pal-a keezh udhattu mela vechu kaathu oodhunga.",
   "Udhadu rendum moodaadheenga — moodina 'p' aaidum.",
   "'coffee' (copy illa), 'phone' (pone illa)."
  ],
  "words": [
   "food",
   "family",
   "phone",
   "coffee",
   "office",
   "fine",
   "friend",
   "laugh"
  ],
  "pairs": [
   [
    "fan",
    "pan"
   ],
   [
    "fine",
    "pine"
   ],
   [
    "fast",
    "past"
   ],
   [
    "feel",
    "peel"
   ],
   [
    "fool",
    "pool"
   ],
   [
    "fair",
    "pair"
   ]
  ]
 },
 {
  "id": "z",
  "g": "z",
  "n": "'z' — zero, busy",
  "how": [
   "'s' madhiri naakku vechu, throat vibrate pannunga — bee 'zzz'.",
   "'was', 'is', 'busy', 'because' — ellaam 'z' sound.",
   "'jero' / 'bissy' illa — 'zero' / 'bizzy'."
  ],
  "words": [
   "zero",
   "zoo",
   "busy",
   "easy",
   "because",
   "was",
   "music",
   "choose"
  ],
  "pairs": [
   [
    "zip",
    "sip"
   ],
   [
    "rise",
    "rice"
   ],
   [
    "eyes",
    "ice"
   ],
   [
    "buzz",
    "bus"
   ],
   [
    "prize",
    "price"
   ],
   [
    "lose",
    "loose"
   ]
  ]
 },
 {
  "id": "s",
  "g": "s+",
  "n": "'s' start words — school",
  "how": [
   "'s'-la aarambikkura words munnadi 'i' / 'e' podaadheenga.",
   "'ischool' ✗ → 'school' ✓. 'sss' nu aarambichu direct ah next sound.",
   "Mella 'ssss-kool' nu practice pannunga."
  ],
  "words": [
   "school",
   "station",
   "start",
   "speak",
   "small",
   "stop",
   "story",
   "sleep",
   "street",
   "smart",
   "spoon",
   "sport"
  ]
 },
 {
  "id": "ed",
  "g": "-ed",
  "n": "'-ed' endings — worked",
  "how": [
   "'p, k, f, s, sh, ch' apram '-ed' = 't': worked (workt), helped (helpt).",
   "Matha sounds apram = 'd': played (playd), called (calld).",
   "'t' / 'd'-la mudinja verb mattum = 'id': wanted (want-id), needed (need-id)."
  ],
  "ed": [
   [
    "worked",
    "t"
   ],
   [
    "played",
    "d"
   ],
   [
    "wanted",
    "id"
   ],
   [
    "helped",
    "t"
   ],
   [
    "called",
    "d"
   ],
   [
    "needed",
    "id"
   ],
   [
    "watched",
    "t"
   ],
   [
    "cleaned",
    "d"
   ],
   [
    "started",
    "id"
   ],
   [
    "asked",
    "t"
   ],
   [
    "opened",
    "d"
   ],
   [
    "visited",
    "id"
   ],
   [
    "finished",
    "t"
   ],
   [
    "loved",
    "d"
   ],
   [
    "waited",
    "id"
   ],
   [
    "cooked",
    "t"
   ]
  ]
 },
 {
  "id": "stress",
  "g": "da·DA",
  "n": "Word stress — hoTEL",
  "how": [
   "Periya word-la oru part mattum strong (sathama, neelama).",
   "CAPITAL part dhaan strong: hoTEL, imPORtant.",
   "Thappana stress-la word-e maari kekkum."
  ],
  "stress": [
   [
    "hotel",
    [
     "ho",
     "tel"
    ],
    1
   ],
   [
    "important",
    [
     "im",
     "por",
     "tant"
    ],
    1
   ],
   [
    "comfortable",
    [
     "com",
     "for",
     "ta",
     "ble"
    ],
    0
   ],
   [
    "vegetable",
    [
     "veg",
     "e",
     "ta",
     "ble"
    ],
    0
   ],
   [
    "education",
    [
     "ed",
     "u",
     "ca",
     "tion"
    ],
    2
   ],
   [
    "photography",
    [
     "pho",
     "tog",
     "ra",
     "phy"
    ],
    1
   ],
   [
    "development",
    [
     "de",
     "vel",
     "op",
     "ment"
    ],
    1
   ],
   [
    "category",
    [
     "cat",
     "e",
     "go",
     "ry"
    ],
    0
   ],
   [
    "engineer",
    [
     "en",
     "gi",
     "neer"
    ],
    2
   ],
   [
    "purchase",
    [
     "pur",
     "chase"
    ],
    0
   ],
   [
    "thirteen",
    [
     "thir",
     "teen"
    ],
    1
   ],
   [
    "thirty",
    [
     "thir",
     "ty"
    ],
    0
   ],
   [
    "computer",
    [
     "com",
     "pu",
     "ter"
    ],
    1
   ],
   [
    "banana",
    [
     "ba",
     "na",
     "na"
    ],
    1
   ],
   [
    "hospital",
    [
     "hos",
     "pi",
     "tal"
    ],
    0
   ],
   [
    "doctor",
    [
     "doc",
     "tor"
    ],
    0
   ]
  ]
 },
 {
  "id": "vowel",
  "g": "ee·i",
  "n": "Neelam / short — sheep, ship",
  "how": [
   "'ee' (sheep, leave): smile panni neela izhunga.",
   "'i' (ship, live): relax ah, short ah.",
   "'oo' (fool, pool) neelam · 'u' (full, pull) short."
  ],
  "words": [
   "sheep",
   "ship",
   "leave",
   "live",
   "fool",
   "full"
  ],
  "pairs": [
   [
    "sheep",
    "ship"
   ],
   [
    "leave",
    "live"
   ],
   [
    "seat",
    "sit"
   ],
   [
    "feel",
    "fill"
   ],
   [
    "fool",
    "full"
   ],
   [
    "pool",
    "pull"
   ]
  ]
 }
];

export const SCENES = [
 {
  "id": "friend",
  "t": "Pudhu friend",
  "d": "Daily life pathi chat",
  "role": "a friendly new friend making small talk about his day, family, food and hobbies.",
  "open": "Hi! Nice to meet you. How is your day going?"
 },
 {
  "id": "shop",
  "t": "Kadai",
  "d": "Dress / porul vaanguradhu",
  "role": "a shopkeeper in a clothes shop. Quote prices in rupees and offer sizes and colours.",
  "open": "Hello sir, welcome! What are you looking for today?"
 },
 {
  "id": "phone",
  "t": "Phone call",
  "d": "Office-ku call pannuradhu",
  "role": "a receptionist at Lakshmi Agencies answering his phone call. The person he wants is busy.",
  "open": "Good morning, Lakshmi Agencies. How can I help you?"
 },
 {
  "id": "food",
  "t": "Hotel / Restaurant",
  "d": "Saapadu order pannuradhu",
  "role": "a waiter at a family restaurant taking his order and answering questions about the food.",
  "open": "Good evening! Here is the menu. What would you like to order?"
 },
 {
  "id": "travel",
  "t": "Bus / Train",
  "d": "Ticket & vazhi kekkuradhu",
  "role": "a ticket counter staff member at a railway station answering questions about trains, timings and tickets.",
  "open": "Next, please! Where would you like to go?"
 },
 {
  "id": "doctor",
  "t": "Doctor",
  "d": "Udambu pathi solluradhu",
  "role": "a friendly doctor at a clinic asking simple questions about a common health problem like a cold or fever. Keep it light and simple.",
  "open": "Hello, please sit down. What's the problem today?"
 },
 {
  "id": "bank",
  "t": "Bank",
  "d": "Account / ATM card",
  "role": "a bank officer helping him open a savings account or fix an ATM card problem.",
  "open": "Good morning, sir. How can I help you today?"
 },
 {
  "id": "office",
  "t": "Office",
  "d": "Manager kooda pesuradhu",
  "role": "his manager at work asking about tasks, deadlines and leave.",
  "open": "Good morning. Can you give me a quick update on your work?"
 },
 {
  "id": "interview",
  "t": "Interview",
  "d": "Job interview practice",
  "role": "a polite HR interviewer asking common interview questions one at a time.",
  "open": "Good morning! Please have a seat. Can you tell me about yourself?"
 },
 {
  "id": "free",
  "t": "Free talk",
  "d": "Edhu venumnaalum pesunga",
  "role": "a friendly English speaking partner. Talk about anything he wants; suggest an easy topic if he is stuck.",
  "open": "Hi! What would you like to talk about today?"
 }
];

export const TIPS = [
 "Thappa pesuradhu problem illa. Pesaama irukkuradhu dhaan problem.",
 "Dhinamum 40 nimisham > vaarathukku oru naal 4 mani neram.",
 "Kekkura English-a sathama thirumba sollunga — adhu dhaan 'shadowing'.",
 "Tamil-la yosichu translate pannaadheenga. Chinna sentence-la direct ah pesunga.",
 "Phone-la unga voice record panni kelunga — unga thappu ungalukke theriyum.",
 "Oru naal miss aanaalum paravaa illa — adutha naal kandippa thodarunga.",
 "Pudhu word kettaa, adha vachu 3 sentence sollunga.",
 "English movies / YouTube — subtitles ON pannittu paarunga."
];

export const WEEKS = {
 "1": "Vaaram 1 · Pesa aarambippom",
 "2": "Vaaram 2 · Nadandhadhu & mariyaadhai",
 "3": "Vaaram 3 · Ippo & plans",
 "4": "Vaaram 4–5 · Real-life English"
};
