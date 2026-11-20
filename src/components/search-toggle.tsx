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
import { Kbd } from "./ui/kbd";
import { loadCommandMenu, useCommandMenu } from "@/hooks/use-command-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "@/lib/language-provider";

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
        <Kbd>⌘ + K</Kbd>
      </TooltipContent>
    </Tooltip>
  );
}
