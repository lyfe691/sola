/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useEffect, useState } from "react";
import {
  ChevronRight,
  Check,
  Palette,
  Sparkles,
  Image as ImageIcon,
  CodeXml,
} from "lucide-react";
import { useTheme } from "./theme-provider";
import { THEMES, type Theme, type ThemeIcon } from "@/config/themes";
import { useBackground } from "@/components/backgrounds/background-provider";
import { buildBackgroundOptions } from "@/components/backgrounds/registry";
import { MenuHint } from "@/components/menu-hint";
import { useCodeView } from "@/components/deploy-diff/code-view-provider";
import { DIFF_TOKENS } from "@/components/deploy-diff/diff-tokens";
import { useIsDarkScheme } from "@/components/deploy-diff/use-scheme";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";

const iconClass = "size-4 shrink-0 text-muted-foreground";

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
}: {
  icon: ThemeIcon;
  label: string;
  accessory?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center">
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
        >
          <ChevronRight
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

/** a selectable leaf row, marked with a check when active */
function TreeLeaf({
  icon: Icon,
  label,
  isSelected,
  onClick,
}: {
  icon?: ThemeIcon;
  label: string;
  isSelected: boolean;
  onClick: (event: React.MouseEvent) => void;
}) {
  return (
    <button
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
      {isSelected && <Check className={iconClass} />}
    </button>
  );
}

type BranchId = "themes" | "custom" | "background";

/**
 * Miniature of what the code view shows — a commit (dot + sha) and its diff,
 * one line removed, one added. Painted with the code view's own DIFF_TOKENS
 * so the preview colors are exactly the real thing's.
 */
function DiffHintArt() {
  const isDark = useIsDarkScheme();

  return (
    <svg
      viewBox="0 0 152 76"
      // block, or the inline baseline gap makes the wrapper taller than the
      // art and its bottom corners escape the wrapper's rounding
      className="block w-full"
      style={DIFF_TOKENS[isDark ? "dark" : "light"]}
      aria-hidden="true"
    >
      {/* panel ground — square-cornered; the wrapper's rounded-lg clips it
          concentric with the bubble (rounded-xl = 1.4 × --radius = 14px,
          minus the 4px inset = 10px = --radius = rounded-lg), so the
          droplet's outline stays the only border in the tooltip */}
      <rect width="152" height="76" className="fill-muted/40" />
      {/* commit dot + sha chip */}
      <circle cx="16" cy="16" r="3.5" className="fill-primary" />
      <rect
        x="26"
        y="12"
        width="34"
        height="8"
        rx="4"
        className="fill-foreground/12"
      />
      {/* context line */}
      <rect
        x="14"
        y="28"
        width="86"
        height="6"
        rx="3"
        className="fill-foreground/10"
      />
      {/* removed line: tinted row, − marker, content bar */}
      <rect
        x="6"
        y="41"
        width="140"
        height="12"
        rx="4"
        className="fill-(--diff-del-fg)/10"
      />
      <rect
        x="12"
        y="45.5"
        width="8"
        height="3"
        rx="1.5"
        className="fill-(--diff-del-fg)"
      />
      <rect
        x="28"
        y="44"
        width="58"
        height="6"
        rx="3"
        className="fill-(--diff-del-fg)/40"
      />
      {/* added line: tinted row, + marker, content bar */}
      <rect
        x="6"
        y="57"
        width="140"
        height="12"
        rx="4"
        className="fill-(--diff-add-fg)/10"
      />
      <rect
        x="12"
        y="61.5"
        width="8"
        height="3"
        rx="1.5"
        className="fill-(--diff-add-fg)"
      />
      <rect
        x="14.5"
        y="59"
        width="3"
        height="8"
        rx="1.5"
        className="fill-(--diff-add-fg)"
      />
      <rect
        x="28"
        y="60"
        width="84"
        height="6"
        rx="3"
        className="fill-(--diff-add-fg)/40"
      />
    </svg>
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

  const renderThemeLeaf = (option: (typeof THEMES)[number]) => (
    <TreeLeaf
      key={option.value}
      icon={option.icon}
      label={option.label}
      isSelected={theme === option.value}
      onClick={selectTheme(option.value)}
    />
  );

  return (
    <div className="min-w-[212px]">
      <TreeBranch
        icon={Palette}
        label={t.common.menu.themes}
        isOpen={isExpanded("themes")}
        onToggle={() => toggleBranch("themes")}
      >
        {THEMES.filter((o) => !o.isCustom).map(renderThemeLeaf)}

        <TreeBranch
          icon={Sparkles}
          label={t.common.menu.customThemes}
          isOpen={isExpanded("custom")}
          onToggle={() => toggleBranch("custom")}
        >
          {THEMES.filter((o) => o.isCustom).map(renderThemeLeaf)}
        </TreeBranch>
      </TreeBranch>

      <TreeBranch
        icon={ImageIcon}
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
          transition play unobstructed. Lingering on the row grows a droplet
          with a miniature of the mode and the one-line explanation. */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            render={
              <label className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground" />
            }
          >
            <CodeXml className={iconClass} aria-hidden="true" />
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
          </TooltipTrigger>
          <TooltipContent
            side="left"
            sideOffset={16}
            className="w-52 flex-col items-stretch gap-1.5 p-1"
          >
            <div className="overflow-hidden rounded-lg">
              <DiffHintArt />
            </div>
            <div className="space-y-0.5 px-2 pt-0.5 pb-1.5 text-left">
              {/* a command name, not copy — every locale keeps "git diff" */}
              <p className="font-mono">git diff</p>
              <p className="font-normal leading-relaxed text-popover-foreground/70">
                {t.common.diff.hint}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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
