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
import { LinkPreview } from "@/components/ui/custom/link-preview";
import { IconButton } from "@/components/ui/custom/icon-button";
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
      lastUpdated: "Last updated: July 2025",
      intro: {
        title: "Introduction",
        p1: (
          <>
            This personal portfolio website ({" "}
            <LinkPreview href="https://sola.ysz.life" className="link" compact>
              {"https://sola.ysz.life"}
            </LinkPreview>{" "}
            ) showcases my projects and freelance services. This privacy policy
            complies with the Swiss Federal Act on Data Protection
            (revFADP 2023) and the EU General Data Protection Regulation (GDPR)
            and explains what data are processed and why.
          </>
        ),
        controller: "Data Controller:",
        controllerVal: "Yanis Sebastian Zürcher, Switzerland",
        contact: "Contact:",
        email: "yanis.sebastian.zuercher@gmail.com",
      },
      hosting: {
        title: "Hosting",
        p1: (
          <>
            The site is hosted by{" "}
            <LinkPreview href="https://vercel.com" className="link" compact>
              Vercel Inc.
            </LinkPreview>
            , 340 S Lemon Ave #4133, Walnut, CA 91789, USA. Vercel stores
            connection data (e.g., IP address, browser type, access time) in
            server logs to deliver the website securely and reliably.
          </>
        ),
        legal:
          "Legal basis: Art. 6(1)(f) GDPR — legitimate interests in operating and safeguarding the site.",
      },
      analytics: {
        title: "Analytics",
        p1: "Visitor statistics are collected with Vercel Analytics. Data are anonymised prior to storage; no cookies or cross‑site identifiers are set.",
        legal:
          "Legal basis: Art. 6(1)(f) GDPR — legitimate interests in analysing and improving performance without infringing on privacy.",
      },
      cookies: {
        title: "Cookies",
        p1: "This site does not set tracking cookies. Essential cookies may be used by the hosting platform only where strictly necessary for security and delivery.",
      },
      contact: {
        title: "Contact",
        p1: "If you contact me (form or email), the data you provide (name, email, message) are processed solely to handle your enquiry and possible follow‑ups.",
        legal:
          "Legal basis: Art. 6(1)(a) GDPR — consent; and, where relevant, Art. 6(1)(b) GDPR — pre‑contractual steps at your request.",
      },
      github: {
        title: "GitHub Content",
        p1: (
          <>
            Pages may fetch contribution graphs or repository widgets from{" "}
            <LinkPreview href="https://github.com" className="link" compact>
              GitHub, Inc.
            </LinkPreview>{" "}
            (USA). Your IP address is transmitted when these resources are
            requested. GitHub participates in the EU–US Data Privacy Framework.
          </>
        ),
        legal:
          "Legal basis: Art. 6(1)(f) GDPR — legitimate interests in presenting open‑source activity.",
      },
      processors: {
        title: "Processors",
        p1: "Processing by Vercel and Vercel Analytics is governed by data‑processing agreements compliant with Art. 28 GDPR and Art. 9 revFADP.",
      },
      rights: {
        title: "Your Rights",
        p1: "You may request access, rectification, erasure, restriction, data portability, or object to processing based on legitimate interests.",
        p2: (
          <>
            To exercise these rights, email{" "}
            <a
              href="mailto:yanis.sebastian.zuercher@gmail.com"
              className="link"
            >
              yanis.sebastian.zuercher@gmail.com
            </a>
            . Swiss residents may contact the FDPIC; EU residents may lodge a
            complaint with a competent supervisory authority.
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
            This policy may change due to legal or functional updates. The
            current version is available at{" "}
            <LinkPreview
              href="https://sola.ysz.life/privacy"
              className="link"
              compact
            >
              {"https://sola.ysz.life/privacy"}
            </LinkPreview>
            .
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
      lastUpdated: "Zuletzt aktualisiert: Juli 2025",
      intro: {
        title: "Einführung",
        p1: (
          <>
            Diese persönliche Portfolio‑Website ({" "}
            <LinkPreview href="https://sola.ysz.life" className="link" compact>
              {"https://sola.ysz.life"}
            </LinkPreview>{" "}
            ) stellt Projekte und freiberufliche Leistungen vor. Diese Erklärung
            entspricht dem revDSG (2023) und der EU‑DSGVO und erläutert, welche
            Daten zu welchem Zweck verarbeitet werden.
          </>
        ),
        controller: "Verantwortlicher:",
        controllerVal: "Yanis Sebastian Zürcher, Schweiz",
        contact: "Kontakt:",
        email: "yanis.sebastian.zuercher@gmail.com",
      },
      hosting: {
        title: "Hosting",
        p1: (
          <>
            Das Hosting erfolgt bei{" "}
            <LinkPreview href="https://vercel.com" className="link" compact>
              Vercel Inc.
            </LinkPreview>
            , 340 S Lemon Ave #4133, Walnut, CA 91789, USA. Vercel speichert
            Verbindungsdaten (z. B. IP‑Adresse, Browsertyp, Zugriffszeit) in
            Server‑Logs, um die Website sicher und zuverlässig bereitzustellen.
          </>
        ),
        legal:
          "Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO — berechtigtes Interesse am Betrieb und an der Absicherung der Website.",
      },
      analytics: {
        title: "Analytics",
        p1: "Besucherstatistiken werden mit Vercel Analytics erhoben. Die Daten werden vor Speicherung anonymisiert; es werden keine Cookies oder Cross‑Site‑Identifier gesetzt.",
        legal:
          "Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO — berechtigtes Interesse an Analyse und Performanceverbesserung bei Wahrung der Privatsphäre.",
      },
      cookies: {
        title: "Cookies",
        p1: "Diese Seite setzt keine Tracking‑Cookies. Plattformbedingt können nur technisch notwendige Cookies für Sicherheit und Auslieferung verwendet werden.",
      },
      contact: {
        title: "Kontakt",
        p1: "Bei Kontaktaufnahme (Formular oder E‑Mail) werden die angegebenen Daten (Name, E‑Mail, Nachricht) ausschließlich zur Bearbeitung der Anfrage und etwaiger Rückfragen verarbeitet.",
        legal:
          "Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO — Einwilligung; ggf. Art. 6 Abs. 1 lit. b DSGVO — vorvertragliche Maßnahmen auf Ihre Anfrage.",
      },
      github: {
        title: "GitHub‑Inhalte",
        p1: (
          <>
            Seiten können Beitrags‑Grafiken oder Repository‑Widgets von{" "}
            <LinkPreview href="https://github.com" className="link" compact>
              GitHub, Inc.
            </LinkPreview>{" "}
            (USA) laden. Dabei wird Ihre IP‑Adresse übermittelt. GitHub ist dem
            EU‑US Data Privacy Framework beigetreten.
          </>
        ),
        legal:
          "Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO — berechtigtes Interesse an der Darstellung von Open‑Source‑Aktivität.",
      },
      processors: {
        title: "Auftragsverarbeiter",
        p1: "Die Verarbeitung durch Vercel und Vercel Analytics erfolgt auf Grundlage von Auftragsverarbeitungsverträgen gem. Art. 28 DSGVO bzw. Art. 9 revDSG.",
      },
      rights: {
        title: "Ihre Rechte",
        p1: "Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit sowie Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen.",
        p2: (
          <>
            Zur Ausübung wenden Sie sich per E‑Mail an{" "}
            <a
              href="mailto:yanis.sebastian.zuercher@gmail.com"
              className="link"
            >
              yanis.sebastian.zuercher@gmail.com
            </a>
            . In der Schweiz: EDÖB; in der EU: zuständige Aufsichtsbehörde.
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
            Diese Erklärung kann sich aufgrund gesetzlicher oder funktionaler
            Änderungen ändern. Die aktuelle Version finden Sie unter{" "}
            <LinkPreview
              href="https://sola.ysz.life/privacy"
              className="link"
              compact
            >
              {"https://sola.ysz.life/privacy"}
            </LinkPreview>
            .
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
      lastUpdated: "Última actualización: julio de 2025",
      intro: {
        title: "Introducción",
        p1: (
          <>
            Este sitio personal ({" "}
            <LinkPreview href="https://sola.ysz.life" className="link" compact>
              {"https://sola.ysz.life"}
            </LinkPreview>{" "}
            ) presenta mis proyectos y servicios. Cumple con la LPD suiza
            (revFADP 2023) y el RGPD de la UE, explicando qué datos se tratan y
            por qué.
          </>
        ),
        controller: "Responsable:",
        controllerVal: "Yanis Sebastian Zürcher, Suiza",
        contact: "Contacto:",
        email: "yanis.sebastian.zuercher@gmail.com",
      },
      hosting: {
        title: "Alojamiento",
        p1: (
          <>
            Alojado en{" "}
            <LinkPreview href="https://vercel.com" className="link" compact>
              Vercel Inc.
            </LinkPreview>{" "}
            (EE. UU.). Vercel registra datos de conexión (IP, navegador, hora)
            para entregar el sitio de forma segura.
          </>
        ),
        legal:
          "Base jurídica: art. 6.1.f RGPD — interés legítimo en operar y proteger el sitio.",
      },
      analytics: {
        title: "Analítica",
        p1: "Las estadísticas se recogen con Vercel Analytics. Los datos se anonimizan antes de almacenarse; no se usan cookies ni identificadores entre sitios.",
        legal:
          "Base jurídica: art. 6.1.f RGPD — interés legítimo en analizar y mejorar el rendimiento respetando la privacidad.",
      },
      cookies: {
        title: "Cookies",
        p1: "Este sitio no utiliza cookies de seguimiento. La plataforma puede usar solo cookies esenciales cuando sea estrictamente necesario.",
      },
      contact: {
        title: "Contacto",
        p1: "Si me contactas (formulario o correo), los datos facilitados (nombre, correo, mensaje) se procesan solo para atender tu solicitud y posibles seguimientos.",
        legal:
          "Base jurídica: art. 6.1.a RGPD — consentimiento; y, en su caso, art. 6.1.b RGPD — medidas precontractuales a petición del interesado.",
      },
      github: {
        title: "Contenido de GitHub",
        p1: (
          <>
            Páginas pueden cargar recursos de{" "}
            <LinkPreview href="https://github.com" className="link" compact>
              GitHub, Inc.
            </LinkPreview>{" "}
            (EE. UU.). Se transmite tu IP al solicitar dichos recursos. GitHub
            participa en el EU–US Data Privacy Framework.
          </>
        ),
        legal:
          "Base jurídica: art. 6.1.f RGPD — interés legítimo en mostrar actividad de código abierto.",
      },
      processors: {
        title: "Encargados del tratamiento",
        p1: "Vercel y Vercel Analytics operan bajo acuerdos de tratamiento conformes con el art. 28 RGPD y art. 9 revFADP.",
      },
      rights: {
        title: "Tus derechos",
        p1: "Acceso, rectificación, supresión, limitación, portabilidad y oposición a tratamientos basados en intereses legítimos.",
        p2: (
          <>
            Para ejercerlos, escribe a{" "}
            <a
              href="mailto:yanis.sebastian.zuercher@gmail.com"
              className="link"
            >
              yanis.sebastian.zuercher@gmail.com
            </a>
            . En Suiza: PFPDT; en la UE: autoridad de control competente.
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
            Esta política puede cambiar por motivos legales o funcionales. La
            versión vigente está en{" "}
            <LinkPreview
              href="https://sola.ysz.life/privacy"
              className="link"
              compact
            >
              {"https://sola.ysz.life/privacy"}
            </LinkPreview>
            .
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
      lastUpdated: "最終更新日: 2025年7月",
      intro: {
        title: "はじめに",
        p1: (
          <>
            本サイト（{" "}
            <LinkPreview href="https://sola.ysz.life" className="link" compact>
              {"https://sola.ysz.life"}
            </LinkPreview>{" "}
            ）は私のプロジェクトと活動を紹介する個人サイトです。本ポリシーはスイス改正データ保護法（revFADP
            2023）およびEU
            GDPRに準拠し、どのようなデータがなぜ処理されるかを説明します。
          </>
        ),
        controller: "管理者:",
        controllerVal: "Yanis Sebastian Zürcher（スイス）",
        contact: "連絡先:",
        email: "yanis.sebastian.zuercher@gmail.com",
      },
      hosting: {
        title: "ホスティング",
        p1: (
          <>
            本サイトは米国の{" "}
            <LinkPreview href="https://vercel.com" className="link" compact>
              Vercel Inc.
            </LinkPreview>{" "}
            でホスティングされています。安全で安定した配信のため、Vercel
            は接続データ（IPアドレス、ブラウザ種別、アクセス時刻等）をサーバーログに保存します。
          </>
        ),
        legal: "法的根拠: GDPR第6条1項(f) — 正当な利益（サイト運営・保護）。",
      },
      analytics: {
        title: "アクセス解析",
        p1: "Vercel Analytics を用いて統計を収集します。保存前に匿名化され、クッキーやクロスサイト識別子は使用しません。",
        legal:
          "法的根拠: GDPR第6条1項(f) — プライバシーを損なわない範囲での性能改善という正当な利益。",
      },
      cookies: {
        title: "クッキー",
        p1: "本サイトはトラッキングクッキーを使用しません。必要最小限のセキュリティ・配信目的に限り、プラットフォーム由来のクッキーが用いられる場合があります。",
      },
      contact: {
        title: "お問い合わせ",
        p1: "フォームまたはメールでご連絡いただいた場合、提供されたデータ（氏名・メール・メッセージ）は、対応および必要に応じた連絡のためにのみ処理します。",
        legal:
          "法的根拠: GDPR第6条1項(a) — 同意、必要に応じて第6条1項(b) — 事前契約措置。",
      },
      github: {
        title: "GitHub コンテンツ",
        p1: (
          <>
            一部ページでは{" "}
            <LinkPreview href="https://github.com" className="link" compact>
              GitHub, Inc.
            </LinkPreview>
            （米国）のリソースを読み込みます。取得時にIPアドレスが送信されます。GitHub
            は EU–US Data Privacy Framework に参加しています。
          </>
        ),
        legal:
          "法的根拠: GDPR第6条1項(f) — オープンソース活動の提示に関する正当な利益。",
      },
      processors: {
        title: "委託処理者",
        p1: "Vercel および Vercel Analytics による処理は、GDPR第28条 / revFADP第9条に適合した契約に基づきます。",
      },
      rights: {
        title: "ユーザーの権利",
        p1: "アクセス権、訂正・削除、処理の制限、データポータビリティ、正当な利益に基づく処理への異議申立てなどが可能です。",
        p2: (
          <>
            権利行使は{" "}
            <a
              href="mailto:yanis.sebastian.zuercher@gmail.com"
              className="link"
            >
              yanis.sebastian.zuercher@gmail.com
            </a>{" "}
            へメールでご連絡ください。スイス: FDPIC、EU:
            所轄監督機関に苦情を申し立てることができます。
          </>
        ),
        items: [
          "アクセス権（GDPR第15条）",
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
            法令や機能変更に伴い改定される場合があります。最新版は{" "}
            <LinkPreview
              href="https://sola.ysz.life/privacy"
              className="link"
              compact
            >
              {"https://sola.ysz.life/privacy"}
            </LinkPreview>{" "}
            に掲載します。
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
      lastUpdated: "最后更新：2025年7月",
      intro: {
        title: "简介",
        p1: (
          <>
            本个人网站（{" "}
            <LinkPreview href="https://sola.ysz.life" className="link" compact>
              {"https://sola.ysz.life"}
            </LinkPreview>{" "}
            ）用于展示我的项目与服务。遵循瑞士新版数据保护法（revFADP
            2023）与欧盟GDPR，说明处理哪些数据以及原因。
          </>
        ),
        controller: "数据控制者：",
        controllerVal: "Yanis Sebastian Zürcher（瑞士）",
        contact: "联系：",
        email: "yanis.sebastian.zuercher@gmail.com",
      },
      hosting: {
        title: "托管",
        p1: (
          <>
            网站托管于{" "}
            <LinkPreview href="https://vercel.com" className="link" compact>
              Vercel Inc.
            </LinkPreview>
            （美国）。为安全稳定提供网站，Vercel
            会在服务器日志中保存连接数据（如 IP、浏览器类型、访问时间）。
          </>
        ),
        legal: "法律依据：GDPR 第6条1款(f)——基于运营与安全的合法利益。",
      },
      analytics: {
        title: "分析",
        p1: "使用 Vercel Analytics 收集访问统计。数据在存储前已匿名化；不设置 Cookie 或跨站标识符。",
        legal:
          "法律依据：GDPR 第6条1款(f)——在不侵犯隐私的前提下进行性能分析与改进的合法利益。",
      },
      cookies: {
        title: "Cookie",
        p1: "本站不使用跟踪性 Cookie。平台仅在安全与交付所必需时使用必要性 Cookie。",
      },
      contact: {
        title: "联系我",
        p1: "当你通过表单或电子邮件联系我时，你提供的姓名、邮箱与消息仅用于处理你的请求及后续沟通。",
        legal:
          "法律依据：GDPR 第6条1款(a)——同意；必要时，第6条1款(b)——应你请求的合同前措施。",
      },
      github: {
        title: "GitHub 内容",
        p1: (
          <>
            部分页面会从{" "}
            <LinkPreview href="https://github.com" className="link" compact>
              GitHub, Inc.
            </LinkPreview>
            （美国）加载资源，请求时会传输你的 IP。GitHub 参与 EU–US Data
            Privacy Framework。
          </>
        ),
        legal: "法律依据：GDPR 第6条1款(f)——展示开源活动的合法利益。",
      },
      processors: {
        title: "受托处理方",
        p1: "Vercel 与 Vercel Analytics 的处理受符合 GDPR 第28条 / revFADP 第9条的处理协议约束。",
      },
      rights: {
        title: "你的权利",
        p1: "你可行使访问、更正、删除、限制处理、数据可携权，并可对基于合法利益的处理提出反对。",
        p2: (
          <>
            行使权利请发送邮件至{" "}
            <a
              href="mailto:yanis.sebastian.zuercher@gmail.com"
              className="link"
            >
              yanis.sebastian.zuercher@gmail.com
            </a>
            。瑞士：可联系FDPIC；欧盟：可向主管监管机构投诉。
          </>
        ),
        items: [
          "访问权（第15条）",
          "更正（第16条）",
          "删除（第17条）",
          "限制处理（第18条）",
          "数据可携权（第20条）",
          "反对（第21条）",
        ],
      },
      changes: {
        title: "变更",
        p1: (
          <>
            因法律或功能变动，本政策可能更新。最新版见{" "}
            <LinkPreview
              href="https://sola.ysz.life/privacy"
              className="link"
              compact
            >
              {"https://sola.ysz.life/privacy"}
            </LinkPreview>
            。
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
  const LAST_UPDATED_ISO = "2025-09-16"; // update when content meaningfully changes
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
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: 0.04 * i },
    }),
  } as const;
  const cardIn = {
    hidden: { opacity: 0, scale: 0.985 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.45 } },
  } as const;
  const trail = (index: number) => ({
    custom: index,
    variants: fadeUp,
    initial: "hidden",
    animate: "visible" as const,
  });

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
                          <span className="text-muted-foreground hover:text-primary transition-colors">
                            {t.common.home}
                          </span>
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
              <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4 tracking-tight mt-10 text-wrap break-words shrink-0">
                {L[language].pageTitle}
              </h1>
              <div className="mt-8 flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border/60 bg-background/60 px-2.5 py-1 text-[0.70rem]/[1rem] text-foreground/60 backdrop-blur-sm">
                  {updatedLabel}:{" "}
                  <span className="bg-gradient-to-r from-foreground/60 via-primary to-foreground/60 bg-[length:200%_100%] bg-clip-text text-transparent animate-shine">
                    {formattedUpdated}
                  </span>
                </span>
              </div>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {/* Intro card */}
                <motion.section
                  id="introduction"
                  variants={cardIn}
                  initial="hidden"
                  animate="visible"
                  className="rounded-xl border bg-card/60 backdrop-blur-sm p-6"
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    {L[language].intro.title}
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>{L[language].intro.p1}</p>
                    <p>
                      <strong className="text-foreground">
                        {L[language].intro.controller}
                      </strong>{" "}
                      {L[language].intro.controllerVal}
                      <br />
                      <strong className="text-foreground">
                        {L[language].intro.contact}
                      </strong>{" "}
                      <a
                        href="mailto:yanis.sebastian.zuercher@gmail.com"
                        className="link"
                      >
                        {L[language].intro.email}
                      </a>
                    </p>
                  </div>
                </motion.section>

                {/* Two-column cards where space allows */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.section
                    id="hosting"
                    variants={cardIn}
                    initial="hidden"
                    animate="visible"
                    className="rounded-xl border bg-card/60 backdrop-blur-sm p-6"
                  >
                    <h2 className="text-xl font-semibold text-foreground mb-4">
                      {L[language].hosting.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {L[language].hosting.p1}
                    </p>
                    <p className="text-muted-foreground leading-relaxed text-base mt-3">
                      <strong className="text-foreground">
                        {L[language].hosting.legal.split(":")[0]}:
                      </strong>{" "}
                      {L[language].hosting.legal
                        .split(":")
                        .slice(1)
                        .join(":")
                        .trim()}
                    </p>
                  </motion.section>

                  <motion.section
                    id="analytics"
                    variants={cardIn}
                    initial="hidden"
                    animate="visible"
                    className="rounded-xl border bg-card/60 backdrop-blur-sm p-6"
                  >
                    <h2 className="text-xl font-semibold text-foreground mb-4">
                      {L[language].analytics.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {L[language].analytics.p1}
                    </p>
                    <p className="text-muted-foreground leading-relaxed text-base mt-3">
                      <strong className="text-foreground">
                        {L[language].hosting.legal.split(":")[0]}:
                      </strong>{" "}
                      {L[language].analytics.legal
                        .split(":")
                        .slice(1)
                        .join(":")
                        .trim()}
                    </p>
                  </motion.section>
                </div>

                <motion.section
                  id="cookies"
                  variants={cardIn}
                  initial="hidden"
                  animate="visible"
                  className="rounded-xl border bg-card/60 backdrop-blur-sm p-6"
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    {L[language].cookies.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {L[language].cookies.p1}
                  </p>
                </motion.section>

                <motion.section
                  id="contact"
                  variants={cardIn}
                  initial="hidden"
                  animate="visible"
                  className="rounded-xl border bg-card/60 backdrop-blur-sm p-6"
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    {L[language].contact.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {L[language].contact.p1}
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-base mt-3">
                    <strong className="text-foreground">
                      {L[language].hosting.legal.split(":")[0]}:
                    </strong>{" "}
                    {L[language].contact.legal
                      .split(":")
                      .slice(1)
                      .join(":")
                      .trim()}
                  </p>
                </motion.section>

                <motion.section
                  id="github"
                  variants={cardIn}
                  initial="hidden"
                  animate="visible"
                  className="rounded-xl border bg-card/60 backdrop-blur-sm p-6"
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    {L[language].github.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {L[language].github.p1}
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-base mt-3">
                    <strong className="text-foreground">
                      {L[language].hosting.legal.split(":")[0]}:
                    </strong>{" "}
                    {L[language].github.legal
                      .split(":")
                      .slice(1)
                      .join(":")
                      .trim()}
                  </p>
                </motion.section>

                <motion.section
                  id="processors"
                  variants={cardIn}
                  initial="hidden"
                  animate="visible"
                  className="rounded-xl border bg-card/60 backdrop-blur-sm p-6"
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    {L[language].processors.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {L[language].processors.p1}
                  </p>
                </motion.section>

                <motion.section
                  id="rights"
                  variants={cardIn}
                  initial="hidden"
                  animate="visible"
                  className="rounded-xl border bg-card/60 backdrop-blur-sm p-6"
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    {L[language].rights.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {L[language].rights.p1}
                  </p>
                  {Array.isArray((L as any)[language]?.rights?.items) && (
                    <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      {((L as any)[language].rights.items as string[]).map(
                        (item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70" />
                            <span>{item}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  )}
                  <p className="text-muted-foreground leading-relaxed text-base mt-4">
                    {L[language].rights.p2}
                  </p>
                </motion.section>

                <motion.section
                  id="changes"
                  variants={cardIn}
                  initial="hidden"
                  animate="visible"
                  className="rounded-xl border bg-card/60 backdrop-blur-sm p-6"
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    {L[language].changes.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {L[language].changes.p1}
                  </p>
                </motion.section>

                <Separator className="my-12" />

                <motion.section
                  id="impressum"
                  variants={cardIn}
                  initial="hidden"
                  animate="visible"
                  className="rounded-xl border  backdrop-blur-sm p-6"
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    {L[language].impressum.title}
                  </h2>
                  <div className="text-muted-foreground leading-relaxed space-y-2 text-base">
                    <p>
                      <span className="font-semibold text-foreground">
                        {L[language].impressum.responsible}
                      </span>
                    </p>
                    <p>{L[language].impressum.name}</p>
                    <p>{L[language].impressum.location}</p>
                    <p>
                      <span className="font-semibold text-foreground">
                        {L[language].impressum.emailLabel}
                      </span>{" "}
                      <a
                        href="mailto:yanis.sebastian.zuercher@gmail.com"
                        className="link"
                      >
                        yanis.sebastian.zuercher@gmail.com
                      </a>
                    </p>
                  </div>
                </motion.section>
              </div>

              <motion.div
                {...trail(20)}
                className="mt-16 pt-8 border-t border-border"
                onClick={h}
              >
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
