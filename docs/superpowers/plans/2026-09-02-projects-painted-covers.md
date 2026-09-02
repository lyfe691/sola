# Projects Painted Covers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the projects page's image covers with a live WebGL "painted" cover component that also powers the deep-dive hero, and collapse the featured/other split into one priority-sorted grid.

**Architecture:** A self-contained `src/components/painted-cover/` module (presets, shader, mount queue, near-viewport hook, component) renders an `ogl` fragment-shader quad only while a cover is near the viewport, over a CSS base gradient, with the caption as real DOM. `src/config/projects.ts` gains a required `art` field; taglines move into the six translation files; the projects page and the deep-dive hero consume the component; Silk and the static images are removed last.

**Tech Stack:** Vite 8, React 19, TypeScript strict, Tailwind v4, motion/react, `ogl` (already a dependency), vitest, bun.

**Spec:** `docs/superpowers/specs/2026-09-02-projects-painted-covers-design.md`

## Global Constraints

- Package manager is bun: `bun install`, `bun run <script>`; tests via `bun run test` (never `bun test`).
- Verify with: `bunx eslint <files>` (0 errors), `node node_modules/@typescript/native/bin/tsc -b`, `bunx prettier --end-of-line auto --check <files>`, `bun run test`, `bun run build`. The `bun run typecheck` and `bun run format:check` scripts fail on this Windows checkout for environmental reasons (shebang / CRLF); use the forms above.
- Token-only colors in components (`--background`, `--foreground` …). Exception recorded in the spec §1/§2: the cover art, its scrim, and its caption are theme-independent, so `bg-black/*` and `text-white` are used there deliberately, exactly as the existing deep-dive hero does.
- No user-facing string literals in components; add translation keys. `en.ts` defines the `Translation` type; every locale must mirror new keys. zh is Simplified.
- Motion: curves come from `src/utils/transitions.ts` / the `ease-*` utilities; never inline a cubic-bezier. Hover movement goes behind the `can-hover:` variant.
- `src/components/ui/` is vendored shadcn: prettier-ignored, do not reformat. `src/components/ui/custom/` is house code.
- Commit messages: conventional (`feat(projects): …`), no co-author trailer, no session link.
- Every commit must be green on its own (CI runs lint, typecheck, test, build on push).
- Workflows/agents: keep any fan-out to about a dozen agents.

---

## File map

Created:
- `src/components/painted-cover/presets.ts` — preset table, `ProjectArt`, `resolveArt`, `seedToAngle`, `baseGradient`
- `src/components/painted-cover/presets.test.ts`
- `src/components/painted-cover/mount-queue.ts` — one canvas creation per animation frame, nearest first
- `src/components/painted-cover/mount-queue.test.ts`
- `src/components/painted-cover/use-near-viewport.ts` — `{ near, visible }` from two IntersectionObservers
- `src/components/painted-cover/shader.ts` — vertex source, fragment body (tournament winner), `fragmentFor(steps)`
- `src/components/painted-cover/PaintedCover.tsx` — the component plus `CoverCaption`
- `src/config/projects.test.ts`

Modified:
- `src/config/projects.ts` — `art` field, removals
- `src/lib/translations/{en,de,es,ja,ko,zh}.ts` — `tagline` per project, three keys removed
- `scripts/find-unused-translations.ts` — mark `tagline` used
- `src/pages/Projects.tsx` — one grid, cover card
- `src/components/ScrollReveal.tsx`, `src/utils/transitions.ts` — drop the `feature` variant
- `src/components/ProjectDeepDive.tsx`, `src/pages/projects/ProjectDeepDiveRenderer.tsx`, `src/config/project-deep-dive.ts` — hero on `PaintedCover`

Deleted:
- `src/components/backgrounds/Silk.tsx`
- 12 files under `public/projects/` (listed in Task 9)

---

### Task 1: Presets and `resolveArt`

**Files:**
- Create: `src/components/painted-cover/presets.ts`
- Test: `src/components/painted-cover/presets.test.ts`

**Interfaces:**
- Produces: `ART_PRESETS`, `ArtPreset`, `ProjectArt { preset: ArtPreset; seed?: number }`, `PaintedPreset`, `PRESETS: Record<ArtPreset, PaintedPreset>`, `ResolvedArt`, `seedToAngle(n: number): number`, `resolveArt(art: ProjectArt): ResolvedArt`, `baseGradient(preset: PaintedPreset): string`.
- Note: `ProjectArt` is defined here (not in config) so `src/config/projects.ts` can import the type without a circular import.

- [ ] **Step 1: Write the failing test**

```ts
// src/components/painted-cover/presets.test.ts
/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
import {
  ART_PRESETS,
  PRESETS,
  baseGradient,
  resolveArt,
  seedToAngle,
} from "./presets";

const HEX = /^#[0-9a-f]{6}$/i;

describe("PRESETS", () => {
  it("defines every named preset with four hex stops and a horizon in [-1, 1]", () => {
    for (const name of ART_PRESETS) {
      const preset = PRESETS[name];
      expect(preset.palette).toHaveLength(4);
      for (const stop of preset.palette) expect(stop).toMatch(HEX);
      expect(preset.horizon).toBeGreaterThanOrEqual(-1);
      expect(preset.horizon).toBeLessThanOrEqual(1);
      expect(preset.swirl).toBeGreaterThan(0);
      expect(preset.stroke).toBeGreaterThan(0);
      expect(preset.drift).toBeGreaterThan(0);
    }
  });
});

describe("seedToAngle", () => {
  it("is stable and stays inside one turn", () => {
    expect(seedToAngle(3)).toBe(seedToAngle(3));
    for (let n = 0; n < 8; n++) {
      expect(seedToAngle(n)).toBeGreaterThanOrEqual(0);
      expect(seedToAngle(n)).toBeLessThan(2 * Math.PI);
    }
  });

  it("gives clearly distinct angles for seeds 0-7", () => {
    const angles = Array.from({ length: 8 }, (_, n) => seedToAngle(n));
    for (let i = 0; i < angles.length; i++) {
      for (let j = i + 1; j < angles.length; j++) {
        expect(Math.abs(angles[i] - angles[j])).toBeGreaterThan(0.3);
      }
    }
  });
});

describe("resolveArt", () => {
  it("merges the preset with a seed of 0 by default", () => {
    const art = resolveArt({ preset: "starry" });
    expect(art.palette).toEqual(PRESETS.starry.palette);
    expect(art.horizon).toBe(PRESETS.starry.horizon);
    expect(art.seed).toBe(0);
  });

  it("converts an integer seed to the golden-angle rotation", () => {
    expect(resolveArt({ preset: "wheat", seed: 2 }).seed).toBe(seedToAngle(2));
  });
});

describe("baseGradient", () => {
  it("uses all four stops and orients by horizon", () => {
    const top = baseGradient(PRESETS.starry); // horizon 1: dark at top
    const bottom = baseGradient(PRESETS.wheat); // horizon -1: dark at bottom
    for (const stop of PRESETS.starry.palette) expect(top).toContain(stop);
    expect(top).toContain("to bottom");
    expect(bottom).toContain("to top");
    expect(baseGradient(PRESETS.irises)).toContain("135deg");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test -- src/components/painted-cover/presets.test.ts`
Expected: FAIL, "Failed to resolve import ./presets".

- [ ] **Step 3: Write the implementation**

