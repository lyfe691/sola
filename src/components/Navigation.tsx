/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { useEffect, useState, useCallback, memo, forwardRef } from "react";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { MAIN_NAVIGATION } from "@/config/navigation";
import { SearchToggle } from "./search-toggle";
import { LanguageToggle } from "./language-toggle";
import { ThemeToggle } from "./theme-toggle";

const STANDARD_EASE = [0.4, 0, 0.2, 1] as const;
const EMPHASIZED_EASE = [0.22, 1, 0.36, 1] as const;
const NAV_ITEM_LAYOUT = {
  type: "spring",
  stiffness: 320,
  damping: 36,
  mass: 0.82,
} as const;
const DESKTOP_ITEM_TRANSITION = { layout: NAV_ITEM_LAYOUT } as const;

// define types for the navitem component
interface NavItemProps {
  item: {
    text: string;
    path: string;
    icon?: React.ElementType;
  };
  index: number;
  isActive: (path: string) => boolean;
  isMobile?: boolean;
  onClick?: () => void;
  shouldAnimateInitial?: boolean;
}

// motion variants
const desktopItemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: EMPHASIZED_EASE, delay: i * 0.05 },
  }),
};

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
    transition: { duration: 0.4, ease: EMPHASIZED_EASE, when: "beforeChildren" },
  },
};

const mobileNavContainerVariants = {
  hidden: { opacity: 0, transition: { staggerChildren: 0.03, staggerDirection: -1 } },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};

// class constants
const DESKTOP_CONTAINER_CLASSES =
  "hidden lg:flex items-center justify-center mx-auto gap-x-1 rounded-full border border-border/20 bg-background/55 backdrop-blur-3xl py-3.5 px-4 shadow-lg shadow-black/5";

const MOBILE_OVERLAY_CLASSES =
  "fixed inset-0 bg-background/80 backdrop-blur-xl z-[60] lg:hidden mobile-menu";

// memoized navigation item for better performance
const NavItem = memo(
  forwardRef<HTMLAnchorElement, NavItemProps>(
    (
      {
        item,
        index,
        isActive,
        isMobile = false,
        onClick = () => {},
        shouldAnimateInitial = true,
      },
      ref,
    ) => {
      const itemVariants = desktopItemVariants;

      const Component = motion.div;
      const isItemActive = isActive(item.path);
      const linkBaseClass = isMobile
        ? "relative flex items-center w-full p-2 transition-colors duration-300 rounded-md text-2xl font-medium tracking-tight"
        : "relative px-6 py-3 text-base font-medium rounded-full transition-colors duration-300 z-10 flex items-center gap-2";
      const linkClassName = cn(
        linkBaseClass,
        isItemActive
          ? "text-primary"
          : "text-foreground/60 hover:text-foreground",
      );

      if (isMobile) {
        return (
          <Component
            layout
            key={item.path}
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
              ref={ref}
              className={linkClassName}
              aria-current={isItemActive ? "page" : undefined}
            >
              {item.icon && <item.icon className="w-6 h-6 mr-3" />}
              {item.text}
            </Link>
          </Component>
        );
      }

      return (
        <Component
          layout
          key={item.path}
          custom={index}
          variants={itemVariants}
          initial={shouldAnimateInitial ? "hidden" : false}
          animate="visible"
          exit="hidden"
          transition={DESKTOP_ITEM_TRANSITION}
        >
          <Link
            to={item.path}
            onClick={onClick}
            ref={ref}
            className={linkClassName}
            aria-current={isItemActive ? "page" : undefined}
          >
            {isItemActive && (
              <motion.div
                layoutId="nav-active"
                className="absolute inset-0 rounded-full bg-foreground/10"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 30,
                  mass: 0.85,
                }}
              />
            )}
            {item.icon && <item.icon className="w-4 h-4" />}
            <motion.span 
              layout 
              transition={{ layout: NAV_ITEM_LAYOUT }}
              className="relative z-10"
            >
              {item.text}
            </motion.span>
          </Link>
        </Component>
      );
    },
  ),
);

// ensure display name is set for devtools
NavItem.displayName = "NavItem";

// toggle group for theme, language, and search
interface ToggleGroupProps {
  className?: string;
  gap?: "tight" | "normal";
}

const ToggleGroup = memo(({ className, gap = "tight" }: ToggleGroupProps) => {
  const [openDropdown, setOpenDropdown] = useState<"language" | "theme" | null>(
    null,
  );

  return (
    <motion.div
      layout
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
    </motion.div>
  );
});
ToggleGroup.displayName = "ToggleGroup";

