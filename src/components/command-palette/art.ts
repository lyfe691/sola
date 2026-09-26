/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { coverSvg } from "@/components/painted-cover/artwork";
import { resolveArt } from "@/components/painted-cover/presets";
import type { ProjectArt } from "@/config/projects";

const urls = new Map<string, string>();

/**
 * A project card's painting as an image URL, drawn once per artwork: the
 * results show it small, the preview large, and both reuse one decode.
 */
export function artworkUrl(art: ProjectArt): string {
  const key = `${art.preset}:${art.seed ?? 0}`;
  let url = urls.get(key);
  if (!url) {
    url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(coverSvg(resolveArt(art)))}`;
    urls.set(key, url);
  }
  return url;
}
