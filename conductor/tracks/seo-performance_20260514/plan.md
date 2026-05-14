# Implementation Plan: SEO & Performance (Track 4C)

**Track:** `seo-performance_20260514`
**Type:** Feature
**Depends on:** All previous tracks (full site exists — desktop shell, window manager, all apps, safe mode, accessibility)

---

## Phase 1 — MetaTags.astro Component & Structured Data

- [x] Task 1.1: Write failing tests for MetaTags.astro (Red phase) ✓ (tests confirmed failing: "Cannot find package MetaTags.astro")
  - [x] Test that MetaTags renders `<title>` with correct content
  - [x] Test that MetaTags renders `<meta name="description">` with correct content
  - [x] Test that MetaTags renders Open Graph tags (og:title, og:description, og:image, og:type)
  - [x] Test that MetaTags renders JSON-LD structured data with Person schema
  - [x] Test that `ogImage` prop defaults to `/og-preview.png`
  - [x] Test that custom `ogImage` prop overrides the default
- [x] Task 1.2: Implement MetaTags.astro (Green phase) ✓ (9 tests passing)
- [x] Task 1.3: Wire MetaTags into RootLayout.astro ✓ (replaces inline title and description)
- [x] Task 1.4: Verify existing page title test still passes ✓ (index.test.ts passes with 606 tests)
- [x] Task 1.5: Update tech-stack.md ✓ (change log entry added)
- [x] Task 1.6: Verify coverage and commit [b6409fe]
  - [x] Run `pnpm test:coverage` — verify no regressions (87.98% statements, all thresholds met)
  - [x] Commit: `feat(seo): Add MetaTags.astro with OG and structured data`
- [x] Task: Conductor - User Manual Verification 'Phase 1: MetaTags & Structured Data' [checkpoint: c042edc]

---

## Phase 2 — 404 BSOD Page

- [ ] Task 2.1: Write failing tests for 404 page (Red phase)
  - [ ] Test that 404.astro renders BSOD-style blue background
  - [ ] Test that page shows "STOP: 0x000000FE (PORTFOLIO_NOT_FOUND)" error code
  - [ ] Test that "Press any key to restart" link points to `/`
  - [ ] Test that the restart link is keyboard-accessible
- [ ] Task 2.2: Implement 404.astro (Green phase)
  - [ ] Create `src/pages/404.astro` with BSOD styling
  - [ ] Blue background, white monospace text, BSOD error header
  - [ ] Technical body text mimicking real BSOD
  - [ ] "Press any key to restart" link → `/`
  - [ ] Fake memory dump progress indicator (CSS-only)
  - [ ] Ensure WCAG AA color contrast compliance
- [ ] Task 2.3: Verify coverage and commit
  - [ ] Run `CI=true pnpm test:coverage` — verify no regressions
  - [ ] Commit: `feat(ui): Add 404 BSOD page`
- [ ] Task: Conductor - User Manual Verification 'Phase 2: 404 BSOD Page' (Protocol in workflow.md)

---

## Phase 3 — Asset Audit

- [ ] Task 3.1: Audit wallpaper pipeline (Red phase)
  - [ ] Write tests confirming `Wallpaper.astro` renders as inline SVG (no external image URL dependency)
  - [ ] Write tests confirming `/public/wallpapers/` contains no bitmap files (only `.gitkeep`)
  - [ ] Verify wallpaper is already zero-JS and zero-external-requests
- [ ] Task 3.2: Audit font pipeline (Red phase)
  - [ ] Write tests confirming `@font-face` declarations use `local('Tahoma')` (no woff2 file dependency)
  - [ ] Write tests confirming `font-display: swap` is set on all @font-face rules
  - [ ] Write tests confirming `/public/fonts/` contains no woff2 files (only `.gitkeep`)
- [ ] Task 3.3: Audit icon pipeline (Red phase)
  - [ ] Write tests confirming all icons in `/public/icons/` are SVG format (already optimal)
- [ ] Task 3.4: Document audit findings (Green phase)
  - [ ] Add comment in `xp-theme.css` noting font loading strategy (system `local()` reference)
  - [ ] Add comment in `Wallpaper.astro` noting zero-bitmap approach
  - [ ] All tests pass, confirming the asset pipeline is already optimal with no conversions needed
- [ ] Task 3.5: Verify coverage and commit
  - [ ] Run `CI=true pnpm test:coverage` — verify no regressions
  - [ ] Commit: `chore(assets): Audit asset pipeline — wallpaper is inline SVG, fonts use local() reference`
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Asset Audit' (Protocol in workflow.md)

---

## Phase 4 — `<noscript>` Fallback

- [ ] Task 4.1: Write failing tests for noscript fallback (Red phase)
  - [ ] Test that `index.astro` renders a `<noscript>` block
  - [ ] Test that the noscript block contains links to all projects
  - [ ] Test that links use correct GitHub repository URLs
- [ ] Task 4.2: Implement noscript fallback (Green phase)
  - [ ] Add `<noscript>` block to `src/pages/index.astro`
  - [ ] List all projects with title and GitHub link
  - [ ] Add basic fallback CSS for readability without JS
- [ ] Task 4.3: Verify coverage and commit
  - [ ] Run `CI=true pnpm test:coverage` — verify no regressions
  - [ ] Commit: `feat(seo): Add noscript fallback listing projects`
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Noscript Fallback' (Protocol in workflow.md)

---

## Phase 5 — Lighthouse Audit & Performance Tuning

- [ ] Task 5.1: Run production build and audit
  - [ ] Execute `pnpm build && pnpm preview`
  - [ ] Run Lighthouse in Chrome DevTools on the preview server
  - [ ] Record baseline scores (Performance, Accessibility, SEO, Best Practices)
  - [ ] Identify any failing audits (TBT, image optimization, render-blocking resources, etc.)
- [ ] Task 5.2: Address audit findings
  - [ ] Fix any performance regressions identified
  - [ ] Optimize critical rendering path if needed
  - [ ] Verify font-display: swap is applied to all @font-face declarations
  - [ ] Verify images have explicit width/height to prevent layout shift
  - [ ] Check favicon setup — verify `favicon.svg` is properly referenced, add `apple-touch-icon` if Lighthouse flags it
- [ ] Task 5.3: Re-run Lighthouse to verify targets met
  - [ ] Target: Performance score > 90
  - [ ] Target: TBT < 100ms
  - [ ] Document final scores in plan.md
- [ ] Task 5.4: Verify coverage and commit
  - [ ] Run `CI=true pnpm test:coverage` — verify no regressions
  - [ ] Commit: `chore(perf): Lighthouse audit and performance tuning`
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Lighthouse Audit' (Protocol in workflow.md)
