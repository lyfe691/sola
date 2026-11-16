/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * A ported Terminal Replay: a scripted terminal session that
 * types its commands, prints their output, runs spinners and progress bars,
 * holds, fades and starts over. The engine (step timing, typing jitter, the
 * frame loop that only runs while the window is on screen, the skip on
 * click) is the source's, number for number.
 *
 * Changed from the source: colours are the site's tokens instead of its own
 * light and dark palettes, so the backdrop probe and the theme, colour, font
 * and radius props are gone; the frame is always the inset one with plain
 * dots; the line's rise and the caret's blink are CSS (index.css, "terminal
 * replay") on the site's curve; the copy button is the site's Button and
 * shows on row hover through CSS, not state; code ligatures stay on; there
 * is no built-in demo script.
 *
 * Added to the source: an output step may `replace` its last line with the
 * next (a status line redrawn in place, which the source's steps could only
 * stand in for with a spinner or a bar the program never printed); `still`
 * shows the whole session without playing, for a window that is one of
 * several and not the one in view; an empty prompt is left out.
 */

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type Ref,
} from "react";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useTranslation } from "@/lib/language-provider";
import {
  transcript,
  type TerminalStep,
  type TerminalTone,
} from "@/config/terminal-sessions";
import { cn } from "@/lib/utils";
import { WINDOW_FRAME, WINDOW_PANEL, WindowDots } from "./window";

export interface TerminalReplayHandle {
  play: () => void;
  pause: () => void;
  restart: () => void;
  skip: () => void;
}

export interface TerminalReplayProps {
  script: TerminalStep[];
  /** Centred in the bar. */
  title?: string;
  /** What a screen reader calls the window; the title, or "Terminal". */
  label?: string;
  prompt?: string;
  directory?: string;
  chrome?: "window" | "minimal" | "none";
  /** px, or any CSS length (a window that scales gives it in its own units) */
  height?: number | string;
  /** Show the whole session and do not play. */
  still?: boolean;
  /** How much of the window must be on screen before it plays, 0 to 1. */
  threshold?: number;
  lineHeight?: number;
  typingSpeed?: number;
  variance?: number;
  lineDelay?: number;
  startDelay?: number;
  hold?: number;
  loop?: boolean;
  autoplay?: boolean;
  cursor?: "block" | "bar" | "underline";
  copyable?: boolean;
  interactive?: boolean;
  onComplete?: () => void;
  className?: string;
  ref?: Ref<TerminalReplayHandle>;
}

type Row =
  | {
      id: number;
      kind: "command";
      text: string;
      typed: number;
      directory: string;
      done: boolean;
    }
  | { id: number; kind: "line"; text: string }
  | {
      id: number;
      kind: "spinner";
      text: string;
      frame: number;
      done: string;
      status: "success" | "warning" | "error";
      finished: boolean;
    }
  | {
      id: number;
      kind: "progress";
      text: string;
      value: number;
      done: string;
      finished: boolean;
    };

interface Engine {
  step: number;
  time: number;
  phase: "start" | "run" | "hold" | "fade" | "done";
  rows: Row[];
  nextId: number;
  delays: number[];
  total: number;
  shown: number;
  curve: number[];
  fade: number;
  notified: boolean;
}

interface View {
  rows: Row[];
  fade: number;
  activeCommand: boolean;
  idle: boolean;
  starting: boolean;
}

const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const BAR = 22;
const COPIED_MS = 1400;

const TONE: Record<TerminalTone, string> = {
  muted: "text-muted-foreground",
  dim: "text-muted-foreground/60",
  accent: "text-primary",
  success: "text-(--diff-add-fg)",
  warning: "text-(--diff-mod-fg)",
  error: "text-(--diff-del-fg)",
  info: "text-(--diff-ren-fg)",
  bold: "font-semibold",
};

const STATUS = {
  success: { mark: "✓", tone: TONE.success },
  warning: { mark: "!", tone: TONE.warning },
  error: { mark: "✕", tone: TONE.error },
} as const;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const finite = (value: number | undefined, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const MARKUP = /\[([a-z]+)\]([\s\S]*?)\[\/\]/g;

const parse = (text: string) => {
  const parts: { text: string; tone?: TerminalTone }[] = [];
  let last = 0;
  for (const match of text.matchAll(MARKUP)) {
    if (match.index > last) parts.push({ text: text.slice(last, match.index) });
    const tone = match[1] as TerminalTone;
    parts.push({ text: match[2], tone: tone in TONE ? tone : undefined });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last) });
  return parts;
};

