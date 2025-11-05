import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { useSilentMotion, type SilentMotionOptions } from "./silent-motion";

const MotionSwitchRoot = motion(SwitchPrimitives.Root);

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
    motion?: SilentMotionOptions;
  }
>(({ className, style, motion: motionOptions, ...props }, ref) => {
  const motionProps = useSilentMotion({ intensity: "subtle", ...motionOptions }, style);

  return (
    <MotionSwitchRoot
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        className,
      )}
      {...motionProps}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        )}
      />
    </MotionSwitchRoot>
  );
});
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
