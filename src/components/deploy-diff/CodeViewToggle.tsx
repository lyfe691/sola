/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The nav toggle for code view. While active it is the only control left in
 * the nav, so the icon crossfades to an X (same glyph-morph pattern as the
 * theme trigger) to read as the way back out.
 */

import { CodeXml, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { useCodeView } from "./code-view-provider";

const iconTransition =
  "absolute h-4 w-4 transition-[transform,translate,scale,rotate,opacity] duration-200";

export function CodeViewToggle() {
  const { active, toggle } = useCodeView();
  const { language } = useLanguage();
  const t = translations[language].common.diff;

  const label = active ? t.exit : t.enter;

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 rounded-full transition-colors hover:bg-muted"
            onClick={toggle}
            aria-pressed={active}
          />
        }
      >
        <CodeXml
          aria-hidden="true"
          className={cn(
            iconTransition,
            active ? "rotate-90 scale-90 opacity-0" : "rotate-0 scale-100 opacity-100",
          )}
        />
        <X
          aria-hidden="true"
          className={cn(
            iconTransition,
            active ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-90 opacity-0",
          )}
        />
        <span className="sr-only">{label}</span>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
