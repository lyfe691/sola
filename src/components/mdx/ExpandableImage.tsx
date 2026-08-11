/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Expandable project figure: quiet frame, hover expand chip, accessible
 * lightbox. Scale-on-hover is intentionally avoided — press + icon only.
 */

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Maximize2, X } from "lucide-react";
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
      const nodes = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE));
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
  const showCaption = Boolean(alt.trim());

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE_OUT }}
          className="fixed inset-0 z-100 flex cursor-zoom-out items-center justify-center bg-black/70 p-4 backdrop-blur-sm sm:p-8"
          onClick={onClose}
        >
          <span id={labelId} className="sr-only">
            {dialogLabel}
          </span>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t.common.close}
            className={cn(
              "absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full",
              "border border-white/10 bg-black/40 text-white/80 backdrop-blur-md",
              "transition-[background-color,color,scale] duration-150 ease-out",
              "hover:bg-black/55 hover:text-white",
              "active:scale-[0.97]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
              "sm:right-6 sm:top-6",
            )}
          >
            <X className="size-4" aria-hidden="true" />
          </button>

          <motion.figure
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.28, ease: EASE_OUT }}
            className="flex max-h-full max-w-full cursor-default flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className="max-h-[min(82vh,900px)] max-w-[min(92vw,1100px)] rounded-xl object-contain shadow-2xl ring-1 ring-white/10"
            />
            {showCaption ? (
              <figcaption className="max-w-lg px-2 text-center text-xs leading-relaxed text-white/65">
                {alt}
              </figcaption>
            ) : null}
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function ExpandableImage({
  src,
  alt,
  className,
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
        aria-label={expandLabel}
        className={cn(
          "group/image relative block w-full overflow-hidden rounded-xl",
          "bg-muted/20 ring-1 ring-border",
          "cursor-zoom-in outline-none select-none",
          // v4: scale uses the `scale` property — transition `scale`, not transform
          "transition-[box-shadow,scale] duration-200 ease-out",
          "can-hover:hover:ring-foreground/20",
          "active:scale-[0.99]",
          "focus-visible:ring-2 focus-visible:ring-ring/40",
          className,
        )}
      >
        <img
          src={src}
          alt=""
          className="block h-auto w-full"
          loading="lazy"
          decoding="async"
        />

        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0",
            "bg-foreground/0 transition-colors duration-200 ease-out",
            "can-hover:group-hover/image:bg-foreground/4",
          )}
        />
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute bottom-2.5 right-2.5",
            "inline-flex size-7 items-center justify-center rounded-lg",
            "border border-border/80 bg-background/85 text-muted-foreground shadow-sm backdrop-blur-sm",
            "opacity-0 transition-[opacity,color] duration-200 ease-out",
            "can-hover:group-hover/image:opacity-100",
            "can-hover:group-hover/image:text-foreground",
            "group-focus-visible/image:opacity-100",
          )}
        >
          <Maximize2 className="size-3.5" strokeWidth={2} />
        </span>
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
