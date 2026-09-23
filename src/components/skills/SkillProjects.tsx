/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
  type Ref,
} from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import type { ProjectMeta } from "@/config/projects";
import { projectsUsing, skillLabels, type Skill } from "@/config/skills";
import { TECH_ICONS } from "@/config/tech-icons";
import { useWindowScrollLock } from "@/hooks/use-window-scroll-lock";
import { useTranslation } from "@/lib/language-provider";
import { countLabel } from "@/lib/plural";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/utils/transitions";

const STACK_MAX = 7;

export function SkillTile({
  skill,
  className,
}: {
  skill: Skill;
  className?: string;
}) {
  const Icon = skill.icon;
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted/60 ring-1 ring-foreground/5 ring-inset",
        className,
      )}
    >
      <Icon className="size-5" size={20} />
    </span>
  );
}

function useUsedIn(count: number): string {
  const t = useTranslation().skills;
  return countLabel(count, t.usedInOne, t.usedIn);
}

/** The project's stack as icons, the skill itself first and in colour. */
function ProjectStack({
  project,
  skill,
}: {
  project: ProjectMeta;
  skill: Skill;
}) {
  const labels = skillLabels(skill.name);
  const stack = project.technologies
    .filter((tech) => TECH_ICONS[tech])
    .map((tech) => ({
      tech,
      Icon: TECH_ICONS[tech],
      active: labels.includes(tech),
    }))
    .sort((a, b) => Number(b.active) - Number(a.active))
    .slice(0, STACK_MAX);

  return (
    <span aria-hidden="true" className="flex items-center gap-2 pt-1.5">
      {stack.map(({ tech, Icon, active }) => (
        <Icon
          key={tech}
          size={16}
          className={cn("size-4 shrink-0", !active && "opacity-60 grayscale")}
        />
      ))}
    </span>
  );
}

function ProjectItem({
  project,
  skill,
}: {
  project: ProjectMeta;
  skill: Skill;
}) {
  const t = useTranslation();
  const { title, tagline } = t.projects.list[project.i18nKey];
  const className =
    "flex min-w-0 flex-col gap-0.5 rounded-xl px-2.5 py-2 transition-colors can-hover:hover:bg-muted/60";
  const body = (
    <>
      <span className="flex min-w-0 items-baseline gap-3">
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
          {title}
        </span>
        <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
          {project.date.start.slice(0, 4)}
        </span>
      </span>
      <span className="truncate text-xs text-muted-foreground">{tagline}</span>
      <ProjectStack project={project} skill={skill} />
    </>
  );

  if (project.slug) {
    return (
      <Link to={`/projects/${project.slug}`} className={className}>
        {body}
      </Link>
    );
  }
  const href = project.link ?? project.github;
  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  );
}

function ProjectList({
  skill,
  projects,
  className,
}: {
  skill: Skill;
  projects: ProjectMeta[];
  className?: string;
}) {
  return (
    // Lenis would take the wheel for the page; the list scrolls itself
    <div
      data-lenis-prevent
      className={cn(
        "scroll-fade flex min-h-0 flex-col overflow-y-auto overscroll-contain",
        className,
      )}
    >
      {projects.map((project) => (
        <ProjectItem key={project.id} project={project} skill={skill} />
      ))}
    </div>
  );
}

function SkillCardBody({ skill }: { skill: Skill }) {
  const projects = projectsUsing(skill.name);
  const usedIn = useUsedIn(projects.length);

  return (
    <>
      <p className="px-2.5 pt-1.5 pb-1 text-xs text-muted-foreground">
        {usedIn}
      </p>
      <ProjectList skill={skill} projects={projects} className="max-h-96" />
    </>
  );
}

// ---- Desktop: one hover card for the page ----

const CARD_WIDTH = 320;
const CARD_GAP = 12; // between a row and its card
const VIEW_MARGIN = 16; // the card keeps this much viewport on every side
const OPEN_DELAY = 300; // a rest on a row before the card first appears
const SWITCH_DELAY = 100; // a hold on another row before the card moves there
const CLOSE_DELAY = 200; // after leaving the rows and the card
// the theme preview's move (theme-toggle.tsx): keep the two alike
const GLIDE = { duration: 0.2, ease: EASE_OUT } as const;

interface Point {
  x: number;
  y: number;
}

/** The row the card belongs to, and where it goes (document coordinates). */
interface Anchor {
  skill: Skill;
  row: HTMLElement;
  side: "left" | "right";
  x: number;
  centre: number;
  /** the visible range the card is kept inside */
  view: { top: number; bottom: number };
}

