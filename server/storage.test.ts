import assert from "node:assert/strict";
import test from "node:test";
import { MemoryStorage, ResilientStorage, createStorage, type IStorage } from "./storage";

type EnvPatch = {
  DATABASE_URL?: string;
  BOOKING_STORAGE?: string;
  NODE_ENV?: string;
};

const sampleBooking = {
  bookingNumber: "BK-TEST-0001",
  fullName: "Test Traveler",
  nationality: "KR",
  phone: "+821012345678",
  kakaoId: null,
  email: "traveler@example.com",
  tourSlug: "altai-tavan-bogd",
  tourTitle: "Altai Tavan Bogd",
  numberOfPeople: 2,
  travelDate: "2026-08-01",
  specialRequests: null,
  airportPickup: false,
  lang: "ko",
  pricePerPersonKrw: 100_000,
  totalAmountKrw: 200_000,
  depositAmountKrw: 60_000,
  status: "deposit_pending",
} satisfies Parameters<IStorage["createBooking"]>[0];

function withEnv<T>(patch: EnvPatch, callback: () => T): T {
  const previous = {
    DATABASE_URL: process.env.DATABASE_URL,
    BOOKING_STORAGE: process.env.BOOKING_STORAGE,
    NODE_ENV: process.env.NODE_ENV,
  };

  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }

  try {
    return callback();
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
}

class MissingTableStorage implements IStorage {
  async createBooking(): Promise<never> {
    const error = new Error("relation \"bookings\" does not exist") as Error & {
      code: string;
    };
    error.code = "42P01";
    throw error;
  }
}

test("production requires DATABASE_URL for durable booking storage", () => {
  withEnv(
    { NODE_ENV: "production", DATABASE_URL: undefined, BOOKING_STORAGE: undefined },
    () => {
      assert.throws(
        () => createStorage(),
        /DATABASE_URL is required for durable production bookings/,
      );
    },
  );
});

test("production rejects explicit memory booking storage", () => {
  withEnv(
    {
      NODE_ENV: "production",
      DATABASE_URL: "postgresql://example.invalid/bookings",
      BOOKING_STORAGE: "memory",
    },
    () => {
      assert.throws(
        () => createStorage(),
        /BOOKING_STORAGE=memory is not allowed in production/,
      );
    },
  );
});

test("development can still use memory storage without DATABASE_URL", () => {
  withEnv(
    { NODE_ENV: "development", DATABASE_URL: undefined, BOOKING_STORAGE: undefined },
    () => {
      assert.ok(createStorage() instanceof MemoryStorage);
    },
  );
});

test("missing bookings table fails closed when memory fallback is disabled", async () => {
  const storage = new ResilientStorage(new MissingTableStorage(), {
    allowMemoryFallback: false,
  });

  await assert.rejects(
    () => storage.createBooking(sampleBooking),
    /bookings table is missing/,
  );
});

test("missing bookings table falls back to memory only when allowed", async () => {
  const storage = new ResilientStorage(new MissingTableStorage(), {
    allowMemoryFallback: true,
  });

  const booking = await storage.createBooking(sampleBooking);

  assert.equal(booking.bookingNumber, sampleBooking.bookingNumber);
  assert.equal(booking.email, sampleBooking.email);
});
