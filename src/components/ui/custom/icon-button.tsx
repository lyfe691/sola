/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

const PILL_BG = {
  default: "bg-primary-foreground/15",
  outline: "bg-foreground/10",
  secondary: "bg-secondary-foreground/15",
  ghost: "bg-foreground/5",
  link: "bg-transparent",
  destructive: "bg-destructive-foreground/15",
} as const;

/**
 * The pill's resting width and the room the label leaves for it. Only a
 * button with a definite width can size the pill by percentage: in a
 * content-sized button the percentage is cyclic (it resolves to 0 while the
 * button is measured, then to 28% of the result), so the label reserved
 * 2.5rem while the pill grew past it and long labels ran underneath.
 */
const PILL = {
  stretched: {
    width: "w-[max(28%,2.25rem)]",
    reserve: "calc(max(28%, 2.25rem) + 0.25rem)",
  },
  compact: {
    width: "w-9",
    reserve: "2.5rem",
  },
} as const;

export interface IconButtonProps extends React.ComponentProps<typeof Button> {
  icon?: React.ReactNode;
  label?: React.ReactNode;
  hideLabel?: boolean;
  iconPosition?: "left" | "right";
  /** Stretch to the container; the pill widens to 28% of the button. */
  fullWidth?: boolean;
}

export function IconButton({
  className,
  variant = "default",
  icon = <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />,
  label,
  hideLabel = false,
  iconPosition = "right",
  fullWidth = false,
  children,
  ...props
}: IconButtonProps) {
  const isRight = iconPosition === "right";
  const pillBg = PILL_BG[variant as keyof typeof PILL_BG] ?? PILL_BG.default;
  const pill = fullWidth ? PILL.stretched : PILL.compact;

  return (
    <Button
      variant={variant}
      className={cn(
        "group/btn relative overflow-hidden",
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {!hideLabel && (
        <span
          className="relative z-10 text-center transition-[transform,translate,scale,rotate,opacity] duration-300 ease-out can-hover:group-hover/btn:scale-95 can-hover:group-hover/btn:opacity-0"
          style={{ [isRight ? "paddingRight" : "paddingLeft"]: pill.reserve }}
        >
          {children ?? label}
        </span>
      )}

      <span
        aria-hidden
        className={cn(
          "absolute inset-y-1 flex items-center justify-center rounded-[inherit] transition-[width,background-color] duration-300 ease-out can-hover:group-hover/btn:w-[calc(100%-0.5rem)]",
          pill.width,
          isRight ? "right-1" : "left-1",
          pillBg,
        )}
      >
        <span className="flex transition-transform duration-300 ease-out can-hover:group-hover/btn:scale-110">
          {icon}
        </span>
      </span>
    </Button>
  );
}
