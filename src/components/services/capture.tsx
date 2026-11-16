/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * A project's capture as a small window. Not the deep dives' Safari frame:
 * that one is drawn for a figure the width of an article, and its corners
 * are a fixed radius, which at a third of the size is most of the toolbar.
 * Here every length is a share of the window's own width, corners included,
 * so it holds its shape from a 200px card to a 700px one. `browser`: it has
 * a toolbar, in the capture's own top colour; without, it is the bare
 * capture (a terminal is not a web page).
 */

import type { CSSProperties } from "react";
import { inkOn } from "@/components/mdx/frame-edge";
import {
  PROJECT_IMAGE_EDGES,
  PROJECT_IMAGE_SIZES,
} from "@/config/project-image-sizes";
import { CARD_WIDTH, cardImage } from "@/config/services";

/** Lengths as shares of the window's width. */
const DRAWING = {
  "--window-radius": "1.8cqw",
  "--bar": "4.6cqw",
  "--bar-pad": "2cqw",
  "--light": "1.3cqw",
  "--light-gap": "0.9cqw",
  "--field": "2.4cqw",
  "--field-w": "38cqw",
};

export function Capture({
  image,
  browser,
  sizes,
  eager = false,
}: {
  image: string;
  browser: boolean;
  /** How wide the capture is drawn, as the `<img sizes>` it is passed to. */
  sizes: string;
  /** Loaded with the page, not when it nears the window: a card waiting
   *  sideways in the carousel is never near it until it is already turning in. */
  eager?: boolean;
}) {
  const size = PROJECT_IMAGE_SIZES[image];
  const [width, height] = size ?? [16, 10];
  const edge = PROJECT_IMAGE_EDGES[image];
  const middle = edge?.[Math.floor(edge.length / 2)];
  return (
    <div className="@container">
      <div
        className="overflow-hidden rounded-(--window-radius) bg-(--chrome) shadow-xl ring-1 shadow-black/25 ring-black/10"
        style={
          {
            ...DRAWING,
            "--chrome": middle ?? "var(--muted)",
            "--ink": edge ? inkOn(edge) : "var(--foreground)",
          } as CSSProperties
        }
      >
        {browser && (
          <div
            aria-hidden="true"
            className="grid h-(--bar) grid-cols-[1fr_auto_1fr] items-center px-(--bar-pad)"
          >
            <span className="flex gap-(--light-gap)">
              {[0, 1, 2].map((light) => (
                <span
                  key={light}
                  className="size-(--light) rounded-full bg-(--ink)/20"
                />
              ))}
            </span>
            <span className="h-(--field) w-(--field-w) rounded-full bg-(--ink)/10" />
          </div>
        )}
        <img
          src={image}
          srcSet={
            size && `${cardImage(image)} ${CARD_WIDTH}w, ${image} ${width}w`
          }
          sizes={sizes}
          alt=""
          width={width}
          height={height}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className="block h-auto w-full"
        />
      </div>
    </div>
  );
}
