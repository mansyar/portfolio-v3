# Specification: Window Manager

## Overview

Implement the core Nano Stores-driven window management system for the Luna OS Desktop. This track delivers the complete window chrome — draggable, resizable, minimizable/maximizable windows with z-index stacking and focus management. All 6 window types (Explorer, My Documents, Help & Support, Command Prompt, Task Manager, Recycle Bin) are registered with placeholder content, ready to be filled in by later tracks.

## References

- [ROADMAP.md — Track 1B](../../docs/ROADMAP.md)
- [TDD §3 — Window Manager Specification](../../docs/TDD.md#3-window-manager-specification)
- [TDD §5.3 — Classic 3D Border System](../../docs/TDD.md#53-classic-3d-border-system)
- [TDD §6 — React Islands (WindowLayer, WindowFrame, TitleBar)](../../docs/TDD.md#6-component-inventory)
- [TDD §9 — Animations & Transitions](../../docs/TDD.md#9-animations--transitions)

## Architecture Decisions

- **6 window types** registered with store entries and placeholder "Coming Soon" content
- **DesktopIcon → Window wiring**: Keep DesktopIcon as Astro static with `onclick` attribute + custom event bus (`window.dispatchEvent(new CustomEvent('luna:open-window', { detail: id }))`). WindowLayer React island listens via `useEffect`.
- **Minimize animation**: CSS `translateY` slide-down toward taskbar + opacity fade, 200ms ease-out
- **State management**: Nano Stores (`$windows` map, `$zCounter` atom, `$activeWindow` atom)

## Functional Requirements

### FR1 — Window Store (Nano Stores)

- Create `src/stores/windows.ts` with:
  - `$windows` — `map<Record<WindowId, WindowState>>` tracking position, size, z-index, status
  - `$zCounter` — `atom<number>` starting at 100, increments on focus
  - `$activeWindow` — `atom<WindowId | null>`
  - `$taskbarWindows` — derived store: windows with status !== undefined
- Interface `WindowState` includes: `id`, `title`, `icon`, `x`, `y`, `width`, `height`, `minWidth`, `minHeight`, `zIndex`, `status` (open/minimized/maximized)

### FR2 — Window Actions

- `openWindow(id)` — set status='open', increment zCounter, assign zIndex
- `closeWindow(id)` — remove from $windows
- `minimizeWindow(id)` — set status='minimized', cache current position
- `maximizeWindow(id)` — set status='maximized', cache prev position/size
- `restoreWindow(id)` — restore from maximized/minimized to cached position
- `focusWindow(id)` — increment zCounter, assign new zIndex, set $activeWindow
- `moveWindow(id, x, y)` — update position (viewport-constrained, min 32px visible)
- `resizeWindow(id, w, h)` — update size (respects minWidth/minHeight)

### FR3 — Window Chrome (React)

- **WindowLayer.tsx**: Iterates `$windows`, renders `WindowFrame` for each. Mounted with `client:load`.
- **WindowFrame.tsx**: 3D chrome border (`xp-window-border`), rounded top corners (8px), shadow (`--xp-shadow-lg`), contains TitleBar + content area
- **TitleBar.tsx**: Active/inactive gradient, app icon, title text, min/max/close button trio with XP-style 16×16 icons
- **Content area**: Placeholder text per window type ("Command Prompt — Coming Soon in Track 2B")

### FR4 — Drag (Title Bar Only)

- `mousedown` on title bar initiates drag
- `mousemove` updates window position (delta-based)
- `mouseup` ends drag
- Viewport-constrained: minimum 32px of any edge must remain visible
- Only `onmousedown` on the title bar element triggers drag (not content area)

### FR5 — Edge/Corner Resize

- 8px hit area around window borders and corners
- Cursors: `n-resize`, `s-resize`, `e-resize`, `w-resize`, `ne-resize`, `nw-resize`, `se-resize`, `sw-resize`
- Respects `minWidth`/`minHeight` per window config (from TDD §3.2)
- Task Manager: 400×450 min; Command Prompt: 450×250 min; Explorer: 400×300 min; etc.

### FR6 — Z-Index & Focus

- Click anywhere inside a window → `focusWindow()`
- Focused window gets `$activeWindow` set
- zIndex increments globally via `$zCounter`
- Focused title bar shows active gradient; others show inactive gradient
- Visual shadow depth: focused window has `--xp-shadow-lg`, others `--xp-shadow-sm`

### FR7 — Minimize/Maximize/Restore

- **Minimize**: Slide-down CSS transition (translateY toward taskbar + opacity 0→1) over 200ms, then status='minimized' (hidden)
- **Maximize**: Fills viewport minus taskbar height (40px), caches previous position/size
- **Restore**: Returns to cached position/size with CSS transition
- Double-click title bar toggles maximize/restore

### FR8 — Desktop Icon Wiring

- Add `onclick` attribute to `DesktopIcon.astro` that dispatches `CustomEvent('luna:open-window', { detail: windowId })`
- `WindowLayer.tsx` registers document-level event listener in `useEffect` to receive events
- Double-click opens the corresponding window via `openWindow()`

### FR9 — Taskbar Window Buttons

- Update `Taskbar.tsx` to subscribe to `$taskbarWindows` derived store
- Render a button for each open window showing the app icon and title
- Taskbar toggle behavior:
  - Click focused window → minimize
  - Click minimized window → restore + focus
  - Click unfocused window → focus

### FR10 — Mounting

- Mount `WindowLayer` as `<WindowLayer client:load />` in `DesktopLayout.astro` inside a `#window-layer` container (z-index layer between desktop icons and taskbar)

## Non-Functional Requirements

- **Performance**: Window manager JS bundle must remain under 50KB gzipped
- **Zero-JS for icons**: Desktop icons remain Astro static (zero JS payload), wiring via custom events
- **Pure CSS animations**: No JS animation libraries; use CSS transitions/transforms
- **State consistency**: No stale window states; all mutations go through Nano Store actions

## Default Window Configurations

| Window ID   | Title          | Default Size | Default Position | Min Size |
| ----------- | -------------- | ------------ | ---------------- | -------- |
| explorer    | My Computer    | 700×500      | (80, 60)         | 400×300  |
| mydocs      | My Documents   | 600×450      | (120, 80)        | 350×250  |
| help        | Help & Support | 750×550      | (60, 40)         | 500×400  |
| cmd         | Command Prompt | 680×420      | (100, 100)       | 450×250  |
| taskmanager | Task Manager   | 500×550      | (200, 60)        | 400×450  |
| recyclebin  | Recycle Bin    | 550×400      | (150, 90)        | 350×250  |

## Acceptance Criteria

```
✅ $windows store correctly tracks position, size, z-index, and status for all 6 window types
✅ Double-clicking a desktop icon opens the corresponding window with placeholder content
✅ Windows can be dragged by title bar (viewport-constrained, min 32px visible)
✅ Windows can be resized from edges/corners (8px hit area, respects minWidth/minHeight)
✅ Clicking a window brings it to front (z-index increments, active title bar gradient)
✅ Min/max/close buttons work with correct XP-style transitions
✅ Minimize slides window toward taskbar (CSS 200ms ease-out)
✅ Maximize fills viewport minus 40px taskbar height
✅ Taskbar shows buttons for all open windows with icons
✅ Taskbar toggle: click focused → minimize, click minimized → restore, click unfocused → focus
✅ Multiple windows can be open simultaneously without state conflicts
✅ All 6 window types render with correct default sizes and positions
✅ All tests pass with >80% coverage for store and component logic
```

## Out of Scope

- Window content (Explorer, CMD, Task Manager functionality) — handled in Tracks 2A–2D
- Start Menu — Track 1C
- URL state persistence — Track 3B
- Keyboard navigation / focus management — Track 4B
