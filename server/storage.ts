import { type Booking, bookings } from "@shared/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

export interface IStorage {
  createBooking(data: typeof bookings.$inferInsert): Promise<Booking>;
}

export class StorageUnavailableError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "StorageUnavailableError";
  }
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

/** DB алдаа гарвал memory руу fallback — dev-д bookings хүснэгт байхгүй үед */
export class ResilientStorage implements IStorage {
  private memory = new MemoryStorage();
  private db: DatabaseStorage | null = null;
  private allowMemoryFallback: boolean;

  constructor(pool: pg.Pool | null, allowMemoryFallback: boolean) {
    this.allowMemoryFallback = allowMemoryFallback;
    if (pool) this.db = new DatabaseStorage(pool);
  }

  async createBooking(data: typeof bookings.$inferInsert): Promise<Booking> {
    if (!this.db || process.env.BOOKING_STORAGE === "memory") {
      if (!this.allowMemoryFallback) {
        throw new StorageUnavailableError(
          "Persistent booking storage is unavailable in production.",
        );
      }
      return this.memory.createBooking(data);
    }

    try {
      return await this.db.createBooking(data);
    } catch (error) {
      if (isMissingTableError(error)) {
        if (!this.allowMemoryFallback) {
          throw new StorageUnavailableError(
            "The bookings table is missing; run `npm run db:push` before accepting production bookings.",
            { cause: error },
          );
        }
        console.warn(
          "[storage] bookings table missing — saved in memory. Production: run `npm run db:push`",
        );
        return this.memory.createBooking(data);
      }
      throw error;
    }
  }
}

export function createStorage(): IStorage {
  const isProduction = process.env.NODE_ENV === "production";
  const allowMemoryFallback = !isProduction;

  if (process.env.BOOKING_STORAGE === "memory") {
    if (!allowMemoryFallback) {
      throw new StorageUnavailableError(
        "BOOKING_STORAGE=memory is not allowed in production because bookings must be persisted.",
      );
    }
    return new MemoryStorage();
  }

  if (!process.env.DATABASE_URL) {
    if (!allowMemoryFallback) {
      throw new StorageUnavailableError(
        "DATABASE_URL must be set in production to persist bookings.",
      );
    }
    console.warn("[storage] DATABASE_URL not set — using in-memory bookings.");
    return new MemoryStorage();
  }

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  return new ResilientStorage(pool, allowMemoryFallback);
}

export const storage = createStorage();
