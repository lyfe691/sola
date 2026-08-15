/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
import { statTree, type ChangelogFile } from "./github-commits";

const file = (filename: string): ChangelogFile => ({
  filename,
  status: "modified",
  additions: 1,
  deletions: 0,
});

describe("statTree", () => {
  it("prints a single nested path with last-child elbows", () => {
    const rows = statTree([file("src/pages/Changelog.tsx")]);
    expect(rows.map((r) => `${r.prefix}${r.name}`)).toEqual([
      "└── src",
      "    └── pages",
      "        └── Changelog.tsx",
    ]);
    expect(rows[2].file?.filename).toBe("src/pages/Changelog.tsx");
  });

  it("branches siblings at the same depth", () => {
    const rows = statTree([
      file("README.md"),
      file("src/a.ts"),
      file("src/b.ts"),
    ]);
    expect(rows.map((r) => `${r.prefix}${r.name}`)).toEqual([
      "├── README.md",
      "└── src",
      "    ├── a.ts",
      "    └── b.ts",
    ]);
  });
});
