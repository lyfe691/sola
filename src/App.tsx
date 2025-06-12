/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary project and is governed by the terms in LICENSE.
 * Unauthorized use, modification, or distribution is prohibited. All rights reserved.
 * For permissions, contact yanis.sebastian.zuercher@gmail.com
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
import  ClickSpark from "./components/ClickSpark";

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
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ClickSpark
              sparkColor='hsl(var(--primary))'
              sparkSize={8}
              sparkRadius={15}
              sparkCount={8}
              duration={400}
            >
            <div className="min-h-screen flex flex-col">
              <Toaster position="top-center"/>
              <BrowserRouter>
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
    </LanguageProvider>
  </ThemeProvider>
);

export default App;

