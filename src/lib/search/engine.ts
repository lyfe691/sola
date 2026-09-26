/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The site search: a few hundred documents, ranked in the browser as you
 * type. Every query word has to match somewhere in a document; where it
 * matches decides the score — the title over keywords over the context line
 * over the body — and so does how: a whole word over the start of one over
 * the middle of one, with a one-letter slip forgiven in longer words. Words
 * are matched as substrings, so Chinese, Japanese and Korean text, which has
 * no spaces between words, is searched the same way.
 */

/** a half-open [start, end) span of the original string */
export type Range = readonly [number, number];

export interface SearchDoc {
  id: string;
  title: string;
  /** a short line shown with the title: the project a section is in */
  context?: string;
  /** longer text, matched and quoted in the snippet */
  body?: string;
  /** matched but never shown: technologies, aliases */
  keywords?: readonly string[];
  /** added to the score, so a kind of result can lead its ties */
  boost?: number;
}

export interface Snippet {
  text: string;
  ranges: Range[];
}

export interface SearchHit<D extends SearchDoc> {
  doc: D;
  score: number;
  /** the matched spans of each field, for highlighting */
  title: Range[];
  context: Range[];
  body: Range[];
}

const WEIGHT = { title: 10, keywords: 6, context: 4, body: 1.5 } as const;
type Field = keyof typeof WEIGHT;

const QUALITY = { word: 1, prefix: 0.8, inner: 0.35, fuzzy: 0.3 } as const;

/** a string folded for matching, and where each folded unit came from */
interface Folded {
  text: string;
  source: number[];
}

const FOLDS: Record<string, string> = { ß: "ss", æ: "ae", œ: "oe", ø: "o" };

/** lowercase, accents stripped, with a map back to the original indices */
export const fold = (value: string): Folded => {
  let text = "";
  const source: number[] = [];
  for (let i = 0; i < value.length;) {
    const char = String.fromCodePoint(value.codePointAt(i)!);
    const lower = char.toLowerCase();
    const folded =
      FOLDS[lower] ?? lower.normalize("NFD").replace(/\p{M}/gu, "");
    for (let unit = 0; unit < folded.length; unit++) source.push(i);
    text += folded;
    i += char.length;
  }
  source.push(value.length);
  return { text, source };
};

const isWordChar = (char: string | undefined) =>
  char !== undefined && /[\p{L}\p{N}]/u.test(char);

// scripts written without spaces: any substring can be a whole word
const UNSPACED =
  /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u;

/** Damerau-Levenshtein distance, stopping early once it passes `max` */
const distance = (a: string, b: string, max: number): number => {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const rows: number[][] = [];
  for (let i = 0; i <= a.length; i++) {
    rows.push([i]);
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      if (i === 0) {
        rows[0][j] = j;
        continue;
      }
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let d = Math.min(
        rows[i - 1][j] + 1,
        rows[i][j - 1] + 1,
        rows[i - 1][j - 1] + cost,
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d = Math.min(d, rows[i - 2][j - 2] + 1);
      }
      rows[i][j] = d;
      best = Math.min(best, d);
    }
    if (i > 0 && best > max) return max + 1;
  }
  return rows[a.length][b.length];
};

interface Prepared {
  folded: Folded;
  words: { start: number; end: number; text: string }[];
}

const prepare = (value: string): Prepared => {
  const folded = fold(value);
  const words = [...folded.text.matchAll(/[\p{L}\p{N}]+/gu)].map((m) => ({
    start: m.index,
    end: m.index + m[0].length,
    text: m[0],
  }));
  return { folded, words };
};

interface FieldMatch {
  quality: number;
  /** folded spans */
  spans: [number, number][];
}

const matchTerm = (
  term: string,
  field: Prepared,
  fuzzy: boolean,
): FieldMatch | null => {
  const { text } = field.folded;
  const unspaced = UNSPACED.test(term);
  let quality = 0;
  const spans: [number, number][] = [];
  for (
    let at = text.indexOf(term);
    at !== -1;
    at = text.indexOf(term, at + 1)
  ) {
    const end = at + term.length;
    const starts = !isWordChar(text[at - 1]);
    const q = unspaced
      ? QUALITY.word
      : starts
        ? isWordChar(text[end])
          ? QUALITY.prefix
          : QUALITY.word
        : QUALITY.inner;
    quality = Math.max(quality, q);
    spans.push([at, end]);
  }
  if (spans.length) return { quality, spans };
  if (!fuzzy || term.length < 4 || unspaced) return null;
  for (const word of field.words) {
    const whole = distance(term, word.text, 1) <= 1;
    const head =
      word.text.length > term.length &&
      distance(term, word.text.slice(0, term.length), 1) <= 1;
    if (whole || head) {
      spans.push([word.start, whole ? word.end : word.start + term.length]);
    }
  }
  return spans.length ? { quality: QUALITY.fuzzy, spans } : null;
};

