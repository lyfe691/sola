/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useLocation } from "react-router";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { useEffect, useState, useCallback, useRef, memo } from "react";
import { useLenis } from "lenis/react";
import type Lenis from "lenis";
import { useTranslation } from "@/lib/language-provider";
import { useWindowScrollLock } from "@/hooks/use-window-scroll-lock";
import { useCommandMenu } from "@/hooks/use-command-menu";
import { useMobileMenu } from "@/hooks/use-mobile-menu";
import { cn } from "@/lib/utils";
import { MAIN_NAVIGATION } from "@/config/navigation";
import { NAV_MENUS, NAV_PANEL_WIDTH, type NavMenuKey } from "@/config/nav-menu";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useGlidePill } from "./ui/custom/glide-pill";
import { ContactMenu } from "./contact-menu";
import { NavPanel } from "./nav-menu";
import { SearchToggle } from "./search-toggle";
import { AppearanceMenu } from "./appearance-menu";
import { useCodeView } from "./deploy-diff/code-view-provider";
import { EASE_OUT } from "@/utils/transitions";
import { Link } from "@/lib/locale-router";

const overlayVariants = {
  hidden: { opacity: 0, transition: { duration: 0.25, ease: EASE_OUT } },
  visible: { opacity: 1, transition: { duration: 0.3, ease: EASE_OUT } },
};

// a light cascade: a short beat between links and a quick settle each, so the
// list arrives as one smooth gesture rather than a slow, weighted drop
const menuListVariants = {
  hidden: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
  visible: { transition: { delayChildren: 0.04, staggerChildren: 0.035 } },
};

const menuItemVariants = {
  hidden: {
    opacity: 0,
    y: 12,
    transition: { duration: 0.2, ease: EASE_OUT },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_OUT },
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
        className="absolute inset-y-0 left-0 my-auto h-[1.4px] w-full rounded-full bg-current"
        initial={false}
        animate={{
          rotate: open ? 45 : 0,
          y: open ? 0 : -3,
        }}
        transition={{ duration: 0.3, ease: EASE_OUT }}
      />
      <motion.span
        className="absolute inset-y-0 left-0 my-auto h-[1.4px] w-full rounded-full bg-current"
        initial={false}
        animate={{
          rotate: open ? -45 : 0,
          y: open ? 0 : 3,
        }}
        transition={{ duration: 0.3, ease: EASE_OUT }}
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
      className="size-6 shrink-0 bg-foreground mask-[url(/apple-touch-icon.png)] mask-contain mask-center mask-no-repeat"
    />
    <span className="font-heading text-lg font-bold tracking-tight">Sola</span>
  </Link>
);

