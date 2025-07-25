/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

/* 這個網站是怎麼造出來的 */

import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom"
import { IconButton } from "@/components/ui/custom/IconButton";
import { ArrowLeft } from "lucide-react";

export default function AboutThisWebsite() {

  const n = useNavigate(); 

  // o-O
  const h = () => {
    n(-1);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-background text-foreground">
      <Helmet>
        <title>這個網站是怎麼造出來的</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="max-w-2xl w-full text-sm leading-relaxed space-y-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          這個網站是怎麼造出來的
        </h1>

        <p>
          This website was handcrafted by me.
          Built using <strong>React</strong>, <strong>Vite</strong>, <strong>TypeScript</strong>, and <strong>Tailwind&nbsp;CSS</strong>.
        </p>

        <p>
          It uses <strong>shadcn/ui</strong> components (and some extensions), <strong>Framer Motion</strong> for transitions, and a custom minimal design system.
        </p>

        <p>
          Hosted on <strong>Vercel</strong>. Fonts: <strong>Geist</strong> and <strong>Geist Mono</strong>.
        </p>

        <p>
          Everything you see here was carefully engineered for speed, simplicity, and a personal touch.
        </p>

        <p>
          Thank you for taking a deeper look.
        </p>
        
        <IconButton variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} iconPosition='left' onClick={h}>go back?</IconButton>

        <p className="text-xs text-center text-foreground/50 pt-8">
          © {new Date().getFullYear()} Yanis Sebastian Zürcher
        </p>
      </div>
    </div>
  );
};
