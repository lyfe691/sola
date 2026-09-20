/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
import {
  PHONE,
  PHONE_SCREEN,
  figureRatio,
  isPortrait,
  ratioOf,
} from "./figure-layout";

const desktop = "/projects/perspectas/home-desktop.png";
const phone = "/projects/perspectas/home-mobile.png";

describe("figureRatio", () => {
  it("a frame only ever adds height", () => {
    for (const src of [desktop, phone]) {
      expect(figureRatio({ src, frame: "safari" })).toBeLessThan(ratioOf(src));
      expect(figureRatio({ src, frame: "iphone" })).toBeLessThan(ratioOf(src));
    }
  });

  // the frame is drawn around the shot, never over it: recovering the screen
  // from the figure's footprint has to give the screenshot's own ratio back
  it("an iPhone frames the shot without cropping it", () => {
    for (const src of [desktop, phone]) {
      const height = PHONE.width / figureRatio({ src, frame: "iphone" });
      const shot = height - 2 * (PHONE.ring + PHONE.bezel) - PHONE.statusBar;
      expect(PHONE_SCREEN / shot).toBeCloseTo(ratioOf(src), 10);
    }
  });

  it("keeps a desktop shot landscape and a phone shot portrait", () => {
    expect(isPortrait({ src: desktop, frame: "safari" })).toBe(false);
    expect(isPortrait({ src: phone, frame: "iphone" })).toBe(true);
  });
});
