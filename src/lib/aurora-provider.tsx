/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuroraProviderProps = {
  children: React.ReactNode;
  storageKey?: string;
  defaultEnabled?: boolean;
};

type AuroraProviderState = {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  toggle: () => void;
};

const initialState: AuroraProviderState = {
  enabled: true,
  setEnabled: () => undefined,
  toggle: () => undefined,
};

const AuroraContext = createContext<AuroraProviderState>(initialState);

export function AuroraProvider({
  children,
  storageKey = "aurora-enabled",
  defaultEnabled = true,
}: AuroraProviderProps) {
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

  const value = useMemo<AuroraProviderState>(
    () => ({ enabled, setEnabled, toggle: () => setEnabled((v) => !v) }),
    [enabled]
  );

  return <AuroraContext.Provider value={value}>{children}</AuroraContext.Provider>;
}

export const useAurora = () => {
  const ctx = useContext(AuroraContext);
  if (ctx === undefined) throw new Error("useAurora must be used within an AuroraProvider");
  return ctx;
};


