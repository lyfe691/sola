import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn("flex h-10 w-full rounded-md border border-input bg-background/60 px-3 py-2 text-base placeholder:text-muted-foreground backdrop-blur-[2px] transition-[box-shadow,background-color,border-color,color] duration-200 ease-out hover:bg-background/70 hover:border-foreground/25 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-foreground/30 focus-visible:shadow-[0_0_0_1px_hsl(var(--ring)/0.55),0_0_0_4px_hsl(var(--ring)/0.05)] focus-visible:backdrop-blur-[3px] caret-[hsl(var(--ring))] placeholder:transition-opacity placeholder:opacity-70 focus-visible:placeholder:opacity-50 selection:bg-ring/20 disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground md:text-sm", className)}
    ref={ref}
    {...props}
  />
))
Input.displayName = "Input"

export { Input }
