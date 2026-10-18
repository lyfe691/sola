/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Whether the active theme is a dark one, as a value: for a surface that
 * names the opposite scheme (the deploy chip's inverted tooltip sets
 * data-scheme to it). Styling alone doesn't need this: the `dark:` variant
 * matches the [data-scheme="dark"] the theme provider stamps for every dark
 * theme. It resolves the theme class on <html> through the THEMES config,
 * the same way use-background-theme does.
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
    const update = () => setIsDark(detectIsDark());
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    // the system theme resolves through the OS scheme, which can flip
    // without any class mutation on <html>
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", update);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
    };
  }, []);

  return isDark;
}
