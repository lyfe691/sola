/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-provider";
import { translations, type Translation } from "@/lib/translations";
import { useLocation } from "react-router-dom";

const TYPING_SPEED = 50;
const RESPONSE_DELAY = 600;
const INITIAL_DELAY = 1500;

const NotFound = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const t = translations[language] as Translation;
  const ROOT_PROMPT = "root@~/dev/null$ ";
  const PROMPT = `curl https://sola.ysz.life${location.pathname}`;
  const RESPONSE_LINES = [
    "",
    "HTTP/1.1 404 Not Found",
    "{",
    `  "error": "Resource not found"`,
    "}",
    "",
    "Type 'help' for available commands.",
  ];

  const [typedPrompt, setTypedPrompt] = useState("");
  const [typedResponse, setTypedResponse] = useState<string[]>([]);
  const [isInitialDelay, setIsInitialDelay] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const [command, setCommand] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (typedResponse.length === RESPONSE_LINES.length) {
      inputRef.current?.focus();
    }
  }, [typedResponse]);

  const typeResponseLine = (index: number) => {
    if (index < RESPONSE_LINES.length) {
      setTimeout(() => {
        setTypedResponse((prev) => [...prev, RESPONSE_LINES[index]]);
        typeResponseLine(index + 1);
      }, 80);
    }
  };

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) {
      setHistory((prev) => [...prev, ROOT_PROMPT]);
      return;
    }

    switch (trimmed.toLowerCase()) {
      case "help":
        setHistory((prev) => [
          ...prev,
          `${ROOT_PROMPT}${trimmed}`,
          "Available commands:",
          "home - return to start",
          "projects - view projects",
          "clear - clear terminal",
          "help - show this message",
        ]);
        break;
      case "home":
        window.location.href = "/";
        break;
      case "projects":
        window.location.href = "/projects";
        break;
      case "clear":
        setHistory([]);
        break;
      default:
        setHistory((prev) => [
          ...prev,
          `${ROOT_PROMPT}${trimmed}`,
          `${trimmed}: command not found`,
        ]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 bg-background text-foreground">
      <Helmet>
        <title>{t.seo.notFound.title}</title>
        <meta name="description" content={t.seo.notFound.description} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="w-full max-w-2xl bg-muted border border-border rounded-xl shadow-2xl overflow-hidden">
        {/* Window bar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/60 backdrop-blur-md">
          <span className="h-3 w-3 rounded-full bg-destructive shadow-sm" />
          <span className="h-3 w-3 rounded-full bg-yellow-400 shadow-sm" />
          <span className="h-3 w-3 rounded-full bg-primary shadow-sm" />
        </div>

        {/* Terminal */}
        <div className="p-6 font-mono text-sm sm:text-base leading-relaxed whitespace-pre-wrap text-muted-foreground">
          <div>
            {ROOT_PROMPT}
            {typedPrompt}
            {(isInitialDelay || typedPrompt.length < PROMPT.length) && (
              <span className="inline-block animate-pulse w-2">▮</span>
            )}
          </div>
          {typedResponse.length > 0 &&
            typedResponse.map((line, idx) => (
              <div key={idx} className="opacity-90">
                {line}
              </div>
            ))}
          {history.map((line, idx) => (
            <div key={`h-${idx}`} className="opacity-90">
              {line}
            </div>
          ))}
          <div className="flex">
            <span>{ROOT_PROMPT}</span>
            <input
              ref={inputRef}
              className="flex-1 bg-transparent outline-none" 
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  executeCommand(command);
                  setCommand("");
                }
              }}
            />
          </div>
        </div>
      </div>

      <Button
        asChild
        variant="outline"
        className="mt-6 text-sm border-border hover:bg-muted/70 transition-colors"
      >
        <a href="/">{t.notFound.backHome}</a>
      </Button>
    </div>
  );
};

export default NotFound;
