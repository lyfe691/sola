/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useEffect, useState } from "react";
// `shiki/bundle/web` ships only web languages (no cpp/wasm/etc.), dropping ~2 MB
// of unused grammar chunks. Unsupported languages fall back to plain text.
import { codeToHtml } from "shiki/bundle/web";
import type { BundledLanguage, SpecialLanguage } from "shiki";

export type CodeBlockLanguage = BundledLanguage | SpecialLanguage;

/**
 * Highlights `code` once with a dual github light/dark theme. Colors are emitted
 * as CSS variables (`defaultColor: false`), so switching the site theme never
 * re-runs the highlighter — the stylesheet picks the light or dark token set via
 * `[data-code-theme]`. Returns "" until the first highlight resolves (and on
 * error), letting the caller render a plain-text fallback in the meantime.
 */
export const useShikiHighlight = (
  code: string,
  lang: CodeBlockLanguage,
): string => {
  const [html, setHtml] = useState("");

  useEffect(() => {
    let cancelled = false;

    codeToHtml(code, {
      lang,
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
    })
      .then((out) => {
        if (!cancelled) setHtml(out);
      })
      .catch(() => {
        // unsupported grammar / parse error → keep the plain-text fallback
        if (!cancelled) setHtml("");
      });

    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  return html;
};
