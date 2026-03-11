---
sidebar_position: 3
title: CSS Design Tokens
---

# CSS Design Tokens

The theme defines `--sk-*` CSS variables in `custom.css`. All component styles in `theme.module.css` reference these tokens, keeping the visual system consistent and overridable.

## Token reference

| Token | Default | Purpose |
|---|---|---|
| `--sk-bg-deep` | `#06050e` | Page background |
| `--sk-bg-surface` | `#0e0c1a` | Card and surface backgrounds |
| `--sk-border` | `#1a1730` | Borders, dividers, subtle outlines |
| `--sk-text` | `#e8e6f0` | Primary text color |
| `--sk-text-dim` | `#8a87a0` | Secondary/muted text |
| `--sk-accent` | `#6ee7b7` | Primary accent (CTAs, highlights, check marks) |
| `--sk-accent-dim` | `rgba(110,231,183,0.15)` | Accent background tint |
| `--sk-purple` | `#a78bfa` | Secondary accent (links, badges, active states) |
| `--sk-purple-dim` | `rgba(167,139,250,0.1)` | Purple background tint |
| `--sk-mono` | JetBrains Mono, Fira Code, ui-monospace | Monospace font stack |

## Overriding the accent color

The simplest customization is changing the accent color. Pass `accentColor` to the preset:

```typescript
skellyPreset({
  repo: 'freemocap/skellycam',
  accentColor: '#6ee7b7',   // green for SkellyCam
}),
```

This overrides `--sk-accent`. The rest of the palette — backgrounds, borders, text colors — stays the same, so all projects look like they belong to the same family while having their own color identity.

## How this site uses it

This documentation site uses `accentColor: '#a78bfa'` (purple) instead of the default green. Every accent-colored element on this page — the "Docs" highlighted text in the hero, the check marks in the guarantees section, the CTA button — picks up that purple automatically through the CSS variable.

## Docusaurus theme variables

The package also configures Docusaurus's own `--ifm-*` variables in both light and dark mode. In dark mode, the primary color is set to `#a78bfa` (purple), and the background colors are set to the deep dark values that match the `--sk-*` palette.

## The font stack

JetBrains Mono is loaded from Google Fonts and used for headings, code, and UI chrome (buttons, badges, navigation). Body text uses Docusaurus's default system font stack.
