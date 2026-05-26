import { storage } from "./storage";
import type { IStorage } from "./storage";
import { randomBytes } from "crypto";
import { comparePasswords, hashPassword } from "./password";

type SeedStorage = Pick<IStorage, "getUserByUsername" | "createUser" | "updateUserPassword">;

const legacyDefaultPassword = "admin123";
const legacyDefaultAdminUsernames = ["admin1", "admin2", "admin3", "admin4", "admin5"];

async function lockDefaultPasswordAccounts(seedStorage: SeedStorage) {
  for (const username of legacyDefaultAdminUsernames) {
    const existing = await seedStorage.getUserByUsername(username);
    if (!existing) {
      continue;
    }

    if (await comparePasswords(legacyDefaultPassword, existing.password)) {
      const randomPassword = randomBytes(32).toString("hex");
      const hashedPassword = await hashPassword(randomPassword);
      await seedStorage.updateUserPassword(existing.id, hashedPassword);
    }
  }
}

async function bootstrapAdminFromEnvironment(seedStorage: SeedStorage) {
  const username = process.env.BOOTSTRAP_ADMIN_USERNAME;
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;

  if (!username && !password) {
    return;
  }

  if (!username || !password) {
    throw new Error("BOOTSTRAP_ADMIN_USERNAME and BOOTSTRAP_ADMIN_PASSWORD must be set together");
  }

  const existing = await seedStorage.getUserByUsername(username);
  if (existing) {
    return;
  }

  const hashedPassword = await hashPassword(password);
  await seedStorage.createUser({
    username,
    password: hashedPassword,
    role: "super_admin",
  });
}

export async function seedDatabase(seedStorage: SeedStorage = storage) {
  await lockDefaultPasswordAccounts(seedStorage);
  await bootstrapAdminFromEnvironment(seedStorage);
}
