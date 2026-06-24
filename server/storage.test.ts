import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { createStorage } from "./storage";

const ENV_KEYS = ["NODE_ENV", "DATABASE_URL", "BOOKING_STORAGE"] as const;

let originalEnv: Record<(typeof ENV_KEYS)[number], string | undefined>;

beforeEach(() => {
  originalEnv = Object.fromEntries(
    ENV_KEYS.map((key) => [key, process.env[key]]),
  ) as typeof originalEnv;

  for (const key of ENV_KEYS) {
    delete process.env[key];
  }
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    const value = originalEnv[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

function bookingData(bookingNumber: string) {
  return {
    bookingNumber,
    fullName: "Test Traveler",
    nationality: "KR",
    phone: "+821012345678",
    kakaoId: null,
    email: "traveler@example.com",
    tourSlug: "bird-photography",
    tourTitle: "Bird Photography Expedition",
    numberOfPeople: 2,
    travelDate: "2026-10-01",
    specialRequests: null,
    airportPickup: false,
    lang: "ko",
    pricePerPersonKrw: 2_200_000,
    totalAmountKrw: 4_400_000,
    depositAmountKrw: 440_000,
    status: "deposit_pending",
  };
}

test("development can use memory storage without DATABASE_URL", async () => {
  process.env.NODE_ENV = "development";

  const storage = createStorage();
  const booking = await storage.createBooking(bookingData("ON-2026-1001"));

  assert.equal(booking.bookingNumber, "ON-2026-1001");
  assert.ok(booking.id);
  assert.ok(booking.createdAt instanceof Date);
});

test("production requires DATABASE_URL for booking storage", () => {
  process.env.NODE_ENV = "production";

  assert.throws(
    () => createStorage(),
    /DATABASE_URL must be set in production/,
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
