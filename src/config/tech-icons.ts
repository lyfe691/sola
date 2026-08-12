/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Icons for tech chips (project cards, deep-dive tech stack, experience
 * rows). Every chip gets an icon, from exactly two sources with
 * non-overlapping jobs:
 *   - devicons-react — brand marks only (the official devicon set; the one
 *     place logos come from, colored by the brand)
 *   - lucide-react — semantic glyphs for concept tags (i18n, CLI, Teamwork,
 *     …); they inherit the chip's muted text color, so brands read colored
 *     and concepts read quiet
 * Anything unmapped falls back to the Tag glyph (TECH_ICON_FALLBACK) — add
 * a mapping when a fallback shows up somewhere visible.
 */

import type { ComponentType } from "react";
import {
  AppWindow,
  BookOpen,
  Box,
  Briefcase,
  Cable,
  Component,
  Cpu,
  FileArchive,
  FlaskConical,
  FolderTree,
  GraduationCap,
  Highlighter,
  KeyRound,
  Languages,
  ListChecks,
  Network,
  Package,
  Radar,
  RefreshCw,
  Search,
  Shield,
  Swords,
  Tag,
  Terminal,
  Type,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import AntdesignOriginal from "devicons-react/icons/AntdesignOriginal";
import ChromeOriginal from "devicons-react/icons/ChromeOriginal";
import Css3Original from "devicons-react/icons/Css3Original";
import DockerOriginal from "devicons-react/icons/DockerOriginal";
import EslintOriginal from "devicons-react/icons/EslintOriginal";
import FigmaOriginal from "devicons-react/icons/FigmaOriginal";
import FramermotionOriginal from "devicons-react/icons/FramermotionOriginal";
import GitOriginal from "devicons-react/icons/GitOriginal";
import GithubactionsOriginal from "devicons-react/icons/GithubactionsOriginal";
import Html5Original from "devicons-react/icons/Html5Original";
import JavaOriginal from "devicons-react/icons/JavaOriginal";
import JavascriptOriginal from "devicons-react/icons/JavascriptOriginal";
import LinuxOriginal from "devicons-react/icons/LinuxOriginal";
import MarkdownOriginal from "devicons-react/icons/MarkdownOriginal";
import MongodbOriginal from "devicons-react/icons/MongodbOriginal";
import NestjsOriginal from "devicons-react/icons/NestjsOriginal";
import NextjsOriginal from "devicons-react/icons/NextjsOriginal";
import NodejsOriginal from "devicons-react/icons/NodejsOriginal";
import PostgresqlOriginal from "devicons-react/icons/PostgresqlOriginal";
import PowershellOriginal from "devicons-react/icons/PowershellOriginal";
import PythonOriginal from "devicons-react/icons/PythonOriginal";
import ReactOriginal from "devicons-react/icons/ReactOriginal";
import RedisOriginal from "devicons-react/icons/RedisOriginal";
import RustOriginal from "devicons-react/icons/RustOriginal";
import SpringOriginal from "devicons-react/icons/SpringOriginal";
import SupabaseOriginal from "devicons-react/icons/SupabaseOriginal";
import TailwindcssOriginal from "devicons-react/icons/TailwindcssOriginal";
import ThreejsOriginal from "devicons-react/icons/ThreejsOriginal";
import TypescriptOriginal from "devicons-react/icons/TypescriptOriginal";
import VercelOriginal from "devicons-react/icons/VercelOriginal";

export type TechIcon = ComponentType<{
  className?: string;
  size?: number;
  "aria-hidden"?: boolean | "true" | "false";
}>;

/** exact display-name -> mark; variants of one stack share its mark */
export const TECH_ICONS: Record<string, TechIcon> = {
  "Ant Design": AntdesignOriginal,
  "Chrome Extension": ChromeOriginal,
  CSS: Css3Original,
  Docker: DockerOriginal,
  ESLint: EslintOriginal,
  Figma: FigmaOriginal,
  "Framer Motion": FramermotionOriginal,
  Git: GitOriginal,
  "GitHub Actions": GithubactionsOriginal,
  HTML: Html5Original,
  Java: JavaOriginal,
  JavaScript: JavascriptOriginal,
  "Kali Linux": LinuxOriginal,
  Linux: LinuxOriginal,
  MDX: MarkdownOriginal,
  MongoDB: MongodbOriginal,
  NestJS: NestjsOriginal,
  "Next.js": NextjsOriginal,
  "Next.js App Router": NextjsOriginal,
  "Node.js": NodejsOriginal,
  PostgreSQL: PostgresqlOriginal,
  Powershell: PowershellOriginal,
  Python: PythonOriginal,
  React: ReactOriginal,
  "React (Vite)": ReactOriginal,
  "React Server Components": ReactOriginal,
  Redis: RedisOriginal,
  Rust: RustOriginal,
  "Spring Boot": SpringOriginal,
  Supabase: SupabaseOriginal,
  "Tailwind CSS": TailwindcssOriginal,
  "Three.js": ThreejsOriginal,
  TypeScript: TypescriptOriginal,
  "Vercel AI SDK": VercelOriginal,
  tokio: RustOriginal,

  // ---- concept tags (lucide, monochrome) ----
  "ASCII Art": Type,
  "Active Directory": FolderTree,
  Async: Zap,
  Automation: Workflow,
  CLI: Terminal,
  "Command Line Interface": Terminal,
  Detection: Radar,
  Documentation: BookOpen,
  English: Languages,
  "Ethical Hacking": Shield,
  French: Languages,
  German: Languages,
  "Identity & Access Management (IAM)": KeyRound,
  JSZip: FileArchive,
  MINT: FlaskConical,
  Networking: Network,
  "Office 365": Briefcase,
  OverTheWire: Swords,
  "Package Management": Package,
  "Project Management": ListChecks,
  "React Query": RefreshCw,
  SEO: Search,
  Shiki: Highlighter,
  "System Information": Cpu,
  "TCP/UDP": Network,
  Teamwork: Users,
  Tutorial: GraduationCap,
  "Virtual Machine": Box,
  WebSocket: Cable,
  "Windows API": AppWindow,
  "cargo-dist": Package,
  i18n: Languages,
  "shadcn/ui": Component,
};

/** last-resort glyph so no chip is ever icon-less */
export const TECH_ICON_FALLBACK: TechIcon = Tag;
