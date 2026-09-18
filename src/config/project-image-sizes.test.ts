/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
// @ts-expect-error — plain .mjs script without types; collect() is exercised here
import { collect } from "../../scripts/image-sizes.mjs";
import { PROJECT_IMAGE_SIZES } from "./project-image-sizes";

describe("PROJECT_IMAGE_SIZES", () => {
  it("matches the PNGs on disk (run `bun run images:sizes` when this fails)", () => {
    expect(PROJECT_IMAGE_SIZES).toEqual(collect());
  });
});
