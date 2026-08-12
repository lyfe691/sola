/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  shouldApplyWelcomePreset,
  WELCOME_PRESET,
} from "@/config/welcome-preset";
import { type Theme, ALL_THEME_VALUES, getThemeType } from "@/config/themes";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme, event?: React.MouseEvent | MouseEvent) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

const getSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const resolveTheme = (theme: Theme) =>
  theme === "system" ? getSystemTheme() : theme;

const readInitialTheme = (storageKey: string, defaultTheme: Theme): Theme => {
  try {
    // an explicit choice (any surface: menu, palette) beats the first-visit preset
    const stored = localStorage.getItem(storageKey) as Theme | null;
    if (stored) return stored;
    if (shouldApplyWelcomePreset()) return WELCOME_PRESET.theme;
    return defaultTheme;
  } catch {
    return defaultTheme;
  }
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() =>
    readInitialTheme(storageKey, defaultTheme),
  );

  // Theme is only persisted via setTheme; seed localStorage once on the welcome
  // pass. Never overwrite an existing value — that would revert a choice made
  // from a surface that doesn't dismiss the callout (e.g. the command palette).
  useEffect(() => {
    if (!shouldApplyWelcomePreset()) return;
    try {
      if (localStorage.getItem(storageKey) === null) {
        localStorage.setItem(storageKey, WELCOME_PRESET.theme);
      }
    } catch {
      /* storage unavailable — fail silently */
    }
  }, [storageKey]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(...ALL_THEME_VALUES.filter((t) => t !== "system"));
    root.classList.add(resolveTheme(theme));
    // the dark: variant matches this attr too — custom dark themes
    // (cyber, forest, amethyst) never carry the literal `dark` class
    root.dataset.scheme = getThemeType(theme);
  }, [theme]);

  const handleSetTheme = useCallback(
    (newTheme: Theme, event?: React.MouseEvent | MouseEvent) => {
      const apply = () => {
        localStorage.setItem(storageKey, newTheme);
        setTheme(newTheme);
      };

      const animate =
        event &&
        "startViewTransition" in document &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
        resolveTheme(theme) !== resolveTheme(newTheme);

      if (!animate) {
        apply();
        return;
      }

      // percentages, not px: circle() % radii resolve against the snapshot
      // box diagonal / √2, and Chromium places px clip-paths on the snapshot
      // unscaled under fractional display scales
      const { clientX: x, clientY: y } = event;
      const { innerWidth: w, innerHeight: h } = window;
      const radius = Math.hypot(Math.max(x, w - x), Math.max(y, h - y));

      const root = document.documentElement;
      root.style.setProperty(
        "--theme-wipe-origin",
        `${(x / w) * 100}% ${(y / h) * 100}%`,
      );
      root.style.setProperty(
        "--theme-wipe-radius",
        `${(radius / (Math.hypot(w, h) / Math.SQRT2)) * 100}%`,
      );

      document.startViewTransition(apply);
    },
    [storageKey, theme],
  );

  return (
    <ThemeProviderContext.Provider
      {...props}
      value={{ theme, setTheme: handleSetTheme }}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
