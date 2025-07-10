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
import { Mail, Linkedin, Info, ChevronDown, ChevronRight } from "lucide-react";
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
      hoverClass: "hover:bg-foreground/10" // default hover background
    },
    { 
      icon: <Mail className="w-4 h-4" />, 
      href: "mailto:yanis.sebastian.zuercher@gmail.com", 
      label: "Email",
      hoverClass: "hover:bg-red-400/20 hover:border-red-400/30" 
    },
    { 
      icon: <Linkedin className="w-4 h-4" />, 
      href: "https://www.linkedin.com/in/yanis-sebastian-zürcher/", 
      label: "LinkedIn",
      hoverClass: "hover:bg-cyan-400/20 hover:border-cyan-400/30" 
    },
    {
      icon: <SiLeetcode className="w-4 h-4" />,
      href: "https://leetcode.com/u/lyfe691/",
      label: "LeetCode",
      hoverClass: "hover:bg-orange-400/20 hover:border-orange-400/30"
    },
    {
      icon: <SiHackthebox className="w-4 h-4" />,
      href: "https://app.hackthebox.com/profile/2350832",
      label: "Hack The Box",
      hoverClass: "hover:bg-emerald-300/20 hover:border-emerald-400/30"
    },
    { 
      icon: <SiChessdotcom className="w-4 h-4" />, 
      href: "https://chess.com/member/moment_o", 
      label: "Chess.com",
      hoverClass: "hover:bg-green-400/20 hover:border-green-400/30" 
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
    <footer className="w-full border-t border-foreground/10 bg-background">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 py-8">
        {/* top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* logo  */}
          <div className="space-y-4">
            <Link to="/" className="font-bold text-xl text-foreground">YSZ</Link>
            <p className="text-sm text-foreground/70">
              {t.footer.madeWith} <span className="text-primary">♥</span> {t.footer.by} Yanis&nbsp;Sebastian&nbsp;Zürcher
            </p>
            
            {/*  /這個網站是怎麼造出來的  */}
            <Link
              to={e}
              className="inline-flex items-center gap-1 text-xs text-foreground/50 hover:text-primary transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
              {t.footer.atw}
            </Link>
            
            {/* legal expandable section */}
            <div className="mt-4">
              <button
                onClick={() => setIsLegalExpanded(!isLegalExpanded)}
                className="inline-flex items-center gap-1 text-xs  text-foreground/50 hover:text-primary transition-colors"
              >
                {isLegalExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
                Legal
              </button>
              
              {isLegalExpanded && (
                <div className="mt-2 ml-4 space-y-1">
                  <Link
                    to="/privacy"
                    className="block text-xs text-foreground/50 hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* nav links */}
          <div className="space-y-4">
            <h3 className="uppercase text-sm font-semibold tracking-wider text-foreground/80">
              {t.footer.navigation}
            </h3>
            <ul className="space-y-2 mt-4">
              <li><Link to="/" className="text-sm text-foreground/60 hover:text-foreground transition">Home</Link></li>
              <Separator className="w-24" />
              {nav.map(({ text, path }) => (
                <li key={path}>
                  <Link to={path} className="text-sm text-foreground/60 hover:text-foreground transition">{text}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* contact */}
          <div className="space-y-4">
            <h3 className="uppercase text-sm font-semibold tracking-wider text-foreground/80">
              {t.footer.contact}
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-sm text-foreground/60">
                <Mail className="w-4 h-4 mr-2" />
                <a href="mailto:yanis.sebastian.zuercher@gmail.com" className="hover:text-foreground transition">
                  yanis.sebastian.zuercher@gmail.com
                </a>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-foreground/60 hover:text-foreground transition">
                  {t.footer.contactForm}
                </Link>
              </li>
            </ul>
          </div>

          {/* socials */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
              {t.footer.connect}
            </h3>
            <div className="flex flex-wrap gap-3 mt-4">
              {social.map((link) => (
                <a 
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className={`p-2 rounded-full border border-foreground/10 bg-foreground/5 text-foreground/60 hover:text-foreground transition-all ${link.hoverClass}`}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* copyright */}
        <div className="mt-8 pt-6 border-t border-foreground/5 text-center">
          <span className="text-xs text-foreground/40">
            © {year} Yanis Sebastian Zürcher. {t.footer.rights}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
