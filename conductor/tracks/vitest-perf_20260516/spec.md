# Track: Improve Vitest Performance

## Overview

This track optimizes the Vitest test runner configuration to reduce test execution time across the 57+ test files in the portfolio project. The scope is limited to `vitest.config.ts` changes only — no test file refactoring or restructuring.

## Current State

- **Config**: `vitest.config.ts` uses `getViteConfig` from Astro, wrapping the full Astro Vite plugin chain
- **Environment**: jsdom for all tests
- **Coverage**: v8 provider with >80% thresholds
- **Test files**: 57+ files across `tests/` directory
- **Pool**: Default (forks in Vitest 4.x)

## Goals

1. **Baseline Measurement**: Establish a reproducible benchmark of current test execution time (both cold and warm runs)
2. **Config Optimization**: Apply targeted Vitest config improvements to reduce execution time
3. **Measure Improvement**: Compare post-optimization times against baseline
4. **Documentation**: Document the optimized config and the reasoning behind each change

## Config Optimization Candidates

1. **Pool tuning**: Adjust `poolOptions.forks` settings (e.g., `singleFork`, `execArgv`)
2. **File parallelism**: Optimize `maxWorkers` / `minWorkers` based on CPU cores
3. **Cache**: Enable/configure `cache.dir` for faster warm runs
4. **Dependency optimization**: Configure `deps` to pre-bundle known slow dependencies
5. **Coverage exclusions**: Expand coverage `exclude` patterns to skip generated/non-essential files
6. **Test isolation**: Consider `pool: 'threads'` vs `forks` trade-offs
7. **Sequence options**: Review `sequence` hooks and setup file execution order

## Out of Scope

- Test file refactoring or restructuring
- Changing testing libraries or frameworks
- Modifying test assertions or test logic
- CI/CD pipeline changes
- Astro build performance

## Acceptance Criteria

1. [ ] A baseline benchmark is established and recorded (cold run + warm run time)
2. [ ] Config changes are applied to `vitest.config.ts` only
3. [ ] Post-optimization benchmark shows measurable improvement over baseline
4. [ ] All existing tests continue to pass
5. [ ] Coverage thresholds remain ≥80%
6. [ ] Changes are documented in the plan and committed
