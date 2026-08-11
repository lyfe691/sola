/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import {
  lazy,
  Suspense,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Download, ChevronRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { Link } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import ContributionActivityFeed from "@/components/ContributionActivityFeed";
import GitHubContributionCalendar from "@/components/github/GitHubContributionCalendar";
import { IconButton } from "@/components/ui/custom/icon-button";
import ScrollReveal from "@/components/ScrollReveal";
import { RichText } from "@/components/i18n/RichText";
import { LinkPreview } from "@/components/ui/custom/link-preview";
import TestimonialCard from "@/components/testimonials/TestimonialCard";
import { useTheme } from "@/components/theme-provider";
import { getThemeType } from "@/config/themes";
import { testimonials } from "@/config/testimonials";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/lib/language-provider";
import { translations, type Translation } from "@/lib/translations";
import { githubContributionsQuery } from "@/lib/github-contributions";
import { userActivityQuery } from "@/lib/github-activity";
import { cn } from "@/lib/utils";

const ParticleImage = lazy(() =>
  import("@/components/particle-image").then((m) => ({
    default: m.ParticleImage,
  })),
);

const GITHUB_USER = "lyfe691";
const PORTRAIT_PARTICLES = 120_000;
const PORTRAIT_PARTICLES_COARSE = 56_000;
const CONTRIBUTION_YEARS = [2026, 2025] as const;

type InterestKey = keyof Omit<Translation["about"]["interests"], "title">;
type ApproachKey = keyof Translation["about"]["philosophyLabels"];

const INTERESTS: ReadonlyArray<{ key: InterestKey; image: string }> = [
  { key: "nature", image: "/about/spring-japan.jpg" },
  { key: "tech", image: "/about/16.jpg" },
  { key: "learning", image: "/about/12.jpg" },
  { key: "workspace", image: "/about/sesh.jpg" },
];

const APPROACH_KEYS: readonly ApproachKey[] = [
  "clean",
  "simplicity",
  "learning",
];

// --------------------------------- Resume ---------------------------------

const getResumePath = (language: string) =>
  language === "de" ? "/sola_de.pdf" : "/sola_en.pdf";

const downloadResume = (language: string) => {
  const resumePath = getResumePath(language);
  const fileName =
    language === "de"
      ? "Lebenslauf_Yanis-Sebastian-Zürcher.pdf"
      : "Resume_Yanis-Sebastian-Zürcher.pdf";
  const link = document.createElement("a");
  link.href = resumePath;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const viewResume = (language: string) => {
  window.open(getResumePath(language), "_blank");
};

// --------------------------------- Shared ---------------------------------

function SectionHeading({
  children,
  trailing,
}: {
  children: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 md:mb-8">
      <h2 className="text-2xl font-bold tracking-tight">{children}</h2>
      {trailing}
    </div>
  );
}

/** Soft matte frame — quiet ring + inset pad, not a hard 1px crop edge. */
function MediaFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-foreground/[0.03] p-1.5 shadow-xs ring-1 ring-foreground/10",
        className,
      )}
    >
      {children}
    </div>
  );
}

const MEDIA_INNER =
  "size-full overflow-hidden rounded-[0.875rem] bg-muted/20";

// -------------------------------- Portrait --------------------------------

function AboutPortrait({ src, alt }: { src: string; alt: string }) {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const particleCount = isMobile
    ? PORTRAIT_PARTICLES_COARSE
    : PORTRAIT_PARTICLES;

  return (
    <MediaFrame>
      <div className={cn("relative aspect-[4/5] sm:aspect-square", MEDIA_INNER)}>
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 size-full object-cover"
          decoding="async"
        />
        {!reduceMotion && (
          <Suspense fallback={null}>
            <ParticleImage
              imageUrl={src}
              width="100%"
              height="100%"
              particleCount={particleCount}
              particleSize={2}
              particleOpacity={0.7}
              speed={0.85}
              noiseScale={0.0035}
              noiseStrength={0.03}
              damping={0.985}
              lifespan={450}
              showImage={false}
              backgroundColor="transparent"
              cursorInteraction
              cursorStrength={0.12}
              cursorRadius={100}
              dpr={isMobile ? 1.15 : 1.5}
              className="absolute inset-0 size-full"
            />
          </Suspense>
        )}
      </div>
    </MediaFrame>
  );
}

