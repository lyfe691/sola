/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * react-router's Link, Navigate and useNavigate, kept in the reader's
 * language: a site path ("/about") goes to that page in the page's language
 * (/de/about). Import these instead of react-router's so a link can't drop
 * a reader back into English. The language comes from the provider: under
 * the routes, useLocation() is the path without its language
 * (AnimatedRoutes).
 */

import { useCallback } from "react";
import {
  Link as RouterLink,
  Navigate as RouterNavigate,
  useLocation,
  useNavigate as useRouterNavigate,
  type LinkProps,
  type NavigateOptions,
  type NavigateProps,
  type To,
} from "react-router";
import { useLanguage } from "./language-provider";
import { localizeTo, splitLocale } from "./locale";

/** The current page as the routes know it, and the language it is in. */
export function useLocalePath() {
  const { pathname } = useLocation();
  const { language } = useLanguage();
  return { language, path: splitLocale(pathname).path };
}

export function Link({ to, ...props }: LinkProps) {
  const { language } = useLanguage();
  return <RouterLink to={localizeTo(to, language)} {...props} />;
}

export function Navigate({ to, ...props }: NavigateProps) {
  const { language } = useLanguage();
  return <RouterNavigate to={localizeTo(to, language)} {...props} />;
}

export function useNavigate() {
  const navigate = useRouterNavigate();
  const { language } = useLanguage();
  return useCallback(
    (to: To | number, options?: NavigateOptions) =>
      typeof to === "number"
        ? navigate(to)
        : navigate(localizeTo(to, language), options),
    [navigate, language],
  );
}
