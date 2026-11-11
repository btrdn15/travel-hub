/**
 * Хэлтэй URL-ийн дүрэм (client + server хоёулаа ашиглана).
 *
 *   /                      → Англи нүүр (redirect ХИЙХГҮЙ — хэрэглэгч өөрөө хэл сонгоно)
 *   /:lang/                → нүүр (en | ko | mn | ja)
 *   /:lang/tours/:slug     → аяллын дэлгэрэнгүй
 *   /:lang/<page>          → бусад хуудас (PAGE_SEGMENTS)
 *
 * Хуучин хэлгүй URL-ууд (/tours/:slug, /book, /gallery, /comic) болон хуучин
 * slug-ууд (/ko/tours/bird-photography) нь resolveLegacyRedirect()-ээр 301 хийгдэнэ.
 */
import {
  DEFAULT_LANG,
  LEGACY_TOUR_SLUGS,
  isSiteLang,
  isTourSlug,
  type SiteLang,
} from "./tours-2027";

export const PAGE_SEGMENTS = {
  home: "",
  tours: "tours",
  departures: "departures",
  about: "about",
  travelInfo: "travel-information",
  faq: "faq",
  contact: "contact",
  privacy: "privacy",
  gallery: "gallery",
  comic: "comic",
} as const;

export type PageKey = keyof typeof PAGE_SEGMENTS;

/** Хэлтэй зам. Нүүр хуудас нь "/en/" гэх мэт сүүлдээ "/"-тэй. */
export function localizedPath(lang: SiteLang, page: PageKey = "home"): string {
  const segment = PAGE_SEGMENTS[page];
  return segment ? `/${lang}/${segment}` : `/${lang}/`;
}

export function tourPath(lang: SiteLang, slug: string): string {
  return `/${lang}/tours/${slug}`;
}

export function contactPath(lang: SiteLang, tourSlug?: string): string {
  const base = localizedPath(lang, "contact");
  return tourSlug ? `${base}?tour=${encodeURIComponent(tourSlug)}` : base;
}

/** Замын эхний хэсэг хэлний код бол түүнийг буцаана, үгүй бол null */
export function langFromPath(pathname: string): SiteLang | null {
  const first = pathname.split("/")[1] ?? "";
  return isSiteLang(first) ? first : null;
}

/**
 * Одоогийн хуудасны өөр хэлний хувилбарын зам.
 * "/" (хэлгүй нүүр) → "/ko/" гэх мэт. Хэлгүй бусад зам (admin) хэвээр үлдэнэ.
 */
export function switchLangPath(pathname: string, next: SiteLang): string {
  if (pathname === "" || pathname === "/") return `/${next}/`;
  const current = langFromPath(pathname);
  if (!current) return pathname;
  const rest = pathname.slice(current.length + 1); // "" | "/" | "/tours/x"
  return rest === "" || rest === "/" ? `/${next}/` : `/${next}${rest}`;
}

function mapLegacyTourQuery(search: string): string {
  if (!search) return "";
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const tour = params.get("tour");
  if (tour && LEGACY_TOUR_SLUGS[tour]) params.set("tour", LEGACY_TOUR_SLUGS[tour]);
  const out = params.toString();
  return out ? `?${out}` : "";
}

/**
 * Хуучин URL бол шинэ байршлыг (query-тэй) буцаана, үгүй бол null.
 * `search` нь "?a=b" эсвэл "" хэлбэртэй.
 */
export function resolveLegacyRedirect(pathname: string, search = ""): string | null {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const query = mapLegacyTourQuery(search);
  const lang = DEFAULT_LANG;

  if (path === "/book") return `${localizedPath(lang, "contact")}${query}`;
  if (path === "/gallery") return `${localizedPath(lang, "gallery")}${query}`;
  if (path === "/comic") return `${localizedPath(lang, "comic")}${query}`;

  const bare = /^\/tours\/([^/]+)$/.exec(path);
  if (bare) {
    const slug = LEGACY_TOUR_SLUGS[bare[1]] ?? bare[1];
    return `${tourPath(lang, slug)}${query}`;
  }

  const prefixed = /^\/([^/]+)\/tours\/([^/]+)$/.exec(path);
  if (prefixed && isSiteLang(prefixed[1])) {
    const old = prefixed[2];
    if (!isTourSlug(old) && LEGACY_TOUR_SLUGS[old]) {
      return `${tourPath(prefixed[1], LEGACY_TOUR_SLUGS[old])}${query}`;
    }
  }

  const prefixedBook = /^\/([^/]+)\/book$/.exec(path);
  if (prefixedBook && isSiteLang(prefixedBook[1])) {
    return `${localizedPath(prefixedBook[1], "contact")}${query}`;
  }

  return null;
}
