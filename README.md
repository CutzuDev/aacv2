# AAC Română – Sistem de Comunicare Augmentativă și Alternativă

Acest proiect este o aplicație web care ajută persoanele cu dificultăți de comunicare să construiască propoziții în limba română folosind cuvinte predefinite cu emoji-uri. Aplicația permite construirea de propoziții prin apăsarea pe cuvinte, reordonarea lor prin drag & drop, și rostirea lor folosind sinteza vocală (text-to-speech) cu **Gemini 2.5 Flash TTS** pentru calitate vocală superioară.

---

## 📚 Ce Este Web Development? (Ghid Rapid)

### Client vs Server
- **Client** = browser-ul tău (Chrome, Firefox, etc.) care rulează cod JavaScript și afișează HTML/CSS
- **Server** = un computer care primește cereri (requests) de la client și trimite înapoi date sau pagini web
- **Frontend** = ceea ce vezi și interacționezi în browser (HTML, CSS, JavaScript)
- **Backend** = codul care rulează pe server și gestionează datele

### Cum Funcționează o Aplicație Web?
1. Scrii un URL în browser sau apeși un buton
2. Browser-ul trimite o **cerere HTTP** către server
3. Serverul procesează cererea și trimite înapoi un **răspuns** (HTML, JSON, imagini, etc.)
4. Browser-ul primește răspunsul și îl afișează

### TypeScript vs JavaScript
- **JavaScript** = limbajul nativ al browserului, rulează oriunde (browser + server)
- **TypeScript** = JavaScript cu tipuri (verifică erorile înainte de a rula codul). Se "compilează" în JavaScript normal

---

## 🏗️ Arhitectura Proiectului

Acest proiect folosește o arhitectură **full-stack modernă** cu separare clară între frontend și backend:

```
proj_java/
├── public/              ← Fișiere statice (accesibile direct în browser)
│   ├── index.html       ← Pagina principală HTML
│   ├── style.css        ← Stiluri vizuale (culori, layout, fonturi)
│   ├── app.js           ← Codul JavaScript compilat (generat automat din src/app.ts)
│   └── vocab.ro.json    ← Vocabularul complet (cuvinte + categorii + emoji)
│
├── src/                 ← Codul sursă TypeScript (se compilează în app.js)
│   └── app.ts           ← Logica principală a clientului (vezi detalii mai jos)
│
├── api/                 ← Backend serverless (funcții care rulează pe server)
│   ├── index.ts         ← API endpoint pentru vocabular (opțional, nefolosit momentan)
│   └── tts.ts           ← API endpoint pentru Gemini TTS (generare voce AI)
│
├── server.ts            ← Server local de dezvoltare (doar pentru testare locală)
├── dev.ts               ← Script care pornește development environment
├── package.json         ← Configurație npm (dependințe, comenzi)
├── tsconfig.json        ← Configurație TypeScript (cum se compilează codul)
└── vercel.json          ← Configurație pentru deployment pe Vercel
```

---

## 🔄 Fluxul de Date și Interacțiuni Client-Server

### La Încărcarea Paginii:
1. Browser-ul cere `index.html` de la server
2. Serverul trimite fișierul HTML
3. HTML-ul încarcă `style.css` (aspect vizual) și `app.js` (logică)
4. `app.js` face o cerere `fetch()` pentru `/vocab.ro.json`
5. Serverul trimite fișierul JSON cu toate cuvintele
6. JavaScript-ul populează grila de cuvinte pe ecran

### La Click pe Cuvânt:
1. Utilizatorul apasă pe un buton-cuvânt (ex: "eu 🧑")
2. Event listener-ul din `app.ts` detectează click-ul
3. Funcția `createSentenceWord()` creează un element HTML nou
4. Elementul este adăugat în zona de propoziție
5. Funcția `updateSentenceText()` actualizează textul propoziției

### La Drag & Drop:
1. Utilizatorul trage un cuvânt din zona de propoziție
2. Event-ul `dragstart` marchează elementul ca fiind "tras"
3. În timp ce tragi, `dragover` calculează unde ar trebui poziționat
4. La `drop`, elementul este mutat la noua poziție
5. Propoziția este recalculată și actualizată

