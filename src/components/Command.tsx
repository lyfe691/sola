/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useNavigate } from "react-router-dom";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Sparkles } from "lucide-react";
import { useCommandMenu } from "@/hooks/use-command-menu";
import { useTheme } from "./theme-provider";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  THEMES,
  type Theme as ConfiguredTheme,
} from "@/config/themes";
import { useAurora } from "@/lib/aurora-provider";
import { LANGUAGES, type Language } from "@/config/languages";
import {
  MAIN_NAVIGATION,
  FOOTER_NAVIGATION,
  type NavigationItem,
} from "@/config/navigation";

export function CommandMenu() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const { isOpen, closeCommandMenu } = useCommandMenu();
  const isMobile = useIsMobile();
  const { enabled: auroraEnabled, toggle: toggleAurora } = useAurora();

  // handle navigation
  const handleNavigation = (path: string) => {
    navigate(path);
    closeCommandMenu();
  };

  // handle theme change
  const handleThemeChange = (newTheme: ConfiguredTheme) => {
    setTheme(newTheme);
    closeCommandMenu();
  };

  // handle language change
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    closeCommandMenu();
  };

  // helper to get translated label
  const getNavLabel = (item: NavigationItem) => {
    if (item.translationKey === "home") return t.common.home;
    if (item.isFooter) {
      // @ts-ignore - we know privacy exists in footer
      return t.footer[item.translationKey];
    }
    // @ts-ignore - dynamic key access
    return t.nav[item.translationKey];
  };

  // command content that's shared between both mobile and desktop versions
  const commandContent = (
    <>
      <CommandInput
        placeholder={t.common.command.placeholder}
        className={isMobile ? "text-base" : undefined}
      />
      <CommandList className="max-h-[60vh] overflow-y-auto">
        <CommandEmpty>{t.common.command.noResults}</CommandEmpty>

        <CommandGroup heading={t.common.command.groups.navigation}>
          {[...MAIN_NAVIGATION, ...FOOTER_NAVIGATION].map((item) => (
            <CommandItem
              key={item.key}
              onSelect={() => handleNavigation(item.path)}
              className="cursor-pointer"
            >
              <span>{getNavLabel(item)}</span>
              <CommandShortcut>↵</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={t.common.command.groups.theme}>
          <div className="flex flex-wrap gap-2 px-2 pb-1">
            {THEMES.map((themeOption) => {
              if (themeOption.isCustom) return null; // Custom themes handled in next group
              const IconComponent = themeOption.icon;
              const isActive = theme === themeOption.value;
              return (
                <CommandItem
                  key={themeOption.value}
                  onSelect={() =>
                    handleThemeChange(themeOption.value as ConfiguredTheme)
                  }
                  className={`cursor-pointer w-auto inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${isActive ? "bg-accent text-accent-foreground" : ""}`}
                >
                  <IconComponent className="h-3.5 w-3.5" />
                  <span>{themeOption.label}</span>
                </CommandItem>
              );
            })}
          </div>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={t.common.menu.customThemes}>
          <div className="flex flex-wrap gap-2 px-2 pb-1">
            {THEMES.map((themeOption) => {
              if (!themeOption.isCustom) return null;
              const IconComponent = themeOption.icon;
              const isActive = theme === themeOption.value;
              return (
                <CommandItem
                  key={themeOption.value}
                  onSelect={() =>
                    handleThemeChange(themeOption.value as ConfiguredTheme)
                  }
                  className={`cursor-pointer w-auto inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${isActive ? "bg-accent text-accent-foreground" : ""}`}
                >
                  <IconComponent className="h-3.5 w-3.5" />
                  <span>{themeOption.label}</span>
                </CommandItem>
              );
            })}
          </div>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={t.common.command.groups.language}>
          <div className="flex flex-wrap gap-2 px-2 pb-2">
            {LANGUAGES.map(({ code, label }) => (
              <CommandItem
                key={code}
                onSelect={() => handleLanguageChange(code)}
                className={`cursor-pointer w-auto inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${language === code ? "bg-accent text-accent-foreground" : ""}`}
              >
                <span>{label}</span>
              </CommandItem>
            ))}
          </div>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={t.common.command.groups.shortcuts}>
          <CommandItem
            onSelect={() => toggleAurora()}
            className="cursor-pointer"
          >
            <span>{t.common.command.shortcuts.aurora}</span>
            <CommandShortcut>
              {auroraEnabled ? t.common.on : t.common.off}
            </CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </>
  );

  // render drawer for mobile, dialog for desktop
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={closeCommandMenu}>
        <DrawerContent className="px-4 pb-4">
          <Command>{commandContent}</Command>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={closeCommandMenu}>
      {commandContent}
    </CommandDialog>
  );
}
