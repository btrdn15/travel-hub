import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import type { IStorage } from "./storage";

const originalEnv = {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  BOOKING_STORAGE: process.env.BOOKING_STORAGE,
};

process.env.NODE_ENV = "development";
delete process.env.DATABASE_URL;
delete process.env.BOOKING_STORAGE;

const { createStorage, MemoryStorage, ResilientStorage } = await import("./storage");

type BookingInput = Parameters<IStorage["createBooking"]>[0];

function resetEnv() {
  if (originalEnv.NODE_ENV === undefined) {
    delete process.env.NODE_ENV;
  } else {
    process.env.NODE_ENV = originalEnv.NODE_ENV;
  }

  if (originalEnv.DATABASE_URL === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalEnv.DATABASE_URL;
  }

  if (originalEnv.BOOKING_STORAGE === undefined) {
    delete process.env.BOOKING_STORAGE;
  } else {
    process.env.BOOKING_STORAGE = originalEnv.BOOKING_STORAGE;
  }
}

afterEach(resetEnv);

function bookingData(overrides: Partial<BookingInput> = {}): BookingInput {
  return {
    bookingNumber: "ON-2026-1234",
    fullName: "Test Traveler",
    nationality: "kr",
    phone: "+821012345678",
    kakaoId: null,
    email: "traveler@example.com",
    tourSlug: "bird-photography",
    tourTitle: "Bird Photography Expedition",
    numberOfPeople: 2,
    travelDate: "2026-07-01",
    specialRequests: null,
    airportPickup: false,
    lang: "en",
    pricePerPersonKrw: 2_200_000,
    totalAmountKrw: 4_400_000,
    depositAmountKrw: 440_000,
    status: "deposit_pending",
    ...overrides,
  };
}

test("production booking storage requires DATABASE_URL", () => {
  process.env.NODE_ENV = "production";
  delete process.env.DATABASE_URL;
  delete process.env.BOOKING_STORAGE;

  assert.throws(
    () => createStorage(),
    /DATABASE_URL is required for production booking storage/,
  );
});

test("production booking storage rejects forced memory mode", () => {
  process.env.NODE_ENV = "production";
  process.env.DATABASE_URL = "postgresql://localhost:5432/olonnuur";
  process.env.BOOKING_STORAGE = "memory";

  assert.throws(
    () => createStorage(),
    /BOOKING_STORAGE=memory is not allowed in production/,
  );
});

test("development booking storage can run in memory without DATABASE_URL", () => {
  process.env.NODE_ENV = "development";
  delete process.env.DATABASE_URL;
  delete process.env.BOOKING_STORAGE;

  assert.ok(createStorage() instanceof MemoryStorage);
});

test("production resilient storage propagates missing bookings table errors", async () => {
  const missingTableError = Object.assign(new Error("relation does not exist"), {
    code: "42P01",
  });
  const db: IStorage = {
    async createBooking() {
      throw missingTableError;
    },
  };
  const storage = new ResilientStorage(db, false);

  await assert.rejects(
    () => storage.createBooking(bookingData()),
    (error) => error === missingTableError,
  );
});

test("development resilient storage falls back when bookings table is missing", async () => {
  const db: IStorage = {
    async createBooking() {
      throw Object.assign(new Error("relation does not exist"), { code: "42P01" });
    },
  };
  const storage = new ResilientStorage(db, true);

  const booking = await storage.createBooking(bookingData());

  assert.equal(booking.bookingNumber, "ON-2026-1234");
  assert.equal(booking.status, "deposit_pending");
});