### La Apăsarea pe "Vorbește":
1. Citește textul din propoziție
2. Trimite cerere POST către `/api/tts` cu textul de rostit
3. Serverul serverless procesează cererea prin Gemini 2.5 Flash TTS API
4. Gemini generează audio PCM raw în limba română cu vocea "Kore"
5. Serverul convertește PCM în format WAV și îl trimite ca base64
6. Clientul primește audio-ul, îl decodează și îl redă în browser
7. După redare, audio-ul este curățat din memorie

**Flux de date TTS:**
- Client → `POST /api/tts` cu `{ text: "propoziția ta" }`
- Server → Gemini API cu configurare pentru română
- Gemini → răspuns cu audio PCM în base64
- Server → conversie PCM → WAV + trimitere către client
- Client → decodare base64 → creare Audio object → redare

**IMPORTANT:** Funcționalitatea principală (vocabular, drag & drop) rulează în browser, dar TTS necesită comunicare cu serverul pentru generare audio de înaltă calitate cu Gemini AI.

---

## 📁 Explicație Detaliată a Fișierelor

### 1. `public/index.html` – Scheletul Paginii
**Ce este?** Fișierul HTML definește structura paginii (ce elemente există).

**Ce conține?**
- `<div id="wordGrid">` – container pentru grid-ul de cuvinte
- `<div id="sentenceArea">` – zona unde se construiește propoziția
- `<button id="speakBtn">` – butonul care rostește propoziția
- `<button id="clearBtn">` – butonul care șterge propoziția
- Butoane pentru categorii (Pronume, Verbe, Descrieri, etc.)
- `<script src="/app.js">` – încarcă logica JavaScript

### 2. `public/style.css` – Stilizarea Vizuală
**Ce este?** CSS (Cascading Style Sheets) definește cum arată elementele HTML.

**Ce face?**
- Setează culori, fonturi, spațieri
- Definește layout-ul (cum sunt poziționate elementele)
- Adaugă animații și tranziții
- Stilizează butoanele și zonele de drag & drop

### 3. `public/vocab.ro.json` – Baza de Date
**Ce este?** Un fișier JSON (JavaScript Object Notation) care conține toate cuvintele.

**Structura:**
```json
[
  { "text": "eu", "type": "pronoun", "emoji": "🧑" },
  { "text": "vreau", "type": "verb", "emoji": "⭐" },
  { "text": "fericit", "type": "descriptor", "emoji": "😊" }
]
```

**Câmpuri:**
- `text` – cuvântul în sine
- `type` – categoria (pronoun, verb, descriptor, question, social, home, school, action)
- `emoji` – emoji-ul asociat (opțional)

### 4. `src/app.ts` – Logica Principală (DETALIAT)

Acesta este **creierul aplicației**. Să-l detaliem secțiune cu secțiune:

#### A. Definirea Tipurilor (Linii 1-16)
```typescript
type WordCategory = "all" | "pronoun" | "verb" | ...
type VocabEntry = { text: string; type: WordCategory; emoji?: string; }
```
**Ce face?** TypeScript are nevoie să știe ce fel de date există. Aici definim structura vocabularului.

#### B. Starea Aplicației (Linii 18-24)
```typescript
const state = {
  vocabulary: [],           // array cu toate cuvintele încărcate
  currentCategory: "all",   // categoria selectată momentan
  draggedElement: null,     // elementul care este tras în drag & drop
  touchDragging: false,     // flag pentru dispozitive touch
  cachedVoices: []          // vocile disponibile pentru text-to-speech
};
```
**Ce face?** Obiectul `state` păstrează toate informațiile dinamice ale aplicației.

#### C. Selectarea Elementelor DOM (Linii 26-42)
```typescript
const wordGrid = byId<HTMLDivElement>("wordGrid");
```
**Ce face?** Găsește elementele HTML după ID pentru a le putea manipula din JavaScript.
- `byId()` este o funcție helper care aruncă eroare dacă elementul lipsește

#### D. Detectarea Dispozitivelor Touch (Linii 44-51)
```typescript
const isTouchDevice = "ontouchstart" in window || ...
```
**Ce face?** Verifică dacă rulează pe telefon/tabletă pentru a activa evenimente de touch.

#### E. Funcții Principale

**`refreshPlaceholder()` (Linii 53-56)**
- Ascunde/arată textul "Apasă pe un cuvânt..." în funcție de conținutul propoziției

