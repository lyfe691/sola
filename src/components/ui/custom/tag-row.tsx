/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useLayoutEffect, useRef, useState } from "react";
import { badgeVariants } from "@/components/ui/badge";
import { TechChip } from "@/components/ui/custom/tech-chip";
import { Hint } from "@/components/ui/custom/hint";
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

  const hiddenCount = tags.length - visibleCount;
  const hiddenTags = tags.slice(visibleCount).join(", ");

  // a real button so the hidden tags are reachable by keyboard
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
      {/* every tag renders once; the ones past the fit leave the row but stay
          laid out, so their natural widths can still be measured */}
      {tags.map((tag, i) => (
        <TechChip
          key={tag}
          name={tag}
          data-measure="tag"
          className={cn(
            i >= visibleCount && "invisible absolute transition-none",
          )}
        />
      ))}
      <span
        aria-hidden
        data-measure="more"
        className={cn(
          badgeVariants({ variant: "secondary" }),
          "invisible absolute font-normal",
        )}
      >
        +{tags.length}
      </span>
      {hiddenCount > 0 && (
        <Hint
          trigger={overflowTrigger}
          className="max-w-[220px] text-center"
          popoverClassName="w-fit max-w-[220px] text-center"
        >
          {hiddenTags}
        </Hint>
      )}
    </div>
  );
};

export default TagRow;
