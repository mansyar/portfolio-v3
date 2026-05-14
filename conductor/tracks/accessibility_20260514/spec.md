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
- **Pre-existing ARIA:** Several components already have correct ARIA (e.g., WindowFrame `role="dialog"`, Taskbar `role="toolbar"`, TitleBar button `aria-label`). These require test verification, not re-implementation. See FR1 "Current State" column.
- **Explorer file list role:** Uses `role="list"` on the outer container and `role="grid"` on the inner `<table>`. The `aria-activedescendant` pattern should be considered for screen reader row navigation, but is deferred (v1 uses basic grid semantics).
- **Desktop-level ARIA role:** `role="application"` on the desktop shell **removes** browser default keyboard handling (Tab between links/buttons). Use `role="group"` with `aria-label` instead, to preserve native focus management while providing a descriptive landmark.
- **ShutdownOverlay:** Uses `role="status"` with `aria-live="polite"` (not `role="alertdialog"`) — the overlay is informational, not a dialog requiring user input.
- **Reduced motion:** OS `@media (prefers-reduced-motion: reduce)` only — no manual toggle. Some animations already respect this (window open/close, cursor blink) — verify and fill gaps.
- **Color contrast:** Full WCAG AA audit (4.5:1 normal text, 3:1 large text) across all color schemes (Luna desktop chrome, Safe Mode terminal, content areas).
- **Skip navigation:** Add a visually-hidden "Skip to content" link at the top of the page for keyboard users to bypass repeated chrome.

---

## Functional Requirements

### FR1 — ARIA Roles & Properties (Full Audit)

All interactive components must have correct ARIA roles, labels, and properties. The "Current State" column documents pre-existing attributes that need verification only.

| Component            | Role                                                | Key Attributes                                                | Current State                                                                                       |
| -------------------- | --------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Desktop shell        | `role="group"`                                      | `aria-label="Luna OS Desktop"`                                | Missing — needs implement                                                                           |
| Skip-to-content link | `role="link"`                                       | `aria-label="Skip to content"`, visually-hidden styling       | Missing — needs implement                                                                           |
| DesktopIcon          | `role="button"`                                     | `aria-label="{label}"`, `tabindex="0"`                        | Missing — needs implement                                                                           |
| Taskbar              | `role="toolbar"`                                    | `aria-label="Taskbar"`                                        | ✅ Pre-existing                                                                                     |
| Start Button         | `role="button"`                                     | `aria-label="Start"`, `aria-haspopup="menu"`, `aria-expanded` | Partial: `aria-label` exists, `aria-haspopup` + `aria-expanded` missing                             |
| Clock                | `role="timer"`                                      | `aria-live="polite"`, `aria-label="Current time"`             | Missing — needs implement                                                                           |
| Start Menu           | `role="menu"`                                       | `aria-label="Start Menu"`                                     | ✅ Pre-existing (`role="menu"`)                                                                     |
| Start Menu items     | `role="menuitem"`                                   | —                                                             | ✅ Pre-existing                                                                                     |
| Start Menu keyboard  | Tab/Enter/Escape                                    | `aria-activedescendant` pattern                               | ✅ Pre-existing                                                                                     |
| Shutdown Overlay     | `role="status"`                                     | `aria-live="polite"`, `aria-label="Shutting down"`            | Partial: `role="status"` exists, needs `aria-live`                                                  |
| WindowFrame          | `role="dialog"`                                     | `aria-label="{window title}"`, `aria-modal="true"`            | Partial: `role="dialog"` + `aria-label` exist, `aria-modal` missing                                 |
| TitleBar gradient    | Presentational                                      | `aria-hidden="true"`                                          | Missing — needs implement                                                                           |
| TitleBar buttons     | `role="button"`                                     | `aria-label="Minimize/Maximize/Close"`                        | ✅ Pre-existing                                                                                     |
| Explorer shell       | `role="region"`                                     | `aria-label="File Explorer"`                                  | Missing — needs implement                                                                           |
| Explorer toolbar     | `role="toolbar"`                                    | `aria-label="Explorer toolbar"`                               | ✅ Pre-existing                                                                                     |
| Explorer file list   | `role="list"` (outer) + `role="grid"` (inner table) | `aria-label="File list"`                                      | Partial: outer `role="list"` exists, inner `<table role="grid">` exists, needs unified `aria-label` |
| Explorer breadcrumb  | `<nav>` landmark                                    | `aria-label="Current path"`                                   | ✅ Pre-existing                                                                                     |
| Explorer detail pane | `role="region"`                                     | `aria-label="Contact/File/Recycle Bin details"`               | ✅ Pre-existing                                                                                     |
| CmdPrompt            | `role="terminal"`                                   | `aria-label="Command Prompt"`                                 | ✅ Pre-existing                                                                                     |
| CMD output area      | `role="log"`                                        | `aria-live="polite"`                                          | Missing — needs implement                                                                           |
| CMD input            | `role="textbox"`                                    | `aria-label="Command input"`                                  | ✅ Pre-existing                                                                                     |
| TaskManager tabs     | `role="tablist"`                                    | `aria-label="Task Manager tabs"`                              | ✅ Pre-existing                                                                                     |
| TaskManager tab      | `role="tab"`                                        | `aria-selected`, `aria-controls`                              | ✅ Pre-existing                                                                                     |
| TaskManager tabpanel | `role="tabpanel"`                                   | `aria-labelledby`, `aria-hidden`                              | ✅ Pre-existing                                                                                     |
| KnowledgeBase        | `role="region"`                                     | `aria-label="Knowledge Base"`                                 | Missing — needs implement                                                                           |
| KB search input      | `role="searchbox"`                                  | `aria-label="Search articles"`                                | Partial: `aria-label` exists, `role="searchbox"` missing                                            |
| KB category sidebar  | `role="navigation"`                                 | `aria-label="Article categories"`                             | Missing — needs implement                                                                           |
| SafeMode shell       | `role="group"`                                      | `aria-label="Safe Mode Terminal"`                             | Missing — needs implement                                                                           |
| BiosBoot             | `role="status"`                                     | `aria-live="polite"`                                          | Missing — needs implement                                                                           |
| TerminalNav buttons  | `<button>` native                                   | `aria-label` for icon-only buttons                            | Partial: native `<button>` provides implicit role, `aria-label` missing on some                     |

