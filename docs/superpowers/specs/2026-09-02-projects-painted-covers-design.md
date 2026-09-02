# Projects: painted covers, one list

Date: 2026-09-02
Status: approved design, reviewed against the code, pre-implementation

## Goal

Replace the per-project cover images on the projects page with live,
code-generated cover art in a clean Van Gogh idiom, carrying the project
title and a localized tagline. Collapse the featured / other split into
one priority-sorted grid. Use the same art for the deep-dive hero so one
system serves both, and retire Silk and the static image assets.

## Decisions already made with the owner

- Live generative art, not static SVG or pre-rendered images.
- Uniform two-column grid on desktop, one column on mobile.
- Localized tagline for every project, in all six locales.
- The deep-dive hero switches to the same art; Silk is retired.
- Rendering: per-card WebGL shader mounted only near the viewport, with
  brush-stroke streaking in the shader so it keeps the painterly quality
  of a stroke painter. Rationale: Chrome caps a page at about 16 live
  WebGL contexts and the site already uses one for its page background,
  so per-card contexts must be bounded; a shared canvas behind the grid
  fights Lenis and the route transition; a 2D stroke painter is a still
  image. A near-viewport-mounted shader is alive, bounded, and one small
  component.
- A shader tournament with Chrome screenshots is allowed during
  implementation to pick the best-looking variant.
- Fallback, only if the shader does not reach the bar (see §9): clean
  animated CSS gradients behind the same component API, in the spirit of
  the reactbits gradient carousel (`npx shadcn@latest add
  @reactbits-starter/gradient-carousel-tw` as a reference, not a
  dependency to adopt wholesale).

## Non-goals

- Related-project cards on the deep-dive page keep their text-only
  layout. Their blurb changes source (see §4) but not shape. A thumbnail
  register can come later.
- No change to sorting, the sort menu, OG images, sitemap, or the MDX
  screenshot galleries under `public/projects/<slug>/`.
- No reduced-motion gating for the covers: the site treats generative
  backgrounds as exempt (owner decision recorded in CLAUDE.md). The tab
  visibility pause still applies.
- The "View All Projects" button below the grid and its copy are
  unchanged. Nothing was hidden by the split before either.

## 1. Data model

### `ProjectMeta` (src/config/projects.ts)

Removed: `image`, `featured`, `vercelSatori`, `deepDive.silk`,
`deepDive.tagline`, and the `ProjectSilk` type (the last three in the
hero commit, see §8).

Added, required on every project:

```ts
export interface ProjectArt {
  /** One of the named presets in src/components/painted-cover/presets.ts */
  preset: ArtPreset;
  /** Rotates the flow field so two projects on one preset differ. Default 0. */
  seed?: number;
}
// ProjectMeta gains: art: ProjectArt;
```

`ProjectPageConfig` (src/config/project-deep-dive.ts) drops `silk` and
`tagline` and gains `art: ProjectArt`; `toPageConfig` copies
`project.art`. The hero reads the tagline from translations.

There are 16 projects. Priorities are unique and contiguous from 1 (a
test pins this, see §7). The stale `// non-featured projects` comment in
the array is removed.

### Presets (src/components/painted-cover/presets.ts)

A small hand-tuned library named after paintings. Each preset is data
only:

```ts
export type ArtPreset = "starry" | "wheat" | "irises" | "almond" | "cafe" | "cypress";

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

export interface ResolvedArt extends PaintedPreset {
  /** Rotation of the flow-field domain, radians. */
  seed: number;
}

/** Golden-ratio spacing: distinct angles for small integers, stable across runs. */
export const seedToAngle = (n: number) => ((n * 0.618034) % 1) * 2 * Math.PI;

export function resolveArt(art: ProjectArt): ResolvedArt;
// returns { ...PRESETS[art.preset], seed: seedToAngle(art.seed ?? 0) }
```

Starting values (to be tuned visually during the tournament; the
structure is fixed, the numbers are not):

