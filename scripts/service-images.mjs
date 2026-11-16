/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * Writes public/services: what the Services page's cards and the bar's menu
 * previews draw with. For each project shown there, its cover painted once into `<project>/cover.webp`
 * (inline, the painting is three large SVG blurs, and a phone draws them in
 * software for every card), and each capture at card width next to it under
 * the capture's own file name.
 *
 * Run `bun run images:services` after changing src/config/services.ts, a
 * project's art, or a capture used there; src/config/services.test.ts fails
 * when a file is missing.
 */

import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import sharp from "sharp";
import { coverSvg } from "../src/components/painted-cover/artwork.ts";
import { resolveArt } from "../src/components/painted-cover/presets.ts";
import { NAV_PROJECTS } from "../src/config/nav-menu.ts";
import { PROJECTS } from "../src/config/projects.ts";
import {
  CARD_WIDTH,
  cardImage,
  coverImage,
  shots,
} from "../src/config/services.ts";

const COVER_WIDTH = 700;

const file = (src) => {
  const path = `public${src}`;
  mkdirSync(dirname(path), { recursive: true });
  return path;
};

const covers = new Set();
const captures = new Set();
for (const { project, image } of [...shots(), ...NAV_PROJECTS]) {
  covers.add(project);
  captures.add(image);
}

for (const id of covers) {
  const project = PROJECTS.find((entry) => entry.id === id);
  if (!project) throw new Error(`services.ts names an unknown project: ${id}`);
  await sharp(Buffer.from(coverSvg(resolveArt(project.art))))
    .resize({ width: COVER_WIDTH })
    .webp({ quality: 90, effort: 6 })
    .toFile(file(coverImage(id)));
}

for (const image of captures) {
  await sharp(`public${image}`)
    .resize({ width: CARD_WIDTH, withoutEnlargement: true })
    .webp({ quality: 86, effort: 6, smartSubsample: true })
    .toFile(file(cardImage(image)));
}

console.log(
  `public/services: ${covers.size} covers, ${captures.size} captures`,
);
