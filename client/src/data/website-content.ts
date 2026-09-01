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
      ja: "会社指定の出発日程",
    },
    detail: {
      mn: "Эхний хөтөлбөр: 2026.08.12 – 08.16",
      ko: "첫 출발: 2026년 8월 12일 – 16일",
      en: "First departure: Aug 12 – 16, 2026",
      ja: "初回出発：2026年8月12日〜16日",
    },
  },
  "arburd-gobi": {
    season: { mn: "5.20 – 9.30", ko: "5월 20일 – 9월 30일", en: "May 20 – Sep 30", ja: "5月20日〜9月30日" },
    detail: { mn: "Зуны соёлын аялал", ko: "아르부르드 고비 3박4일", en: "Arburd Gobi · 3 Nights 4 Days", ja: "アルブルド・ゴビ 3泊4日" },
  },
  "kherlen-fishing": {
    season: {
      mn: "3.22 – 6.22-аас бусад хугацаанд",
      ko: "3월 22일 – 6월 22일 외 기간",
      en: "Outside Mar 22 – Jun 22",
      ja: "3月22日〜6月22日以外",
    },
    detail: { mn: "Улирлын голын амралт", ko: "계절 강변 리트릿", en: "Seasonal river retreat", ja: "季節の川辺リトリート" },
  },
  "winter-hunting": {
    season: { mn: "Зөвхөн өвлийн улирал", ko: "겨울 시즌만", en: "Winter season only", ja: "冬季限定" },
    detail: {
      mn: "Огноог аялагчтай тохируулна",
      ko: "일정은 여행자와 협의",
      en: "Dates arranged with travelers",
      ja: "日程は旅行者と相談",
    },
  },
};

