# @freemocap/skellydocs

[![npm](https://img.shields.io/npm/v/@freemocap/skellydocs)](https://www.npmjs.com/package/@freemocap/skellydocs)

Shared [Docusaurus](https://docusaurus.io/) theme and CLI for [FreeMoCap](https://freemocap.org) documentation sites.

Every FreeMoCap sub-project — SkellyCam, SkellyTracker, FreeMoCap core — gets the same dark-theme design, GitHub-integrated roadmap, interactive feature cards, and progressive-disclosure tooltips without duplicating a single component or CSS file. Each repo's docs folder contains **only content**: markdown, images, and a thin config. Everything else comes from this package.

## What's in the box

**Theme components** — React components that all FreeMoCap docs sites share:

| Component | What it does |
|---|---|
| `IndexPage` | Full landing page: hero section, feature cards, project guarantees |
| `RoadmapPage` | `/roadmap` route — fetches GitHub issues, displays filterable/sortable cards with grid and list views |
| `RoadmapContent` | The roadmap dashboard (fetch, cache, filter, search, sort, grid/list toggle) |
| `RoadmapEntry` | A single roadmap item card with type/status badges and labels |
| `CoreFeatureHeader` | Summary block for the top of core feature doc pages |
| `LinkedIssues` | Displays linked GitHub issues with type badges, status dots, and label chips (fetched from GitHub API) |
| `Tip` | Two-stage progressive tooltip — hover shows short info, click expands to show full details with optional "Learn more" link |
| `AiGeneratedBanner` | Collapsible disclaimer banner for AI-drafted doc pages — supports generation types, metadata, and human-curator notes |

**CSS design tokens** — `--sk-*` CSS variables that define the palette, plus a full `theme.module.css` with styles for every component. Override `--sk-accent` in your own CSS to give each project its own color identity.

**CLI scaffolder** — `npx @freemocap/skellydocs init` interactively creates a new docs site with all the wiring done.

## Quick start

### Scaffold a new docs site

```bash
npx @freemocap/skellydocs init
```

You'll be prompted for your project name, GitHub repo, and base URL. The CLI generates a ready-to-run docs site:

```
docs-site/
├── docs/
│   └── intro.mdx
├── blog/
│   └── init.mdx
├── src/pages/
│   ├── index.tsx          # 5-line wrapper around IndexPage
│   └── roadmap.tsx        # 4-line wrapper around RoadmapPage
├── content.config.tsx     # Your project's features, hero, guarantees
├── docusaurus.config.ts   # Full Docusaurus config with skellydocs CSS
├── sidebars.ts
└── package.json
```

Then:

```bash
cd docs-site
npm install
npm start
```

### Add to an existing Docusaurus site

```bash
npm install @freemocap/skellydocs
```

Then wire up the theme CSS in your `docusaurus.config.ts`:

```typescript
theme: {
  customCss: [require.resolve('@freemocap/skellydocs/css/custom.css')],
},
```

## How it works

The best way to understand the package is to see how a consuming docs site uses it. The CLI generates all of this for you, but here's what each file looks like.

### docusaurus.config.ts

The generated config uses `@docusaurus/preset-classic` with the skellydocs CSS applied as custom CSS. It includes dark mode defaults, mermaid support, and the "Built with SkellyDocs" footer.

```typescript
import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';

const config: Config = {
  title: 'MyProject',
  tagline: 'Documentation for MyProject',
  favicon: 'img/favicon.ico',

  url: 'https://docs.freemocap.org',
  baseUrl: '/myproject/',

  onBrokenLinks: 'throw',
  markdown: { mermaid: true },
  themes: ['@docusaurus/theme-mermaid'],

  plugins: [
    function disableFullySpecified() {
      return {
        name: 'disable-fully-specified',
        configureWebpack() {
          return {
            module: {
              rules: [{ test: /\.m?js$/, resolve: { fullySpecified: false } }],
            },
          };
        },
      };
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.ts'),
          routeBasePath: 'docs',
          editUrl: 'https://github.com/freemocap/myproject/tree/main/myproject-docs/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: { type: ['rss', 'atom'], xslt: true },
        },
        theme: {
          customCss: [require.resolve('@freemocap/skellydocs/css/custom.css')],
        },
      },
    ],
  ],

  themeConfig: {
    colorMode: { defaultMode: 'dark', respectPrefersColorScheme: true },
    navbar: {
      title: 'MyProject',
      logo: { alt: 'MyProject Logo', src: 'img/logo.svg' },
      items: [
        { type: 'docSidebar', sidebarId: 'docsSidebar', position: 'left', label: 'Docs' },
        { to: '/blog', label: 'Blog', position: 'left' },
        { to: '/roadmap', label: 'Roadmap', position: 'left' },
        { href: 'https://github.com/freemocap/myproject', label: 'Code', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} FreeMoCap Foundation. Built with <a href="https://github.com/freemocap/skellydocs" target="_blank" rel="noopener noreferrer">SkellyDocs</a>.`,
      // ... links
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'python', 'typescript'],
    },
  },
};

