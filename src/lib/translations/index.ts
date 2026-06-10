/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

// might work on the translations to be more accurate later

import type { Language } from "@/config/languages";
import { en, type Translation } from "./en";
import { de } from "./de";
import { es } from "./es";
import { ja } from "./ja";
import { zh } from "./zh";

export const translations: Record<Language, Translation> = {
  en,
  de,
  es,
  ja,
  zh,
};

export type { Language, Translation };
export type TranslationAny = Translation;
