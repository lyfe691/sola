import { type Theme } from "@/config/themes";
import type { DotGridProps } from "@/components/DotGrid";
import {
  BACKGROUND_THEME_CLASS_KEYS,
  resolveThemePreset,
} from "@/components/backgrounds/preset-utils";

export type DotGridPreset = Required<
  Pick<
    DotGridProps,
    | "dotSize"
    | "gap"
    | "baseColor"
    | "activeColor"
    | "proximity"
    | "speedTrigger"
    | "shockRadius"
    | "shockStrength"
    | "maxSpeed"
    | "resistance"
    | "returnDuration"
  >
>;

const lightBase: Omit<DotGridPreset, "baseColor" | "activeColor"> = {
  dotSize: 10,
  gap: 28,
  proximity: 130,
  speedTrigger: 90,
  shockRadius: 220,
  shockStrength: 4,
  maxSpeed: 5000,
  resistance: 750,
  returnDuration: 1.5,
};

const darkBase: Omit<DotGridPreset, "baseColor" | "activeColor"> = {
  dotSize: 10,
  gap: 28,
  proximity: 140,
  speedTrigger: 85,
  shockRadius: 240,
  shockStrength: 5,
  maxSpeed: 5000,
  resistance: 700,
  returnDuration: 1.5,
};

const DOT_GRID_PRESETS: Record<Exclude<Theme, "system">, DotGridPreset> = {
  light: { ...lightBase, baseColor: "#D4EAFF", activeColor: "#6BA8F0" },
  dark: { ...darkBase, baseColor: "#3A3A3A", activeColor: "#9EC8FF" },
  cloud: { ...lightBase, baseColor: "#E6F1FF", activeColor: "#88BFFF" },
  cyber: { ...darkBase, baseColor: "#2A1F3D", activeColor: "#E879F9" },
  forest: { ...darkBase, baseColor: "#1A2E24", activeColor: "#34D399" },
  amethyst: { ...darkBase, baseColor: "#2A1F3D", activeColor: "#C4B5FD" },
  vintage: { ...lightBase, baseColor: "#FFE7C7", activeColor: "#E8A050" },
  coffee: { ...lightBase, baseColor: "#F5E6D8", activeColor: "#C8A078" },
  life: { ...lightBase, baseColor: "#DDF9EE", activeColor: "#3CB88A" },
  rose: { ...lightBase, baseColor: "#FFE8ED", activeColor: "#E84868" },
};

export { BACKGROUND_THEME_CLASS_KEYS as DOT_GRID_THEME_CLASS_KEYS };

export const getDotGridPreset = (theme: Theme): DotGridPreset =>
  resolveThemePreset(DOT_GRID_PRESETS, theme);