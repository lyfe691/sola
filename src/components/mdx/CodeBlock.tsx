/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import React from "react";
import type { BundledTheme } from "shiki";
import { AdvancedCodeBlock } from "@/components/ui/code/advanced-code-block";
import type { CodeBlockLanguage } from "@/components/ui/code/advanced-code-block";

export const CodeBlock: React.FC<{
  code: string;
  fileName?: string;
  lang?: CodeBlockLanguage;
  theme?: BundledTheme;
}> = ({ code, fileName, lang = "typescript", theme }) => (
  <AdvancedCodeBlock code={code} fileName={fileName} lang={lang} theme={theme} />
);
