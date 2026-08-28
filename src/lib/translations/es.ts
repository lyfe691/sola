/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */
import type { Translation } from "./en";

export const es = {
  seo: {
    home: {
      description:
        "Desarrollador de software con enfoque en sistemas escalables, rápidos y bien diseñados: infraestructura, identidad e interfaces.",
    },
    about: {
      description:
        "Conoce mi trayectoria, valores y herramientas con las que construyo software rápido, limpio y minimalista.",
    },
    projects: {
      description:
        "Selección de proyectos: full‑stack, frontend, backend y herramientas.",
    },
    skills: {
      description:
        "Tecnologías y herramientas: React, TypeScript, Spring Boot, Docker y más.",
    },
    experience: {
      description:
        "Cronología de educación y roles con responsabilidades, logros y tecnologías.",
    },
    contact: {
      description:
        "Ponte en contacto para proyectos, colaboración u oportunidades.",
    },
    services: {
      description:
        "Desarrollo full‑stack, frontend, backend y consultoría técnica a medida.",
    },
    privacy: {
      description:
        "Detalles de privacidad: alojamiento, analíticas, encargados del tratamiento y tus derechos.",
    },
    notFound: {
      description: "El recurso solicitado no se encontró.",
    },
    certifications: {
      description:
        "Certificaciones y credenciales, con enlaces de verificación.",
    },
    changelog: {
      description:
        "Git log de sola: commits, árboles de archivos y patches del historial de GitHub.",
    },
  },
  certifications: {
    title: "Certificaciones",
    empty: "Aún no hay certificaciones publicadas.",
    verify: "Verificar",
    expired: "Vencido",
    credentialId: "ID de credencial",
    expires: "Vence",
    viewPdf: "Ver PDF",
  },
  common: {
    home: "Inicio",
    present: "Presente",
    back: "Volver",
    overview: "Resumen",
    a11y: {
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
      primaryNav: "Navegación principal",
      toggleLanguage: "Cambiar idioma",
      toggleTheme: "Cambiar tema",
      commandPalette: "Paleta de comandos",
      commandPaletteHint: "Busca un comando…",
      scrollToTop: "Volver arriba",
    },
    menu: {
      themes: "Temas",
      customThemes: "Temas personalizados",
      background: "Fondos",
    },
    diff: {
      showDiff: "Mostrar git diff",
      exit: "Ocultar git diff",
      hint: "Muestra el último commit que modificó la página actual.",
      deployed: "El commit del que se construyó este despliegue.",
      noChanges: "No hay cambios registrados para esta página.",
      viewOnGitHub: "Ver en GitHub",
      error: "No se pudo cargar el diff.",
      retry: "Reintentar",
      unavailable: "No hay diff de texto para este archivo.",
      truncated: "Recortado: mira el diff completo en GitHub.",
      file: "archivo",
      files: "archivos",
    },
    backgroundHints: {
      section: "Algunos fondos se ven mucho mejor en modo oscuro.",
    },
    callout: {
      background: {
        title: "Hazlo tuyo",
        content:
          "Elegí {background} con el tema {theme} — abre este menú para probar otras opciones.",
      },
      done: "Entendido",
    },
    none: "Ninguno",
    search: "Buscar",
    copied: "Copiado.",
    copyCode: "Copiar código",
    copyFailed: "No se pudo copiar.",
    command: {
      placeholder: "Escribe un comando o busca...",
      noResults: "Sin resultados.",
      groups: {
        navigation: "Navegación",
        theme: "Tema",
        language: "Idioma",
        background: "Fondo",
      },
      footer: {
        navigate: "Navegar",
        select: "Seleccionar",
        close: "Cerrar",
      },
    },
    techStack: "Tecnologías",
    links: "Enlaces",
    chromeStore: "Chrome Web Store",
    visitSite: "Visitar sitio",
    sourceCode: "Código fuente",
    demo: "Demo",
    moreProjects: "Más proyectos",
    onThisPage: "En esta página",
    linkToSection: "Enlace a la sección: {title}",
    close: "Cerrar",
    expandImage: "Ampliar imagen",
    expandImageNamed: "Ampliar imagen: {alt}",
    expandedImage: "Imagen ampliada",
    moreOnGithub: "Más en GitHub",
    view: "Ver",
    update: {
      title: "Actualicé el sitio",
      description: "Recarga la página para ver los cambios.",
      later: "Más tarde",
      refresh: "Actualizar",
      dismiss: "Cerrar",
    },
  },
  feed: {
    recentActivity: "Actividad reciente",
    lastEvents: "Últimos {count} eventos",
    noActivity: "No hay actividad reciente",
    loadError: "No se pudo cargar la actividad reciente",
    checkBack: "Vuelve más tarde para ver novedades",
    moreSuffix: "más",
    commit: "{count} commit",
    commits: "{count} commits",
  },
  nav: {
    about: "Sobre mí",
    experience: "Experiencia",
    projects: "Proyectos",
    skills: "Habilidades",
    contact: "Contacto",
    services: "Servicios",
  },
  i18n: {
    detectedNote: "Detectado: {lang}",
  },
  index: {
    greeting: "Hola, soy ",
    description1:
      "Desarrollador de software de 18 años con base en Zúrich, Suiza.",
    description2:
      "Construyo sistemas escalables, rápidos y cuidadosamente diseñados.",
    description3:
      "Trabajo en infraestructura, identidad y diseño de interfaces.",
    description4: "Enfocado en estructura, claridad y precisión.",
    nameSwitch: "cambiar de nombre",
    currentlyWorkingOn: "Actualmente trabajando en",
    contactMe: "Contáctame",
    viewProjects: "Ver proyectos",
  },
  experience: {
    title: "Experiencia",
    subtitle:
      "Mi trayectoria profesional y experiencias educativas que han formado mi experiencia técnica.",
    sections: {
      work: "Trabajo",
      education: "Educación",
    },
    chips: {
      onsite: "Presencial",
      remote: "Remoto",
      hybrid: "Híbrido",
      internship: "Pasantía",
      full_time: "Tiempo completo",
      part_time: "Medio tiempo",
      contract: "Contrato",
      freelance: "Freelance",
    },

    nadlo: {
      role: "Desarrollador de Software Full Stack",
      company: "nadlo",
      location: "Baden, Suiza",
      description:
        "Desarrollo de aplicaciones web de producción en todo el stack: interfaces responsivas y accesibles junto con las APIs y modelos de datos que las sustentan, con énfasis en la seguridad de tipos, el rendimiento y la entrega rápida.",
      achievements: [
        "Desarrollo de funciones full-stack con Next.js, React y TypeScript, con estilos en Tailwind CSS.",
        "Diseño y construcción de servicios backend y APIs REST con NestJS, respaldados por Supabase (Postgres, autenticación y almacenamiento).",
        "Contenerización de servicios con Docker y automatización de pipelines de build, test y despliegue con GitHub Actions.",
        "Responsable de funciones desde el concepto hasta el despliegue, priorizando código mantenible, tipado y de alto rendimiento.",
      ],
    },
    freelance: {
      role: "Desarrollador Web Freelance",
      company: "Autónomo",
      location: "Zürich, Suiza",
      description:
        "Desarrollo soluciones web modernas, desde landings hasta funciones full‑stack, con foco en UX limpia, rendimiento y código mantenible.",
      achievements: [
        "Proyectos con React, Next.js, TypeScript y Tailwind CSS.",
        "Funciones backend con Spring Boot y Java; versionado y automatización con Git.",
      ],
    },
    gz: {
      role: "Desarrollador IAM",
      company: "Gesundheitswelt Zollikerberg",
      location: "Zollikon, Suiza",
      description:
        "Como practicante de ingeniería IAM, contribuyo al mantenimiento y la optimización de la infraestructura de TI, enfocándome en la automatización de procesos de gestión de identidad y acceso. La empresa ofrece servicios de salud a los residentes de Zollikon.",
      achievements: [
        "Apoyé en la automatización de flujos de trabajo de gestión de identidad y acceso (IAM) utilizando PowerShell y Python.",
        "Participé en la implementación de mejoras internas en la infraestructura de TI.",
        "Colaboré en el mantenimiento de Active Directory y en tareas de aprovisionamiento de usuarios.",
      ],
    },
    wiss: {
      role: "Estudiante - Informática",
      company: "WISS",
      location: "Zúrich, Suiza",
      description:
        "Actualmente soy estudiante en WISS, una escuela de informática, donde estoy inmerso en una educación integral en informática. Mis estudios abarcan una amplia gama de temas, incluyendo programación, análisis de sistemas, gestión de bases de datos, desarrollo de software y gestión de proyectos. Esta experiencia me está proporcionando una base amplia y sólida en el campo de la informática, preparándome para un futuro en ingeniería de software.",
      achievements: [
        "Desarrollo de aplicaciones web full-stack utilizando tecnologías modernas",
        "Colaboración en proyectos de equipo utilizando metodologías ágiles",
      ],
    },
    sek: {
      role: "Sek A",
      company: "Lachenzelg",
      location: "Zúrich, Suiza",
      description:
        "Adquirí conocimientos fundamentales para mi trayectoria técnica. Como proyecto final, creé un entorno en Unreal Engine.",
      achievements: [
        "Creación de un entorno 3D inmersivo usando Unreal Engine",
        "Desarrollo de fuertes habilidades de resolución de problemas y análisis",
        "Participación en proyectos y actividades enfocadas en MINT",
      ],
    },
  },
  projects: {
    title: "Proyectos",
    other: "Otros Proyectos",
    otherInfo:
      "Proyectos no destacados: utilidades y experimentos más pequeños.",
    viewDetails: "Ver Detalles",
    viewAll: "Ver Todos los Proyectos",
    viewGithub: "Ver Código",
    satoriAttribution:
      "Imagen creada con [Vercel Satori](https://og-playground.vercel.app/)",
    sortBy: "Ordenar por",
    sortOptions: {
      priority: "Prioridad",
      dateNewest: "Fecha (más reciente)",
      dateOldest: "Fecha (más antigua)",
      nameAsc: "Nombre (A–Z)",
      nameDesc: "Nombre (Z–A)",
    },
    selectSorting: "Seleccionar orden...",
    visitProject: "Visitar proyecto",
    list: {
      codeExtractor: {
        title: "Extractor de Código Web",
        description:
          "Una extensión simple de Chrome que extrae HTML, CSS, JavaScript e imágenes de sitios web y los empaqueta en un archivo ZIP con JSZip. Ideal para sitios pequeños, permite acceso rápido al código web, aunque puede tener limitaciones con sitios más grandes que dependen en gran medida del código del servidor.",
      },
      applicare: {
        title: "AppliCare",
        description:
          "AppliCare es una plataforma moderna de gestión de solicitudes de empleo construida usando Spring Boot para el backend, MongoDB Atlas para almacenar datos, y React (Vite) con Ant Design para el frontend. Proporciona una forma intuitiva y eficiente de organizar y monitorear solicitudes de empleo con una interfaz elegante y responsiva.",
      },
      osint: {
        title: "Sitio Web OSINT",
        description:
          "Este sitio web OSINT es un proyecto personal inspirado en mi interés en la Inteligencia de Fuentes Abiertas y el mundo en constante evolución de las investigaciones digitales. Presenta ejercicios interactivos diseñados para mejorar las habilidades investigativas y fomentar el pensamiento crítico.",
      },
      chatapp: {
        title: "ChatApp",
        description:
          "ChatApp es una plataforma de chat fácil de usar donde los usuarios pueden crear cuentas y conectarse con otros en varias salas de chat. Construida con Spring Boot y respaldada por MongoDB para un almacenamiento eficiente de datos, ChatApp proporciona una experiencia fluida para la comunicación en tiempo real.",
      },
      vmDetector: {
        title: "Detector de Máquinas Virtuales",
        description:
          "Esta es una herramienta que detecta si una máquina es una máquina virtual.",
      },
      viewCounter: {
        title: "Contador de Vistas",
        description:
          "Esta es una aplicación simple de contador de vistas que cuenta el número de veces que se ha visto una página. Está construida con Spring Boot y Redis.",
      },
      dockerService: {
        title: "Despliegue de Servicios Docker",
        description:
          "Este proyecto Docker Compose implementa MediaWiki, Nextcloud, y Gogs, enfocándose en el trabajo en equipo, la containerización y la documentación. Desarrollado con Benicio Von Felten.",
      },
      phishing: {
        title: "Tutorial de Sitio Web de Phishing",
        description:
          "Este es un tutorial sobre cómo crear un sitio web de phishing. Está construido con HTML, CSS y JavaScript.",
      },
      otw: {
        title: "Guía OverTheWire",
        description:
          "Esta es una guía sobre cómo resolver los wargames de OverTheWire.",
      },
      sola: {
        title: "Sola",
        description:
          "Sola es mi sitio web personal, el que estás viendo ahora mismo. Está construido con React, TypeScript y Tailwind CSS, y está diseñado para mostrar mis proyectos, habilidades y experiencia de una manera limpia y moderna.",
      },
      kinoa: {
        title: "Kinoa",
        description:
          "Kinoa es un sitio de streaming gratuito hecho con Next.js, shadcn/ui y Supabase. Sin suscripción — navega entre películas y series, mira con reproducción inline desde proveedores externos y deja que el cambio automático de servidores haga el resto.",
      },
      self: {
        title: "Self",
        description:
          "Self es una herramienta personalizable de visualización de información del sistema para Windows, inspirada en Neofetch y construida con Python. Muestra estadísticas del sistema junto a arte ASCII o imágenes directamente en la terminal. Con soporte para modos de renderizado en bloques o braille, temas personalizables y un instalador sencillo por PowerShell, aporta una estética limpia al estilo Unix a Windows.",
      },
      taco: {
        title: "Taco",
        description:
          "Plantilla lista para producción en torno a Taco, el perro de mi hermano — construida con Next.js, TypeScript y Tailwind CSS. Incluye localización con detección automática, blog y una arquitectura modular limpia apta para proyectos reales.",
      },
      thoughts: {
        title: "Thoughts",
        description:
          "Un sitio personal minimalista donde comparto reflexiones, fragmentos y notas. Inspirado por el sitio web personal de [Shu Ding](https://shud.in), construido con Next.js, MDX y Tailwind. Incluye un libro de visitas personalizado donde los visitantes pueden dejar sus propios pensamientos.",
      },
      magi: {
        title: "magi",
        description:
          "magi es un escáner de puertos TCP y UDP rápido y asíncrono escrito en Rust. Hace connect scanning — un handshake normal por puerto — así que no necesita root y funciona en cualquier sitio donde funcione tokio. Nunca informa de un estado de puerto que no haya establecido realmente: cuando un probe no puede ejecutarse, se marca como untestable en lugar de suponerlo closed. La concurrencia acotada mantiene la memoria plana, desde un solo host hasta un /16 entero, con captura de banners, escaneo UDP y salida JSON para scripting.",
      },
      luma: {
        title: "Luma",
        description:
          "Una plataforma de IA multi‑modelo donde traes tus propias claves API y hablas con los mejores modelos — Claude, GPT, Gemini, Grok y más — todo en un solo lugar. Construido con Next.js 16, el SDK de IA de Vercel y Supabase.",
      },
    },
  },
  skills: {
    title: "Habilidades",
    subtitle: "Tecnologías y herramientas con las que trabajo regularmente.",
    groups: {
      languages: "Lenguajes",
      frontend: "Frontend",
      backend: "Backend",
      infrastructure: "Infraestructura",
      security: "Seguridad",
      tools: "Herramientas",
    },
  },
  notFound: {
    backHome: "Regresar al inicio",
  },
  colophon: {
    title: "Cómo se hizo este sitio",
    lede: "En los libros antiguos, la última página cuenta cómo se hizo todo. Esta es esa página.",
    built:
      "Es una app de [React](https://react.dev) en [TypeScript](https://www.typescriptlang.org), construida con [Vite](https://vite.dev) para que el camino del guardado a la pantalla no se note. El color y el espacio vienen de [Tailwind CSS](https://tailwindcss.com) y [shadcn/ui](https://ui.shadcn.com) — tokens, nunca una paleta cruda. Lo que se mueve es [Motion](https://motion.dev) para la interfaz y [GSAP](https://gsap.com) para los cielos; dos relojes, para que un botón no le pida prestado a un fondo.",
    faces:
      "Las letras son [Onest](https://fonts.google.com/specimen/Onest) para leer, [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) para los nombres, [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) para el código y [Shippori Mincho B1](https://fonts.google.com/specimen/Shippori+Mincho+B1) para tinta como esta. Vive en [Vercel](https://vercel.com); el código está en [GitHub](https://github.com/lyfe691/sola).",
    close: "Compuesto a mano en Zúrich. Gracias por la visita.",
    back: "Volver",
  },
  changelog: {
    title: "Changelog",
    subtitle:
      "El historial git en vivo de este sitio. Expande un commit para leer el mensaje, el árbol de archivos y el patch.",
    empty: "No hay commits que mostrar.",
    error: "No se pudo cargar el historial de git.",
    retry: "Reintentar",
    older: "Cargar anteriores",
    viewOnGitHub: "Ver en GitHub",
    thisDeploy: "este deploy",
    truncated: "Diff recortado. Commit completo en GitHub.",
    unavailable: "Patch omitido (binario o demasiado grande).",
    files: "{count} archivos",
    expand: "Mostrar commit",
    collapse: "Ocultar commit",
  },
  footer: {
    atw: "acerca de este sitio web",
    madeWith: "Hecho con",
    by: "por",
    rights: "Todos los derechos reservados.",
    navigation: "Navegación",
    connect: "Conectarse",
    contact: "Contacto",
    contactForm: "Formulario de contacto",
    privacy: "Política de privacidad",
    legal: "Legal",
    changelog: "Changelog",
  },
  about: {
    title: "Sobre mí",
    intro:
      "Soy Yanis Sebastian Zürcher, desarrollador de software de 18 años en Zúrich. Estudié Ciencias de la Computación en [WISS](https://www.wiss.ch) durante dos años. Estoy de prácticas en [nadlo](https://nadlo.ch) hasta julio de 2027, como parte de ese programa.",
    hobbies:
      "Trabajo full-stack, pero lo que me gusta es la UI y el diseño. Me gusta decidir cómo debería verse algo y cómo debería sentirse al usarlo — esa es la parte del trabajo en la que de verdad quiero invertir tiempo.",
    philosophy: {
      title: "Cómo trabajo",
      clean:
        "El código tiene que seguir teniendo sentido dentro de seis meses. Reescribo lo ingenioso hasta que es aburrido.",
      simplicity:
        "Si una función necesita un párrafo para explicarse, probablemente son dos. Recorto hasta que lo que queda es obvio.",
      learning:
        "Aprendo construyendo lo siguiente que aún no sé hacer. Docs, repos y romper cosas en público.",
    },
    interests: {
      title: "Intereses",
      nature: {
        title: "Aire libre",
        description:
          "Intento salir con regularidad: sobre todo senderismo, a veces solo caminatas largas sin destino. Vivir en Suiza lo pone fácil; los Alpes están cerca, y unas horas en un sendero siguen siendo de las mejores formas que conozco de despejar la cabeza después de demasiadas horas delante de una pantalla.",
      },
      tech: {
        title: "Open source",
        description:
          "Contribuyo a open source cuando un proyecto me interesa de verdad, no como un ítem de lista. Suele ser trabajo de rendimiento, accesibilidad o pequeñas mejoras en herramientas que ya uso a diario.",
      },
      learning: {
        title: "Aprendizaje",
        description:
          "Fuera de clase sigo aprendiendo con una mezcla de libros, documentación y algún curso cuando algo es nuevo para mí. Últimamente me he centrado en sistemas y en cómo funcionan los navegadores por dentro, y eso vuelve directo a los proyectos que saco.",
      },
      workspace: {
        title: "Setup",
        description:
          "Mi escritorio es simple a propósito: dos monitores, un teclado mecánico y poco desorden. Me importa más un setup que no estorbe que coleccionar gadgets, para poder sentarme a trabajar sin reordenar media habitación antes.",
      },
    },
    testimonials: {
      title: "De gente con la que he trabajado",
      link: "Trabajar conmigo",
      viewMore: "Ver más",
      visitWebsite: "Visitar sitio web",
      website: "Sitio web",
      roleAtCompany: "{role} en {company}",
      viewLinkedIn: "Ver LinkedIn",
      modalTitle: "Testimonio",
      modalDescription: "Testimonio completo de {author}",
      items: {
        koenitzer: {
          quote:
            "Trabajar con Yanis en todas las asignaturas de Ingeniería de Software (TI) fue una experiencia memorable. Sus habilidades técnicas, su fiabilidad y su capacidad para resolver problemas estaban a otro nivel. Un desarrollador y compañero de equipo verdaderamente excepcional.",
          role: "Becario",
        },
        bichsel: {
          quote:
            "Trabajar con Yanis fue una experiencia fantástica. Me sacó adelante en todas las asignaturas, aportando siempre soluciones creativas a problemas complejos y entregando todo a tiempo. Un desarrollador verdaderamente excepcional.",
          role: "Estudiante",
        },
        venzin: {
          quote:
            "Yanis combina de una forma poco común la destreza técnica con la sensibilidad por el diseño. El WISS Forum que creó para nosotros superó todas las expectativas y ha mejorado notablemente nuestra presencia en línea.",
          role: "Profesor",
        },
      },
    },
    certifications: {
      link: "Certificaciones",
    },
    resume: {
      title: "Solicitar currículum completo",
      description:
        "La versión pública de mi currículum tiene información sensible censurada. Si necesitas la versión completa, por favor [contáctame](https://sola.ysz.life/contact) o envía un email a [yanis.sebastian.zuercher@gmail.com](mailto:yanis.sebastian.zuercher@gmail.com).",
      viewButton: "Ver versión censurada",
      downloadButton: "Descargar versión censurada",
      languageLabel: "Idioma:",
      buttonLabel: "Currículum",
    },
    github: {
      title: "Actividad de GitHub",
      overview: "Resumen",
      totalCount: "{{count}} contribuciones en {{year}}",
      totalCountLastYear: "{{count}} contribuciones en el último año",
      legendLess: "Menos",
      legendMore: "Más",
      dayTooltip: "{count} contribuciones el {date}",
      loadError: "No se pudieron cargar los datos de contribuciones.",
    },
    philosophyLabels: {
      clean: "Código legible",
      simplicity: "Menos, no más",
      learning: "Construir para aprender",
    },
  },
  contact: {
    title: "Contacto",
    description:
      "¿Tienes una pregunta o quieres trabajar juntos? ¡No dudes en contactarme!",
    formTitle: "Enviar un mensaje",
    reachOut: "O contáctame directamente",
    expectations: {
      title: "Qué esperar",
      items: [
        "Una respuesta en uno o dos días",
        "Una conversación clara y sin compromiso sobre tu idea",
        "Opiniones honestas sobre alcance, plazos y encaje",
        "Tus datos quedan privados — solo una respuesta directa",
      ],
    },
    nameLabel: "Nombre",
    namePlaceholder: "Tu nombre",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "tu.email@ejemplo.com",
    messageLabel: "Mensaje",
    messagePlaceholder: "Tu mensaje aquí...",
    send: "Enviar mensaje",
    sending: "Enviando...",
    successMessage:
      "¡Gracias por tu mensaje! Me pondré en contacto contigo pronto.",
    errorMessage: "Algo salió mal. Por favor, inténtalo de nuevo.",
    subjectLabel: "Asunto",
    subjectPlaceholder: "Ingresa el asunto",
    validation: {
      nameRequired: "Por favor, escribe tu nombre.",
      emailRequired: "Por favor, escribe tu correo electrónico.",
      emailInvalid: "Por favor, escribe un correo electrónico válido.",
      subjectRequired: "Por favor, escribe un asunto.",
      messageRequired: "Por favor, escribe un mensaje.",
    },
  },
  services: {
    badges: {
      mostPopular: "Más popular",
    },
    title: "Servicios",
    subtitle:
      "Servicios integrales de desarrollo de software adaptados a sus necesidades, entregados con experiencia y precisión.",
    getStarted: "Comenzar",
    services: {
      fullstack: {
        title: "Desarrollo Full Stack",
        description:
          "Desarrollo integral de aplicaciones web utilizando tecnologías modernas como React, Spring Boot y MongoDB.",
        price: "desde CHF 75/h",
        features: [
          "Aplicaciones web responsivas",
          "Desarrollo de API RESTful",
          "Diseño e implementación de bases de datos",
          "Optimización de rendimiento",
        ],
      },
      frontend: {
        title: "Desarrollo Frontend",
        description:
          "Creación de interfaces atractivas, responsivas y fáciles de usar con marcos y sistemas de diseño modernos.",
        price: "desde CHF 65/h",
        features: [
          "Desarrollo con React",
          "Implementación de UI/UX",
          "Animación e interactividad",
          "Diseño mobile-first",
        ],
      },
      backend: {
        title: "Desarrollo Backend",
        description: "Soluciones del lado del servidor robustas y escalables.",
        price: "desde CHF 70/h",
        features: [
          "Arquitectura de API",
          "Administración de bases de datos",
          "Optimización de servidores",
          "Implementación de seguridad",
        ],
      },
      consulting: {
        title: "Consultoría Técnica",
        description: "Orientación experta para sus decisiones técnicas.",
        price: "desde CHF 60/h",
        features: [
          "Planificación de arquitectura",
          "Selección de pila tecnológica",
          "Auditoría de rendimiento",
          "Evaluación de seguridad",
        ],
      },
    },
    contactTemplate: {
      inquiry: "Consulta",
      greeting: "Hola Yanis,",
      interested: "Estoy interesado en sus servicios de {service}.",
      discuss: "Me gustaría hablar sobre:",
      closing: "¡Espero su respuesta!",
    },
    customRequirements: {
      title: "¿Tienes requisitos personalizados?",
      description:
        "¿Tienes un proyecto específico en mente? Te puedo ayudar a hacer tu visión realidad. Hagamos una reunión para discutir tus requisitos y crear una solución personalizada para tus necesidades.",
      button: "Contáctame",
      subject: "Requisitos de desarrollo a medida",
      message:
        "Hola Yanis:\n\nTengo requisitos específicos que no encajan en las categorías de servicio estándar. Me gustaría hablar de una solución a medida.\n\nDetalles del proyecto:\n- \n- \n- \n\n¡Espero poder hablarlo contigo!",
    },
  },
  errorBoundary: {
    title: "Algo salió mal",
    message:
      "Se produjo un error inesperado. Recargar la página suele solucionarlo.",
    reload: "Recargar",
  },
} satisfies Translation;
