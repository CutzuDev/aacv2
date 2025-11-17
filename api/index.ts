import vocab from "../public/vocab.ro.json";

export type WordCategory =
  | "pronoun"
  | "verb"
  | "descriptor"
  | "question"
  | "social"
  | "home"
  | "school"
  | "action";

export type VocabEntry = {
  text: string;
  type: WordCategory;
  emoji?: string;
};

type ApiResponse = {
  vocab: VocabEntry[];
};

const payload: ApiResponse = {
  vocab: vocab as VocabEntry[]
};

export default function handler(request: Request): Response {
  if (request.method && request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  if (request.method === "HEAD") {
    return new Response(null, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600"
      }
    });
  }

  return Response.json(payload, {
    headers: {
      "Cache-Control": "public, max-age=3600"
    }
  });
}

if (typeof Bun !== "undefined" && import.meta.main) {
  const server = Bun.serve({
    port: Number(process.env.PORT) || 3001,
    fetch: handler
  });

  const host = (server as any).hostname ?? "localhost";
  console.log(`AAC vocab API running at http://${host}:${server.port}`);
}
