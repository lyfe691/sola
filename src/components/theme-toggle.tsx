/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Check } from "lucide-react";
import { useTheme } from "./theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { THEMES, type Theme } from "@/config/themes";
import { useBackground } from "@/components/backgrounds/background-provider";
import {
  BACKGROUNDS,
  NONE_BACKGROUND,
} from "@/components/backgrounds/registry";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";

export function ThemeToggle({
  open,
  onOpenChange,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { theme, setTheme } = useTheme();
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const { active: activeBackground, setActive: setBackground } = useBackground();
  const { language } = useLanguage();
  const t = translations[language];

  const backgroundOptions = [
    { id: NONE_BACKGROUND, label: t.common.none },
    ...BACKGROUNDS.map((b) => ({ id: b.id, label: b.label })),
  ];

  // monitor system theme changes
  useEffect(() => {
    setMounted(true);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemTheme(mediaQuery.matches ? "dark" : "light");

    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  const resolvedTheme = theme === "system" ? systemTheme : theme;

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 rounded-full transition-colors hover:bg-muted"
          />
        }
      >
        {/* show icon with smooth animation */}
        {THEMES.map((t) => {
            // We only render icons for themes that can actually be visually represented as the "current state"
            // i.e., "system" isn't a visual state itself, it resolves to light or dark.
            if (t.value === "system") return null;

            const IconComponent = t.icon;
            // Determine if this specific theme icon should be shown
            const isVisible =
              theme === "system"
                ? t.value === resolvedTheme
                : theme === t.value;

            return (
              <IconComponent
                key={t.value}
                className={`absolute h-4 w-4 transition-all ${isVisible ? "rotate-0 scale-100" : "rotate-90 scale-0"}`}
              />
            );
          })}

        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t.common.menu.themes}</DropdownMenuLabel>
          {THEMES.map((option) => {
            if (option.isCustom) return null;
            const isSelected = theme === option.value;
            return (
              <DropdownMenuItem
                key={option.value}
                onClick={(e) => {
                  onOpenChange?.(false);
                  requestAnimationFrame(() =>
                    setTheme(option.value as Theme, e),
                  );
                }}
                className="justify-between"
              >
                <span className={isSelected ? "text-muted-foreground" : ""}>
                  {option.label}
                </span>
                {isSelected && (
                  <Check className="h-4 w-4 text-muted-foreground" />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel>{t.common.menu.customThemes}</DropdownMenuLabel>
          {THEMES.map((option) => {
            if (!option.isCustom) return null;
            const isSelected = theme === option.value;
            return (
              <DropdownMenuItem
                key={option.value}
                onClick={(e) => {
                  onOpenChange?.(false);
                  requestAnimationFrame(() =>
                    setTheme(option.value as Theme, e),
                  );
                }}
                className="justify-between"
              >
                <span className={isSelected ? "text-muted-foreground" : ""}>
                  {option.label}
                </span>
                {isSelected && (
                  <Check className="h-4 w-4 text-muted-foreground" />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel>{t.common.menu.background}</DropdownMenuLabel>
          {backgroundOptions.map((option) => {
            const isSelected = activeBackground === option.id;
            return (
              <DropdownMenuItem
                key={option.id}
                closeOnClick={false}
                onClick={() => setBackground(option.id)}
                className="justify-between"
              >
                <span className={isSelected ? "text-muted-foreground" : ""}>
                  {option.label}
                </span>
                {isSelected && (
                  <Check className="h-4 w-4 text-muted-foreground" />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
