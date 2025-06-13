/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary project and is governed by the terms in LICENSE.
 * Unauthorized use, modification, or distribution is prohibited. All rights reserved.
 * For permissions, contact yanis.sebastian.zuercher@gmail.com
 */

import { Moon, Sun, Check, Cloud, Sunset, Sprout, Slack, Trees } from "lucide-react"
import { useTheme } from "./theme-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { STANDARD_THEMES, CUSTOM_THEMES, THEMES, type Theme } from "@/config/themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light")
  const [mounted, setMounted] = useState(false)

  // Monitor system theme changes
  useEffect(() => {
    setMounted(true)
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    setSystemTheme(mediaQuery.matches ? "dark" : "light")

    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light")
    }

    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  const resolvedTheme = theme === "system" ? systemTheme : theme

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost" 
          size="icon"
          className="w-9 h-9 transition-colors hover:bg-muted"
        >
          {/* Show icon with smooth animation */}
          {theme === "system" ? (
            <>
              <Sun className={`h-4 w-4 transition-all ${resolvedTheme === "light" ? "rotate-0 scale-100" : "-rotate-90 scale-0"}`} />
              <Moon className={`absolute h-4 w-4 transition-all ${resolvedTheme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"}`} />
            </>
          ) : (
            <>
              <Sun className={`h-4 w-4 transition-all ${theme === "light" ? "rotate-0 scale-100" : "-rotate-90 scale-0"}`} />
              <Moon className={`absolute h-4 w-4 transition-all ${theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"}`} />
              {CUSTOM_THEMES.map(t => {
                const IconComponent = t.icon;
                return (
                  <IconComponent
                    key={t.value}
                    className={`absolute h-4 w-4 transition-all ${theme === t.value ? "rotate-0 scale-100" : "rotate-90 scale-0"}`}
                  />
                );
              })}
            </>
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background min-w-[150px]">
        {/* Standard themes */}
        {STANDARD_THEMES.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setTheme(option.value as Theme)}
            className="flex justify-between cursor-pointer"
          >
            {option.label}
            {theme === option.value && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}

        {/* Separator */}
        <DropdownMenuSeparator />

        {/* Custom themes */}
        {CUSTOM_THEMES.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setTheme(option.value as Theme)}
            className="flex justify-between cursor-pointer"
          >
            {option.label}
            {theme === option.value && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 