/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight01Icon,
  CodeXmlIcon,
  Image01Icon,
  PaintBoardIcon,
  SparklesIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "./theme-provider";
import { THEMES, type Theme, type ThemeIcon } from "@/config/themes";
import { hugeIcon } from "@/lib/huge-icon";
import { useBackground } from "@/components/backgrounds/background-provider";
import { buildBackgroundOptions } from "@/components/backgrounds/registry";
import { MenuHint } from "@/components/menu-hint";
import { useCodeView } from "@/components/deploy-diff/code-view-provider";
import { DiffHintContent } from "@/components/deploy-diff/diff-hint";
import { Switch } from "@/components/ui/switch";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import { AnimatePresence, motion } from "motion/react";
import { EASE_OUT } from "@/utils/transitions";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";

const iconClass = "size-4 shrink-0 text-muted-foreground";
const ThemesBranchIcon = hugeIcon(PaintBoardIcon);
const CustomThemesBranchIcon = hugeIcon(SparklesIcon);
const BackgroundBranchIcon = hugeIcon(Image01Icon);

/**
 * An expandable tree node: a header that toggles an indented list of children.
 * The list collapses by animating grid rows from 0fr → 1fr, which stays smooth
 * (no height jump) and nests cleanly. Children always render so the collapse
 * can animate; `inert` keeps them out of tab order while closed.
 */
function TreeBranch({
  icon: Icon,
  label,
  accessory,
  isOpen,
  onToggle,
  children,
  ...props
}: {
  icon: ThemeIcon;
  label: string;
  accessory?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
} & Omit<React.ComponentProps<"button">, "onClick">) {
  return (
    <div>
      <div className="flex items-center">
        <button
          {...props}
          type="button"
          aria-expanded={isOpen}
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
        >
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            strokeWidth={2}
            className={cn(
              "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-90",
            )}
          />
          <Icon className={iconClass} />
          <span className="truncate">{label}</span>
        </button>
        {accessory && <span className="px-1.5">{accessory}</span>}
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden" inert={!isOpen}>
          <div className="ml-[1.4rem] flex flex-col gap-0.5 border-l border-border/60 pt-0.5 pb-1 pl-1.5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * A selectable leaf row, marked with a check when active. Rest props (and
 * React 19's ref-as-prop) spread onto the button so the row composes with
 * render-prop primitives like HoverCardTrigger.
 */
function TreeLeaf({
  icon: Icon,
  label,
  isSelected,
  onClick,
  ...props
}: {
  icon?: ThemeIcon;
  label: string;
  isSelected: boolean;
  onClick: (event: React.MouseEvent) => void;
} & Omit<React.ComponentProps<"button">, "onClick">) {
  return (
    <button
      {...props}
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-sm outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
    >
      <span
        className={cn(
          "flex min-w-0 flex-1 items-center gap-2",
          isSelected && "text-muted-foreground",
        )}
      >
        {Icon && <Icon className={iconClass} aria-hidden="true" />}
        <span className="truncate">{label}</span>
      </span>
      {isSelected && (
        <HugeiconsIcon
          icon={Tick02Icon}
          strokeWidth={2}
          className={iconClass}
        />
      )}
    </button>
  );
}

type BranchId = "themes" | "custom" | "background";

/**
 * Mini page mock that WEARS a theme's class, so every color resolves to that
 * theme's real tokens (the classes in index.css define --background,
 * --primary, … — no duplicated palette data anywhere). The class is
 * required: the hover-card portal inherits the ACTIVE theme's tokens from
 * <html>, so even "light" must re-scope itself (the `.light` class shares
 * :root's block in index.css). Borders stay token-relative (foreground/10)
 * so they read correctly inside any theme.
 */
function ThemeSwatch({
  themeClass,
  className,
}: {
  themeClass: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        themeClass,
        // rounded-2xl: concentric with the hover card (rounded-3xl − p-1).
        // transition-colors everywhere: the swatch DOM is stable across
        // hovers and only its theme class swaps, so palettes MORPH from one
        // theme to the next instead of remount-flashing.
        "min-w-0 flex-1 rounded-2xl border border-foreground/10 bg-background p-2.5 transition-colors",
        className,
      )}
    >
      <p className="font-heading text-sm font-semibold text-foreground transition-colors">
        Aa
      </p>
      <div className="mt-1.5 h-1 w-3/4 rounded-full bg-muted-foreground/40 transition-colors" />
      <div className="mt-1 h-1 w-1/2 rounded-full bg-muted-foreground/25 transition-colors" />
      <div className="mt-2.5 flex items-center gap-1">
        <span className="h-3.5 flex-1 rounded-md bg-primary transition-colors" />
        <span className="h-3.5 w-5 rounded-md border border-foreground/10 bg-accent transition-colors" />
        <span className="size-3.5 rounded-full border border-foreground/10 bg-secondary transition-colors" />
      </div>
    </div>
  );
}

