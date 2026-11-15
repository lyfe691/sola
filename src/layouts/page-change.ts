/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Runs a page change as a view transition (CSS in index.css, "page change").
 * The window is photographed with the old page in it and the photograph
 * starts to fade at once. The next page goes in under the picture a beat
 * later and builds through the reveal queue: mounting it blocks the main
 * thread, which the fade, on the compositor, does not need. Only the page
 * that leaves is ever a picture, so the one arriving answers from its first
 * frame.
 *
 * Two pieces are carried across, each lifted out of the picture to hold its
 * place over the fading page until the next page is in, then travelling to
 * where its successor stands while that one takes over:
 *   - the title, between two pages that share the site's frame (whose bar
 *     never changes with the page, so it is cut from the picture and stays
 *     live);
 *   - a project's cover, between its card and its deep dive's hero.
 */

import { flushSync } from "react-dom";
import { revealNow, skipReveal } from "@/lib/reveal";
import {
  PAGE_BEAT,
  PAGE_CARRY_HOLD,
  PAGE_HANDOVER,
  PAGE_HOLD,
  PAGE_TITLE_LEAD,
} from "@/utils/transitions";

type Change = {
  transition: ViewTransition;
  /** when the next page went in (performance.now() ms) */
  swappedAt: number | null;
  /** put the next page in, if the picture is up and it has not gone in yet */
  swap?: () => void;
};

type Leaving = {
  /** the page on screen and the one asked for (site paths, or the code view) */
  from: string;
  to: string;
  /** both pages stand in the site's frame, under the same bar */
  framed: boolean;
  /** the element of the page on screen */
  shell: HTMLElement | null;
  /** the address bar still shows the page asked for: none newer is coming */
  current: () => boolean;
  /** the chunk of the page asked for is in */
  loaded: Promise<unknown>;
};

/** a piece carried across: the data attribute that marks it, out and in */
type Piece = "title" | "cover";
const MARK = { title: "pageTitle", cover: "pageCover" } as const;

const ROUTE = ["from-x", "from-y", "to-x", "to-y", "scale"];
/** what a change puts on the root for the CSS, and takes off when it ends */
const ROOT_PROPERTIES = [
  "--page-bar",
  ...Object.keys(MARK).flatMap((piece) =>
    ROUTE.map((part) => `--page-${piece}-${part}`),
  ),
];

let running: Change | null = null;
let settle: (() => void) | undefined;

const matches = (query: string) => window.matchMedia(query).matches;

/** How far down the window the site's bar reaches (px); 0 without one. */
const barEdge = () =>
  Math.max(
    0,
    ...Array.from(
      document.querySelectorAll("[data-nav-bar]"),
      (bar) => bar.getBoundingClientRect().bottom,
    ),
  );

/** The page's title, when all of it stands in the window. */
function titleInWindow() {
  const title = document.querySelector<HTMLElement>("#main h1");
  if (!title?.innerText.trim()) return null;
  const { top, bottom } = title.getBoundingClientRect();
  return top >= 0 && bottom <= window.innerHeight ? title : null;
}

/** A carried title is drawn over everything, so it must have had nothing over it. */
function uncovered(title: HTMLElement) {
  const { left, top, height } = title.getBoundingClientRect();
  const over = document.elementFromPoint(left + 1, top + height / 2);
  return over !== null && title.contains(over);
}

/** The project whose deep dive is one side of the change, and which side. */
function deepDive(from: string, to: string) {
  const slug = (path: string) => /^\/projects\/([^/]+)$/.exec(path)?.[1];
  const [leaving, arriving] = [slug(from), slug(to)];
  if (arriving && !leaving) return { card: arriving, opens: true };
  if (leaving && !arriving) return { card: leaving, opens: false };
  return null;
}

/** A cover (a project's card, or "hero"), when some of it is in the window. */
function coverInWindow(name: string) {
  const cover = document.querySelector<HTMLElement>(
    `[data-cover="${CSS.escape(name)}"]`,
  );
  if (!cover) return null;
  const { top, bottom } = cover.getBoundingClientRect();
  return bottom > 0 && top < window.innerHeight ? cover : null;
}

