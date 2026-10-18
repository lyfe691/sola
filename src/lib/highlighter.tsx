import * as React from "react";
import type { GrammarState, HighlighterCore } from "shiki/core";

// Add the languages you need. Each one loads the first time it is used.
const languages = {
  bash: () => import("shiki/langs/shellscript.mjs"),
  css: () => import("shiki/langs/css.mjs"),
  diff: () => import("shiki/langs/diff.mjs"),
  hcl: () => import("shiki/langs/hcl.mjs"),
  html: () => import("shiki/langs/html.mjs"),
  java: () => import("shiki/langs/java.mjs"),
  javascript: () => import("shiki/langs/javascript.mjs"),
  json: () => import("shiki/langs/json.mjs"),
  jsx: () => import("shiki/langs/jsx.mjs"),
  markdown: () => import("shiki/langs/markdown.mjs"),
  powershell: () => import("shiki/langs/powershell.mjs"),
  python: () => import("shiki/langs/python.mjs"),
  rust: () => import("shiki/langs/rust.mjs"),
  sql: () => import("shiki/langs/sql.mjs"),
  tsx: () => import("shiki/langs/tsx.mjs"),
  typescript: () => import("shiki/langs/typescript.mjs"),
  yaml: () => import("shiki/langs/yaml.mjs"),
};

const aliases: Record<string, keyof typeof languages> = {
  js: "javascript",
  md: "markdown",
  ps1: "powershell",
  py: "python",
  rs: "rust",
  sh: "bash",
  shell: "bash",
  shellscript: "bash",
  ts: "typescript",
  yml: "yaml",
  zsh: "bash",
};

let highlighter: Promise<HighlighterCore> | undefined;

// shiki's core and engine load with the first highlight, so a page that
// shows code never waits on them: its lines paint plain first
function getHighlighter() {
  highlighter ??= Promise.all([
    import("shiki/core"),
    import("shiki/engine/javascript"),
  ]).then(([{ createHighlighterCore }, { createJavaScriptRegexEngine }]) =>
    createHighlighterCore({
      themes: [
        import("shiki/themes/github-light.mjs"),
        import("shiki/themes/github-dark.mjs"),
      ],
      langs: [],
      engine: createJavaScriptRegexEngine({ forgiving: true }),
    }),
  );

  return highlighter;
}

function getLanguage(language: string) {
  const name = language.toLowerCase();

  if (name === "ansi") {
    return name;
  }

  if (name in languages) {
    return name as keyof typeof languages;
  }

  return aliases[name] ?? null;
}

// Loads a language and returns a highlighter for it, or null for a language
// that is not listed.
export async function loadHighlighter(language: string) {
  const lang = getLanguage(language);

  if (!lang) {
    return null;
  }

  const shiki = await getHighlighter();

  if (lang !== "ansi" && !shiki.getLoadedLanguages().includes(lang)) {
    await shiki.loadLanguage(languages[lang]);
  }

  return {
    // Returns one React node per line, and the grammar state after the last
    // line. Pass that state back to continue where the code left off.
    highlight(code: string, state?: GrammarState) {
      const tokenize = (text: string) =>
        shiki.codeToTokens(text, {
          lang,
          themes: { light: "github-light", dark: "github-dark" },
          defaultColor: false,
          grammarState: state,
        }).tokens;

      // ANSI has no grammar state, so each line is tokenized on its own and
      // gets the same colors whether it arrives in one piece or streams.
      const tokens =
        lang === "ansi"
          ? code.split("\n").flatMap((line) => tokenize(line))
          : tokenize(code);

      return {
        lines: tokens.map((line) =>
          line.map((token, index) => (
            <span
              key={index}
              style={
                {
                  "--shiki-light": token.htmlStyle?.["--shiki-light"],
                  "--shiki-dark": token.htmlStyle?.["--shiki-dark"],
                } as React.CSSProperties
              }
              className="text-(--shiki-light) dark:text-(--shiki-dark)"
            >
              {token.content}
            </span>
          )),
        ),
        state: shiki.getLastGrammarState(tokens),
      };
    },
  };
}

// Returns one React node per line, or null for a language that is not listed.
export async function highlightCode(code: string, language: string) {
  const highlighter = await loadHighlighter(language);

  return highlighter ? highlighter.highlight(code).lines : null;
}
