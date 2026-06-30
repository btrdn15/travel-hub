import assert from "node:assert/strict";
import test from "node:test";
import {
  createStorage,
  MemoryStorage,
  ResilientStorage,
  StorageUnavailableError,
  type IStorage,
} from "./storage";
import type { bookings } from "@shared/schema";

const ORIGINAL_ENV = { ...process.env };

function restoreEnv() {
  process.env = { ...ORIGINAL_ENV };
}

function sampleBooking(): typeof bookings.$inferInsert {
  return {
    bookingNumber: "ON-TEST-0001",
    fullName: "Test Guest",
    nationality: "KR",
    phone: "+821012345678",
    email: "guest@example.com",
    tourSlug: "test-tour",
    tourTitle: "Test Tour",
    numberOfPeople: 2,
    travelDate: "2026-07-01",
    airportPickup: false,
    lang: "ko",
    pricePerPersonKrw: 1000,
    totalAmountKrw: 2000,
    depositAmountKrw: 400,
    status: "deposit_pending",
  };
}

class MissingBookingsTableStorage implements IStorage {
  async createBooking(): Promise<never> {
    throw Object.assign(new Error("relation bookings does not exist"), {
      code: "42P01",
    });
  }
}

test.afterEach(restoreEnv);

test("development can explicitly use in-memory booking storage", () => {
  process.env.NODE_ENV = "development";
  process.env.BOOKING_STORAGE = "memory";
  delete process.env.DATABASE_URL;

  assert.ok(createStorage() instanceof MemoryStorage);
});

test("production refuses in-memory booking storage", () => {
  process.env.NODE_ENV = "production";
  process.env.BOOKING_STORAGE = "memory";
  process.env.DATABASE_URL = "postgresql://example.invalid/travel_hub";

  assert.throws(
    () => createStorage(),
    /BOOKING_STORAGE=memory is not allowed in production/,
  );
});

test("production requires a durable database URL for bookings", () => {
  process.env.NODE_ENV = "production";
  delete process.env.BOOKING_STORAGE;
  delete process.env.DATABASE_URL;

  assert.throws(
    () => createStorage(),
    /DATABASE_URL is required in production for booking storage/,
  );
});

test("production does not fall back to memory when bookings table is missing", async () => {
  const storage = new ResilientStorage(new MissingBookingsTableStorage(), false);

  await assert.rejects(
    () => storage.createBooking(sampleBooking()),
    StorageUnavailableError,
  );
});

test("development can fall back to memory when bookings table is missing", async () => {
  const storage = new ResilientStorage(new MissingBookingsTableStorage(), true);

  const booking = await storage.createBooking(sampleBooking());

  assert.equal(booking.bookingNumber, "ON-TEST-0001");
  assert.equal(booking.email, "guest@example.com");
});
