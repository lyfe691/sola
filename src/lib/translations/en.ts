/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */
export const en = {
  seo: {
    home: {
      description:
        "Software developer based in Zürich, focusing on scalable, fast, and thoughtfully designed systems across infrastructure, identity, and interfaces.",
    },
    about: {
      description:
        "Yanis Sebastian Zürcher — 18, Zürich. Full-stack developer, background, GitHub activity, and how I work.",
    },
    projects: {
      description:
        "A curated selection of my projects across full‑stack, frontend, backend, and tooling.",
    },
    skills: {
      description:
        "Technologies and tools I use, from React and TypeScript to Spring Boot and Docker.",
    },
    experience: {
      description:
        "Timeline of education and roles, highlighting responsibilities, achievements, and technologies.",
    },
    contact: {
      description:
        "Get in touch about projects, collaboration, or opportunities.",
    },
    services: {
      description:
        "Full‑stack, frontend, backend development and technical consulting tailored to your needs.",
    },
    privacy: {
      description:
        "Privacy details for sola.ysz.life, covering hosting, analytics, processors, and your rights.",
    },
    notFound: {
      description: "The requested resource could not be found.",
    },
    certifications: {
      description: "Certifications and credentials, with verification links.",
    },
    changelog: {
      description:
        "Git log of sola — commits, file trees, and patches from the GitHub history.",
    },
  },
  certifications: {
    title: "Certifications",
    empty: "No certifications published yet.",
    verify: "Verify",
    expired: "Expired",
    credentialId: "Credential ID",
    expires: "Expires",
    viewPdf: "View PDF",
  },
  common: {
    home: "Home",
    present: "Present",
    back: "Back",
    overview: "Overview",
    a11y: {
      openMenu: "Open menu",
      closeMenu: "Close menu",
      primaryNav: "Primary",
      toggleLanguage: "Toggle language",
      toggleTheme: "Toggle theme",
      commandPalette: "Command palette",
      commandPaletteHint: "Search for a command to run…",
      scrollToTop: "Scroll to top",
    },
    menu: {
      themes: "Themes",
      customThemes: "Custom themes",
      background: "Backgrounds",
    },
    diff: {
      showDiff: "Show git diff",
      exit: "Hide git diff",
      hint: "Shows the last commit that touched the current page.",
      deployed: "The commit this deployment was built from.",
      noChanges: "No recorded changes for this page.",
      viewOnGitHub: "View on GitHub",
      error: "Couldn't load the diff.",
      retry: "Try again",
      unavailable: "No text diff for this file.",
      truncated: "Truncated — view the full diff on GitHub.",
      file: "file",
      files: "files",
    },
    backgroundHints: {
      section: "Some backgrounds look significantly better in dark mode.",
    },
    callout: {
      background: {
        title: "Make it yours",
        content:
          "I picked {background} with the {theme} theme — open this menu to explore more.",
      },
      done: "Got it",
    },
    none: "None",
    search: "Search",
    copied: "Copied.",
    copyCode: "Copy code",
    copyFailed: "Couldn't copy code.",
    command: {
      placeholder: "Type a command or search...",
      noResults: "No results found.",
      groups: {
        navigation: "Navigation",
        theme: "Theme",
        language: "Language",
        background: "Background",
      },
      footer: {
        navigate: "Navigate",
        select: "Select",
        close: "Close",
      },
    },
    techStack: "Tech Stack",
    links: "Links",
    chromeStore: "Chrome Store",
    visitSite: "Visit Site",
    sourceCode: "Source Code",
    demo: "Demo",
    moreProjects: "More Projects",
    onThisPage: "On this page",
    linkToSection: "Link to section: {title}",
    close: "Close",
    expandImage: "Expand image",
    expandImageNamed: "Expand image: {alt}",
    expandedImage: "Expanded image",
    moreOnGithub: "More on GitHub",
    view: "View",
    update: {
      title: "Site's been updated",
      description: "Refresh the page to see what's new.",
      later: "Later",
      refresh: "Refresh",
      dismiss: "Dismiss",
    },
  },
  feed: {
    recentActivity: "Recent Activity",
    lastEvents: "Last {count} events",
    noActivity: "No recent activity",
    loadError: "Couldn't load recent activity",
    checkBack: "Check back later for updates",
    moreSuffix: "more",
    commit: "{count} commit",
    commits: "{count} commits",
  },
  nav: {
    about: "About",
    experience: "Experience",
    projects: "Projects",
    skills: "Skills",
    contact: "Contact",
    services: "Services",
  },
  i18n: {
    detectedNote: "Detected: {lang}",
  },
  index: {
    greeting: "Hello, I'm ",
    description1:
      "18-year-old software developer based in Zurich, Switzerland.",
    description2: "I build scalable, fast, and thoughtfully designed systems.",
    description3: "Working across infrastructure, identity, and interfaces.",
    description4: "Focused on structure, clarity, and precision.",
    nameSwitch: "switch name",
    currentlyWorkingOn: "Currently working on",
    contactMe: "Contact me",
    viewProjects: "View projects",
  },
  experience: {
    title: "Experience",
    subtitle:
      "My professional journey and educational experiences that have shaped my technical expertise.",
    sections: {
      work: "Work",
      education: "Education",
    },
    chips: {
      onsite: "On-site",
      remote: "Remote",
      hybrid: "Hybrid",
      internship: "Internship",
      full_time: "Full-time",
      part_time: "Part-time",
      contract: "Contract",
      freelance: "Freelance",
    },

    nadlo: {
      role: "Full Stack Software Developer",
      company: "nadlo",
      location: "Baden, Switzerland",
      description:
        "Building production web applications across the entire stack — designing responsive, accessible interfaces alongside the APIs and data models that power them, with an emphasis on type safety, performance, and shipping fast.",
      achievements: [
        "Develop full-stack features end-to-end with Next.js, React, and TypeScript, styled with Tailwind CSS.",
        "Design and build backend services and REST APIs with NestJS, backed by Supabase (Postgres, auth, and storage).",
        "Containerize services with Docker and automate build, test, and deploy pipelines with GitHub Actions.",
        "Own features from concept to deployment, focusing on maintainable, well-typed, and performant code.",
      ],
    },
    freelance: {
      role: "Freelance Web Developer",
      company: "Self-employed",
      location: "Zürich, Switzerland",
      description:
        "Delivering modern web solutions for clients—from landing pages to full‑stack features—with a focus on clean UX, performance, and maintainable code.",
      achievements: [
        "Built and shipped projects with React, Next.js, TypeScript, Tailwind CSS.",
        "Implemented backend features with Spring Boot and Java; versioned and automated with Git.",
      ],
    },
    gz: {
      role: "IAM Developer",
      company: "Gesundheitswelt Zollikerberg",
      location: "Zollikon, Switzerland",
      description:
        "As an IAM Engineering Intern, I contribute to the maintenance and optimization of IT infrastructure, with a focus on automating identity and access management processes. The company delivers healthcare services to residents of Zollikon.",
      achievements: [
        "Assisted in automating identity and access management (IAM) workflows using PowerShell and Python.",
        "Participated in the implementation of internal IT infrastructure improvements.",
        "Contributed to Active Directory maintenance and user provisioning tasks.",
      ],
    },
    wiss: {
      role: "Student - Computer Science",
      company: "WISS",
      location: "Zürich, Switzerland",
      description:
        "I am currently a student at WISS, a Computer Science school, where I am immersed in a comprehensive computer science education. My studies cover a wide range of topics, including programming, systems analysis, database management, software development, and project management. This experience is providing me with a broad and solid foundation in the field of computer science, preparing me for a future in software engineering.",
      achievements: [
        "Developed full-stack web applications using modern technologies",
        "Collaborated on team projects using agile methodologies",
      ],
    },
    sek: {
      role: "Sek A",
      company: "Lachenzelg",
      location: "Zürich, Switzerland",
      description:
        "Gathered fundamental knowledge for my technical journey. As the final project i created a Unreal Engine Environment.",
      achievements: [
        "Created an immersive 3D environment using Unreal Engine",
        "Developed strong problem-solving and analytical skills",
        "Participated in MINT-focused projects and activities",
      ],
    },
  },
  projects: {
    title: "Projects",
    viewDetails: "View Details",
    viewAll: "View All Projects",
    viewGithub: "View Code",
    sortBy: "Sort by",
    sortOptions: {
      priority: "Priority",
      dateNewest: "Date (Newest)",
      dateOldest: "Date (Oldest)",
      nameAsc: "Name (A-Z)",
      nameDesc: "Name (Z-A)",
    },
    selectSorting: "Select sorting...",
    visitProject: "Visit Project",
    list: {
      codeExtractor: {
        title: "Website Code Extractor",
        tagline: "Extract code with one click",
        description:
          "A simple Chrome extension that extracts HTML, CSS, JavaScript, and images from websites and packages them into a zip file with JSZip. Ideal for smaller sites, it allows quick access to web code, though it may struggle with larger sites that rely heavily on server-side code.",
      },
      applicare: {
        title: "AppliCare",
        tagline: "Manage your job applications with ease",
        description:
          "AppliCare is a modern job application management platform built using Spring Boot for the backend, MongoDB Atlas to store data, and React (Vite) with Ant Design for the frontend. It provides an intuitive and efficient way to organize and monitor job applications with a sleek, responsive interface.",
      },
      osint: {
        title: "OSINT Website",
        tagline: "Sharpen your investigative instincts",
        description:
          "This OSINT website is a passion project inspired by my interest in Open Source Intelligence and the ever-evolving world of digital investigations. It features interactive exercises designed to sharpen investigative skills and encourage critical thinking.",
      },
      chatapp: {
        title: "ChatApp",
        tagline: "Real-time rooms, built on Spring Boot",
        description:
          "ChatApp is a user-friendly chat platform where individuals can create accounts and connect with others in various chat rooms. Built with Spring Boot and backed by MongoDB for efficient data storage, ChatApp provides a seamless experience for real-time communication.",
      },
      vmDetector: {
        title: "Virtual Machine Detector",
        tagline: "Know when you're running in a VM",
        description:
          "This is a tool that detects if a machine is a virtual machine.",
      },
      viewCounter: {
        title: "View Counter",
        tagline: "A page view counter on Redis",
        description:
          "This is a simple view counter application that counts the number of times a page has been viewed. It is built with Spring Boot and Redis.",
      },
      dockerService: {
        title: "Docker Service Deployment",
        tagline: "MediaWiki, Nextcloud, and Gogs in Compose",
        description:
          "This Docker Compose project deploys MediaWiki, Nextcloud, and Gogs, focusing on teamwork, containerization, and documentation. Developed with Benicio Von Felten.",
      },
      phishing: {
        title: "Phishing Website Tutorial",
        tagline: "A hands-on look at how phishing pages work",
        description:
          "This is a tutorial on how to create a phishing website. It is built with HTML, CSS, and JavaScript.",
      },
      otw: {
        title: "OverTheWire Guide",
        tagline: "Bandit, level by level",
        description:
          "This is a guide on how to solve the OverTheWire wargames.",
      },
      sola: {
        title: "Sola",
        tagline: "Modern portfolio in React and TypeScript",
        description:
          "Sola is my personal website, the one you're on right now. It's built with React, TypeScript, and Tailwind CSS, and is designed to showcase my projects, skills, and experience in a clean and modern way.",
      },
      kinoa: {
        title: "Kinoa",
        tagline: "Free streaming, no noise",
        description:
          "Kinoa is a free streaming site built with Next.js, shadcn/ui, and Supabase. No subscription needed — browse films and series, watch with inline playback from third-party hosters, and let automatic server failover handle the rest.",
      },
      self: {
        title: "Self",
        tagline: "Neofetch, reimagined for Windows",
        description:
          "Self is a customizable Windows system information display tool inspired by Neofetch, built with Python. It displays system stats alongside image or ASCII art directly in the terminal. With support for block and braille render modes, theme customization, and a simple PowerShell installer, it brings a clean, Unix-style aesthetic to Windows.",
      },
      taco: {
        title: "Taco",
        tagline: "A production-ready Next.js template",
        description:
          "A production‑ready template site centered on Taco, my brother's dog — built with Next.js, TypeScript, and Tailwind CSS. It includes localization with automatic detection, a blog system, and a clean modular architecture suitable for real projects.",
      },
      thoughts: {
        title: "Thoughts",
        tagline: "Reflections, fragments, and notes",
        description:
          "A minimal personal site where I share reflections, fragments, and notes. Inspired by [Shu Ding](https://shud.in)’s personal website, built with Next.js, MDX, and Tailwind. Includes a custom guestbook feature where visitors can leave their own thoughts.",
      },
      magi: {
        title: "magi",
        tagline: "Async port scanning, built to be correct",
        description:
          "magi is a fast, asynchronous TCP and UDP port scanner written in Rust. It does connect scanning — a normal handshake per port — so it needs no root and runs anywhere tokio does. It never reports a port state it didn’t actually establish: when a probe can’t run, it’s marked untestable rather than guessed closed. Bounded concurrency keeps memory flat from a single host to a whole /16, with banner grabbing, UDP probing, and JSON output for scripting.",
      },
      luma: {
        title: "Luma",
        tagline: "Bring your own keys, talk to any model",
        description:
          "A multi-model AI platform that lets you bring your own API keys and talk to the best models — Claude, GPT, Gemini, Grok, and more — all in one place. Built with Next.js 16, the Vercel AI SDK, and Supabase.",
      },
    },
  },
  skills: {
    title: "Skills",
    subtitle: "Technologies and tools I work with regularly.",
    groups: {
      languages: "Languages",
      frontend: "Frontend",
      backend: "Backend",
      infrastructure: "Infrastructure",
      security: "Security",
      tools: "Tools",
    },
  },
  notFound: {
    backHome: "Go back home",
  },
  colophon: {
    title: "How this website was made",
    lede: "In old books, the last page tells you how the thing was made. This is that page.",
    built:
      "It is a [React](https://react.dev) app in [TypeScript](https://www.typescriptlang.org), built with [Vite](https://vite.dev) so the loop from save to screen stays out of the way. Colour and space come from [Tailwind CSS](https://tailwindcss.com) and [shadcn/ui](https://ui.shadcn.com) — tokens, never a raw palette. What moves is [Motion](https://motion.dev) for the interface and [GSAP](https://gsap.com) for the skies; two clocks, so a button never borrows from a background.",
    faces:
      "The faces are [Onest](https://fonts.google.com/specimen/Onest) for reading, [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) for the names, [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) for code, and [Shippori Mincho B1](https://fonts.google.com/specimen/Shippori+Mincho+B1) for ink like this. It lives on [Vercel](https://vercel.com); the source is on [GitHub](https://github.com/lyfe691/sola).",
    close: "Set by hand in Zürich. Thanks for stopping by.",
    back: "Go back",
  },
  changelog: {
    title: "Changelog",
    subtitle:
      "The live git history of this site. Expand a commit to read the message, the file tree, and the patch.",
    empty: "No commits to show.",
    error: "Couldn't load the git history.",
    retry: "Retry",
    older: "Load older",
    viewOnGitHub: "View on GitHub",
    thisDeploy: "this deploy",
    truncated: "Diff truncated. Full commit on GitHub.",
    unavailable: "Patch omitted (binary or too large).",
    files: "{count} files",
    expand: "Show commit",
    collapse: "Hide commit",
  },
  footer: {
    atw: "about this website",
    madeWith: "Made with",
    by: "by",
    rights: "All rights reserved.",
    navigation: "Navigation",
    connect: "Connect",
    contact: "Contact",
    contactForm: "Contact Form",
    privacy: "Privacy Policy",
    legal: "Legal",
    changelog: "Changelog",
  },
  about: {
    title: "About",
    intro:
      "I'm Yanis Sebastian Zürcher, an 18-year-old software developer based in Zürich. I studied Computer Science at [WISS](https://www.wiss.ch) for two years. I'm interning at [nadlo](https://nadlo.ch) through July 2027, as part of that program.",
    hobbies:
      "I work full-stack, but UI and design are what I enjoy. I like figuring out how something should look and how it should feel to use — that's the part of the work I actually want to spend time on.",
    philosophy: {
      title: "How I work",
      clean:
        "Code should still make sense in six months. I rewrite the clever bits until they're boring.",
      simplicity:
        "If a feature needs a paragraph to explain, it's probably two features. I cut until what's left is obvious.",
      learning:
        "I learn by building the next thing I don't know how to build yet. Docs, repos, and breaking stuff in public.",
    },
    interests: {
      title: "Interests",
      nature: {
        title: "Outdoors",
        description:
          "I try to get outside regularly — mostly hiking, sometimes just long walks with no destination. Living in Switzerland makes that easy; the Alps are close, and a few hours on a trail is still one of the better ways I know to clear my head after too many hours at a screen.",
      },
      tech: {
        title: "Open source",
        description:
          "I contribute to open source when a project actually catches my interest, not as a checklist item. That usually means performance work, accessibility fixes, or small quality-of-life improvements in tools I already use day to day.",
      },
      learning: {
        title: "Learning",
        description:
          "Outside of school I keep learning through a mix of books, documentation, and the occasional course when something is new to me. Lately that has been systems topics and how browsers actually work under the hood, which feeds straight back into the projects I ship.",
      },
      workspace: {
        title: "Setup",
        description:
          "My desk is simple on purpose: two monitors, a mechanical keyboard, and not a lot of clutter. I care more about having a setup that stays out of the way than about collecting gadgets, so I can sit down and work without rearranging half the room first.",
      },
    },
    testimonials: {
      title: "From people I've worked with",
      link: "Work with me",
      viewMore: "View more",
      visitWebsite: "Visit Website",
      website: "Website",
      roleAtCompany: "{role} at {company}",
      viewLinkedIn: "View LinkedIn",
      modalTitle: "Testimonial",
      modalDescription: "Full testimonial from {author}",
      items: {
        koenitzer: {
          quote:
            "Working with Yanis on every Software Engineering (IT) subject was a genuine highlight. His technical skills, reliability, and problem-solving were on another level. A truly exceptional developer and teammate.",
          role: "Intern",
        },
        bichsel: {
          quote:
            "Working with Yanis was a fantastic experience. He carried me through every subject, consistently bringing creative solutions to complex problems and delivering everything on time. Truly an exceptional developer.",
          role: "Student",
        },
        venzin: {
          quote:
            "Yanis has a rare combination of technical skill and design sensibility. The WISS Forum he created for us exceeded all expectations and has significantly improved our online presence.",
          role: "Teacher",
        },
      },
    },
    certifications: {
      link: "Certifications",
    },
    resume: {
      title: "Request Full Resume",
      description:
        "The public version of my resume has some sensitive information censored. If you need the full version, please [contact me](https://sola.ysz.life/contact) or send an email to [yanis.sebastian.zuercher@gmail.com](mailto:yanis.sebastian.zuercher@gmail.com).",
      viewButton: "View Censored Version",
      downloadButton: "Download Censored Version",
      languageLabel: "Language:",
      buttonLabel: "Resume",
    },
    github: {
      title: "GitHub Activity",
      overview: "Overview",
      totalCount: "{{count}} contributions in {{year}}",
      totalCountLastYear: "{{count}} contributions in the last year",
      legendLess: "Less",
      legendMore: "More",
      dayTooltip: "{count} contributions on {date}",
      loadError: "Contribution data couldn't be loaded right now.",
    },
    philosophyLabels: {
      clean: "Readable code",
      simplicity: "Less, not more",
      learning: "Build to learn",
    },
  },
  contact: {
    title: "Get in Touch",
    description:
      "Have a question or want to work together? Feel free to reach out!",
    formTitle: "Send a message",
    reachOut: "Or reach me directly",
    expectations: {
      title: "What to expect",
      items: [
        "A reply within a day or two",
        "A clear, no-pressure conversation about your idea",
        "Honest thoughts on scope, timeline, and fit",
        "Your details stay private — just a direct reply",
      ],
    },
    nameLabel: "Name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "your.email@example.com",
    messageLabel: "Message",
    messagePlaceholder: "Your message here...",
    send: "Send Message",
    sending: "Sending...",
    successMessage: "Thanks for your message! I'll get back to you soon.",
    errorMessage: "Something went wrong. Please try again.",
    subjectLabel: "Subject",
    subjectPlaceholder: "Enter your subject",
    validation: {
      nameRequired: "Please enter your name.",
      emailRequired: "Please enter your email.",
      emailInvalid: "Please enter a valid email address.",
      subjectRequired: "Please enter a subject.",
      messageRequired: "Please enter a message.",
    },
  },
  services: {
    badges: {
      mostPopular: "Most Popular",
    },
    title: "Services",
    subtitle:
      "Comprehensive software development services tailored to your needs.",
    getStarted: "Get Started",
    services: {
      fullstack: {
        title: "Full Stack Development",
        description:
          "End-to-end web application development using modern technologies.",
        price: "from CHF 75/h",
        features: [
          "Responsive web applications",
          "RESTful API development",
          "Database design and implementation",
          "Performance optimization",
        ],
      },
      frontend: {
        title: "Frontend Development",
        description:
          "Creating beautiful, responsive, and user-friendly interfaces.",
        price: "from CHF 65/h",
        features: [
          "React development",
          "UI/UX implementation",
          "Animation and interactivity",
          "Mobile-first design",
        ],
      },
      backend: {
        title: "Backend Development",
        description: "Robust and scalable server-side solutions.",
        price: "from CHF 70/h",
        features: [
          "API architecture",
          "Database management",
          "Server optimization",
          "Security implementation",
        ],
      },
      consulting: {
        title: "Technical Consulting",
        description: "Expert guidance for your technical decisions.",
        price: "from CHF 60/h",
        features: [
          "Architecture planning",
          "Technology stack selection",
          "Performance auditing",
          "Security assessment",
        ],
      },
    },
    contactTemplate: {
      inquiry: "Inquiry",
      greeting: "Hi Yanis,",
      interested: "I'm interested in your {service} services.",
      discuss: "I'd like to discuss:",
      closing: "Looking forward to hearing from you!",
    },
    customRequirements: {
      title: "Custom Requirements?",
      description:
        "Have a specific project in mind? I'm here to help turn your vision into reality. Let's discuss your requirements and create a tailored solution for your needs.",
      button: "Get in touch",
      subject: "Custom Development Requirements",
      message:
        "Hi Yanis,\n\nI have specific requirements that don't fit standard service categories. I'd like to discuss a custom solution.\n\nProject details:\n- \n- \n- \n\nLooking forward to discussing this further!",
    },
  },
  errorBoundary: {
    title: "Something went wrong",
    message:
      "An unexpected error occurred. Reloading the page usually fixes it.",
    reload: "Reload",
  },
};

export type Translation = typeof en;