### FR2 — Keyboard Navigation (Tab Cycle)

- **Tab order:** Desktop Icons → Skip-to-content link → Taskbar (Start Button, Clock) → Start Menu items (when open) → Open Windows (TitleBar min/max/close buttons → interactive window content)
- **Tab/Shift+Tab:** Forward/backward cycling through focusable elements in DOM order
- **Enter/Space:** Activates focused button, menu item, or link
- **Enter/Space on DesktopIcon:** Must dispatch `luna:open-window` custom event (same as click)
- **Escape:** Closes Start Menu, closes focused window, dismisses End Process dialog, dismisses context overlays
- **Arrow keys:** Tab switching in TaskManager (Left/Right), menu navigation in Start Menu

### FR3 — Focus Management

- **Opening a window:** Focus moves to the window's TitleBar (first focusable element — the minimize button)
- **Tab within window:** Cycles through TitleBar buttons (minimize → maximize → close) → window content (file list, CMD input, task tabs, etc.)
- **Closing a window:** Focus returns to the previously focused element (e.g., DesktopIcon that opened it, Taskbar button)
- **Closing Start Menu:** Focus returns to Start Button
- **Tab from last window:** Cycles back to Desktop Icons (wraps around)
- **Visible focus indicator:** All focusable elements must have a visible `:focus-visible` outline (XP-style dotted rectangle inside the 3D border, e.g., `outline: 1px dotted #000; outline-offset: 2px`)

### FR4 — Decorative Elements (`aria-hidden`)

All purely decorative XP chrome elements must be hidden from screen readers:

- TitleBar gradient background
- Window 3D border chrome
- Taskbar gradient background (CSS `::before` or div)
- Start Menu decorative separator lines
- Start Menu avatar initials ("MARP" circle) — already has `aria-hidden="true"` ✅
- Shutdown overlay screen background
- CRT scanline overlay (Safe Mode) — `::before` pseudo-element
- CRT curvature overlay (Safe Mode) — `::after` pseudo-element
- Decorative icon elements that duplicate text labels (e.g., `alt=""` on icons next to text)

### FR5 — Reduced Motion

- All animations and transitions must respect `@media (prefers-reduced-motion: reduce)`
- Inventory of animations to verify (✅ = already compliant, ❌ = needs fix):
  - ✅ Window open (`windowOpen` keyframe) — already overridden in `global.css`
  - ✅ Window close (`windowClose` keyframe) — already overridden
  - ✅ Window minimize (`windowMinimize` keyframe) — already overridden
  - ✅ Window maximize (`windowMaximize` keyframe) — already overridden
  - ✅ Start Menu open/close — already overridden
  - ✅ CMD cursor blink — already overridden (opacity: 1)
  - ❌ Shutdown progress bar animation (`shutdownProgress`) — no reduced-motion override
  - ❌ CRT scanline effect — CSS `::before` animation has no reduced-motion override
  - ❌ Safe Mode boot typewriter — `setTimeout` chain skips entirely when reduced motion detected
  - ❌ DesktopIcon hover highlight — CSS `hover` background-color transition has no `transition: none` override

