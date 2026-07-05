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
    overview: "Resumen",
    menu: {
      themes: "Temas",
      customThemes: "Temas personalizados",
      background: "Fondos",
    },
    diff: {
      showDiff: "Mostrar git diff",
      exit: "Ocultar git diff",
      hint: "Muestra el último commit que modificó la página actual.",
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
    lastEvents: "Últimos 20 eventos",
    noActivity: "No hay actividad reciente",
    checkBack: "Vuelve más tarde para ver novedades",
    moreSuffix: "más",
  },
  hire: {
    hirebtn: "Contrátame",
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
    period: {
      nadlo: "May 2026 - Presente",
      gz: "Ago 2025 - Mar 2026",
      freelance: "Jul 2025 - Presente",
      wiss: "Ago 2023 - Presente",
      sek: "2020 - 2023",
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
    backHome: "Regresar",
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
    intro:
      "En los libros antiguos, la última página cuenta cómo se hizo todo. Esta es esa página.",
    setByHand: "Compuesto a mano en Zúrich.",
    thanks: "Gracias por la visita.",
    back: "Volver",
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
  },
  about: {
    title: "Sobre Mí",
    intro:
      "Soy Yanis Sebastian Zürcher, un desarrollador de software de 18 años de Zúrich, Suiza. Estudio Ciencias de la Computación en [WISS](https://www.wiss.ch), pero la mayor parte de lo que sé lo he aprendido haciendo mis propios proyectos, no en la escuela.",
    hobbies:
      "Me enfoco en crear aplicaciones web rápidas, limpias y minimalistas. Ya sea desarrollando plataformas completas o interfaces pulidas, me importan la claridad, el rendimiento y una experiencia de usuario refinada. Siempre estoy desarrollando nuevas ideas propias y creando cosas que se sienten tan bien como funcionan.",
    philosophy: {
      title: "Mi Enfoque",
      clean:
        "Creo que el código limpio y mantenible es la base del desarrollo de software sostenible. Cada línea que escribo refleja mi compromiso con la excelencia.",
      simplicity:
        "Los problemas complejos merecen soluciones elegantes. Me esfuerzo por encontrar el equilibrio perfecto entre funcionalidad, rendimiento y experiencia de usuario.",
      learning:
        "El panorama tecnológico evoluciona rápidamente, y yo evoluciono con él. El aprendizaje continuo y la adaptación son componentes esenciales de mi identidad profesional.",
    },
    interests: {
      title: "Intereses & Hobbies",
      nature: {
        title: "Explorador de la Naturaleza",
        description:
          "Encuentro paz y inspiración en la naturaleza. Ya sea que esté caminando por los Alpes suizos o descubriendo senderos ocultos, cada viaje trae nuevas perspectivas e ideas.",
      },
      tech: {
        title: "Entusiasta de la Tecnología",
        description:
          "Más allá del trabajo, estoy entusiasmado por explorar nuevas tecnologías y contribuir a proyectos de código abierto. La escena tecnológica en constante evolución me mantiene curioso y comprometido.",
      },
      learning: {
        title: "Aprendizaje Continuo",
        description:
          "Creo en el aprendizaje continuo. Desde libros técnicos hasta cursos en línea, siempre busco expandir mis conocimientos y habilidades.",
      },
      workspace: {
        title: "Espacio Creativo",
        description:
          "Mi espacio de trabajo es donde las ideas cobran vida. Con una configuración minimalista y las herramientas adecuadas, creo un entorno que fomenta la productividad y la creatividad.",
      },
    },
    testimonials: {
      title: "Lo que la gente dice",
      link: "Trabajar conmigo",
      viewMore: "Ver más",
      visitWebsite: "Visitar sitio web",
      website: "Sitio web",
      roleAtCompany: "{role} en {company}",
      viewLinkedIn: "Ver LinkedIn",
      modalTitle: "Testimonio",
      modalDescription: "Testimonio completo de {author}",
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
      clean: "Código limpio",
      simplicity: "Simplicidad",
      learning: "Aprendizaje continuo",
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
    attachmentPlaceholder: "Haz clic para elegir o arrastra un archivo",
    uploadedLabel: "Subido",
    cloudinaryLinkLabel: "Enlace de Cloudinary",
    dropOverlay: "Suelta para adjuntar",
    fileTooLarge: "El archivo es demasiado grande (máx. {max}).",
    unsupportedFileType:
      "Tipo de archivo no soportado. Permitidos: PNG, JPG, WEBP, PDF, DOC, DOCX.",
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
    },
  },
} satisfies Translation;
