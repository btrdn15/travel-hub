import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { createStorage, MemoryStorage, ResilientStorage, type IStorage } from "./storage";
import type { bookings } from "@shared/schema";

const originalEnv = {
  BOOKING_STORAGE: process.env.BOOKING_STORAGE,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
};

afterEach(() => {
  setEnv("BOOKING_STORAGE", originalEnv.BOOKING_STORAGE);
  setEnv("DATABASE_URL", originalEnv.DATABASE_URL);
  setEnv("NODE_ENV", originalEnv.NODE_ENV);
});

function setEnv(name: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
}

function bookingData(): typeof bookings.$inferInsert {
  return {
    bookingNumber: "ON-2026-1001",
    fullName: "Test Booker",
    nationality: "KR",
    phone: "+821012345678",
    email: "booker@example.com",
    tourSlug: "winter-expedition",
    tourTitle: "Winter Expedition",
    numberOfPeople: 2,
    travelDate: "2026-12-01",
    airportPickup: false,
    lang: "ko",
    status: "deposit_pending",
  };
}

test("development can use explicit in-memory booking storage", () => {
  process.env.NODE_ENV = "development";
  process.env.BOOKING_STORAGE = "memory";
  delete process.env.DATABASE_URL;

  assert.ok(createStorage() instanceof MemoryStorage);
});

test("production requires DATABASE_URL instead of silently using memory", () => {
  process.env.NODE_ENV = "production";
  delete process.env.BOOKING_STORAGE;
  delete process.env.DATABASE_URL;

  assert.throws(
    () => createStorage(),
    /DATABASE_URL is required for durable booking storage in production/,
  );
});

test("production rejects explicit in-memory booking storage", () => {
  process.env.NODE_ENV = "production";
  process.env.BOOKING_STORAGE = "memory";
  delete process.env.DATABASE_URL;

  assert.throws(
    () => createStorage(),
    /BOOKING_STORAGE=memory cannot be used in production/,
  );
});

test("production does not fall back to memory when bookings table is missing", async () => {
  const missingTableStorage: IStorage = {
    async createBooking() {
      const error = new Error("relation \"bookings\" does not exist") as Error & {
        code: string;
      };
      error.code = "42P01";
      throw error;
    },
  };
  const storage = new ResilientStorage(missingTableStorage, false);

  await assert.rejects(
    () => storage.createBooking(bookingData()),
    /Bookings table is missing in production/,
  );
});

test("development can fall back to memory when bookings table is missing", async () => {
  const missingTableStorage: IStorage = {
    async createBooking() {
      const error = new Error("relation \"bookings\" does not exist") as Error & {
        code: string;
      };
      error.code = "42P01";
      throw error;
    },
  };
  const storage = new ResilientStorage(missingTableStorage, true);

  const booking = await storage.createBooking(bookingData());

  assert.equal(booking.bookingNumber, "ON-2026-1001");
});
