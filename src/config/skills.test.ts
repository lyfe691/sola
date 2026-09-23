/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
import { projectsUsing, SKILL_ALIASES } from "./skills";

describe("projectsUsing", () => {
  it("finds the projects that list a skill, featured first", () => {
    const ids = projectsUsing("TypeScript").map((project) => project.id);
    expect(ids).toContain("sola");
    const priorities = projectsUsing("TypeScript").map((p) => p.priority);
    expect(priorities).toEqual([...priorities].sort((a, b) => b - a));
  });

  it("counts an alias label as the skill", () => {
    const ids = projectsUsing("Next.js").map((project) => project.id);
    expect(ids).toEqual(expect.arrayContaining(["thoughts", "kinoa"]));
  });

  it("keeps every alias pointing at a real technology label", () => {
    for (const [skill, labels] of Object.entries(SKILL_ALIASES)) {
      for (const label of labels) {
        expect(
          projectsUsing(skill).some((p) => p.technologies.includes(label)),
          `${skill} → ${label}`,
        ).toBe(true);
      }
    }
  });
});