```ts
// src/components/painted-cover/presets.ts
/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Presets for the painted project covers, named after the paintings they
 * borrow their palettes from. The covers are artwork: these are literal
 * colors, the same in every theme, like the deep-dive hero has always been.
 */

export const ART_PRESETS = [
  "starry",
  "wheat",
  "irises",
  "almond",
  "cafe",
  "cypress",
] as const;

export type ArtPreset = (typeof ART_PRESETS)[number];

/** What a project declares in src/config/projects.ts. */
export interface ProjectArt {
  preset: ArtPreset;
  /** Rotates the flow field so two projects on one preset differ. Default 0. */
  seed?: number;
}

export interface PaintedPreset {
  /** 4 stops, dark to light; stop 0 is the base color painted before WebGL. */
  palette: [string, string, string, string];
  /** Where the darkest stop concentrates: -1 bottom, 0 even, 1 top. */
  horizon: number;
  /** Scale of the swirl field in cover widths (0.5 tight, 2 broad). */
  swirl: number;
  /** Stroke streak length as a fraction of cover width. */
  stroke: number;
  /** Field advection speed; 1 is one slow cycle per ~60s. */
  drift: number;
}

export const PRESETS: Record<ArtPreset, PaintedPreset> = {
  starry: {
    palette: ["#141f4d", "#26418f", "#5b8fd4", "#f4d35e"],
    horizon: 1,
    swirl: 1,
    stroke: 0.08,
    drift: 1,
  },
  wheat: {
    palette: ["#3b2a14", "#1f3a6e", "#c8961e", "#e9c55a"],
    horizon: -1,
    swirl: 1.4,
    stroke: 0.1,
    drift: 0.8,
  },
  irises: {
    palette: ["#2f2a5a", "#4b3f8f", "#7c6cc4", "#efe5c2"],
    horizon: 0,
    swirl: 0.8,
    stroke: 0.07,
    drift: 1,
  },
  almond: {
    palette: ["#2f5f66", "#4fa3a5", "#8fd0c8", "#f3efe4"],
    horizon: 0,
    swirl: 1.2,
    stroke: 0.06,
    drift: 0.9,
  },
  cafe: {
    palette: ["#12213a", "#1e3557", "#d98b3a", "#f2c14e"],
    horizon: 1,
    swirl: 1,
    stroke: 0.09,
    drift: 1,
  },
  cypress: {
    palette: ["#2f4a2c", "#7b9a5c", "#6fa3d0", "#e9eef2"],
    horizon: -1,
    swirl: 0.9,
    stroke: 0.1,
    drift: 1.1,
  },
};

export interface ResolvedArt extends PaintedPreset {
  /** Rotation of the flow-field domain, radians. */
  seed: number;
}

/** Golden-ratio spacing: distinct angles for small integers, stable across runs. */
export const seedToAngle = (n: number) => ((n * 0.618034) % 1) * 2 * Math.PI;

export function resolveArt(art: ProjectArt): ResolvedArt {
  return { ...PRESETS[art.preset], seed: seedToAngle(art.seed ?? 0) };
}

/** The CSS layer under the canvas: painted on first render, shown alone when
 *  WebGL is off or the cover is far from the viewport. */
export function baseGradient({ palette, horizon }: PaintedPreset): string {
  const direction =
    horizon > 0 ? "to bottom" : horizon < 0 ? "to top" : "135deg";
  const [p0, p1, p2, p3] = palette;
  return `linear-gradient(${direction}, ${p0}, ${p1} 45%, ${p2} 80%, ${p3})`;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun run test -- src/components/painted-cover/presets.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 5: Lint and format**

Run: `bunx eslint src/components/painted-cover/presets.ts src/components/painted-cover/presets.test.ts && bunx prettier --end-of-line auto --check src/components/painted-cover/presets.ts src/components/painted-cover/presets.test.ts`
Expected: no output from eslint, "All matched files use Prettier code style!" (run `bunx prettier --end-of-line auto --write` on them first if not).

No commit yet: Tasks 1–5 land together as rollout commit 1.

---

### Task 2: Mount queue

**Files:**
- Create: `src/components/painted-cover/mount-queue.ts`
- Test: `src/components/painted-cover/mount-queue.test.ts`

**Interfaces:**
- Produces: `createMountQueue(schedule?: (cb: () => void) => void)` returning `{ enqueue(job: MountJob): () => void; size: number }`, `MountJob { priority: () => number; run: () => void }`, and the shared `mountQueue` singleton (scheduled on `requestAnimationFrame`).
- Consumed by `PaintedCover` (Task 5): `mountQueue.enqueue({ priority, run })` → cancel function.

- [ ] **Step 1: Write the failing test**

```ts
// src/components/painted-cover/mount-queue.test.ts
/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
import { createMountQueue } from "./mount-queue";

/** A scheduler we drive by hand: one `tick()` runs one scheduled callback. */
const manualScheduler = () => {
  const pending: Array<() => void> = [];
  return {
    schedule: (cb: () => void) => {
      pending.push(cb);
    },
    tick: () => pending.shift()?.(),
    get pending() {
      return pending.length;
    },
  };
};

