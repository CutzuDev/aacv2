import handler from "./api/index";
import { join, normalize } from "node:path";
import { stat } from "node:fs/promises";

const publicDir = join(import.meta.dir, "public");

const mimeTypes: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon"
};

function getContentType(pathname: string): string {
  const extension = pathname.slice(pathname.lastIndexOf("."));
  return mimeTypes[extension] ?? "text/plain; charset=utf-8";
}

async function serveStatic(pathname: string): Promise<Response> {
  const relativePath = pathname === "/" ? "/index.html" : pathname;
  const safePath = normalize(relativePath).replace(/^\.\.(\/|\\)/g, "");
  const trimmedPath = safePath.startsWith("/") ? safePath.slice(1) : safePath;
  const filePath = join(publicDir, trimmedPath);

  try {
    await stat(filePath);
    const file = Bun.file(filePath);
    return new Response(file, {
      headers: {
        "Content-Type": getContentType(relativePath)
      }
    });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}

const server = Bun.serve({
  port: Number(process.env.PORT) || 3000,
  fetch(request) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api")) {
      return handler(request);
    }

    return serveStatic(url.pathname);
  }
});

const host = (server as any).hostname ?? "localhost";
console.log(`AAC dev server running at http://${host}:${server.port}`);
