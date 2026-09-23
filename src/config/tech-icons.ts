/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Icons for tech chips (project cards, deep-dive tech stack, experience
 * rows) and skill tiles. Every name gets an icon, and brands and concepts
 * never share a source:
 *   - brand marks: devicons-react first, colored by the brand; simple-icons
 *     (react-icons/si) where devicons has no mark or draws one that fails at
 *     tile size, in its brand colour via brand(); Motion's own mark, which
 *     no set ships yet
 *   - hugeicons — semantic glyphs for concept tags (i18n, CLI, Teamwork,
 *     …); they inherit the chip's muted text color, so brands read colored
 *     and concepts read quiet
 * Anything unmapped falls back to the Tag glyph (TECH_ICON_FALLBACK) — add
 * a mapping when a fallback shows up somewhere visible.
 */

import { createElement, type ComponentProps, type ComponentType } from "react";
import {
  AppWindowIcon,
  BookOpen02Icon,
  CableIcon,
  CheckListIcon,
  Chemistry01Icon,
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
import { FaAws } from "react-icons/fa6";
import {
  SiBurpsuite,
  SiCursor,
  SiGnubash,
  SiKalilinux,
  SiMetasploit,
  SiNginx,
  SiObsidian,
  SiOwasp,
  SiRadixui,
  SiShadcnui,
  SiWireshark,
} from "react-icons/si";
import { hugeIcon } from "@/lib/huge-icon";
import { cn } from "@/lib/utils";
import AntdesignOriginal from "devicons-react/icons/AntdesignOriginal";
import ChromeOriginal from "devicons-react/icons/ChromeOriginal";
import CplusplusOriginal from "devicons-react/icons/CplusplusOriginal";
import Css3Original from "devicons-react/icons/Css3Original";
import DjangoPlain from "devicons-react/icons/DjangoPlain";
import DockerOriginal from "devicons-react/icons/DockerOriginal";
import EslintOriginal from "devicons-react/icons/EslintOriginal";
import FastapiOriginal from "devicons-react/icons/FastapiOriginal";
import FigmaOriginal from "devicons-react/icons/FigmaOriginal";
import GitOriginal from "devicons-react/icons/GitOriginal";
import GithubOriginal from "devicons-react/icons/GithubOriginal";
import GithubactionsOriginal from "devicons-react/icons/GithubactionsOriginal";
import Html5Original from "devicons-react/icons/Html5Original";
import InsomniaOriginal from "devicons-react/icons/InsomniaOriginal";
import JavaOriginal from "devicons-react/icons/JavaOriginal";
import JavascriptOriginal from "devicons-react/icons/JavascriptOriginal";
import KotlinOriginal from "devicons-react/icons/KotlinOriginal";
import KubernetesOriginal from "devicons-react/icons/KubernetesOriginal";
import LinuxPlain from "devicons-react/icons/LinuxPlain";
import MarkdownOriginal from "devicons-react/icons/MarkdownOriginal";
import MongodbOriginal from "devicons-react/icons/MongodbOriginal";
import MysqlOriginal from "devicons-react/icons/MysqlOriginal";
import NestjsOriginal from "devicons-react/icons/NestjsOriginal";
import NextjsOriginal from "devicons-react/icons/NextjsOriginal";
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

/** A one-colour mark painted in its brand colour. */
const brand =
  (
    Icon: ComponentType<ComponentProps<TechIcon> & { color?: string }>,
    color: string,
  ): TechIcon =>
  (props) =>
    createElement(Icon, { color, ...props });

// the shaded Tux (LinuxOriginal) is ~800 SVG shapes and a 200 KB module;
// the flat mark in Linux yellow reads the same at chip size
const LinuxMark = brand(LinuxPlain, "#FCC624");

// black (or near-black) marks vanish on a dark surface: flip or lift them
// wherever the scheme is dark, so every chip and tile can show them
const onDark =
  (Icon: TechIcon, adjust = "dark:invert"): TechIcon =>
  ({ className, ...props }) =>
    createElement(Icon, { ...props, className: cn(className, adjust) });

// Motion (formerly Framer Motion) has no mark in the icon sets yet; this is
// the one motion.dev serves, in the text colour like its white-on-black logo
const MotionMark: TechIcon = ({ size, ...props }) =>
  createElement(
    "svg",
    {
      viewBox: "0 0 25.364 9",
      width: size ?? "1em",
      height: size ?? "1em",
      fill: "currentColor",
      ...props,
    },
    createElement("path", {
      d: "M 9.587 0 L 4.57 9 L 0 9 L 3.917 1.972 C 4.524 0.883 6.039 0 7.301 0 Z M 20.794 2.25 C 20.794 1.007 21.817 0 23.079 0 C 24.341 0 25.364 1.007 25.364 2.25 C 25.364 3.493 24.341 4.5 23.079 4.5 C 21.817 4.5 20.794 3.493 20.794 2.25 Z M 10.443 0 L 15.013 0 L 9.997 9 L 5.427 9 Z M 15.841 0 L 20.411 0 L 16.494 7.028 C 15.887 8.117 14.372 9 13.11 9 L 10.825 9 Z",
    }),
  );

// devicons draw bash as a near-black box and nginx as a tiny wordmark; the
// simple-icons marks read at tile size (bash in the text colour)
const NginxMark = brand(SiNginx, "#009639");

const GithubMark = onDark(GithubOriginal);
const MarkdownMark = onDark(MarkdownOriginal);
const MysqlMark = onDark(MysqlOriginal, "dark:brightness-200");
const RustMark = onDark(RustOriginal);
const ThreejsMark = onDark(ThreejsOriginal);
const VercelMark = onDark(VercelOriginal);

/** exact display-name -> mark; variants of one stack share its mark */
export const TECH_ICONS: Record<string, TechIcon> = {
  "Ant Design": AntdesignOriginal,
  AWS: FaAws,
  Bash: SiGnubash,
  "Burp Suite": brand(SiBurpsuite, "#FF6633"),
  "C++": CplusplusOriginal,
  "Chrome Extension": ChromeOriginal,
  CSS: Css3Original,
  Cursor: SiCursor,
  Django: DjangoPlain,
  Docker: DockerOriginal,
  ESLint: EslintOriginal,
  FastAPI: FastapiOriginal,
  Figma: FigmaOriginal,
  Git: GitOriginal,
  GitHub: GithubMark,
  "GitHub Actions": GithubactionsOriginal,
  HTML: Html5Original,
  Insomnia: InsomniaOriginal,
  Java: JavaOriginal,
  JavaScript: JavascriptOriginal,
  "Kali Linux": onDark(brand(SiKalilinux, "#557C94"), "dark:brightness-175"),
  Kotlin: KotlinOriginal,
  Kubernetes: KubernetesOriginal,
  Linux: LinuxMark,
  MDX: MarkdownMark,
  Metasploit: brand(SiMetasploit, "#2596CD"),
  MongoDB: MongodbOriginal,
  Motion: MotionMark,
  MySQL: MysqlMark,
  NestJS: NestjsOriginal,
  "Next.js": NextjsOriginal,
  "Next.js App Router": NextjsOriginal,
  Nginx: NginxMark,
  "Node.js": NodejsOriginal,
  Notion: NotionOriginal,
  npm: NpmOriginal,
  Obsidian: brand(SiObsidian, "#7C3AED"),
  OWASP: SiOwasp,
  PostgreSQL: PostgresqlOriginal,
  Postman: PostmanOriginal,
  Powershell: PowershellPlain,
  PowerShell: PowershellPlain,
  Python: PythonOriginal,
  "Radix UI": SiRadixui,
  React: ReactOriginal,
  "React (Vite)": ReactOriginal,
  "React Server Components": ReactOriginal,
  Redis: RedisOriginal,
  Rust: RustMark,
  "Spring Boot": SpringOriginal,
  Supabase: SupabaseOriginal,
  "Tailwind CSS": TailwindcssOriginal,
  Terraform: TerraformOriginal,
  "Three.js": ThreejsMark,
  TypeScript: TypescriptOriginal,
  Vercel: VercelMark,
  "Vercel AI SDK": VercelMark,
  Vite: ViteOriginal,
  "VS Code": VscodeOriginal,
  Wireshark: brand(SiWireshark, "#1679A7"),
  tokio: RustMark,

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
  // no vector mark exists at icon size (nmap.org ships a raster wordmark)
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
  "shadcn/ui": SiShadcnui,
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
