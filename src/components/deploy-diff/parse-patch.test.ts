/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { describe, expect, it } from "vitest";
import { parsePatch } from "./parse-patch";

const PATCH = [
  "@@ -1,3 +1,4 @@",
  " context line",
  "-removed line",
  "+added line",
  "+another added",
  " trailing context",
].join("\n");

describe("parsePatch", () => {
  it("numbers old/new lines through a hunk", () => {
    const hunks = parsePatch(PATCH);
    expect(hunks).toHaveLength(1);
    const [hunk] = hunks;
    expect(hunk.header).toBe("@@ -1,3 +1,4 @@");
    expect(hunk.lines.map((l) => [l.type, l.oldNo, l.newNo])).toEqual([
      ["context", 1, 1],
      ["del", 2, null],
      ["add", null, 2],
      ["add", null, 3],
      ["context", 3, 4],
    ]);
  });

  it("ignores content before the first hunk header", () => {
    expect(parsePatch("stray\nlines\n")).toEqual([]);
  });

  it("does not fabricate a trailing empty context line", () => {
    const hunks = parsePatch("@@ -1 +1 @@\n+x\n");
    expect(hunks[0].lines).toHaveLength(1);
    expect(hunks[0].lines[0]).toEqual({
      type: "add",
      oldNo: null,
      newNo: 1,
      text: "x",
    });
  });

  it("handles multiple hunks and no-newline meta lines", () => {
    const hunks = parsePatch(
      [
        "@@ -1 +1 @@",
        "+a",
        "\\ No newline at end of file",
        "@@ -10,2 +11,2 @@",
        " x",
        "-y",
        "+z",
      ].join("\n"),
    );
    expect(hunks).toHaveLength(2);
    expect(hunks[0].lines.map((l) => l.type)).toEqual(["add", "meta"]);
    expect(hunks[1].lines.map((l) => [l.type, l.oldNo, l.newNo])).toEqual([
      ["context", 10, 11],
      ["del", 11, null],
      ["add", null, 12],
    ]);
  });
});
