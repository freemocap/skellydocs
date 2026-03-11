import { skellyPreset, skellyThemeConfig, defaultLocales } from '@freemocap/skellydocs/preset';
import type { Config } from '@docusaurus/types';

const config: Config = {
  title: 'skellydocs',
  tagline: 'Shared documentation theme for FreeMoCap projects',
  favicon: 'img/favicon.ico',

  future: { v4: true },

  url: 'https://freemocap.github.io',
  baseUrl: '/skellydocs/',

  organizationName: 'freemocap',
  projectName: 'skellydocs',

  onBrokenLinks: 'throw',

  markdown: { mermaid: true },

  themes: ['@docusaurus/theme-mermaid'],

  i18n: defaultLocales(),

  presets: [
    skellyPreset({
      repo: 'freemocap/skellydocs',
      accentColor: '#a78bfa',
    }),
  ],

  themeConfig: skellyThemeConfig({
    title: 'skellydocs',
    repo: 'freemocap/skellydocs',
  }),
};

export default config;
