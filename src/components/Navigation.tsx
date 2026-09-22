/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Link, useLocation } from "react-router";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { useEffect, useState, useCallback, useRef, memo } from "react";
import { useLenis } from "lenis/react";
import type Lenis from "lenis";
import { useLanguage, useTranslation } from "@/lib/language-provider";
import { useWindowScrollLock } from "@/hooks/use-window-scroll-lock";
import { cn } from "@/lib/utils";
import { MAIN_NAVIGATION } from "@/config/navigation";
import { SearchToggle } from "./search-toggle";
import { AppearanceMenu } from "./appearance-menu";
import { useCodeView } from "./deploy-diff/code-view-provider";
import { CONSUME_IN, EASE_OUT, REVEAL } from "@/utils/transitions";

// ---- The phone menu, after Apple's globalnav ----
// One surface: the bar's sheet drops from the top edge until it fills the
// screen, and while it is still travelling the links fall into place from
// just above, top row first. Closing runs it backwards: the links lift away,
// bottom row first, and a beat later the sheet rolls back up behind the bar.
// Both move on the glide curve (a symmetric ease-in-out, as Apple's does), so
// the sheet's edge builds speed and settles instead of snapping open.

/** the sheet covers the screen in half the viewport's height in ms, clamped,
 *  so its edge moves at the same speed on every phone */
const sheetDuration = () =>
  Math.min(0.48, Math.max(0.24, window.innerHeight / 2000));
/** the links are on their way out before the sheet starts back up */
const SHEET_CLOSE_DELAY = 0.08;
/** the bar's island ↔ full-width change (its duration-200 transition) */
const BAR_MORPH = 0.2;
/** closing, the bar keeps its full width while the sheet rolls up, and
 *  gathers back into the island as the sheet's edge reaches it */
const barReturnDelay = () => SHEET_CLOSE_DELAY + sheetDuration() - BAR_MORPH;

/** how far the links fall into place from, and how long they take */
const LINK_DROP = 8;
const LINK_DURATION = 0.24;
/** the first link waits for the sheet to be well on its way; each next one
 *  follows a beat behind, so they arrive top to bottom */
const LINK_LEAD = 0.2;
const LINK_STAGGER = 0.02;

const sheetVariants: Variants = {
  hidden: () => ({
    scaleY: 0,
    transition: {
      duration: sheetDuration(),
      ease: REVEAL,
      delay: SHEET_CLOSE_DELAY,
    },
  }),
  visible: () => ({
    scaleY: 1,
    transition: { duration: sheetDuration(), ease: REVEAL },
  }),
};
/** reduced motion drops the travel, so the sheet fades in and out instead of
 *  snapping (a snap would leave the links fading out over the page) */
const sheetFadeVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: LINK_DURATION,
      ease: REVEAL,
      delay: SHEET_CLOSE_DELAY,
    },
  },
  visible: {
    opacity: 1,
    transition: { duration: LINK_DURATION, ease: REVEAL },
  },
};

type LinkSlot = { index: number; total: number };

const linkVariants: Variants = {
  // leaving, every link starts at once and the lower ones finish sooner, so
  // the list clears from the bottom up
  hidden: ({ index, total }: LinkSlot) => ({
    opacity: 0,
    y: -LINK_DROP,
    transition: {
      duration: Math.min(0.16 + LINK_STAGGER * (total - index), LINK_DURATION),
      ease: REVEAL,
    },
  }),
  visible: ({ index }: LinkSlot) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: LINK_DURATION,
      ease: REVEAL,
      delay: LINK_LEAD + index * LINK_STAGGER,
    },
  }),
};

interface ToggleGroupProps {
  className?: string;
  gap?: "tight" | "normal";
}

const ToggleGroup = memo(({ className, gap = "tight" }: ToggleGroupProps) => {
  return (
    <div
      className={cn(
        "flex items-center",
        gap === "tight" ? "gap-1" : "gap-2",
        className,
      )}
    >
      <SearchToggle />
      <AppearanceMenu />
    </div>
  );
});
ToggleGroup.displayName = "ToggleGroup";

/** Apple's two-step: the lines slide together onto the middle, then swing
 *  into the X — gathering in, releasing out. Closing plays the same steps
 *  backwards. Each value starts from wherever it is, so a quick second tap
 *  turns the glyph around mid-move instead of jumping. */
const GLYPH_STEPS = {
  duration: 0.24,
  times: [0, 0.5, 1],
  ease: [CONSUME_IN, EASE_OUT],
};

/** the two-line trigger glyph that morphs into an X while the menu is open */
const MenuGlyph = ({ open }: { open: boolean }) => (
  <div className="relative flex h-4 w-5 items-center justify-center">
    <div className="relative h-[10px] w-[18px]">
      <motion.span
        className="absolute left-0 h-[1.4px] w-full rounded-full bg-current"
        initial={false}
        animate={{
          y: open ? [null, 0, 0] : [null, 0, -3],
          rotate: open ? [null, 0, 45] : [null, 0, 0],
        }}
        style={{ top: "50%", marginTop: "-0.7px", transformOrigin: "center" }}
        transition={GLYPH_STEPS}
      />
      <motion.span
        className="absolute left-0 h-[1.4px] w-full rounded-full bg-current"
        initial={false}
        animate={{
          y: open ? [null, 0, 0] : [null, 0, 3],
          rotate: open ? [null, 0, -45] : [null, 0, 0],
        }}
        style={{
          bottom: "50%",
          marginBottom: "-0.7px",
          transformOrigin: "center",
        }}
        transition={GLYPH_STEPS}
      />
    </div>
  </div>
);

