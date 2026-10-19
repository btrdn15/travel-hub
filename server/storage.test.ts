import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

const ORIGINAL_ENV = {
  BOOKING_STORAGE: process.env.BOOKING_STORAGE,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
};

let importCounter = 0;

function restoreEnv() {
  for (const [key, value] of Object.entries(ORIGINAL_ENV)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

function useEnv(env: Record<string, string | undefined>) {
  restoreEnv();
  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

function bookingInsert() {
  return {
    bookingNumber: `ON-TEST-${importCounter}`,
    fullName: "Test Guest",
    nationality: "KR",
    phone: "+821012345678",
    email: "guest@example.com",
    tourSlug: "winter-expedition",
    tourTitle: "Winter Expedition",
    numberOfPeople: 2,
    travelDate: "2026-12-01",
    airportPickup: false,
    lang: "ko" as const,
    status: "deposit_pending",
  };
}

async function importFreshStorage() {
  return import(`./storage.ts?storage-test=${importCounter++}`);
}

afterEach(() => {
  restoreEnv();
});

test("development can explicitly use in-memory booking storage", async () => {
  useEnv({
    NODE_ENV: "development",
    BOOKING_STORAGE: "memory",
    DATABASE_URL: undefined,
  });

  const { createStorage } = await importFreshStorage();
  const storage = createStorage();
  const booking = await storage.createBooking(bookingInsert());

  assert.equal(booking.fullName, "Test Guest");
  assert.equal(booking.status, "deposit_pending");
});

test("production refuses to start without durable booking storage", async () => {
  useEnv({
    NODE_ENV: "production",
    BOOKING_STORAGE: undefined,
    DATABASE_URL: undefined,
  });

  await assert.rejects(
    importFreshStorage(),
    /DATABASE_URL is required for production booking storage/,
  );
});

test("production refuses explicit memory booking storage", async () => {
  useEnv({
    NODE_ENV: "production",
    BOOKING_STORAGE: "memory",
    DATABASE_URL: "postgresql://example.invalid/travel_hub",
  });

  await assert.rejects(
    importFreshStorage(),
    /BOOKING_STORAGE=memory is not allowed in production/,
  );
});

test("production does not fall back to memory when the bookings table is missing", async () => {
  useEnv({
    NODE_ENV: "production",
    BOOKING_STORAGE: undefined,
    DATABASE_URL: "postgresql://example.invalid/travel_hub",
  });

  const { ResilientStorage } = await importFreshStorage();
  const storage = new ResilientStorage(null, false);
  storage.db = {
    createBooking: async () => {
      const error = new Error("relation \"bookings\" does not exist") as Error & {
        code: string;
      };
      error.code = "42P01";
      throw error;
    },
  };

  await assert.rejects(
    storage.createBooking(bookingInsert()),
    /relation "bookings" does not exist/,
  );
});

test("development still falls back to memory when the bookings table is missing", async () => {
  useEnv({
    NODE_ENV: "development",
    BOOKING_STORAGE: undefined,
    DATABASE_URL: "postgresql://example.invalid/travel_hub",
  });

  const { ResilientStorage } = await importFreshStorage();
  const storage = new ResilientStorage(null, true);
  storage.db = {
    createBooking: async () => {
      const error = new Error("relation \"bookings\" does not exist") as Error & {
        code: string;
      };
      error.code = "42P01";
      throw error;
    },
  };

  const submitted = bookingInsert();
  const booking = await storage.createBooking(submitted);

  assert.equal(booking.bookingNumber, submitted.bookingNumber);
});
