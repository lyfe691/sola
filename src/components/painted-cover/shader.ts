/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The painted-cover shader: layered brush dabs on a curl-noise flow field.
 *
 * A pixel's flow direction comes from the curl of domain-warped gradient
 * noise (rotated by the seed, morphing slowly between two potentials so the
 * swirls breathe). Three layers of oriented capsule dabs, coarse to fine,
 * are laid on jittered grids along that direction; each dab picks one
 * palette stop from the composition (horizon), the swirl potential and its
 * own hash, and the top three dabs per pixel are composited by depth. The
 * lightest stop is reserved for the small top-layer dabs, so highlights
 * read as stars and halos rather than fields. STEPS (cells visited per
 * layer) is a compile-time define so the loop unrolls: 8 on cards, 12 on
 * the hero.
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
precision highp int;

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

const float TAU = 6.28318530718;
const vec2  LIGHT = vec2(-0.4472, 0.8944);

// ---------- hashing (pcg) ----------
uvec2 pcg2d(uvec2 v) {
  v = v * 1664525u + 1013904223u;
  v.x += v.y * 1664525u; v.y += v.x * 1664525u;
  v ^= v >> 16u;
  v.x += v.y * 1664525u; v.y += v.x * 1664525u;
  v ^= v >> 16u;
  return v;
}
uvec4 pcg4d(uvec4 v) {
  v = v * 1664525u + 1013904223u;
  v.x += v.y * v.w; v.y += v.z * v.x; v.z += v.x * v.y; v.w += v.y * v.z;
  v ^= v >> 16u;
  v.x += v.y * v.w; v.y += v.z * v.x; v.z += v.x * v.y; v.w += v.y * v.z;
  return v;
}
float hash1(ivec2 c) {
  uvec2 v = pcg2d(uvec2(c + 16384));
  return float(v.x ^ v.y) * 2.3283064e-10;
}
vec2 hash2(ivec2 c) {
  uvec2 v = pcg2d(uvec2(c + 16384));
  return vec2(v) * 4.656613e-10 - 1.0;
}

// ---------- gradient noise with analytic derivative (value roughly in -0.5..0.5) ----------
vec3 noised(vec2 p) {
  vec2 i = floor(p);
  vec2 f = p - i;
  ivec2 ii = ivec2(i);
  vec2 u  = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  vec2 du = 30.0 * f * f * (f * (f - 2.0) + 1.0);
  vec2 ga = hash2(ii);
  vec2 gb = hash2(ii + ivec2(1, 0));
  vec2 gc = hash2(ii + ivec2(0, 1));
  vec2 gd = hash2(ii + ivec2(1, 1));
  float va = dot(ga, f);
  float vb = dot(gb, f - vec2(1.0, 0.0));
  float vc = dot(gc, f - vec2(0.0, 1.0));
  float vd = dot(gd, f - vec2(1.0, 1.0));
  float k = va - vb - vc + vd;
  return vec3(
    va + u.x * (vb - va) + u.y * (vc - va) + u.x * u.y * k,
    ga + u.x * (gb - ga) + u.y * (gc - ga) + u.x * u.y * (ga - gb - gc + gd)
       + du * (u.yx * k + vec2(vb, vc) - va)
  );
}
vec3 fbm2(vec2 s) {
  vec3 a = noised(s);
  vec3 b = noised(s * 2.03 + vec2(11.7, 5.3));
  return vec3(a.x + 0.5 * b.x, a.yz + 1.015 * b.yz);
}
vec2 rot(vec2 v, float a) {
  float c = cos(a), s = sin(a);
  return vec2(c * v.x - s * v.y, s * v.x + c * v.y);
}

// ---------- palette ----------
vec3 ramp(float x) { // x in 0..3 across the four stops
  vec3 c = mix(uPalette[0], uPalette[1], clamp(x, 0.0, 1.0));
  c = mix(c, uPalette[2], clamp(x - 1.0, 0.0, 1.0));
  c = mix(c, uPalette[3], clamp(x - 2.0, 0.0, 1.0));
  return c;
}
// one colour per dab: quantised to a stop, with a soft transition band so
// slow drift never pops
vec3 dabColor(float t) {
  float x = 3.0 * pow(clamp(t, 0.0, 1.0), 1.35);
  float xq = floor(x) + smoothstep(0.35, 0.65, fract(x));
  return ramp(xq);
}

