/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { createContext, useContext, useMemo } from "react";
import type { PropsWithChildren } from "react";
import type { GradualBlurProps } from "@/components/GradualBlur";

export type GradualBlurContextValue = {
  defaults: Partial<GradualBlurProps>;
};

const GradualBlurContext = createContext<GradualBlurContextValue>({
  defaults: {},
});

export type GradualBlurProviderProps = PropsWithChildren<{
  defaults?: Partial<GradualBlurProps>;
}>;

export const GradualBlurProvider = ({
  children,
  defaults,
}: GradualBlurProviderProps) => {
  const resolvedDefaults = useMemo(
    () => defaults ?? {},
    [defaults]
  );

  const value = useMemo<GradualBlurContextValue>(
    () => ({ defaults: resolvedDefaults }),
    [resolvedDefaults]
  );

  return (
    <GradualBlurContext.Provider value={value}>
      {children}
    </GradualBlurContext.Provider>
  );
};

export const useGradualBlurDefaults = () => useContext(GradualBlurContext);
