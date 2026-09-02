/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * A pill of mutually exclusive options with one raised segment that slides
 * to the selection. Radio-group semantics: arrow keys move the selection,
 * only the selected segment sits in the tab order.
 */

import { useId, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/utils/transitions";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string> {
  value: T;
  onValueChange: (value: T) => void;
  options: readonly SegmentedOption<T>[];
  "aria-label": string;
  className?: string;
}

export function SegmentedControl<T extends string>({
  value,
  onValueChange,
  options,
  className,
  "aria-label": ariaLabel,
}: SegmentedControlProps<T>) {
  const layoutId = useId();

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;
    if (!step) return;
    event.preventDefault();
    const index = options.findIndex((option) => option.value === value);
    const next = options[(index + step + options.length) % options.length];
    onValueChange(next.value);
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className={cn(
        "inline-flex h-9 items-center rounded-full bg-input/50 p-1",
        className,
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onValueChange(option.value)}
            className={cn(
              "relative h-full rounded-full px-4 text-sm font-medium outline-none transition-colors duration-300 ease-out focus-visible:ring-3 focus-visible:ring-ring/30",
              active
                ? "text-foreground"
                : "text-foreground/60 hover:text-foreground/80",
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-background shadow-xs ring-1 ring-foreground/5"
                transition={{ layout: { duration: 0.35, ease: EASE_OUT } }}
              />
            )}
            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
