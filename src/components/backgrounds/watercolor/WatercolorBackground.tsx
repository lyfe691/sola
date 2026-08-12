import Watercolor from "@/components/watercolor";
import { useBackgroundTheme } from "@/components/backgrounds/use-background-theme";
import { getWatercolorPreset } from "./presets";
import { BACKGROUND_THEME_CLASS_KEYS } from "@/components/backgrounds/preset-utils";

export default function WatercolorBackground() {
  const theme = useBackgroundTheme(BACKGROUND_THEME_CLASS_KEYS);
  return <Watercolor className="size-full" {...getWatercolorPreset(theme)} />;
}
