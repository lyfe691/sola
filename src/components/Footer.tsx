/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Link } from "react-router";
import { useTranslation } from "@/lib/language-provider";
import {
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  InformationCircleIcon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SOCIAL_BRAND_FILL,
  SOCIAL_LINKS,
  SOCIAL_ORDER_FOOTER,
} from "@/config/social";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import { DeployChip } from "@/components/deploy-diff/deploy-chip";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

/** One hover for every link down here: muted, stepping to foreground. */
const FOOTER_LINK =
  "w-fit text-muted-foreground transition-colors duration-200 ease-out hover:text-foreground";

const Footer = () => {
  const year = new Date().getFullYear();
  const t = useTranslation();
  const [isLegalExpanded, setIsLegalExpanded] = useState(false);

  const nav = [
    { text: t.nav.about, path: "/about" },
    { text: t.nav.experience, path: "/experience" },
    { text: t.nav.projects, path: "/projects" },
    { text: t.nav.skills, path: "/skills" },
    { text: t.nav.services, path: "/services" },
    { text: t.nav.contact, path: "/contact" },
  ];

  const e = "/a";

  return (
    <footer className="relative w-full border-t border-foreground/5 bg-background/5">
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 py-12">
        {/* main content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* brand section */}
          <div className="space-y-6 lg:col-span-1">
            <div className="space-y-4">
              <Link
                to="/"
                className="group inline-flex items-center space-x-2 font-heading text-2xl font-bold text-foreground transition-colors duration-200 ease-out hover:text-foreground/60"
              >
                <span>YSZ</span>
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  strokeWidth={2}
                  className="size-4 opacity-0 transition-opacity group-hover:opacity-100"
                />
              </Link>
              <p className="text-sm text-foreground/70 leading-relaxed">
                {t.footer.madeWith} <span className="text-primary">♥</span>{" "}
                {t.footer.by} {/* or <br />*/}
                <span className="font-medium">Yanis Sebastian Zürcher</span>
              </p>
            </div>

            {/* 這個網站是怎麼造出來的 */}
            <Link
              to={e}
              className={cn(
                FOOTER_LINK,
                "group flex items-center gap-2 text-xs",
              )}
            >
              <HugeiconsIcon
                icon={InformationCircleIcon}
                strokeWidth={2}
                className="size-3.5 shrink-0 transition-transform duration-200 ease-out can-hover:group-hover:rotate-12"
              />
              <span className="border-b border-dotted border-current/40">
                {t.footer.atw}
              </span>
            </Link>

            {/* legal section */}
            <div className="space-y-2">
              <button
                onClick={() => setIsLegalExpanded(!isLegalExpanded)}
                className={cn(FOOTER_LINK, "flex items-center gap-2 text-xs")}
              >
                <div
                  className={`shrink-0 transition-transform duration-200 ease-out ${isLegalExpanded ? "rotate-90" : ""}`}
                >
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    strokeWidth={2}
                    className="size-3.5"
                  />
                </div>
                <span className="font-medium">{t.footer.legal}</span>
              </button>

              <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${isLegalExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
              >
                <div className="overflow-hidden">
                  <div className="ml-5 pt-2">
                    <Link
                      to="/privacy"
                      className={cn(
                        FOOTER_LINK,
                        "group flex items-center gap-1 text-xs",
                      )}
                    >
                      {t.footer.privacy}
                      <HugeiconsIcon
                        icon={ArrowUpRight01Icon}
                        strokeWidth={2}
                        className="size-2.5 shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* navigation */}
          <div className="space-y-6">
            <h2 className="text-sm font-semibold tracking-wider text-foreground/80 uppercase">
              {t.footer.navigation}
            </h2>
            <div className="space-y-3">
              <Link to="/" className={cn(FOOTER_LINK, "block text-sm")}>
                {t.common.home}
              </Link>
              <Separator />
              {nav.map(({ text, path }) => (
                <Link
                  key={path}
                  to={path}
                  className={cn(FOOTER_LINK, "block text-sm")}
                >
                  {text}
                </Link>
              ))}
            </div>
          </div>

          {/* contact */}
          <div className="space-y-6">
            <h2 className="text-sm font-semibold tracking-wider text-foreground/80 uppercase">
              {t.footer.contact}
            </h2>
            <div className="space-y-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    "yanis.sebastian.zuercher@gmail.com",
                  );
                  toast.add({
                    type: "success",
                    title: t.common.copied,
                  });
                }}
                className={cn(
                  FOOTER_LINK,
                  "group flex w-full items-center gap-2 text-sm hover:cursor-copy",
                )}
              >
                <HugeiconsIcon
                  icon={Mail01Icon}
                  strokeWidth={2}
                  className="size-4 shrink-0 transition-transform duration-200 ease-out can-hover:group-hover:scale-110"
                />
                {/* wider than this column between lg and ~1200px; the click
                    copies all of it either way, and the title shows the rest */}
                <span
                  className="truncate"
                  title="yanis.sebastian.zuercher@gmail.com"
                >
                  yanis.sebastian.zuercher@gmail.com
                </span>
              </button>
              <Link
                to="/contact"
                className={cn(FOOTER_LINK, "flex items-center gap-1 text-sm")}
              >
                {t.footer.contactForm}
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  strokeWidth={2}
                  className="size-3 shrink-0"
                />
              </Link>
            </div>
          </div>

          {/* social links */}
          <div className="space-y-6">
            <h2 className="text-sm font-semibold tracking-wider text-foreground/80 uppercase">
              {t.footer.connect}
            </h2>
            <div className="grid w-fit grid-cols-4 gap-2">
              {SOCIAL_ORDER_FOOTER.map((id) => {
                const { href, label, icon: Icon } = SOCIAL_LINKS[id];
                return (
                  <a
                    key={id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    data-brand={id}
                    className={cn(
                      "group rounded-lg border border-foreground/10 bg-foreground/5 p-2.5 text-foreground/60 transition-colors duration-200 ease-out",
                      SOCIAL_BRAND_FILL,
                    )}
                  >
                    <Icon
                      className="size-4 transition-[scale] duration-150 ease-out group-active:scale-90"
                      aria-hidden="true"
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* SOLA wordmark */}
        <div
          className="footer-wordmark relative w-full mb-4 select-none"
          aria-hidden="true"
        >
          <div className="absolute inset-0 flex justify-center font-heading font-bold uppercase leading-none whitespace-nowrap text-background footer-wordmark-ink">
            SOLA
          </div>
        </div>

        {/* bottom section */}
        <div>
          <Separator />
          <div className="flex flex-col items-center gap-2.5 pt-8 text-center">
            <p className="text-xs text-foreground/40 leading-relaxed">
              © {year}{" "}
              <span className="font-medium">Yanis Sebastian Zürcher</span>.{" "}
              {t.footer.rights}
            </p>
            {/* the deployed-commit pin, the page's last line — centered, out
                of the scroll-to-top button's fixed bottom-right corner */}
            <div className="flex items-center gap-3">
              <DeployChip />
              <span aria-hidden="true" className="text-foreground/20">
                ·
              </span>
              <Link
                to="/changelog"
                className={cn(FOOTER_LINK, "font-mono text-xs")}
              >
                {t.footer.changelog}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
