import assert from "node:assert/strict";
import { secureAdminAccounts } from "./seed";
import { comparePasswords, hashPassword } from "./password";

type TestUser = {
  id: string;
  username: string;
  password: string;
  role: string;
};

class MemoryAdminStore {
  private users = new Map<string, TestUser>();
  private nextId = 1;

  constructor(users: TestUser[] = []) {
    for (const user of users) {
      this.users.set(user.username, { ...user });
    }
  }

  async getUserByUsername(username: string): Promise<TestUser | undefined> {
    const user = this.users.get(username);
    return user ? { ...user } : undefined;
  }

  async createUser(user: Omit<TestUser, "id">): Promise<TestUser> {
    const created = { ...user, id: `created-${this.nextId++}` };
    this.users.set(created.username, created);
    return { ...created };
  }

  async updateUserPassword(id: string, password: string): Promise<void> {
    for (const [username, user] of this.users) {
      if (user.id === id) {
        this.users.set(username, { ...user, password });
        return;
      }
    }
  }
}

async function getRequiredUser(store: MemoryAdminStore, username: string) {
  const user = await store.getUserByUsername(username);
  assert.ok(user, `Expected ${username} to exist`);
  return user;
}

async function testDefaultPasswordsAreDisabled() {
  const defaultHash = await hashPassword("admin123");
  const customHash = await hashPassword("already-rotated-password");
  const store = new MemoryAdminStore([
    { id: "1", username: "admin2", password: defaultHash, role: "admin" },
    { id: "2", username: "admin3", password: customHash, role: "admin" },
  ]);

  await secureAdminAccounts(store, {});

  const admin2 = await getRequiredUser(store, "admin2");
  const admin3 = await getRequiredUser(store, "admin3");
  assert.equal(await comparePasswords("admin123", admin2.password), false);
  assert.equal(await comparePasswords("already-rotated-password", admin3.password), true);
}

async function testBootstrapPasswordReplacesExistingDefault() {
  const store = new MemoryAdminStore([
    {
      id: "1",
      username: "admin1",
      password: await hashPassword("admin123"),
      role: "super_admin",
    },
  ]);

  await secureAdminAccounts(store, {
    BOOTSTRAP_ADMIN_USERNAME: "admin1",
    BOOTSTRAP_ADMIN_PASSWORD: "new-secure-admin-password",
  });

  const admin1 = await getRequiredUser(store, "admin1");
  assert.equal(await comparePasswords("admin123", admin1.password), false);
  assert.equal(await comparePasswords("new-secure-admin-password", admin1.password), true);
}

async function testBootstrapCreatesMissingSuperAdmin() {
  const store = new MemoryAdminStore();

  await secureAdminAccounts(store, {
    BOOTSTRAP_ADMIN_USERNAME: "owner",
    BOOTSTRAP_ADMIN_PASSWORD: "owner-secure-password",
  });

  const owner = await getRequiredUser(store, "owner");
  assert.equal(owner.role, "super_admin");
  assert.equal(await comparePasswords("owner-secure-password", owner.password), true);
}

async function testPartialBootstrapConfigurationFails() {
  const store = new MemoryAdminStore();

  await assert.rejects(
    () =>
      secureAdminAccounts(store, {
        BOOTSTRAP_ADMIN_USERNAME: "owner",
      }),
    /Both BOOTSTRAP_ADMIN_USERNAME and BOOTSTRAP_ADMIN_PASSWORD/,
  );
}

await testDefaultPasswordsAreDisabled();
await testBootstrapPasswordReplacesExistingDefault();
await testBootstrapCreatesMissingSuperAdmin();
await testPartialBootstrapConfigurationFails();

console.log("seed security tests passed");
