# Fluxul de Date și Interacțiuni Client-Server

## La Încărcarea Paginii:

1. Browser-ul cere `index.html` de la server
2. Serverul trimite fișierul HTML
3. HTML-ul încarcă `style.css` (aspect vizual) și `app.js` (logică)
4. `app.js` face o cerere `fetch()` pentru `/vocab.ro.json`
5. Serverul trimite fișierul JSON cu toate cuvintele
6. JavaScript-ul populează grila de cuvinte pe ecran

## La Click pe Cuvânt:

1. Utilizatorul apasă pe un buton-cuvânt (ex: "eu 🧑")
2. Event listener-ul din `app.ts` detectează click-ul
3. Funcția `createSentenceWord()` creează un element HTML nou
4. Elementul este adăugat în zona de propoziție
5. Funcția `updateSentenceText()` actualizează textul propoziției

## La Drag & Drop:

1. Utilizatorul trage un cuvânt din zona de propoziție
2. Event-ul `dragstart` marchează elementul ca fiind "tras"
3. În timp ce tragi, `dragover` calculează unde ar trebui poziționat
4. La `drop`, elementul este mutat la noua poziție
5. Propoziția este recalculată și actualizată

## La Apăsarea pe "Vorbește":

1. Citește textul din propoziție
2. Creează un obiect `SpeechSynthesisUtterance` (API-ul browserului pentru text-to-speech)
3. Selectează o voce în limba română din lista de voci disponibile
4. Browser-ul rostește textul folosind sinteza vocală nativă

**IMPORTANT:** Nu există comunicare cu serverul pentru funcționalitatea principală! Totul rulează în browser după ce vocabularul a fost încărcat inițial.
