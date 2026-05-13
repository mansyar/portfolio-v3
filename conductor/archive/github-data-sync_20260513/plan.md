# Implementation Plan: Track 3A — GitHub Data Sync

---

## Phase 1 — GitHub API Fetch Layer [checkpoint: be014f5]

### Task 1.1: Write failing tests for `fetchRepoStats()` `[c48366b]`

- [x] Write tests verifying `fetchRepoStats()` returns correct shape (`name`, `stargazers_count`, `pushed_at`, `default_branch`, `language` — per TDD §4.2)
- [x] Write tests verifying `fetchRepoCommitCount()` returns a number by parsing the `Link` header
- [x] Write tests verifying `GITHUB_TOKEN` is passed as `Authorization: Bearer` header
- [x] Write tests verifying unauthenticated fallback when no token
- [x] Write tests verifying error handling (network failure, non-200 response, malformed Link header)
- [x] Write tests verifying request timeout behavior

### Task 1.2: Implement `src/lib/github.ts` `[c48366b]`

- [x] Create `src/lib/github.ts` with exported types (`GitHubRepoData` includes `name` per TDD §4.2) and functions (`fetchRepoStats`, `fetchRepoCommitCount`)
- [x] `fetchRepoStats(owner, repo)` — calls `GET /repos/{owner}/{repo}`, returns `{ name, stargazers_count, pushed_at, default_branch, language }`
- [x] `fetchRepoCommitCount(owner, repo)` — calls `GET /repos/{owner}/{repo}/commits?per_page=1&page=1`, parses `Link` header for `rel="last"` page number
- [x] Implement authenticated request path (reads `GITHUB_TOKEN` env var)
- [x] Implement unauthenticated fallback
- [x] Add request timeout (configurable, default 10s)
- [x] Add error handling — throw on non-200, catch network errors

### Task 1.3: Write tests for GitHub stats fetch script

- [x] Write tests verifying `fetch-github-stats.mjs` reads repo URLs from projects
- [x] Write tests verifying cache write on success
- [x] Write tests verifying cache read + console warning on failure
- [x] Write tests verifying exit with non-zero when no cache and API fails

### Task 1.4: Create `scripts/fetch-github-stats.mjs` `[97ccdd2]`

- [x] Read project repo URLs from MDX files or projects-data
- [x] Call `fetchRepoStats()` and `fetchRepoCommitCount()` for each unique `owner/repo`
- [x] On success: write combined data (stats + commit count) to `src/lib/generated/github-cache.json`
- [x] On failure: read cache file; if exists, log warning and continue; if not, log error and exit with non-zero
- [x] Log each repo's result (stars, last commit, commits) to console
- [x] Verify tests pass
- [x] Task: Conductor - User Manual Verification 'Phase 1: GitHub API Fetch Layer' (Protocol in workflow.md)

---

## Phase 2 — MDX Project Body Compilation

### Task 2.1: Write failing tests for `compile-projects.mjs` `[60da0a0]`

- [x] Write tests verifying output file `projects-content.json` exists
- [x] Write tests verifying schema: `Record<string, { frontmatter: ProjectMetadata, bodyHtml: string }>`
- [x] Write tests verifying frontmatter fields (title, slug, drive, description, repoUrl, techStack, status, icon)
- [x] Write tests verifying body is rendered to valid HTML string
- [x] Write tests verifying GitHub API data merges with frontmatter (stars, lastCommit, commits replace hardcoded values)

### Task 2.2: Create `scripts/compile-projects.mjs` `[60da0a0]`

- [x] Read project MDX files from `src/content/projects/`
- [x] Parse YAML frontmatter (manual parsing, no external lib — same approach as compile-articles.mjs)
- [x] Render MDX body to HTML using `marked`
- [x] Merge with fetched GitHub API data — overwrite hardcoded `stars`, `lastCommit`, and `commits` with values from `github-cache.json`
- [x] Output to `src/lib/generated/projects-content.json` with schema `Record<string, { frontmatter: ProjectMetadata, bodyHtml: string }>`
- [x] Verify tests pass

### Task 2.3: Update ExplorerDetailPane to render full project body HTML `[95a6cb3]`

- [x] **Switch import source:** `ExplorerDetailPane.tsx` currently imports `PROJECTS_METADATA` from `projects-data.ts` — update to import from `src/lib/generated/projects-content.json` instead
- [x] The JSON provides both frontmatter (with live GitHub stars/lastCommit/commits) and `bodyHtml`
- [x] Render `bodyHtml` in a scrollable content area below the metadata header
- [x] Keep frontmatter header (title, language, tech stack badges, stars, last commit, GitHub link) above the body
- [x] Keep backward compatibility: fallback to `ARTICLES_METADATA` from `projects-data.ts` for article entries (not in `projects-content.json`)
- [x] Write tests verifying body HTML renders in detail pane
- [x] Write tests verifying fallback to metadata-only if no body HTML available
- [x] Verify tests pass
- [~] Task: Conductor - User Manual Verification 'Phase 2: MDX Project Body Compilation' (Protocol in workflow.md)

---

## Phase 3 — Dynamic FILE_SYSTEM Generation

### Task 3.1: Write failing tests for `generate-filesystem.mjs` `[1ee674e]`

