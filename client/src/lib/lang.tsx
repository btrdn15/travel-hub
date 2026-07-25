import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";

export type Lang = "mn" | "ko" | "en" | "ja";

export const PUBLIC_LANG_ORDER: Lang[] = ["en", "ko", "ja"];
export const ADMIN_LANG_ORDER: Lang[] = ["en", "ko", "ja", "mn"];

/** @deprecated Use getLangOrder(isAdmin) or useLang().availableLangs */
export const LANG_ORDER: Lang[] = ADMIN_LANG_ORDER;

export const LANG_LABELS: Record<Lang, string> = {
  mn: "Монгол",
  ko: "한국어",
  en: "English",
  ja: "日本語",
};

export function getLangOrder(isAdmin: boolean): Lang[] {
  return isAdmin ? ADMIN_LANG_ORDER : PUBLIC_LANG_ORDER;
}

export function nextLang(current: Lang, isAdmin: boolean): Lang {
  const order = getLangOrder(isAdmin);
  const i = order.indexOf(current);
  return order[(i + 1) % order.length];
}

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  availableLangs: Lang[];
};

const LangContext = createContext<LangContextValue>({
  lang: "en",
  setLang: () => {},
  availableLangs: PUBLIC_LANG_ORDER,
});

const STORAGE_KEY = "olon-nuur-lang";

export function LangProvider({ children }: { children: ReactNode }) {
  const { isAdmin, isLoading } = useAuth();
  const [lang, setLangState] = useState<Lang>("en");
  const availableLangs = getLangOrder(isAdmin);

  useEffect(() => {
    if (isLoading) return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved === "ko" || saved === "en" || saved === "ja") {
        setLangState(saved);
        return;
      }
      if (saved === "mn" && isAdmin) {
        setLangState("mn");
        return;
      }
      setLangState("en");
      if (saved === "mn" && !isAdmin) {
        localStorage.setItem(STORAGE_KEY, "en");
      }
    } catch {
      setLangState("en");
    }
  }, [isLoading, isAdmin]);

  useEffect(() => {
    if (isLoading) return;
    if (!isAdmin && lang === "mn") {
      setLangState("en");
      try {
        localStorage.setItem(STORAGE_KEY, "en");
      } catch {
        // ignore
      }
    }
  }, [isAdmin, isLoading, lang]);

  const setLang = (next: Lang) => {
    if (next === "mn" && !isAdmin) return;
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore storage errors
    }
  };

  return (
    <LangContext.Provider value={{ lang, setLang, availableLangs }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