| preset  | mood                       | palette (dark → light)            | horizon |
| ------- | -------------------------- | --------------------------------- | ------- |
| starry  | The Starry Night           | `#141f4d #26418f #5b8fd4 #f4d35e` | 1       |
| wheat   | Wheatfield with Crows      | `#3b2a14 #1f3a6e #c8961e #e9c55a` | -1      |
| irises  | Irises                     | `#2f2a5a #4b3f8f #7c6cc4 #efe5c2` | 0       |
| almond  | Almond Blossom             | `#2f5f66 #4fa3a5 #8fd0c8 #f3efe4` | 0       |
| cafe    | Café Terrace at Night      | `#12213a #1e3557 #d98b3a #f2c14e` | 1       |
| cypress | Wheat Field with Cypresses | `#2f4a2c #7b9a5c #6fa3d0 #e9eef2` | -1      |

Palettes are literal hex values in the preset file, not theme tokens:
the covers are artwork with their own colors in every theme, like the
deep-dive hero today. The overlay and caption over them are also
theme-independent (always-dark scrim, always-light text, see §2), for
the same reason.

Initial assignment (owner may reshuffle): sola → starry, kinoa → cafe,
magi → irises, luma → almond, applicare → wheat, self → starry,
code-extractor → wheat, thoughts → almond, taco → wheat, osint → cypress,
chatapp → irises, vm-detector → cypress, view-counter → starry,
docker-service → irises, phishing → cafe, otw → cypress. Seeds are the
project's index within its preset (0, 1, 2…).

## 2. `PaintedCover` component

Location: `src/components/painted-cover/` with `PaintedCover.tsx`,
`shader.ts` (GLSL strings), `presets.ts`, `use-near-viewport.ts`,
`mount-queue.ts`, and tests. This mirrors the `backgrounds/<name>/`
convention.

### API

```ts
interface PaintedCoverProps {
  art: ProjectArt;
  /** card: aspect 16/9, STEPS 8. hero: fills its box, STEPS 12. Both DPR 1. */
  size: "card" | "hero";
  /** caption: bottom black/0→black/70 gradient over the lower 50% (cards).
   *  dim: full-box black/20 (hero, matches today's overlay). none. Default caption. */
  scrim?: "caption" | "dim" | "none";
  /** Stops the frame loop; the last frame stays on screen. */
  paused?: boolean;
  /** Fires once: after the first WebGL frame, or immediately if WebGL is unavailable. */
  onReady?: () => void;
  /** Rendered over the art (CoverCaption for cards, FoldText for the hero). */
  children?: ReactNode;
  className?: string;
}

/** Title + tagline as real DOM text. `as` picks the heading level. */
interface CoverCaptionProps { title: string; subtitle: string; as?: "h2" | "h3" }
```

`CoverCaption` renders white text (title white, subtitle white/80) and
never swaps color on hover. On the projects page it renders an `h2`,
so the outline stays `h1 → h2` once the "Other Projects" heading is
gone. The hero passes its existing centered block, including the `h1`
and `p` wrappers with their invisible placeholders, unchanged.

### Layers, bottom to top

1. **Base**: a CSS `linear-gradient` from the preset's four stops,
   oriented by `horizon`. Painted on first render so nothing is ever
   blank and the un-mounted state already looks intentional.
2. **Canvas**: an `ogl` `Renderer` + `Program` + `Triangle` (fullscreen
   quad), following `backgrounds/aurora/Aurora.tsx`. Options:
   `alpha: false`, `antialias: false`, `depth: false`,
   `powerPreference: "low-power"`, `dpr: 1`; the Program sets
   `depthTest: false, depthWrite: false`. `#version 300 es` shaders; if
   `renderer.isWebgl2` is false or linking fails, no canvas is shown.
   Opacity 0 until the first frame, then a 700 ms crossfade on the
   site's `ease-out` curve.
3. **Scrim**: per the `scrim` prop. Always black-based, never a theme
   token, because the art beneath is the same in every theme.
