---
name: react-bits-pro
description: >
  Install and integrate React Bits Pro premium UI components and page blocks
  into React/Next.js apps using the shadcn registry CLI. Use this skill when
  the user wants to add animated components (WebGL shaders, GSAP animations,
  3D effects, cursor trails, text animations, carousels, cards), full page
  sections (hero, pricing, navigation, footer, FAQ, CTA, auth, stats, blog,
  contact, features, social proof, 404, profile, about, waitlist, showcase,
  how-it-works, download), or landing page templates from React Bits Pro.
  Also use when the user mentions "react bits", "reactbits", or wants
  premium animated React components even if they don't name the library
  directly.
license: Proprietary
compatibility: Requires Node.js 18+, React 18/19, Next.js 14+ (App Router recommended). Tailwind CSS 4 recommended.
metadata:
  author: reactbits
  version: "1.1"
---

# React Bits Pro Integration

You are integrating components and blocks from **React Bits Pro**, a premium shadcn-compatible component registry with 100+ animated components and 158+ page section blocks for React/Next.js applications.

## Installing this skill via CLI

If the user's project already has a `components.json` with the `@reactbits-starter` registry configured, you can install this skill file directly:

```bash
npx shadcn@latest add @reactbits-starter/skill
```

This places a `SKILL.md` file in the project root. You can then read it for future reference without fetching it again.

## When to use this skill

Use this skill when:
- The user wants to add React Bits Pro components or blocks to their project
- The user asks for animated UI components (shaders, particles, 3D effects, cursor effects, text animations)
- The user wants pre-built landing page sections (hero, pricing, features, navigation, footer, etc.)
- The user mentions "react bits", "reactbits", "@reactbits-starter", or "@reactbits-pro"
- The user wants to build a landing page quickly with premium animated blocks
- The user needs WebGL, GSAP, Three.js, or Framer Motion animated components but doesn't want to build them from scratch

## Architecture overview

React Bits Pro uses the **shadcn registry protocol** to distribute components. There are two authenticated registries:

| Registry | Content | Required tier | Install prefix |
|---|---|---|---|
| `@reactbits-starter` | 100 animated UI components | Starter, Pro, or Ultimate | `@reactbits-starter/` |
| `@reactbits-pro` | 158+ page section blocks | Pro or Ultimate | `@reactbits-pro/` |

Components are installed directly into the user's codebase (not as npm packages). They become local source files the user owns and can modify.

### Component variants

Every **component** (from `@reactbits-starter`) has TWO variants:
- **`-tw`** (Tailwind) — uses Tailwind CSS utility classes via `cn()` helper. **Preferred for Tailwind projects.**
- **`-css`** (CSS) — uses a co-located `.css` file with vanilla CSS. Use when the project does not use Tailwind.

Every **block** (from `@reactbits-pro`) has only ONE version — Tailwind-based, no suffix needed.

### File installation paths

When installed, files land at:
- Components: `components/react-bits/{component-name}.tsx` (and `.css` for CSS variant)
- Blocks: `components/blocks/{block-name}.tsx`

---

## Step 1: Verify prerequisites

Before installing anything, confirm the user's project has:

1. **A `components.json` file** in the project root (shadcn config). If missing, run:
   ```
   npx shadcn@latest init
   ```

2. **The `cn` utility** at `lib/utils.ts`:
   ```typescript
   import { clsx, type ClassValue } from "clsx"
   import { twMerge } from "tailwind-merge"

   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs))
   }
   ```
   If missing, install dependencies: `npm install clsx tailwind-merge`

3. **A valid license key**. The user must have purchased a React Bits Pro license. Ask the user for their license key if they haven't set it up yet.

---

## Step 2: Configure the license key

The license key must be in a `.env.local` file in the project root:

```
REACTBITS_LICENSE_KEY=<the-users-license-key>
```

**CRITICAL:** Never commit `.env.local` to version control. Ensure `.gitignore` includes it.

---

## Step 3: Configure `components.json`

Add the React Bits Pro registries to the `registries` field in `components.json`. If the `registries` key does not exist, create it.

