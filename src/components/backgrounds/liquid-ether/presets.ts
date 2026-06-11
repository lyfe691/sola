import { type Theme } from "@/config/themes";
import type { LiquidEtherProps } from "@/components/LiquidEther";
import {
  BACKGROUND_THEME_CLASS_KEYS,
  resolveThemePreset,
} from "@/components/backgrounds/preset-utils";

export type LiquidEtherPreset = Required<
  Pick<
    LiquidEtherProps,
    | "mouseForce"
    | "cursorSize"
    | "isViscous"
    | "viscous"
    | "iterationsViscous"
    | "iterationsPoisson"
    | "dt"
    | "BFECC"
    | "resolution"
    | "isBounce"
    | "colors"
    | "autoDemo"
    | "autoSpeed"
    | "autoIntensity"
    | "takeoverDuration"
    | "autoResumeDelay"
    | "autoRampDuration"
  >
>;

const lightBase: Omit<LiquidEtherPreset, "colors"> = {
  mouseForce: 20,
  cursorSize: 100,
  isViscous: false,
  viscous: 30,
  iterationsViscous: 32,
  iterationsPoisson: 32,
  dt: 0.014,
  BFECC: true,
  resolution: 0.5,
  isBounce: false,
  autoDemo: true,
  autoSpeed: 0.45,
  autoIntensity: 1.8,
  takeoverDuration: 0.25,
  autoResumeDelay: 1000,
  autoRampDuration: 0.6,
};

const darkBase: Omit<LiquidEtherPreset, "colors"> = {
  mouseForce: 20,
  cursorSize: 100,
  isViscous: false,
  viscous: 30,
  iterationsViscous: 32,
  iterationsPoisson: 32,
  dt: 0.014,
  BFECC: true,
  resolution: 0.5,
  isBounce: false,
  autoDemo: true,
  autoSpeed: 0.5,
  autoIntensity: 2.2,
  takeoverDuration: 0.25,
  autoResumeDelay: 1000,
  autoRampDuration: 0.6,
};

const LIQUID_ETHER_PRESETS: Record<
  Exclude<Theme, "system">,
  LiquidEtherPreset
> = {
  light: {
    ...lightBase,
    colors: ["#6BA8F0", "#9EC8FF", "#D4EAFF"],
  },
  dark: {
    ...darkBase,
    colors: ["#5227FF", "#FF9FFC", "#B497CF"],
  },
  cloud: {
    ...lightBase,
    colors: ["#88BFFF", "#B8DBFF", "#F2F7FF"],
  },
  cyber: {
    ...darkBase,
    colors: ["#E879F9", "#22D3EE", "#A855F7"],
  },
  forest: {
    ...darkBase,
    colors: ["#059669", "#34D399", "#10B981"],
  },
  amethyst: {
    ...darkBase,
    colors: ["#8B5CF6", "#C4B5FD", "#E9D5FF"],
  },
  vintage: {
    ...lightBase,
    colors: ["#E8A050", "#FFD9A8", "#FFE7C7"],
  },
  coffee: {
    ...lightBase,
    colors: ["#B8885C", "#D4B896", "#F5E6D8"],
  },
  life: {
    ...lightBase,
    colors: ["#3CB88A", "#5FD4A8", "#DDF9EE"],
  },
  rose: {
    ...lightBase,
    colors: ["#E84868", "#FF9DB0", "#FFE8ED"],
  },
};

export { BACKGROUND_THEME_CLASS_KEYS as LIQUID_ETHER_THEME_CLASS_KEYS };

export const getLiquidEtherPreset = (theme: Theme): LiquidEtherPreset =>
  resolveThemePreset(LIQUID_ETHER_PRESETS, theme);