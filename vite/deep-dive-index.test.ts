/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { describe, expect, it } from "vitest";
import { extractSections, inlineText } from "./deep-dive-index";

const MDX = `# A chat app on your own keys

[Luma](https://luma.ysz.life) is a **chat** app.

<Safari
  url="luma.ysz.life"
  src="/projects/luma/home.webp"
  alt="not shown on the page"
  caption="The start screen."
/>

## Conversations are trees

Every message is a row in \`chat_message_nodes\`.

<CodeBlock
  code={\`const tag = <Hr />
  const s = "quote"\`}
/>

- a list item with a [link](/x)

\`\`\`text
fenced output stays out
\`\`\`

<ProjectGallery images={[{ src: "/a.webp", caption: "First, it's here." }]} />

### A detail

Under the tree.
`;

describe("inlineText", () => {
  it("keeps the words and drops the syntax", () => {
    expect(
      inlineText("**Bold** and _em_ and `code_id` [link](/x) ![img](/y)"),
    ).toBe("Bold and em and code_id link");
    expect(inlineText("1. first &amp; second")).toBe("first & second");
  });
});

describe("extractSections", () => {
  const sections = extractSections(MDX);

  it("makes one section per heading, anchored like the page", () => {
    expect(sections.map((s) => s.id)).toEqual([
      "a-chat-app-on-your-own-keys",
      "conversations-are-trees",
      "a-detail",
    ]);
  });

  it("keeps prose and captions, drops alt text", () => {
    expect(sections[0].text).toBe("Luma is a chat app. The start screen.");
  });

  it("skips code, even code holding its own />", () => {
    const text = sections[1].text;
    expect(text).toContain("chat_message_nodes");
    expect(text).toContain("a list item with a link");
    expect(text).toContain("First, it's here.");
    expect(text).not.toContain("quote");
    expect(text).not.toContain("fenced");
  });

  it("files an h3 under its h2", () => {
    expect(sections[2]).toMatchObject({
      heading: "A detail",
      parent: "Conversations are trees",
      text: "Under the tree.",
    });
  });
});
