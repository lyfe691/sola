/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary project and is governed by the terms in LICENSE.
 * Unauthorized use, modification, or distribution is prohibited. All rights reserved.
 * For permissions, contact yanis.sebastian.zuercher@gmail.com
 */

import {
  Moon,
  Sun,
  Cloud,
  Sunset,
  Sprout,
  Slack,
  Trees,
  Infinity as InfinityIcon,
} from "lucide-react";
import { FaCube, FaGem, FaMoneyBillAlt } from "react-icons/fa";
import { } from "react-icons/si";
import { } from "react-icons/fa6";
import { } from "react-icons/cg"
import { BsBalloon } from "react-icons/bs"
import { } from "react-icons/io5"
import { } from "react-icons/io"
import { } from "react-icons/fa"
import { } from "react-icons/fi"
import { } from "react-icons/ri"
import { } from "react-icons/hi2"
import { } from "react-icons/hi"
import { } from "react-icons/vsc"

import type { ElementType } from 'react';

export interface ThemeConfig {
  value: string;
  label: string;
  icon: ElementType; // allows more icons rather than just lucide-react
  isCustom: boolean;
}

export const THEMES: ThemeConfig[] = [
  { value: "light", label: "Light", icon: Sun, isCustom: false },
  { value: "dark", label: "Dark", icon: Moon, isCustom: false },
  { value: "system", label: "System", icon: Sun, isCustom: false }, // sun/moon based on system
  { value: "life", label: "Solarpunk", icon: Sprout, isCustom: true },
  { value: "cyber", label: "Cyberpunk", icon: Slack, isCustom: true },
  { value: "cloud", label: "Cloud", icon: Cloud, isCustom: true },
  { value: "forest", label: "Forest", icon: Trees, isCustom: true },
  { value: "amethyst", label: "Amethyst", icon: FaGem, isCustom: true },
  { value: "vintage", label: "Vintage", icon: FaMoneyBillAlt, isCustom: true },
];

export const STANDARD_THEMES = THEMES.filter(theme => !theme.isCustom);
export const CUSTOM_THEMES = THEMES.filter(theme => theme.isCustom);

export const ALL_THEME_VALUES = THEMES.map(theme => theme.value);
export type Theme = typeof ALL_THEME_VALUES[number]; 