# Track 6E — Performance Optimization

## Phase 1 — Performance Baseline & Measurement

- [ ] Task: Record pre-optimization Lighthouse score (mobile + desktop)
  - [ ] Run Lighthouse on production URL or local production build
  - [ ] Record TBT, LCP, CLS, Performance score
- [ ] Task: Record pre-optimization bundle size breakdown
  - [ ] Run `pnpm build` and inspect `dist/` output
  - [ ] Record total JS bundle size (gzipped), per-chunk sizes
  - [ ] Note which chunks are largest (window apps)
- [ ] Task: Create a lightweight test to verify JS bundle size doesn't regress
  - [ ] Write a test that reads built asset sizes from `dist/`
  - [ ] Assert initial JS bundle meets target thresholds after optimization
- [ ] Task: Conductor — User Manual Verification "Performance Baseline" (Protocol in workflow.md)

## Phase 2 — Bundle-Split Window Apps

- [ ] Task: Write tests for lazy loading behavior
  - [ ] Write test verifying `React.lazy()` components are lazy (not eagerly imported)
  - [ ] Write test verifying Suspense fallback renders during loading
  - [ ] Write test verifying each app chunk loads on first window open
- [ ] Task: Implement React.lazy() + Suspense in WindowLayer.tsx
  - [ ] Replace static imports of `Explorer`, `CmdPrompt`, `TaskManager`, `KnowledgeBase`, `Pong`, `Minesweeper`, `GameLauncher` with `React.lazy()`
  - [ ] Wrap each lazy component in `<Suspense>` with loading fallback
  - [ ] Create an XP-styled loading fallback component (skeleton frame matching window chrome)
  - [ ] Ensure each app's chunk loads only when its window first opens
- [ ] Task: Add aria attributes to loading fallbacks
  - [ ] Add `aria-busy="true"` on loading containers
  - [ ] Add `aria-label` describing what is loading (e.g., "Loading Command Prompt")
  - [ ] Ensure `prefers-reduced-motion: reduce` disables any loading animations
- [ ] Task: Conductor — User Manual Verification "Bundle-Split Window Apps" (Protocol in workflow.md)

## Phase 3 — Component-Level Optimizations

- [ ] Task: Write tests for memoized components
  - [ ] Write test verifying `React.memo` wrapped components exist
  - [ ] Write test confirming re-render behavior is correct (props change triggers re-render)
  - [ ] Write test for Clock component that it renders correctly with memo
- [ ] Task: Add React.memo to targeted components
  - [ ] Wrap `ExplorerFileList` with `React.memo`
  - [ ] Wrap `ExplorerBreadcrumb` with `React.memo`
  - [ ] Wrap `ExplorerDetailPane` with `React.memo`
  - [ ] Wrap `Clock` with `React.memo`
- [ ] Task: Audit and remove unnecessary useCallback/useMemo
  - [ ] Review all components for redundant memoization wrappers
  - [ ] Remove `useCallback`/`useMemo` that add overhead without benefit
  - [ ] Verify `TaskManager` CPU cell updates use ref-based DOM writes (no regression)
- [ ] Task: Conductor — User Manual Verification "Component-Level Optimizations" (Protocol in workflow.md)

## Phase 4 — Font & Wallpaper Optimization

- [ ] Task: Verify font-display: swap is present on all @font-face declarations
  - [ ] Check `src/styles/global.css` and `xp-theme.css` for `@font-face` rules
  - [ ] Ensure `font-display: swap` is set on Tahoma declaration
- [ ] Task: Add font preload link to RootLayout.astro
  - [ ] Add `<link rel="preload">` for Tahoma woff2 font
  - [ ] Set `as="font"`, `type="font/woff2"`, `crossorigin` attributes
- [ ] Task: Verify Wallpaper is optimally delivered
  - [ ] Confirm inline SVG has `loading="eager"` and no network request
  - [ ] Confirm Wallpaper is in the critical rendering path (zero delay)
- [ ] Task: Write test verifying font preload link exists
  - [ ] Assert `<link rel="preload">` for Tahoma font is in the document head
  - [ ] Assert correct attributes (`as`, `type`, `crossorigin`)
- [ ] Task: Conductor — User Manual Verification "Font & Wallpaper Optimization" (Protocol in workflow.md)

## Phase 5 — Build-Time Optimizations

- [ ] Task: Audit production build output
  - [ ] Run `pnpm build` and inspect `dist/` for duplicate chunks
  - [ ] Verify code splitting is working (separate chunks for each lazy-loaded app)
  - [ ] Verify no unintended duplication of React or Nano Stores across chunks
- [ ] Task: Verify @astrojs/cloudflare adapter behavior
  - [ ] Confirm adapter is not loaded during test/dev (already skipped via VITEST env check)
  - [ ] Verify production build includes adapter (not in dev mode)
- [ ] Task: Check and optimize CSS bundle size
  - [ ] Inspect CSS output for unused Tailwind classes
  - [ ] Remove any unused custom styles
- [ ] Task: Conductor — User Manual Verification "Build-Time Optimizations" (Protocol in workflow.md)

## Phase 6 — Performance Verification & Documentation

- [ ] Task: Record post-optimization Lighthouse score (mobile + desktop)
  - [ ] Run Lighthouse again after all optimizations
  - [ ] Compare before/after: TBT, LCP, CLS, Performance score
- [ ] Task: Record post-optimization bundle size breakdown
  - [ ] Inspect `dist/` output after optimizations
  - [ ] Compute total initial JS bundle reduction (target ≥40%)
  - [ ] Compare before/after per-chunk sizes
- [ ] Task: Run full test suite and verify no regressions
  - [ ] Run `CI=true pnpm test` — all 824+ tests must pass
  - [ ] Run `pnpm build` — must succeed with zero errors
  - [ ] Verify all `src/` files remain under 500 lines
- [ ] Task: Update documentation
  - [ ] Update `PRD.md §7` — confirm or tighten TBT < 100ms and Lighthouse > 90 targets
  - [ ] Update `TDD.md §14` — add bundle-splitting strategy and lazy loading architecture
  - [ ] Update `conductor/tech-stack.md` — add Track 6E change log entry
- [ ] Task: Conductor — User Manual Verification "Performance Verification & Documentation" (Protocol in workflow.md)
