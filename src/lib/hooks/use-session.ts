"use client";

import { useState, useCallback, useEffect } from "react";

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
 *
 * Returns `mounted` — false until localStorage has been read on the client.
 * Pages must not branch on `session` until `mounted` is true, to avoid
 * hydration mismatches (localStorage doesn't exist on the server).
 */
export function useSession() {
  // Always start with null — never read localStorage during SSR
  const [session, setSessionState] = useState<Session>(null);
  const [mounted, setMounted] = useState(false);

  // Read localStorage once after mount (client-only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setSessionState(JSON.parse(stored));
    } catch {
      // corrupted storage — ignore
    }
    setMounted(true);
  }, []);

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

  return { session, mounted, login, logout, setSession };
}
