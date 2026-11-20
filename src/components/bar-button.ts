/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

/**
 * How a button in the site's bar is drawn: bare inside the desktop bar, a
 * glass circle of its own where it floats over the page (the phone's bar).
 */
export const barButton = (floating?: boolean) =>
  floating
    ? ({ variant: "glass", size: "icon-lg" } as const)
    : ({ variant: "ghost", size: "icon" } as const);
