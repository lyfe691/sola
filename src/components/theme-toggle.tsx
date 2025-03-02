import { Moon, Sun, Check, Cloud, Sunset, Sprout, Slack } from "lucide-react"
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

  // Organized theme options into standard and custom groups
  const standardThemes = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" }
  ]
  
  const customThemes = [
    { value: "life", label: "Solarpunk", icon: Sprout },
    { value: "cyber", label: "Cyberpunk", icon: Slack },
    { value: "cloud", label: "Cloud", icon: Cloud },
    { value: "sunset", label: "Sunset", icon: Sunset }
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost" 
          size="icon"
          className="w-9 h-9 relative"
        >
          <Sun className={`h-4 w-4 transition-all ${resolvedTheme === "light" ? "rotate-0 scale-100" : "-rotate-90 scale-0"}`} />
          <Moon className={`absolute h-4 w-4 transition-all ${resolvedTheme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"}`} />
          <Sprout className={`absolute h-4 w-4 transition-all ${resolvedTheme === "life" ? "rotate-0 scale-100" : "rotate-90 scale-0"}`} />
          <Slack className={`absolute h-4 w-4 transition-all ${resolvedTheme === "cyber" ? "rotate-0 scale-100" : "rotate-90 scale-0"}`} />
          <Cloud className={`absolute h-4 w-4 transition-all ${resolvedTheme === "cloud" ? "rotate-0 scale-100" : "rotate-90 scale-0"}`} />
          <Sunset className={`absolute h-4 w-4 transition-all ${resolvedTheme === "sunset" ? "rotate-0 scale-100" : "rotate-90 scale-0"}`} /> 
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background min-w-[150px]">
        {/* Standard themes */}
        {standardThemes.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setTheme(option.value as any)}
            className="flex justify-between cursor-pointer"
          >
            {option.label}
            {theme === option.value && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}

        {/* Separator */}
        <DropdownMenuSeparator />

        {/* Custom themes */}
        {customThemes.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setTheme(option.value as any)}
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