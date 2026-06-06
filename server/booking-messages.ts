import type { Booking } from "@shared/schema";
import { DEPOSIT_RATE, formatKrw, getBankTransferInfo, getBookingTour } from "@shared/booking-config";
import { emailLangFromNationality } from "@shared/nationalities";

type Lang = "mn" | "ko" | "en";

const COMPANY = {
  mn: "Olon Nuur Travel LLC",
  ko: "Olon Nuur Travel LLC",
  en: "Olon Nuur Travel LLC",
};

type TourCopy = {
  duration: Record<Lang, string>;
  guideline: Record<Lang, string[]>;
  packing: Record<Lang, string[]>;
  included: Record<Lang, string[]>;
  excluded: Record<Lang, string[]>;
};

const TOUR_COPY: Record<string, TourCopy> = {
  "bird-photography": {
    duration: {
      mn: "5 өдөр / 4 шөнө",
      ko: "5일 / 4박",
      en: "5 days / 4 nights",
    },
    guideline: {
      mn: [
        "Монголд ирэхээс 1–2 өдрийн өмнө бидэнтэй холбогдож нислэгийн цаг, буудалд тосох талаар баталгаажуулна уу.",
        "Аялал: Улаанбаатар → Хөх бүрд → Эрдэнэсант → Жаргалант → Баян нуур → Улаанбаатар.",
        "Аяллын эхлэх өдөр өглөө 08:00 цагт уулзалтын цэгт бэлэн байна уу.",
        "Аялал дууссаны дараа Улаанбаатар хотод буцна.",
      ],
      ko: [
        "몽골 도착 1–2일 전 항공편과 공항 픽업 시간을 확인해 주세요.",
        "일정: 울란바토르 → 호흐부르드 → 에르덴산트 → 자르갈란트 → 바얀누르 → 울란바토르.",
        "출발 당일 오전 08:00까지 집합 장소에 도착해 주세요.",
        "투어 종료 후 울란바토르로 복귀합니다.",
      ],
      en: [
        "Please contact us 1–2 days before arrival to confirm your flight and airport pickup.",
        "Route: Ulaanbaatar → Khokh Burd → Erdene Santi → Jargalant → Bayan Nuur → Ulaanbaatar.",
        "Be ready at the meeting point at 08:00 on the first tour day.",
        "After the tour you will return to Ulaanbaatar.",
      ],
    },
    packing: {
      mn: [
        "Дулаан хувцас (өвлийн/хүйтний улиралд)",
        "Зургалтын камер, телескоп, нэмэлт батерей",
        "Нарны шил, малгай, бүрэн гутал",
        "Хувийн эм, аяллын даатгалын баримт",
      ],
      ko: [
        "따뜻한 옷 (계절에 맞게)",
        "카메라, 망원렌즈, 여분 배터리",
        "선글라스, 모자, 튼튼한 신발",
        "개인 의약품, 여행자 보험 서류",
      ],
      en: [
        "Warm clothing (season-appropriate)",
        "Camera, telephoto lens, spare batteries",
        "Sunglasses, hat, sturdy footwear",
        "Personal medication, travel insurance documents",
      ],
    },
    included: {
      mn: [
        "Нисэх буудлаас тосох, хүргэх",
        "Бүх дотоодын тээвэр, байр, хоол (өглөө, өдөр, орой)",
        "Мэргэжлийн шувуу судлаач хөтөч, жолооч, тогооч",
      ],
      ko: [
        "공항 픽업 및 샌딩",
        "국내 교통, 숙박, 식사(조·중·석)",
        "전문 조류 가이드, 운전기사, 요리사",
      ],
      en: [
        "Airport pickup and drop-off",
        "Domestic transport, lodging, meals (B/L/D)",
        "Professional bird guide, driver, chef",
      ],
    },
    excluded: {
      mn: [
        "Олон улсын нислэг",
        "Аялалын өмнөх/дараах хотын зочид буудал",
        "Хувийн зардал, согтууруулах ундаа",
        "Аяллын даатгал (заавал)",
      ],
      ko: [
        "국제 항공권",
        "투어 전후 도시 호텔",
        "개인 비용, 주류",
        "여행자 보험(필수)",
      ],
      en: [
        "International flights",
        "City hotels before/after the tour",
        "Personal expenses, alcohol",
        "Travel insurance (required)",
      ],
    },
  },
};

