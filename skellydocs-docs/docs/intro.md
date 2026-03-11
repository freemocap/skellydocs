---
sidebar_position: 1
title: Introduction
---

# Welcome to skellydocs 📖

**skellydocs** is a shared [Docusaurus](https://docusaurus.io/) theme and toolkit for [FreeMoCap](https://freemocap.org) documentation sites.

Every FreeMoCap sub-project — SkellyCam, SkellyTracker, FreeMoCap core — gets the same dark-theme design, GitHub-integrated roadmap, interactive feature cards, and i18n setup without duplicating a single component or CSS file.

Each repo's docs folder contains **only content** (markdown, images, and a thin config). Everything else comes from this package.

## What's in the box

| Feature | Description |
|---|---|
| **Theme components** | `IndexPage`, `RoadmapPage`, `Tip`, `TodoList`, and more |
| **CSS design tokens** | `--sk-*` variables for consistent styling across all sites |
| **CLI scaffolder** | `npx @freemocap/skellydocs init` to bootstrap a new docs site |
| **i18n helpers** | Pre-configured locale setup with human-readable directory names |

## Quick start

```bash
npx @freemocap/skellydocs init
```

You'll be prompted for your project name, GitHub repo, and base URL. Then:

```bash
cd your-project-docs
npm install
npm start
```

That's it — you'll have a fully styled docs site running locally.
