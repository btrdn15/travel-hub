import assert from "node:assert/strict";
import test from "node:test";

type EnvSnapshot = Pick<NodeJS.ProcessEnv, "NODE_ENV" | "DATABASE_URL" | "BOOKING_STORAGE">;

const initialEnv: EnvSnapshot = {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  BOOKING_STORAGE: process.env.BOOKING_STORAGE,
};

process.env.NODE_ENV = "test";
delete process.env.DATABASE_URL;
delete process.env.BOOKING_STORAGE;

const storageModule = await import("./storage.ts");
const { createStorage, MemoryStorage, ResilientStorage, StorageUnavailableError } = storageModule;

function restoreEnv(snapshot: EnvSnapshot) {
  for (const [key, value] of Object.entries(snapshot)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

async function withEnv(env: EnvSnapshot, fn: () => void | Promise<void>) {
  const previous: EnvSnapshot = {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    BOOKING_STORAGE: process.env.BOOKING_STORAGE,
  };

  restoreEnv(env);
  try {
    await fn();
  } finally {
    restoreEnv(previous);
  }
}

const bookingData = {
  bookingNumber: "BK-TEST",
  fullName: "Test Guest",
  nationality: "KR",
  phone: "+821012345678",
  kakaoId: null,
  email: "guest@example.com",
  tourSlug: "test-tour",
  tourTitle: "Test Tour",
  numberOfPeople: 2,
  travelDate: "2026-07-20",
  specialRequests: null,
  airportPickup: false,
  lang: "ko",
  pricePerPersonKrw: 1000,
  totalAmountKrw: 2000,
  depositAmountKrw: 600,
  status: "deposit_pending",
};

test("createStorage permits memory fallback outside production", async () => {
  await withEnv(
    {
      NODE_ENV: "development",
      DATABASE_URL: undefined,
      BOOKING_STORAGE: undefined,
    },
    () => {
      assert.ok(createStorage() instanceof MemoryStorage);
    },
  );
});

test("createStorage rejects missing DATABASE_URL in production", async () => {
  await withEnv(
    {
      NODE_ENV: "production",
      DATABASE_URL: undefined,
      BOOKING_STORAGE: undefined,
    },
    () => {
      assert.throws(() => createStorage(), StorageUnavailableError);
    },
  );
});

test("createStorage rejects explicit memory storage in production", async () => {
  await withEnv(
    {
      NODE_ENV: "production",
      DATABASE_URL: "postgres://example.invalid/app",
      BOOKING_STORAGE: "memory",
    },
    () => {
      assert.throws(() => createStorage(), StorageUnavailableError);
    },
  );
});

test("ResilientStorage rejects missing bookings table when fallback is disabled", async () => {
  const storage = new ResilientStorage(null, false);

  await assert.rejects(
    () => storage.createBooking(bookingData),
    StorageUnavailableError,
  );
});

test("ResilientStorage can still fall back to memory outside production", async () => {
  const storage = new ResilientStorage(null, true);

  const booking = await storage.createBooking(bookingData);

  assert.equal(booking.bookingNumber, bookingData.bookingNumber);
});

test.after(() => {
  restoreEnv(initialEnv);
});