**`updateSentenceText()` (Linii 58-64)**
- Colectează toate cuvintele din zona de propoziție
- Le concatenează cu spații între ele
- Actualizează input-ul ascuns cu textul complet

**`createSentenceWord()` (Linii 66-112)**
- Creează un element HTML pentru fiecare cuvânt adăugat în propoziție
- Adaugă butonul "×" pentru ștergere
- Configurează event-urile pentru drag & drop
- **Foarte important:** face elementul draggable și gestionează starea de dragging

**`getDragAfterElement()` (Linii 114-132)**
- Calculează unde ar trebui inserat un element tras în zona de propoziție
- Compară poziția mouse-ului/touch-ului cu pozițiile celorlalte cuvinte
- Returnează elementul după care ar trebui inserat elementul tras

**Event Listeners pentru Drag & Drop (Linii 134-177)**
- `dragover` – permite drop-ul și repoziționează elementul în timp real
- `drop` – finalizează operația de drag & drop
- `touchmove`, `touchend` – echivalentele pentru dispozitive touch

**`renderGrid()` (Linii 179-206)**
- Șterge grid-ul existent
- Filtrează vocabularul după categoria selectată
- Creează butoane pentru fiecare cuvânt
- Adaugă event listeners pe fiecare buton pentru a adăuga cuvântul în propoziție

**Filtrarea Categoriilor (Linii 208-216)**
- Când apeși pe un buton de categorie, actualizează `state.currentCategory`
- Re-desenează grid-ul cu doar cuvintele din categoria selectată

**Funcția de TTS cu Gemini (Linii 218-260)** ⭐ **NOU**
- `speakWithGemini()` – funcție asincronă care gestionează întregul flux TTS:
  1. Trimite cerere POST către `/api/tts` cu textul
  2. Verifică răspunsul și extrage audio-ul base64
  3. Convertește base64 în Blob audio
  4. Creează URL temporar pentru Blob
  5. Creează obiect Audio și îl redă
  6. Curăță URL-ul temporar după redare
  7. Gestionează erorile (network, API, redare)

**Event Listener pentru Butonul "Vorbește" (Linii 262-281)**
- Verifică dacă există text și dacă nu vorbește deja
- Setează stare `isSpeaking` pentru a preveni click-uri multiple
- Dezactivează butonul și schimbă textul în "🔊 Se încarcă..."
- Apelează `speakWithGemini()` și așteaptă finalizarea
- În caz de eroare, afișează alert cu mesajul de eroare
- Resetare stare și reactivare buton după finalizare

**Butonul "Șterge" (Linii 283-288)**
- `clearBtn` – șterge toate cuvintele din propoziție
- Resetează placeholder-ul

**Încărcarea Vocabularului (Linii 290-313)**
- `fetchVocabulary()` – face o cerere HTTP GET pentru `/vocab.ro.json` cu `Cache-Control: no-cache`
- `init()` – funcția care pornește aplicația la încărcarea paginii:
  1. Afișează mesaj "Se încarcă vocabularul..."
  2. Încearcă să încarce vocabularul
  3. Dacă reușește, populează grid-ul
  4. Dacă eșuează, afișează mesaj de eroare
  5. Inițializează placeholder-ul

### 5. `api/index.ts` – API Backend pentru Vocabular (Opțional)
**Ce este?** Un endpoint serverless care poate servi vocabularul dinamic.

**De ce există?** În production pe Vercel, poți folosi acest API pentru a servi vocabularul în loc să îl încarci direct ca fișier static. În configurația actuală, **nu este folosit** – aplicația încarcă direct `vocab.ro.json`.

**Cum funcționează?**
- Importă fișierul `vocab.ro.json`
- La cerere GET pe `/api`, returnează JSON-ul
- Adaugă headere de cache pentru performanță

### 5B. `api/tts.ts` – API Gemini Text-to-Speech ⭐ **NOU**
**Ce este?** Endpoint serverless care generează audio de înaltă calitate folosind **Gemini 2.5 Flash TTS**.

**De ce Gemini?** 
- Voce naturală în limba română (model preantrenat cu "Kore" voice)
- Calitate superioară față de sinteza vocală nativă a browserului
- Suport nativ pentru limba română (ro-RO)
- Procesare rapidă cu modelul Flash optimizat

