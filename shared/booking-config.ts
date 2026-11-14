/**
 * Booking form-ийн аяллын жагсаалт.
 *
 * Аялал, нэр (4 хэл), хүний тооны хязгаар, статусыг гараар бичихгүй —
 * shared/tours-2027.ts (TOURS_2027)-аас үүсгэнэ. Ингэснээр сайт дээрх аяллууд
 * болон захиалгын dropdown дахин зөрөхгүй.
 *
 * TODO(4–5-р алхам): энэ урсгалыг (KRW нийт үнэ, банкны данс) USD inquiry
 * урсгалаар солино (30% урьдчилгаа, банкны мэдээлэл quote-ийн дараа).
 */
import { TOURS_2027, formatUsd, resolveTourSlug, type SiteLang } from "./tours-2027";

export { formatUsd };

/**
 * Урьдчилгаа — бүх аялалд тогтмол дүн (USD). Хуучин: ₩50,000.
 * Анхаар: 2027 баримтын FAQ/Payment-д "30% deposit" гэж бичсэн хэвээр.
 * Нийт үнэ (priceTiers) KRW хэвээр.
 */
export const DEPOSIT_AMOUNT_USD = 10;

export type PriceTier = {
  minPeople: number;
  maxPeople: number;
  pricePerPersonKrw: number;
};

export type BookingTourOption = {
  slug: string;
  titleMn: string;
  titleKo: string;
  titleEn: string;
  titleJa: string;
  bookable: boolean;
  /** true = зөвхөн мэдээллийн хүсэлт (Winter Hunting): үнэ, урьдчилгаа, банкны мэдээлэл байхгүй */
  inquiryOnly: boolean;
  minPeople: number;
  maxPeople: number;
  /**
   * TODO(content): 2027 баримтад зөвхөн USD үнэ байгаа (shared/tours-2027.ts → pricesUsd).
   * KRW үнийг таамаглахгүйн тулд хоосон үлдээв. 4–5-р алхамд USD тооцоолуураар солигдоно.
   */
  priceTiers?: PriceTier[];
};

export const BOOKING_TOUR_OPTIONS: BookingTourOption[] = TOURS_2027.map((tour) => ({
  slug: tour.slug,
  titleMn: tour.name.mn,
  titleKo: tour.name.ko,
  titleEn: tour.name.en,
  titleJa: tour.name.ja,
  // Hunting-ийг dropdown-д харуулж мэдээллийн хүсэлт авна, гэхдээ төлбөр тооцохгүй
  bookable: true,
  inquiryOnly: tour.status === "info_only",
  minPeople: tour.minPeople,
  maxPeople: tour.maxPeople,
  priceTiers: undefined,
}));

/** Хуучин slug (bird-photography гэх мэт) ирвэл шинэ slug руу хөрвүүлнэ */
export function getBookingTour(slug: string): BookingTourOption | undefined {
  const resolved = resolveTourSlug(slug) ?? slug;
  return BOOKING_TOUR_OPTIONS.find((t) => t.slug === resolved);
}

export function getMaxPeopleForTour(slug: string): number {
  return getBookingTour(slug)?.maxPeople ?? 20;
}

export function getMinPeopleForTour(slug: string): number {
  return getBookingTour(slug)?.minPeople ?? 1;
}

export function getBookingTourTitle(slug: string, lang: SiteLang): string | undefined {
  const tour = getBookingTour(slug);
  if (!tour) return undefined;
  return { mn: tour.titleMn, ko: tour.titleKo, en: tour.titleEn, ja: tour.titleJa }[lang];
}

export function getPricePerPersonKrw(slug: string, people: number): number | null {
  const tour = getBookingTour(slug);
  if (!tour?.priceTiers?.length) return null;
  const tier = tour.priceTiers.find((t) => people >= t.minPeople && people <= t.maxPeople);
  return tier?.pricePerPersonKrw ?? null;
}

export function calculateBookingAmounts(slug: string, people: number) {
  const tour = getBookingTour(slug);
  // Мэдээллийн хүсэлт: үнэ, урьдчилгаа огт тооцохгүй
  if (!tour || tour.inquiryOnly) {
    return { pricePerPersonKrw: null, totalKrw: null, depositUsd: null };
  }
  const pricePerPerson = getPricePerPersonKrw(slug, people);
  const depositUsd = DEPOSIT_AMOUNT_USD;
  if (pricePerPerson === null) {
    return { pricePerPersonKrw: null, totalKrw: null, depositUsd };
  }
  const totalKrw = pricePerPerson * people;
  return { pricePerPersonKrw: pricePerPerson, totalKrw, depositUsd };
}

export type BankTransferInfo = {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  transferDeadlineHours: number;
};

export function getBankTransferInfo(): BankTransferInfo {
  return {
    bankName: process.env.BANK_NAME || "Худалдаа хөгжил банк",
    accountNumber: process.env.BANK_ACCOUNT_NUMBER || "MN35 0004 000 433070088",
    accountHolder: process.env.BANK_ACCOUNT_HOLDER || "Олон Нуур Трэвел",
    transferDeadlineHours: Number(process.env.BANK_TRANSFER_DEADLINE_HOURS || "48"),
  };
}

export function formatKrw(amount: number): string {
  return `₩${amount.toLocaleString("ko-KR")}`;
}
