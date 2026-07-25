import type { Lang } from "@/lib/lang";
import type { LocalizedString } from "@/data/tours";
import { TOUR_EN_BY_MN } from "@/data/tour-en-by-mn";
import { TOUR_JA_BY_EN } from "@/data/tour-ja-by-en";

/** Map key-д буруу escape байсан тохиолдолд харьцуулна */
function normalizeKey(s: string): string {
  return s.replace(/\\"/g, '"');
}

function lookupInMap(map: Record<string, string>, key: string): string | undefined {
  if (map[key]) return map[key];
  const normalized = normalizeKey(key);
  if (map[normalized]) return map[normalized];
  for (const [k, value] of Object.entries(map)) {
    if (normalizeKey(k) === normalized) return value;
  }
  return undefined;
}

function lookupTourEn(mn: string): string | undefined {
  return lookupInMap(TOUR_EN_BY_MN, mn);
}

function lookupTourJa(en: string): string | undefined {
  return lookupInMap(TOUR_JA_BY_EN, en);
}

function resolveEnglish(str: LocalizedString): string {
  return str.en ?? lookupTourEn(str.mn) ?? str.mn;
}

/** Хуваарийн цаг — зөвхөн текстэн шошго (жишээ нь «Шөнө») */
const SCHEDULE_TIME_LABELS: Record<string, LocalizedString> = {
  Өглөө: { mn: "Өглөө", ko: "아침", en: "Morning", ja: "朝" },
  Үд: { mn: "Үд", ko: "점심", en: "Lunch", ja: "昼" },
  "Үд дунд": { mn: "Үд дунд", ko: "낮", en: "Midday", ja: "昼間" },
  "Үдээс хойш": { mn: "Үдээс хойш", ko: "오후", en: "Afternoon", ja: "午後" },
  Өдөр: { mn: "Өдөр", ko: "낮", en: "Daytime", ja: "日中" },
  Замдаа: { mn: "Замдаа", ko: "이동 중", en: "En route", ja: "移動中" },
  Орой: { mn: "Орой", ko: "저녁", en: "Evening", ja: "夕方" },
  Шөнө: { mn: "Шөнө", ko: "밤", en: "Night", ja: "夜" },
};

/** Олон хэлтэй текст */
export function localize(str: LocalizedString, lang: Lang): string {
  if (lang === "en") {
    return resolveEnglish(str);
  }
  if (lang === "ko") return str.ko;
  if (lang === "ja") {
    if (str.ja) return str.ja;
    const en = resolveEnglish(str);
    const direct = lookupTourJa(en);
    if (direct) return direct;
    const viaMn = lookupTourEn(str.mn);
    if (viaMn && viaMn !== en) {
      const alt = lookupTourJa(viaMn);
      if (alt) return alt;
    }
    return en;
  }
  return str.mn;
}

/** Хуваарийн цаг — «06:30» гэх мэт тоон цагийг хэвээр, «Шөнө»-г орчуулна */
export function localizeScheduleTime(time: string, lang: Lang): string {
  const labeled = SCHEDULE_TIME_LABELS[time];
  if (labeled) return localize(labeled, lang);
  return time;
}
