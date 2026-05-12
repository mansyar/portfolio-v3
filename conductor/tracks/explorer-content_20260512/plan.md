# Implementation Plan: Track 2A — Explorer + Content

---

## Phase 0 — Assets: Drive & Folder Icons

- [x] Task 0.1: Create drive icon SVGs [8399710]
  - [x] Create `public/icons/drive-c.svg` (32×32, hard disk icon for C: drive)
  - [x] Create `public/icons/drive-d.svg` (32×32, hard disk icon for D: drive)
  - [x] Create `public/icons/drive-e.svg` (32×32, hard disk icon for E: drive)
- [x] Task 0.2: Create Explorer list icon SVGs [8399710]
  - [x] Create `public/icons/file.svg` (16×16, generic file icon)
  - [x] Create `public/icons/folder.svg` (16×16, folder icon)
  - [x] Create `public/icons/folder-open.svg` (16×16, open folder icon)
- [ ] Task: Conductor - User Manual Verification 'Phase 0: Assets' (Protocol in workflow.md)

---

## Phase 1 — Content Layer: MDX Collections & Files

- [ ] Task 1.1: Create `src/content/config.ts`
  - [ ] Write failing tests validating the `projects` collection schema (title, slug, drive, description, repoUrl, language, techStack, stars, lastCommit, commits, status, icon)
  - [ ] Write failing tests validating the `devopsAcademy` collection schema (title, slug, category, order, description, lastUpdated)
  - [ ] Implement `config.ts` with both collections using `z` schemas per TDD §4.1
  - [ ] Verify tests pass
- [ ] Task 1.2: Write project MDX files for 3 featured projects
  - [ ] Create `src/content/projects/icarus-server-manager.mdx` (drive=C) with full frontmatter + project description
  - [ ] Create `src/content/projects/chasing-chapters.mdx` (drive=C) with full frontmatter + project description
  - [ ] Create `src/content/projects/tubular-bexus-osw.mdx` (drive=D) with full frontmatter + project description
  - [ ] Write tests verifying frontmatter is parseable and schema-valid
- [ ] Task 1.3: Write 3 stub DevOps Academy MDX articles
  - [ ] Create `src/content/devops-academy/docker-basics.mdx` (category=Docker) with frontmatter
  - [ ] Create `src/content/devops-academy/linux-essentials.mdx` (category=Linux) with frontmatter
  - [ ] Create `src/content/devops-academy/ci-cd-pipeline.mdx` (category=CI/CD) with frontmatter
  - [ ] Write tests verifying schema compliance
- [ ] Task 1.4: Verify content compiles end-to-end
  - [ ] Run `pnpm astro check` to verify no type errors
  - [ ] Run `pnpm build` to verify content collections compile
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Content Layer' (Protocol in workflow.md)

---

## Phase 2 — Virtual Filesystem Tree

- [ ] Task 2.1: Write filesystem type definitions & tests
  - [ ] Write tests for `FSNode` discriminated union types (`FSDrive`, `FSFolder`, `FSFile`)
  - [ ] Write tests for `FILE_SYSTEM` constant shape (3 drives, correct hierarchy, valid children)
  - [ ] Write tests for navigation helpers (`getChildren(path)`, `resolvePath(path)`, `getParent(path)`, `splitPath(path)`)
- [ ] Task 2.2: Create `src/lib/constants.ts`
  - [ ] Implement `FSNode` discriminated union types
  - [ ] Implement `FILE_SYSTEM` as a static typed constant with the 3-drive tree
  - [ ] C:\Software_Engineering contains icarus-server-manager + chasing-chapters (drive=C projects)
  - [ ] D:\Systems_Data contains tubular-bexus-osw (drive=D projects)
  - [ ] E:\DevOps_Academy contains 3 stub articles (devopsAcademy grouped by category)
  - [ ] Verify all tests pass
- [ ] Task 2.3: Create `src/lib/filesystem.ts` with navigation helpers
  - [ ] Implement `getChildren(path: string): FSNode[]` — returns contents of a folder
  - [ ] Implement `resolvePath(path: string): FSNode | null` — resolves a path to a node
  - [ ] Implement `getParent(path: string): string` — returns parent path
  - [ ] Implement `splitPath(path: string): string[]` — returns breadcrumb segments
  - [ ] Verify all tests pass
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Virtual Filesystem' (Protocol in workflow.md)

---

## Phase 3 — Explorer Component: State, Navigation & List

