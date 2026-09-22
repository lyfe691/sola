/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * A PDF's pages on a desk, drawn by pdf.js at the desk's width.
 */

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { PDFPageProxy } from "pdfjs-dist";
import { Spinner } from "@/components/ui/spinner";
import { loadPdf } from "@/lib/pdf";
import { cn } from "@/lib/utils";

const MAX_DPR = 2;

type Pages =
  | { url: string; status: "loading" }
  | { url: string; status: "ready"; pages: PDFPageProxy[] }
  | { url: string; status: "failed" };

function usePages(url: string): Pages {
  const [pages, setPages] = useState<Pages>({ url, status: "loading" });
  useEffect(() => {
    let live = true;
    loadPdf(url)
      .then((doc) =>
        Promise.all(
          Array.from({ length: doc.numPages }, (_, i) => doc.getPage(i + 1)),
        ),
      )
      .then(
        (loaded) => {
          if (live) setPages({ url, status: "ready", pages: loaded });
        },
        () => {
          if (live) setPages({ url, status: "failed" });
        },
      );
    return () => {
      live = false;
    };
  }, [url]);
  return pages.url === url ? pages : { url, status: "loading" };
}

function useColumnWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return { ref, width };
}

function Page({ page, width }: { page: PDFPageProxy; width: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [drawn, setDrawn] = useState(false);
  const { width: baseWidth, height: baseHeight } = page.getViewport({
    scale: 1,
  });

  useEffect(() => {
    const node = canvas.current;
    if (!node || width <= 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const viewport = page.getViewport({ scale: (width * dpr) / baseWidth });
    node.width = Math.round(viewport.width);
    node.height = Math.round(viewport.height);
    const task = page.render({ canvas: node, viewport });
    task.promise.then(
      () => setDrawn(true),
      () => {},
    );
    return () => task.cancel();
  }, [page, width, baseWidth]);

  return (
    <div
      className="overflow-hidden rounded-md bg-paper shadow-md ring-1 ring-foreground/10"
      style={{ aspectRatio: `${baseWidth} / ${baseHeight}` }}
    >
      <canvas
        ref={canvas}
        aria-hidden="true"
        className={cn(
          "block size-full transition-opacity duration-300 ease-out",
          drawn ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}

export function PdfPages({
  url,
  label,
  fallback,
  className,
}: {
  url: string;
  label: string;
  fallback: ReactNode;
  className?: string;
}) {
  const state = usePages(url);
  const { ref, width } = useColumnWidth();

  return (
    <div
      role="document"
      aria-label={label}
      aria-busy={state.status === "loading"}
      className={cn(
        "relative overflow-y-auto overscroll-contain bg-muted/40",
        className,
      )}
    >
      <div
        ref={ref}
        className="mx-auto flex max-w-[50rem] flex-col gap-5 px-5 py-6 sm:px-8 sm:py-8"
      >
        {state.status === "ready"
          ? state.pages.map((page, i) => (
              <Page key={`${url}#${i}`} page={page} width={width} />
            ))
          : null}
      </div>
      {state.status !== "ready" ? (
        <div className="absolute inset-0 grid place-items-center">
          {state.status === "loading" ? (
            <Spinner className="size-5 text-muted-foreground" />
          ) : (
            fallback
          )}
        </div>
      ) : null}
    </div>
  );
}
