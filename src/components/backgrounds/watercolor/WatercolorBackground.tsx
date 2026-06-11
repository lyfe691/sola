import Watercolor from "@/components/watercolor";
import { useBackgroundTheme } from "@/components/backgrounds/use-background-theme";
import {
  getWatercolorPreset,
  WATERCOLOR_THEME_CLASS_KEYS,
} from "./presets";

export default function WatercolorBackground() {
  const theme = useBackgroundTheme(WATERCOLOR_THEME_CLASS_KEYS);
  return (
    <Watercolor className="size-full" {...getWatercolorPreset(theme)} />
  );
}