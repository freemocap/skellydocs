# @freemocap/skellydocs — Implementation Guide

This guide walks you through extracting the docs theme from SkellyCam into a standalone npm package, publishing it, and converting SkellyCam to consume it. It assumes you know GitHub/git well but have never published to npm.

---

## Part 0: What You're Building

The end result is a new repo `freemocap/skellydocs` that publishes the npm package `@freemocap/skellydocs`. This package contains:

- **Theme components** — Tip, TodoList, CoreFeatureHeader, RoadmapEntry, RoadmapContent, IndexPage, RoadmapPage, AiGeneratedBanner
- **CSS** — `custom.css` (design tokens) and `theme.module.css` (all component styles)
- **Preset** — `skellyPreset()` wraps `@docusaurus/preset-classic` with sensible defaults
- **Helpers** — `defaultLocales()`, `skellyThemeConfig()`
- **CLI scaffolder** — `npx @freemocap/skellydocs init` to bootstrap new docs sites
- **Handlebars templates** — for the CLI to generate starter files

The package source tree I've generated for you is ready to go. Here's the full structure:

```
skellydocs/
├── .github/workflows/
│   ├── ci.yml                     # Build + typecheck + docs-site build on PRs
│   ├── publish.yml                # Publish to npm on GitHub Release
│   └── deploy-docs.yml           # Deploy docs-site to GitHub Pages on push to main
├── src/
│   ├── index.ts                   # Package entry point (re-exports everything)
│   ├── preset.ts                  # skellyPreset() + skellyThemeConfig()
│   ├── locales.ts                 # defaultLocales() helper
│   ├── types.ts                   # All shared TypeScript types
│   ├── bin/
│   │   └── create-skellydocs.ts   # CLI scaffolder
│   ├── theme/
│   │   ├── Tip.tsx
│   │   ├── TodoList.tsx
│   │   ├── CoreFeatureHeader.tsx
│   │   ├── RoadmapEntry.tsx
│   │   ├── RoadmapContent.tsx
│   │   ├── IndexPage.tsx
│   │   ├── RoadmapPage.tsx
│   │   └── AiGeneratedBanner.tsx
│   └── css/
│       ├── custom.css             # --sk-* design tokens
│       └── theme.module.css       # All component styles
├── docs-site/                     # skellydocs' own docs, built with itself
│   ├── docs/                      # Documentation pages (intro, guides, components)
│   ├── blog/                      # Blog posts
│   ├── src/pages/                 # Thin wrappers (index.tsx, roadmap.tsx)
│   ├── content.config.tsx         # skellydocs describes its own features
│   ├── docusaurus.config.ts       # Uses skellyPreset() — dogfooding
│   └── package.json               # Workspace package
├── static/img/                    # Default assets (add logo.svg, favicon.ico)
├── templates/
│   ├── docusaurus.config.ts.hbs
│   ├── content.config.tsx.hbs
│   ├── package.json.hbs
│   └── docs/
│       └── intro.md.hbs
├── package.json                   # Workspace root
├── tsconfig.json
├── tsup.config.ts
├── .release-it.json               # release-it config (version bump + GitHub Release)
├── .gitignore
└── README.md
```

The `docs-site/` directory is the package's own documentation site, built with itself (dogfooding). It uses `skellyPreset()`, `IndexPage`, `RoadmapPage`, and `content.config.tsx` exactly like a consuming repo would. This means CI catches theme regressions on every PR, and the deployed site at `freemocap.github.io/skellydocs/` serves as both documentation and a live reference implementation.

The workspace root `package.json` has a `workspaces: ["docs-site"]` field so `docs-site/` can depend on `@freemocap/skellydocs` and resolve it to the local source. The docs-site is not published to npm — it's excluded by the `files` allowlist.

---

## Part 1: npm Crash Course (for PyPI people)

Here's the mental model translation from Python/PyPI to Node/npm:

