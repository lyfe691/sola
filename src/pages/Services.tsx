/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Code2, Blocks, Database, Lightbulb, ArrowRightIcon, CheckCircle2, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useLanguage } from "@/lib/language-provider";
import { translations, type Translation } from "@/lib/translations";
import { Helmet } from "react-helmet-async";
import { IconButton } from "@/components/ui/custom/IconButton";
import ScrollReveal from "@/components/ScrollReveal";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ServiceKey = keyof Translation["services"]["services"];

const servicesList: Array<{ key: ServiceKey; icon: LucideIcon }> = [
  {
    icon: Code2,
    key: "fullstack",
  },
  {
    icon: Blocks,
    key: "frontend",
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

const serviceStyles: Record<
  ServiceKey,
  {
    border: string;
    iconBg: string;
    iconColor: string;
    badge: string;
  }
> = {
  fullstack: {
    border: "hover:border-sky-400/40",
    iconBg: "bg-sky-500/10",
    iconColor: "text-sky-400",
    badge: "border-sky-400/30 bg-sky-400/10 text-sky-400",
  },
  frontend: {
    border: "hover:border-rose-400/40",
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-400",
    badge: "border-rose-400/30 bg-rose-400/10 text-rose-400",
  },
  backend: {
    border: "hover:border-violet-400/40",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    badge: "border-violet-400/30 bg-violet-400/10 text-violet-400",
  },
  consulting: {
    border: "hover:border-amber-400/40",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    badge: "border-amber-400/30 bg-amber-400/10 text-amber-400",
  },
};

const Services = () => {
  const { language } = useLanguage();
  const t = translations[language] as Translation;

  const getServiceContactUrl = (serviceKey: ServiceKey) => {
    const serviceNames: Record<ServiceKey, string> = {
      fullstack: "Full-Stack Development",
      frontend: "Frontend Development",
      backend: "Backend Development",
      consulting: "Technical Consulting",
    };

    const serviceMessages: Record<ServiceKey, string> = {
      fullstack: `Hi Yanis,\n\nI'm interested in your Full-Stack Development services. I need help building a complete web application from frontend to backend.\n\nI'd like to discuss:\n- Project requirements and timeline\n- Technology stack recommendations\n- Development approach and best practices\n\nLooking forward to hearing from you!`,
      frontend: `Hi Yanis,\n\nI'm interested in your Frontend Development services. I need help creating a modern, responsive user interface.\n\nI'd like to discuss:\n- UI/UX implementation\n- React/Next.js development\n- Performance optimization\n- Mobile responsiveness\n\nLooking forward to your response!`,
      backend: `Hi Yanis,\n\nI'm interested in your Backend Development services. I need help building robust server-side solutions.\n\nI'd like to discuss:\n- API development and design\n- Database architecture\n- Server infrastructure\n- Security implementation\n\nLooking forward to hearing from you!`,
      consulting: `Hi Yanis,\n\nI'm interested in your Technical Consulting services. I need guidance on technical decisions and architecture.\n\nI'd like to discuss:\n- Technology stack evaluation\n- Architecture review and recommendations\n- Code review and best practices\n- Performance optimization strategies\n\nLooking forward to your expertise!`,
    };

    const subject = `${serviceNames[serviceKey]} Inquiry`;
    const message = serviceMessages[serviceKey];

    return `/contact?subject=${encodeURIComponent(subject)}&message=${encodeURIComponent(message)}`;
  };

  const heroHighlights = t.services.heroHighlights ?? [];

  return (
    <div className="flex w-full flex-col gap-12">
      <Helmet>
        <title>{t.seo.services.title}</title>
        <meta name="description" content={t.seo.services.description} />
      </Helmet>

      <section className="rounded-[2rem] border border-foreground/10 bg-background/80 px-6 py-10 sm:px-10 sm:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <ScrollReveal variant="pageTitle" className="space-y-6 md:max-w-2xl">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-foreground/20 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-foreground/60">
              {t.services.title}
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
                {t.services.subtitle}
              </h1>
              <p className="text-sm leading-relaxed text-foreground/65 sm:text-base">
                {t.services.pricing}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="default" delay={120} className="md:w-[min(18rem,45%)]">
            <div className="flex flex-col gap-4">
              {heroHighlights.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {heroHighlights.map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-3 py-1 text-xs font-medium text-foreground/65"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-foreground/50" />
                      {item}
                    </span>
                  ))}
                </div>
              )}

              <Link to="/contact" className="w-full">
                <IconButton
                  variant="outline"
                  className="w-full border-foreground/20 text-sm hover:border-foreground/30 hover:bg-foreground/5"
                  icon={<ArrowRightIcon />}
                  label={t.services.getStarted || "Get Started"}
                />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:gap-6">
        {servicesList.map((service, index) => {
          const style = serviceStyles[service.key];
          const serviceContent = t.services.services[service.key];
          const badgeLabel = serviceContent.badge;

          return (
            <ScrollReveal key={service.key} variant="default" delay={index * 120}>
              <motion.div
                whileHover={{ translateY: -6 }}
                transition={{ type: "spring", stiffness: 240, damping: 24 }}
                className={cn(
                  "group flex h-full flex-col gap-6 rounded-3xl border border-foreground/10 bg-background/80 p-6 transition-all duration-200 hover:shadow-lg",
                  style.border
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", style.iconBg)}>
                    <service.icon className={cn("h-6 w-6", style.iconColor)} />
                  </div>
                  {badgeLabel && (
                    <Badge className={cn("border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em]", style.badge)}>
                      {badgeLabel}
                    </Badge>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-foreground">{serviceContent.title}</h3>
                  <p className="text-sm leading-relaxed text-foreground/70">{serviceContent.description}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/50">
                    {t.services.startingFrom}
                  </span>
                  <span className="text-lg font-semibold text-foreground">{serviceContent.price}</span>
                </div>

                <ul className="space-y-2 text-sm text-foreground/70">
                  {serviceContent.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-foreground/45" />
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-2">
                  <Link to={getServiceContactUrl(service.key)} className="block">
                    <IconButton
                      variant="outline"
                      className="w-full justify-between border-foreground/20 text-sm hover:border-foreground/30 hover:bg-foreground/5"
                      label={t.services.getStarted || "Get Started"}
                      icon={<ArrowRightIcon />}
                    />
                  </Link>
                </div>
              </motion.div>
            </ScrollReveal>
          );
        })}
      </div>

      <ScrollReveal variant="default">
        <div className="rounded-[2rem] border border-foreground/10 bg-background/80 px-6 py-10 sm:px-10 sm:py-12">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">{t.services.customRequirements.title}</h2>
              <p className="text-sm leading-relaxed text-foreground/70 sm:text-base">
                {t.services.customRequirements.description}
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-foreground/10 bg-background/70 p-6">
              <p className="text-sm text-foreground/65">{t.services.customRequirements.note}</p>
              <Link
                to="/contact?subject=Custom%20Development%20Requirements&message=Hi%20Yanis%2C%0A%0AI%20have%20specific%20requirements%20that%20don%27t%20fit%20standard%20service%20categories.%20I%27d%20like%20to%20discuss%20a%20custom%20solution.%0A%0AProject%20details%3A%0A-%20%0A-%20%0A-%20%0A%0ALooking%20forward%20to%20discussing%20this%20further%21"
                className="w-full"
              >
                <IconButton
                  variant="outline"
                  className="w-full border-foreground/20 text-sm hover:border-foreground/30 hover:bg-foreground/5"
                  icon={<ArrowRightIcon />}
                  label={t.services.customRequirements.button}
                />
              </Link>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default Services; 
