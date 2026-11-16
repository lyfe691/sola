/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * A project's capture as a small window, for a card or a preview: a web
 * page in a Browser Window at its project's address, a command-line tool as
 * a Terminal Replay of one of its sessions. It is a picture of the project,
 * not a control: drawn to scale (WindowScale), inert, and without the
 * buttons, so it can sit inside a link.
 */

import { Suspense, type CSSProperties } from "react";
import { PROJECT_IMAGE_SIZES } from "@/config/project-image-sizes";
import { PROJECTS } from "@/config/projects";
import { CARD_WIDTH, cardImage, type Shot } from "@/config/services";
import { TERMINAL_SESSIONS } from "@/config/terminal-sessions";
import { cn } from "@/lib/utils";
import { LazyBrowserWindow, LazyTerminalReplay } from "./lazy";
import { browserWindowRatio } from "./measures";
import { WINDOW_FRAME, WindowScale } from "./window";

const DEFAULT_RATIO = 1.6;

export interface ShotWindowProps {
  shot: Shot;
  /** How wide the capture is drawn, as the `<img sizes>` it is passed to. */
  sizes: string;
  /** Loaded with the page, not when it nears the window: a card waiting
   *  sideways in the carousel is never near it until it is already turning in. */
  eager?: boolean;
  /** False for a terminal that is not the one on show: it stands finished. */
  playing?: boolean;
  /** The width in px the window is drawn as if it had: smaller for a small
   *  preview, so its bar and its text stay legible. */
  nominal?: number;
  /** The window takes its box's whole height: the page is cropped to it from
   *  the top left, and a terminal is as tall as the box. */
  fill?: boolean;
}

export function ShotWindow({
  shot,
  sizes,
  eager = false,
  playing = true,
  nominal = 896,
  fill = false,
}: ShotWindowProps) {
  const size = "image" in shot ? PROJECT_IMAGE_SIZES[shot.image] : undefined;
  const ratio = size ? size[0] / size[1] : DEFAULT_RATIO;
  const frame = browserWindowRatio(ratio, nominal);
  const placeholder = (
    <div
      className={cn(WINDOW_FRAME, fill ? "h-full" : "aspect-(--window-ratio)")}
      style={{ "--window-ratio": frame } as CSSProperties}
    />
  );

  return (
    <WindowScale nominal={nominal} fill={fill}>
      <div aria-hidden="true" inert className={fill ? "h-full" : undefined}>
        <Suspense fallback={placeholder}>
          {"session" in shot ? (
            <LazyTerminalReplay
              directory=""
              {...TERMINAL_SESSIONS[shot.session]}
              // a terminal takes the footprint a page of the usual shape has
              height={
                fill ? "100%" : `calc(var(--window-unit) * ${nominal / frame})`
              }
              still={!playing}
              threshold={0.6}
              interactive={false}
              copyable={false}
            />
          ) : (
            <LazyBrowserWindow
              url={PROJECTS.find(({ id }) => id === shot.project)?.link}
              aspect={ratio}
              layout="wide"
              controls={false}
              fill={fill}
              className={fill ? "h-full" : undefined}
            >
              <img
                src={shot.image}
                srcSet={
                  size &&
                  `${cardImage(shot.image)} ${CARD_WIDTH}w, ${shot.image} ${size[0]}w`
                }
                sizes={sizes}
                alt=""
                width={size?.[0]}
                height={size?.[1]}
                loading={eager ? "eager" : "lazy"}
                decoding="async"
                className={cn(
                  "block size-full",
                  fill && "object-cover object-top-left",
                )}
              />
            </LazyBrowserWindow>
          )}
        </Suspense>
      </div>
    </WindowScale>
  );
}