describe("createMountQueue", () => {
  it("runs one job per tick", () => {
    const s = manualScheduler();
    const queue = createMountQueue(s.schedule);
    const ran: string[] = [];
    queue.enqueue({ priority: () => 0, run: () => ran.push("a") });
    queue.enqueue({ priority: () => 0, run: () => ran.push("b") });
    expect(ran).toEqual([]);
    s.tick();
    expect(ran).toEqual(["a"]);
    s.tick();
    expect(ran).toEqual(["a", "b"]);
    expect(queue.size).toBe(0);
  });

  it("drains the nearest job first, re-reading priorities at drain time", () => {
    const s = manualScheduler();
    const queue = createMountQueue(s.schedule);
    const ran: string[] = [];
    let farDistance = 900;
    queue.enqueue({ priority: () => farDistance, run: () => ran.push("far") });
    queue.enqueue({ priority: () => 100, run: () => ran.push("near") });
    s.tick();
    expect(ran).toEqual(["near"]);
    farDistance = 0; // the page scrolled; priorities are live functions
    s.tick();
    expect(ran).toEqual(["near", "far"]);
  });

  it("cancels a job before it runs", () => {
    const s = manualScheduler();
    const queue = createMountQueue(s.schedule);
    const ran: string[] = [];
    const cancel = queue.enqueue({ priority: () => 0, run: () => ran.push("a") });
    queue.enqueue({ priority: () => 1, run: () => ran.push("b") });
    cancel();
    s.tick();
    s.tick();
    expect(ran).toEqual(["b"]);
  });

  it("schedules at most one tick at a time", () => {
    const s = manualScheduler();
    const queue = createMountQueue(s.schedule);
    queue.enqueue({ priority: () => 0, run: () => {} });
    queue.enqueue({ priority: () => 0, run: () => {} });
    queue.enqueue({ priority: () => 0, run: () => {} });
    expect(s.pending).toBe(1);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test -- src/components/painted-cover/mount-queue.test.ts`
Expected: FAIL, "Failed to resolve import ./mount-queue".

- [ ] **Step 3: Write the implementation**

```ts
// src/components/painted-cover/mount-queue.ts
/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Shader programs cannot be shared across WebGL contexts, and ogl compiles
 * and links synchronously, so creating six covers in one React commit would
 * stall the main thread for several frames at once — on page load and again
 * every time the grid remounts after a re-sort. This queue admits one
 * canvas creation per animation frame, nearest to the viewport first.
 */

export interface MountJob {
  /** Distance from the viewport in px; read when the job is picked, not when queued. */
  priority: () => number;
  run: () => void;
}

export function createMountQueue(
  schedule: (cb: () => void) => void = (cb) =>
    requestAnimationFrame(() => cb()),
) {
  const jobs = new Set<MountJob>();
  let scheduled = false;

  const tick = () => {
    if (scheduled) return;
    scheduled = true;
    schedule(drain);
  };

  const drain = () => {
    scheduled = false;
    let best: MountJob | undefined;
    let bestPriority = Infinity;
    for (const job of jobs) {
      const priority = job.priority();
      if (priority < bestPriority) {
        bestPriority = priority;
        best = job;
      }
    }
    if (!best) return;
    jobs.delete(best);
    best.run();
    if (jobs.size) tick();
  };

  return {
    enqueue(job: MountJob) {
      jobs.add(job);
      tick();
      return () => {
        jobs.delete(job);
      };
    },
    get size() {
      return jobs.size;
    },
  };
}

export const mountQueue = createMountQueue();
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun run test -- src/components/painted-cover/mount-queue.test.ts`
Expected: PASS, 4 tests.

- [ ] **Step 5: Lint and format**

Run: `bunx eslint src/components/painted-cover/mount-queue.ts src/components/painted-cover/mount-queue.test.ts && bunx prettier --end-of-line auto --check src/components/painted-cover/mount-queue.ts src/components/painted-cover/mount-queue.test.ts`
Expected: clean.

---

### Task 3: Near-viewport hook

**Files:**
- Create: `src/components/painted-cover/use-near-viewport.ts`

**Interfaces:**
- Produces: `useNearViewport(ref: RefObject<Element | null>, margin?: string): { near: boolean; visible: boolean }`.
- `near` = intersects the viewport expanded by `margin` (default `"50% 0px"`, i.e. half a viewport above and below). `visible` = intersects the viewport itself. Neither latches; both track scroll.

There is no DOM test runner in this repo (vitest runs in node, no jsdom), so this hook is covered by the owner's visual sign-off and the context-count check in Task 10.

- [ ] **Step 1: Write the hook**

```ts
// src/components/painted-cover/use-near-viewport.ts
/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useEffect, useState, type RefObject } from "react";

/**
 * Two observers, two questions: is the element close enough to deserve a
 * WebGL context (`near`, viewport ± margin), and is it actually on screen so
 * its frame loop should run (`visible`)? Both follow the scroll; neither
 * latches, unlike the reveal hook in transitions.ts.
 */
export function useNearViewport(
  ref: RefObject<Element | null>,
  margin = "50% 0px",
) {
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const nearObserver = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { rootMargin: margin },
    );
    const visibleObserver = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    nearObserver.observe(element);
    visibleObserver.observe(element);
    return () => {
      nearObserver.disconnect();
      visibleObserver.disconnect();
    };
  }, [ref, margin]);

  return { near, visible };
}
```

- [ ] **Step 2: Lint, format, typecheck**

Run: `bunx eslint src/components/painted-cover/use-near-viewport.ts && bunx prettier --end-of-line auto --check src/components/painted-cover/use-near-viewport.ts && node node_modules/@typescript/native/bin/tsc -b`
Expected: clean.

---

### Task 4: Shader module

**Files:**
- Create: `src/components/painted-cover/shader.ts`

**Interfaces:**
- Produces: `VERTEX: string`, `STEPS = { card: 8, hero: 12 } as const`, `fragmentFor(steps: number): string`.
- Uniform contract the fragment must declare (Task 5 sets exactly these): `uTime` (float, seconds), `uSeed` (float, radians), `uAspect` (float), `uResolution` (vec2, drawing-buffer px), `uPalette` (vec3[4]), `uHorizon`, `uSwirl`, `uStroke`, `uDrift` (floats). `STEPS` is a `#define` prepended by `fragmentFor`, so the body must not declare it.

The fragment body is the winner of the shader tournament (workflow `painted-cover-shader-tournament`; variants live in the session scratchpad under `tournament/variant-N.html`, and the judges' JSON names the winner and a graftable idea). Copy the winning page's fragment source into `FRAGMENT_BODY`, minus its `#version 300 es` line and minus any `#define STEPS` line, then apply the graft if the judges named one and it does not hurt the cost criteria.

- [ ] **Step 1: Write the module**

```ts
// src/components/painted-cover/shader.ts
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

// Tournament winner. Uniform contract: uTime, uSeed, uAspect, uResolution,
// uPalette[4], uHorizon, uSwirl, uStroke, uDrift. STEPS is prepended.
const FRAGMENT_BODY = `precision highp float;
/* … winning fragment source, verbatim, without #version / #define STEPS … */
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
```

The comment placeholder inside `FRAGMENT_BODY` above is the only spot this plan cannot pre-write: it is replaced by the tournament winner's GLSL when this task runs. The rest of the file is final.

- [ ] **Step 2: Sanity-check the GLSL by building a one-off page**

Copy `tournament/variant-<winner>.html` to `tournament/final.html`, replace its inline fragment with `fragmentFor(8)`'s output (paste the string), open it in Chrome via the same static server the tournament used, and confirm: no console errors, `window.__ready === true`, `avgFrameMs < 2`, `compileMs < 60`. Screenshot once for the record.

- [ ] **Step 3: Lint, format, typecheck**

Run: `bunx eslint src/components/painted-cover/shader.ts && bunx prettier --end-of-line auto --check src/components/painted-cover/shader.ts && node node_modules/@typescript/native/bin/tsc -b`
Expected: clean.

---

### Task 5: `PaintedCover` and `CoverCaption`

**Files:**
- Create: `src/components/painted-cover/PaintedCover.tsx`

**Interfaces:**
- Consumes: `resolveArt`, `baseGradient`, `ProjectArt`, `ResolvedArt` (Task 1); `mountQueue` (Task 2); `useNearViewport` (Task 3); `VERTEX`, `STEPS`, `fragmentFor` (Task 4).
- Produces: `PaintedCover(props: PaintedCoverProps)` and `CoverCaption({ title, subtitle, as? })`, both named exports.

```ts
export interface PaintedCoverProps {
  art: ProjectArt;
  /** card: aspect 16/9, STEPS 8. hero: fills its box (pass className="absolute inset-0"), STEPS 12. */
  size: "card" | "hero";
  /** caption: bottom black gradient over the lower half. dim: full-box black/20. none. */
  scrim?: "caption" | "dim" | "none";
  /** Stops the frame loop; the last frame stays on screen. */
  paused?: boolean;
  /** Fires once: after the first WebGL frame, or immediately if WebGL is unavailable. */
  onReady?: () => void;
  children?: ReactNode;
  className?: string;
}
export interface CoverCaptionProps {
  title: string;
  subtitle: string;
  as?: "h2" | "h3";
}
```

- [ ] **Step 1: Write the component**

```tsx
// src/components/painted-cover/PaintedCover.tsx
/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Live painted cover art for project cards and the deep-dive hero.
 *
 * Layers, bottom to top: a CSS gradient from the preset (always painted, so
 * nothing is ever blank), an ogl shader canvas that exists only while the
 * cover is near the viewport and renders only while it is on screen, a scrim,
 * and the caller's caption. The art, scrim and caption are deliberately
 * theme-independent: the painting is the same in every theme, so the
 * overlays are black/white rather than tokens — the same call the hero has
 * always made.
 *
 * Contexts are the scarce resource (Chrome caps a page around 16 and the
 * site background holds one), so canvases mount through a queue, one per
 * animation frame, and are released with WEBGL_lose_context on unmount.
 */

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Color, Mesh, Program, Renderer, Triangle } from "ogl";
import { cn } from "@/lib/utils";
import { mountQueue } from "./mount-queue";
import {
  baseGradient,
  resolveArt,
  type ProjectArt,
  type ResolvedArt,
} from "./presets";
import { STEPS, VERTEX, fragmentFor } from "./shader";
import { useNearViewport } from "./use-near-viewport";

