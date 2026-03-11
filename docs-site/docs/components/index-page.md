---
sidebar_position: 1
title: IndexPage
---

# IndexPage

The full landing page component. Renders a hero section, feature cards grid, and guarantees section — all driven by a `SkellyDocsConfig` object.

## Import

```tsx
import { IndexPage } from '@freemocap/skellydocs';
```

## Props

| Prop | Type | Description |
|---|---|---|
| `config` | `SkellyDocsConfig` | The content config — hero text, features, guarantees. See [Content Config](/docs/guides/content-config). |
| `repo` | `string` | GitHub `org/repo` string. Passed to `TodoList` for issue links. |

## Usage

This component is designed to be the entire content of `src/pages/index.tsx`:

```tsx
import { IndexPage } from '@freemocap/skellydocs';
import config from '../../content.config';

const REPO = 'freemocap/skellycam';

export default function Home() {
  return <IndexPage config={config} repo={REPO} />;
}
```

That's the complete file. `IndexPage` wraps everything in a Docusaurus `<Layout>`, so you don't need to add one.

## What it renders

1. **Hero** — logo (floating animation), title with accented suffix, subtitle with parent project link, tagline, and CTA buttons (Get Started + Learn More)
2. **Feature cards** — a 2-column grid of cards, each linking to a doc page. Cards show an emoji icon, title, rich summary (can include `<Tip>` tooltips), and an optional collapsible roadmap section
3. **Guarantees** — a centered list of project guarantees with check marks, plus an optional roadmap section below

## How this site uses it

The landing page of this documentation site is a 6-line `index.tsx` that passes the skellydocs content config (describing skellydocs' own features) to `IndexPage`. The four feature cards — Shared Theme, GitHub Roadmap, CLI Scaffolder, One-Line Preset — all come from `content.config.tsx`.
