# Specification: Track 4B — Accessibility

**Track:** `accessibility_20260514`
**Type:** Feature
**Description:** Keyboard navigation, ARIA roles, focus management, reduced motion support, and color contrast compliance across all interactive components.

**Depends on:** All previous tracks (full site exists)

---

## Overview

Implement comprehensive accessibility across the Luna OS Portfolio. This track ensures the entire site is keyboard-navigable, screen-reader friendly, meets WCAG AA color contrast, and respects user motion preferences. Every interactive component — Windows, Taskbar, Start Menu, Explorer, Command Prompt, Task Manager, Knowledge Base, and Safe Mode — receives proper ARIA roles, focus management, and keyboard support.

**Refs:** [ROADMAP §Track 4B](../../docs/ROADMAP.md) · [TDD §10](../../docs/TDD.md#10-accessibility-strategy) · [PRD §3.1](../../docs/PRD.md#31-the-desktop-experience) · [PRD §5.2](../../docs/PRD.md#52-task-manager-control-panel) · [PRD §5.3](../../docs/PRD.md#53-knowledge-base)

---

## Architecture Decisions

- **Tab order scope:** Desktop Icons → Taskbar (Start Button, Clock) → Start Menu items (when open) → Open Windows (TitleBar → content). Escape closes menus/windows.
- **Focus on open:** Focus lands on TitleBar first, so Tab cycles through min/max/close → window content, matching real Windows XP behavior.
- **No custom keyboard shortcuts (v1):** Alt+F4, Alt+Tab, Win+D, F5 are out of scope. Tab/Enter/Escape is sufficient for full keyboard navigability.
- **ARIA audit scope:** All interactive components: WindowFrame/TitleBar, Taskbar/Clock, StartMenu, Explorer (all sub-components), CmdPrompt, TaskManager, KnowledgeBase, Safe Mode (BiosBoot/TerminalNav).
- **Reduced motion:** OS `@media (prefers-reduced-motion: reduce)` only — no manual toggle.
- **Color contrast:** Full WCAG AA audit (4.5:1 normal text, 3:1 large text) across all color schemes (Luna desktop chrome, Safe Mode terminal, content areas).

---

## Functional Requirements

### FR1 — ARIA Roles & Properties (Full Audit)

All interactive components must have correct ARIA roles, labels, and properties:

| Component              | Role                 | Key Attributes                                                |
| ---------------------- | -------------------- | ------------------------------------------------------------- |
| Desktop shell          | `role="application"` | `aria-label="Luna OS Desktop"`                                |
| DesktopIcon            | Presentational       | `role="button"`, `aria-label="{label}"`                       |
| Taskbar                | `role="toolbar"`     | `aria-label="Taskbar"`                                        |
| Start Button           | `role="button"`      | `aria-label="Start"`, `aria-haspopup="menu"`, `aria-expanded` |
| Clock                  | `role="timer"`       | `aria-live="polite"`, `aria-label="Current time"`             |
| Start Menu             | `role="menu"`        | `aria-label="Start Menu"`                                     |
| Start Menu items       | `role="menuitem"`    | —                                                             |
| Shutdown Overlay       | `role="alertdialog"` | `aria-label="Windows is shutting down"`                       |
| WindowFrame            | `role="dialog"`      | `aria-label="{window title}"`, `aria-modal="true"`            |
| TitleBar               | Presentational       | `aria-hidden="true"` on decorative gradient                   |
| TitleBar buttons       | `role="button"`      | `aria-label="Minimize/Maximize/Close"`                        |
| Explorer               | `role="region"`      | `aria-label="File Explorer"`                                  |
| Explorer file list     | `role="grid"`        | `aria-label="File list"`                                      |
| Explorer breadcrumb    | `role="navigation"`  | `aria-label="Current path"`                                   |
| CmdPrompt              | `role="terminal"`    | `aria-label="Command Prompt"`                                 |
| CMD output area        | `role="log"`         | `aria-live="polite"`                                          |
| CMD input              | `role="textbox"`     | `aria-label="Command input"`                                  |
| TaskManager tabs       | `role="tablist"`     | (already implemented)                                         |
| TaskManager tab        | `role="tab"`         | `aria-selected` (already partial)                             |
| TaskManager tabpanel   | `role="tabpanel"`    | (already implemented)                                         |
| KnowledgeBase          | `role="region"`      | `aria-label="Knowledge Base"`                                 |
| KB search input        | `role="searchbox"`   | `aria-label="Search articles"` (already partial)              |
| KB category sidebar    | `role="navigation"`  | `aria-label="Article categories"`                             |
| SafeMode shell         | `role="application"` | `aria-label="Safe Mode Terminal"`                             |
| BiosBoot               | `role="status"`      | `aria-live="polite"`                                          |
| TerminalNav menu items | `role="button"`      | —                                                             |

### FR2 — Keyboard Navigation (Tab Cycle)

- **Tab order:** Desktop Icons → Taskbar (Start Button, Clock) → Start Menu items (when open) → Open Windows (TitleBar min/max/close buttons → interactive window content)
- **Tab/Shift+Tab:** Forward/backward cycling through focusable elements in DOM order
- **Enter/Space:** Activates focused button, menu item, or link
- **Escape:** Closes Start Menu, closes focused window, dismisses End Process dialog, dismisses context overlays
- **Arrow keys:** Tab switching in TaskManager (Left/Right), menu navigation in Start Menu

### FR3 — Focus Management

- **Opening a window:** Focus moves to the window's TitleBar (first focusable element)
- **Tab within window:** Cycles through TitleBar buttons → window content (file list, CMD input, etc.)
- **Closing a window:** Focus returns to the previously focused element (e.g., DesktopIcon that opened it, Taskbar button)
- **Closing Start Menu:** Focus returns to Start Button
- **Tab from last window:** Cycles back to Desktop Icons (wraps around)
- **Visible focus indicator:** All focusable elements must have a visible `:focus-visible` outline (XP-style dotted rectangle inside the 3D border)

### FR4 — Decorative Elements (`aria-hidden`)

All purely decorative XP chrome elements must be hidden from screen readers:

- TitleBar gradient background
- Window 3D border chrome
- Taskbar gradient background
- Start Menu decorative separator lines
- Shutdown overlay screen background
- CRT scanline overlay (Safe Mode)
- Decorative icon elements that duplicate text labels

### FR5 — Reduced Motion

- All animations and transitions must respect `@media (prefers-reduced-motion: reduce)`
- Inventory of animations to verify: Window open/close/minimize/restore, Start Menu slide, Shutdown progress, DesktopIcon hover highlight, CMD cursor blink, Safe Mode boot typewriter, CRT scanline animation

### FR6 — Color Contrast Audit (WCAG AA)

- Safe Mode: Verify `#00ff41` on `#000000` passes (contrast ratio ~15.3:1 — already compliant)
- Desktop chrome: Verify `--xp-text-primary (#000000)` on `--xp-window-bg (#ece9d8)` — contrast ~14.5:1
- TitleBar white text (`#ffffff`) on blue gradient — verify passes
- Start Menu blue header white text — verify passes
- Disabled text (`--xp-text-disabled: #aca899`) on backgrounds — verify passes (or adjust)
- Unvisited link colors in Explorer detail pane and Knowledge Base — verify passes
- Button face text on `--xp-button-face (#ece9d8)` — verify passes
- Document any failures and propose fixes

---

## Non-Functional Requirements

- **No JS bundle size increase:** ARIA attributes are HTML-only, zero cost
- **No layout shifts:** Adding `tabindex`, ARIA attributes must not affect visual rendering
- **Backward compatible:** All existing mouse/touch interactions preserved
- **Existing tests must continue to pass:** ~535 tests baseline
- **Test coverage:** New tests for keyboard navigation flows, ARIA attribute presence, focus management, and color contrast ratios

---

## Out of Scope

- Alt+F4 / Alt+Tab / Win+D / F5 keyboard shortcuts
- Custom animation toggle (OS setting only)
- Screen reader-specific announcements beyond ARIA attributes
- Tab-completion in CMD (already exists)
- Focus trap within modal windows (v1 behavior: Tab wraps to next window)

---

## Acceptance Criteria

```
✅ Entire site navigable with keyboard only (no mouse required)
✅ Tab cycles: Desktop Icons → Taskbar → Start Menu (when open) → Open Windows
✅ Enter/Space activates focused element; Escape closes menus/windows
✅ Opening a window focuses TitleBar; closing returns focus to previous element
✅ Focus-visible outline visible on all interactive elements
✅ All interactive components have correct ARIA roles and labels
✅ All decorative chrome elements have aria-hidden="true"
✅ All animations respect prefers-reduced-motion: reduce
✅ Desktop and Safe Mode color combinations pass WCAG AA (4.5:1 text, 3:1 large text)
✅ Full test suite continues to pass with new accessibility tests
```
