import { type Booking, bookings } from "@shared/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

export interface IStorage {
  createBooking(data: typeof bookings.$inferInsert): Promise<Booking>;
}

export class StorageUnavailableError extends Error {
  constructor(message: string) {
    super(message);
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

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/** DB алдаа гарвал memory руу fallback — зөвхөн dev-д bookings хүснэгт байхгүй үед */
class ResilientStorage implements IStorage {
  private memory = new MemoryStorage();
  private db: DatabaseStorage;

  constructor(pool: pg.Pool) {
    this.db = new DatabaseStorage(pool);
  }

  async createBooking(data: typeof bookings.$inferInsert): Promise<Booking> {
    try {
      return await this.db.createBooking(data);
    } catch (error) {
      if (isMissingTableError(error)) {
        if (isProduction()) {
          throw new StorageUnavailableError(
            "bookings table is missing in production; run `npm run db:push` before accepting bookings",
          );
        }

        console.warn(
          "[storage] bookings table missing — saved in memory for development. Run `npm run db:push` to persist bookings.",
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
      throw new StorageUnavailableError(
        "BOOKING_STORAGE=memory is not allowed in production because bookings would not be persisted",
      );
    }

    if (!process.env.DATABASE_URL) {
      throw new StorageUnavailableError(
        "DATABASE_URL must be set in production to persist bookings",
      );
    }
  }

  if (process.env.BOOKING_STORAGE === "memory" || !process.env.DATABASE_URL) {
    if (!process.env.DATABASE_URL) {
      console.warn("[storage] DATABASE_URL not set — using in-memory bookings.");
    }
    return new MemoryStorage();
  }

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  return new ResilientStorage(pool);
}

export const storage = createStorage();
