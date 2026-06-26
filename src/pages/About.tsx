/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import React, { useState, useEffect } from "react";
import {
  Book,
  Code2,
  Coffee,
  Laptop,
  Mountain,
  Download,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/theme-provider";
import { getThemeType } from "@/config/themes";
import { Helmet } from "react-helmet-async";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import type { ProcessedActivity } from "@/lib/github";
import { getUserActivity } from "@/lib/github";
import ContributionActivityFeed from "@/components/ContributionActivityFeed";
import GitHubContributionCalendar from "@/components/github/GitHubContributionCalendar";
import { fetchGitHubContributions } from "@/lib/github-contributions";
import { IconButton } from "@/components/ui/custom/icon-button";
import ScrollReveal from "@/components/ScrollReveal";
import { RichText } from "@/components/i18n/RichText";
import { LinkPreview } from "@/components/ui/custom/link-preview";
import TestimonialCard from "@/components/testimonials/TestimonialCard";

// --------------------------------- Helpers ---------------------------------

const getResumePath = (language: string) => {
  return language === "de" ? "/sola_de.pdf" : "/sola_en.pdf";
};

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
  const resumePath = getResumePath(language);
  window.open(resumePath, "_blank");
};

// -------------------------------- Components --------------------------------

type InterestCardProps = {
  title: string;
  description: string;
  icon: React.ElementType;
  image: string;
};

const InterestCard = ({
  title,
  description,
  icon: Icon,
  image,
}: InterestCardProps) => (
  <Card className="group gap-0 overflow-hidden bg-card/40 p-0 backdrop-blur-md transition-shadow duration-300 hover:shadow-lg">
    <div className="relative h-36 overflow-hidden">
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-200 ease-out can-hover:group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />
    </div>

    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-center gap-2">
        <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
          <Icon className="size-3.5 text-primary" />
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-sm leading-relaxed text-foreground/70">
        {description}
      </p>
    </div>
  </Card>
);

// resume modal, use drawer for mobile
const ResumeModal = () => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];
  const [selectedLang, setSelectedLang] = useState<"en" | "de">(
    language === "de" ? "de" : "en",
  );

  const languagePicker = (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium">
        {t.about.resume.languageLabel}
      </span>
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
          setOpen(false);
        }}
      >
        {t.about.resume.viewButton}
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          downloadResume(selectedLang);
          setOpen(false);
        }}
      >
        {t.about.resume.downloadButton}
      </Button>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <IconButton
            variant="default"
            size="lg"
            className="w-1/2 border-foreground/20"
            icon={<Download className="w-4 h-4" />}
            iconPosition="left"
            label={t.about.resume.buttonLabel}
            onClick={() => setOpen(true)}
          />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{t.about.resume.title}</DrawerTitle>
            <DrawerDescription>
              <RichText text={t.about.resume.description} />
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4">{languagePicker}</div>
          <DrawerFooter>{actions}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <IconButton
            variant="default"
            size="lg"
            className="w-1/3 border-foreground/20"
            icon={<Download className="w-4 h-4" />}
            iconPosition="left"
            label={t.about.resume.buttonLabel}
            onClick={() => setOpen(true)}
          />
        }
      />
      <DialogContent>
        {/* pr-8 keeps longer locales clear of the absolute close button */}
        <DialogHeader className="pr-8">
          <DialogTitle>{t.about.resume.title}</DialogTitle>
          <DialogDescription>
            <RichText text={t.about.resume.description} />
          </DialogDescription>
        </DialogHeader>
        {languagePicker}
        <DialogFooter className="sm:flex-col">{actions}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// render