function anchorFor(skill: Skill, row: HTMLElement): Anchor {
  const rect = row.getBoundingClientRect();
  const fitsRight =
    rect.right + CARD_GAP + CARD_WIDTH <= window.innerWidth - VIEW_MARGIN;
  return {
    skill,
    row,
    side: fitsRight ? "right" : "left",
    x:
      window.scrollX +
      (fitsRight ? rect.right + CARD_GAP : rect.left - CARD_GAP - CARD_WIDTH),
    centre: window.scrollY + rect.top + rect.height / 2,
    view: {
      top: window.scrollY + VIEW_MARGIN,
      bottom: window.scrollY + window.innerHeight - VIEW_MARGIN,
    },
  };
}

const point = (event: { clientX: number; clientY: number }): Point => ({
  x: event.clientX,
  y: event.clientY,
});

const cross = (a: Point, b: Point, p: Point) =>
  (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);

function inTriangle(p: Point, a: Point, b: Point, c: Point) {
  const ab = cross(a, b, p);
  const bc = cross(b, c, p);
  const ca = cross(c, a, p);
  return (ab >= 0 && bc >= 0 && ca >= 0) || (ab <= 0 && bc <= 0 && ca <= 0);
}

function useTimer() {
  const id = useRef<number | undefined>(undefined);
  const clear = useCallback(() => window.clearTimeout(id.current), []);
  const start = useCallback((ms: number, fn: () => void) => {
    window.clearTimeout(id.current);
    id.current = window.setTimeout(fn, ms);
  }, []);
  useEffect(() => clear, [clear]);
  return useMemo(() => ({ start, clear }), [start, clear]);
}

/** What the rows report. A row with nothing to show settles the card away. */
interface Rows {
  /** the skill whose row the card is on */
  active: string | null;
  enter: (skill: Skill | null, row: HTMLElement, event: PointerEvent) => void;
  move: (skill: Skill | null, row: HTMLElement, event: PointerEvent) => void;
  leave: (row: HTMLElement, event: PointerEvent) => void;
}

const RowsContext = createContext<Rows | null>(null);

/**
 * The rows report the pointer; one card glides to the row it settles on and
 * cross-fades its projects, the way the theme menu's preview follows its
 * rows. The card sits beside the row, so the way into its far items crosses
 * the rows above or below, or leaves the rows altogether when the card
 * reaches past them: whatever is under that way waits, and the card is kept,
 * for as long as the pointer keeps heading for the card.
 */
export function SkillCards({
  enabled,
  children,
}: {
  enabled: boolean;
  children: ReactNode;
}) {
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const pending = useTimer();
  const closing = useTimer();
  // where the pointer left the active row: the apex of the way into the card
  const leftAt = useRef<Point | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  // the document listener that follows the pointer outside the rows
  const approach = useRef<(() => void) | null>(null);
  const endApproach = useCallback(() => {
    approach.current?.();
    approach.current = null;
  }, []);
  useEffect(() => endApproach, [endApproach]);

  const settle = useCallback(
    (next: Anchor | null) => {
      leftAt.current = null;
      endApproach();
      setAnchor(next);
    },
    [endApproach],
  );
  const hide = useCallback(() => settle(null), [settle]);

  /** whether the pointer is inside the way from the active row into the card */
  const heading = useCallback(
    (p: Point) => {
      const from = leftAt.current;
      const card = cardRef.current?.getBoundingClientRect();
      if (!anchor || !from || !card) return false;
      const edge = anchor.side === "right" ? card.left : card.right;
      return inTriangle(
        p,
        from,
        { x: edge, y: card.top },
        { x: edge, y: card.bottom },
      );
    },
    [anchor],
  );

  const rows = useMemo<Rows>(() => {
    const settleOn = (skill: Skill | null, row: HTMLElement) => () =>
      settle(skill ? anchorFor(skill, row) : null);
    return {
      active: anchor?.skill.name ?? null,
      enter(skill, row, event) {
        if (event.pointerType !== "mouse") return;
        closing.clear();
        if (row === anchor?.row) pending.clear();
        else
          pending.start(
            anchor ? SWITCH_DELAY : OPEN_DELAY,
            settleOn(skill, row),
          );
      },
      move(skill, row, event) {
        if (!anchor || row === anchor.row) return;
        if (heading(point(event)))
          pending.start(SWITCH_DELAY, settleOn(skill, row));
      },
      leave(row, event) {
        pending.clear();
        if (row === anchor?.row) leftAt.current = point(event);
      },
    };
  }, [anchor, pending, closing, settle, heading]);

  const leaveRows = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    closing.start(CLOSE_DELAY, hide);
    if (!heading(point(event))) return;
    const follow = (move: globalThis.PointerEvent) => {
      if (heading(point(move))) closing.start(CLOSE_DELAY, hide);
    };
    endApproach();
    document.addEventListener("pointermove", follow);
    approach.current = () =>
      document.removeEventListener("pointermove", follow);
  };

  return (
    <RowsContext.Provider value={rows}>
      {/* the portal'd card is a child, so leaving means leaving both */}
      <div
        onPointerEnter={(event) => {
          if (event.pointerType !== "mouse") return;
          closing.clear();
          endApproach();
        }}
        onPointerLeave={leaveRows}
      >
        {children}
        {enabled
          ? createPortal(
              <AnimatePresence>
                {anchor ? (
                  <SkillCard
                    key="skill-card"
                    ref={cardRef}
                    anchor={anchor}
                    onPointerEnter={() => {
                      leftAt.current = null;
                    }}
                  />
                ) : null}
              </AnimatePresence>,
              document.body,
            )
          : null}
      </div>
    </RowsContext.Provider>
  );
}

