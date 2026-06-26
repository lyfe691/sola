/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Vercel serverless entry for /api/github-activity.
 */

import { getGitHubActivity } from "../src/server/github-activity-handler";

type VercelRequest = { query: Record<string, string | string[] | undefined> };
type VercelResponse = {
  setHeader: (key: string, value: string) => void;
  status: (code: number) => { json: (body: unknown) => void };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const raw = req.query.username;
  const username = Array.isArray(raw) ? raw[0] : raw;
  if (!username) {
    res.status(400).json({ error: "username is required" });
    return;
  }

  try {
    const processed = await getGitHubActivity(username);
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600",
    );
    res.status(200).json(processed);
  } catch {
    res.status(400).json({ error: "username is required" });
  }
}