const DEFAULT_COPY: TourCopy = {
  duration: { mn: "—", ko: "—", en: "—" },
  guideline: {
    mn: ["Бид таны ирсний дараа дэлгэрэнгүй хуваарийг имэйлээр илгээнэ."],
    ko: ["도착 후 상세 일정을 이메일로 안내해 드립니다."],
    en: ["We will email you a detailed itinerary after arrival."],
  },
  packing: {
    mn: ["Дулаан хувцас, хувийн эм, аяллын даатгалын баримт."],
    ko: ["따뜻한 옷, 개인 의약품, 여행자 보험."],
    en: ["Warm clothes, personal medication, travel insurance."],
  },
  included: {
    mn: ["Дотоодын тээвэр, байр, хоол (турын төрлөөс хамаарна)."],
    ko: ["국내 교통, 숙박, 식사(투어에 따라)."],
    en: ["Domestic transport, lodging, meals (varies by tour)."],
  },
  excluded: {
    mn: ["Олон улсын нислэг, хувийн зардал, даатгал."],
    ko: ["국제 항공, 개인 비용, 보험."],
    en: ["International flights, personal expenses, insurance."],
  },
};

function bullets(items: string[]): string {
  return items.map((i) => `  • ${i}`).join("\n");
}

function formatDate(travelDate: string, lang: Lang): string {
  try {
    const d = new Date(travelDate.includes("T") ? travelDate : `${travelDate}T12:00:00`);
    const locale = lang === "ko" ? "ko-KR" : lang === "en" ? "en-US" : "mn-MN";
    return d.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return travelDate;
  }
}

function tourTitleForLang(tourSlug: string, lang: Lang): string {
  const tour = getBookingTour(tourSlug);
  if (!tour) return tourSlug;
  if (lang === "ko") return tour.titleKo;
  if (lang === "en") return tour.titleEn;
  return tour.titleMn;
}