| Python concept | npm equivalent |
|---|---|
| `pip` | `npm` |
| `pypi.org` | `npmjs.com` |
| PyPI account | npm account |
| `setup.py` / `pyproject.toml` | `package.json` |
| `twine upload` | `npm publish` |
| `pip install foo` | `npm install foo` |
| PyPI org/namespace | npm **scope** (`@freemocap/`) |
| `__version__` in code | `version` field in `package.json` |
| `bumpver` | `release-it` |
| GitHub Actions `pypi-publish` | GitHub Actions with `NODE_AUTH_TOKEN` |

Key differences to internalize:

1. **Scoped packages**: The `@freemocap/` prefix is an npm "scope." It's like a namespace. You need an npm **organization** to publish scoped packages. The org name matches the scope.

2. **No `dist/` upload**: Unlike PyPI where you build a wheel/sdist and upload it, with npm you publish the entire package directory. The `files` field in `package.json` controls what gets included (like a `.gitignore` but inverted — it's an allowlist).

3. **`npm publish --access public`**: Scoped packages default to private (paid feature). You must pass `--access public` to publish a free scoped package.

4. **Version bumping**: We use `release-it` (the npm-world equivalent of `bumpver`). One interactive command — `npm run release` — bumps the version, commits, tags, pushes, and creates a GitHub Release. CI then handles the actual npm publish.

---

## Part 2: One-Time npm Setup

### 2.1 — Create an npm account

Go to https://www.npmjs.com/signup and create an account. Use whatever email you like. Enable 2FA (they'll push you to do this).

### 2.2 — Create the `@freemocap` npm organization

1. Log into npmjs.com
2. Click your avatar → "Add an Organization"
3. Name it `freemocap` (this creates the `@freemocap` scope)
4. Choose the **free** plan (unlimited public packages)
5. Skip inviting members for now (you can add collaborators later)

If the org name `freemocap` is already taken on npm, you'll need to either claim it (if you own the corresponding GitHub org) or pick a different scope.

### 2.3 — Create an npm access token (for GitHub Actions)

1. On npmjs.com → click your avatar → "Access Tokens"
2. Click "Generate New Token" → choose **"Granular Access Token"**
3. Give it a name like `github-actions-skellydocs`
4. Set **Expiration** to something reasonable (90 days, or custom)
5. Under **Packages and scopes**: select "Read and write"
6. Under **Select packages**: choose "All packages" or specifically `@freemocap/skellydocs`
7. Click "Generate Token"
8. **Copy the token immediately** — you won't see it again

### 2.4 — Add the npm token to GitHub

1. Go to `github.com/freemocap/skellydocs` → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `NPM_TOKEN`
4. Value: paste the token from step 2.3
5. Click "Add secret"

This is the same pattern as adding a PyPI token to GitHub secrets for `pypi-publish`. The GitHub Actions workflow references it as `${{ secrets.NPM_TOKEN }}`.

---

## Part 3: Create the GitHub Repo and Push the Package

### 3.1 — Create the repo

Go to github.com/freemocap and create a new repo called `skellydocs`. Public, no template, no README (we'll push our own).

### 3.2 — Initialize and push

The package source code I've generated is in the zip file alongside this guide. Extract it and:

```bash
cd skellydocs

# Initialize git
git init
git add .
git commit -m "Initial commit: @freemocap/skellydocs theme package"

# Connect to GitHub and push
git remote add origin git@github.com:freemocap/skellydocs.git
git branch -M main
git push -u origin main
```

### 3.3 — Verify CI passes

After pushing, go to the Actions tab on GitHub. You should see the CI workflow running. It should:
1. Install dependencies
2. Run `tsc --noEmit` (typecheck)
3. Run `tsup` (build)

If it passes, you're ready to publish.

---

## Part 4: First Publish to npm

The very first publish must be done manually because the `release-it` + CI pipeline isn't set up yet (no GitHub Release exists to trigger the workflow). After this one-time manual publish, all subsequent releases go through `release-it`.

```bash
cd skellydocs

# Install dependencies
npm install

# Build the package
npm run build

# Log in to npm (this will open a browser for 2FA)
npm login

# Verify you're logged in to the right account
npm whoami

# Do a dry run first to see what would be published
npm publish --access public --dry-run

# If the dry run looks good, publish for real
npm publish --access public
```

The `--access public` flag is required because `@freemocap/skellydocs` is a scoped package and scoped packages default to private (which requires a paid plan).

After publishing, go to `https://www.npmjs.com/package/@freemocap/skellydocs` — you should see your package.

---

## Part 5: The Release Workflow Going Forward (release-it)

For all releases after the first, you use `release-it`. This is the npm equivalent of `bumpver` — one interactive command that handles everything.

### What release-it does

When you run `npm run release`, release-it:

1. Runs `npm run typecheck` and `npm run build` (pre-release safety checks, configured in `.release-it.json` hooks)
2. Prompts you to pick patch/minor/major (interactive, like bumpver)
3. Bumps `version` in `package.json`
4. Commits with message `chore: release v1.2.3`
5. Creates git tag `v1.2.3`
6. Pushes the commit and tag to GitHub
7. Creates a GitHub Release with auto-generated release notes

That GitHub Release creation triggers the `publish.yml` workflow in CI, which does the actual `npm publish`. This means the npm token never touches your local machine — it only lives in CI.

### The full release flow

```bash
# 1. Make your changes, commit them, push to main
git add .
git commit -m "feat: add new component"
git push

# 2. Run release-it (that's it — one command)
npm run release
```

release-it will show you an interactive prompt like this:

```
🚀 Let's release @freemocap/skellydocs (currently at 0.1.0)

? Select increment (next version):
  ❯ patch (0.1.1)
    minor (0.2.0)
    major (1.0.0)
    prepatch (0.1.1-0)
    Other, please specify...
```

Pick your version, confirm the prompts, and it handles everything. Then check the Actions tab on GitHub to verify the CI publish succeeded.

### Dry run

To see what release-it would do without actually doing anything:

```bash
npm run release -- --dry-run
```

### The .release-it.json config

Here's what's in the config and why:

```json
{
  "git": {
    "commitMessage": "chore: release v${version}",
    "tagName": "v${version}",
    "requireCleanWorkingDir": true,   // Won't release with uncommitted changes
    "requireBranch": "main"           // Won't release from feature branches
  },
  "github": {
    "release": true,                  // Creates a GitHub Release automatically
    "releaseName": "v${version}",
    "autoGenerate": true              // Auto-generates release notes from commits
  },
  "npm": {
    "publish": false                  // CI handles npm publish, not your laptop
  },
  "hooks": {
    "before:init": ["npm run typecheck", "npm run build"]
  }
}
```

### First time running release-it

The first time release-it tries to create a GitHub Release, it needs a GitHub token. It will prompt you. You can either:

1. Set the `GITHUB_TOKEN` environment variable (e.g. a GitHub personal access token with `repo` scope)
2. Or let release-it prompt you interactively

To create the token: GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate. Give it `Contents: Read and write` permission on the `freemocap/skellydocs` repo.

You can store it so you don't get prompted every time:

```bash
export GITHUB_TOKEN="ghp_your_token_here"

# Or add to your shell profile (~/.zshrc, ~/.bashrc, etc.)
echo 'export GITHUB_TOKEN="ghp_your_token_here"' >> ~/.zshrc
```

### Recovering from a bad publish

If you publish something broken:

```bash
# Unpublish within 72 hours (npm policy)
npm unpublish @freemocap/skellydocs@0.1.1

# Or deprecate it (always available, doesn't remove it)
npm deprecate @freemocap/skellydocs@0.1.1 "broken release, use 0.1.2"
```

---

## Part 6: Convert SkellyCam Docs to Consume the Theme

Once `@freemocap/skellydocs` is published, convert the existing `skellycam-docs/` to use it.

### 6.1 — What to keep in skellycam-docs/

```
skellycam-docs/
├── docs/                          # KEEP — all your markdown/MDX content
│   ├── intro.md
│   ├── getting-started.md
│   ├── core/
│   └── ...
├── blog/                          # KEEP — blog posts
├── static/                        # KEEP — project-specific images
│   └── img/
│       ├── skellycam-logo.svg
│       ├── skellycam-logo.png
│       └── skellycam-favicon.ico
├── src/
│   └── pages/
│       ├── index.tsx              # REPLACE — thin wrapper (5 lines)
│       ├── roadmap.tsx            # REPLACE — thin wrapper (4 lines)
│       └── download.tsx           # KEEP — this is SkellyCam-specific
├── content.config.tsx              # NEW — extracted from src/data/core-features.tsx
├── docusaurus.config.ts           # REPLACE — shrinks to ~25 lines
├── sidebars.ts                    # KEEP — unchanged
└── package.json                   # UPDATE — add @freemocap/skellydocs dependency
```

### 6.2 — What to delete from skellycam-docs/

```
DELETE: src/components/             # All components (now in the package)
DELETE: src/css/                    # All CSS (now in the package)
DELETE: src/data/                   # Types + features (now in package + content.config.tsx)
DELETE: src/theme/DocItem/          # Theme override (now in package, if you keep it)
DELETE: i18n/                       # All 40+ locale directories (replaced with 4)
```

### 6.3 — New files to create

**`skellycam-docs/content.config.tsx`** — This is the data from `src/data/core-features.tsx` restructured into the `SkellyDocsConfig` format:

```typescript
import type { SkellyDocsConfig } from '@freemocap/skellydocs';
import { Tip } from '@freemocap/skellydocs';

const config: SkellyDocsConfig = {
  hero: {
    title: 'SkellyCam',
    accentedSuffix: 'Cam',
    subtitle: 'The camera backend for FreeMoCap',
    tagline: 'Frame-perfect multi-camera synchronization for USB webcams',
    logoSrc: '/skellycam/img/skellycam-logo.svg',
    parentProject: {
      name: 'FreeMoCap',
      url: 'https://freemocap.org',
    },
  },

  features: [
    {
      id: 'frame-perfect-sync',
      icon: '🔒',
      title: 'Frame-Perfect Sync',
      description:
        'A frame-count-gated capture protocol ensures all cameras stay in lock-step.',
      summary: (
        <>
          A{' '}
          <Tip text="Each camera's grab cycle is gated on relative frame counts so no camera ever gets ahead of the others">
            frame-count-gated capture protocol
          </Tip>{' '}
          ensures all cameras stay in lock-step. The OpenCV grab/retrieve split
          minimizes inter-camera timing spread so every recorded video has{' '}
          <strong>identical frame counts</strong> — no drift, no dropped frames.
        </>
      ),
      todos: [
        { label: 'Hardware synchronization (external trigger)', issueNum: 1 },
        { label: 'Target frame rate setting', issueNum: 2 },
        { label: 'Sub-frame synchronization', issueNum: 3 },
      ],
      docPath: 'core/frame-perfect-sync',
    },
    {
      id: 'generic-usb-cameras',
      icon: '🎥',
      title: 'Generic USB Cameras',
      description:
        'Works with any standard UVC-compliant USB webcam. No proprietary hardware needed.',
      summary: (
        <>
          SkellyCam works with <strong>any standard USB webcam</strong>. If your
          camera is{' '}
          <Tip text="USB Video Class — the standard protocol used by virtually all USB webcams, no special drivers needed">
            UVC-compliant
          </Tip>
          , it will work out of the box. No proprietary hardware, no special
          drivers — grab whatever cameras you have and start capturing.
        </>
      ),
      todos: [
        { label: 'OpenCV VideoCapture backend alternatives', issueNum: 4 },
        { label: 'Support for non-UVC camera backends', issueNum: 5 },
        { label: 'Camera capability auto-detection', issueNum: 6 },
      ],
      docPath: 'core/generic-usb-cameras',
    },
    {
      id: 'real-time-streaming',
      icon: '📡',
      title: 'Real-Time Streaming',
      description:
        'WebSocket protocol streams multi-camera frames to the frontend.',
      summary: (
        <>
          A compact binary{' '}
          <Tip text="Multi-camera frames are JPEG-compressed and packed into a single binary WebSocket message">
            WebSocket protocol
          </Tip>{' '}
          streams multi-camera frames to the React/Electron frontend with
          built-in backpressure management. The API treats a multi-camera group
          with the same expectations as a singular camera — a consistent frame
          rate delivering <strong>one image per camera per frame</strong>.
        </>
      ),
      todos: [
        { label: 'UDP transport for high-throughput streaming', issueNum: 7 },
        { label: 'Python client library', issueNum: 8 },
        { label: 'Remote streaming support', issueNum: 9 },
        { label: 'Adaptive resolution scaling', issueNum: 10 },
      ],
      docPath: 'core/real-time-streaming',
    },
    {
      id: 'precise-timestamps',
      icon: '⏱️',
      title: 'Precise Timestamps',
      description:
        'High-resolution timestamps at every stage of the capture pipeline.',
      summary: (
        <>
          Most USB cameras do <em>not</em> record real timestamps.{' '}
          <Tip text="High-resolution perf_counter_ns timestamps at multiple lifecycle stages: pre-grab, post-grab, pre-retrieve, post-retrieve, copy, record">
            SkellyCam captures precise timestamps
          </Tip>{' '}
          for every camera at every stage of the capture pipeline, plus the
          multi-camera stream — all in <strong>human-readable format</strong>{' '}
          with pre-calculated inter-camera synchronization statistics.
        </>
      ),
      todos: [
        { label: 'Clean up data model to tidy format', issueNum: 11 },
      ],
      docPath: 'core/precise-timestamps',
    },
  ],

  guarantees: [
    'All recorded videos have <strong>precisely the same frame count</strong>',
    'Each multi-frame payload contains <strong>exactly one image per camera</strong>, recorded at the same time slice',
  ],

  guaranteeTodos: [
    {
      label: 'Recordings guaranteed to complete on crash (hybrid MP4 codec)',
      issueNum: 12,
    },
  ],
};

export default config;
```

**`skellycam-docs/src/pages/index.tsx`** (replaces the current 90-line file):

```typescript
import { IndexPage } from '@freemocap/skellydocs';
import config from '../../content.config';

const REPO = 'freemocap/skellycam';

export default function Home() {
  return <IndexPage config={config} repo={REPO} />;
}
```

**`skellycam-docs/src/pages/roadmap.tsx`** (replaces the current file):

```typescript
import { RoadmapPage } from '@freemocap/skellydocs';

const REPO = 'freemocap/skellycam';

export default function Roadmap() {
  return <RoadmapPage repo={REPO} />;
}
```

**`skellycam-docs/docusaurus.config.ts`** (replaces the current 160-line file):

```typescript
import { skellyPreset, skellyThemeConfig, defaultLocales } from '@freemocap/skellydocs';
import type { Config } from '@docusaurus/types';

const config: Config = {
  title: 'SkellyCam',
  tagline: 'Frame-perfect multi-camera synchronization for USB webcams',
  favicon: 'img/skellycam-favicon.ico',

  future: { v4: true },

  url: 'https://freemocap.github.io',
  baseUrl: '/skellycam/',

  organizationName: 'freemocap',
  projectName: 'skellycam',

  onBrokenLinks: 'throw',

  markdown: { mermaid: true },

  themes: ['@docusaurus/theme-mermaid'],

  i18n: defaultLocales(),

  presets: [
    skellyPreset({
      repo: 'freemocap/skellycam',
      accentColor: '#6ee7b7',
    }),
  ],

  themeConfig: skellyThemeConfig({
    title: 'SkellyCam',
    repo: 'freemocap/skellycam',
    logoSrc: 'img/skellycam-logo.svg',
    logoAlt: 'SkellyCam Logo',
  }),
};

export default config;
```

### 6.4 — Update package.json

Add the theme dependency:

```bash
cd skellycam-docs
npm install @freemocap/skellydocs
```

This adds it to `dependencies` in `package.json`. You can remove `clsx` if nothing else uses it.

### 6.5 — Validate

```bash
cd skellycam-docs
npm start
```

The site should build and look identical to the current version. If something's off, it's likely an import path issue — check the browser console.

---

## Part 7: Key Decisions and Tradeoffs

### Why the consuming repo still has `src/pages/`

The design doc says "No `src/` folder." In practice, the IndexPage needs access to `content.config.tsx` which contains TSX markup (the `<Tip>` components in feature summaries). TSX markup can't be serialized through Docusaurus's `globalData`/`usePluginData()` pipeline — it's JSON-only.

So the consuming repo keeps a tiny `src/pages/` with 3-5 line `.tsx` wrapper files. This is a pragmatic compromise: the repo still has zero custom components, zero CSS, and zero complex logic. The `src/pages/` files are pure glue.

A future version could move to a fully plugin-based approach where the content config uses string IDs instead of TSX markup, and the theme resolves components at render time. But that's a lot of complexity for minimal gain right now.

### What about DocFeedback and the DocItem theme override?

The current SkellyCam has:
- `DocFeedback.tsx` — sends telemetry to skellypings
- `src/theme/DocItem/Layout/index.tsx` — wraps every doc page with AiGeneratedBanner + DocFeedback

These are SkellyCam-specific (the telemetry URL, the specific repo links). For v1, keep them in the SkellyCam repo's `src/theme/` directory as local overrides. When a second repo needs similar functionality, factor them into the package with configuration options.

### The download page

`download.tsx` is SkellyCam-specific (it iframes a SkellyCam download page). It stays in the consuming repo.

---

## Part 8: Phase 2+ Roadmap

Once Phase 1 is done and SkellyCam is consuming the theme:

**Phase 2: CLI improvements**
- Implement the `translate` subcommand
- Add `--template` flag to `init` for different project types

**Phase 3: Roll out**
- Run `npx @freemocap/skellydocs init` for SkellyTracker
- Fill in SkellyTracker-specific content.config.tsx
- Verify it builds, deploy

**Phase 4: Iterate**
- Move DocFeedback into the package (parameterized by repo)
- Move the DocItem theme override into the package
- Add the download page pattern (if other repos need it)
- Implement the plugin-based data approach to eliminate `src/pages/`

---

## Quick Reference: Common npm Commands

```bash
# Install dependencies (like pip install -r requirements.txt)
npm install

# Add a dependency (like pip install foo)
npm install @freemocap/skellydocs

# Add a dev dependency
npm install --save-dev typescript

# Run a script defined in package.json
npm run build
npm start          # shorthand for npm run start

# ── Releasing (via release-it) ──

# Release (interactive prompt for version bump — the main command you'll use)
npm run release

# Dry run (see what would happen without doing anything)
npm run release -- --dry-run

# ── Manual npm commands (you mostly won't need these) ──

# Check what would be published
npm publish --dry-run

# First-time manual publish (only needed once, before release-it pipeline exists)
npm publish --access public

# Check who you're logged in as
npm whoami

# Log in
npm login

# View package info
npm info @freemocap/skellydocs

# See what files would be in the published package
npm pack --dry-run
```

---

## Checklist

- [ ] Create npm account at npmjs.com
- [ ] Create `@freemocap` organization on npm
- [ ] Create npm access token (granular, read+write)
- [ ] Create `freemocap/skellydocs` GitHub repo
- [ ] Add `NPM_TOKEN` secret to the GitHub repo
- [ ] Push the package source code
- [ ] Verify CI passes (should also build the docs-site)
- [ ] Enable GitHub Pages: repo Settings → Pages → Source: "GitHub Actions"
- [ ] Verify docs site deploys to `freemocap.github.io/skellydocs/`
- [ ] First publish: `npm login && npm publish --access public`
- [ ] Verify package exists on npmjs.com
- [ ] Create a GitHub personal access token for release-it (`Contents: Read and write`)
- [ ] Set `GITHUB_TOKEN` in your shell profile
- [ ] Test the release pipeline: `npm run release -- --dry-run`
- [ ] Add `@freemocap/skellydocs` to skellycam-docs `package.json`
- [ ] Replace skellycam-docs files per Part 6
- [ ] Delete old components/CSS/i18n from skellycam-docs
- [ ] Verify `npm start` still builds and looks identical
- [ ] Commit and push the skellycam-docs changes
