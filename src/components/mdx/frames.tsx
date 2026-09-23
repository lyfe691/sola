/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The device frames a figure can sit in: a Safari window and an iPhone. Each
 * is drawn in its own units with every length a share of the frame's width,
 * so the drawing scales with the figure and the footprint figure-layout.ts
 * computes from the same numbers holds at any size.
 */

import type { CSSProperties, ReactNode } from "react";
import { SquareLock02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";
import { type FigureFrame, PHONE, SAFARI } from "./figure-layout";

const share = (units: number, width: number) => `${(units / width) * 100}cqw`;
const su = (units: number) => share(units, SAFARI.width);
const pu = (units: number) => share(units, PHONE.width);

/** The screen's corners inside each frame: what the image or clip is cut to. */
export const SCREEN_RADIUS: Record<FigureFrame, string> = {
  safari: "0 0 var(--radius-xl) var(--radius-xl)",
  iphone: `0 0 ${pu(PHONE.screenRadius)} ${pu(PHONE.screenRadius)}`,
};

/**
 * Black or white, whichever reads on the shot's own colour. Chrome drawn on a
 * tint cannot use the theme's ink: a pale screenshot keeps its pale toolbar in
 * the dark themes, where --foreground would be white on white.
 */
const inkOn = (tint: string) => {
  const hex = tint.replace("#", "");
  const channel = (at: number) => {
    const c = parseInt(hex.slice(at, at + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const luminance =
    0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
  return luminance > 0.35 ? "#000" : "#fff";
};

/** The toolbar: three lights, and an address field centred on the window. */
const LIGHT = { size: 12, inset: 21, gap: 8 } as const;
const FIELD = {
  width: 666,
  height: 30,
  radius: 6,
  inset: 10,
  gap: 6,
  icon: 12,
  text: 13,
} as const;

function SafariFrame({
  url,
  tint,
  children,
}: {
  url?: string;
  tint?: string;
  children: ReactNode;
}) {
  // the window takes the page's own colour, the way Safari tints its chrome
  // from the site it is showing, so the bar is depth rather than a themed lid
  const ink = tint ? inkOn(tint) : null;
  const on = (percent: number, ground = "transparent") =>
    ink ? `color-mix(in oklab, ${ink} ${percent}%, ${ground})` : undefined;

  return (
    <div
      className="@container"
      style={
        {
          "--bar": su(SAFARI.bar),
          "--light": su(LIGHT.size),
          "--light-inset": su(LIGHT.inset),
          "--light-gap": su(LIGHT.gap),
          "--field-w": su(FIELD.width),
          "--field-h": su(FIELD.height),
          "--field-inset": su(FIELD.inset),
          "--field-radius": su(FIELD.radius),
          "--field-gap": su(FIELD.gap),
          "--field-icon": su(FIELD.icon),
          "--field-text": su(FIELD.text),
          "--tint": tint,
          "--bar-ground": on(5, tint),
          "--bar-line": on(10),
          "--light-ground": on(12),
          "--field-ground": on(9),
          "--field-ink": on(55),
        } as CSSProperties
      }
    >
      <div
        className={cn(
          "overflow-hidden rounded-xl shadow-(--prose-figure-lift) ring-1 ring-border",
          tint ? "bg-(--tint)" : "bg-background",
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            "grid h-(--bar) grid-cols-[1fr_auto_1fr] items-center border-b px-(--light-inset)",
            ink
              ? "border-(--bar-line) bg-(--bar-ground)"
              : "border-border bg-muted",
          )}
        >
          <span className="flex gap-(--light-gap)">
            {[0, 1, 2].map((light) => (
              <span
                key={light}
                className={cn(
                  "size-(--light) rounded-full",
                  ink ? "bg-(--light-ground)" : "bg-foreground/10",
                )}
              />
            ))}
          </span>
          <span
            className={cn(
              "flex h-(--field-h) w-(--field-w) items-center justify-center gap-(--field-gap) rounded-(--field-radius) px-(--field-inset) text-(length:--field-text) leading-none",
              ink
                ? "bg-(--field-ground) text-(--field-ink)"
                : "bg-foreground/10 text-muted-foreground",
            )}
          >
            {url ? (
              <>
                <HugeiconsIcon
                  icon={SquareLock02Icon}
                  strokeWidth={2}
                  className="size-(--field-icon) shrink-0"
                />
                <span className="min-w-0 truncate">{url}</span>
              </>
            ) : null}
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

/** The island in its status bar with the camera at its right, and the buttons. */
const ISLAND = {
  width: 124,
  height: 37,
  top: 10.75,
  camera: 11,
  cameraInset: 13,
} as const;
/** A button stands `PHONE.side` proud of the body and runs on under the ring. */
const BUTTON = { under: 2, radius: 1 } as const;
const BUTTONS = [
  { edge: "left", top: 170, height: 34 },
  { edge: "left", top: 233, height: 67 },
  { edge: "left", top: 318, height: 67 },
  { edge: "right", top: 279, height: 106 },
] as const;
const BEZEL_RADIUS = PHONE.screenRadius + PHONE.bezel;
const RING_RADIUS = BEZEL_RADIUS + PHONE.ring;

function IPhoneFrame({
  tint,
  children,
}: {
  tint?: string;
  children: ReactNode;
}) {
  return (
    <div
      className="@container"
      style={
        {
          "--side": pu(PHONE.side),
          "--button-w": pu(PHONE.side + BUTTON.under),
          "--button-radius": pu(BUTTON.radius),
          "--phone-ring": pu(PHONE.ring),
          "--ring-radius": pu(RING_RADIUS),
          "--bezel": pu(PHONE.bezel),
          "--bezel-radius": pu(BEZEL_RADIUS),
          "--screen-radius": pu(PHONE.screenRadius),
          "--status-bar": pu(PHONE.statusBar),
          "--island-top": pu(ISLAND.top),
          "--island-w": pu(ISLAND.width),
          "--island-h": pu(ISLAND.height),
          "--camera": pu(ISLAND.camera),
          "--camera-inset": pu(ISLAND.cameraInset),
          "--tint": tint,
        } as CSSProperties
      }
    >
      <div className="relative mx-(--side)">
        {BUTTONS.map((button, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={cn(
              "absolute top-(--top) h-(--height) w-(--button-w) bg-foreground/20",
              button.edge === "left"
                ? "-left-(--side) rounded-l-(--button-radius)"
                : "-right-(--side) rounded-r-(--button-radius)",
            )}
            style={
              {
                "--top": pu(button.top),
                "--height": pu(button.height),
              } as CSSProperties
            }
          />
        ))}
        {/* positioned, so it paints over the buttons' tucked ends: an in-flow
            box would paint under its positioned siblings whatever the order */}
        <div className="relative rounded-(--ring-radius) bg-foreground/20 p-(--phone-ring) shadow-(--prose-figure-lift)">
          {/* bezel and island are hardware, not chrome: black in every theme,
              never a theme token and never the shot's colour */}
          <div className="rounded-(--bezel-radius) bg-black p-(--bezel)">
            {/* the screen's own ground, not a token: with the shot away in
                the lightbox the frame keeps its depth instead of showing a
                themed hole — the same as the Safari window's interior */}
            <div
              className={cn(
                "relative overflow-hidden rounded-(--screen-radius)",
                tint ? "bg-(--tint)" : "bg-muted",
              )}
            >
              {/* the screenshots are bare viewport captures with content at
                  y=0, so the island cannot sit over them without covering a
                  logo; it gets a strip of its own in the shot's top colour */}
              <div aria-hidden="true" className="relative h-(--status-bar)">
                <span className="absolute top-(--island-top) left-1/2 h-(--island-h) w-(--island-w) -translate-x-1/2 rounded-full bg-black">
                  <span className="absolute top-1/2 right-(--camera-inset) size-(--camera) -translate-y-1/2 rounded-full bg-white/15" />
                </span>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DeviceFrame({
  frame,
  url,
  tint,
  children,
}: {
  frame: FigureFrame;
  /** What the Safari address field reads. */
  url?: string;
  /** The screenshot's own top colour; the iPhone's status strip takes it. */
  tint?: string;
  children: ReactNode;
}) {
  if (frame === "safari")
    return (
      <SafariFrame url={url} tint={tint}>
        {children}
      </SafariFrame>
    );
  return <IPhoneFrame tint={tint}>{children}</IPhoneFrame>;
}
