/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */


// IMPORTANT: 
// I do not recommend using the "link" variant here."
// All other variants are fine.
// Why? The "link" variant does not have a background color, 
// which means you'll only see the icon with motion, looks dull.

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";

type IconButtonProps = ButtonProps & {
  icon?: React.ReactElement<Partial<{ size: number; strokeWidth: number }>>;
  iconSize?: number;
  iconStrokeWidth?: number;
  label?: string;
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      size = "default",
      variant = "default",
      label = "Click",
      icon = <MoveRight />,
      iconSize = 16,
      iconStrokeWidth = 2,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        size={size}
        variant={variant}
        className={cn(
          "group relative overflow-hidden transition-all duration-300",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        {...props}
      >
        <span className="transition-opacity duration-300 group-hover:opacity-0 mr-7">
          {label}
        </span>
        <span
          className={cn(
            "absolute inset-y-1 right-1 rounded flex items-center justify-center",
            // here we use contrasting colors based on variant
            variant === "outline" ? "bg-foreground/10" : "bg-primary-foreground/15",
            "group-hover:w-[calc(100%-0.5rem)] w-8",
            "transition-all duration-300 ease-out group-active:scale-95",
            "rounded-[var(--radius)]"
          )}
          aria-hidden="true"
        >
          {React.cloneElement(icon, {
            size: iconSize,
            strokeWidth: iconStrokeWidth,
          })}
        </span>
      </Button>
    );
  }
);

IconButton.displayName = "IconButton";
