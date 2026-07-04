import DotGrid from "@/components/DotGrid";
import { useBackgroundTheme } from "@/components/backgrounds/use-background-theme";
import { getDotGridPreset, DOT_GRID_THEME_CLASS_KEYS } from "./presets";

export default function DotGridBackground() {
  const theme = useBackgroundTheme(DOT_GRID_THEME_CLASS_KEYS);
  return <DotGrid className="size-full" {...getDotGridPreset(theme)} />;
}
