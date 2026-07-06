/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The 404 is a shell session in the site's repo: someone tries to check out
 * a path that doesn't exist, git answers with the pathspec error, and the
 * next prompt's arrow turns red — zsh encoding the failed exit status. The
 * output is tool speech, not copy (English in every locale, like `git
 * diff`); the localized way home is the button below the window.
 */

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { Caret } from "@/components/deploy-diff/caret";
import { DIFF_TOKENS } from "@/components/deploy-diff/diff-tokens";
import { useIsDarkScheme } from "@/components/deploy-diff/use-scheme";
import { useLanguage } from "@/lib/language-provider";
import { translations, type Translation } from "@/lib/translations";

const TYPING_SPEED = 50;
const RESPONSE_DELAY = 600;
const INITIAL_DELAY = 1500;
const RESPONSE_LINE_DELAY = 80;

/** the zsh-style prompt; the arrow carries the previous exit status */
function Prompt({ failed = false }: { failed?: boolean }) {
  return (
    <>
      <span
        className={failed ? "text-(--diff-del-fg)" : "text-(--diff-add-fg)"}
      >
        ➜
      </span>
      {" sola "}
      <span className="opacity-70">git:(main) </span>
    </>
  );
}

/** git's stderr grammar: `error:` in red, `hint:` in amber, rest plain */
function ResponseLine({ line }: { line: string }) {
  const prefix = ["error:", "hint:"].find((p) => line.startsWith(p));
  if (!prefix) return <div className="opacity-90">{line}</div>;
  return (
    <div className="opacity-90">
      <span
        className={
          prefix === "error:"
            ? "text-(--diff-del-fg)"
            : "text-(--diff-mod-fg)"
        }
      >
        {prefix}
      </span>
      {line.slice(prefix.length)}
    </div>
  );
}

const NotFound = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const t = translations[language] as Translation;
  const isDark = useIsDarkScheme();

  const PROMPT = `git checkout ${location.pathname}`;
  const responseLines = [
    "",
    `error: pathspec '${location.pathname}' did not match any file(s) known to sola`,
    "hint: try 'git checkout main' to get back home",
  ];

  const [typedPrompt, setTypedPrompt] = useState("");
  const [typedResponse, setTypedResponse] = useState<string[]>([]);
  const [isInitialDelay, setIsInitialDelay] = useState(true);

  const isTyping = typedPrompt.length < PROMPT.length;
  const isDone = typedResponse.length === responseLines.length;

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

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const typeResponseLine = (index: number) => {
      if (index < responseLines.length) {
        timeouts.push(
          setTimeout(() => {
            setTypedResponse((prev) => [...prev, responseLines[index]]);
            typeResponseLine(index + 1);
          }, RESPONSE_LINE_DELAY),
        );
      }
    };

    timeouts.push(setTimeout(() => typeResponseLine(0), RESPONSE_DELAY));

    return () => timeouts.forEach(clearTimeout);
    // responseLines is rebuilt each render from the (stable) pathname —
    // keying the effect on it would re-run the cascade every keystroke
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typedPrompt, isInitialDelay, PROMPT]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 bg-background text-foreground">
      <meta name="description" content={t.seo.notFound.description} />
      <meta name="robots" content="noindex, nofollow" />

      <div className="w-full max-w-2xl bg-muted border border-border rounded-xl shadow-2xl overflow-hidden">
        {/* Window bar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/60 backdrop-blur-md">
          <span className="h-3 w-3 rounded-full bg-destructive shadow-xs" />
          <span className="h-3 w-3 rounded-full bg-muted-foreground shadow-xs" />
          <span className="h-3 w-3 rounded-full bg-primary shadow-xs" />
        </div>

        {/* Terminal */}
        <pre
          style={DIFF_TOKENS[isDark ? "dark" : "light"]}
          className="p-6 font-mono text-sm sm:text-base leading-relaxed whitespace-pre-wrap text-muted-foreground"
        >
          <Prompt />
          {typedPrompt}
          {(isInitialDelay || isTyping) && (
            <Caret blinking={isInitialDelay} />
          )}
          {typedResponse.map((line, idx) => (
            <ResponseLine key={idx} line={line} />
          ))}
          {isDone && (
            <div>
              <Prompt failed />
              <Caret blinking />
            </div>
          )}
        </pre>
      </div>

      <Button variant="link" className="mt-6">
        <Link to="/">{t.notFound.backHome}</Link>
      </Button>
    </div>
  );
};

export default NotFound;
