/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
import { commitHeadline, fileTree, type ChangelogFile } from "./github-commits";

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

describe("commitHeadline", () => {
  it("splits a conventional subject", () => {
    expect(
      commitHeadline({
        subject: "perf(motion): one reveal queue instead of per-block delays",
        body: "",
      }),
    ).toEqual({
      text: "one reveal queue instead of per-block delays",
      type: "perf",
      scope: "motion",
    });
  });

  it("reads a merge as its PR title", () => {
    expect(
      commitHeadline({
        subject: "merge pr #63",
        body: "Quick wins: no theme preview on tap\n\nmore",
      }),
    ).toEqual({ text: "Quick wins: no theme preview on tap", pr: 63 });
  });

  it("keeps a free-form subject whole", () => {
    expect(commitHeadline({ subject: "initial commit", body: "" })).toEqual({
      text: "initial commit",
    });
  });
});
