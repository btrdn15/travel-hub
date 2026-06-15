import assert from "node:assert/strict";
import test from "node:test";

const initialEnv = {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  BOOKING_STORAGE: process.env.BOOKING_STORAGE,
};

process.env.NODE_ENV = "test";
delete process.env.DATABASE_URL;
delete process.env.BOOKING_STORAGE;

const { createStorage, ResilientStorage } = await import("./storage");

function setOptionalEnv(
  key: keyof typeof initialEnv,
  value: string | undefined,
): void {
  if (value === undefined) {
    delete process.env[key];
  } else {
    process.env[key] = value;
  }
}

async function withEnv(
  env: Partial<Record<keyof typeof initialEnv, string | undefined>>,
  fn: () => void | Promise<void>,
): Promise<void> {
  const snapshot = {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    BOOKING_STORAGE: process.env.BOOKING_STORAGE,
  };

  for (const [key, value] of Object.entries(env)) {
    setOptionalEnv(key as keyof typeof initialEnv, value);
  }

  try {
    await fn();
  } finally {
    for (const [key, value] of Object.entries(snapshot)) {
      setOptionalEnv(key as keyof typeof initialEnv, value);
    }
  }
}

const bookingData = {
  bookingNumber: "ON-2026-1234",
  fullName: "Test Booker",
  nationality: "KR",
  phone: "+821012345678",
  kakaoId: null,
  email: "booker@example.com",
  tourSlug: "winter-expedition",
  tourTitle: "Winter Expedition",
  numberOfPeople: 2,
  travelDate: "2026-12-20",
  specialRequests: null,
  airportPickup: false,
  lang: "en",
  pricePerPersonKrw: 100_000,
  totalAmountKrw: 200_000,
  depositAmountKrw: 60_000,
  status: "deposit_pending",
};

test("production startup requires DATABASE_URL for durable bookings", async () => {
  await withEnv(
    {
      NODE_ENV: "production",
      DATABASE_URL: undefined,
      BOOKING_STORAGE: undefined,
    },
    () => {
      assert.throws(
        () => createStorage(),
        /DATABASE_URL is required in production/,
      );
    },
  );
});

test("production rejects explicit in-memory booking storage", async () => {
  await withEnv(
    {
      NODE_ENV: "production",
      DATABASE_URL: "postgresql://localhost:5432/warehouse_db",
      BOOKING_STORAGE: "memory",
    },
    () => {
      assert.throws(
        () => createStorage(),
        /BOOKING_STORAGE=memory is not allowed in production/,
      );
    },
  );
});

test("production does not fall back to memory when bookings table is missing", async () => {
  const missingTableDatabase = {
    async createBooking() {
      throw Object.assign(new Error("relation \"bookings\" does not exist"), {
        code: "42P01",
      });
    },
  };

  const storage = new ResilientStorage(null, {
    allowMemoryFallback: false,
    database: missingTableDatabase,
  });

  await assert.rejects(
    () => storage.createBooking(bookingData),
    /bookings table missing/,
  );
});

test("development can still fall back to memory when bookings table is missing", async () => {
  const missingTableDatabase = {
    async createBooking() {
      throw Object.assign(new Error("relation \"bookings\" does not exist"), {
        code: "42P01",
      });
    },
  };

  const storage = new ResilientStorage(null, {
    allowMemoryFallback: true,
    database: missingTableDatabase,
  });

  const booking = await storage.createBooking(bookingData);

  assert.equal(booking.bookingNumber, bookingData.bookingNumber);
  assert.equal(booking.email, bookingData.email);
  assert.ok(booking.id);
  assert.ok(booking.createdAt instanceof Date);
});

test.after(() => {
  for (const [key, value] of Object.entries(initialEnv)) {
    setOptionalEnv(key as keyof typeof initialEnv, value);
  }
});
