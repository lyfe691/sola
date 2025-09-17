/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "../theme-provider";
import { THEMES, type Theme } from "@/config/themes";
import { Shuffle, Check, Sparkles, X, Dice5 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";

const STORAGE_SEEN_KEY = "theme-randomizer-seen";
const STORAGE_THEME_KEY = "vite-ui-theme";

const CANDIDATE_THEMES = THEMES.filter(t => t.value !== "system");

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function ThemeRandomizer() {
  const { theme, setTheme } = useTheme();
  const { language } = useLanguage();
  const t = translations[language].randomizer;
  const [open, setOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(() => Math.max(0, CANDIDATE_THEMES.findIndex(t => t.value === theme)) || 0);
  const originalThemeRef = useRef<Theme | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const lastStepAtRef = useRef<number>(0);

  // URL param test controls
  // Supported:
  //   ?randomizer=open | reset | clear (alias: tr)
  //   ?randomizerTheme=cyber        (alias: trTheme)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const action = (params.get("randomizer") || params.get("tr") || "").toLowerCase();
      const themeParam = (params.get("randomizerTheme") || params.get("trTheme") || "") as Theme;

      if (action === "clear" || action === "reset") {
        try {
          localStorage.removeItem(STORAGE_SEEN_KEY);
          localStorage.removeItem(STORAGE_THEME_KEY);
        } catch {}
      }

      if (themeParam) {
        const known = CANDIDATE_THEMES.find(t => t.value === themeParam);
        if (known) setTheme(themeParam);
      }

      if (action === "open" || action === "reset") {
        setOpen(true);
      }
    } catch {}
  }, [setTheme]);

  useEffect(() => {
    if (open) {
      if (originalThemeRef.current == null) originalThemeRef.current = theme;
    } else {
      originalThemeRef.current = null;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      setSpinning(false);
    }
  }, [open, theme]);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_SEEN_KEY) === "true";
      const storedTheme = localStorage.getItem(STORAGE_THEME_KEY) as Theme | null;
      if (!seen && !storedTheme) {
        const timer = window.setTimeout(() => setOpen(true), 700);
        return () => window.clearTimeout(timer);
      }
    } catch {
      const timer = window.setTimeout(() => setOpen(true), 700);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const closeModal = useMemo(() => () => {
    setOpen(false);
    try { localStorage.setItem(STORAGE_SEEN_KEY, "true"); } catch {}
  }, []);

  const onKeep = () => {
    const chosen = CANDIDATE_THEMES[currentIdx];
    setTheme(chosen.value as Theme);
    closeModal();
  };

  const onSpin = () => {
    if (spinning) return;
    setSpinning(true);

    const totalDuration = 6000 + Math.random() * 2200; // 6.0s - 8.2s
    const minIntervalMs = 160; // fast start
    const maxIntervalMs = 520; // slow end

    const start = performance.now();

    setCurrentIdx((i) => {
      const next = (i + 1) % CANDIDATE_THEMES.length;
      const nextTheme = CANDIDATE_THEMES[next].value as Theme;
      setTheme(nextTheme);
      return next;
    });
    lastStepAtRef.current = start;

    const loop = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / totalDuration);
      const eased = 1 - Math.pow(1 - t, 3);
      const intervalMs = minIntervalMs + (maxIntervalMs - minIntervalMs) * eased;

      if (now - lastStepAtRef.current >= intervalMs) {
        setCurrentIdx((i) => {
          const next = (i + 1) % CANDIDATE_THEMES.length;
          const nextTheme = CANDIDATE_THEMES[next].value as Theme;
          setTheme(nextTheme);
          return next;
        });
        lastStepAtRef.current = now;
      }

      if (t < 1) {
        rafIdRef.current = requestAnimationFrame(loop);
      } else {
        setSpinning(false);
        rafIdRef.current = null;
      }
    };

    rafIdRef.current = requestAnimationFrame(loop);
  };

  const selected = CANDIDATE_THEMES[currentIdx] ?? CANDIDATE_THEMES[0];
  const SelectedIcon = selected.icon as any;

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeModal}
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="theme-randomizer-title"
            className="relative w-full max-w-lg rounded-2xl bg-background border border-foreground/10 shadow-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.98, y: 8, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.98, y: 8, filter: "blur(8px)" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <button
              aria-label="Close"
              onClick={closeModal}
              className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-foreground/60 hover:text-foreground hover:bg-foreground/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-5 sm:p-6">
              <div className="mb-2 text-xs font-medium tracking-wide text-foreground/60 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {t.welcome}
              </div>
              <h2 id="theme-randomizer-title" className="text-xl sm:text-2xl font-semibold mb-2">
                {t.title}
              </h2>
              <p className="text-foreground/70 text-sm sm:text-base mb-4">
                {t.description}
              </p>
              
              <div className="relative flex flex-col items-center gap-4 py-6">
                <motion.div
                  key={selected.value}
                  initial={{ scale: 0.96, rotate: -1 }}
                  animate={{ scale: spinning ? 1.02 : 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className={cn(
                    "relative w-48 sm:w-56 aspect-square rounded-2xl border border-foreground/10",
                    "flex items-center justify-center",
                    "bg-foreground/[0.03]"
                  )}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col items-center justify-center gap-2"
                  >
                    <SelectedIcon className="w-10 h-10" />
                    <div className="text-base sm:text-lg font-medium">{selected.label}</div>
                    <div className="text-xs text-foreground/60">{selected.value}</div>
                  </motion.div>

                  <motion.div
                    className="absolute -inset-0.5 rounded-2xl pointer-events-none"
                    style={{
                      background: "radial-gradient(60% 60% at 50% 40%, hsl(var(--primary)/0.16), transparent)",
                      filter: "blur(12px)",
                    }}
                  />
                </motion.div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onSpin}
                    disabled={spinning}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium",
                      "border border-foreground/20 hover:bg-foreground/10 transition",
                      spinning && "opacity-60 cursor-not-allowed"
                    )}
                  >
                    {spinning ? <Shuffle className="w-4 h-4 animate-pulse" /> : <Dice5 className="w-4 h-4" />}
                    {spinning ? t.spinning : t.spin}
                  </button>

                  <button
                    onClick={onKeep}
                    className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition"
                  >
                    <Check className="w-4 h-4" /> {t.keep}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
} 