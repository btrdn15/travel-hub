import type { FixedDeparture, SiteLang } from "@shared/tours-2027";
import { parseIsoDate } from "@shared/tours-2027";

const EN_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Баримтын хэлбэрээр: "June 16–20, 2027" / "2027년 6월 16~20일" / "2027.06.16–20" / "2027年6月16〜20日" */
export function formatDepartureRange(dep: FixedDeparture, lang: SiteLang): string {
  const a = parseIsoDate(dep.start);
  const b = parseIsoDate(dep.end);
  if (!a || !b) return `${dep.start} – ${dep.end}`;
  const sameMonth = a.y === b.y && a.m === b.m;
  const pad = (n: number) => String(n).padStart(2, "0");

  switch (lang) {
    case "ko":
      return sameMonth
        ? `${a.y}년 ${a.m}월 ${a.d}~${b.d}일`
        : `${a.y}년 ${a.m}월 ${a.d}일~${b.m}월 ${b.d}일`;
    case "mn":
      return sameMonth
        ? `${a.y}.${pad(a.m)}.${pad(a.d)}–${pad(b.d)}`
        : `${a.y}.${pad(a.m)}.${pad(a.d)}–${pad(b.m)}.${pad(b.d)}`;
    case "ja":
      return sameMonth
        ? `${a.y}年${a.m}月${a.d}〜${b.d}日`
        : `${a.y}年${a.m}月${a.d}日〜${b.m}月${b.d}日`;
    default:
      return sameMonth
        ? `${EN_MONTHS[a.m - 1]} ${a.d}–${b.d}, ${a.y}`
        : `${EN_MONTHS[a.m - 1]} ${a.d} – ${EN_MONTHS[b.m - 1]} ${b.d}, ${a.y}`;
  }
}

/** Хүний тоо: "3 travelers" / "3명" / "3 хүн" / "3名" */
export function formatTravelers(n: number, lang: SiteLang): string {
  switch (lang) {
    case "ko":
      return `${n}명`;
    case "mn":
      return `${n} хүн`;
    case "ja":
      return `${n}名`;
    default:
      return n === 1 ? "1 traveler" : `${n} travelers`;
  }
}
