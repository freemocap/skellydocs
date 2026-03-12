---
name: create-docs
description: Scaffold a new documentation site using the @freemocap/skellydocs theme. Use when setting up docs for a FreeMoCap sub-project or any project that wants the skellydocs theme.
---

# Create a skellydocs documentation site

## When to use this

Use this skill when:
- Setting up a new documentation site for a project
- Adding skellydocs to an existing Docusaurus site
- Bootstrapping docs for a FreeMoCap sub-project

## Steps

### 1. Scaffold with the CLI

Run the interactive scaffolder:

```bash
npx @freemocap/skellydocs init
```

This prompts for:
- **Project name** (e.g., "SkellyCam")
- **GitHub repo** (e.g., "freemocap/skellycam")
- **Base URL** (e.g., "/skellycam/")

And generates a complete Docusaurus site with all wiring done.

### 2. If the CLI isn't available, create manually

Create these files in the target directory:

**`package.json`** — Dependencies:
- `@freemocap/skellydocs` (the theme package)
- `@docusaurus/core`, `@docusaurus/preset-classic`, `@docusaurus/theme-mermaid` (all same version, e.g., `3.9.2`)
- `@mdx-js/react`, `prism-react-renderer`, `react`, `react-dom`

**`docusaurus.config.ts`** — Use the skellydocs CSS import:
```typescript
import type { Config } from '@docusaurus/types';

const config: Config = {
  title: 'Project Name',
  favicon: 'img/favicon.ico',
  url: 'https://freemocap.github.io',
  baseUrl: '/project-name/',
  onBrokenLinks: 'throw',
  markdown: { mermaid: true },
  themes: ['@docusaurus/theme-mermaid'],
  presets: [['classic', { docs: { sidebarPath: undefined }, blog: { showReadingTime: true }, theme: { customCss: [require.resolve('@freemocap/skellydocs/css/custom.css')] } }]],
  themeConfig: { /* navbar, footer, prism config */ },
};
export default config;
```

**`content.config.tsx`** — Define the landing page content:
```tsx
import type { SkellyDocsConfig } from '@freemocap/skellydocs';

const config: SkellyDocsConfig = {
  hero: { title: 'Project', accentedSuffix: 'Name', subtitle: 'Description', tagline: 'What it does' },
  features: [],
  guarantees: [],
};
export default config;
```

**`src/pages/index.tsx`**:
```tsx
import { IndexPage } from '@freemocap/skellydocs';
import config from '../../content.config';
export default function Home() {
  return <IndexPage config={config} repo="org/repo" />;
}
```

**`src/pages/roadmap.tsx`**:
```tsx
import { RoadmapPage } from '@freemocap/skellydocs';
export default function Roadmap() {
  return <RoadmapPage repo="org/repo" />;
}
```

**`docs/intro.mdx`**:
```mdx
---
sidebar_position: 1
slug: /
title: Introduction
---

import { AiGeneratedBanner } from '@freemocap/skellydocs';

<AiGeneratedBanner />

# Welcome to Project Name

Your introductory content here.
```

### 3. Important conventions

- **Always use `.mdx`** for docs and blog files (not `.md`)
- **Always add `AiGeneratedBanner`** to every `.mdx` page (import from `@freemocap/skellydocs`)
- **Use `{/* truncate */}`** in blog posts for the read-more break (not `<!-- truncate -->` — that's HTML, not valid in MDX)
- **Static assets** go in `static/img/` (logos, favicons, og-images)

### 4. Verify

```bash
npm install
npm start
```

The site should start on `http://localhost:3000/` with the skellydocs dark theme, landing page, and roadmap.

### 5. Add GitHub Pages deployment (optional)

Create `.github/workflows/deploy-docs.yml` — see the skellydocs repo's own workflow as a reference. Key steps:
1. `npm ci`
2. `npm run build` (if the theme is a workspace dependency)
3. `npx docusaurus build`
4. Upload with `actions/upload-pages-artifact@v4`
5. Deploy with `actions/deploy-pages@v5`
