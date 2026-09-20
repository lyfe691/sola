/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * A small info glyph that explains a menu row or section — tooltip on
 * desktop, popover on touch. Clicks never reach the row it decorates.
 */

import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Hint } from "@/components/ui/custom/hint";

type MenuHintProps = {
  text: string;
};

export function MenuHint({ text }: MenuHintProps) {
  return (
    <Hint
      side="top"
      popoverAlign="start"
      className="max-w-60 text-center"
      popoverClassName="w-60"
      trigger={
        <button
          type="button"
          className="inline-flex size-4 shrink-0 items-center justify-center rounded-full text-muted-foreground/60 transition-colors hover:text-muted-foreground"
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
          aria-label={text}
        >
          <HugeiconsIcon
            icon={InformationCircleIcon}
            strokeWidth={2}
            className="size-3"
          />
        </button>
      }
    >
      {text}
    </Hint>
  );
}
