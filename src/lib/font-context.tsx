"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

type FontMode = "default" | "dyslexia-friendly";

interface FontContextValue {
  font: FontMode;
  setFont: (f: FontMode) => void;
}

const FontContext = createContext<FontContextValue>({
  font: "default",
  setFont: () => {},
});

const STORAGE_KEY = "disaster-relief-font";

export function FontProvider({ children }: { children: ReactNode }) {
  const [font, setFontState] = useState<FontMode>("default");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "dyslexia-friendly" || stored === "default") {
        setFontState(stored);
      }
    } catch { /* ignore */ }
  }, []);

  // Apply font class to document
  useEffect(() => {
    if (font === "dyslexia-friendly") {
      document.documentElement.classList.add("dyslexia-font");
    } else {
      document.documentElement.classList.remove("dyslexia-font");
    }
  }, [font]);

  const setFont = useCallback((f: FontMode) => {
    setFontState(f);
    try { localStorage.setItem(STORAGE_KEY, f); } catch { /* ignore */ }
  }, []);

  return (
    <FontContext.Provider value={{ font, setFont }}>
      {children}
    </FontContext.Provider>
  );
}

export function useFont() {
  return useContext(FontContext);
}
