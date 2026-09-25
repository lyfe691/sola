/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/language-provider";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon, Copy01Icon } from "@hugeicons/core-free-icons";

interface CopyButtonProps {
  value: string;
  className?: string;
}

const COPIED_MS = 2000;

const GLYPH =
  "col-start-1 row-start-1 size-3.5 transition-[opacity,scale,filter] duration-300";
const GLYPH_HIDDEN = "scale-50 opacity-0 blur-xs";

/**
 * Copy-to-clipboard icon button. Quiet until the block is hovered (always
 * shown where nothing hovers); on success the copy glyph blurs into a check,
 * then back.
 */
export const CopyButton = ({ value, className }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);
  const t = useTranslation();

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), COPIED_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      toast.add({ type: "error", title: t.common.copyFailed });
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={copied ? t.common.copied : t.common.copyCode}
      className={cn(
        "grid size-7 place-items-center rounded-md text-muted-foreground",
        // opaque at rest and on hover: without a header the button sits over the code
        "bg-(--code) hover:bg-[color-mix(in_oklab,var(--code),var(--foreground)_10%)] hover:text-foreground",
        "transition-[color,background-color,opacity,scale] active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        // the check stays visible after the pointer leaves the block
        !copied &&
          "can-hover:opacity-0 can-hover:group-hover:opacity-100 focus-visible:opacity-100",
        className,
      )}
    >
      <HugeiconsIcon
        icon={Copy01Icon}
        strokeWidth={2}
        className={cn(GLYPH, copied && GLYPH_HIDDEN)}
      />
      <HugeiconsIcon
        icon={Tick02Icon}
        strokeWidth={2}
        className={cn(GLYPH, "text-primary", !copied && GLYPH_HIDDEN)}
      />
    </button>
  );
};

export default CopyButton;
