# Arhitectura Proiectului

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
