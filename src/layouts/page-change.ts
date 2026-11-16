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
 * One piece is carried across: the title, between two pages that share the
 * site's frame (whose bar never changes with the page, so it is cut from the
 * picture and stays live). It is lifted out of the picture to hold its place
 * over the fading page until the next page is in, then travels to where its
 * successor stands while that one takes over.
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
  /** both pages stand in the site's frame, under the same bar */
  framed: boolean;
  /** the element of the page on screen */
  shell: HTMLElement | null;
  /** the address bar still shows the page asked for: none newer is coming */
  current: () => boolean;
  /** the chunk of the page asked for is in */
  loaded: Promise<unknown>;
};

const ROUTE = ["from-x", "from-y", "to-x", "to-y", "scale"];
/** what a change puts on the root for the CSS, and takes off when it ends */
const ROOT_PROPERTIES = [
  "--page-bar",
  ...ROUTE.map((part) => `--page-title-${part}`),
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

/**
 * The page's title, when all of it stands in the window. A title that is
 * read and not shown (sr-only) takes no room, and is nothing to carry: its
 * neighbour's title would fly to that point and shrink away.
 */
function titleInWindow() {
  const title = document.querySelector<HTMLElement>("#main h1");
  if (!title?.innerText.trim()) return null;
  const { top, bottom, width, height } = title.getBoundingClientRect();
  if (width <= 1 || height <= 1) return null;
  return top >= 0 && bottom <= window.innerHeight ? title : null;
}

/** A carried title is drawn over everything, so it must have had nothing over it. */
function uncovered(title: HTMLElement) {
  const { left, top, height } = title.getBoundingClientRect();
  const over = document.elementFromPoint(left + 1, top + height / 2);
  return over !== null && title.contains(over);
}

/** Where the title sets off and where it lands, for the CSS that moves it. */
function route(on: HTMLElement, from: DOMRect, to: DOMRect, scale: number) {
  const values = [from.left, from.top, to.left, to.top].map((px) => `${px}px`);
  [...values, `${scale}`].forEach((value, index) =>
    on.style.setProperty(`--page-title-${ROUTE[index]}`, value),
  );
}

/**
 * The arriving title itself sets off from where the old one stood. Its
 * route rides on the element: it outlives a change whose picture is gone
 * before the travel ends.
 */
function arrive(title: HTMLElement, from: DOMRect, to: DOMRect, scale: number) {
  route(title, from, to, scale);
  title.dataset.pageTitle = "in";
  const landed = () => {
    delete title.dataset.pageTitle;
    for (const part of ROUTE)
      title.style.removeProperty(`--page-title-${part}`);
  };
  Promise.allSettled(
    title.getAnimations().map((animation) => animation.finished),
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
 * title is a picture of its own, held over the page. Touch devices go
 * without (iOS WebKit draws a named snapshot offset): there the old title
 * fades with its page and only the arriving one travels.
 */
function clear(
  show: () => void,
  { framed, shell, current, loaded }: Leaving,
  lifted: boolean,
) {
  const root = document.documentElement;
  root.dataset.pageChange = "leave";
  root.style.setProperty("--page-bar", `${framed && lifted ? barEdge() : 0}px`);

  const oldTitle = framed ? titleInWindow() : null;
  const titleFrom =
    oldTitle && uncovered(oldTitle) ? oldTitle.getBoundingClientRect() : null;
  const picture = lifted && titleFrom ? oldTitle : null;
  if (picture && titleFrom) {
    picture.dataset.pageTitle = "out";
    // until a successor is measured the picture's route ends where it
    // starts: left unset, the travel's last keyframe has no transform and
    // the picture slides to the window's corner as it fades
    route(root, titleFrom, titleFrom, 1);
  }

  const change: Change = {
    swappedAt: null,
    transition: document.startViewTransition(() => {
      // the root steps out, and the page under the picture goes dark: what
      // the picture uncovers before the next page is in is the bare frame
      root.dataset.pageChange = "clear";
      if (shell) shell.dataset.pageLeft = "";
      // photographed: still named, the title would be taken again as its own
      // successor, and the transition dropped when it unmounts
      if (picture) delete picture.dataset.pageTitle;
    }),
  };

  // the old title lets go: with its successor, or alone when that one is
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
    // the old title is still there to take over from. Unlifted, it has
    // gone with the picture, and the change may be over: the arriving one
    // sets off from the old place for as long as a lifted title would wait
    const held = lifted
      ? running === change && root.dataset.pageChange === "clear"
      : (running === change || running === null) &&
        performance.now() - startedAt < PAGE_CARRY_HOLD;
    flushSync(show);
    change.swappedAt = performance.now();
    // asked for and taken back before it went in: the page never left
    if (shell?.isConnected) delete shell.dataset.pageLeft;

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
      if (lifted) route(root, titleFrom, rest, scale);
      arrive(title, titleFrom, rest, scale);
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
