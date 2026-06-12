/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { type ElementType, useEffect, useState } from "react";
import {
  ChevronRight,
  Check,
  Palette,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";
import { useTheme } from "./theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { THEMES, type Theme } from "@/config/themes";
import { useBackground } from "@/components/backgrounds/background-provider";
import { buildBackgroundOptions } from "@/components/backgrounds/registry";
import { BackgroundSectionHint } from "@/components/backgrounds/BackgroundSectionHint";
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
  icon: ElementType;
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
          className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground"
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
  icon?: ElementType;
  label: string;
  isSelected: boolean;
  onClick: (event: React.MouseEvent) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-sm outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <span
        className={cn(
          "flex min-w-0 flex-1 items-center gap-2",
          isSelected && "text-muted-foreground",
        )}
      >
        {Icon && <Icon className={iconClass} />}
        <span className="truncate">{label}</span>
      </span>
      {isSelected && <Check className={iconClass} />}
    </button>
  );
}

type BranchId = "themes" | "custom" | "background";

export function ThemeToggle({
  open,
  onOpenChange,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { theme, setTheme } = useTheme();
  const { active: activeBackground, setActive: setBackground } = useBackground();
  const { language } = useLanguage();
  const t = translations[language];

  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState<Set<BranchId>>(
    () => new Set(["themes"]),
  );

  // mirror the OS preference so the trigger shows the right icon under "system"
  useEffect(() => {
    setMounted(true);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemTheme(mediaQuery.matches ? "dark" : "light");

    const handler = (e: MediaQueryListEvent) =>
      setSystemTheme(e.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // don't render until mounted, so the trigger icon never flashes the wrong state
  if (!mounted) {
    return null;
  }

  const resolvedTheme = theme === "system" ? systemTheme : theme;

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
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-9 h-9 rounded-full transition-colors hover:bg-muted"
                  data-callout="theme"
                />
              }
            />
          }
        >
          {/* crossfade between the active light/dark icon */}
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
                className={`absolute h-4 w-4 transition-all ${isVisible ? "rotate-0 scale-100" : "rotate-90 scale-0"}`}
              />
            );
          })}

          <span className="sr-only">Toggle theme</span>
        </TooltipTrigger>
        <TooltipContent>{t.common.command.groups.theme}</TooltipContent>
      </Tooltip>

      <DropdownMenuContent align="end" className="min-w-[224px] p-1.5">
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
          accessory={
            <BackgroundSectionHint text={t.common.backgroundHints.section} />
          }
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
