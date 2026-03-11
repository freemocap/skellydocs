---
sidebar_position: 4
title: TodoList
---

# TodoList

A collapsible "Roadmap" section that links each item to a GitHub issue. Used inside feature cards and the guarantees section on the landing page.

## Import

```tsx
import { TodoList } from '@freemocap/skellydocs';
```

## Props

| Prop | Type | Description |
|---|---|---|
| `items` | `TodoItem[]` | Array of roadmap items to display. |
| `repoUrl` | `string` | Full GitHub repo URL, e.g. `"https://github.com/freemocap/skellycam"`. Used to construct issue links. |

```typescript
type TodoItem = {
  label: string;      // Display text
  issueNum: number;   // GitHub issue number
};
```

## Behavior

- Collapsed by default — shows a "Roadmap" toggle with an item count badge
- Clicking the toggle expands the list
- Each item links to `{repoUrl}/issues/{issueNum}` in a new tab
- Click events don't propagate — so if the TodoList is inside a `<Link>` wrapper (like on feature cards), clicking the toggle or an item doesn't trigger navigation

## Usage

You typically don't use `TodoList` directly — it's used automatically by `IndexPage` (in feature cards and guarantees) and by `CoreFeatureHeader`. But it's exported if you need it in custom pages:

```tsx
import { TodoList } from '@freemocap/skellydocs';

<TodoList
  items={[
    { label: 'Hardware synchronization', issueNum: 1 },
    { label: 'Target frame rate setting', issueNum: 2 },
  ]}
  repoUrl="https://github.com/freemocap/skellycam"
/>
```
