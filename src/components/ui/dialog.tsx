"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

type DialogRootProps = React.ComponentProps<typeof DialogPrimitive.Root>;

type DialogMotionContextValue = {
  open: boolean;
};

const DialogMotionContext =
  React.createContext<DialogMotionContextValue | null>(null);

const useDialogMotionContext = () => {
  const context = React.useContext(DialogMotionContext);
  if (!context) {
    throw new Error("Dialog components must be used within <Dialog>.");
  }
  return context;
};

const Dialog = ({
  children,
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: DialogRootProps) => {
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
    <DialogPrimitive.Root
      {...props}
      open={isControlled ? open : undefined}
      defaultOpen={!isControlled ? defaultOpen : undefined}
      onOpenChange={handleOpenChange}
    >
      <DialogMotionContext.Provider value={{ open: currentOpen }}>
        {children}
      </DialogMotionContext.Provider>
    </DialogPrimitive.Root>
  );
};
Dialog.displayName = "Dialog";

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const overlayTransition = { duration: 0.35, ease: [0.22, 1, 0.36, 1] } as const;
const containerTransition = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1],
} as const;
const panelTransition = { duration: 0.44, ease: [0.22, 1, 0.36, 1] } as const;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  const { open } = useDialogMotionContext();

  return (
    <AnimatePresence>
      {open ? (
        <DialogPrimitive.Overlay forceMount asChild {...props}>
          <motion.div
            ref={ref}
            className={cn("fixed inset-0 z-50 bg-neutral-950/80", className)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={overlayTransition}
          />
        </DialogPrimitive.Overlay>
      ) : null}
    </AnimatePresence>
  );
});
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const { open } = useDialogMotionContext();

  return (
    <DialogPortal forceMount>
      <DialogOverlay />
      <AnimatePresence mode="sync">
        {open ? (
          <motion.div
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={containerTransition}
          >
            <DialogPrimitive.Content forceMount asChild {...props}>
              <motion.div
                ref={ref}
                className={cn(
                  "pointer-events-auto relative grid w-full max-w-lg gap-6 rounded-2xl border border-border/50 bg-background p-6 shadow-[0_24px_80px_-40px_rgba(15,15,20,0.7)] outline-none supports-[backdrop-filter]:bg-background/98 sm:rounded-3xl sm:p-8",
                  className,
                )}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={panelTransition}
              >
                {children}
                <DialogClose asChild>
                  <motion.button
                    type="button"
                    className="absolute right-5 top-5 flex size-12 items-center justify-center text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.88 }}
                  >
                    <X className="h-7 w-7" strokeWidth={1.5} />
                    <span className="sr-only">Close</span>
                  </motion.button>
                </DialogClose>
              </motion.div>
            </DialogPrimitive.Content>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-2",
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-medium leading-tight tracking-tight text-foreground sm:text-xl",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm leading-relaxed text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
