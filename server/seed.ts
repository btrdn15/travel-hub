import { storage } from "./storage";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);
const LEGACY_DEFAULT_ADMIN_PASSWORD = "admin123";
const LEGACY_ADMIN_USERNAMES = ["admin1", "admin2", "admin3", "admin4", "admin5"];

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  if (!hashed || !salt) {
    return false;
  }

  const suppliedHash = (await scryptAsync(supplied, salt, 64)) as Buffer;
  const storedHash = Buffer.from(hashed, "hex");

  if (storedHash.length !== suppliedHash.length) {
    return false;
  }

  return timingSafeEqual(storedHash, suppliedHash);
}

async function replacePassword(id: string, password: string) {
  await storage.updateUserPassword(id, await hashPassword(password));
}

async function bootstrapConfiguredAdmin() {
  const username = process.env.BOOTSTRAP_ADMIN_USERNAME?.trim();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;

  if (!username && !password) {
    return;
  }

  if (!username || !password) {
    console.warn(
      "[seed] BOOTSTRAP_ADMIN_USERNAME and BOOTSTRAP_ADMIN_PASSWORD must both be set; skipping admin bootstrap.",
    );
    return;
  }

  if (password === LEGACY_DEFAULT_ADMIN_PASSWORD) {
    throw new Error("BOOTSTRAP_ADMIN_PASSWORD must not use the legacy default password.");
  }

  const existing = await storage.getUserByUsername(username);
  if (!existing) {
    await storage.createUser({
      username,
      password: await hashPassword(password),
      role: "super_admin",
    });
    return;
  }

  if (await comparePasswords(LEGACY_DEFAULT_ADMIN_PASSWORD, existing.password)) {
    await replacePassword(existing.id, password);
    console.warn(`[seed] Replaced legacy default password for bootstrap admin "${username}".`);
  }
}

export async function seedDatabase() {
  await bootstrapConfiguredAdmin();

  for (const username of LEGACY_ADMIN_USERNAMES) {
    const existing = await storage.getUserByUsername(username);
    if (existing && await comparePasswords(LEGACY_DEFAULT_ADMIN_PASSWORD, existing.password)) {
      await replacePassword(existing.id, randomBytes(32).toString("hex"));
      console.warn(`[seed] Locked legacy default admin account "${username}".`);
    }
  }
}
