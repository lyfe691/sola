/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Whether the active theme is a dark one. The `dark:` Tailwind variant only
 * matches the literal `.dark` class, so custom dark themes (cyber, forest,
 * amethyst, …) never trigger it — this resolves the theme class on <html>
 * through the THEMES config instead, the same way use-background-theme does.
 */

import { useEffect, useState } from "react";
import { THEMES } from "@/config/themes";

const detectIsDark = (): boolean => {
  const cls = document.documentElement.classList;
  for (const theme of THEMES) {
    if (theme.value !== "system" && cls.contains(theme.value)) {
      return theme.type === "dark";
    }
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

/** watches `<html class>` and returns whether the active theme is dark-typed */
export function useIsDarkScheme(): boolean {
  const [isDark, setIsDark] = useState(detectIsDark);

  useEffect(() => {
    const observer = new MutationObserver(() => setIsDark(detectIsDark()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return isDark;
}
