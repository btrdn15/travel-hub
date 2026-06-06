import type { Lang } from "@/lib/lang";
import type { LocalizedString } from "@/data/tours";
import { TOUR_EN_BY_MN } from "@/data/tour-en-by-mn";

/** Map key-д буруу escape байсан тохиолдолд харьцуулна */
function normalizeMnKey(s: string): string {
  return s.replace(/\\"/g, '"');
}

function lookupTourEn(mn: string): string | undefined {
  if (TOUR_EN_BY_MN[mn]) return TOUR_EN_BY_MN[mn];
  const normalized = normalizeMnKey(mn);
  if (TOUR_EN_BY_MN[normalized]) return TOUR_EN_BY_MN[normalized];
  for (const [key, value] of Object.entries(TOUR_EN_BY_MN)) {
    if (normalizeMnKey(key) === normalized) return value;
  }
  return undefined;
}

/** Хуваарийн цаг — зөвхөн текстэн шошго (жишээ нь «Шөнө») */
const SCHEDULE_TIME_LABELS: Record<string, LocalizedString> = {
  Шөнө: { mn: "Шөнө", ko: "밤", en: "Night" },
  Өдөр: { mn: "Өдөр", ko: "낮", en: "Daytime" },
};

/** Олон хэлтэй текст */
export function localize(str: LocalizedString, lang: Lang): string {
  if (lang === "en") {
    return str.en ?? lookupTourEn(str.mn) ?? str.mn;
  }
  if (lang === "ko") return str.ko;
  return str.mn;
}

/** Хуваарийн цаг — «06:30» гэх мэт тоон цагийг хэвээр, «Шөнө»-г орчуулна */
export function localizeScheduleTime(time: string, lang: Lang): string {
  const labeled = SCHEDULE_TIME_LABELS[time];
  if (labeled) return localize(labeled, lang);
  return time;
}
