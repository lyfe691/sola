/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

/* 這個網站是怎麼造出來的 — the title as one vertical column of ink, sealed in
   vermilion; the site's materials woven into a single line beside it.
   No entrance choreography: PageShell's blur-in is the reveal. The only
   motion here is one band of light passing down the characters, once. */

import "@fontsource/shippori-mincho-b1/400.css";
import "@fontsource/shippori-mincho-b1/600.css";

import { Fragment } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { LinkPreview } from "@/components/ui/custom/link-preview";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { REVEAL } from "@/utils/transitions";

const SCROLL_TITLE = "這個網站是怎麼造出來的";

/* everything the site is made of, in one breath — build, surface, motion,
   letters, ground. Hover previews carry the detail so labels don't have to. */
const MATERIALS: Array<{ name: string; href: string }> = [
  { name: "React", href: "https://react.dev" },
  { name: "TypeScript", href: "https://www.typescriptlang.org" },
  { name: "Vite", href: "https://vite.dev" },
  { name: "Tailwind CSS", href: "https://tailwindcss.com" },
  { name: "shadcn/ui", href: "https://ui.shadcn.com" },
  { name: "Motion", href: "https://motion.dev" },
  { name: "GSAP", href: "https://gsap.com" },
  {
    name: "Instrument Sans",
    href: "https://fonts.google.com/specimen/Instrument+Sans",
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

// links rest as plain ink — the underline only surfaces on hover, so the
// page keeps its printed stillness (the site-wide `link` accent is app voice)
const INK_LINK =
  "whitespace-nowrap rounded-sm underline-offset-4 hover:underline focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/50";

export default function AboutThisWebsite() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language].colophon;

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-6 py-16 text-foreground sm:px-8">
      <meta name="robots" content="noindex, nofollow" />

      <div className="flex w-full max-w-3xl flex-col-reverse items-center gap-14 font-mincho sm:flex-row sm:justify-between sm:gap-16">
        <div className="w-full min-w-0 sm:max-w-lg">
          <h1 className="font-mincho text-3xl font-semibold leading-snug text-balance sm:text-4xl">
            {t.title}
          </h1>

          <p className="mt-5 max-w-md text-[15px] leading-loose text-foreground/75">
            {t.intro}
          </p>

          <p className="mt-10 max-w-md text-[15px] leading-[2.1]">
            {MATERIALS.map((m, i) => (
              <Fragment key={m.name}>
                {i > 0 && <span className="text-foreground/30">・</span>}
                <LinkPreview href={m.href} className={INK_LINK} compact>
                  {m.name}
                </LinkPreview>
              </Fragment>
            ))}
          </p>

          <p className="mt-10 max-w-md text-[15px] leading-loose text-foreground/75">
            {t.setByHand} {t.thanks}
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`mt-12 text-[13px] text-foreground/55 transition-colors hover:text-foreground ${INK_LINK} hover:no-underline`}
          >
            ← {t.back}
          </button>
        </div>

        {/* the scroll — aria-hidden: it repeats the title for the eye, not the
            reader. One band of light passes down it after the page settles. */}
        <div
          aria-hidden
          className="flex shrink-0 select-none flex-col items-center gap-7"
        >
          <motion.span
            className="text-4xl leading-none tracking-[0.06em] [writing-mode:vertical-rl] sm:text-5xl"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, var(--foreground) 42%, var(--muted-foreground) 50%, var(--foreground) 58%)",
              backgroundSize: "100% 300%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
            initial={{ backgroundPosition: "0% 100%" }}
            animate={{ backgroundPosition: "0% 0%" }}
            transition={{ delay: 0.9, duration: 1.6, ease: REVEAL }}
          >
            {SCROLL_TITLE}
          </motion.span>
          {/* the page's only color: shu-iro, the vermilion of seal ink.
              造 — the last verb of the title — stands in for a maker's mark */}
          <span className="flex size-10 -rotate-2 items-center justify-center rounded-[3px] bg-[oklch(0.62_0.2_33)] text-xl font-semibold text-white">
            造
          </span>
        </div>
      </div>
    </div>
  );
}
