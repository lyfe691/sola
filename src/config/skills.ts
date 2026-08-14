/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { FaAws } from "react-icons/fa6";
import {
  SiBurpsuite,
  SiMetasploit,
  SiObsidian,
  SiOwasp,
  SiRadixui,
  SiWireshark,
} from "react-icons/si";
import { Cursor02Icon } from "@hugeicons/core-free-icons";
import { hugeIcon } from "@/lib/huge-icon";
import { TECH_ICONS, type TechIcon } from "@/config/tech-icons";
import type { IconType } from "react-icons";

type SkillIcon = TechIcon | IconType;

// 1-5 scale: 1=learning, 2=familiar, 3=comfortable, 4=proficient, 5=advanced
export type Proficiency = 1 | 2 | 3 | 4 | 5;

export interface Skill {
  name: string;
  icon: SkillIcon;
  level: Proficiency;
}

export interface SkillGroup {
  id: string;
  skills: Skill[];
}

/** Chip registry first — same mark as project / experience / deep-dive. */
function icon(name: string, fallback?: SkillIcon): SkillIcon {
  const resolved = TECH_ICONS[name] ?? fallback;
  if (!resolved) {
    throw new Error(`No icon for skill "${name}"`);
  }
  return resolved;
}

function skill(name: string, level: Proficiency, fallback?: SkillIcon): Skill {
  return { name, icon: icon(name, fallback), level };
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
      skill("Radix UI", 4, SiRadixui),
      skill("Framer Motion", 4),
      skill("Vite", 4),
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
      skill("AWS", 2, FaAws),
      skill("Terraform", 2),
    ],
  },
  {
    id: "security",
    skills: [
      skill("Kali Linux", 4),
      skill("OSINT", 4),
      skill("Nmap", 4),
      skill("Wireshark", 3, SiWireshark),
      skill("OWASP", 3, SiOwasp),
      skill("Metasploit", 3, SiMetasploit),
      skill("Burp Suite", 2, SiBurpsuite),
    ],
  },
  {
    id: "tools",
    skills: [
      skill("VS Code", 5),
      skill("Cursor", 5, hugeIcon(Cursor02Icon)),
      skill("GitHub", 5),
      skill("npm", 4),
      skill("Notion", 4),
      skill("Obsidian", 4, SiObsidian),
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
