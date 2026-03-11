---
sidebar_position: 1
title: Preset & Theme Config
---

# Preset & Theme Config

skellydocs provides two functions that replace the bulk of a `docusaurus.config.ts` file.

## skellyPreset()

A [Docusaurus preset](https://docusaurus.io/docs/using-plugins#using-presets) bundles a theme with plugins and default configuration. `skellyPreset()` wraps `@docusaurus/preset-classic` and adds the skellydocs CSS, sensible blog/docs defaults, and edit URLs pointed at your repo.

```typescript
import { skellyPreset } from '@freemocap/skellydocs';

presets: [
  skellyPreset({
    repo: 'freemocap/skellycam',
    accentColor: '#6ee7b7',
  }),
],
```

### Options

| Option | Type | Required | Default | Description |
|---|---|---|---|---|
| `repo` | `string` | yes | — | GitHub `org/repo` string. Used for edit links, roadmap API calls, and issue links in `TodoList`. |
| `roadmapLabel` | `string` | no | `"roadmap"` | The GitHub label used to fetch issues for the roadmap page. |
| `accentColor` | `string` | no | `"#6ee7b7"` | Hex color that overrides the `--sk-accent` CSS variable. |

### What it configures

Under the hood, `skellyPreset()` returns a `@docusaurus/preset-classic` config with these defaults set:

- **Docs plugin**: route base path `/docs`, edit URLs pointed at `https://github.com/<repo>/tree/main/docs-site/`
- **Blog plugin**: reading time enabled, RSS + Atom feeds, edit URLs
- **Theme**: injects `custom.css` from the skellydocs package (the `--sk-*` design tokens)

## skellyThemeConfig()

Generates the `themeConfig` object for the Docusaurus config. Handles navbar, footer, color mode, Prism syntax highlighting, and mermaid theme.

```typescript
import { skellyThemeConfig } from '@freemocap/skellydocs';

themeConfig: skellyThemeConfig({
  title: 'SkellyCam',
  repo: 'freemocap/skellycam',
  logoSrc: 'img/skellycam-logo.svg',
  logoAlt: 'SkellyCam Logo',
}),
```

### Options

| Option | Type | Required | Default | Description |
|---|---|---|---|---|
| `title` | `string` | yes | — | Displayed in the navbar. |
| `repo` | `string` | yes | — | GitHub `org/repo` — used for navbar GitHub link and footer links. |
| `logoSrc` | `string` | no | `"img/logo.svg"` | Path to the navbar logo image (relative to `static/`). |
| `logoAlt` | `string` | no | `"<title> Logo"` | Alt text for the navbar logo. |

### What it configures

- **Color mode**: dark by default, respects system preference
- **Navbar**: project title + logo, Docs/Blog/Roadmap links, GitHub link, locale dropdown
- **Footer**: three-column layout with Documentation, Community, and More sections
- **Prism**: GitHub (light) and Dracula (dark) themes, with bash/JSON/Python/TypeScript languages
- **Mermaid**: neutral light theme, dark dark theme

## How this site uses it

This documentation site is built with the exact same preset. Here's the full `docusaurus.config.ts`:

```typescript
import { skellyPreset, skellyThemeConfig, defaultLocales } from '@freemocap/skellydocs';
import type { Config } from '@docusaurus/types';

const config: Config = {
  title: 'skellydocs',
  tagline: 'Shared documentation theme for FreeMoCap projects',
  favicon: 'img/favicon.ico',
  url: 'https://freemocap.github.io',
  baseUrl: '/skellydocs/',

  future: { v4: true },
  onBrokenLinks: 'throw',
  markdown: { mermaid: true },
  themes: ['@docusaurus/theme-mermaid'],

  i18n: defaultLocales(),

  presets: [
    skellyPreset({
      repo: 'freemocap/skellydocs',
      accentColor: '#a78bfa',
    }),
  ],

  themeConfig: skellyThemeConfig({
    title: 'skellydocs',
    repo: 'freemocap/skellydocs',
  }),
};

export default config;
```

Notice the `accentColor` is `#a78bfa` (purple) instead of the default green — that's how each project gets its own color identity while sharing the same theme.
