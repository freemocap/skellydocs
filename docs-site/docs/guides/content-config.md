---
sidebar_position: 2
title: Content Config
---

# Content Config

Each consuming repo defines its landing page content in a `content.config.tsx` file at the root of the docs site. This file is pure data — it describes what your project does, not how it's rendered. The `IndexPage` component reads this config and handles all the rendering.

## The SkellyDocsConfig type

```typescript
type SkellyDocsConfig = {
  hero: HeroConfig;
  features: CoreFeature[];
  guarantees: string[];
  guaranteeTodos: TodoItem[];
};
```

## hero

The hero section at the top of the landing page.

```typescript
type HeroConfig = {
  title: string;           // Full project name, e.g. "SkellyCam"
  accentedSuffix: string;  // The part rendered in accent color, e.g. "Cam"
  subtitle: string;        // One line below the title
  tagline: string;         // Smaller text below the subtitle
  logoSrc: string;         // Path to logo image (relative to site root)
  parentProject: {
    name: string;          // e.g. "FreeMoCap"
    url: string;           // e.g. "https://freemocap.org"
  };
};
```

The `accentedSuffix` is matched against the end of `title` and rendered in the `--sk-accent` color. So with `title: "SkellyCam"` and `accentedSuffix: "Cam"`, you get "Skelly**Cam**" with "Cam" in green (or whatever your accent color is).

## features

An array of feature cards displayed on the landing page. Each feature links to a doc page and optionally shows a collapsible roadmap section.

```typescript
type CoreFeature = {
  id: string;             // Unique key, e.g. "frame-perfect-sync"
  icon: string;           // Emoji for the card, e.g. "🔒"
  title: string;          // Card title
  description: string;    // Plain text for SEO/meta
  summary: ReactNode;     // Rich TSX rendered on the card (can include <Tip>, <strong>, etc.)
  todos: TodoItem[];      // Roadmap items linking to GitHub issues
  docPath: string;        // Path relative to /docs/, e.g. "core/frame-perfect-sync"
};

type TodoItem = {
  label: string;          // Display text, e.g. "Hardware synchronization"
  issueNum: number;       // GitHub issue number — linked automatically using the repo from preset
};
```

The `summary` field accepts TSX markup. You can import the `Tip` component from the package and use it inline to add hover tooltips:

```tsx
import { Tip } from '@freemocap/skellydocs';

summary: (
  <>
    A{' '}
    <Tip text="Detailed explanation shown on hover">
      technical term
    </Tip>{' '}
    that does something important.
  </>
),
```

## guarantees

An array of strings displayed in the "guarantees" section below the feature cards. These can contain HTML for inline formatting:

```typescript
guarantees: [
  'All recorded videos have <strong>precisely the same frame count</strong>',
  'Each payload contains <strong>exactly one image per camera</strong>',
],
```

## guaranteeTodos

Roadmap items displayed below the guarantees section, structured the same as feature todos:

```typescript
guaranteeTodos: [
  { label: 'Crash-safe recordings', issueNum: 12 },
],
```

## How this site uses it

This site's `content.config.tsx` describes skellydocs' own features. The four feature cards on the landing page — Shared Theme, GitHub Roadmap, CLI Scaffolder, and One-Line Preset — are all defined in this file. You can [read the source on GitHub](https://github.com/freemocap/skellydocs/blob/main/docs-site/content.config.tsx) as a complete working example.
