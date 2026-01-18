/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import { type Language, SUPPORTED_LANGUAGE_CODES } from "@/config/languages";

type LanguageProviderProps = {
  children: ReactNode;
  defaultLanguage?: Language;
  storageKey?: string;
};

type LanguageProviderState = {
  language: Language;
  setLanguage: (language: Language) => void;
  detectedLanguage: Language;
  detectedLanguageCode: string | null;
};

const LanguageContext = createContext<LanguageProviderState | undefined>(
  undefined,
);

function normalize(code: string): Language {
  const lower = code.toLowerCase();
  const base = lower.split("-")[0];
  const hit = (SUPPORTED_LANGUAGE_CODES as readonly string[]).includes(lower)
    ? (lower as Language)
    : (SUPPORTED_LANGUAGE_CODES as readonly string[]).includes(base)
      ? (base as Language)
      : "en";
  return hit;
}

function getAuto(defaultLanguage: Language) {
  if (typeof window === "undefined") {
    return { matched: defaultLanguage, source: null as string | null };
  }
  const nav = window.navigator;
  const langs =
    nav.languages && nav.languages.length ? nav.languages : [nav.language];
  const first = (langs.filter(Boolean)[0] ?? defaultLanguage) as string;
  return { matched: normalize(first), source: first };
}

export function LanguageProvider({
  children,
  defaultLanguage = "en",
  storageKey = "app-language",
}: LanguageProviderProps) {
  const auto = useMemo(() => getAuto(defaultLanguage), [defaultLanguage]);

  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored =
        typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
      if (
        stored &&
        (SUPPORTED_LANGUAGE_CODES as readonly string[]).includes(stored)
      ) {
        return stored as Language;
      }
    } catch {
      /* ignore */
    }
    return auto.matched || defaultLanguage;
  });

  const setLanguage = useCallback(
    (next: Language) => {
      try {
        localStorage.setItem(storageKey, next);
      } catch {
        /* ignore */
      }
      setLanguageState(next);
    },
    [storageKey],
  );

  // cross-tab sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (
        e.key === storageKey &&
        e.newValue &&
        (SUPPORTED_LANGUAGE_CODES as readonly string[]).includes(e.newValue)
      ) {
        setLanguageState(e.newValue as Language);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKey]);

  // react to browser language change (optional)
  useEffect(() => {
    const handler = () => {
      const { matched } = getAuto(defaultLanguage);
      // only auto-adjust if user hasn’t chosen explicitly (no stored value)
      try {
        const stored = localStorage.getItem(storageKey);
        if (!stored) setLanguageState(matched);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("languagechange", handler);
    return () => window.removeEventListener("languagechange", handler);
  }, [defaultLanguage, storageKey]);

  const value = useMemo<LanguageProviderState>(
    () => ({
      language,
      setLanguage,
      detectedLanguage: auto.matched,
      detectedLanguageCode: auto.source,
    }),
    [language, setLanguage, auto.matched, auto.source],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx)
    throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
};
