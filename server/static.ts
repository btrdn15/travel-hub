import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `[serveStatic] Build directory not found: ${distPath}. ` +
        `Run "npm run build" before starting the server in production. ` +
        `All requests will return a fallback 503 response until the build is generated.`,
    );
    app.use("/{*path}", (_req, res) => {
      res.status(503).send(
        "Application not built. Run `npm run build` on the server.",
      );
    });
    return;
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("/{*path}", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
