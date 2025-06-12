/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary project and is governed by the terms in LICENSE.
 * Unauthorized use, modification, or distribution is prohibited. All rights reserved.
 * For permissions, contact yanis.sebastian.zuercher@gmail.com
 */

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import type { BundledLanguage, BundledTheme } from "shiki";

interface ShikiCodeProps {
  code: string;
  lang: BundledLanguage;
  theme: BundledTheme;
}

export default function ShikiCode({ code, lang, theme }: ShikiCodeProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>("");

  useEffect(() => {
    const highlightCode = async () => {
      try {
        const html = await codeToHtml(code, {
          lang,
          theme,
          transformers: [
            {
              pre(node) {
                // Remove default styling to use our custom styles
                delete node.properties.style;
                delete node.properties.tabindex;
              },
              code(node) {
                delete node.properties.style;
              },
            },
          ],
        });
        setHighlightedCode(html);
      } catch (error) {
        console.error("Error highlighting code:", error);
        // Fallback to plain text
        setHighlightedCode(`<code>${code}</code>`);
      }
    };

    highlightCode();
  }, [code, lang, theme]);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
      className="[&>pre]:!bg-transparent [&>pre]:!p-0 [&>pre]:!m-0 [&_code]:!bg-transparent [&>pre]:!color-inherit [&>pre]:!pl-4"
    />
  );
} 