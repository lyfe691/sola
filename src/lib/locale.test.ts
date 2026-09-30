/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { describe, expect, it } from "vitest";
import { LANGUAGES } from "@/config/languages";
import { PREFIXED, localize, localizeTo, splitLocale } from "./locale";

describe("splitLocale", () => {
  it("reads the language off the front of a path", () => {
    expect(splitLocale("/de/about")).toEqual({
      language: "de",
      path: "/about",
    });
    expect(splitLocale("/zh/projects/kinoa")).toEqual({
      language: "zh",
      path: "/projects/kinoa",
    });
    expect(splitLocale("/ja")).toEqual({ language: "ja", path: "/" });
    expect(splitLocale("/ko/")).toEqual({ language: "ko", path: "/" });
  });

  it("takes anything else as English", () => {
    expect(splitLocale("/about")).toEqual({ language: "en", path: "/about" });
    expect(splitLocale("/")).toEqual({ language: "en", path: "/" });
    // a segment that only starts like a language is not one
    expect(splitLocale("/design")).toEqual({ language: "en", path: "/design" });
    expect(splitLocale("/en/about")).toEqual({
      language: "en",
      path: "/en/about",
    });
  });

  it("prefixes every language but English", () => {
    expect([...PREFIXED].sort()).toEqual(
      LANGUAGES.map(({ code }) => code)
        .filter((code) => code !== "en")
        .sort(),
    );
  });
});

describe("localize", () => {
  it("puts a path in a language, and takes it back out", () => {
    expect(localize("/about", "de")).toBe("/de/about");
    expect(localize("/", "es")).toBe("/es");
    expect(localize("/about", "en")).toBe("/about");
    expect(localize("/de/about", "ja")).toBe("/ja/about");
    expect(localize("/de", "en")).toBe("/");
    for (const { code } of LANGUAGES)
      expect(splitLocale(localize("/projects/kinoa", code))).toEqual({
        language: code,
        path: "/projects/kinoa",
      });
  });
});

describe("localizeTo", () => {
  it("moves site paths, keeping the query and hash", () => {
    expect(localizeTo("/projects/magi#output", "de")).toBe(
      "/de/projects/magi#output",
    );
    expect(localizeTo("/contact?service=web", "ko")).toBe(
      "/ko/contact?service=web",
    );
    expect(localizeTo({ pathname: "/about", hash: "#x" }, "zh")).toEqual({
      pathname: "/zh/about",
      hash: "#x",
    });
  });

  it("leaves relative paths, bare hashes and other sites alone", () => {
    for (const to of [
      "#section",
      "?q=1",
      "about",
      "//cdn.example.com/x",
      "https://example.com",
    ])
      expect(localizeTo(to, "de")).toBe(to);
    expect(localizeTo({ hash: "#x" }, "de")).toEqual({ hash: "#x" });
  });
});
