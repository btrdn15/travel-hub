import test from "node:test";
import assert from "node:assert/strict";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { seedDatabase } from "./seed";

const scryptAsync = promisify(scrypt);

type StoredUser = {
  id: string;
  username: string;
  password: string;
  role: string;
};

type MockStorage = {
  users: Map<string, StoredUser>;
  created: StoredUser[];
  updated: Array<{ id: string; password: string }>;
  getUserByUsername: (username: string) => Promise<StoredUser | undefined>;
  createUser: (user: Omit<StoredUser, "id">) => Promise<StoredUser>;
  updateUserPassword: (id: string, password: string) => Promise<void>;
};

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function passwordMatches(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const buf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return Buffer.from(hashed, "hex").equals(buf);
}

function createMockStorage(initialUsers: StoredUser[] = []): MockStorage {
  const users = new Map(initialUsers.map((user) => [user.username, { ...user }]));
  const storage: MockStorage = {
    users,
    created: [],
    updated: [],
    async getUserByUsername(username) {
      return users.get(username);
    },
    async createUser(user) {
      const created = { ...user, id: `id-${user.username}` };
      users.set(user.username, created);
      storage.created.push(created);
      return created;
    },
    async updateUserPassword(id, password) {
      const user = [...users.values()].find((candidate) => candidate.id === id);
      assert.ok(user, `Expected user with id '${id}' to exist`);
      user.password = password;
      storage.updated.push({ id, password });
    },
  };
  return storage;
}

test("seedDatabase does not create predictable default admin accounts", async () => {
  const storage = createMockStorage();

  await seedDatabase(storage, {});

  assert.equal(storage.created.length, 0);
  assert.equal(storage.updated.length, 0);
  assert.equal(storage.users.size, 0);
});

test("seedDatabase locks legacy admins that still use the old default password", async () => {
  const storage = createMockStorage([
    {
      id: "user-admin2",
      username: "admin2",
      password: await hashPassword("admin123"),
      role: "admin",
    },
  ]);

  await seedDatabase(storage, {});

  assert.equal(storage.created.length, 0);
  assert.equal(storage.updated.length, 1);
  const updated = storage.users.get("admin2");
  assert.ok(updated);
  assert.equal(await passwordMatches("admin123", updated.password), false);
});

test("seedDatabase creates an explicit bootstrap super admin", async () => {
  const storage = createMockStorage();

  await seedDatabase(storage, {
    BOOTSTRAP_ADMIN_USERNAME: "owner",
    BOOTSTRAP_ADMIN_PASSWORD: "strong-private-password",
  });

  assert.equal(storage.created.length, 1);
  const created = storage.created[0];
  assert.equal(created.username, "owner");
  assert.equal(created.role, "super_admin");
  assert.equal(await passwordMatches("strong-private-password", created.password), true);
});

test("seedDatabase updates a bootstrap admin only when it still uses the old default password", async () => {
  const storage = createMockStorage([
    {
      id: "user-admin1",
      username: "admin1",
      password: await hashPassword("admin123"),
      role: "super_admin",
    },
  ]);

  await seedDatabase(storage, {
    BOOTSTRAP_ADMIN_USERNAME: "admin1",
    BOOTSTRAP_ADMIN_PASSWORD: "replacement-private-password",
  });

  assert.equal(storage.created.length, 0);
  assert.equal(storage.updated.length, 1);
  const updated = storage.users.get("admin1");
  assert.ok(updated);
  assert.equal(await passwordMatches("replacement-private-password", updated.password), true);
});

test("seedDatabase rejects unsafe bootstrap configuration", async () => {
  await assert.rejects(
    () =>
      seedDatabase(createMockStorage(), {
        BOOTSTRAP_ADMIN_USERNAME: "owner",
      }),
    /Both BOOTSTRAP_ADMIN_USERNAME and BOOTSTRAP_ADMIN_PASSWORD/,
  );

  await assert.rejects(
    () =>
      seedDatabase(createMockStorage(), {
        BOOTSTRAP_ADMIN_USERNAME: "owner",
        BOOTSTRAP_ADMIN_PASSWORD: "admin123",
      }),
    /must not use the old default admin password/,
  );
});