- [ ] Task 3.1: Add `explorerPath` to WindowState
  - [ ] Write tests for `explorerPath` on WindowState
  - [ ] Add optional `explorerPath?: string` to `WindowState` interface in `src/stores/windows.ts`
  - [ ] Default to `C:\` path on `openWindow('explorer')` via `buildWindowState`
  - [ ] Verify tests pass
- [ ] Task 3.2: Write failing tests for Explorer sub-components
  - [ ] Test `ExplorerToolbar` renders back + up buttons with correct enabled/disabled state
  - [ ] Test `ExplorerBreadcrumb` renders path segments; clicking a segment navigates
  - [ ] Test `ExplorerFileList` shows drive icons at root, XP detail columns in folders
  - [ ] Test `ExplorerFileList` shows "This folder is empty." for empty directories
  - [ ] Test Explorer shell composes all sub-components correctly
- [ ] Task 3.3: Create Explorer sub-components
  - [ ] Create `src/components/apps/ExplorerToolbar.tsx` — back button, up-level button, XP-style divider
  - [ ] Create `src/components/apps/ExplorerBreadcrumb.tsx` — clickable path segments (merged address bar + breadcrumb)
  - [ ] Create `src/components/apps/ExplorerFileList.tsx` — drive root view + XP Detail View columns + empty state
  - [ ] Create `src/components/apps/Explorer.tsx` — parent shell that composes sub-components, manages navigation state, and reads/writes `explorerPath` from store
  - [ ] Wire tests to pass
- [ ] Task 3.4: Implement folder navigation
  - [ ] Write tests for navigation flow (root → Software_Engineering → back to root)
  - [ ] Implement `navigateTo(path)` — updates `explorerPath` in store, refreshes file list
  - [ ] Implement back button (history stack of visited paths)
  - [ ] Implement up-level button (navigates to parent directory)
  - [ ] Implement breadcrumb click navigation
  - [ ] Verify tests pass
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Explorer Navigation & List' (Protocol in workflow.md)

---

## Phase 4 — Explorer: Inline Content Display

- [ ] Task 4.1: Create project metadata JSON data source
  - [ ] Extract frontmatter from all project MDX files into a static JSON structure
  - [ ] Create `src/content/projects-data.ts` exporting `PROJECTS_METADATA` record keyed by slug
  - [ ] Write tests verifying metadata JSON matches expected shape for each project
- [ ] Task 4.2: Write failing tests for detail pane
  - [ ] Test clicking a project file opens detail pane
  - [ ] Test detail pane shows project title, description, tech stack badges, repo link
  - [ ] Test clicking a folder does NOT open detail pane (navigates instead)
  - [ ] Test detail pane is empty/closed when no file is selected
- [ ] Task 4.3: Implement inline detail pane
  - [ ] Create `src/components/apps/ExplorerDetailPane.tsx` — split-pane layout (file list left, detail right)
  - [ ] Wire click handler: project files → render detail pane with metadata; folders → navigate
  - [ ] Render project title (heading), description (paragraph), tech stack badges, repo URL button ("View on GitHub")
  - [ ] Style detail pane to match XP aesthetic (white background, 3D inset border, Tahoma font)
  - [ ] Verify tests pass
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Inline Content Display' (Protocol in workflow.md)

---

## Phase 5 — Integration & Wiring

- [ ] Task 5.1: Update WindowLayer to mount Explorer
  - [ ] Replace placeholder content in WindowLayer for 'explorer' window
  - [ ] Mount `<Explorer windowId="explorer" />` inside WindowFrame
  - [ ] Write tests verifying Explorer mounts inside window frame
- [ ] Task 5.2: Wire desktop icons → Explorer
  - [ ] Verify My Computer desktop icon (`windowId="explorer"`) opens Explorer at root
  - [ ] Verify My Documents desktop icon opens Explorer at My Documents view
- [ ] Task 5.3: Wire Start Menu → Explorer
  - [ ] Verify Start Menu "Explorer" item opens Explorer at root
  - [ ] Verify Start Menu "My Computer" item opens Explorer at root
- [ ] Task 5.4: Final integration verification
  - [ ] Run full test suite — all tests passing
  - [ ] Run coverage report — ≥ 80% coverage
  - [ ] Run `pnpm astro check` — no type errors
  - [ ] Run `pnpm lint` — no lint errors
  - [ ] Verify no `src/` file exceeds 500 lines (modularity check)
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Integration & Wiring' (Protocol in workflow.md)
