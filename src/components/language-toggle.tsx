/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Check } from "lucide-react";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { LANGUAGES } from "@/config/languages";
import { cn } from "@/lib/utils";

/** The language picker — the content of the appearance menu. */
export function LanguageMenuContent({ onClose }: { onClose: () => void }) {
  const { language, setLanguage, detectedLanguage, detectedLanguageCode } =
    useLanguage();
  const t = translations[language];

  return (
    <div className="min-w-[168px]">
      <div className="px-3 py-2 text-xs text-muted-foreground">
        {t.common.command.groups.language}
      </div>

      {LANGUAGES.map(({ code, label }) => {
        const isSelected = language === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => {
              setLanguage(code);
              onClose();
            }}
            className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
          >
            <span
              className={cn(
                "min-w-0 flex-1 truncate text-left",
                isSelected && "text-muted-foreground",
              )}
            >
              {label}
            </span>
            {isSelected && (
              <Check className="size-4 shrink-0 text-muted-foreground" />
            )}
          </button>
        );
      })}

      <div className="my-1.5 h-px bg-border/50" />

      <div className="px-3 py-1.5 text-xs text-muted-foreground/70">
        {t.i18n?.detectedNote.replace(
          "{lang}",
          detectedLanguageCode || detectedLanguage,
        )}
      </div>
    </div>
  );
}
