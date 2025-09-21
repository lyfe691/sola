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
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { LinkPreview } from "@/components/ui/link-preview";
import { IconButton } from "@/components/ui/custom/IconButton";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
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
            This personal portfolio website ( <LinkPreview href="https://sola.ysz.life" className="link" compact>{"https://sola.ysz.life"}</LinkPreview> ) showcases my projects and freelance services. This privacy policy complies with the Swiss Federal Act on Data Protection (revFADP 2023) and the EU General Data Protection Regulation (GDPR) and explains what data are processed and why.
          </>
        ),
        controller: "Data Controller:",
        controllerVal: "Yanis Sebastian Zürcher, Switzerland",
        contact: "Contact:",
        email: "yanis.sebastian.zuercher@gmail.com",
      },
      quickNav: {
        title: "Jump to a section",
      },
      summary: {
        title: "At a glance",
        description: "Key facts about how this site handles personal data.",
        items: [
          "No advertising or behavioural tracking cookies are stored on your device.",
          "Visitor metrics rely on Vercel Analytics with anonymised IP addresses and aggregated reports.",
          "Server logs containing IP addresses are automatically deleted by Vercel after 30 days.",
          "Contact enquiries are handled manually and removed once finished or within 12 months.",
        ],
      },
      hosting: {
        title: "Hosting",
        p1: (
          <>
            The site is hosted by <LinkPreview href="https://vercel.com" className="link" compact>Vercel Inc.</LinkPreview>, 340 S Lemon Ave #4133, Walnut, CA 91789, USA. Vercel stores connection data (e.g., IP address, browser type, access time) in server logs to deliver the website securely and reliably.
          </>
        ),
        p2: "Servers may be located in the EU or USA. Vercel provides contractual safeguards (Data Processing Agreement, Standard Contractual Clauses, and participation in the EU–US Data Privacy Framework).",
        legal: "Legal basis: Art. 6(1)(f) GDPR — legitimate interests in operating and safeguarding the site.",
      },
      analytics: {
        title: "Analytics",
        p1: "Visitor statistics are collected with Vercel Analytics. Data are anonymised prior to storage; no cookies or cross-site identifiers are set.",
        p2: "The resulting reports are aggregated and do not allow me to identify individual visitors.",
        legal: "Legal basis: Art. 6(1)(f) GDPR — legitimate interests in analysing and improving performance without infringing on privacy.",
      },
      dataRetention: {
        title: "Data Retention",
        p1: "Data are kept only for as long as necessary to provide the site and respond to enquiries.",
        items: [
          "Vercel deletes server logs that contain IP addresses after 30 days.",
          "Aggregated analytics data do not include personal identifiers and are stored for long-term trend analysis.",
          "Contact emails are stored securely and removed once the conversation is closed or after 12 months, whichever comes first.",
        ],
        legal: "Legal basis: Art. 5(1)(e) GDPR — storage limitation.",
      },
      security: {
        title: "Data Security",
        p1: "Technical and organisational measures protect the data processed through this site.",
        items: [
          "TLS encryption for every connection to sola.ysz.life.",
          "Access to hosting and analytics dashboards is limited to me with protected accounts.",
          "Regular updates of dependencies and infrastructure to address security patches.",
          "Data minimisation by avoiding user accounts, trackers, or unnecessary metadata.",
        ],
      },
      cookies: {
        title: "Cookies",
        p1: "This site does not set tracking cookies. Essential cookies may be used by the hosting platform only where strictly necessary for security and delivery.",
        p2: "If Vercel sets such essential cookies, they are controlled by the platform and are not used for profiling.",
      },
      contact: {
        title: "Contact",
        p1: "If you contact me (form or email), the data you provide (name, email, message) are processed solely to handle your enquiry and possible follow-ups.",
        p2: "You can withdraw your consent at any time—simply reply or email me and I will delete the conversation.",
        legal: "Legal basis: Art. 6(1)(a) GDPR — consent; and, where relevant, Art. 6(1)(b) GDPR — pre-contractual steps at your request.",
        cta: "Write an email",
      },
      github: {
        title: "GitHub Content",
        p1: (
          <>
            Pages may fetch contribution graphs or repository widgets from <LinkPreview href="https://github.com" className="link" compact>GitHub, Inc.</LinkPreview> (USA). Your IP address is transmitted when these resources are requested. GitHub participates in the EU–US Data Privacy Framework.
          </>
        ),
        p2: "No GitHub cookies are stored; the embed loads only when the relevant components are visible.",
        legal: "Legal basis: Art. 6(1)(f) GDPR — legitimate interests in presenting open-source activity.",
      },
      transfers: {
        title: "International Transfers",
        p1: "Using infrastructure and integrations hosted in the United States may involve transferring personal data outside Switzerland/EU.",
        items: [
          "Vercel relies on the EU–US Data Privacy Framework and Standard Contractual Clauses, including the Swiss addendum.",
          "GitHub participates in the EU–US Data Privacy Framework for any resources embedded on this site.",
        ],
        p2: "If these safeguards change, I will pause the transfer or implement additional protective measures.",
        legal: "Legal basis: Art. 46 GDPR — appropriate safeguards for international transfers.",
      },
      processors: {
        title: "Processors",
        p1: "Processing by Vercel and Vercel Analytics is governed by data-processing agreements compliant with Art. 28 GDPR and Art. 9 revFADP.",
        p2: "I review these agreements at least annually to ensure they remain up to date.",
      },
      thirdParty: {
        title: "Third-party Links",
        p1: "This portfolio may reference external sites or services. Their content and privacy practices are outside my control.",
        p2: "Please review the respective privacy policies before sharing personal data with third parties.",
      },
      rights: {
        title: "Your Rights",
        p1: "You may request access, rectification, erasure, restriction, data portability, or object to processing based on legitimate interests.",
        p2: (
          <>
            To exercise these rights, email <a href="mailto:yanis.sebastian.zuercher@gmail.com" className="link">yanis.sebastian.zuercher@gmail.com</a>. Swiss residents may contact the FDPIC; EU residents may lodge a complaint with a competent supervisory authority.
          </>
        ),
        p3: "Consent can be withdrawn at any time; I will confirm the outcome promptly.",
        items: [
          "Access to your data (Art. 15 GDPR)",
          "Rectification (Art. 16 GDPR)",
          "Erasure (Art. 17 GDPR)",
          "Restriction of processing (Art. 18 GDPR)",
          "Data portability (Art. 20 GDPR)",
          "Objection to legitimate interests (Art. 21 GDPR)",
        ],
      },
      children: {
        title: "Children’s Privacy",
        p1: "This website targets clients and collaborators and is not intended for children under 16.",
        p2: "If you believe a minor has shared personal data, contact me so I can delete it.",
      },
      changes: {
        title: "Changes",
        p1: (
          <>
            This policy may change due to legal or functional updates. The current version is available at <LinkPreview href="https://sola.ysz.life/privacy" className="link" compact>{"https://sola.ysz.life/privacy"}</LinkPreview>.
          </>
        ),
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
            Diese persönliche Portfolio‑Website ( <LinkPreview href="https://sola.ysz.life" className="link" compact>{"https://sola.ysz.life"}</LinkPreview> ) stellt Projekte und freiberufliche Leistungen vor. Diese Erklärung entspricht dem revDSG (2023) und der EU‑DSGVO und erläutert, welche Daten zu welchem Zweck verarbeitet werden.
          </>
        ),
        controller: "Verantwortlicher:",
        controllerVal: "Yanis Sebastian Zürcher, Schweiz",
        contact: "Kontakt:",
        email: "yanis.sebastian.zuercher@gmail.com",
      },
      quickNav: {
        title: "Direkt zu einem Abschnitt",
      },
      summary: {
        title: "Auf einen Blick",
        description: "Wichtigste Fakten zur Datenverarbeitung auf dieser Seite.",
        items: [
          "Keine Werbe- oder Tracking-Cookies werden auf Ihrem Gerät gespeichert.",
          "Besuchermetriken nutzen Vercel Analytics mit anonymisierten IP-Adressen und aggregierten Berichten.",
          "Server-Logs mit IP-Adressen werden von Vercel nach 30 Tagen automatisch gelöscht.",
          "Kontaktanfragen werden manuell bearbeitet und nach Abschluss oder spätestens nach 12 Monaten entfernt.",
        ],
      },
      hosting: {
        title: "Hosting",
        p1: (
          <>
            Das Hosting erfolgt bei <LinkPreview href="https://vercel.com" className="link" compact>Vercel Inc.</LinkPreview>, 340 S Lemon Ave #4133, Walnut, CA 91789, USA. Vercel speichert Verbindungsdaten (z. B. IP‑Adresse, Browsertyp, Zugriffszeit) in Server-Logs, um die Website sicher und zuverlässig bereitzustellen.
          </>
        ),
        p2: "Server können sich in der EU oder den USA befinden. Vercel stellt vertragliche Garantien bereit (Auftragsverarbeitungsvertrag, Standardvertragsklauseln und Teilnahme am EU–US Data Privacy Framework).",
        legal: "Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO — berechtigtes Interesse am Betrieb und an der Absicherung der Website.",
      },
      analytics: {
        title: "Analytics",
        p1: "Besucherstatistiken werden mit Vercel Analytics erhoben. Die Daten werden vor Speicherung anonymisiert; es werden keine Cookies oder Cross‑Site-Identifier gesetzt.",
        p2: "Die Auswertungen sind aggregiert und erlauben keinen Rückschluss auf einzelne Besuchende.",
        legal: "Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO — berechtigtes Interesse an Analyse und Performanceverbesserung bei Wahrung der Privatsphäre.",
      },
      dataRetention: {
        title: "Aufbewahrungsdauer",
        p1: "Daten werden nur so lange gespeichert, wie es für den Betrieb der Website oder die Beantwortung von Anfragen erforderlich ist.",
        items: [
          "Vercel löscht Server-Logs mit IP-Adressen nach 30 Tagen.",
          "Aggregierte Analytics-Daten enthalten keine personenbezogenen Kennungen und dienen ausschließlich der Trendanalyse.",
          "Kontakt-E-Mails werden sicher gespeichert und nach Abschluss der Kommunikation oder spätestens nach 12 Monaten gelöscht.",
        ],
        legal: "Rechtsgrundlage: Art. 5 Abs. 1 lit. e DSGVO — Speicherbegrenzung.",
      },
      security: {
        title: "Datensicherheit",
        p1: "Ich setze technische und organisatorische Maßnahmen ein, um verarbeitete Daten zu schützen.",
        items: [
          "TLS-Verschlüsselung für alle Verbindungen zu sola.ysz.life.",
          "Zugriff auf Hosting- und Analyseoberflächen ausschließlich durch mich mit geschützten Konten.",
          "Regelmäßige Updates der eingesetzten Software und Abhängigkeiten.",
          "Datenminimierung durch Verzicht auf Konten, Tracker oder unnötige Metadaten.",
        ],
      },
      cookies: {
        title: "Cookies",
        p1: "Diese Seite setzt keine Tracking-Cookies. Plattformbedingt können nur technisch notwendige Cookies für Sicherheit und Auslieferung verwendet werden.",
        p2: "Sofern Vercel solche notwendigen Cookies setzt, werden sie ausschließlich durch die Plattform verwaltet und nicht zum Profiling genutzt.",
      },
      contact: {
        title: "Kontakt",
        p1: "Bei Kontaktaufnahme (Formular oder E-Mail) werden die angegebenen Daten (Name, E-Mail, Nachricht) ausschließlich zur Bearbeitung der Anfrage und etwaiger Rückfragen verarbeitet.",
        p2: "Sie können Ihre Einwilligung jederzeit widerrufen; ich lösche die Kommunikation und bestätige den Abschluss.",
        legal: "Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO — Einwilligung; ggf. Art. 6 Abs. 1 lit. b DSGVO — vorvertragliche Maßnahmen auf Ihre Anfrage.",
        cta: "E-Mail schreiben",
      },
      github: {
        title: "GitHub‑Inhalte",
        p1: (
          <>
            Seiten können Beitrags‑Grafiken oder Repository‑Widgets von <LinkPreview href="https://github.com" className="link" compact>GitHub, Inc.</LinkPreview> (USA) laden. Dabei wird Ihre IP‑Adresse übermittelt. GitHub ist dem EU‑US Data Privacy Framework beigetreten.
          </>
        ),
        p2: "Es werden keine GitHub-Cookies gesetzt; die Einbindung erfolgt nur beim Aufruf der jeweiligen Komponenten.",
        legal: "Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO — berechtigtes Interesse an der Darstellung von Open‑Source‑Aktivität.",
      },
      transfers: {
        title: "Internationale Übermittlungen",
        p1: "Durch den Einsatz von Infrastruktur- und Integrationsanbietern in den USA können personenbezogene Daten in Länder außerhalb der Schweiz/EU übermittelt werden.",
        items: [
          "Vercel stützt sich auf das EU–US Data Privacy Framework sowie auf Standardvertragsklauseln (inklusive Swiss Addendum).",
          "GitHub nimmt am EU–US Data Privacy Framework teil, wenn Beiträge oder Widgets angezeigt werden.",
        ],
        p2: "Sollten diese Garantien entfallen, pausiere ich die Übermittlung oder implementiere zusätzliche Schutzmaßnahmen.",
        legal: "Rechtsgrundlage: Art. 46 DSGVO — geeignete Garantien.",
      },
      processors: {
        title: "Auftragsverarbeiter",
        p1: "Die Verarbeitung durch Vercel und Vercel Analytics erfolgt auf Grundlage von Auftragsverarbeitungsverträgen gem. Art. 28 DSGVO bzw. Art. 9 revDSG.",
        p2: "Die Verträge werden regelmäßig geprüft, um aktuellen Anforderungen zu entsprechen.",
      },
      thirdParty: {
        title: "Externe Links",
        p1: "Das Portfolio kann auf externe Websites verweisen. Für deren Inhalte und Datenschutzrichtlinien trage ich keine Verantwortung.",
        p2: "Prüfen Sie deren Hinweise, bevor Sie personenbezogene Daten weitergeben.",
      },
      rights: {
        title: "Ihre Rechte",
        p1: "Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit sowie Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen.",
        p2: (
          <>
            Zur Ausübung wenden Sie sich per E‑Mail an <a href="mailto:yanis.sebastian.zuercher@gmail.com" className="link">yanis.sebastian.zuercher@gmail.com</a>. In der Schweiz: EDÖB; in der EU: zuständige Aufsichtsbehörde.
          </>
        ),
        p3: "Sie können Ihre Einwilligung jederzeit widerrufen; ich bestätige die Umsetzung zeitnah.",
        items: [
          "Auskunft (Art. 15 DSGVO)",
          "Berichtigung (Art. 16 DSGVO)",
          "Löschung (Art. 17 DSGVO)",
          "Einschränkung (Art. 18 DSGVO)",
          "Datenübertragbarkeit (Art. 20 DSGVO)",
          "Widerspruch (Art. 21 DSGVO)",
        ],
      },
      children: {
        title: "Kinder und Jugendliche",
        p1: "Diese Website richtet sich an Kund:innen und Partner und nicht an Personen unter 16 Jahren.",
        p2: "Sollten Minderjährige Daten übermittelt haben, informieren Sie mich bitte, damit ich sie löschen kann.",
      },
      changes: {
        title: "Änderungen",
        p1: (
          <>
            Diese Erklärung kann sich aufgrund gesetzlicher oder funktionaler Änderungen ändern. Die aktuelle Version finden Sie unter <LinkPreview href="https://sola.ysz.life/privacy" className="link" compact>{"https://sola.ysz.life/privacy"}</LinkPreview>.
          </>
        ),
      },
      impressum: {
        title: "Impressum",
        responsible: "Verantwortlich für diese Website:",
        name: "Yanis Sebastian Zürcher",
        location: "Zürich, Schweiz",
        emailLabel: "E‑Mail:",
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
            Este sitio personal ( <LinkPreview href="https://sola.ysz.life" className="link" compact>{"https://sola.ysz.life"}</LinkPreview> ) presenta mis proyectos y servicios. Cumple con la LPD suiza (revFADP 2023) y el RGPD de la UE, explicando qué datos se tratan y por qué.
          </>
        ),
        controller: "Responsable:",
        controllerVal: "Yanis Sebastian Zürcher, Suiza",
        contact: "Contacto:",
        email: "yanis.sebastian.zuercher@gmail.com",
      },
      quickNav: {
        title: "Ir a una sección",
      },
      summary: {
        title: "Resumen rápido",
        description: "Aspectos clave sobre el tratamiento de datos en este sitio.",
        items: [
          "No se almacenan cookies publicitarias ni de seguimiento en tu dispositivo.",
          "Las métricas de visitas usan Vercel Analytics con direcciones IP anonimizadas y reportes agregados.",
          "Vercel elimina automáticamente los registros de servidor con direcciones IP después de 30 días.",
          "Las consultas de contacto se gestionan manualmente y se borran al finalizar o en un máximo de 12 meses.",
        ],
      },
      hosting: {
        title: "Alojamiento",
        p1: (
          <>
            Alojado en <LinkPreview href="https://vercel.com" className="link" compact>Vercel Inc.</LinkPreview> (EE. UU.). Vercel registra datos de conexión (IP, navegador, hora) para entregar el sitio de forma segura.
          </>
        ),
        p2: "Los servidores pueden ubicarse en la UE o en EE. UU. Vercel ofrece garantías contractuales (acuerdo de tratamiento de datos, cláusulas contractuales tipo y participación en el EU–US Data Privacy Framework).",
        legal: "Base jurídica: art. 6.1.f RGPD — interés legítimo en operar y proteger el sitio.",
      },
      analytics: {
        title: "Analítica",
        p1: "Las estadísticas se recogen con Vercel Analytics. Los datos se anonimizan antes de almacenarse; no se usan cookies ni identificadores entre sitios.",
        p2: "Los informes son agregados y no permiten identificar a visitantes individuales.",
        legal: "Base jurídica: art. 6.1.f RGPD — interés legítimo en analizar y mejorar el rendimiento respetando la privacidad.",
      },
      dataRetention: {
        title: "Conservación de datos",
        p1: "Los datos se conservan solo el tiempo necesario para prestar el sitio y responder a consultas.",
        items: [
          "Vercel elimina los registros de servidor con direcciones IP tras 30 días.",
          "Los datos analíticos agregados no incluyen identificadores personales y se guardan para analizar tendencias.",
          "Los correos de contacto se almacenan de forma segura y se eliminan al cerrar la conversación o tras 12 meses como máximo.",
        ],
        legal: "Base jurídica: art. 5.1.e RGPD — limitación del plazo de conservación.",
      },
      security: {
        title: "Seguridad de los datos",
        p1: "Aplico medidas técnicas y organizativas para proteger la información tratada.",
        items: [
          "Cifrado TLS en todas las conexiones con sola.ysz.life.",
          "El acceso a los paneles de hosting y analítica está limitado a mí mediante cuentas protegidas.",
          "Actualizaciones periódicas de dependencias e infraestructura para corregir vulnerabilidades.",
          "Minimización de datos evitando cuentas de usuario, rastreadores o metadatos innecesarios.",
        ],
      },
      cookies: {
        title: "Cookies",
        p1: "Este sitio no utiliza cookies de seguimiento. La plataforma puede usar solo cookies esenciales cuando sea estrictamente necesario.",
        p2: "Si Vercel establece cookies esenciales, se controlan desde la plataforma y no se utilizan para elaborar perfiles.",
      },
      contact: {
        title: "Contacto",
        p1: "Si me contactas (formulario o correo), los datos facilitados (nombre, correo, mensaje) se procesan solo para atender tu solicitud y posibles seguimientos.",
        p2: "Puedes retirar tu consentimiento en cualquier momento; borraré el intercambio y lo confirmaré.",
        legal: "Base jurídica: art. 6.1.a RGPD — consentimiento; y, en su caso, art. 6.1.b RGPD — medidas precontractuales a petición del interesado.",
        cta: "Escribir un correo",
      },
      github: {
        title: "Contenido de GitHub",
        p1: (
          <>
            Páginas pueden cargar recursos de <LinkPreview href="https://github.com" className="link" compact>GitHub, Inc.</LinkPreview> (EE. UU.). Se transmite tu IP al solicitar dichos recursos. GitHub participa en el EU–US Data Privacy Framework.
          </>
        ),
        p2: "No se almacenan cookies de GitHub; el contenido se carga solo cuando el componente es visible.",
        legal: "Base jurídica: art. 6.1.f RGPD — interés legítimo en mostrar actividad de código abierto.",
      },
      transfers: {
        title: "Transferencias internacionales",
        p1: "El uso de proveedores de infraestructura o integraciones alojadas en Estados Unidos puede implicar transferencias de datos fuera de Suiza/UE.",
        items: [
          "Vercel se acoge al EU–US Data Privacy Framework y a las Cláusulas Contractuales Tipo, incluido el addendum suizo.",
          "GitHub participa en el EU–US Data Privacy Framework para los recursos integrados en este sitio.",
        ],
        p2: "Si estas garantías cambian, detendré la transferencia o aplicaré medidas adicionales de protección.",
        legal: "Base jurídica: art. 46 RGPD — garantías adecuadas para transferencias internacionales.",
      },
      processors: {
        title: "Encargados del tratamiento",
        p1: "Vercel y Vercel Analytics operan bajo acuerdos de tratamiento conformes con el art. 28 RGPD y art. 9 revFADP.",
        p2: "Reviso estos acuerdos al menos una vez al año para mantenerlos actualizados.",
      },
      thirdParty: {
        title: "Enlaces a terceros",
        p1: "El portafolio puede enlazar a servicios externos; sus contenidos y políticas son ajenos a mi control.",
        p2: "Revisa sus avisos de privacidad antes de facilitar datos personales.",
      },
      rights: {
        title: "Tus derechos",
        p1: "Acceso, rectificación, supresión, limitación, portabilidad y oposición a tratamientos basados en intereses legítimos.",
        p2: (
          <>
            Para ejercerlos, escribe a <a href="mailto:yanis.sebastian.zuercher@gmail.com" className="link">yanis.sebastian.zuercher@gmail.com</a>. En Suiza: PFPDT; en la UE: autoridad de control competente.
          </>
        ),
        p3: "Puedes retirar el consentimiento en cualquier momento; confirmaré la eliminación sin demora.",
        items: [
          "Acceso (art. 15 RGPD)",
          "Rectificación (art. 16 RGPD)",
          "Supresión (art. 17 RGPD)",
          "Limitación (art. 18 RGPD)",
          "Portabilidad (art. 20 RGPD)",
          "Oposición (art. 21 RGPD)",
        ],
      },
      children: {
        title: "Privacidad de menores",
        p1: "Este sitio está dirigido a clientes y colaboradores; no se orienta a menores de 16 años.",
        p2: "Si crees que un menor ha enviado datos, contáctame para eliminarlos.",
      },
      changes: {
        title: "Cambios",
        p1: (
          <>
            Esta política puede cambiar por motivos legales o funcionales. La versión vigente está en <LinkPreview href="https://sola.ysz.life/privacy" className="link" compact>{"https://sola.ysz.life/privacy"}</LinkPreview>.
          </>
        ),
      },
      impressum: {
        title: "Aviso Legal",
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
            本サイト（ <LinkPreview href="https://sola.ysz.life" className="link" compact>{"https://sola.ysz.life"}</LinkPreview> ）は私のプロジェクトと活動を紹介する個人サイトです。本ポリシーはスイス改正データ保護法（revFADP 2023）およびEU GDPRに準拠し、どのようなデータがなぜ処理されるかを説明します。
          </>
        ),
        controller: "管理者:",
        controllerVal: "Yanis Sebastian Zürcher（スイス）",
        contact: "連絡先:",
        email: "yanis.sebastian.zuercher@gmail.com",
      },
      quickNav: {
        title: "セクションへ移動",
      },
      summary: {
        title: "概要",
        description: "本サイトのデータ取扱いに関する重要ポイント。",
        items: [
          "広告・行動追跡用のクッキーは端末に保存しません。",
          "アクセス解析は匿名化したIPと集計レポートのみを使用する Vercel Analytics を利用します。",
          "IPアドレスを含むサーバーログは、Vercelが30日後に自動削除します。",
          "お問い合わせデータは手動で対応し、完了後または最長12か月で削除します。",
        ],
      },
      hosting: {
        title: "ホスティング",
        p1: (
          <>
            本サイトは米国の <LinkPreview href="https://vercel.com" className="link" compact>Vercel Inc.</LinkPreview> でホスティングされています。安全で安定した配信のため、Vercel は接続データ（IPアドレス、ブラウザ種別、アクセス時刻等）をサーバーログに保存します。
          </>
        ),
        p2: "サーバーはEUまたは米国に配置される場合があります。Vercelはデータ処理契約、標準契約条項、EU–US Data Privacy Framework への参加などの契約上の保護措置を提供しています。",
        legal: "法的根拠: GDPR第6条1項(f) — 正当な利益（サイト運営・保護）。",
      },
      analytics: {
        title: "アクセス解析",
        p1: "Vercel Analytics を用いて統計を収集します。保存前に匿名化され、クッキーやクロスサイト識別子は使用しません。",
        p2: "生成されるレポートは集計データであり、個々の訪問者を識別することはできません。",
        legal: "法的根拠: GDPR第6条1項(f) — プライバシーを損なわない範囲での性能改善という正当な利益。",
      },
      dataRetention: {
        title: "データ保存期間",
        p1: "データはサイト提供とお問い合わせ対応に必要な期間のみ保存します。",
        items: [
          "Vercel はIPアドレスを含むサーバーログを30日後に削除します。",
          "集計済みの解析データには個人識別子が含まれず、傾向分析のために保持されます。",
          "お問い合わせメールは安全に保管し、やり取りが完了した時点または最長12か月で削除します。",
        ],
        legal: "法的根拠: GDPR第5条1項(e) — 保存期間の制限。",
      },
      security: {
        title: "データ保護措置",
        p1: "本サイトで処理するデータを守るため技術的・組織的対策を実施しています。",
        items: [
          "sola.ysz.life へのすべての通信を TLS で暗号化。",
          "ホスティングと解析のダッシュボードへのアクセスは保護された私自身のアカウントに限定。",
          "依存パッケージやインフラを定期的に更新し、セキュリティパッチを適用。",
          "アカウントや不要なメタデータを作成しないデータ最小化。",
        ],
      },
      cookies: {
        title: "クッキー",
        p1: "本サイトはトラッキングクッキーを使用しません。必要最小限のセキュリティ・配信目的に限り、プラットフォーム由来のクッキーが用いられる場合があります。",
        p2: "Vercel が不可欠なクッキーを設定する場合も、プラットフォーム側で管理され、プロファイリングには利用されません。",
      },
      contact: {
        title: "お問い合わせ",
        p1: "フォームまたはメールでご連絡いただいた場合、提供されたデータ（氏名・メール・メッセージ）は、対応および必要に応じた連絡のためにのみ処理します。",
        p2: "同意はいつでも撤回できます。メールでお知らせいただければ、やり取りを削除し完了をお伝えします。",
        legal: "法的根拠: GDPR第6条1項(a) — 同意、必要に応じて第6条1項(b) — 事前契約措置。",
        cta: "メールを送る",
      },
      github: {
        title: "GitHub コンテンツ",
        p1: (
          <>
            一部ページでは <LinkPreview href="https://github.com" className="link" compact>GitHub, Inc.</LinkPreview>（米国）のリソースを読み込みます。取得時にIPアドレスが送信されます。GitHub は EU–US Data Privacy Framework に参加しています。
          </>
        ),
        p2: "GitHub のクッキーは保存されず、関連コンポーネントが表示されるときのみ読み込まれます。",
        legal: "法的根拠: GDPR第6条1項(f) — オープンソース活動の提示に関する正当な利益。",
      },
      transfers: {
        title: "国際的なデータ移転",
        p1: "米国にあるインフラや連携サービスを利用する場合、スイス/EU以外へのデータ移転が発生する可能性があります。",
        items: [
          "Vercel は EU–US Data Privacy Framework と標準契約条項（Swiss Addendum を含む）に基づいて運用しています。",
          "GitHub も本サイトで表示するリソースについて EU–US Data Privacy Framework に参加しています。",
        ],
        p2: "これらの保護措置に変更があれば、移転を停止するか追加対策を講じます。",
        legal: "法的根拠: GDPR第46条 — 国際移転のための適切な保護措置。",
      },
      processors: {
        title: "委託処理者",
        p1: "Vercel および Vercel Analytics による処理は、GDPR第28条 / revFADP第9条に適合した契約に基づきます。",
        p2: "これらの契約は少なくとも年1回見直し、最新の要件に適合させています。",
      },
      thirdParty: {
        title: "外部リンク",
        p1: "ポートフォリオ内で外部サイトやサービスにリンクする場合があります。その内容やプライバシー対応について私は責任を負いません。",
        p2: "個人情報を提供する前に、各サービスのポリシーをご確認ください。",
      },
      rights: {
        title: "ユーザーの権利",
        p1: "アクセス権、訂正・削除、処理の制限、データポータビリティ、正当な利益に基づく処理への異議申立てなどが可能です。",
        p2: (
          <>
            権利行使は <a href="mailto:yanis.sebastian.zuercher@gmail.com" className="link">yanis.sebastian.zuercher@gmail.com</a> へメールでご連絡ください。スイス: FDPIC、EU: 所轄監督機関に苦情を申し立てることができます。
          </>
        ),
        p3: "同意はいつでも撤回でき、その結果を迅速にお知らせします。",
        items: [
          "アクセス権（GDPR第15条）",
          "訂正（第16条）",
          "削除（第17条）",
          "処理の制限（第18条）",
          "データポータビリティ（第20条）",
          "異議申立て（第21条）",
        ],
      },
      children: {
        title: "未成年のプライバシー",
        p1: "本サイトはクライアントやコラボレーターを対象としており、16歳未満を意図したものではありません。",
        p2: "未成年の方が個人情報を送信したと思われる場合は、削除できるようご連絡ください。",
      },
      changes: {
        title: "変更",
        p1: (
          <>
            法令や機能変更に伴い改定される場合があります。最新版は <LinkPreview href="https://sola.ysz.life/privacy" className="link" compact>{"https://sola.ysz.life/privacy"}</LinkPreview> に掲載します。
          </>
        ),
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
            本个人网站（ <LinkPreview href="https://sola.ysz.life" className="link" compact>{"https://sola.ysz.life"}</LinkPreview> ）用于展示我的项目与服务。遵循瑞士新版数据保护法（revFADP 2023）与欧盟GDPR，说明处理哪些数据以及原因。
          </>
        ),
        controller: "数据控制者：",
        controllerVal: "Yanis Sebastian Zürcher（瑞士）",
        contact: "联系：",
        email: "yanis.sebastian.zuercher@gmail.com",
      },
      quickNav: {
        title: "跳转到章节",
      },
      summary: {
        title: "要点概览",
        description: "本网站处理个人数据的关键事实。",
        items: [
          "不会在你的设备上存储广告或跟踪类 Cookie。",
          "访问统计依托 Vercel Analytics，使用匿名化 IP 与汇总报表。",
          "包含 IP 地址的服务器日志会在 30 天后由 Vercel 自动删除。",
          "联系表单/邮件仅人工处理，在沟通结束或最迟 12 个月内删除。",
        ],
      },
      hosting: {
        title: "托管",
        p1: (
          <>
            网站托管于 <LinkPreview href="https://vercel.com" className="link" compact>Vercel Inc.</LinkPreview>（美国）。为安全稳定提供网站，Vercel 会在服务器日志中保存连接数据（如 IP、浏览器类型、访问时间）。
          </>
        ),
        p2: "服务器可能位于欧盟或美国。Vercel 通过数据处理协议、标准合同条款以及参与 EU–US Data Privacy Framework 等措施提供合同保障。",
        legal: "法律依据：GDPR 第6条1款(f)——基于运营与安全的合法利益。",
      },
      analytics: {
        title: "分析",
        p1: "使用 Vercel Analytics 收集访问统计。数据在存储前已匿名化；不设置 Cookie 或跨站标识符。",
        p2: "生成的报告为汇总数据，无法识别单个访客。",
        legal: "法律依据：GDPR 第6条1款(f)——在不侵犯隐私的前提下进行性能分析与改进的合法利益。",
      },
      dataRetention: {
        title: "数据保存期限",
        p1: "数据仅在提供网站和回复询问所必需的期间内保存。",
        items: [
          "Vercel 会在 30 天后删除包含 IP 地址的服务器日志。",
          "汇总的分析数据不含个人标识，仅用于趋势分析。",
          "联系邮件安全存储，在沟通结束或最迟 12 个月后删除。",
        ],
        legal: "法律依据：GDPR 第5条第1款(e)——存储限制。",
      },
      security: {
        title: "数据安全",
        p1: "我采用技术与组织措施保护经由本网站处理的数据。",
        items: [
          "sola.ysz.life 的所有连接均使用 TLS 加密。",
          "只有我本人使用受保护的账户访问托管与分析控制台。",
          "定期更新依赖项与基础设施以安装安全补丁。",
          "坚持数据最小化，不创建账号或不必要的元数据。",
        ],
      },
      cookies: {
        title: "Cookie",
        p1: "本站不使用跟踪性 Cookie。平台仅在安全与交付所必需时使用必要性 Cookie。",
        p2: "若 Vercel 设置必要性 Cookie，将由平台管理，不用于画像。",
      },
      contact: {
        title: "联系我",
        p1: "当你通过表单或电子邮件联系我时，你提供的姓名、邮箱与消息仅用于处理你的请求及后续沟通。",
        p2: "你可随时撤回同意；请通过邮件告知，我会删除通信并确认。",
        legal: "法律依据：GDPR 第6条1款(a)——同意；必要时，第6条1款(b)——应你请求的合同前措施。",
        cta: "发送邮件",
      },
      github: {
        title: "GitHub 内容",
        p1: (
          <>
            部分页面会从 <LinkPreview href="https://github.com" className="link" compact>GitHub, Inc.</LinkPreview>（美国）加载资源，请求时会传输你的 IP。GitHub 参与 EU–US Data Privacy Framework。
          </>
        ),
        p2: "不会存储 GitHub Cookie；仅在相关组件显示时加载资源。",
        legal: "法律依据：GDPR 第6条1款(f)——展示开源活动的合法利益。",
      },
      transfers: {
        title: "跨境数据传输",
        p1: "使用位于美国的基础设施或集成服务时，可能发生向瑞士/欧盟以外地区传输个人数据。",
        items: [
          "Vercel 遵循 EU–US Data Privacy Framework，并使用包含瑞士附录的标准合同条款。",
          "GitHub 参与 EU–US Data Privacy Framework，以支持在本站展示的资源。",
        ],
        p2: "若这些保障发生变化，我将暂停传输或采取额外保护措施。",
        legal: "法律依据：GDPR 第46条——跨境传输的适当保障。",
      },
      processors: {
        title: "受托处理方",
        p1: "Vercel 与 Vercel Analytics 的处理受符合 GDPR 第28条 / revFADP 第9条的处理协议约束。",
        p2: "我至少每年审查一次这些协议，确保符合最新要求。",
      },
      thirdParty: {
        title: "第三方链接",
        p1: "作品集中可能包含指向第三方网站或服务的链接，其内容与隐私实践不在我的控制范围内。",
        p2: "在向第三方提供个人数据前，请查阅其隐私政策。",
      },
      rights: {
        title: "你的权利",
        p1: "你可行使访问、更正、删除、限制处理、数据可携权，并可对基于合法利益的处理提出反对。",
        p2: (
          <>
            行使权利请发送邮件至 <a href="mailto:yanis.sebastian.zuercher@gmail.com" className="link">yanis.sebastian.zuercher@gmail.com</a>。瑞士：可联系FDPIC；欧盟：可向主管监管机构投诉。
          </>
        ),
        p3: "你可随时撤回同意，我会及时确认处理结果。",
        items: [
          "访问权（第15条）",
          "更正（第16条）",
          "删除（第17条）",
          "限制处理（第18条）",
          "数据可携权（第20条）",
          "反对（第21条）",
        ],
      },
      children: {
        title: "未成年人隐私",
        p1: "本网站面向客户与合作伙伴，不针对 16 岁以下人士。",
        p2: "若认为未成年人提供了个人信息，请联系我以便删除。",
      },
      changes: {
        title: "变更",
        p1: (
          <>
            因法律或功能变动，本政策可能更新。最新版见 <LinkPreview href="https://sola.ysz.life/privacy" className="link" compact>{"https://sola.ysz.life/privacy"}</LinkPreview>。
          </>
        ),
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
  const LAST_UPDATED_ISO = "2025-02-01";
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

  const quickLinks = [
    { id: "at-a-glance", label: L[language].summary.title },
    { id: "hosting", label: L[language].hosting.title },
    { id: "analytics", label: L[language].analytics.title },
    { id: "data-retention", label: L[language].dataRetention.title },
    { id: "security", label: L[language].security.title },
    { id: "cookies", label: L[language].cookies.title },
    { id: "contact", label: L[language].contact.title },
    { id: "github", label: L[language].github.title },
    { id: "transfers", label: L[language].transfers.title },
    { id: "processors", label: L[language].processors.title },
    { id: "third-party", label: L[language].thirdParty.title },
    { id: "rights", label: L[language].rights.title },
    { id: "children", label: L[language].children.title },
    { id: "changes", label: L[language].changes.title },
    { id: "impressum", label: L[language].impressum.title },
  ];

  const h = () => {
    n(-1);
  };

  const renderLegal = (legal?: string) => {
    if (!legal) {
      return null;
    }
    const [label, ...rest] = legal.split(":");
    if (rest.length === 0) {
      return (
        <p className="text-muted-foreground leading-relaxed text-base mt-3">{legal}</p>
      );
    }
    const labelText = label.trim();
    const bodyText = rest.join(":").trim();
    return (
      <p className="text-muted-foreground leading-relaxed text-base mt-3">
        <strong className="text-foreground">{`${labelText}:`}</strong> {bodyText}
      </p>
    );
  };

  const renderList = (
    items?: readonly string[],
    { columns = false }: { columns?: boolean } = {}
  ) => {
    if (!Array.isArray(items) || items.length === 0) {
      return null;
    }
    const baseClass = columns
      ? "mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground"
      : "mt-4 space-y-2 text-sm text-muted-foreground";
    return (
      <ul className={baseClass}>
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
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
                <motion.section
                  id="introduction"
                  variants={cardIn}
                  initial="hidden"
                  animate="visible"
                  className="rounded-xl border bg-card/60 backdrop-blur-sm p-6 scroll-mt-28"
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].intro.title}</h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>{L[language].intro.p1}</p>
                    <p>
                      <strong className="text-foreground">{L[language].intro.controller}</strong> {L[language].intro.controllerVal}
                      <br />
                      <strong className="text-foreground">{L[language].intro.contact}</strong> <a href="mailto:yanis.sebastian.zuercher@gmail.com" className="link">{L[language].intro.email}</a>
                    </p>
                  </div>
                </motion.section>

                <motion.nav
                  variants={cardIn}
                  initial="hidden"
                  animate="visible"
                  className="rounded-xl border bg-card/40 backdrop-blur-sm p-4 scroll-mt-28"
                  aria-label={L[language].quickNav.title}
                >
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                      {L[language].quickNav.title}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {quickLinks.map((link) => (
                        <Button
                          key={link.id}
                          asChild
                          variant="outline"
                          size="sm"
                          className="bg-background/60 hover:bg-background"
                        >
                          <a href={`#${link.id}`} className="transition-colors hover:text-primary">
                            {link.label}
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                </motion.nav>

                <motion.section
                  id="at-a-glance"
                  variants={cardIn}
                  initial="hidden"
                  animate="visible"
                  className="rounded-xl border bg-card/60 backdrop-blur-sm p-6 scroll-mt-28"
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].summary.title}</h2>
                  {L[language].summary.description && (
                    <p className="text-muted-foreground leading-relaxed text-base">{L[language].summary.description}</p>
                  )}
                  {Array.isArray(L[language].summary.items) && L[language].summary.items.length > 0 && (
                    <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {L[language].summary.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/60 p-3 text-left"
                        >
                          <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                          <span className="text-sm leading-relaxed text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.section
                    id="hosting"
                    variants={cardIn}
                    initial="hidden"
                    animate="visible"
                    className="rounded-xl border bg-card/60 backdrop-blur-sm p-6 scroll-mt-28"
                  >
                    <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].hosting.title}</h2>
                    <p className="text-muted-foreground leading-relaxed text-base">{L[language].hosting.p1}</p>
                    {L[language].hosting.p2 && (
                      <p className="text-muted-foreground leading-relaxed text-base mt-3">{L[language].hosting.p2}</p>
                    )}
                    {renderLegal(L[language].hosting.legal)}
                  </motion.section>

                  <motion.section
                    id="analytics"
                    variants={cardIn}
                    initial="hidden"
                    animate="visible"
                    className="rounded-xl border bg-card/60 backdrop-blur-sm p-6 scroll-mt-28"
                  >
                    <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].analytics.title}</h2>
                    <p className="text-muted-foreground leading-relaxed text-base">{L[language].analytics.p1}</p>
                    {L[language].analytics.p2 && (
                      <p className="text-muted-foreground leading-relaxed text-base mt-3">{L[language].analytics.p2}</p>
                    )}
                    {renderLegal(L[language].analytics.legal)}
                  </motion.section>

                  <motion.section
                    id="data-retention"
                    variants={cardIn}
                    initial="hidden"
                    animate="visible"
                    className="rounded-xl border bg-card/60 backdrop-blur-sm p-6 scroll-mt-28"
                  >
                    <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].dataRetention.title}</h2>
                    <p className="text-muted-foreground leading-relaxed text-base">{L[language].dataRetention.p1}</p>
                    {renderList(L[language].dataRetention.items)}
                    {renderLegal(L[language].dataRetention.legal)}
                  </motion.section>

                  <motion.section
                    id="security"
                    variants={cardIn}
                    initial="hidden"
                    animate="visible"
                    className="rounded-xl border bg-card/60 backdrop-blur-sm p-6 scroll-mt-28"
                  >
                    <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].security.title}</h2>
                    <p className="text-muted-foreground leading-relaxed text-base">{L[language].security.p1}</p>
                    {renderList(L[language].security.items)}
                  </motion.section>
                </div>

                <motion.section
                  id="cookies"
                  variants={cardIn}
                  initial="hidden"
                  animate="visible"
                  className="rounded-xl border bg-card/60 backdrop-blur-sm p-6 scroll-mt-28"
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].cookies.title}</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">{L[language].cookies.p1}</p>
                  {L[language].cookies.p2 && (
                    <p className="text-muted-foreground leading-relaxed text-base mt-3">{L[language].cookies.p2}</p>
                  )}
                </motion.section>

                <motion.section
                  id="contact"
                  variants={cardIn}
                  initial="hidden"
                  animate="visible"
                  className="rounded-xl border bg-card/60 backdrop-blur-sm p-6 scroll-mt-28"
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].contact.title}</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">{L[language].contact.p1}</p>
                  {L[language].contact.p2 && (
                    <p className="text-muted-foreground leading-relaxed text-base mt-3">{L[language].contact.p2}</p>
                  )}
                  {renderLegal(L[language].contact.legal)}
                  {L[language].contact.cta && (
                    <div className="mt-5">
                      <Button size="sm" asChild>
                        <a href="mailto:yanis.sebastian.zuercher@gmail.com">{L[language].contact.cta}</a>
                      </Button>
                    </div>
                  )}
                </motion.section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.section
                    id="github"
                    variants={cardIn}
                    initial="hidden"
                    animate="visible"
                    className="rounded-xl border bg-card/60 backdrop-blur-sm p-6 scroll-mt-28"
                  >
                    <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].github.title}</h2>
                    <p className="text-muted-foreground leading-relaxed text-base">{L[language].github.p1}</p>
                    {L[language].github.p2 && (
                      <p className="text-muted-foreground leading-relaxed text-base mt-3">{L[language].github.p2}</p>
                    )}
                    {renderLegal(L[language].github.legal)}
                  </motion.section>

                  <motion.section
                    id="transfers"
                    variants={cardIn}
                    initial="hidden"
                    animate="visible"
                    className="rounded-xl border bg-card/60 backdrop-blur-sm p-6 scroll-mt-28"
                  >
                    <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].transfers.title}</h2>
                    <p className="text-muted-foreground leading-relaxed text-base">{L[language].transfers.p1}</p>
                    {renderList(L[language].transfers.items)}
                    {L[language].transfers.p2 && (
                      <p className="text-muted-foreground leading-relaxed text-base mt-3">{L[language].transfers.p2}</p>
                    )}
                    {renderLegal(L[language].transfers.legal)}
                  </motion.section>
                </div>

                <motion.section
                  id="processors"
                  variants={cardIn}
                  initial="hidden"
                  animate="visible"
                  className="rounded-xl border bg-card/60 backdrop-blur-sm p-6 scroll-mt-28"
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].processors.title}</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">{L[language].processors.p1}</p>
                  {L[language].processors.p2 && (
                    <p className="text-muted-foreground leading-relaxed text-base mt-3">{L[language].processors.p2}</p>
                  )}
                </motion.section>

                <motion.section
                  id="third-party"
                  variants={cardIn}
                  initial="hidden"
                  animate="visible"
                  className="rounded-xl border bg-card/60 backdrop-blur-sm p-6 scroll-mt-28"
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].thirdParty.title}</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">{L[language].thirdParty.p1}</p>
                  {L[language].thirdParty.p2 && (
                    <p className="text-muted-foreground leading-relaxed text-base mt-3">{L[language].thirdParty.p2}</p>
                  )}
                </motion.section>

                <motion.section
                  id="rights"
                  variants={cardIn}
                  initial="hidden"
                  animate="visible"
                  className="rounded-xl border bg-card/60 backdrop-blur-sm p-6 scroll-mt-28"
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].rights.title}</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">{L[language].rights.p1}</p>
                  {renderList(L[language].rights.items, { columns: true })}
                  {L[language].rights.p2 && (
                    <p className="text-muted-foreground leading-relaxed text-base mt-4">{L[language].rights.p2}</p>
                  )}
                  {L[language].rights.p3 && (
                    <p className="text-muted-foreground leading-relaxed text-base mt-3">{L[language].rights.p3}</p>
                  )}
                </motion.section>

                <motion.section
                  id="children"
                  variants={cardIn}
                  initial="hidden"
                  animate="visible"
                  className="rounded-xl border bg-card/60 backdrop-blur-sm p-6 scroll-mt-28"
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].children.title}</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">{L[language].children.p1}</p>
                  {L[language].children.p2 && (
                    <p className="text-muted-foreground leading-relaxed text-base mt-3">{L[language].children.p2}</p>
                  )}
                </motion.section>

                <motion.section
                  id="changes"
                  variants={cardIn}
                  initial="hidden"
                  animate="visible"
                  className="rounded-xl border bg-card/60 backdrop-blur-sm p-6 scroll-mt-28"
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">{L[language].changes.title}</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">{L[language].changes.p1}</p>
                </motion.section>

                <Separator className="my-12" />

                <motion.section
                  id="impressum"
                  variants={cardIn}
                  initial="hidden"
                  animate="visible"
                  className="rounded-xl border backdrop-blur-sm p-6 scroll-mt-28"
                >
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
