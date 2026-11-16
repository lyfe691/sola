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
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { animate, motion, useMotionValue } from "motion/react";
import { useGlidePill } from "@/components/ui/custom/glide-pill";
import { MorphArrow } from "@/components/ui/custom/morph-arrow";
import {
  NAV_MENUS,
  NAV_PANEL_WIDTH,
  NAV_PROJECTS,
  type NavMenuKey,
} from "@/config/nav-menu";
import { PROJECTS } from "@/config/projects";
import { OFFERINGS, cardImage, type Shot } from "@/config/services";
import { useTranslation } from "@/lib/language-provider";
import { Link } from "@/lib/locale-router";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/utils/transitions";

/** The panel's one move: to a new link, and to that menu's size. */
const MORPH = { duration: 0.25, ease: EASE_OUT } as const;

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
      to: "/services",
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
      data-nav-layer={menu}
      inert={!shown}
      onKeyDown={onKeyDown}
      className={cn(
        // the menu on show is in the flow and gives the panel its height
        "top-0 left-0 flex w-(--panel-w) transition-opacity duration-200 ease-out",
        shown
          ? "relative opacity-100"
          : "pointer-events-none absolute opacity-0",
      )}
      style={{ "--panel-w": `${NAV_PANEL_WIDTH}px` } as CSSProperties}
    >
      <div
        ref={list}
        className="relative isolate flex w-60 shrink-0 flex-col p-2"
      >
        {glide.pill}
        {entries.map((entry, index) => (
          <Link
            key={entry.key}
            to={entry.to}
            onClick={onNavigate}
            onPointerEnter={(event) => pick(index, event.currentTarget)}
            onFocus={(event) => pick(index, event.currentTarget)}
            className="flex flex-col gap-1 rounded-xl px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <span className="truncate text-sm font-medium text-foreground">
              {entry.title}
            </span>
            <span className="line-clamp-2 text-xs leading-snug text-foreground/60">
              {entry.line}
            </span>
          </Link>
        ))}
        <Link
          to={to}
          onClick={onNavigate}
          className="mt-auto flex items-center gap-1 rounded-xl px-4 py-3 text-sm font-medium text-foreground/60 outline-none transition-colors duration-200 ease-out hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          {t.nav.viewAll}
          <MorphArrow />
        </Link>
      </div>
      <div className="flex min-h-76 flex-1 p-3 pl-1">
        <div
          aria-hidden="true"
          className="relative flex-1 overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/10"
        >
          {entries.map((entry, index) => (
            <img
              key={entry.key}
              src={cardImage(entry.shot.image)}
              alt=""
              decoding="async"
              className={cn(
                "absolute inset-0 size-full object-cover object-top-left transition-opacity duration-300 ease-out",
                index === active ? "opacity-100" : "opacity-0",
              )}
            />
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
    const from = last.current;
    last.current = { menu, height: layer.offsetHeight };
    if (!from) return;
    const moves = [animate(left, x, MORPH)];
    const box = surface.current;
    if (box && from.menu !== menu) {
      // the height is the menu's own until it has to move: then it is
      // written to the element frame by frame, and handed back at the end
      const write = (value: number) =>
        box.style.setProperty("--surface-h", `${value}px`);
      write(from.height);
      moves.push(
        animate(from.height, layer.offsetHeight, {
          ...MORPH,
          onUpdate: write,
          onComplete: () => box.style.removeProperty("--surface-h"),
        }),
      );
    }
    return () => moves.forEach((move) => move.stop());
  }, [menu, x, left]);

  return (
    <motion.div
      data-nav-menu
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      // from the links' foot, so the pointer crosses no gap on its way down
      className="absolute top-12 left-0 z-10 pt-2"
      style={{ x: left }}
    >
      <motion.div
        ref={surface}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.15, ease: EASE_OUT }}
        className="relative h-(--surface-h) origin-top-left overflow-hidden rounded-2xl bg-background shadow-2xl ring-1 shadow-black/15 ring-foreground/10"
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
