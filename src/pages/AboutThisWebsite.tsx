/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

/* Hidden colophon: one mincho voice, top-left, no ornament.
   PageShell's blur-in is the only entrance. */

import "@fontsource/shippori-mincho-b1/400.css";

import { use } from "react";
import { useNavigate } from "react-router";
import { RichText } from "@/components/i18n/RichText";
import { useLanguage, useTranslation } from "@/lib/language-provider";

const INK =
  "rounded-sm text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground/70 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/50";

const FACE = '400 1em "Shippori Mincho B1"';
const faces = new Map<string, Promise<unknown>>();

/**
 * The page is set in one face, so it holds (suspended, like its chunk) until
 * that face has loaded for its own text: swapping it in under the blur-in
 * reflowed every line. Capped, so a failed font never blocks the page.
 */
function faceFor(language: string, text: string) {
  let ready = faces.get(language);
  if (!ready) {
    ready = Promise.race([
      document.fonts.load(FACE, text).catch(() => undefined),
      new Promise((resolve) => setTimeout(resolve, 2000)),
    ]);
    faces.set(language, ready);
  }
  return ready;
}

export default function AboutThisWebsite() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = useTranslation().colophon;
  use(faceFor(language, Object.values(t).join(" ")));

  return (
    <div className="min-h-svh bg-background px-6 py-20 font-mincho text-foreground sm:px-10 sm:py-28">
      <meta name="robots" content="noindex, nofollow" />

      <article className="max-w-lg text-sm-plus font-normal leading-loose">
        <h1 className="font-mincho font-normal">{t.title}</h1>

        <div className="mt-6 space-y-6 text-foreground/70">
          <p>
            <RichText text={t.lede} linkClassName={INK} />
          </p>
          <p>
            <RichText text={t.built} linkClassName={INK} />
          </p>
          <p>
            <RichText text={t.faces} linkClassName={INK} />
          </p>
          <p>{t.close}</p>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-10 text-xs-plus text-foreground/55 transition-colors hover:text-foreground focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          ← {t.back}
        </button>
      </article>
    </div>
  );
}
