/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Where the deep-dive translations stand, and stamping one after it is
 * written (vite/deep-dive-i18n.ts has the rules).
 *
 *   bun run i18n:deep-dives                  every language
 *   bun run i18n:deep-dives de               one language
 *   bun run i18n:deep-dives stamp de kinoa   record the English it was made from
 */

import fs from "node:fs";
import path from "node:path";
import {
  CONTENT_DIR,
  compareTranslation,
  stamp,
  strayTranslations,
  translationFile,
  translationStatus,
  TRANSLATED,
} from "../vite/deep-dive-i18n.ts";

const [command, ...rest] = process.argv.slice(2);

if (command === "stamp") {
  const [language, name] = rest;
  const file = translationFile(language ?? "", name ?? "");
  const englishFile = path.join(CONTENT_DIR, `${name}.mdx`);
  if (
    !language ||
    !name ||
    !fs.existsSync(file) ||
    !fs.existsSync(englishFile)
  ) {
    console.error("usage: bun run i18n:deep-dives stamp <language> <name>");
    process.exit(1);
  }
  const english = fs.readFileSync(englishFile, "utf8");
  const stamped = stamp(fs.readFileSync(file, "utf8"), english);
  fs.writeFileSync(file, stamped);
  const problems = compareTranslation(english, stamped);
  console.log(
    problems.length
      ? `stamped ${language}/${name}, but it is not servable yet:\n  ${problems.join("\n  ")}`
      : `stamped ${language}/${name}: current`,
  );
  process.exit(problems.length ? 1 : 0);
}

const languages = command ? [command] : TRANSLATED;
const statuses = translationStatus().filter((status) =>
  languages.includes(status.language),
);
const MARK = {
  current: "ok",
  stale: "outdated",
  missing: "-",
  invalid: "INVALID",
};

for (const language of languages) {
  const mine = statuses.filter((status) => status.language === language);
  const count = (state: string) =>
    mine.filter((status) => status.state === state).length;
  console.log(
    `\n${language}: ${count("current")} current, ${count("stale")} outdated, ` +
      `${count("missing")} missing, ${count("invalid")} invalid`,
  );
  for (const status of mine)
    if (status.state !== "missing" || mine.some((s) => s.state !== "missing"))
      console.log(
        `  ${status.name.padEnd(16)} ${MARK[status.state]}` +
          status.problems.map((problem) => `\n      ${problem}`).join(""),
      );
}

const stray = strayTranslations();
if (stray.length)
  console.log(`\nfiles that translate no deep dive:\n  ${stray.join("\n  ")}`);
process.exit(
  statuses.some((status) => status.state === "invalid") || stray.length ? 1 : 0,
);
