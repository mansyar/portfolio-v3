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
  - **`Resume.pdf`** — clicking opens `/resume.pdf` in a new browser tab via `window.open()`.
  - **`Certs/`** — an empty folder. Navigating into it displays "This folder is empty." (matching the standard XP empty folder UX). This serves as a placeholder for future certificate PDF uploads.
  - **`Contact.txt`** — clicking opens the right detail pane showing:
    - **Name:** Muhammad Ansyar Rafi Putra
    - **Title:** Software Engineer (DevOps & Data)
    - **Email:** (placeholder for user to fill)
    - **GitHub:** [github.com/mansyar](https://github.com/mansyar)
    - **LinkedIn:** (placeholder for user to fill)
    - **Location:** Indonesia
    - Formatted as a metadata card matching the ExplorerDetailPane style (title, sections with labels, no body HTML).
- The virtual filesystem `FILE_SYSTEM` must be updated with a `D:` drive containing `My_Documents` folder with these files.

### FR2 — Recycle Bin Explorer View

- Double-clicking the **Recycle Bin** desktop icon opens the `recyclebin` window (550×400, position 150,90).
- Shows a styled "Deleted Items" view with one entry:
  - **`chasing-chapters (v1)`** — grayed-out icon, strikethrough name, "ARCHIVED" badge.
  - Clicking opens the detail pane showing:
    - **Title:** chasing-chapters (v1)
    - **Status:** Archived / Deleted
    - **Description:** Original version of the chasing-chapters project (pre-v2).
    - **Repository:** (placeholder GitHub URL)
    - A mocked "Restore" button in the detail pane that is non-functional (purely cosmetic, shows "Cannot restore — Original location does not exist" tooltip or disabled state).

## Non-Functional Requirements

- Both views reuse the existing `Explorer`, `ExplorerFileList`, `ExplorerDetailPane`, `ExplorerToolbar`, and `ExplorerBreadcrumb` components.
- Recycle Bin items use a distinct visual style — reduced opacity, "deleted" icon overlay, strikethrough text.
- No new Nano Stores needed — existing `$windows` store handles the `mydocs` and `recyclebin` window IDs (already defined in `WindowId` type).
- Detail pane for `Contact.txt` uses the existing `ExplorerDetailPane` with static metadata (no new component needed).
- All navigation (back, up-level, breadcrumb) works identically to the Explorer.
- Must pass all existing tests and maintain ≥80% coverage.

## Acceptance Criteria

```
✅ My Documents opens showing Resume.pdf, Certs/ folder, and Contact.txt
✅ Clicking Resume.pdf opens PDF in a new browser tab
✅ Certs/ folder shows "This folder is empty" when navigated into
✅ Clicking Contact.txt shows name, email, GitHub, LinkedIn, location in detail pane
✅ Recycle Bin opens with "chasing-chapters (v1)" listed as a deleted/archived item
✅ Clicking the deleted item shows detail pane with archive status + disabled Restore button
✅ Both My Documents and Recycle Bin support back/up-level/breadcrumb navigation
✅ All existing tests still pass
✅ Each file in src/ remains under 500 lines (modularity check)
```

## Out of Scope

- Uploading or adding real certificate PDFs (deferred — user fills Certs/ later)
- Actual file restore functionality for Recycle Bin (cosmetic only)
- Tab-completion or right-click context menus (project-wide v1 constraint)
- Dual-pane drag-and-drop between Explorer windows
