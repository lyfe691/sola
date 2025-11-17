/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-provider";
import { translations, type Translation } from "@/lib/translations";
import { Link } from "react-router-dom";
import { Ghost } from "lucide-react";

const NotFound = () => {
  const { language } = useLanguage();
  const t = translations[language] as Translation;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-4 text-center text-foreground">
      <Helmet>
        <title>{t.seo.notFound.title}</title>
        <meta name="description" content={t.seo.notFound.description} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Ghost className="h-24 w-24 text-primary animate-bounce" />
      <h1 className="mt-6 text-5xl sm:text-6xl font-bold tracking-tight">404</h1>
      <p className="mt-4 text-muted-foreground max-w-md">
        {t.seo.notFound.description}
      </p>
      <Button asChild className="mt-8">
        <Link to="/">{t.notFound.backHome}</Link>
      </Button>
    </div>
  );
};

export default NotFound;

