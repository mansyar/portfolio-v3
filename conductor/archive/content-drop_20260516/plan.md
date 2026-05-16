# Implementation Plan: Content Drop (Track 6C)

## Phase 1: Project MDX Files — Terminal Tactics & Simulacra `[checkpoint: 792540b]`

- [x] Task: Write tests for new project frontmatter schema `6c3e34b`
  - [x] Write tests verifying terminal-tactics.mdx has valid frontmatter (title, slug, drive: 'C', description, repoUrl, techStack, status: 'active')
  - [x] Write tests verifying simulacra.mdx has valid frontmatter (title, slug, drive: 'C', description, repoUrl, techStack, status: 'wip')
  - [x] Run tests and confirm they pass (schema validation)
  - [x] Verify coverage: `CI=true pnpm test:coverage`
  - [x] Commit: `test(projects): Add schema validation tests for new project MDX files`
- [x] Task: Create terminal-tactics.mdx project file `78c01db`
  - [x] Write failing test: assert project content renders in Explorer and CMD `cat` output
  - [x] Create `src/content/projects/terminal-tactics.mdx` with full frontmatter and substantive body content
  - [x] Run tests to pass; verify coverage
  - [x] Commit: `feat(projects): Add Terminal Tactics project MDX entry`
- [x] Task: Create simulacra.mdx project file `2518327`
  - [x] Create `src/content/projects/simulacra.mdx` with full frontmatter and substantive body content
  - [x] Run tests; verify coverage
  - [x] Commit: `feat(projects): Add Simulacra project MDX entry`
- [x] Task: Update static and dynamic filesystem + metadata `87f95c4`
  - [x] Update `src/lib/constants.ts` — add terminal-tactics and simulacra to C:\Software_Engineering folder
  - [x] Update `src/lib/projects-data.ts` — add metadata entries for both projects
  - [x] Update `scripts/generate-filesystem.mjs` — verify both projects are auto-discovered (dynamic generator auto-discovers from compiled JSON)
  - [x] Run tests passing; verify no regressions
  - [x] Commit: `feat(filesystem): Register new projects in filesystem tree and metadata`
- [x] Task: Update existing test fixtures and assertions for new project count
  - [x] `tests/content-files.test.ts` — add new project files to the `projectFiles` array
  - [x] `tests/compile-projects.test.ts` — update `toHaveLength(3)` → `toHaveLength(5)`; add GitHub cache fixture entries for terminal-tactics and simulacra repos
  - [x] `tests/explorer.test.tsx` — update `PROJECTS_METADATA` count assertion from 3→5; add new project file assertions in ExplorerFileList test
  - [x] `tests/filesystem.test.ts` — update `should return 2 project files` → `4` for C:\Software_Engineering
  - [x] Run all tests; verify no regressions
  - [x] Commit: `test(projects): Update existing test assertions for 5 total projects`
- [x] Task: Conductor - User Manual Verification 'Phase 1: Project MDX Files' (Protocol in workflow.md) ✅ User confirmed

## Phase 2: Knowledge Base Articles `[checkpoint: ongoing]`

- [x] Task: Write tests for new article frontmatter schema `9c82e1e`
  - [x] Write tests verifying all 3 new articles have valid frontmatter
  - [x] Verify coverage: `CI=true pnpm test:coverage`
  - [x] Commit: `test(articles): Add schema validation tests for new article MDX files`
- [x] Task: Create agent-assisted-coding.mdx article `57bcb47`
  - [x] Create `src/content/articles/agent-assisted-coding.mdx` with frontmatter and substantive body
  - [x] Run tests to pass; verify coverage
  - [x] Commit: `feat(articles): Add Agent-Assisted Coding article`
- [x] Task: Create tdd.mdx article `57bcb47`
  - [x] Create `src/content/articles/tdd.mdx` with frontmatter and substantive body
  - [x] Run tests; verify coverage
  - [x] Commit: `feat(articles): Add TDD article`
- [x] Task: Create database-design-patterns.mdx article `57bcb47`
  - [x] Create `src/content/articles/database-design-patterns.mdx` with frontmatter and substantive body
  - [x] Run tests; verify coverage
  - [x] Commit: `feat(articles): Add Database Design Patterns article`
- [x] Task: Verify compile script picks up new articles `57bcb47`
  - [x] Run `node scripts/compile-articles.mjs` — compiled JSON contains 8 articles
  - [x] Update `src/lib/constants.ts` E:\Knowledge_Base tree with new articles
  - [x] Re-run all tests; verify no regressions
  - [x] Commit: `feat(articles): Add 3 new Knowledge Base articles`
- [x] Task: Update existing test fixtures and assertions for new article count `57bcb47`
  - [x] All test assertions updated for 8 total articles
  - [x] Run all tests; verify no regressions
  - [x] Commit: same as article creation commit
- [x] Task: Conductor - User Manual Verification 'Phase 2: Knowledge Base Articles' ✅ User confirmed

## Phase 3: Certifications `2fa8c30`

- [x] Task: Create cert metadata and data structures `2fa8c30`
  - [x] Add `CERTIFICATIONS_METADATA` export to `src/lib/projects-data.ts` with ACP and ACA entries keyed by slug
  - [x] Run tests; verify coverage
  - [x] Commit: `feat(explorer): Add certification entries and detail view for Certs folder`
- [x] Task: Wire Certs folder into filesystem and Explorer detail pane `2fa8c30`
  - [x] Update `src/lib/constants.ts` — populate Certs folder with cert file entries
  - [x] Update `scripts/generate-filesystem.mjs` — add static Certs population
  - [x] Add cert slug routing to `ExplorerDetailPane.tsx`
  - [x] Write tests: Explorer displays cert entries with correct metadata
  - [x] Run all tests; verify coverage > 80%
  - [x] Commit: `feat(explorer): Add certification entries and detail view for Certs folder`
- [x] Task: Update existing tests affected by Certs change `2fa8c30`
  - [x] Update Certs test assertion from empty → populated
  - [x] Run all tests; verify no regressions
  - [x] Commit: same as above
- [x] Task: Conductor - User Manual Verification 'Phase 3: Certifications'

## Phase 4: Resume PDF Redesign `5101c96`

- [x] Task: Generate redesigned professional resume PDF `5101c96`
  - [x] Professional resume PDF generated with reportlab at `public/resume.pdf`
  - [x] Verify file exists and is accessible
  - [x] Commit: `feat(assets): Add redesigned professional resume PDF`
- [x] Task: Verify resume integration (existing test covers Resume.pdf click → opens /resume.pdf in new tab)
- [x] Task: Conductor - User Manual Verification 'Phase 4: Resume PDF'

## Phase 5: Build Pipeline & Docs `6dd01cc`

- [x] Task: Update build pipeline and verify build `6dd01cc`
  - [x] Verify `node scripts/prebuild.mjs` completes with all new content (5 projects, 8 articles)
  - [x] Run `pnpm build` and confirm zero errors
  - [x] Run full test suite: 795 tests, 82.28% coverage
  - [x] Commit: `chore(build): Rebuild content pipeline with new projects and articles`
- [x] Task: Update PRD.md and TDD.md documentation `df302f5`
  - [x] Update PRD.md §4, §7 — version 2.1, content volume metrics
  - [x] Update TDD.md §4.1 — article count (8 total)
  - [x] Commit: `docs(conductor): Update PRD and TDD with new content mappings and version`
- [x] Task: Conductor - User Manual Verification 'Phase 5: Build Pipeline & Docs'
