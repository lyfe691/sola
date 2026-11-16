/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The terminal sessions the site replays (TerminalReplay): in a deep dive
 * as `<Terminal session="…" />`, on the Services page and in the bar's menu.
 * Every line is what the real run printed, transcribed from its recording in
 * `public/projects/` and, for magi, checked against the tool's own format
 * strings: nothing here is written by hand to look right. The build reads
 * this in plain Node for the Markdown twin: no runtime `@/` imports here.
 */

export type TerminalTone =
  | "muted"
  | "dim"
  | "accent"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "bold";

export type TerminalStep =
  | { type: "command"; text: string; directory?: string }
  | {
      type: "output";
      lines: string[];
      delay?: number;
      /** Each line takes the last one's place, as a program redrawing its
       *  status line does. */
      replace?: boolean;
    }
  | {
      type: "spinner";
      text: string;
      duration?: number;
      done?: string;
      status?: "success" | "warning" | "error";
    }
  | { type: "progress"; text: string; duration?: number; done?: string }
  | { type: "pause"; duration?: number }
  | { type: "clear" };

export interface TerminalSession {
  script: TerminalStep[];
  /** The window's title; with one the bar shows it between the dots. */
  title?: string;
  prompt: string;
  /** Shown before the prompt, and before the one the session ends on. */
  directory?: string;
  /** False where a "command" is an answer typed into a program. */
  copyable?: boolean;
}

const key = (name: string) => `[info]"${name}"[/]`;
const text = (value: string) => `[success]"${value}"[/]`;
const jsonEntry = (port: number, banner: string, last: boolean) => [
  "  {",
  `    ${key("addr")}: ${text("45.33.32.156")},`,
  `    ${key("port")}: ${port},`,
  `    ${key("protocol")}: ${text("tcp")},`,
  `    ${key("state")}: ${text("open")},`,
  `    ${key("banner")}: ${banner}`,
  last ? "  }" : "  },",
];

const POWERSHELL = "Windows PowerShell";

