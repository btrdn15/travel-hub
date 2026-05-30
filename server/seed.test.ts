import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { InsertUser, User } from "@shared/schema";
import { seedDatabase } from "./seed";
import { storage } from "./storage";

const scryptAsync = promisify(scrypt);
const LEGACY_DEFAULT_PASSWORD = "admin123";
const LEGACY_USERNAMES = ["admin1", "admin2", "admin3", "admin4", "admin5"];

const originalMethods = {
  getUserByUsername: storage.getUserByUsername,
  createUser: storage.createUser,
  updateUserPassword: storage.updateUserPassword,
};

const originalBootstrapUsername = process.env.BOOTSTRAP_ADMIN_USERNAME;
const originalBootstrapPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD;

afterEach(() => {
  storage.getUserByUsername = originalMethods.getUserByUsername;
  storage.createUser = originalMethods.createUser;
  storage.updateUserPassword = originalMethods.updateUserPassword;
  restoreBootstrapEnv();
});

function restoreBootstrapEnv() {
  setOptionalEnv("BOOTSTRAP_ADMIN_USERNAME", originalBootstrapUsername);
  setOptionalEnv("BOOTSTRAP_ADMIN_PASSWORD", originalBootstrapPassword);
}

function setOptionalEnv(name: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
}

function clearBootstrapEnv() {
  delete process.env.BOOTSTRAP_ADMIN_USERNAME;
  delete process.env.BOOTSTRAP_ADMIN_PASSWORD;
}

async function hashPassword(password: string, salt = randomUUID()): Promise<string> {
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePassword(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const suppliedHash = (await scryptAsync(supplied, salt, 64)) as Buffer;
  const storedHash = Buffer.from(hashed, "hex");
  return storedHash.length === suppliedHash.length && timingSafeEqual(storedHash, suppliedHash);
}

function installStorageMock(initialUsers: User[] = []) {
  const users = new Map(initialUsers.map((user) => [user.username, { ...user }]));
  const createdUsers: InsertUser[] = [];
  const passwordUpdates: Array<{ id: string; password: string }> = [];
  const lookups: string[] = [];

  storage.getUserByUsername = async (username: string) => {
    lookups.push(username);
    const user = users.get(username);
    return user ? { ...user } : undefined;
  };

  storage.createUser = async (insertUser: InsertUser) => {
    createdUsers.push({ ...insertUser });
    const user: User = {
      id: randomUUID(),
      username: insertUser.username,
      password: insertUser.password,
      role: insertUser.role ?? "admin",
    };
    users.set(user.username, user);
    return { ...user };
  };

  storage.updateUserPassword = async (id: string, password: string) => {
    passwordUpdates.push({ id, password });
    for (const [username, user] of users) {
      if (user.id === id) {
        users.set(username, { ...user, password });
        return;
      }
    }
  };

  return { createdUsers, passwordUpdates, lookups, users };
}

function user(username: string, password: string, role = "admin"): User {
  return {
    id: `${username}-id`,
    username,
    password,
    role,
  };
}

test("does not create predictable admin accounts without explicit bootstrap credentials", async () => {
  clearBootstrapEnv();
  const mock = installStorageMock();

  await seedDatabase();

  assert.deepEqual(mock.createdUsers, []);
  assert.deepEqual(mock.passwordUpdates, []);
  assert.deepEqual(mock.lookups, LEGACY_USERNAMES);
});

test("locks legacy admin accounts that still use the public default password", async () => {
  clearBootstrapEnv();
  const defaultHash = await hashPassword(LEGACY_DEFAULT_PASSWORD);
  const customHash = await hashPassword("already-rotated");
  const mock = installStorageMock([
    user("admin2", defaultHash),
    user("admin3", customHash),
  ]);

  await seedDatabase();

  assert.equal(mock.createdUsers.length, 0);
  assert.equal(mock.passwordUpdates.length, 1);
  assert.equal(mock.passwordUpdates[0].id, "admin2-id");
  assert.equal(await comparePassword(LEGACY_DEFAULT_PASSWORD, mock.passwordUpdates[0].password), false);
});

test("creates an explicit bootstrap super admin when configured", async () => {
  process.env.BOOTSTRAP_ADMIN_USERNAME = "owner";
  process.env.BOOTSTRAP_ADMIN_PASSWORD = "correct-horse-battery-staple";
  const mock = installStorageMock();

  await seedDatabase();

  assert.equal(mock.createdUsers.length, 1);
  assert.equal(mock.createdUsers[0].username, "owner");
  assert.equal(mock.createdUsers[0].role, "super_admin");
  assert.equal(
    await comparePassword("correct-horse-battery-staple", mock.createdUsers[0].password),
    true,
  );
  assert.equal(await comparePassword(LEGACY_DEFAULT_PASSWORD, mock.createdUsers[0].password), false);
});

test("rotates a bootstrap admin away from the legacy default password", async () => {
  process.env.BOOTSTRAP_ADMIN_USERNAME = "admin1";
  process.env.BOOTSTRAP_ADMIN_PASSWORD = "new-secure-bootstrap-password";
  const mock = installStorageMock([
    user("admin1", await hashPassword(LEGACY_DEFAULT_PASSWORD), "super_admin"),
  ]);

  await seedDatabase();

  assert.equal(mock.createdUsers.length, 0);
  assert.equal(mock.passwordUpdates.length, 1);
  assert.equal(mock.passwordUpdates[0].id, "admin1-id");
  assert.equal(
    await comparePassword("new-secure-bootstrap-password", mock.passwordUpdates[0].password),
    true,
  );
});

test("rejects explicit bootstrap credentials that reuse the legacy default password", async () => {
  process.env.BOOTSTRAP_ADMIN_USERNAME = "owner";
  process.env.BOOTSTRAP_ADMIN_PASSWORD = LEGACY_DEFAULT_PASSWORD;
  const mock = installStorageMock();

  await assert.rejects(
    seedDatabase(),
    /BOOTSTRAP_ADMIN_PASSWORD must not use the legacy default password/,
  );
  assert.deepEqual(mock.createdUsers, []);
  assert.deepEqual(mock.passwordUpdates, []);
});
