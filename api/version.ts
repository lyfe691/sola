/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

type VercelResponse = {
  setHeader: (key: string, value: string) => void;
  status: (code: number) => { json: (body: object) => void };
};

export default function handler(_req: unknown, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.status(200).json({
    version: process.env.VERCEL_GIT_COMMIT_SHA ?? "dev",
  });
}