// mobile menu button with animated hamburger
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
      className="p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border/20
                hover:bg-foreground/5 transition-colors duration-300 shadow-sm z-[51]"
      whileTap={{ scale: 0.92 }}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      aria-controls="mobile-nav-menu"
    >
      <div className="w-5 h-4 relative flex flex-col items-center justify-center">
        <div className="relative w-[18px] h-[10px] flex flex-col justify-between">
          {/* Top bar */}
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

          {/* Bottom bar */}
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

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];
  const location = useLocation();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const shouldAnimateInitial = !hasMounted;

  const closeMenu = useCallback(() => {
    // Allow animations to play out smoothly
    setTimeout(() => {
      setIsMenuOpen(false);
      window.dispatchEvent(
        new CustomEvent("mobile-menu-toggle", { detail: { open: false } }),
      );
    }, 100);
  }, []);
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => {
      const next = !prev;
      window.dispatchEvent(
        new CustomEvent("mobile-menu-toggle", { detail: { open: next } }),
      );
      return next;
    });
  }, []);

  // memoized navigation items
  const homeItem = {
    text: t.common.home,
    path: "/",
    icon: MAIN_NAVIGATION[0].icon,
  };
  const navItems = MAIN_NAVIGATION.slice(1).map((item) => ({
    text: t.nav[item.translationKey as keyof typeof t.nav] || item.key,
    path: item.path,
  }));

  // memoized isactive check
  const isActive = useCallback(
    (path: string) => {
      return location.pathname === path;
    },
    [location.pathname],
  );

  // effect to handle clicks outside the menu
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

  // prevent body scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // prevent scrolling on body when menu is open
      document.body.style.overflow = "hidden";
    } else {
      // restore scrolling
      document.body.style.overflow = "";
    }

    return () => {
      // cleanup in case component unmounts while menu is open
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className="w-full mb-4 sm:mb-6 md:mb-8 lg:mb-12 sticky top-4 z-40 px-4 pointer-events-none">
      {/* desktop navigation */}
      <div className="flex justify-center items-center">
        <LayoutGroup>
          <motion.nav
            layout
            className={cn(DESKTOP_CONTAINER_CLASSES, "pointer-events-auto")}
            initial={shouldAnimateInitial ? { opacity: 0, y: -20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              ease: STANDARD_EASE,
              layout: {
                type: "spring",
                stiffness: 150,
                damping: 25,
                mass: 0.8,
              },
            }}
            style={{
              backdropFilter: "blur(28px) saturate(160%)",
              WebkitBackdropFilter: "blur(28px) saturate(160%)",
            }}
            aria-label="Primary"
          >
            {/* home navigation */}
            <NavItem
              item={homeItem}
              index={0}
              isActive={isActive}
              shouldAnimateInitial={shouldAnimateInitial}
            />

            <motion.div layout className="h-8 w-px bg-border/30 mx-3" />

            {/* main navigation */}
            {navItems.map((item, i) => (
              <NavItem
                key={item.path}
                item={item}
                index={i}
                isActive={isActive}
                shouldAnimateInitial={shouldAnimateInitial}
              />
            ))}

            <motion.div layout className="h-8 w-px bg-border/30 mx-3" />

            {/* toggles */}
            <ToggleGroup />
          </motion.nav>
        </LayoutGroup>
      </div>

      {/* mobile menu button */}
      <div className="lg:hidden fixed top-5 left-5 z-[70] menu-button pointer-events-auto">
        <MobileMenuButton isOpen={isMenuOpen} onClick={toggleMenu} />
      </div>

      {/* mobile toggles - fixed top right, aligned with hamburger */}
      <div className="lg:hidden fixed top-5 right-5 z-[70] pointer-events-auto">
        <ToggleGroup gap="normal" />
      </div>

      {/* mobile navigation menu */}
      <AnimatePresence mode="wait" initial={false}>
        {isMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants as any}
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
              <div className="flex-grow">
                <NavItem
                  item={homeItem}
                  index={0}
                  isActive={isActive}
                  isMobile={true}
                  onClick={closeMenu}
                  shouldAnimateInitial={shouldAnimateInitial}
                />
                <div className="my-4 h-px w-full bg-border" />
                <div className="space-y-2">
                  {navItems.map((item, i) => (
                    <NavItem
                      key={item.path}
                      item={item}
                      index={i + 1}
                      isActive={isActive}
                      isMobile={true}
                      onClick={closeMenu}
                      shouldAnimateInitial={shouldAnimateInitial}
                    />
                  ))}
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navigation;
