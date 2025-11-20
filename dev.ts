import process from "node:process";

const client = Bun.spawn(
  [
    "bunx",
    "esbuild",
    "src/app.ts",
    "--bundle",
    "--outfile=public/app.js",
    "--format=esm",
    "--platform=browser",
    "--target=es2020",
    "--watch"
  ],
  { stdout: "inherit", stderr: "inherit" }
);

const server = Bun.spawn(["bun", "--watch", "server.ts"], {
  stdout: "inherit",
  stderr: "inherit"
});

function shutdown() {
  client.kill();
  server.kill();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

await Promise.all([client.exited, server.exited]);
export { };


