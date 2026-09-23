/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

/** A count in words from a locale's pair: `one`, or `many` with `{count}` filled in. */
export function countLabel(count: number, one: string, many: string): string {
  return count === 1 ? one : many.replace("{count}", String(count));
}
