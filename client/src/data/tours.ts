// Аяллын хөтөлбөрийн өгөгдлийн төв сан.
// Шинэ аялал нэмэхдээ доорх Tour интерфейст тохирсон объект үүсгэж
// `tours` массивт нэмэх юм.

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

export type PriceTier = {
  groupSize: LocalizedString;
  pricePerPerson: LocalizedString;
};

export type SpecialDeparture = {
  badge: LocalizedString;
  title: LocalizedString;
  description: LocalizedString;
  date: LocalizedString;
  route: LocalizedString;
  highlights: LocalizedString[];
};

export type ComingSoonContent = {
  eyebrow: LocalizedString;
  headline: LocalizedString;
  paragraphs: LocalizedString[];
  brandLine?: LocalizedString;
  tagline: LocalizedString;
};

export type Tour = {
  slug: string;
  status: "available" | "coming_soon";
  hero: {
    title: LocalizedString;
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
    target: LocalizedString;
    crew: LocalizedString;
    route: LocalizedString;
  };
  description: LocalizedString;
  days: DayPlan[];
  meals: {
    breakfast: LocalizedString;
    lunch: LocalizedString;
    dinner: LocalizedString;
    special?: LocalizedString;
  };
  highlights: {
    title: LocalizedString;
    items: LocalizedString[];
  };
  logistics: LocalizedString[];
  pricing: {
    note: LocalizedString;
    tiers: PriceTier[];
    included: LocalizedString[];
    excluded: LocalizedString[];
  };
  specialDepartures?: SpecialDeparture[];
  comingSoon?: ComingSoonContent;
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
import fishingTourImage from "@assets/IMG_7060_1772631198093.jpeg";
import winterHuntingHero from "@assets/winter-hunting-hero.png";

export const tours: Tour[] = [
  {
    slug: "bird-photography",
    status: "available",
    hero: {
      title: {
        mn: "Шувуудын гэрэл зургийн аялал",
        ko: "조류 사진 탐험",
      },
      subtitle: {
        mn: "Архангай · Хөх бүрд → Эрдэнэсант → Жаргалант → Баян нуур",
        ko: "아르항가이 루프 · Khokh Burd → 에르덴산트 → 자르갈란트 → 바얀 누르",
      },
      image: birdPhotographyHero,
      imageHd: birdPhotographyHeroHd,
      imageWebp: birdPhotographyHeroWebp,
      imageObjectPosition: "center 32%",
    },
    overview: {
      duration: { mn: "5 өдөр / 4 шөнө", ko: "5일 / 4박", en: "5 Days / 4 Nights" },
      target: {
        mn: "Солонгосын шувууны гэрэл зурагчид\n/ Аялагчдын тоо хязгаартай /",
        ko: "한국 조류 사진가\n/ 여행자 수 제한 /",
        en: "Korean Bird Photographers\n/ Limited number of travelers /",
      },
      crew: {
        mn: "Мэргэжлийн шувуу судлаач, Хөтөч + Жолооч + Тогооч",
        ko: "전문 조류학자, 가이드 + 운전기사 + 요리사",
        en: "Professional Ornithologist, Guide + Driver + Chef",
      },
      route: {
        mn: "Улаанбаатар → Хөх бүрд → Эрдэнэсант → Жаргалант → Баян нуур → Улаанбаатар",
        ko: "울란바토르 → 훕스굴(Khokh Burd) → 에르덴산트 → 자르갈란트 → 바얀 누르 → 울란바토르",
      },
    },
    description: {
      mn: "Говь хээр, намагт нуур, ой модод зэрэг Монголын ховор нандин шувуудын гэрэл зургийг хальснаа буулгах 5 өдрийн аялал. Мэргэжлийн шувуу судлаач, хөтчийн хамт нар мандах, жаргах үед ховор болон онцгой агшинг зургийн цомогтоо нэмэх боломжтой.",
      ko: "고비 초원, 습지 호수, 숲 속 나무 등 몽골의 희귀하고 소중한 조류 사진을 렌즈에 담는 5일 여정. 전문 조류학자와 가이드가 함께 일출·일몰 때 희귀하고 특별한 순간을 사진 앨범에 담을 수 있습니다.",
      en: "A five-day journey capturing Mongolia's rare and precious birds on camera—from Gobi steppe and wetland lakes to forest woodland. With a professional ornithologist and guide, add rare and special moments to your photo album at sunrise and sunset.",
    },
    days: [
      {
        day: 1,
        title: {
          mn: "Улаанбаатар → Хөх бүрд",
          ko: "울란바토르 → 숨 훕 부르드",
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
        overnight: { mn: "Жуулчны баазад", ko: "관광 캠프 숙박", en: "Tourist Camp Accommodation" },
      },
      {
        day: 2,
        title: {
          mn: "Хөх бүрд → Эрдэнэсант",
          ko: "숨 훕 부르드 → 에르덴산트",
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
              mn: "Эрдэнэсант суманд ирж малчин айлд буудаллана, хөнгөн цайлна. Малчны хот, ахуй амьдралын зураг авах. Ойр орчимд шувуу ажиглах.",
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
        overnight: { mn: "Малчин айлд.", ko: "유목민 가정", en: "Nomadic family home" },
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
              mn: "Өндөр хад асгаар нутаглах махчин шувууд (Тас, Ёл ) зураг авах. Өглөөний цай (Айлдаа). Цэцэрлэг хот руу хөдөлнө.",
              ko: "절벽 맹금류 (Cinereous Vulture, Lammergeier) 촬영. 아침 식사 (가정에서). 체체를렉 시로 이동.",
              en: "Photograph cliff-dwelling raptors (Cinereous Vulture, Lammergeier, etc.). Breakfast at the family home. Drive to Tsetserleg city.",
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
              mn: "Жаргалант суманд ирж, жуулчны баазад буудаллана. Ойн шувуудын зураг авах.",
              ko: "자르갈란트 도착, 관광기지 체크인. 산림 조류 촬영.",
              en: "Arrive in Jargalant Soum and check in at the base. Photograph forest birds.",
            },
          },
          {
            time: "Орой",
            text: {
              mn: "Оройн хоол (Жуулчны баазад).",
              ko: "저녁 식사 (관광기지).",
              en: "Dinner at the tourist base.",
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
        overnight: { mn: "Жуулчны баазад", ko: "관광 캠프 숙박", en: "Tourist Camp Accommodation" },
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
        overnight: { mn: "Майханд хононо", ko: "텐트 숙박", en: "Tent Camping" },
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
      { mn: "Эрдэнэсантад малчин айлд хононо.", ko: "에르덴산트에서 유목민 가정 홈스테이.", en: "Overnight at a nomadic family home in Erdene Santi." },
      { mn: "Мэргэжлийн шувуу судлаач, хөтөч болон хээрийн тогооч ажиллана.", ko: "전문 조류학자, 가이드와 야외 요리사 동행.", en: "Professional ornithologist, guide and field chef included." },
    ],
    pricing: {
      note: {
        mn: "Аялал 4–5 хүн бүрдсэн үед эхэлнэ.",
        ko: "투어는 4–5명 모집 시 출발합니다.",
        en: "Tour departs when 4–5 participants are confirmed.",
      },
      tiers: [
        {
          groupSize: { mn: "5 хүнтэй баг", ko: "5명 그룹", en: "Group of 5" },
          pricePerPerson: { mn: "₩2,000,000 / 1 хүн", ko: "1인 ₩2,000,000", en: "₩2,000,000 per person" },
        },
        {
          groupSize: { mn: "4 хүнтэй баг", ko: "4명 그룹", en: "Group of 4" },
          pricePerPerson: { mn: "₩2,200,000 / 1 хүн", ko: "1인 ₩2,200,000", en: "₩2,200,000 per person" },
        },
        {
          groupSize: { mn: "3 хүн хүртэл", ko: "3명까지", en: "Up to 3 People" },
          pricePerPerson: { mn: "₩2,600,000 / 1 хүн", ko: "1인 ₩2,600,000", en: "₩2,600,000 per person" },
        },
      ],
      included: [
        { mn: "Нисэх буудлаас тосох, хүргэх үйлчилгээ.", ko: "공항 픽업 및 샌딩 서비스.", en: "Airport pickup and drop-off service." },
        {
          mn: "Аялал эхлэхээс өмнө онгоцны билет захиалахад туслалцаа үзүүлнэ (Билетээ өөрсдөө авна).",
          ko: "출발 전 항공권 예약 지원 (항공권은 본인이 직접 구매).",
        },
        { mn: "Бүх дотоодын тээвэр, байр, хоол.", ko: "모든 국내 교통, 숙박, 식사.", en: "All domestic transport, accommodation, and meals." },
        { mn: "Мэргэжлийн хөтөч, тогооч.", ko: "전문 가이드 및 요리사.", en: "Professional guide and chef." },
      ],
      excluded: [
        {
          mn: "Аялал эхлэхээс өмнөх болон дууссаны дараах хотын зочид буудлын зардал.",
          ko: "투어 전후 도시 호텔 비용.",
        },
        { mn: "Хувийн зардлууд.", ko: "개인 비용.", en: "Personal expenses." },
        {
          mn: "Аялагчид ирэхээсээ өмнө аяллын даатгалд заавал хамрагдсан байх шаардлагатай.",
          ko: "출국 전 여행자 보험 가입 필수.",
        },
      ],
    },
    specialDepartures: [
      {
        badge: { mn: "8-р сарын тусгай", ko: "8월 특별 일정", en: "August Special" },
        title: {
          mn: "Их байгалийн симфони — Шувууд ба Сүүн зам",
          ko: "[8월 광복절 연휴] 몽골 조류 & 은하수 출사 — 대자연의 교향곡",
        },
        description: {
          mn: "Зуны төгсгөлд Монголын тэнгэр хамгийн тунгалаг, гүн хөх өнгөөрөө гайхагдана. Өмнө зүг рүү нүүдэллэж эхэлсэн сүрэг шувууд болон шөнийн тэнгэрт цэлэлзэх Сүүн замыг нэгэн агшинд гэрэл зурагт мөнхлөх онцгой боломж таныг хүлээж байна.",
          ko: "여름의 끝자락, 몽골의 하늘은 가장 깊고 푸릅니다. 남쪽으로의 기나긴 여정을 준비하며 무리 짓는 새들과, 밤하늘을 수놓는 압도적인 은하수를 동시에 기록할 수 있는 단 한 번의 기회!",
        },
        date: {
          mn: "2026 оны 8 сарын 12 (Лхагва) – 8 сарын 16 (Ням)",
          ko: "2026년 8월 12일(수) ~ 8월 16일(일)",
        },
        route: {
          mn: "Архангай аймаг\n(Говь хээрийн бүс, ойт уулсын шувууд хүртэл)",
          ko: "아르항가이 루프 (고비 습지부터 숲속 조류까지)",
        },
        highlights: [
          {
            mn: "Залуу шувуудын нислэгийн сургалт болон сүрэглэн нүүдэллэх үйл явцыг ажиглах",
            ko: "성체가 된 새끼 새들의 비행 연습과 대규모 군집",
          },
          {
            mn: "Монгол гэрийн дээгүүр цацран харагдах Сүүн зам болон оддын гайхамшигт тэнгэрийг зураглах",
            ko: "몽골 텐트(게르) 위로 쏟아지는 별빛 궤적 촬영",
          },
          {
            mn: "Хээрийн гал тогоонд шинэхэн орц найрлагаар бэлтгэсэн орон нутгийн уламжлалт хоол",
            ko: "야외 필드 키친에서 즐기는 프리미엄 현지식",
          },
        ],
      },
      {
        badge: { mn: "5-р сарын тусгай", ko: "5월 특별 일정", en: "May Special" },
        title: {
          mn: "Хаврын чимээ — шувуудын дуу хоолой",
          ko: "[5월 연휴 특가] 몽골 조류 사진 출사 — 생명의 시작, 봄의 찬가",
        },
        description: {
          mn: "6 сарын 2-ны Солонгосын орон нутгийн сонгуулийн амралтыг ашиглан 4 шөнө 5 өдрийн төгс хуваарь! Үржлийн улирлын хамгийн өнгөлөг өдтэй ховор шувуудыг линз дээрээ буулгана уу.",
          ko: "6월 2일 지방선거 공휴일을 활용한 완벽한 4박 5일 일정! 번식기를 맞아 가장 화려한 깃털을 뽐내는 희귀 조류들을 렌즈에 담으세요.",
        },
        date: {
          mn: "2027 оны 5 сарын 29 (Баасан) — 6 сарын 2 (Мягмар)",
          ko: "2027년 5월 29일(금) ~ 6월 2일(화)",
        },
        route: {
          mn: "Хөх бүрд → Эрдэнэсант → Жаргалант → Баян нуур",
          ko: "Khokh Burd → 에르덴산트 → 자르갈란트 → 바얀 누르",
        },
        highlights: [
          {
            mn: "Тал нутаг даяар нисэх махчин шувуудын динамик нислэг",
            ko: "초원을 가르는 맹금류의 역동적인 비행",
          },
          {
            mn: "Намгархаг газарт усны шувуудын инээдэт бүжиг",
            ko: "습지대에서 펼쳐지는 물새들의 구애 댄스",
          },
          {
            mn: "Солонгос хэлтэй мэргэжлийн хөтөч ба шувуу судлаач хамт явна",
            ko: "한국어 소통 가능 전문 가이드 & 조류 전문가 동행",
          },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  // АЯЛАЛ #2 — Цэнгэг усны загасчлал (Хэрлэн гол)
  // ─────────────────────────────────────────────────────────────────────
  {
    slug: "kherlen-fishing",
    status: "available",
    hero: {
      title: {
        mn: "Цэнгэг усны загасчлалын аялал",
        ko: "민물 낚시 탐험",
      },
      subtitle: {
        mn: "Улаанбаатар → Чингис хааны хөшөө → Мөнгөн морт → УБ · 2 шөнө 3 өдөр",
        ko: "울란바토르 → 칭기즈 칸 기마 동상 → 뭉궁 모르트 → 울란바토르 · 2박 3일",
      },
      image: freshwaterFishingHero,
      imageHd: freshwaterFishingHeroHd,
      imageWebp: freshwaterFishingHeroWebp,
    },
    overview: {
      duration: { mn: "3 өдөр / 2 шөнө", ko: "2박 3일", en: "3 Days / 2 Nights" },
      target: {
        mn: "Загасчлал сонирхогчид (хамгийн ихдээ 6 хүн)",
        ko: "낚시 애호가 (최대 6인)",
      },
      crew: { mn: "Солонгос хэлтэй хөтөч + жолооч", ko: "한국어 가이드 + 운전기사", en: "Korean-speaking Guide + Driver" },
      route: {
        mn: "УБ → Чингис хаан хөшөө → Мөнгөн морт (~200 км) → УБ (~180 км)",
        ko: "울란바토르 → 칭기즈 칸 기마 동상 → 뭉궁 모르트 (~200km) → 울란바토르 (~180km)",
      },
    },
    description: {
      mn: "Хэрлэн голын эрэг дээр 2 шөнө хонож, өдөржингөө загас барьж, шөнийн тэнгэрийн дор оддыг ширтэн, найз нөхдөдтэйгөө уламжлалт хорхог зооглон, задгай karaoke-н уур амьсгалд автана. Чингис хааны их хөшөөгөөр зочлох ба эцэст нь Зайсан толгойноос Улаанбаатарын шөнийн харагдацыг сонирхоно.",
      ko: "헤를렌강 강변에서 2박을 보내며 매일 낚시를 즐기고, 별빛 아래서 야외 노래방과 한 잔의 술로 분위기를 만끽합니다. 칭기즈 칸 기마 동상도 방문하며, 마지막 날에는 시내 쇼핑과 자이산 언덕에서 야경 감상까지 즐기는 알찬 일정입니다.",
    },
    days: [
      {
        day: 1,
        title: {
          mn: "Улаанбаатар → Чингис хааны хөшөө → Мөнгөн морт",
          ko: "울란바토르 → 칭기즈 칸 기마 동상 → 뭉궁 모르트",
        },
        subtitle: { mn: "~200 км · Тусгай зориулалтын автомашин", ko: "~200km · 전용 차량", en: "~200 km · Private Vehicle" },
        schedule: [
          {
            time: "Өглөө",
            text: {
              mn: "Чингис хаан Олон Улсын Нисэх Буудал дээр хүлээн авч, хөтөчтэй танилцана.",
              ko: "칭기즈 칸 국제공항 도착 후 가이드 미팅.",
            },
          },
          {
            time: "Замдаа",
            text: {
              mn: "Дэлгүүр орж хувийн хэрэглээгээ хангана.",
              ko: "매장에서 개인용품 구입.",
            },
          },
          {
            time: "Үд дунд",
            text: {
              mn: "Чингис хааны морьт хөшөөгөөр зочлон, дотор үзэж, тэнгэрийн харааны тавцангаас дурсгалын зураг авч, бяцхан музей үзнэ.",
              ko: "칭기즈 칸 기마 동상 방문, 내부 관람 후 전망대에서 기념 촬영 및 소규모 박물관 관람.",
            },
          },
          {
            time: "Үдээс хойш",
            text: {
              mn: "Мөнгөн морьт суманд ирж, загасчны отогт (модон байшинд) байрлана.",
              ko: "뭉궁 모르트 작은 마을 도착 후 어부 오톡(통나무집)에 숙박.",
            },
          },
          {
            time: "Орой",
            text: {
              mn: "Хэрлэн голд анхны загасчлал, оройн хоолны хамт түүдэг галын дэргэд шөнийн оддыг сонирхоно.",
              ko: "헤를렌강에서 첫 낚시, 저녁 식사 후 모닥불 앞에서 밤하늘의 별을 감상.",
            },
          },
        ],
        overnight: {
          mn: "Загасчны отог.",
          ko: "어부 오톡.",
        },
      },
      {
        day: 2,
        title: {
          mn: "Бүтэн өдрийн загасчлал — Хэрлэн гол",
          ko: "헤를렌강 종일 낚시",
        },
        subtitle: {
          mn: "Шөнө: оддын дор задгай karaoke",
          ko: "밤: 별 아래 야외 노래방",
        },
        schedule: [
          {
            time: "Өглөө",
            text: {
              mn: "Хоолны дараа загасчлалын тоног төхөөрөмжөө бэлдэнэ.",
              ko: "조식 후 낚시 장비 준비.",
            },
          },
          {
            time: "Бүтэн өдөр",
            text: {
              mn: "Хэрлэн голын эрэг дээр загас барьж, амралтын зугаатай агшинуудыг бий болгоно.",
              ko: "하루 종일 헤를렌강 강변에서 낚시를 즐깁니다.",
            },
          },
          {
            time: "Орой",
            text: {
              mn: "Найзуудтайгаа уламжлалт Монгол хоол зооглоно.",
              ko: "친구들과 함께 전통 몽골 음식을 즐깁니다.",
            },
          },
          {
            time: "Шөнө",
            text: {
              mn: "Оддын доор задгай karaoke — найз нөхдөөрөө дуу дуулж, мартагдашгүй уур амьсгалыг бүтээнэ.",
              ko: "별 아래에서 야외 노래방 — 잊지 못할 추억을 만듭니다.",
            },
          },
        ],
        overnight: { mn: "Загасчны отог.", ko: "어부 오톡.", en: "Fisherman's otog." },
      },
      {
        day: 3,
        title: {
          mn: "Мөнгөн морт → Улаанбаатар",
          ko: "뭉궁 모르트 → 울란바토르",
        },
        subtitle: {
          mn: "~180 км · хотын аялал",
          ko: "~180km · 시내 투어",
        },
        schedule: [
          {
            time: "Өглөө",
            text: { mn: "Хоолны дараа Улаанбаатар руу хөдөлнө.", ko: "조식 후 울란바토르로 이동.", en: "Drive to Ulaanbaatar after breakfast." },
          },
          {
            time: "Үд",
            text: { mn: "Сүхбаатарын талбайгаар зочилно.", ko: "수흐바타르 광장 관람.", en: "Visit Sukhbaatar Square." },
          },
          {
            time: "Үдээс хойш",
            text: {
              mn: "Их Дэлгүүр болон Нарантуул дотоодын захад худалдан авалт хийнэ.",
              ko: "국영 백화점 및 나란뚤 시장 쇼핑.",
            },
          },
          {
            time: "Орой",
            text: {
              mn: "Зайсан толгойн оройноос Улаанбаатарын шөнийн гайхалтай харагдацыг сонирхоно.",
              ko: "자이산 언덕에 올라 울란바토르 시내 야경 감상.",
            },
          },
        ],
      },
    ],
    meals: {
      breakfast: { mn: "Дэлгүүрийн зууш / отгийн хоол", ko: "편의점식 / 오톡식", en: "Convenience-store snacks / otog meals" },
      lunch: { mn: "Орон нутгийн хоол / отгийн хоол", ko: "현지식 / 오톡식", en: "Local cuisine / otog meals" },
      dinner: { mn: "Отгийн хоол · сүүлийн өдөр шарсан мах", ko: "오톡식 · 마지막 날 샤브샤브", en: "Otog meals · hot pot on the final day" },
      special: {
        mn: "2 дахь өдөр уламжлалт хорхог",
        ko: "2일째 전통 음식 허르헉",
      },
    },
    highlights: {
      title: { mn: "Аяллын онцлох мөчүүд", ko: "투어 하이라이트", en: "Tour Highlights" },
      items: [
        { mn: "Хэрлэн голд бүтэн 1 өдрийн загасчлал", ko: "헤를렌강에서 종일 낚시", en: "Full day of fishing on the Kherlen River" },
        { mn: "Чингис хааны морьт хөшөөгөөр зочлох ба музей", ko: "칭기즈 칸 기마 동상 및 박물관 방문", en: "Visit the Chinggis Khaan equestrian statue and museum" },
        { mn: "Уламжлалт хорхог зооглох", ko: "전통 허르헉 시식", en: "Traditional khorhog dining experience" },
        { mn: "Оддын дор задгай karaoke", ko: "별 아래 야외 노래방", en: "Open-air karaoke under the stars" },
        { mn: "Зайсан толгойноос УБ-ын шөнийн харагдац", ko: "자이산 언덕에서 울란바토르 야경", en: "Ulaanbaatar night views from Zaisan Hill" },
        { mn: "Их Дэлгүүр ба Нарантуул захын худалдан авалт", ko: "국영 백화점 및 나란뚤 시장 쇼핑", en: "Shopping at the State Department Store and Narantuul Market" },
      ],
    },
    logistics: [
      {
        mn: "4WD бартаат замын автомашинаар аялна.",
        ko: "4WD 오프로드 차량으로 이동.",
        en: "Travel by 4WD off-road vehicle.",
      },
      { mn: "Солонгос хэлтэй хөтөч хамт явна.", ko: "한국어 가이드 동행.", en: "Korean-speaking guide accompanies the group." },
      {
        mn: "Загасчны отог.",
        ko: "어부 오톡.",
        en: "Fisherman's otog.",
      },
      {
        mn: "Загасчны хэрэгсэл бэлэн (хувийн тоног хэрэгслээ авч ирж болно).",
        ko: "낚시 장비 준비 완료 (개인 장비 지참 가능).",
      },
    ],
    pricing: {
      note: {
        mn: "Аяллын идэвхтэй улирал: 2026 оны 5 сарын 20 — 9 сарын 30. Хүний тоогоор үнэ өөрчлөгдөнө.",
        ko: "운영 기간: 2026년 5월 20일 ~ 9월 30일. 인원 수에 따라 요금이 달라집니다.",
        en: "Operating season: May 20 – Sep 30, 2026. Price varies by group size.",
      },
      tiers: [
        {
          groupSize: { mn: "5 хүн", ko: "5명", en: "5 People" },
          pricePerPerson: { mn: "₩890,000 / 1 хүн", ko: "1인 ₩890,000", en: "₩890,000 per person" },
        },
        {
          groupSize: { mn: "4 хүн", ko: "4명", en: "4 People" },
          pricePerPerson: { mn: "₩990,000 / 1 хүн", ko: "1인 ₩990,000", en: "₩990,000 per person" },
        },
        {
          groupSize: { mn: "3 хүн", ko: "3명", en: "3 People" },
          pricePerPerson: { mn: "₩1,190,000 / 1 хүн", ko: "1인 ₩1,190,000", en: "₩1,190,000 per person" },
        },
        {
          groupSize: { mn: "2 хүн", ko: "2명", en: "2 People" },
          pricePerPerson: { mn: "₩1,390,000 / 1 хүн", ko: "1인 ₩1,390,000", en: "₩1,390,000 per person" },
        },
        {
          groupSize: { mn: "1 хүн", ko: "1명", en: "1 Person" },
          pricePerPerson: { mn: "₩1,490,000 / 1 хүн", ko: "1인 ₩1,490,000", en: "₩1,490,000 per person" },
        },
      ],
      included: [
        {
          mn: "4WD бартаат замын автомашинаар аялна.",
          ko: "4WD 오프로드 차량으로 이동.",
          en: "Travel by 4WD off-road vehicle.",
        },
        { mn: "Солонгос хэлтэй хөтөч.", ko: "한국어 가이드.", en: "Korean-speaking guide." },
        { mn: "Бүх хоол.", ko: "모든 식사.", en: "All meals." },
        { mn: "Зочид буудал ба загасчны отог.", ko: "호텔 및 어부 오톡.", en: "Hotel and fisherman's otog." },
      ],
      excluded: [
        {
          mn: "Хувийн ундаа (ус, согтууруулах ундаа гэх мэт) ба нэмэлт зууш.",
          ko: "개인 음료(물, 주류 등) 및 간식.",
        },
        {
          mn: "Зочид буудал, кампын өглөө ба оройн хоолыг 2 хоногийн өмнө захиалж, 1 хоногийн өмнө дахин баталгаажуулна.",
          ko: "조식과 석식은 캠프 숙박 이틀 전에 미리 예약하고, 하루 전에 다시 확정해야 합니다.",
        },
      ],
    },
  },
  // ─────────────────────────────────────────────────────────────────────
  // АЯЛАЛ #3 — Арбүрд элс ба говийн адал явдал
  // ─────────────────────────────────────────────────────────────────────
  {
    slug: "arburd-gobi",
    status: "available",
    hero: {
      title: {
        mn: "Нүүдэлчдийн соёлын аялал",
        ko: "아르부르드 고비 3박4일 투어",
        en: "Arburd Gobi · 3 Nights 4 Days",
      },
      subtitle: {
        mn: "Чингис хаан нисэх буудал → Арбүрд → Баян Өнжүүл → Чингис хааны хөшөө → УБ · 3 шөнө 4 өдөр",
        ko: "칭기스칸공항 → 아르부르드 → 바양 은줄 → 칭기즈 칸 기마 동상 → 울란바토르 · 3박 4일",
        en: "Chinggis Khaan Airport → Arburd → Bayan Onjuul → Chinggis Khaan Statue → UB · 3 Nights 4 Days",
      },
      image: nomadicCultureHero,
      imageHd: nomadicCultureHeroHd,
      imageWebp: nomadicCultureHeroWebp,
    },
    overview: {
      duration: { mn: "4 өдөр / 3 шөнө", ko: "3박 4일", en: "4 Days / 3 Nights" },
      target: {
        mn: "Гэр бүл, найз нөхөд",
        ko: "가족, 친구",
        en: "Families & Friends",
      },
      crew: { mn: "Солонгос хэлтэй хөтөч + жолооч", ko: "한국어 가이드 + 운전기사", en: "Korean-speaking Guide + Driver" },
      route: {
        mn: "Чингис хаан нисэх буудал → Арбүрд (~150 км) → Баян Өнжүүл (~30 км) → Чингис хааны хөшөө (~160 км) → УБ (~50 км)",
        ko: "칭기스칸공항 → 아르부르드 (약 150km) → 바양 은줄 (약 30km) → 칭기즈 칸 기마 동상 (약 160km) → 울란바토르 (약 50km)",
        en: "Chinggis Khaan Airport → Arburd (~150 km) → Bayan Onjuul (~30 km) → Chinggis Khaan Statue (~160 km) → UB (~50 km)",
      },
    },
    description: {
      mn: "Чингис хаан олон улсын нисэх буудал дээр угтан авч, Арбүрдын жуулчны баазад байрлан одтой тэнгэрийн дор дуу хуурын үдэшлэгт оролцоно. Маргааш нь тэмээ унах, элсэн чаргаар гулгах, морин аялал хийх, уламжлалт хорхог амтлах зэрэг үйл ажиллагаагаар дамжуулан нүүдэлчин ахуй, соёлтой танилцана. Аяллын төгсгөлд Чингис хааны морьт хөшөөг үзэж, Улаанбаатар хотын түүх, соёлын онцлох газруудаар аялна.",
      ko: "칭기스칸 국제공항에서 픽업한 뒤 아르부르드 관광기지에서 묵으며 별이 빛나는 밤하늘 아래 마두금 연주의 저녁 행사에 참여합니다. 다음 날 낙타 체험, 모래 썰매, 승마, 전통 허르헉 시식 등을 통해 유목민의 생활과 문화를 만납니다. 여행의 마무리는 칭기즈 칸 기마 동상 관람과 울란바토르의 역사·문화 명소 투어입니다.",
      en: "Greeted at Chinggis Khaan International Airport, you stay at the Arburd tourist base and join an evening morin khuur performance under the starry sky. The next day, camel riding, sand sledding, horseback riding, and traditional khorhog introduce nomadic life and culture. The journey concludes with the Chinggis Khaan equestrian statue and a tour of Ulaanbaatar's historic and cultural highlights.",
    },
    days: [
      {
        day: 1,
        title: {
          mn: "Чингис хаан нисэх буудал → Арбүрд",
          ko: "칭기스칸공항 → 아르부르드",
          en: "Chinggis Khaan Airport → Arburd",
        },
        subtitle: {
          mn: "~150 км",
          ko: "약 150km",
          en: "~150 km",
        },
        schedule: [
          {
            time: "Өглөө",
            text: {
              mn: "Чингис хаан Олон Улсын Нисэх Буудал дээр хүлээн авч, хөтөчтэй танилцана. Арбүрд руу хөдөлж, том худалдааны төвөөс шаардлагатай зүйлс худалдан авна.",
              ko: "공항 도착 후 가이드 미팅. 아르부르드로 이동. 대형 마트에서 필요한 물품 구매.",
              en: "Airport pickup and guide meeting. Drive to Arburd and shop for supplies at a large supermarket.",
            },
          },
          {
            time: "Үд",
            text: {
              mn: "Замд явахдаа орон нутгийн хоол.",
              ko: "이동 중 현지식 점심.",
              en: "Local lunch en route.",
            },
          },
          {
            time: "Орой",
            text: {
              mn: "Жуулчны баазад ирж байрлаад, хоолонд орно.",
              ko: "관광기지 도착 후 숙박하고 식사합니다.",
              en: "Arrive at the tourist base, settle in, and have dinner.",
            },
          },
          {
            time: "Шөнө",
            text: {
              mn: "Моддын дэргэд, оддын дор найз нөхдийн хамт дуу дуулна.",
              ko: "나무 옆, 별 아래에서 친구들과 함께 노래를 부릅니다.",
              en: "By the trees, under the stars, sing together with friends.",
            },
          },
        ],
        overnight: {
          mn: "Жуулчны баазад (3-4 хүн нэг өрөөнд, нийтийн ариун цэвэр ба усанд орох газартай)",
          ko: "관광기지 (3-4인 1실, 공용 화장실 및 샤워실)",
          en: "Tourist base (3-4 guests per room, shared bathroom and shower)",
        },
      },
      {
        day: 2,
        title: {
          mn: "Арбүрд → Баян Өнжүүл",
          ko: "아르부르드 → 바양 은줄",
          en: "Arburd → Bayan Onjuul",
        },
        subtitle: {
          mn: "~30 км · Тэмээ, морь, малчин амьдрал",
          ko: "약 30km · 낙타, 승마, 유목 체험",
          en: "~30 km · Camels, Horses & Nomadic Life",
        },
        schedule: [
          {
            time: "Өглөө",
            text: {
              mn: "Хоолны дараа элсэн дээр аялаж, хөгжилтэй үеээ гэрэл зурагт буулгана.",
              ko: "식사 후 모래언덕에서 산책하며 즐거운 순간을 사진에 담습니다.",
              en: "After a meal, stroll on the sand dunes and capture fun moments in photos.",
            },
          },
          {
            time: "Үд",
            text: {
              mn: "Өдрийн хоолны дараа Баян Өнжүүл рүү хөдөлнө.",
              ko: "중식 후 바양 은줄 이동.",
              en: "Transfer to Bayan Onjuul after lunch.",
            },
          },
          {
            time: "Үдээс хойш",
            text: {
              mn: "Малчин айлын дэргэд гэр барин хоноглоно.",
              ko: "유목민 가정 옆에서 게르를 짓고 숙박합니다.",
              en: "Set up a ger beside a herder family and stay overnight.",
            },
          },
          {
            time: "Орой",
            text: {
              mn: "Уламжлалт Монгол хоол болох хорхог зооглож, мал адгуулж, нүүдэлчин соёлыг мэдэрнэ.",
              ko: "전통 몽골 음식인 허르헉(호르호그)을 맛보고, 가축을 돌보며 유목민 문화를 체험합니다.",
              en: "Enjoy traditional Mongolian khorhog, tend livestock, and experience nomadic culture.",
            },
          },
        ],
        overnight: {
          mn: "Жуулчны баазад (3, 4, 6 хүн нэг өрөөнд, нийтийн ариун цэврийн өрөөтэй)",
          ko: "관광기지 (3인, 4인, 6인 1실, 공용 화장실)",
          en: "Tourist base (3, 4, 6 guests per room, with shared restroom facilities)",
        },
      },
      {
        day: 3,
        title: {
          mn: "Баян Өнжүүл → Чингис хааны хөшөө → Улаанбаатар",
          ko: "바양 은줄 → 칭기즈 칸 기마 동상 → 울란바토르",
          en: "Bayan Onjuul → Chinggis Khaan Statue → Ulaanbaatar",
        },
        subtitle: {
          mn: "~160 км + ~50 км",
          ko: "약 160km + 약 50km",
          en: "~160 km + ~50 km",
        },
        schedule: [
          {
            time: "Өглөө",
            text: {
              mn: "Хоолны дараа хөдөлнө. Явах замдаа Баян Өнжүүл Хайрханд савлуурт зугаацаж чилээгээ гаргана.",
              ko: "식사 후 이동. 이동하는 길 바양 은줄 헤이르한에서 그네를 타며 즐깁니다.",
              en: "Depart after breakfast. En route, enjoy the swing at Bayan Onjuul Khairkhan and have fun.",
            },
          },
          {
            time: "Үд",
            text: {
              mn: "Чингис хааны морьт хөшөөгөөр зочлон, дотор үзэж, тэнгэрийн харааны тавцангаас дурсгалын зураг авч, бяцхан музей үзнэ.",
              ko: "칭기즈 칸 기마 동상 방문, 내부 관람 후 전망대에서 기념 촬영 및 소규모 박물관 관람.",
              en: "Visit the Chinggis Khaan equestrian statue, interior tour, viewpoint photos, and small museum.",
            },
          },
          {
            time: "Орой",
            text: {
              mn: "Улаанбаатар руу хөдөлж, шөнийн хотыг сонирхон, зочид буудалд хоноглоно.",
              ko: "울란바토르로 이동해 야경을 감상하고 호텔에서 숙박합니다.",
              en: "Travel to Ulaanbaatar, explore the city at night, and stay at a hotel.",
            },
          },
        ],
        overnight: {
          mn: "Улаанбаатар хотын зочид буудал",
          ko: "울란바토르 시내 호텔",
          en: "Ulaanbaatar City Hotel",
        },
      },
      {
        day: 4,
        title: {
          mn: "Улаанбаатар хотын аялал",
          ko: "울란바토르 시내 투어",
          en: "Ulaanbaatar City Tour",
        },
        subtitle: {
          mn: "Соёл, түүх, худалдан авалт",
          ko: "문화·역사·쇼핑",
          en: "Culture, History & Shopping",
        },
        schedule: [
          {
            time: "Өглөө",
            text: {
              mn: "Хоолны дараа хөдөлнө. Сүхбаатарын талбайгаар зочилно.",
              ko: "조식 후 이동. 수흐바타르 광장 관람.",
              en: "After breakfast, visit Sukhbaatar Square.",
            },
          },
          {
            time: "Үдээс хойш",
            text: {
              mn: "Гандан хийдэд зочлон, Буддын соёлтой танилцана.",
              ko: "간단 사원 방문 및 불교 문화 체험.",
              en: "Visit Gandantegchinlen Monastery and learn about Buddhist culture.",
            },
          },
          {
            time: "Үдээс хойш",
            text: {
              mn: "Музей эсвэл ардын урлагийн тоглолт (сонголтоор).",
              ko: "박물관 또는 민속공연 관람 (선택).",
              en: "Museum or folk performance (optional).",
            },
          },
          {
            time: "Орой",
            text: {
              mn: "Их Дэлгүүрт зочлон, бэлэг дурсгалын худалдан авалт хийнэ. Оройн хоол: Халуун тогоо.",
              ko: "국영 백화점 방문 및 쇼핑. 석식: 핫팟.",
              en: "State Department Store shopping. Dinner: hot pot.",
            },
          },
        ],
      },
    ],
    meals: {
      breakfast: {
        mn: "1-р өдөр: дэлгүүрийн зууш · 2-р өдөр: баазын хоол · 3-р өдөр: баазын хоол · 4-р өдөр: зочид буудлын хоол",
        ko: "1일: 편의점식 · 2일: 기지식 · 3일: 기지식 · 4일: 호텔식",
        en: "Day 1: convenience-store snacks · Day 2: base · Day 3: base · Day 4: hotel",
      },
      lunch: {
        mn: "1-р өдөр: орон нутгийн хоол · 2-р өдөр: баазын хоол · 3-р өдөр: орон нутгийн хоол · 4-р өдөр: орон нутгийн хоол",
        ko: "1일: 현지식 · 2일: 기지식 · 3일: 현지식 · 4일: 현지식",
        en: "Day 1: local · Day 2: base · Day 3: local · Day 4: local",
      },
      dinner: {
        mn: "1-р өдөр: баазын хоол · 2-р өдөр: хорхог (баазын хоол) · 3-р өдөр: баазын хоол · 4-р өдөр: Халуун тогоо",
        ko: "1일: 기지식 · 2일: 허르헉(기지식) · 3일: 기지식 · 4일: 핫팟",
        en: "Day 1: base · Day 2: khorhog (base) · Day 3: base · Day 4: hot pot",
      },
      special: {
        mn: "2 дахь өдөр уламжлалт хорхог",
        ko: "2일째 전통 허르헉",
        en: "Traditional khorhog on Day 2",
      },
    },
    highlights: {
      title: { mn: "Аяллын онцлох мөчүүд", ko: "투어 하이라이트", en: "Tour Highlights" },
      items: [
        { mn: "Арбүрд элсэн дунд тэмээгээр аялах", ko: "아르부르드 모래언덕에서 낙타 체험", en: "Camel trek through the Arburd dunes" },
        { mn: "Элсэн чаргаар гулгах ба говийн одтой шөнө", ko: "모래 썰매 타기와 고비의 별이 빛나는 밤", en: "Gliding on sand sleds and a starry Gobi night" },
        { mn: "Баян Өнжүүлд морь унаж нүүдэлчин соёлыг мэдрэх", ko: "바양 은줄에서 승마와 유목민 문화 체험", en: "Horseback riding and nomadic culture in Bayan Onjuul" },
        { mn: "Уламжлалт хорхог зооглох", ko: "전통 음식 허르헉 시식", en: "Traditional khorhog dining experience" },
        { mn: "Чингис хааны морьт хөшөөгөөр зочлох", ko: "칭기즈 칸 기마 동상 방문", en: "Visit the Chinggis Khaan equestrian statue" },
        { mn: "Сүхбаатарын талбай ба Гандан хийдийн соёлоор танилцах", ko: "수흐바타르 광장 및 간단 사원 문화 체험", en: "Sukhbaatar Square and Gandantegchinlen Monastery cultural tour" },
        { mn: "Их Дэлгүүрт худалдан авалт", ko: "국영 백화점 쇼핑", en: "Shopping at the State Department Store" },
      ],
    },
    logistics: [
      {
        mn: "4WD бартаат замын автомашинаар аялна.",
        ko: "4WD 오프로드 차량으로 이동합니다.",
        en: "Travel by 4WD off-road vehicle.",
      },
      { mn: "Солонгос хэлтэй хөтөч хамт явна.", ko: "한국어 가이드 동행.", en: "Korean-speaking guide accompanies the group." },
      {
        mn: "Жуулчны баазын гэр байр (нийтийн ариун цэвэр ба усанд орох газартай).",
        ko: "관광기지 게르 숙박 (공용 화장실 및 샤워실).",
        en: "Tourist base ger accommodation (shared bathroom and shower).",
      },
      { mn: "Эцсийн шөнө Улаанбаатар хотын зочид буудалд хононо.", ko: "마지막 밤은 울란바토르 시내 호텔에서 숙박.", en: "Final night at a Ulaanbaatar city hotel." },
    ],
    pricing: {
      note: {
        mn: "Аяллын идэвхтэй улирал: 2026 оны 5 сарын 20 — 9 сарын 30. Хүний тоогоор үнэ өөрчлөгдөнө.",
        ko: "운영 기간: 2026년 5월 20일 ~ 9월 30일. 인원 수에 따라 요금이 달라집니다.",
        en: "Operating season: May 20 – Sep 30, 2026. Price varies by group size.",
      },
      tiers: [
        {
          groupSize: { mn: "5 хүн", ko: "5명", en: "5 People" },
          pricePerPerson: { mn: "₩890,000 / 1 хүн", ko: "1인 ₩890,000", en: "₩890,000 per person" },
        },
        {
          groupSize: { mn: "4 хүн", ko: "4명", en: "4 People" },
          pricePerPerson: { mn: "₩990,000 / 1 хүн", ko: "1인 ₩990,000", en: "₩990,000 per person" },
        },
        {
          groupSize: { mn: "3 хүн", ko: "3명", en: "3 People" },
          pricePerPerson: { mn: "₩1,090,000 / 1 хүн", ko: "1인 ₩1,090,000", en: "₩1,090,000 per person" },
        },
        {
          groupSize: { mn: "2 хүн", ko: "2명", en: "2 People" },
          pricePerPerson: { mn: "₩1,300,000 / 1 хүн", ko: "1인 ₩1,300,000", en: "₩1,300,000 per person" },
        },
        {
          groupSize: { mn: "1 хүн", ko: "1명", en: "1 Person" },
          pricePerPerson: { mn: "₩1,500,000 / 1 хүн", ko: "1인 ₩1,500,000", en: "₩1,500,000 per person" },
        },
      ],
      included: [
        {
          mn: "4WD бартаат замын автомашин (шатахуун, замын төлбөр).",
          ko: "4WD 오프로드 차량 (유류대, 도로비).",
          en: "4WD off-road vehicle (fuel and road tolls included).",
        },
        { mn: "Солонгос хэлтэй хөтөч.", ko: "한국어 가이드.", en: "Korean-speaking guide." },
        { mn: "Бүх хоол.", ko: "모든 식사.", en: "All meals." },
        { mn: "Жуулчны бааз ба зочид буудал.", ko: "관광기지 및 호텔 숙박.", en: "Tourist base and hotel accommodation." },
      ],
      excluded: [
        {
          mn: "Хувийн ундаа (ус, согтууруулах ундаа гэх мэт) ба нэмэлт зууш.",
          ko: "개인 음료(물, 주류 등) 및 간식.",
        },
        {
          mn: "Жуулчны бааз өглөө ба оройн хоолыг 2 хоногийн өмнө захиалж, 1 хоногийн өмнө дахин баталгаажуулна.",
          ko: "조식과 석식은 관광기지 숙박 이틀 전에 미리 예약하고, 하루 전에 다시 확정해야 합니다.",
          en: "Tourist base breakfast and dinner must be booked 2 days in advance and reconfirmed 1 day prior.",
        },
      ],
    },
  },
  {
    slug: "winter-hunting",
    status: "coming_soon",
    hero: {
      title: {
        mn: "Өвлийн тусгай аялал тун удахгүй",
        ko: "특별 원정 여행",
        en: "Special Winter Expedition",
      },
      subtitle: {
        mn: "Тун удахгүй",
        ko: "곧 공개됩니다",
        en: "Coming Soon",
      },
      image: winterHuntingHero,
    },
    overview: {
      duration: { mn: "Удахгүй", ko: "준비 중", en: "Coming Soon" },
      target: {
        mn: "Тусгай зориулалтын аялагчид",
        ko: "프라이빗 원정 여행자",
        en: "Selected private travelers",
      },
      crew: {
        mn: "Мэргэжлийн хөтөч + бүрэн ложистик",
        ko: "전문 가이드 + 전체 로지스틱",
        en: "Expert guide + full logistics",
      },
      route: {
        mn: "Монголын өвлийн цэнгэг газар нутаг",
        ko: "몽골 겨울 설원 지역",
        en: "Mongolia's winter wilderness",
      },
    },
    description: {
      mn: "Монголын зэрлэг онгон байгаль, алслагдсан уулс, нам гүм тал нутагт хүргэх онцгой экспедицийн аялал.",
      ko: "몽골의 광활한 대자연과 고요한 야생 속으로 떠나는 특별한 프라이빗 익스페디션.",
      en: "A rare wilderness journey for selected travelers seeking a deeper, more exclusive side of Mongolia.",
    },
    comingSoon: {
      eyebrow: {
        mn: "Тусгай аялал",
        ko: "특별 원정 여행",
        en: "Special Expedition",
      },
      headline: {
        mn: "Тун удахгүй",
        ko: "곧 공개됩니다",
        en: "Coming Soon",
      },
      paragraphs: [
        {
          mn: "Монголын зэрлэг онгон байгаль, алслагдсан уулс, нам гүм тал нутагт хүргэх онцгой экспедицийн аялал.",
          ko: "몽골의 광활한 대자연과 고요한 야생 속으로 떠나는 특별한 프라이빗 익스페디션.",
          en: "A rare wilderness journey designed for selected travelers seeking a deeper and more exclusive side of Mongolia.",
        },
        {
          mn: "Энгийн аяллаас илүү бодит, илүү тусгай аяллыг эрэлхийлэгч цөөн аялагчдад зориулсан энэхүү аялал удахгүй нээлттэй болно.",
          ko: "일반 관광이 아닌, 더 깊고 진정한 경험을 원하는 소수의 여행자를 위해 준비된 특별한 여정입니다.",
          en: "Remote landscapes, silent mountains, authentic field experience, and carefully planned private expeditions beyond ordinary tourism.",
        },
        {
          mn: "Зөвхөн хязгаарлагдмал хүсэлтээр зохион байгуулагдана.",
          ko: "광활한 자연, 외딴 풍경, 그리고 몽골의 진짜 모습을 담은 익스클루시브 원정 여행이 곧 공개됩니다. 본 프로그램은 제한된 문의를 통해서만 운영될 예정입니다.",
          en: "This special journey will be available through limited private inquiry only.",
        },
      ],
      brandLine: {
        mn: "Хүн бүрийн Хүрч чадахгүй, Монгол.",
        ko: "",
        en: "",
      },
      tagline: {
        mn: "Rare Mongolia. Real Experience.",
        ko: "Rare Mongolia. Real Experience.",
        en: "Rare Mongolia. Real Experience.",
      },
    },
    days: [],
    meals: {
      breakfast: { mn: "—", ko: "—", en: "—" },
      lunch: { mn: "—", ko: "—", en: "—" },
      dinner: { mn: "—", ko: "—", en: "—" },
    },
    highlights: {
      title: { mn: "Онцлог", ko: "특징", en: "Features" },
      items: [],
    },
    logistics: [],
    pricing: {
      note: { mn: "Удахгүй нээгдэнэ.", ko: "곧 오픈 예정입니다.", en: "Opening soon." },
      tiers: [],
      included: [],
      excluded: [],
    },
  },
];

export function getTourBySlug(slug: string): Tour | undefined {
  return tours.find((tour) => tour.slug === slug);
}
