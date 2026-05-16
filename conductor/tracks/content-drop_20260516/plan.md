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

## Phase 3: Certifications

- [~] Task: Create cert metadata and data structures

- [ ] Task: Create cert metadata and data structures
  - [ ] Write tests for cert metadata schema (name, issuer, date, credentialId, credentialUrl)
  - [ ] Add `CERTIFICATIONS_METADATA` export to `src/lib/projects-data.ts` with ACP and ACA entries keyed by slug (`acp-cloud-computing`, `aca-cloud-computing`)
  - [ ] Run tests; verify coverage
  - [ ] Commit: `feat(data): Add certifications metadata for Alibaba Cloud certs`
- [ ] Task: Wire Certs folder into filesystem and Explorer detail pane
  - [ ] Update `src/lib/constants.ts` — populate D:\My_Documents\Certs\ folder with file-type entries using slugs `acp-cloud-computing` and `aca-cloud-computing`
  - [ ] Update `scripts/generate-filesystem.mjs` — add static Certs folder population with cert file entries
  - [ ] Add cert slug routing to `ExplorerDetailPane.tsx` — special-case `acp-cloud-computing` and `aca-cloud-computing` to render cert detail view (name, issuer, date range, credential ID)
  - [ ] Write tests: Explorer navigates to D:\My_Documents\Certs and displays cert entries with correct metadata
  - [ ] Run all tests; verify coverage > 80%
  - [ ] Commit: `feat(explorer): Add certification entries and detail view for Certs folder`
- [ ] Task: Update existing tests affected by Certs change
  - [ ] `tests/explorer.test.tsx` — update the "This folder is empty" assertion for Certs: replace with test asserting cert entries display (ACP, ACA)
  - [ ] Run all tests; verify no regressions
  - [ ] Commit: `test(explorer): Update Certs folder test from empty to populated`
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Certifications' (Protocol in workflow.md)

## Phase 4: Resume PDF Redesign

- [ ] Task: Generate redesigned professional resume PDF
  - [ ] Prepare content JSON with resume data (contact, summary, experience, skills, education, certs)
  - [ ] Generate PDF using design pipeline with `--type resume`
  - [ ] Place output at `public/resume.pdf`, replacing placeholder
  - [ ] Verify file exists and is accessible
  - [ ] Commit: `feat(assets): Add redesigned professional resume PDF`
- [ ] Task: Verify resume integration
  - [ ] Write test: clicking Resume.pdf in My Documents → opens /resume.pdf in new tab
  - [ ] Run all tests; verify no regressions
  - [ ] Commit: `test(explorer): Verify resume PDF opens correctly from My Documents`
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Resume PDF' (Protocol in workflow.md)

## Phase 5: Build Pipeline & Docs

- [ ] Task: Update build pipeline and verify build
  - [ ] Verify `node scripts/prebuild.mjs` completes with all new content
  - [ ] Run `pnpm build` and confirm zero errors
  - [ ] Run full test suite: `CI=true pnpm test:coverage` (verify ≥80%)
  - [ ] Verify OG preview image exists at `public/og-preview.png` and is referenced in `MetaTags.astro` (already wired by default)
  - [ ] Commit: `chore(build): Rebuild content pipeline with new projects and articles`
- [ ] Task: Update PRD.md and TDD.md documentation
  - [ ] Update PRD.md §4 (File System & Content Mapping) — add Terminal Tactics, Simulacra to C: drive; add 3 new articles to E: drive; add certs to D:\My_Documents\Certs\; update Certs description from "empty placeholder" to populated entries
  - [ ] Update PRD.md §7 (Success Metrics) — bump version to v2.1, add content volume metrics
  - [ ] Update TDD.md §4.1 (Content Schemas) — reflect updated article count (8 total) and categories; fix pre-existing `lastUpdated` type mismatch if applicable
  - [ ] Commit: `docs(conductor): Update PRD and TDD with new content mappings and version`
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Build Pipeline & Docs' (Protocol in workflow.md)
