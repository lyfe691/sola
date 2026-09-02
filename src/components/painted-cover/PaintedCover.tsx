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
  useCallback,
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
  /** card: aspect 21/9, STEPS 5. hero: fills its box (pass className="absolute inset-0"), STEPS 6. */
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
        uAspect: { value: 21 / 9 },
        uColor1: { value: toRGB(art.colors[0]) },
        uColor2: { value: toRGB(art.colors[1]) },
        uScale: { value: art.scale },
        uSpeed: { value: art.speed },
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
      // fade over the gradient from the next frame, once this one is on screen
      requestAnimationFrame(() => {
        canvas.style.opacity = "1";
      });
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
  canvas.style.opacity = "0";
  canvas.style.transition = "opacity 700ms var(--ease-out)";
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
  const fireReady = useCallback(() => {
    if (readyFired.current) return;
    readyFired.current = true;
    onReadyRef.current?.();
  }, []);

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
        cover = createCover(host, resolved, size, time, fireReady);
        if (cover) setController(cover);
        else fireReady();
      },
    });
    return () => {
      cancelled = true;
      cancelQueue();
      cover?.dispose();
      setController(null);
    };
  }, [near, resolved, size, fireReady]);

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
        size === "card" && "aspect-[21/9]",
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
      <div className={SCRIM_CLASS[scrim]} aria-hidden="true" />
      {children}
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
