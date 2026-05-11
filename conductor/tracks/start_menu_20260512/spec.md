# Specification: Start Menu (Track 1C)

## Overview

Implement a fully interactive Start Menu for the Luna OS Desktop — accessible by clicking the green Start button in the Taskbar. The menu follows the classic Windows XP two-column layout with pinned apps on the left, system folders on the right, a blue header bar with user avatar/name, and a bottom bar with "Shut Down..." that triggers an XP-style "Windows is shutting down" screen.

## References

- [ROADMAP.md — Track 1C](../../docs/ROADMAP.md)
- [TDD §7.3 — Start Menu Layout](../../docs/TDD.md#73-start-menu-layout)
- [TDD §9 — Animations & Transitions](../../docs/TDD.md#9-animations--transitions)
- [PRD §3.1 — The Desktop Experience](../../docs/PRD.md#31-the-desktop-experience)

## Architecture Decisions

- **Store Separation:** Create `src/stores/desktop.ts` with a `$startMenuOpen` atom for Start Menu open/close state. Keeps desktop-level concerns out of `windows.ts`.
- **URL Sync Ready:** `$startMenuOpen` is a clean atom export, designed for future `?start=0|1` URL param sync (Track 3B).
- **Mounting:** StartMenu component is rendered **inside** `Taskbar.tsx` (not as a separate Astro island). The Taskbar already has `client:load`, so this adds no extra JS bundle overhead.
- **Search & All Programs:** Excluded from v1 per user decision — keeps scope lean.
- **User Avatar:** Initials "MARP" in a colored circle, no external image dependency.
- **Icons:** Start Menu reuses existing 48×48 desktop icons from `public/icons/` rendered at 16×16 via CSS. No separate icon assets needed.
- **Shutdown Overlay:** Authentic XP "Windows is shutting down" screen (dark gradient background with text + optional progress animation). NOT a BSOD — BSOD is reserved for the 404 error page (TDD §11 / Track 4C).
- **Shutdown Recovery:** After shutdown screen fades to black, auto-reboot back to the desktop after 2 seconds.
- **Animations:** Slide up from taskbar (150ms ease-out) on open; slide down (100ms ease-in) on close (per TDD §9).
- **Existing CSS Tokens:** The `xp-theme.css` already defines Start Menu-specific tokens that must be used:
  - `--xp-start-header-blue` (header gradient, NOT the title bar gradient)
  - `--xp-start-left-bg` (#ffffff, left column background)
  - `--xp-start-right-bg` (#d3e5fa, right column background)
  - `--xp-start-separator` (#d6d2c2, divider color)
  - `--xp-startmenu-width` (320px, menu width)

## Functional Requirements

### FR1 — Start Menu Store (`src/stores/desktop.ts`)

- Create a `$startMenuOpen` atom (`atom<boolean>`) initialized to `false`.
- Create `toggleStartMenu()`, `openStartMenu()`, `closeStartMenu()` actions.

### FR2 — Start Button Wiring (`src/components/taskbar/Taskbar.tsx`)

- Modify the existing green Start button in Taskbar to call `toggleStartMenu()` on click.
- Start button should show an active/pressed state when the Start Menu is open.

### FR3 — Start Menu Layout (`src/components/taskbar/StartMenu.tsx`)

- **Header:** Blue gradient bar using `--xp-start-header-blue` CSS token displaying:
  - User initials avatar "MARP" in a circle (white text on dark blue)
  - User name: "Ansyar Muh Amrulloh"
- **Left Column (Pinned Apps):** background `--xp-start-left-bg`
  - Resume (opens My Documents window)
  - Explorer (opens My Computer window)
  - Task Manager (opens Task Manager window)
  - Command Prompt (opens Command Prompt window)
    Each item: existing 48×48 desktop icon from `public/icons/` resized to 16×16 via CSS + label, blue hover highlight
- **Right Column (System Folders):** background `--xp-start-right-bg`
  - My Documents (opens My Documents window)
  - My Computer (opens Explorer)
  - Control Panel (opens Task Manager)
  - Help & Support (opens Help & Support window)
    Each item: existing 48×48 desktop icon from `public/icons/` resized to 16×16 via CSS + label, blue hover highlight
- **Bottom Bar:** Divider using `--xp-start-separator`, then "Shut Down..." button with power icon
  - Triggers shutdown overlay (see FR5)
- Dimensions: `--xp-startmenu-width` (320px) wide, height auto based on content (capped at ~400px)

### FR4 — Start Menu Interactions

- Clicking a menu item calls `openWindow()` with the corresponding WindowId, then closes the Start Menu.
- Clicking outside the menu closes it.
- Pressing Escape key closes it.
- **Keyboard navigation:** Tab key cycles through menu items. Enter activates the focused item. Shift+Tab cycles backwards. Focus is visible on the active item.
- Slide-up animation on open (150ms ease-out).
- Slide-down animation on close (100ms ease-in).
- `role="menu"` ARIA role on the menu container with `aria-activedescendant` for keyboard focus tracking.

### FR5 — Shutdown / Goodbye Overlay

- Triggered by clicking "Shut Down..." button
- **Phase 1 — Shutting Down (3s):** Full-screen dark overlay (`#000000` fading from 0 to full opacity over 500ms) displaying:
  - XP-style shutdown screen: "Windows is shutting down..." centered text in white, Tahoma font
  - Animated progress bar (indeterminate, smooth scrolling XP blue gradient)
- **Phase 2 — Fade to Black (1s):** Screen fades to solid black over 1 second
- **Phase 3 — Auto-Reboot:** After 2 additional seconds on black, overlay removes itself smoothly, revealing the desktop again (simulating a reboot)
- Total duration: ~6 seconds from click to desktop restore
- **Note:** This is NOT a BSOD. The BSOD visual is reserved for the 404 error page (TDD §11 / Track 4C). The shutdown overlay is an authentic XP "Windows is shutting down" experience.
- Respects `prefers-reduced-motion` (skip animations, instant transitions)

## Non-Functional Requirements

- **Performance:** Start Menu should open within 150ms of click; zero layout shift
- **Accessibility:** Keyboard navigable (Tab cycles forward through items, Shift+Tab cycles backwards, Enter activates focused item, Escape closes menu). Focus must be visibly highlighted on the active menu item.
- **Fidelity:** Must visually match the XP Start Menu layout from TDD §7.3 using existing `--xp-start-*` CSS tokens from `xp-theme.css`

## Acceptance Criteria

```
✅ Clicking Start button opens the two-column menu with slide-up animation (150ms ease-out)
✅ Menu shows blue header with "MARP" initials avatar and "Ansyar Muh Amrulloh" name
✅ Left column: Resume, Explorer, Task Manager, Command Prompt
✅ Right column: My Documents, My Computer, Control Panel, Help & Support
✅ Each menu item opens the corresponding window and closes the menu
✅ Clicking outside or pressing Escape closes the menu
✅ Tab key cycles through menu items with visible focus; Enter activates
✅ Slide-down animation on close (100ms ease-in)
✅ "Shut Down..." shows an XP "Windows is shutting down" screen (not a BSOD)
✅ After shutdown sequence completes (~6s), desktop is restored (auto-reboot)
✅ Start button shows pressed state when menu is open
✅ All `--xp-start-*` CSS tokens from xp-theme.css are used for styling
✅ Start Menu respects prefers-reduced-motion: reduce
```

## Out of Scope

- Search bar (v1 — user decision)
- "All Programs" flyout menu (v1 — user decision)
- BSOD visual (reserved for 404 error page, TDD §11 / Track 4C)
- Drag or resize the Start Menu
- Right-click context menus
