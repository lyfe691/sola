import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

export function StickyFooter({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & ComponentProps<"footer">) {
  return (
    <footer className={cn("sticky bottom-0 w-full", className)} {...props}>
      {children}
    </footer>
  );
}

export default StickyFooter;

