import { test } from "node:test";
import assert from "node:assert/strict";
import {
  BOOKING_TOUR_OPTIONS,
  calculateBookingAmounts,
  getBookingTour,
  getMaxPeopleForTour,
  getMinPeopleForTour,
  DEPOSIT_AMOUNT_USD,
  formatUsd,
} from "./booking-config";
import { TOURS_2027 } from "./tours-2027";

test("booking dropdown lists exactly the 2027 tours, same slugs and names", () => {
  assert.deepEqual(
    BOOKING_TOUR_OPTIONS.map((t) => t.slug),
    TOURS_2027.map((t) => t.slug),
  );
  for (const tour of TOURS_2027) {
    const opt = getBookingTour(tour.slug)!;
    assert.equal(opt.titleEn, tour.name.en);
    assert.equal(opt.titleKo, tour.name.ko);
    assert.equal(opt.titleMn, tour.name.mn);
    assert.equal(opt.titleJa, tour.name.ja);
    assert.equal(getMinPeopleForTour(tour.slug), tour.minPeople);
    assert.equal(getMaxPeopleForTour(tour.slug), tour.maxPeople);
  }
});

test("no old tour names or slugs remain", () => {
  const all = JSON.stringify(BOOKING_TOUR_OPTIONS);
  for (const old of ["Bird Photography Expedition", "Arburd Gobi", "bird-photography", "kherlen-fishing", "arburd-gobi"]) {
    assert.ok(!all.includes(old), old);
  }
});

test("legacy slugs still resolve for old links and cached clients", () => {
  assert.equal(getBookingTour("bird-photography")?.slug, "wildlife-photography");
  assert.equal(getBookingTour("kherlen-fishing")?.slug, "summer-fishing");
  assert.equal(getBookingTour("arburd-gobi")?.slug, "nomadic-culture");
});

test("winter hunting is information-only: no price, no deposit", () => {
  const hunting = getBookingTour("winter-hunting")!;
  assert.equal(hunting.inquiryOnly, true);
  assert.deepEqual(calculateBookingAmounts("winter-hunting", 2), {
    pricePerPersonKrw: null,
    totalKrw: null,
    depositUsd: null,
  });
});

test("no KRW prices are guessed for the 2027 tours", () => {
  for (const opt of BOOKING_TOUR_OPTIONS) {
    assert.equal(opt.priceTiers, undefined, opt.slug);
  }
});

test("deposit is a flat $10 USD on every bookable (non info-only) tour", () => {
  assert.equal(DEPOSIT_AMOUNT_USD, 10);
  assert.equal(formatUsd(DEPOSIT_AMOUNT_USD), "$10");
  for (const opt of BOOKING_TOUR_OPTIONS) {
    for (let people = opt.minPeople; people <= opt.maxPeople; people++) {
      const { depositUsd } = calculateBookingAmounts(opt.slug, people);
      assert.equal(depositUsd, opt.inquiryOnly ? null : 10, `${opt.slug} × ${people}`);
    }
  }
});
