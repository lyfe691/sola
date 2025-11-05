import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { useSilentMotion, type SilentMotionOptions } from "./silent-motion";

const MotionCheckboxRoot = motion(CheckboxPrimitive.Root);

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    motion?: SilentMotionOptions;
  }
>(({ className, style, motion: motionOptions, ...props }, ref) => {
  const motionProps = useSilentMotion({ intensity: "subtle", ...motionOptions }, style);

  return (
    <MotionCheckboxRoot
      ref={ref}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className,
      )}
      {...motionProps}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        <Check className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </MotionCheckboxRoot>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
