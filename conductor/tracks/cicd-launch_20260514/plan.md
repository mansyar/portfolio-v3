# Implementation Plan: CI/CD & Launch (Track 5A)

**Track:** `cicd-launch_20260514`
**Type:** Feature
**Depends on:** All previous tracks (full site exists and is buildable — MetaTags, 404 page, noscript, etc.)

---

## Phase 1 — GitHub Actions Workflow

- [ ] Task 1.1: Create `.github/workflows/deploy.yml` with basic push-triggered workflow
  - [ ] Create `.github/workflows/deploy.yml` with `on: push: branches: [main]` trigger
  - [ ] Define job `deploy` with `ubuntu-latest` runner
  - [ ] Step: Checkout repository (`actions/checkout@v4`)
  - [ ] Step: Setup Node.js 22 (`actions/setup-node@v4` with `node-version: '22'`)
  - [ ] Step: Install pnpm (`pnpm/action-setup@v4`)
  - [ ] Step: Install dependencies (`pnpm install --frozen-lockfile`)
  - [ ] Step: Run prebuild (`node scripts/prebuild.mjs`)
  - [ ] Step: Build Astro (`npx astro build`)
  - [ ] Step: Deploy to Cloudflare Pages (`cloudflare/wrangler-action@v3` with `apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}` and `command: pages deploy dist --project-name=luna-os-portfolio`)
  - [ ] Step: Pass `GITHUB_TOKEN` from secrets as environment variable
- [ ] Task 1.2: Add CRON schedule trigger
  - [ ] Add `schedule: - cron: '0 0 * * *'` to workflow triggers
  - [ ] Add concurrency group to prevent overlapping runs: `concurrency: deploy-${{ github.ref }}`
- [ ] Task 1.3: Write workflow validation tests
  - [ ] Create `tests/workflow.test.ts` verifying `.github/workflows/deploy.yml` exists
  - [ ] Verify YAML parses correctly (check for syntax errors)
  - [ ] Verify all required steps are present (checkout, node, pnpm, install, prebuild, build, deploy)
- [ ] Task 1.4: Run test suite and verify no regressions
- [ ] Task: Conductor - User Manual Verification 'Phase 1: GitHub Actions Workflow' (Protocol in workflow.md)

## Phase 2 — Cloudflare Pages Setup & Secret Management

- [ ] Task 2.1: Write integration test verifying deploy prerequisites
  - [ ] Test that `dist/` is listed in `.gitignore` (confirmed — build output is ephemeral)
  - [ ] Test that `pnpm build` completes successfully (local smoke build)
- [ ] Task 2.2: Create setup guide documentation or inline comments in the workflow
  - [ ] Add detailed comment block in `deploy.yml` explaining Cloudflare Pages manual setup steps:
    1. Go to Cloudflare Dashboard → Pages → Create a project → Connect Git
    2. Select the GitHub repository
    3. Set build command: `node scripts/prebuild.mjs && npx astro build`
    4. Set build output directory: `dist`
    5. Add environment variable `GITHUB_TOKEN` in Cloudflare Pages settings
    6. Deploy and verify initial build succeeds
- [ ] Task 2.3: Verify `GITHUB_TOKEN` is accessible in prebuild scripts
  - [ ] Audit `scripts/fetch-github-stats.mjs` — confirm it reads `process.env.GITHUB_TOKEN` (already implemented)
  - [ ] Confirm unauthenticated fallback still works (existing behavior)
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Cloudflare Pages Setup' (Protocol in workflow.md)

## Phase 3 — Custom Domain & DNS Configuration

- [ ] Task 3.1: Create custom domain setup guide
  - [ ] Document DNS steps for Hostinger:
    1. Log in to Hostinger DNS panel
    2. Add CNAME record: `os-portfolio` → `<your-cloudflare-pages-project>.pages.dev`
    3. Set TTL to 3600 (1 hour) or Auto
  - [ ] Document Cloudflare Pages domain setup:
    1. Go to project → Custom domains → Add custom domain
    2. Enter `os-portfolio.ansyar-world.top`
    3. Wait for SSL certificate provisioning (automatic, ~1-5 minutes)
  - [ ] Document verification: Visit `https://os-portfolio.ansyar-world.top` and confirm SSL lock icon
- [ ] Task 3.2: Update project documentation references
  - [ ] Update `conductor/product.md` or `conductor/tech-stack.md` with the live URL (`os-portfolio.ansyar-world.top`)
  - [ ] Update `docs/PRD.md` and `docs/TDD.md` URL references if applicable
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Custom Domain & DNS' (Protocol in workflow.md)

## Phase 4 — Final Smoke Test & Verification

- [ ] Task 4.1: Create post-deploy smoke test script
  - [ ] Create `scripts/smoke-test.mjs` that:
    1. Performs HTTP GET on the deployed URL
    2. Verifies HTTP 200 response
    3. Checks response contains expected HTML (e.g., `<title>` with "Luna OS" or "Portfolio")
    4. Checks response headers for security best practices
  - [ ] Test runs locally with `node scripts/smoke-test.mjs` (manual, not in CI pipeline)
- [ ] Task 4.2: Manual deployment verification
  - [ ] Push workflow to `main` branch
  - [ ] Monitor GitHub Actions run in Actions tab
  - [ ] Verify all steps complete successfully
  - [ ] Visit deployed URL and confirm full site functionality
  - [ ] Verify CRON trigger appears in GitHub Actions schedule
- [ ] Task 4.3: Update `conductor/tech-stack.md` change log
  - [ ] Add entry documenting new CI/CD pipeline, Cloudflare Pages config, and custom domain
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Smoke Test & Verification' (Protocol in workflow.md)
