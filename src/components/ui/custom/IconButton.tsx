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
    
    // define the dynamic width for the icon background.
    const iconAreaWidth = "max(28%, 2.25rem)";
    // define the visual gap between the text and the icon area.
    const gap = "0.5rem"; // 8px

    // calculate the total padding needed for the label to reserve space.
    const totalPadding = `calc(${iconAreaWidth} + ${gap})`;

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
          "group/icon relative justify-center overflow-hidden",
          className
        )}
        {...props}
      >
        {!hideLabel && (
          <span
            className={cn(
              "block w-full text-center transition-opacity duration-300",
              "group-hover/icon:opacity-0"
            )}
            style={{
              paddingRight: iconPosition === 'right' ? totalPadding : undefined,
              paddingLeft: iconPosition === 'left' ? totalPadding : undefined,
            }}
          >
            {children || label}
          </span>
        )}
        
        <span
          className={cn(
            "absolute inset-y-1 flex items-center justify-center rounded-[calc(var(--radius)-2px)]",
            "transition-all duration-300 ease-out",
            "group-hover/icon:w-[calc(100%-0.5rem)] group-active/icon:scale-95",
            iconPosition === "right" ? "right-1" : "left-1",
            "w-[max(28%,_2.25rem)]",
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