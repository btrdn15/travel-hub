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

/** DB алдаа гарвал memory руу fallback — dev-д bookings хүснэгт байхгүй үед */
export class ResilientStorage implements IStorage {
  private memory = new MemoryStorage();
  private db: IStorage | null = null;
  private allowMissingTableFallback: boolean;

  constructor(db: IStorage | null, allowMissingTableFallback: boolean) {
    this.db = db;
    this.allowMissingTableFallback = allowMissingTableFallback;
  }

  async createBooking(data: typeof bookings.$inferInsert): Promise<Booking> {
    if (!this.db) {
      return this.memory.createBooking(data);
    }

    try {
      return await this.db.createBooking(data);
    } catch (error) {
      if (isMissingTableError(error) && this.allowMissingTableFallback) {
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
  if (process.env.BOOKING_STORAGE === "memory" || !process.env.DATABASE_URL) {
    if (isProduction()) {
      throw new Error(
        process.env.BOOKING_STORAGE === "memory"
          ? "[storage] BOOKING_STORAGE=memory is not allowed in production."
          : "[storage] DATABASE_URL must be set in production.",
      );
    }

    if (!process.env.DATABASE_URL) {
      console.warn("[storage] DATABASE_URL not set — using in-memory bookings.");
    }
    return new MemoryStorage();
  }

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  return new ResilientStorage(new DatabaseStorage(pool), !isProduction());
}

export const storage = createStorage();
