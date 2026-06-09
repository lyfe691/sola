/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Check, Languages } from "lucide-react";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { LANGUAGES } from "@/config/languages";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function LanguageToggle({
  open,
  onOpenChange,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { language, setLanguage, detectedLanguage, detectedLanguageCode } =
    useLanguage();
  const t = translations[language];

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 rounded-full transition-colors hover:bg-muted"
          />
        }
      >
        <Languages className="h-4 w-4" />
        <span className="sr-only">Toggle language</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        <DropdownMenuLabel>{t.common.command.groups.language}</DropdownMenuLabel>
        {LANGUAGES.map(({ code, label }) => {
          const isSelected = language === code;
          return (
            <DropdownMenuItem
              key={code}
              onClick={() => setLanguage(code)}
              className="justify-between"
            >
              <span className={isSelected ? "text-muted-foreground" : ""}>
                {label}
              </span>
              {isSelected && (
                <Check className="h-4 w-4 text-muted-foreground" />
              )}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <div className="px-3 py-1.5 text-xs text-muted-foreground/70">
          {t.i18n?.detectedNote.replace(
            "{lang}",
            detectedLanguageCode || detectedLanguage,
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
