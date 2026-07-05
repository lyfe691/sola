/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import React, { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { EASE_OUT } from "@/utils/transitions";

const ImageLightbox: React.FC<{
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}> = ({ src, alt, isOpen, onClose }) => {
  // close on escape key and lock scroll
  React.useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (typeof document === "undefined") return null;

  // Portal to <body> so the fixed overlay escapes any ancestor that creates a
  // containing block (e.g. the page transition's filter/transform on PageShell),
  // which would otherwise position it off-screen on a scrolled article.
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE_OUT }}
          className="fixed inset-0 z-100 flex cursor-zoom-out items-center justify-center bg-black/80 p-4 backdrop-blur-md sm:p-10"
          onClick={onClose}
        >
          <motion.img
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            src={src}
            alt={alt}
            className="max-h-[88vh] max-w-[92vw] rounded-xl object-contain shadow-2xl ring-1 ring-white/10"
          />
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 grid size-9 place-items-center rounded-full bg-white/5 text-white/70 backdrop-blur-md transition hover:bg-white/15 hover:text-white"
          >
            <X className="size-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export const ExpandableImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`cursor-zoom-in can-hover:scale-[1.02] transition-transform duration-200 ease-out ${className}`}
        loading="lazy"
        onClick={handleOpen}
      />
      <ImageLightbox
        src={src}
        alt={alt}
        isOpen={isOpen}
        onClose={handleClose}
      />
    </>
  );
};
