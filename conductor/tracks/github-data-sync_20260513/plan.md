# Implementation Plan: Track 3A — GitHub Data Sync

---

## Phase 1 — GitHub API Fetch Layer

### Task 1.1: Write failing tests for `fetchRepoStats()`

- [ ] Write tests verifying `fetchRepoStats()` returns correct shape (`stargazers_count`, `pushed_at`, `default_branch`, `language`)
- [ ] Write tests verifying `GITHUB_TOKEN` is passed as `Authorization: Bearer` header
- [ ] Write tests verifying unauthenticated fallback when no token
- [ ] Write tests verifying error handling (network failure, non-200 response)
- [ ] Write tests verifying request timeout behavior

### Task 1.2: Implement `src/lib/github.ts`

- [ ] Create `src/lib/github.ts` with exported `GitHubRepoData` type and `fetchRepoStats(owner, repo)` function
- [ ] Implement authenticated request path (reads `GITHUB_TOKEN` env var)
- [ ] Implement unauthenticated fallback
- [ ] Add request timeout (configurable, default 10s)
- [ ] Add error handling — throw on non-200, catch network errors

### Task 1.3: Write tests for GitHub stats fetch script

- [ ] Write tests verifying `fetch-github-stats.mjs` reads repo URLs from projects
- [ ] Write tests verifying cache write on success
- [ ] Write tests verifying cache read + console warning on failure
- [ ] Write tests verifying exit with non-zero when no cache and API fails

### Task 1.4: Create `scripts/fetch-github-stats.mjs`

- [ ] Read project repo URLs from MDX files or projects-data
- [ ] Call `fetchRepoStats()` for each unique `owner/repo`
- [ ] On success: write to `src/lib/generated/github-cache.json`
- [ ] On failure: read cache file; if exists, log warning and continue; if not, log error and exit with non-zero
- [ ] Log each repo's result (stars, last commit) to console
- [ ] Verify tests pass
- [ ] Task: Conductor - User Manual Verification 'Phase 1: GitHub API Fetch Layer' (Protocol in workflow.md)

---

## Phase 2 — MDX Project Body Compilation

### Task 2.1: Write failing tests for `compile-projects.mjs`

- [ ] Write tests verifying output file `projects-content.json` exists
- [ ] Write tests verifying schema: `Record<string, { frontmatter, bodyHtml }>`
- [ ] Write tests verifying frontmatter fields (title, slug, drive, description, repoUrl, techStack, status)
- [ ] Write tests verifying body is rendered to valid HTML string
- [ ] Write tests verifying GitHub API data merges with frontmatter (stars, lastCommit replace hardcoded values)

### Task 2.2: Create `scripts/compile-projects.mjs`

- [ ] Read project MDX files from `src/content/projects/`
- [ ] Parse YAML frontmatter (manual parsing, no external lib — same approach as compile-articles.mjs)
- [ ] Render MDX body to HTML using `marked`
- [ ] Merge with fetched GitHub API data (overwrite `stars`, `lastCommit`)
- [ ] Output to `src/lib/generated/projects-content.json`
- [ ] Verify tests pass

### Task 2.3: Update Explorer detail pane to render body HTML

- [ ] Load `projects-content.json` in Explorer (import at build time, bundled as static data)
- [ ] When a project file is selected, render `bodyHtml` in a scrollable content area
- [ ] Keep frontmatter header (title, badges, repo link) above the body
- [ ] Write tests verifying body HTML renders in detail pane
- [ ] Write tests verifying fallback to metadata-only if no body HTML available
- [ ] Verify tests pass
- [ ] Task: Conductor - User Manual Verification 'Phase 2: MDX Project Body Compilation' (Protocol in workflow.md)

---

## Phase 3 — Dynamic FILE_SYSTEM Generation

### Task 3.1: Write failing tests for `generate-filesystem.mjs`

- [ ] Write tests verifying output `filesystem.json` contains C:, D:, E: drives
- [ ] Write tests verifying C: drive has Software_Engineering folder with project files
- [ ] Write tests verifying D: drive has Systems_Data folder with project files
- [ ] Write tests verifying E: drive has Knowledge_Base folder with category subfolders and article files
- [ ] Write tests verifying schema matches `FSDrive[]` types

