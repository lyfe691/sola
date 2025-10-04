/// <reference types="vite/client" />

declare module "*.mdx" {
    interface MDXProps {
      components?: Record<string, React.ComponentType<Record<string, unknown>>>;
      [key: string]: unknown;
    }
    let MDXComponent: (props: MDXProps) => JSX.Element;
    export default MDXComponent;
  }
  