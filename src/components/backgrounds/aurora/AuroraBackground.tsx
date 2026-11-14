/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Theme-aware Aurora — picks its preset from the active theme and reacts to
 * theme changes via the shared useBackgroundTheme hook. This is the entry
 * registered in the background registry.
 */

import Aurora from "./Aurora";
import { useBackgroundTheme } from "@/components/backgrounds/use-background-theme";
import {
  getAuroraPreset,
  isAuroraLightTheme,
  AURORA_THEME_CLASS_KEYS,
} from "./presets";

const BLEND_CLASS = {
  "soft-light": "mix-blend-soft-light",
  screen: "mix-blend-screen",
} as const;

export default function AuroraBackground() {
  const theme = useBackgroundTheme(AURORA_THEME_CLASS_KEYS);
  const preset = getAuroraPreset(theme);

  return (
    <Aurora
      colorStops={preset.colorStops}
      blend={preset.blend}
      scale={preset.scale}
      height={preset.height}
      brightness={preset.intensity}
      lightMode={isAuroraLightTheme(theme)}
      direction="bottom"
      // The field is soft all over, so it renders at CSS pixels: device
      // pixels would quadruple the shader work on a retina screen for
      // nothing visible.
      dpr={1}
      className={BLEND_CLASS[preset.blendMode]}
    />
  );
}
