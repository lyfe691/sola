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
import { flushSync } from "react-dom";
import {
  shouldApplyWelcomePreset,
  WELCOME_PRESET,
} from "@/config/welcome-preset";
import {
  type Theme,
  ALL_THEME_VALUES,
  getThemeType,
  toTheme,
} from "@/config/themes";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// default undefined so the useTheme guard actually catches out-of-provider
// use (same pattern as LanguageProvider)
const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined,
);

/** resolved light/dark, read by the pre-paint stamp script in index.html */
const SCHEME_STORAGE_KEY = "vite-ui-scheme";

const getSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const resolveTheme = (theme: Theme) =>
  theme === "system" ? getSystemTheme() : theme;

/**
 * While a whole-page view transition runs, the browser hit-tests every press
 * to <html>, so a press meant for the theme menu read as an outside click
 * and closed it. A press during the dissolve ends it and is handed, with its
 * click, to what is under the pointer.
 */
const landPressesDuring = (transition: ViewTransition) => {
  const root = document.documentElement;
  const onPointerDown = (press: PointerEvent) => {
    if (press.target !== root) return;
    press.stopImmediatePropagation();
    press.preventDefault();
    transition.skipTransition();
    const aimed = document.elementFromPoint(press.clientX, press.clientY);
    if (!aimed || aimed === root) return;
    aimed.dispatchEvent(new PointerEvent("pointerdown", press));
    // the click still goes to <html>, the common ancestor of the press and
    // its release
    const forwardClick = (click: MouseEvent) => {
      if (click.target !== root) return;
      click.stopImmediatePropagation();
      aimed.dispatchEvent(new MouseEvent("click", click));
    };
    window.addEventListener("click", forwardClick, {
      capture: true,
      once: true,
    });
  };
  window.addEventListener("pointerdown", onPointerDown, { capture: true });
  const done = () =>
    window.removeEventListener("pointerdown", onPointerDown, { capture: true });
  transition.finished.then(done, done);
};

const readInitialTheme = (storageKey: string, defaultTheme: Theme): Theme => {
  try {
    // an explicit choice (any surface: menu, palette) beats the first-visit
    // preset; a retired id is stored as its heir, an unknown one falls through
    const stored = localStorage.getItem(storageKey);
    const theme = stored && toTheme(stored);
    if (theme) {
      if (theme !== stored) localStorage.setItem(storageKey, theme);
      return theme;
    }
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
    const apply = () => {
      root.classList.remove(...ALL_THEME_VALUES.filter((t) => t !== "system"));
      root.classList.add(resolveTheme(theme));
      // the dark: variant matches this attr too — custom dark themes
      // (cyber, forest, …) never carry the literal `dark` class
      root.dataset.scheme = getThemeType(theme);
      // persisted for the pre-paint stamp in index.html — custom themes
      // (cyber, forest, …) carry a type the inline script can't derive
      try {
        localStorage.setItem(SCHEME_STORAGE_KEY, root.dataset.scheme);
      } catch {
        /* storage unavailable — fail silently */
      }
    };
    apply();
    if (theme !== "system") return;
    // "system" tracks the OS live — resolveTheme/getThemeType re-read the
    // media query, so re-stamping on change is the whole update
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, [theme]);

  const handleSetTheme = useCallback(
    (newTheme: Theme) => {
      const apply = () => {
        try {
          localStorage.setItem(storageKey, newTheme);
        } catch {
          /* storage unavailable — the choice still applies this session */
        }
        setTheme(newTheme);
      };

      const animate =
        "startViewTransition" in document &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
        resolveTheme(theme) !== resolveTheme(newTheme);

      if (!animate) {
        apply();
        return;
      }

      // one synchronous commit, so the new theme's classes are on <html>
      // before the browser photographs it
      landPressesDuring(document.startViewTransition(() => flushSync(apply)));
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
