import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

type HoverContextValue = {
  setHoveredEl: (el: HTMLElement | null) => void
}

const DropdownHoverContext = React.createContext<HoverContextValue | null>(null)

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => {
  const hoverCtx = React.useContext(DropdownHoverContext)
  return (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      onMouseEnter={(e) => hoverCtx?.setHoveredEl(e.currentTarget as HTMLElement)}
      onFocusCapture={(e) => hoverCtx?.setHoveredEl(e.currentTarget as HTMLElement)}
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus-visible:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto" />
    </DropdownMenuPrimitive.SubTrigger>
  )
})
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => {
  const subContentRef = React.useRef<HTMLDivElement | null>(null)
  const [hoverRect, setHoverRect] = React.useState<{ top: number; height: number; left: number; width: number } | null>(null)
  const [lastRect, setLastRect] = React.useState<{ top: number; height: number; left: number; width: number } | null>(null)

  React.useImperativeHandle(ref, () => subContentRef.current as HTMLDivElement)

  const setHoveredEl = React.useCallback((el: HTMLElement | null) => {
    if (!subContentRef.current) {
      setHoverRect(null)
      return
    }
    if (!el) {
      setHoverRect(null)
      return
    }
    const contentBox = subContentRef.current.getBoundingClientRect()
    const elBox = el.getBoundingClientRect()
    const next = {
      top: Math.round(elBox.top - contentBox.top),
      left: Math.round(elBox.left - contentBox.left),
      height: Math.round(elBox.height),
      width: Math.round(elBox.width),
    }
    setHoverRect(next)
    setLastRect(next)
  }, [])

  return (
    <DropdownHoverContext.Provider value={{ setHoveredEl }}>
      <DropdownMenuPrimitive.SubContent
        ref={subContentRef}
        onMouseLeave={() => setHoverRect(null)}
        className={cn(
          "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
          className
        )}
        {...props}
      >
        <motion.div
          className="pointer-events-none absolute z-0 rounded-sm bg-accent/50 will-change-transform"
          initial={false}
          animate={{
            x: (hoverRect ?? lastRect)?.left ?? 0,
            y: (hoverRect ?? lastRect)?.top ?? 0,
            height: (hoverRect ?? lastRect)?.height ?? 0,
            width: (hoverRect ?? lastRect)?.width ?? 0,
            opacity: hoverRect ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 900, damping: 28, mass: 0.12, restSpeed: 1 }}
          style={{ top: 0, left: 0, position: "absolute" }}
        />
        {props.children}
      </DropdownMenuPrimitive.SubContent>
    </DropdownHoverContext.Provider>
  )
})
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => {
  const contentRef = React.useRef<HTMLDivElement | null>(null)
  const [hoverRect, setHoverRect] = React.useState<{ top: number; height: number; left: number; width: number } | null>(null)
  const [lastRect, setLastRect] = React.useState<{ top: number; height: number; left: number; width: number } | null>(null)

  React.useImperativeHandle(ref, () => contentRef.current as HTMLDivElement)

  const setHoveredEl = React.useCallback((el: HTMLElement | null) => {
    if (!contentRef.current) {
      setHoverRect(null)
      return
    }
    if (!el) {
      setHoverRect(null)
      return
    }
    const contentBox = contentRef.current.getBoundingClientRect()
    const elBox = el.getBoundingClientRect()
    const next = {
      top: Math.round(elBox.top - contentBox.top),
      left: Math.round(elBox.left - contentBox.left),
      height: Math.round(elBox.height),
      width: Math.round(elBox.width),
    }
    setHoverRect(next)
    setLastRect(next)
  }, [])

  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownHoverContext.Provider value={{ setHoveredEl }}>
        <DropdownMenuPrimitive.Content
          ref={contentRef}
          sideOffset={sideOffset}
          onMouseLeave={() => setHoverRect(null)}
          className={cn(
            "relative z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
            className
          )}
          {...props}
        >
          <motion.div
            className="pointer-events-none absolute z-0 rounded-sm bg-accent/50 will-change-transform"
            initial={false}
            animate={{
              x: (hoverRect ?? lastRect)?.left ?? 0,
              y: (hoverRect ?? lastRect)?.top ?? 0,
              height: (hoverRect ?? lastRect)?.height ?? 0,
              width: (hoverRect ?? lastRect)?.width ?? 0,
              opacity: hoverRect ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 900, damping: 28, mass: 0.12, restSpeed: 1 }}
            style={{ top: 0, left: 0, position: "absolute" }}
          />
          {props.children}
        </DropdownMenuPrimitive.Content>
      </DropdownHoverContext.Provider>
    </DropdownMenuPrimitive.Portal>
  )
})
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => {
  const hoverCtx = React.useContext(DropdownHoverContext)
  const disabled = (props as any)?.disabled
  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      onMouseEnter={!disabled ? (e) => hoverCtx?.setHoveredEl(e.currentTarget as HTMLElement) : undefined}
      onFocusCapture={!disabled ? (e) => hoverCtx?.setHoveredEl(e.currentTarget as HTMLElement) : undefined}
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus-visible:bg-accent focus-visible:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  )
})
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => {
  const hoverCtx = React.useContext(DropdownHoverContext)
  const disabled = (props as any)?.disabled
  return (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      onMouseEnter={!disabled ? (e) => hoverCtx?.setHoveredEl(e.currentTarget as HTMLElement) : undefined}
      onFocusCapture={!disabled ? (e) => hoverCtx?.setHoveredEl(e.currentTarget as HTMLElement) : undefined}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus-visible:bg-accent focus-visible:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
})
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => {
  const hoverCtx = React.useContext(DropdownHoverContext)
  const disabled = (props as any)?.disabled
  return (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      onMouseEnter={!disabled ? (e) => hoverCtx?.setHoveredEl(e.currentTarget as HTMLElement) : undefined}
      onFocusCapture={!disabled ? (e) => hoverCtx?.setHoveredEl(e.currentTarget as HTMLElement) : undefined}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus-visible:bg-accent focus-visible:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Circle className="h-2 w-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
})
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
