/**
 * OLON NUUR TRAVEL — 2027 аяллын каталог (client + server хоёулаа эндээс уншина).
 *
 * Эх сурвалж: docs/2027/2027-website-content.md, docs/2027/2027-technical-brief-mn.md
 * Үнэ: USD / хүн, бүлгийн хэмжээгээр. Баримтаас яг хуулсан — тэгшлэхгүй.
 * (Фото аяллын 6 хүний үнэ 5 хүнийхээс өндөр нь 2 дахь машинаас шалтгаалсан, зориуд.)
 *
 * Япон (ja) текстийг баримтад байхгүй тул орчуулсан — мэргэжлийн хүнээр шалгуулах.
 */

export type SiteLang = "en" | "ko" | "mn" | "ja";
export const SITE_LANGS: readonly SiteLang[] = ["en", "ko", "mn", "ja"] as const;
export const DEFAULT_LANG: SiteLang = "en";

export type L10n = Record<SiteLang, string>;

export type TourSlug =
  | "summer-fishing"
  | "winter-ice-fishing"
  | "wildlife-photography"
  | "nomadic-culture"
  | "winter-hunting";

/** inquiry = үнийн тооцоолуур + хүсэлт; info_only = зөвхөн мэдээллийн хүсэлт (үнэ, төлбөр байхгүй) */
export type TourStatus = "inquiry" | "info_only";

export type SeasonTag = "summer" | "winter";

export type FixedDeparture = {
  /** YYYY-MM-DD */
  start: string;
  /** YYYY-MM-DD */
  end: string;
};

/** Жил бүр давтагдах хаалттай хугацаа (сар/өдөр, хоёр тал нь орно) */
export type BlackoutRange = {
  from: { month: number; day: number };
  to: { month: number; day: number };
};

export type TourCatalogEntry = {
  slug: TourSlug;
  status: TourStatus;
  name: L10n;
  days: number;
  nights: number;
  minPeople: number;
  maxPeople: number;
  /** Tours хуудасны шүүлтүүрт. Хоосон = баримтад улирал заагаагүй */
  seasons: SeasonTag[];
  /** Карт дээрх байршил / улирлын мөр (баримтаас) */
  tagline: L10n;
  /** Нэг хүний USD үнэ, түлхүүр = хүний тоо. info_only аялалд байхгүй. */
  pricesUsd?: Readonly<Record<number, number>>;
  /** Зөвхөн эдгээр огноонд явна (фото аялал) */
  fixedDepartures?: FixedDeparture[];
  /** Жил бүрийн хаалттай хугацаа (зуны загасчлал: 3/22–6/22) */
  blackout?: BlackoutRange[];
  /** Зөвхөн эдгээр саруудад ажиллана (1–12). Байхгүй бол хязгааргүй. */
  operatingMonths?: number[];
  airportTransferIncluded: boolean;
};

export const DEPOSIT_RATE = 0.3;
export const BALANCE_RATE = 0.7;

