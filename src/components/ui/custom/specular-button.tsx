/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import * as React from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";
import { cn } from "@/lib/utils";

/**
 * SpecularButton — the React Bits specular glass button: a tinted glass
 * surface with a floating shadow whose edge carries a soft shader-drawn rim
 * and a moving specular glint.
 *
 * Colors are wired to the theme's tokens (any CSS color works, including
 * `var(--token)` and `color-mix(...)` expressions — re-resolved when the
 * theme changes). Variants follow the shadcn Button vocabulary as glass
 * colorways. The glint steers toward the cursor and fades in with proximity;
 * keyboard focus lights it too, and `autoAnimate` keeps a slow sweep running.
 *
 * Each instance owns one WebGL context (browsers cap these around a dozen) —
 * reserve it for hero moments, not lists of buttons.
 */

type ButtonSize = "sm" | "md" | "lg";

export type SpecularVariant =
  "default" | "secondary" | "outline" | "ghost" | "destructive";

export interface SpecularButtonProps extends React.ComponentProps<"button"> {
  /**
   * Colorway on the shadcn Button vocabulary (`link` is omitted — a text
   * link has no surface or edge to shine). Every color below defaults from
   * the variant and can be overridden individually.
   */
  variant?: SpecularVariant;
  /** Preset padding and font size of the button. */
  size?: ButtonSize;
  /** Corner radius in pixels; clamps to a pill automatically. */
  radius?: number;
  /** Color of the glass background tint. */
  tint?: string;
  /** Strength of the glass tint, 0–1. */
  tintOpacity?: number;
  /** Backdrop blur in pixels behind the button. */
  blur?: number;
  /** Color of the button label. */
  textColor?: string;
  /** Color of the moving specular glint. */
  lineColor?: string;
  /** Color of the static rim stroke under the glint. */
  baseColor?: string;
  /** Opacity of the static rim stroke. */
  baseOpacity?: number;
  /** Brightness multiplier of the glint. */
  intensity?: number;
  /** Angular size of each glint streak along the edge, in degrees. */
  shineSize?: number;
  /** How gradually each streak fades out at its ends, in degrees. */
  shineFade?: number;
  /** Width of the glint line in CSS pixels. */
  thickness?: number;
  /** Idle sweep speed in radians per second. */
  speed?: number;
  /** Point the light toward the cursor. */
  followMouse?: boolean;
  /** Distance in pixels within which the glint fades in as the cursor nears. */
  proximity?: number;
  /** Keep the glint always on with a rotating sweep. */
  autoAnimate?: boolean;
}

// Mobile-first like the rest of the hero (social chips, headings): each
// preset starts one step lighter and reaches its full reference dimensions
// from the sm: breakpoint up. leading-none lives inside each entry, AFTER
// its text-* class — tailwind-merge counts font-size as a line-height
// conflict and drops a leading-* declared before it.
const SIZES: Record<ButtonSize, string> = {
  sm: "px-[18px] py-[9px] text-[0.8rem] sm:px-[22px] sm:py-[10px] sm:text-[0.85rem] leading-none",
  md: "px-[26px] py-[12px] text-[0.9rem] sm:px-[30px] sm:py-[14px] sm:text-[1rem] leading-none",
  lg: "px-[30px] py-[14px] text-[1rem] sm:px-10 sm:py-[18px] sm:text-[1.15rem] leading-none",
};

interface Colorway {
  tint: string;
  tintOpacity: number;
  text: string;
  line: string;
  base: string;
  shadow: boolean;
}

/**
 * Glass colorways per variant, mirroring the shadcn Button's rest-state token
 * families. The rim (base) is dim and mostly neutral; the glint (line) is a
 * pale bright cast of the variant color so the moving light always outshines
 * the static edge.
 */
