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
   pairing their diff tokens and artwork were tuned against. inset-ring-0
   drops the bubble's ink hairline — cards already wear an outline. */
const tooltipCardClassName =
  "rounded-xl bg-popover text-popover-foreground inset-ring-0 outline outline-1 outline-border **:data-[slot=kbd]:bg-muted **:data-[slot=kbd]:text-muted-foreground"

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
            // bubble carries no border — the shadow lifts it, and a hairline
            // of its own ink keeps the edge crisp on same-value surfaces
            "inline-flex w-fit max-w-xs items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-pretty text-background shadow-md inset-ring inset-ring-background/10",
            // --slide points back toward the trigger for whichever side the
            // positioner resolved (logical inline-* sides fall back to 0 and
            // keep the pure fade+scale)
            "[--slide:0] data-[side=top]:[--slide:0_4px] data-[side=bottom]:[--slide:0_-4px] data-[side=left]:[--slide:4px_0] data-[side=right]:[--slide:-4px_0]",
            // the bubble surfaces from its trigger: born 4px nearer,
            // compressed at the anchor-edge origin, gliding to rest on the
            // site ease-out. exit consumes it back in, faster — the page
            // transition's implode->reform at micro scale. movement is
            // motion-safe-gated; the fades stay for everyone.
            "origin-(--transform-origin) transition-[translate,scale,opacity] duration-200 ease-out",
            // [translate:...] not translate-(...): the utility would fan the
            // two-component var onto both axes and invalidate the declaration
            "data-[starting-style]:opacity-0 motion-safe:data-[starting-style]:scale-[0.96] motion-safe:data-[starting-style]:[translate:var(--slide)]",
            "data-[ending-style]:opacity-0 data-[ending-style]:duration-100 motion-safe:data-[ending-style]:scale-[0.96] motion-safe:data-[ending-style]:[translate:var(--slide)]",
            // data-instant kills motion for keyboard opens and warm hops
            // between provider siblings — those must swap crisply
            "data-[instant]:transition-none",
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