export interface PaintedCoverProps {
  art: ProjectArt;
  /** card: aspect 16/9, STEPS 8. hero: fills its box (pass className="absolute inset-0"), STEPS 12. */
  size: "card" | "hero";
  /** caption: bottom black gradient over the lower half. dim: full-box black/20. none. */
  scrim?: "caption" | "dim" | "none";
  /** Stops the frame loop; the last frame stays on screen. */
  paused?: boolean;
  /** Fires once: after the first WebGL frame, or immediately if WebGL is unavailable. */
  onReady?: () => void;
  children?: ReactNode;
  className?: string;
}

const SCRIM_CLASS = {
  caption:
    "absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/70 to-transparent",
  dim: "absolute inset-0 bg-black/20",
  none: "hidden",
} as const;

/** One mounted canvas: created by the queue, driven by the running flag. */
interface CoverController {
  setRunning: (running: boolean) => void;
  renderOnce: () => void;
  dispose: () => void;
}

const toRGB = (hex: string) => {
  const c = new Color(hex);
  return [c.r, c.g, c.b] as [number, number, number];
};

/** Px between the element and the viewport; 0 when on screen. */
const distanceToViewport = (element: Element) => {
  const rect = element.getBoundingClientRect();
  if (rect.bottom < 0) return -rect.bottom;
  if (rect.top > window.innerHeight) return rect.top - window.innerHeight;
  return 0;
};

/**
 * Builds the renderer, program and loop for one cover. Returns null when a
 * context cannot be created (WebGL off, context cap, link failure) so the
 * caller keeps the base gradient.
 */
function createCover(
  host: HTMLElement,
  art: ResolvedArt,
  size: PaintedCoverProps["size"],
  time: { current: number },
  onFirstFrame: () => void,
): CoverController | null {
  let renderer: Renderer;
  let program: Program;
  try {
    renderer = new Renderer({
      dpr: 1,
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: "low-power",
    });
    if (!renderer.isWebgl2) throw new Error("WebGL2 unavailable");
    const gl = renderer.gl;
    program = new Program(gl, {
      vertex: VERTEX,
      fragment: fragmentFor(STEPS[size]),
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTime: { value: time.current },
        uSeed: { value: art.seed },
        uAspect: { value: 16 / 9 },
        uResolution: { value: [1, 1] },
        uPalette: { value: art.palette.map(toRGB) },
        uHorizon: { value: art.horizon },
        uSwirl: { value: art.swirl },
        uStroke: { value: art.stroke },
        uDrift: { value: art.drift },
      },
    });
    if (!gl.getProgramParameter(program.program, gl.LINK_STATUS)) {
      throw new Error("shader failed to link");
    }
  } catch (error) {
    console.warn("[PaintedCover] keeping the base gradient:", error);
    return null;
  }

  const gl = renderer.gl;
  const canvas = gl.canvas as HTMLCanvasElement;
  const geometry = new Triangle(gl);
  const mesh = new Mesh(gl, { geometry, program });

  let raf = 0;
  let last = 0;
  let running = false;
  let firstFrame = false;

  const render = () => {
    program.uniforms.uTime.value = time.current;
    renderer.render({ scene: mesh });
    if (!firstFrame) {
      firstFrame = true;
      onFirstFrame();
    }
  };

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    // clamped delta: a hidden tab or a pause must not fast-forward the field
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
    last = now;
    time.current += dt;
    render();
  };

  const setRunning = (next: boolean) => {
    if (next === running) return;
    running = next;
    if (next) {
      last = 0;
      raf = requestAnimationFrame(frame);
    } else {
      cancelAnimationFrame(raf);
    }
  };

  // offsetWidth/Height, not client rects: the route transition scales the
  // page and corrupts rects (Silk documented the same trap)
  const resize = () => {
    const width = host.offsetWidth;
    const height = host.offsetHeight;
    if (!width || !height) return;
    renderer.setSize(Math.round(width), Math.round(height));
    // ogl writes px sizes; cover the fractional box instead
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    program.uniforms.uAspect.value = width / height;
    program.uniforms.uResolution.value = [
      gl.drawingBufferWidth,
      gl.drawingBufferHeight,
    ];
    // setSize clears the buffer to black, so always draw one frame, even paused
    render();
  };

  const onContextLost = (event: Event) => {
    event.preventDefault();
    setRunning(false);
    canvas.style.opacity = "0";
  };

  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.className = "block";
  host.appendChild(canvas);
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();

  return {
    setRunning,
    renderOnce: render,
    dispose: () => {
      setRunning(false);
      observer.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    },
  };
}

export function PaintedCover({
  art,
  size,
  scrim = "caption",
  paused = false,
  onReady,
  children,
  className,
}: PaintedCoverProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const { near, visible } = useNearViewport(rootRef);
  const resolved = useMemo(() => resolveArt(art), [art]);
  const [controller, setController] = useState<CoverController | null>(null);
  const [ready, setReady] = useState(false);

  // survives canvas remounts so the field never jumps; resets with the art
  const time = useRef(0);
  useEffect(() => {
    time.current = 0;
  }, [resolved]);

  const onReadyRef = useRef(onReady);
  useEffect(() => {
    onReadyRef.current = onReady;
  });
  const readyFired = useRef(false);
  const fireReady = () => {
    if (readyFired.current) return;
    readyFired.current = true;
    onReadyRef.current?.();
  };

  // mount the canvas while near, through the one-per-frame queue
  useEffect(() => {
    const host = hostRef.current;
    if (!host || !near) return;
    let cancelled = false;
    let cover: CoverController | null = null;
    const cancelQueue = mountQueue.enqueue({
      priority: () => distanceToViewport(host),
      run: () => {
        if (cancelled) return;
        cover = createCover(host, resolved, size, time, () => {
          setReady(true);
          fireReady();
        });
        if (cover) setController(cover);
        else fireReady();
      },
    });
    return () => {
      cancelled = true;
      cancelQueue();
      cover?.dispose();
      setController(null);
      setReady(false);
    };
    // fireReady is stable by construction (refs only)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [near, resolved, size]);

  // one flag drives the loop; one sync point for every input
  useEffect(() => {
    if (!controller) return;
    const sync = () =>
      controller.setRunning(visible && !paused && !document.hidden);
    const onVisibility = () => {
      sync();
      if (!document.hidden) controller.renderOnce();
    };
    sync();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      controller.setRunning(false);
    };
  }, [controller, visible, paused]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative overflow-hidden",
        size === "card" && "aspect-video",
        className,
      )}
    >
      <div
        ref={hostRef}
        className={cn(
          "absolute inset-0",
          size === "card" &&
            "transition-transform duration-500 ease-out can-hover:group-hover:scale-[1.03]",
        )}
        style={{ backgroundImage: baseGradient(resolved) }}
      />
      {/* the canvas fades in over the gradient once its first frame exists */}
      <style>{`[data-cover-ready="false"] canvas { opacity: 0 } [data-cover-ready] canvas { transition: opacity 700ms var(--ease-out) }`}</style>
      <div className={SCRIM_CLASS[scrim]} aria-hidden="true" />
      {children}
      <span hidden data-cover-ready={ready} />
    </div>
  );
}