export default config;
```

> **Note:** The `disableFullySpecified` plugin is required because tsup/esbuild strips `.js` extensions in unbundled output, and webpack 5 enforces full file extensions on ESM imports.

### content.config.tsx

Each repo defines its own landing page content in a typed config file. This drives the `IndexPage` component — hero text, feature cards, guarantees, and links to GitHub issues.

```tsx
import type { SkellyDocsConfig } from '@freemocap/skellydocs';

const config: SkellyDocsConfig = {
  hero: {
    title: 'MyProject',
    accentedSuffix: 'Project',
    subtitle: 'Part of the FreeMoCap ecosystem',
    tagline: 'Add your project tagline here',
    logoSrc: '/myproject/img/logo.svg',
    parentProject: {
      name: 'FreeMoCap',
      url: 'https://freemocap.org',
    },
  },

  features: [
    {
      id: 'example-feature',
      icon: '🚀',
      title: 'Example Feature',
      description: 'Describe what this feature does.',
      summary: <>Describe what this feature does in a sentence or two.</>,
      issues: [],        // LinkedIssue[] — links to GitHub issues
      docPath: 'intro',  // route to the feature's doc page
    },
  ],

  guarantees: [
    'Add your project guarantees here',
  ],

  guaranteeIssues: [],   // LinkedIssue[] — issues linked to guarantees
};

export default config;
```

### src/pages/index.tsx

The landing page is a one-liner wrapper. All the rendering logic lives in the package's `IndexPage` component.

```tsx
import { IndexPage } from '@freemocap/skellydocs';
import config from '../../content.config';

export default function Home() {
  return <IndexPage config={config} />;
}
```

### src/pages/roadmap.tsx

Same pattern for the roadmap. `collectLinkedUrls` gathers all issue URLs from your `content.config.tsx` and pins them at the top of the roadmap.

```tsx
import { RoadmapPage, collectLinkedUrls } from '@freemocap/skellydocs';
import config from '../../content.config';

const REPO = 'freemocap/myproject';

export default function Roadmap() {
  return <RoadmapPage repo={REPO} pinnedIssues={collectLinkedUrls(config)} />;
}
```

`RoadmapPage` fetches issues from GitHub's API using the repo slug, caches responses with ETags in localStorage, and renders a filterable/sortable grid (or list) of cards.

### Using components in MDX docs

Theme components are available for use inside `.mdx` pages:

```mdx
---
title: Introduction
---

import { AiGeneratedBanner, Tip } from '@freemocap/skellydocs';

<AiGeneratedBanner />

# Welcome to MyProject

