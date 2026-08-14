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
  FileZipIcon,
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
