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

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

function isMissingTableError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "42P01"
  );
}

type ResilientStorageOptions = {
  allowMissingTableFallback: boolean;
};

/** DB алдаа гарвал memory руу fallback — зөвхөн local/dev үед. */
export class ResilientStorage implements IStorage {
  private memory = new MemoryStorage();
  private db: DatabaseStorage | null = null;
  private allowMissingTableFallback: boolean;

  constructor(pool: pg.Pool | null, options: ResilientStorageOptions) {
    if (pool) this.db = new DatabaseStorage(pool);
    this.allowMissingTableFallback = options.allowMissingTableFallback;
  }

  async createBooking(data: typeof bookings.$inferInsert): Promise<Booking> {
    if (!this.db || process.env.BOOKING_STORAGE === "memory") {
      return this.memory.createBooking(data);
    }

    try {
      return await this.db.createBooking(data);
    } catch (error) {
      if (isMissingTableError(error)) {
        if (!this.allowMissingTableFallback) {
          console.error(
            "[storage] bookings table is missing; refusing to accept non-durable production booking.",
          );
          throw error;
        }

        console.warn(
          "[storage] bookings table missing — saved in memory. Run `npm run db:push` before production.",
        );
        return this.memory.createBooking(data);
      }
      throw error;
    }
  }
}

export function createStorage(): IStorage {
  const production = isProduction();

  if (production && process.env.BOOKING_STORAGE === "memory") {
    throw new Error(
      "BOOKING_STORAGE=memory is not allowed in production because bookings would not be durable.",
    );
  }

  if (process.env.BOOKING_STORAGE === "memory") {
    return new MemoryStorage();
  }

  if (!process.env.DATABASE_URL) {
    if (production) {
      throw new Error(
        "DATABASE_URL is required in production to persist bookings.",
      );
    }

    console.warn("[storage] DATABASE_URL not set — using in-memory bookings.");
    return new MemoryStorage();
  }

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  return new ResilientStorage(pool, {
    allowMissingTableFallback: !production,
  });
}

export const storage = createStorage();