4. **Children**: the caption or the hero's text.

Layers 1 and 2 sit in an inner `absolute inset-0` art element. For
`size="card"` that element alone carries
`can-hover:group-hover:scale-[1.03]` with a transition on the site's
curves; scrim and caption stay static.

### Lifecycle

- **Near**: `useNearViewport(ref, "50% 0px")` reports whether the cover is
  within half a viewport of the screen (IntersectionObserver, not once).
  The canvas mounts when near and unmounts when not. At 1280×720 that is
  two to three rows, four to six mounted canvases; at 390×844, three to
  four.
- **Visible**: a second observer with zero margin reports actual
  intersection. One flag drives the frame loop:
  `running = near && visible && !paused && !document.hidden`. A single
  `sync()` is called from both observers, the `visibilitychange`
  listener, and the `paused` effect; it starts or cancels the loop from
  that flag. Cards mounted but not visible keep their last frame and do
  no work.
- **Mount queue** (`mount-queue.ts`): shader programs cannot be shared
  across contexts and `ogl`'s Program constructor compiles and links
  synchronously. Covers that become near enqueue; one `requestAnimationFrame`
  drains one entry per frame, nearest to the viewport first. This
  spreads the compile burst on page load and after a re-sort (the grid
  remounts under `AnimatePresence`) over a few frames instead of one.
- **Failure path**: `Renderer`/`Program` creation is wrapped in
  `try/catch`. On failure (WebGL disabled, context cap, link error) no
  canvas is mounted, the base gradient stays, one `console.warn` fires,
  and `onReady` still fires so the hero choreography proceeds. A
  `webglcontextlost` listener on the canvas calls `preventDefault`,
  cancels the loop, and sets the canvas opacity to 0.
- **Unmount**: cancel the loop, `WEBGL_lose_context.loseContext()`,
  remove the canvas, so contexts are released promptly.
- **Resize**: a `ResizeObserver` on the root reads `offsetWidth/Height`
  (not `getBoundingClientRect`, which the route transition corrupts;
  Silk documents the trap). Each callback calls `renderer.setSize(
  Math.round(w * dpr), Math.round(h * dpr))`, resets the canvas style to
  `width:100%;height:100%` (ogl writes pixel sizes), and renders one
  frame unconditionally, even when paused or hidden, because `setSize`
  clears the buffer to black. The same one-frame render runs on
  `visibilitychange` back to visible.
- **Time**: `uTime` is an accumulator held in a ref on the component
  (outside the canvas effect, so it survives near-viewport remounts),
  advanced by `min(dt, 50 ms)` only when a frame renders, reset only on
  mount or when `art` changes. Pause, hidden tab, and remount therefore
  resume without a jump.
- Uniforms: `uTime`, `uSeed` (the resolved angle), `uAspect`,
  `uPalette[4]`, `uHorizon`, `uSwirl`, `uStroke`, `uDrift`. `STEPS` is a
  `#define` prefixed to the fragment source per `size` (two cached
  strings), not a uniform, so the loop unrolls.

### Look

Fragment shader, single pass:

- **Flow field**: curl of two-octave value noise, domain-warped by a
  slower, larger noise, rotated by `uSeed`. `uTime * uDrift` offsets the
  warp so the field advects slowly (one visible cycle around a minute).
- **Strokes**: for each pixel, march `STEPS` samples forward and back
  along the local flow direction over a length of `uStroke`, averaging a
  high-frequency noise. This line-integral streaking makes the texture
  follow the swirls as directional dabs. Luminance is quantized into five
  bands with a per-band phase so neighbouring dabs alternate stops.
- **Color**: the streak value maps through the four palette stops with
  soft mixing; a low-frequency tint weighted by `uHorizon` gives the
  composition a sky/ground structure.
- **Finish**: ±3 % luminance grain, a 10 % edge vignette. No bloom, no
  post-processing.
- DPR 1 everywhere, as the hero runs today ("one GPU job at a time").

### Tournament (implementation step, not runtime)

