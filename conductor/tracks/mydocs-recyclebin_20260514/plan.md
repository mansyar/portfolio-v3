# Implementation Plan: My Documents & Recycle Bin

> **Dependency Note:** This track requires `public/resume.pdf` to exist before the My Documents view is functional. The user must provide their actual resume PDF. A placeholder warning will appear in the detail pane if the file is missing.

## Phase 1 — Filesystem & Data Setup

- [x] **Task: Write tests for filesystem and data changes** (c6597b0)
  - [x] Test: D: drive has BOTH Systems_Data and My_Documents as children
  - [x] Test: My_Documents contains Resume.pdf, Certs/ (empty folder), Contact.txt
  - [x] Test: resolvePath('D:\\My_Documents') returns correct folder node
  - [x] Test: getChildren('\\') returns C:, D:, E: drives PLUS a virtual Recycle_Bin entry
  - [x] Test: resolvePath('\\Recycle_Bin') returns special recycle bin node
  - [x] Test: chasing-chapters-v1 slug resolves in RECYCLE_BIN_METADATA
  - [x] Test: CONTACT_METADATA has all 6 fields (name, title, email, github, linkedin, location)
- [x] **Task: Update `FILE_SYSTEM` in `constants.ts`** (c6597b0)
  - [x] Add `D:\My_Documents` as a second folder alongside existing `D:\Systems_Data`
  - [x] Inside `My_Documents`: `Resume.pdf` (file, slug: 'resume'), `Certs/` (empty folder), `Contact.txt` (file, slug: 'contact')
  - [x] Add `\Recycle_Bin` as a virtual root-level folder — modify `getChildren('\\')` to include it alongside drives, and `resolvePath` to handle `\Recycle_Bin`
  - [x] Inside `\Recycle_Bin`: `chasing-chapters-v1` (file, slug: 'chasing-chapters-v1', special styling)
- [x] **Task: Update `projects-data.ts`** (c6597b0)
  - [x] Add `CONTACT_METADATA` export with explicit values
  - [x] Add `RECYCLE_BIN_METADATA` export
- [x] **Task: Update window store defaults in `windows.ts`** (ef4b98d)
  - [x] Modify `buildWindowState()`: `mydocs` defaults `explorerPath` to `D:\My_Documents`
  - [x] Modify `buildWindowState()`: `recyclebin` defaults `explorerPath` to `\Recycle_Bin`
- [x] **Task: Wire `mydocs` + `recyclebin` into WindowLayer** (ef4b98d)
  - [x] Mount `<Explorer windowId="mydocs" />` and `<Explorer windowId="recyclebin" />`
  - [x] Remove `PLACEHOLDER_CONTENT` entries for both window IDs
- [x] **Task: Create `public/resume.pdf` placeholder** (ef4b98d)
- [x] **Task: Update `scripts/generate-filesystem.mjs`** (ef4b98d)
  - [x] Add hardcoded `D:\My_Documents` entries (Resume.pdf, Certs/, Contact.txt) to the generated tree
  - [x] The static constants.ts tree remains the source of truth for dev mode
- [ ] Task: Conductor - User Manual Verification 'Phase 1'

## Phase 2 — My Documents View (TDD)

- [ ] Task: Write tests for My Documents view behaviors
  - [ ] Test: `mydocs` window opens with `explorerPath` = `D:\My_Documents`
  - [ ] Test: file list renders Resume.pdf, Certs/, Contact.txt
  - [ ] Test: clicking Resume.pdf calls `window.open('/resume.pdf')`
  - [ ] Test: navigating into Certs/ shows "This folder is empty."
  - [ ] Test: clicking Contact.txt shows contact metadata in detail pane
  - [ ] Test: breadcrumb segments show correct path for My Documents
- [ ] Task: Implement Resume.pdf click → new tab behavior
  - [ ] Add `onSpecialFileClick` callback prop to `ExplorerFileList` (or check by file name in `Explorer.tsx`)
  - [ ] When file name is `Resume.pdf`, call `window.open('/resume.pdf')` instead of setting selected slug
- [ ] Task: Implement Contact.txt detail pane
  - [ ] Add `CONTACT_METADATA` import and lookup in `ExplorerDetailPane.tsx`
  - [ ] Display contact card: title, description section with all 6 fields
  - [ ] GitHub renders as a clickable link, other fields as text
- [ ] Task: Conductor - User Manual Verification 'Phase 2'

## Phase 3 — Recycle Bin View (TDD)

- [ ] Task: Write tests for Recycle Bin view
  - [ ] Test: `recyclebin` window opens with `explorerPath` = `\Recycle_Bin`
  - [ ] Test: file list shows "chasing-chapters (v1)" with deleted styling class
  - [ ] Test: clicking item shows archive metadata in detail pane (title, status, description)
  - [ ] Test: disabled "Restore" button is rendered with correct tooltip text
  - [ ] Test: breadcrumb shows correct path segments for recycle bin
- [ ] Task: Implement deleted-file visual styling
  - [ ] Add `.xp-file-row-deleted` CSS class to `xp-theme.css` or `global.css`:
        grayed-out icon (opacity 0.5), strikethrough name, reduced opacity on row
  - [ ] Apply `.xp-file-row-deleted` class to recycle bin file rows in `ExplorerFileList.tsx`
  - [ ] Detect recycle bin path and pass styling context to FileListItem
- [ ] Task: Implement Recycle Bin detail pane
  - [ ] Add `RECYCLE_BIN_METADATA` import and lookup in `ExplorerDetailPane.tsx`
  - [ ] Display: archived status badge ("ARCHIVED" in gray), description, repository link
  - [ ] Add disabled "Restore" button with tooltip "Cannot restore — Original location does not exist"
- [ ] Task: Conductor - User Manual Verification 'Phase 3'

## Phase 4 — Integration & Verification

- [ ] Task: Run full test suite + coverage
  - [ ] `CI=true pnpm test:coverage` (≥80%)
- [ ] Task: Pre-commit checks
  - [ ] `pnpm lint` — no lint errors
  - [ ] `node scripts/check-modularity.js` — no file exceeds 500 lines
- [ ] Task: Commit all changes with descriptive messages and git notes
- [ ] Task: Conductor - User Manual Verification 'Phase 4'
