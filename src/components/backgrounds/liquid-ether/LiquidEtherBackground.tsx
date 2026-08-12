import LiquidEther from "@/components/LiquidEther";
import { useBackgroundTheme } from "@/components/backgrounds/use-background-theme";
import { getLiquidEtherPreset } from "./presets";
import { BACKGROUND_THEME_CLASS_KEYS } from "@/components/backgrounds/preset-utils";

export default function LiquidEtherBackground() {
  const theme = useBackgroundTheme(BACKGROUND_THEME_CLASS_KEYS);
  return <LiquidEther className="size-full" {...getLiquidEtherPreset(theme)} />;
}
