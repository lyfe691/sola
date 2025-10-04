/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CopyToClipboardProps {
  code: string;
  className?: string;
}

export default function CopyToClipboard({
  code,
  className,
}: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500); // 2.5s
    } catch (error) {
      console.error("Failed to copy code:", error);
      toast.error("Failed to copy code");
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={copyToClipboard}
      className={cn(
        "h-8 w-8 p-0 text-muted-foreground hover:text-foreground transition-colors",
        className,
      )}
      aria-label={copied ? "Copied!" : "Copy code"}
    >
      <div className="relative">
        <Copy
          className={cn(
            "h-4 w-4 transition-all duration-300 ease-in-out",
            copied ? "scale-0 opacity-0" : "scale-100 opacity-100",
          )}
        />
        <Check
          className={cn(
            "h-4 w-4 absolute inset-0 transition-all duration-300 ease-in-out text-foreground",
            copied ? "scale-100 opacity-100" : "scale-0 opacity-0",
          )}
        />
      </div>
    </Button>
  );
}
