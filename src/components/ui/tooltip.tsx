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

/* The droplet tail: path 1 fills it with the popover surface, path 2 traces
   the hairline that hands off to the bubble's outline — an svg because a
   rotated square can't carry a border around a curve. Drawn pointing up;
   the Arrow element rotates it per side. */
function ArrowSvg(props: React.ComponentProps<"svg">) {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}>
      <path
        d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.25979 10.0447 2.25979 9.66437 2.60207Z"
        className="fill-popover"
      />
      <path
        d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17425 11.6713 1.85876L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.25979 10.0447 2.25979 9.66437 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
        className="fill-border"
      />
    </svg>
  )
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 10,
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
            // outline, not border: the tail's hairline terminates 1px outside
            // the box, where an outline lives — a border leaves a white seam.
            // drop-shadow, not box-shadow: the filter follows the composite
            // silhouette, so bubble and tail cast one shadow as one object.
            // Origin sits at the tail tip: the bead swells out of the trigger
            // and settles past full size on --ease-pop; exit absorbs back.
            // Left/right bubbles hold the two-line height: only at 44px does
            // the tail's full 20px base sit on straight edge — every thinner
            // floor leaves a visible nick where it crosses the corner arcs.
            "inline-flex w-fit max-w-xs origin-[var(--transform-origin)] items-center gap-1.5 rounded-xl bg-popover px-3 py-1.5 text-xs font-medium text-popover-foreground data-[side=left]:min-h-11 data-[side=right]:min-h-11 drop-shadow-md outline outline-1 outline-border [transition:scale_250ms_var(--ease-pop),opacity_150ms_var(--ease-out)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 data-[ending-style]:duration-100 data-[ending-style]:ease-out motion-safe:data-[starting-style]:scale-[0.5] motion-safe:data-[ending-style]:scale-[0.9] data-[instant]:transition-none has-data-[slot=kbd]:pr-1.5 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-md",
            className
          )}
          {...props}
        >
          {children}
          {/* flex kills the inline-svg baseline gap, which otherwise makes the
              container taller than the svg and sinks the tail into the bubble */}
          <TooltipPrimitive.Arrow className="flex data-[side=bottom]:top-[-8px] data-[side=left]:right-[-13px] data-[side=left]:rotate-90 data-[side=right]:left-[-13px] data-[side=right]:-rotate-90 data-[side=top]:bottom-[-8px] data-[side=top]:rotate-180">
            <ArrowSvg />
          </TooltipPrimitive.Arrow>
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
