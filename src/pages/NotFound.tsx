/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The 404 is a shell session in the site's repo: someone tries to check out
 * a path that doesn't exist, git answers with the pathspec error, and the
 * next prompt's arrow turns red — zsh encoding the failed exit status. Then
 * the prompt is real: a hidden input catches keystrokes, so the hint's
 * `git checkout main` can actually be typed and run (checkout navigates,
 * `ls` lists the site's routes off the manifest, `clear` clears, anything
 * else gets zsh's command-not-found). An invisible copy of the scripted
 * session sizes the window up front; interactive overflow scrolls inside
 * it like a real terminal. Output is tool speech, not copy (English in
 * every locale, like `git diff`); the localized way home is the button.
 */

import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Caret } from "@/components/deploy-diff/caret";
import { DIFF_TOKENS } from "@/components/deploy-diff/diff-tokens";
import { useIsDarkScheme } from "@/components/deploy-diff/use-scheme";
import { useLanguage } from "@/lib/language-provider";
import { translations, type Translation } from "@/lib/translations";
import { APP_ROUTES } from "@/config/routes";
import { REVEAL } from "@/utils/transitions";

const TYPING_SPEED = 50;
const RESPONSE_DELAY = 450;
// the window settles (~700ms) before the shell starts typing
const INITIAL_DELAY = 900;
const RESPONSE_LINE_DELAY = 80;

// what `ls` prints: the real routes, straight off the manifest
const LS_OUTPUT = APP_ROUTES.map((r) => r.path)
  .filter((p) => /^\/[\w-]+$/.test(p))
  .map((p) => p.slice(1))
  .sort()
  .join("  ");

type HistoryEntry =
  | { kind: "cmd"; text: string; arrowFailed: boolean }
  | { kind: "out"; text: string };

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

/** the advice line; its quoted command is a real link, like a cmd-click */
function HintLine() {
  return (
    <div className="opacity-90">
      <span className="text-(--diff-mod-fg)">hint:</span>
      {" try "}
      <Link
        to="/"
        className="text-foreground/80 underline decoration-foreground/30 decoration-dotted underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
      >
        'git checkout main'
      </Link>
      {" to get back home"}
    </div>
  );
}

