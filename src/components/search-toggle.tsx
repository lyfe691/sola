/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { barButton } from "./bar-button";
import { Button } from "./ui/button";
import { Kbd, KbdGroup } from "./ui/kbd";
import {
  SEARCH_KEYS,
  loadCommandMenu,
  useCommandMenu,
} from "@/hooks/use-command-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "@/lib/language-provider";
import { cn } from "@/lib/utils";
import "./search-field.css";

/** The palette's shortcut, one key cap for each key. */
export function SearchKeys() {
  return (
    <KbdGroup>
      {SEARCH_KEYS.map((key) => (
        <Kbd key={key}>{key}</Kbd>
      ))}
    </KbdGroup>
  );
}

/** A field-shaped trigger for the command palette in the floating bar. */
export function SearchField({ className }: { className?: string }) {
  const toggleCommandMenu = useCommandMenu((state) => state.toggleCommandMenu);
  const t = useTranslation();

  return (
    <Button
      variant="glass"
      size="lg"
      data-nav-search=""
      aria-label={t.common.search}
      aria-haspopup="dialog"
      onClick={toggleCommandMenu}
      onPointerEnter={() => void loadCommandMenu()}
      onFocus={() => void loadCommandMenu()}
      className={cn("justify-start", className)}
    >
      <MagnifyingGlassIcon
        aria-hidden="true"
        data-icon="inline-start"
        className="text-muted-foreground"
      />
      <span className="min-w-0 flex-1 truncate text-left text-muted-foreground">
        {t.common.search}
      </span>
      <SearchKeys />
    </Button>
  );
}

export function SearchToggle({ floating }: { floating?: boolean }) {
  const toggleCommandMenu = useCommandMenu((state) => state.toggleCommandMenu);
  const t = useTranslation();

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            {...barButton(floating)}
            onClick={toggleCommandMenu}
            onPointerEnter={() => void loadCommandMenu()}
            onFocus={() => void loadCommandMenu()}
            aria-label={t.common.search}
            aria-haspopup="dialog"
          />
        }
      >
        <MagnifyingGlassIcon />
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {t.common.search}
        <SearchKeys />
      </TooltipContent>
    </Tooltip>
  );
}
