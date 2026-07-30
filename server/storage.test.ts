import assert from "node:assert/strict";
import test from "node:test";
import type { bookings } from "@shared/schema";
import {
  createStorage,
  MemoryStorage,
  ResilientStorage,
  type IStorage,
} from "./storage";

const originalEnv = {
  BOOKING_STORAGE: process.env.BOOKING_STORAGE,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
};

function restoreEnv() {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

function setEnv(env: {
  BOOKING_STORAGE?: string;
  DATABASE_URL?: string;
  NODE_ENV?: string;
}) {
  restoreEnv();

  for (const key of ["BOOKING_STORAGE", "DATABASE_URL", "NODE_ENV"] as const) {
    const value = env[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

function sampleBooking(): typeof bookings.$inferInsert {
  return {
    bookingNumber: "BK-TEST-0001",
    fullName: "Test Traveler",
    nationality: "KR",
    phone: "+821012345678",
    email: "traveler@example.com",
    tourSlug: "central-mongolia",
    tourTitle: "Central Mongolia",
    numberOfPeople: 2,
    travelDate: "2026-09-01",
    airportPickup: false,
    lang: "en",
    pricePerPersonKrw: 100000,
    totalAmountKrw: 200000,
    depositAmountKrw: 60000,
    status: "deposit_pending",
  };
}

test.afterEach(() => {
  restoreEnv();
});

test("production refuses to start booking storage without DATABASE_URL", () => {
  setEnv({ NODE_ENV: "production" });

  assert.throws(
    () => createStorage(),
    /DATABASE_URL is required in production/,
  );
});

test("production refuses explicit memory booking storage", () => {
  setEnv({
    BOOKING_STORAGE: "memory",
    DATABASE_URL: "postgresql://example.invalid/travel_hub",
    NODE_ENV: "production",
  });

  assert.throws(
    () => createStorage(),
    /BOOKING_STORAGE=memory is not allowed in production/,
  );
});

test("development can still use memory booking storage without DATABASE_URL", () => {
  setEnv({ NODE_ENV: "development" });

  assert.ok(createStorage() instanceof MemoryStorage);
});

test("missing bookings table falls back to memory only when allowed", async () => {
  const missingTableError = { code: "42P01" };

  const devStorage = new ResilientStorage(null, {
    allowMissingTableFallback: true,
  }) as ResilientStorage & { db: IStorage };
  devStorage.db = {
    async createBooking() {
      throw missingTableError;
    },
  };

  const created = await devStorage.createBooking(sampleBooking());
  assert.equal(created.bookingNumber, "BK-TEST-0001");

  const prodStorage = new ResilientStorage(null, {
    allowMissingTableFallback: false,
  }) as ResilientStorage & { db: IStorage };
  prodStorage.db = {
    async createBooking() {
      throw missingTableError;
    },
  };

  await assert.rejects(
    () => prodStorage.createBooking(sampleBooking()),
    (error) => error === missingTableError,
  );
});
