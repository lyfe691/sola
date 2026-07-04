# Motion Rework Plan — sola

> Complete rework of the site's motion language against Emil Kowalski's design-engineering
> philosophy (`emil-design-eng`) and the `review-animations` craft bar.
> Source: a 12-surface deep audit (14 agents, 129 findings) synthesized into one system.
> Status: **implemented** (36 motion files, `tsc` + `vite build` green). Phases 0–2, 4, 5 done;
> Phase 3 (backgrounds) intentionally out of scope.
>
> **Scope (locked with the user):** Backgrounds (Phase 3) are **out of scope** — unrelated to the
> motion language. `sidebar.tsx` is **left untouched** (not part of this rework). `click-spark` is
> **kept** (only gains a `prefers-reduced-motion` guard, not deleted). Everything else proceeds.

---

## 1. Verdict & diagnosis

**Review decision: BLOCK.** The current motion is not broken — it _runs_ — but it fails the craft
bar in a few systemic, repeating ways that no amount of per-component polish will fix. The wins are
real (centralized foundation, trigger-anchored popovers, the click-anchored theme transition, the
update toast, `vaul` drawer physics) and must be **preserved**. The losses are concentrated in five
root causes:

| #   | Root cause                                                                                                                                                                                                                                                                                                                                                                  | Where it bites                 | Severity                  |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ------------------------- |
| 1   | **One weak curve, multiplied everywhere.** `STANDARD_EASING = [0.25,0.1,0.25,1]` (a near-default ease-in-out) is the foundation curve for every reveal, page transition, and MDX block. It has an ease-_in_ front half, so entrances start sluggish.                                                                                                                        | Every page                     | High — dominant complaint |
| 2   | **Durations 2–3× over budget.** Scroll reveals run 0.6 / 0.8 / 1.0s; route transition 0.5s; deepdive hero 0.7s. The most-repeated motion in the product is also the slowest, so content visibly _trails the scroll_ instead of settling as it enters view.                                                                                                                  | Every page                     | High                      |
| 3   | **Reduced-motion is only half-covered.** `MotionConfig reducedMotion="user"` handles declarative Framer transforms, and the CSS block zeroes durations — but neither reaches the **imperative JS loops** (name-morph 3.2s cycle, text cycle, hire-me halo, theme-callout per-frame rAF) or the **11 WebGL/canvas backgrounds** (0/11 honor it).                             | Hero, backgrounds, flourishes  | High (a11y)               |
| 4   | **Maximalist perpetual loops contradict the personality.** A name that re-morphs in 3D every 3.2s forever, an always-rotating halo, app-wide click-sparks, shimmer/pulse loops, and 10 of 11 uncapped-rAF backgrounds — restless, attention-stealing, and a battery/thermal liability.                                                                                      | Hero, footer, backgrounds, 404 | High                      |
| 5   | **No shared primitives → smell sprawl.** No easing tokens exist (3 rival ad-hoc curves in the tree), no hover-capability gating exists at all (Tailwind v4 `hover:` does **not** gate to fine pointers by default), `transition: all` in 19 files, layout-property animation (width/height/max-height/top/margin) across 6+ surfaces, and `scale(0)` entrances in 4 places. | Sitewide                       | Medium–High               |

Two findings are **block-level on their own**: the **global `click-spark`** canvas firing on every
click app-wide (frequency violation), and the **hero's imperative loops bypassing reduced-motion**.

### Findings tally

`block: 2 · high: 43 · medium: 50 · low: 34` (129 total) across 12 audited lanes, **plus** an entire
un-reviewed feature surface (`Experience` — the freshest motion in the repo per the last 3 commits),
`Skills`, `NotFound`, the dead-code `sidebar.tsx`, and `progress.tsx`.

---

## 2. Target motion personality

> **"Crisp and present, not hazy and loading-in."**

This is a developer's personal portfolio. It should read as **fast, quiet, and system-native**, with a
few _rare, earned_ moments of delight. Content settles into place on a strong ease-out the instant it
enters view (sub-300ms, ~8px travel, no scale) — it never drifts up over a luxurious second on a
near-linear curve that lags the eye.

The **signature flourishes are kept and become the exclamation points** precisely because everything
around them is restrained:

- the **click-anchored theme view-transition** (clip-path circle from the pointer — textbook),
- the **GitHub-update toast** on its expo curve,
- the **appearance-menu morph** between language and theme (justified spatial motion).

