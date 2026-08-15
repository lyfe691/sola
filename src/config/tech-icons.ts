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
 *   - hugeicons — semantic glyphs for concept tags (i18n, CLI, Teamwork,
 *     …); they inherit the chip's muted text color, so brands read colored
 *     and concepts read quiet
 * Anything unmapped falls back to the Tag glyph (TECH_ICON_FALLBACK) — add
 * a mapping when a fallback shows up somewhere visible.
 */

import type { ComponentType } from "react";
import {
  AppWindowIcon,
  BookOpen02Icon,
  CableIcon,
  CheckListIcon,
  Chemistry01Icon,
  ComponentIcon,
  ComputerTerminal01Icon,
  CpuIcon,
  CubeIcon,
  FileCodeIcon,
  FileZipIcon,
  Folder01Icon,
  FolderTreeIcon,
  GraduationCapIcon,
  HighlighterIcon,
  Key01Icon,
  TranslateIcon,
  Office365Icon,
  Package01Icon,
  RadarIcon,
  ReloadIcon,
  SaleTag01Icon,
  SearchIcon,
  Shield01Icon,
  Sword01Icon,
  TextFontIcon,
  UserGroupIcon,
  Wifi01Icon,
  WorkflowSquare01Icon,
  ZapIcon,
} from "@hugeicons/core-free-icons";
import { hugeIcon } from "@/lib/huge-icon";
import AntdesignOriginal from "devicons-react/icons/AntdesignOriginal";
import BashOriginal from "devicons-react/icons/BashOriginal";
import ChromeOriginal from "devicons-react/icons/ChromeOriginal";
import CplusplusOriginal from "devicons-react/icons/CplusplusOriginal";
import Css3Original from "devicons-react/icons/Css3Original";
import DjangoPlain from "devicons-react/icons/DjangoPlain";
import DockerOriginal from "devicons-react/icons/DockerOriginal";
import EslintOriginal from "devicons-react/icons/EslintOriginal";
import FastapiOriginal from "devicons-react/icons/FastapiOriginal";
import FigmaOriginal from "devicons-react/icons/FigmaOriginal";
import FramermotionOriginal from "devicons-react/icons/FramermotionOriginal";
import GitOriginal from "devicons-react/icons/GitOriginal";
import GithubOriginal from "devicons-react/icons/GithubOriginal";
import GithubactionsOriginal from "devicons-react/icons/GithubactionsOriginal";
import Html5Original from "devicons-react/icons/Html5Original";
import InsomniaOriginal from "devicons-react/icons/InsomniaOriginal";
import JavaOriginal from "devicons-react/icons/JavaOriginal";
import JavascriptOriginal from "devicons-react/icons/JavascriptOriginal";
import KotlinOriginal from "devicons-react/icons/KotlinOriginal";
import KubernetesOriginal from "devicons-react/icons/KubernetesOriginal";
import LinuxOriginal from "devicons-react/icons/LinuxOriginal";
import MarkdownOriginal from "devicons-react/icons/MarkdownOriginal";
import MongodbOriginal from "devicons-react/icons/MongodbOriginal";
import MysqlOriginal from "devicons-react/icons/MysqlOriginal";
import NestjsOriginal from "devicons-react/icons/NestjsOriginal";
import NextjsOriginal from "devicons-react/icons/NextjsOriginal";
import NginxOriginal from "devicons-react/icons/NginxOriginal";
import NodejsOriginal from "devicons-react/icons/NodejsOriginal";
import NotionOriginal from "devicons-react/icons/NotionOriginal";
import NpmOriginal from "devicons-react/icons/NpmOriginal";
import PostgresqlOriginal from "devicons-react/icons/PostgresqlOriginal";
import PostmanOriginal from "devicons-react/icons/PostmanOriginal";
import PowershellPlain from "devicons-react/icons/PowershellPlain";
import PythonOriginal from "devicons-react/icons/PythonOriginal";
import ReactOriginal from "devicons-react/icons/ReactOriginal";
import RedisOriginal from "devicons-react/icons/RedisOriginal";
import RustOriginal from "devicons-react/icons/RustOriginal";
import SpringOriginal from "devicons-react/icons/SpringOriginal";
import SupabaseOriginal from "devicons-react/icons/SupabaseOriginal";
import TailwindcssOriginal from "devicons-react/icons/TailwindcssOriginal";
import TerraformOriginal from "devicons-react/icons/TerraformOriginal";
import ThreejsOriginal from "devicons-react/icons/ThreejsOriginal";
import TypescriptOriginal from "devicons-react/icons/TypescriptOriginal";
import VercelOriginal from "devicons-react/icons/VercelOriginal";
import ViteOriginal from "devicons-react/icons/ViteOriginal";
import VscodeOriginal from "devicons-react/icons/VscodeOriginal";

