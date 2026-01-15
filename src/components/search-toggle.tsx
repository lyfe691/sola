/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { useCommandMenu } from "@/hooks/use-command-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { type Translation, translations } from "@/lib/translations";
import { useLanguage } from "@/lib/language-provider";

export function SearchToggle() {
  const { toggleCommandMenu } = useCommandMenu();
  const { language } = useLanguage();
  const t = translations[language] as Translation;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-9 h-9 rounded-full transition-colors hover:bg-muted"
          onClick={toggleCommandMenu}
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent className="bg-background/85 backdrop-blur-sm">
      <KbdGroup>
        <p className="text-sm">{t.common.search}</p>
        <Kbd>⌘</Kbd>
        <span>+</span>
        <Kbd>K</Kbd>
      </KbdGroup>
      </TooltipContent>
    </Tooltip>
  );
}
