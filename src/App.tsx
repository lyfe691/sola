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
import ClickSpark from "./components/ui/custom/click-spark";
import { AuroraProvider } from "./lib/aurora-provider";
import AuroraBackground from "./components/backgrounds/AuroraBackground";
// defer imports to improve performance
import AuroraIntroModal from "./components/temporary/AuroraIntroModal";
// import ThemeRandomizer from "./components/temporary/ThemeRandomizer";
// import GitHubStarModal from "./components/temporary/GitHubStarModal";

// create new query client instance
const queryClient = new QueryClient();

// cmdk for global shortcuts
function KeyboardShortcuts() {
  useCommandMenuKeyboardShortcut();
  return null;
}

// app
const App = () => (
  <ThemeProvider defaultTheme="system">
    <LanguageProvider>
      <AuroraProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AuroraBackground />
            <ClickSpark
              sparkColor="hsl(var(--primary) / 0.30)"
              sparkSize={4}
              sparkCount={7}
              duration={450}
            >
              <div className="min-h-screen flex flex-col relative">
                <Toaster position="bottom-right" />
                <AuroraIntroModal />
                {/* <ThemeRandomizer /> */}
                <BrowserRouter>
                  {/* <GitHubStarModal /> */}
                  <KeyboardShortcuts />
                  <CommandMenu />
                  <AnimatedRoutes />
                  <ScrollToTop />
                  <Conditionals />
                </BrowserRouter>
              </div>
            </ClickSpark>
          </TooltipProvider>
        </QueryClientProvider>
      </AuroraProvider>
    </LanguageProvider>
  </ThemeProvider>
);

export default App;
