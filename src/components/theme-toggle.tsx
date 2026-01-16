/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
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
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  THEMES,
  type Theme,
} from "@/config/themes";
import { useAurora } from "@/lib/aurora-provider";
import { Switch } from "@/components/ui/switch";
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
  const { enabled: auroraEnabled, setEnabled: setAuroraEnabled } = useAurora();
  const { language } = useLanguage();
  const t = translations[language];

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
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-9 h-9 rounded-full transition-colors hover:bg-muted"
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
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[180px]"
      >
        <DropdownMenuLabel>{t.common.menu.themes}</DropdownMenuLabel>
        {/* standard themes */}
        {THEMES.map((option) => {
          if (option.isCustom) return null;
          const isSelected = theme === option.value;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setTheme(option.value as Theme)}
              className="flex justify-between"
            >
              <span className={isSelected ? "text-muted-foreground" : ""}>
                {option.label}
              </span>
              {isSelected && <Check className="h-4 w-4 ml-2 text-muted-foreground" />}
            </DropdownMenuItem>
          );
        })}

        {/* separator */}
        <DropdownMenuSeparator />

        <DropdownMenuLabel className="px-2 pb-1 pt-1 text-xs font-medium uppercase text-muted-foreground/70">{t.common.menu.customThemes}</DropdownMenuLabel>
        {/* custom themes */}
        {THEMES.map((option) => {
          if (!option.isCustom) return null;
          const isSelected = theme === option.value;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setTheme(option.value as Theme)}
              className="flex justify-between"
            >
              <span className={isSelected ? "text-muted-foreground" : ""}>
                {option.label}
              </span>
              {isSelected && <Check className="h-4 w-4 ml-2 text-muted-foreground" />}
            </DropdownMenuItem>
          );
        })}

        {/* effects */}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>{t.common.menu.effects}</DropdownMenuLabel>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setAuroraEnabled(!auroraEnabled);
          }}
          className="flex items-center justify-between py-1.5"
        >
          <div className="flex items-center gap-2">
            <span>Aurora</span>
          </div>
          <Switch
            checked={auroraEnabled}
            onCheckedChange={(v) => setAuroraEnabled(Boolean(v))}
            onClick={(e) => e.stopPropagation()}
            aria-label="toggle aurora"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
