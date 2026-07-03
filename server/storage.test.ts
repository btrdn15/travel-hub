import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import {
  createStorage,
  MemoryStorage,
  StorageUnavailableError,
} from "./storage";

const ORIGINAL_ENV = {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  BOOKING_STORAGE: process.env.BOOKING_STORAGE,
};

function setEnv(values: {
  NODE_ENV?: string;
  DATABASE_URL?: string;
  BOOKING_STORAGE?: string;
}) {
  for (const key of Object.keys(ORIGINAL_ENV) as Array<keyof typeof ORIGINAL_ENV>) {
    const value = values[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

afterEach(() => {
  for (const [key, value] of Object.entries(ORIGINAL_ENV)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

test("production storage requires DATABASE_URL before accepting bookings", () => {
  setEnv({ NODE_ENV: "production" });

  assert.throws(
    () => createStorage(),
    (error) =>
      error instanceof StorageUnavailableError &&
      /DATABASE_URL must be set/.test(error.message),
  );
});

test("production storage rejects memory mode because bookings would be lost", () => {
  setEnv({
    NODE_ENV: "production",
    DATABASE_URL: "postgresql://user:pass@example.com:5432/travel_hub",
    BOOKING_STORAGE: "memory",
  });

  assert.throws(
    () => createStorage(),
    (error) =>
      error instanceof StorageUnavailableError &&
      /BOOKING_STORAGE=memory is not allowed/.test(error.message),
  );
});

test("development storage can still use memory fallback", async () => {
  setEnv({ NODE_ENV: "development", BOOKING_STORAGE: "memory" });

  const storage = createStorage();
  assert.ok(storage instanceof MemoryStorage);

  const booking = await storage.createBooking({
    bookingNumber: "ON-2026-1234",
    fullName: "Test Traveler",
    nationality: "KR",
    phone: "+821012345678",
    email: "traveler@example.com",
    tourSlug: "test-tour",
    tourTitle: "Test Tour",
    numberOfPeople: 2,
    travelDate: "2026-08-01",
    airportPickup: false,
    lang: "en",
    status: "deposit_pending",
  });

  assert.equal(booking.bookingNumber, "ON-2026-1234");
  assert.equal(booking.status, "deposit_pending");
});
