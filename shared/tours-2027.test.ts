/**
 * 2027 үнэ, дүрмийг баримттай тулгах тест.
 * Ажиллуулах: npm test
 *
 * EXPECTED хүснэгтийг docs/2027/2027-technical-brief-mn.md §5-аас (мөн
 * 2027-website-content.md-ийн хүснэгтүүдээс) гараар хуулсан — shared/tours-2027.ts-ээс
 * хуулаагүй, тиймээс өгөгдлийн файлд алдаа гарвал энэ тест барьж авна.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  TOURS_2027,
  LEGACY_TOUR_SLUGS,
  getPricePerPersonUsd,
  getFromPriceUsd,
  quote,
  resolveTourSlug,
  validateInquirySelection,
  isInBlackout,
  getTour2027,
} from "./tours-2027";

const EXPECTED_USD: Record<string, Record<number, number>> = {
  "summer-fishing": { 1: 5841, 2: 2988, 3: 2037, 4: 1562, 5: 1277, 6: 1086 },
  "winter-ice-fishing": { 1: 5960, 2: 3048, 3: 2077, 4: 1592, 5: 1300, 6: 1106 },
  "wildlife-photography": { 3: 1962, 4: 1530, 5: 1271, 6: 1507, 7: 1325, 8: 1189 },
  "nomadic-culture": { 1: 1990, 2: 1190, 3: 890, 4: 750, 5: 690, 6: 650 },
};

const EXPECTED_META: Record<string, { days: number; nights: number; min: number; max: number }> = {
  "summer-fishing": { days: 4, nights: 3, min: 1, max: 6 },
  "winter-ice-fishing": { days: 4, nights: 3, min: 1, max: 6 },
  "wildlife-photography": { days: 5, nights: 4, min: 3, max: 8 },
  "nomadic-culture": { days: 4, nights: 3, min: 1, max: 6 },
  "winter-hunting": { days: 6, nights: 5, min: 1, max: 4 },
};

const TODAY = "2026-11-11";

test("exactly five tours with the documented slugs", () => {
  assert.deepEqual(
    TOURS_2027.map((t) => t.slug).sort(),
    Object.keys(EXPECTED_META).sort(),
  );
});

test("duration and party-size limits match the brief", () => {
  for (const [slug, m] of Object.entries(EXPECTED_META)) {
    const tour = getTour2027(slug)!;
    assert.equal(tour.days, m.days, `${slug} days`);
    assert.equal(tour.nights, m.nights, `${slug} nights`);
    assert.equal(tour.minPeople, m.min, `${slug} min`);
    assert.equal(tour.maxPeople, m.max, `${slug} max`);
  }
});

test("every per-person USD price matches the document table", () => {
  for (const [slug, table] of Object.entries(EXPECTED_USD)) {
    const tour = getTour2027(slug)!;
    assert.deepEqual(
      Object.keys(tour.pricesUsd ?? {}).map(Number).sort((a, b) => a - b),
      Object.keys(table).map(Number).sort((a, b) => a - b),
      `${slug}: priced group sizes`,
    );
    for (const [people, price] of Object.entries(table)) {
      assert.equal(getPricePerPersonUsd(slug, Number(people)), price, `${slug} × ${people}`);
    }
  }
});

test("photography 6-person price stays above 5-person price (not smoothed)", () => {
  assert.equal(getPricePerPersonUsd("wildlife-photography", 5), 1271);
  assert.equal(getPricePerPersonUsd("wildlife-photography", 6), 1507);
});

test("quote: total = per-person × people, 30% deposit, 70% balance", () => {
  for (const [slug, table] of Object.entries(EXPECTED_USD)) {
    for (const [p, price] of Object.entries(table)) {
      const people = Number(p);
      const q = quote(slug, people)!;
      assert.equal(q.totalUsd, price * people);
      assert.equal(q.depositUsd, Math.round(price * people * 0.3));
      assert.equal(q.depositUsd + q.balanceUsd, q.totalUsd);
    }
  }
  // Гар тооцоо: 2 × $2,988 = $5,976 → 30% = $1,792.8 → $1,793; үлдэгдэл $4,183
  assert.deepEqual(quote("summer-fishing", 2), {
    pricePerPersonUsd: 2988,
    people: 2,
    totalUsd: 5976,
    depositUsd: 1793,
    balanceUsd: 4183,
  });
});

test("out-of-range party sizes have no price", () => {
  assert.equal(quote("wildlife-photography", 2), null);
  assert.equal(quote("wildlife-photography", 9), null);
  assert.equal(quote("summer-fishing", 0), null);
  assert.equal(quote("summer-fishing", 7), null);
  assert.equal(quote("nomadic-culture", 2.5), null);
});

test("winter hunting: no price, no quote, no from-price", () => {
  const hunting = getTour2027("winter-hunting")!;
  assert.equal(hunting.status, "info_only");
  assert.equal(hunting.pricesUsd, undefined);
  for (let p = 0; p <= 10; p++) {
    assert.equal(getPricePerPersonUsd("winter-hunting", p), null);
    assert.equal(quote("winter-hunting", p), null);
  }
  assert.equal(getFromPriceUsd("winter-hunting"), null);
});

test("from-price is the lowest per-person price", () => {
  assert.equal(getFromPriceUsd("summer-fishing"), 1086);
  assert.equal(getFromPriceUsd("winter-ice-fishing"), 1106);
  assert.equal(getFromPriceUsd("wildlife-photography"), 1189);
  assert.equal(getFromPriceUsd("nomadic-culture"), 650);
});

test("airport transfer included on the four core tours only", () => {
  for (const t of TOURS_2027) {
    assert.equal(t.airportTransferIncluded, t.slug !== "winter-hunting", t.slug);
  }
});

test("summer fishing: March 22 – June 22 blocked (inclusive), every year", () => {
  const tour = getTour2027("summer-fishing")!;
  for (const d of ["2027-03-22", "2027-04-15", "2027-06-22", "2028-05-01"]) {
    assert.equal(isInBlackout(tour, d), true, d);
    assert.ok(validateInquirySelection("summer-fishing", 2, d, TODAY).includes("date_blackout"), d);
  }
  for (const d of ["2027-03-21", "2027-06-23", "2027-08-01", "2026-12-20"]) {
    assert.equal(isInBlackout(tour, d), false, d);
    assert.deepEqual(validateInquirySelection("summer-fishing", 2, d, TODAY), [], d);
  }
});

test("photography: only the two fixed 2027 departures are accepted", () => {
  assert.deepEqual(validateInquirySelection("wildlife-photography", 4, "2027-06-16", TODAY), []);
  assert.deepEqual(validateInquirySelection("wildlife-photography", 4, "2027-08-18", TODAY), []);
  for (const d of ["2027-06-17", "2027-07-01", "2027-08-22", "2028-06-16"]) {
    assert.deepEqual(
      validateInquirySelection("wildlife-photography", 4, d, TODAY),
      ["date_not_fixed_departure"],
      d,
    );
  }
});

test("photography rejects fewer than 3 and more than 8 travelers", () => {
  for (const p of [1, 2, 9]) {
    assert.ok(
      validateInquirySelection("wildlife-photography", p, "2027-06-16", TODAY).includes("party_size"),
      String(p),
    );
  }
});

test("ice fishing only December–February", () => {
  assert.deepEqual(validateInquirySelection("winter-ice-fishing", 2, "2026-12-15", TODAY), []);
  assert.deepEqual(validateInquirySelection("winter-ice-fishing", 2, "2027-02-28", TODAY), []);
  assert.deepEqual(validateInquirySelection("winter-ice-fishing", 2, "2027-03-01", TODAY), [
    "date_out_of_season",
  ]);
});

test("past, malformed and impossible dates are rejected", () => {
  assert.ok(validateInquirySelection("nomadic-culture", 2, "2026-11-10", TODAY).includes("date_past"));
  assert.deepEqual(validateInquirySelection("nomadic-culture", 2, "2026-11-11", TODAY), []);
  assert.ok(validateInquirySelection("nomadic-culture", 2, "2027-02-30", TODAY).includes("date_invalid"));
  assert.ok(validateInquirySelection("nomadic-culture", 2, "next week", TODAY).includes("date_invalid"));
});

test("unknown tour slug is rejected", () => {
  assert.deepEqual(validateInquirySelection("bird-photography", 2, "2027-06-16", TODAY), [
    "unknown_tour",
  ]);
});

test("legacy slugs resolve to the new slugs", () => {
  assert.equal(resolveTourSlug("bird-photography"), "wildlife-photography");
  assert.equal(resolveTourSlug("kherlen-fishing"), "summer-fishing");
  assert.equal(resolveTourSlug("arburd-gobi"), "nomadic-culture");
  assert.equal(resolveTourSlug("winter-hunting"), "winter-hunting");
  assert.equal(resolveTourSlug("summer-fishing"), "summer-fishing");
  assert.equal(resolveTourSlug("nope"), undefined);
  for (const target of Object.values(LEGACY_TOUR_SLUGS)) {
    assert.ok(getTour2027(target), target);
  }
});
