/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 * 
 * This file is part of the project and is subject to the terms of the project's LICENSE (GNU GPL v3).
 * Please refer to the LICENSE file in the project root for full licensing details.
 * 
 * All rights reserved.
 */

// might work on the translations to be more accurate later

export const translations = {
  en: {
    nav: {
      about: "About",
      experience: "Experience",
      projects: "Projects",
      skills: "Skills",
      contact: "Contact",
      services: "Services"
    },
    index: {
      greeting: "Hello, I'm Yanis",
      description: "I'm a 16 year old software developer based in Zürich, Switzerland, focused on building exceptional digital experiences.",
      contactMe: "Contact me",
      viewProjects: "View projects"
    },
    experience: {
      title: "Experience",
      backHome: "Back home",
      subtitle: "My professional journey and educational experiences that have shaped my technical expertise.",
      period: {
        present: "Present",
        wiss: "Aug 2023 - Present",
        sek: "2020 - 2023"
      },
      wiss: {
        role: "Student - Computer Science",
        company: "WISS",
        location: "Zürich, Switzerland",
        description: "I am currently a student at WISS, a Computer Science school, where I am immersed in a comprehensive computer science education. My studies cover a wide range of topics, including programming, systems analysis, database management, software development, and project management. This experience is providing me with a broad and solid foundation in the field of computer science, preparing me for a future in software engineering.",
        achievements: [
          "Developed full-stack web applications using modern technologies",
          "Collaborated on team projects using agile methodologies",
        ]
      },
      sek: {
        role: "Sek A",
        company: "Lachenzelg",
        location: "Zürich, Switzerland",
        description: "Gathered fundamental knowledge for my technical journey. As the final project i created a Unreal Engine Environment.",
        achievements: [
          "Created an immersive 3D environment using Unreal Engine",
          "Developed strong problem-solving and analytical skills",
          "Participated in MINT-focused projects and activities"
        ]
      }
    },
    projects: {
      title: "Projects",
      backHome: "Back home",
      featured: "Featured Projects",
      other: "Other Projects",
      viewProject: "View Project",
      viewGithub: "View Code",
      technologies: "Technologies used",
      list: {
        codeExtractor: {
          title: "Website Code Extractor",
          description: "A simple Chrome extension that extracts HTML, CSS, JavaScript, and images from websites and packages them into a zip file with JSzip. Ideal for smaller sites, it allows quick access to web code, though it may struggle with larger sites that rely heavily on server-side code."
        },
        applicare: {
          title: "AppliCare",
          description: "AppliCare is a modern job application management platform built using Spring Boot for the backend, MongoDB Atlas to store data, and React (Vite) with Ant Design for the frontend. It provides an intuitive and efficient way to organize and monitor job applications with a sleek, responsive interface."
        },
        osint: {
          title: "OSINT Website",
          description: "This OSINT website is a passion project inspired by my interest in Open Source Intelligence and the ever-evolving world of digital investigations. It features interactive exercises designed to sharpen investigative skills and encourage critical thinking."
        },
        chatapp: {
          title: "ChatApp",
          description: "ChatApp is a user-friendly chat platform where individuals can create accounts and connect with others in various chat rooms. Built with Spring Boot and backed by MongoDB for efficient data storage, ChatApp provides a seamless experience for real-time communication."
        },
        vmDetector: {
          title: "Virtual Machine Detector",
          description: "This is a tool that detects if a machine is a virtual machine."
        },
        viewCounter: {
          title: "View Counter",
          description: "This is a simple view counter application that counts the number of times a page has been viewed. It is built with Spring Boot and redis."
        },
        dockerService: {
          title: "Docker Service Deployment",
          description: "This Docker Compose project deploys MediaWiki, Nextcloud, and Gogs, focusing on teamwork, containerization, and documentation. Developed with Benicio Von Felten."
        },
        phishing: {
          title: "Phishing Website Tutorial",
          description: "This is a tutorial on how to create a phishing website. It is built with HTML, CSS, and JavaScript."
        },
        otw: {
          title: "OverTheWire Guide",
          description: "This is a guide on how to solve the OverTheWire wargames."
        },
        sola: {
          title: "Sola",
          description: "Sola is my personal website, the one youre on right now. It is built with React, TypeScript, and Tailwind CSS, and is designed to showcase my projects, skills, and experience in a clean and modern way."
        }
      }
    },
    skills: {
      title: "Skills",
      backHome: "Back home",
      groups: {
        frontend: "Frontend",
        backend: "Backend",
        tools: "Tools",
        other: "Other"
      }
    },
    notFound: {
      title: "404",
      subtitle: "Oops! The page you're looking for can't be found.",
      backHome: "Go back home"
    },
    footer: {
      madeWith: "Made with",
      by: "by",
      rights: "All rights reserved.",
      navigation: "Navigation",
      connect: "Connect",
      contact: "Contact",
      contactForm: "Contact Form"
    },
    about: {
      title: "About Me",
      backHome: "Back home",
      intro: "I'm a passionate software developer with a focus on building innovative, high-performance web applications. Currently pursuing my education in Computer Science at WISS in Zürich, I combine technical expertise with creative problem-solving to deliver elegant solutions that exceed expectations.",
      hobbies: "Beyond coding, I'm actively involved in the tech community, continuously exploring emerging technologies and contributing to meaningful open-source projects.",
      philosophy: {
        title: "My Approach",
        clean: "I believe that clean, maintainable code is the foundation of sustainable software development. Every line I write reflects my commitment to excellence.",
        simplicity: "Complex problems deserve elegant solutions. I strive to find the perfect balance between functionality, performance, and user experience.",
        learning: "The tech landscape evolves rapidly, and so do I. Continuous learning and adaptation are essential components of my professional identity."
      },
      interests: {
        title: "Passions & Pursuits",
        nature: {
          title: "Alpine Exploration",
          description: "Living in Switzerland offers incredible access to nature. I regularly hike through the Alps, finding that the blend of challenge and natural beauty provides both mental clarity and creative inspiration for my technical work."
        },
        tech: {
          title: "Open Source Contribution",
          description: "I actively contribute to several open-source projects, particularly focusing on performance optimization and accessibility improvements. This community involvement keeps me at the cutting edge while giving back to the ecosystem I value."
        },
        learning: {
          title: "Technical Literature",
          description: "I maintain a curated collection of technical books and regularly participate in online courses. Currently exploring advanced patterns in distributed systems and functional programming paradigms that I apply to my projects."
        },
        workspace: {
          title: "Optimized Environment",
          description: "My workspace is carefully designed to maximize productivity and creativity. I use a minimalist dual-monitor setup with custom mechanical keyboard and ergonomic solutions that enable long, focused development sessions."
        }
      }
    },
    contact: {
      title: "Get in Touch",
      description: "Have a question or want to work together? Feel free to reach out!",
      backHome: "Back Home",
      nameLabel: "Name",
      namePlaceholder: "Your name",
      emailLabel: "Email",
      emailPlaceholder: "your.email@example.com",
      messageLabel: "Message",
      messagePlaceholder: "Your message here...",
      send: "Send Message",
      sending: "Sending...",
      successMessage: "Thanks for your message! I'll get back to you soon.",
    },
    services: {
      title: "Services",
      subtitle: "Comprehensive software development services tailored to your needs.",
      backHome: "Back home",
      pricing: "* Prices are negotiable and will be tailored to your specific needs and project scope.",
      services: {
        fullstack: {
          title: "Full Stack Development",
          description: "End-to-end web application development using modern technologies.",
          features: [
            "Responsive web applications",
            "RESTful API development",
            "Database design and implementation",
            "Performance optimization"
          ]
        },
        frontend: {
          title: "Frontend Development",
          description: "Creating beautiful, responsive, and user-friendly interfaces.",
          features: [
            "React development",
            "UI/UX implementation",
            "Animation and interactivity",
            "Mobile-first design"
          ]
        },
        backend: {
          title: "Backend Development",
          description: "Robust and scalable server-side solutions.",
          features: [
            "API architecture",
            "Database management",
            "Server optimization",
            "Security implementation"
          ]
        },
        consulting: {
          title: "Technical Consulting",
          description: "Expert guidance for your technical decisions.",
          features: [
            "Architecture planning",
            "Technology stack selection",
            "Performance auditing",
            "Security assessment"
          ]
        }
      },
      customRequirements: {
        title: "Custom Requirements?",
        description: "Have a specific project in mind? I'm here to help turn your vision into reality. Let's discuss your requirements and create a tailored solution for your needs.",
        button: "Get in touch"
      }
    },
  },
  de: {
    nav: {
      about: "Über mich",
      experience: "Erfahrung",
      projects: "Projekte",
      skills: "Fähigkeiten",
      contact: "Kontakt",
      services: "Dienstleistungen"
    },
    index: {
      greeting: "Hallo, ich bin Yanis",
      description: "Ich bin ein 16 Jähriger Softwareentwickler aus Zürich, Schweiz, und konzentriere mich darauf, aussergewöhnliche digitale Erlebnisse zu schaffen.",
      contactMe: "Kontakt",
      viewProjects: "Projekte ansehen"
    },
    experience: {
      title: "Erfahrung",
      backHome: "Zurück",
      subtitle: "Mein beruflicher Werdegang und meine Ausbildung, die meine technische Expertise geprägt haben.",
      period: {
        present: "Heute",
        wiss: "Aug 2023 - Heute",
        sek: "2020 - 2023"
      },
      wiss: {
        role: "Student - Informatik",
        company: "WISS",
        location: "Zürich, Schweiz",
        description: "Ich bin derzeit Student an der WISS, einer Informatikschule, wo ich eine umfassende Informatikausbildung absolviere. Mein Studium umfasst ein breites Spektrum an Themen, darunter Programmierung, Systemanalyse, Datenbankmanagement, Softwareentwicklung und Projektmanagement. Diese Erfahrung verschafft mir eine breite und solide Grundlage im Bereich der Informatik, bereitet mich auf eine Zukunft in der Softwareentwicklung vor.",
        achievements: [
          "Entwicklung von Full-Stack-Webanwendungen mit modernen Technologien",
          "Zusammenarbeit an Teamprojekten mit agilen Methoden",
        ]
      },
      sek: {
        role: "Sek A",
        company: "Lachenzelg",
        location: "Zürich, Schweiz",
        description: "Erwarb grundlegendes Wissen für meinen technischen Werdegang. Als Abschlussprojekt erstellte ich eine Unreal Engine Umgebung.",
        achievements: [
          "Erstellung einer immersiven 3D-Umgebung mit Unreal Engine",
          "Desarrollo de fuertes habilidades de resolución de problemas y análisis",
          "Participación en proyectos y actividades enfocadas en MINT"
        ]
      }
    },
    projects: {
      title: "Projekte",
      backHome: "Zurück",
      featured: "Featured Projects",
      other: "Other Projects",
      viewProject: "View Project",
      viewGithub: "View Code",
      technologies: "Technologies used",
      list: {
        codeExtractor: {
          title: "Website Code Extractor",
          description: "Eine einfache Chrome-Erweiterung, die HTML, CSS, JavaScript und Bilder von Websites extrahiert und sie mit JSzip in eine ZIP-Datei verpackt. Ideal für kleinere Websites, ermöglicht sie schnellen Zugriff auf Webcode, kann aber bei grösseren Websites, die stark von serverseitigem Code abhängen, an Grenzen stoßen."
        },
        applicare: {
          title: "AppliCare",
          description: "AppliCare ist eine moderne Bewerbungsmanagement-Plattform, die mit Spring Boot für das Backend, MongoDB Atlas zur Datenspeicherung und React (Vite) mit Ant Design für das Frontend entwickelt wurde. Sie bietet eine intuitive und effiziente Möglichkeit, Bewerbungen mit einer eleganten, responsiven Benutzeroberfläche zu organisieren und zu überwachen."
        },
        osint: {
          title: "OSINT Website",
          description: "Diese OSINT-Website ist ein Passionsprojekt, inspiriert von meinem Interesse an Open Source Intelligence und der sich ständig weiterentwickelnden Welt der digitalen Untersuchungen. Sie bietet interaktive Übungen zur Schärfung investigativer Fähigkeiten und zur Förderung kritischen Denkens."
        },
        chatapp: {
          title: "ChatApp",
          description: "ChatApp ist eine benutzerfreundliche Chat-Plattform, auf der Benutzer Konten erstellen und sich in verschiedenen Chaträumen mit anderen verbinden können. Mit Spring Boot entwickelt und von MongoDB für effiziente Datenspeicherung unterstützt, bietet ChatApp ein nahtloses Erlebnis für Echtzeitkommunikation."
        },
        vmDetector: {
          title: "Virtual Machine Detector",
          description: "Dies ist ein Tool, das erkennt, ob eine Maschine eine virtuelle Maschine ist."
        },
        viewCounter: {
          title: "View Counter",
          description: "Dies ist eine einfache Besucherzähler-Anwendung, die zählt, wie oft eine Seite aufgerufen wurde. Sie wurde mit Spring Boot und Redis entwickelt."
        },
        dockerService: {
          title: "Docker Service Deployment",
          description: "Dieses Docker Compose-Projekt implementiert MediaWiki, Nextcloud, und Gogs, enfocándose en el trabajo en equipo, la containerización y la documentación. Entwickelt mit Benicio Von Felten."
        },
        phishing: {
          title: "Phishing Website Tutorial",
          description: "Dies ist ein Tutorial zur Erstellung einer Phishing-Website. Es wurde mit HTML, CSS und JavaScript erstellt."
        },
        otw: {
          title: "OverTheWire Guide",
          description: "Dies ist ein Leitfaden zur Lösung der OverTheWire Wargames."
        },
        sola: {
          title: "Sola",
          description: "Sola ist meine persönliche Website, die, auf der du dich gerade befindest. Sie wurde mit React, TypeScript und Tailwind CSS erstellt und ist darauf ausgelegt, meine Projekte, Fähigkeiten und Erfahrungen auf eine saubere und moderne Weise zu präsentieren."
        }
      }
    },
    skills: {
      title: "Fähigkeiten",
      backHome: "Zurück",
      groups: {
        frontend: "Frontend",
        backend: "Backend",
        tools: "Tools",
        other: "Sonstiges"
      }
    },
    notFound: {
      title: "404",
      subtitle: "Ups! Die gesuchte Seite wurde nicht gefunden.",
      backHome: "Zurück zur Startseite"
    },
    footer: {
      madeWith: "Erstellt mit",
      by: "von",
      rights: "Alle Rechte vorbehalten.",
      navigation: "Navigation",
      connect: "Verbinden",
      contact: "Kontakt",
      contactForm: "Kontaktformular"
    },
    about: {
      title: "Über Mich",
      backHome: "Zurück",
      intro: "Ich bin ein leidenschaftlicher Softwareentwickler mit Fokus auf innovative, leistungsstarke Webanwendungen. Derzeit absolviere ich meine Ausbildung in Informatik an der WISS in Zürich, wo ich technisches Fachwissen mit kreativem Problemlösen verbinde, um elegante Lösungen zu liefern, die die Erwartungen übertreffen.",
      hobbies: "Neben dem Programmieren bin ich aktiv in der Tech-Community involviert, erforsche kontinuierlich neue Technologien und trage zu bedeutenden Open-Source-Projekten bei.",
      philosophy: {
        title: "Mein Ansatz",
        clean: "Ich glaube, dass sauberer, wartbarer Code das Fundament nachhaltiger Softwareentwicklung ist. Jede Zeile, die ich schreibe, spiegelt mein Streben nach Exzellenz wider.",
        simplicity: "Komplexe Probleme verdienen elegante Lösungen. Ich strebe danach, das perfekte Gleichgewicht zwischen Funktionalität, Leistung und Benutzererfahrung zu finden.",
        learning: "Die Technologielandschaft entwickelt sich rasant weiter, und ich entwickle mich mit. Kontinuierliches Lernen und Anpassung sind wesentliche Bestandteile meiner beruflichen Identität."
      },
      interests: {
        title: "Leidenschaften & Interessen",
        nature: {
          title: "Alpine Erkundung",
          description: "Das Leben in der Schweiz bietet unglaublichen Zugang zur Natur. Ich wandere regelmäßig durch die Alpen und finde, dass die Kombination aus Herausforderung und natürlicher Schönheit sowohl mentale Klarheit als auch kreative Inspiration für meine technische Arbeit bietet."
        },
        tech: {
          title: "Open-Source-Beitrag",
          description: "Ich trage aktiv zu mehreren Open-Source-Projekten bei, wobei ich mich besonders auf Leistungsoptimierung und Verbesserungen der Barrierefreiheit konzentriere. Diese Gemeinschaftsbeteiligung hält mich an der Spitze der Entwicklung, während ich dem Ökosystem, das ich schätze, etwas zurückgebe."
        },
        learning: {
          title: "Technische Literatur",
          description: "Ich pflege eine kuratierte Sammlung technischer Bücher und nehme regelmäßig an Online-Kursen teil. Derzeit erforsche ich fortgeschrittene Muster in verteilten Systemen und funktionale Programmierparadigmen, die ich in meinen Projekten anwende."
        },
        workspace: {
          title: "Optimierte Umgebung",
          description: "Mein Arbeitsbereich ist sorgfältig gestaltet, um Produktivität und Kreativität zu maximieren. Ich verwende ein minimalistisches Dual-Monitor-Setup mit individueller mechanischer Tastatur und ergonomischen Lösungen, die lange, fokussierte Entwicklungssessions ermöglichen."
        }
      }
    },
    contact: {
      title: "Kontakt",
      description: "Haben Sie eine Frage oder möchten Sie zusammenarbeiten? Kontaktieren Sie mich!",
      backHome: "Zurück",
      nameLabel: "Name",
      namePlaceholder: "Ihr Name",
      emailLabel: "E-Mail",
      emailPlaceholder: "ihre.email@beispiel.com",
      messageLabel: "Nachricht",
      messagePlaceholder: "Ihre Nachricht hier...",
      send: "Nachricht senden",
      sending: "Wird gesendet...",
      successMessage: "Danke für Ihre Nachricht! Ich melde mich bald bei Ihnen.",
    },
    services: {
      title: "Dienstleistungen",
      subtitle: "Umfassende Softwareentwicklungsdienste, angepasst an Ihre Bedürfnisse.",
      backHome: "Zurück",
      pricing: "* Preise sind verhandelbar und werden auf Ihre spezifischen Bedürfnisse und den Projektumfang abgestimmt.",
      services: {
        fullstack: {
          title: "Full-Stack-Entwicklung",
          description: "Ganzheitliche Webentwicklung mit modernen Technologien.",
          features: [
            "Responsive Webanwendungen",
            "RESTful API-Entwicklung",
            "Datenbankdesign und -implementierung",
            "Leistungsoptimierung"
          ]
        },
        frontend: {
          title: "Frontend-Entwicklung",
          description: "Erstellung schöner und benutzerfreundlicher Oberflächen.",
          features: [
            "React development",
            "UI/UX-Implementierung",
            "Animation und Interaktivität",
            "Mobile-First-Design"
          ]
        },
        backend: {
          title: "Backend-Entwicklung",
          description: "Robuste und skalierbare Server-Lösungen.",
          features: [
            "API-Architektur",
            "Datenbankverwaltung",
            "Server-Optimierung",
            "Sicherheitsimplementierung"
          ]
        },
        consulting: {
          title: "Technische Beratung",
          description: "Expertenhilfe bei technischen Entscheidungen.",
          features: [
            "Architekturplanung",
            "Technologie-Stack-Auswahl",
            "Performance-Auditing",
            "Sicherheitsbewertung"
          ]
        }
      },
      customRequirements: {
        title: "Spezielle Anforderungen?",
        description: "Haben Sie ein bestimmtes Projekt im Sinn? Ich helfe Ihnen dabei, Ihre Vision Wirklichkeit werden zu lassen. Lassen Sie uns Ihre Anforderungen besprechen und eine passende Lösung entwickeln.",
        button: "Kontaktieren Sie mich"
      }
    },
  },
  es: {
    nav: {
      about: "Sobre mí",
      experience: "Experiencia",
      projects: "Proyectos",
      skills: "Habilidades",
      contact: "Contacto",
      services: "Servicios"
    },
    index: {
      greeting: "Hola, soy Yanis",
      description: "Soy un desarrollador de software de 16 años basado en Zúrich, Suiza, enfocado en crear experiencias digitales excepcionales.",
      contactMe: "Contáctame",
      viewProjects: "Ver proyectos"
    },
    experience: {
      title: "Experiencia",
      backHome: "Regresar",
      subtitle: "Mi trayectoria profesional y experiencias educativas que han formado mi experiencia técnica.",
      period: {
        present: "Presente",
        wiss: "Ago 2023 - Presente",
        sek: "2020 - 2023"
      },
      wiss: {
        role: "Estudiante - Informática",
        company: "WISS",
        location: "Zúrich, Suiza",
        description: "Actualmente soy estudiante en WISS, una escuela de informática, donde estoy inmerso en una educación integral en informática. Mis estudios abarcan una amplia gama de temas, incluyendo programación, análisis de sistemas, gestión de bases de datos, desarrollo de software y gestión de proyectos. Esta experiencia me está proporcionando una base amplia y sólida en el campo de la informática, preparándome para un futuro en ingeniería de software.",
        achievements: [
          "Desarrollo de aplicaciones web full-stack utilizando tecnologías modernas",
          "Colaboración en proyectos de equipo utilizando metodologías ágiles"
        ]
      },
      sek: {
        role: "Sek A",
        company: "Lachenzelg",
        location: "Zúrich, Suiza",
        description: "Adquirí conocimientos fundamentales para mi trayectoria técnica. Como proyecto final, creé un entorno en Unreal Engine.",
        achievements: [
          "Creación de un entorno 3D inmersivo usando Unreal Engine",
          "Desarrollo de fuertes habilidades de resolución de problemas y análisis",
          "Participación en proyectos y actividades enfocadas en MINT"
        ]
      }
    },
    projects: {
      title: "Proyectos",
      backHome: "Regresar",
      featured: "Proyectos Destacados",
      other: "Otros Proyectos",
      viewProject: "Ver Proyecto",
      viewGithub: "Ver Código",
      technologies: "Tecnologías utilizadas",
      list: {
        codeExtractor: {
          title: "Extractor de Código Web",
          description: "Una extensión simple de Chrome que extrae HTML, CSS, JavaScript e imágenes de sitios web y los empaqueta en un archivo zip con JSzip. Ideal para sitios pequeños, permite acceso rápido al código web, aunque puede tener limitaciones con sitios más grandes que dependen en gran medida de código del servidor."
        },
        applicare: {
          title: "AppliCare",
          description: "AppliCare es una plataforma moderna de gestión de solicitudes de empleo construida usando Spring Boot para el backend, MongoDB Atlas para almacenar datos, y React (Vite) con Ant Design para el frontend. Proporciona una forma intuitiva y eficiente de organizar y monitorear solicitudes de empleo con una interfaz elegante y responsiva."
        },
        osint: {
          title: "Sitio Web OSINT",
          description: "Este sitio web OSINT es un proyecto personal inspirado en mi interés en la Inteligencia de Fuentes Abiertas y el mundo en constante evolución de las investigaciones digitales. Presenta ejercicios interactivos diseñados para mejorar las habilidades investigativas y fomentar el pensamiento crítico."
        },
        chatapp: {
          title: "ChatApp",
          description: "ChatApp es una plataforma de chat fácil de usar donde los usuarios pueden crear cuentas y conectarse con otros en varias salas de chat. Construida con Spring Boot y respaldada por MongoDB para un almacenamiento eficiente de datos, ChatApp proporciona una experiencia fluida para la comunicación en tiempo real."
        },
        vmDetector: {
          title: "Detector de Máquinas Virtuales",
          description: "Esta es una herramienta que detecta si una máquina es una máquina virtual."
        },
        viewCounter: {
          title: "Contador de Vistas",
          description: "Esta es una aplicación simple de contador de vistas que cuenta el número de veces que se ha visto una página. Está construida con Spring Boot y redis."
        },
        dockerService: {
          title: "Despliegue de Servicios Docker",
          description: "Este proyecto Docker Compose implementa MediaWiki, Nextcloud, y Gogs, enfocándose en el trabajo en equipo, la containerización y la documentación. Desarrollado con Benicio Von Felten."
        },
        phishing: {
          title: "Tutorial de Sitio Web de Phishing",
          description: "Este es un tutorial sobre cómo crear un sitio web de phishing. Está construido con HTML, CSS y JavaScript."
        },
        otw: {
          title: "Guía OverTheWire",
          description: "Esta es una guía sobre cómo resolver los wargames de OverTheWire."
        },
        sola: {
          title: "Sola",
          description: "Sola es mi sitio web personal, la que estás viendo ahora mismo. Está construido con React, TypeScript y Tailwind CSS, y está diseñado para mostrar mis proyectos, habilidades y experiencia de una manera limpia y moderna."
        }
      }
    },
    skills: {
      title: "Habilidades",
      backHome: "Regresar",
      groups: {
        frontend: "Frontend",
        backend: "Backend",
        tools: "Herramientas",
        other: "Otros"
      }
    },
    notFound: {
      title: "404",
      subtitle: "¡Ups! La página que buscas no se puede encontrar.",
      backHome: "Regresar al inicio"
    },
    footer: {
      madeWith: "Hecho con",
      by: "por",
      rights: "Todos los derechos reservados.",
      navigation: "Navegación",
      connect: "Conectarse",
      contact: "Contacto",
      contactForm: "Formulario de contacto"
    },
    about: {
      title: "Sobre Mí",
      backHome: "Regresar",
      intro: "Soy un desarrollador de software apasionado con enfoque en la construcción de aplicaciones web innovadoras y de alto rendimiento. Actualmente cursando mis estudios en Informática en WISS en Zúrich, combino experiencia técnica con resolución creativa de problemas para ofrecer soluciones elegantes que superan las expectativas.",
      hobbies: "Más allá de la programación, estoy activamente involucrado en la comunidad tecnológica, explorando continuamente tecnologías emergentes y contribuyendo a proyectos de código abierto significativos.",
      philosophy: {
        title: "Mi Enfoque",
        clean: "Creo que el código limpio y mantenible es la base del desarrollo de software sostenible. Cada línea que escribo refleja mi compromiso con la excelencia.",
        simplicity: "Los problemas complejos merecen soluciones elegantes. Me esfuerzo por encontrar el equilibrio perfecto entre funcionalidad, rendimiento y experiencia de usuario.",
        learning: "El panorama tecnológico evoluciona rápidamente, y yo evoluciono con él. El aprendizaje continuo y la adaptación son componentes esenciales de mi identidad profesional."
      },
      interests: {
        title: "Intereses & Hobbies",
        nature: {
          title: "Explorador de la Naturaleza",
          description: "Encuentro paz y inspiración en la naturaleza. Ya sea que esté caminando por los Alpes suizos o descubriendo senderos ocultos, cada viaje trae nuevas perspectivas e ideas."
        },
        tech: {
          title: "Entusiasta de la Tecnología",
          description: "Más allá del trabajo, estoy entusiasmado por explorar nuevas tecnologías y contribuir a proyectos de código abierto. La escena tecnológica en constante evolución me mantiene curioso y comprometido."
        },
        learning: {
          title: "Aprendizaje Continuo",
          description: "Creo en el aprendizaje continuo. Desde libros técnicos hasta cursos en línea, siempre busco expandir mis conocimientos y habilidades."
        },
        workspace: {
          title: "Espacio Creativo",
          description: "Mi espacio de trabajo es donde las ideas cobran vida. Con una configuración minimalista y las herramientas adecuadas, creo un entorno que fomenta la productividad y la creatividad."
        }
      }
    },
    contact: {
      title: "Contacto",
      description: "¿Tienes una pregunta o quieres trabajar juntos? ¡No dudes en contactarme!",
      backHome: "Regresar",
      nameLabel: "Nombre",
      namePlaceholder: "Tu nombre",
      emailLabel: "Correo electrónico",
      emailPlaceholder: "tu.email@ejemplo.com",
      messageLabel: "Mensaje",
      messagePlaceholder: "Tu mensaje aquí...",
      send: "Enviar mensaje",
      sending: "Enviando...",
      successMessage: "¡Gracias por tu mensaje! Me pondré en contacto contigo pronto.",
    },
    services: {
      title: "Servicios",
      subtitle: "Servicios integrales de desarrollo de software adaptados a sus necesidades, entregados con experiencia y precisión.",
      backHome: "Regresar",
      pricing: "* Precios son negociables y se ajustarán a sus necesidades específicas y al alcance del proyecto.",
      services: {
        fullstack: {
          title: "Full Stack Development",
          description: "End-to-end web application development using modern technologies like React, Spring Boot, and MongoDB.",
          features: [
            "Responsive web applications",
            "RESTful API development",
            "Database design and implementation",
            "Performance optimization"
          ]
        },
        frontend: {
          title: "Frontend Development",
          description: "Creating beautiful, responsive, and user-friendly interfaces with modern frameworks and design systems.",
          features: [
            "React development",
            "UI/UX implementation",
            "Animation and interactivity",
            "Mobile-first design"
          ]
        },
        backend: {
          title: "Backend Development",
          description: "Robust and scalable server-side solutions.",
          features: [
            "API architecture",
            "Database management",
            "Server optimization",
            "Security implementation"
          ]
        },
        consulting: {
          title: "Technical Consulting",
          description: "Expert guidance for your technical decisions.",
          features: [
            "Architecture planning",
            "Technology stack selection",
            "Performance auditing",
            "Security assessment"
          ]
        }
      },
      customRequirements: {
        title: "¿Tienes requisitos personalizados?",
        description: "¿Tienes un proyecto específico en mente? Te puedo ayudar a hacer tu visión realidad. Hagamos una reunión para discutir tus requisitos y crear una solución personalizada para tus necesidades.",
        button: "Contáctame"
      }
    },
  },
  ja: {
    nav: {
      about: "私について",
      experience: "経験",
      projects: "プロジェクト",
      skills: "スキル",
      contact: "お問い合わせ",
      services: "サービス"
    },
    index: {
      greeting: "こんにちは、私は Yanis ",
      description: "私はスイスのチューリッヒ出身の16歳のソフトウェア開発者で、優れたデジタル体験の創造に取り組んでいます。",
      contactMe: "お問い合わせ",
      viewProjects: "プロジェクトを見る"
    },
    experience: {
      title: "経験",
      backHome: "ホームに戻る",
      subtitle: "私の技術的専門知識を形成してきた職業経験と教育経験です。",
      period: {
        present: "現在",
        wiss: "2023年8月 - 現在",
        sek: "2020年 - 2023年"
      },
      wiss: {
        role: "学生 - コンピュータサイエンス",
        company: "WISS",
        location: "スイス、チューリッヒ",
        description: "現在、WISSというコンピュータサイエンス学校で包括的な情報技術教育を受けています。プログラミング、システム分析、データベース管理、ソフトウェア開発、プロジェクト管理など、幅広い分野を学んでいます。この経験は、ソフトウェアエンジニアリングの将来に向けて、広範な基盤を提供しています。",
        achievements: [
          "最新技術を使用したフルスタックWebアプリケーションの開発",
          "アジャイル手法を用いたチームプロジェクトでの協働",
        ]
      },
      sek: {
        role: "Sek A",
        company: "Lachenzelg",
        location: "スイス、チューリッヒ",
        description: "技術的な道のりの基礎知識を習得。最終プロジェクトとしてUnreal Engineの環境を作成しました。",
        achievements: [
          "Unreal Engineを使用した没入型3D環境の作成",
          "強力な問題解決力と分析スキルの開発",
          "MINT重点プロジェクトや活動への参加"
        ]
      }
    },
    projects: {
      title: "プロジェクト",
      backHome: "ホームに戻る",
      featured: "主要プロジェクト",
      other: "その他のプロジェクト",
      viewProject: "プロジェクトを見る",
      viewGithub: "コードを見る",
      technologies: "使用技術",
      list: {
        codeExtractor: {
          title: "ウェブサイトコード抽出ツール",
          description: "ウェブサイトからHTML、CSS、JavaScript、画像を抽出し、JSzipでZIPファイルにパッケージ化するシンプルなChrome拡張機能です。小規模なサイトに最適で、ウェブコードに素早くアクセスできますが、サーバーサイドコードに大きく依存する大規模なサイトでは制限がある場合があります。"
        },
        applicare: {
          title: "AppliCare",
          description: "AppliCareは、バックエンドにSpring Boot、データストレージにMongoDB Atlas、フロントエンドにReact（Vite）とAnt Designを使用して構築された最新の求職管理プラットフォームです。洗練されたレスポンシブなインターフェースで、求職活動を直感的かつ効率的に整理・監視する方法を提供します。"
        },
        osint: {
          title: "OSINT ウェブサイト",
          description: "このOSINTウェブサイトは、オープンソースインテリジェンスと不断に進化するデジタル調査の世界への関心から生まれたプロジェクトです。調査スキルを磨き、批判的思考を促す対話型の演習を提供しています。"
        },
        chatapp: {
          title: "聊天应用",
          description: "ChatAppは、ユーザーがアカウントを作成し、様々なチャットルームで他のユーザーとつながることができるユーザーフレンドリーなチャットプラットフォームです。Spring Bootで構築され、MongoDBによる効率的なデータストレージを備え、リアルタイムコミュニケーションのためのシームレスな体験を提供します。"
        },
        vmDetector: {
          title: "仮想マシン検出ツール",
          description: "マシンが仮想マシンであるかどうかを検出するツールです。"
        },
        viewCounter: {
          title: "ビューカウンター",
          description: "ページの閲覧回数をカウントするシンプルなビューカウンターアプリケーションです。Spring BootとRedisで構築されています。"
        },
        dockerService: {
          title: "Dockerサービスデプロイメント",
          description: "このDocker Composeプロジェクトは、MediaWiki、Nextcloud、Gogsをデプロイし、チームワーク、コンテナ化、ドキュメンテーションに焦点を当てています。Benicio Von Feltenと共同開発。"
        },
        phishing: {
          title: "フィッシングウェブサイトチュートリアル",
          description: "これは、フィッシングウェブサイトの作成方法に関するチュートリアルです。HTML、CSS、JavaScriptで構築されています。"
        },
        otw: {
          title: "OverTheWireガイド",
          description: "OverTheWireウォーゲームの解決方法に関するガイドです。"
        },
        sola: {
          title: "Sola",
          description: "Solaは私の個人ウェブサイトで、現在ご覧のものです。React、TypeScript、Tailwind CSSで作成され、プロジェクト、スキル、経験をクリーンでモダンな方法で表示することを目的としています。"
        }
      }
    },
    skills: {
      title: "スキル",
      backHome: "ホームに戻る",
      groups: {
        frontend: "フロントエンド",
        backend: "バックエンド",
        tools: "ツール",
        other: "その他"
      }
    },
    notFound: {
      title: "404",
      subtitle: "お探しのページが見つかりませんでした。",
      backHome: "ホームに戻る"
    },
    footer: {
      madeWith: "制作",
      by: "作成者",
      rights: "全著作権所有。",
      navigation: "ナビゲーション",
      connect: "接続",
      contact: "連絡先",
      contactForm: "フォームを介して"
    },
    about: {
      title: "私について",
      backHome: "ホームに戻る",
      intro: "私は革新的で高性能なウェブアプリケーションの開発に焦点を当てた情熱的なソフトウェア開発者です。現在、チューリッヒのWISSで情報科学を学び、技術的な専門知識と創造的な問題解決を組み合わせて、期待を超える優れたソリューションを提供しています。",
      hobbies: "プログラミング以外では、テクノロジーコミュニティに積極的に参加し、常に新しい技術を探求し、意義のあるオープンソースプロジェクトに貢献しています。",
      philosophy: {
        title: "開発アプローチ",
        clean: "クリーンで保守可能なコードは持続可能なソフトウェア開発の基盤だと信じています。私が書く一行一行が卓越性への取り組みを反映しています。",
        simplicity: "複雑な問題には洗練されたソリューションが必要です。機能性、パフォーマンス、ユーザー体験の間の完璧なバランスを見つけることを目指しています。",
        learning: "テクノロジーの風景は急速に進化し、私もそれに合わせて進化します。継続的な学習と適応は私のプロフェッショナルアイデンティティの不可欠な要素です。"
      },
      interests: {
        title: "情熱と追求",
        nature: {
          title: "アルプス探検",
          description: "スイスに住むことで自然への素晴らしいアクセスが可能です。定期的にアルプスをハイキングし、挑戦と自然の美しさの組み合わせが、技術的な仕事のための精神的な明晰さと創造的なインスピレーションの両方を提供していると感じています。"
        },
        tech: {
          title: "オープンソース貢献",
          description: "複数のオープンソースプロジェクトに積極的に貢献し、特にパフォーマンスの最適化とアクセシビリティの向上に焦点を当てています。このコミュニティへの参加により、最先端の技術を維持しながら、私が価値を置くエコシステムに還元しています。"
        },
        learning: {
          title: "技術文献",
          description: "厳選された技術書のコレクションを維持し、定期的にオンラインコースに参加しています。現在、分散システムの高度なパターンと、プロジェクトに応用している関数型プログラミングのパラダイムを探求しています。"
        },
        workspace: {
          title: "最適化された環境",
          description: "私の作業環境は生産性と創造性を最大化するために慎重に設計されています。カスタムメカニカルキーボードと人間工学に基づいたソリューションを備えたミニマリストなデュアルモニターセットアップを使用し、長時間の集中した開発セッションを可能にしています。"
        }
      }
    },
    contact: {
      title: "お問い合わせ",
      description: "ご質問や協力のご提案などございましたら、お気軽にご連絡ください。",
      backHome: "ホームに戻る",
      nameLabel: "お名前",
      namePlaceholder: "あなたのお名前",
      emailLabel: "メールアドレス",
      emailPlaceholder: "your.email@example.com",
      messageLabel: "メッセージ",
      messagePlaceholder: "メッセージを入力してください...",
      send: "送信",
      sending: "送信中...",
      successMessage: "メッセージをお送りいただき、ありがとうございます。近日中にご連絡させていただきます。",
    },
    services: {
      title: "サービス",
      subtitle: "お客様のニーズに合わせた包括的なソフトウェア開発サービス。",
      backHome: "ホームに戻る",
      pricing: "* 料金は交渉可能で、お客様の具体的なニーズとプロジェクトの規模に応じて調整します。",
      services: {
        fullstack: {
          title: "フルスタック開発",
          description: "最新技術を使用したエンドツーエンドのWeb開発。",
          features: [
            "レスポンシブWebアプリケーション",
            "RESTful API開発",
            "データベース設計と実装",
            "パフォーマンス最適化"
          ]
        },
        frontend: {
          title: "フロントエンド開発",
          description: "美しく使いやすいインターフェースの作成。",
          features: [
            "React開発",
            "UI/UX実装",
            "アニメーションと対話",
            "モバイルファースト設計"
          ]
        },
        backend: {
          title: "バックエンド開発",
          description: "堅牢でスケーラブルなサーバーサイドソリューション。",
          features: [
            "API設計",
            "データベース管理",
            "サーバー最適化",
            "セキュリティ実装"
          ]
        },
        consulting: {
          title: "技術コンサルティング",
          description: "技術的な意思決定のための専門家によるガイダンス。",
          features: [
            "アーキテクチャ計画",
            "技術スタックの選定",
            "パフォーマンス監査",
            "セキュリティ評価"
          ]
        }
      },
      customRequirements: {
        title: "カスタム要件をお持ちですか？",
        description: "具体的なプロジェクトをお考えですか？あなたのビジョンを実現するお手伝いをさせていただきます。ご要件についてご相談させていただき、ニーズに合わせたソリューションを作成いたしましょう。",
        button: "お問い合わせ"
      }
    }
  },
  cn: {
    nav: {
      about: "关于我",
      experience: "经验",
      projects: "项目",
      skills: "技能",
      contact: "联系",
      services: "服务"
    },
    index: {
      greeting: "你好，我是 Yanis",
      description: "我是一位16岁的软件开发者，来自瑞士苏黎世，致力于创造卓越的数字体验。",
      contactMe: "联系我",
      viewProjects: "查看项目"
    },
    experience: {
      title: "经验",
      backHome: "返回首页",
      subtitle: "塑造我技术专长的职业历程和教育经历。",
      period: {
        present: "至今",
        wiss: "2023年8月 - 至今",
        sek: "2020年 - 2023年"
      },
      wiss: {
        role: "学生 - 计算机科学",
        company: "WISS",
        location: "瑞士，苏黎世",
        description: "我目前在WISS计算机科学学校就读，接受全面的计算机科学教育。我的学习涵盖广泛的领域，包括编程、系统分析、数据库管理、软件开发和项目管理。这些经验为我在计算机科学领域打下了坚实的基础，为我未来在软件工程领域的发展做好准备。",
        achievements: [
          "使用现代技术开发全栈Web应用",
          "使用敏捷方法论参与团队项目协作"
        ]
      },
      sek: {
        role: "Sek A",
        company: "Lachenzelg",
        location: "瑞士，苏黎世",
        description: "获得了技术发展道路上的基础知识。作为最终项目，我创建了一个虚幻引擎环境。",
        achievements: [
          "使用虚幻引擎创建沉浸式3D环境",
          "培养了强大的问题解决和分析能力",
          "参与MINT相关项目和活动"
        ]
      }
    },
    projects: {
      title: "项目",
      backHome: "返回首页",
      featured: "精选项目",
      other: "其他项目",
      viewProject: "查看项目",
      viewGithub: "查看代码",
      technologies: "使用的技术",
      list: {
        codeExtractor: {
          title: "网站代码提取器",
          description: "一个简单的Chrome扩展程序，可以从网站提取HTML、CSS、JavaScript和图片，并使用JSzip打包成zip文件。适用于小型网站，可以快速访问网页代码，但可能在严重依赖服务器端代码的大型网站上受到限制。"
        },
        applicare: {
          title: "AppliCare",
          description: "AppliCare是一个现代求职申请管理平台，后端使用Spring Boot，数据存储使用MongoDB Atlas，前端使用React（Vite）和Ant Design。它提供了一个直观且高效的方式来组织和监控求职申请，具有时尚的响应式界面。"
        },
        osint: {
          title: "OSINT网站",
          description: "这个OSINT网站是一个源于我对开源情报和不断发展的数字调查世界兴趣的项目。它提供互动练习，旨在提升调查技能并鼓励批判性思维。"
        },
        chatapp: {
          title: "聊天应用",
          description: "ChatApp是一个用户友好的聊天平台，用户可以创建账户并在各种聊天室中与他人联系。使用Spring Boot构建，由MongoDB提供高效的数据存储，为实时通信提供无缝体验。"
        },
        vmDetector: {
          title: "虚拟机检测器",
          description: "这是一个检测机器是否为虚拟机的工具。"
        },
        viewCounter: {
          title: "访问计数器",
          description: "这是一个简单的访问计数器应用程序，用于统计页面被查看的次数。使用Spring Boot和Redis构建。"
        },
        dockerService: {
          title: "Docker服务部署",
          description: "这个Docker Compose项目部署了MediaWiki、Nextcloud和Gogs，注重团队协作、容器化和文档编写。与Benicio Von Felten共同开发。"
        },
        phishing: {
          title: "钓鱼网站教程",
          description: "这是一个关于如何创建钓鱼网站的教程。使用HTML、CSS和JavaScript构建。"
        },
        otw: {
          title: "OverTheWire指南",
          description: "这是一个关于如何解决OverTheWire战争游戏的指南。"
        },
        sola: {
          title: "Sola",
          description: "Sola是我的个人网站，您现在正在查看。使用React、TypeScript和Tailwind CSS构建，旨在以干净且现代的方式展示项目、技能和经验。"
        }
      }
    },
    skills: {
      title: "技能",
      backHome: "返回首页",
      groups: {
        frontend: "前端",
        backend: "后端",
        tools: "工具",
        other: "其他"
      }
    },
    notFound: {
      title: "404",
      subtitle: "抱歉！您要找的页面不存在。",
      backHome: "返回首页"
    },
    footer: {
      madeWith: "由",
      by: "制作",
      rights: "保留所有权利。",
      navigation: "导航",
      connect: "连接",
      contact: "联系",
      contactForm: "通过表单"
    },
    about: {
      title: "关于我",
      backHome: "返回首页",
      intro: "我是一位专注于开发创新、高性能Web应用的热情软件开发者。目前在苏黎世WISS学习计算机科学，将技术专长与创造性问题解决相结合，提供超越期望的优雅解决方案。",
      hobbies: "除编程外，我积极参与技术社区，不断探索新兴技术，并为有意义的开源项目做出贡献。",
      philosophy: {
        title: "我的方法",
        clean: "我相信干净、可维护的代码是可持续软件开发的基础。我所写的每一行代码都体现了我对卓越的承诺。",
        simplicity: "复杂问题需要优雅的解决方案。我努力在功能性、性能和用户体验之间找到完美平衡。",
        learning: "技术领域快速发展，我也与之共同进化。持续学习和适应是我职业身份的重要组成部分。"
      },
      interests: {
        title: "热情与活动",
        nature: {
          title: "自然探索者",
          description: "我在大自然中寻找平静与灵感。无论是在瑞士阿尔卑斯山徒步，还是发现隐藏的小径，每次旅程都带来新的视角和想法。"
        },
        tech: {
          title: "技术爱好者",
          description: "在工作之外，我热衷于探索新技术并为开源项目做贡献。不断发展的技术领域让我保持好奇和投入。"
        },
        learning: {
          title: "技术文献",
          description: "我坚信终身学习的理念。从技术书籍到在线课程，我始终在寻求扩展知识和技能的机会。"
        },
        workspace: {
          title: "创意空间",
          description: "我的工作空间是想法成真的地方。通过极简的设置和合适的工具，我创造了一个促进生产力和创造力的环境。"
        }
      }
    },
    contact: {
      title: "联系我",
      description: "有问题或想一起合作？随时联系我！",
      backHome: "返回首页",
      nameLabel: "姓名",
      namePlaceholder: "您的姓名",
      emailLabel: "电子邮件",
      emailPlaceholder: "your.email@example.com",
      messageLabel: "消息",
      messagePlaceholder: "在这里输入您的消息...",
      send: "发送消息",
      sending: "发送中...",
      successMessage: "感谢您的消息！我会尽快回复您。",
    },
    services: {
      title: "服务",
      subtitle: "根据您的需求定制的全面软件开发服务。",
      backHome: "返回首页",
      pricing: "* 价格可协商，将根据您的具体需求和项目范围进行调整。",
      services: {
        fullstack: {
          title: "全栈开发",
          description: "使用现代技术进行端到端的Web开发。",
          features: [
            "响应式Web应用",
            "RESTful API开发",
            "数据库设计和实现",
            "性能优化"
          ]
        },
        frontend: {
          title: "前端开发",
          description: "创建美观、响应式和用户友好的界面。",
          features: [
            "React开发",
            "UI/UX实现",
            "动画和交互",
            "移动优先设计"
          ]
        },
        backend: {
          title: "后端开发",
          description: "强大且可扩展的服务器端解决方案。",
          features: [
            "API设计",
            "数据库管理",
            "服务器优化",
            "安全实现"
          ]
        },
        consulting: {
          title: "技术咨询",
          description: "为您的技术决策提供专业指导。",
          features: [
            "架构规划",
            "技术栈选择",
            "性能审计",
            "安全评估"
          ]
        }
      },
      customRequirements: {
        title: "有特定需求？",
        description: "有特定项目想法？我可以帮助您实现愿景。让我们讨论您的需求，为您创建量身定制的解决方案。",
        button: "联系我"
      }
    }
  }
}

export type Language = keyof typeof translations;