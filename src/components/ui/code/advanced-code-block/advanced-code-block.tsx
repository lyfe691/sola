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

  const hasFileName = Boolean(fileName);

  return (
    <motion.figure
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(
        "relative flex w-full flex-col flex-wrap rounded-2xl bg-card border border-border leading-6 mb-6",
        className,
      )}
    >
      {hasFileName ? (
        // header with filename
        <div className="flex items-center justify-between px-5 py-3">
          <figcaption className="max-w-full whitespace-nowrap font-medium text-muted-foreground text-xs">
            {fileName}
          </figcaption>
          <CopyToClipboard code={code} />
        </div>
      ) : (
        // minimal header - just copy button
        <div className="absolute top-3 right-3 z-10">
          <CopyToClipboard code={code} />
        </div>
      )}
      <div className={cn("w-full px-1 pb-1", !hasFileName && "pt-1")}>
        <div
          className={cn(
            "relative isolate overflow-hidden rounded-xl shadow-sm",
            hasFileName && "border-border border-t",
          )}
        >
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
