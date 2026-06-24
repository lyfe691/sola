/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

"use client";

import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type LinkPreviewProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  screenshot?: boolean;
  previewType?: "image" | "iframe" | "auto";
  compact?: boolean;
  "aria-label"?: string;
};

type PreviewStatus = "idle" | "loading" | "ready" | "failed";

const PREVIEW_TIMEOUT_MS = 4000;

function getHostname(url: string): string | null {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function getFaviconUrl(hostname: string): string {
  return `https://icons.duckduckgo.com/ip3/${hostname}.ico`;
}

function getScreenshotUrl(href: string): string {
  return `https://image.thum.io/get/width/600/crop/600/noanimate/${encodeURIComponent(href)}`;
}

function usePreviewPreload(
  enabled: boolean,
  screenshotUrl?: string,
): PreviewStatus {
  const [status, setStatus] = React.useState<PreviewStatus>("idle");

  React.useEffect(() => {
    if (!enabled || !screenshotUrl) {
      setStatus("idle");
      return;
    }

    setStatus("loading");

    const img = new Image();
    img.referrerPolicy = "no-referrer";

    const finish = (next: PreviewStatus) => {
      setStatus((current) => (current === "loading" ? next : current));
    };

    const timeoutId = window.setTimeout(
      () => finish("failed"),
      PREVIEW_TIMEOUT_MS,
    );

    img.onload = () => {
      window.clearTimeout(timeoutId);
      finish("ready");
    };
    img.onerror = () => {
      window.clearTimeout(timeoutId);
      finish("failed");
    };
    img.src = screenshotUrl;

    return () => {
      window.clearTimeout(timeoutId);
      img.onload = null;
      img.onerror = null;
      img.src = "";
      setStatus("idle");
    };
  }, [enabled, screenshotUrl]);

  return status;
}

export function LinkPreview({
  href,
  children,
  className,
  screenshot = true,
  previewType: _previewType = "auto",
  compact = true,
  "aria-label": ariaLabel,
}: LinkPreviewProps) {
  const hostname = getHostname(href);
  const favicon = hostname ? getFaviconUrl(hostname) : undefined;
  const label = hostname ?? href;

  const wantsMedia = !compact && screenshot;
  const screenshotUrl = wantsMedia ? getScreenshotUrl(href) : undefined;

  const [active, setActive] = React.useState(false);
  const previewStatus = usePreviewPreload(active && wantsMedia, screenshotUrl);

  const previewSettled =
    previewStatus === "ready" || previewStatus === "failed" || !wantsMedia;

  const open = active && (compact || previewSettled);

  const handleOpenChange = React.useCallback((next: boolean) => {
    if (!next) setActive(false);
  }, []);

  const handleActivate = React.useCallback(() => {
    setActive(true);
  }, []);

  const handleDeactivate = React.useCallback(() => {
    setActive(false);
  }, []);

  return (
    <Tooltip open={open} onOpenChange={handleOpenChange}>
      <TooltipTrigger
        render={
          <a
            href={href}
            aria-label={ariaLabel}
            className={className}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={handleActivate}
            onMouseLeave={handleDeactivate}
            onFocus={handleActivate}
            onBlur={handleDeactivate}
          />
        }
      >
        {children}
      </TooltipTrigger>

      <TooltipContent
        side="top"
        className={cn(
          !compact && "max-w-none flex-col items-stretch gap-0 p-0",
        )}
      >
        {!compact && previewStatus === "ready" && screenshotUrl ? (
          <div className="relative aspect-video w-64 bg-background/10">
            <img
              src={screenshotUrl}
              alt={label}
              className="absolute inset-0 size-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : null}
        <span
          className={cn(
            "inline-flex min-w-0 items-center gap-1.5",
            !compact && "px-3 py-1.5",
          )}
        >
          {favicon ? (
            <img
              src={favicon}
              alt=""
              className="size-3.5 shrink-0 rounded-sm"
              loading="lazy"
            />
          ) : null}
          <span className="truncate">{label}</span>
        </span>
      </TooltipContent>
    </Tooltip>
  );
}

export default LinkPreview;