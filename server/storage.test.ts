import assert from "node:assert/strict";
import test from "node:test";
import { createStorage, ResilientStorage, type IStorage } from "./storage";
import type { bookings } from "@shared/schema";

const bookingData: typeof bookings.$inferInsert = {
  bookingNumber: "ON-2026-1234",
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
  pricePerPersonKrw: 100000,
  totalAmountKrw: 200000,
  depositAmountKrw: 60000,
  status: "deposit_pending",
};

function missingBookingsTableStorage(): IStorage {
  return {
    async createBooking() {
      throw Object.assign(new Error("relation \"bookings\" does not exist"), {
        code: "42P01",
      });
    },
  };
}

test("production booking storage requires DATABASE_URL", () => {
  assert.throws(
    () => createStorage({ NODE_ENV: "production" }),
    /DATABASE_URL is required for production booking storage/,
  );
});

test("production booking storage rejects explicit memory mode", () => {
  assert.throws(
    () =>
      createStorage({
        NODE_ENV: "production",
        BOOKING_STORAGE: "memory",
        DATABASE_URL: "postgresql://user:pass@example.com:5432/app",
      }),
    /BOOKING_STORAGE=memory is not allowed in production/,
  );
});

test("development storage can use in-memory bookings", async () => {
  const storage = createStorage({ NODE_ENV: "development", BOOKING_STORAGE: "memory" });

  const booking = await storage.createBooking(bookingData);

  assert.equal(booking.bookingNumber, bookingData.bookingNumber);
  assert.equal(booking.email, bookingData.email);
  assert.ok(booking.id);
});

test("development missing bookings table falls back to memory", async () => {
  const storage = new ResilientStorage(null, {
    allowMemoryFallback: true,
    database: missingBookingsTableStorage(),
  });

  const booking = await storage.createBooking(bookingData);

  assert.equal(booking.bookingNumber, bookingData.bookingNumber);
  assert.ok(booking.id);
});

test("production missing bookings table fails instead of losing bookings in memory", async () => {
  const storage = new ResilientStorage(null, {
    allowMemoryFallback: false,
    database: missingBookingsTableStorage(),
  });

  await assert.rejects(
    () => storage.createBooking(bookingData),
    /relation "bookings" does not exist/,
  );
});
