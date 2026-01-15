/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import React, { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { useAurora } from "@/lib/aurora-provider";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

const STORAGE_KEY = "aurora-intro-seen";
const AURORA_STORAGE_KEY = "aurora-enabled";

interface AuroraIntroModalProps {
  imageSrc?: string;
}

const AuroraIntroModal: React.FC<AuroraIntroModalProps> = ({
  imageSrc = "/other/aurora.jpg",
}) => {
  const { enabled, setEnabled } = useAurora();
  const [open, setOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { language } = useLanguage();
  const t = translations[language]?.auroraIntro as any;

  useEffect(() => {
    try {
      // if user has ever enabled Aurora (now or in the past), don't show the intro again
      const everEnabled = localStorage.getItem(AURORA_STORAGE_KEY) === "true";
      if (everEnabled) {
        try {
          localStorage.setItem(STORAGE_KEY, "true");
        } catch {}
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
        }, 3000);

        return () => clearTimeout(timer);
      }
    } catch {
      if (!enabled) {
        const timer = setTimeout(() => {
          setOpen(true);
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [enabled]);

  const onClose = useMemo(
    () => () => {
      setOpen(false);
      try {
        localStorage.setItem(STORAGE_KEY, "true");
      } catch {
        /* ignore */
      }
    },
    [],
  );

  const onEnable = () => {
    setEnabled(true);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      /* ignore */
    }
    onClose();
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setOpen(true);
      return;
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="block gap-0 overflow-hidden border border-foreground/10 p-0 shadow-xl">
        <div className="p-4 sm:p-5">
          <div className="relative mb-3 h-40 w-full sm:h-48">
            <div className="absolute inset-0 overflow-hidden rounded-2xl border-4 border-border/50 bg-foreground/[0.03] shadow-lg shadow-black/5">
              {!imageLoaded && (
                <Skeleton className="absolute inset-0 rounded-none" />
              )}
              <img
                src={imageSrc}
                alt="Aurora preview"
                className={`pointer-events-none h-full w-full select-none object-cover transition-opacity ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                loading="lazy"
                decoding="async"
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
            {t?.newLabel ?? "New"}
          </div>
          <DialogTitle className="mb-2 text-xl font-semibold sm:text-2xl">
            {t?.title ?? "Introducing Aurora background"}
          </DialogTitle>
          <DialogDescription className="mb-4 text-sm text-foreground/70 sm:text-base">
            {(t?.description ??
              "A subtle, animated background that adapts to your theme.") +
              " " +
              (t?.instruction ??
                "You can enable or disable it anytime: open the theme toggle at the top-right and switch 'Aurora background'.")}
          </DialogDescription>

          <div className="flex flex-wrap justify-end gap-2 sm:gap-3">
            <button
              onClick={onEnable}
              className="inline-flex items-center justify-center rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
            >
              {t?.enableButton ?? "Enable Aurora"}
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground/80 transition hover:bg-foreground/10"
            >
              {t?.notNowButton ?? "Not now"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuroraIntroModal;
