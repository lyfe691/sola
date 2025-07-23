"use client"

import { useTheme } from "@/components/theme-provider"
import { getThemeType } from "@/config/themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme()
  
  // Automatically determine the appropriate theme - handles ALL themes dynamically
  const toasterTheme = theme === "system" ? "system" : getThemeType(theme)

  return (
    <Sonner
      theme={toasterTheme}
      className="toaster group"
      {...props}
    />
  )
}

export { Toaster }
