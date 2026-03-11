import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: {
      index: "src/index.ts",
      preset: "src/preset.ts",
    },
    format: ["esm"],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    external: [
      "react",
      "react-dom",
      "@docusaurus/core",
      "@docusaurus/preset-classic",
      "@docusaurus/theme-mermaid",
      "@mdx-js/react",
    ],
  },
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
