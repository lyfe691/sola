/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigationType } from "react-router";
import { useCodeView } from "@/components/deploy-diff/code-view-provider";
import { preloadRoute, resolveLayout } from "@/config/routes";
import { splitLocale } from "@/lib/locale";
import { preloadable } from "@/lib/preloadable";
import { getLenis, snapScrollTo } from "@/utils/scroll";
import { changePage, pageSettled } from "./page-change";

// lazy like the route pages — the diff renderer (and shiki behind it) only
// loads once someone actually flips the mode on
const { load: loadCodeView, Component: CodeView } = preloadable(() =>
  import("@/components/deploy-diff/CodeView").then((m) => ({
    default: m.CodeView,
  })),
);

const CODE_VIEW = "code-view";

type Page = {
  id: string;
  node: ReactNode;
  /** a change brought it: the page a visit opens on is simply there */
  arrives?: boolean;
};

/** Lands its page: runs once the page is in the document, before it is painted. */
function Arrival({
  codeView,
  land,
}: {
  codeView: boolean;
  land: (codeView: boolean) => void;
}) {
  useLayoutEffect(() => land(codeView), [land, codeView]);
  return null;
}

/** Sits behind the page in its Suspense: in the document once the page is. */
function Settled() {
  useLayoutEffect(pageSettled, []);
  return null;
}

const scrollNow = () => getLenis()?.scroll ?? window.scrollY;

// One shell for every page change: a route change and the code view taking
// the page over (or handing it back) both swap the keyed child, so they are
// the same transition. The shell keeps the page it has until changePage
// swaps in the next one, and the window only moves in that same commit,
// with the page that leaves already a picture over it: nothing is ever seen
// scrolling away, and the next page is first seen where it belongs.
const PageShell = ({ children }: { children: ReactNode }) => {
  const { pathname, key } = useLocation();
  const returning = useNavigationType() === "POP";
  const { active, setActive } = useCodeView();

  useEffect(() => {
    void preloadRoute(pathname);
  }, [pathname]);
  useEffect(() => {
    if (active) void loadCodeView();
  }, [active]);

  // Where a page is put back, in two cases. `resume`: the page under the
  // code view comes back where it was left, held from the moment the view
  // opens. `left`: going back or forward returns each history entry to where
  // it was left, for as long as the visit lasts (a reload starts at the top).
  const resume = useRef<number | null>(null);
  const left = useRef(new Map<string, number>());
  const at = useRef({ pathname, key, active });
  // the entry now arriving, and whether the history brought it back
  const arriving = useRef({ key, returning });
  useEffect(() => {
    const from = at.current;
    at.current = { pathname, key, active };
    arriving.current = { key, returning };
    if (pathname !== from.pathname) {
      // the page that leaves is still on screen where it was left: the next
      // one has not been swapped in yet. Under the code view that place is
      // the one held for it. A route change under the view (palette,
      // back/forward) leaves the view
      left.current.set(
        from.key,
        from.active ? (resume.current ?? 0) : scrollNow(),
      );
      resume.current = null;
      if (active) setActive(false);
    } else if (active && !from.active) {
      resume.current = scrollNow();
    }
  }, [pathname, key, returning, active, setActive]);

  // Everything arrives at the top, except the page coming back from under
  // the code view and a history entry coming back to where it was left.
  // `resume` is read and left alone: it only goes stale by a route change,
  // which clears it, or by the view opening again, which replaces it.
  const land = useCallback((codeView: boolean) => {
    const back = codeView ? null : resume.current;
    if (back !== null) {
      snapScrollTo(back);
      // the toggle that opened the view lives in a long-closed menu — hand
      // focus back to the page's main landmark instead
      document.getElementById("main")?.focus({ preventScroll: true });
      return;
    }
    const entry = arriving.current;
    const place = !codeView && entry.returning && left.current.get(entry.key);
    snapScrollTo(place || 0);
  }, []);

  // The page on screen, and the one asked for. They differ from a change
  // until its swap; in between the shell keeps rendering the page it had.
  const id = active ? CODE_VIEW : pathname;
  const [shown, setShown] = useState<Page>({ id, node: children });
  const asked = useRef<Page>(shown);
  const shell = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    asked.current = { id, node: children, arrives: true };
  });
  useEffect(() => {
    if (id === shown.id) return;
    // app pages share the bar and set their title under it; the code view
    // and the blank pages (a deep dive's title is its hero's) do not
    const framed = [id, shown.id].every(
      (page) => page !== CODE_VIEW && resolveLayout(page) === "app",
    );
    changePage(() => setShown(asked.current), {
      loaded: id === CODE_VIEW ? loadCodeView() : preloadRoute(id),
      framed,
      shell: shell.current,
      current: () =>
        splitLocale(window.location.pathname).path === at.current.pathname,
    });
  }, [id, shown.id]);

  return (
    <div
      key={shown.id}
      ref={shell}
      data-page-arriving={shown.arrives ? "" : undefined}
      className="flex flex-1 flex-col"
    >
      <Arrival codeView={shown.id === CODE_VIEW} land={land} />
      <Suspense fallback={<div className="flex-1" />}>
        {shown.id === CODE_VIEW ? (
          <CodeView />
        ) : shown.id === id ? (
          children
        ) : (
          shown.node
        )}
        <Settled />
      </Suspense>
    </div>
  );
};

export default PageShell;