export interface CoverCaptionProps {
  title: string;
  subtitle: string;
  /** h2 on the projects page (the page has one h1 and no other h2s), h3 elsewhere. */
  as?: "h2" | "h3";
}

/** Title and tagline as real DOM text over the art: selectable, localized, indexable. */
export function CoverCaption({
  title,
  subtitle,
  as: Heading = "h3",
}: CoverCaptionProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-5 text-white sm:p-6">
      <Heading className="text-xl font-semibold tracking-tight text-balance sm:text-2xl">
        {title}
      </Heading>
      <p className="text-sm text-white/80">{subtitle}</p>
    </div>
  );
}
```

Implementation note on the fade: the `<style>` tag above is a sketch of the intent; the implementer should instead put the fade on the host element directly — `hostRef` div gets `data-ready={ready}` and the class `[&>canvas]:opacity-0 [&>canvas]:transition-opacity [&>canvas]:duration-700 [&>canvas]:ease-out data-[ready=true]:[&>canvas]:opacity-100` — and drop both the `<style>` and the hidden `<span>`. That keeps everything in Tailwind and on the site's `ease-out` token.

- [ ] **Step 2: Lint, format, typecheck, build**

Run: `bunx eslint src/components/painted-cover/PaintedCover.tsx && bunx prettier --end-of-line auto --check src/components/painted-cover/PaintedCover.tsx && node node_modules/@typescript/native/bin/tsc -b && bun run build`
Expected: clean. If eslint flags the `exhaustive-deps` disable, restructure `fireReady` into a `useCallback` with no deps instead of the comment.

- [ ] **Step 3: Rollout commit 1**

```bash
git add src/components/painted-cover
git commit -m "feat(painted-cover): live shader cover art component

Presets named after paintings, a curl-noise streak shader with a
compile-time step count, a one-canvas-per-frame mount queue, a
near-viewport hook, and the PaintedCover component with its caption.
Nothing consumes it yet."
```

---

### Task 6: Taglines in six locales, three keys removed

**Files:**
- Modify: `src/lib/translations/en.ts` (projects block, lines ~262–364), `de.ts`, `es.ts`, `ja.ts`, `ko.ts`, `zh.ts` (same block in each)
- Modify: `scripts/find-unused-translations.ts:164-167`

**Interfaces:**
- Produces: `Translation["projects"]["list"][key].tagline: string` for all 16 keys; removes `projects.other`, `projects.otherInfo`, `projects.satoriAttribution`.
- Consumed by Tasks 7–9 (`t.projects.list[key].tagline`).

- [ ] **Step 1: Remove the three keys from every locale**

In each of the six files delete the `other`, `otherInfo`, and `satoriAttribution` entries from the `projects` block. In `en.ts` they are:

```ts
    other: "Other Projects",
    otherInfo:
      "Non‑featured projects: smaller tools, experiments, and utilities.",
    // …
    satoriAttribution:
      "Image created with [Vercel Satori](https://og-playground.vercel.app/)",
```

- [ ] **Step 2: Add `tagline` to every project entry**

Insert `tagline` between `title` and `description` in each of the 16 entries. Exact strings per locale:

en:
```
codeExtractor  "Extract code with one click"
applicare      "Manage your job applications with ease"
osint          "Sharpen your investigative instincts"
chatapp        "Real-time rooms, built on Spring Boot"
vmDetector     "Know when you're running in a VM"
viewCounter    "A page view counter on Redis"
dockerService  "MediaWiki, Nextcloud, and Gogs in Compose"
phishing       "A hands-on look at how phishing pages work"
otw            "Bandit, level by level"
sola           "Modern portfolio in React and TypeScript"
kinoa          "Free streaming, no noise"
self           "Neofetch, reimagined for Windows"
taco           "A production-ready Next.js template"
thoughts       "Reflections, fragments, and notes"
magi           "Async port scanning, built to be correct"
luma           "Bring your own keys, talk to any model"
```

de:
```
codeExtractor  "Code mit einem Klick extrahieren"
applicare      "Bewerbungen mühelos im Griff"
osint          "Schärfe deinen Ermittlerblick"
chatapp        "Chaträume in Echtzeit, auf Spring Boot"
vmDetector     "Erkennt, ob du in einer VM läufst"
viewCounter    "Ein Seitenaufruf-Zähler auf Redis"
dockerService  "MediaWiki, Nextcloud und Gogs per Compose"
phishing       "Wie Phishing-Seiten funktionieren"
otw            "Bandit, Level für Level"
sola           "Modernes Portfolio in React und TypeScript"
kinoa          "Kostenlos streamen, ohne Lärm"
self           "Neofetch, neu gedacht für Windows"
taco           "Ein produktionsreifes Next.js-Template"
thoughts       "Gedanken, Fragmente und Notizen"
magi           "Asynchrones Port-Scanning, korrekt gebaut"
luma           "Eigene Keys, jedes Modell"
```

es:
```
codeExtractor  "Extrae código con un clic"
applicare      "Gestiona tus candidaturas sin esfuerzo"
osint          "Afina tu instinto investigador"
chatapp        "Salas en tiempo real sobre Spring Boot"
vmDetector     "Detecta si corres en una máquina virtual"
viewCounter    "Un contador de vistas sobre Redis"
dockerService  "MediaWiki, Nextcloud y Gogs con Compose"
phishing       "Cómo funcionan las páginas de phishing"
otw            "Bandit, nivel a nivel"
sola           "Portafolio moderno en React y TypeScript"
kinoa          "Streaming gratis, sin ruido"
self           "Neofetch, reinventado para Windows"
taco           "Una plantilla Next.js lista para producción"
thoughts       "Reflexiones, fragmentos y notas"
magi           "Escaneo de puertos asíncrono y correcto"
luma           "Trae tus claves, habla con cualquier modelo"
```

ja:
```
codeExtractor  "ワンクリックでコードを抽出"
applicare      "応募管理をもっと手軽に"
osint          "調査スキルを磨く"
chatapp        "Spring Boot製のリアルタイムチャット"
vmDetector     "仮想マシン上かどうかを判定"
viewCounter    "Redisで動くページビューカウンター"
dockerService  "ComposeでMediaWiki・Nextcloud・Gogsを構築"
phishing       "フィッシングページの仕組みを学ぶ"
otw            "Banditをレベルごとに攻略"
sola           "ReactとTypeScriptで作るモダンなポートフォリオ"
kinoa          "無料でストリーミング、ノイズなし"
self           "Windows向けに再構築したNeofetch"
taco           "本番対応のNext.jsテンプレート"
thoughts       "思索、断片、そしてメモ"
magi           "正確さを重視した非同期ポートスキャナ"
luma           "自分のキーで、どのモデルとも"
```

ko:
```
codeExtractor  "클릭 한 번으로 코드 추출"
applicare      "지원 현황을 손쉽게 관리"
osint          "조사 감각을 날카롭게"
chatapp        "Spring Boot 기반 실시간 채팅방"
vmDetector     "가상 머신에서 실행 중인지 감지"
viewCounter    "Redis 기반 페이지 조회수 카운터"
dockerService  "Compose로 MediaWiki, Nextcloud, Gogs 배포"
phishing       "피싱 페이지의 작동 원리 배우기"
otw            "Bandit, 레벨별 공략"
sola           "React와 TypeScript로 만든 모던 포트폴리오"
kinoa          "무료 스트리밍, 군더더기 없이"
self           "Windows를 위해 다시 만든 Neofetch"
taco           "프로덕션 준비된 Next.js 템플릿"
thoughts       "생각, 조각, 그리고 메모"
magi           "정확함을 우선한 비동기 포트 스캐너"
luma           "내 키로 어떤 모델과도 대화"
```

zh (Simplified, no spaces around Latin words, matching the existing titles):
```
codeExtractor  "一键提取网站代码"
applicare      "轻松管理求职申请"
osint          "磨炼你的调查直觉"
chatapp        "基于Spring Boot的实时聊天室"
vmDetector     "判断是否运行在虚拟机中"
viewCounter    "基于Redis的页面访问计数器"
dockerService  "用Compose部署MediaWiki、Nextcloud和Gogs"
phishing       "了解钓鱼网页的运作方式"
otw            "Bandit，逐关攻略"
sola           "React与TypeScript打造的现代作品集"
kinoa          "免费观影，纯净无扰"
self           "为Windows重塑的Neofetch"
taco           "可直接上线的Next.js模板"
thoughts       "思绪、片段与笔记"
magi           "以正确性为先的异步端口扫描器"
luma           "自带密钥，畅聊任意模型"
```

- [ ] **Step 3: Mark the key as used in the audit script**

In `scripts/find-unused-translations.ts` the loop over `PROJECTS` becomes:

```ts
  for (const project of PROJECTS) {
    addPath(used, `projects.list.${project.i18nKey}.title`);
    addPath(used, `projects.list.${project.i18nKey}.tagline`);
    addPath(used, `projects.list.${project.i18nKey}.description`);
  }
