import { type Theme } from "@/config/themes";
import type { WatercolorProps } from "@/components/watercolor";
import { resolveThemePreset } from "@/components/backgrounds/preset-utils";

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
  life: { ...lightBase, color1: "#7CC46A", color2: "#F3E7A6" },
  sakura: { ...lightBase, color1: "#F4A7B9", color2: "#FFF4F6" },
  glacier: { ...lightBase, color1: "#5CC8D8", color2: "#EAF8FA" },
  dune: { ...lightBase, color1: "#E89B6A", color2: "#FAEBD7" },
  cyber: { ...darkBase, color1: "#0E7C8C", color2: "#FF2E88" },
  forest: { ...darkBase, color1: "#1F6B45", color2: "#F2C14E" },
  amethyst: { ...darkBase, color1: "#6D3FD6", color2: "#E9D5FF" },
  ember: { ...darkBase, color1: "#C2331F", color2: "#FFC56B" },
};

export const getWatercolorPreset = (theme: Theme): WatercolorPreset =>
  resolveThemePreset(WATERCOLOR_PRESETS, theme);
