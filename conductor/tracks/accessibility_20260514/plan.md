# Implementation Plan: Track 4B — Accessibility

**Track:** `accessibility_20260514`
**Type:** Feature
**Depends on:** All previous tracks (full site exists)

---

## Phase 0 — Pre-Audit & Baseline Documentation

_Document the current accessibility state of all components before making changes. This prevents wasting effort re-implementing existing ARIA and ensures tests are written for genuinely missing attributes only._

### Tasks

- [ ] Task: Audit all interactive components and document current ARIA state
  - [ ] Audit: WindowFrame — verify `role="dialog"`, `aria-label`, note missing `aria-modal`
  - [ ] Audit: TitleBar buttons — verify existing `aria-label` values (Minimize/Maximize/Close)
  - [ ] Audit: Taskbar — verify existing `role="toolbar"`, `aria-label="Taskbar"`, Start Button `aria-label="Start"`
  - [ ] Audit: StartMenu — verify existing `role="menu"`, `role="menuitem"`, Tab/Enter/Escape handlers, `aria-activedescendant`
  - [ ] Audit: ExplorerToolbar — verify `role="toolbar"`, `aria-label`
  - [ ] Audit: ExplorerBreadcrumb — verify `<nav>` landmark, `aria-label`
  - [ ] Audit: ExplorerDetailPane — verify `role="region"` usage
  - [ ] Audit: CmdPrompt — verify `role="terminal"`, `role="textbox"`, `aria-label`
  - [ ] Audit: TaskManager — verify `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`
  - [ ] Audit: ShutdownOverlay — verify `role="status"` (note: NOT `alertdialog`)
  - [ ] Audit: Reduced motion in `global.css` — document already-compliant overrides
  - [ ] Audit: KnowledgeBase — verify partial ARIA on search input
  - [ ] Audit: Produce a component-by-component ARIA inventory table as reference

- [ ] Task: Set up accessibility testing infrastructure
  - [ ] Implement: Add `@testing-library/jest-dom` matchers if not already configured (for `toHaveAttribute`, `toHaveRole`)
  - [ ] Implement: Create test utility helpers for querying ARIA attributes across React + Astro components
  - [ ] Implement: Verify `CI=true pnpm test` still passes with new test infrastructure

- [ ] Task: Conductor — User Manual Verification 'Phase 0 — Pre-Audit & Baseline' (Protocol in workflow.md)

---

## Phase 1 — ARIA Roles: Desktop Shell & Window System

_Add correct ARIA roles, labels, and properties to desktop shell, taskbar, window system components. Where ARIA already exists (verified in Phase 0), write tests only._

### Tasks

- [ ] Task: Write tests for missing ARIA attributes on Desktop Shell & Window System (skipping already-verified items)
  - [ ] Write tests: DesktopLayout has `role="group"` with `aria-label="Luna OS Desktop"`
  - [ ] Write tests: DesktopIcon has `role="button"`, `aria-label="{label}"`, `tabindex="0"`
  - [ ] Write tests: Start Button has `aria-haspopup="menu"` and `aria-expanded` (dynamically reflects menu state)
  - [ ] Write tests: Clock has `role="timer"` and `aria-live="polite"`
  - [ ] Write tests: WindowFrame has `aria-modal="true"` (verify `role="dialog"` and `aria-label` already exist)
  - [ ] Write tests: WindowLayer rendered windows have an accessible container label
  - [ ] Write tests: ShutdownOverlay has `aria-live="polite"` (verify `role="status"` already exists)

- [ ] Task: Implement missing ARIA roles for Desktop Shell components
  - [ ] Implement: Add `role="group"` and `aria-label="Luna OS Desktop"` to DesktopLayout wrapper (not `role="application"` — preserves native Tab navigation)
  - [ ] Implement: Add `role="button"`, `aria-label`, `tabindex="0"` to DesktopIcon.astro
  - [ ] Implement: Add `aria-haspopup="menu"` and `aria-expanded` (dynamic: `${startMenuOpen}`) to Start Button
  - [ ] Implement: Add `role="timer"` and `aria-live="polite"` to Clock component
  - [ ] Implement: Add `aria-modal="true"` to WindowFrame div (alongside existing `role="dialog"` and `aria-label`)
  - [ ] Implement: Verify `role="status"` remains on ShutdownOverlay (do NOT change to `alertdialog`) — add `aria-live="polite"` if missing

