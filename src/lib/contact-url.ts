/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import type { OFFERINGS } from "@/config/services";
import type { Translation } from "@/lib/translations";

type Offering = (typeof OFFERINGS)[number];

/**
 * The contact page with its form filled in for one of the offerings. The
 * form names the offering as the visitor saw it; the list under it is what
 * the hourly service behind it covers.
 */
export function contactUrl(t: Translation, { key, service }: Offering): string {
  const { name } = t.services.page.offerings[key];
  const { features } = t.services.services[service];
  const ct = t.services.contactTemplate;
  const list = features.map((feature) => `- ${feature}`).join("\n");
  const subject = `${name} – ${ct.inquiry}`;
  const message = `${ct.greeting}\n\n${ct.interested.replace("{service}", name)}\n\n${ct.discuss}\n${list}\n\n${ct.closing}`;
  return `/contact?subject=${encodeURIComponent(subject)}&message=${encodeURIComponent(message)}`;
}
