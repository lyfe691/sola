/**
 * TempIndex - temporary content index under /t
 * 
 * (c) 2025 Yanis Sebastian Zürcher
 */
import React, { useMemo } from "react";
import { Link } from "react-router-dom";

const TempIndex: React.FC = () => {
  const mdxModules = import.meta.glob("../../content/t/*.mdx");

  const pages = useMemo(() => {
    return Object.keys(mdxModules)
      .map((filePath) => {
        const fileName = filePath.split("/").pop() || "";
        const slug = fileName.replace(/\.mdx$/, "");
        return { slug };
      })
      .sort((a, b) => a.slug.localeCompare(b.slug));
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      <div className="max-w-3xl w-full mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">Temporary Pages</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Quick scratchpad for MDX-backed pages. Content here is non-permanent.
        </p>

        {pages.length === 0 ? (
          <div className="text-sm text-muted-foreground">No temp pages yet.</div>
        ) : (
          <ul className="space-y-2">
            {pages.map(({ slug }) => (
              <li key={slug}>
                <Link
                  to={`/t/${slug}`}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 hover:border-border transition-colors text-sm"
                >
                  <span className="font-medium text-foreground">{slug}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TempIndex;


