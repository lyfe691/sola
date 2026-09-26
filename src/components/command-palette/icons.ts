/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import {
  Briefcase01Icon,
  Certificate01Icon,
  CodeIcon,
  Folder01Icon,
  GitCommitIcon,
  HomeIcon,
  Layers01Icon,
  Mail01Icon,
  Message01Icon,
  PackageIcon,
  PaintBoardIcon,
  ServerStack01Icon,
  Shield01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

export const PAGE_ICONS: Record<string, IconSvgElement> = {
  "/": HomeIcon,
  "/about": UserIcon,
  "/experience": Briefcase01Icon,
  "/projects": Folder01Icon,
  "/skills": CodeIcon,
  "/services": PackageIcon,
  "/contact": Mail01Icon,
  "/privacy": Shield01Icon,
  "/certifications": Certificate01Icon,
  "/changelog": GitCommitIcon,
};

export const SERVICE_ICONS: Record<string, IconSvgElement> = {
  fullstack: Layers01Icon,
  frontend: PaintBoardIcon,
  backend: ServerStack01Icon,
  consulting: Message01Icon,
};
