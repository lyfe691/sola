/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.mdx" {
  interface MDXProps {
    components?: Record<string, React.ComponentType<Record<string, unknown>>>;
    [key: string]: unknown;
  }
  let MDXComponent: (props: MDXProps) => JSX.Element;
  export default MDXComponent;
}
