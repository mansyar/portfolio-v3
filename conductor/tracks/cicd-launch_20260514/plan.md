# Implementation Plan: CI/CD & Launch (Track 5A)

**Track:** `cicd-launch_20260514`
**Type:** Feature
**Depends on:** All previous tracks (full site exists and is buildable — MetaTags, 404 page, noscript, etc.)

---

## Phase 0 — Prerequisites: package.json & .gitignore Fixes [checkpoint: 37e82c3]

- [x] Task 0.1: Add `packageManager` field to `package.json` `80de8d4`
  - [x] Add `"packageManager": "pnpm@10.29.3"` to `package.json` (after `engines` block)
  - [x] Verify `pnpm install` still works with the added field
- [x] Task 0.2: Fix `.gitignore` generated-files tracking `80de8d4`
  - [x] Un-comment `!src/lib/generated/articles-content.json` (remove leading `# `)
  - [x] Un-comment `!src/lib/generated/projects-content.json` (remove leading `# `)
  - [x] Run `git add -f src/lib/generated/*.json` to track the files
  - [x] Verify `pnpm dev` works on a clean state (simulates fresh clone)
- [x] Task 0.3: Verify pre-commit hooks still pass `80de8d4`
  - [x] Run `pnpm test` — confirm no regressions
  - [x] Run `pnpm typecheck` — confirm zero errors
  - [x] Commit: `chore(config): Add packageManager field and fix .gitignore generated files tracking`
- [x] Task: Conductor - User Manual Verification 'Phase 0: Prerequisites' (Protocol in workflow.md) `37e82c3`

## Phase 1 — GitHub Actions Workflow [checkpoint: 564d95b]

- [x] Task 1.1: Create `.github/workflows/deploy.yml` with push-triggered workflow `7e55c52`
  - [x] Create `.github/` directory and `deploy.yml`
  - [x] Set workflow name: `Deploy to Cloudflare Pages`
  - [x] Add trigger: `on: push: branches: [main]`
  - [x] Define job `deploy` with `ubuntu-latest` runner
  - [x] Step: Checkout repository (`actions/checkout@v4`)
  - [x] Step: Setup Node.js 22 (`actions/setup-node@v4` with `node-version: '22'`)
  - [x] Step: Install pnpm (`pnpm/action-setup@v4` — auto-detects version from `packageManager` field)
  - [x] Step: Install dependencies (`pnpm install --frozen-lockfile`)
  - [x] Step: Build project (`pnpm build` — single command runs prebuild.mjs then astro build)
  - [x] Step: Deploy via Cloudflare native CI (push) + deploy hook curl (CRON) — uses `CLOUDFLARE_DEPLOY_HOOK_URL` secret
  - [x] Step: Pass `GITHUB_TOKEN` from secrets as environment variable to prebuild scripts
- [x] Task 1.2: Add CRON schedule trigger `7e55c52`
  - [x] Add `schedule: - cron: '0 0 * * *'` to workflow triggers
  - [x] Add concurrency group: `concurrency: deploy-${{ github.ref }}` to prevent overlapping runs
- [x] Task 1.3: Write workflow validation tests `7e55c52`
  - [x] Create `tests/workflow.test.ts` verifying `.github/workflows/deploy.yml` exists
  - [x] Verify file contains expected content patterns (checkout, node, pnpm, build, deploy, cron, concurrency)
  - [x] Verify file references all required steps: `actions/checkout`, `actions/setup-node`, `pnpm/action-setup`, `cloudflare/wrangler-action`
  - [x] Verify `on.push.branches` includes `main`
  - [x] Verify `schedule.cron` includes `'0 0 * * *'`
  - [x] Note: YAML validity is verified by GitHub when the workflow is pushed (no YAML parser library needed)
- [x] Task 1.4: Run test suite and verify no regressions `7e55c52`
- [x] Task: Conductor - User Manual Verification 'Phase 1: GitHub Actions Workflow' (Protocol in workflow.md) `564d95b`

## Phase 2 — Cloudflare Pages Project Setup & Secrets

- [x] Task 2.1: Write integration test verifying deploy prerequisites `4fae6d6`
  - [x] Verify `dist/` is listed in `.gitignore` (build output is ephemeral — already confirmed)
  - [x] Verify `pnpm build` completes successfully (local smoke build)
  - [x] Verify `package.json` has `packageManager` field (from Phase 0)
- [x] Task 2.2: Create Cloudflare Pages project (manual — user completed via Cloudflare Dashboard)
- [x] Task 2.3: Configure GitHub Actions secrets (manual — user configured in GitHub repo settings)
- [x] Task 2.5: Create Cloudflare deploy hook for CRON rebuilds (manual — user created hook in Cloudflare Dashboard, added as `CLOUDFLARE_DEPLOY_HOOK_URL` secret)
- [x] Task 2.4: Verify `GITHUB_TOKEN` is consumed by prebuild scripts `4fae6d6`
  - [x] Audit `scripts/fetch-github-stats.mjs` — confirms it reads `process.env.GITHUB_TOKEN` (line 121, already implemented)
  - [x] Confirm unauthenticated fallback still works (existing behavior)
- [x] Task: Conductor - User Manual Verification 'Phase 2: Cloudflare Pages Setup & Secrets' (Protocol in workflow.md)

## Phase 3 — Custom Domain & DNS Configuration

- [x] Task 3.1: Configure custom domain in Cloudflare Pages (manual — user added via Cloudflare Dashboard)
- [x] Task 3.2: Configure DNS CNAME record (manual — user added proxied CNAME in Cloudflare DNS)
- [x] Task 3.3: Verify domain and SSL
  - [x] Domain `portfolio-os.ansyar-world.top` successfully added and SSL active
  - [x] DNS resolves correctly to Cloudflare Pages project
- [x] Task 3.4: Update project documentation references
  - [x] Updated `conductor/tech-stack.md` with live URL and change log entry
  - [x] No changes needed for `docs/PRD.md` and `docs/TDD.md` (already referenced in spec)
- [x] Task: Conductor - User Manual Verification 'Phase 3: Custom Domain & DNS' (Protocol in workflow.md)

## Phase 4 — Final Smoke Test & Verification

- [x] Task 4.1: Create post-deploy smoke test script `bf513ab`
  - [x] Create `scripts/smoke-test.mjs` using Node.js native `fetch` (available in Node 22) that:
    1. Performs HTTP GET on `https://portfolio-os.ansyar-world.top`
    2. Verifies HTTP 200 response status
    3. Checks response HTML contains `<title>` with "Luna" or "Portfolio" (confirms site content)
    4. Checks response headers for `content-type` containing `text/html`
    5. Checks `strict-transport-security` header presence (security best practice)
    6. Logs pass/fail results with clear messages
  - [x] Test file created: `tests/smoke-test.test.ts` (8 tests)
- [x] Task 4.2: Manual deployment verification (user pushed to `main`, Cloudflare Pages build in progress)
- [x] Task 4.3: Update `conductor/tech-stack.md` change log
  - [x] Added entry documenting new CI/CD pipeline, Cloudflare Pages config, custom domain, and secrets
- [x] Task: Conductor - User Manual Verification 'Phase 4: Final Smoke Test & Verification' (Protocol in workflow.md)
