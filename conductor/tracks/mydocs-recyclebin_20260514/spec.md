# Track 3C — My Documents & Recycle Bin

**Track ID:** `mydocs-recyclebin_20260514`
**Type:** Feature
**Status:** New

## Overview

Implement two new Explorer views — **My Documents** (`mydocs` window) and **Recycle Bin** (`recyclebin` window) — replacing the current placeholder text. My Documents displays a professional portfolio folder (Resume, contact info, and a placeholder Certs folder), while the Recycle Bin provides an archived/deleted-style view linking to a legacy repository (`chasing-chapters`, pre-v2).

## Functional Requirements

### FR1 — My Documents Explorer View

- Double-clicking the **My Documents** desktop icon opens the `mydocs` window (600×450, position 120,80).
- The view shows a file list with three entries:
  - **`Resume.pdf`** — clicking opens `/resume.pdf` in a new browser tab via `window.open()`. The file must exist in `public/resume.pdf` before this view can function.
  - **`Certs/`** — an empty folder. Navigating into it displays "This folder is empty." (matching the standard XP empty folder UX). This serves as a placeholder for future certificate PDF uploads.
  - **`Contact.txt`** — clicking opens the right detail pane showing formatted metadata fields:
    - **Name:** Muhammad Ansyar Rafi Putra
    - **Title:** Software Engineer (DevOps & Data)
    - **Email:** your.email@example.com (placeholder — user to replace)
    - **GitHub:** [github.com/mansyar](https://github.com/mansyar)
    - **LinkedIn:** linkedin.com/in/your-profile (placeholder — user to replace)
    - **Location:** Indonesia
- The virtual filesystem `FILE_SYSTEM` is updated as follows:
  - The existing `D:` drive (currently `D:\Systems_Data` with `tubular-bexus-osw.mdx`) gains a **second** folder: `D:\My_Documents` containing `Resume.pdf`, `Certs/` (empty), and `Contact.txt`. The existing `D:\Systems_Data` folder is preserved.
  - The build-time script `scripts/generate-filesystem.mjs` must be updated to include the static My Documents entries alongside its dynamic generation.

### FR2 — Recycle Bin Explorer View

- Double-clicking the **Recycle Bin** desktop icon opens the `recyclebin` window (550×400, position 150,90).
- The Recycle Bin is defined as a **virtual root-level folder** (not a drive) at path `\Recycle_Bin`. The filesystem helpers (`getChildren`, `resolvePath`) are modified to recognize this special path and return the deleted items.
- Shows a styled "Deleted Items" view with one entry:
  - **`chasing-chapters (v1)`** — grayed-out icon, strikethrough name, "ARCHIVED" badge.
  - Clicking opens the detail pane showing:
    - **Title:** chasing-chapters (v1)
    - **Status:** Archived / Deleted
    - **Description:** Original version of the chasing-chapters project (pre-v2).
    - **Repository:** (placeholder GitHub URL — user to fill)
    - A mocked "Restore" button that is non-functional (disabled, shows tooltip "Cannot restore — Original location does not exist").

### FR3 — Start Menu Consistency

- The **Start Menu** left column item "Resume" (which opens `mydocs` window) and right column item "My Documents" (also opens `mydocs` window) already exist and require no changes.
- No Recycle Bin entry in the Start Menu (only desktop icon access), matching the real XP behavior.

## Non-Functional Requirements

- Both views reuse the existing `Explorer`, `ExplorerFileList`, `ExplorerDetailPane`, `ExplorerToolbar`, and `ExplorerBreadcrumb` components.
- Recycle Bin items use a distinct visual style — reduced opacity, "deleted" icon overlay, strikethrough text.
- No new Nano Stores needed — existing `$windows` store handles the `mydocs` and `recyclebin` window IDs (already defined in `WindowId` type).
- Detail pane for `Contact.txt` uses the existing `ExplorerDetailPane` with a new `CONTACT_METADATA` lookup source.
- Recycle Bin detail pane uses a new `RECYCLE_BIN_METADATA` lookup source in `ExplorerDetailPane`.
- All navigation (back, up-level, breadcrumb) works identically to the Explorer.
- Must pass all existing tests and maintain ≥80% coverage.

## Acceptance Criteria

```
✅ My Documents opens showing Resume.pdf, Certs/ folder, and Contact.txt
✅ Clicking Resume.pdf opens PDF in a new browser tab
✅ Certs/ folder shows "This folder is empty" when navigated into
✅ Clicking Contact.txt shows name, email, GitHub, LinkedIn, location in detail pane
✅ Recycle Bin (path \Recycle_Bin) opens with "chasing-chapters (v1)" listed as a deleted/archived item
✅ Clicking the deleted item shows detail pane with archive status + disabled Restore button
✅ Both My Documents and Recycle Bin support back/up-level/breadcrumb navigation
✅ D: drive shows both Systems_Data and My_Documents folders (existing content preserved)
✅ All existing tests still pass
✅ Each file in src/ remains under 500 lines (modularity check)
```

## Design Decisions & Deviations from PRD

- **`D:\My_Documents` as sibling to `D:\Systems_Data`:** The PRD does not assign a specific drive to My Documents. Using D: with two sibling folders (`Systems_Data` and `My_Documents`) avoids creating a new drive while keeping the data model clean.
- **`\Recycle_Bin` as virtual root-level folder:** The Recycle Bin is not a drive. Modeling it as a special root-level folder keeps the filesystem helpers consistent.
- **`mansyar.github.io` omitted:** The PRD §4 mentions mansyar.github.io as a Recycle Bin link. Confirmed this domain does not exist, so only `chasing-chapters (v1)` is listed.
- **`Resume.pdf` must be externally provided:** The TDD §4.4 assumes this file exists in `public/`. It is not generated by any build script — the user must place their actual resume PDF there.

## Out of Scope

- Uploading or adding real certificate PDFs to Certs/ (deferred — user fills later)
- Actual file restore functionality for Recycle Bin (cosmetic only)
- Tab-completion or right-click context menus (project-wide v1 constraint)
- Dual-pane drag-and-drop between Explorer windows
