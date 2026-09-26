/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import type { ProjectDate } from "@/lib/dates";
import type { Translation } from "@/lib/translations";
import type { ProjectArt } from "@/components/painted-cover/presets";

export type { ProjectArt };

export type ProjectI18nKey = keyof Translation["projects"]["list"];

/** Which tab of the projects page a project belongs to. */
export type ProjectKind = "personal" | "commercial";

export interface ProjectDeepDiveMeta {
  mdxPath?: string;
  overview: string;
  demo?: string;
}

export interface ProjectMeta {
  id: string;
  i18nKey: ProjectI18nKey;
  link?: string;
  github?: string;
  /** The repository exists but is private: the UI shows a disabled source
   *  button with a tooltip instead of a link that would 404. */
  sourcePrivate?: boolean;
  /** The live app exists but is not public (it runs inside a client's
   *  company): a disabled visit button with a tooltip instead of a link. */
  linkPrivate?: boolean;
  technologies: string[];
  date: ProjectDate;
  priority: number;
  /** Painted cover art: a named preset plus a seed that rotates its flow field. */
  art: ProjectArt;
  kind: ProjectKind;
  /** present = project has a deep-dive page at /projects/<slug> */
  slug?: string;
  /** Long-form page content lives in src/content/projects/<mdxPath>.mdx */
  deepDive?: ProjectDeepDiveMeta;
}

