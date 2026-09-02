/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Shader programs cannot be shared across WebGL contexts, and ogl compiles
 * and links synchronously, so creating six covers in one React commit would
 * stall the main thread for several frames at once — on page load and again
 * every time the grid remounts after a re-sort. This queue admits one
 * canvas creation per animation frame, nearest to the viewport first.
 */

export interface MountJob {
  /** Distance from the viewport in px; read when the job is picked, not when queued. */
  priority: () => number;
  run: () => void;
}

export function createMountQueue(
  schedule: (cb: () => void) => void = (cb) =>
    requestAnimationFrame(() => cb()),
) {
  const jobs = new Set<MountJob>();
  let scheduled = false;

  const drain = () => {
    scheduled = false;
    let best: MountJob | undefined;
    let bestPriority = Infinity;
    for (const job of jobs) {
      const priority = job.priority();
      if (priority < bestPriority) {
        bestPriority = priority;
        best = job;
      }
    }
    if (!best) return;
    jobs.delete(best);
    best.run();
    if (jobs.size) tick();
  };

  const tick = () => {
    if (scheduled) return;
    scheduled = true;
    schedule(drain);
  };

  return {
    enqueue(job: MountJob) {
      jobs.add(job);
      tick();
      return () => {
        jobs.delete(job);
      };
    },
    get size() {
      return jobs.size;
    },
  };
}

export const mountQueue = createMountQueue();
