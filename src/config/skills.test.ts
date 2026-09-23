/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
import { projectsUsing, SKILL_ALIASES, SKILL_GROUPS } from "./skills";

describe("projectsUsing", () => {
  it("finds the projects that list a skill, newest first", () => {
    const ids = projectsUsing("TypeScript").map((project) => project.id);
    expect(ids).toContain("sola");
    const starts = projectsUsing("TypeScript").map((p) => p.date.start);
    expect(starts).toEqual([...starts].sort().reverse());
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

  it("finds nothing for a skill no project lists", () => {
    expect(projectsUsing("not-a-real-skill")).toEqual([]);
  });

  it("keys every alias by a skill on the page", () => {
    const names = new Set(
      SKILL_GROUPS.flatMap((group) => group.skills.map((skill) => skill.name)),
    );
    for (const skill of Object.keys(SKILL_ALIASES)) {
      expect(names.has(skill), skill).toBe(true);
    }
  });
});
