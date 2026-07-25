import type { Express, Request, Response } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import {
  ADMIN_SLOTS,
  createAdminToken,
  isAdminSlot,
  readAdminTokenFromRequest,
  verifyAdminPassword,
  type AdminSlot,
} from "@shared/admin-auth";

declare module "express-session" {
  interface SessionData {
    adminSlot?: AdminSlot;
  }
}

const SessionStore = MemoryStore(session);

export function setupSession(app: Express) {
  const secret = process.env.SESSION_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    console.warn("[auth] SESSION_SECRET is not set — admin sessions are insecure.");
  }

  app.use(
    session({
      secret: secret || "dev-only-session-secret",
      resave: false,
      saveUninitialized: false,
      proxy: process.env.NODE_ENV === "production",
      store: new SessionStore({ checkPeriod: 86_400_000 }),
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.SESSION_SECURE === "true",
        sameSite: "lax",
      },
    }),
  );
}

export function registerAuthRoutes(app: Express) {
  for (const slot of ADMIN_SLOTS) {
    app.use(`/${slot}`, (_req, res, next) => {
      res.setHeader("X-Robots-Tag", "noindex, nofollow");
      next();
    });
  }

  app.get("/api/auth/me", (req: Request, res: Response) => {
    const tokenSlot = readAdminTokenFromRequest(req);
    if (tokenSlot) {
      return res.json({ isAdmin: true, slot: tokenSlot });
    }

    const slot = req.session.adminSlot;
    if (slot && isAdminSlot(slot)) {
      return res.json({ isAdmin: true, slot });
    }
    return res.json({ isAdmin: false });
  });

  app.post("/api/auth/login", (req: Request, res: Response) => {
    const slot = req.body?.slot;
    const password = typeof req.body?.password === "string" ? req.body.password : "";

    if (!isAdminSlot(slot)) {
      return res.status(400).json({ message: "Invalid login." });
    }

    if (!verifyAdminPassword(slot, password)) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = createAdminToken(slot);

    req.session.adminSlot = slot;
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ message: "Session save failed." });
      }
      return res.json({ isAdmin: true, slot, token });
    });
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed." });
      }
      res.clearCookie("connect.sid");
      return res.json({ isAdmin: false });
    });
  });
}
