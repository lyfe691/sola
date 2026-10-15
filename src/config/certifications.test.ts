/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { certifications } from "./certifications";

describe("certifications", () => {
  it("gives each certificate image its size on disk", async () => {
    for (const { id, image } of certifications) {
      const { width, height } = await sharp(`public${image.src}`).metadata();
      expect([image.width, image.height], id).toEqual([width, height]);
    }
  });
});
