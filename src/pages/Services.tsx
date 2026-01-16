/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
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
import { motion } from "motion/react";
import { useLanguage } from "@/lib/language-provider";
import { translations, type Translation } from "@/lib/translations";
import { Helmet } from "react-helmet-async";
import { IconButton } from "@/components/ui/custom/icon-button";
import ScrollReveal from "@/components/ScrollReveal";

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

  // create service contact url
  // TODO: use intl
  const getServiceContactUrl = (serviceKey: string) => {
    const serviceNames = {
      fullstack: "Full-Stack Development",
      frontend: "Frontend Development",
      backend: "Backend Development",
      consulting: "Technical Consulting",
    };

    const serviceMessages = {
      fullstack: `Hi Yanis,\n\nI'm interested in your Full-Stack Development services. I need help building a complete web application from frontend to backend.\n\nI'd like to discuss:\n- Project requirements and timeline\n- Technology stack recommendations\n- Development approach and best practices\n\nLooking forward to hearing from you!`,

      frontend: `Hi Yanis,\n\nI'm interested in your Frontend Development services. I need help creating a modern, responsive user interface.\n\nI'd like to discuss:\n- UI/UX implementation\n- React/Next.js development\n- Performance optimization\n- Mobile responsiveness\n\nLooking forward to your response!`,

      backend: `Hi Yanis,\n\nI'm interested in your Backend Development services. I need help building robust server-side solutions.\n\nI'd like to discuss:\n- API development and design\n- Database architecture\n- Server infrastructure\n- Security implementation\n\nLooking forward to hearing from you!`,

      consulting: `Hi Yanis,\n\nI'm interested in your Technical Consulting services. I need guidance on technical decisions and architecture.\n\nI'd like to discuss:\n- Technology stack evaluation\n- Architecture review and recommendations\n- Code review and best practices\n- Performance optimization strategies\n\nLooking forward to your expertise!`,
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
            <motion.div
              className="group relative p-5 sm:p-6 rounded-lg border-2 border-border/20
                         bg-foreground/5 backdrop-blur-sm transition-all duration-300
                         hover:border-border/35 hover:bg-primary/5 cursor-default shadow-sm hover:shadow-md"
            >
              {service.highlight && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 
                               bg-primary text-primary-foreground text-xs rounded-full
                               font-medium shadow-sm"
                >
                  {service.highlight}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 pb-3 border-b border-foreground/10 sm:items-center">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-lg bg-gradient-to-br from-accent/20 to-transparent">
                    <service.icon className="w-6 h-6 text-primary/80" />
                  </div>
                  <h3 className="text-base sm:text-lg font-medium text-foreground group-hover:text-primary transition-colors truncate">
                    {t.services.services[service.key].title}
                  </h3>
                </div>
                <div className="sm:ml-auto mt-1 sm:mt-0 shrink-0 hidden sm:block">
                  <span
                    className="px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap 
                                    bg-primary/10 text-primary border border-primary/20 
                                    transition-colors"
                  >
                    {t.services.services[service.key].price}
                  </span>
                </div>
              </div>

              <p className="text-sm text-foreground/70 mb-6">
                {t.services.services[service.key].description}
              </p>

              <ul className="space-y-3">
                {t.services.services[service.key].features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-foreground/70
                               group-hover:text-foreground/80 transition-colors"
                  >
                    <CheckCircle2
                      className="w-4 h-4 text-primary/80 group-hover:text-primary shrink-0 mt-0.5
                                           transition-colors"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* mobile price above button */}
              <div className="sm:hidden mt-4">
                <div
                  className="w-full rounded-lg bg-foreground/5 border border-foreground/10 px-3 py-2 
                                  text-sm text-foreground/90 flex items-center justify-center gap-2"
                >
                  <Tag className="w-4 h-4 text-primary/80" />
                  <span className="font-semibold">
                    {t.services.services[service.key].price}
                  </span>
                </div>
              </div>

              {/* service contact button */}
              <div className="mt-4 sm:mt-6">
                <Link to={getServiceContactUrl(service.key)}>
                  <IconButton
                    variant="default"
                    className="w-full justify-between border-accent/50 group-hover:border-primary/50 text-sm rounded-lg"
                    label={t.services.getStarted || "Get Started"}
                  />
                </Link>
              </div>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>

      {/* custom requirements */}
      <ScrollReveal variant="default">
        <div
          className="relative overflow-hidden rounded-xl p-5 sm:p-6 md:p-8
                       bg-gradient-to-br from-primary/20 via-primary/10 to-background
                       border border-primary/20 backdrop-blur-sm"
        >
          <div className="relative z-10">
            <h2 className="text-xl font-medium mb-3 text-foreground">
              {t.services.customRequirements.title}
            </h2>
            <p className="text-sm text-foreground/70 mb-6 max-w-2xl">
              {t.services.customRequirements.description}
            </p>
            <Link to="/contact?subject=Custom%20Development%20Requirements&message=Hi%20Yanis%2C%0A%0AI%20have%20specific%20requirements%20that%20don%27t%20fit%20standard%20service%20categories.%20I%27d%20like%20to%20discuss%20a%20custom%20solution.%0A%0AProject%20details%3A%0A-%20%0A-%20%0A-%20%0A%0ALooking%20forward%20to%20discussing%20this%20further%21">
              <IconButton className="group bg-primary transition-all duration-300">
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
