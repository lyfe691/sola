/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * What the Services page offers. Each offering is billed as one of the
 * hourly services (its price and contact prefill come from there) and is
 * backed by two projects that have a deep dive. The build reads this in
 * plain Node for the page's Markdown twin: no runtime `@/` imports here.
 */

export const OFFERINGS = [
  {
    key: "websites",
    service: "frontend",
    proof: [
      {
        project: "perspectas",
        image: "/projects/perspectas/home-desktop.webp",
      },
      { project: "montu", image: "/projects/montu/home-desktop.webp" },
    ],
  },
  {
    key: "apps",
    service: "fullstack",
    proof: [
      { project: "fleetmap", image: "/projects/fleetmap/map.webp" },
      { project: "kinoa", image: "/projects/kinoa/home-desktop.webp" },
    ],
  },
  {
    key: "backend",
    service: "backend",
    proof: [
      { project: "vault", image: "/projects/vault/api.webp", bare: true },
      { project: "magi", image: "/projects/magi/scan.webp", bare: true },
    ],
  },
] as const;

/** A project's capture. `bare`: it is not a web page (a terminal), so it
 *  gets no browser toolbar. */
export type Shot = { project: string; image: string; bare?: boolean };

/** The strip under the statement, in order. */
export const SHOWREEL: Shot[] = [
  { project: "sola", image: "/projects/sola/hero.webp" },
  { project: "ura", image: "/projects/ura/site-desktop.webp" },
  { project: "qr", image: "/projects/qr/hero.webp" },
  { project: "kinoa", image: "/projects/kinoa/hero.webp" },
  { project: "montu", image: "/projects/montu/tour-hero-desktop.webp" },
  { project: "fleetmap", image: "/projects/fleetmap/live.webp" },
];

/** The captures set around the closing line, clockwise from the top left. */
export const CLOSING: Shot[] = [
  { project: "sola", image: "/projects/sola/hero.webp" },
  { project: "fleetmap", image: "/projects/fleetmap/live.webp" },
  { project: "montu", image: "/projects/montu/home-desktop.webp" },
  { project: "qr", image: "/projects/qr/hero.webp" },
];

/** Every capture the page shows. */
export const shots = (): Shot[] => [
  ...SHOWREEL,
  ...OFFERINGS.flatMap(({ proof }): readonly Shot[] => proof),
  ...CLOSING,
];

/** Pixel width of a capture's card-size copy (scripts/service-images.mjs). */
export const CARD_WIDTH = 1200;

/** A capture's card-size copy. */
export const cardImage = (image: string) =>
  image.replace("/projects/", "/services/");

/** A project's cover, painted once into a file. */
export const coverImage = (project: string) =>
  `/services/${project}/cover.webp`;
