/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Code view is a full-page mode: the routed page is swapped for the deployed
 * commit's diff (see CodeView.tsx) and the nav reduces to the single toggle.
 * Deliberately not persisted — it's a mode you flip into, not a setting.
 */

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type CodeViewState = {
  active: boolean;
  setActive: (value: boolean) => void;
  toggle: () => void;
};

const CodeViewContext = createContext<CodeViewState>({
  active: false,
  setActive: () => undefined,
  toggle: () => undefined,
});

export function CodeViewProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(false);

  // Escape exits the mode — unless something above us (command palette,
  // an open menu) already claimed the keypress.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !e.defaultPrevented) setActive(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const value = useMemo(
    () => ({
      active,
      setActive,
      toggle: () => setActive((prev) => !prev),
    }),
    [active],
  );

  return (
    <CodeViewContext.Provider value={value}>
      {children}
    </CodeViewContext.Provider>
  );
}

export const useCodeView = () => useContext(CodeViewContext);
