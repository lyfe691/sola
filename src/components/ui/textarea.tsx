import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground/70 selection:bg-primary/20 selection:text-primary-foreground dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-sm transition-[color,border,box-shadow] duration-200 outline-none focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-[2px] focus-visible:shadow-md aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/30 aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-y",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
