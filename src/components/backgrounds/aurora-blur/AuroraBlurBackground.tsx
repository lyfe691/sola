/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Theme-aware Aurora Blur — picks its preset from the active theme and reacts
 * to theme changes via the shared useBackgroundTheme hook. This is the entry
 * registered in the background registry.
 */

import AuroraBlur from "@/components/aurora-blur";
import { cn } from "@/lib/utils";
import { useBackgroundTheme } from "@/components/backgrounds/use-background-theme";
import {
  getAuroraBlurPreset,
  isAuroraBlurLightTheme,
  AURORA_BLUR_THEME_CLASS_KEYS,
} from "./presets";

export default function AuroraBlurBackground() {
  const theme = useBackgroundTheme(AURORA_BLUR_THEME_CLASS_KEYS);
  const isLight = isAuroraBlurLightTheme(theme);

  return (
    <div className={cn("size-full", isLight && "bg-background")}>
      <AuroraBlur className="size-full" {...getAuroraBlurPreset(theme)} />
    </div>
  );
}
