import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "@/lib/utils"

function TooltipProvider({
  delay = 0,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      {...props}
    />
  )
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

/* Rich previews (git-diff hint, deploy chip, link screenshots) are cards,
   not labels: they opt back out of the bubble's inversion into the popover
   pairing their diff tokens and artwork were tuned against. */
const tooltipCardClassName =
  "rounded-xl bg-popover text-popover-foreground outline outline-1 outline-border **:data-[slot=kbd]:bg-muted **:data-[slot=kbd]:text-muted-foreground"

function TooltipContent({
  className,
  side = "top",
  sideOffset = 6,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<
    TooltipPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            // the inverted pairing holds full contrast in every theme, so the
            // bubble carries no border — the shadow alone lifts it
            "inline-flex w-fit max-w-xs items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background shadow-md",
            // grows from the trigger edge (base-ui's origin var); exit is a
            // faster plain fade. data-instant kills motion for keyboard opens
            // and warm provider groups.
            "origin-(--transform-origin) transition-[scale,opacity] duration-150 ease-out data-[starting-style]:opacity-0 motion-safe:data-[starting-style]:scale-[0.96] data-[ending-style]:opacity-0 data-[ending-style]:duration-100 data-[instant]:transition-none",
            // keycaps read as dim chips cut from the bubble's own text color,
            // so they survive the inversion in every theme
            "has-data-[slot=kbd]:pr-1.5 **:data-[slot=kbd]:rounded-md **:data-[slot=kbd]:bg-background/15 **:data-[slot=kbd]:text-background/80",
            className
          )}
          {...props}
        >
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  tooltipCardClassName,
}
