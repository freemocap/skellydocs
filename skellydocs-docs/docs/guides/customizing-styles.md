---
sidebar_position: 3
title: Customizing Styles
---

# Customizing styles

skellydocs uses CSS custom properties (design tokens) prefixed with `--sk-*`. Override these in your own CSS to customize the look of your site.

## Design tokens

| Token | Default | Purpose |
|---|---|---|
| `--sk-bg-deep` | `#06050e` | Page background |
| `--sk-bg-surface` | `#0e0c1a` | Card/surface background |
| `--sk-border` | `#1a1730` | Borders and dividers |
| `--sk-text` | `#e8e6f0` | Primary text |
| `--sk-text-dim` | `#8a87a0` | Secondary/muted text |
| `--sk-accent` | `#6ee7b7` | Accent color |
| `--sk-accent-dim` | `rgba(110,231,183,0.15)` | Accent background tint |
| `--sk-purple` | `#a78bfa` | Secondary accent (links, badges) |

## Changing the accent color

To give your project its own color identity, override `--sk-accent` in your site's CSS:

```css title="src/css/custom.css"
:root {
  --sk-accent: #f472b6;  /* pink */
  --sk-accent-dim: rgba(244, 114, 182, 0.15);
}
```

All components that use the accent color will automatically update.

## Font stack

The theme uses **JetBrains Mono** for monospace text (`--sk-mono`). The system font stack is used for body text to keep things fast and native-feeling.
