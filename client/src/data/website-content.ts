/**
 * OLON NUUR TRAVEL — вэбсайтын олон хэлний контент
 * Эх сурвалж: OLON_NUUR_Website_Content_Multilingual.docx
 */
import type { Lang } from "@/lib/lang";
import type { LocalizedString } from "@/data/tours";

export const CONTACT = {
  phones: ["+976 88012341", "+976 72704120"],
  phoneHref: ["tel:+97688012341", "tel:+97672704120"],
  email: "olonnuurtravel@gmail.com",
  instagram: "@olonnurtravel",
  instagramUrl: "https://www.instagram.com/olonnurtravel/",
  website: "www.olonnuurtravel.mn",
  websiteUrl: "https://www.olonnuurtravel.mn",
} as const;

/** Нүүр хуудсан дээрх аяллын дараалал (docx-д 4 аялал) */
export const JOURNEY_SLUG_ORDER = [
  "bird-photography",
  "arburd-gobi",
  "kherlen-fishing",
  "winter-hunting",
] as const;

/** Docx-ийн маркетингийн нэр (карт дээр харагдах) */
/** Аяллын карт — улирал, дэлгэрэнгүй (design reference) */
export const TOUR_CARD_META: Record<
  string,
  { season: LocalizedString; detail: LocalizedString }
> = {
  "bird-photography": {
    season: {
      mn: "Компанийн зарласан хөтөлбөр",
      ko: "회사 공지 출발 일정",
      en: "Company-scheduled departures",
    },
    detail: {
      mn: "Эхний хөтөлбөр: 2026.08.12 – 08.16",
      ko: "첫 출발: 2026년 8월 12일 – 16일",
      en: "First departure: Aug 12 – 16, 2026",
    },
  },
  "arburd-gobi": {
    season: { mn: "6.20 – 9.20", ko: "6월 20일 – 9월 20일", en: "Jun 20 – Sep 20" },
    detail: { mn: "Зуны соёлын аялал", ko: "여름 문화 체험", en: "Summer cultural journey" },
  },
  "kherlen-fishing": {
    season: {
      mn: "3.22 – 6.22-аас бусад хугацаанд",
      ko: "3월 22일 – 6월 22일 외 기간",
      en: "Outside Mar 22 – Jun 22",
    },
    detail: { mn: "Улирлын голын амралт", ko: "계절 강변 리트릿", en: "Seasonal river retreat" },
  },
  "winter-hunting": {
    season: { mn: "Зөвхөн өвлийн улирал", ko: "겨울 시즌만", en: "Winter season only" },
    detail: {
      mn: "Огноог аялагчтай тохируулна",
      ko: "일정은 여행자와 협의",
      en: "Dates arranged with travelers",
    },
  },
};

export const TOUR_MARKETING_TITLES: Record<string, LocalizedString> = {
  "bird-photography": {
    mn: "Шувуудын гэрэл зургийн аялал",
    ko: "조류 사진 탐험",
    en: "Bird Photography Expedition",
  },
  "arburd-gobi": {
    mn: "Нүүдэлчдийн соёлын аялал",
    ko: "유목 문화 체험",
    en: "Nomadic Culture Experience",
  },
  "kherlen-fishing": {
    mn: "Цэнгэг усны загасчлалын аялал",
    ko: "민물 낚시 탐험",
    en: "Freshwater Fishing Expedition",
  },
  "winter-hunting": {
    mn: "Өвлийн тусгай аялал тун удахгүй",
    ko: "특별 원정 여행",
    en: "Special Winter Expedition",
  },
};

