import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import {
  createStorage,
  MemoryStorage,
  ResilientStorage,
  type IStorage,
} from "./storage";
import { bookings } from "@shared/schema";

const originalNodeEnv = process.env.NODE_ENV;
const originalDatabaseUrl = process.env.DATABASE_URL;
const originalBookingStorage = process.env.BOOKING_STORAGE;

afterEach(() => {
  setEnv("NODE_ENV", originalNodeEnv);
  setEnv("DATABASE_URL", originalDatabaseUrl);
  setEnv("BOOKING_STORAGE", originalBookingStorage);
});

function setEnv(name: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
}

function sampleBooking(): typeof bookings.$inferInsert {
  return {
    bookingNumber: "ON-2026-1234",
    fullName: "Test Booker",
    nationality: "KR",
    phone: "+821012345678",
    email: "booker@example.com",
    tourSlug: "central-mongolia",
    tourTitle: "Central Mongolia",
    numberOfPeople: 2,
    travelDate: "2026-07-01",
    airportPickup: false,
    lang: "ko",
    status: "deposit_pending",
  };
}

test("production requires DATABASE_URL for durable booking storage", () => {
  process.env.NODE_ENV = "production";
  delete process.env.DATABASE_URL;
  delete process.env.BOOKING_STORAGE;

  assert.throws(
    () => createStorage(),
    /DATABASE_URL must be set in production/,
  );
});

test("production rejects explicit in-memory booking storage", () => {
  process.env.NODE_ENV = "production";
  process.env.DATABASE_URL = "postgresql://example.invalid/app";
  process.env.BOOKING_STORAGE = "memory";

  assert.throws(
    () => createStorage(),
    /BOOKING_STORAGE=memory is not allowed in production/,
  );
});

test("development can use in-memory booking storage without DATABASE_URL", async () => {
  process.env.NODE_ENV = "development";
  delete process.env.DATABASE_URL;
  delete process.env.BOOKING_STORAGE;

  const storage = createStorage();
  assert.ok(storage instanceof MemoryStorage);

  const booking = await storage.createBooking(sampleBooking());
  assert.equal(booking.bookingNumber, "ON-2026-1234");
});

test("missing bookings table is not swallowed when fallback is disabled", async () => {
  const tableError = Object.assign(new Error("relation does not exist"), {
    code: "42P01",
  });
  const failingDb: IStorage = {
    async createBooking() {
      throw tableError;
    },
  };
  const storage = new ResilientStorage(failingDb, {
    allowMissingTableFallback: false,
  });

  await assert.rejects(() => storage.createBooking(sampleBooking()), tableError);
});

test("missing bookings table still falls back in development mode", async () => {
  const tableError = Object.assign(new Error("relation does not exist"), {
    code: "42P01",
  });
  const failingDb: IStorage = {
    async createBooking() {
      throw tableError;
    },
  };
  const storage = new ResilientStorage(failingDb, {
    allowMissingTableFallback: true,
  });

  const booking = await storage.createBooking(sampleBooking());
  assert.equal(booking.bookingNumber, "ON-2026-1234");
});
