/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { TranslateIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LANGUAGES } from "@/config/languages";
import { useLanguage, useTranslation } from "@/lib/language-provider";

export function LanguageToggle() {
  const { language, setLanguage, detectedLanguage, detectedLanguageCode } =
    useLanguage();
  const t = useTranslation();

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t.common.a11y.toggleLanguage}
                />
              }
            />
          }
        >
          <TranslateIcon />
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {t.common.command.groups.language}
        </TooltipContent>
      </Tooltip>

      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            {t.common.command.groups.language}
          </DropdownMenuLabel>
          <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
            {LANGUAGES.map(({ code, label }) => (
              <DropdownMenuRadioItem key={code} value={code} closeOnClick>
                {label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <p className="px-3 py-1.5 text-xs text-muted-foreground/70">
          {t.i18n.detectedNote.replace(
            "{lang}",
            detectedLanguageCode || detectedLanguage,
          )}
        </p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