export const websiteContent = {
  mn: {
    heroTag: "",
    heroTitle: "Хүн бүрийн",
    heroTitleLine2: "Хүрч чадахгүй, Монгол!",
    heroDesc:
      "",
    exploreJourneys: "Аяллуудыг үзэх →",
    askDates: "Огноо асуух",
    featuredLabel: "Онцлох хөтөлбөр",
    featuredHighlights: [
      "Орон нутгийн мэргэжилтэн",
      "Жижиг баг",
      "4WD аялал",
      "Мартагдашгүй мөч",
    ],
    navHome: "Нүүр",
    navJourneys: "Аяллууд",
    navAbout: "Бидний тухай",
    navGallery: "Галерей",
    navBrochure: "Брошур",
    navBlog: "Блог",
    navBook: "Захиалга",
    navContact: "Холбоо барих",
    bookCta: "ЗАХИАЛАХ",
    bookNow: "ЗАХИАЛАХ",
    learnMore: "ДЭЛГЭРЭНГҮЙ",
    journeysLabel: "",
    journeysTitle: "Манай экспедицийн аяллууд",
    journeysSubtitle:
      "Монголын онгон байгаль, нүүдэлчин соёл, мэргэжлийн хөтөчтэй жижиг бүлгийн премиум аяллууд.",
    whySectionTitle: "Энгийн аялал биш. Ховор Монголын мөчүүд.",
    bookConsultation: "Зөвлөгөө авах",
    featuredDate: "2026.08.12 – 08.16 · 5 өдөр / 4 шөнө · Монгол",
    featuredPlace: "Монгол",
    whyTravelTitle: "Яагаад Olon Nuur Travel-тай аялах вэ?",
    whyTravelDesc:
      "Бид Монголын онгон байгаль, нүүдэлчин соёл, мэргэжлийн хөтөчтэй жижиг бүлгийн премиум аяллуудыг зохион байгуулдаг.",
    aboutUsBtn: "Бидний тухай →",
    footerReady: "Дараагийн аялалдаа бэлэн үү?",
    contactUsBtn: "Холбоо барих →",
    footerContactIntro: "Дараагийн адал явдлаа бидэнтэй хамт төлөвлөөрэй.",
    journeysDesc:
      "Шувууны зураг, нүүдэлчин соёл, загасчлал, өвлийн ан агнуур — улирлын жижиг бүлгийн аяллууд.",
    viewItinerary: "Хөтөлбөр үзэх",
    comingSoon: "Удахгүй",
    aboutLabel: "Бидний тухай",
    aboutTitle: "OLON NUUR TRAVEL",
    aboutDesc:
      "Бид Монголын онгон байгаль, нүүдэлчин соёл, мэргэжлийн хөтөчтэй жижиг бүлгийн премиум аяллуудыг зохион байгуулдаг. Олны аялал биш — жинхэнэ, ховор, мартагдашгүй мөчийг хайдаг аялагчдад зориулсан.",
    whyLabel: "Давуу тал",
    whyTitle: "Яагаад OLON NUUR?",
    whyItems: [
      ["experts", "Орон нутгийн мэргэжилтнүүд", "Монголын аяллын туршлагатай орон нутгийн хөтөч, зөвлөх баг."],
      ["groups", "Жижиг баг", "Хувийн, тайван, ойр дотно аяллын уур амьсгал."],
      ["safety", "Аюулгүй байдал", "Аюулгүй байдлыг эхний байранд тавьсан, сайтар төлөвлөсөн аялал."],
      ["comfort", "Тав тухтай аялал", "Чанартай тээвэр, байр, хоол — тав тухтай, чанартай үйлчилгээ."],
      ["responsible", "Хариуцлагатай аялал", "Байгаль, соёлыг хүндэтгэсэн, тогтвортой аяллын зарчим."],
      ["memories", "Мартагдашгүй мөчүүд", "Гэрэл зураг, дурсамж, түүх өгүүлэхэд тохирсон онцгой аялал."],
    ] as const,
    galleryLabel: "",
    galleryTitle: "Галерей",
    galleryItems: ["Бүргэд", "Гол хөндий", "Морьтой аялал", "Гэрэл зураг", "Гэр ба од", "Загасчлал"],
    brochureLabel: "Брошур",
    brochureTitle: "Аяллын брошур",
    brochureDesc: "Гурван аяллын үнэ, хөтөлбөр, багтсан зүйлсийг доорх брошураас үзнэ үү.",
    contactLabel: "Захиалга",
    contactTitle: "Дараагийн аяллаа бидэнтэй хамт төлөвлөөрэй.",
    contactDesc:
      "Дараагийн адал явдлаа бэлдэхэд бэлэн үү? Өнөөдөр холбогдоорой — мартагдашгүй аяллыг хамтдаа төлөвлөцгөөе.",
    emailLabel: "Имэйл",
    phoneLabel: "Утас",
    websiteLabel: "Вэбсайт",
    instaLabel: "Инстаграм",
    bookTitle: "Онлайн захиалга",
    bookDesc: "Аялал сонгож, мэдээллээ бөглөөд илгээнэ үү.",
    bookLink: "Захиалгын хуудас",
    copyright: "© 2026 Olon Nuur Travel LLC. Бүх эрх хуулиар хамгаалагдсан.",
  },
  ko: {
    heroTag: "",
    heroTitle: "희귀한 몽골.",
    heroTitleLine2: "진짜 경험.",
    heroDesc:
      "진정한 탐험가를 위한 프리미엄 원정 투어. 손길 닿지 않은 몽골의 아름다움을 만나보세요.",
    exploreJourneys: "탐험 여행 보기 →",
    askDates: "일정 문의",
    featuredLabel: "추천 프로그램",
    featuredHighlights: [
      "현지 전문가",
      "소규모 그룹",
      "4WD 원정",
      "잊지 못할 순간",
    ],
    navHome: "홈",
    navJourneys: "탐험 여행",
    navAbout: "회사 소개",
    navGallery: "갤러리",
    navBrochure: "브로슈어",
    navBlog: "블로그",
    navBook: "예약",
    navContact: "문의",
    bookCta: "예약하기",
    bookNow: "예약하기",
    learnMore: "자세히 보기",
    journeysLabel: "",
    journeysTitle: "탐험 여행 프로그램",
    journeysSubtitle:
      "몽골의 손길 닿지 않은 자연과 유목 문화, 전문 가이드와 함께하는 소규모 프리미엄 원정입니다.",
    whySectionTitle: "평범한 투어가 아닙니다. 희귀한 몽골의 순간들.",
    bookConsultation: "여행 상담",
    featuredDate: "2026년 8월 12일 – 16일 · 4박 5일 · 몽골",
    featuredPlace: "몽골",
    whyTravelTitle: "왜 올론 누르 트래블과 함께할까요?",
    whyTravelDesc:
      "몽골의 손길 닿지 않은 자연과 유목 문화, 전문 가이드와 함께하는 소규모 프리미엄 원정을 제공합니다.",
    aboutUsBtn: "회사 소개 →",
    footerReady: "다음 모험을 준비하고 계신가요?",
    contactUsBtn: "문의하기 →",
    footerContactIntro: "다음 모험을 함께 계획해 보세요.",
    journeysDesc:
      "조류 사진 · 유목 문화 · 민물 낚시 · 겨울 사냥 — 계절별 소규모 프리미엄 원정입니다.",
    viewItinerary: "일정 보기",
    comingSoon: "준비 중",
    aboutLabel: "회사 소개",
    aboutTitle: "OLON NUUR TRAVEL",
    aboutDesc:
      "몽골의 손길 닿지 않은 자연과 유목 문화, 전문 가이드와 함께하는 소규모 프리미엄 원정을 제공합니다. 대량 관광이 아닌, 진짜이고 희귀한 순간을 찾는 여행자를 위해 설계했습니다.",
    whyLabel: "강점",
    whyTitle: "왜 OLON NUUR인가요?",
    whyItems: [
      ["experts", "현지 전문가", "몽골 여행 경험이 풍부한 현지 가이드와 전문 팀."],
      ["groups", "소규모 그룹", "프라이빗하고 차분한, 밀접한 여행 분위기."],
      ["safety", "안전 우선", "안전을 최우선으로 꼼꼼히 계획된 원정."],
      ["comfort", "편안한 이동", "편안하고 품질 높은 교통, 숙소, 식사."],
      ["responsible", "책임 있는 여행", "자연과 문화를 존중하는 지속 가능한 여행 원칙."],
      ["memories", "잊지 못할 순간", "사진과 추억, 스토리텔링에 어울리는 특별한 여정."],
    ] as const,
    galleryLabel: "",
    galleryTitle: "갤러리",
    galleryItems: ["독수리", "강 계곡", "승마", "사진", "게르와 별", "낚시"],
    brochureLabel: "브로슈어",
    brochureTitle: "여행 브로슈어",
    brochureDesc: "3가지 투어의 가격, 일정, 포함 사항을 아래 브로슈어에서 확인하세요.",
    contactLabel: "예약 문의",
    contactTitle: "당신의 다음 모험을 준비하세요.",
    contactDesc: "다음 모험을 준비하고 계신가요? 지금 문의하세요 — 잊지 못할 여정을 함께 계획해 드립니다.",
    emailLabel: "이메일",
    phoneLabel: "전화",
    websiteLabel: "웹사이트",
    instaLabel: "인스타그램",
    bookTitle: "온라인 예약",
    bookDesc: "투어를 선택하고 정보를 입력해 예약 신청하세요.",
    bookLink: "예약 페이지로",
    copyright: "© 2026 Olon Nuur Travel LLC. 모든 권리 보유.",
  },
  en: {
    heroTag: "",
    heroTitle: "Rare Mongolia.",
    heroTitleLine2: "Real Experience.",
    heroDesc:
      "Premium expedition tours for real explorers. Discover the untouched beauty of Mongolia.",
    exploreJourneys: "Explore Journeys →",
    askDates: "Ask About Dates",
    featuredLabel: "Featured Program",
    featuredHighlights: [
      "Local Experts",
      "Small Groups",
      "4WD Expeditions",
      "Unforgettable Moments",
    ],
    navHome: "Home",
    navJourneys: "Journeys",
    navAbout: "About",
    navGallery: "Gallery",
    navBrochure: "Brochure",
    navBlog: "Blog",
    navBook: "Book",
    navContact: "Contact",
    bookCta: "BOOK NOW",
    bookNow: "BOOK NOW",
    learnMore: "LEARN MORE",
    journeysLabel: "",
    journeysTitle: "Our Expedition Journeys",
    journeysSubtitle:
      "Premium small-group expeditions through Mongolia's pristine nature, nomadic culture, and expert-guided adventures.",
    whySectionTitle: "Not ordinary tours. Rare Mongolian moments.",
    bookConsultation: "Book Consultation",
    featuredDate: "Aug 12 – Aug 16, 2026 · 5 Days / 4 Nights · Mongolia",
    featuredPlace: "Mongolia",
    whyTravelTitle: "Why Travel With Olon Nuur Travel?",
    whyTravelDesc:
      "We organize premium small-group journeys through Mongolia's pristine nature and nomadic culture with expert guides.",
    aboutUsBtn: "About Us →",
    footerReady: "Ready for your next adventure?",
    contactUsBtn: "Contact Us →",
    footerContactIntro: "Let us help you plan your next unforgettable journey.",
    journeysDesc:
      "Bird photography · Nomadic culture · Freshwater fishing · Winter hunting — seasonal small-group premium expeditions.",
    viewItinerary: "View itinerary",
    comingSoon: "Coming soon",
    aboutLabel: "About Us",
    aboutTitle: "OLON NUUR TRAVEL",
    aboutDesc:
      "We organize premium small-group journeys through Mongolia's pristine nature and nomadic culture with expert guides. Designed for travelers seeking authentic, rare, unforgettable moments—not mass tourism.",
    whyLabel: "Why Us",
    whyTitle: "Why OLON NUUR?",
    whyItems: [
      ["experts", "Local Experts", "Experienced local guides and specialists across Mongolia."],
      ["groups", "Small Groups", "Private, calm, and intimate travel atmosphere."],
      ["safety", "Safety First", "Carefully planned expeditions with safety as the top priority."],
      ["comfort", "Comfortable Travel", "Quality transport, lodging, and meals throughout."],
      ["responsible", "Responsible Travel", "Sustainable principles that respect nature and culture."],
      ["memories", "Unforgettable Moments", "Journeys built for photography, memory-making, and storytelling."],
    ] as const,
    galleryLabel: "",
    galleryTitle: "Gallery",
    galleryItems: ["Eagle", "River Valley", "Horse Trek", "Photography", "Ger & Stars", "Fishing"],
    brochureLabel: "Brochure",
    brochureTitle: "Travel Brochure",
    brochureDesc: "See prices, itineraries, and inclusions for all three tours in the brochure below.",
    contactLabel: "Booking Inquiry",
    contactTitle: "Plan your next adventure with us.",
    contactDesc:
      "Ready for your next journey? Contact us today—we will help you plan an unforgettable expedition together.",
    emailLabel: "Email",
    phoneLabel: "Phone",
    websiteLabel: "Website",
    instaLabel: "Instagram",
    bookTitle: "Online Booking",
    bookDesc: "Choose a tour, fill in your details, and submit your request.",
    bookLink: "Go to booking page",
    copyright: "© 2026 Olon Nuur Travel LLC. All rights reserved.",
  },
} as const;

export type WebsiteCopy = (typeof websiteContent)[Lang];

export function getWebsiteCopy(lang: Lang): WebsiteCopy {
  return websiteContent[lang];
}

export function getTourMarketingTitle(slug: string, lang: Lang): string | undefined {
  const title = TOUR_MARKETING_TITLES[slug];
  if (!title) return undefined;
  if (lang === "en") return title.en ?? title.mn;
  return title[lang];
}
