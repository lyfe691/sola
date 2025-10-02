/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Check, Languages } from "lucide-react";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
// no section label needed for languages

export function LanguageToggle() {
  const { language, setLanguage, detectedLanguage, detectedLanguageCode } =
    useLanguage();
  const t = translations[language];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-9 h-9 transition-colors hover:bg-muted"
        >
          <Languages className="h-4 w-4" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-background/35 backdrop-blur-sm"
      >
        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className="flex justify-between"
        >
          English
          {language === "en" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("de")}
          className="flex justify-between"
        >
          Deutsch
          {language === "de" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setLanguage("es")}
          className="flex justify-between"
        >
          Español
          {language === "es" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("ja")}
          className="flex justify-between"
        >
          日本語
          {language === "ja" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("zh")}
          className="flex justify-between"
        >
          中文
          {language === "zh" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <div className="px-2 py-1.5 text-xs text-foreground/50 border-t border-foreground/10 mt-1">
          {t.i18n?.detectedNote.replace(
            "{lang}",
            detectedLanguageCode || detectedLanguage,
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