/** Where a piece sets off and where it lands, for the CSS that moves it. */
function route(
  on: HTMLElement,
  piece: Piece,
  from: DOMRect,
  to: DOMRect,
  scale: number,
) {
  const values = [from.left, from.top, to.left, to.top].map((px) => `${px}px`);
  [...values, `${scale}`].forEach((value, index) =>
    on.style.setProperty(`--page-${piece}-${ROUTE[index]}`, value),
  );
}

/**
 * The arriving piece itself sets off from where the old one stood. Its
 * route rides on the element: it outlives a change whose picture is gone
 * before the travel ends.
 */
function arrive(
  piece: Piece,
  element: HTMLElement,
  from: DOMRect,
  to: DOMRect,
  scale: number,
) {
  route(element, piece, from, to, scale);
  element.dataset[MARK[piece]] = "in";
  const landed = () => {
    delete element.dataset[MARK[piece]];
    for (const part of ROUTE)
      element.style.removeProperty(`--page-${piece}-${part}`);
  };
  Promise.allSettled(
    element.getAnimations().map((animation) => animation.finished),
  ).then(landed);
}

/** The page now in the document has its content, not a fallback. */
export function pageSettled() {
  settle?.();
}

/**
 * Reduced motion: the whole window dissolves from the old page to the new,
 * the way a theme switch does. The next page goes in while the picture is
 * held, so the picture waits, briefly, for a chunk still on its way.
 */
function dissolve(show: () => void) {
  delete document.documentElement.dataset.pageChange;
  const change: Change = {
    swappedAt: null,
    transition: document.startViewTransition(async () => {
      const settled = new Promise<void>((resolve) => {
        settle = resolve;
      });
      flushSync(show);
      change.swappedAt = performance.now();
      await Promise.race([
        settled,
        new Promise((resolve) => setTimeout(resolve, PAGE_HOLD)),
      ]);
      revealNow();
    }),
  };
  return change;
}

/**
 * The picture fades while the next page is rendered. `lifted`: the carried
 * pieces are pictures of their own, held over the page. Touch devices go
 * without (iOS WebKit draws a named snapshot offset): there the old piece
 * fades with its page and only the arriving one travels.
 */
