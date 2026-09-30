/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The language is part of the URL: English at the site's own paths
 * (/about), every other language under its code (/de/about, /de for home),
 * so each language version has an address a search engine can index. These
 * turn one form into the other. Runs outside the app too (the build reads
 * it): no `@/` imports.
 */

import { LANGUAGES, type Language } from "../config/languages.ts";

/** every language that lives under a prefix: all but English */
export const PREFIXED = LANGUAGES.map(({ code }) => code).filter(
  (code): code is Exclude<Language, "en"> => code !== "en",
);

const PREFIX = new RegExp(`^/(${PREFIXED.join("|")})(?=/|$)`);

/** "/de/about" → { language: "de", path: "/about" }; "/about" → English. */
export function splitLocale(pathname: string): {
  language: Language;
  path: string;
} {
  const match = PREFIX.exec(pathname);
  if (!match) return { language: "en", path: pathname || "/" };
  return {
    language: match[1] as Language,
    path: pathname.slice(match[0].length) || "/",
  };
}

/** A site path in a language: ("/about", "de") → "/de/about", home → "/de". */
export function localize(path: string, language: Language): string {
  const plain = splitLocale(path).path;
  if (language === "en") return plain;
  return plain === "/" ? `/${language}` : `/${language}${plain}`;
}

/**
 * A router `to` in a language. Only site paths move: a relative path, a
 * bare hash or query, and anything not starting with "/" stay as they are.
 */
export function localizeTo<
  T extends string | { pathname?: string; search?: string; hash?: string },
>(to: T, language: Language): T {
  if (typeof to === "string") {
    if (!to.startsWith("/") || to.startsWith("//")) return to;
    const [, path, rest] = /^([^?#]*)(.*)$/.exec(to)!;
    return `${localize(path, language)}${rest}` as T;
  }
  if (!to.pathname?.startsWith("/")) return to;
  return { ...(to as object), pathname: localize(to.pathname, language) } as T;
}
