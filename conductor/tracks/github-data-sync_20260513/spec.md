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
- **Dynamic FILE_SYSTEM:** New `scripts/generate-filesystem.mjs` reads MDX files directly, builds the tree, outputs `src/lib/generated/filesystem.json`; `src/lib/constants.ts` retains only type definitions + fallback
- **MDX project body compilation:** New `scripts/compile-projects.mjs` (parallel to `compile-articles.mjs`) parses frontmatter + renders body to HTML via `marked`; outputs `src/lib/generated/projects-content.json`
- **Orchestration:** `scripts/prebuild.mjs` runs all pre-build steps in sequence; build command becomes `"build": "node scripts/prebuild.mjs && astro build"`
- **No Astro integration** — standalone scripts are simpler, testable, and consistent with the existing pattern

## Functional Requirements

### FR1 — GitHub API Fetch (`src/lib/github.ts`)

- Create `src/lib/github.ts` exporting `fetchRepoStats(owner, repo)` which calls the GitHub REST API (`/repos/{owner}/{repo}`)
- Returns `GitHubRepoData`: `{ stargazers_count, pushed_at, default_branch, language }` matching TDD §4.2
- Support `GITHUB_TOKEN` env var for authenticated requests (pass as `Authorization: Bearer` header)
- Fallback to unauthenticated fetch if no token set
- Include request timeout and error handling

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

- Read project MDX files (`src/content/projects/*.mdx`) to extract slug + drive field
- Read article MDX files (`src/content/articles/*.mdx`) to extract slug + category
- Build the FS tree matching the existing structure (C:, D:, E: drives, folders, files)
- Output `src/lib/generated/filesystem.json` (serialized `FSDrive[]`)
- Update `src/lib/constants.ts` — keep only type definitions (`FSNode`, `FSDrive`, `FSFolder`, `FSFile`); remove static `FILE_SYSTEM` data; add import from generated JSON
- Update `src/lib/projects-data.ts` — remove hardcoded `stars`, `lastCommit` values; these will be populated from GitHub API

### FR5 — MDX Project Body Compilation (`scripts/compile-projects.mjs`)

- Read project MDX files, parse frontmatter (manual YAML, no gray-matter)
- Render body to HTML using `marked` (same approach as `compile-articles.mjs`)
- Merge with GitHub API data (stars, lastCommit) at build time
- Output `src/lib/generated/projects-content.json` with schema: `Record<string, { frontmatter, bodyHtml }>`

### FR6 — Explorer Detail Pane Upgrade

- Update Explorer's detail pane to render full project body HTML (not just frontmatter metadata)
- Load body HTML from `projects-content.json` when a project file is selected
- Keep frontmatter metadata (title, badges, repo link) as header above body content

### FR7 — Dynamic FILE_SYSTEM Integration

- Update Explorer to load filesystem from `generated/filesystem.json` instead of static `FILE_SYSTEM`
- Update CMD commands (`ls`, `cd`, `cat`, `open`) to use dynamic filesystem
- Keep backward compatibility — fallback to static tree if JSON file is missing

## Acceptance Criteria

```
✅ `pnpm build` fetches live GitHub data (stars, last commit) for all 3 repos
✅ GITHUB_TOKEN env var is respected (authenticated requests) when set
✅ FILE_SYSTEM is dynamically built from MDX content collections at build time
✅ Explorer detail pane renders full MDX project body content (upgraded from metadata-only)
✅ If GitHub API is unreachable, build succeeds using cached data with console warning
✅ If no cache and API fails, build fails with clear error
✅ CMD `cat` shows real (fetched) star counts and last commit dates
✅ prebuild.mjs orchestrates all 4 scripts in correct order
✅ `pnpm build` completes successfully
✅ Tests pass, coverage ≥ 80%
```

## Out of Scope

- Per-repo commit history (only last commit date is fetched)
- GitHub Actions workflow changes (covered in Track 5A)
- URL state persistence (Track 3B)
- My Documents / Recycle Bin content (Track 3C)
