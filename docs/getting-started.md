# Cum Să Lucrezi cu Proiectul

## 1. Instalarea Dependințelor

```bash
bun install
```

**Ce face?** Descarcă toate librăriile necesare (TypeScript, esbuild, etc.).

## 2. Pornirea Serverului de Dezvoltare

```bash
bun run dev
```

**Ce face?**

- Pornește compilarea automată a `src/app.ts` → `public/app.js`
- Pornește serverul local pe `http://localhost:3000`
- La fiecare modificare în cod, recompilează automat

**Cum testezi?** Deschide browser-ul la `http://localhost:3000`.

## 3. Build pentru Production

```bash
bun run build
```

**Ce face?** Compilează codul TypeScript într-un singur fișier `app.js` optimizat, fără watch mode.

## 4. Modificarea Vocabularului

Editează `public/vocab.ro.json`:

```json
{ "text": "cuvânt nou", "type": "verb", "emoji": "🎯" }
```

Reîmprospătează pagina în browser pentru a vedea modificările.

## 5. Modificarea Stilurilor

Editează `public/style.css`:

```css
.word-tile {
  background-color: red;
}
```

Reîmprospătează pagina pentru a vedea modificările.

## 6. Modificarea Logicii

Editează `src/app.ts`, salvează, și esbuild va recompila automat. Reîmprospătează browser-ul.