struct Ctx { vec2 p; vec2 dir; float aa; float nLow; vec2 gLow; float tau; };

// One layer of oriented capsule dabs on a jittered grid of cell size cs.
// The pixel walks STEPS cells: the 2x2 block around it, then extensions along
// the flow's dominant axis (2x4), then across it (4x4 minus corners).
// Dabs are z-sorted (top three kept) so compositing is order independent;
// colour is resolved only for the three survivors to keep the loop body small.
vec3 paintLayer(vec3 col, Ctx c, float cs, int k, float skip, float bias, float tMax) {
  ivec2 base = ivec2(floor(c.p / cs - 0.5));
  bool horiz = abs(c.dir.x) >= abs(c.dir.y);
  ivec2 A = horiz ? ivec2(1, 0) : ivec2(0, 1);
  ivec2 B = horiz ? ivec2(0, 1) : ivec2(1, 0);
  // slot = (z, coverage, colour key, shade)
  vec4 s1 = vec4(-1.0, 0.0, 0.0, 1.0);
  vec4 s2 = s1, s3 = s1;

  for (int i = 0; i < STEPS; i++) {
    int j = i & 3;
    ivec2 o = ivec2(j & 1, j >> 1);
    if (i >= 4) {
      ivec2 e = ivec2((j & 1) * 3 - 1, j >> 1);
      o = (i < 8) ? e : e.yx;
    }
    ivec2 cell = base + o.x * A + o.y * B;

    uvec4 hu = pcg4d(uvec4(uvec2(cell + 16384), uint(k) * 131u + 7u, 2166u));
    vec4 ha = vec4(hu & 0xFFu) * (1.0 / 255.0);
    vec4 hb = vec4((hu >> 8u) & 0xFFu) * (1.0 / 255.0);
    vec4 hc = vec4((hu >> 16u) & 0xFFu) * (1.0 / 255.0);
    vec4 hd = vec4(hu >> 24u) * (1.0 / 255.0);
    if (hd.w < skip) continue;

    // dab centre: cell centre + jitter (+-0.25 cell); cheap bounding-circle
    // reject before the expensive part (the branch is coherent across a cell)
    vec2 C = (vec2(cell) + 0.5 + 0.5 * (ha.xy - 0.5)) * cs;
    vec2 r0 = c.p - C;
    float bound = 1.2 * cs + c.aa;            // >= max half length + half width + slide
    if (dot(r0, r0) > bound * bound) continue;

    // one per-dab phase drives the breathing twist, the slide and the colour breath
    float ph = c.tau * 3.0 + hb.x * TAU;
    float sph = sin(ph), cph = cos(ph);
    float ang = (ha.z - 0.5) * 0.2 + 0.07 * sph;
    vec2 d = rot(c.dir, ang);
    vec2 n = vec2(-d.y, d.x);
    vec2 r = r0 - d * (cs * 0.10 * cph);   // slow slide along the stroke axis
    float along = dot(r, d);
    float across = dot(r, n);
    float hl = cs * (0.50 + 0.30 * ha.w);   // half length: 0.50..0.80 cells
    float hw = cs * (0.13 + 0.14 * hb.z);   // half width : 0.13..0.27 cells
    float sd = length(vec2(max(abs(along) - (hl - hw), 0.0), across)) - hw;
    float cov = 1.0 - smoothstep(-c.aa, c.aa, sd);
    if (cov < 0.003) continue;

    // colour key: composition (horizon) + swirl potential + per-dab pick
    float comp = 0.5 - 0.5 * uHorizon * (C.y * uAspect * 2.0 - 1.0);
    float nC = c.nLow + dot(c.gLow, -r0);
    float t = comp * 0.6 + 0.15 + 0.4 * nC + 0.3 * (hc.z - 0.5) + bias
            + 0.03 * sph * (hd.y - 0.5);
    // per-dab value variation and a lit ridge across the stroke (impasto)
    float shade = (0.93 + 0.14 * hc.y)
                * (1.0 + 0.10 * clamp(across / hw, -1.0, 1.0) * dot(n, LIGHT));

    // keep the top three by z (select-based insertion, no divergent branches)
    vec4 s = vec4(hc.x + hd.x * (1.0 / 256.0), cov, min(t, tMax), shade);
    bool b1 = s.x > s1.x, b2 = s.x > s2.x, b3 = s.x > s3.x;
    vec4 n1 = b1 ? s : s1;
    vec4 n2 = b1 ? s1 : (b2 ? s : s2);
    vec4 n3 = b2 ? s2 : (b3 ? s : s3);
    s1 = n1; s2 = n2; s3 = n3;
  }
  col = mix(col, dabColor(s3.z) * s3.w, s3.y);
  col = mix(col, dabColor(s2.z) * s2.w, s2.y);
  col = mix(col, dabColor(s1.z) * s1.w, s1.y);
  return col;
}

