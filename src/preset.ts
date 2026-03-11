import type { LoadContext } from "@docusaurus/types";
import type { SkellyPresetOptions } from "./types";
import { themes as prismThemes } from "prism-react-renderer";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(__dirname, "..");

/**
 * Docusaurus preset that bundles @docusaurus/preset-classic with the
 * skellydocs theme, mermaid, and sensible defaults.
 *
 * Usage in docusaurus.config.ts:
 *   import { skellyPreset } from '@freemocap/skellydocs';
 *   presets: [skellyPreset({ repo: 'freemocap/skellycam' })]
 */
export function skellyPreset(
  options: SkellyPresetOptions,
): [string, Record<string, unknown>] {
  const { repo, roadmapLabel = "roadmap", accentColor } = options;
  const editUrl = `https://github.com/${repo}/tree/main/docs-site/`;

  return [
    "classic",
    {
      docs: {
        sidebarPath: undefined, // let Docusaurus auto-generate
        routeBasePath: "docs",
        editUrl,
      },
      blog: {
        showReadingTime: true,
        feedOptions: { type: ["rss", "atom"], xslt: true },
        editUrl,
        onInlineTags: "warn",
        onInlineAuthors: "warn",
        onUntruncatedBlogPosts: "warn",
      },
      theme: {
        customCss: [
          path.join(PACKAGE_ROOT, "src", "css", "custom.css"),
        ],
      },
    },
  ];
}

/**
 * Returns the themeConfig object for use in docusaurus.config.ts.
 * Keeps the consuming config minimal.
 */
export function skellyThemeConfig(options: {
  title: string;
  repo: string;
  logoSrc?: string;
  logoAlt?: string;
}): Record<string, unknown> {
  const { title, repo, logoSrc = "img/logo.svg", logoAlt } = options;

  return {
    image: "img/og-image.png",
    colorMode: {
      defaultMode: "dark",
      respectPrefersColorScheme: true,
    },
    navbar: {
      title,
      logo: {
        alt: logoAlt ?? `${title} Logo`,
        src: logoSrc,
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "docsSidebar",
          position: "left",
          label: "Docs",
        },
        { to: "/blog", label: "Blog", position: "left" },
        { to: "/roadmap", label: "Roadmap", position: "left" },
        {
          href: `https://github.com/${repo}`,
          label: "GitHub",
          position: "right",
        },
        {
          type: "localeDropdown",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Documentation",
          items: [
            { label: "Getting Started", to: "/docs/" },
          ],
        },
        {
          title: "Community",
          items: [
            { label: "Discord", href: "https://discord.gg/freemocap" },
            {
              label: "GitHub Discussions",
              href: `https://github.com/${repo}/discussions`,
            },
            { label: "FreeMoCap", href: "https://freemocap.org" },
          ],
        },
        {
          title: "More",
          items: [
            { label: "Blog", to: "/blog" },
            { label: "GitHub", href: `https://github.com/${repo}` },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} FreeMoCap Foundation. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["bash", "json", "python", "typescript"],
    },
    mermaid: {
      theme: { light: "neutral", dark: "dark" },
    },
  };
}

export default skellyPreset;

// Re-export config helpers so docusaurus.config.ts can import everything
// from '@freemocap/skellydocs/preset' without pulling in theme components
// (which import CSS that crashes jiti at config-load time).
export { defaultLocales } from "./locales.js";
export type { SkellyPresetOptions } from "./types.js";
