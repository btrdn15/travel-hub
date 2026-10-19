import assert from "node:assert/strict";
import test from "node:test";

type StorageModule = typeof import("./storage");

const ENV_KEYS = ["NODE_ENV", "DATABASE_URL", "BOOKING_STORAGE"] as const;
type EnvKey = (typeof ENV_KEYS)[number];

let importCounter = 0;

async function withStorageModule<T>(
  env: Partial<Record<EnvKey, string | undefined>>,
  callback: (module: StorageModule) => Promise<T> | T,
): Promise<T> {
  const previous = new Map<EnvKey, string | undefined>();

  for (const key of ENV_KEYS) {
    previous.set(key, process.env[key]);
    delete process.env[key];
  }

  for (const [key, value] of Object.entries(env) as [EnvKey, string | undefined][]) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }

  try {
    const storageUrl = new URL("./storage.ts", import.meta.url);
    storageUrl.searchParams.set("testImport", String(importCounter++));
    const module = (await import(storageUrl.href)) as StorageModule;
    return await callback(module);
  } finally {
    for (const [key, value] of previous) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
}

test("production storage fails closed when DATABASE_URL is missing", async () => {
  await assert.rejects(
    () =>
      withStorageModule({ NODE_ENV: "production" }, () => {
        throw new Error("storage import unexpectedly succeeded");
      }),
    /DATABASE_URL is required/,
  );
});

test("production storage rejects explicit memory mode", async () => {
  await assert.rejects(
    () =>
      withStorageModule(
        {
          NODE_ENV: "production",
          DATABASE_URL: "postgresql://user:pass@example.com:5432/travel_hub",
          BOOKING_STORAGE: "memory",
        },
        () => {
          throw new Error("storage import unexpectedly succeeded");
        },
      ),
    /BOOKING_STORAGE=memory is not allowed/,
  );
});

test("development storage still supports memory mode", async () => {
  const created = await withStorageModule(
    { NODE_ENV: "development", BOOKING_STORAGE: "memory" },
    (module) =>
      module.storage.createBooking({
        bookingNumber: "BK-TEST-001",
        fullName: "Test Traveler",
        nationality: "kr",
        phone: "01012345678",
        kakaoId: null,
        email: "test@example.com",
        tourSlug: "gobi",
        tourTitle: "Gobi Tour",
        numberOfPeople: 2,
        travelDate: "2026-07-01",
        specialRequests: null,
        airportPickup: false,
        lang: "ko",
        pricePerPersonKrw: 1000,
        totalAmountKrw: 2000,
        depositAmountKrw: 600,
        status: "deposit_pending",
      }),
  );

  assert.equal(created.bookingNumber, "BK-TEST-001");
  assert.equal(created.totalAmountKrw, 2000);
  assert.ok(created.id);
  assert.ok(created.createdAt instanceof Date);
});
