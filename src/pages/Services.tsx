/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Code2, Blocks, Database, Lightbulb, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useLanguage } from "@/lib/language-provider";
import { translations, type Translation } from "@/lib/translations";
import { Helmet } from "react-helmet-async";
import { IconButton } from "@/components/ui/custom/IconButton";
import ScrollReveal from "@/components/ScrollReveal";
import { cn } from "@/lib/utils";

const Services = () => {
  const { language } = useLanguage();
  const t = translations[language] as Translation;

  const servicesList = [
    {
      icon: Code2,
      key: 'fullstack',
    },
    {
      icon: Blocks,
      key: 'frontend',
      highlight: t.services?.badges?.mostPopular || 'Most Popular'
    },
    {
      icon: Database,
      key: 'backend'
    },
    {
      icon: Lightbulb,
      key: 'consulting'
    }
  ];

  // create service contact url
  // TODO: use intl
  const getServiceContactUrl = (serviceKey: string) => {
    const serviceNames = {
      fullstack: "Full-Stack Development",
      frontend: "Frontend Development", 
      backend: "Backend Development",
      consulting: "Technical Consulting"
    };

    const serviceMessages = {
      fullstack: `Hi Yanis,\n\nI'm interested in your Full-Stack Development services. I need help building a complete web application from frontend to backend.\n\nI'd like to discuss:\n- Project requirements and timeline\n- Technology stack recommendations\n- Development approach and best practices\n\nLooking forward to hearing from you!`,
      
      frontend: `Hi Yanis,\n\nI'm interested in your Frontend Development services. I need help creating a modern, responsive user interface.\n\nI'd like to discuss:\n- UI/UX implementation\n- React/Next.js development\n- Performance optimization\n- Mobile responsiveness\n\nLooking forward to your response!`,
      
      backend: `Hi Yanis,\n\nI'm interested in your Backend Development services. I need help building robust server-side solutions.\n\nI'd like to discuss:\n- API development and design\n- Database architecture\n- Server infrastructure\n- Security implementation\n\nLooking forward to hearing from you!`,
      
      consulting: `Hi Yanis,\n\nI'm interested in your Technical Consulting services. I need guidance on technical decisions and architecture.\n\nI'd like to discuss:\n- Technology stack evaluation\n- Architecture review and recommendations\n- Code review and best practices\n- Performance optimization strategies\n\nLooking forward to your expertise!`
    };

    const subject = `${serviceNames[serviceKey as keyof typeof serviceNames]} Inquiry`;
    const message = serviceMessages[serviceKey as keyof typeof serviceMessages];

    return `/contact?subject=${encodeURIComponent(subject)}&message=${encodeURIComponent(message)}`;
  };

  return (
    <div className="flex flex-col w-full">
      <Helmet>
        <title>{t.seo.services.title}</title>
        <meta name="description" content={t.seo.services.description} />
      </Helmet>

      <ScrollReveal variant="pageTitle">
        <h1 className="text-4xl font-bold mb-8 sm:mb-12">
          {t.services.title}
        </h1>
      </ScrollReveal>

      <ScrollReveal variant="default">
        <p className="text-foreground/60 mb-8 sm:mb-12 max-w-2xl">
          {t.services.subtitle}
        </p>
      </ScrollReveal>

      <ScrollReveal variant="default">
        <div className="mb-8 sm:mb-12 rounded-2xl border border-foreground/10 bg-foreground/[0.04] p-4 text-sm text-foreground/70 shadow-sm sm:p-5">
          {t.services.pricing}
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 mb-8 sm:mb-12">
        {servicesList.map((service, index) => (
          <ScrollReveal key={service.key} variant="default" delay={index * 140}>
            <motion.article
              className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/10",
                "bg-gradient-to-br from-background via-foreground/[0.02] to-background p-6 shadow-sm",
                "transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg",
                service.highlight && "pt-12 sm:pt-14"
              )}
            >
              {service.highlight && (
                <span className="absolute right-6 top-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
                  {service.highlight}
                </span>
              )}

              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <service.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {t.services.services[service.key].title}
                    </h3>
                    <p className="mt-1 text-sm text-foreground/70">
                      {t.services.services[service.key].description}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3">
                  <span className="text-xs font-medium uppercase tracking-wide text-primary/70">
                    {t.services.priceLabel ?? "Starting at"}
                  </span>
                  <p className="mt-1 text-2xl font-semibold text-primary">
                    {t.services.services[service.key].price}
                  </p>
                </div>
              </div>

              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {t.services.services[service.key].features.map((feature, i) => (
                  <li
                    key={`${service.key}-${i}`}
                    className="flex items-center gap-3 rounded-xl border border-foreground/5 bg-foreground/[0.02] px-3 py-2 text-sm text-foreground/70 transition-colors group-hover:border-primary/20 group-hover:bg-primary/5"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                    <span className="leading-5">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-2">
                <Link to={getServiceContactUrl(service.key)}>
                  <IconButton size="lg" className="w-full">
                    {t.services.getStarted || "Get Started"}
                  </IconButton>
                </Link>
              </div>
            </motion.article>
          </ScrollReveal>
        ))}
      </div>

      {/* custom requirements */}
      <ScrollReveal variant="default">
        <div className="relative overflow-hidden rounded-xl p-5 sm:p-6 md:p-8
                       bg-gradient-to-br from-primary/20 via-primary/10 to-background
                       border border-primary/20 backdrop-blur-sm">
          <div className="relative z-10">
            <h2 className="text-xl font-medium mb-3 text-foreground">
              {t.services.customRequirements.title}
            </h2>
            <p className="text-sm text-foreground/70 mb-6 max-w-2xl">
              {t.services.customRequirements.description}
            </p>
            <Link to="/contact?subject=Custom%20Development%20Requirements&message=Hi%20Yanis%2C%0A%0AI%20have%20specific%20requirements%20that%20don%27t%20fit%20standard%20service%20categories.%20I%27d%20like%20to%20discuss%20a%20custom%20solution.%0A%0AProject%20details%3A%0A-%20%0A-%20%0A-%20%0A%0ALooking%20forward%20to%20discussing%20this%20further%21">
              <IconButton
                className="group bg-primary transition-all duration-300"
              >
                {t.services.customRequirements.button}
              </IconButton>
            </Link>
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
