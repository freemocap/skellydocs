import { defineConfig } from "tsup";

export default defineConfig([
  // Theme components + types — compiled individually (not bundled) so that
  // relative imports like `../css/theme.module.css` stay correct in the output.
  // Docusaurus's webpack resolves the CSS module imports at site build time.
  //
  // outExtension forces `.js` — without `"type": "module"` in package.json,
  // tsup would default to `.mjs`, but `.js` keeps existing export paths stable
  // and avoids webpack's `fullySpecified` enforcement.
  {
    entry: ["src/**/*.ts", "src/**/*.tsx", "!src/bin/**", "!src/**/*.d.ts"],
    format: ["esm"],
    outExtension: () => ({ js: ".js" }),
    dts: true,
    bundle: false,
    sourcemap: true,
    clean: true,
    outDir: "dist",
    external: [
      "react",
      "react-dom",
      "@docusaurus/core",
      "@docusaurus/preset-classic",
      "@docusaurus/theme-mermaid",
      "@docusaurus/Link",
      "@docusaurus/Translate",
      "@theme/Layout",
      "@mdx-js/react",
      /\.css$/,
    ],
  },
  // CLI — bundled into a single file (it runs standalone via Node, not webpack).
  // Uses `.mjs` so Node treats it as ESM without needing `"type": "module"`.
  {
    entry: {
      "bin/create-skellydocs": "src/bin/create-skellydocs.ts",
    },
    format: ["esm"],
    outExtension: () => ({ js: ".mjs" }),
    splitting: false,
    sourcemap: true,
    banner: {
      js: "#!/usr/bin/env node",
    },
  },
]);
