import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { comparePasswords, hashPassword } from "./password";
import { secureAdminAccounts } from "./seed";

type TestUser = {
  id: string;
  username: string;
  password: string;
  role: string;
};

class TestAdminStore {
  users = new Map<string, TestUser>();
  created: TestUser[] = [];
  updated: Array<{ id: string; password: string }> = [];

  async getUserByUsername(username: string) {
    return this.users.get(username);
  }

  async createUser(user: Omit<TestUser, "id">) {
    const created = { id: user.username, ...user };
    this.users.set(user.username, created);
    this.created.push(created);
    return created;
  }

  async updateUserPassword(id: string, password: string) {
    const user = [...this.users.values()].find((item) => item.id === id);
    assert.ok(user, `expected user with id ${id} to exist`);
    user.password = password;
    this.updated.push({ id, password });
  }
}

describe("secureAdminAccounts", () => {
  it("locks existing public default admin passwords without creating missing default admins", async () => {
    const store = new TestAdminStore();
    store.users.set("admin1", {
      id: "admin1",
      username: "admin1",
      password: await hashPassword("admin123"),
      role: "super_admin",
    });
    store.users.set("admin2", {
      id: "admin2",
      username: "admin2",
      password: await hashPassword("admin123"),
      role: "admin",
    });

    await secureAdminAccounts(store, {});

    assert.equal(store.created.length, 0);
    assert.deepEqual(
      store.updated.map((item) => item.id).sort(),
      ["admin1", "admin2"],
    );
    assert.equal(
      await comparePasswords("admin123", store.users.get("admin1")!.password),
      false,
    );
    assert.equal(
      await comparePasswords("admin123", store.users.get("admin2")!.password),
      false,
    );
    assert.equal(store.users.has("admin3"), false);
  });

  it("does not overwrite existing non-default passwords", async () => {
    const store = new TestAdminStore();
    const password = await hashPassword("already-private-password");
    store.users.set("admin1", {
      id: "admin1",
      username: "admin1",
      password,
      role: "super_admin",
    });

    await secureAdminAccounts(store, {});

    assert.equal(store.updated.length, 0);
    assert.equal(store.users.get("admin1")!.password, password);
  });

  it("creates an explicit bootstrap super admin with a private password", async () => {
    const store = new TestAdminStore();

    await secureAdminAccounts(store, {
      BOOTSTRAP_ADMIN_USERNAME: "owner",
      BOOTSTRAP_ADMIN_PASSWORD: "private-admin-password",
    });

    const owner = store.users.get("owner");
    assert.ok(owner);
    assert.equal(owner.role, "super_admin");
    assert.equal(await comparePasswords("private-admin-password", owner.password), true);
    assert.equal(await comparePasswords("admin123", owner.password), false);
  });

  it("rejects incomplete or unsafe bootstrap credentials", async () => {
    await assert.rejects(
      () =>
        secureAdminAccounts(new TestAdminStore(), {
          BOOTSTRAP_ADMIN_USERNAME: "owner",
        }),
      /Both BOOTSTRAP_ADMIN_USERNAME and BOOTSTRAP_ADMIN_PASSWORD/,
    );

    await assert.rejects(
      () =>
        secureAdminAccounts(new TestAdminStore(), {
          BOOTSTRAP_ADMIN_USERNAME: "owner",
          BOOTSTRAP_ADMIN_PASSWORD: "admin123",
        }),
      /cannot be the previous default password/,
    );
  });
});
