/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useNavigate } from "react-router";
import { SearchX } from "lucide-react";
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
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { useCommandMenu } from "@/hooks/use-command-menu";
import { useCodeView } from "@/components/deploy-diff/code-view-provider";
import { useTheme } from "./theme-provider";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { useIsMobile } from "@/hooks/use-mobile";
import { THEMES, type Theme as ConfiguredTheme } from "@/config/themes";
import { useBackground } from "@/components/backgrounds/background-provider";
import { buildBackgroundOptions } from "@/components/backgrounds/registry";
import { MenuHint } from "@/components/menu-hint";
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
  const { active: codeView, setActive: setCodeView } = useCodeView();
  const isMobile = useIsMobile();
  const { active: activeBackground, setActive: setBackground } =
    useBackground();

  const backgroundOptions = buildBackgroundOptions(t.common.none);
  const backgroundHint = t.common.backgroundHints.section;

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
        <Icon aria-hidden="true" />
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
      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-5 bg-gradient-to-b from-popover to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-5 bg-gradient-to-t from-popover to-transparent" />
        <CommandList>
          <CommandEmpty className="py-0">
            <Empty className="p-8">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <SearchX />
                </EmptyMedia>
                <EmptyTitle>{t.common.command.noResults}</EmptyTitle>
              </EmptyHeader>
            </Empty>
          </CommandEmpty>

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
            {/* the diff mode rides with navigation — flipping it swaps the
                page like a route does. Label follows the mode's state; the
                chip names its global key. */}
            <CommandItem
              value={codeView ? t.common.diff.exit : t.common.diff.showDiff}
              onSelect={() => {
                closeCommandMenu();
                setCodeView(!codeView);
              }}
            >
              <span>{codeView ? t.common.diff.exit : t.common.diff.showDiff}</span>
              <CommandShortcut>D</CommandShortcut>
            </CommandItem>
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

          <CommandGroup
            heading={
              <span className="inline-flex items-center gap-1.5">
                <span>{t.common.command.groups.background}</span>
                <MenuHint text={backgroundHint} />
              </span>
            }
          >
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
      </div>
    </>
  );

  const commandFooter = (
    <div className="-mx-1 -mb-1 mt-1 flex items-center gap-4 border-t border-border/50 px-4 py-2.5 text-xs text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <KbdGroup>
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
        </KbdGroup>
        <span>{t.common.command.footer.navigate}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Kbd>↵</Kbd>
        <span>{t.common.command.footer.select}</span>
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        <Kbd>esc</Kbd>
        <span>{t.common.command.footer.close}</span>
      </div>
    </div>
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
      <Command>
        {commandContent}
        {commandFooter}
      </Command>
    </CommandDialog>
  );
}
