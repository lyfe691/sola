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
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { AnimatePresence, motion } from "motion/react";

const STORAGE_KEY = "aurora-intro-seen";
const AURORA_STORAGE_KEY = "aurora-enabled";

interface AuroraIntroModalProps {
  imageSrc?: string;
}

const AuroraIntroModal: React.FC<AuroraIntroModalProps> = ({ imageSrc = "/other/aurora.jpg" }) => {
  const { enabled, setEnabled } = useAurora();
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();
  const t = translations[language]?.auroraIntro as any;

  useEffect(() => {
    try {
      // if user has ever enabled Aurora (now or in the past), don't show the intro again
      const everEnabled = localStorage.getItem(AURORA_STORAGE_KEY) === "true";
      if (everEnabled) {
        try { localStorage.setItem(STORAGE_KEY, "true"); } catch {}
      }

      if (enabled) {
        setOpen(false);
        return;
      }

      const seen = localStorage.getItem(STORAGE_KEY) === "true";
      const shouldShow = !seen && !enabled;
      
      if (shouldShow) {
        // delay to ensure app is loaded
        const timer = setTimeout(() => {
          setOpen(true);
        }, 500);
        
        return () => clearTimeout(timer);
      }
    } catch {
      if (!enabled) {
        const timer = setTimeout(() => {
          setOpen(true);
        }, 500);
        
        return () => clearTimeout(timer);
      }
    }
  }, [enabled]);

  const onClose = useMemo(
    () => () => {
      setOpen(false);
      try { localStorage.setItem(STORAGE_KEY, "true"); } catch { /* ignore */ }
    },
    []
  );

  const onEnable = () => {
    setEnabled(true);
    try { localStorage.setItem(STORAGE_KEY, "true"); } catch { /* ignore */ }
    onClose();
  };

  

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
            aria-labelledby="aurora-intro-title"
            className="relative w-full max-w-lg rounded-2xl bg-background border border-foreground/10 shadow-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.98, y: 8, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.98, y: 8, filter: "blur(8px)" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <button aria-label="Close" onClick={onClose} className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-foreground/60 hover:text-foreground hover:bg-foreground/10 transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            <div className="relative h-40 sm:h-48">
              <img src={imageSrc} alt="Aurora preview" className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none" />
            </div>

            <div className="p-5 sm:p-6">
              <div className="mb-2 text-xs font-medium tracking-wide text-foreground/60">{t?.newLabel ?? "New"}</div>
              <h2 id="aurora-intro-title" className="text-xl sm:text-2xl font-semibold mb-2">{t?.title ?? "Introducing Aurora background"}</h2>
              <p className="text-foreground/70 text-sm sm:text-base mb-3">
                {(t?.description ?? "A subtle, animated background that adapts to your theme.") + " " + (t?.instruction ?? "You can enable or disable it anytime: open the theme toggle at the top-right and switch 'Aurora background'.")}
              </p>
              
              <div className="flex items-start gap-2 p-3 rounded-lg bg-foreground/5 border border-foreground/10 mb-5">
                <svg className="w-4 h-4 text-foreground/60 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-foreground/70 text-xs leading-relaxed">
                  {t?.performanceWarning ?? "Aurora uses smooth animations that may impact performance on older devices or slower browsers. You can disable it anytime if you experience lag."}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3 justify-end">
                <button onClick={onEnable} className="inline-flex items-center justify-center rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition">
                  {t?.enableButton ?? "Enable Aurora"}
                </button>
                <button onClick={onClose} className="inline-flex items-center justify-center rounded-full border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground/80 hover:bg-foreground/10 transition">
                  {t?.notNowButton ?? "Not now"}
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

export default AuroraIntroModal;


