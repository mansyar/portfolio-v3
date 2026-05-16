# Implementation Plan: Improve Vitest Performance

## Phase 1: Benchmark Current Performance

**Goal:** Establish a reproducible baseline of current test execution times.

- [x] Task: 1.1 — Create benchmark helper script (d274749)
  - [ ] Write `tests/helpers/benchmark.ts` — a utility that measures `vitest run` execution time (wall clock via `performance.now()` or similar)
  - [ ] Write unit test for the benchmark helper (`tests/helpers/benchmark.test.ts`)
  - [ ] Confirm the test fails initially (Red phase)
  - [ ] Implement benchmark helper (Green phase)
  - [ ] Verify test passes
- [x] Task: 1.2 — Measure baseline (cold run)
  - [x] Cold run 1: 28.74s, Run 2: 29.56s, Run 3: 29.35s
  - [x] Average: 29.22s
- [x] Task: 1.3 — Measure baseline (warm run)
  - [x] Warm run 1: 28.99s, Run 2: 28.81s, Run 3: 26.68s
  - [x] Average: 28.16s
- [x] Task: Conductor — User Manual Verification 'Phase 1: Benchmark Current Performance' (Protocol in workflow.md)

## Phase 2: Optimize Vitest Configuration

**Goal:** Apply config changes to `vitest.config.ts` to reduce execution time.

- [ ] Task: 2.1 — Optimize pool and parallelism settings
  - [ ] Research optimal `poolOptions.forks` settings for current hardware (CPU cores, RAM)
  - [ ] Adjust `maxWorkers`/`minWorkers` in `vitest.config.ts`
  - [ ] Run `CI=true pnpm test` to verify all tests still pass
- [ ] Task: 2.2 — Enable and configure test cache
  - [ ] Add `cache.dir` to `vitest.config.ts` pointing to `.vitest-cache`
  - [ ] Configure `cache` options for optimal warm-run speed
  - [ ] Run `CI=true pnpm test` to verify all tests still pass
- [ ] Task: 2.3 — Optimize dependency pre-bundling
  - [ ] Add `deps` config with pre-bundled known dependencies (`react`, `react-dom`, `@testing-library/react`, etc.)
  - [ ] Run `CI=true pnpm test` to verify all tests still pass
- [ ] Task: 2.4 — Expand coverage exclusions
  - [ ] Add `coverage.exclude` patterns for non-essential directories (e.g., `tests/helpers/`, generated test fixtures)
  - [ ] Run `CI=true pnpm test -- --coverage` to verify coverage thresholds still met
- [ ] Task: 2.5 — Optimize test sequence and isolation
  - [ ] Review and configure `sequence` options (hooks, setup files)
  - [ ] Run full test suite to verify all tests still pass
- [ ] Task: Conductor — User Manual Verification 'Phase 2: Optimize Vitest Configuration' (Protocol in workflow.md)

## Phase 3: Verify Improvements & Document

**Goal:** Measure post-optimization performance and document all changes.

- [ ] Task: 3.1 — Measure post-optimization (cold run)
  - [ ] Clear cache and run `CI=true pnpm test` three times
  - [ ] Record average execution time in plan.md
- [ ] Task: 3.2 — Measure post-optimization (warm run)
  - [ ] Run `CI=true pnpm test` three times (cache primed)
  - [ ] Record average execution time in plan.md
- [ ] Task: 3.3 — Compare and document results
  - [ ] Calculate improvement percentages (baseline vs optimized)
  - [ ] Document all config changes and their rationale in the track's spec.md or a dedicated perf-report section
- [ ] Task: Conductor — User Manual Verification 'Phase 3: Verify Improvements & Document' (Protocol in workflow.md)
