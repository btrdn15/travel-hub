import assert from "node:assert/strict";
import test from "node:test";
import { type Booking, type bookings } from "@shared/schema";
import {
  createStorage,
  MemoryStorage,
  ResilientStorage,
  type IStorage,
} from "./storage";

const bookingData: typeof bookings.$inferInsert = {
  bookingNumber: "ON-2026-1001",
  fullName: "Test Traveler",
  nationality: "KR",
  phone: "+821012345678",
  kakaoId: null,
  email: "traveler@example.com",
  tourSlug: "altai-tavanbogd",
  tourTitle: "Altai Tavan Bogd",
  numberOfPeople: 2,
  travelDate: "2026-09-15",
  specialRequests: null,
  airportPickup: false,
  lang: "en",
  pricePerPersonKrw: 1200000,
  totalAmountKrw: 2400000,
  depositAmountKrw: 720000,
  status: "deposit_pending",
};

function missingBookingsTableError(): Error & { code: string } {
  return Object.assign(new Error('relation "bookings" does not exist'), {
    code: "42P01",
  });
}

test("createStorage allows explicit memory storage outside production", async () => {
  const storage = createStorage({
    env: {
      BOOKING_STORAGE: "memory",
      NODE_ENV: "development",
    } as NodeJS.ProcessEnv,
  });

  assert.ok(storage instanceof MemoryStorage);
  const booking = await storage.createBooking(bookingData);
  assert.equal(booking.bookingNumber, bookingData.bookingNumber);
});

test("createStorage rejects explicit memory storage in production", () => {
  assert.throws(
    () =>
      createStorage({
        env: {
          BOOKING_STORAGE: "memory",
          NODE_ENV: "production",
        } as NodeJS.ProcessEnv,
      }),
    /BOOKING_STORAGE=memory is not allowed in production/,
  );
});

test("createStorage requires DATABASE_URL in production", () => {
  assert.throws(
    () =>
      createStorage({
        env: {
          NODE_ENV: "production",
        } as NodeJS.ProcessEnv,
      }),
    /DATABASE_URL is required in production/,
  );
});

test("ResilientStorage does not acknowledge missing-table writes when fallback is disabled", async () => {
  const failingDb: IStorage = {
    async createBooking(): Promise<Booking> {
      throw missingBookingsTableError();
    },
  };
  const storage = new ResilientStorage(failingDb, {
    allowMissingTableFallback: false,
  });

  await assert.rejects(
    () => storage.createBooking(bookingData),
    /relation "bookings" does not exist/,
  );
});

test("ResilientStorage can fall back for missing tables when explicitly allowed", async () => {
  const failingDb: IStorage = {
    async createBooking(): Promise<Booking> {
      throw missingBookingsTableError();
    },
  };
  const storage = new ResilientStorage(failingDb, {
    allowMissingTableFallback: true,
  });

  const booking = await storage.createBooking(bookingData);
  assert.equal(booking.bookingNumber, bookingData.bookingNumber);
});
