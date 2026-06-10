/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import type { Translation } from "@/lib/translations";

export type ProjectI18nKey = keyof Translation["projects"]["list"];

export interface ProjectMeta {
  id: string;
  i18nKey: ProjectI18nKey;
  image?: string;
  link?: string;
  github?: string;
  tags: string[];
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
  /** appended verbatim to the translated description */
  descriptionSuffix?: string;
}

export const PROJECTS: ProjectMeta[] = [
  {
    id: "kinoa",
    i18nKey: "kinoa",
    image: "/projects/kinoa.png",
    link: "https://kinoa.to",
    github: "https://github.com/lyfe691/kinoa",
    tags: [
      "Next.js",
      "shadcn/ui",
      "TypeScript",
      "Tailwind CSS",
      "TMDB API",
      "Streaming",
    ],
    featured: true,
    date: {
      start: "2025-11",
      display: "Nov 2025 - Present",
    },
    priority: 1,
    slug: "kinoa",
    vercelSatori: true,
  },
  {
    id: "luma",
    i18nKey: "luma",
    image: "/projects/luma.png",
    link: "https://luma.ysz.life",
    github: "https://github.com/lyfe691/luma",
    tags: [
      "Next.js 16",
      "Vercel AI SDK",
      "TypeScript",
      "Supabase",
      "shadcn/ui",
      "Tailwind CSS",
    ],
    featured: true,
    date: {
      start: "2026-03",
      end: "2026-04",
      display: "Mar 2026 - Apr 2026",
    },
    priority: 2,
    slug: "luma",
  },
  {
    id: "sola",
    i18nKey: "sola",
    image: "/projects/sola.png",
    link: "https://sola.ysz.life",
    github: "https://github.com/lyfe691/sola",
    tags: [
      "Portfolio",
      "shadcn/ui",
      "TypeScript",
      "React",
      "Vite",
      "Tailwind CSS",
    ],
    featured: true,
    date: {
      start: "2025-02",
      display: "Feb 2025 - Present",
    },
    priority: 3,
    slug: "sola",
  },
  {
    id: "applicare",
    i18nKey: "applicare",
    image: "/projects/applicare.svg",
    link: "https://applicare.app",
    github: "https://github.com/lyfe691/AppliCare",
    tags: [
      "React (Vite)",
      "Spring Boot",
      "Ant Design",
      "MongoDB",
      "Java",
      "JavaScript",
      "Docker",
    ],
    featured: true,
    date: {
      start: "2024-12",
      end: "2025-02",
      display: "Dec 2024 - Feb 2025",
    },
    priority: 4,
    slug: "applicare",
  },
  {
    id: "self",
    i18nKey: "self",
    image: "/projects/self.png",
    github: "https://github.com/lyfe691/self",
    tags: ["Neofetch", "Python", "Terminal", "Windows"],
    featured: true,
    date: {
      start: "2025-05",
      display: "May 2025",
    },
    priority: 5,
    slug: "self",
  },
  {
    id: "code-extractor",
    i18nKey: "codeExtractor",
    image: "/projects/website-code-extractor.svg",
    link: "https://chromewebstore.google.com/detail/website-code-extractor/foppgeakfpkdghmmmflmblcidoofpohm",
    github: "https://github.com/lyfe691/Website-Code-Extractor",
    tags: ["Chrome Extension", "JSZip", "HTML", "CSS", "JavaScript"],
    featured: true,
    date: {
      start: "2024-08",
      display: "Aug 2024",
    },
    priority: 6,
    slug: "code-extractor",
    descriptionSuffix: " (1000+ Users)",
  },
  {
    id: "thoughts",
    i18nKey: "thoughts",
    image: "/projects/thoughts.svg",
    link: "https://thoughts.ysz.life",
    github: "https://github.com/lyfe691/thoughts",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "MDX"],
    featured: true,
    date: {
      start: "2025-08",
      display: "Aug 2025",
    },
    priority: 7,
    slug: "thoughts",
  },
  {
    id: "taco",
    i18nKey: "taco",
    image: "/projects/taco.png",
    link: "https://takitwo.vercel.app",
    github: "https://github.com/lyfe691/taco",
    tags: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "i18n",
      "Localization",
      "Blog",
      "Template",
    ],
    featured: true,
    date: {
      start: "2025-04",
      display: "Apr 2025",
    },
    priority: 8,
    slug: "taco",
  },
  {
    id: "osint",
    i18nKey: "osint",
    image: "/projects/osint-website.svg",
    link: "https://osint.ysz.life",
    github: "https://github.com/lyfe691/osint-ysz-life",
    tags: ["React (Vite)", "shadcn/ui", "JavaScript"],
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
    tags: [
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
    tags: ["Java", "Virtual Machine", "Detection"],
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
    tags: ["Spring Boot", "Redis", "Java"],
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
    tags: ["Docker", "Teamwork", "Documentation"],
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
    tags: ["HTML", "CSS", "JavaScript", "Node.js", "Tutorial"],
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
    tags: ["Kali Linux", "OverTheWire", "Linux", "Tutorial", "Ethical Hacking"],
    featured: false,
    date: {
      start: "2024-04",
      display: "Apr 2024",
    },
    priority: 15,
  },
];