Everything all-day — nav links, buttons, scroll reveals, MDX prose — gets the _minimum_ motion that
still reads as intentional. The strongest motion statement a dev portfolio can make is knowing **when
not to animate.** (This also satisfies the project's redesign principle: _replace every signature
pattern, be decisive_ — the maximalist signatures go; the tasteful ones stay and stand out.)

---

## 3. The motion system (the new foundation)

Define these **once** and reference them everywhere. Zero inline `cubic-bezier`, zero built-in
`ease`/`easeOut`/`easeInOut` strings, zero magic millisecond literals in components.

### 3.1 Easing tokens → `src/index.css` `@theme` + JS mirror in `src/utils/transitions.ts`

| Token           | Value                             | Use                                                                                                                                                                                                |
| --------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--ease-out`    | `cubic-bezier(0.23, 1, 0.32, 1)`  | **THE default.** Every entrance, popover/dropdown/tooltip enter, hover settle, route enter, scroll reveal, color tween, toast. If unsure, use this. JS mirror: `REVEAL_EASE = [0.23, 1, 0.32, 1]`. |
| `--ease-in-out` | `cubic-bezier(0.77, 0, 0.175, 1)` | **Only** on-screen movement between two existing positions: FLIP reorders (Projects sort), the appearance-menu morph, exit curves of leaving overlay items. Never for entrances.                   |
| `--ease-drawer` | `cubic-bezier(0.32, 0.72, 0, 1)`  | iOS-style sheet/drawer enter + the theme clip-path reveal (already correct at `index.css:523`). Scoped to large edge-sliding surfaces only.                                                        |
| `--ease-expo`   | `cubic-bezier(0.16, 1, 0.3, 1)`   | The "lush hero" curve — rare first-impression entrances only: the update toast (already correct) and the deepdive headline. Never on all-day UI.                                                   |

### 3.2 Duration scale

| Token            | ms  | Use                                                                                                                                                                                                                 |
| ---------------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--dur-instant`  | 100 | Press/active feedback; the press leg of any asymmetric press-and-release; immediate color-only hovers.                                                                                                              |
| `--dur-fast`     | 150 | Tooltip/small-popover enter, switch thumb, copy-button glyph, nav-link highlight follow, field-error, **exit legs** of overlays/toasts.                                                                             |
| `--dur-base`     | 200 | Dropdown/select/menu enter, accordion, hover settle (image zoom, card shadow, hover-pill), theme color tween. The everyday workhorse.                                                                               |
| `--dur-reveal`   | 280 | **The single scroll-reveal tier** (cards, sections, MDX blocks), route enter, code-block. Lands as the element enters view. Replaces 0.6/0.8/1.0s.                                                                  |
| `--dur-emphasis` | 400 | **Hard cap for any UI motion.** Drawer/modal enter, lush toast/hero, pageTitle blur-bridge. Nothing exceeds this except the theme view-transition (marketing-grade exception; trim 900→~700ms, align old/new legs). |

### 3.3 Hover-capability gate → one custom variant

`@custom-variant` is already used in `index.css` (for `dark`). Add:

```css
@custom-variant can-hover (@media (hover: hover) and (pointer: fine));
```

Then **every transform/scale/translate/width hover** uses `can-hover:` instead of bare `hover:`
(`can-hover:scale-105`, `can-hover:-translate-x-…`, etc.). Color-only hovers may stay ungated. Without
this, touch taps fire phantom hovers and leave pills/labels stuck open.

### 3.4 Reduced motion — two layers (today's single CSS nuke is both too blunt and too narrow)

