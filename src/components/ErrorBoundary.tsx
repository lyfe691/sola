/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * App-level error boundary: a render error anywhere below shows a recoverable
 * fallback instead of a blank white screen. (Chunk-load failures after a
 * redeploy are handled separately by the vite:preloadError reload in main.tsx.)
 */

import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { en, loadedTranslation } from "@/lib/translations";
import { readLanguage } from "@/lib/language-provider";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Uncaught error:", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    // the provider tree may be the thing that crashed, so the language is
    // read without it; the dictionary is loaded unless the crash beat it
    const t = (loadedTranslation(readLanguage()) ?? en).errorBoundary;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center text-foreground">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {t.title}
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">{t.message}</p>
        <Button onClick={() => window.location.reload()} className="mt-2">
          {t.reload}
        </Button>
      </div>
    );
  }
}
