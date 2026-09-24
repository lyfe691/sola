import { type Theme } from "@/config/themes";
import type { LiquidEtherProps } from "@/components/LiquidEther";
import { resolveThemePreset } from "@/components/backgrounds/preset-utils";

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
  life: {
    ...lightBase,
    colors: ["#3E9B4F", "#E8C547", "#F3E7A6"],
  },
  sakura: {
    ...lightBase,
    colors: ["#D6608A", "#F4A7B9", "#FFF4F6"],
  },
  glacier: {
    ...lightBase,
    colors: ["#2A8FB0", "#5CC8D8", "#EAF8FA"],
  },
  dune: {
    ...lightBase,
    colors: ["#C8643C", "#F0C08A", "#FAEBD7"],
  },
  cyber: {
    ...darkBase,
    colors: ["#19E3F0", "#FF2E88", "#3D5AFE"],
  },
  forest: {
    ...darkBase,
    colors: ["#2F8F5B", "#7FD19B", "#F2C14E"],
  },
  amethyst: {
    ...darkBase,
    colors: ["#8B5CF6", "#D08CF0", "#E9D5FF"],
  },
  ember: {
    ...darkBase,
    colors: ["#C2331F", "#FF7A2F", "#FFC56B"],
  },
};

export const getLiquidEtherPreset = (theme: Theme): LiquidEtherPreset =>
  resolveThemePreset(LIQUID_ETHER_PRESETS, theme);
