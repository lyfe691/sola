/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useDeferredValue, useMemo } from "react";
import { useLanguage, useTranslation } from "@/lib/language-provider";
import { createSearch, type SearchHit } from "@/lib/search/engine";
import {
  buildSiteDocs,
  KIND_ORDER,
  type SiteDoc,
  type SiteKind,
} from "@/lib/search/sources";

/** a heading's worth of results; actions are listed with the pages */
export type GroupKind = Exclude<SiteKind, "action">;

export interface ResultGroup {
  kind: GroupKind;
  hits: SearchHit<SiteDoc>[];
}

/** how many results a group shows before it gives way to the next */
const CAP: Record<GroupKind, number> = {
  page: 5,
  project: 5,
  section: 6,
  skill: 5,
  experience: 4,
  certification: 4,
  service: 3,
  theme: 4,
  language: 3,
  background: 3,
};

/** what the palette lists before anything is typed */
const RESTING: GroupKind[] = ["page", "theme", "language", "background"];

const groupOf = (kind: SiteKind): GroupKind =>
  kind === "action" ? "page" : kind;

const unmatched = (doc: SiteDoc): SearchHit<SiteDoc> => ({
  doc,
  score: 0,
  title: [],
  context: [],
  body: [],
});

/** the site's documents searched for `query`, grouped by what they are */
export function useSiteSearch(query: string, actions: SiteDoc[]) {
  const t = useTranslation();
  const { language } = useLanguage();
  const docs = useMemo(
    () => [...buildSiteDocs(t, language), ...actions],
    [t, language, actions],
  );
  const search = useMemo(() => createSearch(docs), [docs]);
  const deferred = useDeferredValue(query);

  const groups = useMemo<ResultGroup[]>(() => {
    if (!deferred.trim()) {
      return RESTING.map((kind) => ({
        kind,
        hits: docs.filter((doc) => groupOf(doc.kind) === kind).map(unmatched),
      }));
    }
    const byGroup = new Map<GroupKind, SearchHit<SiteDoc>[]>();
    for (const hit of search(deferred)) {
      const kind = groupOf(hit.doc.kind);
      const list = byGroup.get(kind) ?? [];
      if (list.length < CAP[kind]) list.push(hit);
      byGroup.set(kind, list);
    }
    // hits arrive best-first, so each group's first hit is its best
    return [...byGroup.entries()]
      .map(([kind, hits]) => ({ kind, hits }))
      .sort(
        (a, b) =>
          b.hits[0].score - a.hits[0].score ||
          KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind),
      );
  }, [search, deferred, docs]);

  return { groups, searching: deferred.trim().length > 0 };
}
