// Аяллын дэлгэрэнгүй контент (маршрут, байр, багтсан зүйл, анхааруулга).
//
// Үнэ, хүний тоо, статус, огнооны дүрэм энд БИШ — shared/tours-2027.ts-д байна.
// Текстийн эх сурвалж: docs/2027/2027-website-content.md (EN / KO / MN).
// `ja` талбаруудыг баримтад байхгүй тул орчуулсан — мэргэжлийн хүнээр шалгуулах.
// `en`/`ja` байхгүй хуучин мөрүүдийг tour-en-by-mn.ts / tour-ja-by-en.ts-ээр орчуулна.

import { TOURS_2027, type TourSlug } from "@shared/tours-2027";

export type LocalizedString = {
  mn: string;
  ko: string;
  en?: string;
  ja?: string;
};

export type ScheduleItem = {
  time: string;
  text: LocalizedString;
};

export type DayPlan = {
  day: number;
  title: LocalizedString;
  subtitle?: LocalizedString;
  schedule: ScheduleItem[];
  overnight?: LocalizedString;
};

export type Tour = {
  slug: TourSlug;
  hero: {
    title: LocalizedString;
    /** Баримтын толгой мөр: хугацаа · хүн · байршил/улирал */
    subtitle: LocalizedString;
    image: string;
    /** 1920px+ for sharp full-width hero; falls back to `image` */
    imageHd?: string;
    imageWebp?: string;
    /** CSS object-position when cover crop should favor part of the frame (e.g. `center top`) */
    imageObjectPosition?: string;
    /** Zoom out hero cover crop so portrait subjects keep headroom (e.g. 0.88) */
    imageObjectScale?: number;
  };
  overview: {
    duration: LocalizedString;
    groupSize: LocalizedString;
    crew?: LocalizedString;
    route?: LocalizedString;
  };
  description: LocalizedString;
  accommodation: LocalizedString;
  /** Хоосон = өдөрчилсөн хөтөлбөр одоохондоо байхгүй (TODO(content)) */
  days: DayPlan[];
  meals?: {
    breakfast: LocalizedString;
    lunch: LocalizedString;
    dinner: LocalizedString;
    special?: LocalizedString;
  };
  highlights?: {
    title: LocalizedString;
    items: LocalizedString[];
  };
  logistics: LocalizedString[];
  included: LocalizedString[];
  excluded: LocalizedString[];
  /** Анхааруулга: загасны хориг, мөсний аюулгүй байдал, wildlife not guaranteed гэх мэт */
  notices: LocalizedString[];
};

import birdPhotographyHero from "@assets/bird-photography-hero.jpg";
import birdPhotographyHeroHd from "@assets/bird-photography-hero-1920.jpg";
import birdPhotographyHeroWebp from "@assets/bird-photography-hero-1920.webp";
import nomadicCultureHero from "@assets/nomadic-culture-hero.jpg";
import nomadicCultureHeroHd from "@assets/nomadic-culture-hero-1920.jpg";
import nomadicCultureHeroWebp from "@assets/nomadic-culture-hero-1920.webp";
import freshwaterFishingHero from "@assets/freshwater-fishing-hero.jpg";
import freshwaterFishingHeroHd from "@assets/freshwater-fishing-hero-1920.jpg";
import freshwaterFishingHeroWebp from "@assets/freshwater-fishing-hero-1920.webp";
import winterHuntingHero from "@assets/winter-hunting-hero.png";
import tourPlaceholder from "@assets/tour-placeholder.svg";

// ─── Баримтын нийтлэг мөрүүд ─────────────────────────────────────────────

const AIRPORT_TRANSFER_INCLUDED: LocalizedString = {
  en: "Airport pickup / drop-off included on this tour.",
  ko: "공항 픽업·샌딩 포함.",
  mn: "Нисэх буудлын тосолт багтсан.",
  ja: "空港送迎が含まれます。",
};

const INTERNATIONAL_AIRFARE_EXCLUDED: LocalizedString = {
  en: "International airfare excluded.",
  ko: "국제선 제외.",
  mn: "Олон улсын нислэг ороогүй.",
  ja: "国際線航空券は含まれません。",
};

const TRAVEL_INSURANCE_REQUIRED: LocalizedString = {
  en: "Valid travel insurance covering emergency medical care and necessary medical evacuation is mandatory; proof before departure.",
  ko: "응급 의료 및 필요한 의료 이송을 보장하는 여행자 보험이 필수이며 출발 전 증빙이 필요합니다.",
  mn: "Яаралтай эмнэлгийн тусламж, шаардлагатай эмнэлгийн тээвэрлэлтийг хамарсан даатгал заавал шаардана. Аяллаас өмнө баримт ирүүлнэ.",
  ja: "緊急医療および必要な医療搬送を補償する旅行保険への加入が必須です。出発前に証明書をご提出ください。",
};

