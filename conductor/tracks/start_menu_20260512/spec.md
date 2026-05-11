# Specification: Start Menu (Track 1C)

## Overview

Implement a fully interactive Start Menu for the Luna OS Desktop — accessible by clicking the green Start button in the Taskbar. The menu follows the classic Windows XP two-column layout with pinned apps on the left, system folders on the right, a blue header bar with user avatar/name, and a bottom bar with "Shut Down..." that triggers a BSOD overlay.

## References

- [ROADMAP.md — Track 1C](../../docs/ROADMAP.md)
- [TDD §7.3 — Start Menu Layout](../../docs/TDD.md#73-start-menu-layout)
- [TDD §9 — Animations & Transitions](../../docs/TDD.md#9-animations--transitions)
- [PRD §3.1 — The Desktop Experience](../../docs/PRD.md#31-the-desktop-experience)

## Architecture Decisions

- **Store Separation:** Create `src/stores/desktop.ts` with a `$startMenuOpen` atom for Start Menu open/close state. Keeps desktop-level concerns out of `windows.ts`.
- **Start Menu Component:** React island (`client:load`) mounted inside or alongside the Taskbar.
- **Search & All Programs:** Excluded from v1 per user decision — keeps scope lean.
- **User Avatar:** Initials "MARP" in a colored circle, no external image dependency.
- **BSOD Overlay:** Full-screen blue screen with white error text, auto-fades after 4 seconds.
- **Animations:** Slide up from taskbar (150ms ease-out) on open; slide down (100ms ease-in) on close (per TDD §9).

## Functional Requirements

### FR1 — Start Menu Store (`src/stores/desktop.ts`)

- Create a `$startMenuOpen` atom (`atom<boolean>`) initialized to `false`.
- Create `toggleStartMenu()`, `openStartMenu()`, `closeStartMenu()` actions.

### FR2 — Start Button Wiring (`src/components/taskbar/Taskbar.tsx`)

- Modify the existing green Start button in Taskbar to call `toggleStartMenu()` on click.
- Start button should show an active/pressed state when the Start Menu is open.

### FR3 — Start Menu Layout (`src/components/taskbar/StartMenu.tsx`)

- **Header:** Blue gradient bar (matching active title bar style) displaying:
  - User initials avatar "MARP" in a circle (white text on dark blue)
  - User name: "Ansyar Muh Amrulloh"
- **Left Column (Pinned Apps):**
  - Resume (opens My Documents window)
  - Explorer (opens My Computer window)
  - Task Manager (opens Task Manager window)
  - Command Prompt (opens Command Prompt window)
    Each item: 16×16 icon + label, blue hover highlight
- **Right Column (System Folders):**
  - My Documents (opens My Documents window)
  - My Computer (opens Explorer)
  - Control Panel (opens Task Manager)
  - Help & Support (opens Help & Support window)
    Each item: 16×16 icon + label, blue hover highlight
- **Bottom Bar:** Gray divider, then "Shut Down..." button with power icon
  - Triggers BSOD overlay (see FR5)
- Overall background: white left column, light blue right column (XP classic style)
- Dimensions: ~320px wide, height auto based on content (capped at ~400px)

### FR4 — Start Menu Interactions

- Clicking a menu item calls `openWindow()` with the corresponding WindowId, then closes the Start Menu.
- Clicking outside the menu closes it.
- Pressing Escape key closes it.
- Slide-up animation on open (150ms ease-out).
- Slide-down animation on close (100ms ease-in).
- `role="menu"` ARIA role on the menu container.

### FR5 — BSOD / Goodbye Overlay

- Full-screen overlay with classic blue screen (`#0000aa`) styling
- White monospace text containing:
  - "A problem has been detected and windows has been shut down to prevent damage to your portfolio."
  - "Technical information:"
  - "\*\*\* STOP: 0x000000DE (0xAD00, 0xDE00, 0x0000, 0xPORT)"
  - "\*\*\* portfólio.sys - Address DEADBEEF base at 00401000, DateStamp 4cee7c92"
  - Error code / QR-like block at bottom
- Overlay auto-dismisses after 4 seconds, fading to black then removing
- Respects `prefers-reduced-motion`

## Non-Functional Requirements

- **Performance:** Start Menu should open within 150ms of click; zero layout shift
- **Accessibility:** Keyboard navigable (Tab through items, Enter activates, Escape closes)
- **Fidelity:** Must visually match the XP Start Menu layout from TDD §7.3

## Acceptance Criteria

```
✅ Clicking Start button opens the two-column menu with slide-up animation (150ms ease-out)
✅ Menu shows blue header with "MARP" initials avatar and "Ansyar Muh Amrulloh" name
✅ Left column: Resume, Explorer, Task Manager, Command Prompt
✅ Right column: My Documents, My Computer, Control Panel, Help & Support
✅ Each menu item opens the corresponding window and closes the menu
✅ Clicking outside or pressing Escape closes the menu
✅ Slide-down animation on close (100ms ease-in)
✅ "Shut Down..." shows a full-screen BSOD overlay that auto-fades after 4 seconds
✅ Start button shows pressed state when menu is open
✅ Start Menu respects prefers-reduced-motion: reduce
```

## Out of Scope

- Search bar (v1 — user decision)
- "All Programs" flyout menu (v1 — user decision)
- Drag or resize the Start Menu
- Right-click context menus
