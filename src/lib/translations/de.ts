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
      description:
        "Softwareentwickler aus Zürich – mit Fokus auf skalierbare, schnelle und durchdachte Systeme in Infrastruktur, Identitätsmanagement und Benutzeroberflächen.",
    },
    about: {
      description:
        "Mehr über meinen Hintergrund, meine Werte und die Werkzeuge, mit denen ich schnelle, saubere und minimalistische Software baue.",
    },
    projects: {
      description:
        "Eine kuratierte Auswahl meiner Projekte – Full‑Stack, Frontend, Backend und Tools.",
    },
    skills: {
      description:
        "Technologien und Tools – von React und TypeScript bis Spring Boot und Docker.",
    },
    experience: {
      description:
        "Zeitleiste von Ausbildung und Rollen mit Verantwortlichkeiten, Erfolgen und Technologien.",
    },
    contact: {
      description: "Kontakt für Projekte, Zusammenarbeit oder Möglichkeiten.",
    },
    services: {
      description:
        "Full‑Stack‑, Frontend‑, Backend‑Entwicklung sowie technologische Beratung nach Bedarf.",
    },
    privacy: {
      description:
        "Datenschutzhinweise zu sola.ysz.life – Hosting, Analytics, Auftragsverarbeiter und Ihre Rechte.",
    },
    notFound: {
      description: "Die angeforderte Ressource wurde nicht gefunden.",
    },
    certifications: {
      description: "Zertifizierungen und Nachweise, mit Verifizierungslinks.",
    },
    changelog: {
      description:
        "Git-Log von sola — Commits, Dateibäume und Patches aus der GitHub-Historie.",
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
    present: "Heute",
    overview: "Überblick",
    a11y: {
      openMenu: "Menü öffnen",
      closeMenu: "Menü schliessen",
      primaryNav: "Hauptnavigation",
      toggleLanguage: "Sprache wechseln",
      toggleTheme: "Design wechseln",
      commandPalette: "Befehlspalette",
      commandPaletteHint: "Befehl suchen…",
      scrollToTop: "Nach oben scrollen",
      terminal: "Terminal",
    },
    menu: {
      themes: "Designs",
      customThemes: "Eigene Designs",
      background: "Hintergründe",
    },
    diff: {
      showDiff: "Git-Diff anzeigen",
      exit: "Git-Diff ausblenden",
      hint: "Zeigt den letzten Commit, der die aktuelle Seite verändert hat.",
      deployed: "Der Commit, aus dem dieses Deployment gebaut wurde.",
      noChanges: "Keine erfassten Änderungen für diese Seite.",
      viewOnGitHub: "Auf GitHub ansehen",
      error: "Diff konnte nicht geladen werden.",
      retry: "Erneut versuchen",
      unavailable: "Kein Text-Diff für diese Datei.",
      truncated: "Gekürzt – vollständiger Diff auf GitHub.",
      file: "Datei",
      files: "Dateien",
    },
    backgroundHints: {
      section: "Einige Hintergründe wirken deutlich besser im Dark Mode.",
    },
    callout: {
      background: {
        title: "Mach es zu deinem",
        content:
          "Ich habe {background} mit dem {theme}-Theme ausgewählt — in diesem Menü kannst du jederzeit wechseln.",
      },
      done: "Alles klar",
    },
    none: "Keiner",
    search: "Suche",
    copied: "Kopiert.",
    copyCode: "Code kopieren",
    copyFailed: "Kopieren fehlgeschlagen.",
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
    sourcePrivate: "Der Quellcode ist privat.",
    sourcePrivateClient:
      "Für einen Kunden gebaut, der Quellcode ist deshalb privat.",
    linkPrivate: "Die Live-App ist privat.",
    linkPrivateClient:
      "Wird firmenintern beim Kunden genutzt, die Live-App ist deshalb privat.",
    demo: "Demo",
    moreProjects: "Weitere Projekte",
    onThisPage: "Auf dieser Seite",
    linkToSection: "Link zu Abschnitt: {title}",
    close: "Schließen",
    expandImage: "Bild vergrößern",
    expandImageNamed: "Bild vergrößern: {alt}",
    expandedImage: "Vergrößertes Bild",
    previousImage: "Vorheriges Bild",
    nextImage: "Nächstes Bild",
    imageOf: "Bild {current} von {total}",
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
    lastEvents: "Letzte {count} Aktivitäten",
    noActivity: "Keine aktuellen Aktivitäten",
    loadError: "Aktuelle Aktivitäten konnten nicht geladen werden",
    checkBack: "Schauen Sie später noch einmal vorbei",
    moreSuffix: "mehr",
    commit: "{count} Commit",
    commits: "{count} Commits",
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
    nameSwitch: "Namen wechseln",
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
    viewDetails: "Details ansehen",
    viewGithub: "Code ansehen",
    sortBy: "Sortieren nach",
    sortOptions: {
      featured: "Empfohlen",
      newest: "Neueste",
      oldest: "Älteste",
      name: "Name (A–Z)",
    },
    kind: {
      label: "Projektart",
      all: "Alle",
      personal: "Persönlich",
      commercial: "Kommerziell",
    },
    empty: "Hier ist noch nichts",
    emptyDescription:
      "Projekte dieser Art erscheinen hier, sobald sie fertig sind.",
    visitProject: "Projekt besuchen",
    list: {
      codeExtractor: {
        title: "Website Code Extractor",
        tagline: "Der Code jeder Website als ein ZIP",
        description:
          "[Website Code Extractor](https://chromewebstore.google.com/detail/website-code-extractor/foppgeakfpkdghmmmflmblcidoofpohm) ist eine Erweiterung für Chrome und Edge, die HTML, CSS, JavaScript und Bilder einer Website als eine ZIP-Datei herunterlädt, samt Ordnerstruktur. Ein Klick, keine Einrichtung. Sie hat 6000 Nutzer im Chrome Web Store und funktioniert am besten mit statischen Seiten.",
      },
      applicare: {
        title: "AppliCare",
        tagline: "Alle Bewerbungen an einem Ort",
        description:
          "[AppliCare](https://applicare.app) behält deine Bewerbungen im Blick. Jede Bewerbung mit ihrem Status erfassen, von beworben bis Angebot, Aufgaben mit Fristen anhängen und den Fortschritt auf einem Dashboard mit Erfolgsquote und Zeitverlauf verfolgen. Gebaut mit React, Ant Design, Spring Boot und MongoDB.",
      },
      osint: {
        title: "OSINT Website",
        tagline: "Schärfe deinen Ermittlerblick",
        description:
          "[OSINT Exercises](https://osint.ysz.life) ist eine Seite zum Üben von Open Source Intelligence: Informationen aus öffentlichen Quellen finden. Jede Übung liefert einen Hintergrund und eine Reihe von Aufgaben, von leicht bis Experte, und jeder kann über die Seite eine neue Übung einreichen.",
      },
      chatapp: {
        title: "ChatApp",
        tagline: "Chaträume in Echtzeit, auf Spring Boot",
        description:
          "ChatApp ist eine Chat-Plattform in Echtzeit: Konto erstellen, E-Mail bestätigen und in Räumen chatten, die man selbst erstellt oder denen man beitritt. Nachrichten laufen über WebSockets, dahinter stehen Spring Boot und MongoDB. Entstanden für ein Schulmodul.",
      },
      vmDetector: {
        title: "Virtual Machine Detector",
        tagline: "Erkennt, ob du in einer VM läufst",
        description:
          "Ein kleines Java-Tool, das erkennt, ob es in einer virtuellen Maschine läuft. Es prüft BIOS, CPU, die MAC-Adresse der Netzwerkkarte und die Windows-Registry auf die Spuren, die ein Hypervisor hinterlässt.",
      },
      viewCounter: {
        title: "View Counter",
        tagline: "Ein Seitenaufruf-Zähler auf Redis",
        description:
          "Ein Seitenaufruf-Zähler: Jeder Besuch der Startseite zählt eins hoch, und der Stand liegt in Redis, übersteht also einen Neustart. Ein kleines Spring-Boot-Projekt, um zu lernen, wie Redis in eine Java-Webanwendung passt.",
      },
      dockerService: {
        title: "Docker Service Deployment",
        tagline: "MediaWiki, Nextcloud und Gogs per Compose",
        description:
          "Ein Docker-Compose-Setup, das MediaWiki, Nextcloud und Gogs nebeneinander betreibt, mit persistenten Daten und Portainer zur Überwachung. Ein Schulprojekt, gemeinsam mit Benicio Von Felten gebaut und dokumentiert.",
      },
      phishing: {
        title: "Phishing Website Tutorial",
        tagline: "Wie Phishing-Seiten funktionieren",
        description:
          "Ein Schritt-für-Schritt-Blick darauf, wie eine Phishing-Seite aufgebaut ist, geschrieben, damit man eine erkennt, wenn man sie sieht. Nur zu Bildungszwecken.",
      },
      otw: {
        title: "OverTheWire Guide",
        tagline: "Bandit, Level für Level",
        description:
          "Eine Schritt-für-Schritt-Lösung des Wargames [Bandit von OverTheWire](https://overthewire.org/wargames/bandit/), Level für Level, mit einer kurzen Einführung in die Linux-Befehle, die jedes Level braucht.",
      },
      sola: {
        title: "Sola",
        tagline: "Modernes Portfolio in React und TypeScript",
        description:
          "Sola ist meine persönliche Website. Entwickelt mit React, TypeScript und Tailwind CSS, präsentiert sie meine Projekte, Fähigkeiten und Erfahrungen in einem klaren, modernen Design.",
      },
      kinoa: {
        title: "Kinoa",
        tagline: "Kostenlos streamen, ohne Lärm",
        description:
          "[Kinoa](https://kinoa.to) ist eine kostenlose Streaming-Seite für Filme und Serien. Trends durchstöbern, einen Titel öffnen und direkt auf derselben Seite abspielen, ganz ohne Konto; wer sich anmeldet, bekommt eine Watchlist und einen Verlauf, die über alle Geräte synchron bleiben. Gebaut mit Next.js, Supabase und Daten von TMDB.",
      },
      self: {
        title: "Self",
        tagline: "Neofetch, neu gedacht für Windows",
        description:
          "Self zeigt deine Systeminformationen im Terminal neben einem Bild oder ASCII-Art, so wie Neofetch unter Linux, nur für Windows. Es wird mit einem PowerShell-Befehl installiert, rendert Bilder als farbige Blöcke oder Braille und hat konfigurierbare Themes. Geschrieben in Python.",
      },
      taco: {
        title: "Taco",
        tagline: "Die Website eines Hundes, als wiederverwendbare Vorlage",
        description:
          "[Taco](https://takitwo.vercel.app) ist eine Website über den Hund meines Bruders, gebaut als Vorlage, die ich wiederverwenden kann: Seiten auf Englisch, Spanisch und Japanisch mit automatischer Spracherkennung, ein Blog, eine Galerie und eine Kontaktseite. Gebaut mit Next.js, TypeScript und Tailwind CSS.",
      },
      thoughts: {
        title: "Thoughts",
        tagline: "Gedanken, Fragmente und Notizen",
        description:
          "[Thoughts](https://thoughts.ysz.life) ist eine kleine Seite, auf der ich Gedanken, Fragmente und Notizen aufschreibe, getrennt von diesem Portfolio. Beiträge sind MDX-Dateien, und in einem Gästebuch können Besucher eine eigene Notiz hinterlassen. Inspiriert von der persönlichen Seite von [Shu Ding](https://shud.in).",
      },
      magi: {
        title: "magi",
        tagline: "Asynchrones Port-Scanning, korrekt gebaut",
        description:
          "[magi](https://magi.ysz.life) ist ein schneller TCP- und UDP-Portscanner, geschrieben in Rust. Er scannt mit ganz normalen Verbindungen, braucht also kein Root, und meldet nur, was er wirklich beobachtet hat: Ein Port, den er nicht testen konnte, gilt als untestable statt als closed. Ein Befehl installiert ihn unter Linux, macOS oder Windows.",
      },
      luma: {
        title: "Luma",
        tagline: "Eigene Keys, jedes Modell",
        description:
          "[Luma](https://luma.ysz.life) ist eine Chat-App für alle grossen KI-Modelle: eigene API-Keys mitbringen und innerhalb eines Gesprächs zwischen Claude, GPT, Gemini, Grok und weiteren wechseln. Wer eine frühere Nachricht bearbeitet, verzweigt den Chat, und beide Pfade bleiben erhalten. Die Keys werden verschlüsselt, bevor sie gespeichert werden.",
      },
      perspectas: {
        title: "perspectas.ch",
        tagline: "Beratungs-Website rund um einen gelben Punkt",
        description:
          "Die Website der [perspectas gmbh](https://www.perspectas.ch), einer Beratungs- und Recruiting-Firma bei Zürich, neu gebaut mit Next.js und Sanity. Jeder Text und jedes Bild liegt im CMS, die beiden Partner publizieren Änderungen also selbst. Das Design hat genau einen Akzent: den gelben Punkt aus dem Logo, der zugleich der Schlusspunkt der Headline ist.",
      },
      ura: {
        title: "Ura",
        tagline:
          "Schneemobilrouten für Lappland: offline, mit Genehmigungsstatus",
        description:
          "Ura ist Schneemobil-Navigation für Finnisch-Lappland, für iOS und Android. Die App hat 2595 Routen und 3388 Orte wie Tankstellen, Cafés und Hütten auf dem Gerät und funktioniert darum auch ohne Empfang. Sie zeigt, ob man auf einer Route ist und ob diese frei befahrbar ist oder zuerst eine Genehmigung braucht.",
      },
      montu: {
        title: "Montu",
        tagline:
          "Schweizer Bergtourenjournal, kartiert aus eigenen GPX-Dateien",
        description:
          "[Montu](https://montu.ch) ist ein Bergtourenjournal auf Schweizer Hochdeutsch, gebaut für einen Kunden, der die Touren selbst schreibt und fotografiert. Er lädt eine GPX-Datei hoch, und die Seite zeichnet die Route auf einer Geländekarte samt Höhenprofil. Touren, Fotos und alle übrigen Texte pflegt er im CMS, eine neue Tour braucht also keinen Entwickler.",
      },
      qr: {
        title: "QR",
        tagline: "QR-Codes gestalten und gleich gegenprüfen",
        description:
          "[qr.ysz.life](https://qr.ysz.life) ist ein QR-Code-Generator, der komplett im Browser läuft. Punkte und Ecken gestalten, Verläufe und ein Logo ergänzen, dann als PNG, SVG, JPEG oder WebP exportieren. Ein eingebauter Scan-Test liest den fertigen Code zurück, damit klar ist, dass er sich noch scannen lässt, bevor er gedruckt wird.",
      },
      vault: {
        title: "Vault",
        tagline: "Keycloak, FastAPI und ein Realm aus Terraform",
        description:
          "Vault ist eine lokale Sandbox, um OpenID Connect zu lernen. Keycloak stellt die Tokens aus, ein FastAPI-Dienst prüft sie, und ein Next.js-Frontend zeigt Dashboards, die nach Rolle freigegeben sind. Die Identitätskonfiguration ist in Terraform deklariert, das Ganze lässt sich also mit einem Befehl abreissen und neu aufbauen.",
      },
      fleetmap: {
        title: "fleetmap",
        tagline: "Vom Handy im Lieferwagen auf den Büro-Bildschirm",
        description:
          "fleetmap ist eine Live-Karte einer Lieferflotte. Das Handy jedes Lieferwagens meldet seine Position, und ein Bildschirm im Büro zeigt jeden Wagen in Bewegung, mit Stopps, ETA und Verspätung. Jeder vergangene Tag lässt sich aus der aufgezeichneten Strecke wieder abspielen. Gebaut mit Next.js, Supabase und MapLibre.",
      },
    },
  },
  skills: {
    title: "Fähigkeiten",
    subtitle: "Technologien und Tools, mit denen ich regelmässig arbeite.",
    groups: {
      languages: "Sprachen",
      frontend: "Frontend",
      backend: "Backend",
      infrastructure: "Infrastruktur",
      security: "Sicherheit",
      tools: "Tools",
    },
    levels: {
      1: "Am Lernen",
      2: "Grundkenntnisse",
      3: "Sicher",
      4: "Versiert",
      5: "Fortgeschritten",
    },
    usedIn: "In {count} Projekten verwendet",
    usedInOne: "In 1 Projekt verwendet",
    projectCount: "{count} Projekte",
    projectCountOne: "1 Projekt",
    everyProject: "Jedes Projekt",
  },
  notFound: {
    backHome: "Zurück zur Startseite",
  },
  colophon: {
    title: "Wie diese Website entstanden ist",
    lede: "In alten Büchern verrät die letzte Seite, wie das Ganze gemacht wurde. Das hier ist diese Seite.",
    built:
      "Es ist eine [React](https://react.dev)-App in [TypeScript](https://www.typescriptlang.org), gebaut mit [Vite](https://vite.dev), damit der Weg vom Speichern zum Bildschirm unsichtbar bleibt. Farbe und Raum kommen von [Tailwind CSS](https://tailwindcss.com) und [shadcn/ui](https://ui.shadcn.com) — Tokens, keine Rohpalette. Was sich bewegt, ist [Motion](https://motion.dev) für die Oberfläche und [GSAP](https://gsap.com) für die Himmel; zwei Uhren, damit ein Knopf sich nie bei einem Hintergrund bedient.",
    faces:
      "Die Schnitte sind [Geist](https://vercel.com/font) zum Lesen wie für die Namen, [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) für Code und [Shippori Mincho B1](https://fonts.google.com/specimen/Shippori+Mincho+B1) für Tinte wie diese. Sie lebt auf [Vercel](https://vercel.com); der Quelltext liegt auf [GitHub](https://github.com/lyfe691/sola).",
    close: "Von Hand gesetzt in Zürich. Danke fürs Vorbeischauen.",
    back: "Zurück",
  },
  changelog: {
    title: "Changelog",
    subtitle:
      "Die live Git-Historie dieser Website. Einen Commit aufklappen, um die Nachricht, den Dateibaum und den Patch zu lesen.",
    empty: "Keine Commits vorhanden.",
    error: "Git-Historie konnte nicht geladen werden.",
    retry: "Erneut versuchen",
    older: "Ältere laden",
    viewOnGitHub: "Auf GitHub ansehen",
    thisDeploy: "dieses Deploy",
    truncated: "Diff gekürzt. Vollständiger Commit auf GitHub.",
    unavailable: "Patch ausgelassen (binär oder zu groß).",
    files: "{count} Dateien",
    expand: "Commit anzeigen",
    collapse: "Commit ausblenden",
    pr: "PR #{number}",
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
    changelog: "Changelog",
  },
  about: {
    title: "Über mich",
    intro:
      "Ich bin Yanis Sebastian Zürcher, 18, Softwareentwickler aus Zürich. Zwei Jahre Informatik an der [WISS](https://www.wiss.ch). Das dazugehörige Praktikum mache ich bei [nadlo](https://nadlo.ch), bis Juli 2027.",
    hobbies:
      "Ich arbeite full-stack, aber UI und Design sind das, woran ich Spaß habe. Ich mag es, rauszufinden, wie etwas aussehen und sich anfühlen soll — das ist der Teil der Arbeit, mit dem ich wirklich Zeit verbringen will.",
    philosophy: {
      title: "So arbeite ich",
      clean:
        "Code soll in sechs Monaten noch Sinn ergeben. Die cleveren Stellen schreibe ich um, bis sie langweilig sind.",
      simplicity:
        "Braucht ein Feature einen Absatz zur Erklärung, sind es wahrscheinlich zwei. Ich streiche, bis das Übrige offensichtlich ist.",
      learning:
        "Ich lerne, indem ich das Nächste baue, das ich noch nicht kann. Docs, Repos, und Sachen öffentlich kaputtmachen.",
    },
    interests: {
      title: "Interessen",
      nature: {
        title: "Draussen",
        description:
          "Ich versuche regelmässig rauszukommen — meist wandern, manchmal einfach lange Spaziergänge ohne Ziel. In der Schweiz ist das einfach; die Alpen sind nah, und ein paar Stunden auf dem Trail sind immer noch eine der besseren Arten, den Kopf freizubekommen nach zu vielen Stunden am Bildschirm.",
      },
      tech: {
        title: "Open Source",
        description:
          "Zu Open Source trage ich bei, wenn mich ein Projekt wirklich interessiert, nicht als Checklisten-Punkt. Das heisst meist Performance, Accessibility oder kleine Verbesserungen an Tools, die ich sowieso täglich nutze.",
      },
      learning: {
        title: "Lernen",
        description:
          "Neben der Schule lerne ich weiter mit einer Mischung aus Büchern, Dokumentation und ab und zu einem Kurs, wenn mir etwas neu ist. Gerade geht es viel um Systeme und wie Browser unter der Haube laufen — das fliesst direkt in die Projekte, die ich shippe.",
      },
      workspace: {
        title: "Setup",
        description:
          "Mein Schreibtisch ist absichtlich schlicht: zwei Monitore, eine mechanische Tastatur und wenig Zeug drumherum. Mir ist wichtiger, dass das Setup nicht im Weg steht, als Gadgets zu sammeln — dann kann ich mich hinsetzen und arbeiten, ohne vorher den halben Raum umzuräumen.",
      },
    },
    testimonials: {
      title: "Von Leuten, mit denen ich gearbeitet habe",
      link: "Mit mir arbeiten",
      viewMore: "Mehr anzeigen",
      visitWebsite: "Website besuchen",
      website: "Website",
      roleAtCompany: "{role} bei {company}",
      viewLinkedIn: "LinkedIn ansehen",
      modalTitle: "Referenz",
      modalDescription: "Vollständige Referenz von {author}",
      items: {
        koenitzer: {
          quote:
            "Mit Yanis in jedem Fach der Softwareentwicklung (IT) zusammenzuarbeiten war ein echtes Highlight. Seine technischen Fähigkeiten, seine Zuverlässigkeit und sein Problemlösungsvermögen waren auf einem anderen Niveau. Ein wirklich außergewöhnlicher Entwickler und Teamkollege.",
          role: "Arbeitsloser Nichtstuer",
        },
        bichsel: {
          quote:
            "Die Zusammenarbeit mit Yanis war eine fantastische Erfahrung. Er hat mich durch jedes Fach getragen, immer wieder kreative Lösungen für komplexe Probleme gefunden und alles pünktlich geliefert. Ein wirklich außergewöhnlicher Entwickler.",
          role: "Praktikant",
        },
        venzin: {
          quote:
            "Yanis vereint auf seltene Weise technisches Können mit einem Gespür für Design. Das WISS Forum, das er für uns entwickelt hat, hat alle Erwartungen übertroffen und unsere Online-Präsenz deutlich verbessert.",
          role: "Dozent",
        },
      },
    },
    certifications: {
      link: "Zertifikate",
    },
    resume: {
      buttonLabel: "Lebenslauf",
      title: "Lebenslauf",
      description:
        "Zwei Seiten, auf Deutsch oder Englisch. Adresse und Telefonnummer sind hier geschwärzt; die vollständige Fassung gibt es per [E-Mail](mailto:yanis.sebastian.zuercher@gmail.com).",
      languageLabel: "Sprache",
      read: "Hier lesen",
      download: "PDF herunterladen",
      open: "PDF öffnen",
      back: "Zurück",
      failed:
        "Liess sich hier nicht darstellen. Öffnen Sie stattdessen das PDF.",
    },
    github: {
      title: "GitHub-Aktivität",
      overview: "Übersicht",
      totalCount: "{{count}} Beiträge in {{year}}",
      totalCountLastYear: "{{count}} Beiträge im letzten Jahr",
      legendLess: "Weniger",
      legendMore: "Mehr",
      dayTooltip: "{count} Beiträge am {date}",
      loadError: "Beitragsdaten konnten gerade nicht geladen werden.",
    },
    philosophyLabels: {
      clean: "Lesbarer Code",
      simplicity: "Weniger, nicht mehr",
      learning: "Bauen zum Lernen",
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
      subject: "Individuelle Entwicklungsanforderungen",
      message:
        "Hallo Yanis,\n\nich habe spezielle Anforderungen, die nicht in die üblichen Service-Kategorien passen, und würde gerne eine individuelle Lösung besprechen.\n\nProjektdetails:\n- \n- \n- \n\nIch freue mich auf Ihre Rückmeldung!",
    },
  },
  errorBoundary: {
    title: "Etwas ist schiefgelaufen",
    message:
      "Ein unerwarteter Fehler ist aufgetreten. Ein Neuladen der Seite behebt das meistens.",
    reload: "Neu laden",
  },
} satisfies Translation;