```

- [ ] **Step 4: Typecheck — this is the guard**

Run: `node node_modules/@typescript/native/bin/tsc -b`
Expected: errors ONLY in `src/pages/Projects.tsx` (it still reads `t.projects.other`, `otherInfo`, `satoriAttribution`). Those are fixed in Task 8. Any error in a locale file means a key is missing or misspelled there.

- [ ] **Step 5: Format**

Run: `bunx prettier --end-of-line auto --write src/lib/translations/*.ts scripts/find-unused-translations.ts && bunx prettier --end-of-line auto --check src/lib/translations/*.ts scripts/find-unused-translations.ts`
Expected: clean.

---

### Task 7: Config gains `art`, loses `image`/`featured`/`vercelSatori`

**Files:**
- Modify: `src/config/projects.ts`
- Test: `src/config/projects.test.ts`

**Interfaces:**
- Consumes: `ProjectArt` from `src/components/painted-cover/presets` (Task 1).
- Produces: `ProjectMeta.art: ProjectArt` (required); `ProjectMeta.image`, `.featured`, `.vercelSatori` no longer exist. `deepDive.silk`, `deepDive.tagline`, and `ProjectSilk` STAY in this task (the hero still compiles against them until Task 9).

- [ ] **Step 1: Write the failing test**

```ts
// src/config/projects.test.ts
/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
import { PRESETS } from "../components/painted-cover/presets";
import { PROJECTS } from "./projects";

describe("PROJECTS", () => {
  it("names an existing art preset on every project", () => {
    for (const project of PROJECTS) {
      expect(PRESETS).toHaveProperty(project.art.preset);
    }
  });

  it("has unique priorities, contiguous from 1", () => {
    const priorities = [...PROJECTS.map((p) => p.priority)].sort(
      (a, b) => a - b,
    );
    expect(priorities).toEqual(priorities.map((_, i) => i + 1));
  });

  it("pairs every slug with a deep dive", () => {
    for (const project of PROJECTS) {
      if (project.slug) expect(project.deepDive).toBeDefined();
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test -- src/config/projects.test.ts`
Expected: FAIL on "names an existing art preset" — `project.art` is undefined (and a type error in the editor).

- [ ] **Step 3: Change the type**

In `src/config/projects.ts`:

```ts
import type { ProjectDate } from "@/lib/dates";
import type { Translation } from "@/lib/translations";
import type { ProjectArt } from "@/components/painted-cover/presets";

export type { ProjectArt };
```

and in `ProjectMeta` delete `image?: string;`, `featured: boolean;`, `vercelSatori?: boolean;` and add:

```ts
  /** Painted cover art: a named preset plus a seed that rotates its flow field. */
  art: ProjectArt;
```

Leave `ProjectSilk`, `ProjectDeepDiveMeta.silk`, and `ProjectDeepDiveMeta.tagline` untouched in this task.

- [ ] **Step 4: Update the 16 entries**

For every entry remove the `image:`, `featured:`, and `vercelSatori:` lines, delete the stray `// non-featured projects` comment, and add `art` right after `priority`:

```
magi            art: { preset: "irises", seed: 0 }
kinoa           art: { preset: "cafe", seed: 0 }
sola            art: { preset: "starry", seed: 0 }
luma            art: { preset: "almond", seed: 0 }
applicare       art: { preset: "wheat", seed: 0 }
self            art: { preset: "starry", seed: 1 }
code-extractor  art: { preset: "wheat", seed: 1 }
thoughts        art: { preset: "almond", seed: 1 }
taco            art: { preset: "wheat", seed: 2 }
osint           art: { preset: "cypress", seed: 0 }
chatapp         art: { preset: "irises", seed: 1 }
vm-detector     art: { preset: "cypress", seed: 1 }
view-counter    art: { preset: "starry", seed: 2 }
docker-service  art: { preset: "irises", seed: 2 }
phishing        art: { preset: "cafe", seed: 1 }
otw             art: { preset: "cypress", seed: 2 }
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `bun run test -- src/config/projects.test.ts`
Expected: PASS, 3 tests.

- [ ] **Step 6: Lint and format**

Run: `bunx eslint src/config/projects.ts src/config/projects.test.ts && bunx prettier --end-of-line auto --check src/config/projects.ts src/config/projects.test.ts`
Expected: clean. Typecheck still fails only in `src/pages/Projects.tsx` (next task).

---

### Task 8: Projects page on one grid with painted cards

**Files:**
- Modify: `src/pages/Projects.tsx`
- Modify: `src/components/ScrollReveal.tsx:14,38,75` (remove the `feature` variant)
- Modify: `src/utils/transitions.ts` (remove `D_FEATURE`, `scrollFeatureVariants`; rewrite the `staggerDelay` comment)

**Interfaces:**
- Consumes: `PaintedCover`, `CoverCaption` (Task 5); `t.projects.list[key].tagline` (Task 6); `project.art` (Task 7).
- Produces: nothing new. `ProjectGrid` becomes `({ projects, t, lead = 0, className })`.

- [ ] **Step 1: Remove the `feature` reveal variant**

`src/utils/transitions.ts`: delete `const D_FEATURE = 0.7;`, delete the `scrollFeatureVariants` export and its comment block, and replace the `staggerDelay` doc comment with:

```ts
/** index delay (ms) for a grid's load or re-sort cascade, capped so late
 * cards never wait. Only applied while the grid is entering (see
 * useEntranceWindow); a card scrolled to later rises at once. */
export const staggerDelay = (index: number) => Math.min(index * 80, 240);
```

`src/components/ScrollReveal.tsx`: remove `scrollFeatureVariants` from the import, remove the `- feature: …` doc line, remove `| "feature"` from the `variant` union, and remove `feature: scrollFeatureVariants,` from `ANIMATION_VARIANTS`.

- [ ] **Step 2: Rewrite the page**

Replace the top of `src/pages/Projects.tsx` down to `cardClassName` with:

```tsx
import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight01Icon,
  Calendar03Icon,
  Calendar04Icon,
  FileSearchIcon,
  Github01Icon,
  ArrowDownAZIcon,
  ArrowUpZAIcon,
  SortByDown01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Link } from "react-router";
