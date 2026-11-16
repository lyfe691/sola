/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { cardImage, coverImage, shots } from "./services";

describe("the Services page's images", () => {
  it("has a cover and a card-size capture on disk for every shot (run `bun run images:services` when this fails)", () => {
    const missing = shots()
      .flatMap(({ project, image }) => [coverImage(project), cardImage(image)])
      .filter((src) => !existsSync(`public${src}`));
    expect(missing).toEqual([]);
  });
});
