import { createContext, useContext, useId } from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { LayoutGroup, motion, type Transition } from "motion/react"

import { cn } from "@/lib/utils"

const transitions = {
  spring: { type: "spring", bounce: 0.25, duration: 0.45 },
  smooth: { type: "spring", bounce: 0, duration: 0.3 },
} satisfies Record<string, Transition>

const tabsListVariants = cva(
  "relative inline-flex w-fit items-center text-muted-foreground data-vertical:flex-col data-vertical:items-stretch",
  {
    variants: {
      variant: {
        default: "rounded-full bg-muted p-1 data-vertical:rounded-2xl",
        rail: "p-1 before:absolute before:inset-x-0 before:inset-y-2 before:rounded-full before:bg-muted data-vertical:before:inset-x-2 data-vertical:before:inset-y-0 data-vertical:before:rounded-2xl",
        line: "gap-4 border-border data-horizontal:border-b data-vertical:gap-1 data-vertical:border-r",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

const tabsTriggerVariants = cva(
  "relative isolate inline-flex items-center justify-center gap-1.5 text-sm font-medium whitespace-nowrap transition-colors outline-none select-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 data-disabled:pointer-events-none data-disabled:opacity-50 data-active:text-foreground data-vertical:justify-start [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "h-7 rounded-full px-3",
        rail: "h-10 rounded-full px-3",
        line: "h-9 rounded-md px-1 data-vertical:h-8 data-vertical:px-2",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

const tabsIndicatorVariants = cva("absolute -z-10", {
  variants: {
    variant: {
      default:
        "inset-0 rounded-full bg-background shadow-sm dark:border dark:border-input dark:bg-input/30",
      rail: "inset-0 rounded-full border border-border bg-background shadow-sm dark:bg-input/30",
      line: "rounded-full bg-foreground",
    },
    orientation: {
      horizontal: "",
      vertical: "",
    },
  },
  compoundVariants: [
    {
      variant: "line",
      orientation: "horizontal",
      className: "inset-x-0 -bottom-px h-0.5",
    },
    {
      variant: "line",
      orientation: "vertical",
      className: "inset-y-0 -right-px w-0.5",
    },
  ],
  defaultVariants: { variant: "default", orientation: "horizontal" },
})

type TabsListOptions = VariantProps<typeof tabsListVariants> & {
  spring?: boolean
}

const TabsListContext = createContext<TabsListOptions>({})

function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn(
        "flex gap-4 data-horizontal:flex-col data-vertical:items-start",
        className
      )}
      {...props}
    />
  )
}

function TabsList({
  className,
  variant = "default",
  spring = true,
  children,
  ...props
}: TabsPrimitive.List.Props & TabsListOptions) {
  const id = useId()
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    >
      <TabsListContext value={{ variant, spring }}>
        <LayoutGroup id={id}>{children}</LayoutGroup>
      </TabsListContext>
    </TabsPrimitive.List>
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  const { variant, spring } = useContext(TabsListContext)
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ variant }), className)}
      render={({ children, ...tabProps }, { active, orientation }) => (
        <button {...tabProps}>
          {active && (
            <motion.span
              layoutId="indicator"
              transition={spring ? transitions.spring : transitions.smooth}
              className={tabsIndicatorVariants({ variant, orientation })}
            />
          )}
          {children}
        </button>
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
