import LiquidEther from "@/components/LiquidEther";
import { useBackgroundTheme } from "@/components/backgrounds/use-background-theme";
import { getLiquidEtherPreset, LIQUID_ETHER_THEME_CLASS_KEYS } from "./presets";

export default function LiquidEtherBackground() {
  const theme = useBackgroundTheme(LIQUID_ETHER_THEME_CLASS_KEYS);
  return <LiquidEther className="size-full" {...getLiquidEtherPreset(theme)} />;
}
