/**
 * Gemini 2.5 Flash TTS endpoint using official @google/genai SDK
 * Model: gemini-2.5-flash-preview-tts
 * Română suportată nativ (ro-RO)
 * Setează GEMINI_API_KEY în Vercel Environment Variables
 */

import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

type TtsRequest = {
  text: string;
  voiceName?: string;
};

// Convertește PCM raw în WAV format
function createWavHeader(pcmLength: number, sampleRate = 24000, channels = 1, bitsPerSample = 16): ArrayBuffer {
  const byteRate = sampleRate * channels * (bitsPerSample / 8);
  const blockAlign = channels * (bitsPerSample / 8);
  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  // "RIFF" chunk descriptor
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36 + pcmLength, true); // File size - 8
  view.setUint32(8, 0x57415645, false); // "WAVE"

  // "fmt " sub-chunk
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, channels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, byteRate, true); // ByteRate
  view.setUint16(32, blockAlign, true); // BlockAlign
  view.setUint16(34, bitsPerSample, true); // BitsPerSample

  // "data" sub-chunk
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, pcmLength, true); // Subchunk2Size

  return header;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  if (!GEMINI_API_KEY) {
    return Response.json(
      { error: "GEMINI_API_KEY nu este configurat" },
      { status: 500 }
    );
  }

  try {
    const body = (await request.json()) as TtsRequest;
    const text = body.text?.trim();
    const voiceName = body.voiceName || "Kore";

    if (!text || text.length > 500) {
      return Response.json(
        { error: "Text invalid (max 500 caractere)" },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    // Conform documentației oficiale
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Pronunta corect in romana: ${text}` }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName }
          }
        }
      }
    });

    const pcmBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!pcmBase64) {
      return Response.json(
        { error: "Nu s-a primit audio de la Gemini" },
        { status: 500 }
      );
    }

    // Decodează PCM din base64
    const pcmBuffer = Buffer.from(pcmBase64, "base64");
    
    // Creează WAV header
    const wavHeader = createWavHeader(pcmBuffer.length);
    
    // Combină header-ul cu datele PCM
    const wavBuffer = new Uint8Array(wavHeader.byteLength + pcmBuffer.length);
    wavBuffer.set(new Uint8Array(wavHeader), 0);
    wavBuffer.set(new Uint8Array(pcmBuffer), wavHeader.byteLength);
    
    // Convertește înapoi în base64
    const wavBase64 = Buffer.from(wavBuffer).toString("base64");

    // Returnează WAV complet ca base64
    return Response.json({
      audio: wavBase64,
      mimeType: "audio/wav"
    });
  } catch (error: any) {
    console.error("TTS error:", error);
    return Response.json(
      { error: error?.message || "Eroare internă la procesarea TTS" },
      { status: 500 }
    );
  }
}

// Dev server pentru testare locală
if (typeof Bun !== "undefined" && import.meta.main) {
  const server = Bun.serve({
    port: Number(process.env.PORT) || 3002,
    fetch: handler
  });

  const host = (server as any).hostname ?? "localhost";
  console.log(`TTS API running at http://${host}:${server.port}`);
}
