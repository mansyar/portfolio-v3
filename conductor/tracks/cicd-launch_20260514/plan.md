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

## Phase 1 — GitHub Actions Workflow

- [ ] Task 1.1: Create `.github/workflows/deploy.yml` with push-triggered workflow
  - [ ] Create `.github/` directory and `deploy.yml`
  - [ ] Set workflow name: `Deploy to Cloudflare Pages`
  - [ ] Add trigger: `on: push: branches: [main]`
  - [ ] Define job `deploy` with `ubuntu-latest` runner
  - [ ] Step: Checkout repository (`actions/checkout@v4`)
  - [ ] Step: Setup Node.js 22 (`actions/setup-node@v4` with `node-version: '22'`)
  - [ ] Step: Install pnpm (`pnpm/action-setup@v4` — auto-detects version from `packageManager` field)
  - [ ] Step: Install dependencies (`pnpm install --frozen-lockfile`)
  - [ ] Step: Build project (`pnpm build` — single command runs prebuild.mjs then astro build)
  - [ ] Step: Deploy to Cloudflare Pages (`cloudflare/wrangler-action@v3` with `apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}`, `accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}`, and `command: pages deploy dist --project-name=luna-os-portfolio`)
  - [ ] Step: Pass `GITHUB_TOKEN` from secrets as environment variable to prebuild scripts
- [ ] Task 1.2: Add CRON schedule trigger
  - [ ] Add `schedule: - cron: '0 0 * * *'` to workflow triggers
  - [ ] Add concurrency group: `concurrency: deploy-${{ github.ref }}` to prevent overlapping runs
- [ ] Task 1.3: Write workflow validation tests
  - [ ] Create `tests/workflow.test.ts` verifying `.github/workflows/deploy.yml` exists
  - [ ] Verify file contains expected content patterns (checkout, node, pnpm, build, deploy, cron, concurrency)
  - [ ] Verify file references all required steps: `actions/checkout`, `actions/setup-node`, `pnpm/action-setup`, `cloudflare/wrangler-action`
  - [ ] Verify `on.push.branches` includes `main`
  - [ ] Verify `schedule.cron` includes `'0 0 * * *'`
  - [ ] Note: YAML validity is verified by GitHub when the workflow is pushed (no YAML parser library needed)
- [ ] Task 1.4: Run test suite and verify no regressions
- [ ] Task: Conductor - User Manual Verification 'Phase 1: GitHub Actions Workflow' (Protocol in workflow.md)

## Phase 2 — Cloudflare Pages Project Setup & Secrets

- [ ] Task 2.1: Write integration test verifying deploy prerequisites
  - [ ] Verify `dist/` is listed in `.gitignore` (build output is ephemeral — already confirmed)
  - [ ] Verify `pnpm build` completes successfully (local smoke build)
  - [ ] Verify `package.json` has `packageManager` field (from Phase 0)
- [ ] Task 2.2: Create Cloudflare Pages project (manual — user follows steps)
  - [ ] Document steps in workflow comments or a separate guide:
    1. Go to Cloudflare Dashboard → Pages → Create a project → Connect Git
    2. Select the GitHub repository
    3. Build settings (not critical since wrangler handles this, but set for dashboard reference):
       - Build command: `pnpm build`
       - Build output directory: `dist`
       - Root directory: `/`
    4. Add environment variable `GITHUB_TOKEN` in Cloudflare Pages settings
    5. Deploy and verify initial build succeeds
    6. **Note the auto-generated `.pages.dev` URL** (needed for CNAME in Phase 3)
- [ ] Task 2.3: Configure GitHub Actions secrets
  - [ ] Document steps to add secrets in GitHub repo:
    1. Go to GitHub repo → Settings → Secrets and variables → Actions
    2. Add `CLOUDFLARE_API_TOKEN` — Cloudflare API token with `Cloudflare Pages: Edit` permission
    3. Add `CLOUDFLARE_ACCOUNT_ID` — Cloudflare account ID (Dashboard → My Profile → API Tokens)
    4. Add `GITHUB_TOKEN` — GitHub Personal Access Token (classic, `repo` scope)
- [ ] Task 2.4: Verify `GITHUB_TOKEN` is consumed by prebuild scripts
  - [ ] Audit `scripts/fetch-github-stats.mjs` — confirms it reads `process.env.GITHUB_TOKEN` (line 121, already implemented)
  - [ ] Confirm unauthenticated fallback still works (existing behavior)
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Cloudflare Pages Setup & Secrets' (Protocol in workflow.md)

## Phase 3 — Custom Domain & DNS Configuration

- [ ] Task 3.1: Configure custom domain in Cloudflare Pages
  - [ ] Go to Cloudflare Pages project → Custom domains → Add custom domain
  - [ ] Enter `os-portfolio.ansyar-world.top`
  - [ ] Cloudflare will show the DNS target (the `.pages.dev` URL from Phase 2)
  - [ ] Wait for SSL certificate provisioning (automatic, ~1-5 minutes)
- [ ] Task 3.2: Configure DNS in Hostinger
  - [ ] Log in to Hostinger DNS panel
  - [ ] Add CNAME record:
    - Name: `os-portfolio`
    - Target: `<your-cloudflare-pages-project>.pages.dev` (noted in Phase 2)
    - TTL: `3600` (1 hour) or Auto
- [ ] Task 3.3: Verify domain and SSL
  - [ ] Visit `https://os-portfolio.ansyar-world.top` and confirm SSL lock icon
  - [ ] Verify full site loads correctly through the custom domain
- [ ] Task 3.4: Update project documentation references
  - [ ] Update `conductor/product.md` or `conductor/tech-stack.md` with the live URL
  - [ ] Update `docs/PRD.md` and `docs/TDD.md` URL references if applicable
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Custom Domain & DNS' (Protocol in workflow.md)

## Phase 4 — Final Smoke Test & Verification

- [ ] Task 4.1: Create post-deploy smoke test script
  - [ ] Create `scripts/smoke-test.mjs` using Node.js native `fetch` (available in Node 22) that:
    1. Performs HTTP GET on `https://os-portfolio.ansyar-world.top`
    2. Verifies HTTP 200 response status
    3. Checks response HTML contains `<title>` with "Luna" or "Portfolio" (confirms site content)
    4. Checks response headers for `content-type` containing `text/html`
    5. Checks `strict-transport-security` header presence (security best practice)
    6. Logs pass/fail results with clear messages
  - [ ] Test runs locally: `node scripts/smoke-test.mjs` (manual, after deployment)
- [ ] Task 4.2: Manual deployment verification
  - [ ] Push workflow to `main` branch
  - [ ] Monitor GitHub Actions run in Actions tab
  - [ ] Verify all steps complete successfully (checkout → setup → install → build → deploy)
  - [ ] Visit deployed URL and confirm full site functionality (windows, apps, navigation)
  - [ ] Verify CRON trigger appears in GitHub Actions → `deploy.yml` → schedule section
- [ ] Task 4.3: Update `conductor/tech-stack.md` change log
  - [ ] Add entry documenting new CI/CD pipeline, Cloudflare Pages config, custom domain, and secrets
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Smoke Test & Verification' (Protocol in workflow.md)