const About = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const { theme } = useTheme();
  const [contributionTab, setContributionTab] = useState("last");
  const [activity, setActivity] = useState<ProcessedActivity[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  const contributionYears = [2026, 2025] as const;
  const contributionTabs = [
    { value: "last", label: t.about.github.overview, year: "last" as const },
    ...contributionYears.map((year) => ({
      value: String(year),
      label: String(year),
      year,
    })),
  ];
  const selectedContributionYear =
    contributionTab === "last"
      ? "last"
      : (Number(contributionTab) as (typeof contributionYears)[number]);

  useEffect(() => {
    void Promise.all([
      fetchGitHubContributions("lyfe691", "last"),
      ...contributionYears.map((year) =>
        fetchGitHubContributions("lyfe691", year),
      ),
    ]);
  }, []);

  // testimonials - untranslatable due to respective copyrights
  const testimonials = [
    {
      quote:
        "Yanis carried me through every Software Engineering (IT) subject—I genuinely did next to nothing. His technical skills, reliability, and problem-solving were on another level. A truly exceptional developer and teammate.",
      author: "Dominik Könitzer",
      role: "Intern",
      company: "mpa international ag",
      rating: 5,
      website: "https://dominikkoenitzer.ch",
    },
    {
      quote:
        "Working with Yanis was a fantastic experience. He carried me through every subject, consistently bringing creative solutions to complex problems and delivering everything on time. Truly an exceptional developer.",
      author: "Jason Bichsel",
      role: "Student",
      company: "WISS",
      rating: 5,
      website: "https://jasonbichsel.com",
      linkedin: "https://linkedin.com/in/jason-bichsel",
    },
    {
      quote:
        "Yanis has a rare combination of technical skill and design sensibility. The WISS Forum he created for us exceeded all expectations and has significantly improved our online presence.",
      author: "Patrick Venzin",
      role: "Teacher",
      company: "WISS",
      rating: 5,
      linkedin: "https://linkedin.com/in/patrick-venzin-68314a100",
    },
  ];

  useEffect(() => {
    const fetchAllData = async () => {
      setLoadingActivity(true);
      const activityResult = await getUserActivity("lyfe691");
      setActivity(activityResult);
      setLoadingActivity(false);
    };

    fetchAllData();
  }, []);

  // automatically determine if current theme is dark - handles ALL themes dynamically
  const isDarkTheme = () => getThemeType(theme) === "dark";

  const interestImages = {
    nature: "/about/spring-japan.jpg",
    tech: "/about/16.jpg",
    learning: "/about/12.jpg",
    workspace: "/about/sesh.jpg",
  } as const;

  const approach = [
    {
      icon: Code2,
      label: t.about.philosophyLabels.clean,
      text: t.about.philosophy.clean,
    },
    {
      icon: Coffee,
      label: t.about.philosophyLabels.simplicity,
      text: t.about.philosophy.simplicity,
    },
    {
      icon: Book,
      label: t.about.philosophyLabels.learning,
      text: t.about.philosophy.learning,
    },
  ];

  return (
    <div className="flex flex-col w-full">
      <Helmet>
        <title>{t.seo.about.title}</title>
        <meta name="description" content={t.seo.about.description} />
      </Helmet>

      {/* ------------------- Title ------------------- */}

      <ScrollReveal variant="pageTitle">
        <h1 className="text-4xl font-bold mb-8 sm:mb-12">{t.about.title}</h1>
      </ScrollReveal>

      {/* ------------------- Hero ------------------- */}

      <ScrollReveal variant="default">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-16 md:mb-24">
          <div className="md:col-span-3 space-y-5">
            <p className="text-lg text-foreground/80 leading-relaxed">
              <RichText text={t.about.intro} previewExternal />
            </p>
            <p className="text-lg text-foreground/80 leading-relaxed">
              <RichText text={t.about.hobbies} previewExternal />
            </p>

            {/* ----------- Resume Button ---------- */}

            <div className="pt-5">
              <ResumeModal />
            </div>
          </div>

          {/* ------------------ Portrait ------------------ */}

          <div className="md:col-span-2 relative">
            <div className="aspect-square overflow-hidden rounded-xl border-2 border-border shadow-xs">
              <img
                src={isDarkTheme() ? "/ysz-d.webp" : "/ysz-l.webp"}
                alt="Yanis Sebastian Zürcher"
                className="w-full h-full object-cover transition-transform duration-200 ease-out can-hover:scale-[1.02]"
              />
            </div>
            <div className="absolute -z-10 -bottom-3 -right-3 w-full h-full bg-primary/5 rounded-xl -rotate-2" />
          </div>
        </div>
      </ScrollReveal>

      {/* ------------------- GitHub Activity ------------------ */}
      <ScrollReveal variant="default">
        <div className="mb-16 md:mb-20">
          <div className="flex items-center justify-between mb-6 md:mb-8 pb-2 border-b border-foreground/10">
            <h2 className="text-2xl font-bold">{t.about.github.title}</h2>
            <LinkPreview
              href="https://github.com/lyfe691"
              className="text-sm text-foreground/70 hover:text-primary transition-colors"
            >
              @lyfe691
            </LinkPreview>
          </div>

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

          {loadingActivity ? (
            <Skeleton className="mt-6 h-48 rounded-xl" />
          ) : (
            <ContributionActivityFeed events={activity} />
          )}
        </div>
      </ScrollReveal>

      {/* ------------------- Interests ------------------ */}

      <ScrollReveal variant="default">
        <div className="mb-16 md:mb-20">
          <h2 className="text-2xl font-bold mb-6 md:mb-8 pb-2 border-b border-foreground/10">
            {t.about.interests.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InterestCard
              title={t.about.interests.nature.title}
              description={t.about.interests.nature.description}
              icon={Mountain}
              image={interestImages.nature}
            />
            <InterestCard
              title={t.about.interests.tech.title}
              description={t.about.interests.tech.description}
              icon={Code2}
              image={interestImages.tech}
            />
            <InterestCard
              title={t.about.interests.learning.title}
              description={t.about.interests.learning.description}
              icon={Book}
              image={interestImages.learning}
            />
            <InterestCard
              title={t.about.interests.workspace.title}
              description={t.about.interests.workspace.description}
              icon={Laptop}
              image={interestImages.workspace}
            />
          </div>
        </div>
      </ScrollReveal>

      {/* ------------------- Testimonials ------------------ */}
      <ScrollReveal variant="default">
        <div className="mb-16 md:mb-20">
          <div className="flex items-center justify-between mb-6 md:mb-8 pb-2 border-b border-foreground/10">
            <h2 className="text-2xl font-bold">{t.about.testimonials.title}</h2>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-1 text-sm text-foreground/50 transition-colors duration-300 ease-out hover:text-primary"
            >
              <span className="border-b border-dotted border-foreground/20 transition-colors duration-300 group-hover:border-primary">
                {t.about.testimonials.link}
              </span>
              <ChevronRight
                aria-hidden
                className="size-3.5 shrink-0 transition-transform duration-300 ease-out can-hover:group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                quote={testimonial.quote}
                author={testimonial.author}
                role={testimonial.role}
                company={testimonial.company}
                rating={testimonial.rating}
                website={testimonial.website}
                linkedin={testimonial.linkedin}
              />
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* ------------------- Philosophy ----------------- */}

      <ScrollReveal variant="default">
        <Card className="mb-10 bg-linear-to-br from-foreground/5 to-card p-6 md:p-8">
          <h2 className="text-xl font-bold">{t.about.philosophy.title}</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {approach.map(({ icon: Icon, label, text }) => (
              <div key={label} className="space-y-2">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{label}</h3>
                <p className="text-sm leading-relaxed text-foreground/80">
                  <RichText text={text} />
                </p>
              </div>
            ))}
          </div>
        </Card>
      </ScrollReveal>
    </div>
  );
};

export default About;
