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
 * every time cards come near after a re-sort. This queue admits one
 * canvas creation per animation frame, nearest to the viewport first, and
 * can be held while something else needs every frame (the projects grid
 * holds it for the length of a swap).
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
  let holds = 0;

  const drain = () => {
    scheduled = false;
    // a hold that arrived after this tick was scheduled; the release re-ticks
    if (holds) return;
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
    if (scheduled || holds) return;
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
    /**
     * Pause creation until the returned release is called; jobs keep
     * queueing and drain afterwards, one per frame. Holds nest, and a
     * release is idempotent.
     */
    hold() {
      holds++;
      let released = false;
      return () => {
        if (released) return;
        released = true;
        holds--;
        if (jobs.size) tick();
      };
    },
    get size() {
      return jobs.size;
    },
  };
}

export const mountQueue = createMountQueue();
