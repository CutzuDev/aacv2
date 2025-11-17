# AAC Română – Sistem de Comunicare Augmentativă și Alternativă

Acest proiect este o aplicație web care ajută persoanele cu dificultăți de comunicare să construiască propoziții în limba română folosind cuvinte predefinite cu emoji-uri. Aplicația permite construirea de propoziții prin apăsarea pe cuvinte, reordonarea lor prin drag & drop, și rostirea lor folosind sinteza vocală (text-to-speech).

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
│   └── index.ts         ← API endpoint pentru vocabular (opțional, nefolosit momentan)
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
2. Creează un obiect `SpeechSynthesisUtterance` (API-ul browserului pentru text-to-speech)
3. Selectează o voce în limba română din lista de voci disponibile
4. Browser-ul rostește textul folosind sinteza vocală nativă

**IMPORTANT:** Nu există comunicare cu serverul pentru funcționalitatea principală! Totul rulează în browser după ce vocabularul a fost încărcat inițial.

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

**Text-to-Speech Setup (Linii 218-243)**
- `loadVoices()` – încarcă lista de voci disponibile în browser
- `pickVoice()` – selectează o voce în limba română dacă există

**Butoanele de Acțiune (Linii 245-274)**
- `speakBtn` – creează un `SpeechSynthesisUtterance` și îl rostește
- `clearBtn` – șterge toate cuvintele din propoziție

**Încărcarea Vocabularului (Linii 276-305)**
- `fetchVocabulary()` – face o cerere HTTP GET pentru `/vocab.ro.json`
- `init()` – funcția care pornește aplicația la încărcarea paginii

### 5. `api/index.ts` – API Backend (Opțional)
**Ce este?** Un endpoint serverless care poate servi vocabularul dinamic.

**De ce există?** În production pe Vercel, poți folosi acest API pentru a servi vocabularul în loc să îl încarci direct ca fișier static. În configurația actuală, **nu este folosit** – aplicația încarcă direct `vocab.ro.json`.

**Cum funcționează?**
- Importă fișierul `vocab.ro.json`
- La cerere GET pe `/api/index`, returnează JSON-ul
- Adaugă headere de cache pentru performanță

### 6. `server.ts` – Server Local de Dezvoltare
**Ce este?** Un server HTTP simplu care rulează local pe calculatorul tău.

**Ce face?**
- Servește fișierele statice din `public/` (HTML, CSS, JS, JSON)
- Redirecționează cererile `/api` către handler-ul din `api/index.ts`
- Setează tipurile MIME corecte (spune browser-ului ce tip de fișier este)

**Funcții:**
- `getContentType()` – determină tipul MIME după extensie (.html, .css, .js, etc.)
- `serveStatic()` – citește fișierul de pe disk și îl trimite browser-ului
- Rulează pe `http://localhost:3000`

### 7. `dev.ts` – Orchestrator pentru Development
**Ce este?** Un script care pornește două procese simultan:

1. **esbuild în watch mode** – compilează `src/app.ts` → `public/app.js` automat la fiecare modificare
2. **serverul local** – reîncepe serverul la fiecare modificare în `server.ts`

**De ce?** În dezvoltare vrei să vezi modificările instant fără să dai restart manual.

### 8. `package.json` – Configurația Proiectului
**Ce conține?**
- **dependencies** – librării necesare (în cazul nostru, doar tipuri pentru TypeScript)
- **devDependencies** – unelte de dezvoltare (esbuild, TypeScript)
- **scripts** – comenzi predefinite:
  - `bun run dev` → pornește dezvoltarea cu watch
  - `bun run build` → compilează codul pentru production

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

### 1. Instalarea Dependințelor
```bash
bun install
```
**Ce face?** Descarcă toate librăriile necesare (TypeScript, esbuild, etc.).

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

---

## 🔧 Tehnologii Folosite

### 1. **Bun** (https://bun.sh)
Runtime JavaScript/TypeScript rapid (alternativă la Node.js). Vine cu bundler, package manager, și test runner integrat.

