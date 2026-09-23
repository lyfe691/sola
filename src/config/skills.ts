/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { PROJECTS, type ProjectMeta } from "@/config/projects";
import { TECH_ICONS, type TechIcon } from "@/config/tech-icons";

// 1-5 scale: 1=learning, 2=familiar, 3=comfortable, 4=proficient, 5=advanced
export type Proficiency = 1 | 2 | 3 | 4 | 5;

export interface Skill {
  name: string;
  icon: TechIcon;
  level: Proficiency;
}

export interface SkillGroup {
  id: string;
  skills: Skill[];
}

/** A skill wears the registry's mark: the one its project chips show too. */
function skill(name: string, level: Proficiency): Skill {
  const icon = TECH_ICONS[name];
  if (!icon) throw new Error(`No mark for skill "${name}" in TECH_ICONS`);
  return { name, icon, level };
}

const SKILL_GROUPS_RAW: SkillGroup[] = [
  {
    id: "languages",
    skills: [
      skill("HTML", 5),
      skill("TypeScript", 4),
      skill("JavaScript", 4),
      skill("Java", 4),
      skill("CSS", 4),
      skill("Python", 3),
      skill("Kotlin", 3),
      skill("Rust", 3),
      skill("C++", 2),
    ],
  },
  {
    id: "frontend",
    skills: [
      skill("React", 5),
      skill("Tailwind CSS", 5),
      skill("Next.js", 4),
      skill("shadcn/ui", 5),
      skill("Radix UI", 4),
      skill("Motion", 4),
      skill("Vite", 4),
      skill("Base UI", 4),
      skill("Three.js", 3),
      skill("TanStack Query", 3),
      skill("MDX", 3),
      skill("Capacitor", 3),
      skill("Figma", 3),
    ],
  },
  {
    id: "backend",
    skills: [
      skill("Spring Boot", 4),
      skill("MongoDB", 4),
      skill("Node.js", 3),
      skill("PostgreSQL", 3),
      skill("MySQL", 3),
      skill("Redis", 3),
      skill("Supabase", 3),
      skill("Zod", 3),
      skill("Vercel AI SDK", 3),
      skill("Sanity", 3),
      skill("Keycloak", 2),
      skill("FastAPI", 2),
      skill("Django", 2),
    ],
  },
  {
    id: "infrastructure",
    skills: [
      skill("Git", 5),
      skill("Docker", 4),
      skill("Linux", 4),
      skill("Vercel", 4),
      skill("GitHub Actions", 3),
      skill("PowerShell", 4),
      skill("Bash", 3),
      skill("Nginx", 3),
      skill("Kubernetes", 2),
      skill("AWS", 2),
      skill("Terraform", 2),
    ],
  },
  {
    id: "security",
    skills: [
      skill("Kali Linux", 4),
      skill("OSINT", 4),
      skill("Nmap", 4),
      skill("Wireshark", 3),
      skill("OWASP", 3),
      skill("Metasploit", 3),
      skill("Burp Suite", 2),
    ],
  },
  {
    id: "tools",
    skills: [
      skill("VS Code", 5),
      skill("Cursor", 5),
      skill("Claude Code", 5),
      skill("GitHub", 5),
      skill("npm", 4),
      skill("Bun", 4),
      skill("ESLint", 4),
      skill("Vitest", 3),
      skill("Notion", 4),
      skill("Obsidian", 4),
      skill("Postman", 3),
      skill("Insomnia", 3),
    ],
  },
];

// Sort skills by proficiency level (highest first) within each group
export const SKILL_GROUPS: SkillGroup[] = SKILL_GROUPS_RAW.map((group) => ({
  ...group,
  skills: [...group.skills].sort((a, b) => b.level - a.level),
}));

/** Project technology labels that also count as the skill. */
export const SKILL_ALIASES: Record<string, string[]> = {
  React: ["React (Vite)"],
  Vite: ["React (Vite)"],
  "Next.js": ["Next.js App Router"],
  "TanStack Query": ["React Query"],
};

/** Every technology label that counts as the skill. */
export function skillLabels(name: string): string[] {
  return [name, ...(SKILL_ALIASES[name] ?? [])];
}

// newest first, the order the projects page calls "Newest"
const BY_NEWEST = [...PROJECTS].sort(
  (a, b) => b.date.start.localeCompare(a.date.start) || a.priority - b.priority,
);

/** Skills every project was built with: too universal to list per project. */
export const EVERY_PROJECT = new Set(["Git"]);

const USED_IN = new Map<string, ProjectMeta[]>();

/** The projects that list the skill among their technologies, newest first. */
export function projectsUsing(name: string): ProjectMeta[] {
  let projects = USED_IN.get(name);
  if (!projects) {
    const labels = skillLabels(name);
    projects = BY_NEWEST.filter((project) =>
      project.technologies.some((tech) => labels.includes(tech)),
    );
    USED_IN.set(name, projects);
  }
  return projects;
}