export const TOURS_2027: readonly TourCatalogEntry[] = [
  {
    slug: "summer-fishing",
    status: "inquiry",
    name: {
      en: "Summer Freshwater Fishing Expedition",
      ko: "여름 민물낚시 탐험",
      mn: "Зуны цэнгэг усны загасчлал",
      ja: "夏の淡水釣りエクスペディション",
    },
    days: 4,
    nights: 3,
    minPeople: 1,
    maxPeople: 6,
    seasons: ["summer"],
    tagline: {
      en: "Kherlen River / Mungunmorit",
      ko: "헤를렌강 / 뭉근모리트",
      mn: "Хэрлэн / Мөнгөнморьт",
      ja: "ヘルレン川 / ムングンモリト",
    },
    pricesUsd: { 1: 5841, 2: 2988, 3: 2037, 4: 1562, 5: 1277, 6: 1086 },
    blackout: [{ from: { month: 3, day: 22 }, to: { month: 6, day: 22 } }],
    airportTransferIncluded: true,
  },
  {
    slug: "winter-ice-fishing",
    status: "inquiry",
    name: {
      en: "Winter Ice Fishing Expedition",
      ko: "겨울 얼음낚시 탐험",
      mn: "Өвлийн мөсөн загасчлал",
      ja: "冬の氷上釣りエクスペディション",
    },
    days: 4,
    nights: 3,
    minPeople: 1,
    maxPeople: 6,
    seasons: ["winter"],
    tagline: {
      en: "December–February",
      ko: "12월~2월",
      mn: "12–2-р сар",
      ja: "12月〜2月",
    },
    pricesUsd: { 1: 5960, 2: 3048, 3: 2077, 4: 1592, 5: 1300, 6: 1106 },
    operatingMonths: [12, 1, 2],
    airportTransferIncluded: true,
  },
  {
    slug: "wildlife-photography",
    status: "inquiry",
    name: {
      en: "Wildlife & Nature Photography Expedition",
      ko: "야생동물·자연 사진 탐험",
      mn: "Зэрлэг амьтан, байгалийн гэрэл зураг",
      ja: "野生動物・自然写真エクスペディション",
    },
    days: 5,
    nights: 4,
    minPeople: 3,
    maxPeople: 8,
    seasons: ["summer"],
    tagline: {
      en: "June 16–20 & August 18–22, 2027",
      ko: "2027년 6월 16~20일 / 8월 18~22일",
      mn: "2027.06.16–20 / 2027.08.18–22",
      ja: "2027年6月16〜20日 / 8月18〜22日",
    },
    // 6 хүний үнэ 5 хүнийхээс өндөр — 2 машин шаардлагатай. ЗОРИУД, бүү засаарай.
    pricesUsd: { 3: 1962, 4: 1530, 5: 1271, 6: 1507, 7: 1325, 8: 1189 },
    fixedDepartures: [
      { start: "2027-06-16", end: "2027-06-20" },
      { start: "2027-08-18", end: "2027-08-22" },
    ],
    airportTransferIncluded: true,
  },
  {
    slug: "nomadic-culture",
    status: "inquiry",
    name: {
      en: "Nomadic Culture Experience",
      ko: "몽골 유목 문화 체험",
      mn: "Нүүдлийн соёлын аялал",
      ja: "遊牧文化体験",
    },
    days: 4,
    nights: 3,
    minPeople: 1,
    maxPeople: 6,
    // TODO(content): баримтад улирал заагаагүй — шүүлтүүрт "All" дээр л гарна.
    seasons: [],
    tagline: {
      en: "Arburd",
      ko: "아르부르드",
      mn: "Ар бүрд",
      ja: "アルブルド",
    },
    pricesUsd: { 1: 1990, 2: 1190, 3: 890, 4: 750, 5: 690, 6: 650 },
    airportTransferIncluded: true,
  },
  {
    slug: "winter-hunting",
    status: "info_only",
    name: {
      en: "Winter Hunting Expedition",
      ko: "겨울 사냥 탐험",
      mn: "Өвлийн ангийн аялал",
      ja: "冬の狩猟エクスペディション",
    },
    days: 6,
    nights: 5,
    minPeople: 1,
    maxPeople: 4,
    seasons: ["winter"],
    tagline: {
      en: "Winter",
      ko: "겨울",
      mn: "Өвөл",
      ja: "冬",
    },
    airportTransferIncluded: false,
  },
];

/** Хуучин slug → шинэ slug (301 redirect) */
export const LEGACY_TOUR_SLUGS: Readonly<Record<string, TourSlug>> = {
  "bird-photography": "wildlife-photography",
  "kherlen-fishing": "summer-fishing",
  "arburd-gobi": "nomadic-culture",
  "winter-hunting": "winter-hunting",
};

export const PRICE_ON_REQUEST: L10n = {
  en: "Price on request",
  ko: "가격 문의",
  mn: "Үнэ хүсэлтээр",
  ja: "料金はお問い合わせ",
};

export const ESTIMATE_DISCLAIMER: L10n = {
  en: "Estimate only — subject to written confirmation",
  ko: "예상 금액입니다 — 서면 확정 후 유효합니다",
  mn: "Зөвхөн урьдчилсан тооцоо — бичгээр баталгаажуулна",
  ja: "概算です — 書面での確定が必要です",
};

export function isSiteLang(value: unknown): value is SiteLang {
  return typeof value === "string" && (SITE_LANGS as readonly string[]).includes(value);
}

export function isTourSlug(value: unknown): value is TourSlug {
  return typeof value === "string" && TOURS_2027.some((t) => t.slug === value);
}

export function getTour2027(slug: string): TourCatalogEntry | undefined {
  return TOURS_2027.find((t) => t.slug === slug);
}

export function resolveTourSlug(slug: string): TourSlug | undefined {
  if (isTourSlug(slug)) return slug;
  return LEGACY_TOUR_SLUGS[slug];
}