- [x] Write tests verifying output `filesystem.json` contains C:, D:, E: drives
- [x] Write tests verifying C: drive has Software_Engineering folder with project files
- [x] Write tests verifying D: drive has Systems_Data folder with project files
- [x] Write tests verifying E: drive has Knowledge_Base folder with category subfolders and article files
- [x] Write tests verifying schema matches `FSDrive[]` types

### Task 3.2: Create `scripts/generate-filesystem.mjs` `[1ee674e]`

- [x] Read compiled JSON outputs (not raw MDX) to avoid redundant parsing
- [x] Build FS tree: C:/Software_Engineering, D:/Systems_Data, E:/Knowledge_Base/{category}/
- [x] Output to `src/lib/generated/filesystem.json`
- [x] Verify tests pass

### Task 3.3: Update `src/lib/constants.ts` `[5809b85]`

- [x] Keep all type definitions (`FSNode`, `FSDrive`, `FSFolder`, `FSFile`)
- [x] Keep static `FILE_SYSTEM` data (serves as dev-mode tree; generated FS replaces at build time)
- [x] Verify tests pass

### Task 3.4: Update Explorer + CMD to use dynamic FILE_SYSTEM `[5809b85]`

- [x] Backward compatible — static tree continues to work for dev mode
- [x] Dynamic FS generated at build time via prebuild.mjs
- [x] Tests verifying Explorer navigation with FS
- [x] Tests verifying CMD `ls`/`cd` with FS
- [x] Verify tests pass
- [~] Task: Conductor - User Manual Verification 'Phase 3: Dynamic FILE_SYSTEM Generation' (Protocol in workflow.md)

---

## Phase 4 — Orchestration & Integration

### Task 4.1: Create `scripts/prebuild.mjs` orchestrator `[30424f3]`

- [x] Run `fetch-github-stats.mjs` (exit on failure)
- [x] Run `compile-articles.mjs` (existing, unchanged)
- [x] Run `compile-projects.mjs` (exit on failure)
- [x] Run `generate-filesystem.mjs` (exit on failure)
- [x] Log each step with clear start/end markers
- [x] Exit with non-zero code on any failure
- [x] Write tests verifying orchestrator runs all scripts in sequence

### Task 4.2: Update `package.json` build command `[30424f3]`

- [x] Change build command to `node scripts/prebuild.mjs && astro build`
- [x] Verify `pnpm build` runs prebuild.mjs then astro build
- [x] Write integration test verifying build command structure

### Task 4.3: Update `src/lib/projects-data.ts` `[30424f3]`

- [x] Keep type definitions for dev mode fallback
- [x] Live GitHub data now populated via compile-projects.mjs

### Task 4.4: Update `.gitignore` for generated files `[30424f3]`

- [x] Added `!src/lib/generated/projects-content.json` exception
- [x] Verify test passes

### Task 4.5: Update `conductor/tech-stack.md` with new build pipeline `[30424f3]`

- [x] Document `scripts/prebuild.mjs` orchestrator and all 4 sub-scripts
- [x] Update the Build Pipeline diagram in tech-stack.md
- [x] Add change log entry for this track
- [x] Verify tests pass
- [~] Task: Conductor - User Manual Verification 'Phase 4: Orchestration & Integration' (Protocol in workflow.md)

---

## Phase: Review Fixes

### Task R1: Fix test isolation (shared cache cleanup) `[131e1ad]`

- [x] Remove `afterAll` cleanup of `github-cache.json` that broke `compile-projects.test.ts`
- [x] Remove unused `afterAll` import from test file
- [x] Verify all 462 tests pass

---

## Phase 5 — End-to-End Verification

### Task 5.1: Run full build pipeline

- [ ] Execute `pnpm build`
- [ ] Verify `fetch-github-stats.mjs` completes with console output showing stars/commits for each repo
- [ ] Verify `github-cache.json` is created with `name`, `stargazers_count`, `pushed_at`, `language`, and commit count for each repo
- [ ] Verify `projects-content.json` is generated with frontmatter (including live stars, lastCommit, commits) + body HTML
- [ ] Verify `filesystem.json` is generated with correct structure (read from compiled JSON, not raw MDX)
- [ ] Verify `compile-articles.mjs` still runs correctly (unchanged)

### Task 5.2: Verify Explorer displays full project body

- [ ] Start dev server (`pnpm dev`)
- [ ] Open My Computer → C:\ → Software_Engineering → click a project file
- [ ] Confirm detail pane shows: header (title, badges, repo link) + full body HTML content

### Task 5.3: Verify CMD shows fetched data

- [ ] In Command Prompt, run `cat icarus-server-manager`
- [ ] Confirm `Stars:`, `Last Commit:`, and `Commits:` show live fetched values (not hardcoded ones)
- [ ] Run `ls` and `cd` to verify filesystem works with dynamic data

### Task 5.4: Verify API failure fallback

- [ ] Set `GITHUB_TOKEN` to an invalid value or network-block
- [ ] Run `pnpm build`
- [ ] Confirm build succeeds with console warning and uses cached data

### Task 5.5: Final testing pass

- [ ] Run `CI=true pnpm test` — all tests pass
- [ ] Run `pnpm typecheck` — no type errors
- [ ] Run `pnpm lint` — no lint errors
- [ ] Verify modularity (all src/ files under 500 lines)
- [ ] Verify coverage ≥ 80%
- [ ] Task: Conductor - User Manual Verification 'Phase 5: End-to-End Verification' (Protocol in workflow.md)
