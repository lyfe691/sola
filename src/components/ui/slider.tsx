import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "@/lib/utils"

// Apple's scrubber: no knob, a thin line in the text's colour that thickens
// under the pointer and while it is dragged. The thumb stays for the keyboard
// and screen readers and shows only while it has keyboard focus.
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderPrimitive.Root.Props) {
  const initial = value ?? defaultValue
  // a plain number is one thumb in Base UI; only an array is a range
  const thumbs = Array.isArray(initial)
    ? initial.length
    : initial === undefined
      ? 2
      : 1

  return (
    <SliderPrimitive.Root
      className={cn(
        "group/slider data-horizontal:w-full data-vertical:h-full",
        className
      )}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full cursor-pointer touch-none items-center select-none data-disabled:opacity-50 data-horizontal:h-6 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-6 data-vertical:flex-col data-vertical:justify-center">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full bg-current/25 transition-[height,width] duration-150 ease-out select-none data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1 group-hover/slider:data-horizontal:h-1.5 group-hover/slider:data-vertical:w-1.5 data-dragging:data-horizontal:h-1.5 data-dragging:data-vertical:w-1.5"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="bg-current select-none data-horizontal:h-full data-vertical:w-full"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: thumbs }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            index={thumbs > 1 ? index : undefined}
            className="block size-3 shrink-0 rounded-full bg-current opacity-0 transition-opacity duration-150 ease-out select-none has-focus-visible:opacity-100 has-focus-visible:ring-4 has-focus-visible:ring-current/30 disabled:pointer-events-none"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
