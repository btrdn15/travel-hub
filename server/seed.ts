import { storage } from "./storage";
import { randomBytes } from "crypto";
import { comparePasswords, hashPassword } from "./password";

type AdminAccount = {
  id: string;
  username: string;
  password: string;
  role: string;
};

type AdminStore = {
  getUserByUsername(username: string): Promise<AdminAccount | undefined>;
  createUser(user: {
    username: string;
    password: string;
    role: string;
  }): Promise<AdminAccount>;
  updateUserPassword(id: string, password: string): Promise<void>;
};

type BootstrapAdmin = {
  username: string;
  password: string;
};

const DEFAULT_ADMIN_PASSWORD = "admin123";
const DEFAULT_ADMIN_USERNAMES = ["admin1", "admin2", "admin3", "admin4", "admin5"];

function getBootstrapAdmin(env: NodeJS.ProcessEnv): BootstrapAdmin | null {
  const username = env.BOOTSTRAP_ADMIN_USERNAME?.trim();
  const password = env.BOOTSTRAP_ADMIN_PASSWORD;

  if (!username && !password) {
    return null;
  }

  if (!username || !password) {
    throw new Error(
      "Both BOOTSTRAP_ADMIN_USERNAME and BOOTSTRAP_ADMIN_PASSWORD must be set to bootstrap an admin account.",
    );
  }

  if (password === DEFAULT_ADMIN_PASSWORD || password.length < 12) {
    throw new Error(
      "BOOTSTRAP_ADMIN_PASSWORD must be at least 12 characters and cannot be the previous default password.",
    );
  }

  return { username, password };
}

export async function secureAdminAccounts(
  store: AdminStore = storage,
  env: NodeJS.ProcessEnv = process.env,
) {
  const bootstrapAdmin = getBootstrapAdmin(env);

  if (bootstrapAdmin) {
    const existing = await store.getUserByUsername(bootstrapAdmin.username);
    if (!existing) {
      await store.createUser({
        username: bootstrapAdmin.username,
        password: await hashPassword(bootstrapAdmin.password),
        role: "super_admin",
      });
    } else if (await comparePasswords(DEFAULT_ADMIN_PASSWORD, existing.password)) {
      await store.updateUserPassword(
        existing.id,
        await hashPassword(bootstrapAdmin.password),
      );
      console.warn(
        `[seed] Replaced default password for bootstrap admin "${bootstrapAdmin.username}".`,
      );
    } else if (existing.role !== "super_admin") {
      console.warn(
        `[seed] BOOTSTRAP_ADMIN_USERNAME "${bootstrapAdmin.username}" already exists but is not a super_admin.`,
      );
    }
  }

  for (const username of DEFAULT_ADMIN_USERNAMES) {
    if (username === bootstrapAdmin?.username) {
      continue;
    }

    const existing = await store.getUserByUsername(username);
    if (!existing) {
      continue;
    }

    if (await comparePasswords(DEFAULT_ADMIN_PASSWORD, existing.password)) {
      const lockedPassword = randomBytes(32).toString("base64url");
      await store.updateUserPassword(existing.id, await hashPassword(lockedPassword));
      console.warn(
        `[seed] Disabled default password for "${username}". Reset it through a trusted admin workflow if the account is still needed.`,
      );
    }
  }
}

export async function seedDatabase() {
  await secureAdminAccounts();
}
