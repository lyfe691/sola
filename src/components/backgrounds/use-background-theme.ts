/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useEffect, useState } from "react";
import { type Theme } from "@/config/themes";

const detectThemeFromHtml = (
  classKeys: readonly Exclude<Theme, "system">[],
): Exclude<Theme, "system"> => {
  const cls = document.documentElement.classList;
  for (const key of classKeys) if (cls.contains(key)) return key;
  if (cls.contains("dark")) return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

/** watches `<html class>` and returns the active theme for background presets */
export function useBackgroundTheme(
  classKeys: readonly Exclude<Theme, "system">[],
): Exclude<Theme, "system"> {
  const [theme, setTheme] = useState<Exclude<Theme, "system">>(() =>
    detectThemeFromHtml(classKeys),
  );

  useEffect(() => {
    const observer = new MutationObserver(() =>
      setTheme(detectThemeFromHtml(classKeys)),
    );
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, [classKeys]);

  return theme;
}