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
import { Mail, Linkedin, Info, ChevronDown, ChevronRight, ArrowUpRight } from "lucide-react";
import { FaGithubAlt } from "react-icons/fa";
import { SiChessdotcom, SiHackthebox, SiLeetcode } from "react-icons/si";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const Footer = () => {
  const year = new Date().getFullYear();
  const { language } = useLanguage();
  const t = translations[language];
  const [isLegalExpanded, setIsLegalExpanded] = useState(false);

  const social = [
    { 
      icon: <FaGithubAlt className="w-4 h-4" />, 
      href: "https://github.com/lyfe691", 
      label: "GitHub",
      hoverClass: "hover:bg-foreground/10 hover:scale-110"
    },
    { 
      icon: <Mail className="w-4 h-4" />, 
      href: "mailto:yanis.sebastian.zuercher@gmail.com", 
      label: "Email",
      hoverClass: "hover:bg-red-400/20 hover:border-red-400/30 hover:scale-110" 
    },
    { 
      icon: <Linkedin className="w-4 h-4" />, 
      href: "https://www.linkedin.com/in/yanis-sebastian-zürcher/", 
      label: "LinkedIn",
      hoverClass: "hover:bg-cyan-400/20 hover:border-cyan-400/30 hover:scale-110" 
    },
    {
      icon: <SiLeetcode className="w-4 h-4" />,
      href: "https://leetcode.com/u/lyfe691/",
      label: "LeetCode",
      hoverClass: "hover:bg-orange-400/20 hover:border-orange-400/30 hover:scale-110"
    },
    {
      icon: <SiHackthebox className="w-4 h-4" />,
      href: "https://app.hackthebox.com/profile/2350832",
      label: "Hack The Box",
      hoverClass: "hover:bg-emerald-300/20 hover:border-emerald-400/30 hover:scale-110"
    },
    { 
      icon: <SiChessdotcom className="w-4 h-4" />, 
      href: "https://chess.com/member/moment_o", 
      label: "Chess.com",
      hoverClass: "hover:bg-green-400/20 hover:border-green-400/30 hover:scale-110" 
    }, 
  ];

  const nav = [
    { text: t.nav.about,       path: "/about" },
    { text: t.nav.experience,  path: "/experience" },
    { text: t.nav.projects,    path: "/projects" },
    { text: t.nav.skills,      path: "/skills" },
    { text: t.nav.services,    path: "/services" },
    { text: t.nav.contact,     path: "/contact" }
  ];

  const e = "/a";

  return (
    <footer className="relative w-full border-t border-foreground/5 bg-background">
      {/* Bottom glow effect */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-96 pointer-events-none"
        style={{
          background: `linear-gradient(to top, 
            hsl(var(--foreground) / 0.12) 0%, 
            hsl(var(--foreground) / 0.08) 25%, 
            hsl(var(--foreground) / 0.04) 50%, 
            hsl(var(--foreground) / 0.02) 75%, 
            transparent 100%)`
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 py-12">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="space-y-6 lg:col-span-1">
            <div className="space-y-4">
              <Link 
                to="/" 
                className="group inline-flex items-center space-x-2 font-bold text-2xl text-foreground hover:text-primary transition-colors"
              >
                <span>YSZ</span>
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <p className="text-sm text-foreground/70 leading-relaxed">
                {t.footer.madeWith} <span className="text-primary animate-pulse">♥</span> {t.footer.by}<br />
                <span className="font-medium">Yanis Sebastian Zürcher</span>
              </p>
            </div>
            
            {/* About this website link */}
            <Link
              to={e}
              className="group inline-flex items-center gap-2 text-xs text-foreground/50 hover:text-primary transition-all duration-300"
            >
              <Info className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
              <span className="border-b border-dotted border-foreground/20 group-hover:border-primary">
                {t.footer.atw}
              </span>
            </Link>
            
            {/* Legal Section */}
            <div className="space-y-2">
              <button
                onClick={() => setIsLegalExpanded(!isLegalExpanded)}
                className="group inline-flex items-center gap-2 text-xs text-foreground/50 hover:text-primary transition-all duration-300"
              >
                <div className={`transition-transform duration-300 ${isLegalExpanded ? 'rotate-90' : ''}`}>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium">Legal</span>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${isLegalExpanded ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="ml-5 pt-2">
                  <Link
                    to="/privacy"
                    className="block text-xs text-foreground/50 hover:text-primary transition-colors border-b border-dotted border-foreground/20 hover:border-primary w-fit"
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold tracking-wider text-foreground/80 uppercase">
              {t.footer.navigation}
            </h3>
            <div className="space-y-3">
              <Link 
                to="/" 
                className="block text-sm text-foreground/60 hover:text-foreground hover:translate-x-1 transition-all duration-300"
              >
                Home
              </Link>
              <div className="w-8 h-px bg-gradient-to-r from-foreground/20 to-transparent" />
              {nav.map(({ text, path }) => (
                <Link 
                  key={path}
                  to={path} 
                  className="block text-sm text-foreground/60 hover:text-foreground hover:translate-x-1 transition-all duration-300"
                >
                  {text}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold tracking-wider text-foreground/80 uppercase">
              {t.footer.contact}
            </h3>
            <div className="space-y-4">
              <a 
                href="mailto:yanis.sebastian.zuercher@gmail.com" 
                className="group flex items-start gap-3 text-sm text-foreground/60 hover:text-foreground transition-all duration-300"
              >
                <Mail className="w-4 h-4 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="leading-relaxed break-all">
                  yanis.sebastian.zuercher@gmail.com
                </span>
              </a>
              <Link 
                to="/contact" 
                className="inline-flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground hover:translate-x-1 transition-all duration-300"
              >
                {t.footer.contactForm}
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold tracking-wider text-foreground/80 uppercase">
              {t.footer.connect}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {social.map((link) => (
                <a 
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className={`group relative p-3 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground/60 hover:text-foreground transition-all duration-300 ${link.hoverClass}`}
                >
                  <div className="relative z-10">
                    {link.icon}
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
          <div className="pt-8 text-center">
            <p className="text-xs text-foreground/40 leading-relaxed">
              © {year} <span className="font-medium">Yanis Sebastian Zürcher</span>. {t.footer.rights}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