export function isPriced(tour: TourCatalogEntry): boolean {
  return tour.status === "inquiry" && Boolean(tour.pricesUsd);
}

export function getPricePerPersonUsd(slug: string, people: number): number | null {
  const tour = getTour2027(slug);
  if (!tour || !isPriced(tour)) return null;
  if (!Number.isInteger(people)) return null;
  return tour.pricesUsd?.[people] ?? null;
}

/** Хамгийн бага нэг хүний үнэ ("from $X" карт дээр). info_only бол null. */
export function getFromPriceUsd(slug: string): number | null {
  const tour = getTour2027(slug);
  if (!tour || !isPriced(tour) || !tour.pricesUsd) return null;
  return Math.min(...Object.values(tour.pricesUsd));
}

export type Quote = {
  pricePerPersonUsd: number;
  people: number;
  totalUsd: number;
  depositUsd: number;
  balanceUsd: number;
};

/** Нэг хүний үнэ × хүн = нийт; 30% урьдчилгаа (бүхэл доллар), үлдэгдэл = нийт − урьдчилгаа */
export function quote(slug: string, people: number): Quote | null {
  const perPerson = getPricePerPersonUsd(slug, people);
  if (perPerson === null) return null;
  const totalUsd = perPerson * people;
  const depositUsd = Math.round(totalUsd * DEPOSIT_RATE);
  return {
    pricePerPersonUsd: perPerson,
    people,
    totalUsd,
    depositUsd,
    balanceUsd: totalUsd - depositUsd,
  };
}

export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

// ─── Огноо ───────────────────────────────────────────────────────────────

/** "YYYY-MM-DD" → {y, m, d}; буруу бол null (timezone-оос хамааралгүй) */
export function parseIsoDate(value: string): { y: number; m: number; d: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const probe = new Date(Date.UTC(y, m - 1, d));
  if (
    probe.getUTCFullYear() !== y ||
    probe.getUTCMonth() !== m - 1 ||
    probe.getUTCDate() !== d
  ) {
    return null;
  }
  return { y, m, d };
}

function monthDayKey(month: number, day: number): number {
  return month * 100 + day;
}

export function isInBlackout(tour: TourCatalogEntry, isoDate: string): boolean {
  const parsed = parseIsoDate(isoDate);
  if (!parsed || !tour.blackout) return false;
  const key = monthDayKey(parsed.m, parsed.d);
  return tour.blackout.some((r) => {
    const from = monthDayKey(r.from.month, r.from.day);
    const to = monthDayKey(r.to.month, r.to.day);
    return from <= to ? key >= from && key <= to : key >= from || key <= to;
  });
}

export function isInOperatingMonths(tour: TourCatalogEntry, isoDate: string): boolean {
  const parsed = parseIsoDate(isoDate);
  if (!parsed) return false;
  if (!tour.operatingMonths) return true;
  return tour.operatingMonths.includes(parsed.m);
}

export type InquiryValidationError =
  | "unknown_tour"
  | "party_size"
  | "date_invalid"
  | "date_past"
  | "date_blackout"
  | "date_out_of_season"
  | "date_not_fixed_departure";

/**
 * Аялал, хүний тоо, огноог шалгана (client болон server ижил дүрэм).
 * `todayIso` — "YYYY-MM-DD", өнөөдрөөс өмнөх огноог хаана.
 */
export function validateInquirySelection(
  slug: string,
  people: number,
  preferredDate: string,
  todayIso: string,
): InquiryValidationError[] {
  const tour = getTour2027(slug);
  if (!tour) return ["unknown_tour"];

  const errors: InquiryValidationError[] = [];

  if (!Number.isInteger(people) || people < tour.minPeople || people > tour.maxPeople) {
    errors.push("party_size");
  }

  if (!parseIsoDate(preferredDate)) {
    errors.push("date_invalid");
    return errors;
  }

  if (preferredDate < todayIso) {
    errors.push("date_past");
  }

  if (tour.fixedDepartures) {
    if (!tour.fixedDepartures.some((d) => d.start === preferredDate)) {
      errors.push("date_not_fixed_departure");
    }
    return errors;
  }

  if (isInBlackout(tour, preferredDate)) errors.push("date_blackout");
  if (!isInOperatingMonths(tour, preferredDate)) errors.push("date_out_of_season");

  return errors;
}

export function todayIsoUtc(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}
