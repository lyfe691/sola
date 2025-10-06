/**
 * TempRenderer - temporary MDX renderer for /t/:slug
 * 
 * (c) 2025 Yanis Sebastian Zürcher
 */
import React, { Suspense, lazy } from "react";
import { useParams, Navigate } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import { TempMDXComponents } from "@/components/TempMDXComponents";

const mdxModules = import.meta.glob("../../content/t/*.mdx");

const getMDXComponentBySlug = (slug: string) => {
  const match = Object.keys(mdxModules).find((key) =>
    key.endsWith(`/${slug}.mdx`),
  );
  if (!match) return null;
  const importer = mdxModules[match] as () => Promise<{ default: React.ComponentType }>;
  return lazy(() => importer());
};

const TempRenderer: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <Navigate to="/t" replace />;
  }

  const MDXComponent = getMDXComponentBySlug(slug);

  if (!MDXComponent) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="max-w-3xl w-full mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="prose prose-sm max-w-none">
          <MDXProvider components={TempMDXComponents as any}>
            <Suspense fallback={<div className="py-8" />}> 
              <MDXComponent />
            </Suspense>
          </MDXProvider>
        </div>
      </div>
    </div>
  );
};

export default TempRenderer;


