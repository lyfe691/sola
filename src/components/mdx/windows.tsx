/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The ported windows as deep-dive figures: a terminal session that
 * replays, code that morphs between states, and a browser window. Each one's
 * code loads with the first article that shows one, and until then an empty
 * frame holds its box at the size this file can work out from the props.
 */

import { Suspense, type CSSProperties, type ReactNode } from "react";
import type { BrowserPage } from "@/components/windows/browser-window";
import type { CodeMorphStep } from "@/components/windows/code-morph";
import {
  LazyBrowserWindow,
  LazyCodeMorph,
  LazyTerminalReplay,
} from "@/components/windows/lazy";
import { BROWSER_SCREEN_RADIUS } from "@/components/windows/measures";
import { WINDOW_FRAME, WINDOW_PANEL } from "@/components/windows/window";
import {
  TERMINAL_SESSIONS,
  type TerminalSessionKey,
  type TerminalStep,
} from "@/config/terminal-sessions";
import { cn } from "@/lib/utils";
import { ExpandableImage } from "./ExpandableImage";
import { ratioOf } from "./figure-layout";
import { FigureCaption } from "./figures";

const SIZE_CLASS = {
  normal: "mx-auto max-w-2xl",
  large: "mx-auto max-w-4xl",
  full: "w-full",
} as const;
type Size = keyof typeof SIZE_CLASS;

/** The windows' measures, px: a line of 13px mono at 1.7, the bar, the pads. */
const LINE = 13 * 1.7;
const BAR = 38;
const PANEL_INSET = 4;
const TERMINAL_PAD = 16 + 18;
const CODE_PAD = 14 + 18;

function Figure({
  size,
  caption,
  children,
}: {
  size: Size;
  caption?: string;
  children: ReactNode;
}) {
  return (
    <figure className={cn("my-8", SIZE_CLASS[size])}>
      {children}
      {caption ? <FigureCaption>{caption}</FigureCaption> : null}
    </figure>
  );
}

function Placeholder({ height }: { height: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(WINDOW_FRAME, "h-(--window-h)")}
      style={{ "--window-h": height } as CSSProperties}
    />
  );
}

/** The rows a session ends on, the prompt after it included. */
const rowsOf = (script: readonly TerminalStep[]) =>
  script.reduce(
    (rows, step) =>
      rows +
      (step.type === "output"
        ? step.replace
          ? 1
          : step.lines.length
        : step.type === "pause" || step.type === "clear"
          ? 0
          : 1),
    1,
  );

/**
 * A terminal session, replayed: `session` names one in
 * config/terminal-sessions.ts. `alt` says what happens in it, as a clip's
 * would. The window is as tall as the session, so nothing scrolls until a
 * narrow screen wraps its lines.
 */
export function Terminal({
  session,
  alt,
  caption,
  size = "full",
}: {
  session: TerminalSessionKey;
  alt: string;
  caption?: string;
  size?: Size;
}) {
  const play = TERMINAL_SESSIONS[session];
  const height = Math.ceil(
    BAR + PANEL_INSET + TERMINAL_PAD + rowsOf(play.script) * LINE,
  );
  return (
    <Figure size={size} caption={caption}>
      <Suspense fallback={<Placeholder height={`${height}px`} />}>
        <LazyTerminalReplay
          directory=""
          {...play}
          label={alt}
          height={height}
        />
      </Suspense>
    </Figure>
  );
}

/**
 * Code in several states. MDX strips the attribute's indent from every line
 * after a template literal's first, so each step's code is written like a
 * CodeBlock's (see CLAUDE.md) and needs no fixing here.
 */
export function CodeMorph({
  steps,
  lang,
  chrome = "tabs",
  caption,
  size = "full",
}: {
  steps: CodeMorphStep[];
  lang?: string;
  /** "tabs" names each step; "window" shows the step's file name instead. */
  chrome?: "tabs" | "window" | "none";
  caption?: string;
  size?: Size;
}) {
  const lines = Math.max(
    1,
    ...steps.map((step) => step.code.replace(/\n+$/, "").split("\n").length),
  );
  const height = Math.ceil(
    (chrome === "none" ? 2 * PANEL_INSET + 4 : BAR + PANEL_INSET) +
      CODE_PAD +
      lines * LINE,
  );
  return (
    <Figure size={size} caption={caption}>
      <Suspense fallback={<Placeholder height={`${height}px`} />}>
        <LazyCodeMorph steps={steps} lang={lang} chrome={chrome} />
      </Suspense>
    </Figure>
  );
}

type WindowPage = Omit<BrowserPage, "content"> & { src: string };

/**
 * A figure in a browser window. One shot (`src`, with `video` for a clip)
 * stands still and opens in the lightbox like any figure; `pages` makes the
 * window move through several, typing each address.
 */
export function BrowserWindow({
  url,
  src,
  video,
  alt = "",
  caption,
  pages,
  size = "full",
}: {
  url?: string;
  src?: string;
  video?: string;
  alt?: string;
  caption?: string;
  pages?: WindowPage[];
  size?: Size;
}) {
  const aspect = ratioOf(src ?? pages?.[0]?.src ?? "");
  return (
    <Figure size={size} caption={caption}>
      <Suspense
        fallback={
          <div aria-hidden="true" className={WINDOW_FRAME}>
            <div className="h-11 flex-none" />
            <div
              className={cn(WINDOW_PANEL, "aspect-(--page-aspect)")}
              style={{ "--page-aspect": aspect } as CSSProperties}
            />
          </div>
        }
      >
        {src ? (
          <LazyBrowserWindow url={url} aspect={aspect}>
            <ExpandableImage
              src={src}
              video={video}
              alt={alt}
              caption={caption}
              radius={BROWSER_SCREEN_RADIUS}
            />
          </LazyBrowserWindow>
        ) : (
          <LazyBrowserWindow pages={pages} aspect={aspect} />
        )}
      </Suspense>
    </Figure>
  );
}
