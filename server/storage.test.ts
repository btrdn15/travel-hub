import assert from "node:assert/strict";
import { afterEach, before, describe, it } from "node:test";

import type { bookings } from "../shared/schema";

type StorageModule = typeof import("./storage");
type TestEnv = Pick<NodeJS.ProcessEnv, "BOOKING_STORAGE" | "DATABASE_URL" | "NODE_ENV">;

let storageModule: StorageModule;
const originalEnv: TestEnv = {
  BOOKING_STORAGE: process.env.BOOKING_STORAGE,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
};

function setTestEnv(values: TestEnv) {
  for (const key of Object.keys(originalEnv) as Array<keyof TestEnv>) {
    const value = values[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

function missingTableError(): Error & { code: string } {
  const error = new Error("relation \"bookings\" does not exist") as Error & {
    code: string;
  };
  error.code = "42P01";
  return error;
}

const bookingInsert: typeof bookings.$inferInsert = {
  bookingNumber: "ON-2026-1234",
  fullName: "Test Customer",
  nationality: "kr",
  phone: "+821012345678",
  kakaoId: null,
  email: "customer@example.com",
  tourSlug: "tsaatan-tour",
  tourTitle: "Tsaatan Tour",
  numberOfPeople: 2,
  travelDate: "2026-12-01",
  specialRequests: null,
  airportPickup: false,
  lang: "ko",
  pricePerPersonKrw: 100000,
  totalAmountKrw: 200000,
  depositAmountKrw: 60000,
  status: "deposit_pending",
};

before(async () => {
  setTestEnv({ NODE_ENV: "test" });
  storageModule = await import("./storage");
});

afterEach(() => {
  setTestEnv(originalEnv);
});

describe("createStorage", () => {
  it("uses in-memory storage in development when DATABASE_URL is not set", () => {
    setTestEnv({ NODE_ENV: "development" });

    const storage = storageModule.createStorage();

    assert.ok(storage instanceof storageModule.MemoryStorage);
  });

  it("fails closed in production when DATABASE_URL is not set", () => {
    setTestEnv({ NODE_ENV: "production" });

    assert.throws(
      () => storageModule.createStorage(),
      /DATABASE_URL is required for production booking storage/,
    );
  });

  it("rejects explicit memory storage in production", () => {
    setTestEnv({ NODE_ENV: "production", BOOKING_STORAGE: "memory" });

    assert.throws(
      () => storageModule.createStorage(),
      /BOOKING_STORAGE=memory is not allowed in production/,
    );
  });
});

describe("ResilientStorage", () => {
  it("falls back to memory for a missing bookings table only when allowed", async () => {
    const db = {
      async createBooking() {
        throw missingTableError();
      },
    };
    const storage = new storageModule.ResilientStorage(db, true);

    const booking = await storage.createBooking(bookingInsert);

    assert.equal(booking.bookingNumber, bookingInsert.bookingNumber);
    assert.equal(booking.status, "deposit_pending");
  });

  it("propagates a missing bookings table when memory fallback is disabled", async () => {
    const db = {
      async createBooking() {
        throw missingTableError();
      },
    };
    const storage = new storageModule.ResilientStorage(db, false);

    await assert.rejects(
      () => storage.createBooking(bookingInsert),
      /bookings table is missing/,
    );
  });
});
