/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { SearchIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "./ui/button";
import { useCommandMenu } from "@/hooks/use-command-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Kbd } from "@/components/ui/kbd";
import { useTranslation } from "@/lib/language-provider";

export function SearchToggle() {
  const { toggleCommandMenu } = useCommandMenu();
  const t = useTranslation();

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCommandMenu}
            aria-label={t.common.search}
          />
        }
      >
        <HugeiconsIcon icon={SearchIcon} strokeWidth={2} />
      </TooltipTrigger>
      <TooltipContent>
        {t.common.search}
        <Kbd>⌘ + K</Kbd>
      </TooltipContent>
    </Tooltip>
  );
}
