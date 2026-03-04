import { storage } from "./storage";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function seedDatabase() {
  const adminAccounts = [
    { username: "admin2", password: "admin123" },
    { username: "admin3", password: "admin123" },
    { username: "admin4", password: "admin123" },
    { username: "admin5", password: "admin123" },
  ];

  for (const account of adminAccounts) {
    const existing = await storage.getUserByUsername(account.username);
    if (!existing) {
      const hashedPassword = await hashPassword(account.password);
      await storage.createUser({
        username: account.username,
        password: hashedPassword,
        role: "admin",
      });
    } else {
      const hashedPassword = await hashPassword(account.password);
      await storage.updateUserPassword(existing.id, hashedPassword);
    }
  }

}
