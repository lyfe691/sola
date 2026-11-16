/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * A ported Code Morph: one piece of code in several states.
 * Going from one to the next, every token the two share glides to its new
 * place, the ones that are gone blur out, and the new ones blur in once the
 * rest has moved. The matching (longest common subsequence, then the nearest
 * unclaimed twin), the measuring layer the positions come from, the timings
 * and the autoplay clock that only runs on screen are the source's, number
 * for number.
 *
 * Changed from the source: tokens and their colours come from the site's
 * shiki highlighter instead of the source's own five-language tokenizer, so
 * it reads any language the code blocks do and matches them; until shiki
 * has loaded the code stands plain. Colours are the site's tokens, so the
 * backdrop probe and the theme, colour, font, size and radius props are
 * gone, and the frame is always the inset one with plain dots. The motion is
 * CSS (index.css, "code morph") on the site's curves; the copy button is the
 * site's Button; code ligatures stay on. The width it fits to is read before
 * the first paint, not after. Under reduced motion nothing plays: with tabs
 * the reader steps through at once, without them it stands on the last step.
 *
 * Added to the source: with tabs, a file name every step shares is shown
 * beside them (the tabs name the steps, so nothing else would name the file).
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
  type Ref,
} from "react";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { loadHighlighter } from "@/lib/highlighter";
import { useTranslation } from "@/lib/language-provider";
import { cn } from "@/lib/utils";
import { WINDOW_FRAME, WINDOW_PANEL, WindowDots } from "./window";

export interface CodeMorphStep {
  code: string;
  label?: string;
  file?: string;
  /** the lines to keep lit while the rest dims: "3-5", [3, 4, 5] */
  highlight?: number[] | string;
}

export interface CodeMorphHandle {
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  play: () => void;
  pause: () => void;
}

export interface CodeMorphProps {
  steps: CodeMorphStep[];
  lang?: string;
  chrome?: "tabs" | "window" | "none";
  lineHeight?: number;
  /** px */
  height?: number | "auto";
  lineNumbers?: boolean;
  focus?: boolean;
  fit?: boolean;
  duration?: number;
  interval?: number;
  autoplay?: boolean;
  loop?: boolean;
  pauseOnHover?: boolean;
  copyable?: boolean;
  defaultStep?: number;
  onStepChange?: (index: number) => void;
  className?: string;
  ref?: Ref<CodeMorphHandle>;
}

interface Token {
  text: string;
  space: boolean;
  light?: string;
  dark?: string;
}

interface Piece extends Token {
  line: number;
}

interface Parsed {
  code: string;
  lines: Token[][];
  flat: Piece[];
  focus: Set<number> | null;
  label: string;
  file: string;
}

interface Layout {
  xs: number[];
  width: number;
}

interface Glyph {
  id: number;
  index: number;
  piece: Piece;
  x: number;
  state: "in" | "enter" | "exit";
  delay: number;
}

interface Frame {
  step: number;
  glyphs: Glyph[];
  instant: boolean;
}

/** px: the positions are measured and written in pixels. */
const FONT_SIZE = 13;
const COPIED_MS = 1400;
const PAD_TOP = { bare: 18, barred: 14 } as const;
const WORD = /[\p{L}\p{N}_]/u;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const finite = (value: number | undefined, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const dedent = (source: string) => {
  const lines = source.replace(/\r\n?/g, "\n").replace(/\t/g, "  ").split("\n");
  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  const indents = lines
    .filter((line) => line.trim())
    .map((line) => (line.match(/^ */) ?? [""])[0].length);
  const indent = indents.length ? Math.min(...indents) : 0;
  return lines.map((line) => line.slice(indent).replace(/\s+$/, "")).join("\n");
};

/** A run of text as the pieces that move on their own, and the gaps. */
const pieces = (text: string, light?: string, dark?: string): Token[] =>
  text
    .split(/( +)/)
    .filter(Boolean)
    .map((part) => ({ text: part, space: !part.trim(), light, dark }));

const parseFocus = (value: CodeMorphStep["highlight"], count: number) => {
  if (!value) return null;
  const lines = new Set<number>();
  const add = (line: number) => {
    if (Number.isInteger(line) && line >= 1 && line <= count)
      lines.add(line - 1);
  };
  if (Array.isArray(value)) value.forEach(add);
  else
    value.split(",").forEach((part) => {
      const [from, to] = part
        .split("-")
        .map((item) => parseInt(item.trim(), 10));
      if (!Number.isFinite(from)) return;
      const end = Number.isFinite(to) ? to : from;
      for (let line = from; line <= end; line++) add(line);
    });
  return lines.size ? lines : null;
};

const parseStep = (
  step: CodeMorphStep,
  code: string,
  lines: Token[][],
  index: number,
): Parsed => ({
  code,
  lines,
  flat: lines.flatMap((line, row) =>
    line
      .filter((token) => !token.space)
      .map((token) => ({ ...token, line: row })),
  ),
  focus: parseFocus(step.highlight, lines.length),
  label: step.label || step.file || String(index + 1),
  file: step.file || step.label || "",
});

const align = (a: string[], b: string[]) => {
  const n = a.length;
  const m = b.length;
  const result = new Int32Array(m).fill(-1);
  if (!n || !m || n * m > 2_000_000) return result;
  const width = m + 1;
  const table = new Uint16Array((n + 1) * width);
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      table[i * width + j] =
        a[i] === b[j]
          ? table[(i + 1) * width + j + 1] + 1
          : Math.max(table[(i + 1) * width + j], table[i * width + j + 1]);
    }
  }
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      result[j] = i;
      i++;
      j++;
    } else if (table[(i + 1) * width + j] >= table[i * width + j + 1]) i++;
    else j++;
  }
  return result;
};

