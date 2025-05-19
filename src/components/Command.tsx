/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 * 
 * This file is part of the project and is subject to the terms of the project's LICENSE (GNU GPL v3).
 * Please refer to the LICENSE file in the project root for full licensing details.
 * 
 * All rights reserved.
 */

import { useNavigate } from "react-router-dom"
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
  } from "@/components/ui/command"
import { 
  Home, 
  User, 
  Briefcase, 
  Code, 
  GraduationCap, 
  Mail, 
  Settings, 
  Globe, 
  Search,
  Laptop,
} from "lucide-react"
import { useCommandMenu } from "@/hooks/use-command-menu"
import { useTheme } from "./theme-provider"
import { useLanguage } from "@/lib/language-provider"
import { THEMES, STANDARD_THEMES, CUSTOM_THEMES, type Theme as ConfiguredTheme } from "@/config/themes";

// Import the types from their respective files
type Language = "en" | "de" | "ja" | "es" | "cn" | "ru"

export function CommandMenu() {
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage } = useLanguage()
  const { isOpen, closeCommandMenu } = useCommandMenu()

  // Handle navigation
  const handleNavigation = (path: string) => {
    navigate(path)
    closeCommandMenu()
  }

  // Handle theme change
  const handleThemeChange = (newTheme: ConfiguredTheme) => {
    setTheme(newTheme)
    closeCommandMenu()
  }

  // Handle language change
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    closeCommandMenu()
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={closeCommandMenu}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList className="max-h-[60vh] overflow-y-auto">
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => handleNavigation('/')} className="cursor-pointer">
            <Home className="mr-2 h-4 w-4" />
            <span>Home</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigation('/about')} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>About</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigation('/projects')} className="cursor-pointer">
            <Code className="mr-2 h-4 w-4" />
            <span>Projects</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigation('/skills')} className="cursor-pointer">
            <GraduationCap className="mr-2 h-4 w-4" />
            <span>Skills</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigation('/experience')} className="cursor-pointer">
            <Briefcase className="mr-2 h-4 w-4" />
            <span>Experience</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigation('/services')} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Services</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigation('/contact')} className="cursor-pointer">
            <Mail className="mr-2 h-4 w-4" />
            <span>Contact</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Theme">
          {STANDARD_THEMES.map((themeOption) => {
            const IconComponent = themeOption.icon;
            return (
              <CommandItem key={themeOption.value} onSelect={() => handleThemeChange(themeOption.value as ConfiguredTheme)} className="cursor-pointer">
                <IconComponent className="mr-2 h-4 w-4" />
                <span>{themeOption.label}</span>
                {theme === themeOption.value && <CommandShortcut>✓</CommandShortcut>}
              </CommandItem>
            );
          })}
          <CommandSeparator />
          {CUSTOM_THEMES.map((themeOption) => {
            const IconComponent = themeOption.icon;
            return (
              <CommandItem key={themeOption.value} onSelect={() => handleThemeChange(themeOption.value as ConfiguredTheme)} className="cursor-pointer">
                <IconComponent className="mr-2 h-4 w-4" />
                <span>{themeOption.label}</span>
                {theme === themeOption.value && <CommandShortcut>✓</CommandShortcut>}
              </CommandItem>
            );
          })}
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Language">
          <CommandItem onSelect={() => handleLanguageChange('en')} className="cursor-pointer">
            <Globe className="mr-2 h-4 w-4" />
            <span>English</span>
            {language === 'en' && <CommandShortcut>✓</CommandShortcut>}
          </CommandItem>
          <CommandItem onSelect={() => handleLanguageChange('de')} className="cursor-pointer">
            <Globe className="mr-2 h-4 w-4" />
            <span>Deutsch</span>
            {language === 'de' && <CommandShortcut>✓</CommandShortcut>}
          </CommandItem>
          <CommandItem onSelect={() => handleLanguageChange('es')} className="cursor-pointer">
            <Globe className="mr-2 h-4 w-4" />
            <span>Español</span>
            {language === 'es' && <CommandShortcut>✓</CommandShortcut>}
          </CommandItem>
          <CommandItem onSelect={() => handleLanguageChange('ja')} className="cursor-pointer">
            <Globe className="mr-2 h-4 w-4" />
            <span>日本語</span>
            {language === 'ja' && <CommandShortcut>✓</CommandShortcut>}
          </CommandItem>
          <CommandItem onSelect={() => handleLanguageChange('cn')} className="cursor-pointer">
            <Globe className="mr-2 h-4 w-4" />
            <span>中文</span>
            {language === 'cn' && <CommandShortcut>✓</CommandShortcut>}
          </CommandItem>
          <CommandItem onSelect={() => handleLanguageChange('ru')} className="cursor-pointer">
            <Globe className="mr-2 h-4 w-4" />
            <span>Русский</span>
            {language === 'ru' && <CommandShortcut>✓</CommandShortcut>}
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Shortcuts">
          <CommandItem className="cursor-default">
            <Search className="mr-2 h-4 w-4" />
            <span>Search</span>
            <CommandShortcut>⌘K</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
  