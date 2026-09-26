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
      terminal: "Terminal",
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
      placeholder: "Busca en el sitio o ejecuta un comando…",
      noResultsFor: "Sin resultados para «{query}»",
      noResultsHint: "Prueba con un proyecto, una tecnología o una página.",
      groups: {
        navigation: "Navegación",
        theme: "Tema",
        language: "Idioma",
        background: "Fondo",
        sections: "Detalles de proyectos",
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
    sourcePrivate: "El código fuente es privado.",
    sourcePrivateClient:
      "Hecho para un cliente, por eso el código fuente es privado.",
    linkPrivate: "La app en vivo es privada.",
    linkPrivateClient:
      "Se usa dentro de la empresa del cliente, por eso la app en vivo es privada.",
    demo: "Demo",
    moreProjects: "Más proyectos",
    onThisPage: "En esta página",
    linkToSection: "Enlace a la sección: {title}",
    close: "Cerrar",
    expandImage: "Ampliar imagen",
    expandImageNamed: "Ampliar imagen: {alt}",
    expandedImage: "Imagen ampliada",
    previousImage: "Imagen anterior",
    nextImage: "Imagen siguiente",
    imageOf: "Imagen {current} de {total}",
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
    viewDetails: "Ver Detalles",
    viewGithub: "Ver Código",
    sortBy: "Ordenar por",
    sortOptions: {
      featured: "Destacados",
      newest: "Más recientes",
      oldest: "Más antiguos",
      name: "Nombre (A–Z)",
    },
    kind: {
      label: "Tipo de proyecto",
      all: "Todos",
      personal: "Personales",
      commercial: "Comerciales",
    },
    empty: "Nada por aquí todavía",
    emptyDescription:
      "Los proyectos de este tipo aparecerán aquí cuando estén listos.",
    visitProject: "Visitar proyecto",
    list: {
      codeExtractor: {
        title: "Extractor de Código Web",
        tagline: "El código de cualquier web en un ZIP",
        description:
          "[Website Code Extractor](https://chromewebstore.google.com/detail/website-code-extractor/foppgeakfpkdghmmmflmblcidoofpohm) es una extensión para Chrome y Edge que descarga el HTML, CSS, JavaScript y las imágenes de un sitio web en un solo archivo ZIP, conservando la estructura de carpetas. Un clic, sin configuración. Tiene 6000 usuarios en la Chrome Web Store y funciona mejor con sitios estáticos.",
      },
      applicare: {
        title: "AppliCare",
        tagline: "Todas tus candidaturas en un solo lugar",
        description:
          "[AppliCare](https://applicare.app) lleva el control de tus candidaturas de empleo. Añade cada una con su estado, de enviada a oferta, asóciale tareas con fecha límite y sigue tu progreso en un panel con tasa de éxito y una línea de tiempo. Hecho con React, Ant Design, Spring Boot y MongoDB.",
      },
      osint: {
        title: "Sitio Web OSINT",
        tagline: "Afina tu instinto investigador",
        description:
          "[OSINT Exercises](https://osint.ysz.life) es un sitio para practicar inteligencia de fuentes abiertas: encontrar información a partir de fuentes públicas. Cada ejercicio ofrece un contexto y una serie de tareas, de fácil a experto, y cualquiera puede enviar un ejercicio nuevo a través del sitio.",
      },
      chatapp: {
        title: "ChatApp",
        tagline: "Salas en tiempo real sobre Spring Boot",
        description:
          "ChatApp es una plataforma de chat en tiempo real: crea una cuenta, verifica tu correo y conversa en salas que creas o a las que te unes. Los mensajes viajan por WebSockets, con Spring Boot y MongoDB detrás. Hecho para un módulo escolar.",
      },
      vmDetector: {
        title: "Detector de Máquinas Virtuales",
        tagline: "Detecta si corres en una máquina virtual",
        description:
          "Una pequeña herramienta en Java que te dice si se está ejecutando dentro de una máquina virtual. Revisa la BIOS, la CPU, la dirección MAC de la tarjeta de red y el registro de Windows en busca de los rastros que deja un hipervisor.",
      },
      viewCounter: {
        title: "Contador de Vistas",
        tagline: "Un contador de vistas sobre Redis",
        description:
          "Un contador de visitas: cada visita a la página de inicio suma una, y el total se guarda en Redis, así que sobrevive a un reinicio. Un pequeño proyecto con Spring Boot para aprender cómo encaja Redis en una aplicación web en Java.",
      },
      dockerService: {
        title: "Despliegue de Servicios Docker",
        tagline: "MediaWiki, Nextcloud y Gogs con Compose",
        description:
          "Una configuración de Docker Compose que ejecuta MediaWiki, Nextcloud y Gogs en paralelo, con datos persistentes y Portainer para supervisarlos. Un proyecto escolar, construido y documentado junto con Benicio Von Felten.",
      },
      phishing: {
        title: "Tutorial de Sitio Web de Phishing",
        tagline: "Cómo funcionan las páginas de phishing",
        description:
          "Un recorrido paso a paso por cómo se arma una página de phishing, escrito para que sepas reconocer una cuando la veas. Solo con fines educativos.",
      },
      otw: {
        title: "Guía OverTheWire",
        tagline: "Bandit, nivel a nivel",
        description:
          "Una guía del wargame [Bandit de OverTheWire](https://overthewire.org/wargames/bandit/), nivel por nivel, con una breve introducción a los comandos de Linux que necesita cada nivel.",
      },
      sola: {
        title: "Sola",
        tagline: "Portafolio moderno en React y TypeScript",
        description:
          "Sola es mi sitio web personal, el que estás viendo ahora mismo. Está construido con React, TypeScript y Tailwind CSS, y está diseñado para mostrar mis proyectos, habilidades y experiencia de una manera limpia y moderna.",
      },
      kinoa: {
        title: "Kinoa",
        tagline: "Streaming gratis, sin ruido",
        description:
          "[Kinoa](https://kinoa.to) es un sitio gratuito de streaming de películas y series. Explora las tendencias, abre un título y dale a reproducir en la misma página, sin necesidad de cuenta; al iniciar sesión tienes una lista y un historial que se sincronizan entre dispositivos. Hecho con Next.js, Supabase y datos de TMDB.",
      },
      self: {
        title: "Self",
        tagline: "Neofetch, reinventado para Windows",
        description:
          "Self muestra la información de tu sistema en la terminal junto a una imagen o arte ASCII, como hace Neofetch en Linux, pero para Windows. Se instala con un solo comando de PowerShell, dibuja las imágenes con bloques de color o braille y tiene temas configurables. Escrito en Python.",
      },
      taco: {
        title: "Taco",
        tagline: "La web de un perro, hecha como plantilla reutilizable",
        description:
          "[Taco](https://takitwo.vercel.app) es un sitio web sobre el perro de mi hermano, hecho como una plantilla que puedo reutilizar: páginas en inglés, español y japonés con detección automática del idioma, un blog, una galería y una página de contacto. Hecho con Next.js, TypeScript y Tailwind CSS.",
      },
      thoughts: {
        title: "Thoughts",
        tagline: "Reflexiones, fragmentos y notas",
        description:
          "[Thoughts](https://thoughts.ysz.life) es un sitio pequeño donde escribo reflexiones, fragmentos y notas, separado de este portafolio. Las entradas son archivos MDX, y un libro de visitas permite a quien pase dejar su propia nota. Inspirado en el sitio personal de [Shu Ding](https://shud.in).",
      },
      magi: {
        title: "magi",
        tagline: "Escaneo de puertos asíncrono y correcto",
        description:
          "[magi](https://magi.ysz.life) es un escáner de puertos TCP y UDP rápido, escrito en Rust. Escanea con conexiones normales, así que no necesita root, y solo informa de lo que realmente observó: un puerto que no pudo probar se marca como untestable en lugar de closed. Un solo comando lo instala en Linux, macOS o Windows.",
      },
      luma: {
        title: "Luma",
        tagline: "Trae tus claves, habla con cualquier modelo",
        description:
          "[Luma](https://luma.ysz.life) es una app de chat para todos los grandes modelos de IA: trae tus propias claves de API y cambia entre Claude, GPT, Gemini, Grok y más dentro de una misma conversación. Edita cualquier mensaje anterior y el chat se ramifica, conservando ambos caminos. Tus claves se cifran antes de guardarse.",
      },
      perspectas: {
        title: "perspectas.ch",
        tagline: "Sitio de consultoría alrededor de un punto amarillo",
        description:
          "El sitio web de [perspectas gmbh](https://www.perspectas.ch), una empresa de consultoría y selección de personal cerca de Zúrich, rehecho con Next.js y Sanity. Cada texto e imagen vive en el CMS, así que los dos socios publican los cambios ellos mismos. El diseño tiene un solo acento: el punto amarillo de su logo, que también es el punto final del titular.",
      },
      ura: {
        title: "Ura",
        tagline: "Motonieve en Laponia: sin conexión y con permisos",
        description:
          "Ura es navegación para motonieve en la Laponia finlandesa, para iOS y Android. Lleva 2595 rutas y 3388 lugares como gasolineras, cafés y refugios en el teléfono, así que funciona donde no hay señal. Te dice si estás en una ruta y si esa ruta es libre o si primero hace falta un permiso.",
      },
      montu: {
        title: "Montu",
        tagline: "Diario de montaña suizo, trazado desde sus archivos GPX",
        description:
          "[Montu](https://montu.ch) es un diario de rutas de montaña en alemán suizo, hecho para un cliente que escribe las rutas y toma las fotos él mismo. Sube un archivo GPX y la página dibuja la ruta sobre un mapa de relieve con su perfil de altitud. Rutas, fotos y todos los demás textos se editan en un CMS, así que publicar una ruta nueva no requiere a ningún desarrollador.",
      },
      qr: {
        title: "QR",
        tagline: "QR con estilo y prueba de escaneo",
        description:
          "[qr.ysz.life](https://qr.ysz.life) es un generador de códigos QR que funciona por completo en tu navegador. Da estilo a los puntos y las esquinas, añade degradados y un logo, y exporta en PNG, SVG, JPEG o WebP. Una prueba de escaneo integrada vuelve a leer el código terminado, para que sepas que sigue funcionando antes de imprimirlo.",
      },
      vault: {
        title: "Vault",
        tagline: "Keycloak, FastAPI y un realm definido en Terraform",
        description:
          "Vault es un sandbox local para aprender OpenID Connect. Keycloak emite los tokens, un servicio en FastAPI los verifica y un frontend en Next.js muestra paneles restringidos por rol. La configuración de identidad se declara en Terraform, así que todo se puede desmontar y volver a levantar con un solo comando.",
      },
      fleetmap: {
        title: "fleetmap",
        tagline: "GPS de cada furgoneta en la pantalla",
        description:
          "fleetmap es un mapa en vivo de una flota de reparto. El teléfono de cada furgoneta informa su posición y una pantalla en la oficina muestra cada vehículo en movimiento, con sus paradas, su ETA y su retraso. Cualquier día pasado se puede reproducir a partir del recorrido grabado. Hecho con Next.js, Supabase y MapLibre.",
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
    levels: {
      1: "Aprendiendo",
      2: "Básico",
      3: "Con soltura",
      4: "Competente",
      5: "Avanzado",
    },
    usedIn: "Usado en {count} proyectos",
    usedInOne: "Usado en 1 proyecto",
    projectCount: "{count} proyectos",
    projectCountOne: "1 proyecto",
    everyProject: "Todos los proyectos",
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
      "Las letras son [Geist](https://vercel.com/font) tanto para leer como para los nombres, [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) para el código y [Shippori Mincho B1](https://fonts.google.com/specimen/Shippori+Mincho+B1) para tinta como esta. Vive en [Vercel](https://vercel.com); el código está en [GitHub](https://github.com/lyfe691/sola).",
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
    pr: "PR #{number}",
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
          role: "Vago desempleado",
        },
        bichsel: {
          quote:
            "Trabajar con Yanis fue una experiencia fantástica. Me sacó adelante en todas las asignaturas, aportando siempre soluciones creativas a problemas complejos y entregando todo a tiempo. Un desarrollador verdaderamente excepcional.",
          role: "Becario",
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
      buttonLabel: "Currículum",
      title: "Currículum",
      description:
        "Dos páginas, en inglés o alemán. Aquí mi dirección y mi teléfono van tachados; la copia completa está a un [correo](mailto:yanis.sebastian.zuercher@gmail.com) de distancia.",
      languageLabel: "Idioma",
      read: "Leerlo aquí",
      download: "Descargar PDF",
      open: "Abrir PDF",
      back: "Volver",
      failed: "No se pudo mostrar aquí. Abre el PDF en su lugar.",
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
