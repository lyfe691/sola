import { useId, type SVGProps } from "react";
import { cn } from "@/lib/utils";

export interface DashedPatternProps extends SVGProps<SVGSVGElement> {
  x?: number;
  y?: number;
  strokeWidth?: number;
  dashLength?: number;
  gapLength?: number;
  angle?: number;
  className?: string;
}

export function DashedPattern({
  x = 0,
  y = 0,
  strokeWidth = 1,
  dashLength = 5,
  gapLength = 10,
  angle = 0,
  className,
  ...props
}: DashedPatternProps) {
  const id = useId();

  const patternWidth = dashLength + gapLength;
  const patternHeight = patternWidth;

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 -z-20 h-full w-full select-none text-[hsl(var(--border))] opacity-40",
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          patternUnits="userSpaceOnUse"
          width={patternWidth}
          height={patternHeight}
          x={x}
          y={y}
        >
          <line
            x1={0}
            y1={0}
            x2={patternWidth}
            y2={patternHeight}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={`${dashLength} ${gapLength}`}
            transform={`rotate(${angle} ${patternWidth / 2} ${patternHeight / 2})`}
          />
        </pattern>
      </defs>
      <rect fill={`url(#${id})`} width="100%" height="100%" strokeWidth={0} />
    </svg>
  );
}

export default DashedPattern;

