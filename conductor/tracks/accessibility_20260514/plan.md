# Implementation Plan: Track 4B — Accessibility

**Track:** `accessibility_20260514`
**Type:** Feature
**Depends on:** All previous tracks (full site exists)

---

## Phase 1 — ARIA Roles: Desktop Shell & Window System

_Add proper ARIA roles, labels, and properties to the desktop shell, taskbar, window system, and their sub-components._

### Tasks

- [ ] Task: Write failing tests verifying ARIA attribute presence for Desktop shell, Taskbar, StartMenu, Clock, ShutdownOverlay, WindowFrame, TitleBar, WindowLayer
  - [ ] Write tests: DesktopIcon renders with `role="button"` and `aria-label`
  - [ ] Write tests: Taskbar renders with `role="toolbar"` and `aria-label`
  - [ ] Write tests: Start Button has `aria-haspopup="menu"` and `aria-expanded`
  - [ ] Write tests: Clock has `role="timer"` and `aria-live="polite"`
  - [ ] Write tests: WindowFrame renders with `role="dialog"`, `aria-label`, `aria-modal`
  - [ ] Write tests: TitleBar buttons have correct `aria-label` values
  - [ ] Write tests: ShutdownOverlay has `role="alertdialog"`

- [ ] Task: Implement ARIA roles for Desktop Shell components
  - [ ] Implement: Add `role="application"` and `aria-label` to DesktopLayout
  - [ ] Implement: Add `role="button"` and `aria-label` to DesktopIcon
  - [ ] Implement: Add `role="toolbar"` to Taskbar, `aria-label="Start"` + `aria-haspopup` + `aria-expanded` to Start Button
  - [ ] Implement: Add `role="timer"` and `aria-live="polite"` to Clock
  - [ ] Implement: Add `role="menu"` on Start Menu container, `role="menuitem"` on items
  - [ ] Implement: Add `role="alertdialog"` to ShutdownOverlay

- [ ] Task: Implement ARIA roles for Window System components
  - [ ] Implement: Add `role="dialog"`, `aria-label="{title}"`, `aria-modal="true"` to WindowFrame
  - [ ] Implement: Add `role="button"` with descriptive `aria-label` to TitleBar min/max/close buttons
  - [ ] Implement: Add `aria-label="{window title}"` to WindowLayer container

- [ ] Task: Conductor — User Manual Verification 'Phase 1 — ARIA Roles: Desktop Shell & Window System' (Protocol in workflow.md)

---

## Phase 2 — ARIA Roles: Applications & Safe Mode

_Add proper ARIA roles, labels, and properties to Explorer, CmdPrompt, TaskManager, KnowledgeBase, and Safe Mode components._

### Tasks

- [ ] Task: Write failing tests for ARIA attributes on application components
  - [ ] Write tests: Explorer container has `role="region"` with `aria-label`
  - [ ] Write tests: Explorer file list has `role="grid"` with `aria-label="File list"`
  - [ ] Write tests: Explorer breadcrumb has `role="navigation"` with `aria-label`
  - [ ] Write tests: CmdPrompt has `role="terminal"`, output has `role="log"`, input has `role="textbox"`
  - [ ] Write tests: TaskManager tabs have correct `aria-selected` and `aria-controls`
  - [ ] Write tests: KnowledgeBase sidebar has `role="navigation"`, search has `role="searchbox"`
  - [ ] Write tests: SafeMode shell has `role="application"`, BiosBoot has `role="status"` with `aria-live`
  - [ ] Write tests: TerminalNav items have `role="button"`

