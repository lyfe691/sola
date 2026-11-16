/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import {
  BriefcaseIcon,
  CertificateIcon,
  CodeSimpleIcon,
  EnvelopeSimpleIcon,
  FolderIcon,
  GitCommitIcon,
  HardDrivesIcon,
  HouseIcon,
  PackageIcon,
  PaletteIcon,
  ShieldIcon,
  StackIcon,
  UserIcon,
  type Icon,
} from "@phosphor-icons/react";

export const PAGE_ICONS: Record<string, Icon> = {
  "/": HouseIcon,
  "/about": UserIcon,
  "/experience": BriefcaseIcon,
  "/projects": FolderIcon,
  "/skills": CodeSimpleIcon,
  "/services": PackageIcon,
  "/contact": EnvelopeSimpleIcon,
  "/privacy": ShieldIcon,
  "/certifications": CertificateIcon,
  "/changelog": GitCommitIcon,
};

export const SERVICE_ICONS: Record<string, Icon> = {
  fullstack: StackIcon,
  frontend: PaletteIcon,
  backend: HardDrivesIcon,
};
