/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 */

import {
  ReactOriginal,
  TypescriptOriginal,
  DockerOriginal,
  JavascriptOriginal,
  TailwindcssOriginal,
  NextjsOriginal,
  MongodbOriginal,
  SpringOriginal,
  PostgresqlOriginal,
  MysqlOriginal,
  NodejsOriginal,
  GitOriginal,
  LinuxOriginal,
  PythonOriginal,
  JavaOriginal,
  FigmaOriginal,
  Html5Original,
  Css3Original,
} from "devicons-react";
import {
  SiShadcnui,
  SiVercel,
  SiGithubactions,
  SiGnubash,
  SiKalilinux,
  SiBurpsuite,
  SiWireshark,
  SiPostman,
  SiNotion,
} from "react-icons/si";
import { VscodeOriginal } from "devicons-react";
import { Terminal } from "lucide-react";
import type { IconType } from "react-icons";
import type { ComponentType } from "react";

type DevIcon = ComponentType<{ className?: string; size?: number }>;

// 1-5 scale: 1=learning, 2=familiar, 3=comfortable, 4=proficient, 5=advanced
export type Proficiency = 1 | 2 | 3 | 4 | 5;

export interface Skill {
  name: string;
  icon: DevIcon | IconType;
  level: Proficiency;
}

export interface SkillGroup {
  id: string;
  skills: Skill[];
}

const SKILL_GROUPS_RAW: SkillGroup[] = [
  {
    id: "languages",
    skills: [
      { name: "HTML", icon: Html5Original, level: 5 },
      { name: "TypeScript", icon: TypescriptOriginal, level: 4 },
      { name: "JavaScript", icon: JavascriptOriginal, level: 4 },
      { name: "Java", icon: JavaOriginal, level: 4 },
      { name: "CSS", icon: Css3Original, level: 4 },
      { name: "Python", icon: PythonOriginal, level: 3 },
    ],
  },
  {
    id: "frontend",
    skills: [
      { name: "React", icon: ReactOriginal, level: 5 },
      { name: "Tailwind CSS", icon: TailwindcssOriginal, level: 5 },
      { name: "Next.js", icon: NextjsOriginal, level: 4 },
      { name: "shadcn/ui", icon: SiShadcnui, level: 5 },
      { name: "Figma", icon: FigmaOriginal, level: 3 },
    ],
  },
  {
    id: "backend",
    skills: [
      { name: "Spring Boot", icon: SpringOriginal, level: 4 },
      { name: "MongoDB", icon: MongodbOriginal, level: 4 },
      { name: "Node.js", icon: NodejsOriginal, level: 3 },
      { name: "PostgreSQL", icon: PostgresqlOriginal, level: 3 },
      { name: "MySQL", icon: MysqlOriginal, level: 3 },
    ],
  },
  {
    id: "infrastructure",
    skills: [
      { name: "Git", icon: GitOriginal, level: 5 },
      { name: "Docker", icon: DockerOriginal, level: 4 },
      { name: "Linux", icon: LinuxOriginal, level: 4 },
      { name: "Vercel", icon: SiVercel, level: 4 },
      { name: "GitHub Actions", icon: SiGithubactions, level: 3 },
      { name: "PowerShell", icon: Terminal, level: 4 },
      { name: "Bash", icon: SiGnubash, level: 3 },
    ],
  },
  {
    id: "security",
    skills: [
      { name: "Kali Linux", icon: SiKalilinux, level: 4 },
      { name: "OSINT", icon: Terminal, level: 4 },
      { name: "Wireshark", icon: SiWireshark, level: 3 },
      { name: "Burp Suite", icon: SiBurpsuite, level: 2 },
    ],
  },
  {
    id: "tools",
    skills: [
      { name: "VS Code", icon: VscodeOriginal, level: 5 },
      { name: "Postman", icon: SiPostman, level: 3 },
      { name: "Notion", icon: SiNotion, level: 4 },
    ],
  },
];

// Sort skills by proficiency level (highest first) within each group
export const SKILL_GROUPS: SkillGroup[] = SKILL_GROUPS_RAW.map((group) => ({
  ...group,
  skills: [...group.skills].sort((a, b) => b.level - a.level),
}));
