/**
 * 2027 вэбсайтын хуудасны текст (EN / KO / MN / JA).
 *
 * EN, KO, MN: docs/2027/2027-website-content.md-ээс ЯГ хуулсан. Текстийн цорын ганц эх сурвалж.
 * JA: баримтад байхгүй тул орчуулсан — мэргэжлийн хүнээр шалгуулах.
 * Товч, гарчиг зэрэг UI-ийн богино бичвэрүүдийг (баримтад байхгүй) "UI" гэж тэмдэглэв.
 * Баримтад байхгүй агуулгыг TODO(content) гэж тэмдэглэсэн.
 */
import type { Lang } from "@/lib/lang";

export type QA = { q: string; a: string };

export type SiteCopy = {
  nav: {
    home: string;
    tours: string;
    departures: string;
    about: string;
    travelInfo: string;
    faq: string;
    contact: string;
    gallery: string;
    comic: string;
    requestTour: string;
    exploreTours: string;
    menuOpen: string;
    menuClose: string;
    langSwitch: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    intro: string;
    highlights: string;
    toursTitle: string;
    whyTitle: string;
    whyItems: string[];
    departuresTitle: string;
    howTitle: string;
    howSteps: string[];
  };
  tours: {
    title: string;
    filterSeason: string;
    filterDuration: string;
    all: string;
    summer: string;
    winter: string;
    days: (n: number) => string;
    fromPrice: (formatted: string) => string;
    perPerson: string;
    infoOnly: string;
    details: string;
    noResults: string;
  };
  departures: {
    title: string;
    text: string;
    photographyLabel: string;
    otherTours: string;
    datesOnRequest: string;
  };
  about: {
    title: string;
    placeholder: string;
  };
  travelInfo: {
    title: string;
    safetyTitle: string;
    safety: string;
    preDepartureTitle: string;
    preDeparture: string;
  };
  faq: {
    title: string;
    bookingTitle: string;
    booking: string;
    paymentTitle: string;
    payment: string;
    cancellationTitle: string;
    cancellation: string;
    faqTitle: string;
    items: QA[];
  };
  privacy: {
    title: string;
    placeholder: string;
  };
  contact: {
    title: string;
    website: string;
    instagram: string;
    email: string;
    phones: string;
  };
  footer: {
    terms: string;
    privacy: string;
    rights: string;
  };
};

