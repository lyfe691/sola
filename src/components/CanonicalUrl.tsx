/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useLocation } from "react-router";
import { Helmet } from "react-helmet-async";

const SITE_URL = "https://sola.ysz.life";

export function CanonicalUrl() {
  const { pathname } = useLocation();
  const path = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  const url = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <link rel="canonical" href={url} />
      <meta property="og:url" content={url} />
      <meta name="twitter:url" content={url} />
    </Helmet>
  );
}