This site is built with [Docusaurus](https://docusaurus.io/) and the
<Tip
  shortInfo="A shared Docusaurus theme package for FreeMoCap documentation sites."
  longInfo="@freemocap/skellydocs provides pre-built components (IndexPage, RoadmapPage, Tip, AiGeneratedBanner), CSS design tokens, and a CLI scaffolder — so every FreeMoCap sub-project gets the same dark-theme design without duplicating code."
  href="https://github.com/freemocap/skellydocs"
>@freemocap/skellydocs</Tip> theme.
```

#### Tip component

The `Tip` component supports two modes:

- **Legacy** (`text` prop): CSS-only hover tooltip
- **Two-stage** (`shortInfo` + `longInfo` props): hover shows short info, click expands to show the full explanation. Optional `href` prop adds a "Learn more" link.

#### AiGeneratedBanner component

The banner is collapsible (collapsed by default) and supports optional props:

| Prop | Type | Default | Description |
|---|---|---|---|
| `generationType` | `"ai-generated" \| "ai-transformatted" \| "human-generated"` | `"ai-generated"` | Controls the summary text, icon, and badge |
| `humanCurated` | `boolean` | `false` | Adds a green "✓ curated" badge indicating human review |
| `generatedAt` | `string` | — | Date the content was generated |
| `model` | `string` | — | AI model used |
| `humanNotes` | `string` | — | Curator notes shown in an accented blockquote |
| `moreInfoUrl` | `string` | `"https://docs.freemocap.org/skellydocs/docs/ai-generated-banner"` | Link to generation type docs (set to `""` to hide) |

#### LinkedIssues component

The `LinkedIssues` component renders a collapsible list of GitHub issues and PRs at the top of a doc page. Metadata (status, type, labels) is fetched from the GitHub API the first time the section is expanded, then cached in localStorage for 5 minutes.

Place it near the top of the page, right after `<AiGeneratedBanner />`:

```mdx
import { AiGeneratedBanner, LinkedIssues } from '@freemocap/skellydocs';

<AiGeneratedBanner />

<LinkedIssues items={[
  { label: "Track progress on this feature", url: "https://github.com/freemocap/myproject/issues/123" },
  { label: "Related PR", url: "https://github.com/freemocap/myproject/pull/456" },
]} />

# Page Title
```

Each item in the `items` array is a `LinkedIssue`:

| Prop | Type | Required | Description |
|---|---|---|---|
| `label` | `string` | ✓ | Display text shown in the list |
| `url` | `string` | ✓ | GitHub issue or PR URL |
| `status` | `"open" \| "closed"` | — | Fetched automatically if omitted |
| `type` | `"issue" \| "pr"` | — | Fetched automatically if omitted |
| `labels` | `GitHubLabel[]` | — | Fetched automatically if omitted |

Only `label` and `url` are required — everything else is enriched at runtime from the GitHub API.

## CSS design tokens

The theme defines `--sk-*` CSS variables in `custom.css`. All component styles reference these tokens, so the look stays consistent across sites:

| Token | Default | Purpose |
|---|---|---|
| `--sk-bg-deep` | `#06050e` | Page background |
| `--sk-bg-surface` | `#0e0c1a` | Card/surface background |
| `--sk-border` | `#1a1730` | Borders and dividers |
| `--sk-text` | `#e8e6f0` | Primary text |
| `--sk-text-dim` | `#b0aec3` | Secondary/muted text (WCAG AA compliant) |
| `--sk-accent` | `#6ee7b7` | Accent color (override in your CSS to customize) |
| `--sk-accent-dim` | `rgba(110,231,183,0.15)` | Accent background tint |
| `--sk-purple` | `#a78bfa` | Secondary accent (links, badges) |
| `--sk-mono` | JetBrains Mono | Monospace font stack |

## Package structure

```
@freemocap/skellydocs/
├── src/
│   ├── index.ts               # Package entry — re-exports components + types
│   ├── types.ts               # All shared TypeScript types
│   ├── bin/
│   │   └── create-skellydocs.ts   # CLI scaffolder (Node.js only)
│   ├── theme/
│   │   ├── Tip.tsx                # Two-stage progressive tooltip
│   │   ├── LinkedIssues.tsx       # GitHub issue display with badges/labels
│   │   ├── CoreFeatureHeader.tsx  # Feature page header block
│   │   ├── RoadmapEntry.tsx       # Single roadmap card
│   │   ├── RoadmapContent.tsx     # Roadmap dashboard with grid/list views
│   │   ├── IndexPage.tsx          # Landing page
│   │   ├── RoadmapPage.tsx        # Roadmap page wrapper
│   │   ├── AiGeneratedBanner.tsx  # Collapsible AI disclaimer
│   │   ├── collectLinkedUrls.ts   # Extract issue URLs from config
│   │   └── githubUtils.ts        # Shared GitHub API fetch/cache utilities
│   └── css/
│       ├── custom.css             # CSS design tokens (--sk-* variables)
│       └── theme.module.css       # Component styles
├── templates/                 # Handlebars templates for CLI scaffolder
├── skellydocs-docs/           # Dogfood site (workspace member, see below)
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

## Development

### Workspace setup

This is a monorepo. `skellydocs-docs/` is the dogfood docs site that uses the theme to document itself. It depends on the root package via `"@freemocap/skellydocs": "file:.."`.

```bash
npm install        # Sets up workspace links
npm run build      # Build the theme package
npm start -w skellydocs-docs   # Start the docs dev server
```

### Build commands

```bash
npm run build       # Build the theme package (must run before docs site)
npm run dev         # Dev mode with watch
npm run typecheck   # Type check
```

### Resetting the dogfood site

The `skellydocs-docs/` directory should always be a **faithful representation of CLI output**. Never edit it directly — make changes in the **templates** (`templates/` directory) instead.

To rebuild the dogfood site from templates:

```bash
# Stop any running dev server first (Ctrl+C), then:
npm run rebuild-dogfood

# Start the dev server
npm start -w skellydocs-docs
```

This runs `scripts/rebuild-dogfood.mjs`, which deletes `skellydocs-docs/`, rebuilds the theme package, regenerates the site from templates, and re-installs workspace links — all in one step.

> **Important:** Always stop the dev server before rebuilding. Running while a dev server is watching can corrupt webpack's cache. If this happens, clear caches: `npx rimraf skellydocs-docs/.docusaurus skellydocs-docs/node_modules/.cache`

## Updating an existing docs site

To update a docs site that was previously scaffolded with an older version of skellydocs:

```bash
# In your docs site directory:
npm install @freemocap/skellydocs@latest
```

All theme components, CSS tokens, and styles update automatically through the package. New component props (like `Tip`'s `shortInfo`/`longInfo` or `AiGeneratedBanner`'s `generationType`) are opt-in and backward compatible — existing sites continue to work without changes.

To adopt new features, update your `.mdx` files to use the new props. See the component documentation above.

## Releasing

Releases use [release-it](https://github.com/release-it/release-it). One command handles version bump, git commit/tag/push, and GitHub Release creation. CI then publishes to npm.

```bash
# Interactive release (prompts for patch/minor/major)
npm run release

# Dry run — see what would happen without doing anything
npm run release -- --dry-run
```

## License

MIT
