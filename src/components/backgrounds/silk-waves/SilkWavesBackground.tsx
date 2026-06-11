import SilkWaves from "@/components/silk-waves";
import { useBackgroundTheme } from "@/components/backgrounds/use-background-theme";
import {
  getSilkWavesPreset,
  SILK_WAVES_THEME_CLASS_KEYS,
} from "./presets";

export default function SilkWavesBackground() {
  const theme = useBackgroundTheme(SILK_WAVES_THEME_CLASS_KEYS);
  return (
    <SilkWaves className="size-full" {...getSilkWavesPreset(theme)} />
  );
}