/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/utils/transitions";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function ImageLightbox({
  src,
  alt,
  isOpen,
  onClose,
  labelId,
}: {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
  labelId: string;
}) {
  const { language } = useLanguage();
  const t = translations[language];
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // wait a frame so the portal node is focusable after AnimatePresence mounts
    const focusFrame = requestAnimationFrame(() => {
      closeRef.current?.focus();
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const root = dialogRef.current;
      if (!root) return;
      const nodes = Array.from(
        root.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null || el === closeRef.current);
      if (nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || !root.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last || !root.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      restoreFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (typeof document === "undefined") return null;

  const dialogLabel = alt.trim() || t.common.expandedImage;

  // Portal to <body> so the fixed overlay escapes any ancestor that creates a
  // containing block (e.g. the page transition's filter/transform on PageShell),
  // which would otherwise position it off-screen on a scrolled article.
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dialogRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE_OUT }}
          className="fixed inset-0 z-100 flex cursor-zoom-out items-center justify-center bg-black/80 p-4 backdrop-blur-md sm:p-10"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelId}
        >
          <span id={labelId} className="sr-only">
            {dialogLabel}
          </span>
          <motion.img
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            src={src}
            alt={alt}
            className="max-h-[88vh] max-w-[92vw] rounded-xl object-contain shadow-2xl ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t.common.close}
            className="absolute right-5 top-5 grid size-9 place-items-center rounded-full bg-white/5 text-white/70 backdrop-blur-md transition hover:bg-white/15 hover:text-white"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function ExpandableImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];
  const labelId = useId();
  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  const expandLabel = alt.trim()
    ? t.common.expandImageNamed.replace("{alt}", alt.trim())
    : t.common.expandImage;

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="block w-full cursor-zoom-in border-0 bg-transparent p-0 text-left"
        aria-label={expandLabel}
      >
        {/* alt empty: the button owns the accessible name */}
        <img
          src={src}
          alt=""
          className={cn(
            "w-full transition-transform duration-200 ease-out can-hover:hover:scale-[1.02]",
            className,
          )}
          loading="lazy"
          decoding="async"
        />
      </button>
      <ImageLightbox
        src={src}
        alt={alt}
        isOpen={isOpen}
        onClose={handleClose}
        labelId={labelId}
      />
    </>
  );
}
