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
  STANDARD_THEMES,
  CUSTOM_THEMES,
  type Theme as ConfiguredTheme,
} from "@/config/themes";
import { useAurora } from "@/lib/aurora-provider";
import { LANGUAGES, type Language } from "@/config/languages";

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
          <CommandItem
            onSelect={() => handleNavigation("/")}
            className="cursor-pointer"
          >
            <span>{t.common.home}</span>
            <CommandShortcut>↵</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => handleNavigation("/about")}
            className="cursor-pointer"
          >
            <span>{t.nav.about}</span>
            <CommandShortcut>↵</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => handleNavigation("/projects")}
            className="cursor-pointer"
          >
            <span>{t.nav.projects}</span>
            <CommandShortcut>↵</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => handleNavigation("/skills")}
            className="cursor-pointer"
          >
            <span>{t.nav.skills}</span>
            <CommandShortcut>↵</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => handleNavigation("/experience")}
            className="cursor-pointer"
          >
            <span>{t.nav.experience}</span>
            <CommandShortcut>↵</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => handleNavigation("/services")}
            className="cursor-pointer"
          >
            <span>{t.nav.services}</span>
            <CommandShortcut>↵</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => handleNavigation("/contact")}
            className="cursor-pointer"
          >
            <span>{t.nav.contact}</span>
            <CommandShortcut>↵</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => handleNavigation("/privacy")}
            className="cursor-pointer"
          >
            <span>{t.footer.privacy}</span>
            <CommandShortcut>↵</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={t.common.command.groups.theme}>
          <div className="flex flex-wrap gap-2 px-2 pb-1">
            {STANDARD_THEMES.map((themeOption) => {
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
            {CUSTOM_THEMES.map((themeOption) => {
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
