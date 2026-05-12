# Specification: Track 2C — Task Manager

**Track:** `task-manager_20260512`
**Type:** Feature
**Description:** Windows XP-style Task Manager with Processes tab and animated Performance graphs for the Luna OS Portfolio.

---

## Overview

A fully interactive Windows XP Task Manager clone as a React island within the Luna OS desktop. Features two tabs — **Processes** (listing 8 skill-themed processes with live CPU fluctuation) and **Performance** (Canvas-based line graphs for CPU/Memory). Built with pure React + Nano Stores, no external charting libraries.

**Refs:** [ROADMAP Track 2C](../docs/ROADMAP.md) · [TDD §7.2](../docs/TDD.md#72-task-manager) · [PRD §5.2](../docs/PRD.md#52-task-manager-control-panel)

---

## Functional Requirements

### FR1 — Window Configuration

- Uses existing `WindowFrame` / `TitleBar` system (inherited from Track 1B)
- Default size: 500×550, default position: 200, 60
- Minimum size: 400×450
- Icon: `/icons/task-manager.svg` (already exists from Track 1C)
- Window ID: `taskmanager`

### FR2 — Tab System

- Two tabs at the top: **Processes** and **Performance**
- XP-style raised/pressed tab appearance (Tahoma font, classic border)
- Active tab appears "pressed" (inset border), inactive tab "raised" (outset border)
- Clicking a tab switches the content view below
- Tab switching is instant (no animation)
- Keyboard navigation: Left/Right arrow keys switch between tabs when focus is on the tab bar; Tab key moves focus into the active tab panel

### FR3 — Processes Tab

- Table with 5 columns: Image Name, PID, CPU, Mem Usage, Description
- 8 entries sourced from TDD §7.2 (see table below)
- **CPU %** column: each entry's value fluctuates ±3% randomly every 1 second (min 0%, max 100%)
- Values update in-place (no row re-rendering, just the CPU text)
- A row must be selected (highlighted) before "End Process" can be clicked
- Clicking a row selects it (highlighted with XP blue selection color); clicking another row switches selection
- "End Process" button is **disabled** (greyed out) when no row is selected
- Clicking "End Process" on a selected row shows an XP-style warning dialog:
  - Title: "Task Manager Warning"
  - Message: "WARNING: Terminating the process '<Image Name>' can cause unwanted behavior including loss of data and system instability. The process will not be given a chance to save its data. Are you sure you want to terminate this process?" (where <Image Name> is the selected process name)
  - Buttons: OK (dismisses dialog), Cancel (dismisses dialog)
  - Dialog is centered over the Task Manager window, has classic XP raised border
  - No actual process termination occurs

| Image Name      | PID  | CPU | Mem Usage | Description            |
| :-------------- | :--- | :-- | :-------- | :--------------------- |
| `python.exe`    | 1204 | 12% | 45,320 K  | Python Runtime         |
| `terraform.svc` | 892  | 8%  | 32,100 K  | Infrastructure Manager |
| `docker.exe`    | 2048 | 15% | 128,400 K | Container Runtime      |
| `react.dll`     | 1567 | 6%  | 22,800 K  | UI Framework           |
| `node.exe`      | 3201 | 10% | 67,500 K  | JavaScript Runtime     |
| `git.exe`       | 445  | 2%  | 8,200 K   | Version Control        |
| `linux_kernel`  | 1    | 18% | 256,000 K | Operating System       |
| `ansible.svc`   | 780  | 5%  | 15,600 K  | Configuration Mgmt     |

### FR4 — Performance Tab

- Two Canvas line graphs stacked vertically:
  - **CPU Graph** — label: "Skills Utilization"
  - **Memory Graph** — label: "Knowledge Base"
- Each graph:
  - Green (`#00ff00`) line on black (`#000000`) background
  - XP-style grid lines (faint green or gray horizontal + vertical)
  - 60 data points (1-minute rolling window, 1 update/second)
  - Y-axis labels on the left (percentage values)
  - Line scrolls left as new data points are added
- Data: initial values are the base percentages from the processes table:
  - **CPU Graph**: starts at overall average CPU (9.5%) — the mean of all 8 process CPU values
  - **Memory Graph**: starts at overall Memory utilization percentage — computed as `(sum of all Mem Usage values / (max_mem * number_of_processes)) * 100` where max_mem = 256,000 K (linux_kernel's value as 100% reference), then fluctuates ±2% randomly every 1s
- Canvas dimensions: fills the content area width (window width minus 16px for WindowFrame left/right padding), height ~150px per graph
- No axis labels on the bottom (matches XP Task Manager behavior)

### FR5 — Integration

- Opens via:
  - Start Menu → left column "Task Manager" item
  - Start Menu → right column "Control Panel" item
  - (No desktop icon — matches desktop specs from Track 1A)
- Taskbar button appears when Task Manager is open (inherits existing behavior)
- Coexists with other windows (Explorer, CMD, etc.)
- Opens minimized: no (opens at default position with focus)

---

## Non-Functional Requirements

- **Performance:** Canvas rendering is efficient — only redraws on data update (every 1s), not on every frame
- **No external dependencies:** No charting libraries — pure Canvas API + React
- **Authenticity:** Must visually match Windows XP Task Manager at a glance — classic borders, Tahoma font, green-on-black graphs
- **Accessibility:** Tab roles (`role="tab"`, `role="tabpanel"`), ARIA labels on graphs, keyboard navigation between tabs
- **Animation respect:** The 1s update interval is unaffected by `prefers-reduced-motion` (it's data refresh, not animation)

---

## Acceptance Criteria

```
✅ Task Manager opens as a 500×550 window at position (200, 60)
✅ Two tabs visible: "Processes" and "Performance" with XP-style appearance
✅ Processes tab shows 8 entries with all 5 columns (Image Name, PID, CPU, Mem, Description)
✅ CPU % values fluctuate ±3% randomly every 1 second
✅ Clicking a row selects it; "End Process" is disabled when no row is selected
✅ "End Process" shows XP warning dialog naming the selected process; OK/Cancel dismiss it
✅ Performance tab shows two Canvas graphs (CPU + Memory) with green lines on black
✅ Graphs display 60 data points, updating every 1s, scrolling left
✅ Tab switching works and retains state
✅ Taskbar button appears when Task Manager is open
✅ Coexists with other open windows
✅ Visually matches XP Task Manager aesthetic
✅ All pre-commit hooks pass (lint, format, typecheck, coverage ≥ 80%, modularity)
```

---

## Out of Scope (v1)

- Networking tab
- Users tab
- Applications tab
- Sorting by column header click
- Actual process termination
- Right-click context menu on process rows
- Custom column widths
- Graph legend or detailed tooltips
- Resizable split between tabs and content
