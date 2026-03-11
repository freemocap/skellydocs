---
sidebar_position: 6
title: AiGeneratedBanner
---

# AiGeneratedBanner

A disclaimer banner for doc pages that were drafted by an AI assistant. Shows a robot emoji and a message linking to the repo's issue tracker for corrections.

## Import

```tsx
import { AiGeneratedBanner } from '@freemocap/skellydocs';
```

## Props

| Prop | Type | Description |
|---|---|---|
| `repo` | `string` | GitHub `org/repo` string. Used to construct the "open an issue" link. |

## Usage in MDX

```mdx
import { AiGeneratedBanner } from '@freemocap/skellydocs';

<AiGeneratedBanner repo="freemocap/skellycam" />

# My AI-Drafted Page

Content here...
```

## Usage in a Docusaurus theme override

For projects where every doc page is AI-drafted, you can add the banner to all pages via a Docusaurus theme component override (`src/theme/DocItem/Layout/index.tsx`). This is what SkellyCam does — the banner and a feedback widget are injected into every doc page without manually adding them to each markdown file.

## Styling

The banner uses inline styles rather than the CSS module, so it works identically regardless of what theme CSS is loaded. It has a subtle purple border and background tint that matches the theme's secondary accent color.
