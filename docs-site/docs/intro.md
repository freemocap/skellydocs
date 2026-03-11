---
sidebar_position: 1
title: What is skellydocs?
slug: /
---

# What is skellydocs?

skellydocs is a shared [Docusaurus](https://docusaurus.io/) theme package for [FreeMoCap](https://freemocap.org) projects. It provides a complete documentation site setup — theme components, CSS design tokens, a Docusaurus preset, i18n helpers, and a CLI scaffolder — in a single npm package.

## The problem

Every FreeMoCap sub-project (SkellyCam, SkellyTracker, FreeMoCap core, etc.) needs a docs site. Without a shared theme, each repo would duplicate hundreds of lines of components, CSS, and configuration. Bugs get fixed in one repo but not the others. Visual consistency drifts over time.

## The solution

With skellydocs, each repo's docs folder contains **only content**: markdown pages, images, blog posts, and a thin config file. Everything else — the landing page layout, the roadmap integration, the dark-mode design, the component library — comes from this package.

## This site is the proof

You're reading the skellydocs documentation site, which is built with skellydocs. The landing page you came from uses the same `IndexPage` component that SkellyCam and SkellyTracker use. The [roadmap](/roadmap) pulls issues from this repo's GitHub issues. The design tokens, the tooltip component, the feature cards — all the same package.

The source for this site lives in the [`docs-site/`](https://github.com/freemocap/skellydocs/tree/main/docs-site) directory of the skellydocs repo. It's a reference implementation you can study alongside the docs.

## Next steps

- **[Scaffold a new site](/docs/getting-started/scaffold)** — create a docs site in under 2 minutes with the CLI
- **[Manual setup](/docs/getting-started/manual-setup)** — add skellydocs to an existing Docusaurus site
- **[Preset reference](/docs/guides/preset)** — understand what `skellyPreset()` configures for you
- **[Component reference](/docs/components/index-page)** — explore the theme components
