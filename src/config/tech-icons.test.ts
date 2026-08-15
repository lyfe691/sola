/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
import {
  FOLDER_ICON,
  TECH_ICONS,
  techIconForCode,
  techIconForFile,
} from "./tech-icons";

describe("techIconForFile", () => {
  it("uses the same marks as deep-dive chips", () => {
    expect(techIconForFile("src/lib/github-commits.ts")).toBe(
      TECH_ICONS.TypeScript,
    );
    expect(techIconForFile("src/pages/Changelog.tsx")).toBe(TECH_ICONS.React);
    expect(techIconForFile("src/index.css")).toBe(TECH_ICONS.CSS);
    expect(techIconForFile("vite.config.ts")).toBe(TECH_ICONS.Vite);
    expect(techIconForFile("package.json")).toBe(TECH_ICONS.npm);
    expect(techIconForFile("src-tauri/src/main.rs")).toBe(TECH_ICONS.Rust);
    expect(techIconForFile("api/main.py")).toBe(TECH_ICONS.Python);
    expect(techIconForFile("tsconfig.json")).toBe(TECH_ICONS.TypeScript);
    expect(techIconForFile(".github/workflows/ci.yml")).toBe(
      TECH_ICONS["GitHub Actions"],
    );
    expect(techIconForFile("components.json")).toBe(TECH_ICONS["shadcn/ui"]);
    expect(techIconForFile("install.ps1")).toBe(TECH_ICONS.PowerShell);
  });

  it("falls back to a file glyph, not the chip tag", () => {
    const unknown = techIconForFile("bun.lock");
    expect(unknown).not.toBe(TECH_ICONS.TypeScript);
    expect(unknown).toBe(techIconForFile("no-extension"));
  });
});

describe("techIconForCode", () => {
  it("prefers the filename over the language", () => {
    expect(
      techIconForCode({
        filename: "optimization-techniques.tsx",
        lang: "typescript",
      }),
    ).toBe(TECH_ICONS.React);
  });

  it("uses the language when the filename has no mark", () => {
    expect(techIconForCode({ filename: "scan.console", lang: "console" })).toBe(
      TECH_ICONS.CLI,
    );
    expect(techIconForCode({ lang: "powershell" })).toBe(TECH_ICONS.PowerShell);
  });

  it("treats a trailing slash as a folder", () => {
    expect(techIconForCode({ filename: "app/" })).toBe(FOLDER_ICON);
  });
});
