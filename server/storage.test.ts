import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import type { IStorage } from "./storage";

const originalEnv = {
  BOOKING_STORAGE: process.env.BOOKING_STORAGE,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
};

delete process.env.BOOKING_STORAGE;
delete process.env.DATABASE_URL;
process.env.NODE_ENV = "test";

const { createStorage, MemoryStorage, ResilientStorage } = await import(
  "./storage"
);

type BookingInsert = Parameters<IStorage["createBooking"]>[0];

const bookingData: BookingInsert = {
  bookingNumber: "ON-2026-1001",
  fullName: "Test Customer",
  nationality: "KR",
  phone: "+821012345678",
  kakaoId: null,
  email: "customer@example.com",
  tourSlug: "bird-photography",
  tourTitle: "Bird Photography Expedition",
  numberOfPeople: 1,
  travelDate: "2026-07-01",
  specialRequests: null,
  airportPickup: false,
  lang: "ko",
  pricePerPersonKrw: 2_600_000,
  totalAmountKrw: 2_600_000,
  depositAmountKrw: 260_000,
  status: "deposit_pending",
};

class MissingTableStorage implements IStorage {
  async createBooking(): Promise<never> {
    const error = new Error("relation does not exist") as Error & {
      code: string;
    };
    error.code = "42P01";
    throw error;
  }
}

function restoreEnv() {
  for (const key of ["BOOKING_STORAGE", "DATABASE_URL", "NODE_ENV"] as const) {
    const value = originalEnv[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

describe("booking storage safety", () => {
  beforeEach(() => {
    delete process.env.BOOKING_STORAGE;
    delete process.env.DATABASE_URL;
    process.env.NODE_ENV = "test";
  });

  afterEach(restoreEnv);

  it("uses memory storage in non-production when DATABASE_URL is unset", async () => {
    process.env.NODE_ENV = "development";

    const storage = createStorage();
    assert.ok(storage instanceof MemoryStorage);

    const booking = await storage.createBooking(bookingData);
    assert.equal(booking.bookingNumber, bookingData.bookingNumber);
  });

  it("rejects production startup when DATABASE_URL is unset", () => {
    process.env.NODE_ENV = "production";

    assert.throws(
      () => createStorage(),
      /DATABASE_URL is not set.*Refusing to use in-memory booking storage in production/,
    );
  });

  it("rejects explicit memory booking storage in production", () => {
    process.env.NODE_ENV = "production";
    process.env.BOOKING_STORAGE = "memory";

    assert.throws(
      () => createStorage(),
      /BOOKING_STORAGE=memory is not allowed.*Refusing to use in-memory booking storage in production/,
    );
  });

  it("falls back to memory on missing bookings table outside production", async () => {
    process.env.NODE_ENV = "development";

    const storage = new ResilientStorage(new MissingTableStorage());
    const booking = await storage.createBooking(bookingData);

    assert.equal(booking.bookingNumber, bookingData.bookingNumber);
  });

  it("rejects missing bookings table in production", async () => {
    process.env.NODE_ENV = "production";

    const storage = new ResilientStorage(new MissingTableStorage());

    await assert.rejects(
      () => storage.createBooking(bookingData),
      /The bookings table is missing.*Refusing to use in-memory booking storage in production/,
    );
  });
});
