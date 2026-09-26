/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { TagRow } from "@/components/ui/custom/tag-row";
import { excerpt, type SearchHit } from "@/lib/search/engine";
import type { SiteDoc } from "@/lib/search/sources";
import { Artwork, Edge, Highlight } from "./results";
import { Stage } from "./stages";
import { cn } from "@/lib/utils";

/** the line above the title: where the result is from */
const eyebrowOf = (doc: SiteDoc, heading: string): string | undefined => {
  switch (doc.kind) {
    case "project":
      return doc.facts.join(" · ");
    case "experience":
      return [doc.company, ...doc.facts].join(" · ");
    case "skill":
    case "certification":
    case "language":
      return doc.context;
    default:
      return heading;
  }
};

/** what the result is, larger: a picture of it, and more of what matched */
export function ResultPreview({
  hit,
  heading,
}: {
  hit: SearchHit<SiteDoc> | undefined;
  /** the result's group heading, for results with nothing more specific */
  heading: string;
}) {
  if (!hit) return null;
  const { doc } = hit;
  const eyebrow = eyebrowOf(doc, heading);
  const quote = doc.body ? excerpt(doc.body, hit.body, 280) : null;

  return (
    <div className="flex h-full min-w-0 flex-col gap-4 p-4">
      <Stage doc={doc} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 px-1">
        <div className="flex min-w-0 flex-col gap-0.5">
          {eyebrow && (
            <p className="truncate text-xs text-muted-foreground">{eyebrow}</p>
          )}
          {/* a project's hero already carries its name */}
          {doc.kind !== "project" && (
            <h3 className="truncate text-base font-semibold text-foreground">
              <Highlight text={doc.title} ranges={hit.title} />
            </h3>
          )}
        </div>
        {quote && (
          <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">
            <Highlight text={quote.text} ranges={quote.ranges} />
          </p>
        )}
        <Details doc={doc} />
      </div>
    </div>
  );
}

function Details({ doc }: { doc: SiteDoc }) {
  switch (doc.kind) {
    case "project":
    case "experience":
      return doc.technologies.length ? (
        <TagRow tags={doc.technologies} className="mt-auto" />
      ) : null;
    case "certification":
      return doc.skills.length ? (
        <TagRow tags={doc.skills} className="mt-auto" />
      ) : null;
    case "skill":
      return doc.projects.length ? (
        <ul className="mt-auto flex flex-wrap gap-1.5">
          {doc.projects.map((project) => (
            <li
              key={project.title}
              className="flex items-center gap-1.5 rounded-full bg-muted py-0.5 pr-2.5 pl-0.5 text-xs text-foreground"
            >
              <span className="relative size-4 overflow-hidden rounded-full">
                <Artwork art={project.art} />
                <Edge />
              </span>
              {project.title}
            </li>
          ))}
        </ul>
      ) : null;
    case "service":
      return (
        <ul className="mt-auto grid grid-cols-2 gap-x-4 gap-y-1.5">
          {doc.features.map((feature) => (
            <li
              key={feature}
              className="flex min-w-0 items-center gap-1.5 text-xs text-foreground"
            >
              <HugeiconsIcon
                icon={Tick02Icon}
                strokeWidth={2}
                className="size-3.5 shrink-0 text-muted-foreground"
              />
              <span className="truncate">{feature}</span>
            </li>
          ))}
        </ul>
      );
    case "theme": {
      // the theme's palette, each colour from its own tokens; the outline
      // stays in the pane's, so a colour that matches the pane still shows
      const schemes = doc.value === "system" ? ["light", "dark"] : [doc.value];
      return (
        <div className="flex items-center gap-3">
          {schemes.map((scheme) => (
            <div key={scheme} className="flex items-center gap-1.5">
              {PALETTE.map((token) => (
                <span
                  key={token}
                  className="rounded-full ring-1 ring-foreground/15"
                >
                  <span
                    className={cn(scheme, "block size-5 rounded-full", token)}
                  />
                </span>
              ))}
            </div>
          ))}
        </div>
      );
    }
    default:
      return null;
  }
}

const PALETTE = [
  "bg-background",
  "bg-foreground",
  "bg-primary",
  "bg-secondary",
  "bg-accent",
  "bg-muted",
];
