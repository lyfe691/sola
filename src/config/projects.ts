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
        "magi is a fast, asynchronous TCP and UDP port scanner written in Rust. It does connect scanning — a normal handshake on each port — so it needs no root and runs anywhere tokio does. Within that scope it is built to be trustworthy: it never reports a port state it didn't actually establish, and when a probe can't run it says so (untestable) rather than guessing closed. Bounded concurrency over tokio keeps memory flat whether you scan a single host or a whole /16, with banner grabbing, UDP probing, CIDR expansion, and JSON output for piping into tools like jq.",
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
        "Kinoa is a free streaming site for films and series. It takes its catalogue from TMDB and plays through third-party hosters embedded on the detail page, so you browse, open a title and press play without leaving it; if one server fails you pick another. Accounts are optional and add a watchlist and a history that sync across devices. Built with the Next.js App Router, Supabase and shadcn/ui.",
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
      "Zod",
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
        "Luma is a multi-model AI platform where you bring your own API keys and talk to the best models from OpenAI, Anthropic, Google, xAI, Mistral, Cohere, DeepSeek, and more — all through a single, polished interface. Built with Next.js 16, the Vercel AI SDK, and Supabase, it features a tree-based conversation model with full branching support, encrypted key storage, streaming markdown rendering, web search, image generation, and rich content display including code highlighting, math, and diagrams.",
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
        "AppliCare is a web app for keeping track of job applications. Each application carries a status from applied to accepted, tasks with deadlines can be linked to it, and a dashboard shows totals, a success rate and a graph over time. The frontend is React with Ant Design, the backend is Spring Boot with MongoDB and JWT sign-in, and it was built for two school modules.",
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
        "Self shows your system information in the terminal next to an image or ASCII art: what Neofetch does on Linux, for Windows. It is written in Python, installs with one PowerShell command, renders images as coloured blocks or braille, and reads its layout and colours from a config file.",
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
        "Website Code Extractor is a Chrome and Edge extension that downloads a website's HTML, CSS, JavaScript and images as one ZIP file with the folder structure kept. It is plain JavaScript on Manifest V3 with JSZip, and 6,000 people use it on the Chrome Web Store.",
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
        "Thoughts is a small site where I write reflections, fragments and notes, separate from this portfolio. It is a Next.js app where every post is an MDX file, with a guestbook where visitors can leave a note of their own.",
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
      "Zod",
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
        "Taco is a website about my brother's dog, built as a template I can reuse. It has pages in English, Spanish and Japanese with automatic language detection, a blog, a gallery and a contact page, on Next.js, TypeScript and Tailwind CSS.",
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
      "Vercel",
    ],
    date: { start: "2026-09" },
    priority: 5,
    art: { preset: "wheat", seed: 3 },
    kind: "commercial",
    sourcePrivate: true,
    slug: "perspectas",
    deepDive: {
      overview:
        "perspectas gmbh is a consulting and recruiting firm in Wetzikon ZH. I replaced their WordPress site with a Next.js and Sanity build, live since 11 September 2026. Every line of text and every image now lives in a CMS the two partners log into themselves, which is the one thing the old stack never gave them. The hosting account and the domain are in their name, not mine.",
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
        "Ura is snowmobile route navigation for Finnish Lapland, built as a client project. It ships as a Capacitor app that carries the whole national route network offline and a web console where routes are imported, corrected and published to it. The engine answers one question on every position fix: are you on a route, and is that route free to ride or does it need a Metsähallitus permit.",
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
        "Montu is a mountain-tour journal in Swiss German at montu.ch, built for someone who writes the tours and takes the photographs himself. Next.js 16 on the front, Sanity behind it: the hero slideshow, the navigation labels, the legal pages and every tour are CMS fields, so publishing a tour needs no deploy. Each tour's Mapbox route and elevation profile are derived on the server from one uploaded GPX file. Two tours are live.",
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
      "Base UI",
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
        "qr.ysz.life generates QR codes in the browser. You paste a link or type text, change the dot and corner shapes, the colors, the gradients and the center logo, then download PNG, SVG, JPEG or WebP. There is no backend: rendering runs client-side through qr-code-styling, and the last ten codes stay in localStorage. Because styling is what makes a code fail to decode, the header keeps a Scan Test that reads a finished image back with a real scanner.",
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
      "Zod",
    ],
    date: { start: "2025-05" },
    priority: 15,
    art: { preset: "midnight", seed: 1 },
    kind: "personal",
    slug: "vault",
    deepDive: {
      overview:
        "Vault is a local OpenID Connect sandbox: Keycloak 26 as the provider, PostgreSQL behind it, a FastAPI service that verifies RS256 tokens against the realm's key set, and a Next.js frontend with a sign-in page and two role-gated dashboards. The part worth copying is the provisioning. The realm, the client, both roles and the demo user are declared in Terraform, so a broken setup is one destroy-and-apply rather than another pass through the admin console.",
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
      "GitHub Actions",
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
        "fleetmap is a live map of a delivery fleet. Each van's phone reports its position, and a screen in the office shows every van moving, with its stops, ETA and how late it is running. Orders arrive on their own from the route planning the fleet already uses, so nobody types anything in. It has been in production since summer 2026.",
    },
  },
];
