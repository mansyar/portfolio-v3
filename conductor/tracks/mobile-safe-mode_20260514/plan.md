# Implementation Plan: Mobile Safe Mode (Track 4A)

## Phase 1: Safe Mode Foundation & Visuals [checkpoint: 283fab5]

- [x] Task: Define Safe Mode CSS tokens and CRT utility classes (5263688)
  - [x] Add `--safe-mode-*` tokens to `xp-theme.css`
  - [x] Create `.crt-effects` utility with scanlines and curvature
  - [x] Write tests verifying CSS token availability and CRT class structure
- [x] Task: Create `SafeModeShell.astro` layout (fe8cbc1)
  - [x] Implement full-screen black background with green monospace text
  - [x] Add the CRT effect overlay
  - [x] Verify: Component renders a blank green-on-black terminal screen with subtle CRT effects
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Safe Mode Foundation & Visuals' (Protocol in workflow.md)

## Phase 2: BIOS Boot Sequence [checkpoint: a24fec1]

- [x] Task: Implement `BiosBoot.tsx` animation component (e5bf0f5)
  - [x] Define the list of custom branding strings
  - [x] Create a "typewriter" effect component that renders lines sequentially
  - [x] Enforce a 2-second total duration for the animation
- [x] Task: Write tests for BIOS animation (e5bf0f5)
  - [x] Test that lines appear in order
  - [x] Test that animation completes within 2s
  - [x] Test that `prefers-reduced-motion` skips the animation
- [ ] Task: Conductor - User Manual Verification 'Phase 2: BIOS Boot Sequence' (Protocol in workflow.md)

## Phase 3: Terminal Navigation & Input UI [checkpoint: e9bf80c]

- [x] Task: Create `TerminalNav.tsx` component (bd7766d)
  - [x] Define the menu structure: Projects, Knowledge Base, Contact, Desktop Mode, Restart
  - [x] Implement touch-to-select logic
  - [x] Write tests for menu rendering and touch navigation
- [x] Task: Implement Passive Keyboard Listener (bd7766d)
  - [x] Implement a hidden numeric input parser (0-5) to trigger menu actions
  - [x] Ensure the mobile virtual keyboard is NOT forced open automatically
  - [x] Write tests for keyboard navigation
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Terminal Navigation & Input UI' (Protocol in workflow.md)

## Phase 4: Content Rendering & Navigation [checkpoint: 5e76f30]

- [x] Task: Implement Safe Mode Content Views (8edd402)
  - [x] Create rendering logic within `TerminalNav.tsx` (or a sub-component) to display project and article lists
  - [x] Implement detailed view for articles/projects using Monospace HTML
  - [x] Implement `[0] Back` functionality to return to previous menu levels
- [x] Task: Write tests for content views (8edd402)
  - [x] Test navigating into a project and back
  - [x] Test that content is styled with monospace fonts and preserves basic HTML tags
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Content Rendering & Navigation' (Protocol in workflow.md)

## Phase 5: URL State & Sync Sandbox [checkpoint: 451cc81]

- [x] Task: Sync Safe Mode state to URL (2d2e120)
  - [x] Update `url-sync.ts` to handle `?safe=` and `?slug=` parameters
  - [x] Implement a mode-switch guard to ensure Safe Mode URL parsing does not clear Desktop state (e.g., `?w=`, `?path=`)
  - [x] Implement hydration from URL on load
  - [x] Write tests for deep-linking and browser back/forward navigation in Safe Mode
- [ ] Task: Conductor - User Manual Verification 'Phase 5: URL State & Sync Sandbox' (Protocol in workflow.md)

## Phase 6: Final Integration & CSS Toggling

- [ ] Task: Implement CSS Media Query Toggling
  - [ ] Update `index.astro` to mount both `DesktopLayout` and `SafeModeShell`
  - [ ] Use Tailwind classes (e.g., `hidden md:block`, `block md:hidden`) to toggle visibility based on the 768px breakpoint
- [ ] Task: Implement Desktop Override
  - [ ] Create a Nano Store state (e.g., `$forceDesktop`)
  - [ ] Apply a `.force-desktop` class that overrides the media queries when the user selects `[4] Desktop Mode`
- [ ] Task: Final Polish & SEO
  - [ ] Update SEO meta tags to reflect mobile-friendly accessibility
  - [ ] Run Lighthouse audit on mobile and verify TBT < 100ms
- [ ] Task: Conductor - User Manual Verification 'Phase 6: Final Integration & CSS Toggling' (Protocol in workflow.md)
