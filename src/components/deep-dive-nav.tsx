/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * "On this page" navigation for the deep-dive pages. One discovery pass
 * reads the [data-toc] landmarks out of the rendered page — config sections
 * and MDX headings alike — and a scroll scan keeps the active item current.
 * With a real pointer on a desktop-sized screen the sections are a rail of
 * hairline ticks on the left edge of the viewport, with one label that
 * glides from tick to tick; everywhere else, a slim row under the sticky bar
 * names the current section and expands the same list down over the content.
 */

import { useEffect, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { motion, useIsPresent } from "motion/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useDeepDiveBarPinned } from "@/hooks/use-deep-dive-bar-pinned";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { scrollToTarget } from "@/utils/scroll";
import { EASE_OUT, REVEAL } from "@/utils/transitions";

export interface DeepDiveSection {
  id: string;
  label: string;
}

/**
 * Collects the page's [data-toc] landmarks in document order. Label comes
 * from data-toc-label (config sections) or the element's own text (MDX
 * headings). refreshKey re-runs discovery — bump it when the slug, language
 * or MDX readiness changes.
 */
export function useDeepDiveSections(
  containerRef: RefObject<HTMLElement | null>,
  refreshKey: string,
): DeepDiveSection[] {
  const [sections, setSections] = useState<DeepDiveSection[]>([]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const seen = new Set<string>();
    const found: DeepDiveSection[] = [];
    for (const el of root.querySelectorAll<HTMLElement>("[data-toc]")) {
      const label = el.dataset.tocLabel ?? el.textContent?.trim() ?? "";
      if (!el.id || !label || seen.has(el.id)) continue;
      seen.add(el.id);
      found.push({ id: el.id, label });
    }
    setSections(found);
  }, [containerRef, refreshKey]);

  return sections;
}

/**
 * The section whose top last crossed the reading line (just under the sticky
 * bar). A plain rAF-throttled scroll scan — a dozen rects per frame — stays
 * exact where IntersectionObserver thresholds get fiddly; the bottom-of-page
 * clamp keeps a short final section reachable.
 */
export function useActiveSection(sections: DeepDiveSection[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!sections.length) return;
    const READING_LINE = 120;
    let raf = 0;

    const update = () => {
      raf = 0;
      let current: string | null = null;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top <= READING_LINE) {
          current = section.id;
        }
      }
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      setActiveId(atBottom ? sections[sections.length - 1].id : current);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [sections]);

  return sections.length ? activeId : null;
}

// scroll-mt on the targets carries the sticky-bar offset
function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  scrollToTarget(el, { immediate: reduced });
}

interface SectionNavProps {
  sections: DeepDiveSection[];
  activeId: string | null;
}

/** Row height of a tick, which is also the distance the label glides. */
const TICK_PITCH = 20;
/** The longest a tick gets (under the pointer). Every tick is this wide and
 *  scaled down from its left end, so only a transform ever animates. */
const TICK_MAX = 28;
const TICK_REST = 12;
const TICK_ACTIVE = 20;
/** Length by distance from the pointed tick: the neighbours lift a little,
 *  so the rail answers the pointer as one object rather than tick by tick. */
const TICK_NEAR = [TICK_MAX, 20, 15];
/** The label is 28px tall (text-xs + py-1.5); this centers it on a row. */
const LABEL_OFFSET = (TICK_PITCH - 28) / 2;

/**
 * The desktop register: hairline ticks flush to the left edge of the
 * viewport, one per section, vertically centered. It stays out of the
 * hero: it fades in when the sticky bar pins, once the reader is in the
 * article, stays to the end of the page, and fades out again on the way
 * back up. The current section's tick is longer and full contrast; the pointed
 * one is longest. A single label sits beside the rail and glides between
 * ticks, so scrubbing down the rail reads as one motion instead of a
 * tooltip re-opening per tick. It enters on a row without gliding (the jump
 * happens while it is still transparent) and glides only between rows.
 *
 * Portaled to <body>: the page-transition ancestor's transform demotes
 * `fixed`. useIsPresent still sees that ancestor, so the rail leaves with
 * the page instead of lingering over the next one. Pointer devices only:
 * the labels live on hover, and a touch screen has none.
 */
