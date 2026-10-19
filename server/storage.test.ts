import assert from "node:assert/strict";
import test from "node:test";
import { MemoryStorage, ResilientStorage, type IStorage } from "./storage";

const ENV_KEYS = ["NODE_ENV", "DATABASE_URL", "BOOKING_STORAGE"] as const;
const ORIGINAL_ENV = new Map(
  ENV_KEYS.map((key) => [key, process.env[key]] as const),
);

const bookingInput = {
  bookingNumber: "ON-2026-1234",
  fullName: "Test Traveler",
  nationality: "KR",
  phone: "+821012345678",
  kakaoId: null,
  email: "traveler@example.com",
  tourSlug: "test-tour",
  tourTitle: "Test Tour",
  numberOfPeople: 2,
  travelDate: "2026-12-01",
  specialRequests: null,
  airportPickup: false,
  lang: "ko",
  pricePerPersonKrw: 100000,
  totalAmountKrw: 200000,
  depositAmountKrw: 60000,
  status: "deposit_pending",
} as const;

let importCounter = 0;

function setEnv(env: Partial<Record<(typeof ENV_KEYS)[number], string>>): void {
  for (const key of ENV_KEYS) {
    delete process.env[key];
  }

  for (const [key, value] of Object.entries(env)) {
    if (value !== undefined) {
      process.env[key] = value;
    }
  }
}

async function importFreshStorage(
  env: Partial<Record<(typeof ENV_KEYS)[number], string>>,
) {
  setEnv(env);
  importCounter++;
  return import(`./storage.ts?storage-test=${importCounter}`);
}

test.afterEach(() => {
  for (const key of ENV_KEYS) {
    const original = ORIGINAL_ENV.get(key);
    if (original === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = original;
    }
  }
});

test("production requires DATABASE_URL for durable booking storage", async () => {
  await assert.rejects(
    importFreshStorage({ NODE_ENV: "production" }),
    /DATABASE_URL is required in production/,
  );
});

test("production rejects explicit in-memory booking storage", async () => {
  await assert.rejects(
    importFreshStorage({
      NODE_ENV: "production",
      DATABASE_URL: "postgres://user:pass@localhost:5432/travel_hub",
      BOOKING_STORAGE: "memory",
    }),
    /BOOKING_STORAGE=memory is not allowed in production/,
  );
});

test("development can use in-memory booking storage without DATABASE_URL", async () => {
  const { storage, MemoryStorage: FreshMemoryStorage } = await importFreshStorage({
    NODE_ENV: "development",
  });

  assert.ok(storage instanceof FreshMemoryStorage);
  const booking = await storage.createBooking(bookingInput);
  assert.equal(booking.bookingNumber, bookingInput.bookingNumber);
  assert.equal(booking.totalAmountKrw, bookingInput.totalAmountKrw);
});

test("missing bookings table only falls back to memory outside production", async () => {
  const missingTableError = new Error("relation bookings does not exist") as Error & {
    code: string;
  };
  missingTableError.code = "42P01";
  const missingTableDb: IStorage = {
    async createBooking() {
      throw missingTableError;
    },
  };

  const productionStorage = new ResilientStorage(missingTableDb, false);
  await assert.rejects(
    productionStorage.createBooking(bookingInput),
    /relation bookings does not exist/,
  );

  const developmentStorage = new ResilientStorage(missingTableDb, true);
  const booking = await developmentStorage.createBooking(bookingInput);

  assert.equal(booking.bookingNumber, bookingInput.bookingNumber);
  assert.equal(booking.status, "deposit_pending");
});

test("memory storage preserves booking amounts and status", async () => {
  const storage = new MemoryStorage();
  const booking = await storage.createBooking(bookingInput);

  assert.equal(booking.bookingNumber, bookingInput.bookingNumber);
  assert.equal(booking.pricePerPersonKrw, bookingInput.pricePerPersonKrw);
  assert.equal(booking.totalAmountKrw, bookingInput.totalAmountKrw);
  assert.equal(booking.depositAmountKrw, bookingInput.depositAmountKrw);
  assert.equal(booking.status, "deposit_pending");
});
