/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * What a figure and the article's lightbox share (see figure-lightbox.tsx).
 */

import { createContext } from "react";

export type FigureEntry = {
  id: string;
  /** The image, or a clip's poster: what sizes it, and its filmstrip slice. */
  src: string;
  /** A clip that plays in the image's place. */
  video?: string;
  alt: string;
  caption?: string;
  /** The thumbnail in the page: where the image leaves from and lands. */
  thumb: () => HTMLImageElement | HTMLVideoElement | null;
};

export type LightboxApi = {
  register: (entry: FigureEntry) => () => void;
  open: (id: string) => void;
  /** The figure whose image is out of the page; its thumbnail hides. */
  awayId: string | null;
};

export const FigureLightboxContext = createContext<LightboxApi | null>(null);
