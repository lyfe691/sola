/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
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
import { useCommandMenu } from "@/hooks/use-command-menu";
import { useTheme } from "./theme-provider";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { useIsMobile } from "@/hooks/use-mobile";
import { THEMES, type Theme as ConfiguredTheme } from "@/config/themes";
import { useBackground } from "@/components/backgrounds/background-provider";
import {
  BACKGROUNDS,
  NONE_BACKGROUND,
} from "@/components/backgrounds/registry";
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
  const { active: activeBackground, setActive: setBackground } = useBackground();

  // none + every registered background
  const backgroundOptions = [
    { id: NONE_BACKGROUND, label: t.common.none },
    ...BACKGROUNDS.map((b) => ({ id: b.id, label: b.label })),
  ];

  const handleBackgroundChange = (id: string) => {
    setBackground(id);
    closeCommandMenu();
  };

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
      return t.footer[item.translationKey as keyof typeof t.footer];
    }
    return t.nav[item.translationKey as keyof typeof t.nav];
  };

  const renderThemeItem = (option: (typeof THEMES)[number]) => {
    const Icon = option.icon;
    return (
      <CommandItem
        key={option.value}
        value={option.label}
        data-checked={theme === option.value ? "true" : undefined}
        onSelect={() => handleThemeChange(option.value as ConfiguredTheme)}
      >
        <Icon />
        <span>{option.label}</span>
      </CommandItem>
    );
  };

  // command content shared between mobile and desktop
  const commandContent = (
    <>
      <CommandInput
        placeholder={t.common.command.placeholder}
        className={isMobile ? "text-base" : undefined}
      />
      <CommandList>
        <CommandEmpty>{t.common.command.noResults}</CommandEmpty>

        <CommandGroup heading={t.common.command.groups.navigation}>
          {[...MAIN_NAVIGATION, ...FOOTER_NAVIGATION].map((item) => (
            <CommandItem
              key={item.key}
              value={getNavLabel(item)}
              onSelect={() => handleNavigation(item.path)}
            >
              <span>{getNavLabel(item)}</span>
              <CommandShortcut>↵</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={t.common.command.groups.theme}>
          {THEMES.filter((o) => !o.isCustom).map(renderThemeItem)}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={t.common.menu.customThemes}>
          {THEMES.filter((o) => o.isCustom).map(renderThemeItem)}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={t.common.command.groups.language}>
          {LANGUAGES.map(({ code, label }) => (
            <CommandItem
              key={code}
              value={label}
              data-checked={language === code ? "true" : undefined}
              onSelect={() => handleLanguageChange(code)}
            >
              <span>{label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={t.common.command.groups.background}>
          {backgroundOptions.map((option) => (
            <CommandItem
              key={option.id}
              value={option.label}
              data-checked={
                activeBackground === option.id ? "true" : undefined
              }
              onSelect={() => handleBackgroundChange(option.id)}
            >
              <span>{option.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </>
  );

  // render drawer for mobile, dialog for desktop
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={closeCommandMenu}>
        <DrawerContent className="px-4 pb-4">
          <DrawerHeader className="sr-only">
            <DrawerTitle>{t.common.command.placeholder}</DrawerTitle>
          </DrawerHeader>
          <Command>{commandContent}</Command>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={closeCommandMenu}>
      <Command>{commandContent}</Command>
    </CommandDialog>
  );
}