const VARIANTS: Record<SpecularVariant, Colorway> = {
  // Primary-tinted glass: the accent lives in the tint, a primary-leaning
  // rim, and a pale primary glint.
  default: {
    tint: "var(--primary)",
    tintOpacity: 0.15,
    text: "var(--foreground)",
    line: "color-mix(in oklch, var(--primary) 40%, white)",
    base: "color-mix(in oklch, var(--primary) 55%, var(--muted-foreground))",
    shadow: true,
  },
  secondary: {
    tint: "var(--secondary)",
    tintOpacity: 0.6,
    text: "var(--secondary-foreground)",
    line: "color-mix(in oklch, var(--foreground) 25%, white)",
    base: "var(--muted-foreground)",
    shadow: true,
  },
  // outline is the pure reference glass, defined by its rim.
  outline: {
    tint: "var(--foreground)",
    tintOpacity: 0,
    text: "var(--foreground)",
    line: "color-mix(in oklch, var(--foreground) 25%, white)",
    base: "var(--muted-foreground)",
    shadow: true,
  },
  // ghost is invisible until lit: no surface, no rim, no shadow.
  ghost: {
    tint: "var(--foreground)",
    tintOpacity: 0,
    text: "var(--foreground)",
    line: "color-mix(in oklch, var(--foreground) 25%, white)",
    base: "transparent",
    shadow: false,
  },
  // Mirrors the shadcn soft destructive (bg-destructive/10 text-destructive).
  destructive: {
    tint: "var(--destructive)",
    tintOpacity: 0.1,
    text: "var(--destructive)",
    line: "color-mix(in oklch, var(--destructive) 45%, white)",
    base: "var(--destructive)",
    shadow: true,
  },
};

interface ShaderProps {
  radius: number;
  line: string;
  base: string;
  /** Allow the light-theme flip below (off when the color prop is explicit). */
  adaptLine: boolean;
  adaptBase: boolean;
  baseOpacity: number;
  intensity: number;
  shineSize: number;
  shineFade: number;
  thickness: number;
  speed: number;
  followMouse: boolean;
  proximity: number;
  autoAnimate: boolean;
  disabled: boolean;
}

type Rgba = readonly [number, number, number, number];

const mixRgb = (
  c: Rgba,
  toward: readonly [number, number, number],
  k: number,
): Rgba => [
  c[0] + (toward[0] - c[0]) * k,
  c[1] + (toward[1] - c[1]) * k,
  c[2] + (toward[2] - c[2]) * k,
  c[3],
];

const luminance = (c: Rgba) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];

let probe: CanvasRenderingContext2D | null = null;

/**
 * Resolve any CSS color — including `var(--token)` references and
 * `color-mix(...)` expressions against the element's cascade — to
 * non-premultiplied 0–1 RGBA. The canvas round-trip is what lets the shader
 * consume the oklch theme tokens.
 */
const resolveColor = (input: string, el: HTMLElement): Rgba => {
  const styles = getComputedStyle(el);
  const value = input
    .trim()
    .replace(
      /var\((--[\w-]+)\)/g,
      (_, name: string) => styles.getPropertyValue(name).trim() || "#fff",
    );
  probe ??= document
    .createElement("canvas")
    .getContext("2d", { willReadFrequently: true });
  if (!probe) return [1, 1, 1, 1];
  probe.fillStyle = "#fff"; // known sentinel — invalid input keeps the previous fillStyle
  probe.fillStyle = value;
  probe.clearRect(0, 0, 1, 1);
  probe.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = probe.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255, a / 255];
};

// Canvas bleed around the button so the glow isn't clipped at the border
// box; also drives the fx span's inset so the two can't drift apart.
const PAD = 20;

const TAU = Math.PI * 2;
const wrapAngle = (a: number) => ((a % TAU) + TAU) % TAU;

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2 uCenter;
uniform vec2 uHalfSize;
uniform float uRadius;
uniform float uAngle;
uniform float uPx;
uniform vec3 uLineColor;
uniform vec3 uBaseColor;
uniform float uIntensity;
uniform float uShineSize;
uniform float uShineFade;
uniform float uThickness;
uniform float uBaseWidth;
uniform float uBaseAlpha;

out vec4 fragColor;

float sdRoundedRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float gaussianLine(float d, float sigma) {
  float x = d / (sigma + 1e-6);
  float k = mix(1.0, 1.6, smoothstep(0.0, 1.5, x));
  return exp(-k * x * x);
}