import type { Language } from "@/config/languages";
import { formatProjectDate, INTL_LOCALE } from "@/lib/dates";
import { useLanguage } from "@/lib/language-provider";
import {
  PROJECT_SORT_OPTIONS,
  sortProjects,
  type ProjectSortOption,
} from "@/lib/project-sort";
import { translations, type Translation } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconButton } from "@/components/ui/custom/icon-button";
import ScrollReveal from "@/components/ScrollReveal";
import {
  CONSUME_IN,
  HEADER_LEAD,
  staggerDelay,
  useEntranceWindow,
  scrollPageTitleVariants,
  scrollSubtleVariants,
} from "@/utils/transitions";
import { RichText } from "@/components/i18n/RichText";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TagRow } from "@/components/ui/custom/tag-row";
import {
  CoverCaption,
  PaintedCover,
} from "@/components/painted-cover/PaintedCover";
import { PROJECTS, type ProjectMeta } from "@/config/projects";

interface Project extends ProjectMeta {
  title: string;
  tagline: string;
  description: string;
  /** Preformatted for the active locale — set once in localizeProjects. */
  dateLabel: string;
}
```

Keep `SortOptionItem`, `SORT_ICONS`, `SORT_LABELS`, `buildSortOptions` exactly as they are. `localizeProjects` adds the tagline:

```tsx
const localizeProjects = (t: Translation, language: Language): Project[] => {
  const locale = INTL_LOCALE[language];
  const present = t.common.present;
  return PROJECTS.map((p) => ({
    ...p,
    title: t.projects.list[p.i18nKey].title,
    tagline: t.projects.list[p.i18nKey].tagline,
    description: t.projects.list[p.i18nKey].description,
    dateLabel: formatProjectDate(locale, p.date, present),
  }));
};

const cardClassName =
  "group h-full gap-0 overflow-hidden bg-card/40 p-0 backdrop-blur-md transition-shadow duration-300 hover:shadow-lg";
```

Delete the whole `ProjectImage` component. Keep `ProjectActions` unchanged. `ProjectBody` loses its heading:

```tsx
const ProjectBody = ({ project, t }: { project: Project; t: Translation }) => (
  <div className="flex h-full flex-col gap-4 p-5 sm:p-6">
    <time
      className="font-mono text-xs text-foreground/60"
      dateTime={project.date.start}
    >
      {project.dateLabel}
    </time>
    <p className="flex-1 text-sm text-foreground/60">
      <RichText text={project.description} />
    </p>
    {project.technologies.length > 0 && <TagRow tags={project.technologies} />}
    <ProjectActions project={project} t={t} />
  </div>
);

const ProjectCard = ({ project, t }: { project: Project; t: Translation }) => (
  <Card className={cardClassName}>
    <PaintedCover art={project.art} size="card">
      <CoverCaption as="h2" title={project.title} subtitle={project.tagline} />
    </PaintedCover>
    <ProjectBody project={project} t={t} />
  </Card>
);
```

`listExit` stays. `ProjectGrid` simplifies to:

```tsx
/**
 * The grid of cards. Keyed by the sort under AnimatePresence, so a re-sort
 * dissolves the old grid and mounts this one fresh — every card that lands
 * in view then rises in one cascade, the way the page loaded, and the
 * covers re-create their canvases through the mount queue. A fresh mount
 * also reopens the cascade window.
 */
const ProjectGrid = ({
  projects,
  t,
  lead = 0,
  className,
}: {
  projects: Project[];
  t: Translation;
  /** Wait for the page chrome before the first card (load only). */
  lead?: number;
  className: string;
}) => {
  const entering = useEntranceWindow();

  return (
    <motion.div exit={listExit} className={className}>
      {projects.map((project, index) => (
        <ScrollReveal
          key={project.id}
          delay={entering ? lead + staggerDelay(index) : 0}
          className="h-full"
        >
          <ProjectCard project={project} t={t} />
        </ScrollReveal>
      ))}
    </motion.div>
  );
};
```

In `Projects`, the sorted memo returns the single list:

```tsx
  const projects = useMemo(
    () =>
      sortProjects(
        localizeProjects(t, language),
        sortBy,
        INTL_LOCALE[language],
      ),
    [t, language, sortBy],
  );
```

and everything between the header `</ScrollReveal>` and the "View All Projects" block becomes:

```tsx
      <AnimatePresence mode="wait">
        <ProjectGrid
          key={sortBy}
          projects={projects}
          t={t}
          lead={entering ? HEADER_LEAD : 0}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8"
        />
      </AnimatePresence>
```

Remove the now-unused imports (`InformationCircleIcon`, `Tooltip*`, `Skeleton`, `cn`) — eslint will list any left over.

- [ ] **Step 3: Verify**

Run: `bunx eslint src/pages/Projects.tsx src/components/ScrollReveal.tsx src/utils/transitions.ts && bunx prettier --end-of-line auto --write src/pages/Projects.tsx src/components/ScrollReveal.tsx src/utils/transitions.ts && node node_modules/@typescript/native/bin/tsc -b && bun run test && bun run build`
Expected: all clean; typecheck is fully green again (the hero still uses `silk`/`tagline`, which still exist).

- [ ] **Step 4: Rollout commit 2**

```bash
git add src/config/projects.ts src/config/projects.test.ts src/lib/translations scripts/find-unused-translations.ts src/pages/Projects.tsx src/components/ScrollReveal.tsx src/utils/transitions.ts
git commit -m "feat(projects): one painted grid, taglines in every locale

Every project declares a cover-art preset instead of an image; the
featured/other split is gone in favour of one priority-sorted grid of
cards with a live painted cover carrying the title and a localized
tagline. Removes the Satori badge and the other-projects copy."
```

---

### Task 9: Deep-dive hero on `PaintedCover`, Silk removed

**Files:**
- Modify: `src/config/projects.ts` (remove `ProjectSilk`, `deepDive.silk`, `deepDive.tagline` from the type and all 9 entries)
- Modify: `src/config/project-deep-dive.ts`
- Modify: `src/components/ProjectDeepDive.tsx`
- Modify: `src/pages/projects/ProjectDeepDiveRenderer.tsx:177-189,289`
- Delete: `src/components/backgrounds/Silk.tsx`

**Interfaces:**
- Consumes: `PaintedCover` (Task 5), `ProjectMeta.art` (Task 7), `tagline` (Task 6).
- Produces: `ProjectPageConfig.art: ProjectArt` (no `silk`, no `tagline`); `ProjectDeepDiveProps { title; subtitle; description; art; sectionNav?; children? }`.

- [ ] **Step 1: Config**

`src/config/projects.ts`: delete the `ProjectSilk` interface; in `ProjectDeepDiveMeta` delete `tagline?: string;` and `silk: ProjectSilk;`; in each of the 9 `deepDive` objects delete the `tagline:` and `silk: { … }` entries.

`src/config/project-deep-dive.ts`:

```ts
import {
  PROJECTS,
  type ProjectArt,
  type ProjectDeepDiveMeta,
  type ProjectI18nKey,
  type ProjectMeta,
} from "./projects";

