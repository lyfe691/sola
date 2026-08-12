/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useLayoutEffect, useRef, useState } from "react";
import { Badge, badgeVariants } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const TAG_GAP = 6;

interface TagRowProps {
  tags: string[];
  className?: string;
}

/**
 * A single-line row of secondary badges that shows as many tags as fit the
 * available width, collapsing the rest into a "+N" badge whose tooltip lists the
 * hidden ones. Re-measures on container resize and after fonts load.
 */
export const TagRow = ({ tags, className }: TagRowProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(tags.length);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let disposed = false;

    const compute = () => {
      if (disposed) return;
      const available = Math.floor(container.clientWidth);
      if (!available) return;

      const widths = Array.from(
        container.querySelectorAll<HTMLElement>("[data-measure='tag']"),
      ).map((el) => el.offsetWidth);
      const moreWidth =
        container.querySelector<HTMLElement>("[data-measure='more']")
          ?.offsetWidth ?? 0;

      let used = 0;
      let count = 0;
      for (let i = 0; i < widths.length; i++) {
        const width = widths[i] + (i > 0 ? TAG_GAP : 0);
        if (used + width > available) break;
        used += width;
        count++;
      }

      if (count < widths.length) {
        while (count > 0 && used + TAG_GAP + moreWidth > available) {
          used -= widths[count - 1] + (count - 1 > 0 ? TAG_GAP : 0);
          count--;
        }
      }

      setVisibleCount(count);
    };

    const observer = new ResizeObserver(compute);
    observer.observe(container);
    compute();
    document.fonts?.ready.then(compute);

    return () => {
      disposed = true;
      observer.disconnect();
    };
  }, [tags]);

  const isMobile = useIsMobile();
  const hiddenCount = tags.length - visibleCount;
  const hiddenTags = tags.slice(visibleCount).join(", ");

  // a real button so the hidden tags are reachable by keyboard; on touch a
  // popover replaces the hover-only tooltip (same split as MenuHint)
  const overflowTrigger = (
    <button
      type="button"
      aria-label={hiddenTags}
      className={cn(badgeVariants({ variant: "secondary" }), "font-normal")}
    >
      +{hiddenCount}
    </button>
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative flex gap-1.5 overflow-hidden", className)}
    >
      {/* hidden mirror used only to measure natural tag widths */}
      <div
        aria-hidden
        className="pointer-events-none invisible absolute left-0 top-0 flex gap-1.5"
      >
        {tags.map((tag) => (
          <Badge
            key={tag}
            data-measure="tag"
            variant="secondary"
            className="font-normal"
          >
            {tag}
          </Badge>
        ))}
        <Badge data-measure="more" variant="secondary" className="font-normal">
          +{tags.length}
        </Badge>
      </div>

      {tags.slice(0, visibleCount).map((tag) => (
        <Badge key={tag} variant="secondary" className="font-normal">
          {tag}
        </Badge>
      ))}
      {hiddenCount > 0 &&
        (isMobile ? (
          <Popover>
            <PopoverTrigger render={overflowTrigger} />
            <PopoverContent
              side="top"
              className="w-fit max-w-[220px] p-3 text-center text-xs leading-relaxed"
            >
              {hiddenTags}
            </PopoverContent>
          </Popover>
        ) : (
          <Tooltip>
            <TooltipTrigger render={overflowTrigger} />
            <TooltipContent className="max-w-[220px] text-center">
              {hiddenTags}
            </TooltipContent>
          </Tooltip>
        ))}
    </div>
  );
};

export default TagRow;
