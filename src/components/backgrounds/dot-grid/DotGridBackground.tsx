import DotGrid from "@/components/DotGrid";
import { useBackgroundTheme } from "@/components/backgrounds/use-background-theme";
import { getDotGridPreset } from "./presets";
import { BACKGROUND_THEME_CLASS_KEYS } from "@/components/backgrounds/preset-utils";

export default function DotGridBackground() {
  const theme = useBackgroundTheme(BACKGROUND_THEME_CLASS_KEYS);
  return <DotGrid className="size-full" {...getDotGridPreset(theme)} />;
}