void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float d = sdRoundedRect(p, uHalfSize, uRadius);
  vec2 L = vec2(cos(uAngle), sin(uAngle));

  // Soft rim stroke hugging the edge for a sense of thickness
  float base = (1.0 - smoothstep(0.0, uBaseWidth, abs(d))) * uBaseAlpha;

  // Symmetric specular: the edges facing toward/away from the light both
  // catch a streak. The angular window (size + fade) is measured with an
  // elliptical normal so it varies continuously along straight edges.
  vec2 nEll = normalize(p / (uHalfSize * uHalfSize) + 1e-6);
  float phi = acos(clamp(abs(dot(nEll, L)), 0.0, 1.0));
  float rim = 1.0 - smoothstep(uShineSize - uShineFade, uShineSize + uShineFade + 1e-4, phi);
  float core = gaussianLine(d, uThickness) * (1.0 - smoothstep(0.5 * uPx, 3.0 * uPx, abs(d)));
  // Soft halo around the core so the sweep has presence on any surface — a
  // dark glint on a light theme can't rely on additive glow the way the
  // reference's white-on-black does.
  float halo = 0.35 * gaussianLine(d, uThickness + 5.0 * uPx);
  float hi = (core + halo) * rim * uIntensity;

  vec3 col = uBaseColor * base + uLineColor * hi;
  float a = clamp(base + hi, 0.0, 1.0);
  fragColor = vec4(col, a);
}
`;

export function SpecularButton({
  variant = "default",
  size = "lg",
  radius = 18,
  tint,
  tintOpacity,
  blur = 0,
  textColor,
  lineColor,
  baseColor,
  baseOpacity = 0.45,
  intensity = 1,
  shineSize = 10,
  shineFade = 40,
  thickness = 1,
  speed = 0.35,
  followMouse = true,
  proximity = 250,
  autoAnimate = false,
  disabled = false,
  className,
  style,
  children,
  ref,
  ...props
}: SpecularButtonProps) {
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const fxRef = React.useRef<HTMLSpanElement>(null);
  const propsRef = React.useRef<ShaderProps | null>(null);
  const startRef = React.useRef<(() => void) | null>(null);

  const way = VARIANTS[variant] ?? VARIANTS.default;
  const tintC = tint ?? way.tint;
  const tintO = tintOpacity ?? way.tintOpacity;
  const textC = textColor ?? way.text;
  const lineC = lineColor ?? way.line;
  const baseC = baseColor ?? way.base;

  // Declared before the setup effect so propsRef is populated on mount, then
  // pokes the loop awake after every commit so prop changes take effect even
  // while it sleeps.
  React.useEffect(() => {
    propsRef.current = {
      radius,
      line: lineC,
      base: baseC,
      adaptLine: lineColor == null,
      adaptBase: baseColor == null,
      baseOpacity,
      intensity,
      shineSize,
      shineFade,
      thickness,
      speed,
      followMouse,
      proximity,
      autoAnimate,
      disabled,
    };
    startRef.current?.();
  });

  React.useEffect(() => {
    const btn = btnRef.current;
    const fx = fxRef.current;
    if (!btn || !fx) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        alpha: true,
        premultipliedAlpha: true,
        antialias: true,
        dpr: window.devicePixelRatio || 1,
      });
    } catch (err) {
      // Loud on purpose: browsers cap live WebGL contexts (~a dozen), and a
      // long dev session of hot reloads can exhaust them — the button then
      // keeps its glass styling but would otherwise lose the rim and glint
      // silently.
      console.warn("SpecularButton: WebGL unavailable, effect disabled", err);
      return;
    }
    const dpr = renderer.dpr;
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const geometry = new Triangle(gl);

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uCenter: { value: [0, 0] },
        uHalfSize: { value: [1, 1] },
        uRadius: { value: 0 },
        uAngle: { value: 2.4 },
        uPx: { value: dpr },
        uLineColor: { value: [1, 1, 1] },
        uBaseColor: { value: [1, 1, 1] },
        uIntensity: { value: 0 },
        uShineSize: { value: 0.17 },
        uShineFade: { value: 0.7 },
        uThickness: { value: 1 },
        uBaseWidth: { value: dpr },
        uBaseAlpha: { value: 0 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    fx.appendChild(gl.canvas);

    const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fineMq = window.matchMedia("(hover: hover) and (pointer: fine)");

    const sizeRef = { w: 0, h: 0 };
    const resize = (w: number, h: number) => {
      sizeRef.w = w;
      sizeRef.h = h;
      renderer.setSize(w + PAD * 2, h + PAD * 2);
      program.uniforms.uCenter.value = [
        (PAD + w / 2) * dpr,
        (PAD + h / 2) * dpr,
      ];
      program.uniforms.uHalfSize.value = [(w / 2) * dpr, (h / 2) * dpr];
      start();
    };
    // Layout size, NOT getBoundingClientRect: the route transition animates
    // scale on the page, and a rect measured mid-transform pins the SDF a few
    // percent small forever (transforms never re-fire the observer). The
    // observer's fractional borderBoxSize is transform-independent, and its
    // guaranteed initial delivery replaces a manual first measure.
    const ro = new ResizeObserver((entries) => {
      const box = entries[entries.length - 1]?.borderBoxSize?.[0];
      if (box) resize(box.inlineSize, box.blockSize);
      else resize(btn.offsetWidth, btn.offsetHeight);
    });
    ro.observe(btn);

    // Offscreen guard: with autoAnimate the loop never settles, which would
    // otherwise keep a live WebGL context rendering at full frame rate after
    // the button scrolls out of view.
    let inView = true;
    const io = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? true;
      if (inView) start();
    });
    io.observe(btn);

    // Theme-token colors resolve lazily: whenever the color props change or
    // the theme provider restamps <html>, the next frame re-reads them.
    let lineRgba: Rgba = [1, 1, 1, 1];
    let baseRgba: Rgba = [1, 1, 1, 1];
    let colorKey = "";
    let themeDirty = true;
    const ensureColors = (p: ShaderProps) => {
      const key = `${p.line}|${p.base}`;
      if (key === colorKey && !themeDirty) return;
      colorKey = key;
      themeDirty = false;
      lineRgba = resolveColor(p.line, btn);
      baseRgba = resolveColor(p.base, btn);
      // The effect is additive light, which cannot read on a light page — a
      // pale glint on white is invisible. On light themes flip the glint to a
      // deep cast of the same hue (a dark sheen, the one specular treatment
      // that reads on white) and anchor the rim a step darker. Dark themes
      // keep the reference rendering untouched.
      if (luminance(resolveColor("var(--background)", btn)) > 0.6) {
        if (p.adaptLine) lineRgba = mixRgb(lineRgba, [0, 0, 0], 0.72);
        if (p.adaptBase) baseRgba = mixRgb(baseRgba, [0, 0, 0], 0.35);
      }
    };
    const mo = new MutationObserver(() => {
      themeDirty = true;
      start();
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-scheme", "style"],
    });

    // Light angle steers toward the pointer (anywhere on the page) and falls
    // back to a slow sweep when the pointer hasn't moved yet.
    let pointerAngle: number | null = null;
    let proximityT = 0;
    let focusVisible = false;

    let angle = 2.4;
    let idleAngle = 2.4;
    let bright = 0;
    let last = 0;
    let raf = 0;
    let running = false;

    const onPointerMove = (e: PointerEvent) => {
      if (!fineMq.matches) return; // touch taps would flash phantom glints
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right);
      const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom);
      const dist = Math.hypot(dx, dy);
      // Over the button itself the light settles on the diagonal (framing the
      // corners) and gently sways with the cursor position within the button.
      if (dist === 0) {
        const nx = (e.clientX - cx) / (rect.width / 2);
        const ny = (cy - e.clientY) / (rect.height / 2);
        pointerAngle =
          Math.atan2(2 / rect.height, -2 / rect.width) + nx * 0.3 + ny * 0.15;
      } else {
        pointerAngle = Math.atan2(cy - e.clientY, e.clientX - cx);
      }
      const t = Math.max(
        0,
        1 - dist / Math.max(propsRef.current?.proximity ?? 1, 1),
      );
      proximityT = t * t * (3 - 2 * t);
      // While invisible the angle just snaps (no work to animate); otherwise
      // wake the loop to chase the light.
      if (proximityT > 0 || bright > 0.002) start();
      else angle = wrapAngle(pointerAngle);
    };
    const onPointerLeave = () => {
      proximityT = 0;
      start();
    };
    const onFocus = () => {
      focusVisible = btn.matches(":focus-visible");
      start();
    };
    const onBlur = () => {
      focusVisible = false;
      start();
    };
    window.addEventListener("pointermove", onPointerMove);
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    btn.addEventListener("focus", onFocus);
    btn.addEventListener("blur", onBlur);

    const update = (now: number) => {
      const p = propsRef.current;
      if (!p || !inView) {
        running = false;
        return;
      }
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ensureColors(p);

      // The idle sweep is decorative autoplay, so it stills under
      // prefers-reduced-motion; pointer steering is input feedback and stays.
      const sweeping = (p.autoAnimate || focusVisible) && !reducedMq.matches;
      if (sweeping) idleAngle = wrapAngle(idleAngle + p.speed * dt);

      const target =
        p.followMouse &&
        pointerAngle != null &&
        ((!p.autoAnimate && !focusVisible) || proximityT > 0)
          ? wrapAngle(pointerAngle)
          : idleAngle;
      const diff = ((target - angle + Math.PI * 3) % TAU) - Math.PI;
      angle = wrapAngle(angle + diff * (1 - Math.exp(-dt * 7)));

      // The glint fades in with pointer proximity unless focus/autoAnimate
      // holds it on
      const brightTarget = p.disabled
        ? 0
        : p.autoAnimate || focusVisible
          ? 1
          : proximityT;
      bright += (brightTarget - bright) * (1 - Math.exp(-dt * 8));

      // Once everything has converged, snap and let the loop sleep — events
      // (pointer, focus, theme, resize, props) wake it back up.
      const settled =
        !sweeping &&
        Math.abs(diff) < 0.002 &&
        Math.abs(brightTarget - bright) < 0.002;
      if (settled) {
        angle = target;
        bright = brightTarget;
      }

      program.uniforms.uAngle.value = angle;
      program.uniforms.uRadius.value =
        Math.min(p.radius, Math.min(sizeRef.w, sizeRef.h) / 2) * dpr;
      program.uniforms.uLineColor.value = [
        lineRgba[0],
        lineRgba[1],
        lineRgba[2],
      ];
      program.uniforms.uBaseColor.value = [
        baseRgba[0],
        baseRgba[1],
        baseRgba[2],
      ];
      program.uniforms.uIntensity.value = p.intensity * bright * lineRgba[3];
      program.uniforms.uBaseAlpha.value = Math.min(
        1,
        p.baseOpacity * baseRgba[3],
      );
      program.uniforms.uShineSize.value = (p.shineSize * Math.PI) / 180;
      program.uniforms.uShineFade.value = (p.shineFade * Math.PI) / 180;
      program.uniforms.uThickness.value = p.thickness * dpr;
      renderer.render({ scene: mesh });

      if (settled) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(update);
    };

    const start = () => {
      if (running || sizeRef.w === 0) return; // nothing to draw before first measure
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(update);
    };
    startRef.current = start;

    return () => {
      cancelAnimationFrame(raf);
      running = false;
      startRef.current = null;
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave,
      );
      btn.removeEventListener("focus", onFocus);
      btn.removeEventListener("blur", onBlur);
      if (gl.canvas.parentNode === fx) fx.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <button
      // Composed so a caller-supplied ref (part of ComponentProps in React
      // 19) can't silently replace the internal one and kill the effect.
      ref={(node) => {
        btnRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      type="button"
      disabled={disabled}
      className={cn(
        "relative m-0 inline-flex cursor-pointer items-center justify-center border-none font-medium tracking-[0.01em] whitespace-nowrap outline-none select-none",
        "transition-transform duration-150 active:scale-[0.97]",
        "disabled:cursor-default disabled:opacity-55 disabled:active:scale-100",
        "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ring",
        "[color:var(--sb-text)] [border-radius:var(--sb-radius)] [backdrop-filter:blur(var(--sb-blur))]",
        "[background:color-mix(in_srgb,var(--sb-tint)_calc(var(--sb-tint-opacity)*100%),transparent)]",
        way.shadow &&
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.25)]",
        SIZES[size] ?? SIZES.md,
        className,
      )}
      style={
        {
          "--sb-radius": `${radius}px`,
          "--sb-tint": tintC,
          "--sb-tint-opacity": tintO,
          "--sb-blur": `${blur}px`,
          "--sb-text": textC,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {/* The label stays unpositioned on purpose: stacking it above the
          composited canvas gives the text its own compositor layer, which can
          hold a stale (visibly off-center) raster after the page's entrance
          transform until a repaint. The canvas only draws edge pixels, so
          painting it above the label is harmless. */}
      <span
        ref={fxRef}
        aria-hidden
        className="pointer-events-none absolute [&_canvas]:block [&_canvas]:size-full"
        style={{ inset: -PAD }}
      />
      <span>{children}</span>
    </button>
  );
}