- [ ] Task: Verify existing pre-implemented ARIA roles with non-failing tests
  - [ ] Write tests (verify-only): Taskbar `role="toolbar"`, `aria-label="Taskbar"` already present
  - [ ] Write tests (verify-only): Start Button `aria-label="Start"` already present
  - [ ] Write tests (verify-only): TitleBar minimize/maximize/close buttons have correct `aria-label`
  - [ ] Write tests (verify-only): WindowFrame has `role="dialog"` and `aria-label="{title}"`
  - [ ] Write tests (verify-only): StartMenu has `role="menu"`, items have `role="menuitem"`

- [ ] Task: Conductor — User Manual Verification 'Phase 1 — ARIA Roles: Desktop Shell & Window System' (Protocol in workflow.md)

---

## Phase 2 — ARIA Roles: Applications & Safe Mode

_Add correct ARIA roles, labels, and properties to Explorer, CmdPrompt, TaskManager, KnowledgeBase, and Safe Mode components._

### Tasks

- [ ] Task: Write tests for missing ARIA attributes on Application & Safe Mode components
  - [ ] Write tests: Explorer shell div has `role="region"` with `aria-label="File Explorer"`
  - [ ] Write tests: ExplorerFileList outer container has `role="list"` with `aria-label="File list"`; inner `<table>` has `role="grid"`
  - [ ] Write tests: CmdPrompt output area has `role="log"` with `aria-live="polite"`
  - [ ] Write tests: KnowledgeBase outer container has `role="region"` with `aria-label="Knowledge Base"`
  - [ ] Write tests: KnowledgeBase search has `role="searchbox"` (verify `aria-label` already exists)
  - [ ] Write tests: KB category sidebar nav has `role="navigation"` with `aria-label="Article categories"`
  - [ ] Write tests: SafeMode shell has `role="group"` with `aria-label="Safe Mode Terminal"`
  - [ ] Write tests: BiosBoot has `role="status"` with `aria-live="polite"`
  - [ ] Write tests: TerminalNav menu buttons have `aria-label` (descriptive, e.g., `"View projects"`)

- [ ] Task: Implement missing ARIA roles for Application components
  - [ ] Implement: Add `role="region"` and `aria-label="File Explorer"` to Explorer shell div
  - [ ] Implement: Ensure ExplorerFileList outer div has `role="list"` or `role="grid"` with `aria-label="File list"`; inner `<table>` has `role="grid"` (both currently exist, just verify label consistency)
  - [ ] Implement: Add `role="log"` with `aria-live="polite"` to CmdPrompt output container
  - [ ] Implement: Add `role="searchbox"` to KnowledgeBase search input
  - [ ] Implement: Add `role="navigation"` with `aria-label="Article categories"` to KB sidebar section
  - [ ] Implement: Add `role="region"` and `aria-label="Knowledge Base"` to KB outer container
  - [ ] Implement: Add `role="group"` and `aria-label="Safe Mode Terminal"` to SafeModeShell
  - [ ] Implement: Add `role="status"` and `aria-live="polite"` to BiosBoot container
  - [ ] Implement: Add descriptive `aria-label` to TerminalNav menu buttons (e.g., `aria-label="View {title}"`)

- [ ] Task: Verify existing pre-implemented ARIA roles for Applications
  - [ ] Write tests (verify-only): ExplorerToolbar `role="toolbar"` and `aria-label` already present
  - [ ] Write tests (verify-only): ExplorerBreadcrumb `<nav>` landmark and `aria-label` already present
  - [ ] Write tests (verify-only): ExplorerDetailPane `role="region"` already present
  - [ ] Write tests (verify-only): CmdPrompt `role="terminal"`, `role="textbox"`, `aria-label="Command input"` already present
  - [ ] Write tests (verify-only): TaskManager full `role="tablist"` / `role="tab"` / `role="tabpanel"` with `aria-selected` / `aria-controls` / `aria-labelledby`

- [ ] Task: Conductor — User Manual Verification 'Phase 2 — ARIA Roles: Applications & Safe Mode' (Protocol in workflow.md)

---

## Phase 3 — Decorative Elements (`aria-hidden` Audit)

