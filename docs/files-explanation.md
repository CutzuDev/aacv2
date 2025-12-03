# Explicație Detaliată a Fișierelor

## 1. `public/index.html` – Scheletul Paginii

**Ce este?** Fișierul HTML definește structura paginii (ce elemente există).

**Ce conține?**

- `<div id="wordGrid">` – container pentru grid-ul de cuvinte
- `<div id="sentenceArea">` – zona unde se construiește propoziție
- `<button id="speakBtn">` – butonul care rostește propoziția
- `<button id="clearBtn">` – butonul care șterge propoziția
- Butoane pentru categorii (Pronume, Verbe, Descrieri, etc.)
- `<script src="/app.js">` – încarcă logica JavaScript

## 2. `public/style.css` – Stilizarea Vizuală

**Ce este?** CSS (Cascading Style Sheets) definește cum arată elementele HTML.

**Ce face?**

- Setează culori, fonturi, spațieri
- Definește layout-ul (cum sunt poziționate elementele)
- Adaugă animații și tranziții
- Stilizează butoanele și zonele de drag & drop

## 3. `public/vocab.ro.json` – Baza de Date

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

## 4. `src/app.ts` – Logica Principală (DETALIAT)

Acesta este **creierul aplicației**. Să-l detaliem secțiune cu secțiune:

### A. Definirea Tipurilor

```typescript
type WordCategory = "all" | "pronoun" | "verb" | ...
type VocabEntry = { text: string; type: WordCategory; emoji?: string; }
```

**Ce face?** TypeScript are nevoie să știe ce fel de date există. Aici definim structura vocabularului.

### B. Starea Aplicației

```typescript
const state = {
  vocabulary: [], // array cu toate cuvintele încărcate
  currentCategory: "all", // categoria selectată momentan
  draggedElement: null, // elementul care este tras în drag & drop
  touchDragging: false, // flag pentru dispozitive touch
  cachedVoices: [], // vocile disponibile pentru text-to-speech
};
```

**Ce face?** Obiectul `state` păstrează toate informațiile dinamice ale aplicației.

### C. Selectarea Elementelor DOM

```typescript
const wordGrid = byId<HTMLDivElement>("wordGrid");
```

**Ce face?** Găsește elementele HTML după ID pentru a le putea manipula din JavaScript.

- `byId()` este o funcție helper care aruncă eroare dacă elementul lipsește

### D. Detectarea Dispozitivelor Touch

```typescript
const isTouchDevice = "ontouchstart" in window || ...
```

**Ce face?** Verifică dacă rulează pe telefon/tabletă pentru a activa evenimente de touch.

### E. Funcții Principale

**`refreshPlaceholder()`**

- Ascunde/arată textul "Apasă pe un cuvânt..." în funcție de conținutul propoziției

**`updateSentenceText()`**

- Colectează toate cuvintele din zona de propoziție
- Le concatenează cu spații între ele
- Actualizează input-ul ascuns cu textul complet

**`createSentenceWord()`**

- Creează un element HTML pentru fiecare cuvânt adăugat în propoziție
- Adaugă butonul "×" pentru ștergere
- Configurează event-urile pentru drag & drop
- **Foarte important:** face elementul draggable și gestionează starea de dragging

**`getDragAfterElement()`**

- Calculează unde ar trebui inserat un element tras în zona de propoziție
- Compară poziția mouse-ului/touch-ului cu pozițiile celorlalte cuvinte
- Returnează elementul după care ar trebui inserat elementul tras

**Event Listeners pentru Drag & Drop**

- `dragover` – permite drop-ul și repoziționează elementul în timp real
- `drop` – finalizează operația de drag & drop
- `touchmove`, `touchend` – echivalentele pentru dispozitive touch

**`renderGrid()`**

- Șterge grid-ul existent
- Filtrează vocabularul după categoria selectată
- Creează butoane pentru fiecare cuvânt
- Adaugă event listeners pe fiecare buton pentru a adăuga cuvântul în propoziție

**Filtrarea Categoriilor**

- Când apeși pe un buton de categorie, actualizează `state.currentCategory`
- Re-desenează grid-ul cu doar cuvintele din categoria selectată

**Text-to-Speech Setup**

- `loadVoices()` – încarcă lista de voci disponibile în browser
- `pickVoice()` – selectează o voce în limba română dacă există

**Butoanele de Acțiune**

- `speakBtn` – creează un `SpeechSynthesisUtterance` și îl rostește
- `clearBtn` – șterge toate cuvintele din propoziție

**Încărcarea Vocabularului**

- `fetchVocabulary()` – face o cerere HTTP GET pentru `/vocab.ro.json`
- `init()` – funcția care pornește aplicația la încărcarea paginii

## 5. `api/index.ts` – API Backend (Opțional)

**Ce este?** Un endpoint serverless care poate servi vocabularul dinamic.

**De ce există?** În production pe Vercel, poți folosi acest API pentru a servi vocabularul în loc să îl încarci direct ca fișier static. În configurația actuală, **nu este folosit** – aplicația încarcă direct `vocab.ro.json`.

**Cum funcționează?**

- Importă fișierul `vocab.ro.json`
- La cerere GET pe `/api/index`, returnează JSON-ul
- Adaugă headere de cache pentru performanță

## 6. `server.ts` – Server Local de Dezvoltare

**Ce este?** Un server HTTP simplu care rulează local pe calculatorul tău.

**Ce face?**

- Servește fișierele statice din `public/` (HTML, CSS, JS, JSON)
- Redirecționează cererile `/api` către handler-ul din `api/index.ts`
- Setează tipurile MIME corecte (spune browser-ului ce tip de fișier este)

**Funcții:**

- `getContentType()` – determină tipul MIME după extensie (.html, .css, .js, etc.)
- `serveStatic()` – citește fișierul de pe disk și îl trimite browser-ului
- Rulează pe `http://localhost:3000`

## 7. `dev.ts` – Orchestrator pentru Development

**Ce este?** Un script care pornește două procese simultan:

1. **esbuild în watch mode** – compilează `src/app.ts` → `public/app.js` automat la fiecare modificare
2. **serverul local** – reîncepe serverul la fiecare modificare în `server.ts`

**De ce?** În dezvoltare vrei să vezi modificările instant fără să dai restart manual.

## 8. `package.json` – Configurația Proiectului

**Ce conține?**

- **dependencies** – librării necesare (în cazul nostru, doar tipuri pentru TypeScript)
- **devDependencies** – unelte de dezvoltare (esbuild, TypeScript)
- **scripts** – comenzi predefinite:
  - `bun run dev` → pornește dezvoltarea cu watch
  - `bun run build` → compilează codul pentru production

## 9. `tsconfig.json` – Configurația TypeScript

**Ce face?** Spune compilatorului TypeScript cum să transforme fișierele `.ts` în `.js`.

**Opțiuni importante:**

- `target` – versiunea JavaScript de generat (ES2020)
- `module` – sistemul de module (ESNext)
- `strict` – activează verificări stricte de tipuri

## 10. `vercel.json` – Configurația pentru Deployment

**Ce este?** Vercel este o platformă de hosting pentru aplicații web.

**Ce configurează?**

- Ce framework folosești (momentan none, adică static)
- Ce build command să ruleze (`bun run build`)
- Ce director să publice (`public/`)
- Rutele pentru API (`/api` → funcții serverless)
