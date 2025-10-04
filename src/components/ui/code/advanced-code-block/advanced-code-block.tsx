/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import type { HTMLAttributes } from "react";
import type { BundledLanguage, BundledTheme } from "shiki";
import { motion } from "motion/react";
import { useTheme } from "@/components/theme-provider";
import { getThemeType } from "@/config/themes";
import ShikiCode from "./code-highlighter";
import CopyToClipboard from "./copy-to-clipboard";
import { cn } from "@/lib/utils";

type AdvancedBlockProps = {
  code: string;
  fileName?: string;
  lang?: BundledLanguage;
  theme?: BundledTheme;
  className?: string;
};

export const AdvancedCodeBlock = ({
  code,
  fileName,
  lang = "typescript",
  theme,
  className,
  ...props
}: AdvancedBlockProps & Omit<HTMLAttributes<HTMLDivElement>, "className">) => {
  const { theme: currentTheme } = useTheme();

  // Automatically determine the appropriate Shiki theme - handles ALL themes dynamically
  const selectedTheme =
    theme ||
    (getThemeType(currentTheme) === "dark" ? "github-dark" : "github-light");

  return (
    <motion.figure
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(
        "-mt-1 relative flex w-full flex-col flex-wrap rounded-2xl bg-card border border-border leading-6 mb-6",
        className,
      )}
    >
      <div className="flex items-center justify-between px-5 py-3">
        <figcaption className="mr-[-48px] max-w-full whitespace-nowrap font-medium text-muted-foreground text-xs">
          <span>{fileName ?? <br />}</span>
        </figcaption>
        <CopyToClipboard code={code} />
      </div>
      <div className="w-full px-1 pb-1">
        <div className="relative isolate overflow-hidden rounded-xl border-border border-t shadow-sm">
          <pre
            className="overflow-x-auto overflow-y-auto bg-muted/30 py-4 text-sm leading-6 text-foreground"
            style={{ paddingRight: "10px" }}
          >
            <ShikiCode
              code={code}
              lang={lang}
              theme={selectedTheme as BundledTheme}
            />
          </pre>
        </div>
      </div>
    </motion.figure>
  );
};