export type TechIcon = ComponentType<{
  className?: string;
  size?: number;
  "aria-hidden"?: boolean | "true" | "false";
}>;

/** exact display-name -> mark; variants of one stack share its mark */
export const TECH_ICONS: Record<string, TechIcon> = {
  "Ant Design": AntdesignOriginal,
  Bash: BashOriginal,
  "C++": CplusplusOriginal,
  "Chrome Extension": ChromeOriginal,
  CSS: Css3Original,
  Django: DjangoPlain,
  Docker: DockerOriginal,
  ESLint: EslintOriginal,
  FastAPI: FastapiOriginal,
  Figma: FigmaOriginal,
  "Framer Motion": FramermotionOriginal,
  Git: GitOriginal,
  GitHub: GithubOriginal,
  "GitHub Actions": GithubactionsOriginal,
  HTML: Html5Original,
  Insomnia: InsomniaOriginal,
  Java: JavaOriginal,
  JavaScript: JavascriptOriginal,
  "Kali Linux": LinuxOriginal,
  Kotlin: KotlinOriginal,
  Kubernetes: KubernetesOriginal,
  Linux: LinuxOriginal,
  MDX: MarkdownOriginal,
  MongoDB: MongodbOriginal,
  MySQL: MysqlOriginal,
  NestJS: NestjsOriginal,
  "Next.js": NextjsOriginal,
  "Next.js App Router": NextjsOriginal,
  Nginx: NginxOriginal,
  "Node.js": NodejsOriginal,
  Notion: NotionOriginal,
  npm: NpmOriginal,
  PostgreSQL: PostgresqlOriginal,
  Postman: PostmanOriginal,
  Powershell: PowershellPlain,
  PowerShell: PowershellPlain,
  Python: PythonOriginal,
  React: ReactOriginal,
  "React (Vite)": ReactOriginal,
  "React Server Components": ReactOriginal,
  Redis: RedisOriginal,
  Rust: RustOriginal,
  "Spring Boot": SpringOriginal,
  Supabase: SupabaseOriginal,
  "Tailwind CSS": TailwindcssOriginal,
  Terraform: TerraformOriginal,
  "Three.js": ThreejsOriginal,
  TypeScript: TypescriptOriginal,
  Vercel: VercelOriginal,
  "Vercel AI SDK": VercelOriginal,
  Vite: ViteOriginal,
  "VS Code": VscodeOriginal,
  tokio: RustOriginal,

  // ---- concept tags (hugeicons, monochrome) ----
  "ASCII Art": hugeIcon(TextFontIcon),
  "Active Directory": hugeIcon(FolderTreeIcon),
  Async: hugeIcon(ZapIcon),
  Automation: hugeIcon(WorkflowSquare01Icon),
  CLI: hugeIcon(ComputerTerminal01Icon),
  "Command Line Interface": hugeIcon(ComputerTerminal01Icon),
  Detection: hugeIcon(RadarIcon),
  Documentation: hugeIcon(BookOpen02Icon),
  English: hugeIcon(TranslateIcon),
  "Ethical Hacking": hugeIcon(Shield01Icon),
  French: hugeIcon(TranslateIcon),
  German: hugeIcon(TranslateIcon),
  "Identity & Access Management (IAM)": hugeIcon(Key01Icon),
  JSZip: hugeIcon(FileZipIcon),
  MINT: hugeIcon(Chemistry01Icon),
  Networking: hugeIcon(Wifi01Icon),
  Nmap: hugeIcon(RadarIcon),
  OSINT: hugeIcon(SearchIcon),
  "Office 365": hugeIcon(Office365Icon),
  OverTheWire: hugeIcon(Sword01Icon),
  "Package Management": hugeIcon(Package01Icon),
  "Project Management": hugeIcon(CheckListIcon),
  "React Query": hugeIcon(ReloadIcon),
  SEO: hugeIcon(SearchIcon),
  Shiki: hugeIcon(HighlighterIcon),
  "System Information": hugeIcon(CpuIcon),
  "TCP/UDP": hugeIcon(Wifi01Icon),
  Teamwork: hugeIcon(UserGroupIcon),
  Tutorial: hugeIcon(GraduationCapIcon),
  "Virtual Machine": hugeIcon(CubeIcon),
  WebSocket: hugeIcon(CableIcon),
  "Windows API": hugeIcon(AppWindowIcon),
  "cargo-dist": hugeIcon(Package01Icon),
  i18n: hugeIcon(TranslateIcon),
  "shadcn/ui": hugeIcon(ComponentIcon),
};