function clear(
  show: () => void,
  { from, to, framed, shell, current, loaded }: Leaving,
  lifted: boolean,
) {
  const root = document.documentElement;
  root.dataset.pageChange = "leave";
  root.style.setProperty("--page-bar", `${framed && lifted ? barEdge() : 0}px`);

  const oldTitle = framed ? titleInWindow() : null;
  const titleFrom =
    oldTitle && uncovered(oldTitle) ? oldTitle.getBoundingClientRect() : null;
  const project = deepDive(from, to);
  const oldCover =
    project && coverInWindow(project.opens ? project.card : "hero");
  const coverFrom = oldCover?.getBoundingClientRect() ?? null;
  const pictures: [Piece, HTMLElement][] = [];
  if (lifted && oldTitle && titleFrom) pictures.push(["title", oldTitle]);
  if (lifted && oldCover) pictures.push(["cover", oldCover]);
  for (const [piece, element] of pictures) element.dataset[MARK[piece]] = "out";

  const change: Change = {
    swappedAt: null,
    transition: document.startViewTransition(() => {
      // the root steps out, and the page under the picture goes dark: what
      // the picture uncovers before the next page is in is the bare frame
      root.dataset.pageChange = "clear";
      if (shell) shell.style.visibility = "hidden";
      // photographed: still named, a piece would be taken again as its own
      // successor, and the transition dropped when it unmounts
      for (const [piece, element] of pictures)
        delete element.dataset[MARK[piece]];
    }),
  };

  // the old pieces let go: with their successors, or alone when those are
  // still not in after PAGE_CARRY_HOLD
  const release = () => {
    if (running === change && root.dataset.pageChange === "clear")
      root.dataset.pageChange = "build";
  };

  const startedAt = performance.now();
  let up = false;
  let ready = false;
  const swap = (late = false) => {
    if (!up || change.swappedAt !== null) return;
    // The address has moved on and React has yet to follow: that page will
    // be asked for in a moment, and mounting this one would only hold it up.
    // Nor is a page mounted before its chunk is in: it would go in empty.
    // Neither for ever: something else may have moved the address
    if (!late && !(ready && current())) return;
    // the old pieces are still there to take over from. Unlifted, they have
    // gone with the picture, and the change may be over: the arriving ones
    // set off from the old place for as long as a lifted piece would wait
    const held = lifted
      ? running === change && root.dataset.pageChange === "clear"
      : (running === change || running === null) &&
        performance.now() - startedAt < PAGE_CARRY_HOLD;
    flushSync(show);
    change.swappedAt = performance.now();
    // asked for and taken back before it went in: the page never left
    if (shell?.isConnected) shell.style.visibility = "";

    // hit-testing cannot say what lies over a page that has just gone in:
    // a title on a page that lands at its top is clear of the bar
    const title =
      titleFrom && held && window.scrollY === 0 ? titleInWindow() : null;
    let travels = false;
    if (titleFrom && title) {
      // the travel is its entrance, and ends where the title rests: the
      // block it is, or is in, must not be rising under it
      const block = title.closest("[data-reveal]");
      if (block) skipReveal(block);
      const rest = title.getBoundingClientRect();
      const scale = rest.height / titleFrom.height;
      travels =
        Math.abs(rest.top - titleFrom.top) +
          Math.abs(rest.left - titleFrom.left) >
        1;
      if (lifted) route(root, "title", titleFrom, rest, scale);
      arrive("title", title, titleFrom, rest, scale);
    }

    const cover =
      project && coverFrom && held
        ? coverInWindow(project.opens ? "hero" : project.card)
        : null;
    if (project && coverFrom && cover) {
      const block = cover.closest("[data-reveal]");
      if (block) skipReveal(block);
      const rest = cover.getBoundingClientRect();
      const scale = rest.width / coverFrom.width;
      if (lifted) route(root, "cover", coverFrom, rest, scale);
      // a card clips its cover, so only the hero grows out of the old place:
      // going back, the hero's picture alone shrinks onto the card
      if (project.opens) arrive("cover", cover, coverFrom, rest, scale);
    }

    release();
    // a title on its way crosses the page under it: the blocks hold back
    // until it is most of the way to its place
    revealNow(travels ? PAGE_TITLE_LEAD : 0);
  };
  change.swap = swap;

  const arm = () => {
    ready = true;
    swap();
  };
  loaded.then(arm, arm);
  change.transition.ready.then(
    () => {
      setTimeout(() => {
        up = true;
        swap();
      }, PAGE_BEAT);
      setTimeout(() => swap(true), PAGE_HOLD);
      setTimeout(release, PAGE_CARRY_HOLD);
    },
    // no picture was taken (the tab is hidden): the page is simply swapped
    () => {
      up = true;
      swap(true);
    },
  );
  return change;
}

/**
 * Show the next page. `show` is the state update that puts the latest page
 * asked for in the document.
 */
export function changePage(show: () => void, leaving: Leaving) {
  if (!document.startViewTransition) {
    show();
    return;
  }
  if (running) {
    // The next page is not in yet: when it goes in, it will be this one.
    // Not from here: this is an effect, where React cannot flush a render
    if (running.swappedAt === null) {
      if (running.swap) queueMicrotask(running.swap);
      return;
    }
    // nothing of the page under the picture is legible yet, so it is
    // replaced unseen
    if (performance.now() - running.swappedAt < PAGE_HANDOVER) {
      show();
      return;
    }
  }

  const root = document.documentElement;
  for (const property of ROOT_PROPERTIES) root.style.removeProperty(property);
  const change = matches("(prefers-reduced-motion: reduce)")
    ? dissolve(show)
    : clear(show, leaving, matches("(hover: hover) and (pointer: fine)"));
  running = change;
  const done = () => {
    // a newer change that cut this one short owns the root now
    if (running !== change) return;
    running = null;
    delete root.dataset.pageChange;
    for (const property of ROOT_PROPERTIES) root.style.removeProperty(property);
  };
  change.transition.finished.then(done, done);
}
