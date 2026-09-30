/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import {
  createContext,
  use,
  useContext,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import { type Language, SUPPORTED_LANGUAGE_CODES } from "@/config/languages";
import { localize, splitLocale } from "@/lib/locale";
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
 * The language a visitor would rather read: their stored choice, else the
 * browser's. main.tsx sends a visit that lands on an English URL to this
 * language's URL before the first render.
 */
export function preferredLanguage(
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

/**
 * The language the page is in: its URL's (src/lib/locale.ts). Needs no
 * provider, so main.tsx can load its dictionary before the first render,
 * and ErrorBoundary can read it when the provider tree is what crashed.
 */
export function readLanguage(): Language {
  return typeof window === "undefined"
    ? "en"
    : splitLocale(window.location.pathname).language;
}

/** Inside the router: the language is the current URL's. */
export function LanguageProvider({
  children,
  defaultLanguage = "en",
  storageKey = LANGUAGE_STORAGE_KEY,
}: LanguageProviderProps) {
  const auto = useMemo(() => getAuto(defaultLanguage), [defaultLanguage]);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { language } = splitLocale(pathname);

  // The first dictionary is loaded before the first render (main.tsx), and
  // a switch loads the next one before it moves to the new URL, so the page
  // never suspends to nothing. Back and forward across languages are router
  // transitions: the page keeps its words while the dictionary loads.
  const t = loadedTranslation(language) ?? use(loadTranslation(language));

  // the same page at the other language's URL, in place of this one
  const setLanguage = useCallback(
    (next: Language) => {
      try {
        localStorage.setItem(storageKey, next);
      } catch {
        /* ignore */
      }
      void loadTranslation(next).then(() => {
        const { pathname: current, search, hash } = window.location;
        navigate(`${localize(current, next)}${search}${hash}`, {
          replace: true,
        });
      });
    },
    [navigate, storageKey],
  );

  // keep <html lang> in sync for screen readers, browser translation, SEO
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

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
