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
 * imperatively — the animation ticks outside React's commit cycle, and mixing
 * an imperative ticker with a React-rendered <title> would leave two writers
 * fighting over one tag.
 *
 * The mark: one braille dot orbiting a single cell's perimeter, suffixed to
 * the title — a living punctuation mark, not a spinner. Suffix + one-cell
 * frames on purpose: every frame is one glyph wide, so the title text leads
 * and never shifts. It keeps drifting in background tabs — slower, both by
 * choice and because browsers clamp hidden-tab timers to ≥1s anyway. Like
 * the backgrounds, deliberately not gated on prefers-reduced-motion (owner
 * decision).
 */

import { useEffect } from "react";
import { useLocation } from "react-router";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { resolveTitle } from "@/config/routes";

// dot bits along the cell's perimeter, clockwise from top-left
// (braille dots 1 4 5 6 8 7 3 2) — one revolution: ⠁⠈⠐⠠⢀⡀⠄⠂
const ORBIT = [0x01, 0x08, 0x10, 0x20, 0x80, 0x40, 0x04, 0x02].map((bits) =>
  String.fromCharCode(0x2800 + bits),
);

const VISIBLE_MS = 400;
const HIDDEN_MS = 2000;

// module-level so navigation and language switches never reset the orbit
let frame = 0;

export function DocumentTitle() {
  const { pathname } = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    const base = resolveTitle(pathname, translations[language]);
    let interval: number | undefined;

    const write = () => {
      document.title = `${base} ${ORBIT[frame]}`;
    };
    const tick = () => {
      frame = (frame + 1) % ORBIT.length;
      write();
    };
    const restart = () => {
      window.clearInterval(interval);
      interval = window.setInterval(
        tick,
        document.hidden ? HIDDEN_MS : VISIBLE_MS,
      );
    };

    write();
    restart();
    document.addEventListener("visibilitychange", restart);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", restart);
    };
  }, [pathname, language]);

  return null;
}
