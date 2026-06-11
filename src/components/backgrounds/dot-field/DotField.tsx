/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Dot Field — a canvas grid of dots that bulge away from the cursor, with a
 * soft glow trailing the pointer. Adapted from reactbits.dev/backgrounds/dot-field.
 * Colors derive from the active theme's `--primary` token (re-read on theme change).
 */

import { useEffect, useRef } from "react";

const DOT_RADIUS = 1.5;
const DOT_SPACING = 14;
const CURSOR_RADIUS = 500;
const BULGE_STRENGTH = 67;
const TWO_PI = Math.PI * 2;

interface Dot {
  ax: number;
  ay: number;
  sx: number;
  sy: number;
}

type ThemeColors = {
  gradientFrom: string;
  gradientTo: string;
};

const readThemeColors = (): ThemeColors => {
  const primary =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--primary")
      .trim() || "oklch(0.5 0 0)";
  const match = primary.match(/^oklch\(([^/)]+?)(?:\s*\/[^)]+)?\)$/i);
  const inner = match ? match[1].trim() : "0.5 0 0";
  return {
    gradientFrom: `oklch(${inner} / 0.4)`,
    gradientTo: `oklch(${inner} / 0.16)`,
  };
};

export default function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const step = DOT_RADIUS + DOT_SPACING;
    const dotRad = DOT_RADIUS / 2;
    const crSq = CURSOR_RADIUS * CURSOR_RADIUS;

    let dots: Dot[] = [];
    let w = 0;
    let h = 0;
    let colors = readThemeColors();
    let engagement = 0;
    let raf = 0;
    let resizeTimer: ReturnType<typeof setTimeout>;
    const mouse = { x: -9999, y: -9999, prevX: -9999, prevY: -9999, speed: 0 };

    const buildDots = () => {
      const cols = Math.floor(w / step);
      const rows = Math.floor(h / step);
      const padX = (w % step) / 2;
      const padY = (h % step) / 2;
      dots = new Array(rows * cols);
      let i = 0;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const ax = padX + col * step + step / 2;
          const ay = padY + row * step + step / 2;
          dots[i++] = { ax, ay, sx: ax, sy: ay };
        }
      }
    };

    const doResize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildDots();
    };

    const resize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(doResize, 100);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const speedInterval = setInterval(() => {
      const dx = mouse.prevX - mouse.x;
      const dy = mouse.prevY - mouse.y;
      mouse.speed += (Math.sqrt(dx * dx + dy * dy) - mouse.speed) * 0.5;
      if (mouse.speed < 0.001) mouse.speed = 0;
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
    }, 20);

    const observer = new MutationObserver(() => {
      colors = readThemeColors();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const tick = () => {
      engagement += (Math.min(mouse.speed / 5, 1) - engagement) * 0.06;
      if (engagement < 0.001) engagement = 0;
      const eng = engagement;

      ctx.clearRect(0, 0, w, h);

      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, colors.gradientFrom);
      grad.addColorStop(1, colors.gradientTo);
      ctx.fillStyle = grad;
      ctx.beginPath();

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const dx = mouse.x - d.ax;
        const dy = mouse.y - d.ay;
        const distSq = dx * dx + dy * dy;

        if (distSq < crSq && eng > 0.01) {
          const dist = Math.sqrt(distSq);
          const falloff = 1 - dist / CURSOR_RADIUS;
          const push = falloff * falloff * BULGE_STRENGTH * eng;
          const angle = Math.atan2(dy, dx);
          d.sx += (d.ax - Math.cos(angle) * push - d.sx) * 0.15;
          d.sy += (d.ay - Math.sin(angle) * push - d.sy) * 0.15;
        } else {
          d.sx += (d.ax - d.sx) * 0.1;
          d.sy += (d.ay - d.sy) * 0.1;
        }

        ctx.moveTo(d.sx + dotRad, d.sy);
        ctx.arc(d.sx, d.sy, dotRad, 0, TWO_PI);
      }
      ctx.fill();

      raf = requestAnimationFrame(tick);
    };

    doResize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(speedInterval);
      clearTimeout(resizeTimer);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="block h-full w-full" />;
}
