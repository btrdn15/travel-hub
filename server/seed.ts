import { storage } from "./storage";
import type { IStorage } from "./storage";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);
const LEGACY_DEFAULT_PASSWORD = "admin123";
const LEGACY_SEEDED_ADMIN_USERNAMES = ["admin1", "admin2", "admin3", "admin4", "admin5"];
const MIN_BOOTSTRAP_PASSWORD_LENGTH = 12;

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

  const hashedPassword = Buffer.from(hashed, "hex");
  if (hashedPassword.length !== 64) {
    return false;
  }

  const suppliedPassword = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedPassword, suppliedPassword);
}

async function lockLegacyDefaultAdmins(currentStorage: IStorage) {
  for (const username of LEGACY_SEEDED_ADMIN_USERNAMES) {
    const existing = await currentStorage.getUserByUsername(username);
    if (!existing) {
      continue;
    }

    if (await comparePasswords(LEGACY_DEFAULT_PASSWORD, existing.password)) {
      const lockedPassword = await hashPassword(randomBytes(32).toString("hex"));
      await currentStorage.updateUserPassword(existing.id, lockedPassword);
      console.warn(`[seed] Locked legacy default-password admin account "${username}".`);
    }
  }
}

async function seedBootstrapAdmin(currentStorage: IStorage) {
  const username = process.env.BOOTSTRAP_ADMIN_USERNAME?.trim();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;

  if (!username && !password) {
    return;
  }

  if (!username || !password) {
    throw new Error(
      "Both BOOTSTRAP_ADMIN_USERNAME and BOOTSTRAP_ADMIN_PASSWORD are required to bootstrap an admin.",
    );
  }

  if (password.length < MIN_BOOTSTRAP_PASSWORD_LENGTH) {
    throw new Error(
      `BOOTSTRAP_ADMIN_PASSWORD must be at least ${MIN_BOOTSTRAP_PASSWORD_LENGTH} characters long.`,
    );
  }

  const existing = await currentStorage.getUserByUsername(username);
  if (existing) {
    return;
  }

  await currentStorage.createUser({
    username,
    password: await hashPassword(password),
    role: "super_admin",
  });
}

export async function seedDatabase(currentStorage: IStorage = storage) {
  await lockLegacyDefaultAdmins(currentStorage);
  await seedBootstrapAdmin(currentStorage);
}