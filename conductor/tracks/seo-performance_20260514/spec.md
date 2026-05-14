# Specification: Track 4C — SEO & Performance

**Track:** `seo-performance_20260514`
**Type:** Feature
**Description:** Meta tags, Open Graph, structured data, 404 BSOD page, asset optimization, Lighthouse performance tuning, and noscript fallback.

**Depends on:** All previous tracks (full site exists)

---

## Overview

Implement comprehensive SEO, performance optimization, and error handling for the Luna OS Portfolio. This track creates a reusable `MetaTags.astro` component with Open Graph and structured data, generates a Windows XP BSOD-themed 404 page, optimizes the asset pipeline (WebP/AVIF images, font subsetting), adds a `<noscript>` fallback for JS-disabled users, and audits the site to achieve a Lighthouse Performance score > 90 with TBT < 100ms.

**Refs:** [ROADMAP §Track 4C](../../docs/ROADMAP.md) · [TDD §11](../../docs/TDD.md#11-error-states) · [TDD §12](../../docs/TDD.md#12-seo--meta-strategy) · [PRD §6](../../docs/PRD.md#6-devops--deployment-strategy) · [PRD §7](../../docs/PRD.md#7-success-metrics)

---

## Architecture Decisions

- **MetaTags is an Astro component** (zero JS) that injects `<title>`, `<meta>`, `<script type="application/ld+json">`, and Open Graph tags into `<head>`.
- **404 page** is a standalone Astro page (`src/pages/404.astro`) styled as a Windows XP BSOD using existing XP design tokens. The "restart" link navigates to `/`.
- **og-preview.png** is a hand-crafted static image placed at `/public/og-preview.png`. The user will provide it; this track only sets up the meta tag reference.
- **Font subsetting** is done via a build-time script or manual subsetting of Tahoma woff2 files to Latin-only character ranges.
- **Asset optimization** focuses on converting any non-WebP/AVIF images in `/public/wallpapers/` to modern formats. Icons remain SVG (already optimal).
- **`<noscript>` fallback** is server-rendered HTML in `index.astro`, listing all project links so search engines and JS-disabled users can access content.
- **Lighthouse audit** is a manual verification step — no CI pipeline change in this track.

---

## Functional Requirements

### FR1 — MetaTags.astro Component

- Create `src/components/desktop/MetaTags.astro` with the following props:
  - `title: string` — page title
  - `description: string` — meta description
  - `ogImage?: string` — OG image path (defaults to `/og-preview.png`)
- Component renders into `<head>`:
  - `<title>` with the portfolio brand title
  - `<meta name="description">`
  - Open Graph tags: `og:title`, `og:description`, `og:image`, `og:type="website"`
  - `<script type="application/ld+json">` with Person schema (
    `@context: "https://schema.org"`, `@type: "Person"`, `name: "Muhammad Ansyar Rafi Putra"`, `jobTitle: "Software Engineer"`, `url: "https://mansyar.dev"`)
- Mount `MetaTags` in `RootLayout.astro` with proper props

### FR2 — 404 BSOD Page

- Create `src/pages/404.astro` styled as a Windows XP Blue Screen of Death
- Visual elements:
  - Blue background (`#0000aa` or `#00007f` — matching classic BSOD)
  - White monospace text (Courier New / Lucida Console)
  - BSOD header: \*\*\* STOP: 0x000000FE (PORTFOLIO_NOT_FOUND)
  - Technical-sounding body text mimicking real BSOD messages
  - A "Press any key to restart" link pointing to `/`
  - Fake memory dump progress indicator (visual-only, static)
- Use existing XP theme tokens where applicable
- No JS required — pure Astro/CSS

### FR3 — Asset Optimization

- Convert any non-optimized images in `/public/wallpapers/` to WebP format (or verify they already are)
- Subset Tahoma font files in `/public/fonts/` to Latin-only characters to reduce font file size
- No changes to SVG icons (already optimal)

### FR4 — `<noscript>` Fallback

- In `src/pages/index.astro`, add a `<noscript>` block listing all portfolio projects as plain HTML links
- Each link: project title → `https://github.com/mansyar/<repo>` (or a placeholder URL)
- Styled with basic fallback CSS so the list is readable when JS is disabled

### FR5 — Lighthouse Audit

- Run Lighthouse in Chrome DevTools on the production build (`pnpm build && pnpm preview`)
- Target metrics:
  - Lighthouse Performance score > 90
  - Total Blocking Time (TBT) < 100ms
  - All images properly sized and using modern formats
- Document any findings that require code changes

---

## Non-Functional Requirements

- **Zero-JS for MetaTags, 404 page, and noscript** — all three are pure Astro/HTML/CSS
- **No new npm dependencies** — all features use built-in Astro capabilities or existing dependencies
- **SEO compliance**: Crawlable by search engines, proper meta tags, structured data for rich snippets
- **Accessibility**: 404 page must pass WCAG AA color contrast (white text on blue), the restart link must be keyboard-accessible
- **Performance**: Font subsetting must not regress existing performance

---

## Acceptance Criteria

```
✅ MetaTags.astro renders title, description, OG tags, and JSON-LD structured data in <head>
✅ OG image meta tag points to /og-preview.png
✅ 404 page shows a styled Windows XP BSOD with STOP: 0x000000FE error code
✅ "Press any key to restart" link on 404 page navigates to /
✅ All images use modern formats (WebP/AVIF)
✅ Tahoma fonts are subset to Latin-only characters
✅ <noscript> fallback lists all projects as plain HTML links
✅ Lighthouse Performance score > 90
✅ TBT < 100ms
✅ No new npm dependencies
✅ All existing tests continue to pass
✅ All src/ files remain under 500 lines
```

---

## Out of Scope

- CRON-triggered builds (Track 5A)
- Cloudflare Pages configuration (Track 5A)
- Custom domain setup (Track 5A)
- CI/CD pipeline (Track 5A)
- Dynamic OG image generation script
- Sitemap generation
