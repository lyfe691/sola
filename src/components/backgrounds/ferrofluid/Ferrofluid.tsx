/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Theme-aware Ferrofluid — picks its preset from the active theme and reacts to
 * theme changes (mirrors the Aurora background's behavior). This is the entry
 * registered in the background registry.
 */

import { useEffect, useState } from "react";
import { type Theme } from "@/config/themes";
import FerrofluidCanvas from "./FerrofluidCanvas";
import {
  getFerrofluidPreset,
  FERROFLUID_THEME_CLASS_KEYS,
} from "./presets";

const detectThemeFromHtml = (): Exclude<Theme, "system"> => {
  const cls = document.documentElement.classList;
  for (const key of FERROFLUID_THEME_CLASS_KEYS)
    if (cls.contains(key)) return key;
  if (cls.contains("dark")) return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export default function Ferrofluid() {
  const [theme, setTheme] = useState<Exclude<Theme, "system">>(() =>
    detectThemeFromHtml(),
  );

  useEffect(() => {
    const observer = new MutationObserver(() =>
      setTheme(detectThemeFromHtml()),
    );
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return <FerrofluidCanvas {...getFerrofluidPreset(theme)} />;
}
