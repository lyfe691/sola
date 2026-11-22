/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useState, type ReactElement } from "react";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { CheckIcon } from "@phosphor-icons/react";
import { BarDrawer } from "@/components/bar-drawer";
import { HoverGlide } from "@/components/ui/custom/hover-glide";
import { LANGUAGES } from "@/config/languages";
import { useLanguage, useTranslation } from "@/lib/language-provider";

/** The language menu on a phone: a sheet of the languages, shut by the pick. */
export function LanguageDrawer({
  trigger,
  note,
}: {
  trigger: ReactElement;
  /** which language the browser asked for */
  note: string;
}) {
  const { language, setLanguage } = useLanguage();
  const title = useTranslation().common.command.groups.language;
  const [open, setOpen] = useState(false);

  return (
    <BarDrawer
      trigger={trigger}
      title={title}
      description={note}
      open={open}
      onOpenChange={setOpen}
    >
      <HoverGlide>
        <RadioGroup
          value={language}
          onValueChange={(next) => {
            setLanguage(next);
            setOpen(false);
          }}
          aria-label={title}
          className="flex flex-col"
        >
          {LANGUAGES.map(({ code, label }) => (
            <Radio.Root
              key={code}
              value={code}
              data-glide=""
              className="group/row flex h-13 cursor-pointer items-center gap-3 rounded-2xl px-3 outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              <span className="flex size-8 items-center justify-center rounded-xl bg-muted text-xs font-medium text-muted-foreground uppercase ring-1 ring-foreground/10">
                {code}
              </span>
              {/* the chosen row reads as chosen the way the dropdown's does */}
              <span className="flex-1 text-base group-data-checked/row:text-muted-foreground">
                {label}
              </span>
              <Radio.Indicator className="flex">
                <CheckIcon className="size-4" aria-hidden="true" />
              </Radio.Indicator>
            </Radio.Root>
          ))}
        </RadioGroup>
      </HoverGlide>
    </BarDrawer>
  );
}
