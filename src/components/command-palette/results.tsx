/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useState } from "react";
import {
  Certificate01Icon,
  Folder01Icon,
  Image01Icon,
  ImageNotFound01Icon,
  PackageIcon,
  SourceCodeIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { AiTranslateIcon } from "@/components/ui/icons/AiTranslateIcon";
import { TechMark } from "@/components/ui/custom/tech-mark";
import { NONE_BACKGROUND } from "@/components/backgrounds/registry";
import type { ProjectArt } from "@/config/projects";
import { excerpt, type Range, type SearchHit } from "@/lib/search/engine";
import type { SiteDoc } from "@/lib/search/sources";
import { cn } from "@/lib/utils";
import { artworkUrl } from "./art";
import { PAGE_ICONS, SERVICE_ICONS } from "./icons";

/** `text` with the matched spans marked */
export function Highlight({
  text,
  ranges,
}: {
  text: string;
  ranges: readonly Range[];
}) {
  if (!ranges.length) return text;
  const parts: React.ReactNode[] = [];
  let at = 0;
  for (const [start, end] of ranges) {
    if (start > at) parts.push(text.slice(at, start));
    parts.push(
      <mark key={start} className="rounded-[3px] bg-primary/15 text-foreground">
        {text.slice(start, end)}
      </mark>,
    );
    at = end;
  }
  parts.push(text.slice(at));
  return parts;
}

/** a project card's painting, cropped to fill its box */
export function Artwork({
  art,
  className,
}: {
  art: ProjectArt;
  className?: string;
}) {
  return (
    <img
      src={artworkUrl(art)}
      alt=""
      decoding="async"
      className={cn("size-full object-cover", className)}
    />
  );
}

/** the fine inner edge that keeps artwork crisp against any surface */
export const Edge = () => (
  <span
    aria-hidden
    className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-foreground/10 ring-inset"
  />
);

/** a remote logo on a white plate, falling back to a monogram or an icon */
export function LogoTile({
  src,
  fallback,
  className,
  inset = "p-1",
}: {
  src?: string;
  fallback: React.ReactNode;
  className: string;
  /** the plate's margin around the logo, scaled to the tile */
  inset?: string;
}) {
  const [failed, setFailed] = useState(false);
  const show = Boolean(src) && !failed;
  return (
    <span
      className={cn(
        className,
        "relative grid place-items-center overflow-hidden",
        show ? "bg-white" : "bg-muted text-muted-foreground",
      )}
    >
      {show ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className={cn("size-full object-contain", inset)}
        />
      ) : (
        fallback
      )}
      <Edge />
    </span>
  );
}

const iconTile = (icon: IconSvgElement, box: string, iconSize: string) => (
  <span
    className={cn(
      box,
      "relative grid place-items-center bg-muted text-muted-foreground",
    )}
  >
    <HugeiconsIcon icon={icon} strokeWidth={1.8} className={iconSize} />
    <Edge />
  </span>
);

/** the square that leads a result: a mark, a logo or the thing itself */
export function ResultTile({
  doc,
  size = "sm",
}: {
  doc: SiteDoc;
  size?: "sm" | "lg";
}) {
  const small = size === "sm";
  const box = small
    ? "size-8 shrink-0 rounded-xl"
    : "size-12 shrink-0 rounded-2xl";
  const iconSize = small ? "size-4" : "size-5";

  switch (doc.kind) {
    case "project":
      return (
        <span className={cn(box, "relative overflow-hidden")}>
          <Artwork art={doc.art} />
          <Edge />
        </span>
      );
    case "section":
      // a page of the project's deep dive: its painting as the header
      return (
        <span
          className={cn(box, "relative flex flex-col overflow-hidden bg-card")}
        >
          <Artwork art={doc.art} className={small ? "h-2.5" : "h-3.5"} />
          <span
            className={cn(
              "flex flex-col gap-0.75",
              small ? "px-1.5 pt-1" : "px-2 pt-1.5",
            )}
          >
            <span className="h-0.5 rounded-full bg-muted-foreground/45" />
            <span className="h-0.5 w-3/4 rounded-full bg-muted-foreground/30" />
            {!small && (
              <span className="h-0.5 w-1/2 rounded-full bg-muted-foreground/20" />
            )}
          </span>
          <Edge />
        </span>
      );
    case "skill":
      return (
        <span className={cn(box, "relative grid place-items-center bg-muted")}>
          <TechMark name={doc.name} className={iconSize} />
          <Edge />
        </span>
      );
    case "experience":
      return (
        <LogoTile
          src={doc.logo}
          className={box}
          fallback={
            <span className="font-heading text-2xs font-semibold">
              {doc.monogram}
            </span>
          }
        />
      );
    case "certification":
      return (
        <LogoTile
          src={doc.logo}
          className={box}
          fallback={
            <HugeiconsIcon
              icon={Certificate01Icon}
              strokeWidth={1.8}
              className={iconSize}
            />
          }
        />
      );
    case "theme": {
      // the theme wearing its own tokens: its type on its surface, its accent
      const halves = doc.value === "system" ? ["light", "dark"] : [doc.value];
      return (
        <span className={cn(box, "relative flex overflow-hidden")}>
          {halves.map((themeClass) => (
            <span
              key={themeClass}
              className={cn(
                themeClass,
                "flex flex-1 flex-col items-center justify-center gap-0.75 bg-background",
              )}
            >
              {halves.length === 1 && (
                <span
                  className={cn(
                    "font-heading leading-none font-semibold text-foreground",
                    small ? "text-2xs" : "text-sm",
                  )}
                >
                  Aa
                </span>
              )}
              <span
                className={cn(
                  "h-0.5 rounded-full bg-primary",
                  small ? "w-2.5" : "w-4",
                )}
              />
            </span>
          ))}
          <Edge />
        </span>
      );
    }
    case "language":
      return iconTile(AiTranslateIcon, box, iconSize);
    case "background":
      return iconTile(
        doc.value === NONE_BACKGROUND ? ImageNotFound01Icon : Image01Icon,
        box,
        iconSize,
      );
    case "service":
      return iconTile(SERVICE_ICONS[doc.service] ?? PackageIcon, box, iconSize);
    case "action":
      return iconTile(SourceCodeIcon, box, iconSize);
    case "page":
      return iconTile(PAGE_ICONS[doc.to] ?? Folder01Icon, box, iconSize);
  }
}

/** one result: its tile, its title, and a line of where it is and what matched */
export function ResultRow({
  hit,
  quoteBesidePreview = false,
}: {
  hit: SearchHit<SiteDoc>;
  /** drop the quote where the preview pane shows it (lg and up) */
  quoteBesidePreview?: boolean;
}) {
  const { doc } = hit;
  const snippet =
    doc.body && hit.body.length ? excerpt(doc.body, hit.body, 110, 14) : null;

  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <ResultTile doc={doc} />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate">
          <Highlight text={doc.title} ranges={hit.title} />
        </span>
        {(doc.context || snippet) && (
          <span className="truncate text-xs font-normal text-muted-foreground">
            {doc.context && (
              <Highlight text={doc.context} ranges={hit.context} />
            )}
            {snippet && (
              <span className={cn(quoteBesidePreview && "lg:hidden")}>
                {doc.context && <span aria-hidden> · </span>}
                <Highlight text={snippet.text} ranges={snippet.ranges} />
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
}
