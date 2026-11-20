/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { TranslateIcon } from "@phosphor-icons/react";
import { barButton } from "@/components/bar-button";
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

export function LanguageToggle({ floating }: { floating?: boolean }) {
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
                  {...barButton(floating)}
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

      <DropdownMenuContent align="end" glide>
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            {t.common.command.groups.language}
          </DropdownMenuLabel>
          <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
            {LANGUAGES.map(({ code, label }) => (
              <DropdownMenuRadioItem key={code} value={code} closeOnClick>
                <span className="flex size-6 items-center justify-center rounded-lg bg-muted text-2xs font-medium text-muted-foreground! uppercase ring-1 ring-foreground/10">
                  {code}
                </span>
                <span className="font-normal in-data-checked:text-muted-foreground!">
                  {label}
                </span>
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
