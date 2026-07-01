import assert from "node:assert/strict";
import test from "node:test";
import type { bookings } from "@shared/schema";
import { ResilientStorage } from "./storage";

type BookingInsert = typeof bookings.$inferInsert;

const sampleBooking: BookingInsert = {
  bookingNumber: "ON-2026-0001",
  fullName: "Test Traveler",
  nationality: "KR",
  phone: "+821012345678",
  kakaoId: null,
  email: "traveler@example.com",
  tourSlug: "winter-expedition",
  tourTitle: "Winter Expedition",
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

test("production startup fails without DATABASE_URL instead of using memory storage", async () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalDatabaseUrl = process.env.DATABASE_URL;
  const originalBookingStorage = process.env.BOOKING_STORAGE;

  process.env.NODE_ENV = "production";
  delete process.env.DATABASE_URL;
  delete process.env.BOOKING_STORAGE;

  try {
    await assert.rejects(
      () => import(`./storage.ts?missing-db=${Date.now()}`),
      {
        name: "StorageUnavailableError",
        message: /DATABASE_URL must be set in production/,
      },
    );
  } finally {
    restoreEnv("NODE_ENV", originalNodeEnv);
    restoreEnv("DATABASE_URL", originalDatabaseUrl);
    restoreEnv("BOOKING_STORAGE", originalBookingStorage);
  }
});

test("production startup rejects explicit memory booking storage", async () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalDatabaseUrl = process.env.DATABASE_URL;
  const originalBookingStorage = process.env.BOOKING_STORAGE;

  process.env.NODE_ENV = "production";
  process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/travel_hub";
  process.env.BOOKING_STORAGE = "memory";

  try {
    await assert.rejects(
      () => import(`./storage.ts?memory-prod=${Date.now()}`),
      {
        name: "StorageUnavailableError",
        message: /BOOKING_STORAGE=memory is unsafe in production/,
      },
    );
  } finally {
    restoreEnv("NODE_ENV", originalNodeEnv);
    restoreEnv("DATABASE_URL", originalDatabaseUrl);
    restoreEnv("BOOKING_STORAGE", originalBookingStorage);
  }
});

test("production missing bookings table does not fall back to memory", async () => {
  const db = {
    async createBooking(): Promise<never> {
      const error = new Error("relation \"bookings\" does not exist") as Error & {
        code: string;
      };
      error.code = "42P01";
      throw error;
    },
  };
  const storage = new ResilientStorage(db, false);

  await assert.rejects(() => storage.createBooking(sampleBooking), {
    name: "StorageUnavailableError",
    message: /bookings table is missing/,
  });
});

test("development missing bookings table can still use memory fallback", async () => {
  const db = {
    async createBooking(): Promise<never> {
      const error = new Error("relation \"bookings\" does not exist") as Error & {
        code: string;
      };
      error.code = "42P01";
      throw error;
    },
  };
  const storage = new ResilientStorage(db, true);

  const booking = await storage.createBooking(sampleBooking);

  assert.equal(booking.bookingNumber, sampleBooking.bookingNumber);
  assert.equal(booking.email, sampleBooking.email);
  assert.equal(booking.status, "deposit_pending");
});

function restoreEnv(name: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}
