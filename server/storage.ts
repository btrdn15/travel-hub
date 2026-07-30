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

type ResilientStorageOptions = {
  allowMemoryFallback: boolean;
  database?: IStorage;
};

/** DB алдаа гарвал memory руу fallback — зөвхөн development үед */
export class ResilientStorage implements IStorage {
  private memory = new MemoryStorage();
  private db: IStorage | null = null;
  private allowMemoryFallback: boolean;

  constructor(pool: pg.Pool | null, options: ResilientStorageOptions) {
    this.allowMemoryFallback = options.allowMemoryFallback;
    if (options.database) {
      this.db = options.database;
    } else if (pool) {
      this.db = new DatabaseStorage(pool);
    }
  }

  async createBooking(data: typeof bookings.$inferInsert): Promise<Booking> {
    if (!this.db) {
      if (!this.allowMemoryFallback) {
        throw new Error(
          "[storage] durable booking storage is required outside development.",
        );
      }
      return this.memory.createBooking(data);
    }

    try {
      return await this.db.createBooking(data);
    } catch (error) {
      if (isMissingTableError(error)) {
        if (!this.allowMemoryFallback) {
          throw new Error(
            "[storage] bookings table missing; run `npm run db:push` before accepting production bookings.",
            { cause: error },
          );
        }

        console.warn(
          "[storage] bookings table missing — saved in memory. Run `npm run db:push` before using durable bookings.",
        );
        return this.memory.createBooking(data);
      }
      throw error;
    }
  }
}

export function createStorage(): IStorage {
  const isProduction = process.env.NODE_ENV === "production";
  const wantsMemory = process.env.BOOKING_STORAGE === "memory";

  if (wantsMemory) {
    if (isProduction) {
      throw new Error(
        "[storage] BOOKING_STORAGE=memory is not allowed in production.",
      );
    }
    return new MemoryStorage();
  }

  if (!process.env.DATABASE_URL) {
    if (isProduction) {
      throw new Error(
        "[storage] DATABASE_URL is required in production so bookings are durably stored.",
      );
    }

    console.warn("[storage] DATABASE_URL not set — using in-memory bookings.");
    return new MemoryStorage();
  }

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  return new ResilientStorage(pool, { allowMemoryFallback: !isProduction });
}

export const storage = createStorage();
