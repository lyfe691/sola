﻿// by shadcn or tailwind labs

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string while properly handling Tailwind classes
 * 
 * This utility uses clsx to conditionally join classNames and twMerge to properly 
 * merge Tailwind CSS classes without conflicts
 * 
 * @param inputs - Any number of class values, objects, or arrays to be merged
 * @returns A string of merged and deduplicated class names
 * 
 * @example
 * // Returns "p-4 bg-blue-500 text-white rounded"
 * cn("p-4", { "bg-blue-500": true, "bg-red-500": false }, "text-white rounded")
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