// -------------------------------- Resume UI --------------------------------

function ResumeModal() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();
  const t = translations[language].about.resume;
  const [selectedLang, setSelectedLang] = useState<"en" | "de">(
    language === "de" ? "de" : "en",
  );

  const close = () => setOpen(false);

  const languagePicker = (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium">{t.languageLabel}</span>
      <ToggleGroup
        value={[selectedLang]}
        onValueChange={(value) =>
          value[0] && setSelectedLang(value[0] as "en" | "de")
        }
        variant="outline"
        size="sm"
      >
        <ToggleGroupItem value="en">EN</ToggleGroupItem>
        <ToggleGroupItem value="de">DE</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );

  const actions = (
    <>
      <Button
        onClick={() => {
          viewResume(selectedLang);
          close();
        }}
      >
        {t.viewButton}
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          downloadResume(selectedLang);
          close();
        }}
      >
        {t.downloadButton}
      </Button>
    </>
  );

  const trigger = (
    <IconButton
      variant="default"
      size="lg"
      className="w-full border-foreground/20 sm:w-auto"
      icon={<Download className="size-4" />}
      iconPosition="left"
      label={t.buttonLabel}
      onClick={() => setOpen(true)}
    />
  );

  if (isMobile) {
    return (
      <>
        {trigger}
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{t.title}</DrawerTitle>
              <DrawerDescription>
                <RichText text={t.description} />
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4">{languagePicker}</div>
            <DrawerFooter>{actions}</DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <>
      {trigger}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader className="pr-8">
            <DialogTitle>{t.title}</DialogTitle>
            <DialogDescription>
              <RichText text={t.description} />
            </DialogDescription>
          </DialogHeader>
          {languagePicker}
          <DialogFooter className="sm:flex-col">{actions}</DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// -------------------------------- Sections --------------------------------

function ApproachPanel({
  title,
  items,
}: {
  title: string;
  items: ReadonlyArray<{ label: string; text: string }>;
}) {
  return (
    <section className="mb-10">
      <SectionHeading>{title}</SectionHeading>
      <div
        className={cn(
          "grid overflow-hidden rounded-2xl border border-foreground/12",
          "bg-linear-to-b from-foreground/[0.04] to-transparent",
          "divide-y divide-foreground/10",
          "sm:grid-cols-3 sm:divide-x sm:divide-y-0",
        )}
      >
        {items.map(({ label, text }) => (
          <div
            key={label}
            className={cn(
              "flex flex-col gap-3 p-6 sm:min-h-[11.5rem] sm:p-7 lg:gap-4 lg:p-8",
              "transition-colors duration-200 can-hover:hover:bg-foreground/[0.04]",
            )}
          >
            <h3 className="text-base font-semibold tracking-tight sm:text-lg">
              {label}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
              <RichText text={text} />
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// -------------------------------- Page --------------------------------

const About = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const about = t.about;
  const { theme } = useTheme();
  const [contributionTab, setContributionTab] = useState("last");
  const queryClient = useQueryClient();
  const isDark = getThemeType(theme) === "dark";

  const contributionTabs = [
    { value: "last", label: about.github.overview, year: "last" as const },
    ...CONTRIBUTION_YEARS.map((year) => ({
      value: String(year),
      label: String(year),
      year,
    })),
  ];

  const selectedContributionYear =
    contributionTab === "last"
      ? "last"
      : (Number(contributionTab) as (typeof CONTRIBUTION_YEARS)[number]);

  const approachItems = APPROACH_KEYS.map((key) => ({
    label: about.philosophyLabels[key],
    text: about.philosophy[key],
  }));

  useEffect(() => {
    void queryClient.prefetchQuery(
      githubContributionsQuery(GITHUB_USER, "last"),
    );
    for (const year of CONTRIBUTION_YEARS) {
      void queryClient.prefetchQuery(
        githubContributionsQuery(GITHUB_USER, year),
      );
    }
    void queryClient.prefetchQuery(userActivityQuery(GITHUB_USER));
  }, [queryClient]);

  return (
    <div className="flex w-full flex-col">
      <meta name="description" content={t.seo.about.description} />

      <ScrollReveal variant="pageTitle">
        <h1 className="mb-8 text-4xl font-bold sm:mb-12">{about.title}</h1>
      </ScrollReveal>

      <ScrollReveal variant="default">
        <div className="mb-16 grid grid-cols-1 items-start gap-10 md:mb-24 md:grid-cols-12">
          <div className="flex flex-col gap-5 md:col-span-7">
            <p className="max-w-xl text-base leading-relaxed text-foreground/75 sm:text-lg">
              <RichText text={about.intro} previewExternal />
            </p>
            <p className="max-w-xl text-base leading-relaxed text-foreground/75 sm:text-lg">
              <RichText text={about.hobbies} previewExternal />
            </p>
            <div className="pt-1">
              <ResumeModal />
            </div>
          </div>
          <div className="md:col-span-5">
            <AboutPortrait
              src={isDark ? "/ysz-d.webp" : "/ysz-l.webp"}
              alt="Yanis Sebastian Zürcher"
            />
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal variant="default">
        <section className="mb-16 md:mb-20">
          <SectionHeading
            trailing={
              <LinkPreview
                href={`https://github.com/${GITHUB_USER}`}
                className="pb-0.5 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                @{GITHUB_USER}
              </LinkPreview>
            }
          >
            {about.github.title}
          </SectionHeading>

          <Card className="gap-0 overflow-hidden bg-card/40 p-0 backdrop-blur-md">
            <Tabs
              value={contributionTab}
              onValueChange={setContributionTab}
              className="gap-0"
            >
              <div className="border-b border-foreground/8 px-4 py-3">
                <TabsList className="h-8">
                  {contributionTabs.map(({ value, label }) => (
                    <TabsTrigger
                      key={value}
                      value={value}
                      className="px-3 text-xs"
                    >
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              <TabsContent
                value={contributionTab}
                className="mt-0 overflow-hidden p-4 sm:p-5"
              >
                <GitHubContributionCalendar year={selectedContributionYear} />
              </TabsContent>
            </Tabs>
          </Card>

          <ContributionActivityFeed />
        </section>
      </ScrollReveal>

      <ScrollReveal variant="default">
        <section className="mb-16 md:mb-20">
          <SectionHeading>{about.interests.title}</SectionHeading>
          <ul className="flex flex-col">
            {INTERESTS.map(({ key, image }) => {
              const item = about.interests[key];
              return (
                <li
                  key={key}
                  className="grid grid-cols-1 gap-5 border-t border-foreground/8 py-8 first:border-t-0 first:pt-0 sm:grid-cols-12 sm:gap-8 sm:py-10"
                >
                  <MediaFrame className="sm:col-span-4">
                    <img
                      src={image}
                      alt=""
                      loading="lazy"
                      className={cn(
                        "aspect-[4/3] object-cover sm:aspect-[5/4]",
                        MEDIA_INNER,
                      )}
                    />
                  </MediaFrame>
                  <div className="flex flex-col justify-center gap-2 sm:col-span-8">
                    <h3 className="text-base font-medium sm:text-lg">
                      {item.title}
                    </h3>
                    <p className="max-w-prose text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                      {item.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="default">
        <section className="mb-16 md:mb-20">
          <SectionHeading
            trailing={
              <Link
                to="/contact"
                className="group inline-flex items-center gap-1 pb-0.5 text-sm text-muted-foreground transition-colors duration-300 ease-out hover:text-primary"
              >
                <span className="border-b border-dotted border-foreground/20 transition-colors duration-300 group-hover:border-primary">
                  {about.testimonials.link}
                </span>
                <ChevronRight
                  aria-hidden
                  className="size-3.5 shrink-0 transition-transform duration-300 ease-out can-hover:group-hover:translate-x-0.5"
                />
              </Link>
            }
          >
            {about.testimonials.title}
          </SectionHeading>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => {
              const copy = about.testimonials.items[testimonial.i18nKey];
              return (
                <TestimonialCard
                  key={testimonial.i18nKey}
                  quote={copy.quote}
                  author={testimonial.author}
                  role={copy.role}
                  company={testimonial.company}
                  rating={testimonial.rating}
                  website={testimonial.website}
                  linkedin={testimonial.linkedin}
                />
              );
            })}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="default">
        <ApproachPanel title={about.philosophy.title} items={approachItems} />
      </ScrollReveal>
    </div>
  );
};

export default About;