/** last-resort glyph so no chip is ever icon-less */
export const TECH_ICON_FALLBACK: TechIcon = hugeIcon(SaleTag01Icon);

export const FOLDER_ICON: TechIcon = hugeIcon(Folder01Icon);
const FILE_ICON: TechIcon = hugeIcon(FileCodeIcon);

const FILE_TECH: Record<string, string> = {
  ts: "TypeScript",
  tsx: "React",
  js: "JavaScript",
  mjs: "JavaScript",
  cjs: "JavaScript",
  jsx: "React",
  css: "CSS",
  html: "HTML",
  md: "MDX",
  mdx: "MDX",
  sh: "Bash",
  rs: "Rust",
  py: "Python",
  ps1: "PowerShell",
};

const LANG_TECH: Record<string, string> = {
  typescript: "TypeScript",
  ts: "TypeScript",
  tsx: "React",
  jsx: "React",
  javascript: "JavaScript",
  js: "JavaScript",
  mjs: "JavaScript",
  cjs: "JavaScript",
  css: "CSS",
  html: "HTML",
  md: "MDX",
  mdx: "MDX",
  bash: "Bash",
  sh: "Bash",
  shell: "Bash",
  zsh: "Bash",
  powershell: "PowerShell",
  docker: "Docker",
  dockerfile: "Docker",
  rust: "Rust",
  python: "Python",
  console: "CLI",
};

const FILE_NAME_TECH: Record<string, string> = {
  dockerfile: "Docker",
  "docker-compose.yml": "Docker",
  "docker-compose.yaml": "Docker",
  "package.json": "npm",
  "package-lock.json": "npm",
  "tsconfig.json": "TypeScript",
  "tsconfig.app.json": "TypeScript",
  "tsconfig.node.json": "TypeScript",
  "components.json": "shadcn/ui",
  "vite.config.ts": "Vite",
  "vite.config.js": "Vite",
  "eslint.config.js": "ESLint",
  "eslint.config.ts": "ESLint",
  "tailwind.config.ts": "Tailwind CSS",
  "tailwind.config.js": "Tailwind CSS",
  ".gitignore": "Git",
  "vercel.json": "Vercel",
};

/** Brand mark for a path, from the filename — same registry as deep dives. */
export function techIconForFile(filename: string): TechIcon {
  const base = filename.slice(filename.lastIndexOf("/") + 1).toLowerCase();
  const named = FILE_NAME_TECH[base];
  if (named) return TECH_ICONS[named] ?? FILE_ICON;
  const lower = filename.replaceAll("\\", "/").toLowerCase();
  if (
    lower.includes(".github/workflows/") &&
    (lower.endsWith(".yml") || lower.endsWith(".yaml"))
  ) {
    return TECH_ICONS["GitHub Actions"] ?? FILE_ICON;
  }
  const ext = base.includes(".") ? base.slice(base.lastIndexOf(".") + 1) : "";
  const fromExt = FILE_TECH[ext];
  if (fromExt) return TECH_ICONS[fromExt] ?? FILE_ICON;
  return FILE_ICON;
}

/** Header mark for a code block: filename first, language as fallback. */
export function techIconForCode({
  filename,
  lang,
}: {
  filename?: string;
  lang?: string;
} = {}): TechIcon {
  if (filename?.endsWith("/")) return FOLDER_ICON;
  if (filename) {
    const icon = techIconForFile(filename);
    if (icon !== FILE_ICON) return icon;
  }
  if (lang) {
    const name = LANG_TECH[lang.toLowerCase()];
    if (name) return TECH_ICONS[name] ?? FILE_ICON;
  }
  return filename ? FILE_ICON : FOLDER_ICON;
}