export function DeepDiveSectionRail({ sections, activeId }: SectionNavProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const isPresent = useIsPresent();
  const pinned = useDeepDiveBarPinned();
  const shown = isPresent && pinned;
  const [pointed, setPointed] = useState<number | null>(null);
  // survives the pointer leaving, so the label fades out where it was
  const [label, setLabel] = useState({ index: 0, glide: false });

  if (sections.length < 2 || typeof document === "undefined") return null;

  const point = (index: number) => {
    setLabel({ index, glide: pointed !== null });
    setPointed(index);
  };

  return createPortal(
    <motion.nav
      aria-label={t.common.onThisPage}
      initial={{ opacity: 0, x: -12 }}
      animate={shown ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
      transition={
        shown
          ? { duration: 0.5, ease: REVEAL }
          : { duration: 0.25, ease: EASE_OUT }
      }
      // invisible means unreachable too: no clicks, no tab stops
      inert={!shown}
      onPointerLeave={() => setPointed(null)}
      className="fixed top-1/2 left-0 z-30 hidden -translate-y-1/2 lg:can-hover:block"
    >
      <ul className="m-0 list-none p-0">
        {sections.map(({ id, label: text }, index) => {
          const active = id === activeId;
          const distance = pointed === null ? null : Math.abs(index - pointed);
          const length = Math.max(
            distance !== null ? (TICK_NEAR[distance] ?? TICK_REST) : TICK_REST,
            active ? TICK_ACTIVE : TICK_REST,
          );
          return (
            <li key={id}>
              <button
                type="button"
                aria-label={text}
                aria-current={active ? "true" : undefined}
                onPointerEnter={() => point(index)}
                onFocus={() => point(index)}
                onBlur={() => setPointed(null)}
                onClick={() => scrollToSection(id)}
                className="flex h-5 w-10 cursor-pointer items-center rounded-r-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: TICK_MAX,
                    transform: `scaleX(${length / TICK_MAX})`,
                  }}
                  className={cn(
                    "block h-px origin-left transition-[transform,background-color] duration-250 ease-out",
                    active || distance === 0
                      ? "bg-foreground"
                      : "bg-foreground/30",
                  )}
                />
              </button>
            </li>
          );
        })}
      </ul>
      <div
        aria-hidden="true"
        style={{
          transform: `translateY(${label.index * TICK_PITCH + LABEL_OFFSET}px)`,
        }}
        className={cn(
          "pointer-events-none absolute top-0 left-10",
          label.glide && "transition-transform duration-200 ease-out",
        )}
      >
        <div
          className={cn(
            "max-w-88 origin-left truncate rounded-full border border-background/10 bg-foreground px-3 py-1.5 text-xs font-medium whitespace-nowrap text-background shadow-lg transition-[opacity,translate,scale] duration-150 ease-out",
            pointed === null
              ? "-translate-x-1 scale-[0.97] opacity-0"
              : "translate-x-0 scale-100 opacity-100",
          )}
        >
          {sections[label.index]?.label}
        </div>
      </div>
    </motion.nav>,
    document.body,
  );
}

/**
 * The compact register (touch, and anything below lg): a slim row under the
 * sticky bar's breadcrumb
 * line naming the current section, with a chevron that expands a plain
 * list down over the content — no ruler here, proximity is pointer physics
 * and markers earn nothing on touch. One line in the whole assembly:
 * the bar's line sits above it, under the breadcrumb row, and the row has
 * no edge of its own — the sheet covers that seam whenever it opens. The
 * sheet is absolute (no layout shift), height-animated through the
 * grid-rows 0fr→1fr trick, and defined by its shadow and rounded base
 * rather than another line. The shadow toggles with `open` — a constant
 * one would streak under the bar at zero height.
 */
export function DeepDiveSectionMenu({ sections, activeId }: SectionNavProps) {
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  if (sections.length < 2) return null;
  const current = sections.find((s) => s.id === activeId);

  return (
    <div
      className="relative px-4 sm:px-6 lg:px-8 lg:can-hover:hidden"
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          // label centered on purpose: left-aligned it sits in the headings'
          // column with heading-like weight and reads as duplicated content.
          // The chevron keeps the right edge as the expand affordance; the
          // label's px matches its width so the text stays optically centered.
          className="relative flex w-full items-center justify-center py-2.5 text-xs"
        >
          <span className="min-w-0 truncate px-6 font-medium text-foreground">
            {current?.label ?? t.common.onThisPage}
          </span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            strokeWidth={2}
            aria-hidden="true"
            className={cn(
              "absolute right-0 size-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-out",
              open && "rotate-180",
            )}
          />
        </button>
      </div>
      <div
        inert={!open}
        className={cn(
          // opaque: at 95% the article's white text still ghosts through the
          // list, and the sheet hangs below the bar, where nothing backs it
          "absolute inset-x-0 top-full grid rounded-b-3xl bg-background transition-[grid-template-rows,box-shadow] duration-300 ease-out",
          open ? "grid-rows-[1fr] shadow-xl" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden rounded-b-3xl">
          <nav
            aria-label={t.common.onThisPage}
            className="px-4 sm:px-6 lg:px-8"
          >
            <ul className="mx-auto max-w-4xl pt-1 pb-2">
              {sections.map(({ id, label }) => (
                <li key={id}>
                  <button
                    type="button"
                    aria-current={activeId === id ? "true" : undefined}
                    onClick={() => {
                      setOpen(false);
                      scrollToSection(id);
                    }}
                    className={cn(
                      "block w-full py-2.5 text-center text-sm transition-colors duration-200 ease-out",
                      activeId === id
                        ? "font-medium text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
