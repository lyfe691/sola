/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "virtual:changelog-snapshot" {
  import type { ChangelogPage } from "@/lib/github-commits";
  const snapshot: { page: ChangelogPage; at: number } | null;
  export default snapshot;
}

declare module "virtual:deep-dive-index" {
  import type { DeepDiveSection } from "@/lib/search/types";
  /** sections of every deep dive, keyed by its MDX file name */
  const index: Record<string, DeepDiveSection[]>;
  export default index;
}

declare module "*.mdx" {
  interface MDXProps {
    components?: Record<string, React.ComponentType<Record<string, unknown>>>;
    [key: string]: unknown;
  }
  let MDXComponent: (props: MDXProps) => JSX.Element;
  export default MDXComponent;
}
