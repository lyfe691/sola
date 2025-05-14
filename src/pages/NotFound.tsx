/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 * 
 * This file is part of the project and is subject to the terms of the project's LICENSE (GNU GPL v3).
 * Please refer to the LICENSE file in the project root for full licensing details.
 * 
 * All rights reserved.
 */

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

// typing speed in milliseconds per character
const TYPING_SPEED = 50;

const NotFound = () => {
  const location = useLocation();

  // only the prompt gets typed out; the response appears instantly once typing finishes
  const PROMPT = `visitor@site:~$ curl https://sola.ysz.life${location.pathname}`;
  const RESPONSE_LINES = [
    "", // press enter, add new line (simulated)
    "HTTP/1.1 404 Not Found",
    "{",
    "  \"error\": \"Resource not found\"",
    "}",
  ];

  const [typedPrompt, setTypedPrompt] = useState("");
  const [showResponse, setShowResponse] = useState(false);

  // type out character by character
  useEffect(() => {
    // If typing isn't done yet, keep adding characters
    if (typedPrompt.length < PROMPT.length) {
      const timeout = setTimeout(() => {
        setTypedPrompt((prev) => prev + PROMPT[prev.length]);
      }, TYPING_SPEED);

      return () => clearTimeout(timeout);
    }

    // Once typing is done, reveal the response after a brief delay (simulate Enter)
    const reveal = setTimeout(() => setShowResponse(true), 600);
    return () => clearTimeout(reveal);
  }, [typedPrompt, PROMPT]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-background text-foreground">
      <Helmet>
        <title>404 • Not Found</title>
      </Helmet>

      {/* Faux‑terminal window */}
      <div className="w-full max-w-2xl rounded-2xl bg-muted border border-border shadow-xl overflow-hidden">
        {/* Window controls bar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/70 backdrop-blur">
          <span className="h-3 w-3 rounded-full bg-destructive" />
          <span className="h-3 w-3 rounded-full bg-yellow-500 dark:bg-yellow-400" />
          <span className="h-3 w-3 rounded-full bg-primary" />
        </div>

        {/* Terminal body */}
        <pre className="p-6 text-sm sm:text-base leading-relaxed font-mono whitespace-pre-wrap">
          {typedPrompt}
          {/* Blinking caret while typing */}
          {!showResponse && <span className="inline-block w-2 animate-pulse">▮</span>}
          {/* Response appears instantly once typing finishes */}
          {showResponse && RESPONSE_LINES.join("\n")}
        </pre>
      </div>

      <Button asChild variant="outline" className="mt-6 border-border/50">
        <a href="/">Return Home</a>
      </Button>
    </div>
  );
};

export default NotFound;
