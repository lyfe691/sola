/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * React Bits Pro's Stipple Gradient, ported: two colours folded through a
 * flowing field and drawn in a few stippled levels, in WebGL2. The shader,
 * the palette maths and every number are the source's. Changed from the
 * source: the root takes its size from its parent (no minimum height) and
 * its ground colour through a custom property, and the canvas is styled by
 * classes. It imports three, so load it through a dynamic import.
 */

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

export interface StippleGradientHandle {
  replay: () => void;
  tide: (x?: number, y?: number) => void;
}

export interface StippleGradientProps {
  colors?: [string, string];
  backgroundColor?: string;
  drift?: number;
  speed?: number;
  warp?: number;
  scale?: number;
  layers?: number;
  spread?: number;
  angle?: number;
  levels?: number;
  pixelSize?: number;
  seed?: number;
  interactive?: boolean;
  stir?: number;
  tide?: number;
  intro?: boolean;
  paused?: boolean;
  quality?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

type Lab = [number, number, number];

interface Polar {
  L: number;
  C: number;
  h: number;
}

interface Tide {
  x: number;
  y: number;
  age: number;
  amount: number;
  reach: number;
}

const DEFAULT_COLORS: [string, string] = ["#5227FF", "#FF6B4A"];
const MAX_LAYERS = 16;
const MAX_TIDES = 6;
const NOISE_SIZE = 64;
const FLOW_RATE = 0.15;
const INTRO_SECONDS = 2.8;
const TIDE_SPEED = 0.6;
const TIDE_WIDTH = 0.42;

const VERTEX = `
void main() {
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const FRAGMENT = `
uniform vec2 uGrid;
uniform float uFlow;
uniform float uClock;
uniform vec3 uDawn[4];
uniform vec3 uDusk[4];
uniform vec3 uGround;
uniform float uReveal;
uniform float uLevels;
uniform float uWarp;
uniform float uFrequency;
uniform int uLayers;
uniform float uSpread;
uniform vec2 uTurn;
uniform float uSeed;
uniform vec4 uTides[${MAX_TIDES}];
uniform sampler2D uNoise;
uniform sampler2D uFold;
uniform float uFoldScale;
uniform vec2 uFoldSize;

out vec4 fragColor;

const mat3 OCTAVE = mat3(0.0, 1.6, 1.2, -1.6, 0.72, -0.96, -1.2, -0.96, 1.28);
const mat2 SHEAR_TURN = mat2(0.8, -0.6, 0.6, 0.8);
const mat3 LAB_TO_CONE = mat3(1.0, 1.0, 1.0, 0.3963377774, -0.1055613458, -0.0894841775, 0.2158037573, -0.0638541728, -1.291485548);
const mat3 CONE_TO_RGB = mat3(4.0767416621, -1.2684380046, -0.0041960863, -3.3077115913, 2.6097574011, -0.7034186147, 0.2309699292, -0.3413193965, 1.707614701);

float lattice(uvec3 cell) {
  uvec3 v = (cell & 0xFFFFFFu) * 1664525u + 1013904223u;
  v.x += v.y * v.z;
  v.y += v.z * v.x;
  v.z += v.x * v.y;
  v ^= v >> 16u;
  return float((v.x + v.y * v.z) >> 8u) * 5.9604644775390625e-8;
}

float softLattice(vec3 p) {
  vec3 base = floor(p);
  vec3 f = p - base;
  uvec3 c = uvec3(mod(base, 16777216.0));
  vec3 w = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  vec2 near = mix(vec2(lattice(c), lattice(c + uvec3(0u, 0u, 1u))), vec2(lattice(c + uvec3(1u, 0u, 0u)), lattice(c + uvec3(1u, 0u, 1u))), w.x);
  vec2 far = mix(vec2(lattice(c + uvec3(0u, 1u, 0u)), lattice(c + uvec3(0u, 1u, 1u))), vec2(lattice(c + uvec3(1u, 1u, 0u)), lattice(c + uvec3(1u, 1u, 1u))), w.x);
  vec2 slab = mix(near, far, w.y);
  return mix(slab.x, slab.y, w.z);
}

float turbulence(vec3 p) {
  float sum = 0.0;
  float gain = 0.5;
  for (int octave = 0; octave < 4; octave++) {
    sum += gain * (softLattice(p) - 0.5);
    gain *= 0.5;
    p = OCTAVE * p;
  }
  return sum / 0.9375;
}

vec2 fold(vec2 point) {
  vec2 axis = vec2(0.8, -0.6);
  for (int layer = 0; layer < ${MAX_LAYERS}; layer++) {
    if (layer >= uLayers) break;
    float along = dot(point, axis);
    point += vec2(-axis.y, axis.x) * (uWarp * turbulence(vec3(uFrequency * along, uFlow, float(layer) + uSeed)));
    axis = SHEAR_TURN * axis;
  }
  return point;
}

vec2 turnView(vec2 view) {
  return vec2(uTurn.x * view.x - uTurn.y * view.y, uTurn.y * view.x + uTurn.x * view.y);
}

vec4 packFold(vec2 point) {
  vec2 level = floor(clamp(point * 0.0625 + 0.5, 0.0, 1.0) * 65535.0 + 0.5);
  vec2 coarse = floor(level / 256.0);
  return vec4(coarse.x, level.x - coarse.x * 256.0, coarse.y, level.y - coarse.y * 256.0) / 255.0;
}

vec2 unpackFold(ivec2 texel) {
  vec4 bytes = floor(texelFetch(uFold, clamp(texel, ivec2(0), ivec2(uFoldSize) - 1), 0) * 255.0 + 0.5);
  return (vec2(bytes.x * 256.0 + bytes.y, bytes.z * 256.0 + bytes.w) / 65535.0 - 0.5) * 16.0;
}

vec2 readFold(vec2 coord) {
  vec2 site = coord / uFoldScale - 0.5;
  vec2 base = floor(site);
  vec2 f = site - base;
  ivec2 corner = ivec2(base);
  vec2 lower = mix(unpackFold(corner), unpackFold(corner + ivec2(1, 0)), f.x);
  vec2 upper = mix(unpackFold(corner + ivec2(0, 1)), unpackFold(corner + ivec2(1, 1)), f.x);
  return mix(lower, upper, f.y);
}

float ease(float v) {
  v = clamp(v, 0.0, 1.0);
  return v * v * v * (v * (v * 6.0 - 15.0) + 10.0);
}

vec3 toDisplay(vec3 v) {
  return mix(v * 12.92, 1.055 * pow(max(v, 0.0), vec3(1.0 / 2.4)) - 0.055, step(0.0031308, v));
}

vec3 toLight(vec3 v) {
  return mix(v / 12.92, pow(max((v + 0.055) / 1.055, 0.0), vec3(2.4)), step(0.04045, v));
}

vec3 lightSlope(vec3 v) {
  return mix(vec3(1.0 / 12.92), (2.4 / 1.055) * pow(max((v + 0.055) / 1.055, 0.0), vec3(1.4)), step(0.04045, v));
}

vec3 stipple(vec3 light, vec3 rank, float levels) {
  float steps = levels - 1.0;
  float unit = 1.0 / steps;
  vec3 ends = toLight(vec3(unit, 1.0 - unit, 0.0));
  vec3 bends = lightSlope(vec3(0.0, unit, 1.0 - unit));
  float topBend = lightSlope(vec3(1.0)).x;
  vec3 hi = toDisplay(light);
  vec3 lo = hi - unit;
  for (int i = 0; i < 12; i++) {
    vec3 t = 0.5 * (lo + hi);
    vec3 next = t + unit;
    vec3 rise = vec3(lessThan(lightSlope(t) * (toLight(next) - light), lightSlope(next) * (light - toLight(t))));
    lo = mix(lo, t, rise);
    hi = mix(t, hi, rise);
  }
  vec3 window = 0.5 * (lo + hi);
  vec3 y0 = clamp(floor(window * steps), 0.0, max(steps - 2.0, 0.0)) * unit;
  vec3 y1 = y0 + unit;
  vec3 y2 = y1 + unit;
  vec3 e0 = toLight(y0);
  vec3 e1 = toLight(y1);
  vec3 e2 = toLight(y2);
  vec3 a = e0 - light;
  vec3 b = e1 - light;
  vec3 c = e2 - light;
  vec3 variance = (light - toLight(window)) * (toLight(window + unit) - light);
  vec3 p0 = (variance + b * c) / ((e0 - e1) * (e0 - e2));
  vec3 p2 = (variance + a * b) / ((e2 - e0) * (e2 - e1));
  vec3 result = mix(mix(y2, y1, vec3(lessThan(rank, 1.0 - p2))), y0, vec3(lessThan(rank, p0)));
  vec3 high = 1.0 - unit * vec3(greaterThan(ends.y + rank * (1.0 - ends.y), light));
  vec3 low = unit * vec3(lessThan(ends.x * rank, light));
  result = mix(result, high, vec3(greaterThan(light * (bends.z + topBend), vec3(bends.z + ends.y * topBend))));
  result = mix(result, low, vec3(lessThan(light * (bends.x + bends.y), vec3(bends.x * ends.x))));
  return clamp(result, 0.0, 1.0);
}

#ifdef FOLD_PASS
void main() {
  fragColor = packFold(fold(turnView((gl_FragCoord.xy * uFoldScale - 0.5 * uGrid) / uGrid.y)));
}
#else
void main() {
  vec2 view = (gl_FragCoord.xy - 0.5 * uGrid) / uGrid.y;
#ifdef FOLD_MAP
  vec2 point = readFold(gl_FragCoord.xy);
#else
  vec2 point = fold(turnView(view));
#endif
  vec2 blend = vec2(ease(point.x / uSpread + 0.5), ease(point.y / uSpread + 0.5));
  float clock = uClock;
  for (int i = 0; i < ${MAX_TIDES}; i++) {
    vec4 tide = uTides[i];
    clock += tide.w * ease((tide.z - length(view - tide.xy)) / ${TIDE_WIDTH.toFixed(2)} + 0.5);
  }
  float phase = 0.5 - 0.5 * cos(clock);
  vec3 lab = mix(
    mix(mix(uDawn[0], uDusk[0], phase), mix(uDawn[1], uDusk[1], phase), blend.x),
    mix(mix(uDawn[2], uDusk[2], phase), mix(uDawn[3], uDusk[3], phase), blend.x),
    blend.y
  );
  if (uReveal < 1.0) lab = mix(uGround, lab, ease((uReveal * 1.6 - 1.0 + 0.5 * (blend.x + blend.y)) / 0.6));
  vec3 cone = LAB_TO_CONE * lab;
  vec3 light = clamp(CONE_TO_RGB * (cone * cone * cone), 0.0, 1.0);
  vec3 rank = texelFetch(uNoise, ivec2(gl_FragCoord.xy) % ${NOISE_SIZE}, 0).rgb;
  fragColor = vec4(stipple(light, rank, uLevels), 1.0);
}
#endif
`;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const finite = (value: number | undefined, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const subscribeToMotion = (notify: () => void) => {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};

const readMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const random = (seed: number) => {
  let state = Math.floor(seed * 2654435761) >>> 0 || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return ((state >>> 0) % 100000) / 100000;
  };
};

const wrap = (value: number, size: number) => ((value % size) + size) % size;

const blueNoise = (size: number, seed: number) => {
  const total = size * size;
  const reach = 6;
  const span = reach * 2 + 1;
  const block = 8;
  const across = size / block;
  const kernel = new Float32Array(span * span);
  for (let y = -reach; y <= reach; y += 1) {
    for (let x = -reach; x <= reach; x += 1)
      kernel[(y + reach) * span + x + reach] = Math.exp(-(x * x + y * y) / 4.5);
  }
  const energy = new Float32Array(total);
  const filled = new Uint8Array(total);
  const order = new Float32Array(total);
  const emptyLow = new Float32Array(across * across);
  const emptyAt = new Int32Array(across * across);
  const fullHigh = new Float32Array(across * across);
  const fullAt = new Int32Array(across * across);
  const splat = (index: number, sign: number) => {
    const cx = index % size;
    const cy = (index - cx) / size;
    for (let y = -reach; y <= reach; y += 1) {
      const row = wrap(cy + y, size) * size;
      const k = (y + reach) * span + reach;
      for (let x = -reach; x <= reach; x += 1)
        energy[row + wrap(cx + x, size)] += sign * kernel[k + x];
    }
  };
  const survey = (bx: number, by: number) => {
    const slot = by * across + bx;
    let low = Infinity;
    let high = -Infinity;
    let lowAt = 0;
    let highAt = 0;
    for (let y = by * block; y < by * block + block; y += 1) {
      for (let x = bx * block; x < bx * block + block; x += 1) {
        const index = y * size + x;
        const value = energy[index];
        if (filled[index]) {
          if (value > high) {
            high = value;
            highAt = index;
          }
        } else if (value < low) {
          low = value;
          lowAt = index;
        }
      }
    }
    emptyLow[slot] = low;
    emptyAt[slot] = lowAt;
    fullHigh[slot] = high;
    fullAt[slot] = highAt;
  };
  const surveyAll = () => {
    for (let by = 0; by < across; by += 1)
      for (let bx = 0; bx < across; bx += 1) survey(bx, by);
  };
  const toggle = (index: number, value: number) => {
    filled[index] = value;
    splat(index, value ? 1 : -1);
    const cx = index % size;
    const cy = (index - cx) / size;
    for (
      let by = Math.floor((cy - reach) / block);
      by <= Math.floor((cy + reach) / block);
      by += 1
    ) {
      for (
        let bx = Math.floor((cx - reach) / block);
        bx <= Math.floor((cx + reach) / block);
        bx += 1
      )
        survey(wrap(bx, across), wrap(by, across));
    }
  };
  const densest = () => {
    let best = 0;
    for (let slot = 1; slot < fullHigh.length; slot += 1)
      if (fullHigh[slot] > fullHigh[best]) best = slot;
    return fullAt[best];
  };
  const emptiest = () => {
    let best = 0;
    for (let slot = 1; slot < emptyLow.length; slot += 1)
      if (emptyLow[slot] < emptyLow[best]) best = slot;
    return emptyAt[best];
  };
  const rand = random(seed);
  const start = Math.floor(total / 10);
  for (let placed = 0; placed < start;) {
    const index = Math.floor(rand() * total);
    if (filled[index]) continue;
    filled[index] = 1;
    splat(index, 1);
    placed += 1;
  }
  surveyAll();
  for (let guard = 0; guard < total; guard += 1) {
    const from = densest();
    toggle(from, 0);
    const to = emptiest();
    toggle(to, 1);
    if (to === from) break;
  }
  const settledFill = filled.slice();
  const settledEnergy = energy.slice();
  for (let rank = start - 1; rank >= 0; rank -= 1) {
    const index = densest();
    toggle(index, 0);
    order[index] = rank;
  }
  filled.set(settledFill);
  energy.set(settledEnergy);
  surveyAll();
  for (let rank = start; rank < total; rank += 1) {
    const index = emptiest();
    toggle(index, 1);
    order[index] = rank;
  }
  for (let index = 0; index < total; index += 1)
    order[index] = (order[index] + 0.5) / total;
  return order;
};

let noiseCache: Float32Array | null = null;

const noiseTexels = () => {
  if (noiseCache) return noiseCache;
  const channels = [
    blueNoise(NOISE_SIZE, 3),
    blueNoise(NOISE_SIZE, 11),
    blueNoise(NOISE_SIZE, 29),
  ];
  const data = new Float32Array(NOISE_SIZE * NOISE_SIZE * 4);
  for (let index = 0; index < NOISE_SIZE * NOISE_SIZE; index += 1) {
    data[index * 4] = channels[0][index];
    data[index * 4 + 1] = channels[1][index];
    data[index * 4 + 2] = channels[2][index];
    data[index * 4 + 3] = 1;
  }
  noiseCache = data;
  return data;
};

const decode = (channel: number) =>
  channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;

const toLab = (input: string, fallback: string): Lab => {
  const color = new THREE.Color(fallback);
  try {
    color.set(input);
  } catch {
    color.set(fallback);
  }
  const rgb = color.getRGB({ r: 0, g: 0, b: 0 }, THREE.SRGBColorSpace);
  const r = decode(rgb.r);
  const g = decode(rgb.g);
  const b = decode(rgb.b);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};

const visible = ([L, a, b]: Lab) => {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const v = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  return Math.min(r, g, v) > -0.0005 && Math.max(r, g, v) < 1.0005;
};

const polar = ([L, a, b]: Lab): Polar => ({
  L,
  C: Math.hypot(a, b),
  h: (Math.atan2(b, a) * 180) / Math.PI,
});

const fromPolar = (L: number, C: number, h: number): Lab => [
  L,
  C * Math.cos((h * Math.PI) / 180),
  C * Math.sin((h * Math.PI) / 180),
];

const fit = (L: number, C: number, h: number): Lab => {
  const lightness = clamp(L, 0, 1);
  let low = 0;
  let high = Math.max(0, C);
  if (visible(fromPolar(lightness, high, h)))
    return fromPolar(lightness, high, h);
  for (let i = 0; i < 20; i += 1) {
    const mid = (low + high) / 2;
    if (visible(fromPolar(lightness, mid, h))) low = mid;
    else high = mid;
  }
  return fromPolar(lightness, low, h);
};

const arcBetween = (from: number, to: number) => {
  let delta = (to - from) % 360;
  if (delta > 180) delta -= 360;
  if (delta <= -180) delta += 360;
  return delta;
};

const corners = (lead: Polar, anchor: Polar, ground: Lab, push: number) => {
  const arc = arcBetween(anchor.h, lead.h);
  const tint = polar(ground);
  const amount =
    0.045 *
    clamp((0.98 - ground[0]) / 0.3, 0, 1) *
    clamp(1 - tint.C / 0.08, 0, 1);
  const deepHue = ((anchor.h + arc * 0.35) * Math.PI) / 180;
  const deep = polar([
    ground[0],
    ground[1] + Math.cos(deepHue) * amount,
    ground[2] + Math.sin(deepHue) * amount,
  ]);
  return [
    fit(deep.L, deep.C, deep.h),
    fit(anchor.L, anchor.C, anchor.h),
    fit(lead.L, lead.C, lead.h),
    fit(clamp(lead.L + 0.15, 0.25, 0.9), lead.C * 0.8, lead.h + push),
  ];
};

const palette = (
  first: string,
  second: string,
  background: string,
  drift: number,
) => {
  const lead = polar(toLab(first, DEFAULT_COLORS[0]));
  const anchor = polar(toLab(second, DEFAULT_COLORS[1]));
  const ground = toLab(background, "#0A0A0A");
  const arc = arcBetween(anchor.h, lead.h);
  const turn = arc < 0 ? -1 : 1;
  const lean = drift > 0 ? Math.min(drift, Math.abs(arc) * 0.45) : drift;
  const push = turn * 52 * clamp((Math.abs(arc) - 15) / 75, 0, 1);
  const dawn = corners(lead, anchor, ground, push);
  const dusk = corners(
    { L: lead.L - 0.03, C: lead.C * 1.08, h: lead.h - turn * lean },
    { L: anchor.L - 0.06, C: anchor.C * 1.15, h: anchor.h + turn * lean },
    ground,
    push,
  );
  return { dawn, dusk, ground };
};

const StippleGradient = forwardRef<StippleGradientHandle, StippleGradientProps>(
  function StippleGradient(
    {
      colors = DEFAULT_COLORS,
      backgroundColor = "#0A0A0A",
      drift = 32,
      speed = 1,
      warp = 1,
      scale = 1,
      layers = 10,
      spread = 1,
      angle = 0,
      levels = 4,
      pixelSize = 1,
      seed = 0,
      interactive = true,
      stir = 1,
      tide = 1,
      intro = true,
      paused = false,
      quality = 1,
      className,
      style,
      children,
    },
    ref,
  ) {
    const rootRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const replayRef = useRef<() => void>(() => {});
    const tideRef = useRef<(x?: number, y?: number) => void>(() => {});
    const syncRef = useRef<() => void>(() => {});
    const playedRef = useRef(false);
    const reduced = useSyncExternalStore(
      subscribeToMotion,
      readMotion,
      () => false,
    );
    const first =
      Array.isArray(colors) && typeof colors[0] === "string"
        ? colors[0]
        : DEFAULT_COLORS[0];
    const second =
      Array.isArray(colors) && typeof colors[1] === "string"
        ? colors[1]
        : DEFAULT_COLORS[1];
    const settingsRef = useRef({
      first,
      second,
      backgroundColor,
      drift,
      speed,
      warp,
      scale,
      layers,
      spread,
      angle,
      levels,
      pixelSize,
      seed,
      interactive,
      stir,
      tide,
      paused,
      quality,
    });

    useEffect(() => {
      settingsRef.current = {
        first,
        second,
        backgroundColor,
        drift,
        speed,
        warp,
        scale,
        layers,
        spread,
        angle,
        levels,
        pixelSize,
        seed,
        interactive,
        stir,
        tide,
        paused,
        quality,
      };
    });

    useImperativeHandle(
      ref,
      () => ({
        replay: () => replayRef.current(),
        tide: (x?: number, y?: number) => tideRef.current(x, y),
      }),
      [],
    );

    useEffect(() => {
      const root = rootRef.current;
      const canvas = canvasRef.current;
      if (!root || !canvas) return;
      const doc = root.ownerDocument;
      const viewport = doc.defaultView ?? window;

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: false,
          alpha: false,
          depth: false,
          stencil: false,
          powerPreference: "high-performance",
        });
      } catch {
        return;
      }
      renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
      renderer.setPixelRatio(1);

      const noise = new THREE.DataTexture(
        noiseTexels(),
        NOISE_SIZE,
        NOISE_SIZE,
        THREE.RGBAFormat,
        THREE.FloatType,
      );
      noise.minFilter = THREE.NearestFilter;
      noise.magFilter = THREE.NearestFilter;
      noise.generateMipmaps = false;
      noise.needsUpdate = true;

      const uniforms = {
        uGrid: { value: new THREE.Vector2(1, 1) },
        uFlow: { value: 0 },
        uClock: { value: 0 },
        uDawn: { value: Array.from({ length: 4 }, () => new THREE.Vector3()) },
        uDusk: { value: Array.from({ length: 4 }, () => new THREE.Vector3()) },
        uGround: { value: new THREE.Vector3() },
        uReveal: { value: 1 },
        uLevels: { value: 4 },
        uWarp: { value: 0.3 },
        uFrequency: { value: 3 },
        uLayers: { value: 10 },
        uSpread: { value: 1 },
        uTurn: { value: new THREE.Vector2(1, 0) },
        uSeed: { value: 0 },
        uTides: {
          value: Array.from({ length: MAX_TIDES }, () => new THREE.Vector4()),
        },
        uNoise: { value: noise },
        uFold: { value: null as THREE.Texture | null },
        uFoldScale: { value: 1 },
        uFoldSize: { value: new THREE.Vector2(1, 1) },
      };
      const shade = (defines: Record<string, string>) =>
        new THREE.ShaderMaterial({
          glslVersion: THREE.GLSL3,
          vertexShader: VERTEX,
          fragmentShader: FRAGMENT,
          uniforms,
          defines,
          depthTest: false,
          depthWrite: false,
        });
      const material = shade({});
      let foldMaterial: THREE.ShaderMaterial | null = null;
      let mapMaterial: THREE.ShaderMaterial | null = null;
      let target: THREE.WebGLRenderTarget | null = null;
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3),
      );
      const mesh = new THREE.Mesh(geometry, material);
      mesh.frustumCulled = false;
      const scene = new THREE.Scene();
      scene.add(mesh);
      const camera = new THREE.Camera();

      const tides: Tide[] = [];
      const pointer = { x: 0, y: 0, inside: false };
      let cssW = 1;
      let cssH = 1;
      let flow = 0;
      let clock = 0;
      let charge = 0;
      let boost = 0;
      let boostVelocity = 0;
      let introClock = 0;
      let introActive = intro && !reduced && !playedRef.current;
      let raf = 0;
      let ticking = false;
      let last = 0;
      let inView = true;
      let disposed = false;
      let gridW = 0;
      let gridH = 0;
      let tier = 0;
      let autoTier = 0;
      let warmup = 30;
      let slowSum = 0;
      let slowCount = 0;

      const apply = () => {
        const settings = settingsRef.current;
        const colorsNow = palette(
          settings.first,
          settings.second,
          settings.backgroundColor,
          clamp(finite(settings.drift, 32), -90, 90),
        );
        colorsNow.dawn.forEach((lab, index) =>
          uniforms.uDawn.value[index].set(lab[0], lab[1], lab[2]),
        );
        colorsNow.dusk.forEach((lab, index) =>
          uniforms.uDusk.value[index].set(lab[0], lab[1], lab[2]),
        );
        uniforms.uGround.value.set(
          colorsNow.ground[0],
          colorsNow.ground[1],
          colorsNow.ground[2],
        );
        uniforms.uLevels.value = clamp(
          Math.round(finite(settings.levels, 4)),
          2,
          16,
        );
        uniforms.uWarp.value = 0.3 * clamp(finite(settings.warp, 1), 0, 4);
        uniforms.uFrequency.value =
          3 / clamp(finite(settings.scale, 1), 0.2, 5);
        uniforms.uLayers.value = clamp(
          Math.round(finite(settings.layers, 10)),
          0,
          MAX_LAYERS,
        );
        uniforms.uSpread.value = clamp(finite(settings.spread, 1), 0.2, 4);
        const turn = (finite(settings.angle, 0) * Math.PI) / 180;
        uniforms.uTurn.value.set(Math.cos(turn), Math.sin(turn));
        uniforms.uSeed.value = finite(settings.seed, 0) * 16;
      };

      const resize = () => {
        cssW = Math.max(1, root.clientWidth);
        cssH = Math.max(1, root.clientHeight);
        const ratio = viewport.devicePixelRatio || 1;
        const cell = Math.max(
          1,
          Math.round(
            clamp(finite(settingsRef.current.pixelSize, 1), 0.5, 16) * ratio,
          ),
        );
        const cols = Math.max(1, Math.ceil((cssW * ratio) / cell));
        const rows = Math.max(1, Math.ceil((cssH * ratio) / cell));
        if (cols !== gridW || rows !== gridH) {
          gridW = cols;
          gridH = rows;
          renderer.setSize(cols, rows, false);
          uniforms.uGrid.value.set(cols, rows);
        }
        configure();
      };

      const configure = () => {
        const chosen = clamp(finite(settingsRef.current.quality, 1), 0.25, 1);
        tier = Math.max(chosen >= 0.75 ? 0 : chosen >= 0.375 ? 1 : 2, autoTier);
        if (tier === 0) return;
        const factor = tier === 1 ? 2 : 4;
        const foldW = Math.max(1, Math.ceil(gridW / factor));
        const foldH = Math.max(1, Math.ceil(gridH / factor));
        if (!target) {
          target = new THREE.WebGLRenderTarget(foldW, foldH, {
            type: THREE.UnsignedByteType,
            format: THREE.RGBAFormat,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            generateMipmaps: false,
            depthBuffer: false,
            stencilBuffer: false,
          });
        } else if (target.width !== foldW || target.height !== foldH) {
          target.setSize(foldW, foldH);
        }
        if (!foldMaterial) foldMaterial = shade({ FOLD_PASS: "" });
        if (!mapMaterial) mapMaterial = shade({ FOLD_MAP: "" });
        uniforms.uFold.value = target.texture;
        uniforms.uFoldScale.value = factor;
        uniforms.uFoldSize.value.set(foldW, foldH);
      };

      const reachOf = (x: number, y: number) => {
        const halfW = cssW / cssH / 2;
        return Math.max(
          Math.hypot(x + halfW, y + 0.5),
          Math.hypot(x - halfW, y + 0.5),
          Math.hypot(x + halfW, y - 0.5),
          Math.hypot(x - halfW, y - 0.5),
        );
      };

      const step = (dt: number) => {
        const settings = settingsRef.current;
        const live = !reduced && !settings.paused;
        const rate = clamp(finite(settings.speed, 1), 0, 5) * FLOW_RATE;
        charge *= Math.exp(-dt / 0.7);
        const goal = Math.min(charge, 1.2);
        boostVelocity += (36 * (goal - boost) - 12 * boostVelocity) * dt;
        boost += boostVelocity * dt;
        if (live) {
          flow +=
            dt *
            rate *
            (1 +
              Math.max(0, boost) * 2 * clamp(finite(settings.stir, 1), 0, 3));
          clock += dt * rate;
        }
        for (let index = tides.length - 1; index >= 0; index -= 1) {
          const wave = tides[index];
          if (live) wave.age += dt;
          if (wave.age * TIDE_SPEED - TIDE_WIDTH > wave.reach) {
            clock += wave.amount;
            tides.splice(index, 1);
          }
        }
        uniforms.uTides.value.forEach((slot, index) => {
          const wave = tides[index];
          if (wave)
            slot.set(
              wave.x,
              wave.y,
              wave.age * TIDE_SPEED - TIDE_WIDTH * 0.5,
              wave.amount,
            );
          else slot.set(0, 0, 0, 0);
        });
        if (introActive) {
          introClock += dt;
          const progress = clamp(introClock / INTRO_SECONDS, 0, 1);
          uniforms.uReveal.value =
            progress < 1 ? 0.5 - 0.5 * Math.cos(progress * Math.PI) : 1;
          if (progress >= 1) introActive = false;
        } else {
          uniforms.uReveal.value = 1;
        }
        uniforms.uFlow.value = flow;
        uniforms.uClock.value = clock;
        return live || introActive;
      };

      const render = () => {
        if (tier > 0 && target && foldMaterial && mapMaterial) {
          mesh.material = foldMaterial;
          renderer.setRenderTarget(target);
          renderer.render(scene, camera);
          renderer.setRenderTarget(null);
          mesh.material = mapMaterial;
        } else {
          mesh.material = material;
        }
        renderer.render(scene, camera);
      };

      const govern = (interval: number) => {
        if (autoTier >= 2 || interval <= 0 || interval > 250) return;
        if (warmup > 0) {
          warmup -= 1;
          return;
        }
        slowSum += interval;
        slowCount += 1;
        if (slowCount < 45) return;
        if (slowSum / slowCount > 28) {
          autoTier += 1;
          warmup = 20;
          configure();
        }
        slowSum = 0;
        slowCount = 0;
      };

      const tick = (stamp: number) => {
        raf = 0;
        ticking = true;
        const interval = last ? stamp - last : 0;
        const dt = Math.min(0.05, last ? interval / 1000 : 1 / 60);
        last = stamp;
        govern(interval);
        const keepGoing = step(dt);
        render();
        ticking = false;
        if (keepGoing && inView && !doc.hidden && !disposed)
          raf = viewport.requestAnimationFrame(tick);
        else last = 0;
      };

      const wake = () => {
        if (raf || ticking || disposed) return;
        if (!inView || doc.hidden) return;
        raf = viewport.requestAnimationFrame(tick);
      };

      const locate = (clientX: number, clientY: number) => {
        const rect = root.getBoundingClientRect();
        if (
          clientX < rect.left ||
          clientX > rect.right ||
          clientY < rect.top ||
          clientY > rect.bottom ||
          rect.height <= 0
        )
          return null;
        return {
          x: (clientX - rect.left - rect.width / 2) / rect.height,
          y: (rect.top + rect.height / 2 - clientY) / rect.height,
        };
      };

      const onMove = (event: PointerEvent) => {
        const settings = settingsRef.current;
        const spot = locate(event.clientX, event.clientY);
        if (!spot) {
          pointer.inside = false;
          return;
        }
        if (
          pointer.inside &&
          settings.interactive &&
          !settings.paused &&
          !reduced
        ) {
          charge += Math.hypot(spot.x - pointer.x, spot.y - pointer.y) * 1.2;
          wake();
        }
        pointer.x = spot.x;
        pointer.y = spot.y;
        pointer.inside = true;
      };

      const onLeave = () => {
        pointer.inside = false;
      };

      const launch = (x: number, y: number) => {
        const strength = clamp(finite(settingsRef.current.tide, 1), 0, 3);
        if (
          strength <= 0 ||
          reduced ||
          settingsRef.current.paused ||
          tides.length >= MAX_TIDES
        )
          return;
        tides.push({
          x,
          y,
          age: 0,
          amount: (Math.PI / 2) * strength,
          reach: reachOf(x, y),
        });
        wake();
      };

      const onClick = (event: MouseEvent) => {
        if (!settingsRef.current.interactive || reduced) return;
        const spot = locate(event.clientX, event.clientY);
        if (spot) launch(spot.x, spot.y);
      };

      replayRef.current = () => {
        if (reduced) return;
        introActive = true;
        introClock = 0;
        wake();
      };

      tideRef.current = (x = 0.5, y = 0.5) => {
        launch((clamp(x, 0, 1) - 0.5) * (cssW / cssH), 0.5 - clamp(y, 0, 1));
      };

      syncRef.current = () => {
        apply();
        resize();
        step(0);
        render();
        wake();
      };

      apply();
      resize();
      step(0);
      render();

      const observer = new ResizeObserver(() => {
        resize();
        step(0);
        render();
      });
      observer.observe(root);
      const sight = new IntersectionObserver((entries) => {
        inView = entries.some((entry) => entry.isIntersecting);
        if (inView) {
          if (introActive) playedRef.current = true;
          wake();
        }
      });
      sight.observe(root);
      const onVisibility = () => wake();
      doc.addEventListener("visibilitychange", onVisibility);
      doc.addEventListener("pointermove", onMove, { passive: true });
      doc.addEventListener("click", onClick, { passive: true });
      doc.documentElement.addEventListener("pointerleave", onLeave);
      wake();

      return () => {
        disposed = true;
        viewport.cancelAnimationFrame(raf);
        observer.disconnect();
        sight.disconnect();
        doc.removeEventListener("visibilitychange", onVisibility);
        doc.removeEventListener("pointermove", onMove);
        doc.removeEventListener("click", onClick);
        doc.documentElement.removeEventListener("pointerleave", onLeave);
        replayRef.current = () => {};
        tideRef.current = () => {};
        syncRef.current = () => {};
        geometry.dispose();
        material.dispose();
        foldMaterial?.dispose();
        mapMaterial?.dispose();
        target?.dispose();
        noise.dispose();
        renderer.dispose();
      };
    }, [intro, reduced]);

    useEffect(() => {
      syncRef.current();
    }, [
      first,
      second,
      backgroundColor,
      drift,
      speed,
      warp,
      scale,
      layers,
      spread,
      angle,
      levels,
      pixelSize,
      seed,
      interactive,
      stir,
      tide,
      paused,
      quality,
    ]);

    return (
      <div
        ref={rootRef}
        className={cn(
          "relative isolate size-full overflow-hidden bg-(--stipple-ground)",
          className,
        )}
        style={
          { "--stipple-ground": backgroundColor, ...style } as CSSProperties
        }
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 block size-full [image-rendering:pixelated]"
        />
        {children && <div className="relative z-10 size-full">{children}</div>}
      </div>
    );
  },
);

StippleGradient.displayName = "StippleGradient";

export { StippleGradient };
