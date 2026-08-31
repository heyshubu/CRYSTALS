"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type ThemeName = "normal" | "deuteranomaly" | "protanomaly" | "deuteranopia" | "protanopia";

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "normal",
  setTheme: () => {},
});

const STORAGE_KEY = "disaster-relief-theme";

export const THEMES: { value: ThemeName; label: string; description: string }[] = [
  { value: "normal", label: "Normal Vision", description: "Standard color palette" },
  { value: "deuteranomaly", label: "Deuteranomaly", description: "Reduced green sensitivity (most common)" },
  { value: "protanomaly", label: "Protanomaly", description: "Reduced red sensitivity" },
  { value: "deuteranopia", label: "Deuteranopia", description: "No green cones — greens look beige" },
  { value: "protanopia", label: "Protanopia", description: "No red cones — reds look black/brown" },
];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("normal");

  // Read from localStorage after mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && THEMES.some((t) => t.value === stored)) {
        setThemeState(stored as ThemeName);
      }
    } catch { /* ignore */ }
  }, []);

  const setTheme = useCallback((t: ThemeName) => {
    setThemeState(t);
    try { localStorage.setItem(STORAGE_KEY, t); } catch { /* ignore */ }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
