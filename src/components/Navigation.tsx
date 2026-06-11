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
import { LanguageToggle } from "./language-toggle";
import { ThemeToggle } from "./theme-toggle";

const STANDARD_EASE = [0.4, 0, 0.2, 1] as const;
const EMPHASIZED_EASE = [0.22, 1, 0.36, 1] as const;

const mobileItemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.4, ease: EMPHASIZED_EASE },
  }),
  exit: {
    opacity: 0,
    y: -15,
    transition: { duration: 0.3, ease: STANDARD_EASE },
  },
};

const mobileMenuVariants = {
  hidden: {
    opacity: 0,
    transition: { duration: 0.5, ease: STANDARD_EASE, when: "afterChildren" },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: EMPHASIZED_EASE,
      when: "beforeChildren",
    },
  },
};

const mobileNavContainerVariants = {
  hidden: {
    opacity: 0,
    transition: { staggerChildren: 0.03, staggerDirection: -1 },
  },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const MOBILE_OVERLAY_CLASSES =
  "fixed inset-0 bg-background/80 backdrop-blur-xl z-60 lg:hidden mobile-menu";

interface ToggleGroupProps {
  className?: string;
  gap?: "tight" | "normal";
}

const ToggleGroup = memo(({ className, gap = "tight" }: ToggleGroupProps) => {
  const [openDropdown, setOpenDropdown] = useState<"language" | "theme" | null>(
    null,
  );

  return (
    <div
      className={cn(
        "flex items-center",
        gap === "tight" ? "gap-1" : "gap-2",
        className,
      )}
    >
      <SearchToggle />
      <LanguageToggle
        open={openDropdown === "language"}
        onOpenChange={(isOpen) => setOpenDropdown(isOpen ? "language" : null)}
      />
      <ThemeToggle
        open={openDropdown === "theme"}
        onOpenChange={(isOpen) => setOpenDropdown(isOpen ? "theme" : null)}
      />
    </div>
  );
});
ToggleGroup.displayName = "ToggleGroup";

interface MobileNavItemProps {
  item: { text: string; path: string; icon?: React.ElementType };
  index: number;
  isActive: (path: string) => boolean;
  onClick?: () => void;
}

const MobileNavItem = memo(
  ({ item, index, isActive, onClick }: MobileNavItemProps) => {
    const active = isActive(item.path);
    return (
      <motion.div
        layout
        custom={index}
        variants={mobileItemVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full"
      >
        <Link
          to={item.path}
          onClick={onClick}
          aria-current={active ? "page" : undefined}
          className={cn(
            "relative flex w-full items-center rounded-md p-2 text-2xl font-medium tracking-tight transition-colors duration-300",
            active ? "text-primary" : "text-foreground/60 hover:text-foreground",
          )}
        >
          {item.icon && <item.icon className="mr-3 size-6" />}
          {item.text}
        </Link>
      </motion.div>
    );
  },
);
MobileNavItem.displayName = "MobileNavItem";

const MobileMenuButton = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <motion.button
      onClick={onClick}
      className="p-3 rounded-full bg-background/80 backdrop-blur-xs border border-foreground/10
                hover:bg-foreground/5 transition-colors duration-300 shadow-xs z-51"
      whileTap={{ scale: 0.92 }}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      aria-controls="mobile-nav-menu"
    >
      <div className="w-5 h-4 relative flex flex-col items-center justify-center">
        <div className="relative w-[18px] h-[10px] flex flex-col justify-between">
          <motion.span
            className="h-[1.4px] bg-current rounded-full w-full absolute top-0"
            initial={false}
            animate={{
              rotate: isOpen ? 45 : 0,
              y: isOpen ? 0 : -3,
              top: "50%",
              marginTop: "-0.7px",
            }}
            style={{ transformOrigin: "center" }}
            transition={{
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
            }}
          />

          <motion.span
            className="h-[1.4px] bg-current rounded-full w-full absolute bottom-0"
            initial={false}
            animate={{
              rotate: isOpen ? -45 : 0,
              y: isOpen ? 0 : 3,
              bottom: "50%",
              marginBottom: "-0.7px",
            }}
            style={{ transformOrigin: "center" }}
            transition={{
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
            }}
          />
        </div>
      </div>
    </motion.button>
  );
};

const DesktopNav = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const linksRef = useRef<HTMLElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);

  const links = MAIN_NAVIGATION.slice(1).map((item) => ({
    label: (t.nav[item.translationKey as keyof typeof t.nav] as string) ||
      item.key,
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            <Link
              to="/"
              aria-label={t.common.home}
              className="flex shrink-0 items-center gap-2 text-foreground transition-opacity hover:opacity-80"
            >
              <span
                aria-hidden
                className="size-6 shrink-0 bg-foreground"
                style={{
                  mask: "url(/apple-touch-icon.png) center / contain no-repeat",
                  WebkitMask:
                    "url(/apple-touch-icon.png) center / contain no-repeat",
                }}
              />
              <span className="font-heading text-lg font-bold tracking-tight">
                Sola
              </span>
            </Link>

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

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];
  const location = useLocation();

  const closeMenu = useCallback(() => {
    setTimeout(() => setIsMenuOpen(false), 100);
  }, []);
  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);

  const homeItem = {
    text: t.common.home,
    path: "/",
    icon: MAIN_NAVIGATION[0].icon,
  };
  const navItems = MAIN_NAVIGATION.slice(1).map((item) => ({
    text: (t.nav[item.translationKey as keyof typeof t.nav] as string) ||
      item.key,
    path: item.path,
  }));

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen) {
        const menu = document.querySelector(".mobile-menu");
        const menuButton = document.querySelector(".menu-button");

        if (
          menu &&
          menuButton &&
          !menu.contains(event.target as Node) &&
          !menuButton.contains(event.target as Node)
        ) {
          closeMenu();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen, closeMenu]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <DesktopNav />

      <div className="lg:hidden fixed top-5 left-5 z-70 menu-button pointer-events-auto">
        <MobileMenuButton isOpen={isMenuOpen} onClick={toggleMenu} />
      </div>

      <div className="lg:hidden fixed top-5 right-5 z-70 pointer-events-auto">
        <ToggleGroup gap="normal" />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {isMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants as Variants}
            className={cn(MOBILE_OVERLAY_CLASSES, "pointer-events-auto")}
            style={{
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
            }}
          >
            <motion.nav
              variants={mobileNavContainerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              id="mobile-nav-menu"
              aria-label="Primary"
              className="flex flex-col h-full max-w-sm mx-auto px-8 pt-24 pb-12 relative z-10"
            >
              <div className="grow">
                <MobileNavItem
                  item={homeItem}
                  index={0}
                  isActive={isActive}
                  onClick={closeMenu}
                />
                <div className="my-4 h-px w-full bg-border" />
                <div className="space-y-2">
                  {navItems.map((item, i) => (
                    <MobileNavItem
                      key={item.path}
                      item={item}
                      index={i + 1}
                      isActive={isActive}
                      onClick={closeMenu}
                    />
                  ))}
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
