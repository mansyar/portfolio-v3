# Implementation Plan: Revamp Astro Testing

## Phase 1: Vitest Configuration Migration [checkpoint: 45d5a37]

- [x] Task 1.1: Update `vitest.config.ts` to use `getViteConfig()` (7363146)
  - [ ] Replace `import { defineConfig } from 'vitest/config'` with `import { getViteConfig } from 'astro/config'`
  - [ ] Add `/// <reference types="vitest/config" />` triple-slash directive
  - [ ] Replace `defineConfig({ test: {...} })` with `getViteConfig({ test: {...} })`
  - [ ] Verify all existing options (`include`, `environment`, `setupFiles`, `coverage`) are preserved
- [x] Task 1.2: Validate configuration works with existing test suite
  - [x] Run `CI=true pnpm test` — verify no regressions in unchanged tests (xp-theme, directory-structure, check-modularity, clock, taskbar)
- [x] Task: Conductor - User Manual Verification 'Phase 1: Configuration Migration' (Protocol in workflow.md) (45d5a37)

## Phase 2: DesktopIcon Test — Container API Migration [checkpoint: f5d47d3]

- [x] Task 2.1: Rewrite `tests/desktop-icon.test.ts` using Container API (Red Phase) (18f1b07)
  - [x] Remove `fs.readFileSync` / `existsSync` imports and usage
  - [x] Add `experimental_AstroContainer` from `astro/container`
  - [x] Write new tests: render `<DesktopIcon />`, assert `data-window-id`, `data-window-label`, icon markup, and prop reflection
  - [x] Run the file in isolation to confirm tests fail initially due to any import/resolution issues
- [x] Task 2.2: Verify new tests pass (Green Phase) (18f1b07)
  - [x] Fix any import or rendering issues (added `@vitest-environment node`)
  - [x] Run `CI=true pnpm test -- tests/desktop-icon.test.ts` — verify all tests pass
- [x] Task: Conductor - User Manual Verification 'Phase 2: DesktopIcon Migration' (Protocol in workflow.md) (f5d47d3)

## Phase 3: Wallpaper Test — Container API Migration [checkpoint: 940cfcc]

- [x] Task 3.1: Rewrite `tests/wallpaper.test.ts` using Container API (Red Phase) (c37c87e)
  - [x] Remove `fs.readFileSync` / `existsSync` imports and usage
  - [x] Add `experimental_AstroContainer` from `astro/container`
  - [x] Write new tests: render `<Wallpaper />`, assert SVG art (`viewBox`, SVG elements), full-viewport classes, optional `imageSrc` prop
  - [x] Run in isolation to confirm initial state
- [x] Task 3.2: Verify new tests pass (Green Phase) (c37c87e)
  - [x] Fix any import or rendering issues
  - [x] Run `CI=true pnpm test -- tests/wallpaper.test.ts` — verify all tests pass
- [x] Task: Conductor - User Manual Verification 'Phase 3: Wallpaper Migration' (Protocol in workflow.md) (940cfcc)

## Phase 4: Page Integration Test — Container API Migration [checkpoint: 62f7f2c]

- [x] Task 4.1: Rewrite `tests/pages/index.test.ts` using Container API (Red Phase) (a79c738)
  - [x] Remove `fs.readFileSync`, `resolve`, `dirname` imports related to dist/ reading
  - [x] Add `experimental_AstroContainer` from `astro/container`
  - [x] Write new tests: render the home page (Content layer), assert `<title>`, mount point IDs, desktop icon labels, viewport meta, taskbar
  - [x] Run in isolation to confirm initial state (required @vitest-environment node)
- [x] Task 4.2: Verify new tests pass (Green Phase) (a79c738)
  - [x] Fix any import or rendering issues (added manual React SSR renderer for client:load components)
  - [x] Run `CI=true pnpm test -- tests/pages/index.test.ts` — verify all tests pass
- [x] Task: Conductor - User Manual Verification 'Phase 4: Page Integration Migration' (Protocol in workflow.md) (62f7f2c)

## Phase 5: Final Verification & Checkpoint

- [x] Task 5.1: Run full test suite and verify coverage
  - [x] Run `CI=true pnpm test` — all tests must pass (8/8 files, 58/58 tests)
  - [x] Run `CI=true pnpm test:coverage` — all thresholds ≥80% (100% on all source files)
- [x] Task 5.2: Verify all acceptance criteria from spec
  - [x] vitest.config.ts uses getViteConfig() ✔️
  - [x] No fs.readFileSync in desktop-icon, wallpaper, or page tests
  - [x] All React/CSS tests continue passing
  - [x] All tests pass cleanly
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Final Verification' (Protocol in workflow.md)

## Phase: Review Fixes

- [x] Task: Apply review suggestions (385d4cf)
