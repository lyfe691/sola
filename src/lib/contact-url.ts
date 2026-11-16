/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import type { Translation } from "@/lib/translations";

export type ServiceKey = keyof Translation["services"]["services"];

/** The contact page with its form filled in for one of the services. */
export function contactUrl(t: Translation, service: ServiceKey): string {
  const { title, features } = t.services.services[service];
  const ct = t.services.contactTemplate;
  const list = features.map((feature) => `- ${feature}`).join("\n");
  const subject = `${title} – ${ct.inquiry}`;
  const message = `${ct.greeting}\n\n${ct.interested.replace("{service}", title)}\n\n${ct.discuss}\n${list}\n\n${ct.closing}`;
  return `/contact?subject=${encodeURIComponent(subject)}&message=${encodeURIComponent(message)}`;
}
