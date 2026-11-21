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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "@/components/ui/input-group";
import { useTranslation } from "@/lib/language-provider";

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

/**
 * Search as a field standing in the bar, where the bar has the room: the
 * palette's own input group with one button laid over the whole of it. The
 * button is the group's control, so the group draws its focus ring.
 */
export function SearchField({ className }: { className?: string }) {
  const { toggleCommandMenu } = useCommandMenu();
  const t = useTranslation();

  return (
    <InputGroup className={className}>
      <InputGroupAddon>
        <MagnifyingGlassIcon aria-hidden="true" />
      </InputGroupAddon>
      <InputGroupText className="min-w-0 flex-1">
        <span className="truncate pl-1.5">{t.common.search}</span>
      </InputGroupText>
      <InputGroupAddon align="inline-end">
        <SearchKeys />
      </InputGroupAddon>
      <button
        type="button"
        data-slot="input-group-control"
        aria-label={t.common.search}
        onClick={toggleCommandMenu}
        onPointerEnter={() => void loadCommandMenu()}
        onFocus={() => void loadCommandMenu()}
        className="absolute inset-0 cursor-pointer rounded-[inherit] outline-none transition-colors hover:bg-foreground/5"
      />
    </InputGroup>
  );
}

export function SearchToggle({ floating }: { floating?: boolean }) {
  const { toggleCommandMenu } = useCommandMenu();
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