function SkillCard({
  ref,
  anchor,
  onPointerEnter,
}: {
  ref: Ref<HTMLDivElement>;
  anchor: Anchor;
  onPointerEnter: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(anchor.x);
  const y = useMotionValue(anchor.centre);
  const height = useMotionValue(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const placedAt = useRef<Anchor | null>(null);

  useLayoutEffect(() => {
    const h = contentRef.current?.offsetHeight ?? 0;
    const top = Math.max(
      anchor.view.top,
      Math.min(anchor.centre - h / 2, anchor.view.bottom - h),
    );
    // a first placement is not a move, nor is a re-run for the same row (a
    // StrictMode remount rewinds the values to their initials)
    const moved = placedAt.current !== null && placedAt.current !== anchor;
    if (moved && !reducedMotion) {
      animate(x, anchor.x, GLIDE);
      animate(y, top, GLIDE);
      animate(height, h, GLIDE);
    } else {
      x.jump(anchor.x);
      y.jump(top);
      height.jump(h);
    }
    placedAt.current = anchor;
  }, [anchor, reducedMotion, x, y, height]);

  return (
    <motion.div
      ref={ref}
      style={{
        x,
        y,
        width: CARD_WIDTH,
        transformOrigin:
          anchor.side === "right" ? "left center" : "right center",
      }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={GLIDE}
      className="absolute top-0 left-0 z-50"
      onPointerEnter={onPointerEnter}
    >
      <motion.div
        style={{ height }}
        className="overflow-clip rounded-2xl bg-popover text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 dark:ring-foreground/10"
      >
        <div ref={contentRef} className="relative p-1.5">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={anchor.skill.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={GLIDE}
            >
              <SkillCardBody skill={anchor.skill} />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * A row of the desktop list: an openable one shows the page's hover card for
 * its skill, any other settles it away. A click does nothing.
 */
export function SkillCardTrigger({
  skill,
  openable,
  className,
  children,
}: {
  skill: Skill;
  openable: boolean;
  className?: string;
  children: ReactNode;
}) {
  const rows = useContext(RowsContext);
  if (!rows) throw new Error("SkillCardTrigger needs SkillCards");
  const shows = openable ? skill : null;

  return (
    <div
      data-active={rows.active === skill.name ? "" : undefined}
      className={className}
      onPointerEnter={(event) => rows.enter(shows, event.currentTarget, event)}
      onPointerMove={(event) => rows.move(shows, event.currentTarget, event)}
      onPointerLeave={(event) => rows.leave(event.currentTarget, event)}
    >
      {children}
    </div>
  );
}

/** Phones: one drawer for the page, showing whichever skill was tapped. */
export function SkillDrawer({
  skill,
  open,
  onOpenChange,
}: {
  skill: Skill;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const popupRef = useRef<HTMLDivElement>(null);
  const t = useTranslation().skills;
  const projects = projectsUsing(skill.name);
  const usedIn = useUsedIn(projects.length);
  useWindowScrollLock(open);

  return (
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
      <DrawerContent ref={popupRef} initialFocus={popupRef}>
        <DrawerHeader className="items-center gap-1.5 pt-3">
          <SkillTile skill={skill} className="mb-1 size-14 rounded-2xl" />
          <DrawerTitle className="text-lg">{skill.name}</DrawerTitle>
          <DrawerDescription>
            {t.levels[skill.level]} · {usedIn}
          </DrawerDescription>
        </DrawerHeader>
        <ProjectList
          skill={skill}
          projects={projects}
          className="flex-1 px-2 pt-3 pb-8"
        />
      </DrawerContent>
    </Drawer>
  );
}
