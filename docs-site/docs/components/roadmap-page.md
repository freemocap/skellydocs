---
sidebar_position: 2
title: RoadmapPage
---

# RoadmapPage

A full-page component that fetches GitHub issues by label and displays them as a filterable, sortable grid of cards.

## Import

```tsx
import { RoadmapPage } from '@freemocap/skellydocs';
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `repo` | `string` | — | GitHub `org/repo` string. Used to call the GitHub API. |
| `roadmapLabel` | `string` | `"roadmap"` | The GitHub label to filter issues by. |
| `title` | `string` | `"Roadmap"` | Page title shown in the browser tab. |

## Usage

```tsx
import { RoadmapPage } from '@freemocap/skellydocs';

const REPO = 'freemocap/skellycam';

export default function Roadmap() {
  return <RoadmapPage repo={REPO} />;
}
```

## Features

- **GitHub API integration** — fetches issues from `https://api.github.com/repos/{repo}/issues?labels={label}&state=all`
- **ETag caching** — stores responses in `localStorage` with a 5-minute TTL. Uses `If-None-Match` headers for conditional requests so you don't burn through GitHub's rate limit.
- **Filtering** — filter by type (issue/PR), status (open/closed), and label. Full-text search across titles and body excerpts.
- **Sorting** — by last updated, newest, or oldest.
- **Graceful degradation** — if the GitHub API is unreachable or rate-limited, shows cached data with an error banner and retry button.

## How this site uses it

The [Roadmap](/roadmap) page on this site fetches issues from `freemocap/skellydocs` with the `roadmap` label. If there are no issues with that label yet, it shows an empty state message.