Four agents each implement the shader from this section in an isolated
scratch HTML page using `ogl` from a CDN, driven by the same preset
inputs, and screenshot two presets each in Chrome at 640×360. Three
judges score each variant 1–5 on: reads as brushwork, not marbling;
clean and calm, not busy; motion quality (drift visible but slow);
frame cost at 640×360 DPR 1 under 2 ms; first-frame time including
compile under 60 ms. The winner's GLSL becomes `shader.ts`, keeping the
uniform contract above. Runner-up ideas that score higher on one axis
may be grafted in by the implementer. Total agents for the tournament:
seven.

## 3. Projects page and card

`src/pages/Projects.tsx`:

- One grid: `grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8`, keyed by
  the sort under `AnimatePresence` exactly as today. `ProjectGrid` loses
  its `stagger` and `variant` props; every card uses the `default`
  reveal with `delay = entering ? lead + staggerDelay(index) : 0`
  (entrance semantics everywhere: a card scrolled to later rises at
  once). The featured grid, the "Other Projects" heading, its tooltip,
  and the Satori badge are removed.
- `ProjectCard`: `Card` with `PaintedCover size="card"` on top carrying
  `CoverCaption as="h2"` (title, tagline), then the body: `time`,
  description, `TagRow`, `ProjectActions`. The body no longer renders the
  title.
- `scrollFeatureVariants` and `D_FEATURE` are deleted from
  `transitions.ts`; `"feature"` leaves ScrollReveal's variant union and
  map; the `staggerDelay` comment is rewritten to describe the entrance
  rule above.
- Sorting and the menu are unchanged.

## 4. Deep-dive hero

`src/components/ProjectDeepDive.tsx` and the renderer:

- `ProjectDeepDiveProps` becomes `{ title; subtitle: string; description:
  string; art: ProjectArt; ... }` with `silk` removed. `subtitle` (the
  localized tagline) is what `DeepDiveHero` receives for its second
  FoldText; `description` (the localized card description) feeds only
  `<meta name="description">`. The renderer passes
  `subtitle={projectCopy.tagline}`, `description={projectCopy.description}`,
  `art={config.art}`. The `if (description)` gate before the subtitle
  becomes unconditional, since every project has a tagline. Side effect:
  the meta description becomes localized (today it is the English
  config tagline where one exists).
- `DeepDiveHero` replaces the `Silk` lazy import, `SilkLoader`, and the
  solid `backgroundColor` with `PaintedCover size="hero" scrim="dim"`
  inside the existing `h-[60vh] min-h-[400px] rounded-3xl` box, keeping
  its white FoldText. Choreography is preserved verbatim: `onReady` →
  wait `BG_TO_TITLE_MS` → set `paused` while the title and subtitle fold
  → unpause. DPR stays 1.
- The hero's `key` becomes `${title}-${art.preset}-${art.seed ?? 0}`.
- `RelatedProjectCard` blurb becomes `t.projects.list[related.i18nKey].tagline`
  with no description fallback (the description can contain markdown and
  the card renders plain text inside a link).
- `src/components/backgrounds/Silk.tsx` is deleted after a grep confirms
  no other importer.

## 5. Translations and cleanup

- `projects.list.<key>` gains `tagline: string` in `en.ts` (which defines
  the `Translation` type) and therefore in `de`, `es`, `ja`, `ko`, `zh`.
  Sixteen taglines: nine drafted from the existing English
  `deepDive.tagline` (magi, kinoa, sola, luma, applicare, self,
  codeExtractor, thoughts, taco), seven written fresh (osint, chatapp,
  vmDetector, viewCounter, dockerService, phishing, otw), all translated
  for the other five locales. Taglines are one short line, under about
  40 characters in English, no trailing period, no markdown. zh stays
  Simplified.
- Removed from every locale: `projects.other`, `projects.otherInfo`,
  `projects.satoriAttribution`.
- `scripts/find-unused-translations.ts` marks `tagline` as used alongside
  `title` and `description`.
