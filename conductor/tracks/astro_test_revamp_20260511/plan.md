# Implementation Plan: Revamp Astro Testing

## Phase 1: Vitest Configuration Migration

- [x] Task 1.1: Update `vitest.config.ts` to use `getViteConfig()` (7363146)
  - [ ] Replace `import { defineConfig } from 'vitest/config'` with `import { getViteConfig } from 'astro/config'`
  - [ ] Add `/// <reference types="vitest/config" />` triple-slash directive
  - [ ] Replace `defineConfig({ test: {...} })` with `getViteConfig({ test: {...} })`
  - [ ] Verify all existing options (`include`, `environment`, `setupFiles`, `coverage`) are preserved
- [ ] Task 1.2: Validate configuration works with existing test suite
  - [ ] Run `CI=true pnpm test` — verify no regressions in unchanged tests (xp-theme, directory-structure, check-modularity, clock, taskbar)
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Configuration Migration' (Protocol in workflow.md)

## Phase 2: DesktopIcon Test — Container API Migration

- [ ] Task 2.1: Rewrite `tests/desktop-icon.test.ts` using Container API (Red Phase)
  - [ ] Remove `fs.readFileSync` / `existsSync` imports and usage
  - [ ] Add `experimental_AstroContainer` from `astro/container`
  - [ ] Write new tests: render `<DesktopIcon />`, assert `data-window-id`, `data-window-label`, icon markup, and prop reflection
  - [ ] Run the file in isolation to confirm tests fail initially due to any import/resolution issues
- [ ] Task 2.2: Verify new tests pass (Green Phase)
  - [ ] Fix any import or rendering issues
  - [ ] Run `CI=true pnpm test -- tests/desktop-icon.test.ts` — verify all tests pass
- [ ] Task: Conductor - User Manual Verification 'Phase 2: DesktopIcon Migration' (Protocol in workflow.md)

## Phase 3: Wallpaper Test — Container API Migration

- [ ] Task 3.1: Rewrite `tests/wallpaper.test.ts` using Container API (Red Phase)
  - [ ] Remove `fs.readFileSync` / `existsSync` imports and usage
  - [ ] Add `experimental_AstroContainer` from `astro/container`
  - [ ] Write new tests: render `<Wallpaper />`, assert SVG art (`viewBox`, SVG elements), full-viewport classes, optional `imageSrc` prop
  - [ ] Run in isolation to confirm initial state
- [ ] Task 3.2: Verify new tests pass (Green Phase)
  - [ ] Fix any import or rendering issues
  - [ ] Run `CI=true pnpm test -- tests/wallpaper.test.ts` — verify all tests pass
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Wallpaper Migration' (Protocol in workflow.md)

## Phase 4: Page Integration Test — Container API Migration

- [ ] Task 4.1: Rewrite `tests/pages/index.test.ts` using Container API (Red Phase)
  - [ ] Remove `fs.readFileSync`, `resolve`, `dirname` imports related to dist/ reading
  - [ ] Add `experimental_AstroContainer` from `astro/container`
  - [ ] Write new tests: render the home page (Content layer), assert `<title>`, mount point IDs, desktop icon labels, viewport meta, taskbar
  - [ ] Run in isolation to confirm initial state
- [ ] Task 4.2: Verify new tests pass (Green Phase)
  - [ ] Fix any import or rendering issues (e.g., adjusting for `slot` requirements)
  - [ ] Run `CI=true pnpm test -- tests/pages/index.test.ts` — verify all tests pass
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Page Integration Migration' (Protocol in workflow.md)

## Phase 5: Final Verification & Checkpoint

- [ ] Task 5.1: Run full test suite and verify coverage
  - [ ] Run `CI=true pnpm test` — all tests must pass
  - [ ] Run `CI=true pnpm test:coverage` — all thresholds ≥80%
- [ ] Task 5.2: Verify all acceptance criteria from spec
  - [ ] vitest.config.ts uses getViteConfig() ✔️
  - [ ] No fs.readFileSync in desktop-icon, wallpaper, or page tests
  - [ ] All React/CSS tests continue passing
  - [ ] All tests pass cleanly
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Final Verification' (Protocol in workflow.md)
