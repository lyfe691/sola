/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import React from 'react';
import type { GitHubEvent } from '@/lib/github';
import { GitCommit, GitPullRequest, GitBranchPlus, MoveRight } from 'lucide-react';

interface ContributionActivityFeedProps {
  events: GitHubEvent[];
}

const EventIcon = ({ eventType }: { eventType: string }) => {
    switch (eventType) {
        case 'PushEvent':
            return <GitCommit className="w-4 h-4 text-foreground/60" />;
        case 'PullRequestEvent':
            return <GitPullRequest className="w-4 h-4 text-foreground/60" />;
        case 'CreateEvent':
            return <GitBranchPlus className="w-4 h-4 text-foreground/60" />;
        default:
            return null;
    }
};

const ContributionActivityFeed: React.FC<ContributionActivityFeedProps> = ({ events }) => {

    const renderEvent = (event: GitHubEvent) => {
        const repoUrl = `https://github.com/${event.repo.name}`;
        switch (event.type) {
            case 'PushEvent':
                return (
                    <span>
                        Pushed {event.payload.commits?.length} commit(s) to{' '}
                        <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{event.repo.name}</a>
                    </span>
                );
            case 'PullRequestEvent':
                if (event.payload.action === 'opened') {
                    return (
                        <span>
                            Opened pull request in{' '}
                            <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{event.repo.name}</a>
                        </span>
                    );
                }
                return null;
            case 'CreateEvent':
                 if (event.payload.ref_type === 'repository') {
                    return (
                        <span>
                            Created new repository{' '}
                            <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{event.repo.name}</a>
                        </span>
                    );
                }
                return null;
            default:
                return null;
        }
    };
    
    const filteredEvents = events.filter(event => 
        (event.type === 'PushEvent' && event.payload.commits && event.payload.commits.length > 0) ||
        (event.type === 'PullRequestEvent' && event.payload.action === 'opened') ||
        (event.type === 'CreateEvent' && event.payload.ref_type === 'repository')
    );
    
    const eventsToShow = filteredEvents.slice(0, 4);

  return (
    <div className='mt-6'>
        <h3 className="text-base font-medium mb-4">Contribution activity</h3>
        <div className="relative">
            <div className="border border-foreground/10 rounded-xl p-4 space-y-4">
                {eventsToShow.length > 0 ? (
                    eventsToShow.map((event, index) => {
                        const eventContent = renderEvent(event);
                        if (!eventContent) return null;
                        
                        return (
                            <div key={`${event.created_at}-${index}`} className="flex items-start gap-3 text-sm">
                               <EventIcon eventType={event.type} />
                               <div>
                                 {eventContent}
                                 <p className='text-xs text-foreground/50 mt-1'>
                                    {new Date(event.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                 </p>
                               </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-sm text-foreground/70">No recent activity to display.</p>
                )}
            </div>
            {filteredEvents.length > 4 && (
                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none rounded-b-xl" />
            )}
        </div>

        {filteredEvents.length > 4 && (
            <div className="mt-4 flex justify-center">
                 <a 
                    href="https://github.com/lyfe691"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors group"
                 >
                    View all activity on GitHub
                    <MoveRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
            </div>
        )}
    </div>
  );
};

export default ContributionActivityFeed; 