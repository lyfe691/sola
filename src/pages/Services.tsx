/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Code2, Blocks, Database, Lightbulb, ArrowRightIcon, CheckCircle2, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/language-provider";
import { translations, type Translation } from "@/lib/translations";
import { Helmet } from "react-helmet-async";
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
    accent: string;
    iconBg: string;
    iconColor: string;
    badge: string;
  }
> = {
  fullstack: {
    accent: "from-sky-500/25 via-sky-500/10 to-transparent",
    iconBg: "bg-sky-500/15",
    iconColor: "text-sky-200",
    badge: "border-sky-400/40 bg-sky-500/10 text-sky-100",
  },
  frontend: {
    accent: "from-rose-500/25 via-rose-500/10 to-transparent",
    iconBg: "bg-rose-500/15",
    iconColor: "text-rose-200",
    badge: "border-rose-400/35 bg-rose-500/10 text-rose-100",
  },
  backend: {
    accent: "from-violet-500/25 via-violet-500/10 to-transparent",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-200",
    badge: "border-violet-400/35 bg-violet-500/10 text-violet-100",
  },
  consulting: {
    accent: "from-amber-500/25 via-amber-500/10 to-transparent",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-200",
    badge: "border-amber-400/35 bg-amber-500/10 text-amber-100",
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

      <section className="relative overflow-hidden rounded-[2rem] border border-foreground/10 bg-background/95 px-6 py-10 sm:px-10 sm:py-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-[-6rem] h-52 w-52 rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.25),transparent_70%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 bottom-[-8rem] h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(248,113,113,0.22),transparent_70%)]"
        />
        <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <ScrollReveal variant="pageTitle" className="space-y-6 md:max-w-2xl">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-foreground/15 bg-foreground/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/60">
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

          <ScrollReveal variant="default" delay={120} className="md:w-[min(20rem,45%)]">
            <div className="flex flex-col gap-5">
              {heroHighlights.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {heroHighlights.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-2xl border border-foreground/12 bg-foreground/[0.05] px-4 py-3 text-sm text-foreground/70 backdrop-blur-sm"
                    >
                      <CheckCircle2 className="h-4 w-4 text-foreground/50" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}

              <Link
                to="/contact"
                className="group flex w-full items-center justify-between rounded-2xl border border-foreground/12 bg-foreground/[0.04] px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-foreground/18 hover:bg-foreground/[0.07]"
              >
                <span>{t.services.getStarted || "Get Started"}</span>
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
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
              <div
                className="group relative flex h-full flex-col gap-6 overflow-hidden rounded-3xl border border-foreground/10 bg-background/95 p-6 shadow-[0_18px_48px_-32px_rgba(15,23,42,0.55)] transition-colors hover:border-foreground/18"
              >
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-x-6 top-6 h-28 rounded-[2rem] bg-gradient-to-br opacity-80",
                    style.accent
                  )}
                />

                <div className="relative flex items-start justify-between gap-4">
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", style.iconBg)}>
                    <service.icon className={cn("h-6 w-6", style.iconColor)} />
                  </div>
                  {badgeLabel && (
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full border border-foreground/12 bg-foreground/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/60 backdrop-blur-sm",
                        style.badge
                      )}
                    >
                      {badgeLabel}
                    </Badge>
                  )}
                </div>

                <div className="relative space-y-3">
                  <h3 className="text-xl font-semibold text-foreground">{serviceContent.title}</h3>
                  <p className="text-sm leading-relaxed text-foreground/70">{serviceContent.description}</p>
                </div>

                <div className="relative flex items-center justify-between rounded-2xl border border-foreground/8 bg-foreground/[0.03] px-4 py-3">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/55">
                    {t.services.startingFrom}
                  </span>
                  <span className="text-base font-semibold text-foreground">{serviceContent.price}</span>
                </div>

                {serviceContent.features.length > 0 && (
                  <div className="relative flex flex-wrap gap-2">
                    {serviceContent.features.map((feature, featureIndex) => (
                      <span
                        key={featureIndex}
                        className="rounded-full border border-foreground/12 bg-foreground/[0.04] px-3 py-1 text-xs font-medium text-foreground/70"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}

                <div className="relative mt-auto pt-2">
                  <Link
                    to={getServiceContactUrl(service.key)}
                    className="group flex w-full items-center justify-between rounded-2xl border border-foreground/12 bg-transparent px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-foreground/18 hover:bg-foreground/[0.06]"
                  >
                    <span>{t.services.getStarted || "Get Started"}</span>
                    <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      <ScrollReveal variant="default">
        <div className="relative overflow-hidden rounded-[2rem] border border-foreground/10 bg-background/95 px-6 py-10 sm:px-10 sm:py-12">
          <div
            aria-hidden
            className="pointer-events-none absolute right-10 top-6 h-40 w-40 rounded-full bg-[radial-gradient(circle_at_center,rgba(217,249,157,0.2),transparent_70%)]"
          />
          <div className="relative grid gap-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">{t.services.customRequirements.title}</h2>
              <p className="text-sm leading-relaxed text-foreground/70 sm:text-base">
                {t.services.customRequirements.description}
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-foreground/10 bg-foreground/[0.04] p-6 backdrop-blur-sm">
              <p className="text-sm text-foreground/65">{t.services.customRequirements.note}</p>
              <Link
                to="/contact?subject=Custom%20Development%20Requirements&message=Hi%20Yanis%2C%0A%0AI%20have%20specific%20requirements%20that%20don%27t%20fit%20standard%20service%20categories.%20I%27d%20like%20to%20discuss%20a%20custom%20solution.%0A%0AProject%20details%3A%0A-%20%0A-%20%0A-%20%0A%0ALooking%20forward%20to%20discussing%20this%20further%21"
                className="group flex w-full items-center justify-between rounded-2xl border border-foreground/12 bg-transparent px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-foreground/18 hover:bg-foreground/[0.06]"
              >
                <span>{t.services.customRequirements.button}</span>
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default Services; 
