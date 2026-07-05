/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import React from "react";
import { motion } from "motion/react";
import { EASE_OUT } from "@/utils/transitions";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { ExternalLink } from "lucide-react";
import { getAllCertifications, isExpired } from "@/config/certifications";
import { IconButton } from "@/components/ui/custom/icon-button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const Certifications: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const items = getAllCertifications();
  const localeMap: Record<typeof language, string> = {
    en: "en-US",
    de: "de-CH",
    es: "es-ES",
    ja: "ja-JP",
    zh: "zh-CN",
  };
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(localeMap[language], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const containerIn = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
  } as const;
  const fadeUp = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.32, ease: EASE_OUT },
    },
  } as const;
  const cardIn = {
    hidden: { opacity: 0, y: 12, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.35, ease: EASE_OUT },
    },
  } as const;

  return (
    <motion.div className="min-h-screen bg-linear-to-b from-background to-background/40 p-4 sm:p-6 lg:p-8">
      <meta name="description" content={t.seo.certifications.description} />

      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight mt-10 text-wrap wrap-break-word shrink-0">
            {t.certifications?.title ?? "Certifications"}
          </h1>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t.certifications?.empty ?? "No certifications published yet."}
            </p>
          ) : (
            <motion.div
              className="grid gap-4 sm:gap-6"
              variants={containerIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10% 0px" }}
            >
              {items.map((c) => {
                const expired = isExpired(c);
                return (
                  <motion.article
                    key={c.id}
                    className="group rounded-xl border bg-card/60 backdrop-blur-xs p-4 sm:p-5 md:p-6 transition-colors duration-300 hover:border-primary/20"
                    variants={cardIn}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {c.issuerLogo ? (
                          <img
                            src={c.issuerLogo}
                            alt={`${c.issuer} logo`}
                            className="w-10 h-10 rounded border border-border object-cover"
                            loading="lazy"
                          />
                        ) : null}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h2 className="text-lg font-medium text-foreground wrap-break-word">
                              {c.title}
                            </h2>
                            {expired && (
                              <span className="px-2 py-0.5 text-[10px] rounded bg-destructive/10 border border-destructive/30 text-destructive shrink-0">
                                {t.certifications?.expired ?? "Expired"}
                              </span>
                            )}
                          </div>
                          <div className="mt-1 text-xs text-foreground/60 whitespace-normal">
                            <span className="text-foreground/60">
                              {c.issuer}
                            </span>
                            <span className="mx-1">•</span>
                            <time>{formatDate(c.issueDate)}</time>
                            {c.expirationDate ? (
                              <>
                                <span className="mx-1">•</span>
                                <span>
                                  {t.certifications?.expires ?? "Expires"}:{" "}
                                  {formatDate(c.expirationDate)}
                                </span>
                              </>
                            ) : null}
                            {c.credentialId ? (
                              <>
                                <span className="mx-1">•</span>
                                <span>
                                  {t.certifications?.credentialId ??
                                    "Credential ID"}
                                  : {c.credentialId}
                                </span>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>

                    {(() => {
                      const maybePdf =
                        c.certificatePdf || c.certificateImage || undefined;
                      const isPdf =
                        typeof maybePdf === "string" &&
                        maybePdf.toLowerCase().endsWith(".pdf");
                      if (isPdf && maybePdf) {
                        return (
                          <div className="mt-4">
                            <object
                              data={maybePdf}
                              type="application/pdf"
                              className="w-full h-[420px] sm:h-[560px] rounded-lg border border-border"
                            >
                              <a
                                href={maybePdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link"
                              >
                                {t.certifications?.viewPdf ?? "View PDF"}
                              </a>
                            </object>
                          </div>
                        );
                      }
                      if (c.certificateImage && !isPdf) {
                        return (
                          <div className="mt-4">
                            <img
                              src={c.certificateImage}
                              alt={`${c.title} certificate`}
                              className="w-full rounded-lg border border-border"
                              loading="lazy"
                            />
                          </div>
                        );
                      }
                      return null;
                    })()}

                    {c.skills && c.skills.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                        {c.skills.map((s, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="font-normal"
                          >
                            {s}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                    {c.url ? (
                      <>
                        <Separator className="my-4" />
                        <div className="grid grid-cols-1">
                          <IconButton
                            variant="default"
                            size="lg"
                            icon={<ExternalLink />}
                            className="w-full"
                            onClick={() =>
                              window.open(
                                c.url!,
                                "_blank",
                                "noopener,noreferrer",
                              )
                            }
                          >
                            {t.certifications?.verify ?? "Verify"}
                          </IconButton>
                        </div>
                      </>
                    ) : null}
                  </motion.article>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Certifications;
