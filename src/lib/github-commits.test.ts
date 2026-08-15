/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
import { fileTree, type ChangelogFile } from "./github-commits";

const file = (filename: string): ChangelogFile => ({
  filename,
  status: "modified",
  additions: 1,
  deletions: 0,
});

const names = (nodes: ReturnType<typeof fileTree>): string[] =>
  nodes.flatMap((node) => [
    node.file ? node.name : `${node.name}/`,
    ...names(node.children),
  ]);

describe("fileTree", () => {
  it("nests a single path", () => {
    const tree = fileTree([file("src/pages/Changelog.tsx")]);
    expect(names(tree)).toEqual(["src/", "pages/", "Changelog.tsx"]);
    expect(tree[0].children[0].children[0].file?.filename).toBe(
      "src/pages/Changelog.tsx",
    );
  });

  it("branches siblings at the same depth", () => {
    const tree = fileTree([
      file("README.md"),
      file("src/a.ts"),
      file("src/b.ts"),
    ]);
    expect(names(tree)).toEqual(["README.md", "src/", "a.ts", "b.ts"]);
    expect(tree[1].children.map((child) => child.name)).toEqual([
      "a.ts",
      "b.ts",
    ]);
  });
});
