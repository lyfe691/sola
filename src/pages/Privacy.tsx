/*
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { motion, AnimatePresence } from "motion/react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  containerVariants,
  itemVariants,
  usePageInit,
} from "@/utils/transitions";
import { Button } from "@/components/ui/button";

const Privacy = () => {
  const isLoaded = usePageInit(100);
  const n = useNavigate();

  const h = () => {
    n(-1);
  };

  return (
    <AnimatePresence>
      {isLoaded && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={containerVariants}
          className="min-h-screen bg-background p-4 sm:p-6 lg:p-8"
        >
          <Helmet>
            <title>Privacy Policy • sola.ysz.life</title>
            <meta
              name="description"
              content="Comprehensive privacy information for sola.ysz.life, detailing data collection, analytics, embedded content, processors, and user rights under the Swiss revFADP 2023 and EU GDPR."
            />
          </Helmet>

          <div className="max-w-7xl mx-auto">
            <div className="max-w-4xl mx-auto">
              <motion.div variants={itemVariants} className="mb-8">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to="/">Home</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Privacy Policy</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="mb-16 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight mt-20">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground leading-relaxed text-base mt-10">
                Last updated: July 2025
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="max-w-4xl mx-auto mb-12">
              <div className="flex items-start gap-2 bg-destructive/5 border border-destructive/20 text-destructive text-sm px-3 py-2 rounded-md">
                <AlertCircle className="w-4 h-4 mt-0.5 opacity-70" />
                <span>This page is currently only available in English. A translated version is not yet provided.</span>
              </div>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-12">
                <motion.section variants={itemVariants} id="introduction">
                  <h2 className="text-2xl font-semibold text-foreground mb-6">Introduction</h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>
                      This personal portfolio website ( <a href="https://sola.ysz.life" className="text-primary hover:underline">https://sola.ysz.life</a> ) showcases my projects and freelance services. This privacy policy complies with the Swiss Federal Act on Data Protection (revFADP 2023) and the European General Data Protection Regulation (GDPR). It explains which data are processed when you visit this site and why.
                    </p>
                    <p>
                      <strong className="text-foreground">Data Controller:</strong> Yanis Sebastian Zürcher, Switzerland<br />
                      <strong className="text-foreground">Contact:</strong> <a href="mailto:yanis.sebastian.zuercher@gmail.com" className="text-primary hover:underline">yanis.sebastian.zuercher@gmail.com</a>
                    </p>
                  </div>
                </motion.section>

                <motion.section variants={itemVariants} id="hosting">
                  <h2 className="text-2xl font-semibold text-foreground mb-6">Hosting</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    The site is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA. Vercel automatically stores connection data – such as IP address, browser type, and time of access – in server logs to guarantee secure and reliable delivery of the website.
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    <strong className="text-foreground">Legal basis:</strong> Art. 6 (1)(f) GDPR — Legitimate interest in operating and safeguarding the site.
                  </p>
                </motion.section>

                <motion.section variants={itemVariants} id="analytics">
                  <h2 className="text-2xl font-semibold text-foreground mb-6">Analytics</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    Visitor statistics are collected with Vercel Analytics. All data are anonymised prior to storage; no cookies or cross‑site identifiers are set.
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    <strong className="text-foreground">Legal basis:</strong> Art. 6 (1)(f) GDPR — Legitimate interest in analysing and improving site performance without infringing on user privacy.
                  </p>
                </motion.section>

                <motion.section variants={itemVariants} id="contact">
                  <h2 className="text-2xl font-semibold text-foreground mb-6">Contact</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    You can reach me via the on‑site contact form or by email. I store the data you provide (name, email address, and message) solely to process your enquiry and for possible follow‑up questions.
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    <strong className="text-foreground">Legal basis:</strong> Art. 6 (1)(a) GDPR — Consent; and, where relevant, Art. 6 (1)(b) GDPR — Pre‑contractual measures at your request.
                  </p>
                </motion.section>

                <motion.section variants={itemVariants} id="github">
                  <h2 className="text-2xl font-semibold text-foreground mb-6">GitHub Content</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    Pages that display GitHub contribution graphs or repository widgets load resources from GitHub Inc., USA. When these assets are requested, your IP address is transmitted to GitHub. GitHub participates in the EU–US Data Privacy Framework, providing an adequate level of protection.
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    <strong className="text-foreground">Legal basis:</strong> Art. 6 (1)(f) GDPR — Legitimate interest in presenting my open‑source activity to potential clients and collaborators.
                  </p>
                </motion.section>

                <motion.section variants={itemVariants} id="processors">
                  <h2 className="text-2xl font-semibold text-foreground mb-6">Processors</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    Data processed by Vercel and Vercel Analytics is governed by data‑processing agreements compliant with Art. 28 GDPR and Art. 9 revFADP.
                  </p>
                </motion.section>

                <motion.section variants={itemVariants} id="rights">
                  <h2 className="text-2xl font-semibold text-foreground mb-6">Your Rights</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    You may request confirmation of whether personal data about you are processed and obtain access to such data; demand rectification or erasure; request restriction of processing; or exercise your right to data portability. You may also object, on grounds relating to your particular situation, to processing based on legitimate interests.
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    To exercise these rights, please email <a href="mailto:yanis.sebastian.zuercher@gmail.com" className="text-primary hover:underline">yanis.sebastian.zuercher@gmail.com</a>. Swiss residents may contact the Federal Data Protection and Information Commissioner (FDPIC); EU residents may lodge a complaint with their local supervisory authority.
                  </p>
                </motion.section>

                <motion.section variants={itemVariants} id="changes">
                  <h2 className="text-2xl font-semibold text-foreground mb-6">Changes</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    This privacy policy may be updated to reflect changes in law or in site functionality. The current version is always available at <a href="https://sola.ysz.life/privacy" className="text-primary hover:underline">https://sola.ysz.life/privacy</a>.
                  </p>
                </motion.section>

                <motion.div variants={itemVariants} className="border-t border-border my-12" />

                <motion.section variants={itemVariants} id="impressum">
                  <h2 className="text-2xl font-semibold text-foreground mb-6">Impressum</h2>
                  <div className="text-muted-foreground leading-relaxed space-y-2 text-base">
                    <p>
                      <span className="font-semibold text-foreground">Responsible for this website:</span>
                    </p>
                    <p>Yanis Sebastian Zürcher</p>
                    <p>Zurich, Switzerland</p>
                    <p>
                      <span className="font-semibold text-foreground">Email:</span> <a href="mailto:yanis.sebastian.zuercher@gmail.com" className="text-primary hover:underline">yanis.sebastian.zuercher@gmail.com</a>
                    </p>
                  </div>
                </motion.section>
              </div>

              <motion.div variants={itemVariants} className="mt-16 pt-8 border-t border-border" onClick={h}>
                <Button
                  variant="ghost"
                  className="inline-flex items-center gap-2 text-sm "
                >
                  <span className="text-muted-foreground">←</span>
                  Back to previous page
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Privacy;