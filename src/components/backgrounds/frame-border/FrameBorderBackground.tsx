import FrameBorder from "@/components/frame-border";
import { useBackgroundTheme } from "@/components/backgrounds/use-background-theme";
import { getFrameBorderPreset, FRAME_BORDER_THEME_CLASS_KEYS } from "./presets";

export default function FrameBorderBackground() {
  const theme = useBackgroundTheme(FRAME_BORDER_THEME_CLASS_KEYS);
  return <FrameBorder className="size-full" {...getFrameBorderPreset(theme)} />;
}
