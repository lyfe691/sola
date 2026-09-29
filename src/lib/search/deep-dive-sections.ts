/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The deep dives' sections for search, in the reader's language: English
 * ships with the palette, a translation's index loads the first time it is
 * asked for, and a deep dive without a current translation keeps its
 * English sections. Anchors are the English ones in every language.
 */

import english from "virtual:deep-dive-index";
import type { Language } from "@/config/languages";
import type { DeepDiveSection } from "./types";

export type SectionIndex = Record<string, DeepDiveSection[]>;

type Loader = () => Promise<{ default: SectionIndex }>;

const LOADERS: Record<Exclude<Language, "en">, Loader> = {
  de: () => import("virtual:deep-dive-index/de"),
  es: () => import("virtual:deep-dive-index/es"),
  ja: () => import("virtual:deep-dive-index/ja"),
  ko: () => import("virtual:deep-dive-index/ko"),
  zh: () => import("virtual:deep-dive-index/zh"),
};

const loaded = new Map<Language, SectionIndex>([["en", english]]);

/** The sections in this language if they are in, else null. */
export const sectionsIn = (language: Language): SectionIndex | null =>
  loaded.get(language) ?? null;

export async function loadSections(language: Language): Promise<SectionIndex> {
  const ready = loaded.get(language);
  if (ready) return ready;
  const { default: translated } =
    await LOADERS[language as Exclude<Language, "en">]();
  const merged = { ...english, ...translated };
  loaded.set(language, merged);
  return merged;
}

export { english as englishSections };
