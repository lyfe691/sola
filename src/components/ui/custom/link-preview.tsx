/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

"use client";

import * as React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type LinkPreviewProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  screenshot?: boolean;
  previewType?: "image" | "iframe" | "auto";
  compact?: boolean;
};

function getHostname(input: string): string | null {
  try {
    const url = new URL(input);
    return url.hostname;
  } catch {
    return null;
  }
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({
  href,
  children,
  className,
  screenshot = true,
  previewType = "auto",
  compact = true,
}) => {
  const hostname = getHostname(href);
  const favicon = hostname
    ? `https://icons.duckduckgo.com/ip3/${hostname}.ico`
    : undefined;
  const screenshotUrl = screenshot
    ? `https://image.thum.io/get/width/600/crop/600/noanimate/${encodeURIComponent(href)}`
    : undefined;
  const [mode, setMode] = React.useState<"iframe" | "image">(
    previewType === "iframe"
      ? "iframe"
      : previewType === "image"
        ? "image"
        : "iframe",
  );
  const fallbackTimer = React.useRef<number | null>(null);
  const [imageFailed, setImageFailed] = React.useState(false);

  React.useEffect(() => {
    if (previewType === "auto" && mode === "iframe") {
      // fallback to image if iframe doesn't load within timeout
      fallbackTimer.current = window.setTimeout(() => setMode("image"), 1500);
      return () => {
        if (fallbackTimer.current) window.clearTimeout(fallbackTimer.current);
      };
    }
    return;
  }, [previewType, mode]);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <a
          href={href}
          className={className}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      </HoverCardTrigger>
      <HoverCardContent className="w-auto p-0 overflow-hidden bg-background/80 backdrop-blur-sm transition-all duration-150">
        <div className="relative">
          {!compact &&
            (mode === "iframe" ? (
              <div className="relative w-full aspect-video bg-background/80">
                <iframe
                  src={href}
                  className="absolute inset-0 w-full h-full rounded-sm border-0"
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  referrerPolicy="no-referrer"
                  onLoad={() => {
                    if (fallbackTimer.current)
                      window.clearTimeout(fallbackTimer.current);
                  }}
                  onError={() => setMode("image")}
                />
              </div>
            ) : screenshotUrl && !imageFailed ? (
              <div className="relative w-full aspect-video bg-background/80">
                <img
                  src={screenshotUrl}
                  alt={hostname || href}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={() => setImageFailed(true)}
                />
              </div>
            ) : null)}
          <div className="px-2 py-1 flex items-center gap-2 min-w-0">
            {favicon ? (
              <img
                src={favicon}
                alt=""
                className="w-4 h-4 rounded-sm"
                loading="lazy"
              />
            ) : null}
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground truncate">
                {hostname || href}
              </div>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default LinkPreview;