const ranges = (focus: Set<number> | null) => {
  if (!focus) return [];
  const sorted = [...focus].sort((a, b) => a - b);
  const out: [number, number][] = [];
  for (const line of sorted) {
    const last = out[out.length - 1];
    if (last && line === last[1] + 1) last[1] = line;
    else out.push([line, line]);
  }
  return out;
};

const subscribeToMotion = (notify: () => void) => {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};

const readMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Each step's lines in shiki's colours once it has loaded; null until then. */
function useHighlightedSteps(codes: string[], lang: string) {
  const key = JSON.stringify([codes, lang]);
  const [done, setDone] = useState<{ key: string; lines: Token[][][] } | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;
    const [list, language] = JSON.parse(key) as [string[], string];
    loadHighlighter(language)
      .then((highlighter) => {
        if (cancelled || !highlighter) return;
        setDone({
          key,
          lines: list.map((code) =>
            highlighter
              .tokens(code)
              .map((line) =>
                line.flatMap((token) =>
                  pieces(token.text, token.light, token.dark),
                ),
              ),
          ),
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [key]);

  return done?.key === key ? done.lines : null;
}

const tokenStyle = (token: Token) =>
  ({
    "--shiki-light": token.light,
    "--shiki-dark": token.dark,
  }) as CSSProperties;

const TOKEN_COLOR = "text-(--shiki-light) dark:text-(--shiki-dark)";

export function CodeMorph({
  steps,
  lang = "typescript",
  chrome = "tabs",
  lineHeight = 1.7,
  height = "auto",
  lineNumbers = true,
  focus = true,
  fit = true,
  duration = 800,
  interval = 4200,
  autoplay = true,
  loop = true,
  pauseOnHover = true,
  copyable = true,
  defaultStep = 0,
  onStepChange,
  className,
  ref,
}: CodeMorphProps) {
  const t = useTranslation();
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const tablistRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const frameRef = useRef<Frame | null>(null);
  const idRef = useRef(1);
  const elapsedRef = useRef(0);
  const hoverRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const changeRef = useRef(onStepChange);
  const reduced = useSyncExternalStore(
    subscribeToMotion,
    readMotion,
    () => false,
  );
  const [scene, setScene] = useState<Frame | null>(null);
  const [layouts, setLayouts] = useState<{
    items: Layout[];
    char: number;
  } | null>(null);
  const [avail, setAvail] = useState(0);
  const [paused, setPaused] = useState<boolean | null>(null);
  const playing = paused === null ? autoplay : !paused;
  const [copied, setCopied] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    changeRef.current = onStepChange;
  });

  const stepsKey = JSON.stringify(steps);
  const stepList = useMemo(
    () => JSON.parse(stepsKey) as CodeMorphStep[],
    [stepsKey],
  );
  const codes = useMemo(
    () => stepList.map((step) => dedent(step.code ?? "")),
    [stepList],
  );
  const highlighted = useHighlightedSteps(codes, lang);
  const parsed = useMemo(
    () =>
      stepList.map((step, index) =>
        parseStep(
          step,
          codes[index],
          highlighted?.[index] ??
            codes[index].split("\n").map((line) => pieces(line)),
          index,
        ),
      ),
    [stepList, codes, highlighted],
  );

  const count = parsed.length;
  const leading = clamp(finite(lineHeight, 1.7), 1.2, 2.4);
  const lh = FONT_SIZE * leading;
  const time = clamp(finite(duration, 800), 0, 4000);
  const maxLines = parsed.reduce(
    (most, item) => Math.max(most, item.lines.length),
    1,
  );
  const digits = String(maxLines).length;
  const firstStep = clamp(
    reduced && chrome !== "tabs"
      ? count - 1
      : Math.round(finite(defaultStep, 0)),
    0,
    Math.max(0, count - 1),
  );

  const apply = useCallback((next: Frame) => {
    frameRef.current = next;
    setScene(next);
  }, []);

  const later = useCallback((callback: () => void, wait: number) => {
    const handle = window.setTimeout(() => {
      timersRef.current = timersRef.current.filter((item) => item !== handle);
      callback();
    }, wait);
    timersRef.current.push(handle);
  }, []);

  const settle = useCallback(() => {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const current = frameRef.current;
        if (!current) return;
        if (
          !current.instant &&
          !current.glyphs.some((glyph) => glyph.state === "enter")
        )
          return;
        apply({
          ...current,
          instant: false,
          glyphs: current.glyphs.map((glyph) =>
            glyph.state === "enter" ? { ...glyph, state: "in" } : glyph,
          ),
        });
      }),
    );
  }, [apply]);

  const build = useCallback(
    (index: number, items: Layout[]): Frame => ({
      step: index,
      instant: true,
      glyphs: parsed[index].flat.map((piece, k) => ({
        id: idRef.current++,
        index: k,
        piece,
        x: items[index]?.xs[k] ?? 0,
        state: "in",
        delay: 0,
      })),
    }),
    [parsed],
  );

  useLayoutEffect(() => {
    const host = measureRef.current;
    if (!host) return;
    let cancelled = false;
    const measure = () => {
      if (cancelled) return;
      const probe = host.querySelector<HTMLElement>("[data-probe]");
      const char = probe
        ? probe.getBoundingClientRect().width / 10
        : FONT_SIZE * 0.6;
      const items: Layout[] = [];
      host.querySelectorAll<HTMLElement>("[data-step]").forEach((node) => {
        const base = node.getBoundingClientRect();
        const xs: number[] = [];
        let width = 0;
        node.querySelectorAll<HTMLElement>("[data-token]").forEach((span) => {
          const rect = span.getBoundingClientRect();
          const x = rect.left - base.left;
          xs.push(x);
          width = Math.max(width, x + rect.width);
        });
        items.push({ xs, width });
      });
      setLayouts({ items, char });
      const current = frameRef.current;
      const index = clamp(
        current ? current.step : firstStep,
        0,
        Math.max(0, items.length - 1),
      );
      apply(build(index, items));
      settle();
    };
    measure();
    const fonts = document.fonts;
    fonts.ready.then(measure).catch(() => {});
    fonts.addEventListener("loadingdone", measure);
    return () => {
      cancelled = true;
      fonts.removeEventListener("loadingdone", measure);
    };
  }, [parsed, leading, apply, build, settle, firstStep]);

  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const update = () => setAvail(body.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(body);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timers = timersRef;
    return () => {
      timers.current.forEach((handle) => window.clearTimeout(handle));
      timers.current = [];
    };
  }, []);

  const goTo = useCallback(
    (target: number) => {
      const current = frameRef.current;
      if (!current || !layouts) return;
      const index = ((Math.round(target) % count) + count) % count;
      if (index === current.step) return;
      const next = parsed[index];
      const layout = layouts.items[index];
      if (!next || !layout) return;
      const present = current.glyphs.filter((glyph) => glyph.state !== "exit");
      const match = align(
        present.map((glyph) => glyph.piece.text),
        next.flat.map((piece) => piece.text),
      );
      const used = new Uint8Array(present.length);
      match.forEach((value) => {
        if (value >= 0) used[value] = 1;
      });
      next.flat.forEach((piece, j) => {
        if (match[j] >= 0 || piece.text.length < 2 || !WORD.test(piece.text))
          return;
        let best = -1;
        let score = Infinity;
        present.forEach((glyph, k) => {
          if (
            used[k] ||
            glyph.piece.text !== piece.text ||
            Math.abs(glyph.piece.line - piece.line) > 24
          )
            return;
          const distance =
            Math.abs(glyph.piece.line - piece.line) +
            Math.abs(glyph.x - layout.xs[j]) / 400;
          if (distance < score) {
            score = distance;
            best = k;
          }
        });
        if (best >= 0) {
          match[j] = best;
          used[best] = 1;
        }
      });
      let first = Infinity;
      next.flat.forEach((piece, j) => {
        if (match[j] < 0) first = Math.min(first, piece.line);
      });
      const glyphs: Glyph[] = next.flat.map((piece, j) => {
        const x = layout.xs[j] ?? 0;
        if (match[j] >= 0)
          return {
            id: present[match[j]].id,
            index: j,
            piece,
            x,
            state: "in",
            delay: 0,
          };
        return {
          id: idRef.current++,
          index: j,
          piece,
          x,
          state: reduced ? "in" : "enter",
          delay: Math.round(
            time * 0.6 + Math.min(120, (piece.line - first) * 14),
          ),
        };
      });
      if (!reduced)
        present.forEach((glyph, k) => {
          if (!used[k]) glyphs.push({ ...glyph, state: "exit", delay: 0 });
        });
      glyphs.sort((a, b) => a.id - b.id);
      apply({ step: index, glyphs, instant: reduced });
      elapsedRef.current = 0;
      changeRef.current?.(index);
      if (!reduced) {
        settle();
        later(() => {
          const latest = frameRef.current;
          if (!latest || !latest.glyphs.some((glyph) => glyph.state === "exit"))
            return;
          apply({
            ...latest,
            glyphs: latest.glyphs.filter((glyph) => glyph.state !== "exit"),
          });
        }, time + 60);
      }
    },
    [apply, count, later, layouts, parsed, reduced, settle, time],
  );

  const stepNow = scene?.step ?? firstStep;

  const advance = useCallback(() => {
    const current = frameRef.current;
    if (!current) return;
    if (!loop && current.step >= count - 1) {
      setPaused(true);
      return;
    }
    goTo(current.step + 1);
  }, [count, goTo, loop]);

  const running = playing && count > 1 && !reduced && !!layouts;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (!running) {
      fillRef.current?.style.setProperty("--sweep", "0");
      return;
    }
    const wait = Math.max(time + 400, finite(interval, 4200));
    let raf = 0;
    let last = 0;
    let visible = false;
    const tick = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(64, now - last) : 0;
      last = now;
      if (!(pauseOnHover && hoverRef.current)) elapsedRef.current += dt;
      const progress = clamp(elapsedRef.current / wait, 0, 1);
      fillRef.current?.style.setProperty("--sweep", String(progress));
      if (progress >= 1) {
        elapsedRef.current = 0;
        advance();
      }
      if (visible && !document.hidden) raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (raf || !visible || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        if (visible) wake();
      },
      { threshold: 0.2 },
    );
    observer.observe(root);
    document.addEventListener("visibilitychange", wake);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", wake);
      cancelAnimationFrame(raf);
    };
  }, [advance, interval, pauseOnHover, running, time]);

  useLayoutEffect(() => {
    const list = tablistRef.current;
    const tab = tabRefs.current[stepNow];
    if (!list || !tab) return;
    const next = { left: tab.offsetLeft, width: tab.offsetWidth };
    setIndicator((current) =>
      current.left === next.left && current.width === next.width
        ? current
        : next,
    );
    const target = tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2;
    if (list.scrollWidth > list.clientWidth)
      list.scrollTo({
        left: Math.max(0, target),
        behavior: reduced ? "auto" : "smooth",
      });
  }, [stepNow, chrome, parsed, avail, reduced, layouts]);

  useImperativeHandle(
    ref,
    () => ({
      next: () => goTo((frameRef.current?.step ?? 0) + 1),
      prev: () => goTo((frameRef.current?.step ?? 0) - 1),
      goTo: (index: number) => goTo(index),
      play: () => setPaused(false),
      pause: () => setPaused(true),
    }),
    [goTo],
  );

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), COPIED_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(parsed[stepNow]?.code ?? "");
      setCopied(true);
    } catch {
      toast.add({ type: "error", title: t.common.copyFailed });
    }
  };

  const onTabKey = (event: ReactKeyboardEvent, index: number) => {
    let target = -1;
    if (event.key === "ArrowRight") target = (index + 1) % count;
    else if (event.key === "ArrowLeft") target = (index - 1 + count) % count;
    else if (event.key === "Home") target = 0;
    else if (event.key === "End") target = count - 1;
    if (target < 0) return;
    event.preventDefault();
    tabRefs.current[target]?.focus();
    goTo(target);
  };

  const current = parsed[stepNow];
  const sharedFile = parsed.every((item) => item.file === parsed[0]?.file)
    ? stepList[0]?.file
    : undefined;
  const focusLines = focus ? (current?.focus ?? null) : null;
  const bands = ranges(focusLines);
  const maxBands = parsed.reduce(
    (most, item) => Math.max(most, ranges(focus ? item.focus : null).length),
    0,
  );
  const char = layouts?.char ?? FONT_SIZE * 0.6;
  const gutter = lineNumbers ? (digits + 2) * char : 0;
  const contentWidth =
    gutter +
    (layouts
      ? layouts.items.reduce((most, item) => Math.max(most, item.width), 0)
      : 0);
  const narrow = avail > 0 && avail < 440;
  const room = Math.max(0, avail - (narrow ? 14 : 20) * 2);
  const scale =
    fit && contentWidth > 0 && room > 0 ? Math.min(1, room / contentWidth) : 1;
  const codeHeight = maxLines * lh;
  const lineCount = current?.lines.length ?? 0;
  const instant = reduced || !scene || scene.instant;
  const padTop = chrome === "none" ? PAD_TOP.bare : PAD_TOP.barred;

  const header =
    chrome === "none" ? null : (
      <div
        className={cn(
          "relative flex h-9.5 flex-none items-stretch pr-1.25",
          chrome === "tabs" ? "pl-1.25" : "pl-3.25",
        )}
      >
        {chrome === "window" ? (
          <>
            <WindowDots className="items-center" />
            <span
              key={current?.file}
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-19 inset-y-0 flex animate-swap-in items-center justify-center truncate font-sans text-xs font-medium text-muted-foreground"
            >
              {current?.file}
            </span>
            <div className="flex-1" />
          </>
        ) : (
          <div
            ref={tablistRef}
            role="tablist"
            aria-label={t.common.a11y.codeSteps}
            className="relative flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto overflow-y-hidden window-tabs"
          >
            <div
              aria-hidden="true"
              className={cn(
                "absolute top-1/2 left-(--pill-x) -mt-3.5 h-7 w-(--pill-w) overflow-hidden rounded-lg bg-background ease-expo motion-safe:transition-[left,width] motion-safe:duration-420",
                indicator.width ? "opacity-100" : "opacity-0",
              )}
              style={
                {
                  "--pill-x": `${indicator.left}px`,
                  "--pill-w": `${indicator.width}px`,
                } as CSSProperties
              }
            >
              <div
                ref={fillRef}
                className="code-morph-sweep absolute inset-0 bg-foreground/5"
              />
            </div>
            {parsed.map((item, index) => (
              <button
                key={index}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                type="button"
                role="tab"
                aria-selected={index === stepNow}
                tabIndex={index === stepNow ? 0 : -1}
                onClick={() => goTo(index)}
                onKeyDown={(event) => onTabKey(event, index)}
                className={cn(
                  "relative h-7 flex-none cursor-pointer rounded-lg px-2.75 font-sans text-xs font-medium whitespace-nowrap outline-offset-2 transition-colors duration-220",
                  index === stepNow
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
        {chrome === "tabs" && sharedFile ? (
          <span className="flex min-w-0 flex-none items-center pl-3 font-sans text-xs font-medium text-muted-foreground">
            {sharedFile}
          </span>
        ) : null}
        {copyable ? (
          <span className="flex flex-none items-center pl-1">
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label={copied ? t.common.copied : t.common.copyCode}
              onClick={copy}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </Button>
          </span>
        ) : null}
      </div>
    );

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label={current?.file || undefined}
      data-instant={instant ? "" : undefined}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") hoverRef.current = true;
      }}
      onPointerLeave={() => {
        hoverRef.current = false;
      }}
      className={cn(
        WINDOW_FRAME,
        "code-morph",
        height !== "auto" && "h-(--morph-h)",
        className,
      )}
      style={
        {
          "--morph-h": `${height}px`,
          "--morph-size": `${FONT_SIZE}px`,
          "--morph-lh": `${lh}px`,
          "--morph-time": `${time}ms`,
          "--morph-fade": `${Math.round(time * 0.4)}ms`,
          "--morph-exit": `${Math.round(time * 0.32)}ms`,
          "--morph-wait": `${Math.round(time * 0.6)}ms`,
        } as CSSProperties
      }
    >
      {header}
      <div
        className={cn(
          WINDOW_PANEL,
          "flex min-h-0 flex-col",
          height === "auto" ? "flex-none" : "flex-1",
          chrome === "none" && "mt-1",
        )}
      >
        <div
          ref={bodyRef}
          data-clipped={!fit && contentWidth > room ? "" : undefined}
          className={cn(
            "code-morph-body relative min-h-0 overflow-hidden pt-(--pad-top) pb-4.5",
            height === "auto" ? "flex-none" : "flex-1",
            narrow ? "px-3.5" : "px-5",
          )}
          style={{ "--pad-top": `${padTop}px` } as CSSProperties}
        >
          <pre className="sr-only">{current?.code}</pre>
          {Array.from({ length: maxBands }, (_, index) => {
            const band = bands[index];
            const top = band ? band[0] : (bands[bands.length - 1]?.[0] ?? 0);
            const rows = band ? band[1] - band[0] + 1 : 1;
            return (
              <div
                key={index}
                aria-hidden="true"
                data-shown={band ? "" : undefined}
                className="code-morph-band"
                style={
                  {
                    "--band-top": `${padTop + top * lh * scale}px`,
                    "--band-h": `${rows * lh * scale}px`,
                  } as CSSProperties
                }
              />
            );
          })}
          <div
            className="relative h-(--code-h) w-(--code-w)"
            style={
              {
                "--code-w": `${contentWidth * scale}px`,
                "--code-h": `${codeHeight * scale}px`,
              } as CSSProperties
            }
          >
            <div
              aria-hidden="true"
              className="absolute top-0 left-0 h-(--inner-h) w-(--inner-w) origin-top-left scale-(--fit) font-mono text-(length:--morph-size) leading-(--morph-lh) whitespace-pre select-none"
              style={
                {
                  "--inner-w": `${contentWidth}px`,
                  "--inner-h": `${codeHeight}px`,
                  "--fit": scale,
                } as CSSProperties
              }
            >
              {lineNumbers
                ? Array.from({ length: maxLines }, (_, line) => (
                    <span
                      key={`n${line}`}
                      data-shown={line < lineCount ? "" : undefined}
                      className={cn(
                        "code-morph-number w-(--digits)",
                        focusLines && !focusLines.has(line)
                          ? "text-muted-foreground/50"
                          : "text-muted-foreground",
                      )}
                      style={
                        {
                          "--y": `${line * lh}px`,
                          "--digits": `${digits * char}px`,
                        } as CSSProperties
                      }
                    >
                      {line + 1}
                    </span>
                  ))
                : null}
              {scene
                ? scene.glyphs.map((glyph) => (
                    <span
                      key={glyph.id}
                      data-state={glyph.state}
                      data-dim={
                        focusLines && !focusLines.has(glyph.piece.line)
                          ? ""
                          : undefined
                      }
                      className={cn("code-morph-glyph", TOKEN_COLOR)}
                      style={
                        {
                          "--x": `${gutter + glyph.x}px`,
                          "--y": `${glyph.piece.line * lh}px`,
                          "--delay": `${glyph.delay}ms`,
                          "--shiki-light": glyph.piece.light,
                          "--shiki-dark": glyph.piece.dark,
                        } as CSSProperties
                      }
                    >
                      {glyph.piece.text}
                    </span>
                  ))
                : (current?.lines ?? []).map((line, row) => (
                    <div
                      key={row}
                      className="absolute top-(--y) left-(--x)"
                      style={
                        {
                          "--x": `${gutter}px`,
                          "--y": `${row * lh}px`,
                        } as CSSProperties
                      }
                    >
                      {line.map((token, index) => (
                        <span
                          key={index}
                          className={TOKEN_COLOR}
                          // eslint-disable-next-line shadcn/no-inline-styles -- tokenStyle builds the two shiki colour properties only
                          style={tokenStyle(token)}
                        >
                          {token.text}
                        </span>
                      ))}
                    </div>
                  ))}
            </div>
          </div>
          <div
            ref={measureRef}
            aria-hidden="true"
            className="pointer-events-none invisible absolute top-0 left-0 w-max font-mono text-(length:--morph-size) leading-(--morph-lh) whitespace-pre"
          >
            <span data-probe="">0000000000</span>
            {parsed.map((item, index) => (
              <div key={index} data-step="" className="absolute top-0 left-0">
                {item.lines.map((line, row) => (
                  <div key={row} className="h-(--morph-lh)">
                    {line.map((token, k) => (
                      <span key={k} data-token={token.space ? undefined : ""}>
                        {token.text}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