const useScrolled = () => {
  const [scrolled, setScrolled] = useState(false);
  const onLenis = useCallback((instance: Lenis) => {
    const next = instance.scroll > 24;
    setScrolled((current) => (current === next ? current : next));
  }, []);
  useLenis(onLenis);
  return scrolled;
};

const Logo = ({ label }: { label: string }) => (
  <Link
    to="/"
    aria-label={label}
    className="flex shrink-0 items-center gap-2 text-foreground transition-opacity hover:opacity-80"
  >
    <span
      aria-hidden
      className="size-6 shrink-0 bg-foreground"
      style={{
        mask: "url(/apple-touch-icon.png) center / contain no-repeat",
        WebkitMask: "url(/apple-touch-icon.png) center / contain no-repeat",
      }}
    />
    <span className="font-heading text-lg font-bold tracking-tight">Sola</span>
  </Link>
);

const DesktopNav = () => {
  const { language } = useLanguage();
  const t = useTranslation();
  const location = useLocation();
  const scrolled = useScrolled();
  const linksRef = useRef<HTMLElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);

  const links = MAIN_NAVIGATION.slice(1).map((item) => ({
    label:
      (t.nav[item.translationKey as keyof typeof t.nav] as string) || item.key,
    path: item.path,
  }));

  const isActive = useCallback(
    (path: string) =>
      location.pathname === path || location.pathname.startsWith(`${path}/`),
    [location.pathname],
  );

  const positionHighlight = useCallback((el: HTMLElement | null) => {
    const highlight = highlightRef.current;
    const container = linksRef.current;
    if (!highlight || !container || !el) return;
    const link = el.getBoundingClientRect();
    const box = container.getBoundingClientRect();
    highlight.style.width = `${link.width}px`;
    highlight.style.height = `${link.height}px`;
    highlight.style.transform = `translate(${link.left - box.left}px, ${link.top - box.top}px)`;
    highlight.style.opacity = "1";
  }, []);

  const snapToActive = useCallback(() => {
    const active = linksRef.current?.querySelector<HTMLElement>(
      "[data-active='true']",
    );
    if (active) positionHighlight(active);
    else if (highlightRef.current) highlightRef.current.style.opacity = "0";
  }, [positionHighlight]);

  useEffect(() => {
    const raf = requestAnimationFrame(snapToActive);
    return () => cancelAnimationFrame(raf);
  }, [location.pathname, language, snapToActive]);

  useEffect(() => {
    window.addEventListener("resize", snapToActive);
    return () => window.removeEventListener("resize", snapToActive);
  }, [snapToActive]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 hidden lg:block">
      <div className="px-5 sm:px-6 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
          className={cn(
            "pointer-events-auto mx-auto flex w-full items-center justify-between gap-6 transition-[max-width,margin,padding,border-radius,background-color,border-color,box-shadow] duration-200 ease-out",
            scrolled
              ? "mt-3 max-w-7xl rounded-full border border-foreground/10 bg-background px-4 py-2 shadow-lg shadow-black/5"
              : "mt-0 max-w-screen-2xl rounded-none border border-transparent bg-transparent px-6 py-5 lg:px-8",
          )}
        >
          <div className="flex min-w-0 items-center gap-3">
            <Logo label={t.common.home} />

            <span
              aria-hidden
              className="select-none text-lg text-foreground/25"
            >
              /
            </span>

            <nav
              ref={linksRef}
              aria-label={t.common.a11y.primaryNav}
              onMouseLeave={snapToActive}
              className="relative flex items-center"
            >
              <span
                ref={highlightRef}
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 rounded-full bg-foreground/10 opacity-0 transition-[transform,translate,scale,rotate,width,height,opacity] duration-300 ease-out"
              />
              {links.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    data-active={active}
                    aria-current={active ? "page" : undefined}
                    onMouseEnter={(e) => positionHighlight(e.currentTarget)}
                    className={cn(
                      "relative z-10 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                      active
                        ? "text-foreground"
                        : "text-foreground/60 hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <ToggleGroup />
        </motion.div>
      </div>
    </header>
  );
};

const MobileNav = () => {
  const t = useTranslation();
  const location = useLocation();
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);
  useWindowScrollLock(menuOpen);
  const reduceMotion = useReducedMotion();
  // on screen from the moment the menu opens until its exit has finished.
  // Set while rendering, so the render that closes the menu already knows
  // it is closing: the bar's transition picks its delay up as it starts.
  const [menuShown, setMenuShown] = useState(false);
  if (menuOpen && !menuShown) setMenuShown(true);
  const closing = menuShown && !menuOpen;

  const links = [
    { label: t.common.home, path: "/" },
    ...MAIN_NAVIGATION.slice(1).map((item) => ({
      label:
        (t.nav[item.translationKey as keyof typeof t.nav] as string) ||
        item.key,
      path: item.path,
    })),
  ];

  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname === path || location.pathname.startsWith(`${path}/`);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const close = useCallback(() => setMenuOpen(false), []);

  // while open: block page scroll (touch + wheel, but let the menu scroll if it
  // overflows), move focus into the menu, keep Tab cycling inside the menu +
  // bar (the close trigger lives in the bar, so both belong to the trap — and
  // that's also why the overlay can't claim aria-modal), and close on Escape
  // (which returns focus to the trigger)
  useEffect(() => {
    if (!menuOpen) return;

    const blockScroll = (e: Event) => {
      const el = navRef.current;
      if (
        el &&
        el.contains(e.target as Node) &&
        el.scrollHeight > el.clientHeight
      ) {
        return; // the menu itself can scroll — allow it
      }
      e.preventDefault();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        triggerRef.current?.focus();
        setMenuOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      // bar and overlay are DOM-adjacent, so native tabbing walks them in
      // order; only the edges need wrapping
      const focusables = [barRef.current, navRef.current]
        .filter((el): el is HTMLElement => el !== null)
        .flatMap((el) =>
          Array.from(
            el.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
          ),
        );
      if (focusables.length === 0) return;
      const active = document.activeElement as HTMLElement | null;
      const index = active ? focusables.indexOf(active) : -1;
      if (index === -1) {
        // outside the trap: pull focus back from the page, but leave portaled
        // surfaces (the appearance popover) to manage their own
        if (active === document.body) {
          e.preventDefault();
          focusables[0].focus();
        }
        return;
      }
      if (!e.shiftKey && index === focusables.length - 1) {
        e.preventDefault();
        focusables[0].focus();
      } else if (e.shiftKey && index === 0) {
        e.preventDefault();
        focusables[focusables.length - 1].focus();
      }
    };

    const raf = requestAnimationFrame(() =>
      navRef.current?.querySelector<HTMLAnchorElement>("a")?.focus(),
    );
    window.addEventListener("touchmove", blockScroll, { passive: false });
    window.addEventListener("wheel", blockScroll, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("touchmove", blockScroll);
      window.removeEventListener("wheel", blockScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      {/* the bar stays above the menu so its trigger doubles as the close (X).
          Open, it is the top of the sheet: solid, so the island's surface
          never thins out over the page while the sheet is still arriving */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 lg:hidden">
        <div className="px-3 sm:px-5">
          <motion.div
            ref={barRef}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            style={
              closing && !reduceMotion
                ? { transitionDelay: `${barReturnDelay()}s` }
                : undefined
            }
            className={cn(
              "pointer-events-auto mx-auto flex items-center justify-between gap-2 transition-[margin,padding,border-radius,background-color,border-color,box-shadow] duration-200 ease-out",
              scrolled && !menuOpen
                ? "mt-3 rounded-full border border-foreground/10 bg-background px-2 py-2 shadow-lg shadow-black/5"
                : "mt-0 rounded-none border border-transparent px-1 py-4",
              !scrolled && !menuOpen && "bg-transparent",
              menuOpen && "bg-background",
            )}
          >
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={
                menuOpen ? t.common.a11y.closeMenu : t.common.a11y.openMenu
              }
              aria-expanded={menuOpen}
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
            >
              <MenuGlyph open={menuOpen} />
            </button>

            <ToggleGroup gap="normal" />
          </motion.div>
        </div>
      </header>

      <AnimatePresence onExitComplete={() => setMenuShown(false)}>
        {menuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={close}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* the sheet: a flat, square rectangle, so growing it by scale
                looks the same as growing its height and costs a composite */}
            <motion.div
              aria-hidden
              variants={reduceMotion ? sheetFadeVariants : sheetVariants}
              className="absolute inset-0 origin-top bg-background"
            />
            <nav
              ref={navRef}
              aria-label={t.common.a11y.primaryNav}
              className="relative flex h-full flex-col overflow-y-auto overscroll-contain px-6 pt-18 pb-12 sm:px-7"
            >
              {links.map((link, index) => {
                const active = isActive(link.path);
                return (
                  <motion.div
                    key={link.path}
                    custom={{ index, total: links.length } satisfies LinkSlot}
                    variants={linkVariants}
                  >
                    <Link
                      to={link.path}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "inline-flex py-1.5 font-heading text-3xl font-semibold tracking-tight transition-colors",
                        active
                          ? "text-primary"
                          : "text-foreground/70 hover:text-foreground",
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// In code view the nav disappears entirely — the code view brings its own
// exit control. The bars are fixed, so the wrapper doesn't affect layout.
const Navigation = () => {
  const { active: codeView } = useCodeView();

  return (
    <AnimatePresence initial={false}>
      {!codeView && (
        <motion.div
          key="site-nav"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
        >
          <DesktopNav />
          <MobileNav />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Navigation;
