# Track: Revamp Astro Testing

## Overview

Revamp the project's Vitest configuration and test suite to align with the official [Astro Testing Guide](https://docs.astro.build/en/guides/testing/). This involves switching to Astro's `getViteConfig()` helper, adopting the Container API for testing `.astro` components, and replacing source-file/fs-based tests with proper component rendering tests.

## Type

Chore

## Functional Requirements

### 1. Vitest Configuration (`vitest.config.ts`)

- Replace `defineConfig` from `vitest/config` with `getViteConfig` from `astro/config`.
- The helper loads the existing `astro.config.mjs` settings into the test environment.
- Preserve all existing Vitest options: `include` pattern (`tests/**/*.test.ts`, `tests/**/*.test.tsx`), `jsdom` environment, `setupFiles`, and `coverage` thresholds (80%).
- No additional Astro config overrides needed.

### 2. Astro Container API Integration

- Enable testing of `.astro` components by rendering them to strings via `experimental_AstroContainer`.
- No additional packages required — `astro/container` is built into Astro 6.x.

### 3. Test Migration — DesktopIcon (`tests/desktop-icon.test.ts`)

- **Replace** the existing `fs.readFileSync` / `existsSync` checks with Container API rendering tests.
- Render `<DesktopIcon />` and assert:
  - Component renders successfully (non-null output).
  - Output contains correct data attributes (`data-window-id`, `data-window-label`).
  - Output contains SVG or icon markup.
  - Props `icon`, `label`, `windowId` are properly reflected in rendered HTML.

### 4. Test Migration — Wallpaper (`tests/wallpaper.test.ts`)

- **Replace** the existing `fs.readFileSync` / `existsSync` checks with Container API rendering tests.
- Render `<Wallpaper />` and assert:
  - Component renders successfully.
  - Output contains SVG rolling hills art (e.g., `viewBox`, SVG elements).
  - Output references full-viewport CSS classes (`w-screen`, `h-screen`).
  - Optional `imageSrc` prop is accepted and rendered when provided.

### 5. Test Migration — Page Integration (`tests/pages/index.test.ts`)

- **Replace** the existing `dist/` file-read approach with Container API rendering of the index page.
- Render the Astro page and assert:
  - Correct `<title>` tag.
  - All mount point IDs present (`#wallpaper-area`, `#desktop-icons`, `#taskbar`).
  - Desktop icons rendered with correct labels.
  - Viewport meta tag present.
  - Taskbar with Start button rendered.

### 6. Tests Left Unchanged

- `tests/clock.test.tsx` — React component, already uses @testing-library/react with jsdom.
- `tests/taskbar.test.tsx` — React component, same as above.
- `tests/xp-theme.test.ts` — CSS token verification, not component-related.
- `tests/directory-structure.test.ts` — Filesystem structure verification.
- `tests/check-modularity.test.ts` — Script integration test.
- `tests/setup.ts` — Test setup (jest-dom matchers), no changes needed.

## Non-Functional Requirements

- All existing React component tests (`taskbar`, `clock`) must continue passing.
- Coverage threshold remains at 80%.
- Test directory structure (`tests/`) remains unchanged.

## Acceptance Criteria

1. `vitest.config.ts` uses `getViteConfig()` from `astro/config`.
2. `tests/desktop-icon.test.ts` renders via Container API (no `fs.readFileSync`).
3. `tests/wallpaper.test.ts` renders via Container API (no `fs.readFileSync`).
4. `tests/pages/index.test.ts` renders via Container API (no `dist/` read).
5. All existing React/CSS tests continue passing.
6. `CI=true pnpm test` passes with no errors.
7. `CI=true pnpm test:coverage` meets 80% threshold.

## Out of Scope

- Moving tests out of `tests/` directory (colocation).
- Adding Playwright/Cypress end-to-end tests.
- Adding test coverage for stores, lib, or other untested modules.
- Changing Astro config or adding new integrations.
