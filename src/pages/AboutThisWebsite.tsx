/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

/* The colophon as a hidden page: bare text set top-left in the site's
   mincho serif, nothing else — no ornament, no motion, no centering.
   PageShell's blur-in is the only entrance. */

import "@fontsource/shippori-mincho-b1/400.css";
import "@fontsource/shippori-mincho-b1/600.css";

import { Fragment } from "react";
import { useNavigate } from "react-router";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";

/* everything the site is made of, in one breath */
const MATERIALS: Array<{ name: string; href: string }> = [
  { name: "React", href: "https://react.dev" },
  { name: "TypeScript", href: "https://www.typescriptlang.org" },
  { name: "Vite", href: "https://vite.dev" },
  { name: "Tailwind CSS", href: "https://tailwindcss.com" },
  { name: "shadcn/ui", href: "https://ui.shadcn.com" },
  { name: "Motion", href: "https://motion.dev" },
  { name: "GSAP", href: "https://gsap.com" },
  {
    name: "Onest",
    href: "https://fonts.google.com/specimen/Onest",
  },
  {
    name: "Bricolage Grotesque",
    href: "https://fonts.google.com/specimen/Bricolage+Grotesque",
  },
  {
    name: "JetBrains Mono",
    href: "https://fonts.google.com/specimen/JetBrains+Mono",
  },
  {
    name: "Shippori Mincho B1",
    href: "https://fonts.google.com/specimen/Shippori+Mincho+B1",
  },
  { name: "Vercel", href: "https://vercel.com" },
  { name: "GitHub", href: "https://github.com/lyfe691/sola" },
];

// links rest as plain ink — the underline only surfaces on hover
const INK_LINK =
  "whitespace-nowrap rounded-sm underline-offset-4 hover:underline focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/50";

export default function AboutThisWebsite() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language].colophon;

  return (
    <main className="min-h-svh bg-background px-6 py-20 font-mincho text-foreground sm:px-10 sm:py-28">
      <meta name="robots" content="noindex, nofollow" />

      <div className="max-w-md text-[15px] leading-loose">
        <h1 className="font-semibold">{t.title}</h1>

        <p className="mt-6 text-foreground/70">{t.intro}</p>

        <p className="mt-6">
          {MATERIALS.map((m, i) => (
            <Fragment key={m.name}>
              {i > 0 && <span className="text-foreground/30">・</span>}
              <a
                href={m.href}
                target="_blank"
                rel="noopener noreferrer"
                className={INK_LINK}
              >
                {m.name}
              </a>
            </Fragment>
          ))}
        </p>

        <p className="mt-6 text-foreground/70">
          {t.setByHand} {t.thanks}
        </p>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className={`mt-10 text-[13px] text-foreground/55 transition-colors hover:text-foreground ${INK_LINK} hover:no-underline`}
        >
          ← {t.back}
        </button>
      </div>
    </main>
  );
}