```json
{
  "registries": {
    "@reactbits-starter": {
      "url": "https://pro.reactbits.dev/api/r/starter/{name}.json",
      "headers": {
        "Authorization": "Bearer ${REACTBITS_LICENSE_KEY}"
      }
    },
    "@reactbits-pro": {
      "url": "https://pro.reactbits.dev/api/r/pro/{name}.json",
      "headers": {
        "Authorization": "Bearer ${REACTBITS_LICENSE_KEY}"
      }
    }
  }
}
```

**Do NOT overwrite** existing `components.json` fields (`$schema`, `style`, `tailwind`, `aliases`, etc.). Only add or merge the `registries` object.

---

## Step 4: Install components

### Installing a component (from @reactbits-starter)

```bash
# Tailwind variant (recommended for Tailwind projects)
npx shadcn@latest add @reactbits-starter/{component-slug}-tw

# CSS variant (for non-Tailwind projects)
npx shadcn@latest add @reactbits-starter/{component-slug}-css
```

### Installing a block (from @reactbits-pro)

```bash
npx shadcn@latest add @reactbits-pro/{block-slug}
```

### Installing multiple at once

```bash
npx shadcn@latest add @reactbits-starter/silk-waves-tw @reactbits-starter/animated-list-tw @reactbits-pro/hero-1
```

---

## Step 5: Use the installed component

After installation, import and use the component:

```tsx
// Component example
import SilkWaves from "@/components/react-bits/silk-waves";

export default function MyPage() {
  return (
    <div className="h-screen w-full">
      <SilkWaves
        speed={1}
        scale={2}
        colors={["#0d1326", "#162a52", "#1e407e", "#2657aa", "#2e6ed5", "#3785ff", "#5092ff", "#69a0ff"]}
      />
    </div>
  );
}
```

```tsx
// Block example
import { Hero1 } from "@/components/blocks/hero-1";

export default function LandingPage() {
  return (
    <main>
      <Hero1 />
    </main>
  );
}
```

### Import patterns

- **Components** use `default` exports: `import ComponentName from "@/components/react-bits/{slug}"`
- **Blocks** use `named` exports matching PascalCase of slug: `import { Hero1 } from "@/components/blocks/hero-1"`
  - The exported function name is the PascalCase version: `hero-1` → `Hero1`, `pricing-3` → `Pricing3`, `navigation-2` → `Navigation2`
- **All components and blocks** include the `"use client"` directive — they are client components

---

## Complete component catalog

### Components (@reactbits-starter) — 100 components

All components are `starter` tier (accessible with any paid license).

#### Text & Typography animations
| Component | Slug | Description | Key deps |
|---|---|---|---|
| Staggered Text | `staggered-text` | Flexible text animation with staggered reveals | motion |
| Glitch Text | `glitch-text` | Canvas-based sticky glitch effect responding to cursor | — |
| Text Path | `text-path` | Animated text following an SVG path | gsap, @gsap/react |
| 3D Text Reveal | `3d-text-reveal` | Scroll-triggered 3D text animation | gsap, @gsap/react |
| Particle Text | `particle-text` | Interactive 3D particle text | three |
| Text Scatter | `text-scatter` | Interactive letter scatter effect | — |
| 3D Letter Swap | `3d-letter-swap` | Staggered 3D letter swap animation | — |
| Blur Highlight | `blur-highlight` | Blur-in effect with automatic text highlighting | motion |

#### Cursor effects
| Component | Slug | Description | Key deps |
|---|---|---|---|
| Smooth Cursor | `smooth-cursor` | Canvas-based smooth cursor trail with spring physics | — |
| Custom Cursor | `custom-cursor` | Interactive cursor with target morphing | motion |
| Dither Cursor | `dither-cursor` | Pixelated dithering trail effect | — |
| Ascii Cursor | `ascii-cursor` | ASCII character trail cursor | — |
| Glass Cursor | `glass-cursor` | Metaball glass cursor with refraction and blur | three |
| Cursor Wave | `cursor-wave` | A grid of shapes that reacts to your cursor and clicks | — |
| User Cursor | `user-cursor` | A custom cursor with a little name tag that follows along | — |

