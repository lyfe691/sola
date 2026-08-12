/*
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * WARNING: Copying this file is strictly prohibited - it will lead to legal action.
 */

import { motion } from "motion/react";
import { fadeUpVariants, cardInVariants } from "@/utils/transitions";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLanguage } from "@/lib/language-provider";
import { INTL_LOCALE } from "@/lib/dates";
import { translations } from "@/lib/translations";
import { LinkPreview } from "@/components/ui/custom/link-preview";
import { IconButton } from "@/components/ui/custom/icon-button";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

const Privacy = () => {
  const n = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  const L = {
    en: {
      pageTitle: "Privacy Policy",
      legalLabel: "Legal basis: ",
      lastUpdated: "Last updated: March 2026",
      intro: {
        title: "Introduction",
        p1: (
          <>
            This personal portfolio website ({" "}
            <LinkPreview href="https://sola.ysz.life" className="link" compact>
              {"https://sola.ysz.life"}
            </LinkPreview>{" "}
            ) showcases my projects and freelance services. This privacy policy
            complies with the Swiss Federal Act on Data Protection (revFADP
            2023) and the EU General Data Protection Regulation (GDPR) and
            explains what data are processed and why.
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
          "Art. 6(1)(f) GDPR — legitimate interests in operating and safeguarding the site.",
      },
      analytics: {
        title: "Analytics",
        p1: "Visitor statistics are collected with Vercel Analytics. Data are anonymised prior to storage; no cookies or cross‑site identifiers are set.",
        legal:
          "Art. 6(1)(f) GDPR — legitimate interests in analysing and improving performance without infringing on privacy.",
      },
      cookies: {
        title: "Cookies",
        p1: "This site does not set tracking cookies. Essential cookies may be used by the hosting platform only where strictly necessary for security and delivery.",
      },
      contact: {
        title: "Contact",
        p1: "If you contact me (form or email), the data you provide (name, email, message) are processed solely to handle your enquiry and possible follow‑ups.",
        legal:
          "Art. 6(1)(a) GDPR — consent; and, where relevant, Art. 6(1)(b) GDPR — pre‑contractual steps at your request.",
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
          "Art. 6(1)(f) GDPR — legitimate interests in presenting open‑source activity.",
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
      legalLabel: "Rechtsgrundlage: ",
      lastUpdated: "Zuletzt aktualisiert: März 2026",
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
            Verbindungsdaten (z. B. IP‑Adresse, Browsertyp, Zugriffszeit) in
            Server‑Logs, um die Website sicher und zuverlässig bereitzustellen.
          </>
        ),
        legal:
          "Art. 6 Abs. 1 lit. f DSGVO — berechtigtes Interesse am Betrieb und an der Absicherung der Website.",
      },
      analytics: {
        title: "Analytics",
        p1: "Besucherstatistiken werden mit Vercel Analytics erhoben. Die Daten werden vor Speicherung anonymisiert; es werden keine Cookies oder Cross‑Site‑Identifier gesetzt.",
        legal:
          "Art. 6 Abs. 1 lit. f DSGVO — berechtigtes Interesse an Analyse und Performanceverbesserung bei Wahrung der Privatsphäre.",
      },
      cookies: {
        title: "Cookies",
        p1: "Diese Seite setzt keine Tracking‑Cookies. Plattformbedingt können nur technisch notwendige Cookies für Sicherheit und Auslieferung verwendet werden.",
      },
      contact: {
        title: "Kontakt",
        p1: "Bei Kontaktaufnahme (Formular oder E‑Mail) werden die angegebenen Daten (Name, E‑Mail, Nachricht) ausschließlich zur Bearbeitung der Anfrage und etwaiger Rückfragen verarbeitet.",
        legal:
          "Art. 6 Abs. 1 lit. a DSGVO — Einwilligung; ggf. Art. 6 Abs. 1 lit. b DSGVO — vorvertragliche Maßnahmen auf Ihre Anfrage.",
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
          "Art. 6 Abs. 1 lit. f DSGVO — berechtigtes Interesse an der Darstellung von Open‑Source‑Aktivität.",
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
      legalLabel: "Base jurídica: ",
      lastUpdated: "Última actualización: marzo de 2026",
      intro: {
        title: "Introducción",
        p1: (
          <>
            Este sitio personal ({" "}
            <LinkPreview href="https://sola.ysz.life" className="link" compact>
              {"https://sola.ysz.life"}
            </LinkPreview>{" "}
            ) presenta mis proyectos y servicios. Cumple con la LPD suiza
            (revFADP 2023) y el RGPD de la UE, explicando qué datos se tratan y
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
            (EE. UU.). Vercel registra datos de conexión (IP, navegador, hora)
            para entregar el sitio de forma segura.
          </>
        ),
        legal:
          "art. 6.1.f RGPD — interés legítimo en operar y proteger el sitio.",
      },
      analytics: {
        title: "Analítica",
        p1: "Las estadísticas se recogen con Vercel Analytics. Los datos se anonimizan antes de almacenarse; no se usan cookies ni identificadores entre sitios.",
        legal:
          "art. 6.1.f RGPD — interés legítimo en analizar y mejorar el rendimiento respetando la privacidad.",
      },
      cookies: {
        title: "Cookies",
        p1: "Este sitio no utiliza cookies de seguimiento. La plataforma puede usar solo cookies esenciales cuando sea estrictamente necesario.",
      },
      contact: {
        title: "Contacto",
        p1: "Si me contactas (formulario o correo), los datos facilitados (nombre, correo, mensaje) se procesan solo para atender tu solicitud y posibles seguimientos.",
        legal:
          "art. 6.1.a RGPD — consentimiento; y, en su caso, art. 6.1.b RGPD — medidas precontractuales a petición del interesado.",
      },
      github: {
        title: "Contenido de GitHub",
        p1: (
          <>
            Páginas pueden cargar recursos de{" "}
            <LinkPreview href="https://github.com" className="link" compact>
              GitHub, Inc.
            </LinkPreview>{" "}
            (EE. UU.). Se transmite tu IP al solicitar dichos recursos. GitHub
            participa en el EU–US Data Privacy Framework.
          </>
        ),
        legal:
          "art. 6.1.f RGPD — interés legítimo en mostrar actividad de código abierto.",
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
      legalLabel: "法的根拠: ",
      lastUpdated: "最終更新日: 2026年3月",
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
        legal: "GDPR第6条1項(f) — 正当な利益（サイト運営・保護）。",
      },
      analytics: {
        title: "アクセス解析",
        p1: "Vercel Analytics を用いて統計を収集します。保存前に匿名化され、クッキーやクロスサイト識別子は使用しません。",
        legal:
          "GDPR第6条1項(f) — プライバシーを損なわない範囲での性能改善という正当な利益。",
      },
      cookies: {
        title: "クッキー",
        p1: "本サイトはトラッキングクッキーを使用しません。必要最小限のセキュリティ・配信目的に限り、プラットフォーム由来のクッキーが用いられる場合があります。",
      },
      contact: {
        title: "お問い合わせ",
        p1: "フォームまたはメールでご連絡いただいた場合、提供されたデータ（氏名・メール・メッセージ）は、対応および必要に応じた連絡のためにのみ処理します。",
        legal:
          "GDPR第6条1項(a) — 同意、必要に応じて第6条1項(b) — 事前契約措置。",
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
        legal: "GDPR第6条1項(f) — オープンソース活動の提示に関する正当な利益。",
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
      legalLabel: "法律依据：",
      lastUpdated: "最后更新：2026年3月",
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
        legal: "GDPR 第6条1款(f)——基于运营与安全的合法利益。",
      },
      analytics: {
        title: "分析",
        p1: "使用 Vercel Analytics 收集访问统计。数据在存储前已匿名化；不设置 Cookie 或跨站标识符。",
        legal:
          "GDPR 第6条1款(f)——在不侵犯隐私的前提下进行性能分析与改进的合法利益。",
      },
      cookies: {
        title: "Cookie",
        p1: "本站不使用跟踪性 Cookie。平台仅在安全与交付所必需时使用必要性 Cookie。",
      },
      contact: {
        title: "联系我",
        p1: "当你通过表单或电子邮件联系我时，你提供的姓名、邮箱与消息仅用于处理你的请求及后续沟通。",
        legal:
          "GDPR 第6条1款(a)——同意；必要时，第6条1款(b)——应你请求的合同前措施。",
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
        legal: "GDPR 第6条1款(f)——展示开源活动的合法利益。",
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
    ko: {
      pageTitle: "개인정보 처리방침",
      legalLabel: "법적 근거: ",
      lastUpdated: "최종 업데이트: 2026년 3월",
      intro: {
        title: "소개",
        p1: (
          <>
            이 개인 포트폴리오 웹사이트({" "}
            <LinkPreview href="https://sola.ysz.life" className="link" compact>
              {"https://sola.ysz.life"}
            </LinkPreview>{" "}
            )는 제 프로젝트와 프리랜스 서비스를 소개합니다. 본 개인정보
            처리방침은 스위스 연방 데이터 보호법(revFADP 2023)과 EU 일반
            개인정보 보호법(GDPR)을 준수하며, 어떤 데이터가 어떤 이유로
            처리되는지 설명합니다.
          </>
        ),
        controller: "데이터 컨트롤러:",
        controllerVal: "Yanis Sebastian Zürcher, 스위스",
        contact: "연락처:",
        email: "yanis.sebastian.zuercher@gmail.com",
      },
      hosting: {
        title: "호스팅",
        p1: (
          <>
            본 사이트는{" "}
            <LinkPreview href="https://vercel.com" className="link" compact>
              Vercel Inc.
            </LinkPreview>
            (미국 캘리포니아주 Walnut, 340 S Lemon Ave #4133, CA 91789)에서
            호스팅됩니다. Vercel은 웹사이트를 안전하고 안정적으로 제공하기 위해
            서버 로그에 연결 데이터(예: IP 주소, 브라우저 유형, 접속 시각)를
            저장합니다.
          </>
        ),
        legal: "GDPR 제6조 1항 (f) — 사이트 운영 및 보호에 대한 정당한 이익.",
      },
      analytics: {
        title: "분석",
        p1: "방문 통계는 Vercel Analytics로 수집합니다. 데이터는 저장 전에 익명화되며, 쿠키나 교차 사이트 식별자는 설정되지 않습니다.",
        legal:
          "GDPR 제6조 1항 (f) — 개인정보를 침해하지 않으면서 성능을 분석·개선하기 위한 정당한 이익.",
      },
      cookies: {
        title: "쿠키",
        p1: "본 사이트는 추적 쿠키를 설정하지 않습니다. 호스팅 플랫폼은 보안 및 전송에 꼭 필요한 경우에만 필수 쿠키를 사용할 수 있습니다.",
      },
      contact: {
        title: "문의",
        p1: "양식이나 이메일로 연락하시면, 제공하신 데이터(이름, 이메일, 메시지)는 문의 처리 및 필요한 후속 대응을 위해서만 처리됩니다.",
        legal:
          "GDPR 제6조 1항 (a) — 동의, 그리고 해당하는 경우 제6조 1항 (b) — 귀하의 요청에 따른 계약 전 조치.",
      },
      github: {
        title: "GitHub 콘텐츠",
        p1: (
          <>
            일부 페이지는{" "}
            <LinkPreview href="https://github.com" className="link" compact>
              GitHub, Inc.
            </LinkPreview>{" "}
            (미국)의 기여 그래프나 저장소 위젯을 불러올 수 있습니다. 이러한
            리소스를 요청할 때 귀하의 IP 주소가 전송됩니다. GitHub은 EU–US Data
            Privacy Framework에 참여합니다.
          </>
        ),
        legal:
          "GDPR 제6조 1항 (f) — 오픈 소스 활동을 보여 주기 위한 정당한 이익.",
      },
      processors: {
        title: "처리자",
        p1: "Vercel 및 Vercel Analytics에 의한 처리는 GDPR 제28조 및 revFADP 제9조에 부합하는 데이터 처리 계약의 적용을 받습니다.",
      },
      rights: {
        title: "귀하의 권리",
        p1: "귀하는 열람, 정정, 삭제, 처리 제한, 데이터 이동을 요청할 수 있으며, 정당한 이익에 기반한 처리에 이의를 제기할 수 있습니다.",
        p2: (
          <>
            권리를 행사하려면{" "}
            <a
              href="mailto:yanis.sebastian.zuercher@gmail.com"
              className="link"
            >
              yanis.sebastian.zuercher@gmail.com
            </a>
            으로 이메일을 보내 주세요. 스위스 거주자는 FDPIC에, EU 거주자는 관할
            감독 기관에 불만을 제기할 수 있습니다.
          </>
        ),
        items: [
          "데이터 열람 (GDPR 제15조)",
          "정정 (GDPR 제16조)",
          "삭제 (GDPR 제17조)",
          "처리 제한 (GDPR 제18조)",
          "데이터 이동권 (GDPR 제20조)",
          "정당한 이익에 대한 이의 (GDPR 제21조)",
        ],
      },
      changes: {
        title: "변경",
        p1: (
          <>
            법률 또는 기능 변경으로 본 방침이 달라질 수 있습니다. 최신 버전은{" "}
            <LinkPreview
              href="https://sola.ysz.life/privacy"
              className="link"
              compact
            >
              {"https://sola.ysz.life/privacy"}
            </LinkPreview>
            에서 확인할 수 있습니다.
          </>
        ),
      },
      impressum: {
        title: "법적 고지",
        responsible: "본 웹사이트 책임자:",
        name: "Yanis Sebastian Zürcher",
        location: "취리히, 스위스",
        emailLabel: "이메일:",
      },
      back: "뒤로",
    },
  } as const;

  const privacyLanguage = language;

  // last updated utilities
  const LAST_UPDATED_ISO = "2026-03-16"; // update when content meaningfully changes
  const updatedDate = new Date(LAST_UPDATED_ISO);
  const formattedUpdated = updatedDate.toLocaleDateString(
    INTL_LOCALE[language],
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );
  const updatedLabel = {
    en: "Updated",
    de: "Aktualisiert",
    es: "Actualizado",
    ja: "更新",
    ko: "업데이트",
    zh: "已更新",
  }[language];

  const h = () => {
    n(-1);
  };

  // shared in-view pair from transitions.ts — content reveals ride the
  // REVEAL register, and the shapes can't drift from Certifications
  const fadeUp = fadeUpVariants;
  const cardIn = cardInVariants;
  // Reveal-on-scroll props shared by every section card.
  const reveal = {
    variants: cardIn,
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: { once: true, margin: "-10% 0px" },
  };

  return (
    <>
      <meta name="description" content={t.seo.privacy.description} />

      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          className="mb-8"
        >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  render={
                    <Link to="/">
                      <span className="text-muted-foreground hover:text-primary transition-colors">
                        {t.common.home}
                      </span>
                    </Link>
                  }
                />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t.footer.privacy}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>
      </div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10% 0px" }}
        className="mb-16 text-center"
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight text-wrap wrap-break-word">
          {L[privacyLanguage].pageTitle}
        </h1>
        <div className="mt-8 flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border bg-background/60 px-2.5 py-1 text-2xs/[1rem] text-foreground/60 backdrop-blur-xs">
            {updatedLabel}:{" "}
            <span className="font-medium text-foreground">
              {formattedUpdated}
            </span>
          </span>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          {/* Intro card */}
          <motion.section id="introduction" {...reveal}>
            <Card className="gap-0 h-full px-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {L[privacyLanguage].intro.title}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                <p>{L[privacyLanguage].intro.p1}</p>
                <p>
                  <strong className="text-foreground">
                    {L[privacyLanguage].intro.controller}
                  </strong>{" "}
                  {L[privacyLanguage].intro.controllerVal}
                  <br />
                  <strong className="text-foreground">
                    {L[privacyLanguage].intro.contact}
                  </strong>{" "}
                  <a
                    href="mailto:yanis.sebastian.zuercher@gmail.com"
                    className="link"
                  >
                    {L[privacyLanguage].intro.email}
                  </a>
                </p>
              </div>
            </Card>
          </motion.section>

          {/* Two-column cards where space allows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.section id="hosting" {...reveal}>
              <Card className="gap-0 h-full px-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {L[privacyLanguage].hosting.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {L[privacyLanguage].hosting.p1}
                </p>
                <p className="text-muted-foreground leading-relaxed text-base mt-3">
                  <strong className="text-foreground">
                    {L[privacyLanguage].legalLabel}
                  </strong>
                  {L[privacyLanguage].hosting.legal}
                </p>
              </Card>
            </motion.section>

            <motion.section id="analytics" {...reveal}>
              <Card className="gap-0 h-full px-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {L[privacyLanguage].analytics.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {L[privacyLanguage].analytics.p1}
                </p>
                <p className="text-muted-foreground leading-relaxed text-base mt-3">
                  <strong className="text-foreground">
                    {L[privacyLanguage].legalLabel}
                  </strong>
                  {L[privacyLanguage].analytics.legal}
                </p>
              </Card>
            </motion.section>
          </div>

          <motion.section id="cookies" {...reveal}>
            <Card className="gap-0 h-full px-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {L[privacyLanguage].cookies.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                {L[privacyLanguage].cookies.p1}
              </p>
            </Card>
          </motion.section>

          <motion.section id="contact" {...reveal}>
            <Card className="gap-0 h-full px-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {L[privacyLanguage].contact.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                {L[privacyLanguage].contact.p1}
              </p>
              <p className="text-muted-foreground leading-relaxed text-base mt-3">
                <strong className="text-foreground">
                  {L[privacyLanguage].legalLabel}
                </strong>
                {L[privacyLanguage].contact.legal}
              </p>
            </Card>
          </motion.section>

          <motion.section id="github" {...reveal}>
            <Card className="gap-0 h-full px-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {L[privacyLanguage].github.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                {L[privacyLanguage].github.p1}
              </p>
              <p className="text-muted-foreground leading-relaxed text-base mt-3">
                <strong className="text-foreground">
                  {L[privacyLanguage].legalLabel}
                </strong>
                {L[privacyLanguage].github.legal}
              </p>
            </Card>
          </motion.section>

          <motion.section id="processors" {...reveal}>
            <Card className="gap-0 h-full px-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {L[privacyLanguage].processors.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                {L[privacyLanguage].processors.p1}
              </p>
            </Card>
          </motion.section>

          <motion.section id="rights" {...reveal}>
            <Card className="gap-0 h-full px-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {L[privacyLanguage].rights.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                {L[privacyLanguage].rights.p1}
              </p>
              {"items" in L[privacyLanguage].rights &&
                Array.isArray(L[privacyLanguage].rights.items) && (
                  <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    {(L[privacyLanguage].rights.items as string[]).map(
                      (item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <span
                            aria-hidden
                            className="flex h-5 shrink-0 items-center"
                          >
                            <span className="size-1.5 rounded-full bg-primary/70" />
                          </span>
                          <span>{item}</span>
                        </li>
                      ),
                    )}
                  </ul>
                )}
              <p className="text-muted-foreground leading-relaxed text-base mt-4">
                {L[privacyLanguage].rights.p2}
              </p>
            </Card>
          </motion.section>

          <motion.section id="changes" {...reveal}>
            <Card className="gap-0 h-full px-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {L[privacyLanguage].changes.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                {L[privacyLanguage].changes.p1}
              </p>
            </Card>
          </motion.section>

          <Separator className="my-12" />

          <motion.section id="impressum" {...reveal}>
            <Card className="gap-0 h-full px-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {L[privacyLanguage].impressum.title}
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-2 text-base">
                <p>
                  <span className="font-semibold text-foreground">
                    {L[privacyLanguage].impressum.responsible}
                  </span>
                </p>
                <p>{L[privacyLanguage].impressum.name}</p>
                <p>{L[privacyLanguage].impressum.location}</p>
                <p>
                  <span className="font-semibold text-foreground">
                    {L[privacyLanguage].impressum.emailLabel}
                  </span>{" "}
                  <a
                    href="mailto:yanis.sebastian.zuercher@gmail.com"
                    className="link"
                  >
                    yanis.sebastian.zuercher@gmail.com
                  </a>
                </p>
              </div>
            </Card>
          </motion.section>
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          className="mt-16 pt-8 border-t border-border"
        >
          <IconButton
            icon={<ArrowLeft className="w-4 h-4" />}
            variant="ghost"
            size="sm"
            iconPosition="left"
            onClick={h}
            className="inline-flex items-center gap-2 text-sm "
          >
            {L[privacyLanguage].back}
          </IconButton>
        </motion.div>
      </div>
    </>
  );
};

export default Privacy;