/** folded spans back to sorted, merged spans of the original string */
const toRanges = (field: Prepared, spans: [number, number][]): Range[] => {
  const ranges = spans
    .map(([s, e]) => [field.folded.source[s], field.folded.source[e]] as const)
    .sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const [s, e] of ranges) {
    const last = merged.at(-1);
    if (last && s <= last[1]) last[1] = Math.max(last[1], e);
    else merged.push([s, e]);
  }
  return merged;
};

/**
 * About `length` characters of `text`, opening about `before` characters
 * ahead of its first matched span (or on its opening words when nothing
 * matched), cut at spaces, with the spans that fall inside moved to the
 * excerpt's own indices.
 */
export const excerpt = (
  text: string,
  ranges: readonly Range[],
  length = 140,
  before = Math.round(length / 4),
): Snippet => {
  const focus = ranges[0]?.[0] ?? 0;
  let start = Math.max(0, focus - before);
  if (start > 0) {
    const space = text.lastIndexOf(" ", start);
    start = space > focus - before * 2 ? space + 1 : start;
  }
  let end = Math.min(text.length, start + length);
  if (end < text.length) {
    const space = text.lastIndexOf(" ", end);
    if (space > start + length / 2) end = space;
  }
  const lead = start > 0 ? "…" : "";
  return {
    text: lead + text.slice(start, end) + (end < text.length ? "…" : ""),
    ranges: ranges
      .filter(([s, e]) => s >= start && e <= end)
      .map(([s, e]) => [s - start + lead.length, e - start + lead.length]),
  };
};

/** The query split into folded terms; empty when there is nothing to search. */
export const parseQuery = (query: string): string[] => [
  ...new Set(fold(query).text.split(/\s+/).filter(Boolean)),
];

export function createSearch<D extends SearchDoc>(docs: readonly D[]) {
  const prepared = docs.map((doc) => ({
    doc,
    fields: {
      title: prepare(doc.title),
      context: doc.context ? prepare(doc.context) : null,
      body: doc.body ? prepare(doc.body) : null,
      keywords: doc.keywords?.length ? prepare(doc.keywords.join(" · ")) : null,
    } satisfies Record<Field, Prepared | null>,
  }));

  return (query: string): SearchHit<D>[] => {
    const terms = parseQuery(query);
    if (!terms.length) return [];
    const whole = terms.join(" ");
    const hits: SearchHit<D>[] = [];
    // a slip is forgiven only for a word the site doesn't contain as typed:
    // otherwise "rust" would also find every "just" and "must"
    const fuzzy = new Map(
      terms.map((term) => [
        term,
        !prepared.some(({ fields }) =>
          Object.values(fields).some((f) => f?.folded.text.includes(term)),
        ),
      ]),
    );

    for (const { doc, fields } of prepared) {
      let score = doc.boost ?? 0;
      const spans: Record<Field, [number, number][]> = {
        title: [],
        context: [],
        body: [],
        keywords: [],
      };
      let matchedAll = true;
      for (const term of terms) {
        let best = 0;
        for (const field of Object.keys(WEIGHT) as Field[]) {
          const value = fields[field];
          if (!value) continue;
          const match = matchTerm(term, value, fuzzy.get(term)!);
          if (!match) continue;
          best = Math.max(best, WEIGHT[field] * match.quality);
          spans[field].push(...match.spans);
        }
        if (!best) {
          matchedAll = false;
          break;
        }
        score += best;
      }
      if (!matchedAll) continue;

      const title = fields.title.folded.text;
      if (title === whole) score += 12;
      else if (title.startsWith(whole)) score += 8;

      hits.push({
        doc,
        score,
        title: toRanges(fields.title, spans.title),
        context: fields.context ? toRanges(fields.context, spans.context) : [],
        body: fields.body ? toRanges(fields.body, spans.body) : [],
      });
    }

    return hits.sort(
      (a, b) => b.score - a.score || a.doc.title.length - b.doc.title.length,
    );
  };
}