#### Cards & interactive elements
| Component | Slug | Description | Key deps |
|---|---|---|---|
| Shader Card | `shader-card` | Card with animated WebGL shader background | three |
| Chroma Card | `chroma-card` | Card with chromatic color shifting | — |
| Credit Card | `credit-card` | Interactive 3D credit card with parallax tilt | motion |
| Depth Card | `depth-card` | Perspective depth effect responding to mouse | motion |
| Modal Cards | `modal-cards` | Expandable cards opening into full-screen modals | motion |
| Rotating Cards | `rotating-cards` | 3D circular carousel with draggable cards | motion |
| Parallax Cards | `parallax-cards` | 3D layered cards with mouse-driven parallax | motion |
| Click Stack | `click-stack` | Click-to-cycle animated card stack | gsap |
| Warped Card | `warped-card` | Image card with mouse-following bulge distortion shader | three |

#### Backgrounds & visual effects
| Component | Slug | Description | Key deps |
|---|---|---|---|
| Silk Waves | `silk-waves` | Smooth flowing silk-like wave animation | three |
| Shader Waves | `shader-waves` | Animated wave patterns with noise | three |
| Chroma Waves | `chroma-waves` | Animated wave shader with noise distortion | three |
| Aurora Blur | `aurora-blur` | Ethereal aurora borealis blur | — |
| Gradient Blob | `gradient-blob` | Morphing 3D blob with cursor interaction | three |
| AI Blob | `ai-blob` | Animated 3D blob with glow effects | three |
| Dither Wave | `dither-wave` | Wave effect with retro dithering pattern | — |
| Radial Liquid | `radial-liquid` | Radial shader waves with distortion | three |
| Grain Wave | `grain-wave` | Grainy wave texture animation | — |
| Glass Flow | `glass-flow` | Flowing glass-like blur animation | — |
| Falling Rays | `falling-rays` | Light rays falling like rain | — |
| Light Droplets | `light-droplets` | Falling light streaks with glow | — |
| Lightspeed | `lightspeed` | Hyperspace light streak effect | — |
| Rising Lines | `rising-lines` | Ascending lines and particles with laser beam | three |
| Liquid Bars | `liquid-bars` | Liquid bar effect with smooth wave motion | — |
| Liquid Lines | `liquid-lines` | Flowing liquid line animation | — |
| Shadow Bars | `shadow-bars` | Animated shadow bar effect with depth | — |
| Color Loops | `color-loops` | Animated colorful orbital loops | — |
| Mosaic | `mosaic` | Mosaic effect with animated wave or video background | — |
| Flicker | `flicker` | Flickering particle grid | — |
| Vortex | `vortex` | Spinning 3D tunnel with particles | three |
| Portal | `portal` | Circular portal shader with particles | three |
| Perspective Grid | `perspective-grid` | Infinite 3D perspective grid with WebGL | three |
| Glitter Warp | `glitter-warp` | Starfield warp tunnel with particles | three |
| Star Burst | `star-burst` | Star burst explosion with particles | — |
| Rotating Stars | `rotating-stars` | Spinning star particles with orbital animation | — |
| Dot Shift | `dot-shift` | Shifting grid of animated dots | — |
| Synaptic Shift | `synaptic-shift` | Neural network-like connection animations | — |
| Ascii Waves | `ascii-waves` | Wave effect made of ASCII characters | — |
| Squircle Shift | `squircle-shift` | Morphing squircle shape animation | — |
| Center Flow | `center-flow` | Radial flowing animation from center | — |
| Warp Twister | `warp-twister` | Twisting warp distortion effect | — |
| Neon Reveal | `neon-reveal` | Neon bar sweep effect | — |
| Agentic Ball | `agentic-ball` | 3D shader orb with hue, swirl, complexity | three |
| Black Hole | `black-hole` | Gravitational particle effect with color cycling | three |
| Blurred Rays | `blurred-rays` | Flickering vertical light beams with bloom | three |
| Flame Paths | `flame-paths` | Animated flame-like wave effect | three |
| Frame Border | `frame-border` | Animated noise-textured border effect | three |
| Gradient Bars | `gradient-bars` | Animated striped gradient bars | three |
| Halftone Vortex | `halftone-vortex` | Cursor-reactive halftone dot vortex | three |
| Halftone Wave | `halftone-wave` | Animated halftone dot grid with noise | three |
| Liquid Ascii | `liquid-ascii` | Fluid simulation rendered as ASCII characters | — |
| Metallic Swirl | `metallic-swirl` | Metallic swirl shader background | three |
| Retro Lines | `retro-lines` | Retro perspective grid with scrolling waves | three |
| Rubber Fluid | `rubber-fluid` | Rubbery fluid distortion shader | three |
| Simple Swirl | `simple-swirl` | Rotating concentric swirl with glow | three |
| Square Matrix | `square-matrix` | Animated dot grid with wave presets | three |
| Star Swipe | `star-swipe` | Conformal star warp shader with sweeping motion | three |
| Swirl Blend | `swirl-blend` | Colorful iterative swirl shader with palette controls | three |
| Text Cube | `text-cube` | Cursor-following 3D text cube with depth fade | — |
| Watercolor | `watercolor` | Animated watercolor noise shader with two-color blend | three |
| Fog Sphere | `fog-sphere` | A soft, swirling sphere of fog | three |
| ASCII Tiles | `ascii-tiles` | A field of glassy tiles made of glowing ASCII characters | three |
| Twilight Lines | `twilight-lines` | Soft glowing lines that pulse with a warm sweep | three |
| Chroma Blinds | `chroma-blinds` | Colorful diagonal stripes that bend toward your cursor | three |
| Glass Tiles | `glass-tiles` | A shimmering background of colorful glass tiles | three |
| Blinking Squares | `blinking-squares` | A grid of little squares that quietly twinkle | three |

