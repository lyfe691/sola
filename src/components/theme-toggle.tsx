/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { MoonStar, Sun, Check } from "lucide-react"
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
import { useAurora } from "@/lib/aurora-provider"
import { useGalaxy } from "@/lib/galaxy-provider"
import { Switch } from "@/components/ui/switch"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light")
  const [mounted, setMounted] = useState(false)
  const { enabled: auroraEnabled, setEnabled: setAuroraEnabled } = useAurora()
  const { enabled: galaxyEnabled, setEnabled: setGalaxyEnabled } = useGalaxy()

  // monitor system theme changes
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

  // don't render anything until mounted to prevent hydration mismatch
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
          {/* show icon with smooth animation */}
          {theme === "system" ? (
            <>
              <Sun className={`h-4 w-4 transition-all ${resolvedTheme === "light" ? "rotate-0 scale-100" : "-rotate-90 scale-0"}`} />
              <MoonStar className={`absolute h-4 w-4 transition-all ${resolvedTheme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"}`} />
            </>
          ) : (
            <>
              <Sun className={`h-4 w-4 transition-all ${theme === "light" ? "rotate-0 scale-100" : "-rotate-90 scale-0"}`} />
              <MoonStar className={`absolute h-4 w-4 transition-all ${theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"}`} />
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
      <DropdownMenuContent align="end" className="bg-background/35 backdrop-blur-sm min-w-[180px]">
        {/* standard themes */}
        {STANDARD_THEMES.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setTheme(option.value as Theme)}
            className="flex justify-between"
          >
            {option.label}
            {theme === option.value && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}

        {/* separator */}
        <DropdownMenuSeparator />

        {/* custom themes */}
        {CUSTOM_THEMES.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setTheme(option.value as Theme)}
            className="flex justify-between"
          >
            {option.label}
            {theme === option.value && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}

        {/* effects */}
        <DropdownMenuSeparator />
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
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setGalaxyEnabled(!galaxyEnabled);
          }}
          className="flex items-center justify-between py-1.5"
        >
          <div className="flex items-center gap-2">
            <span>Galaxy</span>
          </div>
          <Switch
            checked={galaxyEnabled}
            onCheckedChange={(v) => setGalaxyEnabled(Boolean(v))}
            onClick={(e) => e.stopPropagation()}
            aria-label="toggle galaxy"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
