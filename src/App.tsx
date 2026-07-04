/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import { ThemeProvider } from "./components/theme-provider";
import ScrollToTop from "./components/ScrollToTop";
import { LanguageProvider } from "./lib/language-provider";
import { CommandMenu } from "./components/Command";
import { useCommandMenuKeyboardShortcut } from "./hooks/use-command-menu";
import { AnimatedRoutes } from "./components/AnimatedRoutes";
import ClickSpark from "./components/ui/custom/click-spark";
import { BackgroundProvider } from "./components/backgrounds/background-provider";
import BackgroundLayer from "./components/backgrounds/BackgroundLayer";
import { CodeViewProvider } from "./components/deploy-diff/code-view-provider";
import { WELCOME_PRESET } from "@/config/welcome-preset";
import { UpdateNotification } from "./components/UpdateNotification";
import { MotionConfig } from "motion/react";
import { CanonicalUrl } from "./components/CanonicalUrl";

// create new query client instance
const queryClient = new QueryClient();

// cmdk for global shortcuts
function KeyboardShortcuts() {
  useCommandMenuKeyboardShortcut();
  return null;
}

// app
const App = () => (
  <ThemeProvider defaultTheme={WELCOME_PRESET.theme}>
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <BackgroundProvider defaultBackground={WELCOME_PRESET.background}>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <BackgroundLayer />
              <ClickSpark
                sparkColor="var(--primary)"
                sparkSize={4}
                sparkCount={7}
                duration={450}
              >
                <div className="min-h-screen flex flex-col relative">
                  <Toaster position="bottom-right" />
                  <UpdateNotification />
                  <BrowserRouter>
                    <CodeViewProvider>
                      <CanonicalUrl />
                      <KeyboardShortcuts />
                      <CommandMenu />
                      <AnimatedRoutes />
                      <ScrollToTop />
                    </CodeViewProvider>
                  </BrowserRouter>
                </div>
              </ClickSpark>
            </TooltipProvider>
          </QueryClientProvider>
        </BackgroundProvider>
      </LanguageProvider>
    </MotionConfig>
  </ThemeProvider>
);

export default App;