#### Galleries, carousels & layout
| Component | Slug | Description | Key deps |
|---|---|---|---|
| Circle Gallery | `circle-gallery` | Draggable circular carousel with inertia | motion |
| Gradient Carousel | `gradient-carousel` | 3D card carousel with dynamic gradient extraction | motion |
| Circles | `circles` | Rotating orbital rings with images | motion |
| Draggable Grid | `draggable-grid` | Pannable grid with drag and momentum | motion |
| Animated List | `animated-list` | Animated list with multiple entrance styles | motion |
| Comparison Slider | `comparison-slider` | Before/after image comparison | — |
| Hover Preview | `hover-preview` | Image previews on hover over text | motion |
| Infinite Gallery | `infinite-gallery` | 3D infinite scrolling image gallery with drag and parallax | three |
| Parallax Carousel | `parallax-carousel` | A draggable image carousel with a smooth parallax feel | three |
| Circle Stack | `circle-stack` | A tilted stack of circles that cycles through your images | — |

#### Other
| Component | Slug | Description | Key deps |
|---|---|---|---|
| Globe | `globe` | Interactive 3D globe with animated arcs | three |
| Device | `device` | CSS device mockup with custom content | — |
| Simple Graph | `simple-graph` | Animated line graph with interactions | — |
| Preloader | `preloader` | Animated loading screens with style variants | motion |
| Shader Reveal | `shader-reveal` | Interactive liquid image reveal | three |
| Liquid Swap | `liquid-swap` | Image transition with liquid glass ball effect | three |
| Pixelate Hover | `pixelate-hover` | Pixelation effect with cursor reveal | three |
| Pixel Reveal | `pixel-reveal` | An image that reveals itself through a sweep of pixels | three |
| Parallax Pills | `parallax-pills` | Bouncy labeled pills that drift along with your cursor | — |
| Magic Transform | `magic-transform` | Documents fly in and come out as colorful results | motion |

### Blocks (@reactbits-pro) — 158+ page sections

All blocks are `pro` tier (requires Pro or Ultimate license). Blocks are Tailwind-only.

