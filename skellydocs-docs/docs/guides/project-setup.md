---
sidebar_position: 1
title: Project Setup
---

# Setting up a new docs site

## Scaffold with the CLI

The fastest way to get started is the interactive CLI:

```bash
npx @freemocap/skellydocs init
```

This generates a ready-to-run docs site:

```
your-project-docs/
├── docs/
│   └── intro.md
├── src/pages/
│   ├── index.tsx          # Wrapper around IndexPage
│   └── roadmap.tsx        # Wrapper around RoadmapPage
├── content.config.tsx     # Your project's features, hero, guarantees
├── docusaurus.config.ts   # Site configuration
├── sidebars.ts
└── package.json
```

## Add to an existing Docusaurus site

If you already have a Docusaurus site:

```bash
npm install @freemocap/skellydocs
```

Then update your `docusaurus.config.ts` to use the skellydocs CSS and components.

## Project structure

Your docs site only needs to contain **content** — markdown files, images, and configuration. All theme components, styling, and shared logic come from the `@freemocap/skellydocs` package.

### Key files

| File | Purpose |
|---|---|
| `content.config.tsx` | Landing page content: hero, features, guarantees |
| `docusaurus.config.ts` | Docusaurus site configuration |
| `docs/` | Your markdown documentation |
| `static/img/` | Images, logos, favicons |
| `src/pages/` | Custom pages (index, roadmap) |
