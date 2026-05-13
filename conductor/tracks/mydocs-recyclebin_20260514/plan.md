# Implementation Plan: My Documents & Recycle Bin

> **Dependency Note:** This track requires `public/resume.pdf` to exist before the My Documents view is functional. The user must provide their actual resume PDF. A placeholder warning will appear in the detail pane if the file is missing.

## Phase 1 — Filesystem & Data Setup

- [x] **Task: Write tests for filesystem and data changes** (c6597b0)
- [x] **Task: Update `FILE_SYSTEM` in `constants.ts`** (c6597b0)
- [x] **Task: Update `projects-data.ts`** (c6597b0)
- [x] **Task: Update window store defaults in `windows.ts`** (ef4b98d)
- [x] **Task: Wire `mydocs` + `recyclebin` into WindowLayer** (ef4b98d)
- [x] **Task: Create `public/resume.pdf` placeholder** (ef4b98d)
- [x] **Task: Update `scripts/generate-filesystem.mjs`** (ef4b98d)
- [x] **Task: Conductor - User Manual Verification 'Phase 1'**

## Phase 2 — My Documents View (TDD)

- [x] **Task: Write tests for My Documents view behaviors** (565d5c3)
- [x] **Task: Implement Resume.pdf click → new tab behavior** (565d5c3)
- [x] **Task: Implement Contact.txt detail pane** (565d5c3)
- [ ] Task: Conductor - User Manual Verification 'Phase 2'

## Phase 3 — Recycle Bin View (TDD)

- [x] **Task: Write tests for Recycle Bin view** (565d5c3)
- [x] **Task: Implement deleted-file visual styling** (coming)
- [x] **Task: Implement Recycle Bin detail pane** (565d5c3)
- [ ] Task: Conductor - User Manual Verification 'Phase 3'

## Phase 4 — Integration & Verification

- [ ] Task: Run full test suite + coverage
  - [ ] `CI=true pnpm test:coverage` (≥80%)
- [ ] Task: Pre-commit checks
  - [ ] `pnpm lint` — no lint errors
  - [ ] `node scripts/check-modularity.js` — no file exceeds 500 lines
- [ ] Task: Commit all changes with descriptive messages and git notes
- [ ] Task: Conductor - User Manual Verification 'Phase 4'
