/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { PROJECTS } from "./projects";

interface ProjectDeepDiveContent {
  slug: string;
  title: string;
  description: string;
  silkColor: string;
  silkSpeed?: number;
  silkScale?: number;
  silkNoiseIntensity?: number;
  silkRotation?: number;
  overview: string;
  techStack: string[];
  features: string[];
  demo?: string;
  mdxPath: string;
}

export interface ProjectPageConfig extends ProjectDeepDiveContent {
  date: string;
  links: {
    live?: string;
    github?: string;
    demo?: string;
  };
}

// date and links come from PROJECTS (src/config/projects.ts) — single source of truth
const deepDives: Record<string, ProjectDeepDiveContent> = {
  luma: {
    slug: "luma",
    title: "Luma",
    description:
      "A multi-model AI platform — bring your own keys, talk to any model",
    silkColor: "#7a8a5c",
    silkSpeed: 3.5,
    silkScale: 1.15,
    silkNoiseIntensity: 1.7,
    silkRotation: -0.1,
    overview:
      "Luma is a multi-model AI platform where you bring your own API keys and talk to the best models from OpenAI, Anthropic, Google, xAI, Mistral, Cohere, DeepSeek, and more — all through a single, polished interface. Built with Next.js 16, the Vercel AI SDK, and Supabase, it features a tree-based conversation model with full branching support, encrypted key storage, streaming markdown rendering, web search, image generation, and rich content display including code highlighting, math, and diagrams.",
    techStack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Vercel AI SDK",
      "Supabase",
      "Tailwind CSS v4",
      "shadcn/ui",
      "Framer Motion",
      "Three.js",
      "Shiki",
    ],
    features: [
      "Multi-provider support: OpenAI, Anthropic, Google, xAI, Mistral, Cohere, DeepSeek, and more",
      "Tree-based conversations with full branching and branch switching",
      "Encrypted API key storage with AES-256-GCM",
      "Streaming markdown with code highlighting, math (KaTeX), and diagrams (Mermaid)",
      "Built-in web search (Tavily) and image generation (Grok Imagine, DALL-E 3, Imagen 3)",
      "Command palette, keyboard shortcuts, and pinned chats",
    ],
    mdxPath: "luma",
  },

  sola: {
    slug: "sola",
    title: "Sola",
    description: "Modern portfolio website built with React and TypeScript",
    silkColor: "#525252",
    silkSpeed: 3,
    silkScale: 1.2,
    silkNoiseIntensity: 1.8,
    silkRotation: 0.3,
    overview:
      "Sola is the website you are currently on. It represents a modern approach to portfolio design, combining cutting-edge web technologies with thoughtful user experience. Built from the ground up with React and TypeScript, it showcases projects and skills through smooth animations, multiple themes, and a responsive design that works seamlessly across all devices. Its built to be fast and efficient, with a focus on user experience and performance.",
    techStack: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "shadcn/ui",
      "Framer Motion",
      "React Router",
      "React Helmet",
      "Three.js",
      "React Query",
      "ESLint",
      "SEO",
    ],
    features: [
      "Fully responsive design",
      "Smooth page transitions",
      "Multiple theme support",
      "Multilingual (EN/DE/ES/JA/ZH) i18n",
      "SEO optimized",
      "Interactive animations",
      "Command palette",
      "Custom 3D backgrounds",
    ],
    mdxPath: "sola",
  },

  applicare: {
    slug: "applicare",
    title: "AppliCare",
    description: "Manage your job applications with ease.",
    silkColor: "#007bff",
    silkSpeed: 4,
    silkScale: 1.1,
    silkNoiseIntensity: 1.5,
    silkRotation: 0.1,
    overview:
      "A comprehensive job application tracking system built with React and Spring Boot. Features a modern, intuitive interface for managing job applications, interviews, and career progress.",
    techStack: [
      "React (Vite)",
      "Spring Boot",
      "Ant Design",
      "MongoDB",
      "Java",
      "JavaScript",
      "Docker",
      "SEO",
    ],
    features: [
      "Application tracking",
      "Interview scheduling",
      "Progress visualization",
      "Document management",
      "Responsive design",
      "Docker deployment",
    ],
    mdxPath: "applicare",
  },

  "code-extractor": {
    slug: "code-extractor",
    title: "Website Code Extractor",
    description:
      "Chrome extension for extracting and downloading website source code",
    silkColor: "#f59e0b",
    silkSpeed: 5,
    silkScale: 0.9,
    silkNoiseIntensity: 2.0,
    silkRotation: -0.2,
    overview:
      "A powerful Chrome extension that allows developers to easily extract and download the complete source code of any website. Used by 1000+ developers worldwide.",
    techStack: ["Chrome Extension", "JSZip", "HTML", "CSS", "JavaScript"],
    features: [
      "One-click extraction",
      "Complete source download",
      "ZIP file generation",
      "Clean folder structure",
      "1000+ active users",
      "Chrome Web Store verified",
    ],
    mdxPath: "code-extractor",
  },

  kinoa: {
    slug: "kinoa",
    title: "Kinoa",
    description:
      "A free streaming website for films and series with a clean, distraction-free interface",
    silkColor: "#a0785a",
    silkSpeed: 4.2,
    silkScale: 1.12,
    silkNoiseIntensity: 1.6,
    silkRotation: -0.25,
    overview:
      "Kinoa is a free streaming website for watching films and series — no subscription, no paywall. Built with the Next.js App Router and shadcn/ui, it pulls live metadata from TMDB and streams through third-party hosters with automatic failover. The interface stays minimal: browse trending titles, discover new releases, and hit play right on the detail page without being redirected elsewhere.",
    techStack: [
      "Next.js App Router",
      "React Server Components",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "TMDB REST API",
      "Third-party Streaming",
      "Vercel",
    ],
    features: [
      "Trending and genre-based rows with live TMDB data",
      "Inline playback on movie and TV detail pages via third-party hosters",
      "Episode navigator for TV seasons with per-server selection",
      "Global search with instant feedback across movies and series",
      "Ad-supported with watchlist and watch history via Supabase",
    ],
    mdxPath: "kinoa",
  },

  self: {
    slug: "self",
    title: "Self",
    description:
      "A customizable Windows system information display tool inspired by Neofetch",
    silkColor: "#1f2937",
    silkSpeed: 3,
    silkScale: 1.1,
    silkNoiseIntensity: 1.5,
    silkRotation: 0.2,
    overview:
      "Self is a Windows system information display tool that brings the beloved Neofetch experience to Windows users. Built with Python, it provides customizable themes, multiple image rendering modes, and comprehensive system information display with ASCII art or image support.",
    techStack: [
      "Python",
      "Windows API",
      "ASCII Art",
      "System Information",
      "Command Line Interface",
      "Package Management",
    ],
    features: [
      "System info display",
      "Image/ASCII art rendering",
      "Block and Braille render modes",
      "Customizable themes",
      "Easy installation via PowerShell",
      "Caching for performance",
    ],
    mdxPath: "self",
  },

  thoughts: {
    slug: "thoughts",
    title: "Thoughts",
    description:
      "A minimal personal site for sharing reflections, fragments, and notes.",
    silkColor: "#ffffff",
    silkSpeed: 3.8,
    silkScale: 1.05,
    silkNoiseIntensity: 1.6,
    silkRotation: -0.15,
    overview:
      "A quiet space separate from my portfolio, designed for simplicity and writing. Built with Next.js, MDX, and Tailwind CSS, and featuring a custom guestbook for visitors to leave their own thoughts.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "MDX"],
    features: [
      "MDX-based publishing system for reflections and notes",
      "Custom-built guestbook with moderation support",
    ],
    mdxPath: "thoughts",
  },

  taco: {
    slug: "taco",
    title: "Taco",
    description:
      "Production-grade Next.js template with localization and blog (centered on Taco, my brother's dog)",
    silkColor: "#66cc99",
    silkSpeed: 3.8,
    silkScale: 1.05,
    silkNoiseIntensity: 1.6,
    silkRotation: -0.15,
    overview:
      "Taco is a clean, production-ready template site centered around my brother's dog. It demonstrates localization with automatic detection, a simple blog system, and a modular architecture that can be adapted to real projects.",
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "React",
      "Framer Motion",
      "Vercel",
      "i18n",
    ],
    features: [
      "Localization with automatic language detection",
      "Client/provider i18n hook and language persistence",
      "Blog pages using MDX and shared components",
      "Clean routing and modular project structure",
      "Accessible semantics and fast TTFB",
    ],
    mdxPath: "taco",
  },
};

const projectBySlug = new Map(
  PROJECTS.filter((p) => p.slug).map((p) => [p.slug!, p]),
);

export const projectPagesConfig: Record<string, ProjectPageConfig> =
  Object.fromEntries(
    Object.entries(deepDives).map(([slug, content]) => {
      const base = projectBySlug.get(slug);
      if (!base) {
        throw new Error(`Deep dive "${slug}" has no matching entry in PROJECTS`);
      }
      return [
        slug,
        {
          ...content,
          date: base.date.display,
          links: {
            live: base.link,
            github: base.github,
            demo: content.demo,
          },
        },
      ];
    }),
  );

export const getProjectConfig = (slug: string): ProjectPageConfig | null => {
  return projectPagesConfig[slug] || null;
};

export const getAllProjectSlugs = (): string[] => {
  return Object.keys(projectPagesConfig);
};
