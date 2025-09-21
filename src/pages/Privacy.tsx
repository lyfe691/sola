/*
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 * 
 * WARNING: Copying this file is strictly prohibited - it will lead to legal action.
 */

// independent page in simplelayout

import { motion, AnimatePresence } from "motion/react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// removed warning banner icon as ive add the translations 
// added translations here in the file cause i was too lazy to add them to the translations.ts file
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { LinkPreview } from "@/components/ui/link-preview";
import { IconButton } from "@/components/ui/custom/IconButton";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Privacy = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);
  const n = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  const L = {
    en: {
      pageTitle: "Privacy Policy",
      lastUpdated: "Last updated: February 2025",
      intro: {
        title: "Introduction",
        p1: (
          <>
            This personal portfolio website (<LinkPreview href="https://sola.ysz.life" className="link" compact>{"https://sola.ysz.life"}</LinkPreview>) showcases my projects and freelance services. This privacy notice complies with the Swiss Federal Act on Data Protection (revFADP 2023) and the EU General Data Protection Regulation (GDPR) and explains what data are processed and why.
          </>
        ),
        controller: "Data Controller:",
        controllerVal: "Yanis Sebastian Zürcher, Switzerland",
        contact: "Contact:",
        email: "yanis.sebastian.zuercher@gmail.com",
      },
      summary: {
        title: "At a glance",
        lead: "We keep data processing lean and transparent. Key things to know:",
        points: [
          {
            title: "No advertising or sale of data",
            description: "There are no tracking pixels, remarketing scripts, or sharing with ad networks.",
          },
          {
            title: "Essential infrastructure only",
            description: "Hosting and analytics run on Vercel (EU/USA) with GDPR-compliant data-processing agreements and safeguards.",
          },
          {
            title: "You stay in control",
            description: "You can request a copy, correction, or deletion of your data at any time by emailing me.",
          },
        ],
      },
      data: {
        title: "Data we process",
        lead: "The amount of personal data is intentionally limited to what is necessary to operate and safeguard the site.",
        groups: [
          {
            title: "Automatically when you visit",
            items: [
              "Server logs from Vercel (IP address, user agent, referrer, timestamp, requested URL) processed to secure the platform and diagnose incidents.",
              "Aggregated analytics events in Vercel Analytics (page view counts, approximate region, device/OS type) that are anonymised before storage.",
            ],
          },
          {
            title: "If you contact me",
            items: [
              "Your name, email address, and the content of the message you send.",
              "Any optional context you include (for example project requirements or attachments).",
            ],
          },
          {
            title: "When GitHub embeds load",
            items: [
              "Requests to GitHub’s CDN include your IP address and technical headers so that widgets can be displayed.",
              "GitHub may log these requests according to its own privacy policy.",
            ],
          },
        ],
      },
      hosting: {
        title: "Hosting",
        p1: (
          <>
            The site is served by <LinkPreview href="https://vercel.com" className="link" compact>Vercel Inc.</LinkPreview>, 340 S Lemon Ave #4133, Walnut, CA 91789, USA. Vercel operates data centres in the European Union and United States. Connection metadata (IP address, user agent, referrer, timestamp, requested URL) are processed in server logs and edge caches to deliver the website, mitigate abuse, and debug issues.
          </>
        ),
        p2: "Access logs are only reviewed when necessary to investigate errors or security alerts.",
        legal: {
          label: "Legal basis",
          description: "Art. 6(1)(f) GDPR — legitimate interests in operating and safeguarding the site.",
        },
      },
      analytics: {
        title: "Analytics",
        p1: "Visitor statistics are collected with Vercel Analytics, which anonymises IP addresses and truncates location data before storage.",
        p2: "Analytics help me understand aggregate engagement (for example total visitors, top pages) without using cookies or tracking scripts.",
        legal: {
          label: "Legal basis",
          description: "Art. 6(1)(f) GDPR — legitimate interests in analysing and improving performance without infringing on privacy.",
        },
      },
      cookies: {
        title: "Cookies",
        p1: "This site does not set tracking cookies. Essential cookies may be issued by the hosting platform only where strictly necessary for security, caching, or session management.",
      },
      contact: {
        title: "Contact",
        p1: "If you contact me (form or email), the data you provide (name, email, message) are processed solely to handle your enquiry and possible follow-ups.",
        p2: "Email is handled through Google LLC (Gmail). Messages are stored in encrypted Google data centres and accessed only by me.",
        legal: {
          label: "Legal basis",
          description: "Art. 6(1)(a) GDPR — consent; and, where relevant, Art. 6(1)(b) GDPR — pre-contractual steps at your request.",
        },
      },
      github: {
        title: "GitHub Content",
        p1: (
          <>
            Pages may fetch contribution graphs or repository widgets from <LinkPreview href="https://github.com" className="link" compact>GitHub, Inc.</LinkPreview> (USA). Your IP address is transmitted when these resources are requested. GitHub participates in the EU–US Data Privacy Framework.
          </>
        ),
        p2: "GitHub may set functional cookies or collect device data according to its own privacy notice.",
        legal: {
          label: "Legal basis",
          description: "Art. 6(1)(f) GDPR — legitimate interests in presenting open-source activity.",
        },
      },
      processors: {
        title: "Processors",
        p1: "Processing by Vercel and Vercel Analytics is governed by data-processing agreements compliant with Art. 28 GDPR and Art. 9 revFADP, including Standard Contractual Clauses for international transfers.",
        p2: "Further subprocessors are only engaged where necessary for infrastructure or email hosting and are bound by contractual safeguards.",
      },
      retention: {
        title: "Retention",
        lead: "Data are deleted or anonymised once the original purpose is met. Current retention periods are:",
        entries: [
          {
            item: "Vercel server logs",
            duration: "Automatic deletion after 30 days.",
            detail: "Used only for troubleshooting and security investigations.",
          },
          {
            item: "Aggregated analytics metrics",
            duration: "Stored in anonymised form for 13 months.",
            detail: "No raw IP addresses or unique identifiers are kept.",
          },
          {
            item: "Contact conversations",
            duration: "Kept for up to 12 months after the last interaction.",
            detail: "Allows me to follow up on project requests or legal obligations.",
          },
        ],
      },
      security: {
        title: "Security",
        lead: "Technical and organisational measures are in place to prevent unauthorised access.",
        measures: [
          "Transport encryption (HTTPS/TLS) for all connections.",
          "Strict platform access controls with multi-factor authentication.",
          "Regular dependency updates and monitoring for vulnerabilities.",
          "Data minimisation so that there is little personal data to protect in the first place.",
        ],
      },
      transfers: {
        title: "International transfers",
        lead: "Hosting and some integrations are operated from the United States.",
        p1: "Vercel Inc. and GitHub, Inc. participate in the EU–US Data Privacy Framework and provide Standard Contractual Clauses (SCCs) to cover Swiss and EU data transfers.",
        safeguards: [
          "Data processing agreements with Vercel that include SCCs and technical safeguards.",
          "Only the minimum metadata required to deliver the service is transmitted.",
          "Your email data remains in my control and is stored with providers located in Switzerland or the EU/EEA.",
        ],
      },
      sources: {
        title: "Sources of data",
        p1: "Most personal data comes directly from you. Technical metadata originates from your device and browser when connecting to the site.",
      },
      minors: {
        title: "No use by children",
        p1: "This portfolio is aimed at adults and professional clients. I do not knowingly collect information from children under 16, and I will delete such data if I become aware of it.",
      },
      automated: {
        title: "No automated decision-making",
        p1: "There is no profiling, behavioural advertising, or automated decision-making that produces legal or similarly significant effects.",
      },
      rights: {
        title: "Your Rights",
        p1: "You may request access, rectification, erasure, restriction, data portability, or object to processing based on legitimate interests.",
        p2: (
          <>
            To exercise these rights, email <a href="mailto:yanis.sebastian.zuercher@gmail.com" className="link">yanis.sebastian.zuercher@gmail.com</a>. Swiss residents may contact the FDPIC; EU residents may lodge a complaint with a competent supervisory authority.
          </>
        ),
        items: [
          "Access to your data (Art. 15 GDPR)",
          "Rectification (Art. 16 GDPR)",
          "Erasure (Art. 17 GDPR)",
          "Restriction of processing (Art. 18 GDPR)",
          "Data portability (Art. 20 GDPR)",
          "Objection to legitimate interests (Art. 21 GDPR)",
        ],
      },
      changes: {
        title: "Changes",
        p1: (
          <>
            This policy may change due to legal or functional updates. The current version is available at <LinkPreview href="https://sola.ysz.life/privacy" className="link" compact>{"https://sola.ysz.life/privacy"}</LinkPreview>.
          </>
        ),
        p2: "Significant updates are documented in the project’s commit history or release notes.",
      },
      impressum: {
        title: "Impressum",
        responsible: "Responsible for this website:",
        name: "Yanis Sebastian Zürcher",
        location: "Zurich, Switzerland",
        emailLabel: "Email:",
      },
      back: "Go back",
    },
    de: {
      pageTitle: "Datenschutzerklärung",
      lastUpdated: "Zuletzt aktualisiert: Februar 2025",
      intro: {
        title: "Einführung",
        p1: (
          <>
            Diese persönliche Portfolio-Website (<LinkPreview href="https://sola.ysz.life" className="link" compact>{"https://sola.ysz.life"}</LinkPreview>) stellt Projekte und freiberufliche Leistungen vor. Dieser Datenschutzhinweis entspricht dem revDSG (2023) und der EU-DSGVO und erläutert, welche Daten zu welchem Zweck verarbeitet werden.
          </>
        ),
        controller: "Verantwortlicher:",
        controllerVal: "Yanis Sebastian Zürcher, Schweiz",
        contact: "Kontakt:",
        email: "yanis.sebastian.zuercher@gmail.com",
      },
      summary: {
        title: "Auf einen Blick",
        lead: "Wir halten die Datenverarbeitung bewusst schlank und transparent. Die wichtigsten Punkte:",
        points: [
          {
            title: "Keine Werbung oder Datenverkauf",
            description: "Keine Tracking-Pixel, Remarketing-Skripte oder Weitergabe an Werbenetzwerke.",
          },
          {
            title: "Nur notwendige Infrastruktur",
            description: "Hosting und Analytics laufen bei Vercel (EU/USA) auf Basis DSGVO-konformer Auftragsverarbeitungsverträge und Schutzmaßnahmen.",
          },
          {
            title: "Sie behalten die Kontrolle",
            description: "Sie können jederzeit per E-Mail Auskunft, Berichtigung oder Löschung verlangen.",
          },
        ],
      },
      data: {
        title: "Verarbeitete Daten",
        lead: "Der Umfang personenbezogener Daten ist bewusst auf das für Betrieb und Sicherheit Erforderliche reduziert.",
        groups: [
          {
            title: "Automatisch beim Besuch",
            items: [
              "Server-Logs von Vercel (IP-Adresse, User-Agent, Referrer, Zeitstempel, aufgerufene URL) zur Absicherung der Plattform und zur Fehlerdiagnose.",
              "Aggregierte Analytics-Ereignisse in Vercel Analytics (Seitenaufrufe, ungefähre Region, Gerät/Betriebssystem), die vor Speicherung anonymisiert werden.",
            ],
          },
          {
            title: "Bei Kontaktaufnahme",
            items: [
              "Ihr Name, Ihre E-Mail-Adresse und der Inhalt der Nachricht.",
              "Freiwillige Zusatzinformationen (z. B. Projektanforderungen oder Anhänge).",
            ],
          },
          {
            title: "Beim Laden von GitHub-Widgets",
            items: [
              "Anfragen an das CDN von GitHub enthalten Ihre IP-Adresse und technische Header, damit Widgets angezeigt werden.",
              "GitHub protokolliert diese Anfragen gemäß eigener Datenschutzerklärung.",
            ],
          },
        ],
      },
      hosting: {
        title: "Hosting",
        p1: (
          <>
            Das Hosting erfolgt bei <LinkPreview href="https://vercel.com" className="link" compact>Vercel Inc.</LinkPreview>, 340 S Lemon Ave #4133, Walnut, CA 91789, USA. Vercel betreibt Rechenzentren in der EU und den USA. Verbindungsmetadaten (IP-Adresse, User-Agent, Referrer, Zeitstempel, aufgerufene URL) werden in Server-Logs und Edge-Caches verarbeitet, um die Website auszuliefern, Missbrauch zu verhindern und Fehler zu beheben.
          </>
        ),
        p2: "Zugriffsprotokolle werden nur bei Bedarf zur Fehleranalyse oder bei Sicherheitswarnungen eingesehen.",
        legal: {
          label: "Rechtsgrundlage",
          description: "Art. 6 Abs. 1 lit. f DSGVO — berechtigtes Interesse am Betrieb und an der Absicherung der Website.",
        },
      },
      analytics: {
        title: "Analytics",
        p1: "Besucherstatistiken werden mit Vercel Analytics erhoben, wobei IP-Adressen anonymisiert und Standortdaten gekürzt werden.",
        p2: "Analytics liefert aggregierte Kennzahlen (z. B. Gesamtbesuche, beliebte Seiten) ohne Cookies oder Tracking-Skripte.",
        legal: {
          label: "Rechtsgrundlage",
          description: "Art. 6 Abs. 1 lit. f DSGVO — berechtigtes Interesse an Analyse und Performanceverbesserung bei Wahrung der Privatsphäre.",
        },
      },
      cookies: {
        title: "Cookies",
        p1: "Diese Seite setzt keine Tracking-Cookies. Plattformbedingt können nur technisch notwendige Cookies für Sicherheit, Caching oder Sitzungsverwaltung verwendet werden.",
      },
      contact: {
        title: "Kontakt",
        p1: "Bei Kontaktaufnahme (Formular oder E-Mail) werden die angegebenen Daten (Name, E-Mail, Nachricht) ausschließlich zur Bearbeitung der Anfrage und etwaiger Rückfragen verarbeitet.",
        p2: "E-Mails werden über Google LLC (Gmail) abgewickelt. Nachrichten liegen verschlüsselt in Rechenzentren von Google und sind nur für mich zugänglich.",
        legal: {
          label: "Rechtsgrundlage",
          description: "Art. 6 Abs. 1 lit. a DSGVO — Einwilligung; ggf. Art. 6 Abs. 1 lit. b DSGVO — vorvertragliche Maßnahmen auf Ihre Anfrage.",
        },
      },
      github: {
        title: "GitHub-Inhalte",
        p1: (
          <>
            Seiten können Beitrags-Grafiken oder Repository-Widgets von <LinkPreview href="https://github.com" className="link" compact>GitHub, Inc.</LinkPreview> (USA) laden. Dabei wird Ihre IP-Adresse übermittelt. GitHub ist dem EU-US Data Privacy Framework beigetreten.
          </>
        ),
        p2: "GitHub kann funktionale Cookies setzen oder Gerätedaten gemäß eigener Datenschutzerklärung erheben.",
        legal: {
          label: "Rechtsgrundlage",
          description: "Art. 6 Abs. 1 lit. f DSGVO — berechtigtes Interesse an der Darstellung von Open-Source-Aktivität.",
        },
      },
      processors: {
        title: "Auftragsverarbeiter",
        p1: "Die Verarbeitung durch Vercel und Vercel Analytics erfolgt auf Grundlage von Auftragsverarbeitungsverträgen gem. Art. 28 DSGVO bzw. Art. 9 revDSG inklusive Standardvertragsklauseln für internationale Übermittlungen.",
        p2: "Weitere Unterauftragsverarbeiter werden nur bei Bedarf für Infrastruktur oder E-Mail-Hosting eingesetzt und vertraglich verpflichtet.",
      },
      retention: {
        title: "Aufbewahrung",
        lead: "Daten werden gelöscht oder anonymisiert, sobald der Zweck erreicht ist. Aktuelle Aufbewahrungsfristen:",
        entries: [
          {
            item: "Vercel-Server-Logs",
            duration: "Automatische Löschung nach 30 Tagen.",
            detail: "Verwendung ausschließlich für Fehleranalyse und Sicherheitsvorfälle.",
          },
          {
            item: "Aggregierte Analytics-Daten",
            duration: "In anonymisierter Form bis zu 13 Monate gespeichert.",
            detail: "Es werden keine IP-Adressen oder eindeutigen Kennungen gespeichert.",
          },
          {
            item: "Korrespondenz",
            duration: "Bis zu 12 Monate nach der letzten Kommunikation.",
            detail: "Erforderlich für Rückfragen zu Projektanfragen oder rechtliche Verpflichtungen.",
          },
        ],
      },
      security: {
        title: "Sicherheit",
        lead: "Technische und organisatorische Maßnahmen schützen vor unbefugtem Zugriff.",
        measures: [
          "Transportverschlüsselung (HTTPS/TLS) für alle Verbindungen.",
          "Strikte Plattform-Zugriffskontrollen mit Multi-Faktor-Authentifizierung.",
          "Regelmäßige Updates der Abhängigkeiten und Überwachung auf Schwachstellen.",
          "Datenminimierung, sodass nur wenige personenbezogene Daten anfallen.",
        ],
      },
      transfers: {
        title: "Internationale Übermittlungen",
        lead: "Hosting und einzelne Integrationen werden aus den USA betrieben.",
        p1: "Vercel Inc. und GitHub, Inc. nehmen am EU-US Data Privacy Framework teil und stellen Standardvertragsklauseln (SCC) für Übermittlungen aus der Schweiz und der EU bereit.",
        safeguards: [
          "Auftragsverarbeitungsvertrag mit Vercel inklusive SCC und technischer Schutzmaßnahmen.",
          "Übermittlung nur der Metadaten, die für die Bereitstellung erforderlich sind.",
          "E-Mail-Daten verbleiben unter meiner Kontrolle und werden bei Anbietern in der Schweiz oder EU/EWR gespeichert.",
        ],
      },
      sources: {
        title: "Datenquellen",
        p1: "Die meisten personenbezogenen Daten stammen direkt von Ihnen. Technische Metadaten entstehen durch Ihr Gerät und den Browser beim Seitenaufruf.",
      },
      minors: {
        title: "Keine Nutzung durch Minderjährige",
        p1: "Das Portfolio richtet sich an Erwachsene und Geschäftskunden. Informationen von Personen unter 16 Jahren werden nicht bewusst erhoben; bei Kenntnis erfolgt Löschung.",
      },
      automated: {
        title: "Keine automatisierten Entscheidungen",
        p1: "Es findet keine Profilerstellung, Verhaltenswerbung oder automatisierte Entscheidungsfindung mit rechtlichen bzw. ähnlichen Auswirkungen statt.",
      },
      rights: {
        title: "Ihre Rechte",
        p1: "Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit sowie Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen.",
        p2: (
          <>
            Zur Ausübung wenden Sie sich per E-Mail an <a href="mailto:yanis.sebastian.zuercher@gmail.com" className="link">yanis.sebastian.zuercher@gmail.com</a>. In der Schweiz: EDÖB; in der EU: zuständige Aufsichtsbehörde.
          </>
        ),
        items: [
          "Auskunft (Art. 15 DSGVO)",
          "Berichtigung (Art. 16 DSGVO)",
          "Löschung (Art. 17 DSGVO)",
          "Einschränkung (Art. 18 DSGVO)",
          "Datenübertragbarkeit (Art. 20 DSGVO)",
          "Widerspruch (Art. 21 DSGVO)",
        ],
      },
      changes: {
        title: "Änderungen",
        p1: (
          <>
            Diese Erklärung kann sich aufgrund gesetzlicher oder funktionaler Änderungen ändern. Die aktuelle Version finden Sie unter <LinkPreview href="https://sola.ysz.life/privacy" className="link" compact>{"https://sola.ysz.life/privacy"}</LinkPreview>.
          </>
        ),
        p2: "Wesentliche Anpassungen werden im Commit-Verlauf oder in den Release-Hinweisen dokumentiert.",
      },
      impressum: {
        title: "Impressum",
        responsible: "Verantwortlich für diese Website:",
        name: "Yanis Sebastian Zürcher",
        location: "Zürich, Schweiz",
        emailLabel: "E-Mail:",
      },
      back: "Zurück",
    },
    es: {
      pageTitle: "Política de Privacidad",
      lastUpdated: "Última actualización: febrero de 2025",
      intro: {
        title: "Introducción",
        p1: (
          <>
            Este sitio personal (<LinkPreview href="https://sola.ysz.life" className="link" compact>{"https://sola.ysz.life"}</LinkPreview>) presenta mis proyectos y servicios. Este aviso de privacidad cumple con la LPD suiza (revFADP 2023) y el RGPD de la UE, y explica qué datos se tratan y por qué.
          </>
        ),
        controller: "Responsable:",
        controllerVal: "Yanis Sebastian Zürcher, Suiza",
        contact: "Contacto:",
        email: "yanis.sebastian.zuercher@gmail.com",
      },
      summary: {
        title: "Resumen",
        lead: "Mantenemos el tratamiento de datos mínimo y transparente. Lo más importante:",
        points: [
          {
            title: "Sin publicidad ni venta de datos",
            description: "No hay píxeles de seguimiento, scripts de remarketing ni intercambio con redes publicitarias.",
          },
          {
            title: "Solo infraestructura esencial",
            description: "El hosting y la analítica se ejecutan en Vercel (UE/EE. UU.) con contratos de encargo de tratamiento conformes al RGPD.",
          },
          {
            title: "Tú mantienes el control",
            description: "Puedes solicitar copia, rectificación o eliminación de tus datos en cualquier momento escribiéndome.",
          },
        ],
      },
      data: {
        title: "Datos que tratamos",
        lead: "La cantidad de datos personales se limita intencionadamente a lo necesario para operar y proteger el sitio.",
        groups: [
          {
            title: "Automáticamente al visitarnos",
            items: [
              "Registros del servidor de Vercel (dirección IP, agente de usuario, referente, marca temporal, URL solicitada) para asegurar la plataforma y diagnosticar incidencias.",
              "Eventos analíticos agregados en Vercel Analytics (conteo de páginas vistas, región aproximada, tipo de dispositivo/SO) anonimizados antes de almacenarse.",
            ],
          },
          {
            title: "Si te pones en contacto",
            items: [
              "Tu nombre, dirección de correo y el contenido del mensaje que envías.",
              "Cualquier información opcional que proporciones (por ejemplo requisitos del proyecto o archivos adjuntos).",
            ],
          },
          {
            title: "Cuando se cargan los widgets de GitHub",
            items: [
              "Las solicitudes al CDN de GitHub incluyen tu IP y cabeceras técnicas para mostrar los widgets.",
              "GitHub puede registrar estas solicitudes según su propia política de privacidad.",
            ],
          },
        ],
      },
      hosting: {
        title: "Alojamiento",
        p1: (
          <>
            El sitio se sirve mediante <LinkPreview href="https://vercel.com" className="link" compact>Vercel Inc.</LinkPreview>, 340 S Lemon Ave #4133, Walnut, CA 91789, EE. UU. Vercel opera centros de datos en la Unión Europea y Estados Unidos. Los metadatos de conexión (IP, agente de usuario, referente, marca temporal, URL solicitada) se procesan en registros y cachés perimetrales para entregar el sitio, mitigar abusos y depurar incidencias.
          </>
        ),
        p2: "Los registros de acceso solo se revisan cuando es necesario investigar errores o alertas de seguridad.",
        legal: {
          label: "Base jurídica",
          description: "art. 6.1.f RGPD — interés legítimo en operar y proteger el sitio.",
        },
      },
      analytics: {
        title: "Analítica",
        p1: "Las estadísticas se recogen con Vercel Analytics, que anonimiza direcciones IP y reduce los datos de ubicación antes de guardarlos.",
        p2: "La analítica me ayuda a conocer métricas agregadas (por ejemplo visitas totales, páginas más vistas) sin usar cookies ni scripts de seguimiento.",
        legal: {
          label: "Base jurídica",
          description: "art. 6.1.f RGPD — interés legítimo en analizar y mejorar el rendimiento respetando la privacidad.",
        },
      },
      cookies: {
        title: "Cookies",
        p1: "Este sitio no utiliza cookies de seguimiento. La plataforma puede emplear únicamente cookies esenciales cuando sean estrictamente necesarias para seguridad, caché o gestión de sesión.",
      },
      contact: {
        title: "Contacto",
        p1: "Si me contactas (formulario o correo), los datos facilitados (nombre, correo, mensaje) se tratan solo para atender tu solicitud y posibles seguimientos.",
        p2: "El correo se gestiona mediante Google LLC (Gmail). Los mensajes se almacenan cifrados en los centros de datos de Google y solo yo accedo a ellos.",
        legal: {
          label: "Base jurídica",
          description: "art. 6.1.a RGPD — consentimiento; y, en su caso, art. 6.1.b RGPD — medidas precontractuales a petición del interesado.",
        },
      },
      github: {
        title: "Contenido de GitHub",
        p1: (
          <>
            Páginas pueden cargar recursos de <LinkPreview href="https://github.com" className="link" compact>GitHub, Inc.</LinkPreview> (EE. UU.). Se transmite tu IP al solicitar dichos recursos. GitHub participa en el EU-US Data Privacy Framework.
          </>
        ),
        p2: "GitHub puede establecer cookies funcionales o recoger datos del dispositivo según su propio aviso de privacidad.",
        legal: {
          label: "Base jurídica",
          description: "art. 6.1.f RGPD — interés legítimo en mostrar actividad de código abierto.",
        },
      },
      processors: {
        title: "Encargados del tratamiento",
        p1: "Vercel y Vercel Analytics actúan bajo contratos de encargo conformes con el art. 28 RGPD y el art. 9 revFADP, incluyendo cláusulas contractuales tipo para transferencias internacionales.",
        p2: "Solo se incorporan otros subencargados cuando es necesario para infraestructura o correo electrónico, con salvaguardas contractuales.",
      },
      retention: {
        title: "Conservación",
        lead: "Los datos se eliminan o anonimizan una vez cumplida la finalidad. Plazos actuales:",
        entries: [
          {
            item: "Registros del servidor de Vercel",
            duration: "Eliminación automática tras 30 días.",
            detail: "Se usan únicamente para diagnosticar incidencias y seguridad.",
          },
          {
            item: "Métricas analíticas agregadas",
            duration: "Se conservan en forma anonimizada durante 13 meses.",
            detail: "No se guardan direcciones IP ni identificadores únicos.",
          },
          {
            item: "Conversaciones de contacto",
            duration: "Se conservan hasta 12 meses después del último intercambio.",
            detail: "Permite dar seguimiento a solicitudes de proyectos u obligaciones legales.",
          },
        ],
      },
      security: {
        title: "Seguridad",
        lead: "Existen medidas técnicas y organizativas para evitar accesos no autorizados.",
        measures: [
          "Cifrado de transporte (HTTPS/TLS) en todas las conexiones.",
          "Controles estrictos de acceso a la plataforma con autenticación multifactor.",
          "Actualizaciones periódicas de dependencias y monitorización de vulnerabilidades.",
          "Minimización de datos para reducir la cantidad de información personal a proteger.",
        ],
      },
      transfers: {
        title: "Transferencias internacionales",
        lead: "El alojamiento y algunas integraciones operan desde Estados Unidos.",
        p1: "Vercel Inc. y GitHub, Inc. participan en el EU-US Data Privacy Framework y ofrecen Cláusulas Contractuales Tipo (SCC) para cubrir transferencias de datos desde Suiza y la UE.",
        safeguards: [
          "Contratos de tratamiento con Vercel que incluyen SCC y medidas técnicas de protección.",
          "Solo se transmite la metadata mínima necesaria para prestar el servicio.",
          "Tus datos de correo permanecen bajo mi control y se almacenan con proveedores ubicados en Suiza o en la UE/EEE.",
        ],
      },
      sources: {
        title: "Fuentes de datos",
        p1: "La mayoría de los datos personales provienen directamente de ti. La metadata técnica se origina en tu dispositivo y navegador al conectarte al sitio.",
      },
      minors: {
        title: "Sin uso por menores",
        p1: "Este portfolio está dirigido a adultos y clientes profesionales. No recopilo conscientemente información de menores de 16 años; eliminaré esos datos si tengo conocimiento.",
      },
      automated: {
        title: "Sin decisiones automatizadas",
        p1: "No existe perfilado, publicidad conductual ni toma de decisiones automatizada con efectos jurídicos o similares.",
      },
      rights: {
        title: "Tus derechos",
        p1: "Acceso, rectificación, supresión, limitación, portabilidad y oposición a tratamientos basados en intereses legítimos.",
        p2: (
          <>
            Para ejercerlos, escribe a <a href="mailto:yanis.sebastian.zuercher@gmail.com" className="link">yanis.sebastian.zuercher@gmail.com</a>. En Suiza: PFPDT; en la UE: autoridad de control competente.
          </>
        ),
        items: [
          "Acceso (art. 15 RGPD)",
          "Rectificación (art. 16 RGPD)",
          "Supresión (art. 17 RGPD)",
          "Limitación (art. 18 RGPD)",
          "Portabilidad (art. 20 RGPD)",
          "Oposición (art. 21 RGPD)",
        ],
      },
      changes: {
        title: "Cambios",
        p1: (
          <>
            Esta política puede cambiar por motivos legales o funcionales. La versión vigente está en <LinkPreview href="https://sola.ysz.life/privacy" className="link" compact>{"https://sola.ysz.life/privacy"}</LinkPreview>.
          </>
        ),
        p2: "Las actualizaciones importantes se documentan en el historial de commits o en las notas de publicación.",
      },
      impressum: {
        title: "Aviso legal",
        responsible: "Responsable del sitio:",
        name: "Yanis Sebastian Zürcher",
        location: "Zúrich, Suiza",
        emailLabel: "Correo:",
      },
      back: "Volver",
    },
    ja: {
      pageTitle: "プライバシーポリシー",
      lastUpdated: "最終更新日: 2025年2月",
      intro: {
        title: "はじめに",
        p1: (
          <>
            本サイト（<LinkPreview href="https://sola.ysz.life" className="link" compact>{"https://sola.ysz.life"}</LinkPreview>）は私のプロジェクトとサービスを紹介する個人サイトです。本ポリシーはスイス改正データ保護法（revFADP 2023）および EU GDPR に準拠し、どのデータをどの目的で処理するかを説明します。
          </>
        ),
        controller: "管理者:",
        controllerVal: "Yanis Sebastian Zürcher（スイス）",
        contact: "連絡先:",
        email: "yanis.sebastian.zuercher@gmail.com",
      },
      summary: {
        title: "概要",
        lead: "本サイトでのデータ処理は最小限かつ透明性を重視しています。主なポイント:",
        points: [
          {
            title: "広告目的の追跡やデータ販売はなし",
            description: "トラッキングピクセル、リマーケティングスクリプト、広告ネットワークへの提供は行いません。",
          },
          {
            title: "必要最低限のインフラのみ",
            description: "ホスティングと分析は Vercel（EU/米国）上で実施し、GDPR 準拠の契約と保護措置を適用しています。",
          },
          {
            title: "ユーザーによるコントロール",
            description: "いつでもメールでデータの開示、訂正、削除をリクエストできます。",
          },
        ],
      },
      data: {
        title: "取得するデータ",
        lead: "個人データの取得はサイト運営と保護に必要な最小限に抑えています。",
        groups: [
          {
            title: "訪問時に自動的に取得されるもの",
            items: [
              "Vercel のサーバーログ（IP アドレス、ユーザーエージェント、リファラー、タイムスタンプ、閲覧した URL）はプラットフォームの保護と障害解析のために処理されます。",
              "Vercel Analytics の集計イベント（ページビュー数、概算地域、デバイス/OS 種別）は保存前に匿名化されます。",
            ],
          },
          {
            title: "お問い合わせ時",
            items: [
              "お名前、メールアドレス、メッセージ本文。",
              "任意で提供された情報（例: プロジェクト要件や添付ファイル）。",
            ],
          },
          {
            title: "GitHub ウィジェット読み込み時",
            items: [
              "GitHub の CDN へのリクエストには IP アドレスと技術的ヘッダーが含まれ、ウィジェット表示のために送信されます。",
              "GitHub は自社のプライバシーポリシーに基づきこれらのリクエストをログに記録する場合があります。",
            ],
          },
        ],
      },
      hosting: {
        title: "ホスティング",
        p1: (
          <>
            本サイトは <LinkPreview href="https://vercel.com" className="link" compact>Vercel Inc.</LinkPreview>（340 S Lemon Ave #4133, Walnut, CA 91789, USA）で提供されています。Vercel は EU と米国にデータセンターを運用し、接続メタデータ（IP アドレス、ユーザーエージェント、リファラー、タイムスタンプ、要求 URL）をサーバーログやエッジキャッシュで処理して配信・不正対策・障害対応を行います。
          </>
        ),
        p2: "アクセスログはエラー調査またはセキュリティ警告への対応が必要な場合にのみ確認します。",
        legal: {
          label: "法的根拠",
          description: "GDPR 第6条1項(f) — サイト運営と保護に関する正当な利益。",
        },
      },
      analytics: {
        title: "アクセス解析",
        p1: "Vercel Analytics で統計を収集し、IP アドレスは匿名化され、位置情報は保存前に切り捨てられます。",
        p2: "クッキーや追跡スクリプトを使わず、訪問数や人気ページなどの集計指標のみを把握する目的です。",
        legal: {
          label: "法的根拠",
          description: "GDPR 第6条1項(f) — プライバシーを侵害しない範囲で性能を分析・改善する正当な利益。",
        },
      },
      cookies: {
        title: "クッキー",
        p1: "本サイトはトラッキングクッキーを使用しません。必要な場合に限り、ホスティングプラットフォームがセキュリティ・キャッシュ・セッション管理のための必須クッキーを設定することがあります。",
      },
      contact: {
        title: "お問い合わせ",
        p1: "フォームまたはメールでご連絡いただいた場合、提供されたデータ（氏名・メールアドレス・メッセージ）はお問い合わせ対応および必要な連絡にのみ利用します。",
        p2: "メールは Google LLC（Gmail）経由で処理され、暗号化された Google データセンターに保管され、アクセスできるのは私だけです。",
        legal: {
          label: "法的根拠",
          description: "GDPR 第6条1項(a) — 同意、および必要に応じて第6条1項(b) — ユーザーの要請による契約前措置。",
        },
      },
      github: {
        title: "GitHub コンテンツ",
        p1: (
          <>
            一部ページでは <LinkPreview href="https://github.com" className="link" compact>GitHub, Inc.</LinkPreview>（米国）のリソースを読み込みます。取得時に IP アドレスが送信され、GitHub は EU-US Data Privacy Framework に参加しています。
          </>
        ),
        p2: "GitHub は機能的なクッキーを設定したり、デバイス情報を取得したりする場合があり、詳細は同社のプライバシーポリシーに従います。",
        legal: {
          label: "法的根拠",
          description: "GDPR 第6条1項(f) — オープンソース活動を紹介する正当な利益。",
        },
      },
      processors: {
        title: "委託処理者",
        p1: "Vercel と Vercel Analytics との間では GDPR 第28条および revFADP 第9条に準拠したデータ処理契約を締結し、国際移転については標準契約条項（SCC）を適用しています。",
        p2: "必要な場合に限り、インフラやメールホスティングを担う追加のサブプロセッサーを利用し、契約上の保護措置を課しています。",
      },
      retention: {
        title: "保存期間",
        lead: "目的を達したデータは削除または匿名化します。現在の保存期間:",
        entries: [
          {
            item: "Vercel サーバーログ",
            duration: "30日後に自動削除。",
            detail: "障害対応とセキュリティ調査のみに利用します。",
          },
          {
            item: "集計された分析データ",
            duration: "匿名化された状態で最長13か月保存。",
            detail: "IP アドレスや一意の識別子は保持しません。",
          },
          {
            item: "お問い合わせのやり取り",
            duration: "最後の連絡から最長12か月。",
            detail: "プロジェクト対応や法的義務のために必要な範囲で保持します。",
          },
        ],
      },
      security: {
        title: "セキュリティ",
        lead: "無断アクセスを防ぐため、技術的・組織的な対策を講じています。",
        measures: [
          "すべての通信を HTTPS/TLS で暗号化。",
          "多要素認証を用いた厳格なプラットフォームアクセス管理。",
          "依存関係の定期的なアップデートと脆弱性モニタリング。",
          "そもそも扱う個人データを最小限にするデータ最小化の実践。",
        ],
      },
      transfers: {
        title: "国際的なデータ移転",
        lead: "ホスティングや一部の連携機能は米国で運用されています。",
        p1: "Vercel Inc. と GitHub, Inc. は EU-US Data Privacy Framework に参加しており、スイスおよび EU からの移転をカバーする標準契約条項（SCC）を提供しています。",
        safeguards: [
          "SCC と技術的保護措置を含む Vercel とのデータ処理契約。",
          "サービス提供に必要な最小限のメタデータのみを送信。",
          "メールデータは私の管理下にあり、スイスまたは EU/EAA 内のプロバイダーに保管されます。",
        ],
      },
      sources: {
        title: "データの出所",
        p1: "個人データの大部分はユーザーご本人から提供されます。技術的メタデータは、サイト接続時に利用端末とブラウザから生成されます。",
      },
      minors: {
        title: "未成年者の利用について",
        p1: "本ポートフォリオは成人およびプロフェッショナル向けです。16歳未満の方の情報を意図的に収集することはなく、判明した場合は削除します。",
      },
      automated: {
        title: "自動化された意思決定はありません",
        p1: "法的または同等の影響を及ぼすプロファイリングや自動意思決定、行動広告は行っていません。",
      },
      rights: {
        title: "ユーザーの権利",
        p1: "アクセス権、訂正・削除、処理の制限、データポータビリティ、正当な利益に基づく処理への異議申立てなどが可能です。",
        p2: (
          <>
            権利行使は <a href="mailto:yanis.sebastian.zuercher@gmail.com" className="link">yanis.sebastian.zuercher@gmail.com</a> へメールでご連絡ください。スイス: FDPIC、EU: 所轄監督機関に苦情を申し立てることができます。
          </>
        ),
        items: [
          "アクセス権（GDPR 第15条）",
          "訂正（第16条）",
          "削除（第17条）",
          "処理の制限（第18条）",
          "データポータビリティ（第20条）",
          "異議申立て（第21条）",
        ],
      },
      changes: {
        title: "変更",
        p1: (
          <>
            法令や機能変更に伴い改定される場合があります。最新版は <LinkPreview href="https://sola.ysz.life/privacy" className="link" compact>{"https://sola.ysz.life/privacy"}</LinkPreview> に掲載します。
          </>
        ),
        p2: "重要な更新内容はコミット履歴またはリリースノートで確認できます。",
      },
      impressum: {
        title: "インプリント",
        responsible: "本サイトの責任者:",
        name: "Yanis Sebastian Zürcher",
        location: "スイス・チューリッヒ",
        emailLabel: "メール:",
      },
      back: "戻る",
    },
    zh: {
      pageTitle: "隐私政策",
      lastUpdated: "最后更新：2025年2月",
      intro: {
        title: "简介",
        p1: (
          <>
            本个人网站（<LinkPreview href="https://sola.ysz.life" className="link" compact>{"https://sola.ysz.life"}</LinkPreview>）用于展示我的项目与服务。本隐私声明遵循瑞士新版数据保护法（revFADP 2023）与欧盟 GDPR，说明会处理哪些数据以及原因。
          </>
        ),
        controller: "数据控制者：",
        controllerVal: "Yanis Sebastian Zürcher（瑞士）",
        contact: "联系：",
        email: "yanis.sebastian.zuercher@gmail.com",
      },
      summary: {
        title: "概览",
        lead: "我们保持数据处理尽量精简并确保透明。要点如下：",
        points: [
          {
            title: "不做广告或贩卖数据",
            description: "没有跟踪像素、再营销脚本，也不会与广告网络共享数据。",
          },
          {
            title: "仅使用必要的基础设施",
            description: "托管和分析运行在 Vercel（欧盟/美国），并签署符合 GDPR 的数据处理协议与安全措施。",
          },
          {
            title: "你始终掌握主动权",
            description: "你可随时通过邮件索取、纠正或删除你的数据。",
          },
        ],
      },
      data: {
        title: "我们处理的数据",
        lead: "个人数据的收集被刻意限制在运行和保护网站所需的最低范围内。",
        groups: [
          {
            title: "访问网站时自动产生",
            items: [
              "Vercel 的服务器日志（IP 地址、用户代理、来源页面、时间戳、访问的 URL），用于保障平台安全并排查故障。",
              "Vercel Analytics 的汇总事件（页面浏览量、概略地区、设备/系统类型），在存储前会被匿名化。",
            ],
          },
          {
            title: "当你联系我",
            items: [
              "你提供的姓名、邮箱地址以及消息内容。",
              "任何自愿提交的额外信息（如项目需求、附件等）。",
            ],
          },
          {
            title: "加载 GitHub 小组件时",
            items: [
              "发往 GitHub CDN 的请求会包含你的 IP 地址和技术性请求头，以便显示组件。",
              "GitHub 可能依据其隐私政策记录这些请求。",
            ],
          },
        ],
      },
      hosting: {
        title: "托管",
        p1: (
          <>
            网站托管于 <LinkPreview href="https://vercel.com" className="link" compact>Vercel Inc.</LinkPreview>（340 S Lemon Ave #4133, Walnut, CA 91789, USA）。Vercel 在欧盟和美国运营数据中心，会在服务器日志与边缘缓存中处理连接元数据（IP、用户代理、来源、时间戳、请求 URL），用于内容分发、防止滥用与排障。
          </>
        ),
        p2: "仅在排查错误或处理安全警报时才会查看访问日志。",
        legal: {
          label: "法律依据",
          description: "GDPR 第6条第1款(f)：基于运营与保护网站的合法利益。",
        },
      },
      analytics: {
        title: "分析",
        p1: "使用 Vercel Analytics 收集访问统计，IP 会被匿名化，位置信息在存储前会被截断。",
        p2: "这些分析仅提供汇总指标（如访问量、热门页面），不使用 Cookie 或跟踪脚本。",
        legal: {
          label: "法律依据",
          description: "GDPR 第6条第1款(f)：在不侵犯隐私的情况下分析与优化性能的合法利益。",
        },
      },
      cookies: {
        title: "Cookie",
        p1: "本站不使用跟踪性 Cookie。托管平台仅在安全、缓存或会话管理确有必要时设置必需的 Cookie。",
      },
      contact: {
        title: "联系我",
        p1: "当你通过表单或电子邮件联系我时，你提供的姓名、邮箱与消息仅用于处理请求和后续沟通。",
        p2: "邮件由 Google LLC（Gmail）提供，消息会加密存储在 Google 数据中心，仅由我访问。",
        legal: {
          label: "法律依据",
          description: "GDPR 第6条第1款(a)：同意；必要时依据第6条第1款(b)：根据你的请求采取的合同前措施。",
        },
      },
      github: {
        title: "GitHub 内容",
        p1: (
          <>
            部分页面会从 <LinkPreview href="https://github.com" className="link" compact>GitHub, Inc.</LinkPreview>（美国）加载资源，请求时会传输你的 IP。GitHub 参与 EU-US Data Privacy Framework。
          </>
        ),
        p2: "GitHub 可能按照其隐私声明设置功能性 Cookie 或收集设备信息。",
        legal: {
          label: "法律依据",
          description: "GDPR 第6条第1款(f)：展示开源活动的合法利益。",
        },
      },
      processors: {
        title: "受托处理方",
        p1: "Vercel 与 Vercel Analytics 根据 GDPR 第28条和 revFADP 第9条签署数据处理协议，并通过标准合同条款（SCC）保障跨境传输。",
        p2: "仅在确有必要时才会引入其他基础设施或邮件托管的分包商，并要求其遵守合同保障。",
      },
      retention: {
        title: "保存期限",
        lead: "达到原始目的后会删除或匿名化数据。当前期限如下：",
        entries: [
          {
            item: "Vercel 服务器日志",
            duration: "30 天后自动删除。",
            detail: "仅用于排障和安全调查。",
          },
          {
            item: "汇总分析指标",
            duration: "匿名化形式保存长达 13 个月。",
            detail: "不保留原始 IP 或唯一标识符。",
          },
          {
            item: "联系往来记录",
            duration: "在最后一次沟通后最长保留 12 个月。",
            detail: "用于跟进项目请求或履行法律义务。",
          },
        ],
      },
      security: {
        title: "安全措施",
        lead: "我们采用技术和管理手段防止未授权访问。",
        measures: [
          "所有连接均使用 HTTPS/TLS 传输加密。",
          "平台访问采用严格的权限控制和多因素认证。",
          "定期更新依赖并监测安全漏洞。",
          "坚持数据最小化原则，尽量减少需保护的个人信息。",
        ],
      },
      transfers: {
        title: "跨境传输",
        lead: "托管及部分集成功能由位于美国的服务提供。",
        p1: "Vercel Inc. 与 GitHub, Inc. 参与 EU-US Data Privacy Framework，并提供适用于瑞士和欧盟数据传输的标准合同条款（SCC）。",
        safeguards: [
          "与 Vercel 签署包含 SCC 及技术保护措施的数据处理协议。",
          "仅传输提供服务所需的最低限度元数据。",
          "邮件数据由我直接控制，并存放在位于瑞士或欧盟/欧洲经济区的服务商。",
        ],
      },
      sources: {
        title: "数据来源",
        p1: "大部分个人数据直接来自你本人；技术元数据则在你访问网站时由设备和浏览器产生。",
      },
      minors: {
        title: "未成年人",
        p1: "本作品集面向成年人和专业客户，不会主动收集16岁以下人士的信息；如发现此类数据会立即删除。",
      },
      automated: {
        title: "不进行自动化决策",
        p1: "不会进行画像分析、行为广告或产生法律等重大影响的自动化决策。",
      },
      rights: {
        title: "你的权利",
        p1: "你可以行使访问、更正、删除、限制处理、数据可携以及对基于合法利益的处理提出反对。",
        p2: (
          <>
            行使权利请发送邮件至 <a href="mailto:yanis.sebastian.zuercher@gmail.com" className="link">yanis.sebastian.zuercher@gmail.com</a>。瑞士居民可联系 FDPIC，欧盟居民可向主管监管机构投诉。
          </>
        ),
        items: [
          "访问权（第15条）",
          "更正权（第16条）",
          "删除权（第17条）",
          "限制处理权（第18条）",
          "数据可携权（第20条）",
          "反对权（第21条）",
        ],
      },
      changes: {
        title: "变更",
        p1: (
          <>
            因法律或功能调整，本政策可能更新。最新版请参见 <LinkPreview href="https://sola.ysz.life/privacy" className="link" compact>{"https://sola.ysz.life/privacy"}</LinkPreview>。
          </>
        ),
        p2: "重要更新会记录在项目的提交历史或版本说明中。",
      },
      impressum: {
        title: "法律声明",
        responsible: "网站负责人：",
        name: "Yanis Sebastian Zürcher",
        location: "瑞士，苏黎世",
        emailLabel: "邮箱：",
      },
      back: "返回",
    },
  } as const;

  // last updated utilities
  const LAST_UPDATED_ISO = "2025-02-14"; // update when content meaningfully changes
  const localeMap: Record<typeof language, string> = {
    en: "en-US",
    de: "de-CH",
    es: "es-ES",
    ja: "ja-JP",
    zh: "zh-CN",
  };
  const updatedDate = new Date(LAST_UPDATED_ISO);
  const formattedUpdated = updatedDate.toLocaleDateString(localeMap[language], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const updatedLabel = {
    en: "Updated",
    de: "Aktualisiert",
    es: "Actualizado",
    ja: "更新",
    zh: "已更新",
  }[language];

  const h = () => {
    n(-1);
  };

  // bespoke motion variants
  const fadeUp = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.04 * i } }),
  } as const;
  const cardIn = {
    hidden: { opacity: 0, scale: 0.985 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.45 } },
  } as const;
  const trail = (index: number) => ({ custom: index, variants: fadeUp, initial: "hidden", animate: "visible" as const });

  return (
    <AnimatePresence>
      {isLoaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="min-h-screen bg-gradient-to-b from-background to-background/40 p-4 sm:p-6 lg:p-8"
        >
          <Helmet>
            <title>{t.seo.privacy.title}</title>
            <meta name="description" content={t.seo.privacy.description} />
          </Helmet>

          <div className="max-w-7xl mx-auto">
            <div className="max-w-4xl mx-auto">
              <motion.div {...trail(1)} className="mb-8">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to="/">
                          <span className="text-muted-foreground hover:text-primary transition-colors">{t.common.home}</span>
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{t.footer.privacy}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </motion.div>
            </div>

            <motion.div {...trail(2)} className="mb-16 text-center">
              <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4 tracking-tight mt-10">
                {L[language].pageTitle}
              </h1>
              <div className="mt-8 flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border/60 bg-background/60 px-2.5 py-1 text-[0.70rem]/[1rem] text-foreground/60 backdrop-blur-sm">
                  {updatedLabel}: <span className="bg-gradient-to-r from-foreground/60 via-primary to-foreground/60 bg-[length:200%_100%] bg-clip-text text-transparent animate-shine">{formattedUpdated}</span>
                </span>
              </div>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {/* Intro card */}
                <motion.section id="introduction" variants={cardIn} initial="hidden" animate="visible" className="rounded-xl border bg-card/60 backdrop-blur-sm p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].intro.title}</h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>{L[language].intro.p1}</p>
                    <p>
                      <strong className="text-foreground">{L[language].intro.controller}</strong> {L[language].intro.controllerVal}
                      <br />
                      <strong className="text-foreground">{L[language].intro.contact}</strong>{" "}
                      <a href="mailto:yanis.sebastian.zuercher@gmail.com" className="link">
                        {L[language].intro.email}
                      </a>
                    </p>
                  </div>
                </motion.section>

                {/* Summary */}
                <motion.section id="summary" variants={cardIn} initial="hidden" animate="visible" className="rounded-xl border bg-card/60 backdrop-blur-sm p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].summary.title}</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">{L[language].summary.lead}</p>
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {L[language].summary.points.map((point) => (
                      <div key={point.title} className="rounded-lg border border-border/50 bg-background/80 p-4 shadow-sm">
                        <h3 className="text-sm font-semibold text-foreground">{point.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{point.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>

                {/* Data overview */}
                <motion.section id="data" variants={cardIn} initial="hidden" animate="visible" className="rounded-xl border bg-card/60 backdrop-blur-sm p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].data.title}</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">{L[language].data.lead}</p>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {L[language].data.groups.map((group) => (
                      <div key={group.title} className="rounded-lg border border-border/60 bg-background/70 p-4">
                        <h3 className="text-sm font-semibold text-foreground">{group.title}</h3>
                        <ul className="mt-3 space-y-2 text-sm text-muted-foreground leading-relaxed">
                          {group.items.map((item) => (
                            <li key={item} className="flex gap-2">
                              <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-primary/60" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </motion.section>

                {/* Hosting & analytics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.section id="hosting" variants={cardIn} initial="hidden" animate="visible" className="rounded-xl border bg-card/60 backdrop-blur-sm p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].hosting.title}</h2>
                    <p className="text-muted-foreground leading-relaxed text-base">{L[language].hosting.p1}</p>
                    {L[language].hosting.p2 && <p className="text-muted-foreground leading-relaxed text-base mt-3">{L[language].hosting.p2}</p>}
                    <p className="text-muted-foreground leading-relaxed text-base mt-3">
                      <strong className="text-foreground">{L[language].hosting.legal.label}:</strong> {L[language].hosting.legal.description}
                    </p>
                  </motion.section>

                  <motion.section id="analytics" variants={cardIn} initial="hidden" animate="visible" className="rounded-xl border bg-card/60 backdrop-blur-sm p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].analytics.title}</h2>
                    <p className="text-muted-foreground leading-relaxed text-base">{L[language].analytics.p1}</p>
                    {L[language].analytics.p2 && <p className="text-muted-foreground leading-relaxed text-base mt-3">{L[language].analytics.p2}</p>}
                    <p className="text-muted-foreground leading-relaxed text-base mt-3">
                      <strong className="text-foreground">{L[language].analytics.legal.label}:</strong> {L[language].analytics.legal.description}
                    </p>
                  </motion.section>
                </div>

                <motion.section id="cookies" variants={cardIn} initial="hidden" animate="visible" className="rounded-xl border bg-card/60 backdrop-blur-sm p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].cookies.title}</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">{L[language].cookies.p1}</p>
                </motion.section>

                {/* Contact & GitHub */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.section id="contact" variants={cardIn} initial="hidden" animate="visible" className="rounded-xl border bg-card/60 backdrop-blur-sm p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].contact.title}</h2>
                    <p className="text-muted-foreground leading-relaxed text-base">{L[language].contact.p1}</p>
                    {L[language].contact.p2 && <p className="text-muted-foreground leading-relaxed text-base mt-3">{L[language].contact.p2}</p>}
                    <p className="text-muted-foreground leading-relaxed text-base mt-3">
                      <strong className="text-foreground">{L[language].contact.legal.label}:</strong> {L[language].contact.legal.description}
                    </p>
                  </motion.section>

                  <motion.section id="github" variants={cardIn} initial="hidden" animate="visible" className="rounded-xl border bg-card/60 backdrop-blur-sm p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].github.title}</h2>
                    <p className="text-muted-foreground leading-relaxed text-base">{L[language].github.p1}</p>
                    {L[language].github.p2 && <p className="text-muted-foreground leading-relaxed text-base mt-3">{L[language].github.p2}</p>}
                    <p className="text-muted-foreground leading-relaxed text-base mt-3">
                      <strong className="text-foreground">{L[language].github.legal.label}:</strong> {L[language].github.legal.description}
                    </p>
                  </motion.section>
                </div>

                <motion.section id="processors" variants={cardIn} initial="hidden" animate="visible" className="rounded-xl border bg-card/60 backdrop-blur-sm p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].processors.title}</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">{L[language].processors.p1}</p>
                  {L[language].processors.p2 && <p className="text-muted-foreground leading-relaxed text-base mt-3">{L[language].processors.p2}</p>}
                </motion.section>

                <motion.section id="retention" variants={cardIn} initial="hidden" animate="visible" className="rounded-xl border bg-card/60 backdrop-blur-sm p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].retention.title}</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">{L[language].retention.lead}</p>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {L[language].retention.entries.map((entry) => (
                      <div key={entry.item} className="rounded-lg border border-border/60 bg-background/70 p-4">
                        <h3 className="text-sm font-semibold text-foreground">{entry.item}</h3>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{entry.duration}</p>
                        <p className="text-xs text-muted-foreground/80 mt-2 leading-relaxed">{entry.detail}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>

                <motion.section id="security" variants={cardIn} initial="hidden" animate="visible" className="rounded-xl border bg-card/60 backdrop-blur-sm p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].security.title}</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">{L[language].security.lead}</p>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground leading-relaxed">
                    {L[language].security.measures.map((measure) => (
                      <li key={measure} className="flex gap-2">
                        <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-primary/60" />
                        <span>{measure}</span>
                      </li>
                    ))}
                  </ul>
                </motion.section>

                <motion.section id="transfers" variants={cardIn} initial="hidden" animate="visible" className="rounded-xl border bg-card/60 backdrop-blur-sm p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].transfers.title}</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">{L[language].transfers.lead}</p>
                  <p className="text-muted-foreground leading-relaxed text-base mt-3">{L[language].transfers.p1}</p>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground leading-relaxed">
                    {L[language].transfers.safeguards.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-primary/60" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.section>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.section id="sources" variants={cardIn} initial="hidden" animate="visible" className="rounded-xl border bg-card/60 backdrop-blur-sm p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].sources.title}</h2>
                    <p className="text-muted-foreground leading-relaxed text-base">{L[language].sources.p1}</p>
                  </motion.section>
                  <motion.section id="minors" variants={cardIn} initial="hidden" animate="visible" className="rounded-xl border bg-card/60 backdrop-blur-sm p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].minors.title}</h2>
                    <p className="text-muted-foreground leading-relaxed text-base">{L[language].minors.p1}</p>
                  </motion.section>
                  <motion.section id="automated" variants={cardIn} initial="hidden" animate="visible" className="rounded-xl border bg-card/60 backdrop-blur-sm p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].automated.title}</h2>
                    <p className="text-muted-foreground leading-relaxed text-base">{L[language].automated.p1}</p>
                  </motion.section>
                </div>

                <motion.section id="rights" variants={cardIn} initial="hidden" animate="visible" className="rounded-xl border bg-card/60 backdrop-blur-sm p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].rights.title}</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">{L[language].rights.p1}</p>
                  {Array.isArray((L as any)[language]?.rights?.items) && (
                    <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      {((L as any)[language].rights.items as string[]).map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {L[language].rights.p2 && <p className="text-muted-foreground leading-relaxed text-base mt-4">{L[language].rights.p2}</p>}
                </motion.section>

                <motion.section id="changes" variants={cardIn} initial="hidden" animate="visible" className="rounded-xl border bg-card/60 backdrop-blur-sm p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].changes.title}</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">{L[language].changes.p1}</p>
                  {L[language].changes.p2 && <p className="text-muted-foreground leading-relaxed text-base mt-3">{L[language].changes.p2}</p>}
                </motion.section>

                <Separator className="my-12" />

                <motion.section id="impressum" variants={cardIn} initial="hidden" animate="visible" className="rounded-xl border  backdrop-blur-sm p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].impressum.title}</h2>
                  <div className="text-muted-foreground leading-relaxed space-y-2 text-base">
                    <p>
                      <span className="font-semibold text-foreground">{L[language].impressum.responsible}</span>
                    </p>
                    <p>{L[language].impressum.name}</p>
                    <p>{L[language].impressum.location}</p>
                    <p>
                      <span className="font-semibold text-foreground">{L[language].impressum.emailLabel}</span> <a href="mailto:yanis.sebastian.zuercher@gmail.com" className="link">yanis.sebastian.zuercher@gmail.com</a>
                    </p>
                  </div>
                </motion.section>
              </div>

              <motion.div {...trail(20)} className="mt-16 pt-8 border-t border-border" onClick={h}>
                <IconButton
                  icon={<ArrowLeft className="w-4 h-4" />}
                  variant="ghost"
                  size="sm"
                  iconPosition="left"
                  className="inline-flex items-center gap-2 text-sm "
                >
                  {L[language].back}
                </IconButton>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Privacy;
