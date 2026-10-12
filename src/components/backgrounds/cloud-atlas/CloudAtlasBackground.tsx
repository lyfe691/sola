import CloudAtlas from "./CloudAtlas";
import { useBackgroundTheme } from "@/components/backgrounds/use-background-theme";
import { getCloudAtlasPreset } from "./presets";
import { BACKGROUND_THEME_CLASS_KEYS } from "@/components/backgrounds/preset-utils";

export default function CloudAtlasBackground() {
  const theme = useBackgroundTheme(BACKGROUND_THEME_CLASS_KEYS);
  return <CloudAtlas className="size-full" {...getCloudAtlasPreset(theme)} />;
}
