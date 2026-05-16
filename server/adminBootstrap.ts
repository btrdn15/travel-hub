import type { IStorage } from "./storage";
import { comparePasswords, generatePassword, hashPassword } from "./password";

type BootstrapAdmin = {
  username: string;
  password: string;
};

const DEFAULT_ADMIN_PASSWORD = "admin123";
const DEV_SUPER_ADMIN: BootstrapAdmin = {
  username: "admin1",
  password: DEFAULT_ADMIN_PASSWORD,
};
const DEV_ADMINS: BootstrapAdmin[] = ["admin2", "admin3", "admin4", "admin5"].map(
  (username) => ({ username, password: DEFAULT_ADMIN_PASSWORD }),
);
const DEFAULT_ADMIN_USERNAMES = [
  DEV_SUPER_ADMIN.username,
  ...DEV_ADMINS.map((admin) => admin.username),
];

function isDevelopment(env: NodeJS.ProcessEnv): boolean {
  return env.NODE_ENV === "development";
}

export function getBootstrapSuperAdmin(
  env: NodeJS.ProcessEnv = process.env,
): BootstrapAdmin | null {
  const username = env.ADMIN_USERNAME?.trim();
  const password = env.ADMIN_PASSWORD;

  if (username || password) {
    if (!username || !password) {
      throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be set together");
    }

    if (!isDevelopment(env) && password === DEFAULT_ADMIN_PASSWORD) {
      throw new Error("ADMIN_PASSWORD must not use the default development password");
    }

    return { username, password };
  }

  if (isDevelopment(env)) {
    return DEV_SUPER_ADMIN;
  }

  return null;
}

export async function ensureBootstrapSuperAdmin(
  storage: Pick<IStorage, "createUser" | "getUserByUsername" | "updateUserPassword">,
  env: NodeJS.ProcessEnv = process.env,
): Promise<void> {
  const bootstrapSuperAdmin = getBootstrapSuperAdmin(env);

  if (!bootstrapSuperAdmin) {
    await rotateKnownDefaultPasswords(storage);
    console.warn(
      "Skipping super admin bootstrap because ADMIN_USERNAME and ADMIN_PASSWORD are not set.",
    );
    return;
  }

  const existingAdmin = await storage.getUserByUsername(bootstrapSuperAdmin.username);
  if (!existingAdmin) {
    await storage.createUser({
      username: bootstrapSuperAdmin.username,
      password: await hashPassword(bootstrapSuperAdmin.password),
      role: "super_admin",
    });
  } else if (
    !isDevelopment(env) &&
    (await comparePasswords(DEFAULT_ADMIN_PASSWORD, existingAdmin.password))
  ) {
    await storage.updateUserPassword(
      existingAdmin.id,
      await hashPassword(bootstrapSuperAdmin.password),
    );
  }

  await rotateKnownDefaultPasswords(storage, [bootstrapSuperAdmin.username]);
}

export async function seedDevelopmentAdmins(
  storage: Pick<IStorage, "createUser" | "getUserByUsername">,
  env: NodeJS.ProcessEnv = process.env,
): Promise<void> {
  if (!isDevelopment(env)) {
    return;
  }

  for (const account of DEV_ADMINS) {
    const existing = await storage.getUserByUsername(account.username);
    if (!existing) {
      await storage.createUser({
        username: account.username,
        password: await hashPassword(account.password),
        role: "admin",
      });
    }
  }
}

async function rotateKnownDefaultPasswords(
  storage: Pick<IStorage, "getUserByUsername" | "updateUserPassword">,
  skipUsernames: string[] = [],
): Promise<void> {
  const skip = new Set(skipUsernames);

  for (const username of DEFAULT_ADMIN_USERNAMES) {
    if (skip.has(username)) {
      continue;
    }

    const user = await storage.getUserByUsername(username);
    if (!user || !(await comparePasswords(DEFAULT_ADMIN_PASSWORD, user.password))) {
      continue;
    }

    await storage.updateUserPassword(user.id, await hashPassword(generatePassword()));
    console.warn(
      `Rotated default password for ${username}; set an explicit admin password before using this account.`,
    );
  }
}
