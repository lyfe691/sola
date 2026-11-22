/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import type { ReactElement } from "react";
import { CheckIcon } from "@phosphor-icons/react";
import { BarDrawer } from "@/components/bar-drawer";
import { HoverGlide } from "@/components/ui/custom/hover-glide";
import { LANGUAGES } from "@/config/languages";
import { useLanguage, useTranslation } from "@/lib/language-provider";
import { cn } from "@/lib/utils";

/**
 * The language menu on a phone: a sheet of the languages, shut by the pick.
 * The rows are buttons, not radios: a radio is chosen as focus reaches it,
 * so an arrow key would have switched the site and shut the sheet before a
 * keyboard got past the next row.
 */
export function LanguageDrawer({
  trigger,
  note,
  open,
  onOpenChange,
}: {
  trigger: ReactElement;
  /** which language the browser asked for */
  note: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { language, setLanguage } = useLanguage();
  const title = useTranslation().common.command.groups.language;

  return (
    <BarDrawer
      trigger={trigger}
      title={title}
      description={note}
      open={open}
      onOpenChange={onOpenChange}
    >
      <HoverGlide>
        <ul aria-label={title} className="flex flex-col">
          {LANGUAGES.map(({ code, label }) => {
            const current = code === language;
            return (
              <li key={code}>
                <button
                  type="button"
                  data-glide=""
                  aria-current={current || undefined}
                  onClick={() => {
                    if (!current) setLanguage(code);
                    onOpenChange(false);
                  }}
                  className="flex h-13 w-full cursor-pointer items-center gap-3 rounded-2xl px-3 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-8 items-center justify-center rounded-xl bg-muted text-xs font-medium text-muted-foreground uppercase ring-1 ring-foreground/10"
                  >
                    {code}
                  </span>
                  {/* the chosen row reads as chosen the way the dropdown's
                      does; each name is spoken in its own language */}
                  <span
                    lang={code}
                    className={cn(
                      "flex-1 text-base",
                      current && "text-muted-foreground",
                    )}
                  >
                    {label}
                  </span>
                  {current && (
                    <CheckIcon className="size-4" aria-hidden="true" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </HoverGlide>
    </BarDrawer>
  );
}
