export type Lang = "mn" | "ko" | "en" | "ja";

export const NATIONALITY_OPTIONS = [
  { id: "kr", mn: "БНСУ", ko: "대한민국", en: "South Korea", ja: "韓国" },
  { id: "mn", mn: "Монгол", ko: "몽골", en: "Mongolia", ja: "モンゴル" },
  { id: "jp", mn: "Япон", ko: "일본", en: "Japan", ja: "日本" },
  { id: "cn", mn: "Хятад", ko: "중국", en: "China", ja: "中国" },
  { id: "us", mn: "АНУ", ko: "미국", en: "United States", ja: "アメリカ" },
  { id: "uk", mn: "Их Британи", ko: "영국", en: "United Kingdom", ja: "イギリス" },
  { id: "de", mn: "Герман", ko: "독일", en: "Germany", ja: "ドイツ" },
  { id: "fr", mn: "Франц", ko: "프랑스", en: "France", ja: "フランス" },
  { id: "au", mn: "Австрали", ko: "호주", en: "Australia", ja: "オーストラリア" },
  { id: "ca", mn: "Канад", ko: "캐나다", en: "Canada", ja: "カナダ" },
  { id: "tw", mn: "Тайвань", ko: "대만", en: "Taiwan", ja: "台湾" },
  { id: "sg", mn: "Сингапур", ko: "싱가포르", en: "Singapore", ja: "シンガポール" },
  { id: "other", mn: "Бусад", ko: "기타", en: "Other", ja: "その他" },
] as const;

export type NationalityId = (typeof NATIONALITY_OPTIONS)[number]["id"];

export const NATIONALITY_IDS = NATIONALITY_OPTIONS.map((o) => o.id) as [
  NationalityId,
  ...NationalityId[],
];

/** Имэйлийн үндсэн хэл — иргэншлээс хамаарна */
const NATIONALITY_EMAIL_LANG: Record<NationalityId, Lang> = {
  kr: "ko",
  mn: "mn",
  jp: "ja",
  cn: "ko",
  tw: "ko",
  sg: "ko",
  us: "en",
  uk: "en",
  de: "en",
  fr: "en",
  au: "en",
  ca: "en",
  other: "en",
};

export function nationalityLabel(id: string, lang: Lang): string {
  const opt = NATIONALITY_OPTIONS.find((o) => o.id === id);
  if (!opt) return id;
  return opt[lang];
}

export function resolveNationalityId(nationality: string): NationalityId | null {
  if (NATIONALITY_IDS.includes(nationality as NationalityId)) {
    return nationality as NationalityId;
  }
  const opt = NATIONALITY_OPTIONS.find(
    (o) => o.mn === nationality || o.ko === nationality || o.en === nationality || o.ja === nationality,
  );
  return opt?.id ?? null;
}

export function emailLangFromNationality(nationality: string): Lang {
  const id = resolveNationalityId(nationality);
  if (!id) return "en";
  return NATIONALITY_EMAIL_LANG[id];
}