void main() {
  // p: x spans 0..1 across the cover, y spans 0..1/aspect (cover-width units)
  vec2 p = vec2(vUv.x, vUv.y / uAspect);
  float px = abs(dFdx(p.x));
  float tau = uTime * uDrift * (TAU / 60.0);   // one cycle per minute at drift 1

  // ---- flow field: curl of domain-warped 2-octave gradient noise, rotated by seed ----
  vec2 ctr = vec2(0.5, 0.5 / uAspect);
  vec2 s = rot(p - ctr, uSeed) / uSwirl;
  // domain warp from one noise sample: its value and x-derivative make a 2D offset
  vec3 wn = noised(s * 0.5 + vec2(3.1, 7.3) + tau * vec2(0.08, 0.03));
  vec2 sw = s + vec2(0.9 * wn.x, 0.3 * wn.y);
  float ct = cos(tau), st = sin(tau);
  vec3 fa = fbm2(sw + vec2(0.7, 1.9));
  vec3 fb = fbm2(sw + vec2(17.3, 9.1));
  vec3 psi = ct * fa + st * fb;                 // periodic morph between two potentials
  vec2 dirS = normalize(vec2(psi.z, -psi.y) + vec2(1e-5, 0.0));
  vec2 dir = rot(dirS, -uSeed);

  // ---- the potential doubles as the low-frequency colour cloud (value + gradient
  //      in cover space, so each dab can evaluate it at its own centre) ----
  float nLow = psi.x;
  vec2 gLow = rot(psi.yz, -uSeed) / uSwirl;

  // ---- underpainting ----
  float compP = 0.5 - 0.5 * uHorizon * (vUv.y * 2.0 - 1.0);
  vec3 col = ramp(3.0 * pow(clamp(compP * 0.6 + 0.08 + 0.35 * nLow, 0.0, 1.0), 1.35)) * 0.8;

  // ---- three layers of dabs, coarse -> fine ----
  // The lightest stop is reserved for the small top-layer dabs (stars, highlights).
  Ctx c = Ctx(p, dir, px, nLow, gLow, tau);
  float cs0 = uStroke / 1.4;                     // coarse dab length ~ uStroke
  col = paintLayer(col, c, cs0,        0, 0.00, -0.04, 0.78);
  col = paintLayer(col, c, cs0 * 0.58, 1, 0.12,  0.02, 0.84);
  col = paintLayer(col, c, cs0 * 0.34, 2, 0.32,  0.15, 1.00);

  // ---- finish: 10% edge vignette, +-3% static grain ----
  float vig = 1.0 - 0.10 * smoothstep(0.5, 1.35, length(vUv * 2.0 - 1.0));
  float grain = hash1(ivec2(gl_FragCoord.xy)) * 2.0 - 1.0;
  col *= vig * (1.0 + 0.03 * grain);

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
