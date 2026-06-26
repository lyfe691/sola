/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;
const POLL_INTERVAL_MS = 5 * 60 * 1000;
const DISMISS_KEY = "sola-update-dismissed-version";
const CURRENT_VERSION = import.meta.env.VITE_APP_VERSION ?? "dev";

type VersionPayload = { version?: string };

function CloudBackupIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M21 15.251A4.5 4.5 0 0 0 17.5 8h-1.79A7 7 0 1 0 3 13.607" />
      <path d="M7 11v4h4" />
      <path d="M8 19a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5 4.82 4.82 0 0 0-3.41 1.41L7 15" />
    </svg>
  );
}

export function UpdateNotification() {
  const { language } = useLanguage();
  const t = translations[language].common.update;

  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [dismissedFor, setDismissedFor] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissedFor(sessionStorage.getItem(DISMISS_KEY));
  }, []);

  const checkVersion = useCallback(async (signal?: AbortSignal) => {
    const res = await fetch("/api/version", {
      cache: "no-store",
      signal,
    });
    if (!res.ok) return;
    const data = (await res.json()) as VersionPayload;
    if (!data.version) return;

    setLatestVersion((prev) => {
      if (prev !== data.version) setDismissed(false);
      return data.version!;
    });
  }, []);

  useEffect(() => {
    if (import.meta.env.DEV || CURRENT_VERSION === "dev") return;

    const controller = new AbortController();

    async function check() {
      try {
        await checkVersion(controller.signal);
      } catch {
        // network hiccup — try again on the next tick
      }
    }

    check();
    const interval = window.setInterval(check, POLL_INTERVAL_MS);

    function onVisibility() {
      if (document.visibilityState === "visible") check();
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      controller.abort();
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [checkVersion]);

  const hasUpdate = latestVersion !== null && latestVersion !== CURRENT_VERSION;
  const visible = hasUpdate && !dismissed && dismissedFor !== latestVersion;

  function dismiss() {
    if (latestVersion) {
      sessionStorage.setItem(DISMISS_KEY, latestVersion);
      setDismissedFor(latestVersion);
    }
    setDismissed(true);
  }

  function refresh() {
    window.location.reload();
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ y: 32, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{
            y: 16,
            opacity: 0,
            scale: 0.98,
            transition: { duration: 0.22, ease: EASE_EXPO },
          }}
          transition={{ duration: 0.4, ease: EASE_EXPO }}
          className={cn(
            "fixed right-4 bottom-4 left-4 z-[60] sm:left-auto sm:w-[360px]",
            "pb-[env(safe-area-inset-bottom)]",
          )}
        >
          <div className="relative flex flex-col gap-3 rounded-2xl border bg-card/90 p-4 shadow-2xl backdrop-blur-xl">
            <button
              type="button"
              onClick={dismiss}
              aria-label={t.dismiss}
              className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>

            <div className="flex items-start gap-3 pr-7">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-foreground/5 text-foreground">
                <CloudBackupIcon className="size-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{t.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t.description}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={dismiss}>
                {t.later}
              </Button>
              <Button size="sm" onClick={refresh}>
                {t.refresh}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
