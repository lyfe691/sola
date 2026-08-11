/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Article shell: MDXProvider + suspense boundary + spinner. Keeps the
 * deep-dive page focused on layout rather than MDX plumbing.
 */

import { Suspense, type ComponentType, type ReactNode } from "react";
import { MDXProvider } from "@mdx-js/react";
import { Spinner } from "@/components/ui/spinner";
import { MDXComponents } from "./MDXComponents";

function MdxFallback() {
  return (
    <div className="flex items-center justify-center py-12">
      <Spinner className="size-6 text-muted-foreground" />
    </div>
  );
}

export function Mdx({
  children,
  fallback = <MdxFallback />,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <MDXProvider components={MDXComponents}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </MDXProvider>
  );
}

/** Convenience when the article is a single lazy MDX module. */
export function MdxDocument({
  component: Component,
}: {
  component: ComponentType;
}) {
  return (
    <Mdx>
      <Component />
    </Mdx>
  );
}
