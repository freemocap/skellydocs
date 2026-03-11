---
sidebar_position: 3
title: Tip
---

# Tip

An inline tooltip for progressive disclosure. Renders children with a dotted purple underline; hovering reveals an explanation.

## Import

```tsx
import { Tip } from '@freemocap/skellydocs';
```

## Props

| Prop | Type | Description |
|---|---|---|
| `text` | `string` | The explanation shown in the tooltip on hover. |
| `children` | `ReactNode` | The inline text that gets the dotted underline. |

## Usage in content.config.tsx

The most common use is inside feature summaries in your content config:

```tsx
summary: (
  <>
    A{' '}
    <Tip text="Each camera's grab cycle is gated on relative frame counts">
      frame-count-gated capture protocol
    </Tip>{' '}
    ensures all cameras stay in lock-step.
  </>
),
```

## Usage in MDX

You can also use `Tip` directly in documentation pages:

```mdx
import { Tip } from '@freemocap/skellydocs';

The system uses a
<Tip text="OpenCV's VideoCapture.grab() acquires a frame without decoding it">
  grab/retrieve split
</Tip>
to minimize inter-camera timing spread.
```

## Styling

The tooltip is positioned above the trigger text with a subtle animation. It has a max width of 280px, a dark background matching the theme, and a purple border. The positioning and animation are handled entirely through CSS (no JavaScript for the hover state).
