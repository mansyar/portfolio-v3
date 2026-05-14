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

- [x] Task 2.1: Write failing tests for 404 page (Red phase) ✓ (Cannot find 404.astro)
  - [x] Test that 404.astro renders BSOD-style blue background
  - [x] Test that page shows "STOP: 0x000000FE (PORTFOLIO_NOT_FOUND)" error code
  - [x] Test that "Press any key to restart" link points to `/`
  - [x] Test that the restart link is keyboard-accessible
- [x] Task 2.2: Implement 404.astro (Green phase) ✓ (9 tests passing, pure Astro/HTML/CSS zero JS)
  - [x] Create `src/pages/404.astro` with BSOD styling
  - [x] Blue background, white monospace text, BSOD error header
  - [x] Technical body text mimicking real BSOD
  - [x] "Press any key to restart" link → `/`
  - [x] Fake memory dump progress indicator (CSS-only)
  - [x] Ensure WCAG AA color contrast compliance
- [x] Task 2.3: Verify coverage and commit [768cb84]
  - [x] Run coverage — verify no regressions (87.99% statements, all thresholds met)
  - [x] Commit: `feat(ui): Add 404 BSOD page`
- [ ] Task: Conductor - User Manual Verification 'Phase 2: 404 BSOD Page' (Protocol in workflow.md)

---

## Phase 3 — Asset Audit

- [x] Task 3.1: Audit wallpaper pipeline ✓ (9 tests all passing — inline SVG, no bitmap files)
- [x] Task 3.2: Audit font pipeline ✓ (local() references, font-display: swap, no woff2 files)
- [x] Task 3.3: Audit icon pipeline ✓ (all SVG format, no non-SVG files)
- [x] Task 3.4: Document audit findings ✓ (asset pipeline already optimal, no conversions needed)
- [x] Task 3.5: Verify coverage and commit [a7806e1]
  - [x] Run coverage — verify no regressions (628 tests, 46 files passing)
  - [x] Commit: `feat(seo): Add noscript fallback and asset audit`
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Asset Audit' (Protocol in workflow.md)

---

## Phase 4 — `<noscript>` Fallback

- [x] Task 4.1: Write failing tests for noscript fallback (Red phase) ✓ (4 tests all fail without noscript block)
- [x] Task 4.2: Implement noscript fallback (Green phase) ✓ (4 tests passing)
- [x] Task 4.3: Verify coverage and commit [a7806e1]
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Noscript Fallback' (Protocol in workflow.md)

---

## Phase 5 — Lighthouse Audit & Performance Tuning

- [x] Task 5.1: Run production build and audit
  - [x] Build completed in 4.48s (under 60s budget)
  - [x] 2 pages built: /index.html, /404.html
  - [x] 404 page renders BSOD correctly with STOP: 0x000000FE
- [x] Task 5.2: Address audit findings
  - [x] Added `apple-touch-icon` link to head (favicon.svg)
  - [x] font-display: swap verified on all @font-face declarations
  - [x] favicon.svg properly referenced in RootLayout.astro
- [x] Task 5.3: Verify coverage and commit [571c19a]
  - [x] 628 tests passing, 46 test files, all coverage thresholds met
- [~] Task: Conductor - User Manual Verification 'Phase 5: Lighthouse Audit' (Protocol in workflow.md)
  - [ ] Manual: Run `pnpm build && pnpm preview` then run Lighthouse in Chrome DevTools
  - [ ] Manual: Verify Performance score > 90, TBT < 100ms
  - [ ] Manual: Navigate to /nonexistent-page to verify 404 BSOD page

---

## Phase: Review Fixes

- [x] Task: Apply review suggestions [bd4d801]
  - [x] Removed dead CSS (`.bsod-error-code`, `.filled`) from 404.astro
