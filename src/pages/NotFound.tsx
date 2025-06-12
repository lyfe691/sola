/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 * 
 * This file is part of a proprietary project and is governed by the terms in LICENSE.
 * Unauthorized use, modification, or distribution is prohibited. All rights reserved.
 * For permissions, contact yanis.sebastian.zuercher@gmail.com
 */

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

const TYPING_SPEED = 50;
const RESPONSE_DELAY = 600;
const INITIAL_DELAY = 1500;

const NotFound = () => {
  const location = useLocation();
  const ROOT_PROMPT = "root@~/dev/null$ ";
  const PROMPT = `curl https://sola.ysz.life${location.pathname}`;
  const RESPONSE_LINES = [
    "",
    "HTTP/1.1 404 Not Found",
    "{",
    `  "error": "Resource not found"`,
    "}",
  ];

  const [typedPrompt, setTypedPrompt] = useState("");
  const [typedResponse, setTypedResponse] = useState<string[]>([]);
  const [lineIndex, setLineIndex] = useState(0);
  const [isInitialDelay, setIsInitialDelay] = useState(true);

  useEffect(() => {
    if (isInitialDelay) {
      const initialTimeout = setTimeout(() => {
        setIsInitialDelay(false);
      }, INITIAL_DELAY);
      return () => clearTimeout(initialTimeout);
    }

    if (typedPrompt.length < PROMPT.length) {
      const timeout = setTimeout(() => {
        setTypedPrompt((prev) => prev + PROMPT[prev.length]);
      }, TYPING_SPEED);
      return () => clearTimeout(timeout);
    }

    const responseTimeout = setTimeout(() => {
      typeResponseLine(0);
    }, RESPONSE_DELAY);

    return () => clearTimeout(responseTimeout);
  }, [typedPrompt, isInitialDelay]);

  const typeResponseLine = (index: number) => {
    if (index < RESPONSE_LINES.length) {
      setTimeout(() => {
        setTypedResponse((prev) => [...prev, RESPONSE_LINES[index]]);
        typeResponseLine(index + 1);
      }, 80);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 bg-background text-foreground">
      <Helmet>
        <title>404 • Not Found</title>
      </Helmet>

      <div className="w-full max-w-2xl bg-muted border border-border rounded-xl shadow-2xl overflow-hidden">
        {/* Window bar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/60 backdrop-blur-md">
          <span className="h-3 w-3 rounded-full bg-destructive shadow-sm" />
          <span className="h-3 w-3 rounded-full bg-yellow-400 shadow-sm" />
          <span className="h-3 w-3 rounded-full bg-primary shadow-sm" />
        </div>

        {/* Terminal */}
        <pre className="p-6 font-mono text-sm sm:text-base leading-relaxed whitespace-pre-wrap text-muted-foreground">
          {ROOT_PROMPT}
          {typedPrompt}
          {(isInitialDelay || typedPrompt.length < PROMPT.length) && (
            <span className="inline-block animate-pulse w-2">▮</span>
          )}
          {typedResponse.length > 0 &&
            typedResponse.map((line, idx) => (
              <div key={idx} className="opacity-90">
                {line}
              </div>
            ))}
        </pre>
      </div>

      <Button
        asChild
        variant="outline"
        className="mt-6 text-sm border-border hover:bg-muted/70 transition-colors"
      >
        <a href="/">Return Home</a>
      </Button>
    </div>
  );
};

export default NotFound;