const en: SiteCopy = {
  nav: {
    home: "Home",
    tours: "Tours",
    departures: "2027 Departures",
    about: "About Us",
    travelInfo: "Travel Information",
    faq: "FAQ",
    contact: "Contact",
    gallery: "Gallery",
    comic: "Comic",
    requestTour: "Request a Tour",
    exploreTours: "Explore Tours",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    langSwitch: "Change language",
  },
  home: {
    heroTitle: "Rare Mongolia. Real Experience.",
    heroSubtitle: "",
    intro:
      "Discover Mongolia beyond the ordinary. OLON NUUR TRAVEL creates small-group journeys connecting travelers with wildlife, rivers, vast landscapes and living nomadic traditions.",
    highlights:
      "Small groups, local support teams, thoughtful itineraries, airport pickup and drop-off on our four core tours, and personal replies within 24 hours.",
    toursTitle: "Tours",
    whyTitle: "Why travel with us", // UI
    whyItems: [
      "Small groups",
      "Local support teams",
      "Thoughtful itineraries",
      "Airport pickup and drop-off on our four core tours",
      "Personal replies within 24 hours",
    ],
    departuresTitle: "2027 Departures",
    howTitle: "How it works", // UI; steps: technical brief §3
    howSteps: [
      "Send an inquiry",
      "Receive a quotation",
      "Sign the agreement",
      "Pay the 30% deposit",
      "Travel",
      "Share your feedback",
    ],
  },
  tours: {
    title: "Tours",
    filterSeason: "Season",
    filterDuration: "Duration",
    all: "All",
    summer: "Summer",
    winter: "Winter",
    days: (n) => `${n} days`,
    fromPrice: (p) => `from ${p}`,
    perPerson: "per person",
    infoOnly: "Information inquiries only",
    details: "View details",
    noResults: "No tours match these filters.",
  },
  departures: {
    title: "2027 Departures",
    text: "Wildlife Photography: 16–20 June and 18–22 August 2027. Other tours: dates on request.",
    photographyLabel: "Confirmed departures",
    otherTours: "Other tours",
    datesOnRequest: "Dates on request",
  },
  about: {
    title: "About Us",
    // TODO(content): компанийн танилцуулга, бодит баг, үйл ажиллагааны зарчим (brief §2)
    placeholder: "More about our company and team will be added soon.",
  },
  travelInfo: {
    title: "Travel Information",
    safetyTitle: "Travel Safety",
    safety:
      "Valid travel insurance covering emergency medical care and necessary medical evacuation is mandatory; proof before departure. Activity exclusions must be checked. Unsafe road, weather, river or ice conditions may require itinerary changes or cancellation.",
    preDepartureTitle: "Pre-departure Information",
    preDeparture:
      "Pre-departure information pack is sent seven days before the tour (or immediately after confirmation for late bookings): final itinerary, weather, clothing/equipment, airport pickup, emergency contacts, insurance and balance payment.",
  },
  faq: {
    title: "FAQ / Booking Terms",
    bookingTitle: "Booking",
    booking:
      "Send tour name, preferred dates, number of travelers and contact details. We respond to initial inquiries within 24 hours, including weekends. Bookings require written confirmation.",
    paymentTitle: "Payment",
    payment:
      "A 30% deposit confirms an accepted booking. The remaining 70% is paid after arrival in Mongolia but in full before tour start. International flights are excluded. Prices are per person in USD, varying by group size. Applicable taxes/VAT and statutory fees must be clarified in the final quotation before payment.",
    cancellationTitle: "Cancellation",
    cancellation:
      "Deposit refund (not refund of full tour price): 30+ days before departure 100%; 15–29 days 50%; 7–14 days 25%; 0–6 days or no-show 0%. One date change may be requested more than 15 days in advance, subject to availability, season, non-refundable supplier costs and price differences. Final contract and applicable law govern.",
    faqTitle: "FAQ",
    items: [
      { q: "Are international flights included?", a: "No." },
      { q: "Are airport transfers included?", a: "Yes, for the four core tours." },
      { q: "Are private tours available?", a: "Subject to season, availability and permits." },
      { q: "Can I book the hunting tour?", a: "Not yet; information inquiries only pending legal and safety clearance." },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    // TODO(content): Privacy Policy — LAUNCH-ААС ӨМНӨ ЗААВАЛ
    placeholder:
      "Our privacy policy is being finalized. For questions about your personal data, please contact olonnuurtravel@gmail.com.",
  },
  contact: {
    title: "Contact",
    website: "Website",
    instagram: "Instagram",
    email: "Email",
    phones: "Phones",
  },
  footer: {
    terms: "Booking Terms",
    privacy: "Privacy Policy",
    rights: "All rights reserved.",
  },
};

const ko: SiteCopy = {
  nav: {
    home: "홈",
    tours: "여행 상품",
    departures: "2027 출발 일정",
    about: "회사 소개",
    travelInfo: "여행 안내",
    faq: "FAQ",
    contact: "문의·예약",
    gallery: "갤러리",
    comic: "만화",
    requestTour: "여행 문의",
    exploreTours: "여행 상품 보기",
    menuOpen: "메뉴 열기",
    menuClose: "메뉴 닫기",
    langSwitch: "언어 변경",
  },
  home: {
    heroTitle: "Rare Mongolia. Real Experience.",
    heroSubtitle: "특별한 몽골, 진정한 경험.",
    intro:
      "OLON NUUR TRAVEL은 몽골의 야생동물, 강, 광활한 자연과 유목 문화를 경험하는 소규모 여행을 제공합니다.",
    highlights:
      "소규모 여행, 현지 전문 인력, 세심한 일정 운영, 주요 4개 상품의 공항 픽업·샌딩 포함, 첫 문의 24시간 이내 답변.",
    toursTitle: "여행 상품",
    whyTitle: "OLON NUUR TRAVEL을 선택하는 이유",
    whyItems: [
      "소규모 여행",
      "현지 전문 인력",
      "세심한 일정 운영",
      "주요 4개 상품의 공항 픽업·샌딩 포함",
      "첫 문의 24시간 이내 답변",
    ],
    departuresTitle: "2027 출발 일정",
    howTitle: "예약 절차",
    howSteps: ["문의 보내기", "견적 받기", "계약", "예약금 30% 납부", "여행", "후기 남기기"],
  },
  tours: {
    title: "여행 상품",
    filterSeason: "시즌",
    filterDuration: "기간",
    all: "전체",
    summer: "여름",
    winter: "겨울",
    days: (n) => `${n}일`,
    fromPrice: (p) => `${p}부터`,
    perPerson: "1인당",
    infoOnly: "정보 문의만 가능",
    details: "자세히 보기",
    noResults: "조건에 맞는 여행 상품이 없습니다.",
  },
  departures: {
    title: "2027 출발 일정",
    text: "사진 탐험: 2027년 6월 16~20일, 8월 18~22일. 기타 일정 문의.",
    photographyLabel: "확정 출발일",
    otherTours: "기타 상품",
    datesOnRequest: "일정 문의",
  },
  about: {
    title: "회사 소개",
    // TODO(content)
    placeholder: "회사 및 팀 소개는 곧 추가될 예정입니다.",
  },
  travelInfo: {
    title: "여행 안내",
    safetyTitle: "여행 안전",
    safety:
      "응급 의료 및 필요한 의료 이송을 보장하는 여행자 보험이 필수이며 출발 전 증빙이 필요합니다. 활동별 보장 제외 사항을 확인해야 합니다. 도로·날씨·강·얼음 상태가 위험하면 일정을 변경하거나 중단할 수 있습니다.",
    preDepartureTitle: "출발 전 안내",
    preDeparture:
      "출발 7일 전 최종 일정, 날씨, 준비물, 픽업, 비상 연락처, 보험 및 잔금 안내 자료를 발송합니다. 7일 이내 예약은 확정 즉시 발송합니다.",
  },
  faq: {
    title: "FAQ · 예약 규정",
    bookingTitle: "예약",
    booking:
      "여행 상품, 희망 날짜, 인원수 및 연락처를 보내 주세요. 주말 포함 첫 문의에 24시간 이내 답변합니다. 예약은 서면 확정 후 유효합니다.",
    paymentTitle: "결제",
    payment:
      "예약 승인 후 총 여행비의 30%를 예약금으로 납부합니다. 잔금 70%는 몽골 도착 후 여행 시작 전에 완납합니다. 국제선 항공권 제외. 가격은 인원별 1인당 USD 요금이며 세금, 부가가치세 및 법정 비용은 결제 전 최종 견적에서 안내합니다.",
    cancellationTitle: "취소",
    cancellation:
      "환불률은 전체 여행비가 아닌 예약금에 적용됩니다. 출발 30일 이상 전 100%, 15~29일 50%, 7~14일 25%, 0~6일 또는 노쇼 0%. 출발 15일 초과 전에 날짜 변경 1회 요청 가능하며 시즌, 가능 여부, 환불 불가 공급업체 비용 및 가격 차액에 따릅니다. 최종 계약과 적용 법률이 우선합니다.",
    faqTitle: "FAQ",
    items: [
      { q: "국제선 항공권 포함?", a: "아니요." },
      { q: "공항 픽업·샌딩 포함?", a: "네, 주요 4개 상품에 포함됩니다." },
      { q: "프라이빗 여행 가능?", a: "시즌, 가능 여부 및 허가 조건에 따릅니다." },
      { q: "사냥 여행 예약 가능?", a: "아직 불가하며 정보 문의만 가능합니다." },
    ],
  },
  privacy: {
    title: "개인정보 처리방침",
    // TODO(content): LAUNCH-ААС ӨМНӨ ЗААВАЛ
    placeholder:
      "개인정보 처리방침은 현재 준비 중입니다. 개인정보 관련 문의는 olonnuurtravel@gmail.com 으로 연락해 주세요.",
  },
  contact: {
    title: "문의·예약",
    website: "Website",
    instagram: "Instagram",
    email: "Email",
    phones: "Phones",
  },
  footer: {
    terms: "예약 규정",
    privacy: "개인정보 처리방침",
    rights: "All rights reserved.",
  },
};

const mn: SiteCopy = {
  nav: {
    home: "Нүүр",
    tours: "Аяллууд",
    departures: "2027 оны аялал",
    about: "Бидний тухай",
    travelInfo: "Аяллын мэдээлэл",
    faq: "Асуулт, хариулт",
    contact: "Холбоо барих",
    gallery: "Зургийн цомог",
    comic: "Комик",
    requestTour: "Аялал хүсэх",
    exploreTours: "Аяллууд үзэх",
    menuOpen: "Цэс нээх",
    menuClose: "Цэс хаах",
    langSwitch: "Хэл солих",
  },
  home: {
    heroTitle: "Rare Mongolia. Real Experience.",
    heroSubtitle: "Ховор Монгол. Жинхэнэ мэдрэмж.",
    intro:
      "OLON NUUR TRAVEL нь Монголын зэрлэг амьтан, гол мөрөн, уудам байгаль, нүүдлийн соёлыг мэдрүүлэх жижиг бүлгийн аяллуудыг зохион байгуулна.",
    highlights:
      "Жижиг бүлэг, орон нутгийн мэргэжлийн баг, нягт төлөвлөсөн хөтөлбөр, үндсэн дөрвөн аяллын нисэх буудлын тосолт, анхны хүсэлтэд 24 цагийн дотор хариу.",
    toursTitle: "Аяллууд",
    whyTitle: "Яагаад бидэнтэй аялах вэ",
    whyItems: [
      "Жижиг бүлэг",
      "Орон нутгийн мэргэжлийн баг",
      "Нягт төлөвлөсөн хөтөлбөр",
      "Үндсэн дөрвөн аяллын нисэх буудлын тосолт",
      "Анхны хүсэлтэд 24 цагийн дотор хариу",
    ],
    departuresTitle: "2027 оны аялал",
    howTitle: "Захиалгын алхам",
    howSteps: ["Хүсэлт илгээх", "Үнийн санал авах", "Гэрээ байгуулах", "30% урьдчилгаа төлөх", "Аялал", "Сэтгэгдэл үлдээх"],
  },
  tours: {
    title: "Аяллууд",
    filterSeason: "Улирал",
    filterDuration: "Хугацаа",
    all: "Бүгд",
    summer: "Зун",
    winter: "Өвөл",
    days: (n) => `${n} өдөр`,
    fromPrice: (p) => `${p}-аас эхлэн`,
    perPerson: "нэг хүнд",
    infoOnly: "Зөвхөн мэдээллийн хүсэлт",
    details: "Дэлгэрэнгүй",
    noResults: "Шүүлтүүрт тохирох аялал алга.",
  },
  departures: {
    title: "2027 оны аялал",
    text: "Фото аялал: 2027.06.16–20, 08.18–22. Бусад огноо хүсэлтээр.",
    photographyLabel: "Батлагдсан огноо",
    otherTours: "Бусад аялал",
    datesOnRequest: "Огноо хүсэлтээр",
  },
  about: {
    title: "Бидний тухай",
    // TODO(content)
    placeholder: "Компани, багийн танилцуулга удахгүй нэмэгдэнэ.",
  },
  travelInfo: {
    title: "Аяллын мэдээлэл",
    safetyTitle: "Аюулгүй байдал",
    safety:
      "Яаралтай эмнэлгийн тусламж, шаардлагатай эмнэлгийн тээвэрлэлтийг хамарсан даатгал заавал шаардана. Аяллаас өмнө баримт ирүүлнэ. Тусгай үйл ажиллагааны хасалтыг шалгана. Зам, цаг агаар, гол, мөсний аюултай нөхцөлд аяллыг өөрчилж эсвэл зогсоож болно.",
    preDepartureTitle: "Аяллын өмнөх мэдээлэл",
    preDeparture:
      "Аяллаас 7 хоногийн өмнө хөтөлбөр, цаг агаар, хэрэглэл, тосолт, холбоо барих мэдээлэл, даатгал, үлдэгдэл төлбөрийн мэдээлэл илгээнэ. 7 хоногоос дотогш захиалгад баталгаажмагц илгээнэ.",
  },
  faq: {
    title: "Асуулт, хариулт · Захиалгын нөхцөл",
    bookingTitle: "Захиалга",
    booking:
      "Аяллын нэр, хүссэн огноо, хүний тоо, холбоо барих мэдээллээ илгээнэ үү. Анхны хүсэлтэд амралтын өдөр үл харгалзан 24 цагийн дотор хариулна. Захиалга бичгээр баталгаажсанаар хүчинтэй.",
    paymentTitle: "Төлбөр",
    payment:
      "Захиалгыг 30%-ийн урьдчилгаагаар баталгаажуулна. Үлдэгдэл 70%-ийг Монголд ирсний дараа, аялал эхлэхээс өмнө бүрэн төлнө. Олон улсын нислэг ороогүй. Үнэ нь бүлгийн хэмжээнээс хамаарах нэг хүний USD үнэ. Холбогдох татвар, НӨАТ, хураамжийг төлбөрөөс өмнөх эцсийн саналд тодруулна.",
    cancellationTitle: "Цуцлалт",
    cancellation:
      "Цуцлалтын буцаан олголтын хувь нь нийт үнэ бус зөвхөн урьдчилгаанд хамаарна: 30+ хоног 100%, 15–29 хоног 50%, 7–14 хоног 25%, 0–6 хоног болон ирээгүй тохиолдолд 0%. 15-аас дээш хоногийн өмнө огноо нэг удаа өөрчлөх хүсэлт гаргаж болно; сул боломж, улирал, нийлүүлэгчийн буцаагдахгүй зардал, үнийн зөрүүг харгалзана. Эцсийн гэрээ, холбогдох хууль үйлчилнэ.",
    faqTitle: "Асуулт, хариулт",
    items: [
      { q: "Олон улсын нислэг багтсан уу?", a: "Үгүй." },
      { q: "Нисэх буудлын тосолт багтсан уу?", a: "Тийм, үндсэн дөрвөн аялалд." },
      { q: "Хувийн аялал боломжтой юу?", a: "Улирал, багтаамж, зөвшөөрлөөс хамаарна." },
      { q: "Өвлийн ангийн аяллыг захиалж болох уу?", a: "Одоогоор зөвхөн мэдээллийн хүсэлт авч байна." },
    ],
  },
  privacy: {
    title: "Нууцлалын бодлого",
    // TODO(content): LAUNCH-ААС ӨМНӨ ЗААВАЛ
    placeholder:
      "Нууцлалын бодлогыг эцэслэж байна. Хувийн мэдээлэлтэй холбоотой асуултаа olonnuurtravel@gmail.com хаягаар илгээнэ үү.",
  },
  contact: {
    title: "Холбоо барих",
    website: "Website",
    instagram: "Instagram",
    email: "Email",
    phones: "Phones",
  },
  footer: {
    terms: "Захиалгын нөхцөл",
    privacy: "Нууцлалын бодлого",
    rights: "Бүх эрх хуулиар хамгаалагдсан.",
  },
};

const ja: SiteCopy = {
  nav: {
    home: "ホーム",
    tours: "ツアー",
    departures: "2027年出発日程",
    about: "会社案内",
    travelInfo: "旅行情報",
    faq: "よくある質問",
    contact: "お問い合わせ",
    gallery: "ギャラリー",
    comic: "コミック",
    requestTour: "ツアーを問い合わせる",
    exploreTours: "ツアーを見る",
    menuOpen: "メニューを開く",
    menuClose: "メニューを閉じる",
    langSwitch: "言語を変更",
  },
  home: {
    heroTitle: "Rare Mongolia. Real Experience.",
    heroSubtitle: "希少なモンゴル、本物の体験。",
    intro:
      "ありきたりではないモンゴルへ。OLON NUUR TRAVELは、野生動物、川、広大な大地、そして今も息づく遊牧の伝統と旅行者をつなぐ少人数制の旅をご提供します。",
    highlights:
      "少人数制、現地サポートチーム、丁寧に練られた旅程、主要4ツアーの空港送迎、そして24時間以内の個別返信。",
    toursTitle: "ツアー",
    whyTitle: "選ばれる理由",
    whyItems: [
      "少人数制",
      "現地サポートチーム",
      "丁寧に練られた旅程",
      "主要4ツアーの空港送迎",
      "24時間以内の個別返信",
    ],
    departuresTitle: "2027年出発日程",
    howTitle: "ご予約の流れ",
    howSteps: ["お問い合わせ", "お見積もり", "ご契約", "30%デポジットのお支払い", "ご旅行", "ご感想"],
  },
  tours: {
    title: "ツアー",
    filterSeason: "シーズン",
    filterDuration: "期間",
    all: "すべて",
    summer: "夏",
    winter: "冬",
    days: (n) => `${n}日間`,
    fromPrice: (p) => `${p}〜`,
    perPerson: "1名あたり",
    infoOnly: "情報のお問い合わせのみ",
    details: "詳細を見る",
    noResults: "条件に合うツアーはありません。",
  },
  departures: {
    title: "2027年出発日程",
    text: "野生動物写真ツアー：2027年6月16〜20日、8月18〜22日。その他のツアー：日程はお問い合わせください。",
    photographyLabel: "確定出発日",
    otherTours: "その他のツアー",
    datesOnRequest: "日程はお問い合わせ",
  },
  about: {
    title: "会社案内",
    // TODO(content)
    placeholder: "会社およびチームのご紹介は近日掲載予定です。",
  },
  travelInfo: {
    title: "旅行情報",
    safetyTitle: "旅の安全",
    safety:
      "緊急医療および必要な医療搬送を補償する有効な旅行保険への加入が必須で、出発前に証明書のご提出が必要です。アクティビティごとの補償対象外事項をご確認ください。道路、天候、川、氷の状態が危険な場合、旅程の変更または中止となることがあります。",
    preDepartureTitle: "出発前のご案内",
    preDeparture:
      "出発7日前（直前のご予約の場合は確定後すぐ）に、最終旅程、天候、服装・装備、空港送迎、緊急連絡先、保険、残金のお支払いに関するご案内をお送りします。",
  },
  faq: {
    title: "よくある質問・予約規定",
    bookingTitle: "ご予約",
    booking:
      "ツアー名、ご希望の日程、人数、ご連絡先をお送りください。初回のお問い合わせには週末を含め24時間以内にご返信します。ご予約は書面での確定をもって成立します。",
    paymentTitle: "お支払い",
    payment:
      "ご予約承認後、30%のデポジットのお支払いでご予約が確定します。残金70%はモンゴル到着後、ツアー開始前までに全額お支払いください。国際線航空券は含まれません。料金は人数により異なる1名あたりのUSD料金です。適用される税金・付加価値税および法定費用は、お支払い前の最終見積もりで明示します。",
    cancellationTitle: "キャンセル",
    cancellation:
      "返金率はツアー代金全額ではなくデポジットに適用されます：出発30日以上前 100%、15〜29日前 50%、7〜14日前 25%、0〜6日前またはノーショー 0%。出発15日より前であれば、空き状況、シーズン、返金不可の手配先費用および料金差額を条件に、日程変更を1回ご依頼いただけます。最終契約および適用法令が優先されます。",
    faqTitle: "よくある質問",
    items: [
      { q: "国際線航空券は含まれますか？", a: "いいえ。" },
      { q: "空港送迎は含まれますか？", a: "はい、主要4ツアーに含まれます。" },
      { q: "プライベートツアーは可能ですか？", a: "シーズン、空き状況、許可によります。" },
      { q: "狩猟ツアーは予約できますか？", a: "まだできません。法的・安全上の確認が完了するまで、情報のお問い合わせのみ承ります。" },
    ],
  },
  privacy: {
    title: "プライバシーポリシー",
    // TODO(content): LAUNCH-ААС ӨМНӨ ЗААВАЛ
    placeholder:
      "プライバシーポリシーは現在準備中です。個人情報に関するお問い合わせは olonnuurtravel@gmail.com までご連絡ください。",
  },
  contact: {
    title: "お問い合わせ",
    website: "Website",
    instagram: "Instagram",
    email: "Email",
    phones: "Phones",
  },
  footer: {
    terms: "予約規定",
    privacy: "プライバシーポリシー",
    rights: "All rights reserved.",
  },
};

export const SITE_COPY: Record<Lang, SiteCopy> = { en, ko, mn, ja };

export function useSiteCopyFor(lang: Lang): SiteCopy {
  return SITE_COPY[lang];
}