| Category | Slug pattern | Variants | Description |
|---|---|---|---|
| Hero Section | `hero-1` through `hero-13` | 13 | Landing page heroes with various layouts, animations, WebGL, video, carousels |
| Features | `features-1` through `features-5` | 5 | Feature grids, tabs, marquees, auto-cycling carousels |
| Social Proof | `social-proof-1` through `social-proof-9` | 9 | Logo grids, testimonials, marquees, video players |
| Contact | `contact-1` through `contact-5` | 5 | Contact forms, card layouts, image carousels |
| Footer | `footer-1` through `footer-6` | 6 | Various footer layouts with links, newsletter, branding |
| Comparison | `comparison-1` through `comparison-3` | 3 | Feature comparison tables, bar charts |
| Navigation | `navigation-1` through `navigation-8` | 8 | Top navs, side navs, bottom navs, mobile menus |
| Auth | `auth-1` through `auth-3` | 3 | Sign-in/sign-up forms with various layouts |
| Call To Action | `cta-1` through `cta-5` | 5 | CTAs with parallax, cursor trails, video masks |
| FAQ | `faq-1` through `faq-3` | 3 | Accordion, chat-style, tabbed FAQs |
| Pricing | `pricing-1` through `pricing-6` | 6 | Pricing tables with toggles, comparisons |
| Stats | `stats-1` through `stats-8` | 8 | Metrics displays with charts, maps, animations |
| 404 | `404-1`, `404-2` | 2 | Creative error pages |
| Profile | `profile-1` through `profile-3` | 3 | User profile cards and sections |
| About | `about-1` through `about-5` | 5 | Company story, timeline, metrics sections |
| Waitlist | `waitlist-1` through `waitlist-3` | 3 | Pre-launch signup sections |
| Showcase | `showcase-1` through `showcase-3` | 3 | Portfolio and product display sections |
| How It Works | `how-it-works-1` through `how-it-works-3` | 3 | Step-by-step process sections |
| Download | `download-1` through `download-3` | 3 | App download sections |
| Blog | `blog-1` through `blog-5` | 5 | Blog listings, article pages |

---

## Common dependency requirements

Many components use specialized libraries. When you install via the shadcn CLI, dependencies are automatically resolved. However, be aware of these key dependencies so you can help the user troubleshoot:

| Dependency | Used by | Notes |
|---|---|---|
| `three` | Shader, WebGL, 3D components (silk-waves, shader-card, globe, ai-blob, etc.) | Three.js for WebGL rendering |
| `@react-three/fiber` | Some 3D components | React renderer for Three.js |
| `@react-three/drei` | Some 3D components | Helper components for R3F |
| `motion` (or `framer-motion`) | Most animated components and all blocks | Animation library. Import from `motion/react` |
| `gsap` + `@gsap/react` | text-path, 3d-text-reveal, some blocks | GreenSock animation. Requires `ScrollTrigger` plugin for scroll animations |
| `lucide-react` | Most blocks | Icon library |
| `next-themes` | Some components | Theme provider for dark mode |
| `d3` | Some visualization components | Data visualization |

### Important: `"use client"` directive

ALL React Bits Pro components and blocks include `"use client"` at the top. They are client components. If you are using them in a Server Component page in Next.js App Router, simply import them — Next.js handles the client boundary automatically. Do NOT try to remove the `"use client"` directive.

---

## Building a landing page with blocks

A common use case is composing a full landing page from blocks. Here is the recommended approach:

### 1. Install the blocks you need

```bash
npx shadcn@latest add @reactbits-pro/navigation-1 @reactbits-pro/hero-1 @reactbits-pro/features-1 @reactbits-pro/social-proof-1 @reactbits-pro/pricing-1 @reactbits-pro/faq-1 @reactbits-pro/cta-1 @reactbits-pro/footer-1
```

### 2. Compose them in a page

```tsx
import { Navigation1 } from "@/components/blocks/navigation-1";
import { Hero1 } from "@/components/blocks/hero-1";
import { Features1 } from "@/components/blocks/features-1";
import { SocialProof1 } from "@/components/blocks/social-proof-1";
import { Pricing1 } from "@/components/blocks/pricing-1";
import { Faq1 } from "@/components/blocks/faq-1";
import { Cta1 } from "@/components/blocks/cta-1";
import { Footer1 } from "@/components/blocks/footer-1";

export default function LandingPage() {
  return (
    <>
      <Navigation1 />
      <Hero1 />
      <Features1 />
      <SocialProof1 />
      <Pricing1 />
      <Faq1 />
      <Cta1 />
      <Footer1 />
    </>
  );
}
```

### 3. Customize content

Blocks are installed as local source files. Edit them directly to:
- Replace placeholder text, images, and links with real content
- Adjust colors to match the brand
- Modify layout or spacing
- Add or remove sections within the block
- Wire up form submissions, button clicks, and navigation links

---

## Combining components with blocks

