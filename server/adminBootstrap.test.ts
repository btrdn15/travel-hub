import assert from "node:assert/strict";
import test from "node:test";
import {
  ensureBootstrapSuperAdmin,
  getBootstrapSuperAdmin,
  seedDevelopmentAdmins,
} from "./adminBootstrap";
import { comparePasswords, hashPassword } from "./password";

type StoredUser = {
  id: string;
  username: string;
  password: string;
  role: string;
};

class MemoryBootstrapStorage {
  users = new Map<string, StoredUser>();
  private nextId = 1;

  async getUserByUsername(username: string) {
    return this.users.get(username);
  }

  async createUser(user: { username: string; password: string; role: string }) {
    const created = {
      id: `user-${this.nextId++}`,
      ...user,
    };
    this.users.set(created.username, created);
    return created;
  }

  async updateUserPassword(id: string, password: string) {
    for (const user of this.users.values()) {
      if (user.id === id) {
        user.password = password;
        return;
      }
    }
    throw new Error(`User not found: ${id}`);
  }
}

function testEnv(values: Record<string, string | undefined>): NodeJS.ProcessEnv {
  return values as NodeJS.ProcessEnv;
}

test("development uses local default super admin", () => {
  assert.deepEqual(
    getBootstrapSuperAdmin(testEnv({ NODE_ENV: "development" })),
    { username: "admin1", password: "admin123" },
  );
});

test("production requires admin username and password together", () => {
  assert.throws(
    () => getBootstrapSuperAdmin(testEnv({ NODE_ENV: "production", ADMIN_USERNAME: "admin" })),
    /ADMIN_USERNAME and ADMIN_PASSWORD/,
  );
});

test("production rejects the development default admin password", () => {
  assert.throws(
    () =>
      getBootstrapSuperAdmin(
        testEnv({
          NODE_ENV: "production",
          ADMIN_USERNAME: "admin1",
          ADMIN_PASSWORD: "admin123",
        }),
      ),
    /default development password/,
  );
});

test("production creates a configured super admin when missing", async () => {
  const storage = new MemoryBootstrapStorage();

  await ensureBootstrapSuperAdmin(
    storage,
    testEnv({
      NODE_ENV: "production",
      ADMIN_USERNAME: "owner",
      ADMIN_PASSWORD: "private-password",
    }),
  );

  const user = await storage.getUserByUsername("owner");
  assert.equal(user?.role, "super_admin");
  assert.equal(await comparePasswords("private-password", user!.password), true);
});

test("production rotates old seeded default passwords when no bootstrap admin is configured", async () => {
  const storage = new MemoryBootstrapStorage();
  await storage.createUser({
    username: "admin1",
    password: await hashPassword("admin123"),
    role: "super_admin",
  });
  await storage.createUser({
    username: "admin2",
    password: await hashPassword("admin123"),
    role: "admin",
  });

  await ensureBootstrapSuperAdmin(storage, testEnv({ NODE_ENV: "production" }));

  assert.equal(
    await comparePasswords("admin123", (await storage.getUserByUsername("admin1"))!.password),
    false,
  );
  assert.equal(
    await comparePasswords("admin123", (await storage.getUserByUsername("admin2"))!.password),
    false,
  );
});

test("development seeding does not reset an existing admin password", async () => {
  const storage = new MemoryBootstrapStorage();
  await storage.createUser({
    username: "admin2",
    password: await hashPassword("changed-password"),
    role: "admin",
  });

  await seedDevelopmentAdmins(storage, testEnv({ NODE_ENV: "development" }));

  assert.equal(
    await comparePasswords("changed-password", (await storage.getUserByUsername("admin2"))!.password),
    true,
  );
  assert.equal(await storage.getUserByUsername("admin5") !== undefined, true);
});
