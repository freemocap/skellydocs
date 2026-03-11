---
sidebar_position: 1
title: Scaffold a New Site
---

# Scaffold a New Site

The fastest way to create a new docs site is the CLI scaffolder. One command, four prompts, and you're running.

## Run the scaffolder

```bash
npx @freemocap/skellydocs init
```

You'll be asked:

| Prompt | Example | What it does |
|---|---|---|
| **Project name** | `SkellyCam` | Used in the page title, hero section, and config |
| **GitHub repo** | `freemocap/skellycam` | Wires up edit links, roadmap API, and issue links |
| **Base URL** | `/skellycam/` | The path prefix (for GitHub Pages: `/<repo-name>/`) |
| **Accent color** | `#6ee7b7` | Overrides the `--sk-accent` CSS variable |
| **Target directory** | `./docs-site` | Where the generated files go |

## What gets generated

```
docs-site/
├── docs/
│   └── intro.md               # Starter doc page
├── src/pages/
│   ├── index.tsx               # 5-line wrapper around IndexPage
│   └── roadmap.tsx             # 4-line wrapper around RoadmapPage
├── content.config.tsx          # Your features, hero text, guarantees
├── docusaurus.config.ts        # ~25 lines — delegates to the preset
├── sidebars.ts                 # Auto-generated sidebar
└── package.json                # Just the theme dep + Docusaurus
```

No `src/components/`. No `src/css/`. Just content and thin wiring.

## Start it up

```bash
cd docs-site
npm install
npm start
```

The site launches at `http://localhost:3000` with the full theme applied — hero section, feature cards, guarantees, and a roadmap page that pulls from your GitHub issues.

## What to do next

1. **Edit `content.config.tsx`** — replace the placeholder features with your project's real features. See [Content Config](/docs/guides/content-config) for the full type reference.
2. **Write docs** — add markdown/MDX files to `docs/`. The sidebar auto-generates from the directory structure.
3. **Add images** — drop your logo into `static/img/logo.svg`. It overrides the default FreeMoCap logo automatically.
4. **Deploy** — the generated `package.json` includes a `build` script. Use GitHub Actions to deploy to GitHub Pages, Vercel, Netlify, or wherever you like.
