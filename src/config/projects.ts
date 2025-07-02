/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

export interface ProjectPageConfig {
  slug: string;
  title: string;
  description: string;
  date: string;
  silkColor: string;
  silkSpeed?: number;
  silkScale?: number;
  silkNoiseIntensity?: number;
  silkRotation?: number;
  overview: string;
  techStack: string[];
  features: string[];
  links: {
    live?: string;
    github?: string;
    demo?: string;
  };
  mdxPath: string; // required
}

export const projectPagesConfig: Record<string, ProjectPageConfig> = {
  sola: {
    slug: 'sola',
    title: 'Sola',
    description: 'Modern portfolio website built with React and TypeScript',
    date: 'February 2025 - Present',
    silkColor: '#525252',
    silkSpeed: 3,
    silkScale: 1.2,
    silkNoiseIntensity: 1.8,
    silkRotation: 0.3,
    overview: 'Sola is the website you are currently on. It represents a modern approach to portfolio design, combining cutting-edge web technologies with thoughtful user experience. Built from the ground up with React and TypeScript, it showcases projects and skills through smooth animations, multiple themes, and a responsive design that works seamlessly across all devices. Its built to be fast and efficient, with a focus on user experience and performance.',
    techStack: [
      'React', 'TypeScript', 'Vite', 'Tailwind CSS', 'shadcn/ui',
      'Framer Motion', 'React Router', 'React Helmet', 'Three.js',
      'React Query', 'ESLint', 'SEO'
    ],
    features: [
      'Fully responsive design',
      'Smooth page transitions',
      'Multiple theme support',
      'Multilingual (EN/DE/ES/JP/CN/RU) i18n',
      'SEO optimized',
      'Interactive animations',
      'Command palette',
      'Custom 3D backgrounds',

    ],
    links: {
      live: 'https://sola.ysz.life',
      github: 'https://github.com/lyfe691/sola'
    },
    mdxPath: 'sola'
  },
  
  applicare: {
    slug: 'applicare',
    title: 'AppliCare',
    description: 'Manage your job applications with ease.',
    date: 'Dec 2024 - Feb 2025',
    silkColor: '#007bff',
    silkSpeed: 4,
    silkScale: 1.1,
    silkNoiseIntensity: 1.5,
    silkRotation: 0.1,
    overview: 'A comprehensive job application tracking system built with React and Spring Boot. Features a modern, intuitive interface for managing job applications, interviews, and career progress.',
    techStack: [
      'React (Vite)', 'Spring Boot', 'Ant Design', 'MongoDB', 
      'Java', 'JavaScript', 'Docker', 'SEO'
    ],
    features: [
      'Application tracking',
      'Interview scheduling',
      'Progress visualization',
      'Document management',
      'Responsive design',
      'Docker deployment'
    ],
    links: {
      live: 'https://applicare.app',
      github: 'https://github.com/lyfe691/AppliCare'
    },
    mdxPath: 'applicare'
  },

  'code-extractor': {
    slug: 'code-extractor',
    title: 'Website Code Extractor',
    description: 'Chrome extension for extracting and downloading website source code',
    date: 'November 2024',
    silkColor: '#f59e0b',
    silkSpeed: 5,
    silkScale: 0.9,
    silkNoiseIntensity: 2.0,
    silkRotation: -0.2,
    overview: 'A powerful Chrome extension that allows developers to easily extract and download the complete source code of any website. Used by 600+ developers worldwide.',
    techStack: [
      'Chrome Extension', 'JSZip', 'HTML', 'CSS', 'JavaScript'
    ],
    features: [
      'One-click extraction',
      'Complete source download',
      'ZIP file generation',
      'Clean folder structure',
      '600+ active users',
      'Chrome Web Store verified'
    ],
    links: {
      live: 'https://chromewebstore.google.com/detail/website-code-extractor/foppgeakfpkdghmmmflmblcidoofpohm',
      github: 'https://github.com/lyfe691/Website-Code-Extractor'
    },
    mdxPath: 'code-extractor'
  },

  self: {
    slug: 'self',
    title: 'Self',
    description: 'A customizable Windows system information display tool inspired by Neofetch',
    date: 'May 2025',
    silkColor: '#b8d6de',
    silkSpeed: 3,
    silkScale: 1.1,
    silkNoiseIntensity: 1.5,
    silkRotation: 0.2,
    overview: 'Self is a Windows system information display tool that brings the beloved Neofetch experience to Windows users. Built with Python, it provides customizable themes, multiple image rendering modes, and comprehensive system information display with ASCII art or image support.',
    techStack: [
      'Python', 'Windows API', 'ASCII Art', 'System Information',
      'Command Line Interface', 'Package Management'
    ],
    features: [
      'System info display',
      'Image/ASCII art rendering',
      'Block and Braille render modes',
      'Customizable themes',
      'Easy installation via PowerShell',
      'Caching for performance'
    ],
    links: {
      github: 'https://github.com/lyfe691/self'
    },
    mdxPath: 'self'
  }
};

export const getProjectConfig = (slug: string): ProjectPageConfig | null => {
  return projectPagesConfig[slug] || null;
};

export const getAllProjectSlugs = (): string[] => {
  return Object.keys(projectPagesConfig);
}; 