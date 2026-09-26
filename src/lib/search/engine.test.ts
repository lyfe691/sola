/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { describe, expect, it } from "vitest";
import {
  createSearch,
  excerpt,
  fold,
  parseQuery,
  type SearchDoc,
} from "./engine";

const docs: SearchDoc[] = [
  {
    id: "luma",
    title: "Luma",
    body: "A chat app that runs on your own API keys.",
  },
  {
    id: "keys",
    title: "How keys are stored",
    context: "Luma",
    body: "When you save a key, the server first tries it against the provider.",
  },
  {
    id: "rust",
    title: "magi",
    keywords: ["Rust", "tokio"],
    body: "A port scanner.",
  },
  { id: "just", title: "Notes", body: "It just works, and you must try it." },
  { id: "zurich", title: "Zürich office", body: "Based in Zürich." },
  { id: "zh", title: "项目", body: "我的个人网站项目" },
];

const ids = (hits: { doc: SearchDoc }[]) => hits.map((hit) => hit.doc.id);

describe("fold", () => {
  it("lowercases, strips accents and maps back to the original", () => {
    const { text, source } = fold("Zürich Straße");
    expect(text).toBe("zurich strasse");
    // both s of "ss" come from the ß at index 11
    expect(source[11]).toBe(11);
    expect(source[12]).toBe(11);
    expect(source.at(-1)).toBe("Zürich Straße".length);
  });
});

describe("parseQuery", () => {
  it("splits, folds and dedupes", () => {
    expect(parseQuery("  Keys  keys ÄPI ")).toEqual(["keys", "api"]);
    expect(parseQuery("   ")).toEqual([]);
  });
});

describe("createSearch", () => {
  const search = createSearch(docs);

  it("returns nothing for an empty query", () => {
    expect(search("")).toEqual([]);
  });

  it("ranks a title match over a body match", () => {
    expect(ids(search("keys"))).toEqual(["keys", "luma"]);
  });

  it("needs every word to match somewhere", () => {
    expect(ids(search("keys server"))).toEqual(["keys"]);
    expect(ids(search("keys scanner"))).toEqual([]);
  });

  it("matches the start of a word as it is typed", () => {
    expect(ids(search("stor"))).toEqual(["keys"]);
  });

  it("matches keywords it never shows", () => {
    expect(ids(search("tokio"))).toEqual(["rust"]);
  });

  it("forgives a slip only when the word isn't on the site as typed", () => {
    expect(ids(search("rust"))).toEqual(["rust"]);
    // one swap from "rust", two edits from "just"
    expect(ids(search("rsut"))).toEqual(["rust"]);
    expect(ids(search("scaner"))).toEqual(["rust"]);
  });

  it("ignores accents both ways", () => {
    expect(ids(search("zurich"))).toEqual(["zurich"]);
    expect(ids(search("Zür"))).toEqual(["zurich"]);
  });

  it("finds words inside unspaced scripts", () => {
    expect(ids(search("网站"))).toEqual(["zh"]);
  });

  it("highlights the original spans of the title", () => {
    const [hit] = search("zur");
    expect(hit.title).toEqual([[0, 3]]);
    expect(hit.doc.title.slice(0, 3)).toBe("Zür");
  });

  it("quotes the body around the match with the match marked", () => {
    const [hit] = search("provider");
    const { text, ranges } = excerpt(hit.doc.body!, hit.body);
    const [[start, end]] = ranges;
    expect(text.slice(start, end)).toBe("provider");
  });

  it("opens the snippet on the body's first words when the body didn't match", () => {
    const [hit] = search("luma");
    const { text, ranges } = excerpt(hit.doc.body!, hit.body);
    expect(text.startsWith("A chat app")).toBe(true);
    expect(ranges).toEqual([]);
  });
});