### 2. **TypeScript** (https://www.typescriptlang.org)
JavaScript cu tipuri statice. Previne multe bug-uri prin verificarea tipurilor la compilare.

### 3. **esbuild** (https://esbuild.github.io)
Bundler extrem de rapid care împachetează toate modulele TypeScript într-un singur fișier JavaScript.

### 4. **Web Speech API** (https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
API nativ al browserului pentru text-to-speech (sinteza vocală). Funcționează fără server!

### 5. **Drag and Drop API** (https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
API nativ al browserului pentru drag & drop. Permite rearanjarea cuvintelor.

### 6. **Fetch API** (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
API modern pentru cereri HTTP. Înlocuiește XMLHttpRequest-ul vechi.

### 7. **Vercel** (https://vercel.com)
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

### 5. **Sinteză Vocală**
- Butonul "Vorbește" rostește propoziția
- Caută automat o voce în limba română
- Folosește API-ul nativ al browserului (nu necesită internet!)

### 6. **Responsive Design**
- Funcționează pe desktop, tabletă, și mobil
- Touch-friendly pentru dispozitive mobile

---

## 📖 Glosar de Termeni

- **API (Application Programming Interface)** – set de funcții pentru comunicare între aplicații
- **Bundle** – procesul de împachetare a mai multor fișiere într-unul singur
- **Client** – browser-ul/aplicația care consumă date
- **Compiler** – program care transformă cod dintr-un limbaj în altul
- **DOM (Document Object Model)** – reprezentarea HTML-ului ca arbore de obiecte JavaScript
- **Event Listener** – funcție care ascultă și răspunde la evenimente (click, drag, etc.)
- **Fetch** – funcție JavaScript pentru cereri HTTP
- **Frontend** – partea vizibilă a aplicației (HTML, CSS, JS)
- **Backend** – partea serverului care procesează cereri
- **HTTP (HyperText Transfer Protocol)** – protocolul de comunicare web
- **JSON (JavaScript Object Notation)** – format de date structurate
- **Serverless** – funcții backend care rulează la cerere (fără server permanent)
- **Static Files** – fișiere care nu se schimbă (HTML, CSS, imagini)
- **TypeScript** – JavaScript cu tipuri statice
- **Watch Mode** – mod în care uneltele monitorizează fișierele și recompilează automat

---

## 🐛 Debugging și Troubleshooting

### Problema: Vocabularul nu se încarcă
**Soluție:** Verifică în Console (F12 în browser) dacă există erori la încărcarea `/vocab.ro.json`.

### Problema: Drag & drop nu funcționează
**Soluție:** Verifică dacă elementele au `draggable="true"` și event listeners corecți.

### Problema: Vocea nu funcționează
**Soluție:** Unele browsere (Safari) necesită interacțiune utilizator înainte de a activa sinteza vocală.

### Problema: Modificările nu apar
**Soluție:** 
1. Verifică că `bun run dev` rulează
2. Reîmprospătează pagina (Ctrl+R sau Cmd+R)
3. Dacă persistă, șterge cache-ul browserului (Ctrl+Shift+R)

---

## 📚 Resurse pentru Învățare

1. **HTML & CSS Basics:** https://developer.mozilla.org/en-US/docs/Learn
2. **JavaScript Modern:** https://javascript.info
3. **TypeScript Handbook:** https://www.typescriptlang.org/docs/handbook/intro.html
4. **Web APIs:** https://developer.mozilla.org/en-US/docs/Web/API
5. **Bun Documentation:** https://bun.sh/docs

---

## 🤝 Contribuții

Pentru a adăuga cuvinte noi, editează `public/vocab.ro.json` și adaugă obiecte în format:
```json
{ "text": "cuvântul_tău", "type": "categorie", "emoji": "🎯" }
```

Categoriile disponibile: `pronoun`, `verb`, `descriptor`, `question`, `social`, `home`, `school`, `action`.

