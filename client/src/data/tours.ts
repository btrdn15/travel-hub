// Аяллын хөтөлбөрийн өгөгдлийн төв сан.
// Шинэ аялал нэмэхдээ доорх Tour интерфейст тохирсон объект үүсгэж
// `tours` массивт нэмэх юм.

export type LocalizedString = {
  mn: string;
  ko: string;
  en?: string;
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
    },
    overview: {
      duration: { mn: "5 өдөр / 4 шөнө", ko: "5일 / 4박", en: "5 Days / 4 Nights" },
      target: {
        mn: "Солонгосын шувууны гэрэл зурагчид",
        ko: "한국 조류 사진가",
      },
      crew: {
        mn: "Мэргэжлийн шувуу судлаач хөтөч + Жолооч + Тогооч",
        ko: "전문 조류학자 가이드 + 운전기사 + 요리사",
      },
      route: {
        mn: "Улаанбаатар → Хөх бүрд → Эрдэнэсант → Жаргалант → Баян нуур → Улаанбаатар",
        ko: "울란바토르 → 훕스굴(Khokh Burd) → 에르덴산트 → 자르갈란트 → 바얀 누르 → 울란바토르",
      },
    },
    description: {
      mn: "Говийн хээр, намгархаг нуур, ойт уулс зэрэг Монголын шувуудын олон төрөл зүйл нутагладаг бүс нутгуудаар 5 өдрийн аялал хийнэ. Мэргэжлийн шувуу судлаач хөтөчийн хамт нар мандах, жаргах үеийн хамгийн таатай гэрэлд ховор болон онцгой шувуудыг ажиглаж, гэрэл зурагт мөнхлөх боломжтой.",
      ko: "고비 초원에서 습지대, 침엽수림에 이르기까지 몽골 조류의 다양한 서식지를 5일에 걸쳐 안내합니다. 전문 가이드가 동행하여 일출과 일몰의 최적의 촬영 순간을 찾아드립니다.",
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
          { time: "06:30", text: { mn: "Улаанбаатараас хөдөлнө.", ko: "울란바토르에서 출발.", en: "Depart from Ulaanbaatar." } },
          {
            time: "11:30–12:00",
            text: {
              mn: "\"Хөх бүрд\" жуулчны баазад ирнэ.",
              ko: "\"숨 훕 부르드\" 캠프 도착.",
              en: "Arrive at the \"Khokh Burd\" tourist camp.",
            },
          },
          { time: "12:00–13:00", text: { mn: "Өдрийн хоол (Баазад).", ko: "점심 식사 (캠프).", en: "Lunch (at camp)." } },
          { time: "14:00–16:00", text: { mn: "Амралт, бэлтгэл.", ko: "휴식 및 장비 준비.", en: "Rest and equipment preparation." } },
          { time: "16:00–20:00", text: { mn: "Говь хээрийн болон цөөрмийн шувуудын зураг авах.", ko: "초원 및 습지 조류 촬영.", en: "Photograph steppe and wetland birds." } },
          { time: "20:00", text: { mn: "Оройн хоол (Баазад).", ko: "저녁 식사 (캠프).", en: "Dinner (at camp)." } },
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
          { time: "05:30–07:00", text: { mn: "Үүр цайх үеийн зураглал, говь хээрийн шувууд.", ko: "새벽 촬영, 초원 조류.", en: "Dawn photography and Gobi steppe birds." } },
          { time: "07:00", text: { mn: "Өглөөний цай.", ko: "아침 식사.", en: "Breakfast." } },
          { time: "08:00", text: { mn: "Төв аймаг, Бүрэн сум руу хөдөлнө (120 км). Замдаа шувуу харах 1–2 зогсолттой.", ko: "투브 아이막 부렌 솜으로 이동 (120km). 도중 1–2회 조류 관찰.", en: "Drive to Tuv Province, Buren Soum (120 km) with 1–2 birdwatching stops en route." } },
          { time: "12:00–13:00", text: { mn: "Бүрэн сумын орчим хээрийн өдрийн хоол.", ko: "부렌 솜 근처 들판 점심.", en: "Picnic lunch near Buren Soum." } },
          { time: "15:30–16:00", text: { mn: "Эрдэнэсант суманд ирж малчин айлд буудаллан, хөнгөн цайлна.", ko: "에르덴산트 도착, 유목민 가정 도착 후 차 한잔.", en: "Arrive in Erdene Santi Soum; visit a nomadic family and enjoy tea." } },
          { time: "16:30–19:30", text: { mn: "Малчны хот, ахуй амьдралын зураг авах. Ойр орчимд шувуу ажиглах.", ko: "유목민 일상 촬영 및 주변 조류 관찰.", en: "Photograph nomadic daily life and observe nearby birds." } },
          { time: "19:30", text: { mn: "Оройн хоол (Малчин айлын уламжлалт монгол хоол).", ko: "저녁 식사 (전통 몽골 가정식).", en: "Dinner (traditional Mongolian meal at a nomadic home)." } },
        ],
        overnight: { mn: "Малчин айлд (Nomadic Homestay)", ko: "유목민 가정 홈스테이", en: "Nomadic Homestay" },
      },
      {
        day: 3,
        title: {
          mn: "Эрдэнэсант → Жаргалант",
          ko: "에르덴산트 → 자르갈란트",
        },
        subtitle: { mn: "Баян-Уул уулын бүс", ko: "바얀-올 산악 지대", en: "Bayan-Uul Mountain Region" },
        schedule: [
          { time: "05:30–08:30", text: { mn: "Өндөр хад асгаар нутаглах махчин шувууд (Тас, Ёл г.м) зураг авах.", ko: "절벽 맹금류 (Cinereous Vulture, Lammergeier) 촬영.", en: "Photograph cliff-dwelling raptors (Cinereous Vulture, Lammergeier, etc.)." } },
          { time: "08:30–09:30", text: { mn: "Өглөөний цай (Айлдаа).", ko: "아침 식사 (가정에서).", en: "Breakfast (at the family home)." } },
          { time: "10:00", text: { mn: "Цэцэрлэг хот руу хөдөлнө.", ko: "체체를렉 시로 이동.", en: "Drive to Tsetserleg city." } },
          { time: "13:30–14:30", text: { mn: "Өдрийн хоол (Цэцэрлэг хотод).", ko: "점심 식사 (체체를렉).", en: "Lunch (in Tsetserleg)." } },
          { time: "17:00", text: { mn: "Жаргалант суманд ирж, баазад буудаллана.", ko: "자르갈란트 도착, 캠프 체크인.", en: "Arrive in Jargalant Soum and check in at camp." } },
          { time: "17:30–20:30", text: { mn: "Ойн шувуудын зураг авах.", ko: "산림 조류 촬영.", en: "Photograph forest birds." } },
          { time: "20:30", text: { mn: "Оройн хоол (Баазад халуун хоол).", ko: "저녁 식사 (캠프 따뜻한 식사).", en: "Dinner (hot meal at camp)." } },
          { time: "Шөнө", text: { mn: "Гэрэл зургийн талаар ярилцлага, дүгнэлт.", ko: "사진 리뷰 및 피드백 세션.", en: "Photo review and feedback session." } },
        ],
        overnight: { mn: "Жуулчны баазад", ko: "관광 캠프 숙박", en: "Tourist Camp Accommodation" },
      },
      {
        day: 4,
        title: {
          mn: "Жаргалант → Баян нуур",
          ko: "자르갈란트 → 바얀 누르",
        },
        subtitle: { mn: "Нуур, шилжилтийн бүс", ko: "호수와 이주 조류 지대", en: "Lake & Migration Zone" },
        schedule: [
          { time: "05:00–07:00", text: { mn: "Үүр цайх үеийн ойн зураг авалт.", ko: "새벽 산림 촬영.", en: "Dawn forest photography." } },
          { time: "07:00", text: { mn: "Өглөөний цай.", ko: "아침 식사.", en: "Breakfast." } },
          { time: "08:00", text: { mn: "Баян нуур руу хөдөлнө.", ko: "바얀 누르로 이동.", en: "Drive to Bayan Nuur." } },
          { time: "12:00–13:30", text: { mn: "Баян нуурт ирж, хээрийн өдрийн хоол идэх.", ko: "바얀 누르 도착, 야외 점심.", en: "Arrive at Bayan Nuur and enjoy an outdoor lunch." } },
          { time: "13:30–17:30", text: { mn: "Намгархаг газар болон хээрийн шувуудын зураг авах.", ko: "습지 및 초원 조류 촬영.", en: "Photograph wetland and steppe birds." } },
          { time: "17:30–19:00", text: { mn: "Нар жаргах үеийн шувууны зураг авалт.", ko: "황혼녘 조류 촬영.", en: "Sunset bird photography." } },
          { time: "19:00", text: { mn: "Оройн хоол (Хээрийн).", ko: "저녁 식사 (야외).", en: "Dinner (outdoors)." } },
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
          { time: "05:30–07:00", text: { mn: "Нар мандах үеийн сүүлчийн зураг авалт.", ko: "일출 마지막 촬영.", en: "Final sunrise photography session." } },
          { time: "07:30", text: { mn: "Өглөөний цай (Хээрийн).", ko: "아침 식사 (야외).", en: "Breakfast (outdoors)." } },
          { time: "08:00", text: { mn: "Улаанбаатар руу хөдөлнө.", ko: "울란바토르로 출발.", en: "Drive to Ulaanbaatar." } },
          { time: "Өдөр", text: { mn: "Лүн суманд өдрийн хоол.", ko: "런 솜에서 점심.", en: "Lunch in Lun Soum." } },
          { time: "13:00–15:00", text: { mn: "Улаанбаатарт ирж аялал өндөрлөнө. Шууд нисэх хүмүүсийг нисэх буудалд хүргэнэ.", ko: "울란바토르 도착, 투어 종료. 직항 이용 손님은 공항까지 모셔다 드립니다.", en: "Arrive in Ulaanbaatar and conclude the tour. Direct-flight guests are transferred to the airport." } },
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
      { mn: "Мэргэжлийн шувуу судлаач хөтөч болон хээрийн тогооч ажиллана.", ko: "전문 조류학자 가이드와 야외 요리사 동행.", en: "Professional ornithologist guide and field chef included." },
    ],
    pricing: {
      note: {
        mn: "Хүний тоогоор үнэ өөрчлөгдөнө.",
        ko: "인원 수에 따라 요금이 달라집니다.",
        en: "Price varies by group size.",
      },
      tiers: [
        {
          groupSize: { mn: "3 хүн", ko: "3명", en: "3 People" },
          pricePerPerson: { mn: "₩2,000,000 / хүн", ko: "1인 ₩2,000,000", en: "₩2,000,000 per person" },
        },
        {
          groupSize: { mn: "2 хүн", ko: "2명", en: "2 People" },
          pricePerPerson: { mn: "₩2,200,000 / хүн", ko: "1인 ₩2,200,000", en: "₩2,200,000 per person" },
        },
        {
          groupSize: { mn: "1 хүн", ko: "1명", en: "1 Person" },
          pricePerPerson: { mn: "₩2,600,000 / хүн", ko: "1인 ₩2,600,000", en: "₩2,600,000 per person" },
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
              mn: "Том маркет дээр зогсоод кампэд хэрэгтэй зүйлсээ худалдан авна.",
              ko: "대형 마트에서 캠프에 필요한 물품 구매.",
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
              mn: "Мөнгөн морт суманд ирж, загасчны кампын модон байшинд check-in.",
              ko: "뭉궁 모르트 작은 마을 도착 후 어부 캠프 통나무집 체크인.",
            },
          },
          {
            time: "Орой",
            text: {
              mn: "Хэрлэн голд анхны загасчлал, оройн хоолны хамт нэг шил архи зооглон, шөнийн оддыг сонирхоно.",
              ko: "헤를렌강에서 첫 낚시, 저녁 식사와 함께 술 한잔을 즐기며 밤하늘의 별을 감상.",
            },
          },
        ],
        overnight: {
          mn: "Загасчны кампын модон байшин (4/3 хүн нэг өрөө, нийтийн ариун цэвэр ба усанд орох газартай)",
          ko: "어부 캠프 통나무집 (4인/3인 1실, 공용 화장실 및 샤워실)",
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
              mn: "Уламжлалт хорхог зооглож, найзуудтайгаа сонгины архи дагалдуулсан оройн хоол.",
              ko: "전통 음식 허르헉을 맛보고, 친구들과 함께 소주를 곁들인 저녁 식사.",
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
        overnight: { mn: "Загасчны кампын модон байшин", ko: "어부 캠프 통나무집", en: "Fisherman's Camp Log Cabin" },
      },
      {
        day: 3,
        title: {
          mn: "Мөнгөн морт → Улаанбаатар",
          ko: "뭉궁 모르트 → 울란바토르",
        },
        subtitle: {
          mn: "~180 км · хотын аялал ба шөнийн харагдац",
          ko: "~180km · 시내 투어 및 야경",
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
      breakfast: { mn: "Дэлгүүрийн зууш / кампын хоол", ko: "편의점식 / 캠프식", en: "Convenience-store snacks / camp meals" },
      lunch: { mn: "Орон нутгийн хоол / кампын хоол", ko: "현지식 / 캠프식", en: "Local cuisine / camp meals" },
      dinner: { mn: "Кампын хоол · сүүлийн өдөр шарсан мах", ko: "캠프식 · 마지막 날 샤브샤브", en: "Camp meals · hot pot on the final day" },
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
        { mn: "Оддын дор задгай karaoke ба сонгины архи", ko: "별 아래 야외 노래방과 소주 한잔", en: "Open-air karaoke and soju under the stars" },
        { mn: "Зайсан толгойноос УБ-ын шөнийн харагдац", ko: "자이산 언덕에서 울란바토르 야경", en: "Ulaanbaatar night views from Zaisan Hill" },
        { mn: "Их Дэлгүүр ба Нарантуул захын худалдан авалт", ko: "국영 백화점 및 나란뚤 시장 쇼핑", en: "Shopping at the State Department Store and Narantuul Market" },
      ],
    },
    logistics: [
      {
        mn: "Тусгай зориулалтын автомашин: 1–4 хүний бүлэгт SUV, 5–6 хүний бүлэгт Пүргон / Alphard / Starex.",
        ko: "전용 차량: 1–4인 SUV, 5–6인 푸르공 / 알파드 / 스타렉스.",
      },
      { mn: "Солонгос хэлтэй хөтөч хамт явна.", ko: "한국어 가이드 동행.", en: "Korean-speaking guide accompanies the group." },
      {
        mn: "Кампын байр (4/3 хүн нэг өрөө), нийтийн ариун цэвэр ба усанд орох газартай.",
        ko: "캠프 숙박 (4인/3인 1실), 공용 화장실 및 샤워실 이용.",
      },
      {
        mn: "Загасчны хэрэгсэл бэлэн (хувийн тоног хэрэгслээ авч ирж болно).",
        ko: "낚시 장비 준비 완료 (개인 장비 지참 가능).",
      },
    ],
    pricing: {
      note: {
        mn: "Аяллын идэвхтэй улирал: 2026 оны 5 сарын 20 — 9 сарын 30. Үнийн талаарх дэлгэрэнгүйг бидэнтэй холбогдон асууна уу.",
        ko: "운영 기간: 2026년 5월 20일 ~ 9월 30일. 가격은 문의 바랍니다.",
      },
      tiers: [],
      included: [
        {
          mn: "Тусгай зориулалтын автомашин (шатахуун, замын төлбөр).",
          ko: "전용 차량 (유류대, 도로비).",
        },
        { mn: "Солонгос хэлтэй хөтөч.", ko: "한국어 가이드.", en: "Korean-speaking guide." },
        { mn: "Бүх хоол.", ko: "모든 식사.", en: "All meals." },
        { mn: "Зочид буудал ба кампын байр.", ko: "호텔 및 캠프 숙박.", en: "Hotel and camp accommodation." },
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
  // АЯЛАЛ #3 — Арбурд элс ба говийн адал явдал
  // ─────────────────────────────────────────────────────────────────────
  {
    slug: "arburd-gobi",
    status: "available",
    hero: {
      title: {
        mn: "Нүүдэлчдийн соёлын аялал",
        ko: "유목 문화 체험",
      },
      subtitle: {
        mn: "Улаанбаатар → Арбурд → Баян Өнжүүл → Чингис хааны хөшөө → УБ · 3 шөнө 4 өдөр",
        ko: "울란바토르 → 아르부르드 → 바양 운줄 → 칭기즈 칸 기마 동상 → 울란바토르 · 3박 4일",
      },
      image: nomadicCultureHero,
      imageHd: nomadicCultureHeroHd,
      imageWebp: nomadicCultureHeroWebp,
    },
    overview: {
      duration: { mn: "4 өдөр / 3 шөнө", ko: "3박 4일", en: "4 Days / 3 Nights" },
      target: {
        mn: "Гэр бүл, найз нөхдийн баг (хамгийн ихдээ 6 хүн)",
        ko: "가족, 친구 모임 (최대 6인)",
      },
      crew: { mn: "Солонгос хэлтэй хөтөч + жолооч", ko: "한국어 가이드 + 운전기사", en: "Korean-speaking Guide + Driver" },
      route: {
        mn: "УБ → Арбурд (~170 км) → Баян Өнжүүл (~30 км) → Чингис хааны хөшөө → УБ (~210 км)",
        ko: "울란바토르 → 아르부르드 (~170km) → 바양 운줄 (~30km) → 칭기즈 칸 기마 동상 → 울란바토르 (~210km)",
      },
    },
    description: {
      mn: "Арбурд элсний нар жаргахыг тэмээгээр бялхуулан, элсэн дээр чарга гулгаж, шөнийн моддогийн дор оддыг ширтэнэ. Маргааш нь Баян Өнжүүлд морь унаж, малчин гэр бүлийн ам бүлийн амьдралыг таньж, уламжлалт хорхог зооглоно. Эцэст нь Чингис хааны морьт хөшөө болон Улаанбаатар хотын соёлоор танилцана.",
      ko: "아르부르드 모래언덕에서 낙타를 타고 일몰을 감상하고, 모래 썰매와 모닥불 옆에서 별을 즐깁니다. 다음 날 바양 운줄 유목민 가정에서 승마와 허르헉을 체험하고, 마지막에는 칭기즈 칸 기마 동상과 울란바토르 시내 문화 체험까지 — 가장 몽골다운 클래식 일정입니다.",
    },
    days: [
      {
        day: 1,
        title: {
          mn: "Улаанбаатар → Арбурд",
          ko: "울란바토르 → 아르부르드",
        },
        subtitle: { mn: "~170 км · Тусгай зориулалтын автомашин", ko: "~170km · 전용 차량", en: "~170 km · Private Vehicle" },
        schedule: [
          {
            time: "Өглөө",
            text: {
              mn: "Чингис хаан Олон Улсын Нисэх Буудал дээр хүлээн авч, хөтөчтэй танилцана.",
              ko: "칭기즈 칸 국제공항 도착 후 가이드 미팅.",
            },
          },
          {
            time: "Үд",
            text: { mn: "Арбурд руу хөдөлнө.", ko: "아르부르드로 이동.", en: "Drive to Arburd." },
          },
          {
            time: "Үдээс хойш",
            text: {
              mn: "Кампад ирээд оройн хоол ба гэрт check-in.",
              ko: "도착 후 석식 및 게르 체크인.",
            },
          },
          {
            time: "Орой",
            text: {
              mn: "Элсэн дээр тэмээгээр зугаалж, нар жаргахын гайхамшгийг буулгана.",
              ko: "낙타를 타고 일몰을 감상.",
            },
          },
          {
            time: "Шөнө",
            text: {
              mn: "Моддогийн дор оддыг ширтэн, найз нөхдийн дунд дуу дуулна.",
              ko: "모닥불 옆에서 별을 감상하며 노래를 즐깁니다.",
            },
          },
        ],
        overnight: {
          mn: "Жуулчны кампын гэр (4/3 хүн нэг өрөө, нийтийн ариун цэвэр ба усанд орох газартай)",
          ko: "관광 캠프 게르 (4인/3인 1실, 공용 화장실 및 샤워실)",
        },
      },
      {
        day: 2,
        title: {
          mn: "Арбурд → Баян Өнжүүл",
          ko: "아르부르드 → 바양 운줄",
        },
        subtitle: { mn: "~30 км · Тэмээ ба морь, малчин ажил", ko: "~30km · 낙타와 말, 유목 체험", en: "~30 km · Camels, Horses & Nomadic Life" },
        schedule: [
          {
            time: "Өглөө",
            text: { mn: "Хоолны дараа хөдөлнө.", ko: "조식 후 이동.", en: "Depart after breakfast." },
          },
          {
            time: "09:00–10:00",
            text: {
              mn: "Арбурд элсэн дунд тэмээгээр 1 цаг аялах туршлага.",
              ko: "아르부르드 낙타 체험 (1시간).",
            },
          },
          {
            time: "10:00–12:00",
            text: {
              mn: "Цөл дунд гэрэл зураг авах, элсэн чарга гулгах, тэмээтэй ойртон танилцах.",
              ko: "사막에서 사진 촬영 및 모래 썰매 체험, 낙타와 교감.",
            },
          },
          {
            time: "Үд",
            text: { mn: "Баян Өнжүүл рүү шилжинэ.", ko: "점심 후 바양 운줄로 이동.", en: "Transfer to Bayan Onjuul after lunch." },
          },
          {
            time: "Үдээс хойш",
            text: {
              mn: "Жуулчны кампад check-in, морин аялал.",
              ko: "여행자 캠프 체크인 및 승마 체험.",
            },
          },
          {
            time: "Орой",
            text: {
              mn: "Уламжлалт монгол хоол хорхог амтлан, малаа маллан, нүүдэлчин соёлыг таньж мэднэ.",
              ko: "허르헉(몽골 전통 음식)을 맛보고, 가축들을 돌보며 몽골 유목민 문화를 체험.",
            },
          },
        ],
        overnight: {
          mn: "Жуулчны кампын гэр (6/4/3 хүн нэг өрөө, нийтийн ариун цэвэр ба усанд орох газартай)",
          ko: "여행자 캠프 게르 (6인/4인/3인 1실, 공용 화장실, 샤워실)",
        },
      },
      {
        day: 3,
        title: {
          mn: "Баян Өнжүүл → Чингис хааны хөшөө → Улаанбаатар",
          ko: "바양 운줄 → 칭기즈 칸 기마 동상 → 울란바토르",
        },
        subtitle: { mn: "~160 км + ~50 км", ko: "~160km + ~50km", en: "~160 km + ~50 km" },
        schedule: [
          {
            time: "Өглөө",
            text: { mn: "Хоолны дараа хөдөлнө.", ko: "조식 후 이동.", en: "Depart after breakfast." },
          },
          {
            time: "Замдаа",
            text: {
              mn: "Замын дунд агуйн доторх савлуурын туршлага.",
              ko: "이동하는 길에 동굴 안 그네 체험.",
            },
          },
          {
            time: "Үд",
            text: {
              mn: "Чингис хааны морьт хөшөөгөөр зочлон, дотор үзэж, тэнгэрийн харааны тавцангаас дурсгалын зураг авч, бяцхан музей үзнэ.",
              ko: "칭기즈 칸 기마 동상 방문, 내부 관람 후 전망대에서 기념 촬영 및 소규모 박물관 관람.",
            },
          },
          {
            time: "Орой",
            text: {
              mn: "Улаанбаатар руу шилжиж, шөнийн харагдацыг сонирхон, зочид буудалд хононо.",
              ko: "울란바토르로 이동 후 야경을 감상하고 호텔에서 숙박.",
            },
          },
        ],
        overnight: { mn: "Улаанбаатар хотын зочид буудал", ko: "울란바토르 시내 호텔", en: "Ulaanbaatar City Hotel" },
      },
      {
        day: 4,
        title: {
          mn: "Улаанбаатар хотын аялал",
          ko: "울란바토르 시내 투어",
        },
        subtitle: { mn: "Соёл, түүх, худалдан авалт", ko: "문화·역사·쇼핑", en: "Culture, History & Shopping" },
        schedule: [
          {
            time: "Өглөө",
            text: { mn: "Хоолны дараа хөдөлнө.", ko: "조식 후 이동.", en: "Depart after breakfast." },
          },
          {
            time: "Үд дунд",
            text: { mn: "Сүхбаатарын талбайгаар зочилно.", ko: "수흐바타르 광장 관람.", en: "Visit Sukhbaatar Square." },
          },
          {
            time: "Үдээс хойш",
            text: {
              mn: "Гандан хийдэд зочлон, Буддын соёлтой танилцана.",
              ko: "간단 사원 방문 및 불교 문화 체험.",
            },
          },
          {
            time: "Үдээс хойш",
            text: {
              mn: "Музей эсвэл ардын урлагийн тоглолт (сонголтоор).",
              ko: "박물관 또는 민속공연 관람 (선택).",
            },
          },
          {
            time: "Орой",
            text: {
              mn: "Их Дэлгүүрт зочлон, бэлэг дурсгалын худалдан авалт хийнэ.",
              ko: "국영 백화점 방문 및 쇼핑.",
            },
          },
        ],
      },
    ],
    meals: {
      breakfast: { mn: "Дэлгүүрийн зууш / кампын хоол / зочид буудлын хоол", ko: "편의점식 / 캠프식 / 호텔식", en: "Convenience-store snacks / camp meals / hotel meals" },
      lunch: { mn: "Орон нутгийн хоол / кампын хоол", ko: "현지식 / 캠프식", en: "Local cuisine / camp meals" },
      dinner: { mn: "Кампын хоол", ko: "캠프식", en: "Camp meals" },
      special: {
        mn: "2 дахь өдөр малчин айлд уламжлалт хорхог",
        ko: "2일째 유목민 가정에서 전통 허르헉",
      },
    },
    highlights: {
      title: { mn: "Аяллын онцлох мөчүүд", ko: "투어 하이라이트", en: "Tour Highlights" },
      items: [
        { mn: "Арбурд элсэн дунд тэмээгээр аялах", ko: "아르부르드 모래언덕에서 낙타 체험", en: "Camel trek through the Arburd dunes" },
        { mn: "Элсэн чарга ба моддогийн дор одод", ko: "모래 썰매와 모닥불 아래 별 감상", en: "Sand sledding and stargazing by the campfire" },
        { mn: "Баян Өнжүүлд морь унаж нүүдэлчин соёлыг мэдрэх", ko: "바양 운줄에서 승마와 유목민 문화 체험", en: "Horseback riding and nomadic culture in Bayan Onjuul" },
        { mn: "Уламжлалт хорхог зооглох", ko: "전통 음식 허르헉 시식", en: "Traditional khorhog dining experience" },
        { mn: "Чингис хааны морьт хөшөөгөөр зочлох", ko: "칭기즈 칸 기마 동상 방문", en: "Visit the Chinggis Khaan equestrian statue" },
        { mn: "Сүхбаатарын талбай ба Гандан хийдийн соёлоор танилцах", ko: "수흐바타르 광장 및 간단 사원 문화 체험", en: "Sukhbaatar Square and Gandantegchinlen Monastery cultural tour" },
        { mn: "Их Дэлгүүрт худалдан авалт", ko: "국영 백화점 쇼핑", en: "Shopping at the State Department Store" },
      ],
    },
    logistics: [
      {
        mn: "Тусгай зориулалтын автомашин: 1–4 хүний бүлэгт SUV, 5–6 хүний бүлэгт Пүргон / Alphard / Starex.",
        ko: "전용 차량: 1–4인 SUV, 5–6인 푸르공 / 알파드 / 스타렉스.",
      },
      { mn: "Солонгос хэлтэй хөтөч хамт явна.", ko: "한국어 가이드 동행.", en: "Korean-speaking guide accompanies the group." },
      {
        mn: "Жуулчны кампад гэр байр (нийтийн ариун цэвэр ба усанд орох газартай).",
        ko: "관광 캠프 게르 숙박 (공용 화장실 및 샤워실).",
      },
      { mn: "Эцсийн шөнө Улаанбаатар хотын зочид буудалд хононо.", ko: "마지막 밤은 울란바토르 시내 호텔에서 숙박.", en: "Final night at a Ulaanbaatar city hotel." },
    ],
    pricing: {
      note: {
        mn: "Аяллын идэвхтэй улирал: 2026 оны 5 сарын 20 — 9 сарын 30. Үнийн талаарх дэлгэрэнгүйг бидэнтэй холбогдон асууна уу.",
        ko: "운영 기간: 2026년 5월 20일 ~ 9월 30일. 가격은 문의 바랍니다.",
      },
      tiers: [],
      included: [
        {
          mn: "Тусгай зориулалтын автомашин (шатахуун, замын төлбөр).",
          ko: "전용 차량 (유류대, 도로비).",
        },
        { mn: "Солонгос хэлтэй хөтөч.", ko: "한국어 가이드.", en: "Korean-speaking guide." },
        { mn: "Бүх хоол.", ko: "모든 식사.", en: "All meals." },
        { mn: "Кампын ба зочид буудлын байр.", ko: "캠프 및 호텔 숙박.", en: "Camp and hotel accommodation." },
      ],
      excluded: [
        {
          mn: "Хувийн ундаа (ус, согтууруулах ундаа гэх мэт) ба нэмэлт зууш.",
          ko: "개인 음료(물, 주류 등) 및 간식.",
        },
        {
          mn: "Кампын өглөө ба оройн хоолыг 2 хоногийн өмнө захиалж, 1 хоногийн өмнө дахин баталгаажуулна.",
          ko: "조식과 석식은 캠프 숙박 이틀 전에 미리 예약하고, 하루 전에 다시 확정해야 합니다.",
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
