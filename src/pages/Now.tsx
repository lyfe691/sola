/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of the project and is subject to the terms of the project's LICENSE (GNU GPL v3).
 * Please refer to the LICENSE file in the project root for full licensing details.
 *
 * All rights reserved.
 */

import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Now() {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-background text-foreground">
      <Helmet>
        <title>Now</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="max-w-2xl w-full text-sm leading-relaxed space-y-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Now</h1>

        <p>
          Here's what I'm focused on at the moment. This page is inspired by the <a href="https://nownownow.com/about" className="underline" target="_blank" rel="noopener noreferrer">nownownow</a> movement.
        </p>
        <p>
          I'm continuing my studies in computer science while building side projects and sharpening my skills.
        </p>
        <p>
          Check back occasionally to see what I'm up to!
        </p>

        <Button variant="link" effect="underline" onClick={goBack}>go back?</Button>

        <p className="text-xs text-center text-foreground/50 pt-8">
          © {new Date().getFullYear()} Yanis Sebastian Zürcher
        </p>
      </div>
    </div>
  );
}
