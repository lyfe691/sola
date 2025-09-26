/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { ChevronRight, MoveRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_SIZES = {
  sm: 14,
  default: 16,
  lg: 18,
  xl: 20,
} as const;

const ICON_BG_VARIANTS = {
  default: "bg-primary-foreground/15",
  outline: "bg-foreground/10",
  secondary: "bg-secondary-foreground/15",
  ghost: "bg-foreground/5",
  link: "bg-transparent",
  destructive: "bg-destructive-foreground/15",
} as const;

export interface IconButtonProps extends ButtonProps {
  icon?: React.ReactElement;
  iconSize?: number;
  iconStrokeWidth?: number;
  label?: string;
  hideLabel?: boolean;
  iconPosition?: "left" | "right";
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      size = "default",
      variant = "default",
      label = "Click",
      hideLabel = false,
      icon = <ChevronRight />,
      iconSize,
      iconStrokeWidth = 2,
      iconPosition = "right",
      children,
      ...props
    },
    ref
  ) => {
    const buttonSize = size as keyof typeof ICON_SIZES;
    const finalIconSize = iconSize ?? ICON_SIZES[buttonSize] ?? ICON_SIZES.default;
    const iconBg = ICON_BG_VARIANTS[variant as keyof typeof ICON_BG_VARIANTS] ?? ICON_BG_VARIANTS.default;
    
    const isIconRight = iconPosition === "right";
    const labelContent = children || label;



    return (
      <Button
        ref={ref}
        size={size}
        variant={variant}
        className={cn(
          "group/btn relative overflow-hidden",
          "transition-all duration-300 ease-out",
          className
        )}
        {...props}
      >
        {/* label */}
        {!hideLabel && (
          <span
            className={cn(
              "relative z-10 transition-all duration-300 ease-out text-center",
              "group-hover/btn:opacity-0 group-hover/btn:scale-95"
            )}
            style={{
              [isIconRight ? 'paddingRight' : 'paddingLeft']: 'calc(max(28%, 2.25rem) + 0.25rem)'
            }}
          >
            {labelContent}
          </span>
        )}
        
        {/* icon container */}
        <div
          className={cn(
            "absolute inset-y-1 flex items-center justify-center",
            "transition-all duration-300 ease-out",
            "w-[max(28%,2.25rem)] group-hover/btn:w-[calc(100%-0.5rem)]",
            "group-active/btn:scale-95",
            isIconRight ? "right-1" : "left-1",
            iconBg
          )}
          style={{
            borderRadius: 'inherit'
          }}
          aria-hidden="true"
        >
          <div className="transition-transform duration-300 ease-out group-hover/btn:scale-110">
            {React.cloneElement(icon, {
              size: finalIconSize,
              strokeWidth: iconStrokeWidth,
            })}
          </div>
        </div>
      </Button>
    );
  }
);

IconButton.displayName = "IconButton";