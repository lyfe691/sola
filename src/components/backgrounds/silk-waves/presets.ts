import { type Theme } from "@/config/themes";
import type { SilkWavesProps } from "@/components/silk-waves";
import { resolveThemePreset } from "@/components/backgrounds/preset-utils";

export type SilkWavesPreset = Required<
  Pick<
    SilkWavesProps,
    | "speed"
    | "scale"
    | "distortion"
    | "curve"
    | "contrast"
    | "colors"
    | "rotation"
    | "offsetX"
    | "offsetY"
    | "brightness"
    | "opacity"
    | "complexity"
    | "frequency"
  >
>;

const lightPalette = [
  "#E8F2FF",
  "#C5DBFF",
  "#9EC5FF",
  "#7EB8FF",
  "#6BA8F0",
  "#5B9FE8",
  "#4A90E8",
  "#3D82D9",
] as const;

const darkPalette = [
  "#0d1326",
  "#162a52",
  "#1e407e",
  "#2657aa",
  "#2e6ed5",
  "#3785ff",
  "#5092ff",
  "#69a0ff",
] as const;

const lightBase: Omit<SilkWavesPreset, "colors"> = {
  speed: 0.85,
  scale: 2,
  distortion: 0.9,
  curve: 1,
  contrast: 0.95,
  rotation: 0,
  offsetX: 0,
  offsetY: 0,
  brightness: 0.9,
  opacity: 0.82,
  complexity: 1,
  frequency: 1,
};

const darkBase: Omit<SilkWavesPreset, "colors"> = {
  speed: 1,
  scale: 2,
  distortion: 1,
  curve: 1,
  contrast: 1,
  rotation: 0,
  offsetX: 0,
  offsetY: 0,
  brightness: 1,
  opacity: 0.88,
  complexity: 1,
  frequency: 1,
};

const SILK_WAVES_PRESETS: Record<Exclude<Theme, "system">, SilkWavesPreset> = {
  light: { ...lightBase, colors: [...lightPalette] },
  dark: { ...darkBase, colors: [...darkPalette] },
  life: {
    ...lightBase,
    colors: [
      "#FBF8E6",
      "#F3E7A6",
      "#E8D877",
      "#E8C547",
      "#B8CF6A",
      "#7CC46A",
      "#5FAE5A",
      "#3E9B4F",
    ],
  },
  sakura: {
    ...lightBase,
    colors: [
      "#FFF6F8",
      "#FFE8EE",
      "#FBD3DD",
      "#F7BDCB",
      "#F4A7B9",
      "#E8849F",
      "#DD6F92",
      "#D6608A",
    ],
  },
  glacier: {
    ...lightBase,
    colors: [
      "#F4FCFD",
      "#EAF8FA",
      "#C8EEF3",
      "#A8E6EE",
      "#7FD6E2",
      "#5CC8D8",
      "#3FA9C2",
      "#2A8FB0",
    ],
  },
  dune: {
    ...lightBase,
    colors: [
      "#FFF8EE",
      "#FAEBD7",
      "#F5D6B0",
      "#F0C08A",
      "#E8A878",
      "#E89B6A",
      "#D9825B",
      "#C8643C",
    ],
  },
  cyber: {
    ...darkBase,
    colors: [
      "#0B1026",
      "#141A3A",
      "#1B2A5C",
      "#0E7C8C",
      "#19E3F0",
      "#3D5AFE",
      "#E0359F",
      "#FF2E88",
    ],
  },
  forest: {
    ...darkBase,
    colors: [
      "#08140F",
      "#12261C",
      "#1A4030",
      "#1F6B45",
      "#2F8F5B",
      "#7FD19B",
      "#C8EBD2",
      "#F2C14E",
    ],
  },
  amethyst: {
    ...darkBase,
    colors: [
      "#110A1C",
      "#221433",
      "#3B1F66",
      "#4C1D95",
      "#6D3FD6",
      "#8B5CF6",
      "#D08CF0",
      "#E9D5FF",
    ],
  },
  ember: {
    ...darkBase,
    colors: [
      "#140A06",
      "#2A160C",
      "#5A1F10",
      "#8C2A16",
      "#C2331F",
      "#FF7A2F",
      "#FFA85A",
      "#FFC56B",
    ],
  },
};

export const getSilkWavesPreset = (theme: Theme): SilkWavesPreset =>
  resolveThemePreset(SILK_WAVES_PRESETS, theme);