**Layer 1 — CSS** (`index.css:488` retune): stop the blanket `transition-duration: 0.01ms !important`.
Suppress _movement_ only and keep a short fade:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  ::before,
  ::after {
    transform: none !important;
    translate: none !important;
    rotate: none !important;
    scale: none !important;
    transition-duration: 150ms !important; /* keep fades, drop motion */
    scroll-behavior: auto !important;
  }
  /* EXEMPT loaders — they should keep looping, not freeze on one frame */
  [data-slot="skeleton"],
  [data-slot="spinner"],
  .animate-spin {
    animation-iteration-count: infinite !important;
  }
  /* Disable the theme sweep under reduce */
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none !important;
  }
}
```

**Layer 2 — JS** (the part CSS/`MotionConfig` cannot reach). Keep `MotionConfig reducedMotion="user"`
in `App.tsx` (it neutralizes declarative Framer transforms → final state, preserving opacity). Add
`useReducedMotion()` (already proven in `theme-callout.tsx`) at the **imperative** sites and, when true:
stop the `name-morpher` + `CyclingTextEffect` intervals (render static name + first sentence), stop the
`hire-me` halo rotation, render nothing for `click-spark`, and drop entrance `y`/`scale` to opacity-only.

**Backgrounds:** centralize in `BackgroundLayer`/`background-provider` — read `prefers-reduced-motion`
once and pass a `paused` prop the backgrounds honor by rendering **one frame then stopping the rAF**
(`frameloop="never"`, freeze `uTime`, kill cursor reactivity + LiquidEther `autoDemo`). Gentler-not-zero:
keep the color/composition, drop the temporal motion — never a blank screen.

### 3.5 Springs — for _alive / gestured / dragged_, not content entrances

**Keep springs:** `vaul` drawer (native gesture physics), CSS-transition toggles (switch/slider thumb —
interruptible), the mobile-menu item entrance (one tasteful overlay stagger; tighten to
`stiffness ~120 / damping ~20`), and `theme-callout` (the exemplar: `stiffness 380 / damping 28`,
bounce-free, scales from 0.96 at its trigger origin). Use the Apple envelope `{ type:'spring',
duration:0.5, bounce:0.2 }`, bounce 0.1–0.3.

**Remove springs** from everything animating a **layout/content** property: the name-morph **width**
spring, the CyclingText **height** spring, all per-letter **3D rotateX/rotateY** enter springs, and the
bouncy `hire-me` hover (`stiffness:400/damping:10` → raise damping to ~18–20). Duration tweens on
`--ease-out` are correct and preferred for every deterministic state change.

### 3.6 The bans (global rules)

1. `--ease-out` is the default for all entrances; built-in CSS/Framer easings are a finding on sight.
2. UI motion < 300ms; reveals at 280ms; nothing over the 400ms cap except the theme transition.
3. **Ban `transition: all`** — every transition names its properties.
4. **Ban layout-prop animation** (width/height/max-height/top/left/margin) — use transform/opacity, FLIP `layout`, or `grid-template-rows: 0fr→1fr`.
5. **Ban `scale(0)`** entrances — floor at `scale(0.9)` + opacity.
6. **Frequency dictates intensity** — keyboard/100+-per-day = no animation; all-day = minimum; rare = delight. Delete perpetual decorative loops.
7. **Asymmetric timing** — press 100ms vs hover-settle 200ms; route exit 150ms vs enter 280ms; toast dismiss 150ms vs entrance 400ms.
8. **Origin** — popovers scale from trigger (already correct — preserve); modals centered; theme reveal anchored to click.
9. **Gate hover-movement** behind `can-hover:`; add a **50–70ms stagger** wherever sibling cards reveal all-at-once (cap so the last lands < ~400ms after the first).

---

## 4. Execution plan (phased, ordered by leverage)

Each phase is independently shippable. Phases 0–1 deliver ~70% of the felt improvement.

### Phase 0 — Define the token layer _(prerequisite for ~40 downstream fixes)_

- Add the 4 easing tokens + 5 duration tokens to `index.css` `@theme`.
- Add `@custom-variant can-hover`.
- Mirror easings/durations as a typed const map in `src/utils/transitions.ts` (`REVEAL_EASE`, etc.).
- _No behavior change yet — this just makes every later fix a one-line reference swap._ The most-cited
  recommendation in the entire audit (`use var(--ease-out)`) is **uncompilable** until this lands.

### Phase 1 — Rebuild the reveal foundation _(one edit, site-wide payoff)_

`src/utils/transitions.ts` → `ScrollReveal.tsx` → `mdx/reveal.ts` is the highest-leverage node; it also
fixes the three **unaudited** pages (Experience, Skills, NotFound) for free.

- Replace `STANDARD_EASING` with `REVEAL_EASE = [0.23,1,0.32,1]`; delete the "Perfect cubic-bezier" comment.
- Collapse `FAST/STANDARD/SMOOTH` (0.6/0.8/1.0) → `D_REVEAL = 0.28`, `D_EMPHASIS = 0.4`.
- Merge `scrollRevealVariants` + `scrollTitleVariants` + `scrollSubtleVariants` into one `revealVariants`:
  `hidden { opacity:0, y:8 }`, `visible { opacity:1, y:0, transition:{ duration:D_REVEAL, ease:REVEAL_EASE } }`
  — **drop scale** (imperceptible at 0.96–0.98, not earning its keep).
- `scrollPageTitleVariants`: drop `x:-20` → shared `y:8`; keep `blur(2px)→0` bound to opacity, cap at 0.4.
- `scrollContainerVariants`: `staggerChildren 0.1→0.06`, `delayChildren 0.15→0.04`, strip redundant container duration/ease.
- `pageTransition`: **split asymmetric** — enter `{0.28, REVEAL_EASE}`, exit `{0.15, REVEAL_EASE}` (stops the incoming view being gated under `AnimatePresence mode="wait"`).
- **Delete the `setTimeout`/`shouldAnimate` branch** in `useScrollReveal` — a non-interruptible bespoke timer driving motion state. Drive `animate` directly from `useInView({ once:true })`; pass any delay into `transition.delay` or rely on container stagger. `ScrollReveal.tsx` drops its separate `shouldAnimate` state.
- Add `useReducedMotion()` here → opacity-only variants when reduced (inherited by every consumer).
- **Do not** migrate the Base-UI/shadcn primitive layer to Framer — keep its `tw-animate-css`
  `data-starting/ending-style` approach (already disciplined ~100–150ms, correct trigger-origin). The
  dividing line: **CSS data-attributes for trigger-anchored primitives, Framer for in-view choreography.**

### Phase 2 — Delete / gate the maximalist signatures & perpetual loops

- **`click-spark`** (`App.tsx:44`): **kept** per user — add a `prefers-reduced-motion` guard so it renders children without sparks when reduced; otherwise unchanged.
- **`name-morpher`**: stop the 3.2s interval — settle on the real name after 1–2 cycles (or static); strip per-letter 3D `rotateX/rotateY/scale` → keep `opacity + y(8) + blur(4→0)`; fix `easeIn`-on-enter → `--ease-out`; move the **width** spring off the layout prop (FLIP/transform or snap); add `useReducedMotion` + pause on `document.hidden`. (Decision B.)
- **`CyclingTextEffect`** (`text-effect-wrapper.tsx`): stop the 3s sentence interval (or pause on hover + after first rotation); reserve a fixed `min-height` instead of the **height** spring; fix the `scale:0` preset → `scale:0.9`; add reduced-motion gate.
- **`hire-me`** halo: **delete** the infinite `rotate:360` (static glow or slow opacity-breathe behind `can-hover` + reduced-motion); raise hover spring damping to ~18–20.
- **Infinite pulses/shimmer:** delete Footer `♥ animate-pulse` (`Footer.tsx:82`), NotFound caret pulse (`NotFound.tsx:93`), Contact upload-dot pulse (gate at least); reconcile the Index badge shine to the `--animate-shine` token or trigger on hover only (`Index.tsx:190`), same for the Privacy date-pill shine.
- **`theme-callout`**: replace the per-frame `requestAnimationFrame` measure loop with `ResizeObserver` + scroll/resize listeners (measure only on layout-affecting events).

### Phase 3 — Backgrounds: ~~central perf + a11y contract~~ **OUT OF SCOPE**

Dropped at the user's direction — the animated backgrounds are a separate concern from the motion
_language_ and are not touched in this rework. (The findings remain on record in the audit if revisited
later: 10/11 lack tab-hidden pause, 0/11 honor reduced-motion, 4 miss the DPR cap, `LiquidEther` is the
template.)

### Phase 4 — Site-wide sweep (mechanical, high-volume)

- **`transition: all` → scoped properties** across the 19 files (Footer, Navigation, ContributionActivityFeed, TechStack, icon-button, hire-me, chevron-to-arrow, progress, Contact, Index, Projects, Services, theme-toggle, badge/tabs/accordion/switch/navigation-menu). Use `transition-colors` / `transition-[transform,opacity]` etc.
- **Apply `can-hover:`** to every hover-transform (Footer scale/translate, social pills, IconButton, ExperienceItem, Skills rows, Projects/Services cards, About portrait, deepdive related cards, MDX images, hire-me, chevron-to-arrow).
- **Gate the focus-ring `box-shadow` tweens** (`input`/`textarea`/`button`/`select`) — they fire on Tab/focus 100+/day; keep them instant or near-instant.
- **Layout-prop animations → transform/FLIP/grid-rows:** MenuGlyph `top/margin` → transform only; nav pill + highlight `width/height` → scale/translate or shorten to 200ms; Footer legal-expand `max-height` → `grid-template-rows`.
- **`scale(0)` → `scale(0.9)`:** `text-effect-wrapper` scale preset, `theme-toggle` icon, `copy-button` glyphs.
- **Audit the unreviewed surfaces:** `Experience.tsx` + `experience/*` (inherit foundation fix; gate hovers; give the static `ArrowUpRight` a chevron-to-arrow-style hover to match the rest of the site), `Skills.tsx` (gate row hover), `NotFound.tsx` (caret left as a justified cursor metaphor), `progress.tsx` (`transition-all` on the bar).
- **`sidebar.tsx`: left untouched** (out of scope per the user — not part of the motion rework).

### Phase 5 — Per-surface polish

- **Navigation:** mobile-menu exit easing → `--ease-out`; tighten the item spring (`stiffness ~120`); reduce `navigation-menu` enter 0.35→0.2–0.25s, drop `width,height` from its transition list; appearance-menu layout morph 0.34→0.22–0.26s.
- **Route transitions:** verify scroll reset on route change (only ProjectDeepDive resets today — no global `ScrollRestoration`, so navigation can retain scroll and fight the page-enter). Check the lazy-route `Suspense` fallback doesn't flash between routes and undercut the cross-fade.
- **MDX:** reveal **section groups** (heading + its blocks) with a 40–60ms stagger instead of per-paragraph; anchor the `ExpandableImage` zoom to the clicked thumbnail via shared `layoutId` (grows from the rect, not center); gate the `whileHover` image lift behind capability; `TechStack` chips → `transition-colors` (or drop the hover — chips aren't clickable).
- **Deepdive:** hero `h1/p` `easeInOut`→`--ease-out`, durations 0.7→~0.5s; convert hand-tuned section delays to a parent `staggerChildren: 0.07`; make the activity feed play **once** (guard against refetch/locale restart).
- **UI primitives:** the reduced-motion exemptions from Phase 0 fix skeleton/spinner; `sheet` `ease-in-out`→`--ease-drawer`; `switch` thumb explicit `200ms --ease-out`; `button` add `active:scale-[0.97]` (`--dur-instant`); `select` align-trigger mode keep `animate-none` but add a cheap opacity fade-in.

### Phase 6 — Verify (the skill's debugging discipline)

- **Slow-motion / frame-by-frame** (Chrome Animations panel) on the reveal foundation, theme transition, and nav — confirm coordinated props stay in sync and origins are right.
- **Reduced-motion pass:** toggle OS setting — confirm fades remain, movement/loops/backgrounds stop, loaders still spin, no blank background.
- **Touch pass** on a real device — confirm no stuck hover pills, no phantom transforms.
- **Perf pass:** DevTools Performance while scrolling with a heavy background — confirm rAF pauses on tab-hide and offscreen, no main-thread frame drops during route transitions.
- **Fresh eyes next day** — re-review the hero and reveals; imperfections surface later.

---

## 5. Headline Before → After (review table)

| Before                                                          | After                                                                    | Why                                                                                       |
| --------------------------------------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `STANDARD_EASING = [0.25,0.1,0.25,1]` everywhere                | `--ease-out: cubic-bezier(0.23,1,0.32,1)` / `REVEAL_EASE`                | Near-default ease-in-out starts entrances sluggish; strong ease-out snaps in then settles |
| Reveal durations `0.6 / 0.8 / 1.0s`                             | single `280ms` tier (cap `400ms`)                                        | 2–3× over the UI budget; content trails the scroll instead of settling as it enters       |
| `pageTransition` symmetric `0.5s`                               | enter `0.28s` / exit `0.15s`                                             | Under `mode="wait"` a slow exit gates the incoming view; exits should snap                |
| `useScrollReveal` `setTimeout(delay)` gate                      | `useInView({once:true})` + `transition.delay`                            | Bespoke non-interruptible timer driving motion state; library does this natively          |
| `scale(0)` (text-effect preset, theme-toggle icon, copy glyphs) | `scale(0.9)` + opacity                                                   | Nothing in the real world appears from nothing                                            |
| `name`/`text` re-morph forever (3.2s / 3s `setInterval`)        | settle after 1–2 cycles; stop on reduce + hidden                         | Perpetual decorative loop on the most-seen surface; restless, bypasses reduced-motion     |
| `hire-me` halo `rotate:360` infinite                            | static glow / removed                                                    | 60fps perpetual decoration with no meaning                                                |
| global `click-spark` on every click                             | deleted (or scoped + reduced-motion)                                     | Frequency violation — motion on a 100+/day action                                         |
| `transition: all` (19 files)                                    | named properties (`transition-colors`, `transition-[transform,opacity]`) | Animates unintended/layout props off-GPU                                                  |
| bare `hover:` transforms (no gating anywhere)                   | `@custom-variant can-hover` + `can-hover:`                               | Tailwind v4 doesn't gate to fine pointers; touch fires phantom hovers                     |
| `width`/`max-height`/`top`/`margin` animations                  | transform / FLIP `layout` / `grid-template-rows`                         | Layout props trigger layout+paint; transform/opacity stay on the compositor               |
| 10/11 backgrounds: uncapped rAF, no pause, 0 reduced-motion     | central `paused` prop + `visibilitychange` + `dpr={[1,2]}`               | Battery/thermal liability + a11y gap; LiquidEther already proves the contract             |
| CSS reduced-motion zeroes spinner/skeleton to a frozen frame    | suppress movement, keep fades, **exempt loaders**                        | Reduced-motion is gentler-not-zero; loaders should keep looping                           |
| `sheet` `ease-in-out`                                           | `--ease-drawer cubic-bezier(0.32,0.72,0,1)`                              | Edge-sliding panels want the iOS drawer curve                                             |
| `button` no press feedback                                      | `active:scale-[0.97]` @ `100ms`                                          | Pressables must feel responsive to press                                                  |

**Verdict: BLOCK** until Phases 0–2 land (the weak-curve/over-duration foundation, the reduced-motion
gaps, and the keyboard/high-frequency `click-spark` are all hard-block triggers).

---

## 6. Per-lane disposition

| Lane               | Disposition           | One-line                                                                                         |
| ------------------ | --------------------- | ------------------------------------------------------------------------------------------------ |
| foundation         | **retune**            | Architecture right, values wrong — the single biggest liability; rebuild constants + a11y        |
| global-css         | retune                | Theme transition is good; swap weak `ease`→`--ease-out`, retune reduced-motion block             |
| home-hero          | retune                | Over-animated; 3 infinite loops, `easeIn` enters, layout-prop hovers, a11y block                 |
| content-pages      | retune                | One weak curve at 0.6–1.0s; Certifications/Privacy fire on mount not in-view (bug)               |
| list-pages         | retune                | Tasteful vocab; fix shared curve/duration + 3 inconsistent stagger strategies                    |
| navigation         | retune                | Coherent personality; layout-prop morphs + `scale(0)` icon + Framer reduced-motion gap           |
| layout-transitions | retune                | Mechanisms right; asymmetric route timing + Footer `transition:all`/pulse cleanup                |
| mdx-content        | retune                | Over-animated/under-differentiated; group-stagger + `layoutId` zoom + gate hovers                |
| deepdive           | retune                | `easeInOut` on entrances (block-grade), 0.6–0.7s durations, `transition:all` in feed             |
| custom-flourishes  | **retune + delete 2** | Delete `click-spark` + `hire-me` halo; retune name-morph/cycling; `theme-callout` is the bar     |
| ui-primitives      | retune                | Popover layer is excellent — preserve; fix reduced-motion nuke + code-block reveal + sheet curve |
| backgrounds-perf   | retune                | Port LiquidEther's pause/DPR/reduced-motion contract to the other 10; central gate               |

---

## 7. Decisions to confirm

These are product/taste calls where I've picked a recommended default (decisive, per the redesign
principle) but the choice changes Phase 2:

- **A — `click-spark`:** **Resolved → keep** (user). Only adds a reduced-motion guard.
- **B — Name-morph cycling:** **Resolved → settle after 1–2 cycles** on the real name, strip the 3D.
- **C — The backgrounds:** **Resolved → out of scope** (user). Not touched.
- **D — `hire-me` halo:** **Resolved → delete the rotation** (static glow).
- **E — `sidebar.tsx`:** **Resolved → leave untouched** (user). Not part of this rework.

## 8. What to preserve (do not touch)

The theme view-transition (click-anchored clip-path on `--ease-drawer`, `pointer-events:none` guard) ·
the `UpdateNotification` toast (`EASE_EXPO`, correct budget, `role=status`) · the appearance-menu
morph-between-menus (justified spatial motion) · `theme-callout` (the reduced-motion + anchored-origin
exemplar) · the entire trigger-origin popover/menu/modal layer (`origin-(--transform-origin)`,
`zoom-in-95`, centered modals) · `vaul` drawer physics · `button`'s asymmetric press timing ·
`LiquidEther`'s full perf contract (the template) · `passive` scroll listeners · WebGL context teardown ·
`MotionConfig reducedMotion="user"` · `TagRow`'s correct _absence_ of motion.
