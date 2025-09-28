/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '@/lib/language-provider';
import { translations } from '@/lib/translations';
import { Helmet } from 'react-helmet-async';
import { ExternalLink } from 'lucide-react';
import { getAllCertifications, isExpired } from '@/config/certifications';
import { IconButton } from '@/components/ui/custom/icon-button';
import { Separator } from '@/components/ui/separator';

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

  const fadeUp = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.04 * i } }),
  } as const;
  const cardIn = {
    hidden: { opacity: 0, scale: 0.985 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.45 } },
  } as const;
  const trail = (index: number) => ({ custom: index, variants: fadeUp, initial: "hidden", animate: "visible" as const });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="min-h-screen bg-gradient-to-b from-background to-background/40 p-4 sm:p-6 lg:p-8"
      >
        <Helmet>
          <title>{t.certifications?.title ?? 'Certifications • Yanis Sebastian Zürcher'}</title>
          <meta name="description" content={'Professional certifications and credentials'} />
        </Helmet>

        <div className="max-w-7xl mx-auto">
          <motion.div {...trail(1)} className="mb-16 text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4 tracking-tight mt-10 text-wrap break-words shrink-0">
              {t.certifications?.title ?? 'Certifications'}
            </h1>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t.certifications?.empty ?? 'No certifications published yet.'}
              </p>
            ) : (
              <div className="grid gap-4 sm:gap-6">
                 {items.map((c, i) => {
                  const expired = isExpired(c);
                  return (
                    <motion.article 
                      key={c.id}
                      className="group rounded-xl border bg-card/60 backdrop-blur-sm p-4 sm:p-5 md:p-6 transition-colors duration-300 hover:border-primary/20"
                       variants={cardIn}
                       initial="hidden"
                       animate="visible"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {c.issuerLogo ? (
                            <img 
                              src={c.issuerLogo} 
                              alt={`${c.issuer} logo`} 
                              className="w-10 h-10 rounded border border-border/40 object-cover"
                              loading="lazy"
                            />
                          ) : null}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h2 className="text-lg font-medium text-foreground break-words">
                                {c.title}
                              </h2>
                              {expired && (
                                <span className="px-2 py-0.5 text-[10px] rounded bg-destructive/10 border border-destructive/30 text-destructive shrink-0">
                                  {t.certifications?.expired ?? 'Expired'}
                                </span>
                              )}
                            </div>
                            <div className="mt-1 text-xs text-foreground/60 whitespace-normal">
                              <span className="text-foreground/60">{c.issuer}</span>
                              <span className="mx-1">•</span>
                              <time>{formatDate(c.issueDate)}</time>
                              {c.expirationDate ? (
                                <>
                                  <span className="mx-1">•</span>
                                  <span>
                                    {t.certifications?.expires ?? 'Expires'}: {formatDate(c.expirationDate)}
                                  </span>
                                </>
                              ) : null}
                              {c.credentialId ? (
                                <>
                                  <span className="mx-1">•</span>
                                  <span>{t.certifications?.credentialId ?? 'Credential ID'}: {c.credentialId}</span>
                                </>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>

                      {(() => {
                        const maybePdf = (c.certificatePdf || c.certificateImage) || undefined;
                        const isPdf = typeof maybePdf === 'string' && maybePdf.toLowerCase().endsWith('.pdf');
                        if (isPdf && maybePdf) {
                          return (
                            <div className="mt-4">
                              <object data={maybePdf} type="application/pdf" className="w-full h-[420px] sm:h-[560px] rounded-lg border border-border/40">
                                <a href={maybePdf} target="_blank" rel="noopener noreferrer" className="link">
                                  {t.certifications?.viewPdf ?? 'View PDF'}
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
                                className="w-full rounded-lg border border-border/40"
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
                            <span 
                              key={idx}
                              className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-foreground/5 text-foreground/60 border border-foreground/10"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      {c.url ? (
                        <>
                          <Separator className="my-4" />
                          <div className="grid grid-cols-1">
                            <IconButton
                              variant="default"
                              size='lg'
                              icon={<ExternalLink />}
                              className="w-full"
                              onClick={() => window.open(c.url!, '_blank', 'noopener,noreferrer')}
                            >
                              {t.certifications?.verify ?? 'Verify'}
                            </IconButton>
                          </div>
                        </>
                      ) : null}
                    </motion.article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Certifications;


