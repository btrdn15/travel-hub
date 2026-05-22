import { storage, type IStorage } from "./storage";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);
type SeedStorage = Pick<IStorage, "getUserByUsername" | "createUser">;

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function seedDatabase(store: SeedStorage = storage) {
  const adminAccounts = [
    { username: "admin2", password: "admin123" },
    { username: "admin3", password: "admin123" },
    { username: "admin4", password: "admin123" },
    { username: "admin5", password: "admin123" },
  ];

  for (const account of adminAccounts) {
    const existing = await store.getUserByUsername(account.username);
    if (!existing) {
      const hashedPassword = await hashPassword(account.password);
      await store.createUser({
        username: account.username,
        password: hashedPassword,
        role: "admin",
      });
    }
  }

}
