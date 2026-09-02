/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The painted-cover shader: a curl-noise flow field, streaked along its own
 * direction so the texture reads as directional brushwork, mapped through a
 * four-stop palette, with grain and a vignette. STEPS (the streak sample
 * count) is a compile-time define so the loop unrolls: 8 on cards, 12 on the
 * hero.
 */

export const VERTEX = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

export const STEPS = { card: 8, hero: 12 } as const;

// Uniform contract: uTime, uSeed, uAspect, uResolution, uPalette[4],
// uHorizon, uSwirl, uStroke, uDrift. STEPS is prepended by fragmentFor.
const FRAGMENT_BODY = `precision highp float;

uniform float uTime;
uniform float uSeed;
uniform float uAspect;
uniform vec2  uResolution;
uniform vec3  uPalette[4];
uniform float uHorizon;
uniform float uSwirl;
uniform float uStroke;
uniform float uDrift;

out vec4 fragColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  return 0.625 * vnoise(p) + 0.375 * vnoise(p * 2.1 + vec2(3.7, 1.3));
}

mat2 rot(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c);
}

// curl of the warped field: divergence-free, so the streaks swirl instead of
// converging into sinks
vec2 curl(vec2 p) {
  float e = 0.02;
  float dy = fbm(p + vec2(0.0, e)) - fbm(p - vec2(0.0, e));
  float dx = fbm(p + vec2(e, 0.0)) - fbm(p - vec2(e, 0.0));
  return normalize(vec2(dy, -dx) + 1e-5);
}

vec3 palette(float v) {
  if (v < 0.3333) return mix(uPalette[0], uPalette[1], v / 0.3333);
  if (v < 0.6666) return mix(uPalette[1], uPalette[2], (v - 0.3333) / 0.3333);
  return mix(uPalette[2], uPalette[3], (v - 0.6666) / 0.3334);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 p = vec2(uv.x * uAspect, uv.y);
  float t = uTime * uDrift * 0.03;

  // domain-warped, seed-rotated field that advects slowly
  vec2 q = rot(uSeed) * (p / uSwirl);
  vec2 warp = vec2(fbm(q * 0.7 + t), fbm(q * 0.7 - t + 5.2));
  vec2 fp = q + (warp - 0.5) * 0.8;
  vec2 dir = curl(fp);

  // line-integral streak: average fine noise along the local flow direction
  float stride = uStroke / float(STEPS);
  float acc = 0.0;
  for (int i = -STEPS; i <= STEPS; i++) {
    vec2 sp = p + dir * (float(i) * stride);
    acc += vnoise(sp * 18.0 + t * 2.0);
  }
  acc /= float(2 * STEPS + 1);

  // quantized bands read as dabs; a per-region phase alternates their stops
  float band = floor(acc * 5.0 + 0.5) / 5.0;
  float phase = hash(floor(fp * 6.0));
  float v = band * 0.8 + fbm(fp * 1.5) * 0.35 + (phase - 0.5) * 0.15;

  // horizon: the darkest stop gathers at the top (1) or the bottom (-1)
  v -= uHorizon * (uv.y - 0.5) * 0.5;
  v = clamp(v, 0.0, 1.0);

  vec3 col = palette(v);
  col += (hash(gl_FragCoord.xy + t) - 0.5) * 0.06;
  float edge = min(min(uv.x, 1.0 - uv.x) * uAspect, min(uv.y, 1.0 - uv.y));
  col *= mix(0.9, 1.0, smoothstep(0.0, 0.5, edge));

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
