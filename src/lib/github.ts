/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary project and is governed by the terms in LICENSE.
 * Unauthorized use, modification, or distribution is prohibited. All rights reserved.
 * For permissions, contact yanis.sebastian.zuercher@gmail.com
 */

// REST API for activity feed
export interface GitHubEvent {
    type: string;
    repo: {
        name: string;
        url: string;
    };
    payload: {
        action?: string;
        ref_type?: string;
        pull_request?: {
            title: string;
            html_url: string;
        };
        commits?: Array<{
            sha: string;
            message: string;
        }>;
    };
    created_at: string;
}

export async function getUserActivity(username: string): Promise<GitHubEvent[]> {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json',
    };

    if (token) {
        headers['Authorization'] = `bearer ${token}`;
    }

    try {
        const response = await fetch(`https://api.github.com/users/${username}/events/public`, { headers });
        if (!response.ok) {
            console.error(`GitHub API responded with ${response.status}`);
            return [];
        }
        const data = await response.json();
        return data.slice(0, 15); // return the last 15 events
    } catch (error) {
        console.error("Failed to fetch user activity:", error);
        return [];
    }
} 