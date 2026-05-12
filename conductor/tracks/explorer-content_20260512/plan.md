# Implementation Plan: Track 2A — Explorer + Content

---

## Phase 1 — Content Layer: MDX Collections & Files

- [ ] Task 1.1: Create `src/content/config.ts`
  - [ ] Write failing tests validating the `projects` collection schema (title, slug, drive, description, repoUrl, language, techStack, stars, lastCommit, commits, status, icon)
  - [ ] Write failing tests validating the `devopsAcademy` collection schema (title, slug, category, order, description, lastUpdated)
  - [ ] Implement `config.ts` with both collections using `z` schemas per TDD §4.1
  - [ ] Verify tests pass
- [ ] Task 1.2: Write project MDX files for 3 featured projects
  - [ ] Create `src/content/projects/icarus-server-manager.mdx` (C:\ drive) with full frontmatter + project description
  - [ ] Create `src/content/projects/chasing-chapters.mdx` (C:\ drive) with full frontmatter + project description
  - [ ] Create `src/content/projects/tubular-bexus-osw.mdx` (D:\ drive) with full frontmatter + project description
  - [ ] Write tests verifying frontmatter is parseable and schema-valid
- [ ] Task 1.3: Write 3 stub DevOps Academy MDX articles
  - [ ] Create `src/content/devops-academy/docker-basics.mdx` with frontmatter
  - [ ] Create `src/content/devops-academy/linux-essentials.mdx` with frontmatter
  - [ ] Create `src/content/devops-academy/ci-cd-pipeline.mdx` with frontmatter
  - [ ] Write tests verifying schema compliance
- [ ] Task 1.4: Verify content compiles end-to-end
  - [ ] Run `pnpm astro check` to verify no type errors
  - [ ] Run `pnpm build` to verify content collections compile
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Content Layer' (Protocol in workflow.md)

---

## Phase 2 — Virtual Filesystem Tree

- [ ] Task 2.1: Write filesystem tree type definitions & tests
  - [ ] Write tests for `FSNode` type definitions (drive, folder, file variants)
  - [ ] Write tests for `FILE_SYSTEM` constant shape (3 drives, correct hierarchy)
  - [ ] Write tests for navigation helpers (`getChildren(path)`, `resolvePath(path)`, `getParent(path)`)
- [ ] Task 2.2: Create `src/lib/constants.ts`
  - [ ] Implement `FSNode` discriminated union types (`FSDrive`, `FSFolder`, `FSFile`)
  - [ ] Implement `FILE_SYSTEM` constant with 3-drive tree (C:, D:, E:)
  - [ ] Populate project files from content collection data
  - [ ] Populate DevOps Academy stubs under E:\DevOps_Academy
  - [ ] Verify all tests pass
- [ ] Task 2.3: Implement filesystem navigation helpers
  - [ ] Write `getChildren(path: string): FSNode[]` — returns contents of a folder
  - [ ] Write `resolvePath(path: string): FSNode | null` — resolves a path to a node
  - [ ] Write `getParent(path: string): string` — returns parent path
  - [ ] Write `splitPath(path: string): string[]` — returns breadcrumb segments
  - [ ] Verify all tests pass
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Virtual Filesystem' (Protocol in workflow.md)

---

## Phase 3 — Explorer Component: Navigation & List

- [ ] Task 3.1: Write failing tests for Explorer component shell
  - [ ] Test Explorer renders address bar with correct path
  - [ ] Test Explorer renders toolbar with back + up buttons
  - [ ] Test Explorer renders breadcrumb navigation
  - [ ] Test Explorer renders file list pane
- [ ] Task 3.2: Create `src/components/apps/Explorer.tsx` — Shell
  - [ ] Implement address bar (XP-style path display)
  - [ ] Implement toolbar (back button, up-level button)
  - [ ] Implement breadcrumb (clickable path segments)
  - [ ] Implement file list pane with XP Detail View columns
  - [ ] Implement drive selector root view (C:, D:, E: icons)
  - [ ] Wire tests to pass
- [ ] Task 3.3: Implement folder navigation
  - [ ] Write tests for navigation flow (root → Software_Engineering → back to root)
  - [ ] Implement `navigateTo(path)` state logic
  - [ ] Implement back button (history stack)
  - [ ] Implement up-level button
  - [ ] Implement breadcrumb click navigation
  - [ ] Verify tests pass
- [ ] Task 3.4: Implement empty folder state
  - [ ] Write test for empty folder rendering
  - [ ] Implement "This folder is empty." message with XP folder icon
  - [ ] Verify tests pass
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Explorer Navigation & List' (Protocol in workflow.md)

---

## Phase 4 — Explorer: Inline Content Display

- [ ] Task 4.1: Write failing tests for detail pane
  - [ ] Test clicking a project file opens detail pane
  - [ ] Test detail pane shows project title, description, tech stack, repo link
  - [ ] Test clicking folder does NOT open detail pane (navigates instead)
- [ ] Task 4.2: Implement inline detail pane
  - [ ] Implement split-pane layout (file list left, detail right)
  - [ ] Wire click handler: .mdx files → render detail pane, folders → navigate
  - [ ] Render project title, description, tech stack badges, and repo URL button
  - [ ] Style pane to match XP aesthetic (white background, 3D inset border)
  - [ ] Verify tests pass
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Inline Content Display' (Protocol in workflow.md)

---

## Phase 5 — Integration & Wiring

- [ ] Task 5.1: Add `explorerPath` to WindowState
  - [ ] Write tests for path state persistence in window store
  - [ ] Add optional `explorerPath?: string` to `WindowState` interface
  - [ ] Default to root path on `openWindow('explorer')`
  - [ ] Update Explorer to read/write path from window store
- [ ] Task 5.2: Update WindowLayer to mount Explorer
  - [ ] Replace placeholder content in WindowLayer for 'explorer' window
  - [ ] Mount `<Explorer windowId="explorer" />` inside WindowFrame
  - [ ] Write tests verifying Explorer mounts inside window frame
- [ ] Task 5.3: Wire desktop icons
  - [ ] Verify My Computer desktop icon opens Explorer at root
  - [ ] Verify My Documents desktop icon opens Explorer at My Documents view
- [ ] Task 5.4: Wire Start Menu
  - [ ] Verify Start Menu "Explorer" item opens Explorer at root
  - [ ] Verify Start Menu "My Computer" item opens Explorer at root
- [ ] Task 5.5: Final integration verification
  - [ ] Run full test suite — all tests passing
  - [ ] Run coverage report — ≥ 80% coverage
  - [ ] Run `pnpm astro check` — no type errors
  - [ ] Run `pnpm lint` — no lint errors
  - [ ] Verify no `src/` file exceeds 500 lines (modularity check)
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Integration & Wiring' (Protocol in workflow.md)
