/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
import { notchedOutline } from "./notch";

describe("notchedOutline", () => {
  const d = notchedOutline(
    { width: 200, height: 100, radius: 20 },
    { width: 60, height: 30, radius: 10, fillet: 10 },
  );

  it("starts on the top edge past the notch and closes", () => {
    expect(d.startsWith("M 70 0 ")).toBe(true);
    expect(d.endsWith(" Z")).toBe(true);
  });

  it("rounds the three untouched corners with the cover radius", () => {
    expect(d).toContain("L 180 0 A 20 20 0 0 1 200 20");
    expect(d).toContain("L 200 80 A 20 20 0 0 1 180 100");
    expect(d).toContain("L 20 100 A 20 20 0 0 1 0 80");
  });

  it("cuts the notch with concave fillets and a rounded inner corner", () => {
    // left edge → fillet into the notch floor
    expect(d).toContain("L 0 40 A 10 10 0 0 1 10 30");
    // notch floor → inner corner, sweeping the other way
    expect(d).toContain("L 50 30 A 10 10 0 0 0 60 20");
    // notch wall → fillet back onto the top edge
    expect(d).toContain("L 60 10 A 10 10 0 0 1 70 0");
  });

  it("keeps fractional sizes to two decimals", () => {
    const fractional = notchedOutline(
      { width: 333.333, height: 142.857, radius: 26 },
      { width: 161.5, height: 38.25, radius: 12, fillet: 12 },
    );
    expect(fractional).toContain("L 307.33 0");
    expect(fractional).toContain("L 0 50.25");
  });
});
