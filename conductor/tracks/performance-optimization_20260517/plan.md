# Track 6E — Performance Optimization

## Phase 1 — Performance Baseline & Measurement

- [ ] Task: Record pre-optimization Lighthouse score (mobile + desktop)
  - [ ] Run Lighthouse on production URL or local production build
  - [ ] Record TBT, LCP, CLS, Performance score
- [ ] Task: Record pre-optimization bundle size breakdown
  - [ ] Run `pnpm build` and inspect `dist/` output
  - [ ] Record total JS bundle size (gzipped), per-chunk sizes
  - [ ] Note which chunks are largest (window apps)
  - [ ] Run bundle visualization (`npx vite-bundle-visualizer` or inspect `dist/` manually) to identify biggest modules
- [ ] Task: Conductor — User Manual Verification "Performance Baseline" (Protocol in workflow.md)

## Phase 2 — Bundle-Split Window Apps

- [ ] Task: Write tests for lazy loading behavior
  - [ ] Write test verifying `React.lazy()` components are lazy (not eagerly imported)
  - [ ] Write test verifying Suspense fallback renders during loading
  - [ ] Write test verifying each app chunk loads on first window open
- [ ] Task: Implement React.lazy() + Suspense in WindowLayer.tsx
  - [ ] Replace static imports of `Explorer`, `CmdPrompt`, `TaskManager`, `KnowledgeBase`, `Pong`, `Minesweeper`, `GameLauncher` with `React.lazy()`
  - [ ] Use named-export wrapper pattern for each: `React.lazy(() => import('./Explorer').then(m => ({ default: m.Explorer })))` — no component files need `export default` added
  - [ ] Wrap each lazy component in `<Suspense>` with loading fallback
  - [ ] Create an XP-styled loading fallback component (skeleton frame matching window chrome)
  - [ ] Ensure each app's chunk loads only when its window first opens
- [ ] Task: Add aria attributes to loading fallbacks
  - [ ] Add `aria-busy="true"` on loading containers
  - [ ] Add `aria-label` describing what is loading (e.g., "Loading Command Prompt")
  - [ ] Ensure `prefers-reduced-motion: reduce` disables any loading animations
- [ ] Task: Conductor — User Manual Verification "Bundle-Split Window Apps" (Protocol in workflow.md)

## Phase 3 — Component-Level Optimizations

- [ ] Task: Prerequisite — Stabilize Explorer callback props for React.memo
  - [ ] Wrap `handleUp` in `Explorer.tsx` with `useCallback` (currently a regular function)
  - [ ] Wrap `handleFolderNavigate` in `Explorer.tsx` with `useCallback`
  - [ ] Verify all callback props passed to `ExplorerFileList` and `ExplorerBreadcrumb` have stable references
- [ ] Task: Write tests for memoized components
  - [ ] Write test verifying `React.memo` wrapped components exist
  - [ ] Write test confirming re-render behavior is correct (stable props don't trigger re-render)
- [ ] Task: Add React.memo to targeted components
  - [ ] Wrap `ExplorerFileList` with `React.memo`
  - [ ] Wrap `ExplorerBreadcrumb` with `React.memo`
  - [ ] Wrap `ExplorerDetailPane` with `React.memo`
  - [ ] **Clock excluded** — trivial component (25 lines, zero props), memo overhead outweighs benefit
- [ ] Task: Audit and remove unnecessary useCallback/useMemo
  - [ ] Review all components for redundant memoization wrappers
  - [ ] Remove `useCallback`/`useMemo` that add overhead without benefit
  - [ ] Verify `TaskManager` CPU cell updates use ref-based DOM writes (no regression)
- [ ] Task: Conductor — User Manual Verification "Component-Level Optimizations" (Protocol in workflow.md)

## Phase 4 — Font & Wallpaper Optimization

> **Note:** This phase and Phase 5 have no code dependencies on Phase 2 or 3 — they can run in parallel.

- [ ] Task: Verify font-display: swap is correctly configured (already implemented)
  - [ ] Confirm `@font-face` in `src/styles/xp-theme.css` already has `font-display: swap` on both Tahoma declarations
  - [ ] Confirm Tahoma uses `src: local('Tahoma')` — no downloadable woff2 file, no preload link needed
  - [ ] Verify no FOUT on initial page load (font stack falls back gracefully on non-Windows systems)
- [ ] Task: Verify Wallpaper is optimally delivered
  - [ ] Confirm inline SVG has zero network request (already inlined in HTML)
  - [ ] Confirm Wallpaper renders immediately in the critical rendering path
- [ ] Task: Fix PRD documentation to match implementation
  - [ ] Update `PRD.md §3.1`: Change incorrect "Bliss.webp (Optimized AVIF/WebP)" to "Inline SVG (CSS gradient + SVG clouds/hills — zero network request)"
  - [ ] Update `PRD.md §7`: Adjust "Production build < 5s" to a realistic estimate (~10-15s with prebuild pipeline)
- [ ] Task: Conductor — User Manual Verification "Font & Wallpaper Optimization" (Protocol in workflow.md)

## Phase 5 — Build-Time Optimizations

> **Note:** This phase has no code dependencies on Phase 2 or 3 — it can run in parallel with them.

- [ ] Task: Audit production build output
  - [ ] Run `pnpm build` and inspect `dist/` for duplicate chunks
  - [ ] Run bundle visualization (`npx vite-bundle-visualizer` or inspect chunk contents manually)
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
  - [ ] Run bundle visualization to confirm code splitting is effective
- [ ] Task: Write bundle size regression test
  - [ ] Write a test that reads built asset sizes from `dist/` (requires `pnpm build` before test run)
  - [ ] Assert initial JS bundle meets target thresholds after optimization
- [ ] Task: Run full test suite and verify no regressions
  - [ ] Run `CI=true pnpm test` — all 824+ tests must pass
  - [ ] Run `pnpm build` — must succeed with zero errors
  - [ ] Verify all `src/` files remain under 500 lines
- [ ] Task: Update documentation
  - [ ] Update `PRD.md §3.1` — fix "Bliss.webp (Optimized AVIF/WebP)" to describe actual inline SVG wallpaper
  - [ ] Update `PRD.md §7` — confirm TBT < 100ms and Lighthouse > 90 targets; adjust "build time < 5s" to realistic ~10-15s
  - [ ] Update `TDD.md §14` — add bundle-splitting strategy and lazy loading architecture
  - [ ] Update `conductor/product.md` — ensure wallpaper description matches inline SVG implementation
  - [ ] Update `conductor/tech-stack.md` — add Track 6E change log entry
- [ ] Task: Conductor — User Manual Verification "Performance Verification & Documentation" (Protocol in workflow.md)