_Identify and hide all purely decorative XP chrome elements from screen readers._

### Tasks

- [ ] Task: Write failing tests for aria-hidden on decorative elements
  - [ ] Write tests: TitleBar gradient/background has `aria-hidden="true"`
  - [ ] Write tests: Window 3D border chrome (resize handles) have `aria-hidden="true"`
  - [ ] Write tests: Taskbar gradient background has `aria-hidden="true"`
  - [ ] Write tests: Start Menu decorative separator lines have `aria-hidden="true"`
  - [ ] Write tests: Shutdown screen background has `aria-hidden="true"`
  - [ ] Write tests: CRT scanline overlay (pseudo-element) has `aria-hidden="true"`
  - [ ] Write tests: CRT curvature overlay (pseudo-element) has `aria-hidden="true"`
  - [ ] Write tests: Decorative icons that duplicate text labels have `alt=""` or `aria-hidden="true"` (verify StartMenu icon `alt=""` already exists)

- [ ] Task: Implement aria-hidden on all decorative elements
  - [ ] Implement: Add `aria-hidden="true"` to TitleBar gradient background element
  - [ ] Implement: Add `aria-hidden="true"` to window 3D border resize handle hit areas
  - [ ] Implement: Add `aria-hidden="true"` to Taskbar background gradient element
  - [ ] Implement: Add `aria-hidden="true"` to Start Menu decorative separator lines
  - [ ] Implement: Add `aria-hidden="true"` to Shutdown overlay background div
  - [ ] Implement: Add `aria-hidden="true"` to CRT scanline/curvature overlay pseudo-elements (via CSS or wrapper div)

- [ ] Task: Verify already-implemented decorative hidding
  - [ ] Write tests (verify-only): MARP avatar in Start Menu already has `aria-hidden="true"`

- [ ] Task: Conductor — User Manual Verification 'Phase 3 — Decorative Elements' (Protocol in workflow.md)

---

## Phase 4a — Desktop-Level Keyboard Navigation & Tab Cycle

_Implement the keyboard tab cycle across desktop-level chrome: Desktop Icons, Taskbar, Start Menu. Focus management (focus-on-open, focus-return-on-close) lives in WindowLayer._

### Tasks

- [ ] Task: Write failing tests for desktop-level keyboard navigation
  - [ ] Write tests: DesktopIcon activates on Enter/Space (dispatches `luna:open-window` custom event)
  - [ ] Write tests: Tab cycles Desktop Icons → Taskbar Start Button → Clock → active window buttons
  - [ ] Write tests: Start Menu opens from Start Button via Enter/Space
  - [ ] Write tests: Escape closes Start Menu, returns focus to Start Button
  - [ ] Write tests: Escape on focused window triggers close (via WindowLayer handler)

- [ ] Task: Implement DesktopIcon keyboard support (Astro component)
  - [ ] Implement: Add `tabindex="0"` to DesktopIcon div
  - [ ] Implement: Add inline `onkeydown` handler: Enter/Space dispatches `luna:open-window` CustomEvent
  - [ ] Implement: Add `role="button"` to DesktopIcon div
  - [ ] Implement: Verify existing `onclick` + `ondblclick` HTML attribute handlers still work

- [ ] Task: Implement Escape handler in WindowLayer
  - [ ] Implement: Add global `keydown` listener in WindowLayer `useEffect`
  - [ ] Implement: On Escape: if Start Menu is open → close it; else if active window exists → close it
  - [ ] Implement: Guard against Escape during shutdown sequence

- [ ] Task: Verify pre-existing keyboard handling
  - [ ] Write tests (verify-only): Start Menu already handles Tab/Shift+Tab cycling, Enter activation, Escape close
  - [ ] Write tests (verify-only): TaskManager already handles Left/Right arrow tab switching

- [ ] Task: Conductor — User Manual Verification 'Phase 4a — Desktop-Level Keyboard Navigation' (Protocol in workflow.md)

---

## Phase 4b — Application-Level Keyboard Navigation

_Implement per-window tab order and focus management for each application type. Focus-on-open, focus tracking, and focus-return-on-close live in WindowLayer._

### Tasks