const DesktopNav = () => {
  const t = useTranslation();
  const location = useLocation();
  const scrolled = useScrolled();
  const rowRef = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState<{ key: NavMenuKey; x: number } | null>(null);
  const leaving = useRef<number | undefined>(undefined);
  // one fill for the links, gliding to the one under the pointer; it waits
  // on a link whose menu is open
  const glide = useGlidePill();
  const hidePill = glide.hide;

  // Contact is the bar's button, not one of its links
  const links = MAIN_NAVIGATION.slice(1)
    .filter((item) => item.key !== "contact")
    .map((item) => ({
      label:
        (t.nav[item.translationKey as keyof typeof t.nav] as string) ||
        item.key,
      path: item.path,
    }));

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const close = useCallback(() => {
    window.clearTimeout(leaving.current);
    setMenu(null);
    hidePill();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hide only sets state
  }, []);
  useEffect(() => () => window.clearTimeout(leaving.current), []);

  // under its link, moved left as far as it takes to stay inside the bar
  const open = (key: NavMenuKey, link: HTMLElement) => {
    const row = rowRef.current;
    if (!row) return;
    window.clearTimeout(leaving.current);
    const offset =
      link.getBoundingClientRect().left - row.getBoundingClientRect().left;
    const x = Math.max(0, Math.min(offset, row.clientWidth - NAV_PANEL_WIDTH));
    setMenu((current) =>
      current?.key === key && current.x === x ? current : { key, x },
    );
  };
  const hold = () => window.clearTimeout(leaving.current);
  // a pointer on its way from the link to the panel leaves both for a moment
  const closeSoon = () => {
    window.clearTimeout(leaving.current);
    leaving.current = window.setTimeout(() => {
      setMenu(null);
      hidePill();
    }, 150);
  };
  // Tab walks from a link into its menu, and out of the menu's far end to
  // whatever follows the link in the bar: the panel sits after the links in
  // the document, so the browser's own order would visit it last
  const menuLink = (key: NavMenuKey) =>
    rowRef.current?.querySelector<HTMLElement>(`[data-nav-menu="${key}"] a`);
  const tabOut = (key: NavMenuKey, forward: boolean) => {
    const link = menuLink(key);
    const row = rowRef.current;
    if (!link || !row) return;
    if (!forward) return link.focus();
    const stops = Array.from(
      row.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
    ).filter((stop) => !stop.closest("[data-nav-layer]"));
    close();
    stops[stops.indexOf(link) + 1]?.focus();
  };

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 hidden lg:block"
      onKeyDown={(event) => {
        if (event.key !== "Escape" || !menu) return;
        menuLink(menu.key)?.focus();
        close();
      }}
      onBlur={(event) => {
        const next = event.relatedTarget;
        if (!(next instanceof Element) || !next.closest("[data-nav-menu]"))
          close();
      }}
    >
      <motion.div
        data-nav-bar
        data-docked={scrolled || undefined}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
        className={cn(
          "border-b px-12 transition-[background-color,border-color] duration-300 ease-out",
          scrolled || menu
            ? "border-foreground/10 bg-background"
            : "border-transparent bg-transparent",
        )}
      >
        <div
          ref={rowRef}
          className="relative mx-auto flex h-16 max-w-7xl items-center gap-6"
        >
          <Logo label={t.common.home} />

          <span
            aria-hidden="true"
            className="h-5 w-px rotate-12 bg-foreground/20"
          />

          <nav
            aria-label={t.common.a11y.primaryNav}
            className="relative isolate -ml-3 flex items-center"
            onPointerOver={(event) => {
              const link =
                event.target instanceof Element
                  ? event.target.closest<HTMLElement>("a")
                  : null;
              if (link && event.pointerType !== "touch") glide.moveTo(link);
            }}
            onPointerLeave={() => {
              if (!menu) glide.hide();
            }}
          >
            {glide.pill}
            {links.map((link) => {
              const active = isActive(link.path);
              const key = NAV_MENUS[link.path];
              const expanded = menu?.key === key;
              const className = cn(
                "flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium outline-none transition-colors duration-200 ease-out focus-visible:ring-2 focus-visible:ring-ring/50",
                active || (key && expanded)
                  ? "text-foreground"
                  : "text-foreground/60 hover:text-foreground",
              );
              if (!key)
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    aria-current={active ? "page" : undefined}
                    className={className}
                  >
                    {link.label}
                  </Link>
                );
              return (
                <div
                  key={link.path}
                  data-nav-menu={key}
                  onPointerEnter={(event) => {
                    if (event.pointerType !== "touch")
                      open(key, event.currentTarget);
                  }}
                  onPointerLeave={closeSoon}
                  onFocus={(event) => {
                    if (event.target.matches(":focus-visible"))
                      open(key, event.currentTarget);
                  }}
                  onKeyDown={(event) => {
                    if (event.key !== "Tab" || event.shiftKey || !expanded)
                      return;
                    const first = rowRef.current?.querySelector<HTMLElement>(
                      `[data-nav-layer="${key}"] a`,
                    );
                    if (!first) return;
                    event.preventDefault();
                    first.focus();
                  }}
                >
                  <Link
                    to={link.path}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    aria-expanded={expanded}
                    className={className}
                  >
                    {link.label}
                    <HugeiconsIcon
                      icon={ArrowDown01Icon}
                      strokeWidth={2}
                      aria-hidden="true"
                      className={cn(
                        "size-3.5 transition-transform duration-200 ease-out",
                        expanded && "rotate-180",
                      )}
                    />
                  </Link>
                </div>
              );
            })}
          </nav>

          <AnimatePresence>
            {menu && (
              <NavPanel
                menu={menu.key}
                x={menu.x}
                onNavigate={close}
                onTabOut={tabOut}
                onPointerEnter={hold}
                onPointerLeave={closeSoon}
              />
            )}
          </AnimatePresence>

          <div className="ml-auto flex items-center gap-3">
            <ToggleGroup />
            <ContactMenu />
          </div>
        </div>
      </motion.div>
    </header>
  );
};
const MobileNav = () => {
  const t = useTranslation();
  const location = useLocation();
  const scrolled = useScrolled();
  const menuOpen = useMobileMenu((state) => state.isOpen);
  const setMenuOpen = useMobileMenu((state) => state.setOpen);
  useWindowScrollLock(menuOpen);

  // the palette takes over the screen: the menu gives way to it rather than
  // trapping its focus and touches underneath
  useEffect(
    () =>
      useCommandMenu.subscribe((state) => {
        if (state.isOpen) setMenuOpen(false);
      }),
    [setMenuOpen],
  );
  // the store outlives the bar (code view unmounts it): a menu that is gone
  // is a closed one, or it would keep the page locked
  useEffect(() => () => setMenuOpen(false), [setMenuOpen]);

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

  const close = useCallback(() => setMenuOpen(false), [setMenuOpen]);

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
        )
        // the bar's own toggles are hidden while the menu is open
        .filter((el) => getComputedStyle(el).visibility !== "hidden");
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
  }, [menuOpen, setMenuOpen]);

  return (
    <>
      {/* the bar stays above the overlay so its trigger doubles as the close (X) */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 lg:hidden">
        <div className="px-3 sm:px-5">
          <motion.div
            ref={barRef}
            data-nav-bar
            data-docked={(scrolled && !menuOpen) || undefined}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className={cn(
              "pointer-events-auto mx-auto flex items-center justify-between gap-2 rounded-full border transition-[margin,padding,background-color,border-color,box-shadow] duration-500 ease-out-quart",
              scrolled && !menuOpen
                ? "mt-3 border-foreground/10 bg-background px-2 py-2 shadow-lg shadow-black/5"
                : "mt-0 border-transparent bg-transparent px-1 py-4",
            )}
          >
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={
                menuOpen ? t.common.a11y.closeMenu : t.common.a11y.openMenu
              }
              aria-expanded={menuOpen}
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
            >
              <MenuGlyph open={menuOpen} />
            </button>

            {/* the open menu is the links and the way out, nothing else */}
            <ToggleGroup
              gap="normal"
              className={cn(
                "transition-[opacity,visibility] duration-200 ease-out",
                menuOpen && "invisible opacity-0",
              )}
            />
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
            className="fixed inset-0 z-40 bg-background lg:hidden"
          >
            <motion.nav
              ref={navRef}
              variants={menuListVariants as Variants}
              aria-label={t.common.a11y.primaryNav}
              className="flex h-full flex-col justify-center gap-1 overflow-y-auto overscroll-contain px-8"
            >
              {links.map((link) => {
                const active = isActive(link.path);
                return (
                  <motion.div
                    key={link.path}
                    variants={menuItemVariants as Variants}
                  >
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