You can use standalone components inside blocks or alongside them:

```tsx
import SilkWaves from "@/components/react-bits/silk-waves";
import { Hero1 } from "@/components/blocks/hero-1";

export default function LandingPage() {
  return (
    <>
      {/* Animated background behind the hero */}
      <div className="relative">
        <div className="absolute inset-0 -z-10">
          <SilkWaves speed={0.5} opacity={0.3} />
        </div>
        <Hero1 />
      </div>
    </>
  );
}
```

---

## Customizing components

Since components are local source files, you can customize them freely:

### Props customization (no code changes needed)

Most components accept extensive props. For example, `SilkWaves`:

```tsx
<SilkWaves
  speed={1.5}
  scale={3}
  distortion={0.8}
  curve={1.2}
  contrast={1}
  colors={["#1a0533", "#2d1b69", "#4a2c8a", "#6b3fa0", "#8b52b8", "#ab65d0", "#cb78e8", "#eb8bff"]}
  rotation={45}
  brightness={1.2}
  opacity={0.9}
  complexity={1.5}
  frequency={1.2}
  className="absolute inset-0"
/>
```

### Source code modification

For deeper changes, edit the installed `.tsx` file directly. Common modifications:
- Changing animation parameters or timing
- Adjusting responsive breakpoints
- Adding new props
- Modifying color schemes
- Integrating with state management
- Connecting to APIs or databases

---

## Dark mode support

All blocks and most components support dark mode via Tailwind's `dark:` variant. They use the standard `dark` class strategy. Ensure your app has a theme provider set up:

```tsx
// layout.tsx
import { ThemeProvider } from "next-themes";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

## Troubleshooting

### "Unknown registry @reactbits-starter"
The `registries` block is missing from `components.json`. Add it per Step 3 above.

### "Unauthorized - License key required"
The `REACTBITS_LICENSE_KEY` environment variable is not set. Add it to `.env.local`.

### "Forbidden - Insufficient tier"
The user's license tier doesn't include access to the requested content. Starter licenses cannot access `@reactbits-pro` blocks — a Pro or Ultimate license is required.

### Component not found
- For components: ensure you're using the `-tw` or `-css` suffix (e.g., `silk-waves-tw`, not `silk-waves`)
- For blocks: do NOT add a suffix (e.g., `hero-1`, not `hero-1-tw`)

### Missing `cn` function
Install the utility: `npm install clsx tailwind-merge`, then create `lib/utils.ts` with the `cn` function shown in Step 1.

### WebGL/Three.js components show blank
- Ensure `three` is installed: `npm install three`
- These components require a browser with WebGL support
- The component's container must have explicit dimensions (width/height)
- For SSR frameworks, the `"use client"` directive handles client-only rendering

### GSAP scroll animations not working
- Ensure `gsap` and `@gsap/react` are installed
- `ScrollTrigger` is registered automatically in component code
- The scroll container must be the default document scroll (not a custom scroll container) unless configured

### Blocks look unstyled
- Ensure Tailwind CSS is properly configured
- Blocks use Tailwind v4 syntax — if using v3, minor class adjustments may be needed
- Check that `globals.css` imports Tailwind: `@import "tailwindcss"`

---

## Best practices

1. **Choose one variant and be consistent** — pick either `-tw` or `-css` for all components in a project
2. **Always use the Tailwind variant (`-tw`) if the project uses Tailwind CSS** — it integrates better and is smaller
3. **Give WebGL components explicit dimensions** — wrap them in a container with set width/height
4. **Lazy-load heavy components** — use `next/dynamic` for Three.js-based components if not above the fold:
   ```tsx
   import dynamic from "next/dynamic";
   const SilkWaves = dynamic(() => import("@/components/react-bits/silk-waves"), { ssr: false });
   ```
5. **Keep license keys secure** — never hardcode them; always use environment variables
6. **Customize blocks by editing source** — blocks are meant to be starting points, not rigid templates
7. **Preview before installing** — use `npx shadcn@latest view @reactbits-starter/silk-waves-tw` to inspect a component before adding it
8. **Install this skill into projects** — run `npx shadcn@latest add @reactbits-starter/skill` to drop this SKILL.md into the project root so agents always have it available locally