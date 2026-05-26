import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import type { InsertUser, User } from "@shared/schema";
import type { IStorage } from "./storage";
import { comparePasswords, hashPassword } from "./password";
import { seedDatabase } from "./seed";

type SeedStorage = Pick<IStorage, "getUserByUsername" | "createUser" | "updateUserPassword">;

const originalBootstrapUsername = process.env.BOOTSTRAP_ADMIN_USERNAME;
const originalBootstrapPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD;

afterEach(() => {
  restoreBootstrapEnv();
});

function restoreBootstrapEnv() {
  setOptionalEnv("BOOTSTRAP_ADMIN_USERNAME", originalBootstrapUsername);
  setOptionalEnv("BOOTSTRAP_ADMIN_PASSWORD", originalBootstrapPassword);
}

function setOptionalEnv(key: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[key];
  } else {
    process.env[key] = value;
  }
}

function clearBootstrapEnv() {
  delete process.env.BOOTSTRAP_ADMIN_USERNAME;
  delete process.env.BOOTSTRAP_ADMIN_PASSWORD;
}

function createSeedStorage(initialUsers: User[] = []) {
  const usersByUsername = new Map(initialUsers.map((user) => [user.username, user]));
  const createdUsers: InsertUser[] = [];
  const passwordUpdates: Array<{ id: string; password: string }> = [];

  const seedStorage: SeedStorage = {
    async getUserByUsername(username) {
      return usersByUsername.get(username);
    },
    async createUser(user) {
      createdUsers.push(user);
      const created: User = {
        id: `created-${createdUsers.length}`,
        ...user,
      };
      usersByUsername.set(created.username, created);
      return created;
    },
    async updateUserPassword(id, password) {
      passwordUpdates.push({ id, password });
      for (const user of usersByUsername.values()) {
        if (user.id === id) {
          user.password = password;
          return;
        }
      }
    },
  };

  return { seedStorage, createdUsers, passwordUpdates };
}

test("seedDatabase does not create known default admin accounts", async () => {
  clearBootstrapEnv();
  const { seedStorage, createdUsers, passwordUpdates } = createSeedStorage();

  await seedDatabase(seedStorage);

  assert.deepEqual(createdUsers, []);
  assert.deepEqual(passwordUpdates, []);
});

test("seedDatabase locks legacy accounts still using the default password", async () => {
  clearBootstrapEnv();
  const defaultPasswordHash = await hashPassword("admin123");
  const customPasswordHash = await hashPassword("changed-password");
  const { seedStorage, passwordUpdates } = createSeedStorage([
    { id: "admin-1", username: "admin1", password: defaultPasswordHash, role: "super_admin" },
    { id: "admin-2", username: "admin2", password: customPasswordHash, role: "admin" },
  ]);

  await seedDatabase(seedStorage);

  assert.equal(passwordUpdates.length, 1);
  assert.equal(passwordUpdates[0].id, "admin-1");
  assert.equal(await comparePasswords("admin123", passwordUpdates[0].password), false);
});

test("seedDatabase creates only an explicitly configured bootstrap admin", async () => {
  process.env.BOOTSTRAP_ADMIN_USERNAME = "owner";
  process.env.BOOTSTRAP_ADMIN_PASSWORD = "strong-bootstrap-password";
  const { seedStorage, createdUsers } = createSeedStorage();

  await seedDatabase(seedStorage);

  assert.equal(createdUsers.length, 1);
  assert.equal(createdUsers[0].username, "owner");
  assert.equal(createdUsers[0].role, "super_admin");
  assert.equal(await comparePasswords("strong-bootstrap-password", createdUsers[0].password), true);
});

test("seedDatabase rejects partial bootstrap configuration", async () => {
  process.env.BOOTSTRAP_ADMIN_USERNAME = "owner";
  delete process.env.BOOTSTRAP_ADMIN_PASSWORD;
  const { seedStorage } = createSeedStorage();

  await assert.rejects(
    seedDatabase(seedStorage),
    /BOOTSTRAP_ADMIN_USERNAME and BOOTSTRAP_ADMIN_PASSWORD must be set together/,
  );
});