export const TERMINAL_SESSIONS = {
  "magi-scan": {
    prompt: "$",
    script: [
      { type: "command", text: "magi 45.33.32.156 --banner" },
      {
        type: "output",
        lines: ["scanning 45.33.32.156 — 1024 port(s), up to 512 at a time"],
      },
      {
        type: "output",
        replace: true,
        delay: 260,
        lines: [
          "  probed 986 / 1024  (1 open)",
          "  probed 1006 / 1024  (1 open)",
          "  probed 1024 / 1024  (2 open)",
        ],
      },
      {
        type: "output",
        lines: [
          "",
          "2 open port(s):",
          "",
          "45.33.32.156",
          "     22/tcp  ssh         SSH-2.0-OpenSSH_6.6.1p1 Ubuntu-2ubuntu2.13",
          "     80/tcp  http",
        ],
      },
    ],
  },
  "magi-json": {
    prompt: "$",
    script: [
      {
        type: "command",
        text: "magi 45.33.32.156 -p 22,80,443 --banner --json | jq",
      },
      {
        type: "output",
        lines: ["scanning 45.33.32.156 — 3 port(s), up to 512 at a time"],
        delay: 800,
      },
      {
        type: "output",
        lines: [
          "[",
          ...jsonEntry(
            22,
            text("SSH-2.0-OpenSSH_6.6.1p1 Ubuntu-2ubuntu2.13"),
            false,
          ),
          ...jsonEntry(80, "[dim]null[/]", true),
          "]",
        ],
      },
    ],
  },
  "magi-udp": {
    prompt: "$",
    script: [
      { type: "command", text: "magi 45.33.32.156 -p 53,123,161 --udp" },
      {
        type: "output",
        lines: ["scanning 45.33.32.156 — 3 port(s), up to 512 at a time"],
        delay: 1000,
      },
      {
        type: "output",
        lines: [
          "",
          "1 open port(s):",
          "",
          "45.33.32.156",
          "    123/udp  -           open|filtered",
        ],
      },
    ],
  },
  "magi-untestable": {
    prompt: "$",
    script: [
      { type: "command", text: "magi scanme.nmap.org -p 22,80,443" },
      {
        type: "output",
        lines: [
          "scanning scanme.nmap.org (2 hosts) — 3 port(s), up to 512 at a time",
        ],
        delay: 400,
      },
      {
        type: "output",
        lines: [
          "",
          "2 open port(s):",
          "",
          "45.33.32.156",
          "      22/tcp  ssh",
          "      80/tcp  http",
          "warning: 3 port(s) could not be tested (network or host unreachable); results may be incomplete.",
        ],
      },
    ],
  },
  "vault-api": {
    title: POWERSHELL,
    prompt: "PS C:\\dev\\vault>",
    script: [
      {
        type: "command",
        text: "curl.exe -s -c jar -d username=demo -d password=$env:DEMO_PASSWORD localhost:5000/login",
      },
      { type: "output", lines: ['{"message":"Login successful"}'] },
      { type: "command", text: "curl.exe -si -b jar localhost:5000/user" },
      {
        type: "output",
        lines: [
          "HTTP/1.1 200 OK",
          "date: Sat, 26 Sep 2026 15:24:26 GMT",
          "server: uvicorn",
          "content-length: 82",
          "content-type: application/json",
          "vary: Origin",
          "",
          '{"message":"User access granted","user_info":{"username":"demo","roles":["user"]}}',
        ],
      },
      { type: "command", text: "curl.exe -si -b jar localhost:5000/admin" },
      {
        type: "output",
        lines: [
          "HTTP/1.1 403 Forbidden",
          "date: Sat, 26 Sep 2026 15:24:26 GMT",
          "server: uvicorn",
          "content-length: 49",
          "content-type: application/json",
          "vary: Origin",
          "",
          '{"detail":"Access denied. Required roles: admin"}',
        ],
      },
    ],
  },
  "self-setup": {
    title: POWERSHELL,
    prompt: "",
    directory: "PS C:\\Users\\user>",
    copyable: false,
    script: [
      { type: "command", text: "self --setup" },
      {
        type: "output",
        lines: [
          "[info]self Setup Wizard[/]",
          "-----------------",
          "This wizard will help you create a custom configuration for self.",
          "",
          "[warning]Display Type:[/]",
          "1. Image with Blocks (half-blocks ▀)",
          "2. Image with Braille (⣿)",
          "3. ASCII Art",
        ],
      },
      {
        type: "command",
        text: "3",
        directory: "Choose [1/2/3] (default: 1):",
      },
      {
        type: "output",
        lines: [
          "",
          "[warning]Available ASCII Art:[/]",
          "1. ewi",
          "2. lain",
          "3. mkma",
          "4. sharingan",
          "5. template",
          "6. tg",
          "7. totoro",
          "8. totoro_small",
          "9. windows",
        ],
      },
      {
        type: "command",
        text: "7",
        directory: "Choose ASCII art number (default: windows):",
      },
      {
        type: "output",
        lines: [
          "",
          "[warning]Available Color Themes:[/]",
          "1. default",
          "2. powershell",
          "3. windows",
          "4. red",
          "5. green",
          "6. magenta",
        ],
      },
      {
        type: "command",
        text: "5",
        directory: "Choose theme number (default: default):",
      },
      {
        type: "output",
        lines: [
          "",
          "",
          "[success]Configuration saved to C:\\Users\\user\\self\\config\\config.json[/]",
          "Run self with 'self' or if dev 'python self.py' to see your changes.",
          "",
        ],
      },
    ],
  },
} satisfies Record<string, TerminalSession>;

export type TerminalSessionKey = keyof typeof TERMINAL_SESSIONS;

/** The session as plain text, tone markup taken off: what it printed. */
export function transcript(session: TerminalSession): string {
  const plain = (line: string) =>
    line.replace(/\[[a-z]+\]([\s\S]*?)\[\/\]/g, "$1");
  const prompted = (directory: string | undefined, typed: string) =>
    [directory, session.prompt, typed].filter(Boolean).join(" ");
  return session.script
    .flatMap((step) => {
      if (step.type === "command")
        return [prompted(step.directory ?? session.directory, step.text)];
      if (step.type === "output")
        return (step.replace ? step.lines.slice(-1) : step.lines).map(plain);
      if (step.type === "spinner" || step.type === "progress")
        return [plain(step.done || step.text)];
      return [];
    })
    .join("\n");
}
