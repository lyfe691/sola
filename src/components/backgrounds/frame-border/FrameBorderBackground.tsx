import FrameBorder from "@/components/frame-border";
import { useBackgroundTheme } from "@/components/backgrounds/use-background-theme";
import { getFrameBorderPreset } from "./presets";
import { BACKGROUND_THEME_CLASS_KEYS } from "@/components/backgrounds/preset-utils";

export default function FrameBorderBackground() {
  const theme = useBackgroundTheme(BACKGROUND_THEME_CLASS_KEYS);
  return <FrameBorder className="size-full" {...getFrameBorderPreset(theme)} />;
}
