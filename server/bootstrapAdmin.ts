import type { IStorage } from "./storage";
import { hashPassword } from "./auth";

export const MIN_BOOTSTRAP_PASSWORD_LENGTH = 12;

export type BootstrapAdminConfig = {
  username: string;
  password: string;
};

type BootstrapAdminEnv = {
  BOOTSTRAP_ADMIN_USERNAME?: string;
  BOOTSTRAP_ADMIN_PASSWORD?: string;
};

export function getBootstrapAdminConfig(env: BootstrapAdminEnv): BootstrapAdminConfig | null {
  const username = env.BOOTSTRAP_ADMIN_USERNAME?.trim();
  const password = env.BOOTSTRAP_ADMIN_PASSWORD;

  if (!username && !password) {
    return null;
  }

  if (!username || !password) {
    throw new Error(
      "Both BOOTSTRAP_ADMIN_USERNAME and BOOTSTRAP_ADMIN_PASSWORD must be set to create an initial admin.",
    );
  }

  if (password.length < MIN_BOOTSTRAP_PASSWORD_LENGTH) {
    throw new Error(
      `BOOTSTRAP_ADMIN_PASSWORD must be at least ${MIN_BOOTSTRAP_PASSWORD_LENGTH} characters long.`,
    );
  }

  return { username, password };
}

export async function ensureBootstrapSuperAdmin({
  storage,
  env = process.env,
}: {
  storage: IStorage;
  env?: BootstrapAdminEnv;
}) {
  const config = getBootstrapAdminConfig(env);
  if (!config) {
    return null;
  }

  const existing = await storage.getUserByUsername(config.username);
  if (existing) {
    return null;
  }

  return storage.createUser({
    username: config.username,
    password: await hashPassword(config.password),
    role: "super_admin",
  });
}
