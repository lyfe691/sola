import { type Theme } from "@/config/themes";
import type { WatercolorProps } from "@/components/watercolor";
import {
  BACKGROUND_THEME_CLASS_KEYS,
  resolveThemePreset,
} from "@/components/backgrounds/preset-utils";

export type WatercolorPreset = Required<
  Pick<
    WatercolorProps,
    | "speed"
    | "scale"
    | "octaves"
    | "persistence"
    | "lacunarity"
    | "driftSpeed"
    | "warpSpeed"
    | "color1"
    | "color2"
    | "colorGain"
    | "saturation"
    | "brightness"
    | "opacity"
    | "cursorInteraction"
    | "cursorIntensity"
  >
>;

const lightBase: Omit<WatercolorPreset, "color1" | "color2"> = {
  speed: 0.25,
  scale: 1.4,
  octaves: 5,
  persistence: 0.5,
  lacunarity: 2,
  driftSpeed: 0.15,
  warpSpeed: 0.1,
  colorGain: 0.9,
  saturation: 1.05,
  brightness: 0.05,
  opacity: 0.75,
  cursorInteraction: false,
  cursorIntensity: 0,
};

const darkBase: Omit<WatercolorPreset, "color1" | "color2"> = {
  speed: 0.3,
  scale: 1.35,
  octaves: 5,
  persistence: 0.52,
  lacunarity: 2,
  driftSpeed: 0.18,
  warpSpeed: 0.12,
  colorGain: 1,
  saturation: 1.1,
  brightness: 0,
  opacity: 0.82,
  cursorInteraction: false,
  cursorIntensity: 0,
};

const WATERCOLOR_PRESETS: Record<Exclude<Theme, "system">, WatercolorPreset> = {
  light: { ...lightBase, color1: "#9EC8FF", color2: "#D4EAFF" },
  dark: { ...darkBase, color1: "#3D5A8C", color2: "#9EC8FF" },
  cloud: { ...lightBase, color1: "#B8DBFF", color2: "#F2F7FF" },
  cyber: { ...darkBase, color1: "#6D28D9", color2: "#22D3EE" },
  forest: { ...darkBase, color1: "#047857", color2: "#A7F3D0" },
  amethyst: { ...darkBase, color1: "#5B21B6", color2: "#E9D5FF" },
  vintage: { ...lightBase, color1: "#E8A050", color2: "#FFE7C7" },
  coffee: { ...lightBase, color1: "#B8885C", color2: "#F5E6D8" },
  life: { ...lightBase, color1: "#3CB88A", color2: "#DDF9EE" },
  rose: { ...lightBase, color1: "#C41E3A", color2: "#FFE8ED" },
};

export { BACKGROUND_THEME_CLASS_KEYS as WATERCOLOR_THEME_CLASS_KEYS };

export const getWatercolorPreset = (theme: Theme): WatercolorPreset =>
  resolveThemePreset(WATERCOLOR_PRESETS, theme);