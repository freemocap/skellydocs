---
sidebar_position: 5
title: Releasing
---

# Releasing

skellydocs uses [release-it](https://github.com/release-it/release-it) for version management. One command handles the full release pipeline.

## The release command

```bash
npm run release
```

This runs an interactive prompt that:

1. Runs `npm run typecheck` and `npm run build` (pre-flight checks)
2. Prompts you to pick patch / minor / major
3. Bumps the `version` in `package.json`
4. Commits with message `chore: release v1.2.3`
5. Creates a git tag `v1.2.3`
6. Pushes the commit and tag to GitHub
7. Creates a GitHub Release with auto-generated release notes

The GitHub Release triggers the `publish.yml` CI workflow, which runs `npm publish`. The npm token only lives in CI — it never touches your local machine.

## Dry run

See what would happen without actually doing anything:

```bash
npm run release -- --dry-run
```

## Version strategy

| Bump | When to use | Example |
|---|---|---|
| **patch** | Bug fixes, style tweaks, typo corrections | `0.1.0` → `0.1.1` |
| **minor** | New components, new preset options, new features | `0.1.1` → `0.2.0` |
| **major** | Breaking changes to config schema or component API | `0.2.0` → `1.0.0` |

## Configuration

The `.release-it.json` at the repo root controls behavior:

```json
{
  "git": {
    "commitMessage": "chore: release v${version}",
    "tagName": "v${version}",
    "requireCleanWorkingDir": true,
    "requireBranch": "main"
  },
  "github": {
    "release": true,
    "releaseName": "v${version}",
    "autoGenerate": true
  },
  "npm": {
    "publish": false
  },
  "hooks": {
    "before:init": ["npm run typecheck", "npm run build"]
  }
}
```

Key settings:

- **`requireCleanWorkingDir`** — won't release with uncommitted changes
- **`requireBranch`** — won't release from feature branches, only `main`
- **`npm.publish: false`** — CI handles the actual npm publish, not your laptop
- **`hooks.before:init`** — typecheck and build must pass before the release proceeds

## GitHub token

release-it needs a GitHub token to create releases. Set the `GITHUB_TOKEN` environment variable with a personal access token that has `Contents: Read and write` permission on the repo.

```bash
export GITHUB_TOKEN="ghp_your_token_here"
```
