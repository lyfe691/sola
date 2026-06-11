/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  NONE_BACKGROUND,
  resolveBackground,
} from "@/components/backgrounds/registry";

type BackgroundProviderProps = {
  children: React.ReactNode;
  storageKey?: string;
  defaultBackground?: string;
};

type BackgroundProviderState = {
  /** active background id, or "none" */
  active: string;
  setActive: (value: string) => void;
};

/** legacy key from the aurora-only era; migrated on first load */
const LEGACY_AURORA_KEY = "aurora-enabled";

const initialState: BackgroundProviderState = {
  active: NONE_BACKGROUND,
  setActive: () => undefined,
};

const BackgroundContext = createContext<BackgroundProviderState>(initialState);

const readInitial = (storageKey: string, fallback: string): string => {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored !== null) return resolveBackground(stored);
    // migrate the old aurora boolean: enabled -> aurora
    if (localStorage.getItem(LEGACY_AURORA_KEY) === "true") return "aurora";
    return resolveBackground(fallback);
  } catch {
    return resolveBackground(fallback);
  }
};

export function BackgroundProvider({
  children,
  storageKey = "background",
  defaultBackground = NONE_BACKGROUND,
}: BackgroundProviderProps) {
  const [active, setActive] = useState<string>(() =>
    readInitial(storageKey, defaultBackground),
  );

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, active);
      // retire the legacy key once we own the state
      localStorage.removeItem(LEGACY_AURORA_KEY);
    } catch {
      // ignore persistence errors
    }
  }, [active, storageKey]);

  const value = useMemo<BackgroundProviderState>(
    () => ({
      active,
      setActive: (next: string) => setActive(resolveBackground(next)),
    }),
    [active],
  );

  return (
    <BackgroundContext.Provider value={value}>
      {children}
    </BackgroundContext.Provider>
  );
}

export const useBackground = () => {
  const ctx = useContext(BackgroundContext);
  if (ctx === undefined)
    throw new Error("useBackground must be used within a BackgroundProvider");
  return ctx;
};
