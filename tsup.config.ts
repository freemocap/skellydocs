import { defineConfig } from "tsup";

export default defineConfig([
  // Theme components + types — compiled individually (not bundled) so that
  // relative imports like `../css/theme.module.css` stay correct in the output.
  // Docusaurus's webpack resolves the CSS module imports at site build time.
  {
    entry: ["src/**/*.ts", "src/**/*.tsx", "!src/bin/**", "!src/**/*.d.ts"],
    format: ["esm"],
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
  // CLI — bundled into a single file (it runs standalone, not via Docusaurus)
  {
    entry: {
      "bin/create-skellydocs": "src/bin/create-skellydocs.ts",
    },
    format: ["esm"],
    splitting: false,
    sourcemap: true,
    banner: {
      js: "#!/usr/bin/env node",
    },
  },
]);
