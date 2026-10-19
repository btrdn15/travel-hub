import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { createStorage, DatabaseStorage } from "./storage";
import { bookings } from "@shared/schema";

type BookingInsert = typeof bookings.$inferInsert;

const ENV_KEYS = ["NODE_ENV", "DATABASE_URL", "BOOKING_STORAGE"] as const;
const originalEnv = new Map(
  ENV_KEYS.map((key) => [key, process.env[key]] as const),
);

afterEach(() => {
  for (const key of ENV_KEYS) {
    const value = originalEnv.get(key);
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

function sampleBooking(overrides: Partial<BookingInsert> = {}): BookingInsert {
  return {
    bookingNumber: `TEST-${crypto.randomUUID()}`,
    fullName: "Test Guest",
    nationality: "kr",
    phone: "+821012345678",
    email: "guest@example.com",
    tourSlug: "winter-expedition",
    tourTitle: "Winter Expedition",
    numberOfPeople: 2,
    travelDate: "2026-12-01",
    airportPickup: false,
    lang: "ko",
    pricePerPersonKrw: 100000,
    totalAmountKrw: 200000,
    depositAmountKrw: 60000,
    status: "deposit_pending",
    ...overrides,
  };
}

test("production requires DATABASE_URL for durable booking storage", () => {
  process.env.NODE_ENV = "production";
  delete process.env.DATABASE_URL;
  delete process.env.BOOKING_STORAGE;

  assert.throws(
    () => createStorage(),
    /DATABASE_URL is required in production/,
  );
});

test("production rejects explicit memory booking storage", () => {
  process.env.NODE_ENV = "production";
  process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/travel_hub";
  process.env.BOOKING_STORAGE = "memory";

  assert.throws(
    () => createStorage(),
    /BOOKING_STORAGE=memory is not allowed in production/,
  );
});

test("production does not fall back to memory when bookings table is missing", async () => {
  process.env.NODE_ENV = "production";
  process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/travel_hub";
  delete process.env.BOOKING_STORAGE;

  const originalCreateBooking = DatabaseStorage.prototype.createBooking;
  DatabaseStorage.prototype.createBooking = async () => {
    const error = new Error("relation \"bookings\" does not exist") as Error & {
      code?: string;
    };
    error.code = "42P01";
    throw error;
  };

  try {
    const storage = createStorage();

    await assert.rejects(
      () => storage.createBooking(sampleBooking()),
      /bookings table missing/,
    );
  } finally {
    DatabaseStorage.prototype.createBooking = originalCreateBooking;
  }
});

test("development can use in-memory booking storage without DATABASE_URL", async () => {
  process.env.NODE_ENV = "development";
  delete process.env.DATABASE_URL;
  delete process.env.BOOKING_STORAGE;

  const storage = createStorage();
  const booking = await storage.createBooking(sampleBooking());

  assert.equal(booking.fullName, "Test Guest");
  assert.equal(booking.status, "deposit_pending");
});
