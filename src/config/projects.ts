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
    ],
    date: {
      start: "2026-06",
      end: "present",
    },
    priority: 8,
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
    github: "https://github.com/lyfe691/kinoa",
    technologies: [
      "Next.js App Router",
      "React Server Components",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "Tailwind CSS",
      "Framer Motion",
    ],
    date: {
      start: "2025-11",
      end: "present",
    },
    priority: 1,
    art: { preset: "caramel", seed: 0 },
    kind: "personal",
    slug: "kinoa",
    deepDive: {
      overview:
        "Kinoa is a free streaming website for watching films and series — no subscription, no paywall. Built with the Next.js App Router and shadcn/ui, it pulls live metadata from TMDB and streams through third-party hosters with automatic failover. The interface stays minimal: browse trending titles, discover new releases, and hit play right on the detail page without being redirected elsewhere.",
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
      "Framer Motion",
      "Three.js",
      "React Query",
      "i18n",
      "ESLint",
      "SEO",
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
      "Framer Motion",
      "Shiki",
    ],
    date: {
      start: "2026-03",
      end: "2026-04",
    },
    priority: 9,
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
    priority: 10,
    art: { preset: "cobalt", seed: 0 },
    kind: "personal",
    slug: "applicare",
    deepDive: {
      overview:
        "A comprehensive job application tracking system built with React and Spring Boot. Features a modern, intuitive interface for managing job applications, interviews, and career progress.",
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
    ],
    date: {
      start: "2025-05",
    },
    priority: 11,
    art: { preset: "midnight", seed: 0 },
    kind: "personal",
    slug: "self",
    deepDive: {
      overview:
        "Self is a Windows system information display tool that brings the beloved Neofetch experience to Windows users. Built with Python, it provides customizable themes, multiple image rendering modes, and comprehensive system information display with ASCII art or image support.",
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
    priority: 13,
    art: { preset: "wheat", seed: 1 },
    kind: "personal",
    slug: "code-extractor",
    deepDive: {
      overview:
        "A powerful Chrome extension that allows developers to easily extract and download the complete source code of any website. Used by 1000+ developers worldwide.",
    },
  },
  {
    id: "thoughts",
    i18nKey: "thoughts",
    link: "https://thoughts.ysz.life",
    github: "https://github.com/lyfe691/thoughts",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "MDX"],
    date: {
      start: "2025-08",
    },
    priority: 14,
    art: { preset: "almond", seed: 1 },
    kind: "personal",
    slug: "thoughts",
    deepDive: {
      overview:
        "A quiet space separate from my portfolio, designed for simplicity and writing. Built with Next.js, MDX, and Tailwind CSS, and featuring a custom guestbook for visitors to leave their own thoughts.",
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
      "Framer Motion",
      "i18n",
    ],
    date: {
      start: "2025-04",
    },
    priority: 15,
    art: { preset: "moss", seed: 0 },
    kind: "commercial",
    slug: "taco",
    deepDive: {
      overview:
        "Taco is a clean, production-ready template site centered around my brother's dog. It demonstrates localization with automatic detection, a simple blog system, and a modular architecture that can be adapted to real projects.",
    },
  },
  {
    id: "osint",
    i18nKey: "osint",
    link: "https://osint.ysz.life",
    github: "https://github.com/lyfe691/osint-ysz-life",
    technologies: ["React (Vite)", "shadcn/ui", "JavaScript"],
    date: {
      start: "2024-11",
      end: "2024-12",
    },
    priority: 17,
    art: { preset: "slate", seed: 0 },
    kind: "personal",
  },
  {
    id: "chatapp",
    i18nKey: "chatapp",
    link: "https://chat-app.ch",
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
    priority: 18,
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
    priority: 19,
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
    priority: 20,
    art: { preset: "starry", seed: 0 },
    kind: "personal",
  },
  {
    id: "docker-service",
    i18nKey: "dockerService",
    github: "https://github.com/lyfe691/LB-WISS_169-347",
    technologies: ["Docker", "Teamwork", "Documentation"],
    date: {
      start: "2024-06",
    },
    priority: 21,
    art: { preset: "irises", seed: 2 },
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
    priority: 22,
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
    priority: 23,
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
      "Framer Motion",
      "Sanity",
      "SEO",
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
    link: "https://ura-landing.vercel.app",
    technologies: [
      "TypeScript",
      "React",
      "Tailwind CSS",
      "Next.js App Router",
      "Supabase",
      "Capacitor",
      "MapLibre",
      "Vercel",
    ],
    date: { start: "2026-08", end: "present" },
    priority: 4,
    art: { preset: "night", seed: 1 },
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
      "Framer Motion",
      "Vercel",
    ],
    date: { start: "2026-03", end: "2026-04" },
    priority: 6,
    art: { preset: "moss", seed: 1 },
    kind: "commercial",
    sourcePrivate: true,
    slug: "montu",
    deepDive: {
      overview:
        "Montu is a mountain-tour journal in Swiss German at montu.ch, built for someone who writes the tours and takes the photographs himself. Next.js 16 on the front, Sanity behind it: the hero slideshow, the navigation labels, the legal pages and every tour are CMS fields, so publishing a tour needs no deploy. Each tour's Mapbox route and elevation profile are derived on the server from one uploaded GPX file. Two tours are live.",
    },
  },
  {
    id: "sigrid",
    i18nKey: "sigrid",
    link: "https://dulces-momentos-de-sigrid.vercel.app",
    technologies: [
      "Next.js App Router",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "Framer Motion",
      "Vercel",
    ],
    date: { start: "2026-03" },
    priority: 7,
    art: { preset: "caramel", seed: 1 },
    kind: "commercial",
    sourcePrivate: true,
    slug: "sigrid",
    deepDive: {
      overview:
        "Dulces Momentos de Sigrid is a four-page Spanish catalogue site for a home baker, my mom. Seventeen creations sit behind four category filters, every card opens into a lightbox, and the contact page links out to Instagram and WhatsApp instead of taking orders: she sells by message, so the site stops where the conversation starts. It runs on Next.js 16 and Vercel, with the whole catalogue in a single TypeScript file rather than a CMS.",
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
    ],
    date: { start: "2026-04" },
    priority: 12,
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
    ],
    date: { start: "2025-05" },
    priority: 16,
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
    github: "https://github.com/lyfe691/fleetmap",
    technologies: [
      "Next.js App Router",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "MapLibre",
      "OSRM",
      "Docker",
      "Tailwind CSS",
    ],
    date: { start: "2026-06", end: "present" },
    priority: 3,
    art: { preset: "almond", seed: 2 },
    kind: "commercial",
    slug: "fleetmap",
    deepDive: {
      overview:
        "fleetmap is a real-time map of a delivery fleet. Each van's phone posts its GPS to a thin API, Supabase Realtime pushes the row change out, and a screen in the office moves that marker; orders arrive on their own from the route optimizer the operation already runs, polled every 60 seconds. Three data flows share one stateless API, and the whole stack runs in Docker on a single server. It has been in production since summer 2026.",
    },
  },
];
