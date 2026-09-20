/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
// @ts-expect-error — plain .mjs script without types; galleryRows() is exercised here
import { galleryRows } from "../../../scripts/gallery-rows.mjs";
import {
  type FigureShape,
  ARTICLE_COLUMN,
  MIN_FIGURE_WIDTH,
  isPortrait,
  rowShares,
} from "../../components/mdx/figure-layout";

type Row = { file: string; figures: FigureShape[] };
const rows = (): Row[] => galleryRows();

describe("deep-dive galleries", () => {
  it("finds rows to check", () => {
    expect(rows().length).toBeGreaterThan(10);
  });

  // when this fails, give that gallery fewer columns: a phone left alone on a
  // row lands on the stage instead, at the width it wants
  it("never justifies a figure down to a thumbnail", () => {
    const thumbnails = rows().flatMap((row) => {
      // an all-phone row sits on a stage, which sizes it on its own terms
      if (row.figures.every(isPortrait)) return [];
      return rowShares(row.figures)
        .map((share, index) => ({
          file: row.file,
          src: row.figures[index].src,
          width: Math.round(share * ARTICLE_COLUMN),
        }))
        .filter((figure) => figure.width < MIN_FIGURE_WIDTH);
    });

    expect(thumbnails).toEqual([]);
  });
});
