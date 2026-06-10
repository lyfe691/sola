/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import React, { useState, useCallback } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed top-0 left-0 right-0 bottom-0 z-100 flex items-center justify-center bg-black/90 p-6 cursor-zoom-out overflow-hidden"
          onClick={onClose}
        >
          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            src={src}
            alt={alt}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg cursor-zoom-out"
          />
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-3 rounded-full bg-background hover:bg-muted text-foreground transition-colors shadow-lg"
            aria-label="Close"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
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
      <motion.img
        src={src}
        alt={alt}
        className={`cursor-zoom-in ${className}`}
        loading="lazy"
        onClick={handleOpen}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
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
