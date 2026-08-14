"use client"

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "@/lib/utils"

function TooltipProvider({
  delay = 300,
  closeDelay = 0,
  timeout = 350,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      closeDelay={closeDelay}
      timeout={timeout}
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

function TooltipContent({
  className,
  side = "top",
  sideOffset = 10,
  align = "center",
  alignOffset = 0,
  springy = false,
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<
    TooltipPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  > & { springy?: boolean }) {
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
          data-springy={springy || undefined}
          className={cn(
            "relative z-50 inline-flex origin-(--transform-origin)",
            "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            "data-[side=top]:slide-in-from-bottom-2 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2",
            "data-springy:data-open:zoom-in-90 data-springy:data-open:duration-400 data-springy:data-open:ease-pop"
          )}
          {...props}
        >
          <div
            className={cn(
              "inline-flex w-fit max-w-xs items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium",
              "border border-background/10 bg-foreground text-background shadow-lg",
              "**:data-[slot=kbd]:rounded-md **:data-[slot=kbd]:border **:data-[slot=kbd]:border-background/10 **:data-[slot=kbd]:bg-background/15 **:data-[slot=kbd]:px-1 **:data-[slot=kbd]:font-mono has-data-[slot=kbd]:pr-2",
              className
            )}
          >
            {children}
          </div>
          <TooltipPrimitive.Arrow
            className={cn(
              "z-50 flex size-2.5 items-center justify-center",
              "data-[side=top]:-bottom-1 data-[side=bottom]:-top-1",
              "data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2",
              "data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2",
              "data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-1 data-[side=inline-start]:-translate-y-1/2",
              "data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-1 data-[side=inline-end]:-translate-y-1/2"
            )}
          >
            <span className="size-2.5 rotate-45 rounded-[2px] bg-foreground" />
          </TooltipPrimitive.Arrow>
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
