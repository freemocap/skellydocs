---
sidebar_position: 5
title: CoreFeatureHeader
---

# CoreFeatureHeader

A summary block for the top of core feature doc pages. Renders the feature's icon, rich summary, and roadmap items — creating visual consistency between the landing page cards and the detail pages they link to.

## Import

```tsx
import { CoreFeatureHeader } from '@freemocap/skellydocs';
```

## Props

| Prop | Type | Description |
|---|---|---|
| `feature` | `CoreFeature` | The feature object (same shape as entries in `content.config.tsx`). |
| `repoUrl` | `string` | Full GitHub repo URL for issue links. |

## Usage in MDX

Place it at the top of a feature's detail page:

```mdx
---
title: Frame-Perfect Sync
---

import { CoreFeatureHeader } from '@freemocap/skellydocs';

<CoreFeatureHeader
  feature={{
    id: 'frame-perfect-sync',
    icon: '🔒',
    title: 'Frame-Perfect Sync',
    description: 'A frame-count-gated capture protocol.',
    summary: <>The protocol ensures all cameras stay in lock-step.</>,
    todos: [
      { label: 'Hardware synchronization', issueNum: 1 },
    ],
    docPath: 'core/frame-perfect-sync',
  }}
  repoUrl="https://github.com/freemocap/skellycam"
/>

The rest of your documentation continues here...
```

The header renders a rounded card with the emoji icon on the left and the summary text on the right. If the feature has `todos`, a collapsible `TodoList` appears below the summary.
