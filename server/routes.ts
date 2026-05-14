import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, insertRoutineSchema } from "@shared/schema";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import connectPgSimple from "connect-pg-simple";

const scryptAsync = promisify(scrypt);
const isDevelopment = process.env.NODE_ENV === "development";
const DEV_SESSION_SECRET = "dev-travel-secret-key";
const DEV_SUPER_ADMIN_USERNAME = "admin1";
const DEV_SUPER_ADMIN_PASSWORD = "admin123";

function getSessionSecret(): string {
  if (process.env.SESSION_SECRET) {
    return process.env.SESSION_SECRET;
  }

  if (!isDevelopment) {
    throw new Error("SESSION_SECRET must be set in production");
  }

  return DEV_SESSION_SECRET;
}

function getBootstrapSuperAdmin(): { username: string; password: string } | null {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (username && password) {
    return { username, password };
  }

  if (isDevelopment) {
    return {
      username: username || DEV_SUPER_ADMIN_USERNAME,
      password: password || DEV_SUPER_ADMIN_PASSWORD,
    };
  }

  return null;
}

function routeParam(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const buf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(Buffer.from(hashed, "hex"), buf);
}

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
}

async function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const user = await storage.getUser(req.session.userId);
  if (!user || user.role !== "super_admin") {
    return res.status(403).json({ message: "Only the primary admin can perform this action" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const PgSession = connectPgSimple(session);

  app.use(
    session({
      store: new PgSession({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true,
      }),
      secret: getSessionSecret(),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      },
    })
  );

  const bootstrapSuperAdmin = getBootstrapSuperAdmin();
  if (bootstrapSuperAdmin) {
    const existingAdmin = await storage.getUserByUsername(bootstrapSuperAdmin.username);
    if (!existingAdmin) {
      const hashedPassword = await hashPassword(bootstrapSuperAdmin.password);
      await storage.createUser({
        username: bootstrapSuperAdmin.username,
        password: hashedPassword,
        role: "super_admin",
      });
    }
  } else {
    console.warn(
      "Skipping super admin bootstrap because ADMIN_USERNAME and ADMIN_PASSWORD are not set.",
    );
  }

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const { username, password } = parsed.data;
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      const valid = await comparePasswords(password, user.password);
      if (!valid) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      req.session.userId = user.id;
      return res.json({ id: user.id, username: user.username, role: user.role });
    } catch (error) {
      return res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      return res.json({ message: "Logged out" });
    });
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    return res.json({ id: user.id, username: user.username, role: user.role });
  });

  app.post("/api/auth/register", requireSuperAdmin, async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      const existing = await storage.getUserByUsername(username);
      if (existing) {
        return res.status(409).json({ message: "Username already exists" });
      }
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        role: "admin",
      });
      return res.json({ id: user.id, username: user.username, role: user.role });
    } catch (error) {
      return res.status(500).json({ message: "Registration failed" });
    }
  });

  app.get("/api/routines", async (_req: Request, res: Response) => {
    const allRoutines = await storage.getAllRoutines();
    return res.json(allRoutines);
  });

  app.get("/api/routines/:id", async (req: Request, res: Response) => {
    const routine = await storage.getRoutine(routeParam(req.params.id));
    if (!routine) {
      return res.status(404).json({ message: "Routine not found" });
    }
    return res.json(routine);
  });

  app.post("/api/routines", requireSuperAdmin, async (req: Request, res: Response) => {
    try {
      const data = { ...req.body, createdBy: req.session.userId };
      const parsed = insertRoutineSchema.safeParse(data);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid routine data", errors: parsed.error.errors });
      }
      const routine = await storage.createRoutine(parsed.data);
      return res.json(routine);
    } catch (error) {
      return res.status(500).json({ message: "Failed to create routine" });
    }
  });

  app.patch("/api/routines/:id", requireSuperAdmin, async (req: Request, res: Response) => {
    try {
      const routine = await storage.updateRoutine(routeParam(req.params.id), req.body);
      if (!routine) {
        return res.status(404).json({ message: "Routine not found" });
      }
      return res.json(routine);
    } catch (error) {
      return res.status(500).json({ message: "Failed to update routine" });
    }
  });

  app.delete("/api/routines/:id", requireSuperAdmin, async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteRoutine(routeParam(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Routine not found" });
      }
      return res.json({ message: "Routine deleted" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete routine" });
    }
  });

  app.get("/api/admin/selections", requireAuth, async (req: Request, res: Response) => {
    const selections = await storage.getAdminSelections(req.session.userId!);
    return res.json(selections);
  });

  app.post("/api/admin/selections", requireAuth, async (req: Request, res: Response) => {
    try {
      const { routineId } = req.body;
      if (!routineId) {
        return res.status(400).json({ message: "routineId is required" });
      }
      const selection = await storage.addAdminSelection({
        adminId: req.session.userId!,
        routineId,
      });
      return res.json(selection);
    } catch (error) {
      return res.status(500).json({ message: "Failed to select routine" });
    }
  });

  app.delete("/api/admin/selections/:routineId", requireAuth, async (req: Request, res: Response) => {
    try {
      const removed = await storage.removeAdminSelection(req.session.userId!, routeParam(req.params.routineId));
      if (!removed) {
        return res.status(404).json({ message: "Selection not found" });
      }
      return res.json({ message: "Selection removed" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to remove selection" });
    }
  });

  return httpServer;
}
