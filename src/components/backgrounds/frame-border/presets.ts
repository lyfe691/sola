import { type Theme } from "@/config/themes";
import type { FrameBorderProps } from "@/components/frame-border";
import {
  BACKGROUND_THEME_CLASS_KEYS,
  resolveThemePreset,
} from "@/components/backgrounds/preset-utils";

export type FrameBorderPreset = Required<
  Pick<
    FrameBorderProps,
    | "speed"
    | "borderWidth"
    | "falloff"
    | "noiseScale"
    | "noiseStrength"
    | "noiseOctaves"
    | "color"
    | "backgroundColor"
    | "intensity"
    | "gamma"
    | "opacity"
  >
>;

const lightBase: Omit<FrameBorderPreset, "color" | "backgroundColor"> = {
  speed: 0.1,
  borderWidth: 0.18,
  falloff: 6,
  noiseScale: 3,
  noiseStrength: 0.85,
  noiseOctaves: 5,
  intensity: 0.9,
  gamma: 2,
  opacity: 0.88,
};

const darkBase: Omit<FrameBorderPreset, "color" | "backgroundColor"> = {
  speed: 0.12,
  borderWidth: 0.2,
  falloff: 5.5,
  noiseScale: 3.2,
  noiseStrength: 1,
  noiseOctaves: 5,
  intensity: 1,
  gamma: 2,
  opacity: 0.92,
};

const FRAME_BORDER_PRESETS: Record<Exclude<Theme, "system">, FrameBorderPreset> =
  {
    light: { ...lightBase, color: "#6BA8F0", backgroundColor: "#FFFFFF" },
    dark: { ...darkBase, color: "#9EC8FF", backgroundColor: "#252525" },
    cloud: { ...lightBase, color: "#88BFFF", backgroundColor: "#FAFCFF" },
    cyber: { ...darkBase, color: "#E879F9", backgroundColor: "#0F0A1A" },
    forest: { ...darkBase, color: "#34D399", backgroundColor: "#0C1812" },
    amethyst: { ...darkBase, color: "#C4B5FD", backgroundColor: "#120C1A" },
    vintage: { ...lightBase, color: "#E8A050", backgroundColor: "#FFF9F0" },
    coffee: { ...lightBase, color: "#C8A078", backgroundColor: "#FFFAF4" },
    life: { ...lightBase, color: "#3CB88A", backgroundColor: "#F4FDF9" },
    rose: { ...lightBase, color: "#E84868", backgroundColor: "#FFF6F8" },
  };

export { BACKGROUND_THEME_CLASS_KEYS as FRAME_BORDER_THEME_CLASS_KEYS };

export const getFrameBorderPreset = (theme: Theme): FrameBorderPreset =>
  resolveThemePreset(FRAME_BORDER_PRESETS, theme);