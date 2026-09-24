/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
import { toTheme } from "./themes";

describe("toTheme", () => {
  it("keeps a current theme", () => {
    expect(toTheme("ember")).toBe("ember");
    expect(toTheme("system")).toBe("system");
  });

  it("carries a retired theme to its heir", () => {
    expect(toTheme("cloud")).toBe("glacier");
    expect(toTheme("rose")).toBe("sakura");
    expect(toTheme("vintage")).toBe("dune");
    expect(toTheme("coffee")).toBe("dune");
  });

  it("drops an unknown id", () => {
    expect(toTheme("sepia")).toBeNull();
    expect(toTheme("constructor")).toBeNull();
  });
});
