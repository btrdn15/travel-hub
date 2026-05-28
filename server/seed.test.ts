import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type {
  AdminSelection,
  InsertAdminSelection,
  InsertRoutine,
  InsertUser,
  Routine,
  User,
} from "@shared/schema";
import { seedDatabase } from "./seed";
import type { IStorage } from "./storage";

const scryptAsync = promisify(scrypt);

class FakeStorage implements IStorage {
  users = new Map<string, User>();

  constructor(initialUsers: User[] = []) {
    for (const user of initialUsers) {
      this.users.set(user.username, user);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.get(username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const created = { ...user, id: randomBytes(8).toString("hex") };
    this.users.set(created.username, created);
    return created;
  }

  async updateUserPassword(id: string, password: string): Promise<void> {
    for (const [username, user] of this.users.entries()) {
      if (user.id === id) {
        this.users.set(username, { ...user, password });
        return;
      }
    }
  }

  async getAllRoutines(): Promise<Routine[]> {
    throw new Error("Not implemented");
  }

  async getRoutine(_id: string): Promise<Routine | undefined> {
    throw new Error("Not implemented");
  }

  async createRoutine(_routine: InsertRoutine): Promise<Routine> {
    throw new Error("Not implemented");
  }

  async updateRoutine(_id: string, _routine: Partial<InsertRoutine>): Promise<Routine | undefined> {
    throw new Error("Not implemented");
  }

  async deleteRoutine(_id: string): Promise<boolean> {
    throw new Error("Not implemented");
  }

  async getAdminSelections(_adminId: string): Promise<AdminSelection[]> {
    throw new Error("Not implemented");
  }

  async addAdminSelection(_selection: InsertAdminSelection): Promise<AdminSelection> {
    throw new Error("Not implemented");
  }

  async removeAdminSelection(_adminId: string, _routineId: string): Promise<boolean> {
    throw new Error("Not implemented");
  }
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function passwordMatches(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const hashedPassword = Buffer.from(hashed, "hex");
  const suppliedPassword = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedPassword, suppliedPassword);
}

function clearBootstrapEnv() {
  delete process.env.BOOTSTRAP_ADMIN_USERNAME;
  delete process.env.BOOTSTRAP_ADMIN_PASSWORD;
}

afterEach(() => {
  clearBootstrapEnv();
});

test("seedDatabase does not create predictable default admin accounts", async () => {
  clearBootstrapEnv();
  const storage = new FakeStorage();

  await seedDatabase(storage);

  assert.equal(storage.users.size, 0);
});

test("seedDatabase locks legacy seeded admin accounts that still use the default password", async () => {
  clearBootstrapEnv();
  const customPasswordHash = await hashPassword("already-changed-password");
  const storage = new FakeStorage([
    {
      id: "1",
      username: "admin1",
      password: await hashPassword("admin123"),
      role: "super_admin",
    },
    {
      id: "2",
      username: "admin2",
      password: await hashPassword("admin123"),
      role: "admin",
    },
    {
      id: "3",
      username: "admin3",
      password: customPasswordHash,
      role: "admin",
    },
  ]);

  await seedDatabase(storage);

  assert.equal(await passwordMatches("admin123", storage.users.get("admin1")!.password), false);
  assert.equal(await passwordMatches("admin123", storage.users.get("admin2")!.password), false);
  assert.equal(storage.users.get("admin3")!.password, customPasswordHash);
});

test("seedDatabase creates only explicitly configured bootstrap admin credentials", async () => {
  process.env.BOOTSTRAP_ADMIN_USERNAME = "owner";
  process.env.BOOTSTRAP_ADMIN_PASSWORD = "secure-password-123";
  const storage = new FakeStorage();

  await seedDatabase(storage);

  const user = storage.users.get("owner");
  assert.ok(user);
  assert.equal(user.role, "super_admin");
  assert.notEqual(user.password, "secure-password-123");
  assert.equal(await passwordMatches("secure-password-123", user.password), true);
});

test("seedDatabase rejects incomplete bootstrap admin configuration", async () => {
  process.env.BOOTSTRAP_ADMIN_USERNAME = "owner";
  delete process.env.BOOTSTRAP_ADMIN_PASSWORD;

  await assert.rejects(
    seedDatabase(new FakeStorage()),
    /Both BOOTSTRAP_ADMIN_USERNAME and BOOTSTRAP_ADMIN_PASSWORD/,
  );
});
