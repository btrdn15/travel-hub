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

type DatabaseBookingStorage = Pick<IStorage, "createBooking">;

function isMissingTableError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "42P01"
  );
}

/** Development fallback for local setups where the bookings table has not been pushed yet. */
export class ResilientStorage implements IStorage {
  private memory = new MemoryStorage();
  private db: DatabaseBookingStorage | null = null;
  private allowMemoryFallback: boolean;

  constructor(db: DatabaseBookingStorage | null, allowMemoryFallback: boolean) {
    this.db = db;
    this.allowMemoryFallback = allowMemoryFallback;
  }

  async createBooking(data: typeof bookings.$inferInsert): Promise<Booking> {
    if (!this.db || process.env.BOOKING_STORAGE === "memory") {
      if (!this.allowMemoryFallback) {
        throw new Error("Durable booking storage is required in production.");
      }
      return this.memory.createBooking(data);
    }

    try {
      return await this.db.createBooking(data);
    } catch (error) {
      if (isMissingTableError(error)) {
        if (!this.allowMemoryFallback) {
          throw error;
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

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export function createStorage(): IStorage {
  const production = isProduction();
  const forceMemory = process.env.BOOKING_STORAGE === "memory";

  if (production) {
    if (forceMemory) {
      throw new Error("BOOKING_STORAGE=memory is not allowed in production.");
    }
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is required for production booking storage.");
    }
  }

  if (forceMemory || !process.env.DATABASE_URL) {
    if (!process.env.DATABASE_URL) {
      console.warn("[storage] DATABASE_URL not set — using in-memory bookings.");
    }
    return new MemoryStorage();
  }

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  return new ResilientStorage(new DatabaseStorage(pool), !production);
}

export const storage = createStorage();