export const PROJECTS: ProjectMeta[] = [
  {
    id: "magi",
    i18nKey: "magi",
    link: "https://magi.ysz.life",
    github: "https://github.com/lyfe691/magi",
    technologies: [
      "Rust",
      "tokio",
      "Async",
      "CLI",
      "TCP/UDP",
      "Networking",
      "cargo-dist",
      "GitHub Actions",
    ],
    date: {
      start: "2026-06",
      end: "present",
    },
    priority: 7,
    art: { preset: "irises", seed: 0 },
    kind: "personal",
    slug: "magi",
    deepDive: {
      overview:
        "magi is a command-line port scanner for TCP and UDP, written in Rust on tokio, with prebuilt releases for Linux, macOS and Windows and a small site at magi.ysz.life. The scanning core is a library with its own integration tests, and the command-line tool is a thin layer over it.",
    },
  },
  {
    id: "kinoa",
    i18nKey: "kinoa",
    link: "https://kinoa.to",
    technologies: [
      "Next.js App Router",
      "React Server Components",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "Tailwind CSS",
      "Motion",
      "Base UI",
      "shadcn/ui",
      "i18n",
      "Vercel",
      "GitHub Actions",
    ],
    date: {
      start: "2025-11",
      end: "present",
    },
    priority: 1,
    art: { preset: "caramel", seed: 0 },
    kind: "personal",
    sourcePrivate: true,
    slug: "kinoa",
    deepDive: {
      overview:
        "Kinoa is a free site for films and series with a social layer around the player: profiles, a feed, comments, messages and Watch Together rooms. I've built it since November 2025 as a Next.js app on Supabase, and around 10,000 people use it each month.",
    },
  },
  {
    id: "sola",
    i18nKey: "sola",
    link: "https://sola.ysz.life",
    github: "https://github.com/lyfe691/sola",
    technologies: [
      "React (Vite)",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "Motion",
      "Three.js",
      "React Query",
      "i18n",
      "ESLint",
      "SEO",
      "Base UI",
      "MDX",
      "Vitest",
      "Vercel",
      "Bun",
      "GitHub Actions",
    ],
    date: {
      start: "2025-02",
      end: "present",
    },
    priority: 2,
    art: { preset: "night", seed: 0 },
    kind: "personal",
    slug: "sola",
    deepDive: {
      overview:
        "Sola is the website you are currently on. It represents a modern approach to portfolio design, combining cutting-edge web technologies with thoughtful user experience. Built from the ground up with React and TypeScript, it showcases projects and skills through smooth animations, multiple themes, and a responsive design that works seamlessly across all devices. Its built to be fast and efficient, with a focus on user experience and performance.",
    },
  },
  {
    id: "luma",
    i18nKey: "luma",
    link: "https://luma.ysz.life",
    github: "https://github.com/lyfe691/luma",
    technologies: [
      "Next.js App Router",
      "TypeScript",
      "Vercel AI SDK",
      "Supabase",
      "PostgreSQL",
      "Tailwind CSS",
      "Motion",
      "Shiki",
      "Base UI",
      "shadcn/ui",
      "Three.js",
    ],
    date: {
      start: "2026-03",
      end: "2026-04",
    },
    priority: 8,
    art: { preset: "almond", seed: 0 },
    kind: "personal",
    slug: "luma",
    deepDive: {
      overview:
        "Luma is a web chat app for many model providers that runs on the user's own API keys, built with Next.js, the Vercel AI SDK and Supabase. Conversations are stored as a tree of messages, and keys are encrypted with AES-256-GCM and decrypted on the server only for the request that uses them.",
    },
  },
  {
    id: "applicare",
    i18nKey: "applicare",
    link: "https://applicare.app",
    github: "https://github.com/lyfe691/AppliCare",
    technologies: [
      "React (Vite)",
      "Spring Boot",
      "Ant Design",
      "MongoDB",
      "Java",
      "JavaScript",
      "Docker",
      "SEO",
    ],
    date: {
      start: "2024-12",
      end: "2025-02",
    },
    priority: 9,
    art: { preset: "cobalt", seed: 0 },
    kind: "personal",
    slug: "applicare",
    deepDive: {
      overview:
        "AppliCare is a job-application tracker I built end to end, from the React interface to the Java API and the database behind it. The API ties every request to its user through a signed token, so each account only ever sees its own applications and tasks.",
    },
  },
  {
    id: "self",
    i18nKey: "self",
    github: "https://github.com/lyfe691/self",
    technologies: [
      "Python",
      "Windows API",
      "ASCII Art",
      "System Information",
      "Command Line Interface",
      "Package Management",
      "PowerShell",
    ],
    date: {
      start: "2025-05",
    },
    priority: 10,
    art: { preset: "midnight", seed: 3 },
    kind: "personal",
    slug: "self",
    deepDive: {
      overview:
        "Self brings Neofetch's picture-and-facts screen to Windows PowerShell. I wrote it in Python in May 2025; it installs per user with one PowerShell command and is configured with a short setup wizard.",
    },
  },
  {
    id: "code-extractor",
    i18nKey: "codeExtractor",
    link: "https://chromewebstore.google.com/detail/website-code-extractor/foppgeakfpkdghmmmflmblcidoofpohm",
    github: "https://github.com/lyfe691/Website-Code-Extractor",
    technologies: ["Chrome Extension", "JSZip", "HTML", "CSS", "JavaScript"],
    date: {
      start: "2024-08",
    },
    priority: 12,
    art: { preset: "wheat", seed: 1 },
    kind: "personal",
    slug: "code-extractor",
    deepDive: {
      overview:
        "Website Code Extractor is a one-button Chrome and Edge extension for saving a page to study how it's built. The ZIP it downloads opens straight from the folder, because the stylesheets, scripts and images its HTML references are saved next to it and linked by their new paths.",
    },
  },
  {
    id: "thoughts",
    i18nKey: "thoughts",
    link: "https://thoughts.ysz.life",
    github: "https://github.com/lyfe691/thoughts",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "MDX",
      "PostgreSQL",
      "Vercel",
    ],
    date: {
      start: "2025-08",
    },
    priority: 13,
    art: { preset: "almond", seed: 5 },
    kind: "personal",
    slug: "thoughts",
    deepDive: {
      overview:
        "Thoughts is my writing site, kept apart from this portfolio: a few pages of plain text and a guestbook that anyone can sign. I built it in August 2025 as a Next.js app on Vercel, with the posts as MDX files and the guestbook in Postgres.",
    },
  },
  {
    id: "taco",
    i18nKey: "taco",
    link: "https://takitwo.vercel.app",
    github: "https://github.com/lyfe691/taco",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Motion",
      "i18n",
      "shadcn/ui",
      "Radix UI",
      "Vercel",
    ],
    date: {
      start: "2025-04",
    },
    priority: 14,
    art: { preset: "moss", seed: 0 },
    kind: "personal",
    slug: "taco",
    deepDive: {
      overview:
        "Taco is my brother's Pomeranian, and this is his website. I set it up so the next small site of its kind can start from the same code and only swap in new colours and new text.",
    },
  },
  {
    id: "osint",
    i18nKey: "osint",
    link: "https://osint.ysz.life",
    github: "https://github.com/lyfe691/osint-ysz-life",
    technologies: [
      "React (Vite)",
      "shadcn/ui",
      "JavaScript",
      "Tailwind CSS",
      "Radix UI",
      "Motion",
      "React Query",
      "Zod",
      "OSINT",
    ],
    date: {
      start: "2024-11",
      end: "2024-12",
    },
    priority: 16,
    art: { preset: "slate", seed: 5 },
    kind: "personal",
  },
  {
    id: "chatapp",
    i18nKey: "chatapp",
    github: "https://github.com/lyfe691/chatapp",
    technologies: [
      "React",
      "Spring Boot",
      "MongoDB",
      "Java",
      "JavaScript",
      "WebSocket",
    ],
    date: {
      start: "2024-09",
    },
    priority: 17,
    art: { preset: "irises", seed: 1 },
    kind: "personal",
  },
  {
    id: "vm-detector",
    i18nKey: "vmDetector",
    github: "https://github.com/lyfe691/Virtual-Machine-Detector",
    technologies: ["Java", "Virtual Machine", "Detection"],
    date: {
      start: "2024-08",
    },
    priority: 18,
    art: { preset: "slate", seed: 1 },
    kind: "personal",
  },
  {
    id: "view-counter",
    i18nKey: "viewCounter",
    github: "https://github.com/lyfe691/View_Counter",
    technologies: ["Spring Boot", "Redis", "Java"],
    date: {
      start: "2024-08",
    },
    priority: 19,
    art: { preset: "starry", seed: 0 },
    kind: "personal",
  },
  {
    id: "docker-service",
    i18nKey: "dockerService",
    github: "https://github.com/lyfe691/m169-347",
    technologies: ["Docker", "Teamwork", "Documentation", "MySQL"],
    date: {
      start: "2024-06",
    },
    priority: 20,
    art: { preset: "irises", seed: 6 },
    kind: "personal",
  },
  {
    id: "phishing",
    i18nKey: "phishing",
    github: "https://github.com/lyfe691/phishing-website-tutorial",
    technologies: ["HTML", "CSS", "JavaScript", "Node.js", "Tutorial"],
    date: {
      start: "2024-04",
    },
    priority: 21,
    art: { preset: "poison", seed: 0 },
    kind: "personal",
  },
  {
    id: "otw",
    i18nKey: "otw",
    github: "https://github.com/lyfe691/OverTheWire-bandit",
    technologies: [
      "Kali Linux",
      "OverTheWire",
      "Linux",
      "Tutorial",
      "Ethical Hacking",
    ],
    date: {
      start: "2024-04",
    },
    priority: 22,
    art: { preset: "slate", seed: 2 },
    kind: "personal",
  },
  {
    id: "perspectas",
    i18nKey: "perspectas",
    link: "https://www.perspectas.ch",
    technologies: [
      "Next.js App Router",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "Motion",
      "Sanity",
      "SEO",
      "Base UI",
    ],
    date: { start: "2026-09" },
    priority: 5,
    art: { preset: "wheat", seed: 3 },
    kind: "commercial",
    sourcePrivate: true,
    slug: "perspectas",
    deepDive: {
      overview:
        "perspectas gmbh is a consulting and recruiting firm in Wetzikon, near Zürich, run by two partners. Its website is in German and speaks to two audiences at once: companies that need help with staffing, and people looking for their next role.",
    },
  },
  {
    id: "ura",
    i18nKey: "ura",
    link: "https://ura-app.com",
    technologies: [
      "TypeScript",
      "React",
      "Tailwind CSS",
      "Next.js App Router",
      "Supabase",
      "Capacitor",
      "MapLibre",
      "Vercel",
      "Base UI",
      "shadcn/ui",
      "Motion",
      "Vite",
      "Zod",
      "Vitest",
      "GitHub Actions",
    ],
    date: { start: "2026-08", end: "present" },
    priority: 4,
    art: { preset: "night", seed: 2 },
    kind: "commercial",
    sourcePrivate: true,
    slug: "ura",
    deepDive: {
      overview:
        "I designed and built Ura for a client: the rider app for iPhone and Android, and ura-app.com, the website that introduces it. The app is written in React and TypeScript and runs on both phones through Capacitor, with its map drawn by MapLibre.",
    },
  },
  {
    id: "montu",
    i18nKey: "montu",
    link: "https://montu.ch",
    technologies: [
      "Next.js App Router",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "Sanity",
      "Mapbox",
      "Motion",
      "Vercel",
      "Base UI",
      "Radix UI",
    ],
    date: { start: "2026-03", end: "2026-04" },
    priority: 6,
    art: { preset: "moss", seed: 2 },
    kind: "commercial",
    sourcePrivate: true,
    slug: "montu",
    deepDive: {
      overview:
        "Montu is a journal of Swiss mountain tours in German, from summer crossings to ski and splitboard tours, written and photographed by the friend I built it for. Each tour page is his account of the day, with the route, the figures and the way there and back alongside for anyone who wants to follow it.",
    },
  },
  {
    id: "qr",
    i18nKey: "qr",
    link: "https://qr.ysz.life",
    technologies: [
      "Next.js App Router",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "qr-code-styling",
      "qr-scanner",
      "Radix UI",
    ],
    date: { start: "2026-04" },
    priority: 11,
    art: { preset: "slate", seed: 3 },
    kind: "personal",
    sourcePrivate: true,
    slug: "qr",
    deepDive: {
      overview:
        "qr.ysz.life is a QR code generator for styled codes: dot shapes, colours and gradients, and a logo in the middle. Because styling is what breaks a code, it also decodes exported images to check that they still scan.",
    },
  },
  {
    id: "vault",
    i18nKey: "vault",
    github: "https://github.com/lyfe691/vault",
    technologies: [
      "Keycloak",
      "FastAPI",
      "Python",
      "Docker",
      "Terraform",
      "PostgreSQL",
      "Next.js",
      "TypeScript",
      "shadcn/ui",
      "Radix UI",
      "Tailwind CSS",
    ],
    date: { start: "2025-05" },
    priority: 15,
    art: { preset: "midnight", seed: 1 },
    kind: "personal",
    slug: "vault",
    deepDive: {
      overview:
        "Vault is an OpenID Connect sandbox that runs on one machine, with Keycloak and its database in Docker. Everything Keycloak needs, from the realm to the demo user, is written in Terraform, so one terraform apply rebuilds the whole identity setup from nothing.",
    },
  },
  {
    id: "fleetmap",
    i18nKey: "fleetmap",
    technologies: [
      "Next.js App Router",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "MapLibre",
      "OSRM",
      "Docker",
      "Tailwind CSS",
      "Base UI",
      "shadcn/ui",
      "Motion",
      "Three.js",
      "Vitest",
      "Bash",
    ],
    date: { start: "2026-06", end: "present" },
    priority: 3,
    art: { preset: "almond", seed: 7 },
    kind: "commercial",
    sourcePrivate: true,
    linkPrivate: true,
    slug: "fleetmap",
    deepDive: {
      overview:
        "I built fleetmap for a delivery company in Switzerland, as the screen its office keeps on the wall. It is a Next.js app on Supabase, with the map drawn by MapLibre and the road routes and arrival times worked out by OSRM.",
    },
  },
];
