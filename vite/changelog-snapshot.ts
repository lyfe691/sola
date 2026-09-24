import type { Plugin } from "vite";
import { getCommitLog } from "../api/github-commits.ts";

const CHANGELOG_SNAPSHOT = "virtual:changelog-snapshot";

/**
 * The changelog's first page, fetched once when the bundle is built, so the
 * page opens on its history instead of on a placeholder. A failed fetch
 * ships `null` and the page loads the log at runtime as before.
 */
export function changelogSnapshotPlugin(): Plugin {
  const resolved = `\0${CHANGELOG_SNAPSHOT}`;

  return {
    name: "changelog-snapshot",
    resolveId(id) {
      return id === CHANGELOG_SNAPSHOT ? resolved : undefined;
    },
    async load(id) {
      if (id !== resolved) return undefined;
      if (process.env.VITEST) return "export default null;";
      try {
        const page = await getCommitLog(1);
        const snapshot = { page, at: Date.now() };
        return `export default ${JSON.stringify(snapshot)};`;
      } catch (error) {
        this.warn(`changelog snapshot skipped: ${String(error)}`);
        return "export default null;";
      }
    },
  };
}
