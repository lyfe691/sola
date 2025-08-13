/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import ScrollToTop from "./components/ScrollToTop";
import { LanguageProvider } from "./lib/language-provider";
import { CommandMenu } from "./components/Command";
import { useCommandMenuKeyboardShortcut } from "./hooks/use-command-menu";
import { Conditionals } from "./components/Conditionals";
import { AnimatedRoutes } from "./components/AnimatedRoutes";
import { lazy, Suspense, useEffect, useState, PropsWithChildren } from "react";
const ClickSpark = lazy(() => import("./components/ClickSpark"));
import { AuroraProvider, useAurora } from "./lib/aurora-provider";
const AuroraBackground = lazy(() => import("./components/backgrounds/AuroraBackground"));

// create new query client instance
const queryClient = new QueryClient();

// cmdk for global shortcuts
function KeyboardShortcuts() {
  useCommandMenuKeyboardShortcut();
  return null;
}

// mount aurora lazily only when enabled to avoid fetching its chunk otherwise
const AuroraMount = () => {
  const { enabled } = useAurora();
  if (!enabled) return null;
  return (
    <Suspense fallback={null}>
      <AuroraBackground />
    </Suspense>
  );
};

// defer click spark until browser is idle
const DeferredClickSpark = ({ children }: PropsWithChildren) => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const fallback = (cb: () => void) => setTimeout(cb, 150);
    const ric: (
      cb: () => void
    ) => number = (window as any).requestIdleCallback || (fallback as any);
    const id = ric(() => setReady(true));
    return () => {
      // no-op cleanup; best-effort only
    };
  }, []);
  if (!ready) return <>{children}</>;
  return (
    <Suspense fallback={<>{children}</>}>
      <ClickSpark
        sparkColor="hsl(var(--primary) / 0.30)"
        sparkSize={4}
        sparkCount={7}
        duration={450}
      >
        {children}
      </ClickSpark>
    </Suspense>
  );
};

// app
const App = () => (
  <ThemeProvider defaultTheme="system">
    <LanguageProvider>
      <AuroraProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AuroraMount />
            <DeferredClickSpark>
              <div className="min-h-screen flex flex-col relative">
                <Toaster position="bottom-right" />
                <BrowserRouter>
                  <KeyboardShortcuts />
                  <CommandMenu />
                  <AnimatedRoutes />
                  <ScrollToTop />
                  <Conditionals />
                </BrowserRouter>
              </div>
            </DeferredClickSpark>
          </TooltipProvider>
        </QueryClientProvider>
      </AuroraProvider>
    </LanguageProvider>
  </ThemeProvider>
);

export default App;

