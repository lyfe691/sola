/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { useEffect, useState, useCallback, useRef, memo } from "react";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { MAIN_NAVIGATION } from "@/config/navigation";
import { SearchToggle } from "./search-toggle";
import { AppearanceMenu } from "./appearance-menu";

const STANDARD_EASE = [0.4, 0, 0.2, 1] as const;
const EMPHASIZED_EASE = [0.22, 1, 0.36, 1] as const;

const overlayVariants = {
  hidden: { opacity: 0, transition: { duration: 0.25, ease: STANDARD_EASE } },
  visible: { opacity: 1, transition: { duration: 0.3, ease: EMPHASIZED_EASE } },
};

const menuListVariants = {
  hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
  visible: { transition: { delayChildren: 0.04, staggerChildren: 0.06 } },
};

const menuItemVariants = {
  hidden: {
    opacity: 0,
    y: 12,
    transition: { duration: 0.2, ease: STANDARD_EASE },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 18, mass: 1 },
  },
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

/** the two-line trigger glyph that morphs into an X while the menu is open */
const MenuGlyph = ({ open }: { open: boolean }) => (
  <div className="relative flex h-4 w-5 items-center justify-center">
    <div className="relative h-[10px] w-[18px]">
      <motion.span
        className="absolute left-0 top-0 h-[1.4px] w-full rounded-full bg-current"
        initial={false}
        animate={{
          top: "50%",
          marginTop: "-0.7px",
          rotate: open ? 45 : 0,
          y: open ? 0 : -3,
        }}
        style={{ transformOrigin: "center" }}
        transition={{ duration: 0.3, ease: EMPHASIZED_EASE }}
      />
      <motion.span
        className="absolute bottom-0 left-0 h-[1.4px] w-full rounded-full bg-current"
        initial={false}
        animate={{
          bottom: "50%",
          marginBottom: "-0.7px",
          rotate: open ? -45 : 0,
          y: open ? 0 : 3,
        }}
        style={{ transformOrigin: "center" }}
        transition={{ duration: 0.3, ease: EMPHASIZED_EASE }}
      />
    </div>
  </div>
);

const useScrolled = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
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
  const t = translations[language];
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
          transition={{ duration: 0.4, ease: EMPHASIZED_EASE }}
          className={cn(
            "pointer-events-auto mx-auto flex w-full items-center justify-between gap-6 transition-[max-width,margin,padding,border-radius,background-color,border-color,box-shadow] duration-300 ease-out",
            scrolled
              ? "mt-3 max-w-7xl rounded-full border border-foreground/10 bg-background/70 px-4 py-2 shadow-lg shadow-black/5 backdrop-blur-2xl"
              : "mt-0 max-w-screen-2xl rounded-none border border-transparent bg-transparent px-6 py-5 lg:px-8",
          )}
        >
          <div className="flex min-w-0 items-center gap-3">
            <Logo label={t.common.home} />

            <span aria-hidden className="select-none text-lg text-foreground/25">
              /
            </span>

            <nav
              ref={linksRef}
              aria-label="Primary"
              onMouseLeave={snapToActive}
              className="relative flex items-center"
            >
              <span
                ref={highlightRef}
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 rounded-full bg-foreground/10 opacity-0 transition-all duration-300 ease-out"
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
  const { language } = useLanguage();
  const t = translations[language];
  const location = useLocation();
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);

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
  const navRef = useRef<HTMLElement>(null);

  const close = useCallback(() => setMenuOpen(false), []);

  // while open: block page scroll (touch + wheel, but let the menu scroll if it
  // overflows), move focus into the menu, and close on Escape (which returns
  // focus to the trigger)
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
      {/* the bar stays above the overlay so its trigger doubles as the close (X) */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 lg:hidden">
        <div className="px-3 sm:px-5">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EMPHASIZED_EASE }}
            className={cn(
              "pointer-events-auto mx-auto flex items-center justify-between gap-2 transition-[margin,padding,border-radius,background-color,border-color,box-shadow] duration-300 ease-out",
              scrolled && !menuOpen
                ? "mt-3 rounded-full border border-foreground/10 bg-background/70 px-2 py-2 shadow-lg shadow-black/5 backdrop-blur-2xl"
                : "mt-0 rounded-none border border-transparent bg-transparent px-1 py-4",
            )}
          >
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
            >
              <MenuGlyph open={menuOpen} />
            </button>

            <ToggleGroup gap="normal" />
          </motion.div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            variants={overlayVariants as Variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={close}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-2xl lg:hidden"
          >
            <motion.nav
              ref={navRef}
              variants={menuListVariants as Variants}
              aria-label="Primary"
              className="flex h-full flex-col justify-center gap-1 overflow-y-auto overscroll-contain px-8"
            >
              {links.map((link) => {
                const active = isActive(link.path);
                return (
                  <motion.div key={link.path} variants={menuItemVariants}>
                    <Link
                      to={link.path}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "inline-flex font-heading text-4xl font-semibold tracking-tight transition-colors",
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
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Navigation = () => (
  <>
    <DesktopNav />
    <MobileNav />
  </>
);

export default Navigation;
