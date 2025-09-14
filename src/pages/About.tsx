/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Book, Code2, Coffee, Laptop, Linkedin, Mountain, Download, Quote, Star, Globe, MoveRight } from 'lucide-react';
import { FaGithubAlt } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useLanguage } from "@/lib/language-provider";
import { translations, type Translation } from "@/lib/translations";
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from "@/components/theme-provider";
import { getThemeType } from "@/config/themes";
import { Helmet } from "react-helmet-async";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription
} from "@/components/ui/drawer";
import GitHubCalendar from 'react-github-calendar';
import type { ProcessedActivity } from '@/lib/github';
import { getUserActivity } from '@/lib/github';
import ContributionActivityFeed from '@/components/ContributionActivityFeed';
import { IconButton } from '@/components/ui/custom/IconButton';
import ScrollReveal from '@/components/ScrollReveal';
import { RichText } from '@/components/i18n/RichText';
import { LinkPreview } from '@/components/ui/link-preview';

// --------------------------------- Helpers ---------------------------------

const getResumePath = (language: string) => {
  return language === 'de' ? '/sola_de.pdf' : '/sola_en.pdf';
};

const downloadResume = (language: string) => {
  const resumePath = getResumePath(language);
  const fileName = language === 'de' 
    ? 'Lebenslauf_Yanis-Sebastian-Zürcher.pdf' 
    : 'Resume_Yanis-Sebastian-Zürcher.pdf';
  
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

const InterestCard = ({ title, description, icon: Icon, image }: InterestCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <motion.div
      className="group rounded-xl border border-foreground/10 overflow-hidden relative"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="h-36 overflow-hidden relative">
        <motion.img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
          initial={{ scale: 1 }}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
            <Icon className="w-3.5 h-3.5 text-primary" />
          </div>
          <h3 className="font-medium">{title}</h3>
        </div>
        <p className="text-foreground/70 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

type TestimonialProps = {
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
  rating?: number;
  website?: string;
  linkedin?: string;
};

const TestimonialCard = ({ quote, author, role, company, avatar, rating = 5, website, linkedin }: TestimonialProps) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();
  const t = translations[language] as Translation;
  const MAX_QUOTE_LENGTH = 120;
  const isLongQuote = quote.length > MAX_QUOTE_LENGTH;
  const truncatedQuote = isLongQuote ? quote.slice(0, MAX_QUOTE_LENGTH) + '...' : quote;
  
  const fullTestimonialContent = (
    <div className="space-y-4">
      {/* stars */}
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-foreground/20'
            }`}
          />
        ))}
      </div>
      
      {/* full quote */}
      <blockquote className="text-foreground/80 leading-relaxed italic text-base">
        "{quote}"
      </blockquote>
      
      {/* author info */}
      <div className="pt-4 border-t border-foreground/10 space-y-4">
        <div className="flex items-start gap-4">
          {avatar ? (
            <img
              src={avatar}
              alt={author}
              className="w-14 h-14 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-medium text-primary">
                {author.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
          <div className="flex-1">
            <p className="font-medium text-base">{author}</p>
            <p className="text-sm text-foreground/60 mb-3">
              {role}{company && ` at ${company}`}
            </p>
            
            {/* links */}
            {(website || linkedin) && (
              <div className="flex flex-wrap gap-2">
                {website && (
                  <LinkPreview href={website} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-sm bg-foreground/5 hover:bg-foreground/10 rounded-md transition-colors">
                    <Globe className="w-3.5 h-3.5" />
                    {t.about.testimonials.visitWebsite}
                  </LinkPreview>
                )}
                {linkedin && (
                  <LinkPreview href={linkedin} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-sm bg-foreground/5 hover:bg-foreground/10 rounded-md transition-colors">
                    <Linkedin className="w-3.5 h-3.5" />
                    {t.about.testimonials.viewLinkedIn}
                  </LinkPreview>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const cardContent = (
    <motion.div
      className="group rounded-xl border border-foreground/10 bg-background/50 backdrop-blur-sm p-6 space-y-4 relative overflow-hidden h-full flex flex-col"
    >
      {/* quote icon */}
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
        <Quote className="w-4 h-4 text-primary" />
      </div>
      
      {/* stars */}
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-foreground/20'
            }`}
          />
        ))}
      </div>
      
      {/* quote with truncation */}
      <div className="flex-1">
        <blockquote className="text-foreground/80 leading-relaxed italic">
          "{truncatedQuote}"
        </blockquote>
        {isLongQuote && (
          <button
            onClick={() => setOpen(true)}
            className="text-primary hover:text-primary/80 text-sm mt-2 transition-colors"
          >
            {t.about.testimonials.viewMore}
          </button>
        )}
      </div>
      
      {/* author - always at bottom */}
      <div className="pt-3 border-t border-foreground/10 mt-auto space-y-3">
        <div className="flex items-start gap-3">
          {avatar ? (
            <img
              src={avatar}
              alt={author}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-primary">
                {author.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{author}</p>
            <p className="text-xs text-foreground/60">
              {role}{company && ` at ${company}`}
            </p>
            
            {/* social links (card only - no hover preview) */}
            {(website || linkedin) && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {website && (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-foreground/5 hover:bg-foreground/10 rounded transition-colors"
                  >
                    <Globe className="w-2.5 h-2.5" />
                    Website
                  </a>
                )}
                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-foreground/5 hover:bg-foreground/10 rounded transition-colors"
                  >
                    <Linkedin className="w-2.5 h-2.5" />
                    LinkedIn
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* subtle background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
    </motion.div>
  );

  if (!isLongQuote) {
    return cardContent;
  }

  if (isMobile) {
    return (
      <>
        {cardContent}
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="px-4 pb-4">
            <DrawerHeader className="text-left px-0">
              <DrawerTitle>{t.about.testimonials.modalTitle}</DrawerTitle>
              <DrawerDescription>
                <RichText text={t.about.testimonials.modalDescription} values={{ author }} />
              </DrawerDescription>
            </DrawerHeader>
            {fullTestimonialContent}
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <>
      {cardContent}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="pb-2">
            <DialogTitle>{t.about.testimonials.modalTitle}</DialogTitle>
            <DialogDescription>
              <RichText text={t.about.testimonials.modalDescription} values={{ author }} />
            </DialogDescription>
          </DialogHeader>
          {fullTestimonialContent}
        </DialogContent>
      </Dialog>
    </>
  );
};

// resume modal, use drawer for mobile
const ResumeModal = () => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];
  const [selectedLang, setSelectedLang] = useState<'en' | 'de'>(language === 'de' ? 'de' : 'en');

  const content = (
    <>
      <div className="pb-2">
        <h3 className="text-lg font-semibold mb-2">{t.about.resume.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <RichText text={t.about.resume.description} previewExternal/>
        </p>
      </div>

        {/* language selection */}
        <div className="py-4 border-y border-foreground/10">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t.about.resume.languageLabel}</span>
          <ToggleGroup
            type="single"
            value={selectedLang}
            onValueChange={(value) => value && setSelectedLang(value as 'en' | 'de')}
            variant="outline"
            size="sm"
          >
            <ToggleGroupItem value="en" className="px-3 py-1 h-7 text-xs">
              EN
            </ToggleGroupItem>
            <ToggleGroupItem value="de" className="px-3 py-1 h-7 text-xs">
              DE
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <Button variant="outline" size="sm" onClick={() => { viewResume(selectedLang); setOpen(false); }}>
          {t.about.resume.viewButton}
        </Button>
        <Button variant="secondary" size="sm" onClick={() => { downloadResume(selectedLang); setOpen(false); }}>
          {t.about.resume.downloadButton}
        </Button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <IconButton
           variant="default"
           size="lg" 
           className="border-foreground/20 w-full" 
           icon={<Download className="w-4 h-4" />} 
           iconPosition='left' 
            label={t.about.resume.buttonLabel}
           onClick={() => setOpen(true)}
           />
        </DrawerTrigger>
        <DrawerContent className="px-4 pb-4">
          <DrawerHeader className="text-left px-0">
            <DrawerTitle>{t.about.resume.title}</DrawerTitle>
            <DrawerDescription>
              <RichText text={t.about.resume.description} />
            </DrawerDescription>
          </DrawerHeader>
          
          {/* language selection */}
          <div className="py-4 border-y border-foreground/10 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t.about.resume.languageLabel}</span>
              <ToggleGroup
                type="single"
                value={selectedLang}
                onValueChange={(value) => value && setSelectedLang(value as 'en' | 'de')}
                variant="outline"
                size="sm"
              >
                <ToggleGroupItem value="en" className="px-3 py-1 h-7 text-xs">
                  EN
                </ToggleGroupItem>
                <ToggleGroupItem value="de" className="px-3 py-1 h-7 text-xs">
                  DE
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button variant="outline" size="sm" onClick={() => { viewResume(selectedLang); setOpen(false); }}>
              {t.about.resume.viewButton}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => { downloadResume(selectedLang); setOpen(false); }}>
              {t.about.resume.downloadButton}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <IconButton 
          variant="default" 
          size="lg" 
          className="border-foreground/20 w-1/3"
          icon={<Download className="w-4 h-4" />} 
          iconPosition='left' 
          label={t.about.resume.buttonLabel}
          onClick={() => setOpen(true)}
        />
      </DialogTrigger>
              <DialogContent className="max-w-md">
          <DialogHeader className="pb-2">
            <DialogTitle>{t.about.resume.title}</DialogTitle>
            <DialogDescription>
              <RichText text={t.about.resume.description} />
            </DialogDescription>
          </DialogHeader>

        {/* language selection */}
        <div className="py-4 border-y border-foreground/10">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t.about.resume.languageLabel}</span>
            <ToggleGroup
              type="single"
              value={selectedLang}
              onValueChange={(value) => value && setSelectedLang(value as 'en' | 'de')}
              variant="outline"
              size="sm"
            >
              <ToggleGroupItem value="en" className="px-3 py-1 h-7 text-xs">
                EN
              </ToggleGroupItem>
              <ToggleGroupItem value="de" className="px-3 py-1 h-7 text-xs">
                DE
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button variant="outline" size="sm" onClick={() => { viewResume(selectedLang); setOpen(false); }}>
            {t.about.resume.viewButton}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => { downloadResume(selectedLang); setOpen(false); }}>
            {t.about.resume.downloadButton}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// render

