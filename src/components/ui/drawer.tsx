"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "@/lib/utils";

type DrawerRootProps = React.ComponentProps<typeof DrawerPrimitive.Root>;

type DrawerMotionContextValue = {
  open: boolean;
};

const DrawerMotionContext =
  React.createContext<DrawerMotionContextValue | null>(null);

const useDrawerMotionContext = () => {
  const context = React.useContext(DrawerMotionContext);
  if (!context) {
    throw new Error("Drawer components must be used within <Drawer>.");
  }
  return context;
};

const overlayTransition = { duration: 0.35, ease: [0.22, 1, 0.36, 1] } as const;
const containerTransition = {
  duration: 0.42,
  ease: [0.22, 1, 0.36, 1],
} as const;
const panelTransition = {
  type: "spring" as const,
  stiffness: 280,
  damping: 30,
  mass: 0.86,
};

const Drawer = ({
  children,
  open,
  defaultOpen,
  onOpenChange,
  shouldScaleBackground = true,
  ...props
}: DrawerRootProps) => {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false);

  React.useEffect(() => {
    if (isControlled && open !== undefined) {
      setInternalOpen(open);
    }
  }, [isControlled, open]);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  const currentOpen = isControlled ? (open ?? false) : internalOpen;

  return (
    <DrawerPrimitive.Root
      {...props}
      shouldScaleBackground={shouldScaleBackground}
      open={isControlled ? open : undefined}
      defaultOpen={!isControlled ? defaultOpen : undefined}
      onOpenChange={handleOpenChange}
    >
      <DrawerMotionContext.Provider value={{ open: currentOpen }}>
        {children}
      </DrawerMotionContext.Provider>
    </DrawerPrimitive.Root>
  );
};
Drawer.displayName = "Drawer";

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  const { open } = useDrawerMotionContext();

  return (
    <AnimatePresence>
      {open ? (
        <DrawerPrimitive.Overlay forceMount asChild {...props}>
          <motion.div
            ref={ref}
            className={cn("fixed inset-0 z-50 bg-neutral-950/60", className)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={overlayTransition}
          />
        </DrawerPrimitive.Overlay>
      ) : null}
    </AnimatePresence>
  );
});
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const { open } = useDrawerMotionContext();

  return (
    <DrawerPortal forceMount>
      <DrawerOverlay />
      <AnimatePresence mode="sync">
        {open ? (
          <DrawerPrimitive.Content forceMount asChild {...props}>
            <motion.div
              ref={ref}
              className="fixed inset-x-0 bottom-0 z-50 flex w-full justify-center px-4 pb-6 sm:px-6 sm:pb-10"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 22, scale: 0.98 }}
              transition={containerTransition}
            >
              <motion.div
                className={cn(
                  "relative flex w-full max-w-xl flex-col gap-4 rounded-[26px] border border-border/50 bg-background p-6 shadow-[0_-38px_120px_-52px_rgba(12,12,18,0.9)] outline-none supports-[backdrop-filter]:bg-background/92 sm:gap-6 sm:p-8",
                  className,
                )}
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 16, opacity: 0 }}
                transition={panelTransition}
              >
                <div className="mx-auto mb-1 h-1.5 w-16 rounded-full bg-foreground/15" />
                {children}
              </motion.div>
            </motion.div>
          </DrawerPrimitive.Content>
        ) : null}
      </AnimatePresence>
    </DrawerPortal>
  );
});
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props}
  />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
