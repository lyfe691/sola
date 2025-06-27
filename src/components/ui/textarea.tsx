import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground/70 selection:bg-primary/20 selection:text-primary-foreground dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-sm transition-[color,border-color,box-shadow] duration-300 ease-out outline-none hover:border-ring/40 hover:bg-accent/10 focus-visible:border-ring focus-visible:ring-[0.2rem] focus-visible:ring-ring/20 focus-visible:ring-offset-0 focus-visible:shadow-lg focus-visible:shadow-ring/10 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/30 aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-input disabled:hover:bg-transparent md:text-sm resize-y",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }