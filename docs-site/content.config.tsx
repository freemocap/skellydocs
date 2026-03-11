import type { SkellyDocsConfig } from '@freemocap/skellydocs';
import { Tip } from '@freemocap/skellydocs';

const config: SkellyDocsConfig = {
  hero: {
    title: 'skellyDocs',
    accentedSuffix: 'Docs',
    subtitle: 'The documentation theme for FreeMoCap',
    tagline: 'One package, consistent docs across every FreeMoCap project',
    logoSrc: '/skellydocs/img/logo.svg',
    parentProject: {
      name: 'FreeMoCap',
      url: 'https://freemocap.org',
    },
  },

  features: [
    {
      id: 'shared-theme',
      icon: '🎨',
      title: 'Shared Theme',
      description:
        'A complete Docusaurus theme with dark-mode design, CSS tokens, and reusable components.',
      summary: (
        <>
          A complete Docusaurus theme with{' '}
          <Tip text="--sk-* CSS variables define the palette, typography, and spacing — override --sk-accent to give each project its own color">
            dark-mode design tokens
          </Tip>{' '}
          and reusable components. Every FreeMoCap project gets the same polished
          look without duplicating a single line of CSS.
        </>
      ),
      todos: [
        { label: 'Light mode support', issueNum: 1 },
        { label: 'Full palette override via preset options', issueNum: 2 },
      ],
      docPath: 'guides/css-tokens',
    },
    {
      id: 'github-roadmap',
      icon: '🗺️',
      title: 'GitHub Roadmap',
      description:
        'A live roadmap page that fetches issues from GitHub by label, with filtering, search, and ETag caching.',
      summary: (
        <>
          A live{' '}
          <Tip text="The RoadmapPage component fetches issues with a configurable GitHub label, caches responses with ETags, and renders filterable/sortable cards">
            roadmap page
          </Tip>{' '}
          powered by your GitHub issues. Filter by type, status, or label — search
          across titles and descriptions — all with zero backend infrastructure.
        </>
      ),
      todos: [
        { label: 'Pagination for repos with 100+ roadmap items', issueNum: 3 },
      ],
      docPath: 'components/roadmap-page',
    },
    {
      id: 'cli-scaffolder',
      icon: '⚡',
      title: 'CLI Scaffolder',
      description:
        'Bootstrap a new docs site with one command. Interactive prompts, Handlebars templates, ready to run.',
      summary: (
        <>
          Run{' '}
          <Tip text="The CLI prompts for project name, GitHub repo, base URL, and accent color, then generates docusaurus.config.ts, content.config.tsx, package.json, and starter docs">
            <code>npx @freemocap/skellydocs init</code>
          </Tip>{' '}
          to scaffold a complete docs site. Answer four prompts, run{' '}
          <code>npm install && npm start</code>, and you're live.
        </>
      ),
      todos: [
        { label: 'translate subcommand for LLM-powered i18n', issueNum: 4 },
      ],
      docPath: 'getting-started/scaffold',
    },
    {
      id: 'preset',
      icon: '📦',
      title: 'One-Line Preset',
      description:
        'skellyPreset() replaces ~100 lines of Docusaurus config with a single function call.',
      summary: (
        <>
          <Tip text="A Docusaurus preset bundles a theme with plugins (docs, blog, sitemap) and default config — so consuming repos don't repeat any of it">
            <code>skellyPreset()</code>
          </Tip>{' '}
          wraps <code>@docusaurus/preset-classic</code> with the theme CSS, dark
          mode defaults, edit URLs, and blog/docs configuration. Your{' '}
          <code>docusaurus.config.ts</code> shrinks to ~25 lines.
        </>
      ),
      todos: [],
      docPath: 'guides/preset',
    },
  ],

  guarantees: [
    'Every consuming repo contains <strong>only content</strong> — no components, no CSS, no complex config',
    'A new docs site goes from zero to running in <strong>under 2 minutes</strong>',
  ],

  guaranteeTodos: [
    { label: 'Automated docs-site CI template in scaffolder', issueNum: 5 },
  ],
};

export default config;
