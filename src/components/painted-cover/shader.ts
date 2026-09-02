/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The painted-cover shader: watercolor washes on a swirling field.
 *
 * Value-noise FBM, domain-warped twice so the washes curl into each other
 * (the same construction as the site's watercolor background), mapped
 * through the preset's four stops. Two things make it read as watercolor
 * rather than smoke: a faint dark rim where one wash meets the next (the
 * pigment that collects at a drying edge) and fine granulation across the
 * wash. STEPS is the octave count, a compile-time define so the loop
 * unrolls: 8 on cards, 12 on the hero.
 */

export const VERTEX = `#version 300 es
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export const STEPS = { card: 8, hero: 12 } as const;

// Uniform contract: uTime, uSeed, uAspect, uPalette[4], uHorizon, uSwirl,
// uStroke, uDrift. STEPS is prepended by fragmentFor.
const FRAGMENT_BODY = `precision highp float;

uniform float uTime;
uniform float uSeed;
uniform float uAspect;
uniform vec3  uPalette[4];
uniform float uHorizon;
uniform float uSwirl;
uniform float uStroke;
uniform float uDrift;

in vec2 vUv;
out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(41.713, 83.457))) * 35718.549);
}

float vnoise(vec2 p) {
  vec2 g = floor(p);
  vec2 f = fract(p);
  vec2 w = f * f * (3.0 - 2.0 * f);
  float a = hash(g);
  float b = hash(g + vec2(1.0, 0.0));
  float c = hash(g + vec2(0.0, 1.0));
  float d = hash(g + vec2(1.0, 1.0));
  return mix(mix(a, b, w.x), mix(c, d, w.x), w.y);
}

// rotated-octave FBM: each octave turns a little, so the washes never line
// up on a grid
float layers(vec2 p) {
  float total = 0.0;
  float amp = 0.5;
  float ca = cos(0.47), sa = sin(0.47);
  mat2 bend = mat2(ca, -sa, sa, ca);
  for (int k = 0; k < STEPS; k++) {
    total += amp * vnoise(p);
    p = bend * p * 2.0 + 193.7;
    amp *= 0.58;
  }
  return total;
}

mat2 rot(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, -s, s, c);
}

vec3 ramp(float x) { // x in 0..3 across the four stops
  vec3 c = mix(uPalette[0], uPalette[1], clamp(x, 0.0, 1.0));
  c = mix(c, uPalette[2], clamp(x - 1.0, 0.0, 1.0));
  c = mix(c, uPalette[3], clamp(x - 2.0, 0.0, 1.0));
  return c;
}

void main() {
  // cover-width units, seed-rotated about the centre, scaled by the preset
  vec2 p = vec2(vUv.x * uAspect, vUv.y);
  vec2 s = rot(uSeed) * (p - vec2(0.5 * uAspect, 0.5)) * (2.4 / uSwirl);
  float t = uTime * uDrift * 0.03;

  // two independent fields drive a rotated warp, so the wash boundaries
  // whorl instead of merely bulging: the swirl of the reference, without
  // drawing any strokes
  float q = layers(s + t * vec2(0.6, 0.3));
  float w = layers(s + vec2(7.7, 2.9) - t * vec2(0.4, 0.5));
  vec2 curl = (1.2 + uStroke * 3.0) * vec2(-(w - 0.5), q - 0.5);
  float r = layers(s + curl + vec2(5.2, 1.3));

  // wash value: mostly mid-tones, the lightest stop only where washes thin
  float v = r * 1.15 + (q - 0.5) * 0.3;
  // composition: the darkest stop gathers at the top (1) or the bottom (-1)
  v -= uHorizon * (vUv.y - 0.5) * 0.4;
  v = clamp(v, 0.0, 1.0);

  // continuous washes: a gentle S-curve keeps the mid-tones, the ramp blends
  // the stops the way thin pigment layers do
  vec3 col = ramp(smoothstep(0.0, 1.0, v) * 3.0);
  // dried edges: a faint darker line along a few iso-contours of the wash
  float iso = abs(fract(v * 2.5 + 0.25) - 0.5);
  float rim = 1.0 - smoothstep(0.0, 0.06, iso);
  col *= 1.0 - 0.08 * rim;

  // granulation: pigment settling unevenly across the wash
  float grain = vnoise(p * 90.0);
  col *= 0.97 + 0.05 * grain;
  // paper: static tooth
  float paper = hash(floor(gl_FragCoord.xy)) - 0.5;
  col *= 1.0 + 0.03 * paper;
  // vignette
  float edgeDist = min(min(vUv.x, 1.0 - vUv.x) * uAspect, min(vUv.y, 1.0 - vUv.y));
  col *= mix(0.9, 1.0, smoothstep(0.0, 0.45, edgeDist));

  fragColor = vec4(col, 1.0);
}
`;

const cache = new Map<number, string>();

export function fragmentFor(steps: number): string {
  let source = cache.get(steps);
  if (!source) {
    source = `#version 300 es\n#define STEPS ${steps}\n${FRAGMENT_BODY}`;
    cache.set(steps, source);
  }
  return source;
}
