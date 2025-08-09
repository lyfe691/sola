import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(({ className, ...props }, ref) => (
  <textarea
    className={cn("flex min-h-[80px] w-full rounded-md border border-input bg-background/60 px-3 py-2 text-base placeholder:text-muted-foreground backdrop-blur-[2px] transition-[box-shadow,background-color,border-color,color] duration-200 ease-out hover:bg-background/70 hover:border-foreground/25 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-foreground/30 focus-visible:shadow-[0_0_0_1px_hsl(var(--ring)/0.55),0_0_0_4px_hsl(var(--ring)/0.05)] focus-visible:backdrop-blur-[3px] caret-[hsl(var(--ring))] placeholder:transition-opacity placeholder:opacity-70 focus-visible:placeholder:opacity-50 selection:bg-ring/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className)}
    ref={ref}
    {...props}
  />
))
Textarea.displayName = "Textarea"

export { Textarea }
