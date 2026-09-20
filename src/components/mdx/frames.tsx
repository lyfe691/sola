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

import type { ReactNode } from "react";
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
  const on = (percent: number) =>
    ink ? `color-mix(in oklab, ${ink} ${percent}%, transparent)` : undefined;

  return (
    <div className="@container">
      <div
        className={cn(
          "overflow-hidden rounded-xl shadow-(--prose-figure-lift) ring-1 ring-border",
          !tint && "bg-background",
        )}
        style={{ background: tint }}
      >
        <div
          aria-hidden="true"
          className={cn(
            "grid grid-cols-[1fr_auto_1fr] items-center",
            !tint && "border-b border-border bg-muted",
          )}
          style={{
            height: su(SAFARI.bar),
            paddingInline: su(LIGHT.inset),
            background: tint
              ? `color-mix(in oklab, ${ink} 5%, ${tint})`
              : undefined,
            borderBottom: ink ? `1px solid ${on(10)}` : undefined,
          }}
        >
          <span className="flex" style={{ gap: su(LIGHT.gap) }}>
            {[0, 1, 2].map((light) => (
              <span
                key={light}
                className={cn("rounded-full", !ink && "bg-foreground/10")}
                style={{
                  width: su(LIGHT.size),
                  height: su(LIGHT.size),
                  background: on(12),
                }}
              />
            ))}
          </span>
          <span
            className={cn(
              "flex items-center justify-center leading-none",
              !ink && "bg-foreground/10 text-muted-foreground",
            )}
            style={{
              width: su(FIELD.width),
              height: su(FIELD.height),
              paddingInline: su(FIELD.inset),
              borderRadius: su(FIELD.radius),
              gap: su(FIELD.gap),
              fontSize: su(FIELD.text),
              background: on(9),
              color: on(55),
            }}
          >
            {url ? (
              <>
                <HugeiconsIcon
                  icon={SquareLock02Icon}
                  strokeWidth={2}
                  className="shrink-0"
                  style={{ width: su(FIELD.icon), height: su(FIELD.icon) }}
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
    <div className="@container">
      <div className="relative" style={{ marginInline: pu(PHONE.side) }}>
        {BUTTONS.map((button, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="absolute bg-foreground/20"
            style={{
              top: pu(button.top),
              height: pu(button.height),
              width: pu(PHONE.side + BUTTON.under),
              ...(button.edge === "left"
                ? {
                    left: pu(-PHONE.side),
                    borderRadius: `${pu(BUTTON.radius)} 0 0 ${pu(BUTTON.radius)}`,
                  }
                : {
                    right: pu(-PHONE.side),
                    borderRadius: `0 ${pu(BUTTON.radius)} ${pu(BUTTON.radius)} 0`,
                  }),
            }}
          />
        ))}
        {/* positioned, so it paints over the buttons' tucked ends: an in-flow
            box would paint under its positioned siblings whatever the order */}
        <div
          className="relative bg-foreground/20 shadow-(--prose-figure-lift)"
          style={{ padding: pu(PHONE.ring), borderRadius: pu(RING_RADIUS) }}
        >
          {/* bezel and island are hardware, not chrome: black in every theme,
              never a theme token and never the shot's colour */}
          <div
            style={{
              padding: pu(PHONE.bezel),
              borderRadius: pu(BEZEL_RADIUS),
              background: "#000",
            }}
          >
            {/* the screen's own ground, not a token: with the shot away in
                the lightbox the frame keeps its depth instead of showing a
                themed hole — the same as the Safari window's interior */}
            <div
              className={cn("relative overflow-hidden", !tint && "bg-muted")}
              style={{
                borderRadius: pu(PHONE.screenRadius),
                background: tint,
              }}
            >
              {/* the screenshots are bare viewport captures with content at
                  y=0, so the island cannot sit over them without covering a
                  logo; it gets a strip of its own in the shot's top colour */}
              <div
                aria-hidden="true"
                className="relative"
                style={{ height: pu(PHONE.statusBar) }}
              >
                <span
                  className="absolute left-1/2 -translate-x-1/2 rounded-full"
                  style={{
                    top: pu(ISLAND.top),
                    width: pu(ISLAND.width),
                    height: pu(ISLAND.height),
                    background: "#000",
                  }}
                >
                  <span
                    className="absolute top-1/2 -translate-y-1/2 rounded-full bg-white/15"
                    style={{
                      right: pu(ISLAND.cameraInset),
                      width: pu(ISLAND.camera),
                      height: pu(ISLAND.camera),
                    }}
                  />
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
