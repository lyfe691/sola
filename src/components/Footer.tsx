/**
 * Copyright (c) 2025 Sebastian Zürcher
 * 
 * This file is part of the project and is subject to the terms of the project's LICENSE (GNU GPL v3).
 * Please refer to the LICENSE file in the project root for full licensing details.
 * 
 * All rights reserved.
 */

import { Link } from "react-router-dom";
import { useLanguage } from "../lib/language-provider";
import { translations } from "../lib/translations";
import { Github, Mail, Linkedin } from "lucide-react";
import { SiChessdotcom } from "react-icons/si";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { language } = useLanguage();
  const t = translations[language];

  const socialLinks = [
    { icon: <Github className="w-4 h-4" />, href: "https://github.com/lyfe691", label: "GitHub" },
    { icon: <Mail className="w-4 h-4" />, href: "mailto:yanis.sebastian.zuercher@gmail.com", label: "Email" },
    { icon: <Linkedin className="w-4 h-4" />, href: "https://www.linkedin.com/in/yanis-sebastian-zürcher/", label: "LinkedIn" },
    { icon: <SiChessdotcom className="w-4 h-4" />, href: "https://chess.com/member/moment_o", label: "Chess.com" }
  ];

  const navLinks = [
    { text: t.nav.about, path: "/about" },
    { text: t.nav.experience, path: "/experience" },
    { text: t.nav.projects, path: "/projects" },
    { text: t.nav.skills, path: "/skills" },
    { text: t.nav.services, path: "/services" },
    { text: t.nav.contact, path: "/contact" }
  ];

  return (
    <footer className="w-full border-t border-foreground/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8">
        {/* Footer top section with links and socials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="space-y-4">
            <Link to="/" target="_top" className="text-foreground font-bold text-xl">YSZ</Link>
            <p className="text-sm text-foreground/70">
              {t.footer.madeWith} <span className="text-primary">♥</span> {t.footer.by} Yanis Sebastian Zürcher
            </p>
          </div>
          
          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
              {t.footer.navigation}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-sm text-foreground/60 hover:text-foreground/90 transition-colors">
                  Home
                </Link>
              </li>
              <Separator className="w-24" />
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-sm text-foreground/60 hover:text-foreground/90 transition-colors"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
              {t.footer.contact}
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-sm text-foreground/60">
                <Mail className="w-4 h-4 mr-2" />
                <a href="mailto:yanis.sebastian.zuercher@gmail.com" className="hover:text-foreground/90 transition-colors">
                  yanis.sebastian.zuercher@gmail.com
                </a>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-sm text-foreground/60 hover:text-foreground/90 transition-colors flex items-center"
                >
                  {t.footer.contactForm}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Connect */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
              {t.footer.connect}
            </h3>
            <div className="flex flex-wrap gap-3 mt-4">
              {socialLinks.map((link) => (
                <a 
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="p-2 rounded-full border border-foreground/10 bg-foreground/5 text-foreground/60 hover:text-foreground hover:bg-foreground/10 transition-all"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Copyright section - simplified */}
        <div className="mt-8 pt-6 border-t border-foreground/5 text-center">
          <div className="font-mono text-xs text-foreground/40">
            &copy; {currentYear} {t.footer.rights}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
