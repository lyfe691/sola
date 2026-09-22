# sola — personal portfolio (sola.ysz.life)

Vite 8 + React 19 + TypeScript strict + Tailwind v4, deployed on Vercel.
`api/` holds Vercel serverless functions (GitHub activity proxy, version).
Package manager is bun — use `bun install`/`bun run <script>`, not npm/npx.

## Verify

- `bun run lint` — must stay at 0 errors (warnings tolerated)
- `bun run format:check` — prettier; `bun run format` fixes
- `bun run typecheck` — `tsc -b` over src/ and api/ (plain `tsc --noEmit`
  checks nothing: the root tsconfig is solution-style with `files: []`)
- `bun run test` — vitest (NOT `bun test` — that invokes Bun's own test
  runner instead of the `test` script)
- `bun run build` — vite build; `bun run dev` serves on port 3000
- CI (`.github/workflows/ci.yml`) runs all of the above on push/PR

## Structure rules

- **Routes** live only in `src/config/routes.ts` — one manifest drives the
  router, layouts, and localized tab titles. Adding a page there is the
  whole job. Layouts: `app` (nav + footer) and `blank` (nothing).
- **i18n**: hand-rolled. `src/lib/translations/{en,de,es,ja,ko,zh}.ts`; `en.ts`
  defines the `Translation` type, so every locale must mirror new keys.
  Components read the active dictionary with `useTranslation()`; never
  import a locale file — only English is bundled, the rest are lazy chunks
  (`main.tsx` loads the visitor's before the first render).
  No user-facing string literals in components — add a key. zh is
  Simplified (except the /a page title, which is deliberately Traditional).
- **Content** is config-driven: `src/config/{projects,certifications,...}.ts`
  plus MDX deep dives in `src/content/projects/`.
- **MDX code blocks**: inside `<CodeBlock code={`…`}>` write every line after
  the first with two extra spaces (MDX strips the attribute's indent at
  compile time, so the code would render two spaces short), and never leave a
  blank line in the literal (prettier flattens everything after it). Output
  that needs blank lines goes in a fenced block instead.
- **Deep-dive images** are WebP files in `public/projects/<slug>/`, one per
  image at the capture's own pixel size (no variants), encoded with sharp
  `.webp({ quality: 90, effort: 6, smartSubsample: true })`. After adding or
  replacing one run `bun run images:sizes` (a test fails when the size list is
  stale). The size list also drives the figure layout: a gallery row shares
  one height with widths from each image's aspect ratio, and phone-only rows
  sit on a stage, so phone shots need no flag. `columns` = figures per row.
- **Device frames**: `<Safari url="…" />` and `<IPhone />` are `<ProjectImage>`
  with a frame (same props; Safari defaults to `size="full"`); in a gallery
  give an image `frame: "safari" | "iphone"`. `video="/projects/<slug>/x.mp4"`
  on any figure plays a muted clip in place: `src` is then its poster WebP
  (in the size list — it reserves the box), and clips don't open the lightbox.

## Styling

- Token-only colors (`--background`, `--primary`, …) — 11 themes defined as
  classes in `src/index.css`. Never use raw Tailwind palette colors
  (`bg-blue-500`) in components.
- The `dark:` variant matches `.dark` **and** `[data-scheme="dark"]` — the
  theme provider stamps the attr so custom dark themes (cyber/forest/
  amethyst) trigger it. Never gate on `.dark` directly.
- `src/components/ui/` is vendored shadcn/base-ui: prettier-ignored, keeps
  upstream style; don't reformat it.
- `can-hover:` custom variant gates hover-_movement_ (touch taps fire
  phantom hovers). Color-only hovers don't need it.

## Motion

- One vocabulary: curves live in `src/utils/transitions.ts` and mirror the
  `--ease-*` tokens in `src/index.css`. Never inline a cubic-bezier or use
  built-in `"easeOut"`-style strings.
- Two registers: UI controls are short + `EASE_OUT`; content reveals and
  page transitions glide (`REVEAL`/`SMOOTH`, longer). The owner prefers
  smooth glide over snappy timing — don't "optimize" durations down.
- Scroll reveals: wrap each block that should arrive on its own in
  `<Reveal>` (`as="li"` etc.). Never pass delays or nest reveals — one
  queue (`src/lib/reveal.ts`) starts blocks in reading order, and one CSS
  rule (index.css, "scroll reveals") animates them. A motion component with
  its own states takes the queue's delay through `useReveal`.
- Backgrounds (`src/components/backgrounds/`) intentionally do NOT gate on
  prefers-reduced-motion (owner decision); framer-driven UI motion is
  gated globally via `MotionConfig reducedMotion="user"`.

## Deploy

- Vercel; `vercel.json` rewrites SPA routes but deliberately excludes
  `/assets/` (missing chunks must 404, or the immutable cache header pins
  HTML under a JS URL). `main.tsx` reloads once on `vite:preloadError`.
- The GitHub token is `GITHUB_TOKEN` (not `VITE_`-prefixed) — see
  `.env.example`.
