import { storage } from "./storage";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const buf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return Buffer.from(hashed, "hex").length === buf.length && Buffer.from(hashed, "hex").equals(buf);
}

async function matchesPassword(password: string, stored: string): Promise<boolean> {
  try {
    return await comparePasswords(password, stored);
  } catch {
    return false;
  }
}

const STAFF_ADMIN_PASSWORD = process.env.STAFF_ADMIN_PASSWORD;
const COMPROMISED_DEFAULT_PASSWORD = "admin123";

export async function seedDatabase() {
  const adminAccounts = ["admin2", "admin3", "admin4", "admin5"];

  for (const username of adminAccounts) {
    const existing = await storage.getUserByUsername(username);

    if (STAFF_ADMIN_PASSWORD) {
      const hashedPassword = await hashPassword(STAFF_ADMIN_PASSWORD);
      if (existing) {
        await storage.updateUserPassword(existing.id, hashedPassword);
      } else {
        await storage.createUser({
          username,
          password: hashedPassword,
          role: "admin",
        });
      }
      continue;
    }

    if (existing && await matchesPassword(COMPROMISED_DEFAULT_PASSWORD, existing.password)) {
      await storage.updateUserPassword(existing.id, await hashPassword(randomBytes(32).toString("hex")));
      console.error(
        `[auth] Disabled the public default password for ${username}. ` +
          `Set STAFF_ADMIN_PASSWORD to configure staff admin logins.`,
      );
    } else if (!existing) {
      console.error(
        `[auth] STAFF_ADMIN_PASSWORD is not set; ${username} was not created.`,
      );
    }
  }
}
