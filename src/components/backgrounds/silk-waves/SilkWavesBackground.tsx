import SilkWaves from "@/components/silk-waves";
import { useBackgroundTheme } from "@/components/backgrounds/use-background-theme";
import { getSilkWavesPreset } from "./presets";
import { BACKGROUND_THEME_CLASS_KEYS } from "@/components/backgrounds/preset-utils";

export default function SilkWavesBackground() {
  const theme = useBackgroundTheme(BACKGROUND_THEME_CLASS_KEYS);
  return <SilkWaves className="size-full" {...getSilkWavesPreset(theme)} />;
}
