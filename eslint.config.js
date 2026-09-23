import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { plugin as shadcn } from "@shadcn/lint";

export default tseslint.config(
  { ignores: ["dist", ".vercel"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{js,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      shadcn,
    },
    settings: {
      shadcn: {
        // behaviour with no look of its own: a preview around a plain link,
        // and an icon painted in its context's text colour
        ignoreImports: [
          "^@/components/ui/custom/(link-preview|chevron-to-arrow)$",
        ],
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "shadcn/no-restyle": [
        "error",
        {
          // the site's own utilities (index.css)
          allow: ["layout", "link", "scroll-fade"],
          contracts: [
            // a container's padding and gap belong to the page it sits in
            {
              pattern: "^(Card|Tabs|Command)$|(Content|Header|Footer|Empty)$",
              allow: ["layout", "spacing"],
            },
            // an empty state is framed by the page it sits in
            { pattern: "^Empty$", allow: ["layout", "spacing", "shape"] },
            // a title's size is its context's call
            { pattern: "Title$", allow: ["layout", "typography"] },
            // an icon takes its context's colour
            { pattern: "^Spinner$", allow: ["layout", "color"] },
            // a skeleton takes the shape of what it stands in for
            { pattern: "^Skeleton$", allow: ["layout", "shape"] },
            // an image may fade in once it has loaded
            {
              pattern: "^AvatarImage$",
              allow: ["layout", "effects", "motion"],
            },
            // over artwork a breadcrumb takes its tone from what is behind it
            {
              pattern: "^Breadcrumb(List|Page|Separator)$",
              allow: ["layout", "color", "typography"],
            },
            // a prose table takes the article's density and colours
            {
              pattern: "^Table(Head|Cell)?$",
              allow: ["layout", "color", "typography"],
            },
          ],
        },
      ],
      "shadcn/no-raw-colors": "error",
      // a transition's property list has no scale to draw from; the exact
      // classes are one-off structural values with no token to stand for
      "shadcn/no-arbitrary-values": [
        "error",
        {
          allow: [
            "layout",
            "transition",
            "pb-[env(safe-area-inset-bottom)]",
            "rounded-[inherit]",
            "rounded-[3px]",
            "rounded-[0.75rem]",
            "ring-[1.5px]",
            "bg-size-[200%_100%]",
            "underline-offset-[0.2em]",
            "mask-[url(/apple-touch-icon.png)]",
            "bg-size-[160px_160px]",
          ],
        },
      ],
      "shadcn/no-inline-styles": [
        "error",
        {
          // motion values have to arrive through style; motion writes them
          contracts: [{ pattern: "^motion\\.", allow: ["x", "y", "height"] }],
        },
      ],
      // FoldText injects its own stylesheet at runtime
      "shadcn/no-unknown-classes": [
        "error",
        { allow: ["fold-text", "fold-text-*"] },
      ],
      "shadcn/require-static-classes": "error",
    },
  },
  {
    // the components own their appearance: restyling and structural
    // values are theirs to define (colour and inline-style rules still run)
    files: ["src/components/ui/**"],
    rules: {
      "shadcn/no-restyle": "off",
      "shadcn/no-arbitrary-values": "off",
      "shadcn/require-static-classes": "off",
    },
  },
);
