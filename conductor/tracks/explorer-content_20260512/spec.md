# Specification: Track 2A — Explorer + Content

## Overview

Build a file explorer application with breadcrumb navigation through a virtual filesystem (C:, D:, E: drives). Project MDX content renders inline inside the Explorer window via a split-pane detail view. This track also creates the content collection schemas, MDX project files, and the virtual filesystem tree.

## References

- [PRD §4](./PRD.md#4-file-system--content-mapping) — File System & Content Mapping
- [TDD §4.1](./TDD.md#41-project-mdx-frontmatter) — MDX Frontmatter Schema
- [TDD §4.3](./TDD.md#43-virtual-filesystem-tree) — Virtual Filesystem Tree
- [TDD §6](./TDD.md#react-islands-interactive) — React Islands (Explorer)
- [TDD §11](./TDD.md#11-error-states) — Error States (empty folder)

## Virtual Filesystem Layout

```
C:\ (Local Disk)
  └── Software_Engineering\
        ├── icarus-server-manager.mdx
        └── chasing-chapters.mdx

D:\ (Local Disk)
  └── Systems_Data\
        └── tubular-bexus-osw.mdx

E:\ (Local Disk)
  └── DevOps_Academy\
        ├── docker-basics.mdx        (stub)
        ├── linux-essentials.mdx     (stub)
        └── ci-cd-pipeline.mdx       (stub)
```

## Functional Requirements

### 1. Content Layer (MDX + Collections)

- **FR1.1:** Create `src/content/config.ts` with `projects` collection schema (title, slug, drive, description, repoUrl, language, techStack, stars, lastCommit, commits, status, icon) and `devopsAcademy` collection schema (title, slug, category, order, description, lastUpdated).
- **FR1.2:** Create real MDX files for `icarus-server-manager`, `chasing-chapters`, and `tubular-bexus-osw` in `src/content/projects/` with proper frontmatter.
- **FR1.3:** Create 3 stub MDX files for DevOps Academy articles in `src/content/devops-academy/` with frontmatter.
- **FR1.4:** Export both collections from `config.ts`.

### 2. Virtual Filesystem Tree

- **FR2.1:** Create `src/lib/constants.ts` with `FILE_SYSTEM` constant defining the three-drive tree structure as typed `FSNode` objects.
- **FR2.2:** Each drive node has `type: 'drive'`, folder nodes have `type: 'folder'` with `children`, file nodes have `type: 'file'` with metadata (name, size, icon, slug).
- **FR2.3:** Filesystem data is built from the content collections at import time (static, not build-time).

### 3. Explorer React Component

- **FR3.1:** Create `src/components/apps/Explorer.tsx` as a React island.
- **FR3.2:** **Address Bar**: XP-style path display (e.g., `C:\Software_Engineering`).
- **FR3.3:** **Toolbar**: Back button, up-level button, XP-style divider.
- **FR3.4:** **Breadcrumb Navigation**: Clickable path segments. Clicking "C:\" navigates to drive root.
- **FR3.5:** **File List Pane**: Default view shows C:, D:, E: drive icons. Navigating into a folder shows XP Detail View columns: Icon (16×16), Name, Size, Type.
- **FR3.6:** **Inline Detail Pane**: When a project file (.mdx) is clicked, the right pane renders the MDX content (title, description, tech stack, repo link).
- **FR3.7:** **Empty Folder State**: Shows "This folder is empty." message matching XP behavior.

### 4. Integration

- **FR4.1:** Wire My Computer desktop icon → opens Explorer at root (C:, D:, E: drives).
- **FR4.2:** Wire Start Menu Explorer item → opens Explorer at root.
- **FR4.3:** Update `WindowLayer.tsx` to mount Explorer inside the 'explorer' window frame instead of the placeholder.
- **FR4.4:** Explorer stores its current path in window state (`explorerPath` on the `WindowState`).

## Non-Functional Requirements

- **NFR1:** All files in `src/` must stay under 500 lines (modularity check).
- **NFR2:** TDD required: write failing tests first, then implement.
- **NFR3:** Code coverage ≥ 80% for all new modules.
- **NFR4:** Explorer must respect `prefers-reduced-motion: reduce`.

## Acceptance Criteria

```
✅ Double-click My Computer → Explorer opens showing C:, D:, E: drives
✅ Navigate into C:\Software_Engineering → see project files listed
✅ Click a project file → MDX content renders in the Explorer detail pane
✅ Breadcrumb updates on navigation and is clickable
✅ Back button returns to previous directory
✅ Empty folders show "This folder is empty."
✅ File list matches XP Explorer detail view (Icon, Name Size, Type columns)
✅ E:\DevOps_Academy shows 3 stub articles
✅ All tests pass with ≥ 80% coverage
```

## Out of Scope

- File operations (copy, delete, rename, create)
- Right-click context menus
- Drag-and-drop files
- Search/filter functionality
- Persisting explorer path across page reloads (postponed to Track 3B — URL State)
