import assert from "node:assert/strict";
import { after, test } from "node:test";
import type { bookings } from "@shared/schema";

type BookingInsert = typeof bookings.$inferInsert;
type StorageModule = typeof import("./storage");

const STORAGE_ENV_KEYS = [
  "NODE_ENV",
  "DATABASE_URL",
  "BOOKING_STORAGE",
] as const;

const originalEnv = new Map(
  STORAGE_ENV_KEYS.map((key) => [key, process.env[key]]),
);

let importCounter = 0;

function setStorageEnv(
  values: Partial<Record<(typeof STORAGE_ENV_KEYS)[number], string>>,
): void {
  for (const key of STORAGE_ENV_KEYS) {
    delete process.env[key];
  }

  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined) {
      process.env[key] = value;
    }
  }
}

function restoreStorageEnv(): void {
  for (const key of STORAGE_ENV_KEYS) {
    delete process.env[key];
    const value = originalEnv.get(key);
    if (value !== undefined) {
      process.env[key] = value;
    }
  }
}

async function importStorage(caseName: string): Promise<StorageModule> {
  return import(`./storage.ts?case=${caseName}-${importCounter++}`);
}

const sampleBooking: BookingInsert = {
  bookingNumber: "ON-2026-1234",
  fullName: "Test Booker",
  nationality: "mn",
  phone: "+976 99119911",
  email: "booker@example.com",
  tourSlug: "test-tour",
  tourTitle: "Test Tour",
  numberOfPeople: 2,
  travelDate: "2026-12-01",
  airportPickup: false,
  lang: "en",
  status: "deposit_pending",
};

after(() => {
  restoreStorageEnv();
});

test("production requires DATABASE_URL for durable booking storage", async () => {
  setStorageEnv({ NODE_ENV: "production" });

  await assert.rejects(
    () => importStorage("prod-missing-database-url"),
    /DATABASE_URL is required in production/,
  );
});

test("production rejects explicit in-memory booking storage", async () => {
  setStorageEnv({
    NODE_ENV: "production",
    BOOKING_STORAGE: "memory",
  });

  await assert.rejects(
    () => importStorage("prod-memory-storage"),
    /BOOKING_STORAGE=memory is not allowed in production/,
  );
});

test("development can still use in-memory booking storage", async () => {
  setStorageEnv({
    NODE_ENV: "development",
    BOOKING_STORAGE: "memory",
  });
  const { MemoryStorage, storage } = await importStorage("dev-memory-storage");

  assert.ok(storage instanceof MemoryStorage);
  const created = await storage.createBooking(sampleBooking);
  assert.equal(created.bookingNumber, sampleBooking.bookingNumber);
});

test("production does not fall back to memory when bookings table is missing", async () => {
  setStorageEnv({
    NODE_ENV: "production",
    DATABASE_URL: "postgresql://user:pass@localhost:5432/travel_hub",
  });
  const { ResilientStorage } = await importStorage("prod-missing-table");
  const resilientStorage = new ResilientStorage(null);
  const missingTableError = Object.assign(new Error("relation does not exist"), {
    code: "42P01",
  });

  (
    resilientStorage as unknown as {
      db: { createBooking: () => Promise<never> };
    }
  ).db = {
    async createBooking() {
      throw missingTableError;
    },
  };

  await assert.rejects(
    () => resilientStorage.createBooking(sampleBooking),
    /bookings table is missing in production/,
  );
});
