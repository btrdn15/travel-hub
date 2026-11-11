import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useLocation } from "wouter";
import { SITE_LANGS, isSiteLang, type SiteLang } from "@shared/tours-2027";
import {
  contactPath,
  langFromPath,
  localizedPath,
  switchLangPath,
  tourPath,
  type PageKey,
} from "@shared/site-routes";

/**
 * Хэл нь URL-аас тодорхойлогдоно: /en/…, /ko/…, /mn/…, /ja/….
 * "/" нь үргэлж англи (redirect хийхгүй). Хэлгүй бусад зам (/ont1 гэх мэт)
 * сүүлд сонгосон хэлийг localStorage-аас авна.
 */
export type Lang = SiteLang;

/** Хэл солигч дээрх дараалал */
export const LANG_ORDER: readonly Lang[] = SITE_LANGS;

export const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  ko: "한국어",
  mn: "Монгол",
  ja: "日本語",
};

type LangContextValue = {
  lang: Lang;
  /** Одоогийн хуудасны сонгосон хэлний хувилбар руу шилжинэ */
  setLang: (lang: Lang) => void;
  availableLangs: readonly Lang[];
};

const LangContext = createContext<LangContextValue>({
  lang: "en",
  setLang: () => {},
  availableLangs: LANG_ORDER,
});

const STORAGE_KEY = "olon-nuur-lang";

function readStoredLang(): Lang | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return isSiteLang(saved) ? saved : null;
  } catch {
    return null;
  }
}

function storeLang(lang: Lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // ignore storage errors
  }
}

export function resolveLang(pathname: string): Lang {
  const fromPath = langFromPath(pathname);
  if (fromPath) return fromPath;
  if (pathname === "/" || pathname === "") return "en";
  return readStoredLang() ?? "en";
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [location, navigate] = useLocation();
  const lang = resolveLang(location);

  useEffect(() => {
    document.documentElement.lang = lang;
    if (langFromPath(location)) storeLang(lang);
  }, [lang, location]);

  const value = useMemo<LangContextValue>(
    () => ({
      lang,
      availableLangs: LANG_ORDER,
      setLang: (next: Lang) => {
        storeLang(next);
        const target = switchLangPath(location, next);
        if (target !== location) {
          navigate(`${target}${window.location.search}${window.location.hash}`);
        }
      },
    }),
    [lang, location, navigate],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

/** Одоогийн хэлээр дотоод холбоос үүсгэх */
export function usePaths() {
  const { lang } = useLang();
  return useMemo(
    () => ({
      page: (page: PageKey = "home") => localizedPath(lang, page),
      tour: (slug: string) => tourPath(lang, slug),
      contact: (tourSlug?: string) => contactPath(lang, tourSlug),
      /** Нүүр хуудасны anchor (#tours гэх мэт) */
      homeAnchor: (hash: string) => `${localizedPath(lang, "home")}${hash}`,
    }),
    [lang],
  );
}
