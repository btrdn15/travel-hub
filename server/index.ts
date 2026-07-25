import "dotenv/config";
import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { setupSession } from "./auth";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import net from "node:net";
/** When PORT is unset in development, pick first free port from startPort (avoids macOS AirPlay on 5000 and busy 5001). */
function findFirstAvailablePort(startPort: number, host: string, maxAttempts = 50): Promise<number> {
  return new Promise((resolve, reject) => {
    let offset = 0;
    const attempt = () => {
      if (offset >= maxAttempts) {
        reject(new Error(`No free TCP port from ${startPort} to ${startPort + maxAttempts - 1}`));
        return;
      }
      const candidate = startPort + offset;
      const probe = net.createServer();
      probe.once("error", (err: NodeJS.ErrnoException) => {
        probe.removeAllListeners("listening");
        if (err.code === "EADDRINUSE") {
          offset++;
          attempt();
        } else {
          reject(err);
        }
      });
      probe.once("listening", () => {
        probe.close(() => resolve(candidate));
      });
      probe.listen(candidate, host);
    };
    attempt();
  });
}

const app = express();
const httpServer = createServer(app);

// nginx HTTPS proxy — session cookie (secure) зөв ажиллахын тулд
app.set("trust proxy", 1);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

setupSession(app);

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const host = process.env.HOST || "0.0.0.0";
  const port =
    process.env.PORT && process.env.PORT !== ""
      ? parseInt(process.env.PORT, 10)
      : process.env.NODE_ENV === "development"
        ? await findFirstAvailablePort(5001, host)
        : 5000;

  httpServer.once("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${port} is already in use. Stop the other process or set PORT to a free port.`);
    }
  });

  httpServer.listen({ port, host }, () => {
    console.log(`Server running on http://${host}:${port}`);
  });
})();
