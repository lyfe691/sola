/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Theme-aware Side Rays — picks its preset from the active theme and reacts to
 * theme changes via the shared useBackgroundTheme hook. This is the entry
 * registered in the background registry.
 */

import SideRaysCanvas from "./SideRaysCanvas";
import { useBackgroundTheme } from "@/components/backgrounds/use-background-theme";
import { getSideRaysPreset, SIDE_RAYS_THEME_CLASS_KEYS } from "./presets";

export default function SideRays() {
  const theme = useBackgroundTheme(SIDE_RAYS_THEME_CLASS_KEYS);
  return <SideRaysCanvas {...getSideRaysPreset(theme)} />;
}
