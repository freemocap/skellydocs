---
sidebar_position: 1
title: Components
---

# Component reference

All components are exported from `@freemocap/skellydocs`.

```tsx
import { IndexPage, RoadmapPage, Tip, TodoList, CoreFeatureHeader, AiGeneratedBanner } from '@freemocap/skellydocs';
```

## IndexPage

Renders the full landing page: hero section, feature cards, and project guarantees.

**Props:**

| Prop | Type | Description |
|---|---|---|
| `config` | `SkellyDocsConfig` | Content configuration (hero, features, guarantees) |
| `repo` | `string` | GitHub `org/repo` slug |

## RoadmapPage

Fetches GitHub issues by label and renders a filterable, sortable roadmap grid.

**Props:**

| Prop | Type | Description |
|---|---|---|
| `repo` | `string` | GitHub `org/repo` slug |

## Tip

Inline tooltip — renders as underlined text with a hover explanation.

**Props:**

| Prop | Type | Description |
|---|---|---|
| `text` | `string` | The tooltip explanation shown on hover |
| `children` | `ReactNode` | The inline text to underline |

## TodoList

Collapsible roadmap toggle that links items to GitHub issues.

**Props:**

| Prop | Type | Description |
|---|---|---|
| `items` | `TodoItem[]` | Array of `{ label, issueNum }` objects |
| `repoUrl` | `string` | Full GitHub repo URL for linking issues |

## CoreFeatureHeader

Summary block for the top of core feature documentation pages.

**Props:**

| Prop | Type | Description |
|---|---|---|
| `feature` | `CoreFeature` | Feature configuration object |
| `repoUrl` | `string` | Full GitHub repo URL |

## AiGeneratedBanner

Disclaimer banner for pages with AI-generated content. No props required — just drop it at the top of your MDX page.