/**
 * Hover preview for one theme row. One STABLE swatch pair: the left swatch
 * always renders (wearing the hovered theme's class, or light for system),
 * and the dark half slides open via animated flex-grow only for "system".
 * No remounts anywhere — colors morph, the split glides.
 */
function ThemePreview({ value }: { value: string }) {
  const isSystem = value === "system";
  // ONE owner for the split geometry: the wrapper animates its own width
  // and the card shell simply sizes to content — pairing a shell width
  // tween with a flex split needed pixel-exact agreement and cropped the
  // dark card on any rounding. 136px matches the single-swatch width, so
  // the system split is symmetric halves.
  return (
    <div className="flex">
      <ThemeSwatch
        themeClass={isSystem ? "light" : value}
        className="w-[136px] flex-none"
      />
      <div
        className={cn(
          "overflow-hidden transition-[width,opacity]",
          isSystem ? "w-[140px] opacity-100" : "w-0 opacity-0",
        )}
        aria-hidden={!isSystem}
      >
        {/* fixed width + left inset so the dark half CLIPS while sliding
            shut instead of squishing its contents */}
        <ThemeSwatch themeClass="dark" className="ml-1 w-[136px] flex-none" />
      </div>
    </div>
  );
}

/** The theme/background picker tree — the content of the appearance menu. */
export function ThemeMenuContent({
  onClose,
}: {
  /** called when a selection warrants closing the menu (the code-view flip) */
  onClose?: () => void;
}) {
  const { theme, setTheme } = useTheme();
  const { active: activeBackground, setActive: setBackground } =
    useBackground();
  const { active: codeView, setActive: setCodeView } = useCodeView();
  const { language } = useLanguage();
  const t = translations[language];

  const [expanded, setExpanded] = useState<Set<BranchId>>(
    () => new Set(["themes"]),
  );

  const isExpanded = (id: BranchId) => expanded.has(id);

  const toggleBranch = (id: BranchId) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // apply the theme but keep the menu open so themes can be tried in place
  const selectTheme = (value: string) => (event: React.MouseEvent) =>
    setTheme(value as Theme, event);

  // ONE shared preview panel for the whole theme tree — per-row hover cards
  // at zero delay stack up while the outgoing ones exit; a single panel
  // makes overlap structurally impossible. Rows only report themselves;
  // the panel glides to the hovered row and crossfades its palette.
  // viewport coords: the panel renders in a body portal, because the menu
  // popover clips (overflow-hidden for its rounding, overflow-x-hidden on
  // its scroll wrapper) — anything hanging outside the menu box vanishes
  const [preview, setPreview] = useState<{
    value: string;
    top: number;
    right: number;
  } | null>(null);
  const themeTreeRef = useRef<HTMLDivElement>(null);

  const previewRow =
    (value: string) => (event: React.SyntheticEvent<HTMLElement>) => {
      const tree = themeTreeRef.current;
      if (!tree) return;
      const row = event.currentTarget.getBoundingClientRect();
      setPreview({
        value,
        top: row.top + row.height / 2,
        right: window.innerWidth - tree.getBoundingClientRect().left + 12,
      });
    };

  const renderThemeLeaf = (option: (typeof THEMES)[number]) => (
    <TreeLeaf
      key={option.value}
      icon={option.icon}
      label={option.label}
      isSelected={theme === option.value}
      onClick={selectTheme(option.value)}
      onMouseEnter={previewRow(option.value)}
      onFocus={previewRow(option.value)}
    />
  );

  return (
    <div className="min-w-[212px]">
      {/* relative wrapper OUTSIDE the branches: the collapse containers are
          overflow-hidden, so the panel must be their sibling to escape.
          Leaving the themes subtree (to Backgrounds, or out of the menu)
          dismisses the panel. */}
      <div
        ref={themeTreeRef}
        className="relative"
        onMouseLeave={() => setPreview(null)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setPreview(null);
          }
        }}
      >
        <TreeBranch
          icon={ThemesBranchIcon}
          label={t.common.menu.themes}
          isOpen={isExpanded("themes")}
          onToggle={() => toggleBranch("themes")}
          onMouseEnter={() => setPreview(null)}
          onFocus={() => setPreview(null)}
        >
          {THEMES.filter((o) => !o.isCustom).map(renderThemeLeaf)}

          <TreeBranch
            icon={CustomThemesBranchIcon}
            label={t.common.menu.customThemes}
            isOpen={isExpanded("custom")}
            onToggle={() => toggleBranch("custom")}
            onMouseEnter={() => setPreview(null)}
            onFocus={() => setPreview(null)}
          >
            {THEMES.filter((o) => o.isCustom).map(renderThemeLeaf)}
          </TreeBranch>
        </TreeBranch>

        {createPortal(
          <AnimatePresence>
            {preview && (
              <motion.div
                key="theme-preview"
                initial={{ opacity: 0, x: 6, y: preview.top }}
                animate={{ opacity: 1, x: 0, y: preview.top }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
                style={{ top: 0, right: preview.right }}
                className="pointer-events-none fixed z-50"
              >
                {/* card shell mirrors HoverCardContent; -translate-y-1/2
                    centers it on the hovered row (outer element owns the
                    motion transform, so the static one lives here) */}
                <div className="w-max -translate-y-1/2 rounded-3xl bg-popover p-1 shadow-lg ring-1 ring-foreground/5 dark:ring-foreground/10">
                  <ThemePreview value={preview.value} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
      </div>

      <TreeBranch
        icon={BackgroundBranchIcon}
        label={t.common.menu.background}
        accessory={<MenuHint text={t.common.backgroundHints.section} />}
        isOpen={isExpanded("background")}
        onToggle={() => toggleBranch("background")}
      >
        {buildBackgroundOptions(t.common.none).map((option) => (
          <TreeLeaf
            key={option.id}
            label={option.label}
            isSelected={activeBackground === option.id}
            onClick={() => setBackground(option.id)}
          />
        ))}
      </TreeBranch>

      <div className="mx-2 my-1 h-px bg-border/60" />

      {/* flips the whole page into the code view; the label wraps the switch
          so the row itself is clickable. Closing the menu lets the page
          transition play unobstructed. Lingering on the row grows a hint card
          with a miniature of the mode and the one-line explanation. */}
      <HoverCard>
        <HoverCardTrigger
          delay={250}
          render={
            <label className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground" />
          }
        >
          <HugeiconsIcon
            icon={CodeXmlIcon}
            strokeWidth={2}
            className={iconClass}
            aria-hidden="true"
          />
          <span className="min-w-0 flex-1 truncate text-left">
            {t.common.diff.showDiff}
          </span>
          <Switch
            size="sm"
            checked={codeView}
            onCheckedChange={(checked) => {
              setCodeView(checked);
              onClose?.();
            }}
          />
        </HoverCardTrigger>
        {/* a hair more air than the default — the card hangs off a raised
            menu panel, not a bare control */}
        <DiffHintContent side="left" sideOffset={8} />
      </HoverCard>
    </div>
  );
}

/**
 * The animated sun/moon glyph for the appearance-menu trigger. Crossfades
 * between the active light/dark icon; the system preference is read
 * synchronously at first render so it never flashes the wrong state.
 */
export function ThemeTriggerIcon() {
  const { theme } = useTheme();
  // no SSR here, so the initial value can be read synchronously — no mounted
  // guard, no wrong-state flash
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) =>
      setSystemTheme(e.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const resolvedTheme = theme === "system" ? systemTheme : theme;

  return (
    <>
      {THEMES.map((option) => {
        // "system" isn't a visual state itself — it resolves to light/dark.
        if (option.value === "system") return null;

        const Icon = option.icon;
        const isVisible =
          theme === "system"
            ? option.value === resolvedTheme
            : theme === option.value;

        return (
          <Icon
            key={option.value}
            aria-hidden="true"
            className={`absolute h-4 w-4 transition-[transform,translate,scale,rotate,opacity] duration-200 ${isVisible ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-90 opacity-0"}`}
          />
        );
      })}
    </>
  );
}
