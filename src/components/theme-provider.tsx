/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { createContext, useContext, useEffect, useState, useCallback } from "react";
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
    const root = window.document.documentElement;
    {
      /* ---------------- add more themes --------------*/
    }
    root.classList.remove(...ALL_THEME_VALUES.filter((t) => t !== "system"));

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const handleSetTheme = useCallback((newTheme: Theme, event?: React.MouseEvent | MouseEvent) => {
    const root = document.documentElement;
    
    // Resolve what the current visual theme actually is
    const getResolvedTheme = (t: Theme) => {
      if (t === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return t;
    };
    
    const currentResolved = getResolvedTheme(theme);
    const newResolved = getResolvedTheme(newTheme);
    
    // Skip animation if the visual theme won't actually change
    const willChangeVisually = currentResolved !== newResolved;
    
    // Check if View Transitions API is supported and user hasn't disabled animations
    const isViewTransitionSupported = 'startViewTransition' in document;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!isViewTransitionSupported || prefersReducedMotion || !event || !willChangeVisually) {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
      return;
    }
    
    // Get click position for the circular reveal origin
    const x = event.clientX;
    const y = event.clientY;
    
    // Calculate the maximum radius needed to cover the entire screen
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    
    // Set CSS custom properties for the animation origin
    root.style.setProperty('--theme-transition-x', `${x}px`);
    root.style.setProperty('--theme-transition-y', `${y}px`);
    root.style.setProperty('--theme-transition-radius', `${maxRadius}px`);
    
    // Start the view transition
    const transition = (document as any).startViewTransition(() => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    });
    
    transition.finished.then(() => {
      root.style.removeProperty('--theme-transition-x');
      root.style.removeProperty('--theme-transition-y');
      root.style.removeProperty('--theme-transition-radius');
    });
  }, [storageKey, theme]);

  const value = {
    theme,
    setTheme: handleSetTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
