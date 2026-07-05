/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Characterization tests for the activity pipeline. The module keeps a
 * warm-instance cache, so every test loads a fresh copy via resetModules.
 */

import { afterEach, describe, expect, it, vi } from "vitest";

const load = async () => {
  vi.resetModules();
  return import("./github-activity");
};

const event = (overrides: Record<string, unknown>) => ({
  id: "1",
  type: "PushEvent",
  repo: { name: "lyfe691/sola" },
  created_at: "2026-07-05T00:00:00Z",
  payload: {},
  ...overrides,
});

const stubFetch = (events: unknown) => {
  const fetchMock = vi.fn(async () => ({ ok: true, json: async () => events }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getGitHubActivity", () => {
  it("rejects usernames outside the allowlist", async () => {
    const { getGitHubActivity } = await load();
    await expect(getGitHubActivity("someone-else")).rejects.toThrow(
      "username is not allowed",
    );
  });

  it("processes a push event with an inline commit message", async () => {
    stubFetch([
      event({
        payload: {
          ref: "refs/heads/main",
          size: 2,
          distinct_size: 2,
          commits: [
            { sha: "abc", message: "feat: thing" },
            { sha: "def", message: "fix: other" },
          ],
        },
      }),
    ]);
    const { getGitHubActivity } = await load();
    const result = await getGitHubActivity("lyfe691");
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("push");
    expect(result[0].title).toBe("Pushed 2 commits to main");
    expect(result[0].description).toBe("feat: thing");
  });

  it("drops a malformed event instead of failing the batch", async () => {
    stubFetch([
      // PullRequestEvent with a redacted/missing pull_request payload
      event({ type: "PullRequestEvent", payload: {} }),
      event({ id: "2", type: "WatchEvent", payload: {} }),
    ]);
    const { getGitHubActivity } = await load();
    const result = await getGitHubActivity("lyfe691");
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("star");
  });

  it("caps commit-message enrichment fetches", async () => {
    const events = Array.from({ length: 20 }, (_, i) =>
      event({
        id: String(i),
        payload: { ref: "refs/heads/main", size: 1, commits: [] },
      }),
    );
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes("/events/public")) {
        return { ok: true, json: async () => events };
      }
      // enrichment lookups find nothing -> static fallback descriptions
      return { ok: true, json: async () => [] };
    });
    vi.stubGlobal("fetch", fetchMock);
    const { getGitHubActivity } = await load();
    const result = await getGitHubActivity("lyfe691");
    expect(result).toHaveLength(20);
    // 1 events fetch + at most 5 enrichment fetches
    expect(fetchMock).toHaveBeenCalledTimes(6);
  });

  it("memoizes non-empty results per username", async () => {
    const fetchMock = stubFetch([event({ id: "2", type: "WatchEvent" })]);
    const { getGitHubActivity } = await load();
    await getGitHubActivity("lyfe691");
    await getGitHubActivity("lyfe691");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
