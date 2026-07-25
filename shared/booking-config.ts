/** Урьдчилгаа — бүх захиалгад тогтмол дүн (KRW) */
export const DEPOSIT_AMOUNT_KRW = 50_000;

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
  /** Захиалгын хамгийн их хүний тоо (байхгүй бол 20) */
  maxPeople?: number;
  priceTiers?: PriceTier[];
};

export const BOOKING_TOUR_OPTIONS: BookingTourOption[] = [
  {
    slug: "bird-photography",
    titleMn: "Шувуудын гэрэл зургийн аялал",
    titleKo: "조류 사진 탐험",
    titleEn: "Bird Photography Expedition",
    titleJa: "野鳥写真エクスペディション",
    bookable: true,
    maxPeople: 5,
    priceTiers: [
      { minPeople: 1, maxPeople: 3, pricePerPersonKrw: 2_600_000 },
      { minPeople: 4, maxPeople: 4, pricePerPersonKrw: 2_200_000 },
      { minPeople: 5, maxPeople: 5, pricePerPersonKrw: 2_000_000 },
    ],
  },
  {
    slug: "kherlen-fishing",
    titleMn: "Цэнгэг усны загасчлалын аялал",
    titleKo: "민물 낚시 탐험",
    titleEn: "Freshwater Fishing Expedition",
    titleJa: "淡水釣りエクスペディション",
    bookable: true,
    maxPeople: 5,
    priceTiers: [
      { minPeople: 1, maxPeople: 1, pricePerPersonKrw: 1_490_000 },
      { minPeople: 2, maxPeople: 2, pricePerPersonKrw: 1_390_000 },
      { minPeople: 3, maxPeople: 3, pricePerPersonKrw: 1_190_000 },
      { minPeople: 4, maxPeople: 4, pricePerPersonKrw: 990_000 },
      { minPeople: 5, maxPeople: 5, pricePerPersonKrw: 890_000 },
    ],
  },
  {
    slug: "arburd-gobi",
    titleMn: "Нүүдэлчдийн соёлын аялал",
    titleKo: "아르부르드 고비 3박4일 투어",
    titleEn: "Arburd Gobi · 3 Nights 4 Days",
    titleJa: "アルブルド・ゴビ 3泊4日",
    bookable: true,
    maxPeople: 5,
    priceTiers: [
      { minPeople: 1, maxPeople: 1, pricePerPersonKrw: 1_500_000 },
      { minPeople: 2, maxPeople: 2, pricePerPersonKrw: 1_300_000 },
      { minPeople: 3, maxPeople: 3, pricePerPersonKrw: 1_090_000 },
      { minPeople: 4, maxPeople: 4, pricePerPersonKrw: 990_000 },
      { minPeople: 5, maxPeople: 5, pricePerPersonKrw: 890_000 },
    ],
  },
];

export function getBookingTour(slug: string): BookingTourOption | undefined {
  return BOOKING_TOUR_OPTIONS.find((t) => t.slug === slug);
}

export function getMaxPeopleForTour(slug: string): number {
  return getBookingTour(slug)?.maxPeople ?? 20;
}

export function getPricePerPersonKrw(slug: string, people: number): number | null {
  const tour = getBookingTour(slug);
  if (!tour?.priceTiers?.length) return null;

  const tier = tour.priceTiers.find(
    (t) => people >= t.minPeople && people <= t.maxPeople,
  );
  return tier?.pricePerPersonKrw ?? null;
}

export function calculateBookingAmounts(slug: string, people: number) {
  const pricePerPerson = getPricePerPersonKrw(slug, people);
  const depositKrw = DEPOSIT_AMOUNT_KRW;
  if (pricePerPerson === null) {
    return { pricePerPersonKrw: null, totalKrw: null, depositKrw };
  }
  const totalKrw = pricePerPerson * people;
  return { pricePerPersonKrw: pricePerPerson, totalKrw, depositKrw };
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
