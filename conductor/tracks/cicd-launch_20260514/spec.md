# Specification: Track 5A — CI/CD & Launch

**Track:** `cicd-launch_20260514`
**Type:** Feature
**Description:** GitHub Actions CI/CD pipeline with CRON-triggered daily rebuilds, Cloudflare Pages deployment, custom domain setup with SSL, and environment secrets management.

**Depends on:** All previous tracks (full site exists and is buildable)

**Refs:** [PRD §6](../docs/PRD.md#6-devops--deployment-strategy) · [TDD §14](../docs/TDD.md#14-build--deploy-pipeline) · [ROADMAP §Track 5A](../docs/ROADMAP.md#track-5a--cicd--launch)

---

## Overview

Establish a fully automated CI/CD pipeline using GitHub Actions and Cloudflare Pages. Every push to `main` triggers a production build and deploy via a single `cloudflare/wrangler-action@v3` step. A daily CRON job (00:00 UTC) refreshes GitHub API data. The site is served via a custom domain (`os-portfolio.ansyar-world.top`) with automatic SSL. Three environment secrets are configured: `GITHUB_TOKEN` (GitHub API auth), `CLOUDFLARE_API_TOKEN` (Wrangler deploy auth), and `CLOUDFLARE_ACCOUNT_ID` (Cloudflare account identifier).

## Architecture Decisions

- **GitHub Actions workflow** lives in `.github/workflows/deploy.yml`. Single workflow handles both push-triggered and CRON-triggered builds.
- **Cloudflare Pages** as deployment target (free tier). Initial setup requires manual Cloudflare dashboard steps (creating the Pages project, adding the custom domain).
- **Deployment via wrangler-action:** The workflow uses `cloudflare/wrangler-action@v3` for deployment — NOT the Cloudflare Pages native GitHub integration. This keeps deployment logic consolidated in a single GitHub Actions workflow (consistent with TDD §14 diagram).
- **Build command:** `pnpm build` — single command that invokes `prebuild.mjs` then `astro build`. No duplicate prebuild execution.
- **Deploy trigger:** Push to `main` OR scheduled CRON (`0 0 * * *`).
- **Environment secrets:** `GITHUB_TOKEN`, `CLOUDFLARE_API_TOKEN`, and `CLOUDFLARE_ACCOUNT_ID` stored as GitHub Actions repository secrets.
- **Prerequisites before workflow creation:**
  1. Add `"packageManager": "pnpm@10.29.3"` to `package.json` for `pnpm/action-setup@v4` compatibility.
  2. Un-comment the `.gitignore` un-exception lines for `projects-content.json` and `articles-content.json` (currently commented out, breaking the TDD §14 dev mode guarantee).
- **No staging environment** — `main` branch deploys to production directly. The existing pre-push hooks (typecheck + coverage ≥ 80%) act as the quality gate.
- **SSL** is automatic via Cloudflare's universal SSL (no manual certificate management).

## Functional Requirements

### FR1 — GitHub Actions Workflow

- Create `.github/workflows/deploy.yml` with:
  - **Workflow name:** `Deploy to Cloudflare Pages`
  - **Triggers:** `push` on `main` branch + `schedule` at `0 0 * * *` (daily 00:00 UTC)
  - **Concurrency guard:** `concurrency: deploy-${{ github.ref }}` to prevent overlapping runs
  - **Steps:**
    1. Checkout repository (`actions/checkout@v4`)
    2. Setup Node.js 22 (`actions/setup-node@v4` with `node-version: '22'`)
    3. Install pnpm (`pnpm/action-setup@v4`)
    4. Install dependencies: `pnpm install --frozen-lockfile`
    5. Build: `pnpm build` (single command runs prebuild → astro build)
    6. Deploy to Cloudflare Pages: `cloudflare/wrangler-action@v3` with `apiToken`, `accountId`, and `command: pages deploy dist --project-name=luna-os-portfolio`
  - **Environment:** `GITHUB_TOKEN` injected from Actions secrets for authenticated GitHub API calls

### FR2 — Cloudflare Pages Project Setup

- Create a new Cloudflare Pages project via the Cloudflare Dashboard
  - Navigate to Cloudflare Dashboard → Pages → Create a project → Connect Git
  - Select the GitHub repository
  - (Since deployment is handled by wrangler-action in CI, the build settings in the dashboard are not critical; the initial connection establishes the Pages project)
- Note the auto-generated `.pages.dev` URL after creation (needed for CNAME in FR3)
- Add `GITHUB_TOKEN` environment variable in Cloudflare Pages project settings

### FR3 — Custom Domain & SSL

- After Cloudflare Pages project is created (FR2), add `os-portfolio.ansyar-world.top` as a custom domain in the Cloudflare Pages dashboard
- Configure DNS via Hostinger's DNS panel:
  - Add CNAME record: `os-portfolio` → `<your-cloudflare-pages-project>.pages.dev`
- Wait for automatic SSL certificate provisioning by Cloudflare (~1-5 minutes)
- Verify certificate is active via the browser lock icon

### FR4 — Environment Secrets (GitHub Actions)

Three secrets must be configured in the GitHub repository (Settings → Secrets and variables → Actions):

- `GITHUB_TOKEN` — GitHub Personal Access Token (classic, with `repo` scope) for authenticated API requests during `fetch-github-stats.mjs`. Falls back to unauthenticated (60 req/hr) if not set.
- `CLOUDFLARE_API_TOKEN` — Cloudflare API token with `Cloudflare Pages: Edit` permission for wrangler deploys.
- `CLOUDFLARE_ACCOUNT_ID` — Cloudflare account ID (found in Cloudflare Dashboard → My Profile → API Tokens).

## Non-Functional Requirements

- **Build time:** Complete build + deploy must finish in under 60 seconds
- **Deploy latency:** Site should be live within 2 minutes of a push to `main`
- **Idempotency:** Running the workflow multiple times must produce the same result
- **Error resilience:** If `fetch-github-stats.mjs` fails, build continues with cached data (existing behavior preserved)

## Acceptance Criteria

```
✅ Push to main triggers automatic GitHub Actions workflow
✅ Workflow runs: pnpm install → pnpm build → wrangler deploy to Cloudflare Pages
✅ CRON job triggers daily build at 00:00 UTC to refresh GitHub data
✅ Site is live at os-portfolio.ansyar-world.top with valid SSL certificate
✅ GITHUB_TOKEN, CLOUDFLARE_API_TOKEN, and CLOUDFLARE_ACCOUNT_ID secrets are configured
✅ Build completes in under 60 seconds
✅ Site is live within 2 minutes of push to main
✅ CNAME record for os-portfolio subdomain correctly points to Cloudflare Pages
✅ Dev mode works on fresh clone without a build (generated files tracked in git)
```

## Out of Scope

- Staging/preview deployments (separate branch/deploy previews)
- Rollback automation (manual rollback via Cloudflare dashboard)
- Performance monitoring or uptime alerting
- Custom error page configuration on Cloudflare
- Domain migration from Hostinger nameservers to Cloudflare (DNS remains at Hostinger; only CNAME record is added)
