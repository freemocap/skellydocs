---
slug: introducing-skellydocs
title: "Introducing @freemocap/skellydocs"
authors:
  - name: FreeMoCap
    url: https://freemocap.org
tags: [release, theme, docusaurus]
---

We extracted the documentation infrastructure from [SkellyCam](https://github.com/freemocap/skellycam) into a standalone npm package so every FreeMoCap project can have consistent, polished docs without duplicating any code.

<!-- truncate -->

## Why

The FreeMoCap ecosystem has multiple sub-projects — SkellyCam (camera sync), SkellyTracker (pose estimation), and FreeMoCap core (full pipeline). Each needs documentation. Without a shared theme, we'd be copy-pasting components, CSS, and configuration across repos, then fixing the same bug in three places when something breaks.

## What's in the package

- **A Docusaurus preset** that replaces ~100 lines of config with a single function call
- **8 theme components** — from the landing page layout to inline tooltips
- **CSS design tokens** — `--sk-*` variables that keep the visual system consistent
- **A CLI scaffolder** — `npx @freemocap/skellydocs init` bootstraps a new docs site in under 2 minutes
- **i18n helpers** — starter locales with human-readable directory names

## The dogfooding part

This site — the one you're reading right now — is built with skellydocs. The landing page uses the same `IndexPage` component that SkellyCam uses. The roadmap pulls from this repo's GitHub issues. If anything in the theme is broken, we hit it here first.

The source lives in [`docs-site/`](https://github.com/freemocap/skellydocs/tree/main/docs-site) in the skellydocs repo. It's both the documentation and a reference implementation.

## Get started

```bash
npx @freemocap/skellydocs init
```

Or read the [docs](/docs/) to learn more.
