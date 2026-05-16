# Implementation Plan: Content Drop (Track 6C)

## Phase 1: Project MDX Files — Terminal Tactics & Simulacra

- [ ] Task: Write tests for new project frontmatter schema
  - [ ] Write tests verifying terminal-tactics.mdx has valid frontmatter (title, slug, drive: 'C', description, repoUrl, techStack, status: 'active')
  - [ ] Write tests verifying simulacra.mdx has valid frontmatter (title, slug, drive: 'C', description, repoUrl, techStack, status: 'wip')
  - [ ] Run tests and confirm they pass (schema validation)
  - [ ] Verify coverage: `CI=true pnpm test:coverage`
  - [ ] Commit: `test(projects): Add schema validation tests for new project MDX files`
- [ ] Task: Create terminal-tactics.mdx project file
  - [ ] Write failing test: assert project content renders in Explorer and CMD `cat` output
  - [ ] Create `src/content/projects/terminal-tactics.mdx` with full frontmatter and substantive body content
  - [ ] Run tests to pass; verify coverage
  - [ ] Commit: `feat(projects): Add Terminal Tactics project MDX entry`
- [ ] Task: Create simulacra.mdx project file
  - [ ] Create `src/content/projects/simulacra.mdx` with full frontmatter and substantive body content
  - [ ] Run tests; verify coverage
  - [ ] Commit: `feat(projects): Add Simulacra project MDX entry`
- [ ] Task: Update static and dynamic filesystem + metadata
  - [ ] Update `src/lib/constants.ts` — add terminal-tactics and simulacra to C:\Software_Engineering folder
  - [ ] Update `src/lib/projects-data.ts` — add metadata entries for both projects
  - [ ] Update `scripts/generate-filesystem.mjs` — verify both projects are auto-discovered
  - [ ] Run tests passing; verify no regressions
  - [ ] Commit: `feat(filesystem): Register new projects in filesystem tree and metadata`
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Project MDX Files' (Protocol in workflow.md)

## Phase 2: Knowledge Base Articles

- [ ] Task: Write tests for new article frontmatter schema
  - [ ] Write tests verifying all 3 new articles have valid frontmatter (title, slug, category: 'Software Engineering', order, description, lastUpdated)
  - [ ] Verify coverage: `CI=true pnpm test:coverage`
  - [ ] Commit: `test(articles): Add schema validation tests for new article MDX files`
- [ ] Task: Create agent-assisted-coding.mdx article
  - [ ] Write failing test: assert article appears in Knowledge Base under Software Engineering category
  - [ ] Create `src/content/articles/agent-assisted-coding.mdx` with frontmatter and substantive body
  - [ ] Run tests to pass; verify coverage
  - [ ] Commit: `feat(articles): Add Agent-Assisted Coding article`
- [ ] Task: Create tdd.mdx article
  - [ ] Create `src/content/articles/tdd.mdx` with frontmatter and substantive body
  - [ ] Run tests; verify coverage
  - [ ] Commit: `feat(articles): Add TDD article`
- [ ] Task: Create database-design-patterns.mdx article
  - [ ] Create `src/content/articles/database-design-patterns.mdx` with frontmatter and substantive body
  - [ ] Run tests; verify coverage
  - [ ] Commit: `feat(articles): Add Database Design Patterns article`
- [ ] Task: Verify compile script picks up new articles
  - [ ] Run `node scripts/compile-articles.mjs` and confirm articles-content.json contains all 3 new entries
  - [ ] Update `src/lib/constants.ts` E:\Knowledge_Base tree with new articles
  - [ ] Re-run all tests; verify no regressions
  - [ ] Commit: `chore(build): Register new articles in compile pipeline and filesystem`
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Knowledge Base Articles' (Protocol in workflow.md)

## Phase 3: Resume PDF Redesign

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
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Resume PDF' (Protocol in workflow.md)

## Phase 4: Certifications

- [ ] Task: Create cert metadata and data structures
  - [ ] Write tests for cert metadata schema (name, issuer, date, credentialUrl)
  - [ ] Add cert data exports to `src/lib/projects-data.ts` (CERTIFICATIONS_METADATA with ACP and ACA entries)
  - [ ] Run tests; verify coverage
  - [ ] Commit: `feat(data): Add certifications metadata for Alibaba Cloud certs`
- [ ] Task: Wire Certs folder into Explorer detail pane
  - [ ] Update `src/lib/constants.ts` — populate D:\My_Documents\Certs\ folder with cert file entries
  - [ ] Update `scripts/generate-filesystem.mjs` — add static Certs folder population
  - [ ] Create cert detail view in ExplorerDetailPane for cert items (issuer, date, credential URL)
  - [ ] Write tests: Explorer navigates to D:\My_Documents\Certs and displays cert entries
  - [ ] Run all tests; verify coverage > 80%
  - [ ] Commit: `feat(explorer): Add certification entries and detail view for Certs folder`
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Certifications' (Protocol in workflow.md)

## Phase 5: Build Pipeline & Docs

- [ ] Task: Update build pipeline and verify build
  - [ ] Verify `node scripts/prebuild.mjs` completes with all new content
  - [ ] Run `pnpm build` and confirm zero errors
  - [ ] Run full test suite: `CI=true pnpm test:coverage` (verify ≥80%)
  - [ ] Commit: `chore(build): Rebuild content pipeline with new projects and articles`
- [ ] Task: Update PRD.md and TDD.md documentation
  - [ ] Update PRD.md §4 (File System & Content Mapping) — add Terminal Tactics, Simulacra to C: drive; add 3 new articles to E: drive; add certs to D:\My_Documents\Certs\
  - [ ] Update TDD.md §4.1 (Content Schemas) — reflect updated article count (8 total) and categories
  - [ ] Commit: `docs(conductor): Update PRD and TDD with new content mappings`
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Build Pipeline & Docs' (Protocol in workflow.md)
