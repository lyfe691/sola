/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import type { Language } from "@/config/languages";
import type { CommandMenuScope } from "@/hooks/use-command-menu";
import { useLanguage, useTranslation } from "@/lib/language-provider";
import {
  englishSections,
  loadSections,
  sectionsIn,
  type SectionIndex,
} from "@/lib/search/deep-dive-sections";
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
  /** a heading of its own, in place of the kind's */
  label?: string;
}

/** what a scoped palette searches */
const PROJECT_KINDS: ReadonlySet<SiteKind> = new Set(["project", "section"]);

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

/**
 * The site's documents searched for `query`, grouped by what they are.
 * Scoped to projects, only projects and their deep-dive sections take part,
 * and before anything is typed the current project's sections come first.
 */
export function useSiteSearch(
  query: string,
  actions: SiteDoc[],
  scope: CommandMenuScope,
  currentProjectId?: string,
) {
  const t = useTranslation();
  const { language } = useLanguage();
  // English sections answer until the reader's language has loaded
  const [loaded, setLoaded] = useState<{
    language: Language;
    sections: SectionIndex;
  } | null>(null);
  const sections =
    sectionsIn(language) ??
    (loaded?.language === language ? loaded.sections : englishSections);
  useEffect(() => {
    if (sectionsIn(language)) return;
    let live = true;
    void loadSections(language).then((index) => {
      if (live) setLoaded({ language, sections: index });
    });
    return () => {
      live = false;
    };
  }, [language]);
  const docs = useMemo(() => {
    const all = [...buildSiteDocs(t, language, sections), ...actions];
    return scope === "projects"
      ? all.filter((doc) => PROJECT_KINDS.has(doc.kind))
      : all;
  }, [t, language, sections, actions, scope]);
  const search = useMemo(() => createSearch(docs), [docs]);
  const deferred = useDeferredValue(query);

  const groups = useMemo<ResultGroup[]>(() => {
    if (!deferred.trim() && scope === "projects") {
      const here = docs.filter(
        (doc) => doc.kind === "section" && doc.projectId === currentProjectId,
      );
      const projects = docs.filter((doc) => doc.kind === "project");
      return [
        ...(here.length
          ? [
              {
                kind: "section" as const,
                label: here[0].kind === "section" ? here[0].project : undefined,
                hits: here.map(unmatched),
              },
            ]
          : []),
        { kind: "project" as const, hits: projects.map(unmatched) },
      ];
    }
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
  }, [search, deferred, docs, scope, currentProjectId]);

  return { groups, searching: deferred.trim().length > 0 };
}
