/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */
import type { Translation } from "./en";

export const de = {
  seo: {
    home: {
      title: "Yanis Sebastian Zürcher • Softwareentwickler in Zürich",
      description:
        "Softwareentwickler aus Zürich – mit Fokus auf skalierbare, schnelle und durchdachte Systeme in Infrastruktur, Identitätsmanagement und Benutzeroberflächen.",
    },
    about: {
      title: "Über mich • Yanis Sebastian Zürcher",
      description:
        "Mehr über meinen Hintergrund, meine Werte und die Werkzeuge, mit denen ich schnelle, saubere und minimalistische Software baue.",
    },
    projects: {
      title: "Projekte • Yanis Sebastian Zürcher",
      description:
        "Eine kuratierte Auswahl meiner Projekte – Full‑Stack, Frontend, Backend und Tools.",
    },
    skills: {
      title: "Fähigkeiten • Yanis Sebastian Zürcher",
      description:
        "Technologien und Tools – von React und TypeScript bis Spring Boot und Docker.",
    },
    experience: {
      title: "Erfahrung • Yanis Sebastian Zürcher",
      description:
        "Zeitleiste von Ausbildung und Rollen mit Verantwortlichkeiten, Erfolgen und Technologien.",
    },
    contact: {
      title: "Kontakt • Yanis Sebastian Zürcher",
      description: "Kontakt für Projekte, Zusammenarbeit oder Möglichkeiten.",
    },
    services: {
      title: "Dienstleistungen • Yanis Sebastian Zürcher",
      description:
        "Full‑Stack‑, Frontend‑, Backend‑Entwicklung sowie technologische Beratung nach Bedarf.",
    },
    privacy: {
      title: "Datenschutzerklärung • sola.ysz.life",
      description:
        "Datenschutzhinweise zu sola.ysz.life – Hosting, Analytics, Auftragsverarbeiter und Ihre Rechte.",
    },
    notFound: {
      title: "404 • Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden.",
    },
  },
  certifications: {
    title: "Zertifikate",
    empty: "Noch keine Zertifikate veröffentlicht.",
    verify: "Prüfen",
    expired: "Abgelaufen",
    credentialId: "Zertifikats-ID",
    expires: "Gültig bis",
    viewPdf: "PDF anzeigen",
  },
  common: {
    home: "Startseite",
    overview: "Überblick",
    menu: {
      themes: "Designs",
      customThemes: "Eigene Designs",
      background: "Hintergrund",
    },
    backgroundHints: {
      prefersDarkTheme: "Am besten auf dunklen Designs",
    },
    none: "Keiner",
    search: "Suche",
    command: {
      placeholder: "Befehl eingeben oder suchen...",
      noResults: "Keine Ergebnisse gefunden.",
      groups: {
        navigation: "Navigation",
        theme: "Design",
        language: "Sprache",
        background: "Hintergrund",
      },
      footer: {
        navigate: "Navigieren",
        select: "Auswählen",
        close: "Schließen",
      },
    },
    techStack: "Technologie-Stack",
    links: "Links",
    chromeStore: "Chrome Web Store",
    visitSite: "Website besuchen",
    sourceCode: "Quellcode",
    demo: "Demo",
    moreProjects: "Weitere Projekte",
    moreOnGithub: "Mehr auf GitHub",
    view: "Ansehen",
    update: {
      title: "Kleines Update",
      description: "Seite neu laden – dann siehst du, was neu ist.",
      later: "Später",
      refresh: "Aktualisieren",
      dismiss: "Schließen",
    },
  },
  feed: {
    recentActivity: "Aktuelle Aktivitäten",
    lastEvents: "Letzte 20 Aktivitäten",
    noActivity: "Keine aktuellen Aktivitäten",
    checkBack: "Schauen Sie später noch einmal vorbei",
    moreSuffix: "mehr",
  },
  hire: {
    hirebtn: "Jetzt anfragen",
  },
  nav: {
    about: "Über mich",
    experience: "Erfahrung",
    projects: "Projekte",
    skills: "Fähigkeiten",
    contact: "Kontakt",
    services: "Dienstleistungen",
  },
  i18n: {
    detectedNote: "Erkannt: {lang}",
  },
  index: {
    greeting: "Hallo, ich bin ",
    description1: "18-jähriger Softwareentwickler aus Zürich, Schweiz.",
    description2:
      "Ich entwickle skalierbare, schnelle und durchdachte Systeme.",
    description3:
      "Tätig in Infrastruktur, Identitätsmanagement und Benutzeroberflächen.",
    description4: "Fokus auf Struktur, Klarheit und Präzision.",
    currentlyWorkingOn: "Aktuell arbeite ich an",
    contactMe: "Kontakt aufnehmen",
    viewProjects: "Projekte ansehen",
  },
  experience: {
    title: "Erfahrung",
    subtitle:
      "Mein beruflicher Werdegang und meine Ausbildung, die meine technische Expertise geprägt haben.",
    sections: {
      work: "Beruf",
      education: "Ausbildung",
    },
    chips: {
      onsite: "Vor Ort",
      remote: "Remote",
      hybrid: "Hybrid",
      internship: "Praktikum",
      full_time: "Vollzeit",
      part_time: "Teilzeit",
      contract: "Vertrag",
      freelance: "Freelance",
    },
    period: {
      nadlo: "Mai 2026 - Heute",
      gz: "Aug 2025 - Mär 2026",
      freelance: "Jul 2025 - Heute",
      wiss: "Aug 2023 - Heute",
      sek: "2020 - 2023",
    },
    nadlo: {
      role: "Full Stack Softwareentwickler",
      company: "nadlo",
      location: "Baden, Schweiz",
      description:
        "Entwicklung produktiver Webanwendungen über den gesamten Stack – von responsiven, zugänglichen Oberflächen bis zu den APIs und Datenmodellen dahinter. Fokus auf Typsicherheit, Performance und schnelles Ausliefern.",
      achievements: [
        "Full-Stack-Features mit Next.js, React und TypeScript umgesetzt, gestylt mit Tailwind CSS.",
        "Backend-Services und REST-APIs mit NestJS entwickelt, gestützt auf Supabase (Postgres, Auth und Storage).",
        "Dienste mit Docker containerisiert und Build-, Test- und Deploy-Pipelines mit GitHub Actions automatisiert.",
        "Features von der Idee bis zum Deployment verantwortet – mit Fokus auf wartbaren, typsicheren und performanten Code.",
      ],
    },
    freelance: {
      role: "Freelance Webentwickler",
      company: "Selbstständig",
      location: "Zürich, Schweiz",
      description:
        "Entwicklung moderner Weblösungen – von Landingpages bis zu Full‑Stack‑Features. Fokus auf saubere UX, Performance und wartbaren Code.",
      achievements: [
        "Projekte mit React, Next.js, TypeScript, Tailwind CSS umgesetzt.",
        "Backend‑Features mit Spring Boot und Java; Versionsverwaltung und Automatisierung mit Git.",
      ],
    },
    gz: {
      role: "IAM-Entwickler",
      company: "Gesundheitswelt Zollikerberg",
      location: "Zollikon, Schweiz",
      description:
        "Als Praktikant im Bereich IAM Engineering unterstütze ich die Wartung und Optimierung der IT-Infrastruktur mit Schwerpunkt auf der Automatisierung von Identity- und Access-Management-Prozessen. Das Unternehmen bietet Gesundheitsdienstleistungen für die Einwohner von Zollikon an.",
      achievements: [
        "Unterstützung bei der Automatisierung von Identity- und Access-Management (IAM)-Abläufen mit PowerShell und Python.",
        "Mitarbeit bei der Umsetzung interner Verbesserungen der IT-Infrastruktur.",
        "Beitrag zur Pflege von Active Directory und zur Benutzerverwaltung.",
      ],
    },
    wiss: {
      role: "Student - Informatik",
      company: "WISS",
      location: "Zürich, Schweiz",
      description:
        "Ich bin derzeit Student an der WISS, einer Informatikschule, wo ich eine umfassende Informatikausbildung absolviere. Mein Studium umfasst ein breites Spektrum an Themen, darunter Programmierung, Systemanalyse, Datenbankmanagement, Softwareentwicklung und Projektmanagement. Diese Erfahrung verschafft mir eine breite und solide Grundlage im Bereich der Informatik, bereitet mich auf eine Zukunft in der Softwareentwicklung vor.",
      achievements: [
        "Entwicklung von Full-Stack-Webanwendungen mit modernen Technologien",
        "Zusammenarbeit an Teamprojekten mit agilen Methoden",
      ],
    },
    sek: {
      role: "Sek A",
      company: "Lachenzelg",
      location: "Zürich, Schweiz",
      description:
        "Erwarb grundlegendes Wissen für meinen technischen Werdegang. Als Abschlussprojekt erstellte ich eine Unreal Engine Umgebung.",
      achievements: [
        "Erstellung einer immersiven 3D-Umgebung mit Unreal Engine",
        "Entwicklung starker Problemlösungs- und Analysefähigkeiten",
        "Teilnahme an MINT-orientierten Projekten und Aktivitäten",
      ],
    },
  },
  projects: {
    title: "Projekte",
    other: "Weitere Projekte",
    otherInfo:
      "Nicht hervorgehobene Projekte: kleinere Tools, Experimente und Hilfsprogramme.",
    viewDetails: "Details ansehen",
    viewAll: "Alle Projekte ansehen",
    viewGithub: "Code ansehen",
    satoriAttribution:
      "Bild erstellt mit [Vercel Satori](https://og-playground.vercel.app/)",
    sortBy: "Sortieren nach",
    sortOptions: {
      priority: "Priorität",
      dateNewest: "Datum (neueste zuerst)",
      dateOldest: "Datum (älteste zuerst)",
      nameAsc: "Name (A–Z)",
      nameDesc: "Name (Z–A)",
    },
    selectSorting: "Sortierung wählen...",
    visitProject: "Projekt besuchen",
    list: {
      codeExtractor: {
        title: "Website Code Extractor",
        description:
          "Eine einfache Chrome-Erweiterung, die HTML, CSS, JavaScript und Bilder von Websites extrahiert und sie mit JSZip in eine ZIP-Datei verpackt. Ideal für kleinere Websites – bei grösseren Seiten, die stark von serverseitigem Code abhängen, stösst sie an Grenzen.",
      },
      applicare: {
        title: "AppliCare",
        description:
          "AppliCare ist eine moderne Bewerbungsmanagement-Plattform, die mit Spring Boot für das Backend, MongoDB Atlas zur Datenspeicherung und React (Vite) mit Ant Design für das Frontend entwickelt wurde. Sie bietet eine intuitive und effiziente Möglichkeit, Bewerbungen mit einer eleganten, responsiven Benutzeroberfläche zu organisieren und zu überwachen.",
      },
      osint: {
        title: "OSINT Website",
        description:
          "Diese OSINT-Website ist ein Passionsprojekt, inspiriert von meinem Interesse an Open Source Intelligence und der sich ständig weiterentwickelnden Welt der digitalen Untersuchungen. Sie bietet interaktive Übungen zur Schärfung investigativer Fähigkeiten und zur Förderung kritischen Denkens.",
      },
      chatapp: {
        title: "ChatApp",
        description:
          "ChatApp ist eine benutzerfreundliche Chat-Plattform, auf der Benutzer Konten erstellen und sich in verschiedenen Chaträumen mit anderen verbinden können. Mit Spring Boot entwickelt und von MongoDB für effiziente Datenspeicherung unterstützt, bietet ChatApp ein nahtloses Erlebnis für Echtzeitkommunikation.",
      },
      vmDetector: {
        title: "Virtual Machine Detector",
        description:
          "Ein Tool zur Erkennung, ob ein System in einer virtuellen Maschine läuft.",
      },
      viewCounter: {
        title: "View Counter",
        description:
          "Einfache Besucherzähler‑App, die Seitenaufrufe zählt. Entwickelt mit Spring Boot und Redis.",
      },
      dockerService: {
        title: "Docker Service Deployment",
        description:
          "Dieses Docker‑Compose‑Projekt stellt MediaWiki, Nextcloud und Gogs bereit und fokussiert Teamarbeit, Containerisierung und Dokumentation. Gemeinsam mit Benicio Von Felten entwickelt.",
      },
      phishing: {
        title: "Phishing Website Tutorial",
        description:
          "Dies ist ein Tutorial zur Erstellung einer Phishing-Website. Es wurde mit HTML, CSS und JavaScript erstellt.",
      },
      otw: {
        title: "OverTheWire Guide",
        description:
          "Dies ist ein Leitfaden zur Lösung der OverTheWire Wargames.",
      },
      sola: {
        title: "Sola",
        description:
          "Sola ist meine persönliche Website. Entwickelt mit React, TypeScript und Tailwind CSS, präsentiert sie meine Projekte, Fähigkeiten und Erfahrungen in einem klaren, modernen Design.",
      },
      kinoa: {
        title: "Kinoa",
        description:
          "Kinoa ist eine kostenlose Streaming-Website mit Next.js, shadcn/ui und Supabase. Kein Abo nötig — stöbere in Filmen und Serien, schaue mit Inline-Wiedergabe von Drittanbietern und lass das automatische Server-Failover den Rest erledigen.",
      },
      self: {
        title: "Self",
        description:
          "Self ist ein anpassbares Systeminformations-Tool für Windows, inspiriert von Neofetch und mit Python entwickelt. Es zeigt Systeminformationen zusammen mit Bild- oder ASCII-Art direkt im Terminal an. Mit Unterstützung für Block- und Braille-Darstellung, anpassbaren Designs und einem einfachen PowerShell-Installer bringt es eine saubere, Unix-ähnliche Ästhetik auf Windows.",
      },
      taco: {
        title: "Taco",
        description:
          "Ein produktionsreifes Template rund um Taco, den Hund meines Bruders — mit Next.js, TypeScript und Tailwind CSS. Enthält Lokalisierung mit automatischer Erkennung, ein Blog‑System und eine saubere, modulare Architektur für echte Projekte.",
      },
      thoughts: {
        title: "Thoughts",
        description:
          "Eine minimalistische persönliche Seite, auf der ich Reflexionen, Fragmente und Notizen teile. Inspiriert von der persönlichen Website von [Shu Ding](https://shud.in), gebaut mit Next.js, MDX und Tailwind. Enthält ein eigenes Gästebuch, in dem Besucher ihre Gedanken hinterlassen können.",
      },
      luma: {
        title: "Luma",
        description:
          "Eine Multi‑Modell‑KI‑Plattform, bei der du deine eigenen API‑Schlüssel mitbringst und mit den besten Modellen sprichst — Claude, GPT, Gemini, Grok und mehr — alles an einem Ort. Gebaut mit Next.js 16, dem Vercel AI SDK und Supabase.",
      },
    },
  },
  skills: {
    title: "Fähigkeiten",
    subtitle: "Technologien und Tools, mit denen ich regelmässig arbeite.",
    backHome: "Zurück zur Startseite",
    groups: {
      languages: "Sprachen",
      frontend: "Frontend",
      backend: "Backend",
      infrastructure: "Infrastruktur",
      security: "Sicherheit",
      tools: "Tools",
    },
  },
  notFound: {
    backHome: "Zurück zur Startseite",
  },
  footer: {
    atw: "Über diese Website",
    madeWith: "Erstellt mit",
    by: "von",
    rights: "Alle Rechte vorbehalten.",
    navigation: "Navigation",
    connect: "Vernetzen",
    contact: "Kontakt",
    contactForm: "Kontaktformular",
    privacy: "Datenschutzerklärung",
    legal: "Rechtliches",
  },
  about: {
    title: "Über mich",
    intro:
      "Ich bin Yanis Sebastian Zürcher, ein 18-jähriger Softwareentwickler aus Zürich, Schweiz. Ich studiere Informatik an der [WISS](https://www.wiss.ch), aber das meiste habe ich mir durch eigene Projekte beigebracht – nicht durch die Schule.",
    hobbies:
      "Ich konzentriere mich darauf, schnelle, saubere und minimalistische Webanwendungen zu entwickeln. Ob Full-Stack-Plattformen oder elegante Frontends – mir sind Klarheit, Performance und ein durchdachtes Nutzererlebnis wichtig. Ich arbeite ständig an meinen eigenen Ideen und entwickle Dinge, die sich genauso gut anfühlen, wie sie funktionieren.",
    philosophy: {
      title: "Mein Ansatz",
      clean:
        "Ich glaube, dass sauberer, wartbarer Code das Fundament nachhaltiger Softwareentwicklung ist. Jede Zeile, die ich schreibe, spiegelt mein Streben nach Exzellenz wider.",
      simplicity:
        "Komplexe Probleme verdienen elegante Lösungen. Ich strebe danach, das perfekte Gleichgewicht zwischen Funktionalität, Leistung und Benutzererfahrung zu finden.",
      learning:
        "Die Technologielandschaft entwickelt sich rasant weiter, und ich entwickle mich mit. Kontinuierliches Lernen und Anpassung sind wesentliche Bestandteile meiner beruflichen Identität.",
    },
    interests: {
      title: "Leidenschaften & Interessen",
      nature: {
        title: "Alpine Erkundung",
        description:
          "Das Leben in der Schweiz bietet unglaublichen Zugang zur Natur. Ich wandere regelmässig durch die Alpen und finde, dass die Kombination aus Herausforderung und natürlicher Schönheit sowohl mentale Klarheit als auch kreative Inspiration für meine technische Arbeit bietet.",
      },
      tech: {
        title: "Open‑Source‑Engagement",
        description:
          "Ich engagiere mich aktiv in mehreren Open‑Source‑Projekten – mit Fokus auf Leistungsoptimierung und Barrierefreiheit. Dieses Engagement hält mich technisch auf dem neuesten Stand und ermöglicht es mir, dem Ökosystem, das ich schätze, etwas zurückzugeben.",
      },
      learning: {
        title: "Technische Literatur",
        description:
          "Ich pflege eine kuratierte Sammlung technischer Bücher und nehme regelmässig an Online‑Kursen teil. Derzeit erforsche ich fortgeschrittene Muster in verteilten Systemen und funktionale Programmierparadigmen, die ich in meinen Projekten anwende.",
      },
      workspace: {
        title: "Optimierte Umgebung",
        description:
          "Mein Arbeitsbereich ist sorgfältig gestaltet, um Produktivität und Kreativität zu maximieren. Ich verwende ein minimalistisches Dual-Monitor-Setup mit individueller mechanischer Tastatur und ergonomischen Lösungen, die lange, fokussierte Entwicklungssessions ermöglichen.",
      },
    },
    testimonials: {
      title: "Kundenstimmen",
      link: "Mit mir arbeiten",
      viewMore: "Mehr anzeigen",
      visitWebsite: "Website besuchen",
      viewLinkedIn: "LinkedIn ansehen",
      modalTitle: "Referenz",
      modalDescription: "Vollständige Referenz von {author}",
    },
    certifications: {
      link: "Zertifikate",
    },
    resume: {
      title: "Vollständigen Lebenslauf anfordern",
      description:
        "Die öffentliche Version meines Lebenslaufs hat einige sensible Informationen zensiert. Wenn Sie die vollständige Version benötigen, [kontaktieren Sie mich](https://sola.ysz.life/contact) bitte oder senden Sie eine E-Mail an [yanis.sebastian.zuercher@gmail.com](mailto:yanis.sebastian.zuercher@gmail.com).",
      viewButton: "Zensierte Version ansehen",
      downloadButton: "Zensierte Version herunterladen",
      languageLabel: "Sprache:",
      buttonLabel: "Lebenslauf",
    },
    github: {
      title: "GitHub-Aktivität",
      overview: "Übersicht",
    },
    philosophyLabels: {
      clean: "Sauberer Code",
      simplicity: "Einfachheit",
      learning: "Kontinuierliches Lernen",
    },
  },
  contact: {
    title: "Kontakt",
    description:
      "Haben Sie eine Frage oder möchten Sie zusammenarbeiten? Kontaktieren Sie mich!",
    formTitle: "Nachricht senden",
    reachOut: "Oder erreiche mich direkt",
    expectations: {
      title: "Was dich erwartet",
      items: [
        "Eine Antwort innerhalb von ein, zwei Tagen",
        "Ein klares, unverbindliches Gespräch über deine Idee",
        "Ehrliche Einschätzung zu Umfang, Zeitplan und Passung",
        "Deine Daten bleiben privat – einfach eine direkte Antwort",
      ],
    },
    nameLabel: "Name",
    namePlaceholder: "Ihr Name",
    emailLabel: "E-Mail",
    emailPlaceholder: "ihre.email@beispiel.com",
    messageLabel: "Nachricht",
    messagePlaceholder: "Ihre Nachricht hier...",
    send: "Nachricht senden",
    sending: "Wird gesendet...",
    successMessage: "Danke für Ihre Nachricht! Ich melde mich bald bei Ihnen.",
    errorMessage: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
    subjectLabel: "Betreff",
    subjectPlaceholder: "Betreff eingeben",
    attachmentPlaceholder: "Klicken oder Datei hierher ziehen",
    uploadedLabel: "Hochgeladen",
    cloudinaryLinkLabel: "Cloudinary‑Link",
    dropOverlay: "Zum Anhängen ablegen",
    fileTooLarge: "Datei ist zu gross (max. {max}).",
    unsupportedFileType:
      "Nicht unterstützter Dateityp. Erlaubt: PNG, JPG, WEBP, PDF, DOC, DOCX.",
    validation: {
      nameRequired: "Bitte geben Sie Ihren Namen ein.",
      emailRequired: "Bitte geben Sie Ihre E-Mail ein.",
      emailInvalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
      subjectRequired: "Bitte geben Sie einen Betreff ein.",
      messageRequired: "Bitte geben Sie eine Nachricht ein.",
    },
  },
  services: {
    badges: {
      mostPopular: "Am beliebtesten",
    },
    title: "Dienstleistungen",
    subtitle:
      "Umfassende Softwareentwicklungsdienste, angepasst an Ihre Bedürfnisse.",
    getStarted: "Jetzt starten",
    services: {
      fullstack: {
        title: "Full-Stack-Entwicklung",
        description: "Ganzheitliche Webentwicklung mit modernen Technologien.",
        price: "ab CHF 75/h",
        features: [
          "Responsive Webanwendungen",
          "RESTful API-Entwicklung",
          "Datenbankdesign und -implementierung",
          "Leistungsoptimierung",
        ],
      },
      frontend: {
        title: "Frontend-Entwicklung",
        description: "Erstellung schöner und benutzerfreundlicher Oberflächen.",
        price: "ab CHF 65/h",
        features: [
          "React-Entwicklung",
          "UI/UX-Implementierung",
          "Animationen und Interaktivität",
          "Mobile-First-Design",
        ],
      },
      backend: {
        title: "Backend-Entwicklung",
        description: "Robuste und skalierbare Server-Lösungen.",
        price: "ab CHF 70/h",
        features: [
          "API-Architektur",
          "Datenbankverwaltung",
          "Server-Optimierung",
          "Sicherheitsmassnahmen",
        ],
      },
      consulting: {
        title: "Technische Beratung",
        description: "Expertenhilfe bei technischen Entscheidungen.",
        price: "ab CHF 60/h",
        features: [
          "Architekturplanung",
          "Technologiestack-Auswahl",
          "Leistungsanalyse",
          "Sicherheitsbewertung",
        ],
      },
    },
    contactTemplate: {
      inquiry: "Anfrage",
      greeting: "Hallo Yanis,",
      interested: "Ich interessiere mich für Ihre {service}-Dienstleistungen.",
      discuss: "Ich möchte Folgendes besprechen:",
      closing: "Ich freue mich auf Ihre Antwort!",
    },
    customRequirements: {
      title: "Spezielle Anforderungen?",
      description:
        "Haben Sie ein bestimmtes Projekt im Sinn? Ich helfe Ihnen dabei, Ihre Vision Wirklichkeit werden zu lassen. Lassen Sie uns Ihre Anforderungen besprechen und eine passende Lösung entwickeln.",
      button: "Kontaktieren Sie mich",
    },
  },
} satisfies Translation;
