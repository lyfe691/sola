/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import {
  Code2,
  Blocks,
  Database,
  Lightbulb,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { Link } from "react-router";
import { useLanguage } from "@/lib/language-provider";
import { translations, type Translation } from "@/lib/translations";
import { IconButton } from "@/components/ui/custom/icon-button";
import ScrollReveal from "@/components/ScrollReveal";
import { staggerDelay } from "@/utils/transitions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { LucideIcon } from "lucide-react";

type ServiceKey = keyof Translation["services"]["services"];

const Services = () => {
  const { language } = useLanguage();
  const t = translations[language] as Translation;

  const servicesList: {
    icon: LucideIcon;
    key: ServiceKey;
    highlight?: string;
  }[] = [
    {
      icon: Code2,
      key: "fullstack",
    },
    {
      icon: Blocks,
      key: "frontend",
      highlight: t.services.badges.mostPopular,
    },
    {
      icon: Database,
      key: "backend",
    },
    {
      icon: Lightbulb,
      key: "consulting",
    },
  ];

  // create service contact url using translated strings
  const getServiceContactUrl = (serviceKey: ServiceKey) => {
    const serviceTitle = t.services.services[serviceKey]?.title ?? serviceKey;
    const ct = t.services.contactTemplate;
    const features = t.services.services[serviceKey]?.features ?? [];
    const featureList = features.map((f: string) => `- ${f}`).join("\n");

    const subject = `${serviceTitle} – ${ct.inquiry}`;
    const message = `${ct.greeting}\n\n${ct.interested.replace("{service}", serviceTitle)}\n\n${ct.discuss}\n${featureList}\n\n${ct.closing}`;

    return `/contact?subject=${encodeURIComponent(subject)}&message=${encodeURIComponent(message)}`;
  };

  // same builder path as the per-service CTAs — the prefill must be localized
  const cr = t.services.customRequirements;
  const customRequirementsUrl = `/contact?subject=${encodeURIComponent(cr.subject)}&message=${encodeURIComponent(cr.message)}`;

  return (
    <div className="flex flex-col w-full">
      <meta name="description" content={t.seo.services.description} />

      <ScrollReveal variant="pageTitle">
        <h1 className="text-4xl font-bold mb-4">{t.services.title}</h1>
      </ScrollReveal>

      <ScrollReveal variant="default">
        <p className="text-foreground/60 mb-10 max-w-2xl">
          {t.services.subtitle}
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
        {servicesList.map((service, index) => (
          <ScrollReveal
            key={service.key}
            variant="default"
            // column position, not global index: rows sequence themselves by
            // scroll order, and a global index let the closing card (0ms)
            // visibly beat row two (160/240ms) at page load
            delay={staggerDelay(index % 2)}
          >
            <Card className="group relative h-full gap-0 overflow-visible bg-card/40 p-0 backdrop-blur-md transition-shadow duration-300 hover:shadow-lg">
              {service.highlight && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 shadow-xs">
                  {service.highlight}
                </Badge>
              )}

              <div className="flex h-full flex-col gap-4 p-5 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="rounded-xl bg-linear-to-br from-accent/20 to-transparent p-2.5">
                      <service.icon className="h-6 w-6 text-primary/80" />
                    </div>
                    <h3 className="truncate text-base font-medium text-foreground transition-colors group-hover:text-primary sm:text-lg">
                      {t.services.services[service.key].title}
                    </h3>
                  </div>
                  <Badge
                    variant="outline"
                    className="hidden shrink-0 border-primary/20 bg-primary/10 font-medium text-primary sm:ml-auto sm:inline-flex"
                  >
                    {t.services.services[service.key].price}
                  </Badge>
                </div>

                <Separator />

                <p className="text-sm text-foreground/70">
                  {t.services.services[service.key].description}
                </p>

                <ul className="flex flex-1 flex-col gap-3">
                  {t.services.services[service.key].features.map(
                    (feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-sm text-foreground/70 transition-colors group-hover:text-foreground/80"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary/80 transition-colors group-hover:text-primary" />
                        <span>{feature}</span>
                      </li>
                    ),
                  )}
                </ul>

                <div className="flex items-center justify-center gap-2 rounded-xl bg-foreground/5 px-3 py-2 text-sm text-foreground/90 sm:hidden">
                  <Tag className="h-4 w-4 text-primary/80" />
                  <span className="font-semibold">
                    {t.services.services[service.key].price}
                  </span>
                </div>

                <IconButton
                  nativeButton={false}
                  render={<Link to={getServiceContactUrl(service.key)} />}
                  variant="default"
                  className="w-full"
                  size="lg"
                  label={t.services.getStarted}
                />
              </div>
            </Card>
          </ScrollReveal>
        ))}
      </div>

      {/* custom requirements — delayed past the grid's column stagger so it
          can never lead the cards above it when co-visible */}
      <ScrollReveal variant="default" delay={160}>
        <Card className="bg-linear-to-br from-primary/20 via-primary/10 to-card p-5 sm:p-6 md:p-8">
          <h2 className="text-xl font-medium text-foreground">
            {t.services.customRequirements.title}
          </h2>
          <p className="max-w-2xl text-sm text-foreground/70">
            {t.services.customRequirements.description}
          </p>
          <IconButton
            nativeButton={false}
            render={<Link to={customRequirementsUrl} />}
            className="self-start transition-colors duration-150"
          >
            {t.services.customRequirements.button}
          </IconButton>
        </Card>
      </ScrollReveal>
    </div>
  );
};

export default Services;
