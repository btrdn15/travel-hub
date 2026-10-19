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

export interface ResilientStorageOptions {
  allowMissingTableFallback: boolean;
}

export interface CreateStorageOptions {
  env?: NodeJS.ProcessEnv;
  createPool?: (connectionString: string) => pg.Pool;
}

class BookingStorageConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BookingStorageConfigurationError";
  }
}

export class ResilientStorage implements IStorage {
  private memory = new MemoryStorage();

  constructor(
    private readonly db: IStorage,
    private readonly options: ResilientStorageOptions,
  ) {}

  async createBooking(data: typeof bookings.$inferInsert): Promise<Booking> {
    try {
      return await this.db.createBooking(data);
    } catch (error) {
      if (isMissingTableError(error) && this.options.allowMissingTableFallback) {
        console.warn(
          "[storage] bookings table missing - saved in memory. Run `npm run db:push` before relying on persistence.",
        );
        return this.memory.createBooking(data);
      }
      throw error;
    }
  }
}

export function createStorage({
  env = process.env,
  createPool = (connectionString) => new pg.Pool({ connectionString }),
}: CreateStorageOptions = {}): IStorage {
  const isProduction = env.NODE_ENV === "production";
  const storageMode = env.BOOKING_STORAGE?.trim().toLowerCase();

  if (storageMode === "memory") {
    if (isProduction) {
      throw new BookingStorageConfigurationError(
        "BOOKING_STORAGE=memory is not allowed in production; configure DATABASE_URL for durable booking storage.",
      );
    }

    return new MemoryStorage();
  }

  const databaseUrl = env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    if (isProduction) {
      throw new BookingStorageConfigurationError(
        "DATABASE_URL is required in production for durable booking storage.",
      );
    }

    console.warn("[storage] DATABASE_URL not set - using in-memory bookings.");
    return new MemoryStorage();
  }

  const pool = createPool(databaseUrl);
  return new ResilientStorage(new DatabaseStorage(pool), {
    allowMissingTableFallback: !isProduction,
  });
}

export const storage = createStorage();
