# Gemini 2.0 Flash TTS Setup

## Cost & Limits (FREE tier)

- **Rate:** 15 requests/minut
- **Daily:** 1M tokens/zi
- **Monthly:** 10M tokens/lună
- **Model:** `gemini-2.0-flash` cu audio output

## Setup Vercel

1. Obține API key de la [Google AI Studio](https://aistudio.google.com/apikey)

2. Configurează în Vercel:
   ```bash
   vercel env add GEMINI_API_KEY
   # Paste API key când ești prompt-at
   ```

3. Redeploy:
   ```bash
   vercel --prod
   ```

## Arhitectură

- **Client** (`src/app.ts`): Încearcă întâi Gemini TTS → fallback la Web Speech API
- **Endpoint** (`api/tts.ts`): POST `/api/tts` { "text": "..." } → returnează base64 audio
- **Gratuit 100%** în limitele free tier Gemini

## Test Local

```bash
# Setează local API key
export GEMINI_API_KEY="your-key-here"

# Pornește dev server
bun run dev

# Test endpoint separat
bun run api/tts.ts
# apoi POST http://localhost:3002 cu {"text":"Salut"}
```

## Monitoring

Vezi usage în [Google AI Studio](https://aistudio.google.com/usage) → Rate limits tab.
