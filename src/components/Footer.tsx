/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { Mail, Linkedin, Info, ChevronRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { FaGithubAlt } from "react-icons/fa";
import { SiChessdotcom, SiHackthebox, SiLeetcode, SiTiktok } from "react-icons/si";
import { SOCIAL_LINKS, SOCIAL_ORDER_FOOTER } from "@/config/social";
import { useState } from "react";
import { toast } from "sonner";

const Footer = () => {
  const year = new Date().getFullYear();
  const { language } = useLanguage();
  const t = translations[language];
  const [isLegalExpanded, setIsLegalExpanded] = useState(false);
  const legalContentId = "footer-legal";

  const social = SOCIAL_ORDER_FOOTER.map(id => {
    const s = SOCIAL_LINKS[id];
    const icon = id === "github"
      ? <FaGithubAlt className="h-4 w-4" />
      : id === "email"
      ? <Mail className="h-4 w-4" />
      : id === "linkedin"
      ? <Linkedin className="h-4 w-4" />
      : id === "leetcode"
      ? <SiLeetcode className="h-4 w-4" />
      : id === "hackthebox"
      ? <SiHackthebox className="h-4 w-4" />
      : id === "tiktok"
      ? <SiTiktok className="h-4 w-4" />
      : <SiChessdotcom className="h-4 w-4" />;

    const hoverClass = id === "github"
      ? "hover:bg-foreground/10 hover:scale-110"
      : id === "email"
      ? "hover:bg-red-400/20 hover:border-red-400/30 hover:scale-110"
      : id === "linkedin"
      ? "hover:bg-cyan-400/20 hover:border-cyan-400/30 hover:scale-110"
      : id === "leetcode"
      ? "hover:bg-orange-400/20 hover:border-orange-400/30 hover:scale-110"
      : id === "hackthebox"
      ? "hover:bg-emerald-300/20 hover:border-emerald-400/30 hover:scale-110"
      : id === "tiktok"
      ? "hover:bg-pink-400/20 hover:border-pink-400/30 hover:scale-110"
      : "hover:bg-green-400/20 hover:border-green-400/30 hover:scale-110";

    return { icon, href: s.href, label: s.label, hoverClass };
  });

  const nav = [
    { text: t.nav.about, path: "/about" },
    { text: t.nav.experience, path: "/experience" },
    { text: t.nav.projects, path: "/projects" },
    { text: t.nav.skills, path: "/skills" },
    { text: t.nav.services, path: "/services" },
    { text: t.nav.contact, path: "/contact" }
  ];

  const aboutSitePath = "/a";

  return (
    <footer className="relative mt-24 w-full overflow-hidden border-t border-foreground/10 bg-background/60 backdrop-blur">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-0 h-[28rem] w-[28rem] -translate-x-1/2"
          style={{
            background: "radial-gradient(circle at top, hsl(var(--primary) / 0.18), transparent 65%)"
          }}
        />
        <div
          className="absolute bottom-[-30%] right-[12%] h-64 w-64"
          style={{
            background: "radial-gradient(circle, hsl(var(--foreground) / 0.1), transparent 70%)"
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:py-24">
        <div className="grid gap-16">
          <div className="relative overflow-hidden rounded-3xl border border-foreground/10 bg-background/80 shadow-[0_18px_48px_rgba(15,23,42,0.16)]">
            <div className="pointer-events-none absolute inset-0">
              <div
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(circle at top left, hsl(var(--primary) / 0.18), transparent 60%)",
                  opacity: 0.8
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--foreground) / 0.08), transparent 65%)"
                }}
              />
            </div>
            <div className="relative flex flex-col gap-8 px-8 py-10 sm:px-12 sm:py-12 md:flex-row md:items-center md:justify-between">
              <div className="space-y-5">
                <span className="inline-flex items-center gap-3 rounded-full border border-foreground/10 bg-background/80 px-4 py-1 text-xs font-medium uppercase tracking-[0.18em] text-foreground/60">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  {t.footer.availability}
                </span>
                <h2 className="text-2xl font-semibold leading-tight text-foreground sm:text-3xl lg:text-4xl">
                  {t.footer.ctaTitle}
                </h2>
                <p className="max-w-2xl text-sm leading-relaxed text-foreground/70 sm:text-base">
                  {t.footer.ctaSubtitle}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-all duration-300 hover:-translate-y-0.5 hover:bg-foreground/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                >
                  {t.footer.ctaPrimary}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/20 bg-background/70 px-5 py-3 text-sm font-medium text-foreground/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/40 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/40"
                >
                  {t.footer.ctaSecondary}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-8">
              <div className="space-y-5">
                <Link
                  to="/"
                  className="group inline-flex items-center gap-2 text-2xl font-bold text-foreground transition-colors hover:text-primary"
                >
                  <span className="rounded-full border border-foreground/20 bg-background/60 px-3 py-1 text-sm uppercase tracking-[0.32em]">YSZ</span>
                  <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
                <p className="text-sm leading-relaxed text-foreground/70">
                  {t.footer.madeWith} <span className="text-primary">♥</span> {t.footer.by}{" "}
                  <span className="font-medium">Yanis Sebastian Zürcher</span>
                </p>
              </div>
              <div className="space-y-3">
                <Link
                  to={aboutSitePath}
                  className="group inline-flex items-center gap-2 text-xs text-foreground/60 transition-all duration-300 hover:text-primary"
                >
                  <Info className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-12" />
                  <span className="border-b border-dotted border-foreground/20 transition-colors duration-300 group-hover:border-primary">
                    {t.footer.atw}
                  </span>
                </Link>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setIsLegalExpanded(value => !value)}
                    aria-expanded={isLegalExpanded}
                    aria-controls={legalContentId}
                    className="group inline-flex items-center gap-2 text-xs font-medium text-foreground/60 transition-all duration-300 hover:text-foreground"
                  >
                    <div className={`transition-transform duration-300 ${isLegalExpanded ? "rotate-90" : ""}`}>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                    {t.footer.legal}
                  </button>
                  <div
                    id={legalContentId}
                    className={`overflow-hidden transition-all duration-300 ${isLegalExpanded ? "max-h-24 opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <div className="ml-5 pt-2">
                      <Link
                        to="/privacy"
                        className="group inline-flex items-center gap-1 text-xs text-foreground/60 transition-all duration-300 hover:text-primary"
                      >
                        <span className="border-b border-dotted border-foreground/20 transition-colors duration-300 group-hover:border-primary">
                          {t.footer.privacy}
                        </span>
                        <ArrowUpRight className="h-2.5 w-2.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
                {t.footer.navigation}
              </h3>
              <div className="space-y-3">
                <Link
                  to="/"
                  className="block text-sm text-foreground/60 transition-all duration-300 hover:translate-x-1 hover:text-foreground"
                >
                  {t.common.home}
                </Link>
                <div className="h-px w-10 bg-gradient-to-r from-foreground/20 to-transparent" />
                {nav.map(({ text, path }) => (
                  <Link
                    key={path}
                    to={path}
                    className="block text-sm text-foreground/60 transition-all duration-300 hover:translate-x-1 hover:text-foreground"
                  >
                    {text}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
                {t.footer.contact}
              </h3>
              <div className="space-y-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("yanis.sebastian.zuercher@gmail.com");
                    toast.success("Copied.");
                  }}
                  className="group inline-flex w-full items-center gap-3 rounded-2xl border border-foreground/10 bg-background/70 px-4 py-3 text-left text-sm text-foreground/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/30 hover:text-foreground"
                >
                  <Mail className="h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110" />
                  <span className="leading-relaxed">
                    yanis.sebastian.zuercher@gmail.com
                  </span>
                </button>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-sm text-foreground/60 transition-all duration-300 hover:translate-x-1 hover:text-foreground"
                >
                  {t.footer.contactForm}
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
                {t.footer.connect}
              </h3>
              <div className="flex flex-wrap gap-3">
                {social.map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className={`group relative flex h-11 w-11 items-center justify-center rounded-xl border border-foreground/10 bg-background/70 text-foreground/60 transition-all duration-300 hover:-translate-y-1 hover:text-foreground ${link.hoverClass}`}
                  >
                    <div className="relative z-10">
                      {link.icon}
                    </div>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-foreground/10 pt-8">
            <div className="flex flex-col items-start justify-between gap-4 text-xs text-foreground/50 sm:flex-row sm:items-center">
              <p className="leading-relaxed">
                © {year} <span className="font-medium text-foreground/70">Yanis Sebastian Zürcher</span>. {t.footer.rights}
              </p>
              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-foreground/40">
                <span className="h-px w-6 bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
                YSZ
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
