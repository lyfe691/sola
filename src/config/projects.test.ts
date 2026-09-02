/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
import { PRESETS } from "../components/painted-cover/presets";
import { PROJECTS } from "./projects";

describe("PROJECTS", () => {
  it("names an existing art preset on every project", () => {
    for (const project of PROJECTS) {
      expect(PRESETS).toHaveProperty(project.art.preset);
    }
  });

  it("has unique priorities, contiguous from 1", () => {
    const priorities = [...PROJECTS.map((p) => p.priority)].sort(
      (a, b) => a - b,
    );
    expect(priorities).toEqual(priorities.map((_, i) => i + 1));
  });

  it("pairs every slug with a deep dive", () => {
    for (const project of PROJECTS) {
      if (project.slug) expect(project.deepDive).toBeDefined();
    }
  });
});