- [ ] Task: Write failing tests for focus management and application-level keyboard nav
  - [ ] Write tests: Opening a window (from DesktopIcon, Start Menu, CMD `open`) moves focus to TitleBar
  - [ ] Write tests: Tab within a window cycles: TitleBar minimize → maximize → close → window content
  - [ ] Write tests: Closing a window returns focus to previously focused element (DesktopIcon or Taskbar button)
  - [ ] Write tests: Closing the last window returns focus to the Desktop Icons
  - [ ] Write tests: Tab from last focusable element in a window cycles to next open window's TitleBar
  - [ ] Write tests: Tab from last open window wraps back to Desktop Icons

- [ ] Task: Implement focus tracking in WindowLayer
  - [ ] Implement: Create `previousFocusRef` (module-level variable or React ref) to track last-focused element before window open
  - [ ] Implement: In `openWindow()` action, store `document.activeElement` as previous focus target
  - [ ] Implement: In TitleBar `useEffect`, auto-focus the minimize button (first focusable) when window appears (`ref.current?.focus()`)
  - [ ] Implement: In `closeWindow()` timeout callback, restore focus to stored previous element
  - [ ] Implement: Handle edge case: if previous element is no longer in DOM, fall back to Desktop Icons or Taskbar
  - [ ] Implement: Window-to-window Tab cycling — set `tabindex` appropriately so last element in window A tabs to next window B's TitleBar

- [ ] Task: Verify keyboard navigation works across all window types
  - [ ] Write tests: Keyboard nav in Explorer (breadcrumb buttons → file list rows → detail pane links)
  - [ ] Write tests: Keyboard nav in CmdPrompt (Tab to hidden input → typing activates; Enter executes)
  - [ ] Write tests: Keyboard nav in TaskManager (Tab switches between tabs → processes table → End Process button)
  - [ ] Write tests: Keyboard nav in KnowledgeBase (Tab cycles: search → categories → article list → detail pane links)

- [ ] Task: Conductor — User Manual Verification 'Phase 4b — Application-Level Keyboard Navigation' (Protocol in workflow.md)

---

## Phase 4c — Focus-Visible Styling & Skip Link

_Add visual focus indicators and a "Skip to content" link for keyboard users._

### Tasks

- [ ] Task: Write failing tests for focus-visible outline and skip link
  - [ ] Write tests: All interactive elements have `:focus-visible` CSS outline
  - [ ] Write tests: Skip-to-content link renders at top of page with `aria-label="Skip to content"`
  - [ ] Write tests: Skip link is visible on focus (not just on hover)
  - [ ] Write tests: Clicking/activating skip link moves focus to main content area (`#main-content` or equivalent)

- [ ] Task: Implement focus-visible styling
  - [ ] Implement: Add `.xp-focus-visible` CSS utility class: `outline: 1px dotted #000; outline-offset: 2px;`
  - [ ] Implement: Add `:focus-visible { @apply xp-focus-visible; }` to Global CSS for all interactive elements
  - [ ] Implement: Ensure `:focus:not(:focus-visible)` has NO outline (prevents mouse-click outline pollution)
  - [ ] Implement: Test with both keyboard (Tab) and mouse to confirm correct behavior

- [ ] Task: Implement skip-to-content link
  - [ ] Implement: Add visually-hidden skip link as first focusable element in `RootLayout.astro` before `<slot />`
  - [ ] Implement: Link targets `#main-content` anchor on the desktop wrapper
  - [ ] Implement: Style: absolute positioning, visible on focus, hidden otherwise (`.skip-link` pattern)
  - [ ] Implement: Add `id="main-content"` to the desktop content wrapper or WindowLayer container

- [ ] Task: Conductor — User Manual Verification 'Phase 4c — Focus-Visible Styling & Skip Link' (Protocol in workflow.md)

---

## Phase 5 — Reduced Motion Verification

_Audit all CSS animations/transitions and ensure they respect `prefers-reduced-motion: reduce`. Several animations already have overrides — this phase fills remaining gaps._

### Tasks

- [ ] Task: Write failing tests for reduced-motion gaps (items known to be missing overrides)
  - [ ] Write tests: Shutdown progress bar animation stops under reduced motion
  - [ ] Write tests: CRT scanline animation (if animated) stops under reduced motion
  - [ ] Write tests: DesktopIcon hover highlight background-color transition respects reduced motion
  - [ ] Write tests: Startup boot typewriter animation respects reduced motion

