# Implementation Plan: SEO & Performance (Track 4C)

**Track:** `seo-performance_20260514`
**Type:** Feature
**Depends on:** All previous tracks (full site exists — desktop shell, window manager, all apps, safe mode, accessibility)

---

## Phase 1 — MetaTags.astro Component & Structured Data

- [ ] Task 1.1: Write failing tests for MetaTags.astro (Red phase)
  - [ ] Test that MetaTags renders `<title>` with correct content
  - [ ] Test that MetaTags renders `<meta name="description">` with correct content
  - [ ] Test that MetaTags renders Open Graph tags (og:title, og:description, og:image, og:type)
  - [ ] Test that MetaTags renders JSON-LD structured data with Person schema
  - [ ] Test that `ogImage` prop defaults to `/og-preview.png`
  - [ ] Test that custom `ogImage` prop overrides the default
- [ ] Task 1.2: Implement MetaTags.astro (Green phase)
  - [ ] Create `src/components/desktop/MetaTags.astro` with `title`, `description`, and optional `ogImage` props
  - [ ] Render `<title>`, `<meta name="description">`, OG meta tags, and `<script type="application/ld+json">`
  - [ ] Structured data: Person schema with name, jobTitle, and url
- [ ] Task 1.3: Wire MetaTags into RootLayout.astro
  - [ ] Import and mount `<MetaTags />` in RootLayout.astro with appropriate props
  - [ ] Verify all existing pages inherit correct meta tags
- [ ] Task 1.4: Verify coverage and commit
  - [ ] Run `CI=true pnpm test:coverage` — verify no regressions
  - [ ] Commit: `feat(seo): Add MetaTags.astro with OG and structured data`
- [ ] Task: Conductor - User Manual Verification 'Phase 1: MetaTags & Structured Data' (Protocol in workflow.md)

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

## Phase 3 — Asset Optimization

- [ ] Task 3.1: Audit existing assets
  - [ ] Check all images in `/public/wallpapers/` for modern format compliance (WebP/AVIF)
  - [ ] Check Tahoma font files in `/public/fonts/` for current size
  - [ ] Write tests verifying image format compliance
  - [ ] Write tests verifying font subset status (check file size thresholds)
- [ ] Task 3.2: Optimize images
  - [ ] Convert any non-WebP images to WebP format
  - [ ] Verify existing bliss wallpaper is already in optimal format
- [ ] Task 3.3: Subset Tahoma fonts
  - [ ] Create `scripts/subset-fonts.mjs` or use manual subsetting approach
  - [ ] Subset Tahoma woff2 files to Latin-only character range
  - [ ] Verify font files are smaller after subsetting
- [ ] Task 3.4: Verify coverage and commit
  - [ ] Run `CI=true pnpm test:coverage` — verify no regressions
  - [ ] Commit: `chore(assets): Optimize images and subset fonts`
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Asset Optimization' (Protocol in workflow.md)

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
- [ ] Task 5.3: Re-run Lighthouse to verify targets met
  - [ ] Target: Performance score > 90
  - [ ] Target: TBT < 100ms
  - [ ] Document final scores in plan.md
- [ ] Task 5.4: Verify coverage and commit
  - [ ] Run `CI=true pnpm test:coverage` — verify no regressions
  - [ ] Commit: `chore(perf): Lighthouse audit and performance tuning`
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Lighthouse Audit' (Protocol in workflow.md)
