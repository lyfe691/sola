import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full px-3 py-2 text-base md:text-sm ring-offset-background placeholder:text-muted-foreground caret-[hsl(var(--ring))] disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-medium transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 placeholder:transition-opacity placeholder:opacity-70 focus-visible:placeholder:opacity-50 selection:bg-ring/20",
  {
    variants: {
      appearance: {
        default:
          "rounded-md border border-input bg-background hover:border-foreground/25",
        soft: "rounded-md border border-foreground/10 bg-muted/50 hover:bg-muted",
        subtle:
          "rounded-md border border-foreground/10 bg-background/80 backdrop-blur-[2px] hover:bg-background/90",
        glass:
          "rounded-md border border-foreground/15 bg-background/60 backdrop-blur-[4px] hover:bg-background/70",
        solid: "rounded-md border border-transparent bg-muted",
        underline:
          "rounded-none border-0 border-b border-input bg-transparent px-0 focus-visible:ring-0 hover:border-foreground/30",
      },
      radius: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
      inputSize: {
        sm: "h-9",
        default: "h-10",
        lg: "h-11",
      },
      invalid: {
        true: "border-destructive focus-visible:ring-destructive",
        false: "",
      },
    },
    defaultVariants: {
      appearance: "default",
      radius: "md",
      inputSize: "default",
      invalid: false,
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, inputSize, appearance, radius, invalid, ...props },
    ref,
  ) => {
    return (
      <input
        type={type}
        className={cn(
          inputVariants({ inputSize, appearance, radius, invalid }),
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input, inputVariants };
