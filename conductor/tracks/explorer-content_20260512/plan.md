# Implementation Plan: Track 2A — Explorer + Content

---

## Phase 0 — Assets: Drive & Folder Icons [checkpoint: f66040b]

- [x] Task 0.1: Create drive icon SVGs [8399710]
  - [x] Create `public/icons/drive-c.svg` (32×32, hard disk icon for C: drive)
  - [x] Create `public/icons/drive-d.svg` (32×32, hard disk icon for D: drive)
  - [x] Create `public/icons/drive-e.svg` (32×32, hard disk icon for E: drive)
- [x] Task 0.2: Create Explorer list icon SVGs [8399710]
  - [x] Create `public/icons/file.svg` (16×16, generic file icon)
  - [x] Create `public/icons/folder.svg` (16×16, folder icon)
  - [x] Create `public/icons/folder-open.svg` (16×16, open folder icon)
- [x] Task: Conductor - User Manual Verification 'Phase 0: Assets' (Protocol in workflow.md) [f66040b]

---

## Phase 1 — Content Layer: MDX Collections & Files

- [x] Task 1.1: Create `src/content/config.ts` [2a16fe5]
  - [x] Write failing tests validating the `projects` collection schema (title, slug, drive, description, repoUrl, language, techStack, stars, lastCommit, commits, status, icon)
  - [x] Write failing tests validating the `devopsAcademy` collection schema (title, slug, category, order, description, lastUpdated)
  - [x] Implement `config.ts` with both collections using `z` schemas per TDD §4.1
  - [x] Verify tests pass
- [x] Task 1.2: Write project MDX files for 3 featured projects [5c2587a]
  - [x] Create `src/content/projects/icarus-server-manager.mdx` (drive=C) with full frontmatter + project description
  - [x] Create `src/content/projects/chasing-chapters.mdx` (drive=C) with full frontmatter + project description
  - [x] Create `src/content/projects/tubular-bexus-osw.mdx` (drive=D) with full frontmatter + project description
  - [x] Write tests verifying frontmatter is parseable and schema-valid
- [x] Task 1.3: Write 3 stub DevOps Academy MDX articles [5c2587a]
  - [x] Create `src/content/devops-academy/docker-basics.mdx` (category=Docker) with frontmatter
  - [x] Create `src/content/devops-academy/linux-essentials.mdx` (category=Linux) with frontmatter
  - [x] Create `src/content/devops-academy/ci-cd-pipeline.mdx` (category=CI/CD) with frontmatter
  - [x] Write tests verifying schema compliance
- [x] Task 1.4: Verify content compiles end-to-end [5c2587a]
  - [x] Run `pnpm astro check` to verify no type errors
  - [x] Run `pnpm build` to verify content collections compile
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Content Layer' (Protocol in workflow.md)

---

## Phase 2 — Virtual Filesystem Tree

- [x] Task 2.1: Write filesystem type definitions & tests [2a2c522]
  - [x] Write tests for `FSNode` discriminated union types (`FSDrive`, `FSFolder`, `FSFile`)
  - [x] Write tests for `FILE_SYSTEM` constant shape (3 drives, correct hierarchy, valid children)
  - [x] Write tests for navigation helpers (`getChildren(path)`, `resolvePath(path)`, `getParent(path)`, `splitPath(path)`)
- [x] Task 2.2: Create `src/lib/constants.ts` [2a2c522]
  - [x] Implement `FSNode` discriminated union types
  - [x] Implement `FILE_SYSTEM` as a static typed constant with the 3-drive tree
  - [x] C:\Software_Engineering contains icarus-server-manager + chasing-chapters (drive=C projects)
  - [x] D:\Systems_Data contains tubular-bexus-osw (drive=D projects)
  - [x] E:\DevOps_Academy contains 3 stub articles (devopsAcademy grouped by category)
  - [x] Verify all tests pass
- [x] Task 2.3: Create `src/lib/filesystem.ts` with navigation helpers [2a2c522]
  - [x] Implement `getChildren(path: string): FSNode[]` — returns contents of a folder
  - [x] Implement `resolvePath(path: string): FSNode | null` — resolves a path to a node
  - [x] Implement `getParent(path: string): string` — returns parent path
  - [x] Implement `splitPath(path: string): string[]` — returns breadcrumb segments
  - [x] Verify all tests pass
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Virtual Filesystem' (Protocol in workflow.md)

---

## Phase 3 — Explorer Component: State, Navigation & List

- [x] Task 3.1: Add `explorerPath` to WindowState [7995e6e]
  - [x] Write tests for `explorerPath` on WindowState
  - [x] Add optional `explorerPath?: string` to `WindowState` interface in `src/stores/windows.ts`
  - [x] Default to `C:\` path on `openWindow('explorer')` via `buildWindowState`
  - [x] Verify tests pass
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
