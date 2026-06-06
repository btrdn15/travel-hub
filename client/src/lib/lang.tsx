import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Lang = "mn" | "ko" | "en";

export const LANG_ORDER: Lang[] = ["mn", "ko", "en"];

export const LANG_LABELS: Record<Lang, string> = {
  mn: "Монгол",
  ko: "한국어",
  en: "English",
};

export function nextLang(current: Lang): Lang {
  const i = LANG_ORDER.indexOf(current);
  return LANG_ORDER[(i + 1) % LANG_ORDER.length];
}

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

const LangContext = createContext<LangContextValue>({
  lang: "mn",
  setLang: () => {},
});

const STORAGE_KEY = "olon-nuur-lang";

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("mn");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved === "mn" || saved === "ko" || saved === "en") {
        setLangState(saved);
      }
    } catch {
      // localStorage may be unavailable; fall back to default.
    }
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore storage errors
    }
  };

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