**Cum funcționează?**
1. Primește cerere POST cu `{ text: "propoziția", voiceName?: "Kore" }`
2. Validează textul (max 500 caractere)
3. Trimite cerere către Gemini API:
   ```typescript
   model: "gemini-2.5-flash-preview-tts"
   responseModalities: ["AUDIO"]
   speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } }
   ```
4. Primește audio PCM raw în format base64 de la Gemini
5. Convertește PCM în WAV complet:
   - Creează header WAV (44 bytes) cu metadata: sample rate 24000Hz, 16-bit, mono
   - Combină header-ul cu datele PCM
   - Convertește buffer-ul final înapoi în base64
6. Returnează JSON cu `{ audio: "base64...", mimeType: "audio/wav" }`

**Configurare necesară:**
- Variabilă de mediu `GEMINI_API_KEY` (obținută de pe https://aistudio.google.com)
- SDK oficial: `@google/genai`

**Headers CORS:**
- Permite cereri cross-origin pentru dezvoltare locală
- Suportă preflight OPTIONS request

**Limitări:**
- Max 500 caractere per cerere (protecție împotriva abuzului)
- Necesită API key valid
- Rate limits impuse de Google Gemini API

### 6. `server.ts` – Server Local de Dezvoltare
**Ce este?** Un server HTTP simplu care rulează local pe calculatorul tău folosind **Bun**.

**Ce face?**
- Servește fișierele statice din `public/` (HTML, CSS, JS, JSON)
- Redirecționează cererile `/api/tts` către handler-ul TTS
- Redirecționează alte cereri `/api/*` către handler-ul vocabular
- Setează tipurile MIME corecte (spune browser-ului ce tip de fișier este)

**Funcții importante:**
- `getContentType()` – determină tipul MIME după extensie (.html, .css, .js, .json, .svg, .png, etc.)
- `serveStatic()` – citește fișierul de pe disk folosind `Bun.file()` și îl trimite browser-ului
- Rutare inteligentă:
  - `/` → servește `index.html`
  - `/api/tts` → procesează cereri TTS cu Gemini
  - `/api/*` → servește vocabular
  - Orice altceva → servește fișier static sau 404

**Configurare:**
- Port: `process.env.PORT` sau `3000` (default)
- Rulează pe `http://localhost:3000`
- Folosește Bun runtime pentru performanță maximă

### 7. `dev.ts` – Orchestrator pentru Development
**Ce este?** Un script care pornește două procese simultan:

1. **esbuild în watch mode** – compilează `src/app.ts` → `public/app.js` automat la fiecare modificare
2. **serverul local** – reîncepe serverul la fiecare modificare în `server.ts`

**De ce?** În dezvoltare vrei să vezi modificările instant fără să dai restart manual.

### 8. `package.json` – Configurația Proiectului
**Ce conține?**

**dependencies** (librării necesare în production):
- `@google/genai` (^1.30.0) – SDK oficial Google pentru Gemini AI (TTS, chat, etc.)
- `@types/bun` (^1.3.2) – Definițiile TypeScript pentru Bun runtime

**devDependencies** (unelte de dezvoltare):
- `@types/node` (^22.7.5) – Definițiile TypeScript pentru Node.js APIs
- `esbuild` (^0.24.0) – Bundler ultra-rapid pentru compilare TypeScript → JavaScript
- `typescript` (^5.6.0) – Compilatorul TypeScript

**scripts** (comenzi predefinite):
- `bun run dev` → pornește dezvoltarea cu watch (alias pentru `dev:watch`)
- `bun run dev:watch` → rulează `dev.ts` (pornește server + build watch simultan)
- `bun run dev:client` → compilează `app.ts` în watch mode (recompilează la fiecare modificare)
- `bun run dev:server` → pornește serverul cu watch (restart automat la modificări)
- `bun run build` → compilează codul pentru production (fără watch, optimizat)
- `bun run start` → pornește doar serverul (fără watch, pentru production)

### 9. `tsconfig.json` – Configurația TypeScript
**Ce face?** Spune compilatorului TypeScript cum să transforme fișierele `.ts` în `.js`.

**Opțiuni importante:**
- `target` – versiunea JavaScript de generat (ES2020)
- `module` – sistemul de module (ESNext)
- `strict` – activează verificări stricte de tipuri

### 10. `vercel.json` – Configurația pentru Deployment
**Ce este?** Vercel este o platformă de hosting pentru aplicații web.

**Ce configurează?**
- Ce framework folosești (momentan none, adică static)
- Ce build command să ruleze (`bun run build`)
- Ce director să publice (`public/`)
- Rutele pentru API (`/api` → funcții serverless)

---

## 🚀 Cum Să Lucrezi cu Proiectul

### 0. Configurare Gemini API Key ⭐ **OBLIGATORIU**

Pentru ca funcționalitatea TTS să funcționeze, trebuie să configurezi un API key de la Google:

**Pas 1: Obține API Key**
1. Mergi la https://aistudio.google.com/apikey
2. Creează cont Google (dacă nu ai deja)
3. Click pe "Create API Key"
4. Copiază cheia generată

**Pas 2: Configurare Locală**

Creează un fișier `.env` în rădăcina proiectului:
```bash
GEMINI_API_KEY=your_api_key_here
```

**Pas 3: Configurare Vercel (Production)**
1. Mergi în dashboard-ul Vercel la proiectul tău
2. Settings → Environment Variables
3. Adaugă variabila:
   - Name: `GEMINI_API_KEY`
   - Value: cheia ta API
   - Environment: Production, Preview, Development

**IMPORTANT:** 
- Nu commit-a niciodată `.env` în Git (e deja în `.gitignore`)
- Păstrează API key-ul secret
- Gemini API are free tier generos, dar verifică limitele pe https://ai.google.dev/pricing

### 1. Instalarea Dependințelor
```bash
bun install
```
**Ce face?** Descarcă toate librăriile necesare (TypeScript, esbuild, @google/genai, etc.).

### 2. Pornirea Serverului de Dezvoltare
```bash
bun run dev
```
**Ce face?**
- Pornește compilarea automată a `src/app.ts` → `public/app.js`
- Pornește serverul local pe `http://localhost:3000`
- La fiecare modificare în cod, recompilează automat

**Cum testezi?** Deschide browser-ul la `http://localhost:3000`.

### 3. Build pentru Production
```bash
bun run build
```
**Ce face?** Compilează codul TypeScript într-un singur fișier `app.js` optimizat, fără watch mode.

### 4. Modificarea Vocabularului
Editează `public/vocab.ro.json`:
```json
{ "text": "cuvânt nou", "type": "verb", "emoji": "🎯" }
```
Reîmprospătează pagina în browser pentru a vedea modificările.

### 5. Modificarea Stilurilor
Editează `public/style.css`:
```css
.word-tile { background-color: red; }
```
Reîmprospătează pagina pentru a vedea modificările.

### 6. Modificarea Logicii
Editează `src/app.ts`, salvează, și esbuild va recompila automat. Reîmprospătează browser-ul.

### 7. Testarea TTS Local

**Metodă 1: Browser**
1. Pornește serverul: `bun run dev`
2. Deschide http://localhost:3000
3. Construiește o propoziție: "Eu vreau apă"
4. Apasă "Vorbește"
5. Verifică Console (F12) pentru eventuale erori

**Metodă 2: cURL (testare API direct)**
```bash
curl -X POST http://localhost:3000/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Bună ziua"}' \
  | jq -r '.audio' \
  | base64 -d > test.wav
```
Apoi redă `test.wav` cu un player audio.

**Metodă 3: Bun REPL (testare programatic)**
```bash
bun repl
```
```javascript
const response = await fetch("http://localhost:3000/api/tts", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: "Salut" })
});
const data = await response.json();
console.log(data.mimeType); // "audio/wav"
console.log(data.audio.slice(0, 50)); // primele 50 caractere base64
```

---

## 🔧 Tehnologii Folosite

### 1. **Bun** (https://bun.sh)
Runtime JavaScript/TypeScript rapid (alternativă la Node.js). Vine cu bundler, package manager, și test runner integrat.

### 2. **TypeScript** (https://www.typescriptlang.org)
JavaScript cu tipuri statice. Previne multe bug-uri prin verificarea tipurilor la compilare.

### 3. **esbuild** (https://esbuild.github.io)
Bundler extrem de rapid care împachetează toate modulele TypeScript într-un singur fișier JavaScript.

### 4. **Gemini 2.5 Flash TTS** ⭐ (https://ai.google.dev)
Model AI de la Google pentru generare voce text-to-speech de înaltă calitate. Suportă 100+ limbi, inclusiv română nativă. Folosește SDK oficial `@google/genai`.

**Caracteristici:**
- Model: `gemini-2.5-flash-preview-tts`
- Voce preantrenată: "Kore" (optimizată pentru română)
- Output: PCM raw audio (24000Hz, 16-bit, mono)
- Response modality: AUDIO
- Latență scăzută cu modelul Flash

### 5. **Drag and Drop API** (https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
API nativ al browserului pentru drag & drop. Permite rearanjarea cuvintelor.

### 6. **Fetch API** (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
API modern pentru cereri HTTP. Înlocuiește XMLHttpRequest-ul vechi.

### 7. **Web Audio API** (https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
API nativ pentru redare și procesare audio în browser. Folosit pentru redarea audio-ului generat de Gemini.

### 8. **Vercel** (https://vercel.com)
Platformă de hosting pentru aplicații web moderne. Deploy automat la fiecare push pe GitHub.

---

## 🎯 Funcționalități Principale

### 1. **Grid Interactiv de Cuvinte**
- Afișează cuvinte organizate pe categorii
- Fiecare cuvânt are emoji asociat
- Click pe cuvânt → se adaugă în propoziție

### 2. **Filtrare pe Categorii**
- Butoane pentru: Toate, Pronume, Verbe, Descrieri, Întrebări, Social, Acasă, Școală, Acțiuni
- Filtrarea se face în JavaScript (fără server)

### 3. **Construirea Propozițiilor**
- Zona de propoziție unde se adună cuvintele
- Fiecare cuvânt are buton "×" pentru ștergere
- Text ascuns care conține propoziția completă

### 4. **Drag & Drop**
- Poți trage cuvintele pentru a le reordona
- Funcționează și pe touch (mobil/tabletă)
- Animații pentru feedback vizual

### 5. **Sinteză Vocală cu Gemini AI** ⭐
- Butonul "Vorbește" rostește propoziția folosind Gemini 2.5 Flash TTS
- Voce naturală de înaltă calitate (model "Kore" optimizat pentru română)
- Procesare server-side pentru calitate superioară
- Feedback vizual: "Se încarcă..." în timpul generării
- Gestionare erori cu mesaje clare pentru utilizator

### 6. **Responsive Design**
- Funcționează pe desktop, tabletă, și mobil
- Touch-friendly pentru dispozitive mobile

---

## 🔬 Detalii Tehnice: Procesarea Audio TTS

### Fluxul Complet de la Text la Sunet

**1. Client trimite cerere:**
```typescript
fetch("/api/tts", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: "Eu vreau să mănânc" })
})
```

**2. Server procesează cu Gemini:**
```typescript
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash-preview-tts",
  contents: [{ parts: [{ text: `Pronunta corect in romana: ${text}` }] }],
  config: {
    responseModalities: ["AUDIO"],
    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } }
  }
});
```

**3. Gemini returnează PCM raw:**
- Format: PCM (Pulse Code Modulation) - date audio necomprimate
- Sample rate: 24000 Hz (24.000 de sample-uri pe secundă)
- Bit depth: 16-bit (fiecare sample = 2 bytes)
- Channels: 1 (mono)
- Encoding: base64

**4. Conversie PCM → WAV:**

PCM este doar datele audio brute. Pentru ca browser-ul să înțeleagă formatul, trebuie să adăugăm un **header WAV** (44 bytes):

```typescript
function createWavHeader(pcmLength: number): ArrayBuffer {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  
  // RIFF chunk descriptor
  view.setUint32(0, 0x52494646);     // "RIFF"
  view.setUint32(4, 36 + pcmLength); // File size - 8
  view.setUint32(8, 0x57415645);     // "WAVE"
  
  // fmt sub-chunk (metadata audio)
  view.setUint32(12, 0x666d7420);    // "fmt "
  view.setUint32(16, 16);            // Subchunk size
  view.setUint16(20, 1);             // Audio format (1 = PCM)
  view.setUint16(22, 1);             // Channels (1 = mono)
  view.setUint32(24, 24000);         // Sample rate
  view.setUint32(28, 48000);         // Byte rate (24000 * 1 * 2)
  view.setUint16(32, 2);             // Block align (1 * 2)
  view.setUint16(34, 16);            // Bits per sample
  
  // data sub-chunk
  view.setUint32(36, 0x64617461);    // "data"
  view.setUint32(40, pcmLength);     // Data size
  
  return header;
}
```

**5. Combinare și trimitere:**
```typescript
const pcmBuffer = Buffer.from(pcmBase64, "base64");
const wavHeader = createWavHeader(pcmBuffer.length);
const wavBuffer = new Uint8Array(wavHeader.byteLength + pcmBuffer.length);
wavBuffer.set(new Uint8Array(wavHeader), 0);
wavBuffer.set(new Uint8Array(pcmBuffer), wavHeader.byteLength);

return Response.json({
  audio: Buffer.from(wavBuffer).toString("base64"),
  mimeType: "audio/wav"
});
```

**6. Client redă audio:**
```typescript
const audioBlob = await (await fetch(`data:audio/wav;base64,${data.audio}`)).blob();
const audioUrl = URL.createObjectURL(audioBlob);
const audio = new Audio(audioUrl);
await audio.play();
```

### De ce WAV și nu MP3?
- **WAV** = format necomprimat, simplu, suportat universal
- **MP3** = format comprimat, necesită encoder (libmp3lame), mai complex
- Pentru audio scurt (propoziții), dimensiunea nu e problemă
- WAV se redă instant fără decodare complexă

### Calcularea Dimensiunii Audio
Pentru un text de ~10 cuvinte (3 secunde de vorbire):
- Sample rate: 24000 Hz
- Bit depth: 16-bit = 2 bytes
- Channels: 1 (mono)
- Dimensiune: 24000 * 2 * 3 = **144 KB** (WAV complet)

---

## 📖 Glosar de Termeni

- **API (Application Programming Interface)** – set de funcții pentru comunicare între aplicații
- **Base64** – encoding care transformă date binare în text ASCII (folosit pentru transmitere audio)
- **Blob** – Binary Large Object - reprezentare în memorie a datelor binare (imagini, audio, etc.)
- **Bundle** – procesul de împachetare a mai multor fișiere într-unul singur
- **Client** – browser-ul/aplicația care consumă date
- **Compiler** – program care transformă cod dintr-un limbaj în altul
- **CORS (Cross-Origin Resource Sharing)** – mecanism de securitate care permite/blochează cereri între domenii diferite
- **DOM (Document Object Model)** – reprezentarea HTML-ului ca arbore de obiecte JavaScript
- **Event Listener** – funcție care ascultă și răspunde la evenimente (click, drag, etc.)
- **Fetch** – funcție JavaScript pentru cereri HTTP
- **Frontend** – partea vizibilă a aplicației (HTML, CSS, JS)
- **Backend** – partea serverului care procesează cereri
- **HTTP (HyperText Transfer Protocol)** – protocolul de comunicare web
- **JSON (JavaScript Object Notation)** – format de date structurate
- **PCM (Pulse Code Modulation)** – format audio necomprimat (date audio raw)
- **Sample Rate** – numărul de sample-uri audio pe secundă (Hz) - ex: 24000 Hz = 24.000 sample-uri/secundă
- **SDK (Software Development Kit)** – set de librării pentru interacționare cu un serviciu (ex: @google/genai)
- **Serverless** – funcții backend care rulează la cerere (fără server permanent)
- **Static Files** – fișiere care nu se schimbă (HTML, CSS, imagini)
- **TTS (Text-to-Speech)** – tehnologie de conversie text → voce sintetizată
- **TypeScript** – JavaScript cu tipuri statice
- **WAV** – format audio necomprimat cu header (metadata + date PCM)
- **Watch Mode** – mod în care uneltele monitorizează fișierele și recompilează automat

---

## 🐛 Debugging și Troubleshooting

### Problema: Vocabularul nu se încarcă
**Soluție:** Verifică în Console (F12 în browser) dacă există erori la încărcarea `/vocab.ro.json`.

### Problema: Drag & drop nu funcționează
**Soluție:** Verifică dacă elementele au `draggable="true"` și event listeners corecți.

### Problema: Vocea nu funcționează
**Posibile cauze:**
1. **Lipsește API key:** Verifică că `GEMINI_API_KEY` este setat în variabilele de mediu
2. **Eroare de rețea:** Verifică conexiunea la internet (Gemini API necesită internet)
3. **Rate limit:** Verifică Console (F12) pentru erori de la API
4. **Text prea lung:** Propozițiile sunt limitate la 500 caractere
5. **Browser:** Unele browsere necesită interacțiune utilizator pentru a reda audio

**Soluții:**
- Setează `GEMINI_API_KEY` în `.env` local sau în Vercel Environment Variables
- Verifică logs în Console pentru detalii despre eroare
- Testează cu propoziții mai scurte

### Problema: Modificările nu apar
**Soluție:** 
1. Verifică că `bun run dev` rulează
2. Reîmprospătează pagina (Ctrl+R sau Cmd+R)
3. Dacă persistă, șterge cache-ul browserului (Ctrl+Shift+R)

---

## 🚢 Deployment pe Vercel

### Pregătirea pentru Production

**1. Verifică configurația `vercel.json`:**
```json
{
  "buildCommand": "bun run build",
  "outputDirectory": "public",
  "devCommand": "bun run dev",
  "installCommand": "bun install"
}
```

**2. Setează Environment Variables în Vercel:**
- Dashboard → Project → Settings → Environment Variables
- Adaugă `GEMINI_API_KEY` pentru toate environment-urile (Production, Preview, Development)

**3. Deploy:**
```bash
# Instalează Vercel CLI
bun install -g vercel

# Deploy
vercel

# Deploy production
vercel --prod
```

**4. Verificare post-deployment:**
- Testează toate categoriile de cuvinte
- Testează drag & drop
- Testează funcția "Vorbește" cu diferite propoziții
- Verifică Console pentru erori
- Testează pe mobil (responsive + touch)

### Best Practices pentru Production

**1. Securitate:**
- ✅ Nu expune niciodată API key-uri în cod (folosește environment variables)
- ✅ Validează input-ul utilizatorului (limită de 500 caractere pentru TTS)
- ✅ Rate limiting pe endpoint-ul TTS (previne abuz)
- ✅ CORS headers configurate corect

**2. Performanță:**
- ✅ Cache pentru vocabular (`Cache-Control: public, max-age=3600`)
- ✅ esbuild minifică codul JavaScript automat
- ✅ Servește fișiere statice direct (fără procesare serverless)
- ✅ Audio se curăță din memorie după redare (`URL.revokeObjectURL()`)

**3. User Experience:**
- ✅ Feedback vizual pentru operații asincrone ("Se încarcă...")
- ✅ Mesaje de eroare clare și utile
- ✅ Disable button în timpul procesării (previne click-uri multiple)
- ✅ Placeholder-uri pentru zone goale

**4. Monitorizare:**
- Verifică Vercel Analytics pentru trafic
- Monitorizează Gemini API usage pe https://aistudio.google.com
- Verifică error logs în Vercel Dashboard

---

## 📚 Resurse pentru Învățare

### Documentație Oficială
1. **HTML & CSS Basics:** https://developer.mozilla.org/en-US/docs/Learn
2. **JavaScript Modern:** https://javascript.info
3. **TypeScript Handbook:** https://www.typescriptlang.org/docs/handbook/intro.html
4. **Web APIs:** https://developer.mozilla.org/en-US/docs/Web/API
5. **Bun Documentation:** https://bun.sh/docs
6. **Gemini AI:** https://ai.google.dev/gemini-api/docs
7. **Vercel Deployment:** https://vercel.com/docs

### Tutoriale Specifice
- **Drag & Drop API:** https://web.dev/articles/drag-and-drop
- **Web Audio API:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API
- **Fetch API:** https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
- **TypeScript for Beginners:** https://www.totaltypescript.com/tutorials
- **Gemini TTS Tutorial:** https://ai.google.dev/api/multimodal-live/guides/quickstart

---

## 🤝 Contribuții

Pentru a adăuga cuvinte noi, editează `public/vocab.ro.json` și adaugă obiecte în format:
```json
{ "text": "cuvântul_tău", "type": "categorie", "emoji": "🎯" }
```

Categoriile disponibile: `pronoun`, `verb`, `descriptor`, `question`, `social`, `home`, `school`, `action`, `connector`.

