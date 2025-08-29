/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface GalaxyProviderProps {
  children: React.ReactNode;
  storageKey?: string;
  defaultEnabled?: boolean;
}

interface GalaxyProviderState {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  toggle: () => void;
}

const initialState: GalaxyProviderState = {
  enabled: false,
  setEnabled: () => undefined,
  toggle: () => undefined,
};

const GalaxyContext = createContext<GalaxyProviderState>(initialState);

export function GalaxyProvider({
  children,
  storageKey = "galaxy-enabled",
  defaultEnabled = false,
}: GalaxyProviderProps) {
  const [enabled, setEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored === null ? defaultEnabled : stored === "true";
    } catch {
      return defaultEnabled;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, String(enabled));
    } catch {
      // ignore persistence errors
    }
  }, [enabled, storageKey]);

  const value = useMemo<GalaxyProviderState>(() => {
    const toggle = () => setEnabled((v) => !v);
    return { enabled, setEnabled, toggle };
  }, [enabled]);

  return <GalaxyContext.Provider value={value}>{children}</GalaxyContext.Provider>;
}

export const useGalaxy = () => {
  const ctx = useContext(GalaxyContext);
  if (ctx === undefined) throw new Error("useGalaxy must be used within a GalaxyProvider");
  return ctx;
};

