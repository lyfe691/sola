/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Star, Sparkles } from "lucide-react";
import { useState as useReactState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { RichText } from "@/components/i18n/RichText";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const t = (translations as unknown as Record<string, any>)[language]
    ?.starModal ?? {
    eyebrow: "I value your feedback",
    title: "Enjoying my portfolio?",
    body: "If you like it, I’d really appreciate a star on GitHub. Have feedback? [Contact me](/contact).",
    starCta: "Star on GitHub",
    maybeLater: "Maybe later",
  };

  // test controls: ?star=open | clear (alias: s)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const action = (
        params.get("star") ||
        params.get("s") ||
        ""
      ).toLowerCase();
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

  const onClose = useCallback(() => {
    setOpen(false);
    try {
      seenRef.current = true;
      localStorage.setItem(STORAGE_SEEN_KEY, "true");
    } catch {}
  }, []);

  const onSnooze = useCallback(() => {
    setOpen(false);
    // do not persist seen state
  }, []);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        setOpen(true);
        return;
      }
      onSnooze();
    },
    [onSnooze],
  );

  const onStar = () => {
    try {
      window.open(repoUrl, "_blank", "noopener,noreferrer");
    } catch {}
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="block gap-0 overflow-hidden border border-foreground/10 p-0 shadow-xl">
        <div className="p-4 sm:p-5">
          <div className="relative mb-3 h-40 w-full sm:h-48">
            <div className="absolute inset-0 overflow-hidden rounded-2xl border-4 border-border/50 bg-foreground/[0.03] shadow-lg shadow-black/5">
              {!imageLoaded && <Skeleton className="absolute inset-0 rounded-none" />}
              <img
                src="https://opengraph.githubassets.com/67/lyfe691/sola"
                alt="Repository preview"
                className={`pointer-events-none h-full w-full select-none object-cover transition-opacity ${imageLoaded ? "opacity-100" : "opacity-0"}`}
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

          <div className="mb-2 flex items-center gap-1 text-xs font-medium tracking-wide text-foreground/60">
            <Sparkles className="h-3.5 w-3.5" />
            {t.eyebrow}
          </div>
          <DialogTitle id="github-star-modal-title" className="mb-2 text-xl font-semibold sm:text-2xl">
            {t.title}
          </DialogTitle>
          <DialogDescription
            className="mb-4 text-sm text-foreground/70 sm:text-base"
            onClick={(e) => {
              const target = e.target as HTMLElement | null;
              if (target && target.tagName === "A") {
                onClose();
              }
            }}
          >
            <RichText text={t.body} />
          </DialogDescription>

          <div className="flex flex-wrap justify-end gap-2 sm:gap-3">
            <button
              onClick={onStar}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
            >
              <span className="inline-flex items-center">
                <motion.span
                  initial={{ rotate: 0, x: 0 }}
                  animate={{
                    rotate: [0, -10, 10, -5, 5, 0],
                    x: [0, -0.5, 0.5, -0.25, 0.25, 0],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    repeatDelay: 1.2,
                    ease: "easeInOut",
                  }}
                  style={{ display: "inline-block" }}
                >
                  <Star className="h-4 w-4" />
                </motion.span>
              </span>
              {t.starCta}
            </button>
            <button
              onClick={onSnooze}
              className="inline-flex items-center justify-center rounded-full border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground/80 transition hover:bg-foreground/10"
            >
              {t.maybeLater}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
