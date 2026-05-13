# Implementation Plan: My Documents & Recycle Bin

## Phase 1 — Filesystem & Data Setup

- [ ] Task: Update `FILE_SYSTEM` in `constants.ts`
  - [ ] Add D: drive with My_Documents folder: Resume.pdf, Certs/, Contact.txt
  - [ ] Add Recycle_Bin path with chasing-chapters-v1 item
- [ ] Task: Update `projects-data.ts`
  - [ ] Add CONTACT_METADATA (name, title, email, GitHub, LinkedIn, location)
  - [ ] Add archived chasing-chapters-v1 entry for recycle bin
- [ ] Task: Update window store defaults
  - [ ] mydocs defaults explorerPath to D:\My_Documents
  - [ ] recyclebin defaults to recycle bin path
- [ ] Task: Wire mydocs + recyclebin into WindowLayer
  - [ ] Mount <Explorer> for both, remove placeholder entries
- [ ] Task: Conductor - User Manual Verification 'Phase 1'

## Phase 2 — My Documents View (TDD)

- [ ] Task: Write tests for My Documents
  - [ ] Test window opens with correct path
  - [ ] Test file list shows Resume.pdf, Certs/, Contact.txt
  - [ ] Test Resume.pdf click → window.open()
  - [ ] Test Certs/ shows empty folder
  - [ ] Test Contact.txt detail pane
- [ ] Task: Implement Resume.pdf click → new tab
  - [ ] Modify ExplorerFileList for pdf files
- [ ] Task: Implement Contact.txt detail pane
  - [ ] Add CONTACT_METADATA lookup in ExplorerDetailPane
  - [ ] Display contact card in detail pane
- [ ] Task: Conductor - User Manual Verification 'Phase 2'

## Phase 3 — Recycle Bin View (TDD)

- [ ] Task: Write tests for Recycle Bin
  - [ ] Test opens with correct path
  - [ ] Test list shows item with archived styling
  - [ ] Test detail pane shows archive metadata
  - [ ] Test disabled Restore button
- [ ] Task: Implement deleted-file styling
  - [ ] .xp-file-row-deleted CSS class, apply in file list
- [ ] Task: Implement Recycle Bin detail pane
  - [ ] Archived status badge, disabled Restore button
- [ ] Task: Conductor - User Manual Verification 'Phase 3'

## Phase 4 — Integration & Verification

- [ ] Task: Run full test suite + coverage
  - [ ] CI=true pnpm test:coverage (≥80%)
- [ ] Task: Pre-commit checks (lint, modularity)
- [ ] Task: Commit with git notes
- [ ] Task: Conductor - User Manual Verification 'Phase 4'
