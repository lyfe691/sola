/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
import { plainText } from "./plain-text";

describe("plainText", () => {
  it("keeps a link's label and drops its target", () => {
    expect(
      plainText(
        "[qr.ysz.life](https://qr.ysz.life) is a QR code generator, inspired by [Shu Ding](https://shud.in)’s site.",
      ),
    ).toBe("qr.ysz.life is a QR code generator, inspired by Shu Ding’s site.");
  });

  it("leaves text without links alone", () => {
    expect(plainText("Array access like list[0] (see notes).")).toBe(
      "Array access like list[0] (see notes).",
    );
  });
});