export const TOUR_MARKETING_TITLES: Record<string, LocalizedString> = {
  "bird-photography": {
    mn: "Шувуудын гэрэл зургийн аялал",
    ko: "조류 사진 탐험",
    en: "Bird Photography Expedition",
    ja: "野鳥写真エクスペディション",
  },
  "arburd-gobi": {
    mn: "Нүүдэлчдийн соёлын аялал",
    ko: "아르부르드 고비 3박4일 투어",
    en: "Arburd Gobi · 3 Nights 4 Days",
    ja: "アルブルド・ゴビ 3泊4日ツアー",
  },
  "kherlen-fishing": {
    mn: "Цэнгэг усны загасчлалын аялал",
    ko: "민물 낚시 탐험",
    en: "Freshwater Fishing Expedition",
    ja: "淡水釣りエクスペディション",
  },
  "winter-hunting": {
    mn: "Өвлийн тусгай аялал тун удахгүй",
    ko: "특별 원정 여행",
    en: "Special Winter Expedition",
    ja: "特別ウィンターエクスペディション",
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
    navGallery: "Зургийн цомог",
    navBrochure: "Брошур",
    navBlog: "Комик",
    navBook: "Захиалга",
    navContact: "Холбоо барих",
    bookCta: "ЗАХИАЛАХ",
    bookNow: "ЗАХИАЛАХ",
    learnMore: "ДЭЛГЭРЭНГҮЙ",
    journeysLabel: "",
    journeysTitle: "Манай экспедицийн аяллууд",
    journeysSubtitle:
      "Монголын онгон байгаль, нүүдэлчин соёл, мэргэжлийн хөтөчтэй жижиг бүлгийн премиум аяллууд.",
    bookConsultation: "Зөвлөгөө авах",
    featuredDate: "2026.08.12 – 08.16 · 5 өдөр / 4 шөнө · Монгол",
    featuredPlace: "Монгол",
    aboutUsBtn: "Брошур үзэх →",
    footerReady: "Дараагийн аялалдаа бэлэн үү?",
    contactUsBtn: "Холбоо барих →",
    footerContactIntro: "Дараагийн адал явдлаа бидэнтэй хамт төлөвлөөрэй.",
    journeysDesc:
      "Шувууны зураг, нүүдэлчин соёл, загасчлал, өвлийн ан агнуур — улирлын жижиг бүлгийн аяллууд.",
    viewItinerary: "Хөтөлбөр үзэх",
    comingSoon: "Удахгүй",
    aboutLabel: "Бидний тухай",
    aboutTitle: "Олон нуур трэвел-ийн тухай",
    aboutIntro: [
      "Монгол бол дэлхий дээрх байгаль нь одоо ч хязгааргүй уудам, онгон дагшин хэвээр үлдсэн цөөн газрын нэг юм.",
      "Олон нуур трэвел нь энгийн аялал бус, сэтгэлд үлдэх жинхэнэ мэдрэмжийг бүтээх зорилготой байгуулагдсан.",
      "Бид Монголын нуугдмал гайхамшгийг аялагчдад хүргэдэг: өргөн тал нутаг, ховор шувуудтай намгархаг бүс, тунгалаг цэнгэг нуурууд, нүүдэлчдийн ахуй, уул хөндий, өвлийн нам гүм зэрлэг байгаль.",
    ],
    aboutExperiencesLabel: "Манай аяллын чиглэлүүд:",
    aboutExperiences: [
      "Шувуу ажиглалт, гэрэл зургийн аялал",
      "Нүүдэлчдийн соёлын аялал",
      "Цэнгэг усны загасчлалын аялал",
      "Өвлийн ангийн аялал",
    ],
    aboutBody: [
      "Бид олныг хамарсан энгийн аялал бус, цөөн хүний бүрэлдэхүүнтэй, илүү бодит, илүү гүн мэдрэмжтэй аяллыг эрхэмлэдэг.",
      "Маршрут бүрийг Монгол орны байгаль, уламжлал, орон нутгийн онцлогт тулгуурлан анхааралтай боловсруулдаг.",
      "Тал нутгийн тэнгэрт дүүлэх бүргэд, оддын доорх нам гүм шөнө, нүүдэлчдийн гэрт өнгөрүүлэх дулаан мөчүүд — бидний зорилго бол аялал бүрийг насан туршийн дурсамж болгох юм.",
    ],
    aboutTagline: "Хүн бүрийн Хүрч чадахгүй, Монгол.",
    galleryLabel: "",
    galleryTitle: "Зургийн цомог",
    galleryCategories: [
      { id: "birds", title: "Шувуудын" },
      { id: "nomadic", title: "Нүүдэлчин ахуй" },
      { id: "nature", title: "Байгалийн" },
    ],
    comicTitle: "Комик",
    comicEpisodes: [
      { id: "episode-01", title: "Episode 1" },
      { id: "episode-02", title: "Episode 2" },
      { id: "episode-03", title: "Episode 3" },
      { id: "episode-04", title: "Episode 4" },
    ],
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
    announcementMarquee: [
      {
        text: "Шувуудын гэрэл зургийн аялал нээгдлээ — 2026.08.12 – 08.16",
        href: "/tours/bird-photography",
      },
      { text: "Онлайн захиалга хүлээн авч байна", href: "/book" },
      { text: "Жижиг бүлгийн премиум аялал", href: "#tours" },
    ],
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
    navBlog: "코믹",
    navBook: "예약",
    navContact: "문의",
    bookCta: "예약하기",
    bookNow: "예약하기",
    learnMore: "자세히 보기",
    journeysLabel: "",
    journeysTitle: "탐험 여행 프로그램",
    journeysSubtitle:
      "몽골의 손길 닿지 않은 자연과 유목 문화, 전문 가이드와 함께하는 소규모 프리미엄 원정입니다.",
    bookConsultation: "여행 상담",
    featuredDate: "2026년 8월 12일 – 16일 · 4박 5일 · 몽골",
    featuredPlace: "몽골",
    aboutUsBtn: "브로슈어 보기 →",
    footerReady: "다음 모험을 준비하고 계신가요?",
    contactUsBtn: "문의하기 →",
    footerContactIntro: "다음 모험을 함께 계획해 보세요.",
    journeysDesc:
      "조류 사진 · 유목 문화 · 민물 낚시 · 겨울 사냥 — 계절별 소규모 프리미엄 원정입니다.",
    viewItinerary: "일정 보기",
    comingSoon: "준비 중",
    aboutLabel: "회사 소개",
    aboutTitle: "OLON NUUR TRAVEL 소개",
    aboutIntro: [
      "몽골은 아직도 끝없는 자연과 진정한 야생의 숨결이 살아있는 특별한 곳입니다.",
      "OLON NUUR TRAVEL은 단순한 관광이 아닌, 오랫동안 마음속에 남을 진짜 여행을 만들어갑니다.",
      "저희는 몽골의 광활한 초원, 희귀 조류가 서식하는 습지, 맑은 호수, 유목민의 삶, 겨울 대자연 속으로 여러분을 안내합니다.",
    ],
    aboutExperiencesLabel: "주요 여행 프로그램:",
    aboutExperiences: [
      "조류 사진 촬영 탐조 투어",
      "유목 문화 체험 여행",
      "담수 낚시 원정",
      "Special Expeditions",
    ],
    aboutBody: [
      "OLON NUUR TRAVEL은 대규모 패키지 관광이 아닌, 소규모 맞춤형 탐험 여행을 지향합니다.",
      "현지의 깊은 경험과 자연에 대한 존중, 그리고 몽골만의 진짜 아름다움을 전달하는 것이 우리의 철학입니다.",
      "광활한 초원 위를 나는 독수리, 별빛 아래의 고요한 밤, 유목민 게르 안에서의 따뜻한 순간들. 우리는 여행이 단순한 일정이 아닌, 평생 기억될 감동이 되기를 바랍니다.",
    ],
    aboutTagline: "Rare Mongolia. Real Experience.",
    galleryLabel: "",
    galleryTitle: "갤러리",
    galleryCategories: [
      { id: "birds", title: "조류" },
      { id: "nomadic", title: "유목민 생활" },
      { id: "nature", title: "자연" },
    ],
    comicTitle: "코믹",
    comicEpisodes: [
      { id: "episode-01", title: "Episode 1" },
      { id: "episode-02", title: "Episode 2" },
      { id: "episode-03", title: "Episode 3" },
      { id: "episode-04", title: "Episode 4" },
    ],
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
    announcementMarquee: [
      {
        text: "조류 사진 탐험 출발 일정 오픈 — 2026.08.12 – 08.16",
        href: "/tours/bird-photography",
      },
      { text: "온라인 예약 접수 중", href: "/book" },
      { text: "소규모 프리미엄 원정 투어", href: "#tours" },
    ],
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
    navBlog: "Comic",
    navBook: "Book",
    navContact: "Contact",
    bookCta: "BOOK NOW",
    bookNow: "BOOK NOW",
    learnMore: "LEARN MORE",
    journeysLabel: "",
    journeysTitle: "Our Expedition Journeys",
    journeysSubtitle:
      "Premium small-group expeditions through Mongolia's pristine nature, nomadic culture, and expert-guided adventures.",
    bookConsultation: "Book Consultation",
    featuredDate: "Aug 12 – Aug 16, 2026 · 5 Days / 4 Nights · Mongolia",
    featuredPlace: "Mongolia",
    aboutUsBtn: "View Brochure →",
    footerReady: "Ready for your next adventure?",
    contactUsBtn: "Contact Us →",
    footerContactIntro: "Let us help you plan your next unforgettable journey.",
    journeysDesc:
      "Bird photography · Nomadic culture · Freshwater fishing · Winter hunting — seasonal small-group premium expeditions.",
    viewItinerary: "View itinerary",
    comingSoon: "Coming soon",
    aboutLabel: "About Us",
    aboutTitle: "About OLON NUUR TRAVEL",
    aboutIntro: [
      "Mongolia is one of the last places on Earth where nature still feels endless, untouched, and truly alive.",
      "At OLON NUUR TRAVEL, we believe travel should be more than simply visiting places. It should become a meaningful experience — something that stays in your heart long after the journey ends.",
      "Founded in Mongolia, our company specializes in carefully designed expeditions for travelers seeking authenticity, wilderness, culture, and rare moments that cannot be found in ordinary tourism.",
      "We guide our guests through Mongolia's hidden landscapes: vast steppe grasslands, remote wetlands filled with migratory birds, crystal-clear freshwater lakes, nomadic family camps, mountain valleys, and silent winter wilderness.",
    ],
    aboutExperiencesLabel: "Our experiences include:",
    aboutExperiences: [
      "Bird Photography Expeditions",
      "Nomadic Culture Experiences",
      "Freshwater Fishing Adventures",
      "Special Expeditions",
    ],
    aboutBody: [
      "Unlike mass tourism operators, we focus on small groups, personalized routes, and genuine human connection. Every journey is crafted with local knowledge, respect for nature, and deep understanding of Mongolia's traditions and environment.",
      "Whether watching a golden eagle soar above the steppe, sharing tea inside a nomadic ger, or witnessing the silence of Mongolia beneath a sky full of stars, our goal is simple: to create journeys that remain in the heart forever.",
    ],
    aboutTagline: "Rare Mongolia. Real Experience.",
    galleryLabel: "",
    galleryTitle: "Gallery",
    galleryCategories: [
      { id: "birds", title: "Birds" },
      { id: "nomadic", title: "Nomadic Life" },
      { id: "nature", title: "Nature" },
    ],
    comicTitle: "Comic",
    comicEpisodes: [
      { id: "episode-01", title: "Episode 1" },
      { id: "episode-02", title: "Episode 2" },
      { id: "episode-03", title: "Episode 3" },
      { id: "episode-04", title: "Episode 4" },
    ],
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
    announcementMarquee: [
      {
        text: "Bird Photography Expedition now open — Aug 12 – 16, 2026",
        href: "/tours/bird-photography",
      },
      { text: "Online bookings accepted", href: "/book" },
      { text: "Small-group premium expeditions", href: "#tours" },
    ],
    copyright: "© 2026 Olon Nuur Travel LLC. All rights reserved.",
  },
  ja: {
    heroTag: "",
    heroTitle: "希少なモンゴル。",
    heroTitleLine2: "本物の体験。",
    heroDesc:
      "本物の探検家のためのプレミアム・エクスペディションツアー。手つかずのモンゴルの美しさを発見してください。",
    exploreJourneys: "ツアーを見る →",
    askDates: "日程のお問い合わせ",
    featuredLabel: "おすすめプログラム",
    featuredHighlights: [
      "現地の専門家",
      "少人数グループ",
      "4WDエクスペディション",
      "忘れられない瞬間",
    ],
    navHome: "ホーム",
    navJourneys: "ツアー",
    navAbout: "会社概要",
    navGallery: "ギャラリー",
    navBrochure: "パンフレット",
    navBlog: "コミック",
    navBook: "予約",
    navContact: "お問い合わせ",
    bookCta: "予約する",
    bookNow: "予約する",
    learnMore: "詳しく見る",
    journeysLabel: "",
    journeysTitle: "エクスペディション・ツアー",
    journeysSubtitle:
      "モンゴルの手つかずの自然と遊牧文化を、専門ガイドとともに少人数で巡るプレミアムな旅。",
    bookConsultation: "旅行相談",
    featuredDate: "2026年8月12日〜16日 · 5日間 / 4泊 · モンゴル",
    featuredPlace: "モンゴル",
    aboutUsBtn: "パンフレットを見る →",
    footerReady: "次の冒険の準備はできていますか？",
    contactUsBtn: "お問い合わせ →",
    footerContactIntro: "忘れられない旅の計画を、私たちと一緒に始めましょう。",
    journeysDesc:
      "野鳥写真 · 遊牧文化 · 淡水釣り · 冬の狩猟 — 季節ごとの少人数プレミアム・エクスペディション。",
    viewItinerary: "日程を見る",
    comingSoon: "近日公開",
    aboutLabel: "会社概要",
    aboutTitle: "OLON NUUR TRAVELについて",
    aboutIntro: [
      "モンゴルは、今もなお自然が果てしなく広がり、手つかずで、本物の生命力に満ちた数少ない場所のひとつです。",
      "OLON NUUR TRAVELでは、単なる観光ではなく、心に残る本物の体験をお届けすることを大切にしています。",
      "モンゴルに根ざした私たちは、広大な草原、渡り鳥が集まる湿地、透き通った淡水湖、遊牧民のキャンプ、山岳渓谷、静寂な冬の荒野へと、お客様をご案内します。",
    ],
    aboutExperiencesLabel: "主なツアープログラム：",
    aboutExperiences: [
      "野鳥写真エクスペディション",
      "遊牧文化体験",
      "淡水釣りアドベンチャー",
      "特別エクスペディション",
    ],
    aboutBody: [
      "大規模なパッケージツアーとは異なり、私たちは少人数制、個別ルート、そして人と人とのつながりを重視しています。",
      "草原の上を舞う金鵰、満天の星空の下の静けさ、ゲルでの温かいひととき — 旅が一生の思い出になることを目指しています。",
    ],
    aboutTagline: "希少なモンゴル。本物の体験。",
    galleryLabel: "",
    galleryTitle: "ギャラリー",
    galleryCategories: [
      { id: "birds", title: "野鳥" },
      { id: "nomadic", title: "遊牧生活" },
      { id: "nature", title: "自然" },
    ],
    comicTitle: "コミック",
    comicEpisodes: [
      { id: "episode-01", title: "Episode 1" },
      { id: "episode-02", title: "Episode 2" },
      { id: "episode-03", title: "Episode 3" },
      { id: "episode-04", title: "Episode 4" },
    ],
    galleryItems: ["鷲", "渓谷", "乗馬", "写真", "ゲルと星空", "釣り"],
    brochureLabel: "パンフレット",
    brochureTitle: "旅行パンフレット",
    brochureDesc: "3つのツアーの料金、日程、含まれる内容は下記のパンフレットをご覧ください。",
    contactLabel: "予約のお問い合わせ",
    contactTitle: "次の冒険を、私たちと一緒に計画しましょう。",
    contactDesc:
      "次の旅の準備はできていますか？今すぐお問い合わせください — 忘れられないエクスペディションを一緒に計画します。",
    emailLabel: "メール",
    phoneLabel: "電話",
    websiteLabel: "ウェブサイト",
    instaLabel: "Instagram",
    bookTitle: "オンライン予約",
    bookDesc: "ツアーを選び、必要事項をご記入のうえ送信してください。",
    bookLink: "予約ページへ",
    announcementMarquee: [
      {
        text: "野鳥写真エクスペディション受付中 — 2026年8月12日〜16日",
        href: "/tours/bird-photography",
      },
      { text: "オンライン予約受付中", href: "/book" },
      { text: "少人数プレミアム・エクスペディション", href: "#tours" },
    ],
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
  if (lang === "ja") return title.ja ?? title.en ?? title.mn;
  return title[lang];
}
