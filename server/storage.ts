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

export function isMissingTableError(error: unknown): boolean {
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

function requireDurableBookingStorage(message: string): never {
  throw new Error(
    `${message} Refusing to use in-memory booking storage in production.`,
  );
}

/** DB алдаа гарвал memory руу fallback — зөвхөн dev-д bookings хүснэгт байхгүй үед */
export class ResilientStorage implements IStorage {
  private memory = new MemoryStorage();
  private db: IStorage | null = null;

  constructor(db: IStorage | null) {
    this.db = db;
  }

  async createBooking(data: typeof bookings.$inferInsert): Promise<Booking> {
    if (!this.db || process.env.BOOKING_STORAGE === "memory") {
      if (isProduction()) {
        requireDurableBookingStorage("No database-backed booking storage is configured.");
      }

      return this.memory.createBooking(data);
    }

    try {
      return await this.db.createBooking(data);
    } catch (error) {
      if (isMissingTableError(error)) {
        if (isProduction()) {
          requireDurableBookingStorage("The bookings table is missing.");
        }

        console.warn(
          "[storage] bookings table missing — saved in memory for development. Run `npm run db:push` to create it.",
        );
        return this.memory.createBooking(data);
      }
      throw error;
    }
  }
}

export function createStorage(): IStorage {
  if (process.env.BOOKING_STORAGE === "memory") {
    if (isProduction()) {
      requireDurableBookingStorage("BOOKING_STORAGE=memory is not allowed.");
    }
    return new MemoryStorage();
  }

  if (!process.env.DATABASE_URL) {
    if (isProduction()) {
      requireDurableBookingStorage("DATABASE_URL is not set.");
    }

    console.warn("[storage] DATABASE_URL not set — using in-memory bookings.");
    return new MemoryStorage();
  }

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  return new ResilientStorage(new DatabaseStorage(pool));
}

export const storage = createStorage();
