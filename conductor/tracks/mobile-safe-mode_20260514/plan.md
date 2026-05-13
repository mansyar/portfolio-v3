# Implementation Plan: Mobile Safe Mode (Track 4A)

## Phase 1: Safe Mode Foundation & Visuals

- [ ] Task: Define Safe Mode CSS tokens and CRT utility classes
  - [ ] Add `--safe-mode-*` tokens to `xp-theme.css`
  - [ ] Create `.crt-effects` utility with scanlines and curvature
  - [ ] Write tests verifying CSS token availability and CRT class structure
- [ ] Task: Create `SafeModeShell.astro` layout
  - [ ] Implement full-screen black background with green monospace text
  - [ ] Add the CRT effect overlay
  - [ ] Verify: Page renders a blank green-on-black terminal screen with subtle CRT effects
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Safe Mode Foundation & Visuals' (Protocol in workflow.md)

## Phase 2: BIOS Boot Sequence

- [ ] Task: Implement `BiosBoot.tsx` animation component
  - [ ] Define the list of custom branding strings
  - [ ] Create a "typewriter" effect component that renders lines sequentially
  - [ ] Enforce a 2-second total duration for the animation
- [ ] Task: Write tests for BIOS animation
  - [ ] Test that lines appear in order
  - [ ] Test that animation completes within 2s
  - [ ] Test that `prefers-reduced-motion` skips the animation
- [ ] Task: Conductor - User Manual Verification 'Phase 2: BIOS Boot Sequence' (Protocol in workflow.md)

## Phase 3: Terminal Menu & Input UI

- [ ] Task: Create `TerminalMenu.tsx` component
  - [ ] Define the menu structure: Projects, Knowledge Base, About, Contact, Desktop Mode, Restart
  - [ ] Implement touch-to-select logic
  - [ ] Write tests for menu rendering and touch navigation
- [ ] Task: Implement Persistent `C:\>` Prompt
  - [ ] Create a sticky input at the bottom of the screen
  - [ ] Implement numeric input parsing (1-6) to trigger menu actions
  - [ ] Write tests for keyboard navigation and input parsing
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Terminal Menu & Input UI' (Protocol in workflow.md)

## Phase 4: Content Rendering & Navigation

- [ ] Task: Implement Safe Mode Content Views
  - [ ] Create `SafeModeContent.tsx` to render project and article lists
  - [ ] Implement detailed view for articles/projects using Monospace HTML
  - [ ] Implement `[0] Back` functionality to return to previous menu levels
- [ ] Task: Write tests for content views
  - [ ] Test navigating into a project and back
  - [ ] Test that content is styled with monospace fonts and preserves basic HTML tags
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Content Rendering & Navigation' (Protocol in workflow.md)

## Phase 5: URL State & Sync

- [ ] Task: Sync Safe Mode state to URL
  - [ ] Update `url-sync.ts` to handle `?safe=` and `?slug=` parameters
  - [ ] Implement hydration from URL on mobile load
  - [ ] Write tests for deep-linking and browser back/forward navigation in Safe Mode
- [ ] Task: Conductor - User Manual Verification 'Phase 5: URL State & Sync' (Protocol in workflow.md)

## Phase 6: Final Integration & Conditional Rendering

- [ ] Task: Implement Conditional Viewport Rendering
  - [ ] Update `index.astro` to conditionally render `DesktopLayout` or `SafeModeShell` based on viewport width (< 768px)
  - [ ] Implement "Switch to Desktop Mode" force-override logic
- [ ] Task: Final Polish & SEO
  - [ ] Update SEO meta tags to reflect mobile-friendly accessibility
  - [ ] Run Lighthouse audit on mobile and verify TBT < 100ms
- [ ] Task: Conductor - User Manual Verification 'Phase 6: Final Integration & Polish' (Protocol in workflow.md)
