/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Theme-aware Chroma Waves — picks its preset from the active theme and reacts
 * to theme changes via the shared useBackgroundTheme hook. This is the entry
 * registered in the background registry.
 */

import ChromaWaves from "@/components/chroma-waves";
import { useBackgroundTheme } from "@/components/backgrounds/use-background-theme";
import { getChromaWavesPreset, CHROMA_WAVES_THEME_CLASS_KEYS } from "./presets";

export default function ChromaWavesBackground() {
  const theme = useBackgroundTheme(CHROMA_WAVES_THEME_CLASS_KEYS);
  return <ChromaWaves className="size-full" {...getChromaWavesPreset(theme)} />;
}
