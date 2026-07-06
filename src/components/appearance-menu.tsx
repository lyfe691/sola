/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The language + theme toggles share one popover surface. Opening either anchors
 * the surface under its button and grows it from that corner; switching between
 * them keeps the surface mounted and *morphs* — position slides and size resizes
 * (Framer `layout`) while the content swaps crisply — instead of closing and
 * reopening.
 *
 * This replaces base-ui's per-menu dropdown shell for these two toggles (base-ui
 * can't morph between two separate menus); the inner content, tooltips, the
 * animated trigger icon and the `data-callout` hook are all preserved.
 */

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCodeView } from "@/components/deploy-diff/code-view-provider";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { ThemeMenuContent, ThemeTriggerIcon } from "./theme-toggle";
import { LanguageMenuContent } from "./language-toggle";
import { EASE_OUT } from "@/utils/transitions";

type MenuId = "language" | "theme";

export function AppearanceMenu() {
  const { language } = useLanguage();
  const t = translations[language];

  const [openId, setOpenId] = useState<MenuId | null>(null);
  const [anchor, setAnchor] = useState<{ top: number; right: number } | null>(
    null,
  );
  const buttons = useRef<Record<MenuId, HTMLButtonElement | null>>({
    language: null,
    theme: null,
  });
  const popoverRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // anchor the surface under a trigger exactly like base-ui's positioner:
  // right edges aligned, 4px below, measured against the content width
  // (clientWidth) so the scrollbar isn't counted and it doesn't drift left
  const measure = (id: MenuId) => {
    const el = buttons.current[id];
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      top: r.bottom + 4,
      right: document.documentElement.clientWidth - r.right,
    };
  };

  const toggle = (id: MenuId) => {
    if (openId === id) {
      setOpenId(null);
      return;
    }
    const next = measure(id);
    if (next) setAnchor(next);
    setOpenId(id);
  };

  const close = () => setOpenId(null);

  // the `d` shortcut flips into the code view from anywhere, unmounting the
  // nav under us — close first so the portaled surface exits with its own
  // fade instead of hanging opaque over the page transition. (The switch
  // row already closes via onClose; this covers the keyboard path.)
  const { active: codeView } = useCodeView();
  useEffect(() => {
    if (codeView) setOpenId(null);
  }, [codeView]);

  // focusable, non-collapsed items in the open surface (for roving focus)
  const getItems = () =>
    Array.from(
      popoverRef.current?.querySelectorAll<HTMLElement>("button") ?? [],
    ).filter((el) => !el.closest("[inert]"));

  // arrow-key navigation between items, like a menu
  const onSurfaceKeyDown = (e: React.KeyboardEvent) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
    const items = getItems();
    if (!items.length) return;
    e.preventDefault();
    const i = items.indexOf(document.activeElement as HTMLElement);
    const next =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? items.length - 1
          : e.key === "ArrowDown"
            ? (i + 1) % items.length
            : (i - 1 + items.length) % items.length;
    items[next]?.focus();
  };

  // close on outside pointer / Escape (Escape restores focus to the trigger)
  useEffect(() => {
    if (!openId) return;
    const id = openId;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (popoverRef.current?.contains(target)) return;
      if (buttons.current.language?.contains(target)) return;
      if (buttons.current.theme?.contains(target)) return;
      // tooltips portal to <body>, outside popoverRef — a press inside one
      // (e.g. the git-diff droplet) isn't an outside click
      if (
        target instanceof Element &&
        target.closest('[data-slot="tooltip-content"]')
      )
        return;
      setOpenId(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        buttons.current[id]?.focus();
        setOpenId(null);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openId]);

  // lock page scrolling while open (no layout shift — the scrollbar stays);
  // scrolling inside the menu is still allowed. a resize moves the anchor, so close.
  useEffect(() => {
    if (!openId) return;

    const blockScroll = (e: Event) => {
      const el = scrollRef.current;
      if (
        el &&
        el.contains(e.target as Node) &&
        el.scrollHeight > el.clientHeight
      ) {
        return; // the menu itself can scroll — allow it
      }
      e.preventDefault();
    };
    const onResize = () => setOpenId(null);

    window.addEventListener("wheel", blockScroll, { passive: false });
    window.addEventListener("touchmove", blockScroll, { passive: false });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("wheel", blockScroll);
      window.removeEventListener("touchmove", blockScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [openId]);

  // move keyboard focus to the first item when the surface opens or morphs
  useEffect(() => {
    if (!openId) return;
    const raf = requestAnimationFrame(() => {
      const first = popoverRef.current?.querySelector<HTMLElement>("button");
      (first ?? popoverRef.current)?.focus();
    });
    return () => cancelAnimationFrame(raf);
  }, [openId]);

  const renderTrigger = (
    id: MenuId,
    icon: React.ReactNode,
    srLabel: string,
    tooltip: string,
    isCallout = false,
  ) => (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            ref={(el: HTMLButtonElement | null) => {
              buttons.current[id] = el;
            }}
            variant="ghost"
            size="icon"
            className="w-9 h-9 rounded-full transition-colors hover:bg-muted"
            onClick={() => toggle(id)}
            aria-haspopup="menu"
            aria-expanded={openId === id}
            data-callout={isCallout ? "theme" : undefined}
          />
        }
      >
        {icon}
        <span className="sr-only">{srLabel}</span>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );

  return (
    <>
      {renderTrigger(
        "language",
        <Languages className="h-4 w-4" />,
        "Toggle language",
        t.common.command.groups.language,
      )}
      {renderTrigger(
        "theme",
        <ThemeTriggerIcon />,
        "Toggle theme",
        t.common.command.groups.theme,
        true,
      )}

      {createPortal(
        <AnimatePresence>
          {openId && anchor && (
            <motion.div
              ref={popoverRef}
              key="appearance-popover"
              layout
              tabIndex={-1}
              onKeyDown={onSurfaceKeyDown}
              data-slot="dropdown-menu-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                layout: { duration: 0.24, ease: EASE_OUT },
                duration: 0.16,
                ease: EASE_OUT,
              }}
              style={{
                position: "fixed",
                top: anchor.top,
                right: anchor.right,
              }}
              className="z-50 overflow-hidden rounded-3xl bg-popover p-1.5 text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none dark:ring-foreground/10"
            >
              {/*
                Grow from the trigger corner on open. This lives on a nested
                element (not the `layout` surface above) — Framer owns the
                surface's transform for the morph, so scaling/transform-origin
                here avoids fighting it and keeps the anchor correct. Content
                swaps crisply; the surface's `layout` morph reveals the new menu.
              */}
              <motion.div
                ref={scrollRef}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                transition={{ duration: 0.16, ease: EASE_OUT }}
                style={{ transformOrigin: "top right" }}
                className="max-h-[calc(100dvh-5rem)] overflow-x-hidden overflow-y-auto overscroll-contain"
              >
                {openId === "theme" ? (
                  <ThemeMenuContent onClose={close} />
                ) : (
                  <LanguageMenuContent onClose={close} />
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
