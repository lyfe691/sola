import { type Theme } from "@/config/themes";
import type { CloudAtlasProps } from "./CloudAtlas";
import { resolveThemePreset } from "@/components/backgrounds/preset-utils";

export type CloudAtlasPreset = Required<
  Pick<
    CloudAtlasProps,
    | "colors"
    | "backgroundColor"
    | "anchor"
    | "height"
    | "coverage"
    | "density"
    | "scale"
    | "towers"
    | "opacity"
    | "wind"
    | "billow"
    | "speed"
    | "interactive"
    | "cursorStrength"
    | "cursorRadius"
  >
>;

// transparent sky: the theme's own page is the sky, the clouds carry its hue
const base: Omit<CloudAtlasPreset, "colors" | "opacity"> = {
  backgroundColor: "transparent",
  anchor: "bottom",
  height: 0.8,
  coverage: 0.45,
  density: 0.55,
  scale: 1,
  towers: 1,
  wind: 0.3,
  billow: 1,
  speed: 0.6,
  interactive: true,
  cursorStrength: 1,
  cursorRadius: 0.16,
};

const light = { ...base, opacity: 0.85 };
const dark = { ...base, opacity: 0.75 };

const CLOUD_ATLAS_PRESETS: Record<
  Exclude<Theme, "system">,
  CloudAtlasPreset
> = {
  light: { ...light, colors: ["#C5DBFF", "#7EB8FF"] },
  dark: { ...dark, colors: ["#4A6FA8", "#1E2F55"] },
  life: { ...light, colors: ["#D8E8A6", "#8CC46A"] },
  sakura: { ...light, colors: ["#FBD3DD", "#E8849F"] },
  glacier: { ...light, colors: ["#C8EEF3", "#5CC8D8"] },
  dune: { ...light, colors: ["#F5D6B0", "#E89B6A"] },
  cyber: { ...dark, colors: ["#C23A9E", "#2B3FB8"] },
  forest: { ...dark, colors: ["#3E9C6A", "#173F2D"] },
  amethyst: { ...dark, colors: ["#8B5CF6", "#3B1F66"] },
  ember: { ...dark, colors: ["#D9622B", "#5A1F10"] },
};

export const getCloudAtlasPreset = (theme: Theme): CloudAtlasPreset =>
  resolveThemePreset(CLOUD_ATLAS_PRESETS, theme);