- Deleted assets (12 files, ~1.2 MB): `public/projects/{applicare.jpg,
  applicare.svg, chatapp.svg, kinoa.png, luma.png, osint-website.svg,
  self.png, sola.png, taco.png, thoughts.svg, website-code-extractor.svg,
  website_code_extractor.webp}`. `public/projects/magi/hero.png` stays
  because `src/content/projects/magi.mdx` embeds it. The `<slug>/`
  screenshot folders stay.

## 6. Performance budget

- Projects page at 1280×720 and 390×844, scrolling the full list: at
  most six mounted canvases and at most four rendering at any moment,
  plus the page background. Verified by counting `canvas` elements and
  running loops.
- Card frame cost under 2 ms at 640×360 DPR 1 on an integrated GPU;
  first frame including compile under 60 ms per cover; no more than one
  cover mounted per animation frame.
- Hero under 6 ms at 1216×432 DPR 1, measured with the route transition
  running, not in isolation.
- No layout shift: the base gradient and a fixed `aspect-[16/9]` reserve
  the space before the canvas exists.
- Bundle: `ogl` is already a dependency and pre-bundled; `three` and
  `@react-three/fiber` remain for other backgrounds. The Silk chunk goes
  away.

## 7. Testing

- `src/components/painted-cover/presets.test.ts`: every `ArtPreset` has
  four valid hex stops and `horizon` in [-1, 1]; `resolveArt` merges the
  preset and converts the seed; `seedToAngle` is stable and gives
  distinct angles for 0–7.
- `src/config/projects.test.ts` (new): every project names an existing
  preset; priorities are unique and contiguous from 1; every project with
  a `slug` has a `deepDive`.
- Type level: adding `tagline` to `en.ts` fails `tsc -b` until all six
  locales have it, which is the intended guard.
- `PaintedCover` behaviour that is testable without a DOM: the mount
  queue drains one entry per tick nearest-first; `onReady` fires when
  context creation throws (inject a failing renderer factory).
- Lint, prettier, `tsc -b`, vitest, build, all green (see the Windows
  notes in the project memory for the local forms of typecheck and
  format check).
- Owner visual sign-off: the projects page and one deep dive in light,
  dark, and one custom theme (cyber), at desktop and phone widths, with a
  sort change mid-scroll. Caption contrast at least 4.5:1 for the
  tagline and 3:1 for the title on every preset.

## 8. Rollout

Sequential commits on `main`, each green on its own (CI runs typecheck
on every push):

1. Presets, shader (tournament winner), `PaintedCover`, mount queue,
   tests. Nothing consumes it yet.
2. Config gains `art`; taglines land in six locales; `image`, `featured`,
   `vercelSatori`, and the three UI keys are removed; projects page and
   card rebuilt; `ProjectGrid` simplified; the `feature` reveal variant
   deleted. `deepDive.silk` and `deepDive.tagline` stay in this commit so
   the untouched hero still compiles.
3. Deep-dive hero on `PaintedCover`; `ProjectSilk`, `deepDive.silk`,
   `deepDive.tagline`, `ProjectPageConfig.{silk,tagline}`, Silk.tsx and
   its loader deleted; related-card blurb switched to the tagline.
4. Asset deletion.

## 9. Fallback

If no tournament variant averages at least 3.5 on the two look criteria
(brushwork, clean and calm) while meeting the cost criteria, the shader
is dropped and `PaintedCover` renders a clean animated CSS gradient
instead: the same four palette stops and `horizon`, a slow
`background-position` drift on the site's curves, no WebGL. The API,
captions, scrims, page, hero choreography, translations, and cleanup are
unchanged, so the fallback is a swap of the art layer only. The
reactbits gradient carousel is the visual reference for that gradient
treatment.

## Open questions

None blocking. Two things the owner may want to retune after seeing it:
the preset assignment per project, and the cover aspect ratio (16/9 is
the default; 3/2 gives the painting more room at the cost of a taller
grid).
