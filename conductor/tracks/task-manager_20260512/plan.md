# Implementation Plan: Track 2C — Task Manager

**Track:** `task-manager_20260512`
**Type:** Feature
**Depends on:** Track 1B (Window Manager), Track 1C (Start Menu — provides task-manager.svg icon + Start Menu items)

---

## Phase 1: Task Manager Shell & Tab System

- [ ] Task 1.1: Add taskmanager config to DEFAULT_WINDOW_CONFIGS
  - [ ] Write tests: taskmanager config exists at 500×550, position (200, 60), min size 400×450
  - [ ] Add taskmanager entry to DEFAULT_WINDOW_CONFIGS in `src/stores/windows.ts`
- [ ] Task 1.2: Create `TaskManager.tsx` with tab switching UI
  - [ ] Write tests: component renders two tabs (Processes / Performance), clicking switches visible content
  - [ ] Implement TaskManager with useState tab tracking and XP-style raised/pressed tab chrome
- [ ] Task 1.3: Wire TaskManager into WindowLayer
  - [ ] Write tests: opening `taskmanager` window renders TaskManager component in WindowLayer
  - [ ] Replace placeholder text for 'taskmanager' window ID in `WindowLayer.tsx`
- [ ] Task: Conductor - User Manual Verification 'Phase 1 — Task Manager Shell & Tab System' (Protocol in workflow.md)

---

## Phase 2: Processes Tab with CPU Animation

- [ ] Task 2.1: Implement process data and table rendering
  - [ ] Write tests: process table renders 8 entries with all 5 columns (Image Name, PID, CPU, Mem, Description)
  - [ ] Create process data constant and table component with XP detail-view styling
- [ ] Task 2.2: Animate CPU percentages with random fluctuation
  - [ ] Write tests: CPU values fluctuate within ±3% range every 1s, never go below 0% or above 100%
  - [ ] Implement setInterval-based CPU update using useRef for performant in-place updates
- [ ] Task 2.3: Implement End Process button with XP warning dialog
  - [ ] Write tests: clicking End Process button shows XP warning dialog; OK and Cancel both dismiss it
  - [ ] Implement XPMessageBox dialog: raised border, centered overlay, Tahoma font, Warning icon, OK/Cancel
- [ ] Task: Conductor - User Manual Verification 'Phase 2 — Processes Tab' (Protocol in workflow.md)

---

## Phase 3: Performance Tab with Canvas Graphs

- [ ] Task 3.1: Create Canvas line graph component
  - [ ] Write tests: Canvas renders green line (#00ff00) on black background, shows grid lines, has correct dimensions
  - [ ] Implement CanvasGraph: 60-point rolling buffer, green polyline, XP-style grid, Y-axis labels
- [ ] Task 3.2: Wire Performance tab with 1s data updates
  - [ ] Write tests: graphs receive data at 1s interval, maintain 60-point buffer, scroll left on new point
  - [ ] Implement data generator (base values from process table ±2%), animation loop with requestAnimationFrame + 1s throttle
- [ ] Task: Conductor - User Manual Verification 'Phase 3 — Performance Tab' (Protocol in workflow.md)

---

## Phase: Review Fixes

- [ ] Task: Apply review suggestions
