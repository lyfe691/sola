/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import * as React from "react";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PILL_BG = {
  default: "bg-primary-foreground/15",
  outline: "bg-foreground/10",
  secondary: "bg-secondary-foreground/15",
  ghost: "bg-foreground/5",
  link: "bg-transparent",
  destructive: "bg-destructive-foreground/15",
} as const;

export interface IconButtonProps extends React.ComponentProps<typeof Button> {
  icon?: React.ReactNode;
  label?: React.ReactNode;
  hideLabel?: boolean;
  iconPosition?: "left" | "right";
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = "default",
      icon = <ChevronRight />,
      label,
      hideLabel = false,
      iconPosition = "right",
      children,
      ...props
    },
    ref,
  ) => {
    const isRight = iconPosition === "right";
    const pillBg = PILL_BG[variant as keyof typeof PILL_BG] ?? PILL_BG.default;

    return (
      <Button
        ref={ref}
        variant={variant}
        className={cn("group/btn relative overflow-hidden", className)}
        {...props}
      >
        {!hideLabel && (
          <span
            className="relative z-10 text-center transition-all duration-300 ease-out group-hover/btn:scale-95 group-hover/btn:opacity-0"
            style={{
              [isRight ? "paddingRight" : "paddingLeft"]:
                "calc(max(28%, 2.25rem) + 0.25rem)",
            }}
          >
            {children ?? label}
          </span>
        )}

        <span
          aria-hidden
          className={cn(
            "absolute inset-y-1 flex w-[max(28%,2.25rem)] items-center justify-center rounded-[inherit] transition-all duration-300 ease-out group-hover/btn:w-[calc(100%-0.5rem)] group-active/btn:scale-95",
            isRight ? "right-1" : "left-1",
            pillBg,
          )}
        >
          <span className="flex transition-transform duration-300 ease-out group-hover/btn:scale-110">
            {icon}
          </span>
        </span>
      </Button>
    );
  },
);

IconButton.displayName = "IconButton";
