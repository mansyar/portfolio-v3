# Track 6E — Performance Optimization

## Overview

Full performance pass targeting Lighthouse scores, bundle size, and Core Web Vitals. Bundle-splits window apps via `React.lazy()`, applies `React.memo` where beneficial, optimizes font loading with `<link rel="preload">` and `font-display: swap`, keeps the inline SVG wallpaper (zero-network-request), reduces unnecessary re-renders, and establishes a performance baseline for the entire application.

**References:** [ROADMAP_v1.1 §Track 6E](../docs/ROADMAP_v1.1.md#track-6e--performance-optimization) · [PRD §7](../docs/PRD.md#7-success-metrics) · [TDD §14](../docs/TDD.md#14-build--deploy-pipeline)

## Functional Requirements

### FR1: Bundle-split window apps

- Replace static imports in `WindowLayer.tsx` with `React.lazy()` + `<Suspense>`
- Lazy-load: `Explorer`, `CmdPrompt`, `TaskManager`, `KnowledgeBase`, `Pong`, `Minesweeper`, `GameLauncher`
- Show minimal loading fallback (XP-styled spinner or skeleton frame) while each app chunk loads
- Each app's JS chunk must load only when its window first opens

### FR2: Component-level optimizations

- Add `React.memo` to `ExplorerFileList`, `ExplorerBreadcrumb`, `ExplorerDetailPane`, `Clock`
- Verify `TaskManager` CPU cell updates use ref-based DOM writes with no regression
- Audit and remove unnecessary `useCallback`/`useMemo` that add overhead

### FR3: Font optimization

- Add `<link rel="preload">` for Tahoma font in `RootLayout.astro` (woff2 format)
- Ensure `font-display: swap` is set on all `@font-face` declarations
- Verify no FOUT (Flash of Unstyled Text) on initial page load

### FR4: Wallpaper image optimization

- Keep existing inline SVG approach (zero network requests, already optimal)
- Ensure `loading="eager"` and proper rendering priority

### FR5: Build-time optimizations

- Audit `pnpm build` output for duplicate chunks
- Verify `@astrojs/cloudflare` adapter only adds edge runtime code in production (not in test/dev)
- Check CSS bundle size — remove unused Tailwind classes if any

## Non-Functional Requirements

### NFR1: Performance targets

- Total initial JS bundle reduced by at least 40% (measured before/after)
- Total Blocking Time (TBT) < 100ms
- Lighthouse Performance score > 90 (mobile + desktop)

### NFR2: Code quality

- All existing tests must continue to pass (824+ tests)
- All `src/` files must remain under 500 lines
- No regressions in window behavior, drag/resize, animations

### NFR3: Accessibility

- Loading fallbacks must have appropriate ARIA attributes (`aria-busy`, `aria-label`)
- `prefers-reduced-motion: reduce` must disable any loading animations

## Acceptance Criteria

```
✅ Window apps are lazy-loaded — each app's JS chunk loads only when its window first opens
✅ Lazy loading shows a visual loading state (spinner/skeleton) while chunk loads
✅ Total initial JS bundle reduced by at least 40% (measured before/after)
✅ Tahoma font is preloaded with font-display: swap
✅ React.memo applied where beneficial — no unnecessary re-renders
✅ Lighthouse Performance score > 90 (mobile + desktop)
✅ Total Blocking Time (TBT) < 100ms
✅ All existing 824+ tests continue to pass
✅ All src/ files under 500 lines
✅ Wallpaper remains inline SVG (zero network request)
✅ Performance CI is manual (before/after recording, no auto-CI)
✅ prefers-reduced-motion disables loading animations
```

## Out of Scope

- Image compression/conversion for project thumbnails or icons
- Service Worker or caching strategy changes
- Code splitting beyond window apps (no route-based splitting for SPA)
- Lighthouse CI or automated performance regression tracking in CI
- Converting wallpaper from inline SVG to bitmap formats
