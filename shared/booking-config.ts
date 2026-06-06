/** Урьдчилгаа — нийт үнийн хувь */
export const DEPOSIT_RATE = 0.1;

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
    bookable: true,
    maxPeople: 3,
    priceTiers: [
      { minPeople: 1, maxPeople: 1, pricePerPersonKrw: 2_600_000 },
      { minPeople: 2, maxPeople: 2, pricePerPersonKrw: 2_200_000 },
      { minPeople: 3, maxPeople: 3, pricePerPersonKrw: 2_000_000 },
    ],
  },
  {
    slug: "kherlen-fishing",
    titleMn: "Цэнгэг усны загасчлалын аялал",
    titleKo: "민물 낚시 탐험",
    titleEn: "Freshwater Fishing Expedition",
    bookable: true,
  },
  {
    slug: "arburd-gobi",
    titleMn: "Нүүдэлчдийн соёлын аялал",
    titleKo: "유목 문화 체험",
    titleEn: "Nomadic Culture Experience",
    bookable: true,
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
  if (pricePerPerson === null) {
    return { pricePerPersonKrw: null, totalKrw: null, depositKrw: null };
  }
  const totalKrw = pricePerPerson * people;
  const depositKrw = Math.round(totalKrw * DEPOSIT_RATE);
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
    bankName: process.env.BANK_NAME || "Хаан банк",
    accountNumber: process.env.BANK_ACCOUNT_NUMBER || "MN35 0004 000 433070088",
    accountHolder: process.env.BANK_ACCOUNT_HOLDER || "Олон Нуур Трэвел",
    transferDeadlineHours: Number(process.env.BANK_TRANSFER_DEADLINE_HOURS || "48"),
  };
}

export function formatKrw(amount: number): string {
  return `₩${amount.toLocaleString("ko-KR")}`;
}
