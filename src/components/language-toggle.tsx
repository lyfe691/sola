/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { lazy, Suspense, useState, type ReactElement } from "react";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage, useTranslation } from "@/lib/language-provider";

// a phone's sheet is its own chunk: wider screens never load it
const LanguageDrawer = lazy(() =>
  import("./language-drawer").then((module) => ({
    default: module.LanguageDrawer,
  })),
);

/** Wider screens: a dropdown under the bar. */
function LanguageDropdown({
  trigger,
  note,
}: {
  trigger: ReactElement;
  note: string;
}) {
  const { language, setLanguage } = useLanguage();
  const t = useTranslation();

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger render={<DropdownMenuTrigger render={trigger} />} />
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

        <p className="px-3 py-1.5 text-xs text-muted-foreground/70">{note}</p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function LanguageToggle({ floating }: { floating?: boolean }) {
  const { detectedLanguage, detectedLanguageCode } = useLanguage();
  const t = useTranslation();
  const isMobile = useIsMobile();
  // the sheet's open state sits above its chunk, so a press on the button
  // before the chunk is in still opens the sheet once it is
  const [sheetOpen, setSheetOpen] = useState(false);
  const note = t.i18n.detectedNote.replace(
    "{lang}",
    detectedLanguageCode || detectedLanguage,
  );
  const button = (onClick?: () => void) => (
    <Button
      {...barButton(floating)}
      aria-label={t.common.a11y.toggleLanguage}
      onClick={onClick}
    >
      <TranslateIcon />
    </Button>
  );

  return isMobile ? (
    <Suspense fallback={button(() => setSheetOpen(true))}>
      <LanguageDrawer
        trigger={button()}
        note={note}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </Suspense>
  ) : (
    <LanguageDropdown trigger={button()} note={note} />
  );
}
