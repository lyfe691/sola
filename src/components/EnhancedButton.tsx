import * as React from "react";
import {
  Button,
  type ButtonProps,
  buttonVariants,
} from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type EnhancedButtonProps = ButtonProps & {
  iconSize?: number;
  iconStrokeWidth?: number;
};

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  (props, ref) => {
    const {
      className,
      size = "lg",
      variant = "default",
      iconSize = 16,
      iconStrokeWidth = 2,
      children = "Get Started",
      asChild,
      ...restProps
    } = props;

    const content = (
      <>
        <span className="mr-8 transition-opacity duration-300 group-hover:opacity-0">
          {asChild && React.isValidElement(children)
            ? children.props.children
            : children}
        </span>
        <span
          className="absolute right-1 top-1 bottom-1 rounded-sm z-10 flex items-center justify-center w-1/4 transition-all duration-300 bg-primary-foreground/15 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95"
          aria-hidden="true"
        >
          <ChevronRight size={iconSize} strokeWidth={iconStrokeWidth} />
        </span>
      </>
    );

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement, {
        ref,
        className: cn(
          buttonVariants({ size, variant }),
          "group relative overflow-hidden",
          (children as React.ReactElement).props.className,
          className
        ),
        ...restProps,
        children: content,
      });
    }

    return (
      <Button
        ref={ref}
        size={size}
        variant={variant}
        className={cn("group relative overflow-hidden", className)}
        asChild={false}
        {...restProps}
      >
        {content}
      </Button>
    );
  }
);

EnhancedButton.displayName = "EnhancedButton";

export { EnhancedButton };
