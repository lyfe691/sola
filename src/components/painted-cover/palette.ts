/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The tones a cover is painted with, derived from a preset's two colors in
 * OKLab so "darker", "more vivid" and "lighter" mean what the eye means.
 * Plain hex out, so the same palette feeds SVG and CSS alike.
 */

import type { PaintedPreset } from "./presets";

type RGB = [number, number, number];
type Lab = [number, number, number];

const hexToRgb = (hex: string): RGB => [
  parseInt(hex.slice(1, 3), 16) / 255,
  parseInt(hex.slice(3, 5), 16) / 255,
  parseInt(hex.slice(5, 7), 16) / 255,
];

const rgbToHex = (rgb: RGB) =>
  "#" +
  rgb
    .map((v) =>
      Math.round(Math.min(1, Math.max(0, v)) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("");

const toLinear = (c: number) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const toGamma = (c: number) =>
  c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055;

// Björn Ottosson's OKLab, straight from sRGB
function rgbToOklab([r, g, b]: RGB): Lab {
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);
  const l = Math.cbrt(
    0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb,
  );
  const m = Math.cbrt(
    0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb,
  );
  const s = Math.cbrt(
    0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb,
  );
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function oklabToRgb([L, a, b]: Lab): RGB {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    toGamma(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    toGamma(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    toGamma(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

/** Same hue at an absolute lightness, chroma scaled then clamped. */
export function tone(
  hex: string,
  lightness: number,
  chromaScale: number,
  chromaMin: number,
  chromaMax: number,
): string {
  const [, a, b] = rgbToOklab(hexToRgb(hex));
  const chroma = Math.min(
    chromaMax,
    Math.max(chromaMin, Math.hypot(a, b) * chromaScale),
  );
  const hue = Math.atan2(b, a);
  return rgbToHex(
    oklabToRgb([lightness, chroma * Math.cos(hue), chroma * Math.sin(hue)]),
  );
}

/** `amount` of `into` mixed into `hex`, perceptually. */
export function mix(hex: string, into: string, amount: number): string {
  const A = rgbToOklab(hexToRgb(hex));
  const B = rgbToOklab(hexToRgb(into));
  return rgbToHex(
    oklabToRgb([
      A[0] + (B[0] - A[0]) * amount,
      A[1] + (B[1] - A[1]) * amount,
      A[2] + (B[2] - A[2]) * amount,
    ]),
  );
}

export interface CoverPalette {
  /** the deep wash most of the way to black — the field's far side */
  dark: string;
  /** deeper still — the fold beside the band, the corners */
  dusk: string;
  /** the deep hue at a luminous lightness with its chroma pushed; floored
   *  so the near-gray presets still carry color, capped inside the gamut */
  vivid: string;
  /** the preset's pale wash, as painted: the band of light */
  pale: string;
  /** the pale wash toward white — the leak */
  light: string;
}

export function coverPalette({ colors }: Pick<PaintedPreset, "colors">) {
  const [deep, pale] = colors;
  return {
    dark: mix(deep, "#000000", 0.55),
    dusk: mix(deep, "#000000", 0.72),
    vivid: tone(deep, 0.6, 1.7, 0.1, 0.25),
    pale,
    light: mix(pale, "#ffffff", 0.3),
  } satisfies CoverPalette;
}
