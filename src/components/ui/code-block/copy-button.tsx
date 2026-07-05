/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";

interface CopyButtonProps {
  value: string;
  className?: string;
}

/**
 * Copy-to-clipboard icon button. Quiet until the block is hovered (always shown
 * on touch); on success the copy glyph crossfades to a check, then back.
 */
export const CopyButton = ({ value, className }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t.common.copyFailed);
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={copied ? t.common.copied : t.common.copyCode}
      className={cn(
        "relative inline-flex size-7 items-center justify-center rounded-md text-muted-foreground",
        "opacity-0 transition duration-200 hover:bg-foreground/10 hover:text-foreground",
        "group-hover:opacity-100 focus-visible:opacity-100 [@media(pointer:coarse)]:opacity-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <Copy
        className={cn(
          "size-3.5 transition duration-200 ease-out",
          copied && "scale-90 opacity-0",
        )}
      />
      <Check
        className={cn(
          "absolute inset-0 m-auto size-3.5 text-primary transition duration-200 ease-out",
          copied ? "scale-100 opacity-100" : "scale-90 opacity-0",
        )}
      />
    </button>
  );
};

export default CopyButton;
