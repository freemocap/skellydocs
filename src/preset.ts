import type { SkellyPresetOptions } from "./types";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ── Locale config ──

type LocaleConfig = {
  label: string;
  htmlLang: string;
  direction?: "ltr" | "rtl";
  path: string;
};

const LOCALE_REGISTRY: { code: string; config: LocaleConfig }[] = [
  {
    code: "es",
    config: { label: "Español", htmlLang: "es", path: "es-spanish" },
  },
  {
    code: "ar",
    config: {
      label: "العربية",
      htmlLang: "ar",
      direction: "rtl",
      path: "ar-arabic",
    },
  },
  {
    code: "zh-CN",
    config: { label: "简体中文", htmlLang: "zh-CN", path: "zh-chinese" },
  },
];

/**
 * Generates a Docusaurus i18n config with human-readable directory names.
 * Includes 4 locales: en, es, ar, zh-CN.
 */
export function defaultLocales(): {
  defaultLocale: string;
  locales: string[];
  localeConfigs: Record<string, LocaleConfig>;
} {
  const localeConfigs: Record<string, LocaleConfig> = {};
  const locales: string[] = ["en"];

  for (const entry of LOCALE_REGISTRY) {
    locales.push(entry.code);
    localeConfigs[entry.code] = entry.config;
  }

  return { defaultLocale: "en", locales, localeConfigs };
}

// ── Preset ──

/**
 * Docusaurus preset that bundles @docusaurus/preset-classic with the
 * skellydocs theme and sensible defaults.
 */
export function skellyPreset(
  options: SkellyPresetOptions,
): [string, Record<string, unknown>] {
  const { repo } = options;
  const editUrl = `https://github.com/${repo}/tree/main/docs-site/`;

  const thisDir = path.dirname(fileURLToPath(import.meta.url));
  const packageRoot = path.resolve(thisDir, "..");

  return [
    "classic",
    {
      docs: {
        sidebarPath: undefined,
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
        customCss: [path.join(packageRoot, "src", "css", "custom.css")],
      },
    },
  ];
}

// ── Theme config ──

/**
 * Returns the themeConfig object for use in docusaurus.config.ts.
 *
 * `prismThemes` must be provided by the consumer so that this module
 * does not import prism-react-renderer at the top level. That import
 * breaks jiti (Docusaurus's config loader) in workspace setups.
 */
export function skellyThemeConfig(options: {
  title: string;
  repo: string;
  prismThemes: { light: unknown; dark: unknown };
  logoSrc?: string;
  logoAlt?: string;
}): Record<string, unknown> {
  const { title, repo, prismThemes, logoSrc = "img/logo.svg", logoAlt } = options;

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
          items: [{ label: "Getting Started", to: "/docs/" }],
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
      theme: prismThemes.light,
      darkTheme: prismThemes.dark,
      additionalLanguages: ["bash", "json", "python", "typescript"],
    },
    mermaid: {
      theme: { light: "neutral", dark: "dark" },
    },
  };
}
