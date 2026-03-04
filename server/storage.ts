import { type User, type InsertUser, type Routine, type InsertRoutine, type AdminSelection, type InsertAdminSelection, users, routines, adminSelections } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(id: string, password: string): Promise<void>;
  getAllRoutines(): Promise<Routine[]>;
  getRoutine(id: string): Promise<Routine | undefined>;
  createRoutine(routine: InsertRoutine): Promise<Routine>;
  updateRoutine(id: string, routine: Partial<InsertRoutine>): Promise<Routine | undefined>;
  deleteRoutine(id: string): Promise<boolean>;
  getAdminSelections(adminId: string): Promise<AdminSelection[]>;
  addAdminSelection(selection: InsertAdminSelection): Promise<AdminSelection>;
  removeAdminSelection(adminId: string, routineId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserPassword(id: string, password: string): Promise<void> {
    await db.update(users).set({ password }).where(eq(users.id, id));
  }

  async getAllRoutines(): Promise<Routine[]> {
    return db.select().from(routines);
  }

  async getRoutine(id: string): Promise<Routine | undefined> {
    const [routine] = await db.select().from(routines).where(eq(routines.id, id));
    return routine;
  }

  async createRoutine(routine: InsertRoutine): Promise<Routine> {
    const [created] = await db.insert(routines).values(routine).returning();
    return created;
  }

  async updateRoutine(id: string, updates: Partial<InsertRoutine>): Promise<Routine | undefined> {
    const [updated] = await db.update(routines).set(updates).where(eq(routines.id, id)).returning();
    return updated;
  }

  async deleteRoutine(id: string): Promise<boolean> {
    const result = await db.delete(routines).where(eq(routines.id, id)).returning();
    return result.length > 0;
  }

  async getAdminSelections(adminId: string): Promise<AdminSelection[]> {
    return db.select().from(adminSelections).where(eq(adminSelections.adminId, adminId));
  }

  async addAdminSelection(selection: InsertAdminSelection): Promise<AdminSelection> {
    const [created] = await db.insert(adminSelections).values(selection).returning();
    return created;
  }

  async removeAdminSelection(adminId: string, routineId: string): Promise<boolean> {
    const result = await db.delete(adminSelections)
      .where(and(eq(adminSelections.adminId, adminId), eq(adminSelections.routineId, routineId)))
      .returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