/** one response line in git's stderr grammar: `error:` red, `hint:` amber */
function TranscriptLine({ line }: { line: string }) {
  if (line.startsWith("error:")) {
    return (
      <div className="opacity-90">
        <span className="text-(--diff-del-fg)">error:</span>
        {line.slice("error:".length)}
      </div>
    );
  }
  if (line.startsWith("hint:")) return <HintLine />;
  return <div>{line}</div>;
}

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language] as Translation;
  const isDark = useIsDarkScheme();
  const reducedMotion = useReducedMotion() ?? false;

  // display form of the attempted path: human-readable, never unbounded
  let path = location.pathname;
  try {
    path = decodeURIComponent(path);
  } catch {
    // malformed escapes — show the raw path
  }
  if (path.length > 64) path = `${path.slice(0, 64)}…`;

  const PROMPT = `git checkout ${path}`;
  const responseLines = [
    "",
    `error: pathspec '${path}' did not match any file(s) known to sola`,
    "hint: try 'git checkout main' to get back home",
  ];

  // reduced motion skips the theater: the transcript arrives finished
  const [typedPrompt, setTypedPrompt] = useState(reducedMotion ? PROMPT : "");
  const [typedResponse, setTypedResponse] = useState<string[]>(
    reducedMotion ? responseLines : [],
  );
  const [isInitialDelay, setIsInitialDelay] = useState(!reducedMotion);

  const isTyping = typedPrompt.length < PROMPT.length;
  const isDone = typedResponse.length === responseLines.length;

  // ——— the live shell: prompt input, history, exit status ———
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [buffer, setBuffer] = useState("");
  // the scripted checkout just failed, so the first live arrow is red
  const [lastFailed, setLastFailed] = useState(true);
  const [cleared, setCleared] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  const run = (raw: string) => {
    const echo: HistoryEntry = {
      kind: "cmd",
      text: raw,
      arrowFailed: lastFailed,
    };
    const cmd = raw.trim();
    setBuffer("");

    if (!cmd) {
      setHistory((h) => [...h, echo]);
      return;
    }

    const out = (text: string): HistoryEntry => ({ kind: "out", text });
    const respond = (failed: boolean, ...lines: HistoryEntry[]) => {
      setHistory((h) => [...h, echo, ...lines]);
      setLastFailed(failed);
    };

    const checkout = cmd.match(/^git\s+checkout\s+(.+)$/);
    if (checkout) {
      const arg = checkout[1].trim().replace(/^['"]|['"]$/g, "");
      if (arg === "main" || arg === "-") {
        navigate("/");
        return;
      }
      // other targets re-enter this page with the new path — the shell
      // honestly runs the command and gets its next error
      navigate(arg.startsWith("/") ? arg : `/${arg}`);
      return;
    }
    if (cmd === "exit") {
      navigate("/");
      return;
    }
    if (cmd === "clear") {
      setCleared(true);
      setHistory([]);
      setLastFailed(false);
      return;
    }
    if (cmd === "ls") {
      respond(false, out(LS_OUTPUT));
      return;
    }
    // the git people will actually poke at answers honestly — nothing the
    // shell says may contradict itself (`status` IS a git command, and the
    // --help it points to has to exist)
    if (cmd === "git status") {
      respond(
        false,
        out("On branch main"),
        out("Your branch is up to date with 'origin/main'."),
        out(" "),
        out("nothing to commit, working tree clean"),
      );
      return;
    }
    if (cmd === "git branch") {
      respond(false, out("* main"));
      return;
    }
    if (
      cmd === "git" ||
      cmd === "git --help" ||
      cmd === "git help" ||
      cmd === "git checkout"
    ) {
      respond(cmd === "git", out("usage: git checkout <path>"));
      return;
    }
    respond(
      true,
      out(
        cmd.startsWith("git ")
          ? `git: '${cmd.slice(4).trim().split(/\s+/)[0]}' is not a git command. See 'git --help'.`
          : `zsh: command not found: ${cmd.split(/\s+/)[0]}`,
      ),
    );
  };

  // hand the prompt the keyboard once the theater ends — but never pop a
  // touch keyboard uninvited; there, tapping the window focuses it
  useEffect(() => {
    if (!isDone) return;
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [isDone]);

  // a terminal keeps its latest line in view
  useEffect(() => {
    const el = screenRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [typedResponse, history, buffer]);

  useEffect(() => {
    if (reducedMotion) return;

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
  }, [typedPrompt, isInitialDelay, PROMPT, reducedMotion]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 bg-background text-foreground">
      <meta name="description" content={t.seo.notFound.description} />
      <meta name="robots" content="noindex, nofollow" />

      {/* the terminal window — rises and settles, then the shell speaks */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: REVEAL }}
        style={DIFF_TOKENS[isDark ? "dark" : "light"]}
        className="w-full max-w-2xl overflow-hidden rounded-xl bg-popover shadow-2xl ring-1 ring-foreground/5 dark:ring-foreground/10"
      >
        {/* window bar: traffic lights in the diff palette, macOS title */}
        <div className="relative flex h-10 items-center gap-2 border-b border-border/60 bg-muted/50 px-4">
          <span className="size-3 rounded-full bg-(--diff-del-fg)/90" />
          <span className="size-3 rounded-full bg-(--diff-mod-fg)/90" />
          <span className="size-3 rounded-full bg-(--diff-add-fg)/90" />
          <span className="pointer-events-none absolute inset-x-0 text-center text-[11px] font-medium text-muted-foreground/70">
            sola — zsh
          </span>
        </div>

        <pre
          onClick={() => {
            if (isDone) inputRef.current?.focus({ preventScroll: true });
          }}
          className={`relative whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-muted-foreground sm:text-sm ${isDone ? "cursor-text" : ""}`}
        >
          {/* the scripted session, invisible — reserves the window's final
              size so the live transcript never grows the frame */}
          <div className="invisible px-5 py-4" aria-hidden="true">
            <Prompt />
            {PROMPT}
            {responseLines.map((line, idx) => (
              <TranscriptLine key={idx} line={line} />
            ))}
            <div>
              <Prompt failed />
            </div>
          </div>

          {/* the live screen, over the reserved frame; overflow scrolls */}
          <div
            ref={screenRef}
            className="absolute inset-0 overflow-y-auto overscroll-contain px-5 py-4"
          >
            {!cleared && (
              <>
                <Prompt />
                {typedPrompt}
                {(isInitialDelay || isTyping) && (
                  <Caret blinking={isInitialDelay} />
                )}
                {typedResponse.map((line, idx) => (
                  <TranscriptLine key={idx} line={line} />
                ))}
              </>
            )}
            {isDone && (
              <>
                {history.map((entry, idx) =>
                  entry.kind === "cmd" ? (
                    <div key={idx}>
                      <Prompt failed={entry.arrowFailed} />
                      {entry.text}
                    </div>
                  ) : (
                    <div key={idx} className="opacity-90">
                      {entry.text}
                    </div>
                  ),
                )}
                <div>
                  <Prompt failed={lastFailed} />
                  {buffer}
                  {/* dim caret = the shell isn't holding the keyboard */}
                  <span className={focused ? undefined : "opacity-40"}>
                    <Caret blinking />
                  </span>
                </div>
              </>
            )}
          </div>

          {/* the prompt's keyboard: an invisible input, so typing works on
              every device and the global `d` shortcut ignores it */}
          <input
            ref={inputRef}
            value={buffer}
            onChange={(e) => setBuffer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") run(buffer);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="absolute h-px w-px opacity-0"
            maxLength={128}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            aria-label="Terminal"
            tabIndex={isDone ? 0 : -1}
          />
        </pre>
      </motion.div>

      {/* the localized way home — available early, never gated on typing */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35, ease: REVEAL }}
      >
        <Button variant="default" className="mt-6">
          <Link to="/">{t.notFound.backHome}</Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
