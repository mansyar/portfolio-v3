# Specification: Track 5A — CI/CD & Launch

**Track:** `cicd-launch_20260514`
**Type:** Feature
**Description:** GitHub Actions CI/CD pipeline with CRON-triggered daily rebuilds, Cloudflare Pages deployment, custom domain setup with SSL, and environment secrets management.

**Depends on:** All previous tracks (full site exists and is buildable)

**Refs:** [PRD §6](../docs/PRD.md#6-devops--deployment-strategy) · [TDD §14](../docs/TDD.md#14-build--deploy-pipeline) · [ROADMAP §Track 5A](../docs/ROADMAP.md#track-5a--cicd--launch)

---

## Overview

Establish a fully automated CI/CD pipeline using GitHub Actions and Cloudflare Pages. Every push to `main` triggers a production build and deploy. A daily CRON job (00:00 UTC) refreshes GitHub API data. The site is served via a custom domain (`os-portfolio.ansyar-world.top`) with automatic SSL. Environment secrets (`GITHUB_TOKEN`, `CLOUDFLARE_API_TOKEN`) are configured for authenticated API access at build time.

## Architecture Decisions

- **GitHub Actions workflow** lives in `.github/workflows/deploy.yml`. Single workflow handles both push-triggered and CRON-triggered builds.
- **Cloudflare Pages** as deployment target (free tier). Initial setup requires manual Cloudflare dashboard steps (connecting GitHub repo, adding custom domain).
- **Build command:** `node scripts/prebuild.mjs && astro build` — identical to existing local build.
- **Deploy trigger:** Push to `main` OR scheduled CRON (`0 0 * * *`).
- **Environment secrets:** `GITHUB_TOKEN` stored as a GitHub Actions secret for authenticated API calls during `fetch-github-stats.mjs`. `CLOUDFLARE_API_TOKEN` stored as a Cloudflare Pages secret (or set via wrangler).
- **No staging environment** — `main` branch deploys to production directly. The existing pre-push hooks (typecheck + coverage ≥ 80%) act as the quality gate.
- **SSL** is automatic via Cloudflare's universal SSL (no manual certificate management).

## Functional Requirements

### FR1 — GitHub Actions Workflow

- Create `.github/workflows/deploy.yml` with:
  - Triggers: `push` on `main` branch + `schedule` at `0 0 * * *` (daily 00:00 UTC)
  - Steps:
    1. Checkout repository
    2. Setup Node.js (>= 22.12.0, matching `package.json` engines field)
    3. Install dependencies: `pnpm install`
    4. Run prebuild: `node scripts/prebuild.mjs` (fetches GitHub data, compiles content, generates filesystem)
    5. Build Astro: `npx astro build`
    6. Deploy to Cloudflare Pages (via Cloudflare Pages GitHub integration or `wrangler` CLI)
  - Environment: `GITHUB_TOKEN` injected from Actions secrets

### FR2 — Cloudflare Pages Setup

- Connect the GitHub repository to Cloudflare Pages via the Cloudflare Dashboard
- Configure build settings:
  - Build command: `node scripts/prebuild.mjs && npx astro build`
  - Build output directory: `dist`
  - Root directory: `/`
- Set environment variable `GITHUB_TOKEN` in Cloudflare Pages (for build-time API calls)

### FR3 — Custom Domain & SSL

- Add `os-portfolio.ansyar-world.top` as a custom domain in Cloudflare Pages
- Configure DNS: Point the subdomain `os-portfolio` to Cloudflare via a CNAME record (managed through Hostinger's DNS panel)
- Verify automatic SSL certificate provisioning by Cloudflare

### FR4 — Environment Secrets

- `GITHUB_TOKEN` — GitHub Personal Access Token stored as a GitHub Actions secret (`GITHUB_TOKEN`) for authenticated API requests during builds
- `CLOUDFLARE_API_TOKEN` — Cloudflare API token (if using wrangler for deployment, otherwise the native GitHub integration handles auth)

## Non-Functional Requirements

- **Build time:** Complete build + deploy must finish in under 60 seconds
- **Deploy latency:** Site should be live within 2 minutes of a push to `main`
- **Idempotency:** Running the workflow multiple times must produce the same result
- **Error resilience:** If `fetch-github-stats.mjs` fails, build continues with cached data (existing behavior preserved)

## Acceptance Criteria

```
✅ Push to main triggers automatic GitHub Actions workflow
✅ Workflow runs: pnpm install → prebuild.mjs → astro build → deploy to Cloudflare Pages
✅ CRON job triggers daily build at 00:00 UTC to refresh GitHub data
✅ Site is live at os-portfolio.ansyar-world.top with valid SSL certificate
✅ GITHUB_TOKEN secret is used for authenticated API calls during prebuild
✅ Build completes in under 60 seconds
✅ Site is live within 2 minutes of push to main
✅ CNAME record for os-portfolio subdomain correctly points to Cloudflare Pages
```

## Out of Scope

- Staging/preview deployments (separate branch/deploy previews)
- Rollback automation (manual rollback via Cloudflare dashboard)
- Performance monitoring or uptime alerting
- Custom error page configuration on Cloudflare
- Domain migration from Hostinger nameservers to Cloudflare (DNS remains at Hostinger; only CNAME record is added)