export function buildBookingConfirmation(
  booking: Booking,
  lang: Lang = (booking.lang as Lang) || "mn",
): { subject: string; text: string } {
  const L = lang;
  const copy = TOUR_COPY[booking.tourSlug] ?? DEFAULT_COPY;
  const bank = getBankTransferInfo();
  const dateStr = formatDate(booking.travelDate, L);
  const depositPercent = Math.round(DEPOSIT_RATE * 100);

  const totalStr = booking.totalAmountKrw
    ? formatKrw(booking.totalAmountKrw)
    : L === "ko"
      ? "별도 안내"
      : L === "en"
        ? "On request"
        : "Тусгайлан мэдэгдэнэ";
  const depositStr = booking.depositAmountKrw
    ? formatKrw(booking.depositAmountKrw)
    : L === "ko"
      ? "별도 안내"
      : L === "en"
        ? "On request"
        : "Тусгайлан мэдэгдэнэ";

  const greeting =
    L === "ko"
      ? `안녕하세요, ${booking.fullName}님! (${booking.email})\n\n올론 누르 트래블(Olon Nuur Travel LLC)입니다. 몽골의 희귀한 자연과 진정한 유목 문화를 경험하는 프리미엄 여행사입니다.`
      : L === "en"
        ? `Hello ${booking.fullName} (${booking.email}),\n\nThank you for contacting Olon Nuur Travel LLC — a premium expedition company sharing rare Mongolia and authentic nomadic experiences.`
        : `Сайн байна уу, ${booking.fullName}? (${booking.email})\n\nБид Olon Nuur Travel LLC — Монголын ховор аяллын туршлагыг санал болгодог компани.`;

  const sections =
    L === "ko"
      ? {
          tour: "선택하신 투어",
          when: "여행 일정",
          duration: "기간",
          people: "인원",
          price: "요금 안내",
          total: "총 금액",
          deposit: `예약금 (${depositPercent}%, ${bank.transferDeadlineHours}시간 이내 입금)`,
          included: "포함 사항",
          excluded: "불포함 사항",
          guide: "일정 안내",
          pack: "준비물",
          bank: "입금 계좌",
          thanks:
            "저희를 선택해 주셔서 진심으로 감사합니다. 곧 몽골에서 뵙겠습니다!",
          requests: booking.specialRequests
            ? `특별 요청: ${booking.specialRequests}`
            : null,
          bookingNo: "예약 번호",
          contact: "연락처",
          phone: "전화번호",
          email: "이메일",
        }
      : L === "en"
        ? {
            tour: "Selected tour",
            when: "Travel date",
            duration: "Duration",
            people: "Guests",
            price: "Pricing",
            total: "Total",
            deposit: `Deposit (${depositPercent}%, within ${bank.transferDeadlineHours} hours)`,
            included: "Included",
            excluded: "Not included",
            guide: "Itinerary guide",
            pack: "What to bring",
            bank: "Bank transfer",
            thanks:
              "Thank you for choosing us — we look forward to welcoming you to Mongolia!",
            requests: booking.specialRequests
              ? `Special requests: ${booking.specialRequests}`
              : null,
            bookingNo: "Booking number",
            contact: "Contact details",
            phone: "Phone",
            email: "Email",
          }
        : {
            tour: "Сонгосон аялал",
            when: "Аялах огноо",
            duration: "Хугацаа",
            people: "Хүний тоо",
            price: "Үнийн мэдээлэл",
            total: "Нийт үнэ",
            deposit: `Урьдчилгаа (${depositPercent}%, ${bank.transferDeadlineHours} цагийн дотор шилжүүлнэ)`,
            included: "Үнэнд багтсан",
            excluded: "Үнэнд багтаагүй",
            guide: "Товч хөтөлбөр",
            pack: "Авч явах зүйлс",
            bank: "Дансны мэдээлэл",
            thanks:
              "Манай компанийг сонгосонд баярлалаа. Удахгүй Монголд угтахдаа баяртай байна!",
            requests: booking.specialRequests
              ? `Тусгай хүсэлт: ${booking.specialRequests}`
              : null,
            bookingNo: "Захиалгын дугаар",
            contact: "Холбоо барих",
            phone: "Утас",
            email: "Имэйл",
          };

  const text = [
    greeting,
    "",
    `— ${sections.bookingNo}: ${booking.bookingNumber} —`,
    "",
    `【${sections.contact}】`,
    `${sections.phone}: ${booking.phone}`,
    `${sections.email}: ${booking.email}`,
    "",
    `【${sections.tour}】`,
    tourTitleForLang(booking.tourSlug, L),
    "",
    `【${sections.when}】`,
    dateStr,
    `${sections.duration}: ${copy.duration[L]}`,
    `${sections.people}: ${booking.numberOfPeople}${
      L === "ko" ? "명" : L === "en" ? " guest(s)" : " хүн"
    }`,
    sections.requests ?? "",
    "",
    `【${sections.price}】`,
    `${sections.total}: ${totalStr}`,
    `${sections.deposit}: ${depositStr}`,
    "",
    `【${sections.included}】`,
    bullets(copy.included[L]),
    "",
    `【${sections.excluded}】`,
    bullets(copy.excluded[L]),
    "",
    `【${sections.guide}】`,
    bullets(copy.guideline[L]),
    "",
    `【${sections.pack}】`,
    bullets(copy.packing[L]),
    "",
    `【${sections.bank}】`,
    `${bank.bankName}`,
    `${bank.accountNumber}`,
    `${bank.accountHolder}`,
    "",
    sections.thanks,
    "",
    COMPANY[L],
    "www.olonnuurtravel.mn",
    "olonnuurtravel@gmail.com",
    "+976 8801 2341 / +976 7270 4120",
  ]
    .filter(Boolean)
    .join("\n");

  const subject =
    L === "ko"
      ? `[Olon Nuur Travel] 예약 접수 — ${booking.bookingNumber}`
      : L === "en"
        ? `[Olon Nuur Travel] Booking received — ${booking.bookingNumber}`
        : `[Olon Nuur Travel] Захиалга хүлээн авлаа — ${booking.bookingNumber}`;

  return { subject, text };
}

const BILINGUAL_DIVIDER =
  "\n\n════════════════════════════════\nEnglish\n════════════════════════════════\n\n";

/** Захиалагчид — иргэншлийн хэлээр, доор англи (хэрэв үндсэн хэл англи биш бол) */
export function buildCustomerBookingEmail(booking: Booking): {
  subject: string;
  text: string;
} {
  const primary = emailLangFromNationality(booking.nationality);
  console.log(
    "[email] booking=%s nationality=%s → lang=%s",
    booking.bookingNumber,
    booking.nationality,
    primary,
  );
  const primaryEmail = buildBookingConfirmation(booking, primary);
  if (primary === "en") {
    return primaryEmail;
  }
  const englishEmail = buildBookingConfirmation(booking, "en");
  return {
    subject: primaryEmail.subject,
    text: `${primaryEmail.text}${BILINGUAL_DIVIDER}${englishEmail.text}`,
  };
}

/** Kakao / Make.com — богино текст */
export function buildKakaoMessage(booking: Booking): string {
  const { text } = buildCustomerBookingEmail(booking);
  const max = 900;
  if (text.length <= max) return text;
  return `${text.slice(0, max - 3)}...`;
}