### FR6 — Color Contrast Audit (WCAG AA)

WCAG AA minimum contrast ratios:

- **Normal text (<18px / not bold):** 4.5:1
- **Large text (≥18px or ≥14px bold):** 3:1
- **UI components / decorative text:** No minimum (but nearby readable text must still pass)

Color pairs to audit:

| Foreground                   | Background                       | Context                             | Expected Ratio                                   | Notes                                                                                        |
| ---------------------------- | -------------------------------- | ----------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| `#000000`                    | `#ece9d8`                        | Window content text                 | ~14.5:1 ✅                                       | Easily passes                                                                                |
| `#ffffff`                    | Blue gradient (worst: `#0a246a`) | TitleBar text                       | ~7.5:1 ✅                                        | Passes comfortably                                                                           |
| `#ffffff`                    | Blue gradient (worst: `#1f4e9a`) | Start Menu header                   | ~6.8:1 ✅                                        | Passes                                                                                       |
| `#aca899`                    | `#ece9d8`                        | Disabled button text                | ~2.4:1 ❌                                        | Likely fails — decorative/disabled state is acceptable at this ratio but document the result |
| `#0000cc`                    | `#ffffff`                        | Explorer/KB link text               | ~7.5:1 ✅                                        | Passes                                                                                       |
| `#ff0000`                    | `#ffffff`                        | Explorer link hover                 | ~5.5:1 ✅                                        | Passes                                                                                       |
| `#00ff41`                    | `#000000`                        | Safe Mode text                      | ~15.3:1 ✅                                       | Passes                                                                                       |
| `#666666`                    | `#d4d0c8`                        | Archived badge text                 | ~3.0:1 ⚠️                                        | Borderline for normal text, passes for large text                                            |
| `#00ff41` + scanline overlay | `#000000`                        | Safe Mode text through CRT scanline | Effective ratio reduced by ~50% opacity scanline | Must verify text is still readable through `rgba(0,0,0,0.15)` scanline bands                 |
| `#666666`                    | `#ffffff`                        | Deleted file strikethrough text     | ~5.1:1 ✅                                        | Passes                                                                                       |

> **Note on disabled/decorative text:** `#aca899` on `#ece9d8` is expected to fail WCAG AA (~2.4:1). This is acceptable for disabled UI elements because the text indicates non-interactivity. However, if readability is a concern, darken to `#8a8878` (~3.5:1) as a middle ground.

---

## Non-Functional Requirements

- **No JS bundle size increase:** ARIA attributes are HTML-only, zero cost
- **No layout shifts:** Adding `tabindex`, ARIA attributes must not affect visual rendering
- **Backward compatible:** All existing mouse/touch interactions preserved
- **Existing tests must continue to pass:** ~535 tests baseline
- **Test coverage:** New tests for keyboard navigation flows, ARIA attribute presence, focus management, color contrast ratios, and reduced-motion overrides

---

## Out of Scope

- Alt+F4 / Alt+Tab / Win+D / F5 keyboard shortcuts
- Custom animation toggle (OS setting only)
- Screen reader-specific announcements beyond ARIA attributes
- `aria-activedescendant` / roving tabindex for Explorer grid (v1 uses basic grid semantics)
- Tab-completion in CMD (already exists)
- Focus trap within modal windows (v1 behavior: Tab wraps to next window)
- `<noscript>` fallback (covered in Track 4C — SEO & Performance)

---

## Acceptance Criteria

```
✅ Entire site navigable with keyboard only (no mouse required)
✅ Tab cycles: Desktop Icons → Skip-to-content → Taskbar → Start Menu (when open) → Open Windows
✅ Enter/Space activates focused element; Escape closes menus/windows
✅ Opening a window focuses TitleBar; closing returns focus to previous element
✅ Focus-visible outline visible on all interactive elements
✅ All interactive components have correct ARIA roles and labels
✅ All decorative chrome elements have aria-hidden="true"
✅ All animations respect prefers-reduced-motion: reduce
✅ Desktop and Safe Mode color combinations pass WCAG AA (4.5:1 text, 3:1 large text)
✅ Full test suite continues to pass with new accessibility tests
```
