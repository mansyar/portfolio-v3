# Spec: Track 1A — Desktop Shell

## Overview

The first visual track: transform the blank XP-blue page into a recognizable Windows XP Luna desktop. This track delivers a custom SVG-inspired wallpaper, 5 desktop icons with hover effects, and a static taskbar with Start button and live clock. Window management comes in Track 1B — here icons are visual placeholders only.

## Technical Context

- **Framework:** Astro 6 with React 19 islands
- **Styling:** Tailwind CSS v4 with XP theme tokens (`xp-theme.css`, `global.css`)
- **Rendering:** Wallpaper & DesktopIcon = Astro (zero JS); Taskbar & Clock = React (`client:load`)
- **Icons:** Custom SVG files in `public/icons/`
- **Wallpaper:** Custom SVG/CSS-generated art inspired by XP "Bliss" (not the copyrighted photo)

## Functional Requirements

### 1. Wallpaper (`Wallpaper.astro`)

- Custom SVG/CSS-generated wallpaper inspired by the XP "Bliss" rolling hills aesthetic
- Full-viewport coverage, responsive
- Rendered below all other elements (z-index: 0)
- Uses the existing `#wallpaper-area` mount point in `index.astro`

### 2. Desktop Icons (`DesktopIcon.astro`)

- 5 icons: My Computer, My Documents, Help & Support, Command Prompt, Recycle Bin
- Each icon: 48×48px SVG icon + 11px label below it
- Left-aligned vertical column starting at top-left (16px from edge)
- XP-style hover: blue selection highlight background
- No click action yet (window manager comes in Track 1B)
- Text color: white with dark shadow for readability on any wallpaper

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
- Uses existing `--xp-taskbar-bg`, `--xp-blue-taskbar` CSS tokens
- Green "Start" button on the left (non-functional for this track)
- 3D outset border on top edge (`.xp-outset` class)
- System tray area on the right
- Uses existing `#taskbar` mount point in `index.astro`

### 5. Clock (`Clock.tsx`, React, inside Taskbar)

- Displays current time in HH:MM format, updating every minute
- Lives in the system tray area of the taskbar
- XP-style alignment and font size (11px)

## Acceptance Criteria

```
✅ Desktop shows custom Bliss-style wallpaper filling the full viewport
✅ 5 desktop icons render in a left-aligned vertical column (top-left)
✅ Icons show XP-style blue selection highlight on hover
✅ Taskbar spans full width at bottom with blue gradient and outset top border
✅ Green Start button visible on taskbar left (non-functional)
✅ Live clock in system tray showing current time
✅ Clock updates every minute (no seconds)
✅ All icons are custom SVGs in public/icons/
✅ Zero-JS for wallpaper and icons (Astro static components)
✅ Taskbar and Clock are React islands with client:load
✅ Looks authentically XP at a glance
```

## Out of Scope

- Window manager, drag/resize/minimize/maximize (Track 1B)
- Start Menu functionality (Track 1C)
- Desktop icon double-click action (Track 1B)
- Window buttons in taskbar (Track 1B)
- Mobile Safe Mode (Track 4A)
- Nano Stores state management (Track 1B)
