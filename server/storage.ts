import { type Booking, bookings } from "@shared/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

export interface IStorage {
  createBooking(data: typeof bookings.$inferInsert): Promise<Booking>;
}

type StorageEnvironment = Partial<
  Record<"BOOKING_STORAGE" | "DATABASE_URL" | "NODE_ENV", string>
>;

function isProduction(env: StorageEnvironment): boolean {
  return env.NODE_ENV === "production";
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
  private env: StorageEnvironment;

  constructor(db: IStorage | null, env: StorageEnvironment = process.env) {
    this.db = db;
    this.env = env;
  }

  async createBooking(data: typeof bookings.$inferInsert): Promise<Booking> {
    if (!this.db || this.env.BOOKING_STORAGE === "memory") {
      if (isProduction(this.env)) {
        throw new Error("Durable booking storage is required in production.");
      }

      return this.memory.createBooking(data);
    }

    try {
      return await this.db.createBooking(data);
    } catch (error) {
      if (isMissingTableError(error)) {
        if (isProduction(this.env)) {
          throw new Error(
            "PostgreSQL bookings table is missing; run `npm run db:push` before accepting bookings.",
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

export function createStorage(env: StorageEnvironment = process.env): IStorage {
  if (isProduction(env)) {
    if (env.BOOKING_STORAGE === "memory") {
      throw new Error("BOOKING_STORAGE=memory is disabled in production.");
    }

    if (!env.DATABASE_URL) {
      throw new Error("DATABASE_URL is required for production booking storage.");
    }
  }

  if (env.BOOKING_STORAGE === "memory" || !env.DATABASE_URL) {
    if (!env.DATABASE_URL) {
      console.warn("[storage] DATABASE_URL not set — using in-memory bookings.");
    }
    return new MemoryStorage();
  }

  const pool = new pg.Pool({ connectionString: env.DATABASE_URL });
  return new ResilientStorage(new DatabaseStorage(pool), env);
}

export const storage = createStorage();
