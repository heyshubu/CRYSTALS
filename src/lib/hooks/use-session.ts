"use client";

import { useState, useCallback } from "react";

export interface ResponderSession {
  role: "responder";
  responder: {
    id: string;
    name: string;
    phone: string | null;
    skill: string;
    coverage: string;
    availability: string;
  };
}

export interface SuperadminSession {
  role: "superadmin";
}

export type Session = ResponderSession | SuperadminSession | null;

const STORAGE_KEY = "disaster-relief-session";

/**
 * Hook to manage the user's session (login state).
 * Stores session data in localStorage.
 * NEVER stores the raw login code.
 */
export function useSession() {
  const [session, setSessionState] = useState<Session>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const setSession = useCallback((newSession: Session) => {
    setSessionState(newSession);
    if (newSession) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const logout = useCallback(() => {
    setSession(null);
  }, [setSession]);

  const login = useCallback(
    async (code: string): Promise<{ error?: string }> => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        const data = await res.json();

        if (!res.ok) {
          return { error: data.error || "Login failed." };
        }

        setSession(data as Session);
        return {};
      } catch {
        return { error: "Connection error. Please try again." };
      }
    },
    [setSession]
  );

  return { session, login, logout, setSession };
}
