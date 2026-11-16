/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { TERMINAL_SESSIONS, transcript } from "./terminal-sessions";

const CONTENT = "src/content/projects";
const articles = readdirSync(CONTENT, { recursive: true, encoding: "utf8" })
  .filter((name) => name.endsWith(".mdx"))
  .map((name) => ({
    name,
    source: readFileSync(`${CONTENT}/${name}`, "utf8"),
  }));

// MDX is not typechecked: a name it gets wrong would only show in the browser
describe("what the deep dives name", () => {
  it("replays only sessions that exist", () => {
    const unknown = articles.flatMap(({ name, source }) =>
      [...source.matchAll(/\bsession="([^"]*)"/g)]
        .filter(([, session]) => !(session in TERMINAL_SESSIONS))
        .map(([, session]) => `${name}: ${session}`),
    );
    expect(unknown).toEqual([]);
  });

  it("frames a gallery image in a frame figures.tsx draws", () => {
    const unknown = articles.flatMap(({ name, source }) =>
      [...source.matchAll(/\bframe:\s*"([^"]*)"/g)]
        .filter(([, frame]) => frame !== "browser" && frame !== "iphone")
        .map(([, frame]) => `${name}: ${frame}`),
    );
    expect(unknown).toEqual([]);
  });
});

describe("transcript", () => {
  it("keeps only the last state of a line redrawn in place", () => {
    const text = transcript(TERMINAL_SESSIONS["magi-scan"]);
    expect(text).toContain("scanning 45.33.32.156");
    expect(text).toContain("probed 1024 / 1024  (2 open)");
    expect(text).not.toContain("probed 986");
  });

  it("writes a command behind the prompt it was typed at, markup taken off", () => {
    const text = transcript(TERMINAL_SESSIONS["self-setup"]);
    expect(text).toContain("PS C:\\Users\\user> self --setup");
    expect(text).toContain("Choose [1/2/3] (default: 1): 3");
    expect(text).toContain("self Setup Wizard");
    expect(text).not.toContain("[info]");
  });
});
