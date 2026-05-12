# Implementation Plan: Track 2C — Task Manager

**Track:** `task-manager_20260512`
**Type:** Feature
**Depends on:** Track 1B (Window Manager), Track 1C (Start Menu — provides task-manager.svg icon + Start Menu items)

---

## Phase 1: Task Manager Shell & Tab System [checkpoint: 6f4e6c0]

- [x] Task 1.1: Add taskmanager config to DEFAULT_WINDOW_CONFIGS
  - [x] Write tests: taskmanager config exists at 500×550, position (200, 60), min size 400×450
  - [x] Add taskmanager entry to DEFAULT_WINDOW_CONFIGS in `src/stores/windows.ts`
- [x] Task 1.2: Create `TaskManager.tsx` with tab switching UI (`4122024`)
  - [x] Write tests: component renders two tabs (Processes / Performance), clicking switches visible content
  - [x] Implement TaskManager with useState tab tracking and XP-style raised/pressed tab chrome
- [x] Task 1.3: Wire TaskManager into WindowLayer (`5fb9ee8`)
  - [x] Write tests: opening `taskmanager` window renders TaskManager component in WindowLayer
  - [x] Replace placeholder text for 'taskmanager' window ID in `WindowLayer.tsx`
- [x] Task: Conductor - User Manual Verification 'Phase 1 — Task Manager Shell & Tab System' (Protocol in workflow.md)

---

## Phase 2: Processes Tab with CPU Animation [checkpoint: 18e2898]

- [x] Task 2.1: Implement process data and table rendering (`de213bb`)
  - [x] Write tests: process table renders 8 entries with all 5 columns (Image Name, PID, CPU, Mem, Description)
  - [x] Create process data constant and table component with XP detail-view styling
- [x] Task 2.2: Animate CPU percentages with random fluctuation (`5f717d9`)
  - [x] Write tests: CPU values fluctuate within ±3% range every 1s, never go below 0% or above 100%
  - [x] Implement setInterval-based CPU update: store a ref array of CPU cell DOM elements, update their textContent directly in the interval callback to avoid full table re-renders; clean up interval on unmount
- [x] Task 2.3: Implement End Process button with row selection and XP warning dialog (`5f717d9`)
  - [x] Write tests: clicking a row selects it; End Process is disabled when no row selected; clicking End Process on selected row shows dialog naming the process; OK and Cancel both dismiss it
  - [x] Implement selectedRow state (tracked by row index or PID), XP-style selection highlight, End Process button disabled state, and XPMessageBox dialog: raised border, centered overlay, Tahoma font, Warning icon, OK/Cancel, dialog text includes selected process name
- [x] Task: Conductor - User Manual Verification 'Phase 2 — Processes Tab' (Protocol in workflow.md)

---

## Phase 3: Performance Tab with Canvas Graphs [checkpoint: 510e12a]

- [x] Task 3.1: Create Canvas line graph component (`636f7e6`)
  - [x] Write tests: Canvas renders green line (#00ff00) on black background, shows grid lines, has correct dimensions
  - [x] Implement CanvasGraph: 60-point rolling buffer, green polyline, XP-style grid, Y-axis labels
- [x] Task 3.2: Wire Performance tab with 1s data updates (`2682a59`)
  - [x] Write tests: graphs receive data at 1s interval, maintain 60-point buffer, scroll left on new point
  - [x] Implement data generator: CPU graph base = average of all 8 process CPU values (9.5%); Memory graph base = overall memory percentage (computed as sum(mem*values) / (256000 * 8) \_ 100); both fluctuate ±2% every 1s; animation loop uses requestAnimationFrame + 1s throttle for efficient canvas redraw
- [x] Task: Conductor - User Manual Verification 'Phase 3 — Performance Tab' (Protocol in workflow.md)

---

## Phase: Review Fixes

- [ ] Task: Apply review suggestions