- [ ] Task: Implement ARIA roles for Application components
  - [ ] Implement: Add `role="region"` and `aria-label="File Explorer"` to Explorer shell
  - [ ] Implement: Add `role="grid"` and `aria-label="File list"` to ExplorerFileList
  - [ ] Implement: Add `role="navigation"` and `aria-label="Current path"` to ExplorerBreadcrumb
  - [ ] Implement: Add `role="navigation"` and `aria-label` to ExplorerToolbar (Back/Up buttons)
  - [ ] Implement: Add `role="button"` and `aria-label` to Explorer detail pane file links
  - [ ] Implement: Add `role="terminal"` to CmdPrompt container, `role="log"` with `aria-live="polite"` to output, `role="textbox"` to input
  - [ ] Implement: Verify and fix TaskManager `role="tab"` `aria-selected` and `aria-controls` attributes
  - [ ] Implement: Add `role="navigation"` and `aria-label="Article categories"` to KnowledgeBase sidebar
  - [ ] Implement: Add `role="searchbox"` and `aria-label` to KnowledgeBase search
  - [ ] Implement: Add `role="application"` and `aria-label` to SafeModeShell
  - [ ] Implement: Add `role="status"` and `aria-live="polite"` to BiosBoot
  - [ ] Implement: Add `role="button"` to TerminalNav menu items

- [ ] Task: Conductor — User Manual Verification 'Phase 2 — ARIA Roles: Applications & Safe Mode' (Protocol in workflow.md)

---

## Phase 3 — Decorative Elements (`aria-hidden` Audit)

_Identify and hide all purely decorative XP chrome elements from screen readers._

### Tasks

- [ ] Task: Write failing tests for aria-hidden on decorative elements
  - [ ] Write tests: TitleBar gradient/background has `aria-hidden="true"`
  - [ ] Write tests: Window 3D border chrome has `aria-hidden="true"`
  - [ ] Write tests: Taskbar gradient has `aria-hidden="true"`
  - [ ] Write tests: Start Menu separator lines have `aria-hidden="true"`
  - [ ] Write tests: Shutdown screen background has `aria-hidden="true"`
  - [ ] Write tests: CRT scanline overlay has `aria-hidden="true"`
  - [ ] Write tests: Decorative icons that duplicate text are hidden

- [ ] Task: Implement aria-hidden on all decorative elements
  - [ ] Implement: Add `aria-hidden="true"` to TitleBar decorative gradient spans
  - [ ] Implement: Add `aria-hidden="true"` to window 3D border container
  - [ ] Implement: Add `aria-hidden="true"` to Taskbar background gradient
  - [ ] Implement: Add `aria-hidden="true"` to Start Menu decorative separators
  - [ ] Implement: Add `aria-hidden="true"` to Shutdown overlay background
  - [ ] Implement: Add `aria-hidden="true"` to CRT scanline/curvature overlays
  - [ ] Implement: Add `aria-hidden="true"` to decorative icons that duplicate text labels

- [ ] Task: Conductor — User Manual Verification 'Phase 3 — Decorative Elements' (Protocol in workflow.md)

---

## Phase 4 — Keyboard Navigation & Focus Management

_Implement full keyboard tab cycle and focus management across the entire desktop._

### Tasks

- [ ] Task: Write failing tests for keyboard navigation and focus management
  - [ ] Write tests: Tab cycles Desktop Icons → Taskbar → Start Menu (when open) → Open Windows
  - [ ] Write tests: Enter/Space activates focused button/menu item
  - [ ] Write tests: Escape closes Start Menu, End Process dialog, and focused window
  - [ ] Write tests: Opening a window moves focus to TitleBar
  - [ ] Write tests: Closing a window returns focus to previously focused element
  - [ ] Write tests: Tab wraps around from last window back to Desktop Icons
  - [ ] Write tests: Focus-visible outline is present on all interactive elements

