# Spec: Track 1A — Desktop Shell

## Overview

The first visual track: transform the blank XP-blue page into a recognizable Windows XP Luna desktop. This track delivers a custom SVG-inspired wallpaper, 5 desktop icons with hover effects, and a static taskbar with Start button and live clock. Window management comes in Track 1B — here icons are visual placeholders only.

## Technical Context

- **Framework:** Astro 6 with React 19 islands
- **Styling:** Tailwind CSS v4 with XP theme tokens (`xp-theme.css`, `global.css`)
- **Rendering:** Wallpaper & DesktopIcon = Astro (zero JS); Taskbar & Clock = React (`client:load`)
- **Icons:** Custom SVG files in `public/icons/`
- **Wallpaper:** Custom SVG/CSS-generated art inspired by XP "Bliss" (not the copyrighted photo)
- **CSS Additions Required:** The following tokens are defined in TDD §5.1 but are **not yet present** in the actual `xp-theme.css` — they must be added during this track:
  - `--xp-taskbar-bg`: Linear gradient for the taskbar blue bar
  - `--xp-start-btn-green`: Linear gradient for the green Start button
- **CSS Utility Required:** A `.xp-taskbar-border` class must be created for the top-edge-only outset border (`.xp-outset` applies a full perimeter border, which is incorrect for the taskbar)

## Functional Requirements

### 1. Wallpaper (`Wallpaper.astro`)

- Custom SVG/CSS-generated wallpaper inspired by the XP "Bliss" rolling hills aesthetic
- Full-viewport coverage, responsive
- Rendered below all other elements (z-index: 0)
- Uses the existing `#wallpaper-area` mount point in `index.astro`
- Accept an optional `imageSrc` prop for future fallback to a real bitmap wallpaper in `public/wallpapers/`

### 2. Desktop Icons (`DesktopIcon.astro`)

- 5 icons: My Computer, My Documents, Help & Support, Command Prompt, Recycle Bin
- Each icon: 48×48px SVG icon + 11px label below it
- Left-aligned vertical column starting at top-left (16px from edge)
- XP-style hover: blue selection highlight background
- No click action yet (window manager comes in Track 1B)
- Text color: white with dark shadow for readability on any wallpaper
- Include `data-window-id` attribute on each icon container (e.g., `data-window-id="cmd"`) for future wiring to the window manager (Track 1B)
- Include `data-window-label` attribute (e.g., `data-window-label="My Computer"`) for accessibility and future taskbar integration

### 3. Desktop Icon SVG Files (`public/icons/`)

- 5 custom SVG files inspired by XP originals (not pixel-copied):
  - `my-computer.svg`
  - `my-documents.svg`
  - `help-support.svg`
  - `command-prompt.svg`
  - `recycle-bin.svg`
- 48×48 viewport, clean vector art

### 4. Taskbar (`Taskbar.tsx`, React, `client:load`)

- Blue gradient bar spanning full width at bottom (40px height)
- Taskbar gradient must be defined via `--xp-taskbar-bg` (add this token to `xp-theme.css`)
- Green "Start" button on the left (non-functional for this track), styled via `--xp-start-btn-green` (add this token to `xp-theme.css`)
- 3D outset border on **top edge only** (using `.xp-taskbar-border` utility — not `.xp-outset` which applies a full perimeter border)
- System tray area on the right
- Uses existing `#taskbar` mount point in `index.astro`

### 5. Clock (`Clock.tsx`, React, inside Taskbar)

- Displays current time in HH:MM format, updating every minute
- Lives in the system tray area of the taskbar
- XP-style alignment and font size (11px)

## Acceptance Criteria

```
✅ Desktop shows custom Bliss-style wallpaper filling the full viewport
✅ Wallpaper.astro accepts optional imageSrc prop for future real-image fallback
✅ 5 desktop icons render in a left-aligned vertical column (top-left)
✅ Each DesktopIcon includes data-window-id and data-window-label attributes
✅ Icons show XP-style blue selection highlight on hover
✅ Taskbar spans full width at bottom with blue gradient and outset top border
✅ Taskbar uses top-edge-only outset border (.xp-taskbar-border)
✅ Green Start button visible on taskbar left (non-functional)
✅ Live clock in system tray showing current time
✅ Clock updates every minute (no seconds)
✅ All icons are custom SVGs in public/icons/
✅ Zero-JS for wallpaper and icons (Astro static components)
✅ Taskbar and Clock are React islands with client:load
✅ --xp-taskbar-bg and --xp-start-btn-green CSS tokens added to xp-theme.css
✅ Looks authentically XP at a glance
```

## Out of Scope

- Window manager, drag/resize/minimize/maximize (Track 1B)
- Start Menu functionality (Track 1C)
- Desktop icon double-click action (Track 1B)
- Window buttons in taskbar (Track 1B)
- Mobile Safe Mode (Track 4A)
- Nano Stores state management (Track 1B)
