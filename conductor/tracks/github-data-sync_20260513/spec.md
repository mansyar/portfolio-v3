# Specification: Track 3A — GitHub Data Sync

## Overview

Build-time GitHub API fetching to populate project metadata (star count, last commit date, language) and merge it into the content pipeline. Also inherits two deferred features from Track 2A: (1) dynamic FILE_SYSTEM population from content collections at build time (replacing the static tree), and (2) full MDX project body rendering in the Explorer detail pane. All pre-build steps are orchestrated via a single `scripts/prebuild.mjs` entry point.

## References

- [PRD §6](../docs/PRD.md#6-devops--deployment-strategy) — Data Sync & Build Pipeline
- [TDD §4.2](../docs/TDD.md#42-github-api-data-shape) — GitHub API Data Shape
- [TDD §11](../docs/TDD.md#11-error-states) — Error States (GitHub API failure cache fallback)
- [TDD §14](../docs/TDD.md#14-build--deploy-pipeline) — Build & Deploy Pipeline
- [ROADMAP — Track 3A](../docs/ROADMAP.md#track-3a--github-data-sync)

## Architecture Decisions

- **GITHUB_TOKEN support:** Read `GITHUB_TOKEN` from env if set, fallback to unauthenticated requests (60/hr limit is sufficient for 3 repos)
- **Cache:** Last-good GitHub API response stored in `src/lib/generated/github-cache.json`; fallback on failure with console warning
- **Dynamic FILE_SYSTEM:** New `scripts/generate-filesystem.mjs` reads compiled JSON outputs (`articles-content.json` + `projects-content.json`) instead of re-parsing MDX, builds the tree, outputs `src/lib/generated/filesystem.json`; `src/lib/constants.ts` retains only type definitions + minimal fallback tree for dev mode
- **MDX project body compilation:** New `scripts/compile-projects.mjs` (parallel to `compile-articles.mjs`) parses frontmatter + renders body to HTML via `marked`; outputs `src/lib/generated/projects-content.json`
- **Orchestration:** `scripts/prebuild.mjs` runs all pre-build steps in sequence; build command becomes `"build": "node scripts/prebuild.mjs && astro build"`
- **No Astro integration** — standalone scripts are simpler, testable, and consistent with the existing pattern

## Functional Requirements

### FR1 — GitHub API Fetch (`src/lib/github.ts`)

- Create `src/lib/github.ts` exporting two functions:
  - `fetchRepoStats(owner, repo)` — calls `GET /repos/{owner}/{repo}` for repo metadata
  - `fetchRepoCommitCount(owner, repo)` — calls `GET /repos/{owner}/{repo}/commits?per_page=1&page=1` and parses the `Link` header for `rel="last"` page number to derive total commit count
- Returns types matching TDD §4.2:
  - `GitHubRepoData`: `{ name, stargazers_count, pushed_at, default_branch, language }`
  - `fetchRepoCommitCount()` returns a `number`
- Support `GITHUB_TOKEN` env var for authenticated requests (pass as `Authorization: Bearer` header)
- Fallback to unauthenticated fetch if no token set
- Include request timeout (configurable, default 10s) and error handling on both functions

### FR2 — Build-time Data Fetch Orchestration (`scripts/prebuild.mjs`)

- Create `scripts/prebuild.mjs` that runs in order:
  1. `fetch-github-stats.mjs` — fetch data for all 3 project repos, write cache + generated data
  2. `compile-articles.mjs` — existing script, unchanged
  3. `compile-projects.mjs` — new script (see FR5)
  4. `generate-filesystem.mjs` — new script (see FR4)
- Exit with non-zero code on failure (fails the build)

### FR3 — Cache & Fallback

- On successful API fetch: write response to `src/lib/generated/github-cache.json`
- On API failure: read from cache file; if cache exists, log warning and continue; if no cache, log error and exit with non-zero
- Cache stores the raw API response for each repo keyed by `owner/repo`

### FR4 — Dynamic FILE_SYSTEM Generation (`scripts/generate-filesystem.mjs`)

- **Read compiled JSON outputs** (not raw MDX) to avoid redundant parsing:
  - From `src/lib/generated/projects-content.json` → extract slug + drive field per project
  - From `src/lib/generated/articles-content.json` → extract slug + category per article
- Build the FS tree matching the existing structure (C:, D:, E: drives, folders, files)
- Output `src/lib/generated/filesystem.json` (serialized `FSDrive[]`)
- Update `src/lib/constants.ts` — keep only type definitions (`FSNode`, `FSDrive`, `FSFolder`, `FSFile`); remove static `FILE_SYSTEM` data; add import from generated JSON + keep a minimal fallback tree for development without build (`pnpm dev`)
- Update `src/lib/projects-data.ts` — remove hardcoded `stars`, `lastCommit`, `commits` values; these will be populated from GitHub API at build time

### FR5 — MDX Project Body Compilation (`scripts/compile-projects.mjs`)

- Read project MDX files, parse frontmatter (manual YAML, no gray-matter)
- Render body to HTML using `marked` (same approach as `compile-articles.mjs`)
- Merge with GitHub API data at build time — overwrite hardcoded `stars`, `lastCommit`, and `commits` with fetched values
- Note: commit count is fetched via `fetchRepoCommitCount()` which parses the `Link` header from the commits endpoint (not the full commit history — just the total count number)
- Output `src/lib/generated/projects-content.json` with schema: `Record<string, { frontmatter: ProjectMetadata, bodyHtml: string }>` where `ProjectMetadata` contains title, slug, drive, description, repoUrl, language, techStack, stars, lastCommit, commits, status, icon

### FR6 — Explorer Detail Pane Upgrade

- **Switch import source:** `ExplorerDetailPane.tsx` currently imports `PROJECTS_METADATA` from `projects-data.ts` — update it to import from `src/lib/generated/projects-content.json` instead (which includes GitHub-fetched stars, lastCommit, commits AND bodyHtml)
- Render full project body HTML in a scrollable content area below the metadata header
- Keep frontmatter metadata header (title, language, tech stack badges, stars, last commit, GitHub link) above the body content
- Keep backward compatibility: fallback to `ARTICLES_METADATA` from `projects-data.ts` for article entries (articles have no bodyHtml in `projects-content.json`)

### FR7 — Dynamic FILE_SYSTEM Integration

- Update Explorer to load filesystem from `generated/filesystem.json` instead of static `FILE_SYSTEM`
- Update CMD commands (`ls`, `cd`, `cat`, `open`) to use dynamic filesystem
- Keep backward compatibility — fallback to minimal fallback tree in `constants.ts` when `filesystem.json` is missing (e.g., during `pnpm dev` without prior build)

## Acceptance Criteria

```
✅ `pnpm build` fetches live GitHub data (stars, last commit, commit count) for all 3 repos
✅ GITHUB_TOKEN env var is respected (authenticated requests) when set
✅ FILE_SYSTEM is dynamically built from compiled JSON at build time (no redundant MDX re-parsing)
✅ Explorer detail pane imports from `projects-content.json` and renders full MDX project body HTML
✅ Explorer detail pane shows live GitHub data (stars, lastCommit, commits) not hardcoded values
✅ CMD `cat` shows real (fetched) star counts, last commit dates, and commit counts
✅ `projects-content.json` checked into git — works in dev mode without build
✅ `constants.ts` keeps minimal fallback tree for dev mode (no build required to run `pnpm dev`)
✅ If GitHub API is unreachable, build succeeds using cached data with console warning
✅ If no cache and API fails, build fails with clear error
✅ prebuild.mjs orchestrates all 4 scripts in correct order
✅ `conductor/tech-stack.md` updated with new build pipeline
✅ `pnpm build` completes successfully
✅ Tests pass, coverage ≥ 80%
```

## Out of Scope

- Per-repo full commit history (individual commit messages, authors, dates — only the total count number is fetched)
- GitHub Actions workflow changes (covered in Track 5A)
- URL state persistence (Track 3B)
- My Documents / Recycle Bin content (Track 3C)

## Dev Mode Note

`pnpm dev` does not run `prebuild.mjs` (only `astro dev`). To ensure the dev server works:

- `projects-content.json` is checked into git (via `.gitignore` exception `!projects-content.json`) so it exists on fresh clone
- `constants.ts` keeps a minimal fallback `FILE_SYSTEM` tree for development without build
- `github-cache.json` is gitignored — first `pnpm build` creates it; subsequent builds use cached data