export interface ProjectPageConfig {
  slug: string;
  i18nKey: ProjectI18nKey;
  mdxPath: string;
  overview: string;
  technologies: string[];
  date: ProjectMeta["date"];
  links: {
    live?: string;
    github?: string;
    demo?: string;
  };
  art: ProjectArt;
}
```

and in `toPageConfig` replace `tagline: project.deepDive.tagline,` with nothing and `silk: project.deepDive.silk,` with `art: project.art,`.

- [ ] **Step 2: Hero**

`src/components/ProjectDeepDive.tsx`: update the header comment ("the painted hero in the project's own palette"), change the React import to `useCallback, useEffect, useLayoutEffect, useState, type ReactNode` (drop `Suspense`, `lazy`, `ComponentProps`), replace `import type { ProjectSilk } from "@/config/projects";` with `import type { ProjectArt } from "@/config/projects";` and add `import { PaintedCover } from "@/components/painted-cover/PaintedCover";`. Delete the `Silk` lazy import and the `SilkLoader` function. Then:

```tsx
/** Beat after the art is visible, before title unfolds (ms). */
const BG_TO_TITLE_MS = 400;

/**
 * Hero sequence (one GPU job at a time):
 *   1. base gradient → painted art fades in (WebGL free to run)
 *   2. freeze the art, then FoldText title (word panels)
 *   3. FoldText subtitle after title completes
 *   4. unfreeze the art
 *
 * Char-split + mix-blend creases + live WebGL was the stutter.
 */
function DeepDiveHero({
  title,
  subtitle,
  art,
}: {
  title: string;
  subtitle: string;
  art: ProjectArt;
}) {
  const [artReady, setArtReady] = useState(false);
  // freeze WebGL while text folds so they never share a frame budget
  const [folding, setFolding] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const onArtReady = useCallback(() => setArtReady(true), []);

  useEffect(() => {
    if (!artReady) return;
    const t = window.setTimeout(() => {
      setFolding(true);
      setShowTitle(true);
    }, BG_TO_TITLE_MS);
    return () => window.clearTimeout(t);
  }, [artReady]);

  const finishText = useCallback(() => {
    setFolding(false);
  }, []);

  return (
    <div className="relative mb-6 h-[60vh] min-h-[400px] overflow-hidden rounded-3xl border-4 border-border shadow-lg shadow-black/5">
      <PaintedCover
        art={art}
        size="hero"
        scrim="dim"
        paused={folding}
        onReady={onArtReady}
        className="absolute inset-0"
      />

      <div className="absolute inset-0 flex items-center justify-center">
        {/* … the existing max-w-4xl block, unchanged, except: … */}
      </div>
    </div>
  );
}
```

Inside the unchanged text block make exactly two edits: the title's `onComplete` becomes `onComplete={() => setShowSubtitle(true)}`, and the subtitle `<p>` is rendered unconditionally (drop the `description ? … : null` wrapper) with `text={subtitle}` and the placeholder span showing `{subtitle}`. Delete the old `backgroundColor` div, the opacity wrapper with `Suspense`/`SilkLoader`, and the `bg-black/20` div (the `dim` scrim replaces it).

`ProjectDeepDiveProps` and the component:

```tsx
interface ProjectDeepDiveProps {
  title: string;
  /** The localized tagline: the hero's second line. */
  subtitle: string;
  /** The localized description: the page's meta description only. */
  description: string;
  art: ProjectArt;
  sectionNav?: ReactNode;
  children?: ReactNode;
}

export function ProjectDeepDive({
  title,
  subtitle,
  description,
  art,
  sectionNav,
  children,
}: ProjectDeepDiveProps) {
  // …
      <meta name="description" content={description} />

      <DeepDiveHero
        key={`${title}-${art.preset}-${art.seed ?? 0}`}
        title={title}
        subtitle={subtitle}
        art={art}
      />
```

- [ ] **Step 3: Renderer**

`src/pages/projects/ProjectDeepDiveRenderer.tsx`:

```tsx
  const projectCopy = t.projects.list[config.i18nKey];
  const title = projectCopy.title;
  // …
    <ProjectDeepDive
      title={title}
      subtitle={projectCopy.tagline}
      description={projectCopy.description}
      art={config.art}
      sectionNav={…}
    >
```

(delete the `const description = config.tagline ?? projectCopy.description;` line) and in the related cards:

```tsx
                  blurb={relatedCopy.tagline}
```

- [ ] **Step 4: Delete Silk**

Run: `grep -rn "backgrounds/Silk" src` — expected: no matches after the edits above. Then `git rm src/components/backgrounds/Silk.tsx`.

- [ ] **Step 5: Verify**

Run: `bunx eslint src/config/projects.ts src/config/project-deep-dive.ts src/components/ProjectDeepDive.tsx src/pages/projects/ProjectDeepDiveRenderer.tsx && bunx prettier --end-of-line auto --write src/config/projects.ts src/config/project-deep-dive.ts src/components/ProjectDeepDive.tsx src/pages/projects/ProjectDeepDiveRenderer.tsx && node node_modules/@typescript/native/bin/tsc -b && bun run test && bun run build`
Expected: all clean.

- [ ] **Step 6: Rollout commit 3**

```bash
git add -A src/config src/components/ProjectDeepDive.tsx src/pages/projects/ProjectDeepDiveRenderer.tsx src/components/backgrounds/Silk.tsx
git commit -m "feat(deep-dive): painted hero, Silk retired

The hero renders the project's painted cover with its fold-in
choreography intact, the subtitle is the localized tagline, the meta
description is the localized description, and related cards show the
tagline. The per-project silk config and the Silk component are gone."
```

---

### Task 10: Assets and sign-off

**Files:**
- Delete: `public/projects/applicare.jpg`, `applicare.svg`, `chatapp.svg`, `kinoa.png`, `luma.png`, `osint-website.svg`, `self.png`, `sola.png`, `taco.png`, `thoughts.svg`, `website-code-extractor.svg`, `website_code_extractor.webp`

- [ ] **Step 1: Confirm nothing references them**

Run: `grep -rn "projects/\(applicare\|chatapp\|kinoa\|luma\|osint-website\|self\|sola\|taco\|thoughts\|website-code-extractor\|website_code_extractor\)\." src public index.html`
Expected: no matches. (`projects/magi/hero.png` and the `<slug>/` folders are not in this list and stay.)

- [ ] **Step 2: Delete and build**

```bash
git rm public/projects/applicare.jpg public/projects/applicare.svg public/projects/chatapp.svg public/projects/kinoa.png public/projects/luma.png public/projects/osint-website.svg public/projects/self.png public/projects/sola.png public/projects/taco.png public/projects/thoughts.svg public/projects/website-code-extractor.svg public/projects/website_code_extractor.webp
bun run build
```

- [ ] **Step 3: Rollout commit 4**

```bash
git commit -m "chore(projects): drop the static cover images

Replaced by the painted covers. The magi hero stays for its article."
```

- [ ] **Step 4: Runtime checks in Chrome (allowed for this project)**

With `bun run dev` running, on `/projects`:
- Count canvases while scrolling the whole list at 1280×720 and at 390×844: `document.querySelectorAll('canvas').length` never exceeds 7 (six covers plus the page background).
- Console has no errors; sort change mid-scroll dissolves and re-cascades without a hitch.
- One deep dive (`/projects/sola`): the hero fades from gradient to art, the title folds in after ~0.4 s, the subtitle follows, the art resumes drifting.
- Light, dark, and cyber themes: captions readable on every preset.
Push when green: `git push origin main`.
