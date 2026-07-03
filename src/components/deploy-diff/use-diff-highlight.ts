/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Shiki highlighting for diff lines — same engine and github light/dark
 * themes as the markdown code block (ui/code-block), loaded on demand so
 * shiki never enters the eager bundle. Each hunk is tokenized as one block
 * (multi-line constructs inside a hunk highlight correctly); lines render
 * plain until tokens arrive, and on any failure they simply stay plain.
 *
 * Tokenized ONCE with both themes (the same trick as use-shiki.ts): each
 * token carries a light and a dark color, and the renderer picks per scheme
 * — flipping the site theme never re-runs the highlighter.
 */

import { useEffect, useState } from "react";
import type { ThemedTokenWithVariants } from "shiki";
import type { DiffHunk, DiffLine } from "./parse-patch";

/** filename extension -> shiki lang; null means leave the text plain */
const EXT_LANG: Record<string, string> = {
  ts: "typescript",
  tsx: "tsx",
  js: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  jsx: "jsx",
  css: "css",
  html: "html",
  json: "json",
  jsonc: "jsonc",
  md: "markdown",
  mdx: "mdx",
  yml: "yaml",
  yaml: "yaml",
  svg: "xml",
  xml: "xml",
  sh: "shellscript",
};

export function languageForFile(filename: string): string | null {
  const ext = filename.slice(filename.lastIndexOf(".") + 1).toLowerCase();
  return EXT_LANG[ext] ?? null;
}

/**
 * Tokens per diff line (keyed by line object identity — `hunks` must be
 * memoized by the caller). Returns null until highlighted, or when the
 * language is unknown/unsupported.
 */
export function useDiffHighlight(
  hunks: DiffHunk[],
  lang: string | null,
): Map<DiffLine, ThemedTokenWithVariants[]> | null {
  const [lineTokens, setLineTokens] = useState<Map<
    DiffLine,
    ThemedTokenWithVariants[]
  > | null>(null);

  useEffect(() => {
    if (!lang || hunks.length === 0) {
      setLineTokens(null);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const { codeToTokensWithThemes } = await import("shiki/bundle/web");
        const map = new Map<DiffLine, ThemedTokenWithVariants[]>();

        for (const hunk of hunks) {
          if (cancelled) return; // stop mid-commit, not just before the set
          const lines = hunk.lines.filter((line) => line.type !== "meta");
          if (lines.length === 0) continue;

          const tokens = await codeToTokensWithThemes(
            lines.map((line) => line.text).join("\n"),
            {
              // the bundle rejects unknown grammars — caught below
              lang: lang as Parameters<typeof codeToTokensWithThemes>[1]["lang"],
              themes: { light: "github-light", dark: "github-dark" },
            },
          );
          lines.forEach((line, i) => map.set(line, tokens[i] ?? []));
        }

        if (!cancelled) setLineTokens(map);
      } catch {
        // unsupported grammar / parse error -> keep the plain-text fallback
        if (!cancelled) setLineTokens(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hunks, lang]);

  return lineTokens;
}