- [ ] Task: Implement keyboard tab cycle and focus management
  - [ ] Implement: Set proper `tabindex` on DesktopIcon (0), Taskbar buttons (0), window content
  - [ ] Implement: Ensure Taskbar renders Start Button, Clock, and window buttons in correct DOM/tab order
  - [ ] Implement: Start Menu keyboard nav — Enter/Space activates item, Escape closes
  - [ ] Implement: Focus-on-open — `openWindow()` triggers `focus()` on TitleBar via ref
  - [ ] Implement: Focus tracking — store `previousFocusedElement` ref, restore on window close
  - [ ] Implement: Escape handler — check context: Start Menu open → close it, dialog open → dismiss, window focused → close window
  - [ ] Implement: Window-to-window Tab cycling (last focusable in window → next window's TitleBar)
  - [ ] Implement: Add `.xp-focus-visible` CSS class with XP-style dotted focus rectangle

- [ ] Task: Verify keyboard navigation works across all window types
  - [ ] Write tests: Keyboard nav in Explorer (breadcrumb, file list, detail pane)
  - [ ] Write tests: Keyboard nav in CmdPrompt (input, history arrows)
  - [ ] Write tests: Keyboard nav in TaskManager (tab switching via arrow keys)
  - [ ] Write tests: Keyboard nav in KnowledgeBase (search, categories, article list)

- [ ] Task: Conductor — User Manual Verification 'Phase 4 — Keyboard Navigation & Focus Management' (Protocol in workflow.md)

---

## Phase 5 — Reduced Motion Verification

_Audit all CSS animations/transitions and ensure they respect `prefers-reduced-motion: reduce`._

### Tasks

- [ ] Task: Write failing tests for prefers-reduced-motion compliance
  - [ ] Write tests: Window open/close/scale animations have `@media (prefers-reduced-motion: reduce)` alternative
  - [ ] Write tests: Window minimize/restore transitions respect reduced motion
  - [ ] Write tests: Start Menu open/close respects reduced motion
  - [ ] Write tests: Shutdown progress animation respects reduced motion
  - [ ] Write tests: DesktopIcon hover highlight respects reduced motion
  - [ ] Write tests: CMD cursor blink respects reduced motion
  - [ ] Write tests: Safe Mode boot typewriter respects reduced motion
  - [ ] Write tests: CRT scanline animation respects reduced motion

- [ ] Task: Implement reduced motion overrides where missing
  - [ ] Implement: Add `@media (prefers-reduced-motion: reduce)` block in `global.css` with overrides
  - [ ] Implement: Ensure all `@keyframes` have reduced-motion counterparts (immediate completion or `animation: none`)
  - [ ] Implement: Verify CSS transitions (`transition: all ...`) are overridden to `transition: none` under reduced motion
  - [ ] Implement: Verify Safe Mode CRT animation halts under reduced motion
  - [ ] Implement: Run existing animation tests to ensure no regressions

- [ ] Task: Conductor — User Manual Verification 'Phase 5 — Reduced Motion Verification' (Protocol in workflow.md)

---

## Phase 6 — Color Contrast Audit (WCAG AA)

_Audit all color pairs across the site against WCAG AA standards and fix any failures._

### Tasks

- [ ] Task: Write failing tests for color contrast compliance
  - [ ] Write tests: Desktop primary text (#000000) on window background (#ece9d8) — ratio ≥ 4.5:1
  - [ ] Write tests: TitleBar white text (#ffffff) on blue gradient — measure worst-case ratio
  - [ ] Write tests: Start Menu header white text on blue — measure worst-case ratio
  - [ ] Write tests: Disabled text (#aca899) on button face (#ece9d8) — document ratio
  - [ ] Write tests: Link colors in Explorer detail pane — ratio ≥ 4.5:1 for normal text
  - [ ] Write tests: Safe Mode green (#00ff41) on black (#000000) — ratio ≥ 4.5:1

- [ ] Task: Audit and fix contrast failures
  - [ ] Implement: Measure all color pairs using relative luminance formula
  - [ ] Implement: Document each pair's contrast ratio and pass/fail status
  - [ ] Implement: Fix any failing pairs by adjusting color values (minimum adjustment needed)
  - [ ] Implement: If disabled text fails, adjust to pass (e.g., darken `#aca899` or add background contrast)
  - [ ] Implement: Verify no visual XP authenticity is lost in fix process

- [ ] Task: Conductor — User Manual Verification 'Phase 6 — Color Contrast Audit' (Protocol in workflow.md)