### Task 3.2: Create `scripts/generate-filesystem.mjs`

- [ ] Read project MDX files, extract `slug` and `drive` field from frontmatter
- [ ] Read article MDX files, extract `slug` and `category` from frontmatter
- [ ] Build FS tree: C:/Software_Engineering (C: projects), D:/Systems_Data (D: projects), E:/Knowledge_Base/{category}/ (articles grouped by category)
- [ ] Output to `src/lib/generated/filesystem.json`
- [ ] Verify tests pass

### Task 3.3: Update `src/lib/constants.ts`

- [ ] Keep all type definitions (`FSNode`, `FSDrive`, `FSFolder`, `FSFile`)
- [ ] Remove static `FILE_SYSTEM` data array
- [ ] Add async import or build-time import of generated JSON
- [ ] Keep a minimal fallback tree for development without build
- [ ] Write tests verifying types remain unchanged
- [ ] Write tests verifying fallback tree exists
- [ ] Verify tests pass

### Task 3.4: Update Explorer + CMD to use dynamic FILE_SYSTEM

- [ ] Update Explorer to load filesystem from `generated/filesystem.json`
- [ ] Update CMD commands (filesystem.ts) to use dynamic FS
- [ ] Write tests verifying Explorer navigation works with dynamic FS
- [ ] Write tests verifying CMD `ls`/`cd` works with dynamic FS
- [ ] Verify tests pass
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Dynamic FILE_SYSTEM Generation' (Protocol in workflow.md)

---

## Phase 4 — Orchestration & Integration

### Task 4.1: Create `scripts/prebuild.mjs` orchestrator

- [ ] Run `fetch-github-stats.mjs` (exit on failure)
- [ ] Run `compile-articles.mjs` (existing, unchanged)
- [ ] Run `compile-projects.mjs` (exit on failure)
- [ ] Run `generate-filesystem.mjs` (exit on failure)
- [ ] Log each step with clear start/end markers
- [ ] Exit with non-zero code on any failure
- [ ] Write tests verifying orchestrator runs all scripts in sequence

### Task 4.2: Update `package.json` build command

- [ ] Change `"build": "node scripts/compile-articles.mjs && astro build"` to `"build": "node scripts/prebuild.mjs && astro build"`
- [ ] Verify `pnpm build` runs prebuild.mjs then astro build
- [ ] Write integration test verifying build command structure

### Task 4.3: Update `src/lib/projects-data.ts`

- [ ] Remove hardcoded `stars`, `lastCommit` values from `PROJECTS_METADATA`
- [ ] Import GitHub data from build-time generated JSON
- [ ] Keep static defaults for development without build

### Task 4.4: Update `.gitignore` for generated files

- [ ] Add `src/lib/generated/` — all build-time JSON outputs are gitignored (except `!articles-content.json` and `!projects-content.json` as they are needed for runtime)
- [ ] Verify test passes
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Orchestration & Integration' (Protocol in workflow.md)

---

## Phase 5 — End-to-End Verification

### Task 5.1: Run full build pipeline

- [ ] Execute `pnpm build`
- [ ] Verify `fetch-github-stats.mjs` completes with console output showing stars/commits for each repo
- [ ] Verify `filesystem.json` is generated with correct structure
- [ ] Verify `projects-content.json` is generated with frontmatter + body HTML
- [ ] Verify `github-cache.json` is created

### Task 5.2: Verify Explorer displays full project body

- [ ] Start dev server (`pnpm dev`)
- [ ] Open My Computer → C:\ → Software_Engineering → click a project file
- [ ] Confirm detail pane shows: header (title, badges, repo link) + full body HTML content

### Task 5.3: Verify CMD shows fetched data

- [ ] In Command Prompt, run `cat icarus-server-manager`
- [ ] Confirm `Stars:` and `Last Commit:` show live fetched values (not hardcoded ones)
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