- [ ] Task: Verify pre-existing reduced-motion overrides (non-failing tests)
  - [ ] Write tests (verify-only): Window open/close/minimize/maximize animations already overridden in `global.css` `@media (prefers-reduced-motion: reduce)` block
  - [ ] Write tests (verify-only): Start Menu open/close animations already overridden
  - [ ] Write tests (verify-only): CMD cursor blink already disabled (opacity: 1) under reduced motion
  - [ ] Write tests (verify-only): Safe Mode boot typewriter already skips entirely under reduced motion

- [ ] Task: Implement reduced motion overrides for missing animations
  - [ ] Implement: Add to the `@media (prefers-reduced-motion: reduce)` block in `global.css`:
    - `.shutdown-progress-bar { animation: none !important; }`
    - `.crt-scanlines::before, .crt-curvature::after { animation: none !important; }`
  - [ ] Implement: Add `.desktop-icon { transition: none !important; }` under reduced motion for hover effect
  - [ ] Implement: Verify Safe Mode `animate-pulse` (Tailwind) on BIOS cursor is disabled — add `animation: none` under reduced motion if needed

- [ ] Task: Conductor — User Manual Verification 'Phase 5 — Reduced Motion Verification' (Protocol in workflow.md)

---

## Phase 6 — Color Contrast Audit (WCAG AA)

_Audit all color pairs across the site against WCAG AA standards and fix any failures. WCAG AA minimum: 4.5:1 for normal text, 3:1 for large text (≥18px or ≥14px bold)._

### Tasks

- [ ] Task: Write failing tests for color contrast compliance
  - [ ] Write tests: Desktop primary text (#000000) on window background (#ece9d8) — ratio ≥ 4.5:1
  - [ ] Write tests: TitleBar white text (#ffffff) on blue gradient worst-case (#0a246a) — ratio ≥ 4.5:1
  - [ ] Write tests: Start Menu header white text on blue worst-case (#1f4e9a) — ratio ≥ 4.5:1
  - [ ] Write tests: Disabled text (#aca899) on button face (#ece9d8) — document ratio (expected ~2.4:1, decorative — non-failing informational assertion)
  - [ ] Write tests: Link color (#0000cc) on white background (#ffffff) — ratio ≥ 4.5:1
  - [ ] Write tests: Link hover color (#ff0000) on white background (#ffffff) — ratio ≥ 4.5:1
  - [ ] Write tests: Safe Mode text (#00ff41) on black (#000000) — ratio ≥ 4.5:1
  - [ ] Write tests: Archived badge text (#666666) on badge background (#d4d0c8) — ratio ≥ 3:1 (large text) or ≥ 4.5:1 (normal text)
  - [ ] Write tests: Deleted file strikethrough text (#666666) on white (#ffffff) — ratio ≥ 4.5:1

- [ ] Task: Audit and fix contrast failures
  - [ ] Implement: Measure all color pairs using relative luminance formula (`(L1 + 0.05) / (L2 + 0.05)`)
  - [ ] Implement: Document each pair's contrast ratio and pass/fail status in a table
  - [ ] Implement: Fix any failing pairs by adjusting color values (minimum adjustment to preserve XP aesthetic)
  - [ ] Implement: If disabled text (#aca899 on #ece9d8 ~2.4:1) is deemed too dim, darken to ~#8a8878 (target ~3.5:1) — acceptable for disabled state
  - [ ] Implement: If archive badge (#666666 on #d4d0c8 ~3.0:1) fails for normal text size, either enlarge the font (make it large text) or darken to ~#4a4a4a
  - [ ] Implement: Verify no visual XP authenticity is lost in fix process

- [ ] Task: Audit CRT scanline effect on contrast
  - [ ] Implement: Calculate effective contrast of Safe Mode text (#00ff41) through the CRT scanline overlay (`rgba(0,0,0,0.15)` bands at 50% of pixels)
  - [ ] Implement: If readability concern found, reduce scanline opacity (`--safe-mode-scanline-opacity`) from current value
  - [ ] Implement: Document CRT contrast findings

- [ ] Task: Conductor — User Manual Verification 'Phase 6 — Color Contrast Audit' (Protocol in workflow.md)
