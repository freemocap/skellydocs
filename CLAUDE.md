# skellydocs — Project Conventions

## What this is

`@freemocap/skellydocs` is a shared Docusaurus theme package + CLI for FreeMoCap documentation sites. The repo is also a monorepo: `skellydocs-docs/` is the dogfood docs site that uses the theme to document itself.

## Project structure

```
skellydocs/
├── src/                      # Theme package source
│   ├── index.ts              # Package entry — re-exports components + types
│   ├── types.ts              # All shared TypeScript types
│   ├── bin/
│   │   └── create-skellydocs.ts   # CLI scaffolder (Node.js only, not bundled for browser)
│   ├── theme/                # React components (client-side, no Node.js APIs)
│   │   ├── IndexPage.tsx
│   │   ├── RoadmapPage.tsx
│   │   ├── RoadmapContent.tsx
│   │   ├── RoadmapEntry.tsx
│   │   ├── CoreFeatureHeader.tsx
│   │   ├── TodoList.tsx
│   │   ├── Tip.tsx
│   │   └── AiGeneratedBanner.tsx
│   └── css/
│       ├── custom.css         # CSS design tokens (--sk-* variables)
│       └── theme.module.css   # Component styles
├── skellydocs-docs/           # Dogfood Docusaurus site (workspace member)
│   ├── docs/                  # .mdx documentation files
│   ├── blog/                  # .mdx blog posts
│   └── docusaurus.config.ts
├── templates/                 # Handlebars templates for CLI scaffolder
├── dist/                      # Built output (tsup)
├── tsup.config.ts             # Two build configs: theme (unbundled) + CLI (bundled)
└── package.json               # Workspace root
```

## Critical rules

### No Node.js APIs in theme components
Files in `src/theme/` are bundled by Docusaurus's webpack for the browser. **Never** import `node:path`, `node:fs`, `node:url`, or any Node.js built-in in theme components. These belong only in `src/bin/` (the CLI, which is bundled separately by tsup).

### Always use `.mdx` for docs
All documentation and blog files use the `.mdx` extension, not `.md`. This enables JSX component imports and makes the component usage explicit.

### Always add `AiGeneratedBanner`
Every `.mdx` file should import and render the `AiGeneratedBanner` component at the top:

```mdx
import { AiGeneratedBanner } from '@freemocap/skellydocs';

<AiGeneratedBanner />
```

### CSS tokens use `--sk-*` prefix
All design token variables are prefixed with `--sk-` (e.g., `--sk-accent`, `--sk-bg-deep`). Use these tokens in component styles rather than hardcoded values.

## Build & dev commands

```bash
# Build the theme package (must run before docs site)
npm run build

# Dev mode with watch
npm run dev

# Start the docs site (from root, using workspace)
npm start -w skellydocs-docs

# Type check
npm run typecheck

# Release (interactive — prompts for patch/minor/major)
npm run release

# Dry-run release
npm run release -- --dry-run
```

## Workspace setup

`skellydocs-docs/` depends on the root package via `"@freemocap/skellydocs": "file:.."`. After cloning:

```bash
npm install        # Sets up workspace links
npm run build      # Build the theme package
npm start -w skellydocs-docs   # Start the docs dev server
```

## Key architectural decisions

- **tsup builds two separate bundles**: theme components (unbundled, `bundle: false`) and CLI (`bundle: true`). The first config has `clean: true` to wipe `dist/` before building.
- **Theme components are peer-dependent** on React and Docusaurus — they're not bundled with the package.
- **The CLI** (`src/bin/create-skellydocs.ts`) uses Handlebars templates from `templates/` and is the only code that may use Node.js APIs.
- **CSS is exported from source** (`src/css/`), not from `dist/`. The `exports` field in `package.json` maps `./css/*` to `src/css/*`.

## Available skills

- `/create-docs` — Scaffold a new documentation site using skellydocs
