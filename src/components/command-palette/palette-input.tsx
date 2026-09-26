/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useRef } from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Cancel01Icon, SearchIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

/**
 * The palette's field: ui/command's input, with room for the scope it was
 * opened with. The scope is a chip before the text; clearing it (its ×, or
 * Backspace in an empty field) widens the search to the whole site.
 */
export function PaletteInput({
  value,
  onValueChange,
  placeholder,
  scope,
  clearScopeLabel,
  onClearScope,
  large = false,
}: {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  /** the scope's name, or nothing when the whole site is searched */
  scope?: string;
  clearScopeLabel: string;
  onClearScope: () => void;
  /** 16px text, or iOS zooms into the field */
  large?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const clear = () => {
    onClearScope();
    input.current?.focus();
  };

  return (
    <div data-slot="command-input-wrapper" className="p-1 pb-0">
      <InputGroup className="h-9">
        <CommandPrimitive.Input
          ref={input}
          data-slot="command-input"
          value={value}
          onValueChange={onValueChange}
          placeholder={placeholder}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !value && scope) clear();
          }}
          className={cn(
            "w-full outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
            large ? "text-base" : "text-sm",
          )}
        />
        <InputGroupAddon>
          <HugeiconsIcon
            icon={SearchIcon}
            strokeWidth={2}
            className="size-4 shrink-0 opacity-50"
          />
          {scope && (
            <button
              type="button"
              onClick={clear}
              aria-label={clearScopeLabel}
              className="flex h-6 cursor-pointer items-center gap-1 rounded-full bg-muted-foreground/10 pr-1.5 pl-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted-foreground/20"
            >
              {scope}
              <HugeiconsIcon
                icon={Cancel01Icon}
                strokeWidth={2}
                className="size-3 opacity-60"
              />
            </button>
          )}
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
