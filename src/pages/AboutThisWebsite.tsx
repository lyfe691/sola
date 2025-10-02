/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

/* 這個網站是怎麼造出來的 */

import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@/components/ui/custom/icon-button";
import { ChevronLeft } from "lucide-react";
import { LinkPreview } from "@/components/ui/custom/link-preview";

export default function AboutThisWebsite() {
  const n = useNavigate();

  // o-O
  const h = () => {
    n(-1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-background text-foreground relative">
      <Helmet>
        <title>這個網站是怎麼造出來的</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="max-w-2xl w-full text-sm leading-relaxed space-y-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          這個網站是怎麼造出來的
        </h1>

        <p>
          Handcrafted with{" "}
          <strong>
            <LinkPreview href="https://react.dev" className="link" compact>
              React
            </LinkPreview>
          </strong>
          ,{" "}
          <strong>
            <LinkPreview href="https://vite.dev" className="link" compact>
              Vite
            </LinkPreview>
          </strong>
          ,{" "}
          <strong>
            <LinkPreview
              href="https://www.typescriptlang.org"
              className="link"
              compact
            >
              TypeScript
            </LinkPreview>
          </strong>
          , and{" "}
          <strong>
            <LinkPreview
              href="https://tailwindcss.com"
              className="link"
              compact
            >
              Tailwind&nbsp;CSS
            </LinkPreview>
          </strong>
          .
        </p>
        <p>
          Built with{" "}
          <strong>
            <LinkPreview href="https://ui.shadcn.com" className="link" compact>
              shadcn/ui
            </LinkPreview>
          </strong>{" "}
          (plus custom additions),{" "}
          <strong>
            <LinkPreview href="https://motion.dev" className="link" compact>
              Framer Motion
            </LinkPreview>
          </strong>{" "}
          for transitions, and a minimal design system.
        </p>
        <p>
          Deployed on{" "}
          <strong>
            <LinkPreview href="https://vercel.com" className="link" compact>
              Vercel
            </LinkPreview>
          </strong>
          . Typography:{" "}
          <strong>
            <LinkPreview
              href="https://fonts.google.com/specimen/Geist"
              className="link"
              compact
            >
              Geist
            </LinkPreview>
          </strong>{" "}
          &{" "}
          <strong>
            <LinkPreview
              href="https://fonts.google.com/specimen/Geist+Mono"
              className="link"
              compact
            >
              Geist Mono
            </LinkPreview>
          </strong>
          .
        </p>
        <p>Designed for speed, clarity, and a personal touch.</p>
        <p>Thanks for stopping by.</p>

        <IconButton
          variant="ghost"
          size="sm"
          iconPosition="left"
          icon={<ChevronLeft className="w-4 h-4" />}
          onClick={h}
        >
          Go back
        </IconButton>
        <footer className="absolute inset-x-0 bottom-4">
          <p className="text-xs text-center text-foreground/50">
            © {new Date().getFullYear()} Yanis Sebastian Zürcher
          </p>
        </footer>
      </div>
    </div>
  );
}
