/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import type { Translation } from "@/lib/translations";

export type ProjectI18nKey = keyof Translation["projects"]["list"];

export interface ProjectSilk {
  color: string;
  speed?: number;
  scale?: number;
  noiseIntensity?: number;
  rotation?: number;
}

export interface ProjectDeepDiveMeta {
  mdxPath?: string;
  /** Hero subtitle on the deep-dive page. Falls back to the translated card description. */
  tagline?: string;
  overview: string;
  demo?: string;
  silk: ProjectSilk;
}

export interface ProjectMeta {
  id: string;
  i18nKey: ProjectI18nKey;
  image?: string;
  link?: string;
  github?: string;
  technologies: string[];
  featured: boolean;
  date: {
    start: string;
    end?: string;
    display: string;
  };
  priority: number;
  /** present = project has a deep-dive page at /projects/<slug> */
  slug?: string;
  vercelSatori?: boolean;
  /** Long-form page content lives in src/content/projects/<mdxPath>.mdx */
  deepDive?: ProjectDeepDiveMeta;
}

export const PROJECTS: ProjectMeta[] = [
  {
    id: "kinoa",
    i18nKey: "kinoa",
    image: "/projects/kinoa.png",
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
    featured: true,
    date: {
      start: "2025-11",
      display: "Nov 2025 - Present",
    },
    priority: 1,
    slug: "kinoa",
    vercelSatori: true,
    deepDive: {
      tagline:
        "A free streaming website for films and series with a clean, distraction-free interface",
      overview:
        "Kinoa is a free streaming website for watching films and series — no subscription, no paywall. Built with the Next.js App Router and shadcn/ui, it pulls live metadata from TMDB and streams through third-party hosters with automatic failover. The interface stays minimal: browse trending titles, discover new releases, and hit play right on the detail page without being redirected elsewhere.",
      silk: {
        color: "#a0785a",
        speed: 4.2,
        scale: 1.12,
        noiseIntensity: 1.6,
        rotation: -0.25,
      },
    },
  },
  {
    id: "luma",
    i18nKey: "luma",
    image: "/projects/luma.png",
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
    featured: true,
    date: {
      start: "2026-03",
      end: "2026-04",
      display: "Mar 2026 - Apr 2026",
    },
    priority: 2,
    slug: "luma",
    deepDive: {
      tagline:
        "A multi-model AI platform — bring your own keys, talk to any model",
      overview:
        "Luma is a multi-model AI platform where you bring your own API keys and talk to the best models from OpenAI, Anthropic, Google, xAI, Mistral, Cohere, DeepSeek, and more — all through a single, polished interface. Built with Next.js 16, the Vercel AI SDK, and Supabase, it features a tree-based conversation model with full branching support, encrypted key storage, streaming markdown rendering, web search, image generation, and rich content display including code highlighting, math, and diagrams.",
      silk: {
        color: "#7a8a5c",
        speed: 3.5,
        scale: 1.15,
        noiseIntensity: 1.7,
        rotation: -0.1,
      },
    },
  },
  {
    id: "sola",
    i18nKey: "sola",
    image: "/projects/sola.png",
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
    featured: true,
    date: {
      start: "2025-02",
      display: "Feb 2025 - Present",
    },
    priority: 3,
    slug: "sola",
    deepDive: {
      tagline: "Modern portfolio website built with React and TypeScript",
      overview:
        "Sola is the website you are currently on. It represents a modern approach to portfolio design, combining cutting-edge web technologies with thoughtful user experience. Built from the ground up with React and TypeScript, it showcases projects and skills through smooth animations, multiple themes, and a responsive design that works seamlessly across all devices. Its built to be fast and efficient, with a focus on user experience and performance.",
      silk: {
        color: "#525252",
        speed: 3,
        scale: 1.2,
        noiseIntensity: 1.8,
        rotation: 0.3,
      },
    },
  },
  {
    id: "applicare",
    i18nKey: "applicare",
    image: "/projects/applicare.svg",
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
    featured: true,
    date: {
      start: "2024-12",
      end: "2025-02",
      display: "Dec 2024 - Feb 2025",
    },
    priority: 4,
    slug: "applicare",
    deepDive: {
      tagline: "Manage your job applications with ease.",
      overview:
        "A comprehensive job application tracking system built with React and Spring Boot. Features a modern, intuitive interface for managing job applications, interviews, and career progress.",
      silk: {
        color: "#007bff",
        speed: 4,
        scale: 1.1,
        noiseIntensity: 1.5,
        rotation: 0.1,
      },
    },
  },
  {
    id: "self",
    i18nKey: "self",
    image: "/projects/self.png",
    github: "https://github.com/lyfe691/self",
    technologies: [
      "Python",
      "Windows API",
      "ASCII Art",
      "System Information",
      "Command Line Interface",
      "Package Management",
    ],
    featured: true,
    date: {
      start: "2025-05",
      display: "May 2025",
    },
    priority: 5,
    slug: "self",
    deepDive: {
      tagline:
        "A customizable Windows system information display tool inspired by Neofetch",
      overview:
        "Self is a Windows system information display tool that brings the beloved Neofetch experience to Windows users. Built with Python, it provides customizable themes, multiple image rendering modes, and comprehensive system information display with ASCII art or image support.",
      silk: {
        color: "#1f2937",
        speed: 3,
        scale: 1.1,
        noiseIntensity: 1.5,
        rotation: 0.2,
      },
    },
  },
  {
    id: "code-extractor",
    i18nKey: "codeExtractor",
    image: "/projects/website-code-extractor.svg",
    link: "https://chromewebstore.google.com/detail/website-code-extractor/foppgeakfpkdghmmmflmblcidoofpohm",
    github: "https://github.com/lyfe691/Website-Code-Extractor",
    technologies: ["Chrome Extension", "JSZip", "HTML", "CSS", "JavaScript"],
    featured: true,
    date: {
      start: "2024-08",
      display: "Aug 2024",
    },
    priority: 6,
    slug: "code-extractor",
    deepDive: {
      tagline:
        "Chrome extension for extracting and downloading website source code",
      overview:
        "A powerful Chrome extension that allows developers to easily extract and download the complete source code of any website. Used by 1000+ developers worldwide.",
      silk: {
        color: "#f59e0b",
        speed: 5,
        scale: 0.9,
        noiseIntensity: 2.0,
        rotation: -0.2,
      },
    },
  },
  {
    id: "thoughts",
    i18nKey: "thoughts",
    image: "/projects/thoughts.svg",
    link: "https://thoughts.ysz.life",
    github: "https://github.com/lyfe691/thoughts",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "MDX"],
    featured: true,
    date: {
      start: "2025-08",
      display: "Aug 2025",
    },
    priority: 7,
    slug: "thoughts",
    deepDive: {
      tagline:
        "A minimal personal site for sharing reflections, fragments, and notes.",
      overview:
        "A quiet space separate from my portfolio, designed for simplicity and writing. Built with Next.js, MDX, and Tailwind CSS, and featuring a custom guestbook for visitors to leave their own thoughts.",
      silk: {
        color: "#ffffff",
        speed: 3.8,
        scale: 1.05,
        noiseIntensity: 1.6,
        rotation: -0.15,
      },
    },
  },
  {
    id: "taco",
    i18nKey: "taco",
    image: "/projects/taco.png",
    link: "https://takitwo.vercel.app",
    github: "https://github.com/lyfe691/taco",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "i18n",
    ],
    featured: true,
    date: {
      start: "2025-04",
      display: "Apr 2025",
    },
    priority: 8,
    slug: "taco",
    deepDive: {
      tagline:
        "Production-grade Next.js template with localization and blog (centered on Taco, my brother's dog)",
      overview:
        "Taco is a clean, production-ready template site centered around my brother's dog. It demonstrates localization with automatic detection, a simple blog system, and a modular architecture that can be adapted to real projects.",
      silk: {
        color: "#66cc99",
        speed: 3.8,
        scale: 1.05,
        noiseIntensity: 1.6,
        rotation: -0.15,
      },
    },
  },
  {
    id: "osint",
    i18nKey: "osint",
    image: "/projects/osint-website.svg",
    link: "https://osint.ysz.life",
    github: "https://github.com/lyfe691/osint-ysz-life",
    technologies: ["React (Vite)", "shadcn/ui", "JavaScript"],
    featured: true,
    date: {
      start: "2024-11",
      end: "2024-12",
      display: "Nov 2024 - Dec 2024",
    },
    priority: 9,
  },
  {
    id: "chatapp",
    i18nKey: "chatapp",
    image: "/projects/chatapp.svg",
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
    featured: true,
    date: {
      start: "2024-09",
      display: "Sep 2024",
    },
    priority: 10,
  },
  // non-featured projects
  {
    id: "vm-detector",
    i18nKey: "vmDetector",
    github: "https://github.com/lyfe691/Virtual-Machine-Detector",
    technologies: ["Java", "Virtual Machine", "Detection"],
    featured: false,
    date: {
      start: "2024-08",
      display: "Aug 2024",
    },
    priority: 11,
  },
  {
    id: "view-counter",
    i18nKey: "viewCounter",
    github: "https://github.com/lyfe691/View_Counter",
    technologies: ["Spring Boot", "Redis", "Java"],
    featured: false,
    date: {
      start: "2024-08",
      display: "Aug 2024",
    },
    priority: 12,
  },
  {
    id: "docker-service",
    i18nKey: "dockerService",
    github: "https://github.com/lyfe691/LB-WISS_169-347",
    technologies: ["Docker", "Teamwork", "Documentation"],
    featured: false,
    date: {
      start: "2024-06",
      display: "Jun 2024",
    },
    priority: 13,
  },
  {
    id: "phishing",
    i18nKey: "phishing",
    github: "https://github.com/lyfe691/phishing-website-tutorial",
    technologies: ["HTML", "CSS", "JavaScript", "Node.js", "Tutorial"],
    featured: false,
    date: {
      start: "2024-04",
      display: "Apr 2024",
    },
    priority: 14,
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
    featured: false,
    date: {
      start: "2024-04",
      display: "Apr 2024",
    },
    priority: 15,
  },
];