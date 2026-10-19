import { type Booking, bookings } from "@shared/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

export interface IStorage {
  createBooking(data: typeof bookings.$inferInsert): Promise<Booking>;
}

export class MemoryStorage implements IStorage {
  private items: Booking[] = [];

  async createBooking(data: typeof bookings.$inferInsert): Promise<Booking> {
    const created: Booking = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      kakaoId: data.kakaoId ?? null,
      specialRequests: data.specialRequests ?? null,
      pricePerPersonKrw: data.pricePerPersonKrw ?? null,
      totalAmountKrw: data.totalAmountKrw ?? null,
      depositAmountKrw: data.depositAmountKrw ?? null,
      status: data.status ?? "deposit_pending",
      lang: data.lang ?? "ko",
      airportPickup: data.airportPickup ?? false,
    };
    this.items.push(created);
    return created;
  }
}

export class DatabaseStorage implements IStorage {
  private db;

  constructor(pool: pg.Pool) {
    this.db = drizzle(pool);
  }

  async createBooking(data: typeof bookings.$inferInsert): Promise<Booking> {
    const [created] = await this.db.insert(bookings).values(data).returning();
    return created;
  }
}

function isMissingTableError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "42P01"
  );
}

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

function hasDatabaseUrl(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

/** In development, fall back to memory when the local bookings table is not set up. */
class ResilientStorage implements IStorage {
  private memory = new MemoryStorage();
  private db: DatabaseStorage | null = null;

  constructor(pool: pg.Pool | null) {
    if (pool) this.db = new DatabaseStorage(pool);
  }

  async createBooking(data: typeof bookings.$inferInsert): Promise<Booking> {
    if (!this.db || process.env.BOOKING_STORAGE === "memory") {
      if (isProduction()) {
        throw new Error("[storage] Durable booking storage is required in production.");
      }
      return this.memory.createBooking(data);
    }

    try {
      return await this.db.createBooking(data);
    } catch (error) {
      if (isMissingTableError(error)) {
        if (isProduction()) {
          throw new Error(
            "[storage] bookings table missing; run `npm run db:push` before accepting production bookings.",
            { cause: error },
          );
        }
        console.warn(
          "[storage] bookings table missing — saved in memory. Run `npm run db:push` to persist local bookings.",
        );
        return this.memory.createBooking(data);
      }
      throw error;
    }
  }
}

export function createStorage(): IStorage {
  if (isProduction()) {
    if (process.env.BOOKING_STORAGE === "memory") {
      throw new Error("[storage] BOOKING_STORAGE=memory is not allowed in production.");
    }
    if (!hasDatabaseUrl()) {
      throw new Error("[storage] DATABASE_URL is required in production.");
    }
  }

  if (process.env.BOOKING_STORAGE === "memory" || !hasDatabaseUrl()) {
    if (!hasDatabaseUrl()) {
      console.warn("[storage] DATABASE_URL not set — using in-memory bookings.");
    }
    return new MemoryStorage();
  }

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  return new ResilientStorage(pool);
}

export const storage = createStorage();
