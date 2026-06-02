import { storage } from "./storage";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);
const DEFAULT_ADMIN_PASSWORD = "admin123";
const DEFAULT_ADMIN_USERNAMES = ["admin1", "admin2", "admin3", "admin4", "admin5"];

type SeedStorage = Pick<
  typeof storage,
  "getUserByUsername" | "createUser" | "updateUserPassword"
>;

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function passwordMatches(supplied: string, stored: string): Promise<boolean> {
  try {
    const [hashed, salt] = stored.split(".");
    if (!hashed || !salt) {
      return false;
    }
    const buf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    const storedHash = Buffer.from(hashed, "hex");
    return storedHash.length === buf.length && storedHash.equals(buf);
  } catch {
    return false;
  }
}

async function bootstrapConfiguredAdmin(seedStorage: SeedStorage, env: NodeJS.ProcessEnv) {
  const username = env.BOOTSTRAP_ADMIN_USERNAME?.trim();
  const password = env.BOOTSTRAP_ADMIN_PASSWORD;

  if (!username && !password) {
    return;
  }

  if (!username || !password) {
    throw new Error(
      "Both BOOTSTRAP_ADMIN_USERNAME and BOOTSTRAP_ADMIN_PASSWORD are required to bootstrap an admin.",
    );
  }

  if (password === DEFAULT_ADMIN_PASSWORD) {
    throw new Error("BOOTSTRAP_ADMIN_PASSWORD must not use the old default admin password.");
  }

  const existing = await seedStorage.getUserByUsername(username);
  const hashedPassword = await hashPassword(password);

  if (!existing) {
    await seedStorage.createUser({
      username,
      password: hashedPassword,
      role: "super_admin",
    });
    console.log(`Bootstrap super admin '${username}' created from environment configuration.`);
    return;
  }

  if (existing.role !== "super_admin") {
    throw new Error(`Bootstrap admin '${username}' already exists without super_admin role.`);
  }

  if (await passwordMatches(DEFAULT_ADMIN_PASSWORD, existing.password)) {
    await seedStorage.updateUserPassword(existing.id, hashedPassword);
    console.log(`Bootstrap super admin '${username}' password updated from environment configuration.`);
  }
}

async function lockDefaultAdminCredentials(seedStorage: SeedStorage) {
  for (const username of DEFAULT_ADMIN_USERNAMES) {
    const existing = await seedStorage.getUserByUsername(username);
    if (existing && (await passwordMatches(DEFAULT_ADMIN_PASSWORD, existing.password))) {
      const lockedPassword = randomBytes(32).toString("hex");
      await seedStorage.updateUserPassword(existing.id, await hashPassword(lockedPassword));
      console.warn(
        `Locked '${username}' because it still used the old default admin password. ` +
          "Reset it through a privileged admin flow.",
      );
    }
  }
}

export async function seedDatabase(
  seedStorage: SeedStorage = storage,
  env: NodeJS.ProcessEnv = process.env,
) {
  await bootstrapConfiguredAdmin(seedStorage, env);
  await lockDefaultAdminCredentials(seedStorage);
}