const subscribeToMotion = (notify: () => void) => {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};

const readMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const fresh = (): Engine => ({
  step: 0,
  time: 0,
  phase: "start",
  rows: [],
  nextId: 1,
  delays: [],
  total: 0,
  shown: 0,
  curve: [],
  fade: 0,
  notified: false,
});

const signature = (row: Row) =>
  row.kind === "line"
    ? row.text
    : row.kind === "command"
      ? row.typed
      : row.kind === "spinner"
        ? row.frame + (row.finished ? 100 : 0)
        : row.kind === "progress"
          ? Math.round(row.value * 100)
          : 0;

function Segments({ text }: { text: string }) {
  return parse(text).map((part, index) => (
    <span key={index} className={part.tone ? TONE[part.tone] : undefined}>
      {part.text}
    </span>
  ));
}

export function TerminalReplay({
  script,
  title,
  label,
  prompt = "❯",
  directory = "~",
  chrome = "window",
  height = 360,
  still = false,
  threshold = 0.15,
  lineHeight = 1.7,
  typingSpeed = 26,
  variance = 0.5,
  lineDelay = 70,
  startDelay = 700,
  hold = 3200,
  loop = true,
  autoplay = true,
  cursor = "block",
  copyable = true,
  interactive = true,
  onComplete,
  className,
  ref,
}: TerminalReplayProps) {
  const t = useTranslation();
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine>(fresh());
  const [view, setView] = useState<View>({
    rows: [],
    fade: 0,
    activeCommand: false,
    idle: true,
    starting: true,
  });
  const [paused, setPaused] = useState<boolean | null>(null);
  const playing = paused === null ? autoplay : !paused;
  const [copied, setCopied] = useState(-1);
  const [scrolled, setScrolled] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeToMotion,
    readMotion,
    () => false,
  );
  const settled = reduced || still;
  const scriptKey = useMemo(() => JSON.stringify(script), [script]);
  const settings = {
    script,
    directory,
    typingSpeed,
    variance,
    lineDelay,
    startDelay,
    hold,
    loop,
    onComplete,
  };
  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  });

  const commit = useCallback(() => {
    const engine = engineRef.current;
    const current = settingsRef.current.script[engine.step];
    setView({
      rows: engine.rows.map((row) => ({ ...row })),
      fade: engine.fade,
      activeCommand: engine.phase === "run" && current?.type === "command",
      idle:
        engine.phase === "start" ||
        engine.phase === "hold" ||
        engine.phase === "done" ||
        (engine.phase === "run" && current?.type === "pause"),
      starting: engine.phase === "start",
    });
  }, []);

  const enter = useCallback((engine: Engine) => {
    const {
      script: steps,
      typingSpeed: speed,
      variance: spread,
      directory: home,
    } = settingsRef.current;
    const step = steps[engine.step];
    engine.time = 0;
    engine.shown = 0;
    if (!step) return;
    if (step.type === "command") {
      const base = 1000 / clamp(finite(speed, 26), 2, 200);
      const jitter = clamp(finite(spread, 0.5), 0, 1);
      const delays: number[] = [];
      let total = 260 + 260 * jitter * Math.random();
      for (const char of step.text) {
        let delay = base * (1 + jitter * 0.7 * (Math.random() * 2 - 1));
        if (char === " ") delay *= 1.6;
        else if (/[./\\:;,@&|=-]/.test(char)) delay *= 1.3;
        if (Math.random() < 0.04 * jitter) delay += base * 4;
        total += delay;
        delays.push(total);
      }
      engine.delays = delays;
      engine.total = total + 380;
      engine.rows.push({
        id: engine.nextId++,
        kind: "command",
        text: step.text,
        typed: 0,
        directory: step.directory ?? home,
        done: false,
      });
    } else if (step.type === "spinner") {
      engine.rows.push({
        id: engine.nextId++,
        kind: "spinner",
        text: step.text,
        frame: 0,
        done: step.done ?? "",
        status: step.status ?? "success",
        finished: false,
      });
    } else if (step.type === "progress") {
      const curve = [0];
      let level = 0;
      for (let i = 1; i < 6; i++) {
        level = Math.min(
          1,
          level + (0.12 + Math.random() * 0.3) * (1 - level) * 1.6,
        );
        curve.push(level);
      }
      curve.push(1);
      engine.curve = curve;
      engine.rows.push({
        id: engine.nextId++,
        kind: "progress",
        text: step.text,
        value: 0,
        done: step.done ?? "",
        finished: false,
      });
    } else if (step.type === "clear") {
      engine.rows = [];
    }
  }, []);

  const run = useCallback(
    (engine: Engine, budget: number, force: boolean): number => {
      const { script: steps, lineDelay: gap } = settingsRef.current;
      const step = steps[engine.step];
      if (!step) return budget;
      engine.time += budget;
      const row = engine.rows[engine.rows.length - 1];
      if (step.type === "command" && row && row.kind === "command") {
        if (force) engine.time = Math.max(engine.time, engine.total);
        let typed = 0;
        while (
          typed < engine.delays.length &&
          engine.delays[typed] <= engine.time
        )
          typed++;
        if (typed !== row.typed) row.typed = typed;
        if (engine.time < engine.total) return -1;
        row.typed = row.text.length;
        row.done = true;
        return force ? 0 : engine.time - engine.total;
      }
      if (step.type === "output") {
        const wait = Math.max(0, finite(step.delay, finite(gap, 70)));
        const due = force
          ? step.lines.length
          : wait <= 0
            ? step.lines.length
            : Math.min(step.lines.length, Math.floor(engine.time / wait) + 1);
        while (engine.shown < due) {
          const line = step.lines[engine.shown];
          const written = engine.rows[engine.rows.length - 1];
          if (step.replace && engine.shown > 0 && written?.kind === "line")
            written.text = line;
          else
            engine.rows.push({ id: engine.nextId++, kind: "line", text: line });
          engine.shown++;
        }
        const end = wait * step.lines.length;
        if (engine.shown < step.lines.length || (!force && engine.time < end))
          return -1;
        return force ? 0 : engine.time - end;
      }
      if (step.type === "spinner" && row && row.kind === "spinner") {
        const duration = Math.max(0, finite(step.duration, 1600));
        row.frame = Math.floor(engine.time / 80) % SPINNER.length;
        if (!force && engine.time < duration) return -1;
        row.finished = true;
        return force ? 0 : engine.time - duration;
      }
      if (step.type === "progress" && row && row.kind === "progress") {
        const duration = Math.max(1, finite(step.duration, 1800));
        const at =
          (force ? 1 : clamp(engine.time / duration, 0, 1)) *
          (engine.curve.length - 1);
        const index = Math.min(engine.curve.length - 2, Math.floor(at));
        const local = at - index;
        const eased = local * local * (3 - 2 * local);
        row.value =
          engine.curve[index] +
          (engine.curve[index + 1] - engine.curve[index]) * eased;
        if (!force && engine.time < duration) return -1;
        row.value = 1;
        row.finished = true;
        return force ? 0 : engine.time - duration;
      }
      if (step.type === "pause") {
        const duration = Math.max(0, finite(step.duration, 1000));
        if (!force && engine.time < duration) return -1;
        return force ? 0 : engine.time - duration;
      }
      return force ? 0 : engine.time;
    },
    [],
  );

  const advance = useCallback(
    (dt: number, force = false) => {
      const engine = engineRef.current;
      const {
        script: steps,
        startDelay: delay,
        hold: rest,
        loop: repeat,
      } = settingsRef.current;
      let budget = dt;
      let guard = 0;
      while (guard++ < 400) {
        if (engine.phase === "done") return;
        if (engine.phase === "start") {
          engine.time += budget;
          const wait = Math.max(0, finite(delay, 700));
          if (!force && engine.time < wait) return;
          budget = force ? 0 : engine.time - wait;
          engine.phase = "run";
          engine.step = 0;
          enter(engine);
          if (force) return;
          continue;
        }
        if (engine.phase === "hold") {
          engine.time += budget;
          if (!force && engine.time < Math.max(0, finite(rest, 3200))) return;
          engine.phase = "fade";
          engine.time = 0;
          budget = 0;
          continue;
        }
        if (engine.phase === "fade") {
          engine.time += budget;
          engine.fade = clamp(engine.time / 420, 0, 1);
          if (engine.fade < 1) return;
          const next = fresh();
          next.nextId = engine.nextId;
          next.time = Math.max(0, finite(delay, 700)) * 0.6;
          Object.assign(engine, next);
          return;
        }
        if (engine.step >= steps.length) {
          if (!engine.notified) {
            engine.notified = true;
            settingsRef.current.onComplete?.();
          }
          engine.phase = repeat ? "hold" : "done";
          engine.time = 0;
          return;
        }
        const left = run(engine, budget, force);
        if (left < 0) return;
        engine.step++;
        enter(engine);
        if (force) return;
        budget = left;
      }
    },
    [enter, run],
  );

  const finish = useCallback(() => {
    const engine = engineRef.current;
    const { script: steps } = settingsRef.current;
    if (engine.phase === "start") {
      engine.phase = "run";
      engine.step = 0;
      enter(engine);
    }
    let guard = 0;
    while (engine.step < steps.length && guard++ < 1000) {
      run(engine, 0, true);
      engine.step++;
      enter(engine);
    }
    engine.phase = "done";
    engine.fade = 0;
  }, [enter, run]);

  useEffect(() => {
    engineRef.current = fresh();
    if (settled) finish();
    commit();
  }, [scriptKey, settled, finish, commit]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || settled || !playing) return;
    let visible = false;
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(64, now - last) : 16;
      last = now;
      const engine = engineRef.current;
      const before = engine.rows.length;
      const snapshot = engine.rows.map(signature);
      const phase = engine.phase;
      const fade = engine.fade;
      advance(dt);
      const changed =
        engine.rows.length !== before ||
        engine.phase !== phase ||
        engine.fade !== fade ||
        engine.rows.some((row, index) => signature(row) !== snapshot[index]);
      if (changed) commit();
      if (visible && !document.hidden && engineRef.current.phase !== "done")
        raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (
        raf ||
        !visible ||
        document.hidden ||
        engineRef.current.phase === "done"
      )
        return;
      last = 0;
      raf = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        if (visible) wake();
      },
      { threshold },
    );
    observer.observe(root);
    document.addEventListener("visibilitychange", wake);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", wake);
      cancelAnimationFrame(raf);
    };
  }, [advance, commit, playing, settled, scriptKey, threshold]);

  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    if (view.rows.length === 0) {
      body.scrollTop = 0;
    } else {
      const target = body.scrollHeight - body.clientHeight;
      if (target > 1 && Math.abs(body.scrollTop - target) > 1) {
        body.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" });
      }
    }
    const next =
      view.rows.length > 0 && body.scrollHeight - body.clientHeight > 1;
    if (next !== scrolled) setScrolled(next);
  }, [view, reduced, scrolled]);

  const restart = useCallback(() => {
    engineRef.current = fresh();
    if (settled) finish();
    setPaused(false);
    commit();
  }, [commit, finish, settled]);

  const skip = useCallback(() => {
    const engine = engineRef.current;
    if (
      engine.phase === "done" ||
      engine.phase === "hold" ||
      engine.phase === "fade"
    ) {
      restart();
      return;
    }
    advance(0, true);
    commit();
  }, [advance, commit, restart]);

  useImperativeHandle(
    ref,
    () => ({
      play: () => setPaused(false),
      pause: () => setPaused(true),
      restart,
      skip,
    }),
    [restart, skip],
  );

  useEffect(() => {
    if (copied < 0) return;
    const timer = setTimeout(() => setCopied(-1), COPIED_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async (event: ReactMouseEvent, row: Row) => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(row.text);
      setCopied(row.id);
    } catch {
      toast.add({ type: "error", title: t.common.copyFailed });
    }
  };

  const onKeyDown = (event: ReactKeyboardEvent) => {
    if (!interactive || event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      skip();
    }
  };

  const { rows, activeCommand, idle } = view;
  const leading = clamp(finite(lineHeight, 1.7), 1.1, 2.4);

  const promptParts = (home: string) => (
    <>
      {home ? <span className={TONE.muted}>{home} </span> : null}
      {prompt ? (
        <>
          <span className="font-semibold text-primary">{prompt}</span>{" "}
        </>
      ) : null}
    </>
  );

  const caret = <span className="terminal-caret" data-cursor={cursor} />;

  const renderRow = (row: Row, index: number) => {
    const last = index === rows.length - 1;
    if (row.kind === "command") {
      const showCopy = copyable && row.done;
      return (
        <div
          key={row.id}
          className={cn("group/row relative", showCopy && "pr-8.5")}
        >
          {promptParts(row.directory)}
          <span>{row.text.slice(0, row.typed)}</span>
          {last && activeCommand && !row.done ? caret : null}
          {showCopy ? (
            <span
              className={cn(
                "terminal-copy absolute -right-1.5 transition-opacity duration-150 group-hover/row:opacity-100 focus-within:opacity-100 pointer-coarse:opacity-100",
                copied === row.id ? "opacity-100" : "opacity-0",
              )}
            >
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label={
                  copied === row.id ? t.common.copied : t.common.copyCode
                }
                onClick={(event) => copy(event, row)}
              >
                {copied === row.id ? <CheckIcon /> : <CopyIcon />}
              </Button>
            </span>
          ) : null}
        </div>
      );
    }
    if (row.kind === "line") {
      return (
        <div key={row.id} className="terminal-rise">
          {row.text ? <Segments text={row.text} /> : " "}
        </div>
      );
    }
    if (row.kind === "spinner") {
      const status = STATUS[row.status];
      return (
        <div key={row.id} className="terminal-rise">
          {row.finished ? (
            <>
              <span className={cn("font-semibold", status.tone)}>
                {status.mark}
              </span>{" "}
              <Segments text={row.done || row.text} />
            </>
          ) : (
            <>
              <span className="text-primary">{SPINNER[row.frame]}</span>{" "}
              <Segments text={row.text} />
              <span className={TONE.dim}>…</span>
            </>
          )}
        </div>
      );
    }
    const filled = Math.round(row.value * BAR);
    return (
      <div key={row.id} className="terminal-rise">
        {row.finished && row.done ? (
          <>
            <span className={cn("font-semibold", TONE.success)}>✓</span>{" "}
            <Segments text={row.done} />
          </>
        ) : (
          <>
            <Segments text={row.text} />{" "}
            <span className="text-primary">{"━".repeat(filled)}</span>
            <span className="text-muted-foreground/30">
              {"━".repeat(BAR - filled)}
            </span>{" "}
            <span className={TONE.muted}>
              {String(Math.round(row.value * 100)).padStart(3, " ")}%
            </span>
          </>
        )}
      </div>
    );
  };

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label={label || title || t.common.a11y.terminal}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? skip : undefined}
      onKeyDown={onKeyDown}
      className={cn(
        WINDOW_FRAME,
        "terminal-replay h-(--terminal-h) font-mono leading-(--terminal-lh) outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring/50",
        interactive && "cursor-pointer",
        className,
      )}
      style={
        {
          "--terminal-h": typeof height === "number" ? `${height}px` : height,
          "--terminal-lh": leading,
          "--terminal-fade": 1 - view.fade,
        } as CSSProperties
      }
    >
      <span className="sr-only whitespace-pre">
        {transcript({ script, prompt, directory })}
      </span>
      {chrome !== "none" ? (
        <div
          aria-hidden="true"
          className="relative flex h-9.5 flex-none items-center px-3.25"
        >
          {chrome === "window" ? <WindowDots /> : null}
          {title ? (
            <span className="pointer-events-none absolute inset-x-17.5 truncate text-center font-sans text-xs leading-normal font-medium text-muted-foreground">
              {title}
            </span>
          ) : null}
        </div>
      ) : null}
      <div
        className={cn(
          WINDOW_PANEL,
          "flex min-h-0 flex-1 flex-col",
          chrome === "none" && "mt-1",
        )}
      >
        <div
          ref={bodyRef}
          aria-hidden="true"
          data-scrolled={scrolled || undefined}
          className="terminal-body relative min-h-0 flex-1 overflow-hidden px-4.5 pt-4 pb-4.5"
        >
          <div className="wrap-anywhere whitespace-pre-wrap opacity-(--terminal-fade)">
            {rows.map(renderRow)}
            {idle && !(view.starting && rows.length > 0) ? (
              <div>
                {promptParts(directory)}
                <span
                  className="terminal-caret"
                  data-cursor={cursor}
                  data-blink=""
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
