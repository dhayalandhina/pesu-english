PESU ENGLISH  -  Dinesh anna-voda English teacher app
=====================================================

Idhu video call madhiri: Priya miss (illana Arun sir) screen-la irupaanga.
Neenga pesunga -> avanga kettu voice-la pathil solluvaanga, thappu-va sari pannuvaanga,
puriyalana Tamil-la solli tharuvaanga. 30 naal course + free talk + role-play + doubt.


ONE-TIME SETUP (Mac, Dhina panna vendiyadhu)
--------------------------------------------
1. Indha zip-a open pannunga. "Pesu English.app"-a Applications folder-ku drag pannunga.

2. Mac security: zip internet-la irundhu vandhadhaala mudhal thadava Mac block pannum.
   Terminal-la idha oru thadava run pannunga:

       xattr -dr com.apple.quarantine "/Applications/Pesu English.app"

   (illana: app-a open panna try pannunga -> System Settings -> Privacy & Security ->
    keezha "Pesu English" pakkathula "Open Anyway")

3. Launchpad / Spotlight-la "Pesu English" open pannunga. Chrome-la thani window-a app varum.
   (Chrome illana default browser-la open aagum.)

4. Mudhal screen: OpenAI API key (sk-...).
     https://platform.openai.com/api-keys  ->  Create new secret key  ->  copy
     Account-la credit venum: https://platform.openai.com/settings/organization/billing/
     App-la paste pannunga -> "Save & check".
     (Free Gemini key "AIza..." irundhaalum podalaam - app thaane kandupidikkum.)

5. Peru, ooru, teacher (Priya miss / Arun sir) select panni "Seri, aarambippom".

6. Chrome "microphone" permission kekkum -> Allow.
   (Mac kettaa: System Settings -> Privacy & Security -> Microphone -> Google Chrome ON.)


DAILY USE (Dinesh anna)
-----------------------
- Earphone (mic oda) pottukonga. Speaker-la pesunaalum work aagum; earphone innum clear.
- "Class aarambippom" -> teacher mudhalla "Hi Dinesh" nu pesuvaanga -> neenga pesunga.
- Teacher pesumbodhu idaiyila pesunaalum kettukkuvaanga (real call madhiri).
- Buttons: "Puriyala" (Tamil-la explain), "Mella pesunga", "Thirumba sollunga",
           "Tamil-la solren" (Tamil-la sollunga, English-la eppadi nu solli tharuvaanga).
- Right side Whiteboard-la "better-ah ippadi sollalaam" cards varum.
- Mudinjadhum "Mudichikkalaam" -> report card: nalla pannadhu, 3 thappu, pudhu words.
- Oru naalaiku oru class (~15 nimisham). Day complete aana adutha naal adutha Day.
- Veettula sathham adhigam-na: Settings -> Mic -> "Button pidichu pesu".


OTHER COMPUTERS (Windows / Linux)
---------------------------------
- Node.js 20+ install pannunga (https://nodejs.org).
- "Pesu English.app/Contents/Resources/app" folder-a copy pannunga.
- Windows: "Start Pesu English (Windows).bat" double-click.   Linux: ./start-linux.sh


DATA & PRIVACY
--------------
- API key, progress, teacher memory, call transcripts ellaam indha computer-la mattum:
      Mac:     ~/Library/Application Support/Pesu English
      Windows: %APPDATA%\Pesu English
- Voice internet vazhiya key-oda company-ku mattum pogum (OpenAI Realtime, illana Google Gemini Live).
  Gemini FREE plan-la Google indha data-va avanga products improve panna use pannalaam.
- App window close panni 4 nimishathula background server thaana nirkkum.
