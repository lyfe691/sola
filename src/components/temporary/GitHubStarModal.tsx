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
import { Star, Sparkles } from "lucide-react";
import { useState as useReactState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { RichText } from "@/components/i18n/RichText";

const STORAGE_SEEN_KEY = "github-star-prompt-seen";

interface GitHubStarModalProps {
  repoUrl?: string;
  delayMs?: number;
  scrollThresholdRatio?: number;
}

export default function GitHubStarModal({
  repoUrl = "https://github.com/lyfe691/sola",
  delayMs = 45000,
  scrollThresholdRatio = 0.5,
}: GitHubStarModalProps) {
  const [open, setOpen] = useState(false);
  const seenRef = useRef(false);
  const [imageLoaded, setImageLoaded] = useReactState(false);
  const { language } = useLanguage();
  const t = (translations as unknown as Record<string, any>)[language]?.starModal ?? {
    eyebrow: "I value your feedback",
    title: "Enjoying my portfolio?",
    body:
      "If you like it, I’d really appreciate a star on GitHub. Have feedback? [Contact me](/contact).",
    starCta: "Star on GitHub",
    maybeLater: "Maybe later",
  };

  // test controls: ?star=open | clear (alias: s)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const action = (params.get("star") || params.get("s") || "").toLowerCase();
      if (action === "clear") {
        try {
          localStorage.removeItem(STORAGE_SEEN_KEY);
        } catch {}
      }
      if (action === "open") {
        setOpen(true);
      }
    } catch {}
  }, []);

  // show once after delay or at scroll threshold, whichever comes first
  useEffect(() => {
    try {
      seenRef.current = localStorage.getItem(STORAGE_SEEN_KEY) === "true";
    } catch {
      seenRef.current = false;
    }

    if (seenRef.current) return;

    let timerId: number | null = null;
    const tryOpen = () => {
      if (seenRef.current) return;
      setOpen(true);
      cleanup();
    };

    const onScroll = () => {
      if (seenRef.current) return;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const ratio = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      if (ratio >= scrollThresholdRatio) {
        tryOpen();
      }
    };

    timerId = window.setTimeout(tryOpen, delayMs);
    window.addEventListener("scroll", onScroll, { passive: true });

    const cleanup = () => {
      if (timerId != null) window.clearTimeout(timerId);
      window.removeEventListener("scroll", onScroll as any);
    };

    return cleanup;
  }, [delayMs, scrollThresholdRatio]);

  const onClose = useMemo(
    () => () => {
      setOpen(false);
      try {
        seenRef.current = true;
        localStorage.setItem(STORAGE_SEEN_KEY, "true");
      } catch {}
    },
    [],
  );

  const onSnooze = useMemo(
    () => () => {
      setOpen(false);
      // do not persist seen state
    },
    [],
  );

  const onStar = () => {
    try {
      window.open(repoUrl, "_blank", "noopener,noreferrer");
    } catch {}
    onClose();
  };

  // lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // close on Escape (snooze, do not mark as seen)
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSnooze();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onSnooze]);

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
            onClick={onSnooze}
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="github-star-modal-title"
            className="relative w-full max-w-lg rounded-2xl bg-background border border-foreground/10 shadow-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 0.8,
            }}
          >
            <div className="p-4 sm:p-5">
              <div className="relative w-full h-40 sm:h-48 mb-3">
                <div className="absolute inset-0 rounded-2xl overflow-hidden border-4 border-border/50 bg-foreground/[0.03] shadow-lg shadow-black/5">
                  {!imageLoaded && (
                    <Skeleton className="absolute inset-0 rounded-none" />
                  )}
                  <img
                    src="https://opengraph.githubassets.com/67/lyfe691/sola"
                    alt="Repository preview"
                    className={`w-full h-full object-cover select-none pointer-events-none transition-opacity ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onLoad={() => setImageLoaded(true)}
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.15))",
                    }}
                  />
                </div>
              </div>

              <div className="mb-2 text-xs font-medium tracking-wide text-foreground/60 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {t.eyebrow}
              </div>
              <h2
                id="github-star-modal-title"
                className="text-xl sm:text-2xl font-semibold mb-2"
              >
                {t.title}
              </h2>
              <div
                className="text-foreground/70 text-sm sm:text-base mb-4"
                onClick={(e) => {
                  const target = e.target as HTMLElement | null;
                  if (target && target.tagName === "A") {
                    onClose();
                  }
                }}
              >
                <RichText text={t.body} />
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3 justify-end">
                <button
                  onClick={onStar}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition"
                >
                  <span className="inline-flex items-center">
                    <motion.span
                      initial={{ rotate: 0, x: 0 }}
                      animate={{ rotate: [0, -10, 10, -5, 5, 0], x: [0, -0.5, 0.5, -0.25, 0.25, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
                      style={{ display: "inline-block" }}
                    >
                      <Star className="w-4 h-4" />
                    </motion.span>
                  </span>
                  {t.starCta}
                </button>
                <button
                  onClick={onSnooze}
                  className="inline-flex items-center justify-center rounded-full border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground/80 hover:bg-foreground/10 transition"
                >
                  {t.maybeLater}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}


