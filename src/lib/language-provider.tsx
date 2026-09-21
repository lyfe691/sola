/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import {
  createContext,
  startTransition,
  use,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import { type Language, SUPPORTED_LANGUAGE_CODES } from "@/config/languages";
import {
  loadTranslation,
  loadedTranslation,
  type Translation,
} from "@/lib/translations";

type LanguageProviderProps = {
  children: ReactNode;
  defaultLanguage?: Language;
  storageKey?: string;
};

type LanguageProviderState = {
  language: Language;
  /** the active language's dictionary */
  t: Translation;
  setLanguage: (language: Language) => void;
  detectedLanguage: Language;
  detectedLanguageCode: string | null;
};

const LanguageContext = createContext<LanguageProviderState | undefined>(
  undefined,
);

const isSupported = (code: string | null): code is Language =>
  code !== null &&
  (SUPPORTED_LANGUAGE_CODES as readonly string[]).includes(code);

function normalize(code: string): Language {
  const lower = code.toLowerCase();
  const base = lower.split("-")[0];
  return isSupported(lower) ? lower : isSupported(base) ? base : "en";
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

export const LANGUAGE_STORAGE_KEY = "app-language";

/**
 * The language a visit starts in: the stored choice, else the browser's.
 * Needs no provider, so main.tsx can load its dictionary before the first
 * render, and ErrorBoundary can read it when the provider tree is the thing
 * that crashed.
 */
export function readLanguage(
  storageKey = LANGUAGE_STORAGE_KEY,
  defaultLanguage: Language = "en",
): Language {
  try {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
    if (isSupported(stored)) return stored;
  } catch {
    /* ignore */
  }
  return getAuto(defaultLanguage).matched;
}

export function LanguageProvider({
  children,
  defaultLanguage = "en",
  storageKey = LANGUAGE_STORAGE_KEY,
}: LanguageProviderProps) {
  const auto = useMemo(() => getAuto(defaultLanguage), [defaultLanguage]);

  const [language, setLanguageState] = useState<Language>(() =>
    readLanguage(storageKey, defaultLanguage),
  );

  // The first dictionary is loaded before the first render (main.tsx). A
  // switch runs as a transition: while the next dictionary loads, the page
  // keeps its current words instead of suspending to nothing.
  const t = loadedTranslation(language) ?? use(loadTranslation(language));
  const switchLanguage = useCallback((next: Language) => {
    startTransition(() => setLanguageState(next));
  }, []);

  const setLanguage = useCallback(
    (next: Language) => {
      try {
        localStorage.setItem(storageKey, next);
      } catch {
        /* ignore */
      }
      switchLanguage(next);
    },
    [storageKey, switchLanguage],
  );

  // keep <html lang> in sync for screen readers, browser translation, SEO
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // cross-tab sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey && isSupported(e.newValue)) {
        switchLanguage(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKey, switchLanguage]);

  // react to browser language change (optional)
  useEffect(() => {
    const handler = () => {
      const { matched } = getAuto(defaultLanguage);
      // only auto-adjust if user hasn’t chosen explicitly (no stored value)
      try {
        const stored = localStorage.getItem(storageKey);
        if (!stored) switchLanguage(matched);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("languagechange", handler);
    return () => window.removeEventListener("languagechange", handler);
  }, [defaultLanguage, storageKey, switchLanguage]);

  const value = useMemo<LanguageProviderState>(
    () => ({
      language,
      t,
      setLanguage,
      detectedLanguage: auto.matched,
      detectedLanguageCode: auto.source,
    }),
    [language, t, setLanguage, auto.matched, auto.source],
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

/** The active language's dictionary. */
export const useTranslation = () => useLanguage().t;
