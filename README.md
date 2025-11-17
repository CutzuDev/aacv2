# AAC Română – Vercel-ready setup

Acest proiect oferă o arhitectură separată pentru interfața statică și API-ul serverless, scrise în TypeScript și pregătite pentru deploy pe Vercel.

## Structură

- `public/` – fișiere statice servite de Vercel (`index.html`, `style.css`, build-ul `app.js`, vocabularul JSON).
- `src/app.ts` – logica clientului (drag & drop, vorbire, filtrare pe categorii) compilată cu esbuild.
- `api/index.ts` – funcție Vercel/Bun care furnizează vocabularul în format JSON.
- `server.ts` – server local Bun care servește `public/` și proxiază `/api` pentru dezvoltare.
- `dev.ts` – script care pornește în paralel build-ul client și serverul local cu watch.

## Dezvoltare

```bash
bun install
bun run dev
```

Comanda de mai sus pornește două procese cu watch (client + server). Aplicația este disponibilă pe `http://localhost:3000`.

## Build local

```bash
bun run build
```

Output-ul produs în `public/` este exact ceea ce Vercel servește după `vercel build`.

## Deploy pe Vercel

1. Importă repository-ul în Vercel.
2. Platforma va rula automat `bun run build` și va publica directorul `public/`.
3. Ruta `/api/index` rămâne disponibilă ca funcție serverless pentru vocabular.
