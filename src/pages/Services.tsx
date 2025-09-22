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
    accent: string;
    hoverAccent: string;
    iconBg: string;
    iconColor: string;
    badge: string;
    shadow: string;
  }
> = {
  fullstack: {
    accent: "from-sky-500/20 via-sky-500/5 to-transparent",
    hoverAccent: "from-sky-500/35 via-sky-500/10 to-transparent",
    iconBg: "bg-sky-500/15 group-hover:bg-sky-500/20",
    iconColor: "text-sky-400 group-hover:text-sky-300",
    badge: "border-sky-400/40 bg-sky-400/10 text-sky-100/90",
    shadow: "hover:shadow-[0_30px_60px_-35px_rgba(56,189,248,0.75)]",
  },
  frontend: {
    accent: "from-rose-500/20 via-rose-500/5 to-transparent",
    hoverAccent: "from-rose-500/35 via-rose-500/10 to-transparent",
    iconBg: "bg-rose-500/15 group-hover:bg-rose-500/20",
    iconColor: "text-rose-400 group-hover:text-rose-300",
    badge: "border-rose-400/40 bg-rose-400/10 text-rose-100/90",
    shadow: "hover:shadow-[0_30px_60px_-35px_rgba(244,114,182,0.75)]",
  },
  backend: {
    accent: "from-violet-500/20 via-violet-500/5 to-transparent",
    hoverAccent: "from-violet-500/35 via-violet-500/10 to-transparent",
    iconBg: "bg-violet-500/15 group-hover:bg-violet-500/20",
    iconColor: "text-violet-400 group-hover:text-violet-300",
    badge: "border-violet-400/40 bg-violet-400/10 text-violet-100/90",
    shadow: "hover:shadow-[0_30px_60px_-35px_rgba(167,139,250,0.75)]",
  },
  consulting: {
    accent: "from-amber-500/20 via-amber-500/5 to-transparent",
    hoverAccent: "from-amber-500/35 via-amber-500/10 to-transparent",
    iconBg: "bg-amber-500/15 group-hover:bg-amber-500/20",
    iconColor: "text-amber-400 group-hover:text-amber-300",
    badge: "border-amber-400/40 bg-amber-400/10 text-amber-100/90",
    shadow: "hover:shadow-[0_30px_60px_-35px_rgba(251,191,36,0.7)]",
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

      <section className="relative overflow-hidden rounded-[2rem] border border-foreground/10 bg-gradient-to-br from-background via-background/40 to-background px-6 py-10 sm:px-10 sm:py-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_55%)]" />

        <div className="relative z-10 flex flex-col gap-8">
          <ScrollReveal variant="pageTitle" className="space-y-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-primary/90">
              {t.services.title}
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              {t.services.subtitle}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-foreground/65 sm:text-base">
              {t.services.pricing}
            </p>
          </ScrollReveal>

          {heroHighlights.length > 0 && (
            <ScrollReveal variant="default" delay={120}>
              <div className="grid gap-3 sm:grid-cols-3">
                {heroHighlights.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 rounded-xl border border-foreground/10 bg-background/70 p-3 text-sm text-foreground/70 shadow-sm backdrop-blur"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                    <span className="leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          )}

          <ScrollReveal variant="default" delay={160}>
            <div>
              <Link to="/contact">
                <IconButton
                  className="w-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 sm:w-auto"
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
                whileHover={{ translateY: -8 }}
                transition={{ type: "spring", stiffness: 240, damping: 22 }}
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-background/80 p-6 sm:p-7 transition-all duration-300 backdrop-blur",
                  style.shadow
                )}
              >
                <div className={cn("pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br opacity-70", style.accent)} />
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                    style.hoverAccent
                  )}
                />

                <div className="relative z-10 flex h-full flex-col gap-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className={cn("rounded-2xl p-3 transition-colors duration-300", style.iconBg)}>
                      <service.icon className={cn("h-6 w-6 transition-colors duration-300", style.iconColor)} />
                    </div>
                    {badgeLabel && (
                      <Badge className={cn("border text-xs font-medium uppercase tracking-[0.2em] backdrop-blur", style.badge)}>
                        {badgeLabel}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-foreground">{serviceContent.title}</h3>
                    <p className="text-sm leading-relaxed text-foreground/70">{serviceContent.description}</p>
                  </div>

                  <div className="grid flex-1 grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                    {serviceContent.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-start gap-2 rounded-2xl border border-transparent bg-foreground/[0.02] p-3 transition-all duration-300 group-hover:border-foreground/10 group-hover:bg-foreground/[0.04]"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary/80" />
                        <span className="leading-snug text-foreground/70 group-hover:text-foreground/80">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 space-y-4">
                    <div className="flex flex-col gap-1 rounded-2xl border border-dashed border-foreground/15 bg-background/80 p-4">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/50">
                        {t.services.startingFrom}
                      </span>
                      <span className="text-2xl font-semibold text-foreground">{serviceContent.price}</span>
                    </div>

                    <Link to={getServiceContactUrl(service.key)} className="block">
                      <IconButton
                        variant="outline"
                        className="w-full justify-between border-foreground/20 bg-background/80 text-sm hover:border-primary/40 hover:bg-primary/10"
                        label={t.services.getStarted || "Get Started"}
                        icon={<ArrowRightIcon />}
                      />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          );
        })}
      </div>

      <ScrollReveal variant="default">
        <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/15 via-primary/5 to-background px-6 py-10 sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_55%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.18),transparent_55%)]" />

          <div className="relative z-10 grid gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">{t.services.customRequirements.title}</h2>
              <p className="text-sm leading-relaxed text-foreground/70 sm:text-base">
                {t.services.customRequirements.description}
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-white/20 bg-background/80 p-6 shadow-lg shadow-primary/10 backdrop-blur">
              <p className="text-sm text-foreground/65">{t.services.pricing}</p>
              <Link
                to="/contact?subject=Custom%20Development%20Requirements&message=Hi%20Yanis%2C%0A%0AI%20have%20specific%20requirements%20that%20don%27t%20fit%20standard%20service%20categories.%20I%27d%20like%20to%20discuss%20a%20custom%20solution.%0A%0AProject%20details%3A%0A-%20%0A-%20%0A-%20%0A%0ALooking%20forward%20to%20discussing%20this%20further%21"
                className="w-full"
              >
                <IconButton
                  className="w-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
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
