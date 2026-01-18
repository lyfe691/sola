/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
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
import { type Theme, ALL_THEME_VALUES } from "@/config/themes";

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

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(...ALL_THEME_VALUES.filter((t) => t !== "system"));
    root.classList.add(resolveTheme(theme));
  }, [theme]);

  const handleSetTheme = useCallback(
    (newTheme: Theme, event?: React.MouseEvent | MouseEvent) => {
      const applyTheme = () => {
        localStorage.setItem(storageKey, newTheme);
        setTheme(newTheme);
      };

      const shouldAnimate =
        "startViewTransition" in document &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
        event &&
        resolveTheme(theme) !== resolveTheme(newTheme);

      if (!shouldAnimate) {
        applyTheme();
        return;
      }

      const { clientX: x, clientY: y } = event;
      const { innerWidth: w, innerHeight: h } = window;

      const maxRadius = Math.ceil(
        Math.max(
          Math.hypot(x, y),
          Math.hypot(w - x, y),
          Math.hypot(x, h - y),
          Math.hypot(w - x, h - y),
        ) * 1.05,
      );

      const root = document.documentElement;
      root.style.setProperty("--theme-transition-x", `${x}px`);
      root.style.setProperty("--theme-transition-y", `${y}px`);
      root.style.setProperty("--theme-transition-radius", `${maxRadius}px`);

      (
        document as Document & {
          startViewTransition: (cb: () => void) => { finished: Promise<void> };
        }
      )
        .startViewTransition(applyTheme)
        .finished.then(() => {
          root.style.removeProperty("--theme-transition-x");
          root.style.removeProperty("--theme-transition-y");
          root.style.removeProperty("--theme-transition-radius");
        });
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
