/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { afterEach, describe, expect, it, vi } from "vitest";

const load = async () => {
  vi.resetModules();
  return import("./github-commits");
};

const listItem = (overrides: Record<string, unknown> = {}) => ({
  sha: "ebf3120aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  html_url: "https://github.com/lyfe691/sola/commit/ebf3120",
  commit: {
    message: "fix(colophon): mark source names as links",
    author: { name: "Yanis", date: "2026-08-14T12:00:00Z" },
  },
  author: { login: "lyfe691" },
  ...overrides,
});

const stubFetch = (body: unknown, ok = true, status = ok ? 200 : 500) => {
  const fetchMock = vi.fn(async () => ({
    ok,
    status,
    json: async () => body,
  }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("parsePage / parseSha", () => {
  it("defaults a missing page to 1 and rejects junk", async () => {
    const { parsePage } = await load();
    expect(parsePage(undefined)).toBe(1);
    expect(parsePage("2")).toBe(2);
    expect(parsePage("0")).toBeNull();
    expect(parsePage("11")).toBeNull();
    expect(parsePage("nope")).toBeNull();
  });

  it("accepts 7–40 hex shas only", async () => {
    const { parseSha } = await load();
    expect(parseSha("ebf3120")).toBe("ebf3120");
    expect(parseSha("EBF3120")).toBe("ebf3120");
    expect(parseSha("short")).toBeNull();
    expect(parseSha("../etc")).toBeNull();
    expect(parseSha(undefined)).toBeNull();
  });
});

describe("splitMessage", () => {
  it("strips a trailing trailer block", async () => {
    const { splitMessage } = await load();
    const { subject, body } = splitMessage(
      "feat: thing\n\nbody paragraph\n\nCo-Authored-By: Bot <bot@x>",
    );
    expect(subject).toBe("feat: thing");
    expect(body).toBe("body paragraph");
  });
});

describe("getCommitLog", () => {
  it("maps a list page and marks hasMore when full", async () => {
    const items = Array.from({ length: 30 }, (_, i) =>
      listItem({
        sha: `${i.toString(16).padStart(40, "a")}`,
        commit: {
          message: `feat: ${i}`,
          author: { name: "Yanis", date: "2026-08-14T12:00:00Z" },
        },
      }),
    );
    stubFetch(items);
    const { getCommitLog } = await load();
    const page = await getCommitLog(1);
    expect(page.commits).toHaveLength(30);
    expect(page.hasMore).toBe(true);
    expect(page.commits[0].shortSha).toHaveLength(7);
    expect(page.commits[0].subject).toBe("feat: 0");
  });

  it("attaches each commit's diff stats when a token is set", async () => {
    vi.stubEnv("GITHUB_TOKEN", "test");
    const fetchMock = vi.fn(async (url: string) => ({
      ok: true,
      status: 200,
      json: async () =>
        url.includes("/commits?")
          ? [listItem()]
          : {
              ...listItem(),
              stats: { additions: 5, deletions: 2 },
              files: [
                {
                  filename: "src/a.tsx",
                  status: "modified",
                  additions: 5,
                  deletions: 2,
                },
              ],
            },
    }));
    vi.stubGlobal("fetch", fetchMock);
    const { getCommitLog } = await load();
    const page = await getCommitLog(1);
    expect(page.commits[0].stats).toEqual({
      additions: 5,
      deletions: 2,
      files: 1,
      paths: ["src/a.tsx"],
    });
  });

  it("throws when upstream fails", async () => {
    stubFetch(null, false);
    const { getCommitLog } = await load();
    await expect(getCommitLog(1)).rejects.toThrow("failed to fetch commits");
  });
});

describe("getCommitDetail", () => {
  it("maps files and stats", async () => {
    stubFetch({
      ...listItem(),
      stats: { additions: 2, deletions: 2 },
      files: [
        {
          filename: "src/pages/AboutThisWebsite.tsx",
          status: "modified",
          additions: 2,
          deletions: 2,
          patch: "@@ -1 +1 @@\n-a\n+b",
        },
      ],
    });
    const { getCommitDetail } = await load();
    const detail = await getCommitDetail("ebf3120");
    expect(detail.additions).toBe(2);
    expect(detail.files).toHaveLength(1);
    expect(detail.files[0].filename).toBe("src/pages/AboutThisWebsite.tsx");
  });

  it("throws when the sha is missing upstream", async () => {
    stubFetch({ message: "Not Found" }, false, 404);
    const { getCommitDetail } = await load();
    await expect(getCommitDetail("deadbee")).rejects.toThrow(
      "commit not found",
    );
  });

  it("does not treat a rate-limit as a missing commit", async () => {
    stubFetch({ message: "API rate limit exceeded" }, false, 403);
    const { getCommitDetail } = await load();
    await expect(getCommitDetail("deadbee")).rejects.toThrow(
      "failed to fetch commits",
    );
  });
});
