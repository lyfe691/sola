"use client";

import { useTheme } from "@/components/theme-provider";
import { getThemeType } from "@/config/themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  // Automatically determine the appropriate theme - handles ALL themes dynamically
  const toasterTheme = theme === "system" ? "system" : getThemeType(theme);

  // optionally, we can make sure it matches our theming:
  return (
    <Sonner
      theme={toasterTheme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );

  // Normally, we would use the following code:
  // return (
  //   <Sonner
  //     theme={toasterTheme}
  //     className="toaster group"
  //     {...props}
  //   />
  // )
};

export { Toaster };
