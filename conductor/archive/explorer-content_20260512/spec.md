# Specification: Track 2A — Explorer + Content

## Overview

Build a file explorer application with integrated address-bar/breadcrumb navigation through a virtual filesystem (C:, D:, E: drives). Project metadata renders inline inside the Explorer window via a split-pane detail view. This track also creates the content collection schemas, MDX project files, a static virtual filesystem tree, and navigation helpers.

## References

- [PRD §4](./PRD.md#4-file-system--content-mapping) — File System & Content Mapping
- [TDD §4.1](./TDD.md#41-project-mdx-frontmatter) — MDX Frontmatter Schema
- [TDD §4.2](./TDD.md#42-github-api-data-shape) — GitHub API Data Shape
- [TDD §4.3](./TDD.md#43-virtual-filesystem-tree) — Virtual Filesystem Tree
- [TDD §6](./TDD.md#react-islands-interactive) — React Islands (Explorer)
- [TDD §11](./TDD.md#11-error-states) — Error States (empty folder)

## Virtual Filesystem Layout

```
C:\ (Local Disk)
  └── Software_Engineering\
        ├── icarus-server-manager.mdx   (projects collection, drive=C)
        └── chasing-chapters.mdx        (projects collection, drive=C)

D:\ (Local Disk)
  └── Systems_Data\
        └── tubular-bexus-osw.mdx       (projects collection, drive=D)

E:\ (Local Disk)
  └── DevOps_Academy\
        ├── docker-basics.mdx           (devopsAcademy collection, category=Docker)
        ├── linux-essentials.mdx        (devopsAcademy collection, category=Linux)
        └── ci-cd-pipeline.mdx          (devopsAcademy collection, category=CI/CD)
```

> **Note on hybrid data sources:** C: and D: drives are populated from the `projects` collection (filtered by the `drive` frontmatter field, `z.enum(['C', 'D'])`). E: is populated from the `devopsAcademy` collection (which has no `drive` field — articles are grouped by `category`). The `FILE_SYSTEM` constant in `constants.ts` is a static mirror of this structure, manually declared to match the expected content.

## Functional Requirements

### 1. Content Layer (MDX + Collections)

- **FR1.1:** Create `src/content/config.ts` with `projects` collection schema (title, slug, drive, description, repoUrl, language, techStack, stars, lastCommit, commits, status, icon) and `devopsAcademy` collection schema (title, slug, category, order, description, lastUpdated).
- **FR1.2:** Create real MDX files for `icarus-server-manager`, `chasing-chapters`, and `tubular-bexus-osw` in `src/content/projects/` with proper frontmatter.
- **FR1.3:** Create 3 stub MDX files for DevOps Academy in `src/content/devops-academy/` with frontmatter (`category` set appropriately: Docker, Linux, CI/CD).
- **FR1.4:** Export both collections from `config.ts`.

### 2. Virtual Filesystem Tree

- **FR2.1:** Create `src/lib/constants.ts` with `FILE_SYSTEM` constant defining the three-drive tree structure as typed `FSNode` objects.
- **FR2.2:** Each drive node has `type: 'drive'`, folder nodes have `type: 'folder'` with `children`, file nodes have `type: 'file'` with metadata (name, size, icon, slug).
- **FR2.3:** `FILE_SYSTEM` is a static typed constant that mirrors the content collections. Each drive/folder/file subtree is manually declared to reflect the current set of project and academy content. (Dynamic population from content collections at build-time is deferred to Track 3A — GitHub Data Sync.)
- **FR2.4:** Create `src/lib/filesystem.ts` with pure-function navigation helpers: `getChildren(path)`, `resolvePath(path)`, `getParent(path)`, `splitPath(path)`.

### 3. Explorer React Component

- **FR3.1:** Create `src/components/apps/Explorer.tsx` as a React island accepting `{ windowId: WindowId }` as props. It reads and writes its current path from `$windows[windowId].explorerPath`.
- **FR3.2:** **Address Bar with Integrated Breadcrumb**: Displays the current path (e.g., `C:\Software_Engineering`). Each path segment is clickable — clicking a segment navigates directly to that directory level. XP-style path display formatting.
- **FR3.3:** **Toolbar**: Back button, up-level button, XP-style divider.
- **FR3.4:** **File List Pane**: Default root view shows C:, D:, E: drive icons (32×32). Navigating into a folder switches to XP Detail View columns: Icon (16×16), Name, Size, Type, Date Modified.
- **FR3.5:** **Inline Detail Pane**: When a project file is clicked, the right pane renders the project's frontmatter metadata (title, description, tech stack badges, repo link button). Content is extracted from a pre-bundled JSON data blob, not by importing MDX at runtime.
- **FR3.6:** **Empty Folder State**: Shows "This folder is empty." message with folder icon, matching XP behavior.

### 4. Integration

- **FR4.1:** Wire My Computer desktop icon → opens Explorer at root (C:, D:, E: drives).
- **FR4.2:** Wire Start Menu Explorer item → opens Explorer at root.
- **FR4.3:** Update `WindowLayer.tsx` to mount Explorer inside the 'explorer' window frame instead of the placeholder.
- **FR4.4:** Add `explorerPath?: string` to `WindowState`. Default to `C:\` on `openWindow('explorer')`.

### 5. Assets

- **FR5.1:** Create 3 drive icon SVGs at 32×32 (`public/icons/drive-c.svg`, `drive-d.svg`, `drive-e.svg`).
- **FR5.2:** Ensure 16×16 Explorer list icons exist for file types (`file.svg`, `folder.svg`).

## Non-Functional Requirements

- **NFR1:** All files in `src/` must stay under 500 lines (modularity check).
- **NFR2:** TDD required: write failing tests first, then implement.
- **NFR3:** Code coverage ≥ 80% for all new modules.
- **NFR4:** Explorer must respect `prefers-reduced-motion: reduce`.

## Acceptance Criteria

```
✅ Double-click My Computer → Explorer opens showing C:, D:, E: drives
✅ Navigate into C:\Software_Engineering → see project files listed (Icon, Name, Size, Type, Date)
✅ Click a project file → detail pane shows title, description, tech stack badges, repo link
✅ Address bar displays current path; clicking a segment navigates to that directory
✅ Back button returns to previous directory; up-level goes to parent
✅ Empty folders show "This folder is empty."
✅ 3 drive icon SVGs exist in public/icons/
✅ E:\DevOps_Academy shows 3 stub articles
✅ All tests pass with ≥ 80% coverage
```

## Out of Scope

- File operations (copy, delete, rename, create)
- Right-click context menus
- Drag-and-drop files
- Search/filter functionality
- Full MDX body rendering (metadata-only in v1)
- Persisting explorer path across page reloads (postponed to Track 3B — URL State)
- Dynamic population from content collections at build-time (postponed to Track 3A)
