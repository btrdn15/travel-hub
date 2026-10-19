import assert from "node:assert/strict";
import { test } from "node:test";
import type { Booking } from "@shared/schema";
import { createStorage, ResilientStorage, type IStorage } from "./storage";

const bookingData = {
  bookingNumber: "BK-TEST-001",
  fullName: "Test Traveler",
  nationality: "KR",
  phone: "+821012345678",
  kakaoId: null,
  email: "traveler@example.com",
  tourSlug: "winter-expedition",
  tourTitle: "Winter Expedition",
  numberOfPeople: 2,
  travelDate: "2026-12-15",
  specialRequests: null,
  airportPickup: false,
  lang: "ko",
  pricePerPersonKrw: 100000,
  totalAmountKrw: 200000,
  depositAmountKrw: 20000,
  status: "deposit_pending",
};

function missingBookingsTableStorage(): IStorage {
  return {
    async createBooking(): Promise<Booking> {
      const error = new Error("relation \"bookings\" does not exist") as Error & {
        code?: string;
      };
      error.code = "42P01";
      throw error;
    },
  };
}

test("createStorage requires DATABASE_URL in production", () => {
  assert.throws(
    () =>
      createStorage({
        NODE_ENV: "production",
        BOOKING_STORAGE: undefined,
        DATABASE_URL: undefined,
      }),
    /DATABASE_URL is required/,
  );
});

test("createStorage rejects in-memory booking storage in production", () => {
  assert.throws(
    () =>
      createStorage({
        NODE_ENV: "production",
        BOOKING_STORAGE: "memory",
        DATABASE_URL: "postgresql://user:pass@localhost:5432/travel_hub",
      }),
    /BOOKING_STORAGE=memory is disabled/,
  );
});

test("missing bookings table is fatal in production", async () => {
  const storage = new ResilientStorage(missingBookingsTableStorage(), {
    NODE_ENV: "production",
    BOOKING_STORAGE: undefined,
    DATABASE_URL: "postgresql://user:pass@localhost:5432/travel_hub",
  });

  await assert.rejects(
    () => storage.createBooking(bookingData),
    /PostgreSQL bookings table is missing/,
  );
});

test("missing bookings table can fall back to memory outside production", async () => {
  const storage = new ResilientStorage(missingBookingsTableStorage(), {
    NODE_ENV: "development",
    BOOKING_STORAGE: undefined,
    DATABASE_URL: "postgresql://user:pass@localhost:5432/travel_hub",
  });

  const booking = await storage.createBooking(bookingData);

  assert.equal(booking.bookingNumber, bookingData.bookingNumber);
  assert.equal(booking.status, "deposit_pending");
  assert.ok(booking.id);
});
