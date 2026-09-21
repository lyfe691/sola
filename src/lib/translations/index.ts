/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * English ships with the app: it defines the Translation type every locale
 * mirrors, and it is the fallback. The other locales are chunks of their
 * own, so a visitor downloads only the one they read. Components get the
 * active dictionary from useTranslation(), never from here.
 */

import type { Language } from "@/config/languages";
import { en, type Translation } from "./en";

const LOADERS: Record<Language, () => Promise<Translation>> = {
  en: () => Promise.resolve(en),
  de: () => import("./de").then((m) => m.de),
  es: () => import("./es").then((m) => m.es),
  ja: () => import("./ja").then((m) => m.ja),
  ko: () => import("./ko").then((m) => m.ko),
  zh: () => import("./zh").then((m) => m.zh),
};

const loaded = new Map<Language, Translation>([["en", en]]);
const pending = new Map<Language, Promise<Translation>>();

/** A language's dictionary, once it has loaded. */
export const loadedTranslation = (language: Language) => loaded.get(language);

/**
 * Loads a language's dictionary. Every call for one language returns the
 * same promise, which is what React's use() needs; a failed load is
 * forgotten, so the next call retries.
 */
export function loadTranslation(language: Language): Promise<Translation> {
  let promise = pending.get(language);
  if (!promise) {
    promise = LOADERS[language]().then(
      (translation) => {
        loaded.set(language, translation);
        return translation;
      },
      (error: unknown) => {
        pending.delete(language);
        throw error;
      },
    );
    pending.set(language, promise);
  }
  return promise;
}

export { en };
export type { Language, Translation };
export type TranslationAny = Translation;
