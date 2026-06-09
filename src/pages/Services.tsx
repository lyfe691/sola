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
import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/language-provider";
import { translations, type Translation } from "@/lib/translations";
import { Helmet } from "react-helmet-async";
import { IconButton } from "@/components/ui/custom/icon-button";
import ScrollReveal from "@/components/ScrollReveal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Services = () => {
  const { language } = useLanguage();
  const t = translations[language] as Translation;

  const servicesList = [
    {
      icon: Code2,
      key: "fullstack",
    },
    {
      icon: Blocks,
      key: "frontend",
      highlight: t.services?.badges?.mostPopular || "Most Popular",
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
  const getServiceContactUrl = (serviceKey: string) => {
    const serviceTitle = t.services.services[serviceKey]?.title ?? serviceKey;
    const ct = t.services.contactTemplate;
    const features = t.services.services[serviceKey]?.features ?? [];
    const featureList = features.map((f: string) => `- ${f}`).join("\n");

    const subject = `${serviceTitle} – ${ct.inquiry}`;
    const message = `${ct.greeting}\n\n${ct.interested.replace("{service}", serviceTitle)}\n\n${ct.discuss}\n${featureList}\n\n${ct.closing}`;

    return `/contact?subject=${encodeURIComponent(subject)}&message=${encodeURIComponent(message)}`;
  };

  return (
    <div className="flex flex-col w-full">
      <Helmet>
        <title>{t.seo.services.title}</title>
        <meta name="description" content={t.seo.services.description} />
      </Helmet>

      <ScrollReveal variant="pageTitle">
        <h1 className="text-4xl font-bold mb-8 sm:mb-12">{t.services.title}</h1>
      </ScrollReveal>

      <ScrollReveal variant="default">
        <p className="text-foreground/60 mb-8 sm:mb-12 max-w-2xl">
          {t.services.subtitle}
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
        {servicesList.map((service, index) => (
          <ScrollReveal key={service.key} variant="default" delay={index * 140}>
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
                  {t.services.services[service.key].features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-foreground/70 transition-colors group-hover:text-foreground/80"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary/80 transition-colors group-hover:text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
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
                  label={t.services.getStarted || "Get Started"}
                />
              </div>
            </Card>
          </ScrollReveal>
        ))}
      </div>

      {/* custom requirements */}
      <ScrollReveal variant="default">
        <div
          className="relative overflow-hidden rounded-xl p-5 sm:p-6 md:p-8
                       bg-linear-to-br from-primary/20 via-primary/10 to-background
                       border border-primary/20 backdrop-blur-xs"
        >
          <div className="relative z-10">
            <h2 className="text-xl font-medium mb-3 text-foreground">
              {t.services.customRequirements.title}
            </h2>
            <p className="text-sm text-foreground/70 mb-6 max-w-2xl">
              {t.services.customRequirements.description}
            </p>
            <IconButton
              nativeButton={false}
              render={
                <Link to="/contact?subject=Custom%20Development%20Requirements&message=Hi%20Yanis%2C%0A%0AI%20have%20specific%20requirements%20that%20don%27t%20fit%20standard%20service%20categories.%20I%27d%20like%20to%20discuss%20a%20custom%20solution.%0A%0AProject%20details%3A%0A-%20%0A-%20%0A-%20%0A%0ALooking%20forward%20to%20discussing%20this%20further%21" />
              }
              className="transition-all duration-300"
            >
              {t.services.customRequirements.button}
            </IconButton>
          </div>

          {/* decorative elemets */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
      </ScrollReveal>
    </div>
  );
};

export default Services;
