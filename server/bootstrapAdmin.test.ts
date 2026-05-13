import assert from "node:assert/strict";
import test from "node:test";
import { comparePasswords } from "./auth";
import {
  ensureBootstrapSuperAdmin,
  getBootstrapAdminConfig,
  MIN_BOOTSTRAP_PASSWORD_LENGTH,
} from "./bootstrapAdmin";
import type { IStorage } from "./storage";

function createFakeStorage(existingUser?: unknown) {
  const calls: Array<{ type: string; value?: unknown }> = [];
  const storage = {
    getUserByUsername: async (username: string) => {
      calls.push({ type: "getUserByUsername", value: username });
      return existingUser;
    },
    createUser: async (user: unknown) => {
      calls.push({ type: "createUser", value: user });
      return { id: "created-user", ...(user as Record<string, unknown>) };
    },
  } as IStorage;

  return { storage, calls };
}

test("bootstrap admin config is absent unless explicit credentials are provided", () => {
  assert.equal(getBootstrapAdminConfig({}), null);
});

test("bootstrap admin config rejects partial credentials", () => {
  assert.throws(
    () => getBootstrapAdminConfig({ BOOTSTRAP_ADMIN_USERNAME: "admin" }),
    /Both BOOTSTRAP_ADMIN_USERNAME and BOOTSTRAP_ADMIN_PASSWORD/,
  );
  assert.throws(
    () => getBootstrapAdminConfig({ BOOTSTRAP_ADMIN_PASSWORD: "long-enough-secret" }),
    /Both BOOTSTRAP_ADMIN_USERNAME and BOOTSTRAP_ADMIN_PASSWORD/,
  );
});

test("bootstrap admin config rejects weak default-style passwords", () => {
  assert.throws(
    () =>
      getBootstrapAdminConfig({
        BOOTSTRAP_ADMIN_USERNAME: "admin1",
        BOOTSTRAP_ADMIN_PASSWORD: "admin123",
      }),
    new RegExp(`at least ${MIN_BOOTSTRAP_PASSWORD_LENGTH}`),
  );
});

test("ensureBootstrapSuperAdmin does not create or reset users without bootstrap credentials", async () => {
  const { storage, calls } = createFakeStorage();

  const result = await ensureBootstrapSuperAdmin({ storage, env: {} });

  assert.equal(result, null);
  assert.deepEqual(calls, []);
});

test("ensureBootstrapSuperAdmin does not reset an existing user's password", async () => {
  const existingUser = {
    id: "existing-user",
    username: "admin",
    password: "existing-hash",
    role: "super_admin",
  };
  const { storage, calls } = createFakeStorage(existingUser);

  const result = await ensureBootstrapSuperAdmin({
    storage,
    env: {
      BOOTSTRAP_ADMIN_USERNAME: "admin",
      BOOTSTRAP_ADMIN_PASSWORD: "safe-bootstrap-password",
    },
  });

  assert.equal(result, null);
  assert.deepEqual(calls, [{ type: "getUserByUsername", value: "admin" }]);
});

test("ensureBootstrapSuperAdmin creates only the requested super admin with a hashed password", async () => {
  const { storage, calls } = createFakeStorage();

  await ensureBootstrapSuperAdmin({
    storage,
    env: {
      BOOTSTRAP_ADMIN_USERNAME: "owner",
      BOOTSTRAP_ADMIN_PASSWORD: "safe-bootstrap-password",
    },
  });

  assert.equal(calls.length, 2);
  assert.deepEqual(calls[0], { type: "getUserByUsername", value: "owner" });
  assert.equal(calls[1].type, "createUser");

  const created = calls[1].value as { username: string; password: string; role: string };
  assert.equal(created.username, "owner");
  assert.equal(created.role, "super_admin");
  assert.notEqual(created.password, "safe-bootstrap-password");
  assert.equal(await comparePasswords("safe-bootstrap-password", created.password), true);
});
