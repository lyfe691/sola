/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
import { languageForFile } from "./use-diff-highlight";

describe("languageForFile", () => {
  it("maps web extensions the changelog actually ships", () => {
    expect(languageForFile("src/pages/AboutThisWebsite.tsx")).toBe("tsx");
    expect(languageForFile("src/lib/translations/en.ts")).toBe("typescript");
    expect(languageForFile("src/index.css")).toBe("css");
    expect(languageForFile("package.json")).toBe("json");
    expect(languageForFile("README.md")).toBe("markdown");
  });

  it("leaves unknown files unhighlighted rather than inventing a grammar", () => {
    expect(languageForFile("bun.lock")).toBeNull();
    expect(languageForFile("Dockerfile")).toBeNull();
  });
});

describe("shiki web bundle", () => {
  it("tokenizes tsx with dual github themes (the changelog highlight path)", async () => {
    const { codeToTokensWithThemes } = await import("shiki/bundle/web");
    const tokens = await codeToTokensWithThemes(
      'export function Hello() {\n  return <div className="text-sm" />\n}',
      {
        lang: "tsx",
        themes: { light: "github-light", dark: "github-dark" },
      },
    );
    const colored = tokens.flat().filter((token) => token.variants.dark?.color);
    expect(tokens).toHaveLength(3);
    expect(colored.length).toBeGreaterThan(3);
  });

  it("does not ship a diff grammar — patches must use the file language", async () => {
    const { bundledLanguages } = await import("shiki/bundle/web");
    expect("diff" in bundledLanguages).toBe(false);
    expect("tsx" in bundledLanguages).toBe(true);
  });
});
