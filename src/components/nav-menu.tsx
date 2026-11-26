/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The panel a bar link opens, after x.ai's: what is behind the link on the
 * left, and a picture of whichever entry the pointer or the keyboard is on to
 * the right. There is one panel for every menu. Moving from one link to the
 * next keeps it open: it travels to the new link and takes the new menu's
 * size in one move, while the two menus cross-fade inside it.
 */

import {
  Suspense,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { useGlidePill } from "@/components/ui/custom/glide-pill";
import { MorphArrow } from "@/components/ui/custom/morph-arrow";
import {
  NAV_MENUS,
  NAV_PANEL_WIDTH,
  NAV_PROJECTS,
  type NavMenuKey,
} from "@/config/nav-menu";
import { PROJECTS } from "@/config/projects";
import {
  LazyShotWindow,
  loadBrowserWindow,
  loadShotWindow,
  loadTerminalReplay,
} from "@/components/windows/lazy";
import { OFFERINGS, type Shot } from "@/config/services";
import { whenIdle } from "@/lib/idle";
import { useTranslation } from "@/lib/language-provider";
import { Link } from "@/lib/locale-router";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/utils/transitions";

/** The panel's one move: to a new link, and to that menu's size. */
const MORPH = { duration: 0.25, ease: EASE_OUT } as const;

// the previews' windows are chunks of their own: fetched once the page is
// idle, they are in before a menu is first opened. Only where a menu can
// open: a touch screen gets the bar without its panels
if (
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches
)
  whenIdle(() => {
    void loadShotWindow();
    void loadBrowserWindow();
    void loadTerminalReplay();
  });

/** A preview is drawn about this wide, whatever the window. */
const PREVIEW_SIZES = "420px";
/** Drawn as a window this wide, in px: about the preview's own width, so
 *  the bar and a terminal's text are close to their real size. */
const PREVIEW_NOMINAL = 480;

const MENU_PATHS = Object.entries(NAV_MENUS).flatMap(([path, key]) =>
  key ? [{ path, key }] : [],
);

interface Entry {
  key: string;
  to: string;
  title: string;
  line: string;
  shot: Shot;
}

function useEntries(menu: NavMenuKey): Entry[] {
  const t = useTranslation();
  if (menu === "services")
    return OFFERINGS.map(({ key, proof }) => ({
      key,
      to: `/services#${key}`,
      title: t.services.page.offerings[key].name,
      line: t.services.page.offerings[key].line,
      shot: proof[0],
    }));
  return NAV_PROJECTS.flatMap((shot) => {
    const project = PROJECTS.find(({ id }) => id === shot.project);
    if (!project) return [];
    const copy = t.projects.list[project.i18nKey];
    return {
      key: project.id,
      to: `/projects/${project.id}`,
      title: copy.title,
      line: copy.tagline,
      shot,
    };
  });
}

/** One menu: its entries, the way to the whole page, and the picture. */
function Menu({
  menu,
  to,
  shown,
  onNavigate,
  onTabOut,
}: {
  menu: NavMenuKey;
  to: string;
  shown: boolean;
  onNavigate: () => void;
  /** Tab past either end of the menu: back to its link, or on along the bar. */
  onTabOut: (menu: NavMenuKey, forward: boolean) => void;
}) {
  const t = useTranslation();
  const entries = useEntries(menu);
  const [active, setActive] = useState(0);
  // one fill for the list, gliding to the entry on show
  const glide = useGlidePill();
  const list = useRef<HTMLDivElement>(null);
  const pick = (index: number, row: HTMLElement) => {
    setActive(index);
    glide.moveTo(row);
  };
  const place = glide.moveTo;
  useLayoutEffect(() => {
    const first = list.current?.querySelector<HTMLElement>("a");
    if (first) place(first);
    // once, on the entry a menu opens with
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const links = Array.from(event.currentTarget.querySelectorAll("a"));
    const edge = event.shiftKey ? links[0] : links[links.length - 1];
    if (event.target !== edge) return;
    event.preventDefault();
    onTabOut(menu, !event.shiftKey);
  };

  return (
    <div
      id={`desktop-nav-${menu}`}
      data-nav-layer={menu}
      inert={!shown}
      onKeyDown={onKeyDown}
      className={cn(
        // the menu on show is in the flow and gives the panel its height
        "top-0 left-0 flex max-h-(--nav-menu-max-h) w-(--panel-w) transition-opacity duration-200 ease-out",
        shown
          ? "relative opacity-100"
          : "pointer-events-none absolute opacity-0",
      )}
      style={{ "--panel-w": `${NAV_PANEL_WIDTH}px` } as CSSProperties}
    >
      <div
        data-lenis-prevent
        className="w-64 shrink-0 overflow-y-auto overscroll-contain"
      >
        <div
          ref={list}
          className="relative isolate flex min-h-full flex-col p-2.5"
        >
          {glide.pill}
          <p className="px-3.5 pt-2 pb-3 text-xs font-medium text-muted-foreground">
            {t.nav[menu]}
          </p>
          {entries.map((entry, index) => (
            <Link
              key={entry.key}
              to={entry.to}
              onClick={onNavigate}
              onPointerEnter={(event) => pick(index, event.currentTarget)}
              onFocus={(event) => pick(index, event.currentTarget)}
              className="flex flex-col gap-1.5 rounded-xl px-3.5 py-3 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <span className="truncate text-sm font-medium text-foreground">
                {entry.title}
              </span>
              <span className="line-clamp-2 text-xs leading-relaxed text-foreground/60">
                {entry.line}
              </span>
            </Link>
          ))}
          <div className="mt-auto pt-2">
            <div aria-hidden="true" className="mx-3.5 mb-2 h-px bg-border/70" />
            <Link
              to={to}
              onClick={onNavigate}
              className="flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground/70 outline-none transition-colors duration-150 ease-out hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              {t.nav.viewAll}
              <MorphArrow />
            </Link>
          </div>
        </div>
      </div>
      {/* Subtract the preview inset from the menu radius to align the corners. */}
      <div className="flex min-h-(--nav-menu-preview-min-h) flex-1 p-2 pl-0 [--nav-menu-preview-min-h:min(var(--spacing)*80,var(--nav-menu-max-h))] [--window-fit:calc(var(--radius)*1.8_-_var(--spacing)*2)]">
        <div aria-hidden="true" className="relative flex-1">
          {entries.map((entry, index) => (
            <div
              key={entry.key}
              className={cn(
                "absolute inset-0 transition-opacity duration-200 ease-out",
                index === active ? "opacity-100" : "opacity-0",
              )}
            >
              <Suspense>
                <LazyShotWindow
                  shot={entry.shot}
                  sizes={PREVIEW_SIZES}
                  eager
                  nominal={PREVIEW_NOMINAL}
                  fill
                  playing={shown && index === active}
                />
              </Suspense>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function NavPanel({
  menu,
  x,
  onNavigate,
  onTabOut,
  onPointerEnter,
  onPointerLeave,
}: {
  menu: NavMenuKey;
  /** Left edge, in px from the bar's content box. */
  x: number;
  onNavigate: () => void;
  onTabOut: (menu: NavMenuKey, forward: boolean) => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const surface = useRef<HTMLDivElement>(null);
  const left = useMotionValue(x);
  const last = useRef<{ menu: NavMenuKey; height: number } | null>(null);
  // a menu is built the first time it is opened, and kept for the way back
  const [seen, setSeen] = useState<NavMenuKey[]>([menu]);
  if (!seen.includes(menu)) setSeen([...seen, menu]);

  // before the paint: from the menu that was on show to the one that is now
  useLayoutEffect(() => {
    const layer = surface.current?.querySelector<HTMLElement>(
      `[data-nav-layer="${menu}"]`,
    );
    if (!layer) return;
    const box = surface.current;
    const from = last.current;
    last.current = { menu, height: layer.offsetHeight };
    if (!box) return;
    if (reducedMotion) {
      left.set(x);
      box.style.removeProperty("--surface-h");
      return;
    }
    if (!from) return;
    const moves = [animate(left, x, MORPH)];
    if (from.menu !== menu) {
      // the height is the menu's own until it has to move: then it is
      // written to the element frame by frame, and handed back at the end.
      // A move cut short leaves its last height written, and the next one
      // starts from there, not from the full height of the menu it left
      const write = (value: number) =>
        box.style.setProperty("--surface-h", `${value}px`);
      const start = box.style.getPropertyValue("--surface-h")
        ? box.offsetHeight
        : from.height;
      write(start);
      moves.push(
        animate(start, layer.offsetHeight, {
          ...MORPH,
          onUpdate: write,
          onComplete: () => box.style.removeProperty("--surface-h"),
        }),
      );
    }
    return () => moves.forEach((move) => move.stop());
  }, [menu, x, left, reducedMotion]);

  return (
    <motion.div
      data-nav-menu
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      // Bridge the gap from the links to the panel and leave the same gap below it.
      className="pointer-events-auto absolute top-(--nav-menu-top) left-0 z-10 pt-(--nav-menu-gap) [--nav-menu-gap:--spacing(3)] [--nav-menu-max-h:max(0px,calc(100dvh_-_var(--nav-menu-top)_-_2*var(--nav-menu-gap)))] [--nav-menu-top:--spacing(12)]"
      style={{ x: left }}
    >
      <motion.div
        ref={surface}
        initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.99 }}
        transition={{ duration: 0.15, ease: EASE_OUT }}
        className="relative h-(--surface-h) max-h-(--nav-menu-max-h) origin-top-left overflow-hidden rounded-2xl bg-background shadow-2xl ring-1 shadow-black/15 ring-foreground/10"
      >
        {MENU_PATHS.filter(({ key }) => seen.includes(key)).map(
          ({ path, key }) => (
            <Menu
              key={key}
              menu={key}
              to={path}
              shown={key === menu}
              onNavigate={onNavigate}
              onTabOut={onTabOut}
            />
          ),
        )}
      </motion.div>
    </motion.div>
  );
}
