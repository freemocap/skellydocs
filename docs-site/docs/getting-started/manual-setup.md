---
sidebar_position: 2
title: Manual Setup
---

# Manual Setup

If you already have a Docusaurus site or want to set things up by hand instead of using the CLI.

## Install the package

```bash
npm install @freemocap/skellydocs
```

## Update docusaurus.config.ts

Replace your existing preset and theme configuration with the skellydocs preset:

```typescript
import { skellyPreset, skellyThemeConfig, defaultLocales } from '@freemocap/skellydocs';
import type { Config } from '@docusaurus/types';

const config: Config = {
  title: 'My Project',
  tagline: 'What my project does',
  favicon: 'img/favicon.ico',
  url: 'https://freemocap.github.io',
  baseUrl: '/my-project/',

  future: { v4: true },
  onBrokenLinks: 'throw',
  markdown: { mermaid: true },
  themes: ['@docusaurus/theme-mermaid'],

  i18n: defaultLocales(),

  presets: [
    skellyPreset({
      repo: 'freemocap/my-project',
      accentColor: '#6ee7b7',
    }),
  ],

  themeConfig: skellyThemeConfig({
    title: 'My Project',
    repo: 'freemocap/my-project',
  }),
};

export default config;
```

## Create content.config.tsx

This file defines your landing page content — the hero section, feature cards, and guarantees. See [Content Config](/docs/guides/content-config) for the full type reference.

```tsx
import type { SkellyDocsConfig } from '@freemocap/skellydocs';

const config: SkellyDocsConfig = {
  hero: {
    title: 'My Project',
    accentedSuffix: 'Project',
    subtitle: 'Part of the FreeMoCap ecosystem',
    tagline: 'What my project does in one sentence',
    logoSrc: '/my-project/img/logo.svg',
    parentProject: {
      name: 'FreeMoCap',
      url: 'https://freemocap.org',
    },
  },
  features: [],
  guarantees: [],
  guaranteeTodos: [],
};

export default config;
```

## Create page wrappers

Create two thin files in `src/pages/`:

**src/pages/index.tsx**

```tsx
import { IndexPage } from '@freemocap/skellydocs';
import config from '../../content.config';

const REPO = 'freemocap/my-project';

export default function Home() {
  return <IndexPage config={config} repo={REPO} />;
}
```

**src/pages/roadmap.tsx**

```tsx
import { RoadmapPage } from '@freemocap/skellydocs';

const REPO = 'freemocap/my-project';

export default function Roadmap() {
  return <RoadmapPage repo={REPO} />;
}
```

## Delete what you no longer need

If you're converting an existing site that had its own components and CSS, you can remove:

- `src/components/` — replaced by theme components from the package
- `src/css/` — replaced by the package's design tokens and module CSS
- `src/data/` — replaced by `content.config.tsx`
- Old i18n directories — replaced by `defaultLocales()`

Keep your `docs/`, `blog/`, and `static/` directories — those are your content.

## Verify

```bash
npm start
```

The site should build with the full skellydocs theme applied.
