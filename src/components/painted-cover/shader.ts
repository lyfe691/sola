/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The painted-cover shader: the site's watercolor background, on a cover.
 *
 * Same construction as src/components/watercolor.tsx and the values the
 * watercolor background preset uses: rotated-octave value-noise FBM, warped
 * once by itself, blended between two colors through a narrow smoothstep so
 * most of the surface is one wash or the other with a soft bleeding edge.
 * STEPS is the octave count, a compile-time define so the loop unrolls.
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

export const STEPS = { card: 5, hero: 6 } as const;

// Uniform contract: uTime, uSeed, uAspect, uColor1, uColor2, uScale, uSpeed.
// STEPS is prepended by fragmentFor.
const FRAGMENT_BODY = `precision highp float;

uniform float uTime;
uniform float uSeed;
uniform float uAspect;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform float uScale;
uniform float uSpeed;

in vec2 vUv;
out vec4 fragColor;

const float DRIFT = 0.18;
const float WARP = 0.12;
const float PERSISTENCE = 0.52;
const float LACUNARITY = 2.0;
const float SATURATION = 1.1;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(41.713, 83.457))) * 35718.549);
}

float vnoise(vec2 p) {
  vec2 g = floor(p);
  vec2 f = fract(p);
  vec2 w = f * f * (3.0 - 2.0 * f);
  float tl = hash(g);
  float tr = hash(g + vec2(1.0, 0.0));
  float bl = hash(g + vec2(0.0, 1.0));
  float br = hash(g + vec2(1.0, 1.0));
  return mix(mix(tl, tr, w.x), mix(bl, br, w.x), w.y);
}

float layers(vec2 p) {
  float total = 0.0;
  float amp = 0.5;
  float ca = cos(0.47), sa = sin(0.47);
  mat2 bend = mat2(ca, -sa, sa, ca);
  for (int k = 0; k < STEPS; k++) {
    total += amp * vnoise(p);
    p = bend * p * LACUNARITY + 193.7;
    amp *= PERSISTENCE;
  }
  return total;
}

void main() {
  // centred, aspect-correct, rotated by the seed so siblings differ
  vec2 coord = (vUv * 2.0 - 1.0) * vec2(uAspect, 1.0) * uScale;
  float c = cos(uSeed), s = sin(uSeed);
  coord = mat2(c, -s, s, c) * coord;

  float t = uTime * uSpeed;
  float q = layers(coord + t * DRIFT);
  float r = layers(coord + q + t * WARP);

  vec3 raw = mix(uColor1, uColor2, smoothstep(0.3, 0.7, r));
  float luma = dot(raw, vec3(0.299, 0.587, 0.114));
  vec3 col = mix(vec3(luma), raw, SATURATION);

  fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
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
