/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The document title, always mounted. Page-owned <title> tags die with their
 * page mid-transition under AnimatePresence (the tab briefly showed the raw
 * URL between navigations), so the one owner lives here, outside the animated
 * tree, resolved from the route manifest. It writes document.title
 * imperatively — the decode ticks outside React's commit cycle, and mixing an
 * imperative ticker with a React-rendered <title> would leave two writers
 * fighting over one tag.
 *
 * The mark: on navigation the title arrives written in braille — each
 * letter's real six-dot cell, a faithful transliteration, not glyph noise —
 * and resolves left to right into plain text. One sub-second pass, then the
 * title rests static: a perpetual animation in a tab strip reads as a page
 * that never finished loading. Spaces and punctuation read through the
 * braille so the title's shape holds; every cell is one glyph wide, so
 * nothing shifts as it resolves. A hidden tab skips straight to the finished
 * title. Deliberately not gated on prefers-reduced-motion (owner decision):
 * a one-shot discrete text swap, not sustained movement.
 */

import { useEffect } from "react";
import { useLocation } from "react-router";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { resolveTitle } from "@/config/routes";

// six-dot cells for a–z (standard braille alphabet, U+2800 block)
const LETTERS = "⠁⠃⠉⠙⠑⠋⠛⠓⠊⠚⠅⠇⠍⠝⠕⠏⠟⠗⠎⠞⠥⠧⠺⠭⠽⠵";
// digits reuse the a–j cells (number sign dropped — one glyph per slot)
const DIGITS = "⠚⠁⠃⠉⠙⠑⠋⠛⠓⠊";
// no six-dot cell (CJK, accents) — a full cell holds the slot until resolved
const FULL_CELL = "⠿";

const encode = (ch: string): string => {
  const lower = ch.toLowerCase();
  if (lower >= "a" && lower <= "z") return LETTERS[lower.charCodeAt(0) - 97];
  if (ch >= "0" && ch <= "9") return DIGITS[Number(ch)];
  if (/[\s\p{P}]/u.test(ch)) return ch;
  return FULL_CELL;
};

const TICK_MS = 45; // cadence of the resolving front
const SWEEP_MS = 700; // ceiling for the whole pass — long titles resolve faster

export function DocumentTitle() {
  const { pathname } = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    const title = resolveTitle(pathname, translations[language]);

    if (document.hidden) {
      document.title = title;
      return;
    }

    const chars = [...title];
    const cells = chars.map(encode);
    const perTick = Math.max(1, Math.ceil((chars.length * TICK_MS) / SWEEP_MS));
    let front = 0;

    const write = () => {
      document.title = chars
        .map((ch, i) => (i < front ? ch : cells[i]))
        .join("");
    };
    const settle = () => {
      window.clearInterval(interval);
      document.title = title;
    };

    write();
    const interval = window.setInterval(() => {
      front = Math.min(front + perTick, chars.length);
      write();
      if (front === chars.length) window.clearInterval(interval);
    }, TICK_MS);

    // mid-decode tab switch: a background tab shows the finished title
    const onVisibility = () => {
      if (document.hidden) settle();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [pathname, language]);

  return null;
}
