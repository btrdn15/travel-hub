import assert from "node:assert/strict";
import test from "node:test";
import { bookings } from "@shared/schema";
import {
  createStorage,
  MemoryStorage,
  ResilientStorage,
  StorageUnavailableError,
  type IStorage,
} from "./storage";

const originalEnv = { ...process.env };

function restoreEnv() {
  process.env = { ...originalEnv };
}

function bookingData(): typeof bookings.$inferInsert {
  return {
    bookingNumber: "ON-2026-1001",
    fullName: "Test Booker",
    nationality: "kr",
    phone: "+821012345678",
    kakaoId: null,
    email: "booker@example.com",
    tourSlug: "bird-photography",
    tourTitle: "Bird Photography",
    numberOfPeople: 2,
    travelDate: "2026-09-01",
    specialRequests: null,
    airportPickup: false,
    lang: "en",
    pricePerPersonKrw: 100000,
    totalAmountKrw: 200000,
    depositAmountKrw: 20000,
    status: "deposit_pending",
  };
}

test.afterEach(restoreEnv);

test("development can explicitly use in-memory booking storage", () => {
  delete process.env.DATABASE_URL;
  process.env.NODE_ENV = "development";
  process.env.BOOKING_STORAGE = "memory";

  assert.ok(createStorage() instanceof MemoryStorage);
});

test("production refuses to start without DATABASE_URL", () => {
  delete process.env.DATABASE_URL;
  delete process.env.BOOKING_STORAGE;
  process.env.NODE_ENV = "production";

  assert.throws(
    () => createStorage(),
    /DATABASE_URL must be set in production/,
  );
});

test("production refuses explicit memory booking storage", () => {
  delete process.env.DATABASE_URL;
  process.env.NODE_ENV = "production";
  process.env.BOOKING_STORAGE = "memory";

  assert.throws(
    () => createStorage(),
    /BOOKING_STORAGE=memory is not allowed in production/,
  );
});

test("production does not fall back to memory when bookings table is missing", async () => {
  const missingTableStorage: IStorage = {
    async createBooking() {
      const error = new Error("relation bookings does not exist") as Error & {
        code: string;
      };
      error.code = "42P01";
      throw error;
    },
  };
  const storage = new ResilientStorage(null, {
    allowMemoryFallback: false,
    database: missingTableStorage,
  });

  await assert.rejects(
    () => storage.createBooking(bookingData()),
    StorageUnavailableError,
  );
});

test("development still falls back to memory when bookings table is missing", async () => {
  const missingTableStorage: IStorage = {
    async createBooking() {
      const error = new Error("relation bookings does not exist") as Error & {
        code: string;
      };
      error.code = "42P01";
      throw error;
    },
  };
  const storage = new ResilientStorage(null, {
    allowMemoryFallback: true,
    database: missingTableStorage,
  });

  const booking = await storage.createBooking(bookingData());

  assert.equal(booking.bookingNumber, "ON-2026-1001");
});
