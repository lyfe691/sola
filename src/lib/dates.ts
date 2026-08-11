/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Locale-aware date labels via Intl — no per-language display strings in config.
 */

import type { Language } from "@/config/languages";

/** Canonical BCP 47 tags for the site's languages. */
export const INTL_LOCALE: Record<Language, string> = {
  en: "en-US",
  de: "de-CH",
  es: "es-ES",
  ja: "ja-JP",
  ko: "ko-KR",
  zh: "zh-CN",
};

/** Calendar month. `month` is 1-indexed (January = 1). */
export type YearMonth = { year: number; month: number };

/** Project / deep-dive config shape: ISO month strings + optional end. */
export type ProjectDate = {
  /** `YYYY-MM` or `YYYY`. */
  start: string;
  /** ISO month, or `"present"` for ongoing work. Omit for a single point. */
  end?: string | "present";
};

/** Parse config ISO fragments: `YYYY-MM` or `YYYY`. */
export function parseYearMonth(iso: string): YearMonth {
  const [yearPart, monthPart] = iso.split("-");
  return {
    year: Number(yearPart),
    month: monthPart ? Number(monthPart) : 1,
  };
}

export function formatMonthYear(
  lang: string,
  point: YearMonth,
  month: "short" | "long" = "short",
): string {
  return new Intl.DateTimeFormat(lang, {
    year: "numeric",
    month,
  }).format(new Date(point.year, point.month - 1, 1));
}

/**
 * "May 2026 - Present" / "Aug 2025 - Mar 2026" / single month when `end` is omitted.
 * `presentLabel` comes from i18n (`common.present`).
 */
export function formatDateRange(
  lang: string,
  start: YearMonth,
  end: YearMonth | "present" | undefined,
  presentLabel: string,
): string {
  const startLabel = formatMonthYear(lang, start);
  if (end === undefined) return startLabel;
  if (end === "present") return `${startLabel} - ${presentLabel}`;
  return `${startLabel} - ${formatMonthYear(lang, end)}`;
}

/** Format a project config date for the active locale. */
export function formatProjectDate(
  lang: string,
  date: ProjectDate,
  presentLabel: string,
): string {
  const start = parseYearMonth(date.start);
  const end =
    date.end === undefined
      ? undefined
      : date.end === "present"
        ? "present"
        : parseYearMonth(date.end);
  return formatDateRange(lang, start, end, presentLabel);
}
