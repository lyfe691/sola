/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";

const iconSizes = {
  sm: 14,
  default: 16,
  lg: 18,
  xl: 20,
} as const;

const iconContainerSizes = {
  sm: "w-6 h-[calc(100%-0.5rem)]",
  default: "w-7 h-[calc(100%-0.5rem)]", 
  lg: "w-8 h-[calc(100%-0.5rem)]",
  xl: "w-9 h-[calc(100%-0.5rem)]",
} as const;

const labelMargins = {
  sm: "mr-5",
  default: "mr-6",
  lg: "mr-7", 
  xl: "mr-8",
} as const;

const labelMarginsLeft = {
  sm: "ml-5",
  default: "ml-6",
  lg: "ml-7", 
  xl: "ml-8",
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
      icon = <MoveRight />,
      iconSize,
      iconStrokeWidth = 2,
      iconPosition = "right",
      children,
      ...props
    },
    ref
  ) => {
    const buttonSize = (size as keyof typeof iconSizes) || "default";
    const finalIconSize = iconSize ?? iconSizes[buttonSize];
    
    // get background color based on variant
    const getIconBg = () => {
      switch (variant) {
        case "outline":
          return "bg-foreground/10";
        case "secondary": 
          return "bg-secondary-foreground/15";
        case "ghost":
          return "bg-foreground/5";
        case "link":
          return "bg-transparent";
        case "destructive":
          return "bg-destructive-foreground/15";
        default:
          return "bg-primary-foreground/15";
      }
    };

    return (
      <Button
        ref={ref}
        size={size}
        variant={variant}
        className={cn(
          // only add what we need - let shadcn button handle the rest
          "group/icon relative overflow-hidden",
          className
        )}
        {...props}
      >
        {!hideLabel && (
          <span className={cn(
            "transition-opacity duration-300 group-hover/icon:opacity-0",
            iconPosition === "right" ? labelMargins[buttonSize] : labelMarginsLeft[buttonSize]
          )}>
            {children || label}
          </span>
        )}
        
        <span
          className={cn(
            "absolute inset-y-1 rounded-[calc(var(--radius)-2px)]",
            "flex items-center justify-center transition-all duration-300 ease-out",
            "group-hover/icon:w-[calc(100%-0.5rem)] group-active/icon:scale-95",
            iconContainerSizes[buttonSize],
            iconPosition === "right" ? "right-1" : "left-1",
            getIconBg()
          )}
          aria-hidden="true"
        >
          {React.cloneElement(icon, {
            size: finalIconSize,
            strokeWidth: iconStrokeWidth,
          })}
        </span>
      </Button>
    );
  }
);

IconButton.displayName = "IconButton";