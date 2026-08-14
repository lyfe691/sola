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
 * ≥2xl the proximity rail sits sticky in the right gutter under an
 * "on this page" heading; below that, a slim row under the sticky bar names
 * the current section and expands the same list down over the content.
 */

import { useEffect, useState, type RefObject } from "react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { LineSidebar } from "@/components/ui/custom/line-sidebar";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { scrollToTarget } from "@/utils/scroll";

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

/**
 * The proximity rail — only ≥2xl has gutter room for it. In the article
 * column's flow on purpose: an absolute panel spanning the column's height
 * with the rail sticky inside, so it starts below the hero, pins under the
 * sticky bar, and stops with the content. The panel's top-14 matches the
 * sticky top-28 minus the bar height, so the resting and pinned states
 * show the same gap under the bar. Sticky, not fixed: the page-transition
 * ancestor's transform demotes `fixed`.
 */
export function DeepDiveSectionRail({ sections, activeId }: SectionNavProps) {
  const { language } = useLanguage();
  const t = translations[language];

  if (sections.length < 2) return null;
  const activeIndex = sections.findIndex((s) => s.id === activeId);

  return (
    <div className="absolute top-14 bottom-0 left-full ml-16 hidden 2xl:block">
      <div className="sticky top-28">
        {/* pl mirrors the rail's marker gutter (markerLength + markerGap)
            so the heading aligns with the labels */}
        <p className="mb-2 pl-11 text-xs font-medium text-foreground">
          {t.common.onThisPage}
        </p>
        <LineSidebar
          label={t.common.onThisPage}
          items={sections.map((s) => s.label)}
          activeIndex={activeIndex === -1 ? null : activeIndex}
          onItemClick={(index) => scrollToSection(sections[index].id)}
          markerLength={32}
          markerGap={12}
          fontSize={0.85}
          maxShift={12}
          itemGap={20}
        />
      </div>
    </div>
  );
}

/**
 * The compact register (<2xl): a slim row under the sticky bar's breadcrumb
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
      className="relative px-4 sm:px-6 lg:px-8 2xl:hidden"
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
          "absolute inset-x-0 top-full grid rounded-b-3xl bg-background/95 backdrop-blur-xs transition-[grid-template-rows,box-shadow] duration-300 ease-out",
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
