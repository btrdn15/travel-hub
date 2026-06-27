import { type Booking, bookings } from "@shared/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

export interface IStorage {
  createBooking(data: typeof bookings.$inferInsert): Promise<Booking>;
}

type StorageEnv = {
  BOOKING_STORAGE?: string;
  DATABASE_URL?: string;
  NODE_ENV?: string;
};

type ResilientStorageOptions = {
  allowMemoryFallback: boolean;
  database?: IStorage;
};

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

/** DB алдаа гарвал memory руу fallback — зөвхөн dev-д bookings хүснэгт байхгүй үед */
export class ResilientStorage implements IStorage {
  private memory = new MemoryStorage();
  private db: IStorage | null = null;

  constructor(
    pool: pg.Pool | null,
    private options: ResilientStorageOptions,
  ) {
    this.db = options.database ?? (pool ? new DatabaseStorage(pool) : null);
  }

  async createBooking(data: typeof bookings.$inferInsert): Promise<Booking> {
    if (!this.db) {
      if (!this.options.allowMemoryFallback) {
        throw new Error("Durable booking storage is not configured.");
      }

      return this.memory.createBooking(data);
    }

    try {
      return await this.db.createBooking(data);
    } catch (error) {
      if (isMissingTableError(error) && this.options.allowMemoryFallback) {
        console.warn(
          "[storage] bookings table missing — saved in memory. Production: run `npm run db:push`",
        );
        return this.memory.createBooking(data);
      }
      throw error;
    }
  }
}

export function createStorage(env: StorageEnv = process.env): IStorage {
  const isProduction = env.NODE_ENV === "production";
  const useMemoryStorage = env.BOOKING_STORAGE === "memory";

  if (isProduction && useMemoryStorage) {
    throw new Error("BOOKING_STORAGE=memory is not allowed in production.");
  }

  if (isProduction && !env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for production booking storage.");
  }

  if (useMemoryStorage || !env.DATABASE_URL) {
    if (!env.DATABASE_URL) {
      console.warn("[storage] DATABASE_URL not set — using in-memory bookings.");
    }
    return new MemoryStorage();
  }

  const pool = new pg.Pool({ connectionString: env.DATABASE_URL });
  return new ResilientStorage(pool, { allowMemoryFallback: !isProduction });
}

export const storage = createStorage();
