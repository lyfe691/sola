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
import { cva, type VariantProps } from "class-variance-authority";

const iconButtonVariants = cva(
  "group/iconbtn relative overflow-hidden transition-all duration-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      iconPosition: {
        right: "",
        left: "",
      },
      animation: {
        slide: "",
        fade: "",
        none: "",
      },
    },
    defaultVariants: {
      iconPosition: "right",
      animation: "slide",
    },
  }
);

const iconContainerVariants = cva(
  "absolute flex items-center justify-center transition-all duration-300 ease-out group-active/iconbtn:scale-95 rounded-[var(--radius)]",
  {
    variants: {
      size: {
        sm: "w-7 h-[calc(100%-0.5rem)]",
        default: "w-8 h-[calc(100%-0.5rem)]", 
        lg: "w-10 h-[calc(100%-0.5rem)]",
        xl: "w-12 h-[calc(100%-0.5rem)]",
      },
      iconPosition: {
        right: "inset-y-1 right-1",
        left: "inset-y-1 left-1",
      },
      variant: {
        default: "bg-primary-foreground/15",
        destructive: "bg-destructive-foreground/15",
        outline: "bg-foreground/10",
        secondary: "bg-secondary-foreground/15",
        ghost: "bg-foreground/5",
        link: "bg-transparent",
      },
      animation: {
        slide: "",
        fade: "",
        none: "",
      },
    },
    compoundVariants: [
      // Right positioned sliding animations
      {
        iconPosition: "right",
        animation: "slide",
        size: "sm",
        class: "group-hover/iconbtn:w-[calc(100%-0.5rem)]",
      },
      {
        iconPosition: "right", 
        animation: "slide",
        size: "default",
        class: "group-hover/iconbtn:w-[calc(100%-0.5rem)]",
      },
      {
        iconPosition: "right",
        animation: "slide", 
        size: "lg",
        class: "group-hover/iconbtn:w-[calc(100%-0.5rem)]",
      },
      {
        iconPosition: "right",
        animation: "slide",
        size: "xl", 
        class: "group-hover/iconbtn:w-[calc(100%-0.5rem)]",
      },
      // Left positioned sliding animations
      {
        iconPosition: "left",
        animation: "slide",
        size: "sm",
        class: "group-hover/iconbtn:w-[calc(100%-0.5rem)]",
      },
      {
        iconPosition: "left",
        animation: "slide",
        size: "default",
        class: "group-hover/iconbtn:w-[calc(100%-0.5rem)]",
      },
      {
        iconPosition: "left",
        animation: "slide",
        size: "lg",
        class: "group-hover/iconbtn:w-[calc(100%-0.5rem)]",
      },
      {
        iconPosition: "left",
        animation: "slide",
        size: "xl",
        class: "group-hover/iconbtn:w-[calc(100%-0.5rem)]",
      },
    ],
    defaultVariants: {
      size: "default",
      iconPosition: "right",
      variant: "default",
      animation: "slide",
    },
  }
);

const labelVariants = cva("transition-all duration-300", {
  variants: {
    iconPosition: {
      right: "",
      left: "",
    },
    animation: {
      slide: "group-hover/iconbtn:opacity-0",
      fade: "group-hover/iconbtn:opacity-50", 
      none: "",
    },
    size: {
      sm: "",
      default: "",
      lg: "",
      xl: "",
    },
  },
  compoundVariants: [
    // Right positioned labels
    {
      iconPosition: "right",
      size: "sm",
      class: "mr-6",
    },
    {
      iconPosition: "right", 
      size: "default",
      class: "mr-7",
    },
    {
      iconPosition: "right",
      size: "lg", 
      class: "mr-9",
    },
    {
      iconPosition: "right",
      size: "xl",
      class: "mr-11", 
    },
    // Left positioned labels
    {
      iconPosition: "left",
      size: "sm",
      class: "ml-6",
    },
    {
      iconPosition: "left",
      size: "default", 
      class: "ml-7",
    },
    {
      iconPosition: "left",
      size: "lg",
      class: "ml-9", 
    },
    {
      iconPosition: "left",
      size: "xl",
      class: "ml-11",
    },
  ],
  defaultVariants: {
    iconPosition: "right",
    animation: "slide",
    size: "default",
  },
});

const iconSizeMap = {
  sm: 14,
  default: 16,
  lg: 20,
  xl: 24,
} as const;

const iconStrokeMap = {
  sm: 2,
  default: 2,
  lg: 1.5,
  xl: 1.5,
} as const;

export interface IconButtonProps
  extends ButtonProps,
    VariantProps<typeof iconButtonVariants> {
  icon?: React.ReactElement;
  iconSize?: number;
  iconStrokeWidth?: number;
  label?: string;
  hideLabel?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      size = "default",
      variant = "default",
      iconPosition = "right",
      animation = "slide",
      label = "Click",
      hideLabel = false,
      icon = <MoveRight />,
      iconSize,
      iconStrokeWidth,
      children,
      ...props
    },
    ref
  ) => {
    const finalIconSize = iconSize ?? iconSizeMap[size as keyof typeof iconSizeMap] ?? 16;
    const finalIconStrokeWidth = iconStrokeWidth ?? iconStrokeMap[size as keyof typeof iconStrokeMap] ?? 2;

    return (
      <Button
        ref={ref}
        size={size}
        variant={variant}
        className={cn(iconButtonVariants({ iconPosition, animation }), className)}
        {...props}
      >
        {!hideLabel && (
          <span
            className={labelVariants({
              iconPosition,
              animation,
              size: size as keyof typeof iconSizeMap,
            })}
          >
            {children || label}
          </span>
        )}
        <span
          className={iconContainerVariants({
            size: size as keyof typeof iconSizeMap,
            iconPosition,
            variant,
            animation,
          })}
          aria-hidden="true"
        >
          {React.cloneElement(icon, {
            size: finalIconSize,
            strokeWidth: finalIconStrokeWidth,
            className: cn("transition-transform duration-300", icon.props?.className),
          })}
        </span>
      </Button>
    );
  }
);

IconButton.displayName = "IconButton";