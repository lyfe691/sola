/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useAurora } from "@/lib/aurora-provider";
import { useGalaxy } from "@/lib/galaxy-provider";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FeatureContent {
  newLabel: string;
  title: string;
  description: string;
  instruction: string;
  performanceWarning: string;
  enableButton: string;
  notNowButton: string;
}

interface FeatureConfig {
  key: string;
  image: string;
  storageKey: string;
  enabled: boolean;
  setEnabled: (v: boolean) => void;
  content: FeatureContent;
}

const AURORA_STORAGE_KEY = "aurora-intro-seen";
const GALAXY_STORAGE_KEY = "galaxy-intro-seen";

const defaultGalaxyContent: FeatureContent = {
  newLabel: "New",
  title: "Introducing Galaxy background",
  description: "A cosmic starfield that adapts to your theme.",
  instruction:
    "You can enable or disable it anytime: open the theme toggle at the top-right and switch 'Galaxy background'.",
  performanceWarning:
    "Note: May impact performance on older devices or slower browsers.",
  enableButton: "Enable Galaxy",
  notNowButton: "Not now",
};

const FeatureModal: React.FC = () => {
  const { enabled: auroraEnabled, setEnabled: setAuroraEnabled } = useAurora();
  const { enabled: galaxyEnabled, setEnabled: setGalaxyEnabled } = useGalaxy();
  const { language } = useLanguage();
  const tAurora = translations[language]?.auroraIntro as any;

  const features: FeatureConfig[] = useMemo(
    () => [
      {
        key: "aurora",
        image: "/other/aurora.jpg",
        storageKey: AURORA_STORAGE_KEY,
        enabled: auroraEnabled,
        setEnabled: setAuroraEnabled,
        content: tAurora,
      },
      {
        key: "galaxy",
        image: "/about/01.jpg",
        storageKey: GALAXY_STORAGE_KEY,
        enabled: galaxyEnabled,
        setEnabled: setGalaxyEnabled,
        content: defaultGalaxyContent,
      },
    ],
    [auroraEnabled, galaxyEnabled, setAuroraEnabled, setGalaxyEnabled, tAurora]
  );

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const unseenIndex = features.findIndex((f) => {
      try {
        const seen = localStorage.getItem(f.storageKey) === "true";
        return !seen && !f.enabled;
      } catch {
        return !f.enabled;
      }
    });
    if (unseenIndex !== -1) {
      const timer = setTimeout(() => {
        setIndex(unseenIndex);
        setOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [features]);

  const onClose = useMemo(
    () => () => {
      setOpen(false);
      features.forEach((f) => {
        try {
          localStorage.setItem(f.storageKey, "true");
        } catch {
          /* ignore */
        }
      });
    },
    [features]
  );

  const onEnable = () => {
    const f = features[index];
    f.setEnabled(true);
    onClose();
  };

  const next = () => setIndex((i) => (i + 1) % features.length);
  const prev = () => setIndex((i) => (i - 1 + features.length) % features.length);

  const current = features[index];

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
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-lg rounded-2xl bg-background border border-foreground/10 shadow-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.98, y: 8, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.98, y: 8, filter: "blur(8px)" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <button
              aria-label="Close"
              onClick={onClose}
              className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-foreground/60 hover:text-foreground hover:bg-foreground/10 transition"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            <div className="relative h-40 sm:h-48">
              <img
                src={current.image}
                alt="feature preview"
                className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
              />
              {features.length > 1 && (
                <>
                  <button
                    aria-label="Previous feature"
                    onClick={(e) => { e.stopPropagation(); prev(); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/50 p-1.5 text-foreground/70 hover:bg-background/80"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    aria-label="Next feature"
                    onClick={(e) => { e.stopPropagation(); next(); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/50 p-1.5 text-foreground/70 hover:bg-background/80"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            <div className="p-5 sm:p-6">
              <div className="mb-2 text-xs font-medium tracking-wide text-foreground/60">
                {current.content.newLabel}
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                {current.content.title}
              </h2>
              <p className="text-foreground/70 text-sm sm:text-base mb-3">
                {current.content.description + " " + current.content.instruction}
              </p>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-foreground/5 border border-foreground/10 mb-5">
                <svg className="w-4 h-4 text-foreground/60 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-foreground/70 text-xs leading-relaxed">
                  {current.content.performanceWarning}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3 justify-end">
                <button
                  onClick={onEnable}
                  className="inline-flex items-center justify-center rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition"
                >
                  {current.content.enableButton}
                </button>
                <button
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-full border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground/80 hover:bg-foreground/10 transition"
                >
                  {current.content.notNowButton}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default FeatureModal;

