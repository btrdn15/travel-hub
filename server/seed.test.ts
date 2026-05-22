import test from "node:test";
import assert from "node:assert/strict";
import { seedDatabase } from "./seed";
import type { InsertUser, User } from "@shared/schema";

test("seedDatabase preserves existing admin passwords", async () => {
  const createdUsers: InsertUser[] = [];
  const existingAdmin: User = {
    id: "existing-admin-2",
    username: "admin2",
    password: "custom-password-hash",
    role: "admin",
  };

  const store = {
    async getUserByUsername(username: string) {
      return username === existingAdmin.username ? existingAdmin : undefined;
    },
    async createUser(user: InsertUser) {
      createdUsers.push(user);
      return { id: `created-${user.username}`, ...user };
    },
    async updateUserPassword() {
      assert.fail("seedDatabase must not reset existing admin passwords");
    },
  };

  await seedDatabase(store);

  assert.deepEqual(
    createdUsers.map((user) => user.username),
    ["admin3", "admin4", "admin5"],
  );
  assert.equal(existingAdmin.password, "custom-password-hash");
  for (const user of createdUsers) {
    assert.notEqual(user.password, "admin123");
  }
});
