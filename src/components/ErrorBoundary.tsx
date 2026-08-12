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
import { translations } from "@/lib/translations";
import { LANGUAGE_STORAGE_KEY } from "@/lib/language-provider";
import { SUPPORTED_LANGUAGE_CODES, type Language } from "@/config/languages";

/**
 * The provider tree may be the thing that crashed, so the persisted choice is
 * read straight from storage instead of through useLanguage().
 */
function readLanguage(): Language {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && (SUPPORTED_LANGUAGE_CODES as string[]).includes(stored)) {
      return stored as Language;
    }
  } catch {
    /* storage unavailable — fall through to English */
  }
  return "en";
}

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

    const t = translations[readLanguage()].errorBoundary;

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
