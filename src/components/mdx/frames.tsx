/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The iPhone a figure can sit in. It is drawn in its own units with every
 * length a share of the frame's width, so the drawing scales with the figure
 * and the footprint figure-layout.ts computes from the same numbers holds at
 * any size. (A browser figure sits in the Browser Window: figures.tsx.)
 *
 * The status bar takes the screen's own colours: a gradient of the shot's
 * top edge (frame-edge.ts), which follows a clip while it plays.
 */

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { cn } from "@/lib/utils";
import { PHONE } from "./figure-layout";
import { EDGE_BAND, EDGE_STOPS, edgeOf } from "./frame-edge";

const share = (units: number, width: number) => `${(units / width) * 100}cqw`;
const pu = (units: number) => share(units, PHONE.width);

/** The screen's corners inside the phone: what the image or clip is cut to. */
export const SCREEN_RADIUS = `0 0 ${pu(PHONE.screenRadius)} ${pu(PHONE.screenRadius)}`;

/**
 * The colours the chrome reads (index.css, "device frames"). A shot outside
 * the size list has no edge on record and takes the theme's.
 */
const edgeVars = (edge?: readonly string[]): Record<string, string> =>
  Object.fromEntries([
    ...(edge ?? Array<string>(EDGE_STOPS).fill("var(--muted)")).map(
      (colour, i) => [`--frame-edge-${i}`, colour],
    ),
  ]);

/** How often a playing clip's edge is read, in ms; the glide fills between. */
const READ_EVERY = 100;

/**
 * Keeps the chrome on a playing clip's own edge. It reads only frames the
 * clip presents, so a paused clip, or one off screen, costs nothing.
 */
function useClipEdge(
  clip: HTMLVideoElement | null,
  rootRef: RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!clip || !root || !("requestVideoFrameCallback" in clip)) return;
    const canvas = document.createElement("canvas");
    // not willReadFrequently: that canvas copies each whole video frame into
    // memory first, about three times the cost of this one's small readback
    const context = canvas.getContext("2d");
    if (!context) return;

    let readAt = -Infinity;
    let shown = "";
    let handle = clip.requestVideoFrameCallback(function read(now) {
      handle = clip.requestVideoFrameCallback(read);
      const width = clip.videoWidth;
      const rows = Math.min(EDGE_BAND, clip.videoHeight);
      if (now - readAt < READ_EVERY || !width || !rows) return;
      readAt = now;
      if (canvas.width !== width || canvas.height !== rows) {
        canvas.width = width;
        canvas.height = rows;
      }
      context.drawImage(clip, 0, 0, width, rows, 0, 0, width, rows);
      const edge = edgeOf(
        context.getImageData(0, 0, width, rows).data,
        width,
        rows,
        4,
      );
      if (String(edge) === shown) return;
      shown = String(edge);
      for (const [name, value] of Object.entries(edgeVars(edge)))
        root.style.setProperty(name, value);
    });
    return () => clip.cancelVideoFrameCallback(handle);
  }, [clip, rootRef]);
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

function IPhoneFrame({ children }: { children: ReactNode }) {
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
                themed hole */}
            <div className="relative overflow-hidden rounded-(--screen-radius) bg-(image:--frame-ground)">
              {/* the screenshots are bare viewport captures with content at
                  y=0, so the island cannot sit over them without covering a
                  logo; it gets a strip of its own in the shot's top colours */}
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
  edge,
  clip,
  children,
}: {
  /** The colours along the screenshot's top, left to right. */
  edge?: readonly string[];
  /** The clip playing on the screen, once mounted: the chrome follows it. */
  clip: HTMLVideoElement | null;
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  useClipEdge(clip, rootRef);

  return (
    <div
      ref={rootRef}
      className="frame-edge"
      // eslint-disable-next-line shadcn/no-inline-styles -- edgeVars builds custom properties only, the same ones useClipEdge writes
      style={edgeVars(edge) as CSSProperties}
    >
      <IPhoneFrame>{children}</IPhoneFrame>
    </div>
  );
}