export const tours: Tour[] = [
  // ─────────────────────────────────────────────────────────────────────
  // Wildlife & Nature Photography (хуучин: bird-photography)
  // Маршрут, 5D4N баримттай таарч байгаа тул өдөр тутмын хөтөлбөрийг үлдээв.
  // Хонох газрыг өдөр тус бүрээр биш, ерөнхийд нь (accommodation) бичив: баримтад аль шөнө гэрт хонохыг заагаагүй.
  // ─────────────────────────────────────────────────────────────────────
  {
    slug: "wildlife-photography",
    hero: {
      title: {
        en: "Wildlife & Nature Photography Expedition",
        ko: "야생동물·자연 사진 탐험",
        mn: "Зэрлэг амьтан, байгалийн гэрэл зураг",
        ja: "野生動物・自然写真エクスペディション",
      },
      subtitle: {
        en: "5 days / 4 nights · 3–8 travelers · June 16–20 & August 18–22, 2027",
        ko: "4박 5일 · 3–8명 · 2027년 6월 16~20일 / 8월 18~22일",
        mn: "5 өдөр / 4 шөнө · 3–8 хүн · 2027.06.16–20 / 2027.08.18–22",
        ja: "5日間 / 4泊 · 3〜8名 · 2027年6月16〜20日 / 8月18〜22日",
      },
      image: birdPhotographyHero,
      imageHd: birdPhotographyHeroHd,
      imageWebp: birdPhotographyHeroWebp,
      imageObjectPosition: "center 32%",
    },
    overview: {
      duration: { mn: "5 өдөр / 4 шөнө", ko: "4박 5일", en: "5 days / 4 nights", ja: "5日間 / 4泊" },
      groupSize: { mn: "3–8 хүн", ko: "3–8명", en: "3–8 travelers", ja: "3〜8名" },
      crew: {
        mn: "Мэргэжлийн шувуу судлаач, Хөтөч + Жолооч + Тогооч",
        ko: "전문 조류학자, 가이드 + 운전기사 + 요리사",
        en: "Professional Ornithologist, Guide + Driver + Chef",
      },
      route: {
        en: "Ulaanbaatar → Süm Khökh Bürd → Erdenesant → Jargalant → Bayan Nuur → Ulaanbaatar",
        ko: "울란바토르 → 숨 후흐 부르드 → 에르데네산트 → 자르갈란트 → 바얀 호수 → 울란바토르",
        mn: "Улаанбаатар → Сүм Хөх Бүрд → Эрдэнэсант → Жаргалант → Баян нуур → Улаанбаатар",
        ja: "ウランバートル → スム・フフ・ブルド → エルデネサント → ジャルガラント → バヤン湖 → ウランバートル",
      },
    },
    description: {
      mn: "Говь хээр, намагт нуур, ой модод зэрэг Монголын ховор нандин шувуудын гэрэл зургийг хальснаа буулгах 5 өдрийн аялал. Мэргэжлийн шувуу судлаач, хөтчийн хамт нар мандах, жаргах үед ховор болон онцгой агшинг зургийн цомогтоо нэмэх боломжтой.",
      ko: "고비 초원, 습지 호수, 숲 속 나무 등 몽골의 희귀하고 소중한 조류 사진을 렌즈에 담는 5일 여정. 전문 조류학자와 가이드가 함께 일출·일몰 때 희귀하고 특별한 순간을 사진 앨범에 담을 수 있습니다.",
      en: "A five-day journey capturing Mongolia's rare and precious birds on camera—from Gobi steppe and wetland lakes to forest woodland. With a professional ornithologist and guide, add rare and special moments to your photo album at sunrise and sunset.",
    },
    accommodation: {
      en: "Three nights in tents and one night in a ger camp.",
      ko: "텐트 3박, 게르 캠프 1박.",
      mn: "3 шөнө майхан, 1 шөнө гэр бааз.",
      ja: "テント泊3泊、ゲルキャンプ泊1泊。",
    },
    days: [
      {
        day: 1,
        title: {
          mn: "Улаанбаатар → Сүм Хөх Бүрд",
          ko: "울란바토르 → 숨 후흐 부르드",
          en: "Ulaanbaatar → Süm Khökh Bürd",
          ja: "ウランバートル → スム・フフ・ブルド",
        },
        subtitle: {
          mn: "Говь хээр, намгийн шувууд",
          ko: "고비 초원과 습지 조류",
        },
        schedule: [
          {
            time: "Өглөө",
            text: {
              mn: "Улаанбаатараас хөдөлнө. \"Хөх бүрд\" жуулчны баазад ирнэ.",
              ko: "울란바토르에서 출발. \"숨 훕 부르드\" 관광기지 도착.",
              en: "Depart from Ulaanbaatar and arrive at the \"Khokh Burd\" tourist base.",
            },
          },
          {
            time: "Үд",
            text: {
              mn: "Өдрийн хоол (Жуулчны баазад). Амралт, бэлтгэл.",
              ko: "점심 식사 (관광기지). 휴식 및 장비 준비.",
              en: "Lunch at the base. Rest and equipment preparation.",
            },
          },
          {
            time: "Орой",
            text: {
              mn: "Говь хээрийн болон цөөрмийн шувуудын зураг авах. Оройн хоол (Жуулчны баазад).",
              ko: "초원 및 습지 조류 촬영. 저녁 식사 (관광기지).",
              en: "Photograph steppe and wetland birds. Dinner at the base.",
            },
          },
          {
            time: "Шөнө",
            text: {
              mn: "Одон орны гэрэл зураг (оддын зураг) авах.",
              ko: "야간 별 촬영.",
              en: "Astrophotography and star trail shooting.",
            },
          },
        ],
      },
      {
        day: 2,
        title: {
          mn: "Сүм Хөх Бүрд → Эрдэнэсант",
          ko: "숨 후흐 부르드 → 에르데네산트",
          en: "Süm Khökh Bürd → Erdenesant",
          ja: "スム・フフ・ブルド → エルデネサント",
        },
        subtitle: { mn: "Хээр тал, малчин айл", ko: "초원과 유목민 가정", en: "Open Steppe & Nomadic Family" },
        schedule: [
          {
            time: "Өглөө",
            text: {
              mn: "Үүр цайх үеийн зураглал, говь хээрийн шувууд. Өглөөний цай. Төв аймаг, Бүрэн сум руу хөдөлнө (120 км). Замдаа шувуу харах 1–2 зогсолттой.",
              ko: "새벽 촬영, 초원 조류. 아침 식사. 투브 아이막 부렌 솜으로 이동 (120km). 도중 1–2회 조류 관찰.",
              en: "Dawn photography and Gobi steppe birds. Breakfast. Drive to Tuv Province, Buren Soum (120 km) with 1–2 birdwatching stops en route.",
            },
          },
          {
            time: "Үд",
            text: {
              mn: "Бүрэн сумын орчим хээрийн өдрийн хоол.",
              ko: "부렌 솜 근처 들판 점심.",
              en: "Picnic lunch near Buren Soum.",
            },
          },
          {
            time: "Үдээс хойш",
            text: {
              mn: "Эрдэнэсант суманд ирж малчин айлд зочилж, хөнгөн цайлна. Малчны хот, ахуй амьдралын зураг авах. Ойр орчимд шувуу ажиглах.",
              ko: "에르덴산트 도착, 유목민 가정 방문 후 차 한잔. 유목민 일상 촬영 및 주변 조류 관찰.",
              en: "Arrive in Erdene Santi Soum; visit a nomadic family and enjoy tea. Photograph nomadic daily life and observe nearby birds.",
            },
          },
          {
            time: "Орой",
            text: {
              mn: "Оройн хоол (Малчин айлын уламжлалт монгол хоол).",
              ko: "저녁 식사 (전통 몽골 가정식).",
              en: "Dinner (traditional Mongolian meal at a nomadic home).",
            },
          },
        ],
      },
      {
        day: 3,
        title: {
          mn: "Эрдэнэсант → Жаргалант",
          ko: "에르덴산트 → 자르갈란트",
        },
        subtitle: { mn: "Баян-Уул ойн бүс", ko: "바얀-올 산림 지대", en: "Bayan-Uul Forest Region" },
        schedule: [
          {
            time: "Өглөө",
            text: {
              mn: "Өндөр хад асгаар нутаглах махчин шувууд (Тас, Ёл) зураг авах. Өглөөний цай. Цэцэрлэг хот руу хөдөлнө.",
              ko: "절벽 맹금류 (Cinereous Vulture, Lammergeier) 촬영. 아침 식사. 체체를렉 시로 이동.",
              en: "Photograph cliff-dwelling raptors (Cinereous Vulture, Lammergeier, etc.). Breakfast. Drive to Tsetserleg city.",
              ja: "断崖に棲む猛禽類（クロハゲワシ、ヒゲワシなど）を撮影。朝食。ツェツェルレグ市へ移動。",
            },
          },
          {
            time: "Үд",
            text: {
              mn: "Өдрийн хоол (Цэцэрлэг хотод).",
              ko: "점심 식사 (체체를렉).",
              en: "Lunch in Tsetserleg.",
            },
          },
          {
            time: "Үдээс хойш",
            text: {
              mn: "Жаргалант суманд ирнэ. Ойн шувуудын зураг авах.",
              ko: "자르갈란트 도착. 산림 조류 촬영.",
              en: "Arrive in Jargalant Soum. Photograph forest birds.",
              ja: "ジャルガラント・スームに到着。森林の野鳥を撮影します。",
            },
          },
          {
            time: "Орой",
            text: {
              mn: "Оройн хоол.",
              ko: "저녁 식사.",
              en: "Dinner.",
              ja: "夕食。",
            },
          },
          {
            time: "Шөнө",
            text: {
              mn: "Гэрэл зургийн талаар ярилцлага, дүгнэлт.",
              ko: "사진 리뷰 및 피드백 세션.",
              en: "Photo review and feedback session.",
            },
          },
        ],
      },
      {
        day: 4,
        title: {
          mn: "Жаргалант → Баян нуур",
          ko: "자르갈란트 → 바얀 누르",
        },
        subtitle: { mn: "Ой моддоос намагт нуур луу", ko: "숲에서 습지 호수로", en: "From forest woodland to wetland lake" },
        schedule: [
          {
            time: "Өглөө",
            text: {
              mn: "Үүр цайх үеийн ойн зураг авалт. Өглөөний цай. Баян нуур луу хөдөлнө.",
              ko: "새벽 산림 촬영. 아침 식사. 바얀 누르로 이동.",
              en: "Dawn forest photography. Breakfast. Drive to Bayan Nuur.",
            },
          },
          {
            time: "Үд",
            text: {
              mn: "Баян нуурт ирж, хээрийн өдрийн хоол идэх.",
              ko: "바얀 누르 도착, 야외 점심.",
              en: "Arrive at Bayan Nuur and enjoy an outdoor lunch.",
            },
          },
          {
            time: "Үдээс хойш",
            text: {
              mn: "Намгархаг газар болон хээрийн шувуудын зураг авах.",
              ko: "습지 및 초원 조류 촬영.",
              en: "Photograph wetland and steppe birds.",
            },
          },
          {
            time: "Орой",
            text: {
              mn: "Нар жаргах үеийн шувууны зураг авалт. Оройн хоол (Хээрийн).",
              ko: "황혼녘 조류 촬영. 저녁 식사 (야외).",
              en: "Sunset bird photography. Dinner outdoors.",
            },
          },
        ],
      },
      {
        day: 5,
        title: {
          mn: "Сүүлчийн зураг авалт → Улаанбаатар",
          ko: "마지막 촬영 → 울란바토르",
        },
        subtitle: { mn: "Нар мандах · буцах өдөр", ko: "일출 촬영 · 귀환", en: "Sunrise · Return Day" },
        schedule: [
          {
            time: "Өглөө",
            text: {
              mn: "Нар мандах үеийн сүүлчийн зураг авалт. Өглөөний цай (Хээрийн). Улаанбаатар руу хөдөлнө.",
              ko: "일출 마지막 촬영. 아침 식사 (야외). 울란바토르로 출발.",
              en: "Final sunrise photography session. Breakfast outdoors. Drive to Ulaanbaatar.",
            },
          },
          {
            time: "Үд",
            text: {
              mn: "Лүн суманд өдрийн хоол.",
              ko: "런 솜에서 점심.",
              en: "Lunch in Lun Soum.",
            },
          },
          {
            time: "Үдээс хойш",
            text: {
              mn: "Улаанбаатарт ирж аялал өндөрлөнө. Шууд нисэх хүмүүсийг нисэх буудалд хүргэнэ.",
              ko: "울란바토르 도착, 투어 종료. 직항 이용 손님은 공항까지 모셔다 드립니다.",
              en: "Arrive in Ulaanbaatar and conclude the tour. Direct-flight guests are transferred to the airport.",
            },
          },
        ],
      },
    ],
    meals: {
      breakfast: { mn: "Өндөг, талх, цай, кофе", ko: "계란, 빵, 차, 커피", en: "Eggs, bread, tea, and coffee" },
      lunch: { mn: "Хээрийн пикник (Сэндвич, бэлэн хоол, зууш)", ko: "야외 피크닉 (샌드위치, 즉석 식사, 스낵)", en: "Outdoor picnic (sandwiches, ready meals, snacks)" },
      dinner: { mn: "Хонины болон үхрийн махан хуурга, шарсан мах, шөл", ko: "양고기 및 소고기 볶음, 구이, 수프", en: "Lamb and beef stir-fry, grilled meat, and soup" },
      special: {
        mn: "2 дахь өдөр малчин айлд уламжлалт монгол хоол",
        ko: "2일째 유목민 가정에서 전통 몽골 가정식",
      },
    },
    highlights: {
      title: { mn: "Гол зорилтот шувууд", ko: "주요 관찰 조류", en: "Target Species" },
      items: [
        { mn: "Бүргэд (Golden Eagle), Хээрийн бүргэд (Steppe Eagle)", ko: "검독수리, 초원독수리", en: "Golden Eagle, Steppe Eagle" },
        { mn: "Тас (Cinereous Vulture), Ёл (Lammergeier)", ko: "독수리, 수염수리", en: "Cinereous Vulture, Lammergeier" },
        { mn: "Ахууна (Upland Buzzard)", ko: "큰말똥가리", en: "Upland Buzzard" },
        { mn: "Тоншуул (Хар, Саарал, Цагаан нуруутай)", ko: "딱따구리 (검은, 회색, 흰등)", en: "Woodpeckers (Black, Grey, White-backed)" },
        { mn: "Хөх бух (Willow Tit), Улаан хошуут жунгаа (Red-billed Chough)", ko: "버들박새, 붉은부리까마귀", en: "Willow Tit, Red-billed Chough" },
        { mn: "Болжмор (Larks & Buntings)", ko: "종다리류 및 멧새류", en: "Larks & Buntings" },
        { mn: "Усны шувууд (Нугас, Галуу, Тогоруу — улирлаас хамаарна)", ko: "수금류 (오리, 거위, 두루미 — 계절에 따라)", en: "Waterfowl (Ducks, Geese, Cranes — seasonal)" },
      ],
    },
    logistics: [
      { mn: "4WD бартаат замын автомашинаар аялна.", ko: "4WD 오프로드 차량으로 이동.", en: "Travel by 4WD off-road vehicle." },
      { mn: "Хээрийн хоногуудад кэмпийн тоног төхөөрөмж бэлэн байна.", ko: "야외 숙박 시 캠핑 장비 완비.", en: "Full camping equipment provided for outdoor nights." },
      { mn: "Мэргэжлийн шувуу судлаач, хөтөч болон хээрийн тогооч ажиллана.", ko: "전문 조류학자, 가이드와 야외 요리사 동행.", en: "Professional ornithologist, guide and field chef included." },
    ],
    included: [
      AIRPORT_TRANSFER_INCLUDED,
      {
        mn: "Аялал эхлэхээс өмнө онгоцны билет захиалахад туслалцаа үзүүлнэ (Билетээ өөрсдөө авна).",
        ko: "출발 전 항공권 예약 지원 (항공권은 본인이 직접 구매).",
      },
      { mn: "Бүх дотоодын тээвэр, байр, хоол.", ko: "모든 국내 교통, 숙박, 식사.", en: "All domestic transport, accommodation, and meals." },
      { mn: "Мэргэжлийн хөтөч, тогооч.", ko: "전문 가이드 및 요리사.", en: "Professional guide and chef." },
    ],
    excluded: [
      INTERNATIONAL_AIRFARE_EXCLUDED,
      {
        mn: "Аялал эхлэхээс өмнөх болон дууссаны дараах хотын зочид буудлын зардал.",
        ko: "투어 전후 도시 호텔 비용.",
      },
      { mn: "Хувийн зардлууд.", ko: "개인 비용.", en: "Personal expenses." },
      TRAVEL_INSURANCE_REQUIRED,
    ],
    notices: [
      {
        en: "Wildlife sightings are not guaranteed.",
        ko: "야생동물 관찰은 보장되지 않습니다.",
        mn: "Зэрлэг амьтан үзэгдэхийг баталгаажуулахгүй.",
        ja: "野生動物の観察は保証されません。",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // Summer Freshwater Fishing (хуучин: kherlen-fishing)
  // Хуучин хөтөлбөр 3 өдөр / 2 шөнө байсан — баримт 4 өдөр / 3 шөнө, байшин,
  // бугын аж ахуй гэж заасан тул зөрчилдөж байна. Хуучин өдрүүдийг хасав.
  // TODO(content): 4 өдрийн өдөрчилсөн хөтөлбөр, хоолны цэс.
  // ─────────────────────────────────────────────────────────────────────
  {
    slug: "summer-fishing",
    hero: {
      title: {
        en: "Summer Freshwater Fishing Expedition",
        ko: "여름 민물낚시 탐험",
        mn: "Зуны цэнгэг усны загасчлал",
        ja: "夏の淡水釣りエクスペディション",
      },
      subtitle: {
        en: "4 days / 3 nights · 1–6 travelers · Kherlen River / Mungunmorit",
        ko: "3박 4일 · 1–6명 · 헤를렌강 / 뭉근모리트",
        mn: "4 өдөр / 3 шөнө · 1–6 хүн · Хэрлэн / Мөнгөнморьт",
        ja: "4日間 / 3泊 · 1〜6名 · ヘルレン川 / ムングンモリト",
      },
      image: freshwaterFishingHero,
      imageHd: freshwaterFishingHeroHd,
      imageWebp: freshwaterFishingHeroWebp,
    },
    overview: {
      duration: { mn: "4 өдөр / 3 шөнө", ko: "3박 4일", en: "4 days / 3 nights", ja: "4日間 / 3泊" },
      groupSize: { mn: "1–6 хүн", ko: "1–6명", en: "1–6 travelers", ja: "1〜6名" },
      crew: {
        en: "Fishing guide, interpreter, driver and cook",
        ko: "낚시 가이드, 통역, 운전기사, 요리사",
        mn: "Загасчлалын хөтөч, орчуулагч, жолооч, тогооч",
        ja: "釣りガイド、通訳、ドライバー、料理人",
      },
      route: {
        en: "Kherlen River / Mungunmorit",
        ko: "헤를렌강 / 뭉근모리트",
        mn: "Хэрлэн / Мөнгөнморьт",
        ja: "ヘルレン川 / ムングンモリト",
      },
    },
    description: {
      en: "Fishing guide, interpreter, driver and cook; cabin accommodation and planned deer-farm visit. Fishing subject to law and permits. Not operated March 22–June 22.",
      ko: "낚시 가이드, 통역, 운전기사, 요리사 동행. 캐빈 숙박과 사슴 농장 방문 예정. 현지 법규와 허가에 따르며 3월 22일~6월 22일 운영하지 않습니다.",
      mn: "Загасчлалын хөтөч, орчуулагч, жолооч, тогоочтой. Байшинд байрлах, бугын аж ахуй үзэхээр төлөвлөсөн. Хууль, зөвшөөрөл, хориг мөрдөнө. 3-р сарын 22–6-р сарын 22-нд ажиллахгүй.",
      ja: "釣りガイド、通訳、ドライバー、料理人が同行。キャビン泊、鹿牧場の見学を予定しています。釣りは法令と許可に従います。3月22日〜6月22日は催行しません。",
    },
    accommodation: {
      en: "Cabin accommodation.",
      ko: "캐빈 숙박.",
      mn: "Байшинд байрлана.",
      ja: "キャビン泊。",
    },
    days: [],
    logistics: [],
    included: [
      AIRPORT_TRANSFER_INCLUDED,
      {
        en: "Fishing guide, interpreter, driver and cook.",
        ko: "낚시 가이드, 통역, 운전기사, 요리사 동행.",
        mn: "Загасчлалын хөтөч, орчуулагч, жолооч, тогооч.",
        ja: "釣りガイド、通訳、ドライバー、料理人の同行。",
      },
      {
        en: "Cabin accommodation and planned deer-farm visit.",
        ko: "캐빈 숙박과 사슴 농장 방문 예정.",
        mn: "Байшинд байрлах, бугын аж ахуй үзэх (төлөвлөсөн).",
        ja: "キャビン泊と鹿牧場の見学（予定）。",
      },
    ],
    excluded: [INTERNATIONAL_AIRFARE_EXCLUDED, TRAVEL_INSURANCE_REQUIRED],
    notices: [
      {
        en: "Fishing subject to law and permits. Not operated March 22–June 22.",
        ko: "현지 법규와 허가에 따르며 3월 22일~6월 22일 운영하지 않습니다.",
        mn: "Хууль, зөвшөөрөл, хориг мөрдөнө. 3-р сарын 22–6-р сарын 22-нд ажиллахгүй.",
        ja: "釣りは法令と許可に従います。3月22日〜6月22日は催行しません。",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // Winter Ice Fishing — ШИНЭ аялал (2027)
  // TODO(content): өдөрчилсөн хөтөлбөр, байршил, багийн бүрэлдэхүүн, хоол.
  // TODO(content: real winter ice fishing photo) — одоогоор neutral placeholder.
  // ─────────────────────────────────────────────────────────────────────
  {
    slug: "winter-ice-fishing",
    hero: {
      title: {
        en: "Winter Ice Fishing Expedition",
        ko: "겨울 얼음낚시 탐험",
        mn: "Өвлийн мөсөн загасчлал",
        ja: "冬の氷上釣りエクスペディション",
      },
      subtitle: {
        en: "4 days / 3 nights · 1–6 travelers · December–February",
        ko: "3박 4일 · 1–6명 · 12월~2월",
        mn: "4 өдөр / 3 шөнө · 1–6 хүн · 12–2-р сар",
        ja: "4日間 / 3泊 · 1〜6名 · 12月〜2月",
      },
      // TODO(content: real winter ice fishing photo)
      image: tourPlaceholder,
    },
    overview: {
      duration: { mn: "4 өдөр / 3 шөнө", ko: "3박 4일", en: "4 days / 3 nights", ja: "4日間 / 3泊" },
      groupSize: { mn: "1–6 хүн", ko: "1–6명", en: "1–6 travelers", ja: "1〜6名" },
      crew: {
        en: "Local support team",
        ko: "현지 전문 인력",
        mn: "Орон нутгийн мэргэжлийн баг",
        ja: "現地サポートチーム",
      },
    },
    description: {
      en: "Ice fishing with local support and heated cabin accommodation. Operates only when ice, weather and legal conditions are safe.",
      ko: "현지 전문 인력과 난방 캐빈 숙박을 포함하는 겨울 낚시 여행. 얼음 안전, 날씨 및 관련 법규에 따라 운영합니다.",
      mn: "Мэргэжлийн багтай, дулаан байранд байрлах өвлийн аялал. Мөсний аюулгүй байдал, цаг агаар, загасчлалын дүрмээс хамаарна.",
      ja: "現地サポートチームと暖房付きキャビン泊の氷上釣り。氷、天候、法的条件が安全な場合にのみ催行します。",
    },
    accommodation: {
      en: "Heated cabin accommodation.",
      ko: "난방 캐빈 숙박.",
      mn: "Дулаан байранд байрлана.",
      ja: "暖房付きキャビン泊。",
    },
    days: [],
    logistics: [],
    included: [
      AIRPORT_TRANSFER_INCLUDED,
      {
        en: "Local support team and heated cabin accommodation.",
        ko: "현지 전문 인력과 난방 캐빈 숙박.",
        mn: "Орон нутгийн мэргэжлийн баг, дулаан байр.",
        ja: "現地サポートチームと暖房付きキャビン泊。",
      },
    ],
    excluded: [INTERNATIONAL_AIRFARE_EXCLUDED, TRAVEL_INSURANCE_REQUIRED],
    notices: [
      {
        en: "Operates only when ice, weather and legal conditions are safe.",
        ko: "얼음 안전, 날씨 및 관련 법규에 따라 운영합니다.",
        mn: "Мөсний аюулгүй байдал, цаг агаар, загасчлалын дүрмээс хамаарна.",
        ja: "氷、天候、法的条件が安全な場合にのみ催行します。",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // Nomadic Culture Experience (хуучин: arburd-gobi)
  // Хуучин хөтөлбөрт 3 дахь шөнө Улаанбаатарын зочид буудалд хонодог байсан —
  // баримт "2 шөнө гэр бааз, 1 шөнө малчин айлд" гэж заасан тул зөрчилдөж байна.
  // Хуучин өдрүүдийг хасав (git түүхэд байгаа).
  // TODO(content): баримттай нийцсэн 4 өдрийн хөтөлбөр, хоолны цэс, багийн бүрэлдэхүүн, улирал.
  // ─────────────────────────────────────────────────────────────────────
  {
    slug: "nomadic-culture",
    hero: {
      title: {
        en: "Nomadic Culture Experience",
        ko: "몽골 유목 문화 체험",
        mn: "Нүүдлийн соёлын аялал",
        ja: "遊牧文化体験",
      },
      subtitle: {
        en: "4 days / 3 nights · 1–6 travelers · Arburd",
        ko: "3박 4일 · 1–6명 · 아르부르드",
        mn: "4 өдөр / 3 шөнө · 1–6 хүн · Ар бүрд",
        ja: "4日間 / 3泊 · 1〜6名 · アルブルド",
      },
      image: nomadicCultureHero,
      imageHd: nomadicCultureHeroHd,
      imageWebp: nomadicCultureHeroWebp,
    },
    overview: {
      duration: { mn: "4 өдөр / 3 шөнө", ko: "3박 4일", en: "4 days / 3 nights", ja: "4日間 / 3泊" },
      groupSize: { mn: "1–6 хүн", ko: "1–6명", en: "1–6 travelers", ja: "1〜6名" },
      route: { en: "Arburd", ko: "아르부르드", mn: "Ар бүрд", ja: "アルブルド" },
    },
    description: {
      en: "Visit a nomadic family and discover traditional rural life. Two nights in ger camp and one night with a local family, subject to host availability.",
      ko: "유목민 가족을 만나 전통 생활을 체험합니다. 게르 캠프 2박, 현지 가족 숙박 1박(수용 가능 여부에 따라 조정).",
      mn: "Малчин айлд зочилж нүүдэлчдийн ахуйтай танилцана. 2 шөнө гэр бааз, 1 шөнө малчин айлд (хүлээн авах боломжид нийцүүлнэ).",
      ja: "遊牧民の家族を訪ね、伝統的な暮らしに触れます。ゲルキャンプ2泊、現地家庭に1泊（受け入れ状況により調整）。",
    },
    accommodation: {
      en: "Two nights in ger camp and one night with a local family, subject to host availability.",
      ko: "게르 캠프 2박, 현지 가족 숙박 1박(수용 가능 여부에 따라 조정).",
      mn: "2 шөнө гэр бааз, 1 шөнө малчин айлд (хүлээн авах боломжид нийцүүлнэ).",
      ja: "ゲルキャンプ2泊、現地家庭に1泊（受け入れ状況により調整）。",
    },
    days: [],
    logistics: [],
    included: [AIRPORT_TRANSFER_INCLUDED],
    excluded: [INTERNATIONAL_AIRFARE_EXCLUDED, TRAVEL_INSURANCE_REQUIRED],
    notices: [],
  },

  // ─────────────────────────────────────────────────────────────────────
  // Winter Hunting — ЗӨВХӨН МЭДЭЭЛЛИЙН ХҮСЭЛТ. Үнэ, урьдчилгаа, тооцоолуур байхгүй.
  // TODO(content): лицензтэй/бодит зураг эсэхийг баталгаажуулах.
  // ─────────────────────────────────────────────────────────────────────
  {
    slug: "winter-hunting",
    hero: {
      title: {
        en: "Winter Hunting Expedition",
        ko: "겨울 사냥 탐험",
        mn: "Өвлийн ангийн аялал",
        ja: "冬の狩猟エクスペディション",
      },
      subtitle: {
        en: "6 days / 5 nights · 1–4 travelers · Winter · Price on request",
        ko: "5박 6일 · 1–4명 · 겨울 · 가격 문의",
        mn: "6 өдөр / 5 шөнө · 1–4 хүн · Өвөл · Үнэ хүсэлтээр",
        ja: "6日間 / 5泊 · 1〜4名 · 冬 · 料金はお問い合わせ",
      },
      image: winterHuntingHero,
    },
    overview: {
      duration: { mn: "6 өдөр / 5 шөнө", ko: "5박 6일", en: "6 days / 5 nights", ja: "6日間 / 5泊" },
      groupSize: { mn: "1–4 хүн", ko: "1–4명", en: "1–4 travelers", ja: "1〜4名" },
    },
    description: {
      en: "Proposed specialist itinerary with two nights in Ulaanbaatar and three nights in a heated countryside cabin.",
      ko: "울란바토르 2박, 지방의 난방 캐빈 3박을 포함하는 전문 여행 제안.",
      mn: "Улаанбаатарт 2 шөнө, хөдөө дулаан байшинд 3 шөнө байрлах тусгай сонирхлын санал.",
      ja: "ウランバートル2泊、暖房付きの地方キャビン3泊を含む専門的な旅程のご提案。",
    },
    accommodation: {
      en: "Two nights in Ulaanbaatar and three nights in a heated countryside cabin.",
      ko: "울란바토르 2박, 지방의 난방 캐빈 3박.",
      mn: "Улаанбаатарт 2 шөнө, хөдөө дулаан байшинд 3 шөнө.",
      ja: "ウランバートル2泊、暖房付きの地方キャビン3泊。",
    },
    days: [],
    logistics: [],
    included: [],
    excluded: [],
    notices: [
      {
        en: "Public information and inquiries only. No booking confirmation or payment until all legal permits, wildlife protection, insurance and safety requirements have been verified.",
        ko: "현재 정보 문의만 가능합니다. 법적 허가, 야생동물 보호, 보험 및 안전 요건 확인 전에는 예약 확정이나 결제를 받지 않습니다.",
        mn: "Одоогоор зөвхөн мэдээллийн хүсэлт авна. Хууль, зөвшөөрөл, ан амьтны хамгаалал, даатгал, аюулгүй байдлыг албан ёсоор баталгаажуулахаас өмнө захиалга батлах, төлбөр авахгүй.",
        ja: "現在は情報提供とお問い合わせのみ受け付けています。法的許可、野生動物保護、保険、安全要件がすべて確認されるまで、予約の確定やお支払いは承りません。",
      },
    ],
  },
];

export function getTourBySlug(slug: string): Tour | undefined {
  return tours.find((tour) => tour.slug === slug);
}

/** Баримтын дарааллаар (shared/tours-2027.ts-ийн TOURS_2027) */
export function toursInCatalogOrder(): Tour[] {
  return TOURS_2027.map((c) => getTourBySlug(c.slug)).filter((t): t is Tour => Boolean(t));
}
