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
  Moon, 
  Sun, 
  Globe, 
  Sprout, 
  Slack, 
  Cloud, 
  Sunset,
  Search,
  Laptop,
  Trees
} from "lucide-react"
import { useCommandMenu } from "@/hooks/use-command-menu"
import { useTheme } from "./theme-provider"
import { useLanguage } from "@/lib/language-provider"

// Import the types from their respective files
type Theme = "dark" | "light" | "system" | "life" | "cyber" | "cloud" | "sunset" | "forest"
type Language = "en" | "de" | "ja" | "es" | "cn"

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
  const handleThemeChange = (newTheme: Theme) => {
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
          <CommandItem onSelect={() => handleThemeChange('light')} className="cursor-pointer">
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
            {theme === 'light' && <CommandShortcut>✓</CommandShortcut>}
          </CommandItem>
          <CommandItem onSelect={() => handleThemeChange('dark')} className="cursor-pointer">
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
            {theme === 'dark' && <CommandShortcut>✓</CommandShortcut>}
          </CommandItem>
          <CommandItem onSelect={() => handleThemeChange('system')} className="cursor-pointer">
            <Laptop className="mr-2 h-4 w-4" />
            <span>System</span>
            {theme === 'system' && <CommandShortcut>✓</CommandShortcut>}
          </CommandItem>
          <CommandSeparator />
          <CommandItem onSelect={() => handleThemeChange('life')} className="cursor-pointer">
            <Sprout className="mr-2 h-4 w-4" />
            <span>Solarpunk</span>
            {theme === 'life' && <CommandShortcut>✓</CommandShortcut>}
          </CommandItem>
          <CommandItem onSelect={() => handleThemeChange('cyber')} className="cursor-pointer">
            <Slack className="mr-2 h-4 w-4" />
            <span>Cyberpunk</span>
            {theme === 'cyber' && <CommandShortcut>✓</CommandShortcut>}
          </CommandItem>
          <CommandItem onSelect={() => handleThemeChange('cloud')} className="cursor-pointer">
            <Cloud className="mr-2 h-4 w-4" />
            <span>Cloud</span>
            {theme === 'cloud' && <CommandShortcut>✓</CommandShortcut>}
          </CommandItem>
          <CommandItem onSelect={() => handleThemeChange('sunset')} className="cursor-pointer">
            <Sunset className="mr-2 h-4 w-4" />
            <span>Sunset</span>
            {theme === 'sunset' && <CommandShortcut>✓</CommandShortcut>}
          </CommandItem>
          <CommandItem onSelect={() => handleThemeChange('forest')} className="cursor-pointer">
            <Trees className="mr-2 h-4 w-4" />
            <span>Forest</span>
            {theme === 'forest' && <CommandShortcut>✓</CommandShortcut>}
          </CommandItem>
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
  