/**
 * Нийтлэг холбоо барих мэдээлэл болон gallery/comic хуудасны текст.
 * 2027 хуудасны текст: client/src/data/site-copy.ts.
 * Холбоо барих мэдээлэл: docs/2027/2027-website-content.md (CONTACT).
 */
import type { Lang } from "@/lib/lang";

export const CONTACT = {
  phones: ["+976 88012341", "+976 72704120"],
  phoneHref: ["tel:+97688012341", "tel:+97672704120"],
  email: "olonnuurtravel@gmail.com",
  instagram: "@olonnurtravel",
  instagramUrl: "https://www.instagram.com/olonnurtravel/",
  website: "www.olonnuurtravel.mn",
  websiteUrl: "https://www.olonnuurtravel.mn",
} as const;

type GalleryCategoryId = "birds" | "nomadic" | "nature";
type ComicEpisodeId = "episode-01" | "episode-02" | "episode-03" | "episode-04";

export type WebsiteCopy = {
  galleryTitle: string;
  galleryCategories: ReadonlyArray<{ id: GalleryCategoryId; title: string }>;
  comicTitle: string;
  comicEpisodes: ReadonlyArray<{ id: ComicEpisodeId; title: string }>;
};

const EPISODES = [
  { id: "episode-01", title: "Episode 1" },
  { id: "episode-02", title: "Episode 2" },
  { id: "episode-03", title: "Episode 3" },
  { id: "episode-04", title: "Episode 4" },
] as const;

export const websiteContent: Record<Lang, WebsiteCopy> = {
  mn: {
    galleryTitle: "Зургийн цомог",
    galleryCategories: [
      { id: "birds", title: "Шувуудын" },
      { id: "nomadic", title: "Нүүдэлчин ахуй" },
      { id: "nature", title: "Байгалийн" },
    ],
    comicTitle: "Комик",
    comicEpisodes: EPISODES,
  },
  ko: {
    galleryTitle: "갤러리",
    galleryCategories: [
      { id: "birds", title: "조류" },
      { id: "nomadic", title: "유목민 생활" },
      { id: "nature", title: "자연" },
    ],
    comicTitle: "코믹",
    comicEpisodes: EPISODES,
  },
  en: {
    galleryTitle: "Gallery",
    galleryCategories: [
      { id: "birds", title: "Birds" },
      { id: "nomadic", title: "Nomadic Life" },
      { id: "nature", title: "Nature" },
    ],
    comicTitle: "Comic",
    comicEpisodes: EPISODES,
  },
  ja: {
    galleryTitle: "ギャラリー",
    galleryCategories: [
      { id: "birds", title: "野鳥" },
      { id: "nomadic", title: "遊牧生活" },
      { id: "nature", title: "自然" },
    ],
    comicTitle: "コミック",
    comicEpisodes: EPISODES,
  },
};

export function getWebsiteCopy(lang: Lang): WebsiteCopy {
  return websiteContent[lang];
}
