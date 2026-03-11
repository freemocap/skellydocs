# @freemocap/skellydocs

Shared [Docusaurus](https://docusaurus.io/) theme, preset, and CLI for [FreeMoCap](https://freemocap.org) documentation sites.

Every FreeMoCap sub-project — SkellyCam, SkellyTracker, FreeMoCap core — gets the same dark-theme design, GitHub-integrated roadmap, interactive feature cards, and i18n setup without duplicating a single component or CSS file. Each repo's docs folder contains **only content**: markdown, images, and a thin config. Everything else comes from this package.

## What's in the box

**Preset** — `skellyPreset()` wraps `@docusaurus/preset-classic` with the theme's CSS, dark mode defaults, edit-URL wiring, mermaid support, and blog/docs configuration. One function call replaces ~100 lines of boilerplate config.

**Theme components** — A set of React components that all FreeMoCap docs sites share:

| Component | What it does |
|---|---|
| `IndexPage` | Full landing page: hero section, feature cards, project guarantees |
| `RoadmapPage` | `/roadmap` route — fetches GitHub issues by label, displays filterable cards |
| `RoadmapContent` | The roadmap dashboard (fetch, cache, filter, search, sort) |
| `RoadmapEntry` | A single roadmap item card with type/status badges and labels |
| `CoreFeatureHeader` | Summary block for the top of core feature doc pages |
| `TodoList` | Collapsible "Roadmap" toggle that links items to GitHub issues |
| `Tip` | Inline tooltip for progressive disclosure (hover to reveal explanation) |
| `AiGeneratedBanner` | Disclaimer banner for AI-drafted doc pages |

**CSS design tokens** — `--sk-*` CSS variables that define the palette, plus a full `theme.module.css` with styles for every component. Override `--sk-accent` in your own CSS to give each project its own color identity.

**i18n helpers** — `defaultLocales()` generates Docusaurus i18n config with human-readable directory names (`i18n/es-spanish/` instead of `i18n/es/`). Starts with English, Spanish, Arabic (RTL), and Chinese.

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
│   └── intro.md
├── src/pages/
│   ├── index.tsx          # 5-line wrapper around IndexPage
│   └── roadmap.tsx        # 4-line wrapper around RoadmapPage
├── content.config.tsx     # Your project's features, hero, guarantees
├── docusaurus.config.ts   # ~25 lines, delegates to the preset
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

## How it works: skellydocs by example

The best way to understand the package is to see how a consuming repo uses it. Here's exactly what SkellyCam's docs look like after adopting skellydocs.

### docusaurus.config.ts

The preset eliminates boilerplate. The consumer imports `prism-react-renderer` directly and passes themes to `skellyThemeConfig`; everything else has sensible defaults.

```typescript
import { themes as prismThemes } from 'prism-react-renderer';
import { skellyPreset, skellyThemeConfig, defaultLocales } from '@freemocap/skellydocs/preset';
import type { Config } from '@docusaurus/types';

const config: Config = {
  title: 'SkellyCam',
  tagline: 'Frame-perfect multi-camera synchronization for USB webcams',
  favicon: 'img/skellycam-favicon.ico',
  url: 'https://freemocap.github.io',
  baseUrl: '/skellycam/',

  future: { v4: true },
  onBrokenLinks: 'throw',
  markdown: { mermaid: true },
  themes: ['@docusaurus/theme-mermaid'],

  i18n: defaultLocales(),

  presets: [
    skellyPreset({
      repo: 'freemocap/skellycam',
    }),
  ],

  themeConfig: skellyThemeConfig({
    title: 'SkellyCam',
    repo: 'freemocap/skellycam',
    prismThemes: {
      light: prismThemes.github,
      dark: prismThemes.dracula,
    },
    logoSrc: 'img/skellycam-logo.svg',
  }),
};

export default config;
```

`skellyPreset()` takes a `SkellyPresetOptions` object:

| Option | Required | Description |
|---|---|---|
| `repo` | yes | GitHub `org/repo` string — used for edit links, roadmap API calls, issue links |

`skellyThemeConfig()` takes:

| Option | Required | Default | Description |
|---|---|---|---|
| `title` | yes | — | Displayed in the navbar |
| `repo` | yes | — | GitHub `org/repo` — navbar GitHub link and footer links |
| `prismThemes` | yes | — | `{ light, dark }` theme objects from `prism-react-renderer` |
| `logoSrc` | no | `"img/logo.svg"` | Path to the navbar logo (relative to `static/`) |
| `logoAlt` | no | `"<title> Logo"` | Alt text for the navbar logo |

### content.config.tsx

Each repo defines its own landing page content in a typed config file. This is the structured data that drives the `IndexPage` component — hero text, feature cards, guarantees, and links to GitHub issues.

```tsx
import type { SkellyDocsConfig } from '@freemocap/skellydocs';
import { Tip } from '@freemocap/skellydocs';

const config: SkellyDocsConfig = {
  hero: {
    title: 'SkellyCam',
    accentedSuffix: 'Cam',
    subtitle: 'The camera backend for FreeMoCap',
    tagline: 'Frame-perfect multi-camera synchronization for USB webcams',
    logoSrc: '/skellycam/img/skellycam-logo.svg',
    parentProject: {
      name: 'FreeMoCap',
      url: 'https://freemocap.org',
    },
  },

  features: [
    {
      id: 'frame-perfect-sync',
      icon: '🔒',
      title: 'Frame-Perfect Sync',
      description: 'A frame-count-gated capture protocol ensures all cameras stay in lock-step.',
      summary: (
        <>
          A{' '}
          <Tip text="Each camera's grab cycle is gated on relative frame counts">
            frame-count-gated capture protocol
          </Tip>{' '}
          ensures all cameras stay in lock-step with{' '}
          <strong>identical frame counts</strong>.
        </>
      ),
      todos: [
        { label: 'Hardware synchronization (external trigger)', issueNum: 1 },
        { label: 'Target frame rate setting', issueNum: 2 },
      ],
      docPath: 'core/frame-perfect-sync',
    },
    // ...more features
  ],

  guarantees: [
    'All recorded videos have <strong>precisely the same frame count</strong>',
    'Each multi-frame payload contains <strong>exactly one image per camera</strong>',
  ],

  guaranteeTodos: [
    { label: 'Crash-safe recordings (hybrid MP4 codec)', issueNum: 12 },
  ],
};

export default config;
```

The `Tip` component is imported directly from the package — no custom component authoring needed. Feature summaries support full TSX markup.

### src/pages/index.tsx

The landing page is a one-liner wrapper. All the rendering logic lives in the package's `IndexPage` component.

```tsx
import { IndexPage } from '@freemocap/skellydocs';
import config from '../../content.config';

const REPO = 'freemocap/skellycam';

export default function Home() {
  return <IndexPage config={config} repo={REPO} />;
}
```

### src/pages/roadmap.tsx

Same pattern for the roadmap:

```tsx
import { RoadmapPage } from '@freemocap/skellydocs';

const REPO = 'freemocap/skellycam';

export default function Roadmap() {
  return <RoadmapPage repo={REPO} />;
}
```

`RoadmapPage` fetches issues from GitHub's API using the repo slug, caches responses with ETags, and renders a filterable/sortable grid of cards. No configuration needed beyond the repo string.

### Using components in MDX docs

Theme components are available for use inside markdown/MDX pages too:

```mdx
---
title: Frame-Perfect Sync
---

import { CoreFeatureHeader, Tip } from '@freemocap/skellydocs';

<CoreFeatureHeader
  feature={{
    id: 'frame-perfect-sync',
    icon: '🔒',
    title: 'Frame-Perfect Sync',
    description: '...',
    summary: <>...</>,
    todos: [{ label: 'Hardware sync', issueNum: 1 }],
    docPath: 'core/frame-perfect-sync',
  }}
  repoUrl="https://github.com/freemocap/skellycam"
/>

The capture protocol uses a
<Tip text="OpenCV's VideoCapture.grab() acquires a frame without decoding it">
  grab/retrieve split
</Tip>
to minimize inter-camera timing spread.
```

## i18n

`defaultLocales()` generates a Docusaurus i18n config with 4 starter locales and human-readable directory names:

| Locale code | Directory name | Why it's included |
|---|---|---|
| `en` | (default) | Base language |
| `es` | `i18n/es-spanish/` | Latin script, LTR — simplest translation case |
| `ar` | `i18n/ar-arabic/` | Tests RTL layout |
| `zh-CN` | `i18n/zh-chinese/` | Tests character-based rendering |

URLs stay clean (`/es/docs/intro`, not `/es-spanish/docs/intro`) because Docusaurus's `path` config maps the readable directory name to the standard locale code.

## CSS design tokens

The theme defines `--sk-*` CSS variables in `custom.css`. All component styles reference these tokens, so the look stays consistent across sites:

| Token | Default | Purpose |
|---|---|---|
| `--sk-bg-deep` | `#06050e` | Page background |
| `--sk-bg-surface` | `#0e0c1a` | Card/surface background |
| `--sk-border` | `#1a1730` | Borders and dividers |
| `--sk-text` | `#e8e6f0` | Primary text |
| `--sk-text-dim` | `#8a87a0` | Secondary/muted text |
| `--sk-accent` | `#6ee7b7` | Accent color (override in your CSS to customize) |
| `--sk-accent-dim` | `rgba(110,231,183,0.15)` | Accent background tint |
| `--sk-purple` | `#a78bfa` | Secondary accent (links, badges) |
| `--sk-mono` | JetBrains Mono | Monospace font stack |

## Package structure

```
@freemocap/skellydocs/
├── src/
│   ├── index.ts               # Package entry — re-exports everything
│   ├── preset.ts              # skellyPreset() + skellyThemeConfig() + defaultLocales()
│   ├── types.ts               # All shared TypeScript types
│   ├── bin/
│   │   └── create-skellydocs.ts
│   ├── theme/
│   │   ├── Tip.tsx
│   │   ├── TodoList.tsx
│   │   ├── CoreFeatureHeader.tsx
│   │   ├── RoadmapEntry.tsx
│   │   ├── RoadmapContent.tsx
│   │   ├── IndexPage.tsx
│   │   ├── RoadmapPage.tsx
│   │   └── AiGeneratedBanner.tsx
│   └── css/
│       ├── custom.css
│       └── theme.module.css
├── templates/                 # Handlebars templates for the CLI
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

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
