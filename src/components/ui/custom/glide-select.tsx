/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * A select on base-ui's Select whose highlight is one pill gliding from row
 * to row. The menu pops from the trigger; a press on the trigger can be
 * dragged to a row and released on it to pick it (base-ui's own behaviour).
 */

import { useState, type FocusEvent, type ReactNode } from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { ArrowDown01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useGlidePill } from "@/components/ui/custom/glide-pill";
import { cn } from "@/lib/utils";

export type GlideSelectOption<T extends string> = {
  value: T;
  label: string;
  icon?: ReactNode;
  /** Muted text at the end of the row. */
  tag?: string;
};

type GlideSelectProps<T extends string> = {
  options: readonly GlideSelectOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  /** The trigger's accessible name, and the heading over the options. */
  label: string;
  /** Leads the trigger, before the value. */
  icon?: ReactNode;
  /** Lands on the trigger. */
  className?: string;
};

const isRow = (node: EventTarget | null): node is HTMLElement =>
  node instanceof HTMLElement && node.getAttribute("role") === "option";

export function GlideSelect<T extends string>({
  options,
  value,
  onValueChange,
  label,
  icon,
  className,
}: GlideSelectProps<T>) {
  const glide = useGlidePill();
  // only a value picked from the menu swaps the trigger's label in
  const [picked, setPicked] = useState<T | null>(null);

  // base-ui moves real focus to the highlighted row, so focus is the highlight
  const highlight = ({ target }: FocusEvent) => {
    if (isRow(target)) glide.moveTo(target);
  };
  const unhighlight = ({ relatedTarget }: FocusEvent) => {
    if (!isRow(relatedTarget)) glide.hide();
  };

  return (
    <SelectPrimitive.Root
      value={value}
      onValueChange={(next, { reason }) => {
        if (next === null) return;
        setPicked(reason === "item-press" ? next : null);
        onValueChange(next);
      }}
      // the popup stays mounted between opens, and so does the pill
      onOpenChange={(open) => {
        if (open) glide.hide();
      }}
    >
      <SelectPrimitive.Trigger
        aria-label={label}
        className={cn(
          "flex h-9 w-fit items-center justify-between gap-1.5 rounded-3xl border border-transparent bg-input/50 px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className,
        )}
      >
        {icon}
        <SelectPrimitive.Value className="line-clamp-1 flex flex-1 items-center gap-1.5 text-left">
          {(current: T) => (
            <span
              key={current}
              className={cn(
                current === picked &&
                  "animate-in blur-in-2 fade-in-60 duration-160 ease-out",
              )}
            >
              {options.find((option) => option.value === current)?.label}
            </span>
          )}
        </SelectPrimitive.Value>
        <SelectPrimitive.Icon
          render={
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              strokeWidth={2}
              className="size-4 text-muted-foreground transition-transform duration-200 ease-out data-popup-open:rotate-180 motion-reduce:transition-none"
            />
          }
        />
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner
          alignItemWithTrigger={false}
          sideOffset={6}
          className="isolate z-50"
        >
          <SelectPrimitive.Popup className="max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-3xl bg-popover text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-hidden transition-[opacity,scale] duration-200 ease-out data-ending-style:opacity-0 data-ending-style:duration-130 data-starting-style:opacity-0 motion-safe:data-ending-style:scale-95 motion-safe:data-starting-style:scale-95 dark:ring-foreground/10">
            <SelectPrimitive.List
              onFocus={highlight}
              onBlur={unhighlight}
              data-highlighting={glide.shown || undefined}
              className="relative isolate"
            >
              {glide.pill}
              <SelectPrimitive.Group className="scroll-my-1.5 p-1.5">
                <SelectPrimitive.GroupLabel className="px-3 py-2.5 text-xs text-muted-foreground">
                  {label}
                </SelectPrimitive.GroupLabel>
                {options.map((option) => (
                  <SelectPrimitive.Item
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    className="relative flex w-full cursor-default items-center gap-2.5 rounded-2xl py-2 pr-8 pl-3 text-sm font-medium outline-hidden transition-colors duration-150 ease-out select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:text-accent-foreground aria-selected:not-in-data-highlighting:bg-accent/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                  >
                    <SelectPrimitive.ItemText className="flex min-w-0 flex-1 items-center gap-2 whitespace-nowrap">
                      {option.icon}
                      <span>{option.label}</span>
                    </SelectPrimitive.ItemText>
                    {option.tag && (
                      <span className="text-xs text-muted-foreground">
                        {option.tag}
                      </span>
                    )}
                    <SelectPrimitive.ItemIndicator className="absolute right-2 flex size-4 items-center justify-center">
                      <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
                    </SelectPrimitive.ItemIndicator>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.Group>
            </SelectPrimitive.List>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