const About = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [selectedYear, setSelectedYear] = useState<number | 'last'>('last');
  const [activity, setActivity] = useState<ProcessedActivity[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  const years = [2025, 2024];

  // testimonials - untranslatable due to respective copyrights
  const testimonials = [
    {
      quote: "Yanis carried me through every subject—I genuinely did next to nothing. His technical skills, reliability, and problem-solving were on another level. A truly exceptional developer and teammate.",
      author: "Dominik Könitzer",
      role: "Intern",
      company: "mpa international ag",
      rating: 5,
      website: "https://dominikkoenitzer.ch",
      linkedin: "https://linkedin.com/in/dominikkoenitzer"
    },
    {
      quote: "Working with Yanis was a fantastic experience. He carried me through every subject, consistently bringing creative solutions to complex problems and delivering everything on time. Truly an exceptional developer.",
      author: "Jason Bichsel",
      role: "Student",
      company: "WISS",
      rating: 5,
      website: "https://jasonbichsel.com",
      linkedin: "https://linkedin.com/in/jason-bichsel"
    },
    {
      quote: "Yanis has a rare combination of technical skill and design sensibility. The WISS Forum he created for us exceeded all expectations and has significantly improved our online presence.",
      author: "Patrick Venzin",
      role: "Teacher",
      company: "WISS",
      rating: 5,
      linkedin: "https://linkedin.com/in/patrick-venzin-68314a100"
    }
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
  const isDarkTheme = () => getThemeType(theme) === 'dark';

  const interestImages = {
    nature: '/about/spring-japan.jpg',
    tech: '/about/16.jpg',
    learning: '/about/12.jpg',
    workspace: '/about/sesh.jpg',
  } as const;

  return (
    <div className="flex flex-col w-full">
      <Helmet>
        <title>{t.seo.about.title}</title>
        <meta name="description" content={t.seo.about.description} />
      </Helmet>

      {/* ------------------- Title ------------------- */}

      <ScrollReveal variant="pageTitle">
        <h1 className="text-4xl font-bold mb-8 sm:mb-12">
          {t.about.title}
        </h1>
      </ScrollReveal>

      {/* ------------------- Hero ------------------- */}

      <ScrollReveal variant="default">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-16 md:mb-24">
            <div className="md:col-span-3 space-y-5">
              <p className="text-lg text-foreground/80 leading-relaxed"><RichText text={t.about.intro} previewExternal /></p>
              <p className="text-lg text-foreground/80 leading-relaxed"><RichText text={t.about.hobbies} previewExternal /></p>

              {/* ----------- Resume Button ---------- */}

              <div className="flex flex-row items-center gap-3 pt-5">
                <ResumeModal />
              </div>
            </div>

            {/* ------------------ Portrait ------------------ */}

            <div className="md:col-span-2 relative">
              <div className="aspect-square overflow-hidden rounded-xl border border-foreground/10 shadow-sm">
                <motion.img
                  src={isDarkTheme() ? '/ysz-d.png' : '/ysz-l.png'}
                  alt="Yanis Sebastian Zürcher"
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
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
                <h2 className="text-2xl font-bold">
                {t.about.github.title}
                </h2>
                <LinkPreview href="https://github.com/lyfe691" className='text-sm text-foreground/70 hover:text-primary transition-colors'>
                  @lyfe691
                </LinkPreview>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6">
                <div className='flex flex-col gap-2'>
                    <Button 
                        variant={selectedYear === 'last' ? 'default' : 'ghost'}
                        size='sm'
                        onClick={() => setSelectedYear('last')}
                        className='text-sm w-full justify-start'
                    >
                        {t.about.github.overview}
                    </Button>
                    {years.map(year => (
                        <Button 
                            key={year}
                            variant={selectedYear === year ? 'default' : 'ghost'}
                            size='sm'
                            onClick={() => setSelectedYear(year)}
                            className='text-sm w-full justify-start'
                        >
                            {year}
                        </Button>
                    ))}
                </div>
                <div className="rounded-xl border border-foreground/10 p-4">
                    <GitHubCalendar
                        username="lyfe691"
                        colorScheme={getThemeType(theme)}
                        fontSize={14}
                        year={selectedYear}
                    />
                </div>
            </div>

            {loadingActivity ? (
                <div className="border border-foreground/10 rounded-xl p-4 h-48 animate-pulse mt-6" />
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
              <h2 className="text-2xl font-bold">
                {t.about.testimonials.title}
              </h2>
              <Link 
                to="/contact" 
                className="text-sm text-foreground/70 hover:text-primary transition-colors"
              >
                {t.about.testimonials.link} <MoveRight className="w-4 h-4 inline-block" />  
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
        <div className="relative overflow-hidden rounded-xl border border-foreground/10 bg-gradient-to-br from-foreground/5 to-transparent p-6 md:p-8 mb-10">
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-6 md:mb-8">{t.about.philosophy.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Code2 className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{t.about.philosophyLabels.clean}</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed"><RichText text={t.about.philosophy.clean} /></p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Coffee className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{t.about.philosophyLabels.simplicity}</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed"><RichText text={t.about.philosophy.simplicity} /></p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Book className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{t.about.philosophyLabels.learning}</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed"><RichText text={t.about.philosophy.learning} /></p>
                </div>
              </div>
            </div>

          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
      </ScrollReveal>
    </div>
  );
};

export default About;
