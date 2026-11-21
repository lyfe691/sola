/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * A project's two colours as a stipple gradient that fills its parent: it
 * drifts, stirs under the pointer and sends a tide out from a click. Like the
 * covers it is the same in every theme, so the ground and the dim over it
 * are black, not tokens, and what sits on it is set in white.
 */

import { lazy, Suspense, useEffect, useMemo } from "react";
import { coverPalette } from "@/components/painted-cover/palette";
import {
  resolveArt,
  type ProjectArt,
} from "@/components/painted-cover/presets";

// three comes with it: only a page that shows a field pays for that, and
// only once the page is up
const StippleGradient = lazy(() =>
  import("./StippleGradient").then((module) => ({
    default: module.StippleGradient,
  })),
);

/** How far the two colours are drawn apart, in field heights: a field here
 *  is far wider than tall, and at the default they would sit in one corner. */
const SPREAD = 2.4;

/** Mounts with the field, so it can say the field is on the page. */
function Ready({ onReady }: { onReady: () => void }) {
  useEffect(onReady, [onReady]);
  return null;
}

export function ArtField({
  art,
  paused = false,
  onReady,
}: {
  art: ProjectArt;
  /** Stops the drift; the frame on screen stays. */
  paused?: boolean;
  /** Fires once the field is mounted. */
  onReady?: () => void;
}) {
  // the cover's own tones: a preset's pair is a near-black and a wash, and
  // the field needs two colours with light in them over a ground of its hue.
  // Where the wash is the deep colour's own hue, the preset names another
  const { colors, ground, seed } = useMemo(() => {
    const resolved = resolveArt(art);
    const { vivid, pale, dusk } = coverPalette(resolved);
    return {
      colors: [vivid, resolved.counter ?? pale] as [string, string],
      ground: dusk,
      seed: resolved.seed,
    };
  }, [art]);

  return (
    <div className="absolute inset-0 bg-black">
      <Suspense fallback={null}>
        <StippleGradient
          colors={colors}
          backgroundColor={ground}
          seed={seed}
          spread={SPREAD}
          paused={paused}
        />
        {onReady && <Ready onReady={onReady} />}
      </Suspense>
      <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
    </div>
  );
}
