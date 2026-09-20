/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
// @ts-expect-error — plain .mjs script without types; galleryRows() is exercised here
import { galleryRows } from "../../../scripts/gallery-rows.mjs";
import {
  ARTICLE_COLUMN,
  MIN_FIGURE_WIDTH,
  isPortrait,
  rowShares,
} from "../../components/mdx/figure-layout";

type Row = { file: string; srcs: string[] };
const rows = (): Row[] => galleryRows();

describe("deep-dive galleries", () => {
  it("finds rows to check", () => {
    expect(rows().length).toBeGreaterThan(10);
  });

  // A phone justified into a row of desktop shots is narrower than a phone
  // alone, and at three columns it collapses to a thumbnail: unreadable, with
  // a caption that has to wrap to fit. Give that row fewer columns — a phone
  // left on a row of its own lands on the stage, at the width it wants.
  it("never justifies a figure down to a thumbnail", () => {
    const thumbnails = rows().flatMap((row) => {
      // a row of phones alone is not justified into the column; it sits on a
      // stage, which sizes it on its own terms
      if (row.srcs.every(isPortrait)) return [];
      return rowShares(row.srcs)
        .map((share, index) => ({
          file: row.file,
          src: row.srcs[index],
          width: Math.round(share * ARTICLE_COLUMN),
        }))
        .filter((figure) => figure.width < MIN_FIGURE_WIDTH);
    });

    expect(thumbnails).toEqual([]);
  });
});
