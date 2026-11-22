/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { cn } from "@/lib/utils";

/**
 * A miniature page wearing a theme's class, so every colour is that theme's
 * own token. The class is required even for light: a swatch can sit under
 * <html> or in a menu, both of which carry the active theme.
 */
export function ThemeSwatch({
  themeClass,
  className,
}: {
  themeClass: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        themeClass,
        "w-[136px] flex-none rounded-2xl border border-foreground/10 bg-background p-2.5 transition-colors",
        className,
      )}
    >
      <p className="font-heading text-sm font-semibold text-foreground transition-colors">
        Aa
      </p>
      <div className="mt-1.5 h-1 w-3/4 rounded-full bg-muted-foreground/40 transition-colors" />
      <div className="mt-1 h-1 w-1/2 rounded-full bg-muted-foreground/25 transition-colors" />
      <div className="mt-2.5 flex items-center gap-1">
        <span className="h-3.5 flex-1 rounded-md bg-primary transition-colors" />
        <span className="h-3.5 w-5 rounded-md border border-foreground/10 bg-accent transition-colors" />
        <span className="size-3.5 rounded-full border border-foreground/10 bg-secondary transition-colors" />
      </div>
    </div>
  );
}

/**
 * System as one swatch: the light page with the dark one laid over its
 * right half, so the two meet down the middle of a single miniature.
 */
export function SystemSwatch({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <ThemeSwatch themeClass="light" className="w-full" />
      <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden">
        <ThemeSwatch
          themeClass="dark"
          className="absolute top-0 right-0 w-[200%]"
        />
      </div>
    </div>
  );
}
