/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useState } from "react";
import { Globe, Linkedin, Quote, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/lib/language-provider";
import { translations, type Translation } from "@/lib/translations";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { RichText } from "@/components/i18n/RichText";
import { LinkPreview } from "@/components/ui/custom/link-preview";
import TestimonialAvatar from "@/components/testimonials/TestimonialAvatar";

const MAX_QUOTE_LENGTH = 120;

type TestimonialCardProps = {
  quote: string;
  author: string;
  role: string;
  company?: string;
  rating?: number;
  website?: string;
  linkedin?: string;
};

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`size-4 ${
          i < rating ? "fill-primary text-primary" : "text-foreground/20"
        }`}
      />
    ))}
  </div>
);

const AuthorLinks = ({
  website,
  linkedin,
  t,
  compact = false,
}: {
  website?: string;
  linkedin?: string;
  t: Translation;
  compact?: boolean;
}) => {
  if (!website && !linkedin) return null;

  if (compact) {
    return (
      <div className="mt-2 flex flex-wrap gap-1.5">
        {website ? (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded bg-foreground/5 px-1.5 py-0.5 text-xs transition-colors hover:bg-foreground/10"
          >
            <Globe className="size-2.5" />
            {t.about.testimonials.website}
          </a>
        ) : null}
        {linkedin ? (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded bg-foreground/5 px-1.5 py-0.5 text-xs transition-colors hover:bg-foreground/10"
          >
            <Linkedin className="size-2.5" />
            LinkedIn
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {website ? (
        <LinkPreview
          href={website}
          className="inline-flex items-center gap-1.5 rounded-md bg-foreground/5 px-2.5 py-1.5 text-sm transition-colors hover:bg-foreground/10"
        >
          <Globe className="size-3.5" />
          {t.about.testimonials.visitWebsite}
        </LinkPreview>
      ) : null}
      {linkedin ? (
        <LinkPreview
          href={linkedin}
          className="inline-flex items-center gap-1.5 rounded-md bg-foreground/5 px-2.5 py-1.5 text-sm transition-colors hover:bg-foreground/10"
        >
          <Linkedin className="size-3.5" />
          {t.about.testimonials.viewLinkedIn}
        </LinkPreview>
      ) : null}
    </div>
  );
};

const AuthorBlock = ({
  author,
  role,
  company,
  linkedin,
  t,
  avatarClassName,
  showLinks = false,
  compactLinks = false,
  website,
}: {
  author: string;
  role: string;
  company?: string;
  linkedin?: string;
  website?: string;
  t: Translation;
  avatarClassName: string;
  showLinks?: boolean;
  compactLinks?: boolean;
}) => (
  <div className="flex items-start gap-3 sm:gap-4">
    <TestimonialAvatar
      author={author}
      linkedin={linkedin}
      className={avatarClassName}
    />
    <div className="min-w-0 flex-1">
      <p className="font-medium text-sm sm:text-base">{author}</p>
      <p className="text-xs text-foreground/60 sm:mb-3 sm:text-sm">
        {company
          ? t.about.testimonials.roleAtCompany
              .replace("{role}", role)
              .replace("{company}", company)
          : role}
      </p>
      {showLinks ? (
        <AuthorLinks
          website={website}
          linkedin={linkedin}
          t={t}
          compact={compactLinks}
        />
      ) : null}
    </div>
  </div>
);

const TestimonialCard = ({
  quote,
  author,
  role,
  company,
  rating = 5,
  website,
  linkedin,
}: TestimonialCardProps) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();
  const t = translations[language] as Translation;

  const isLongQuote = quote.length > MAX_QUOTE_LENGTH;
  const truncatedQuote = isLongQuote
    ? `${quote.slice(0, MAX_QUOTE_LENGTH)}...`
    : quote;

  const fullTestimonialContent = (
    <div className="space-y-4">
      <StarRating rating={rating} />
      <blockquote className="text-base italic leading-relaxed text-foreground/80">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <div className="space-y-4 border-t border-foreground/10 pt-4">
        <AuthorBlock
          author={author}
          role={role}
          company={company}
          linkedin={linkedin}
          website={website}
          t={t}
          avatarClassName="size-14"
          showLinks
        />
      </div>
    </div>
  );

  const cardContent = (
    <Card className="group relative flex h-full flex-col gap-4 overflow-hidden bg-card/40 p-6 backdrop-blur-md">
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
        <Quote className="size-4 text-primary" />
      </div>

      <StarRating rating={rating} />

      <div className="flex-1">
        <blockquote className="italic leading-relaxed text-foreground/80">
          &ldquo;{truncatedQuote}&rdquo;
        </blockquote>
        {isLongQuote ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-2 text-sm text-primary transition-colors hover:text-primary/80"
          >
            {t.about.testimonials.viewMore}
          </button>
        ) : null}
      </div>

      <Separator className="mt-auto" />
      <div className="pt-3">
        <AuthorBlock
          author={author}
          role={role}
          company={company}
          linkedin={linkedin}
          website={website}
          t={t}
          avatarClassName="size-10"
          showLinks
          compactLinks
        />
      </div>

      <div className="absolute top-0 right-0 size-24 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 opacity-50" />
    </Card>
  );

  if (!isLongQuote) return cardContent;

  if (isMobile) {
    return (
      <>
        {cardContent}
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{t.about.testimonials.modalTitle}</DrawerTitle>
              <DrawerDescription>
                <RichText
                  text={t.about.testimonials.modalDescription}
                  values={{ author }}
                />
              </DrawerDescription>
            </DrawerHeader>
            <div className="overflow-y-auto px-4">{fullTestimonialContent}</div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <>
      {cardContent}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.about.testimonials.modalTitle}</DialogTitle>
            <DialogDescription>
              <RichText
                text={t.about.testimonials.modalDescription}
                values={{ author }}
              />
            </DialogDescription>
          </DialogHeader>
          {fullTestimonialContent}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TestimonialCard;
