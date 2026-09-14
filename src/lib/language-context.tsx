"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { TRANSLATIONS, type Locale } from "./i18n";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  /** Translate a key: falls back to English, then to the raw key. */
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "en",
  setLocale: () => {},
  t: (key) => TRANSLATIONS.en[key] ?? key,
});

const STORAGE_KEY = "disaster-relief-locale";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // Read from localStorage after mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "ne") {
        setLocaleState(stored);
      }
    } catch { /* ignore */ }
  }, []);

  // Keep <html lang> in sync for screen readers / font rendering
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch { /* ignore */ }
  }, []);

  const t = useCallback(
    (key: string) => TRANSLATIONS[locale][key] ?? TRANSLATIONS.en[key] ?? key,
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
