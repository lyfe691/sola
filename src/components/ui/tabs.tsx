import { createContext, useContext, useId } from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { LayoutGroup, motion, type Transition } from "motion/react"

import { cn } from "@/lib/utils"
import { EASE_OUT } from "@/utils/transitions"

const tabsListVariants = cva(
  "relative isolate inline-flex w-fit items-center rounded-full text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-muted p-1",
        // the track sits a pixel inside the list, so the pill covers its rim
        pill: "before:absolute before:inset-px before:-z-10 before:rounded-full before:bg-muted",
      },
      size: {
        sm: "h-8",
        default: "h-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

// The pill reaches a spacing unit into each neighbour and stays flush at
// either end of the track (tabsIndicatorVariants). An end tab's padding is
// shifted by the same unit so its label stays centred under the pill.
const tabsTriggerVariants = cva(
  "group/tab relative isolate inline-flex h-full items-center justify-center gap-1.5 rounded-full whitespace-nowrap text-muted-foreground outline-none select-none transition-colors duration-200 ease-out hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 data-active:text-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: { default: "", pill: "" },
      size: { sm: "", default: "" },
    },
    compoundVariants: [
      { variant: "default", size: "sm", className: "px-2.5" },
      { variant: "default", size: "default", className: "px-3" },
      {
        variant: "pill",
        size: "sm",
        className:
          "px-3.5 first:pr-2.5 first:pl-4.5 last:pr-4.5 last:pl-2.5 only:px-3.5",
      },
      {
        variant: "pill",
        size: "default",
        className: "px-5 first:pr-4 first:pl-6 last:pr-6 last:pl-4 only:px-5",
      },
    ],
    defaultVariants: { variant: "default", size: "default" },
  }
)

const tabsIndicatorVariants = cva("absolute -z-10 rounded-full", {
  variants: {
    variant: {
      default:
        "inset-0 bg-background shadow-sm dark:border dark:border-input dark:bg-input/30",
      pill: "-inset-x-1 inset-y-0 border-[0.5px] border-border bg-background shadow-sm group-first/tab:-right-2 group-first/tab:left-0 group-last/tab:right-0 group-last/tab:-left-2 group-only/tab:inset-x-0 dark:bg-accent",
    },
  },
  defaultVariants: { variant: "default" },
})

const indicatorTransitions = {
  default: { type: "spring", bounce: 0.25, duration: 0.45 },
  pill: { duration: 0.3, ease: EASE_OUT },
} satisfies Record<string, Transition>

type TabsListOptions = VariantProps<typeof tabsListVariants>

const TabsListContext = createContext<TabsListOptions>({})

// horizontal only: neither variant is styled for a vertical list
function Tabs({
  className,
  ...props
}: Omit<TabsPrimitive.Root.Props, "orientation">) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: TabsPrimitive.List.Props & TabsListOptions) {
  const id = useId()
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant, size }), className)}
      {...props}
    >
      <TabsListContext value={{ variant, size }}>
        <LayoutGroup id={id}>{children}</LayoutGroup>
      </TabsListContext>
    </TabsPrimitive.List>
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  const { variant, size } = useContext(TabsListContext)
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ variant, size }), className)}
      render={({ children, ...tabProps }, { active }) => (
        <button {...tabProps}>
          {active && (
            <motion.span
              layoutId="indicator"
              data-slot="tabs-indicator"
              transition={indicatorTransitions[variant ?? "default"]}
              className={tabsIndicatorVariants({ variant })}
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
