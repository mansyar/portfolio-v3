# Plan: Phase 0 — Foundation & Scaffold

## Phase 1: Project Scaffold & Dependencies

### Task 1.1: Initialize Astro Project
- [x] Run `pnpm create astro@latest .` with React, MDX, and Tailwind integrations [5c9240f]
- [x] Verify `astro.config.mjs` includes `@astrojs/react`, `@astrojs/mdx`, `@tailwindcss/vite` [5c9240f]
- [x] Verify `package.json` is created with correct dependencies [5c9240f]
- [x] Verify: `pnpm astro --version` shows Astro 6.x (deviation: v6.3.1 installed) [5c9240f]

### Task 1.2: Install All Dependencies
- [~] Install runtime deps: `nanostores`, `@nanostores/react`
- [ ] Install dev deps: `typescript`, `@types/react`, `vitest`, `eslint`, `prettier`, `husky`, `lint-staged`
- [ ] Verify: `pnpm ls --depth=0` shows all expected packages

### Task 1.3: Create Directory Structure
- [ ] Create `src/components/desktop/`, `src/components/taskbar/`, `src/components/window/`, `src/components/apps/`, `src/components/mobile/`
- [ ] Create `src/content/projects/`, `src/content/devops-academy/`
- [ ] Create `src/layouts/`, `src/pages/`, `src/stores/`, `src/lib/`, `src/styles/`
- [ ] Create `public/fonts/`, `public/icons/`, `public/wallpapers/`, `public/sounds/`
- [ ] Verify: directory tree matches TDD §1 specification

### Task 1.4: Write Tests for Directory Structure
- [ ] Create `tests/directory-structure.test.ts` to verify all required directories exist
- [ ] Run test suite to confirm all directories are present

## Phase 2: Code Quality Tooling

### Task 2.1: Configure TypeScript
- [ ] Create/update `tsconfig.json` with strict mode enabled
- [ ] Configure path aliases (e.g., `@/` → `src/`)
- [ ] Verify: `pnpm astro check` passes with no errors

### Task 2.2: Configure ESLint & Prettier
- [ ] Create `eslint.config.mjs` with TypeScript and React rules
- [ ] Create `.prettierrc` with consistent formatting rules
- [ ] Add lint and format scripts to `package.json`
- [ ] Verify: `pnpm lint` passes on a minimal test file

### Task 2.3: Configure Vitest
- [ ] Create `vitest.config.ts` with coverage reporter setup
- [ ] Configure 80% coverage threshold
- [ ] Create a sample test to verify Vitest works
- [ ] Verify: `pnpm test run --coverage` produces coverage report

## Phase 3: Git Hooks & Modularity

### Task 3.1: Create File Modularity Script
- [ ] Create `scripts/check-modularity.js` that fails if any file in `src/` exceeds 500 lines
- [ ] Write tests for the modularity script
- [ ] Verify: script passes on current codebase, fails on an artificially large test file

### Task 3.2: Configure Husky & lint-staged
- [ ] Initialize Husky: `pnpm husky init`
- [ ] Configure pre-commit hook: run `lint-staged` (lint → vitest related tests → modularity check)
- [ ] Configure pre-push hook: run typecheck → vitest coverage (80% threshold)
- [ ] Verify: `git commit` triggers pre-commit hooks, `git push` triggers pre-push hooks

## Phase 4: Design System Foundation

### Task 4.1: Create XP Theme CSS
- [ ] Create `src/styles/xp-theme.css` with all design tokens:
  - [ ] Luna Blue palette (taskbar, title bars, window chrome)
  - [ ] Classic 3D border system (`.xp-outset`, `.xp-inset`, `.xp-window-border`)
  - [ ] Tahoma font-face declarations
  - [ ] Typography scale (11px–13px)
  - [ ] Shadow and animation tokens
  - [ ] Safe Mode color tokens
- [ ] Write CSS tests (verify CSS custom properties are defined)
- [ ] Verify: design tokens match PRD §5 color specifications

### Task 4.2: Configure Tailwind CSS
- [ ] Create/update `tailwind.config.mjs` extending with XP theme tokens
- [ ] Map CSS variables to Tailwind utility classes
- [ ] Verify: Tailwind classes like `bg-xp-taskbar` produce correct XP blue

### Task 4.3: Add Tahoma Font Files
- [ ] Add `tahoma.woff2` and `tahoma-bold.woff2` to `public/fonts/`
- [ ] Verify: Tahoma font loads via `@font-face` in the browser

## Phase 5: Layout Shell

### Task 5.1: Create DesktopLayout.astro
- [ ] Create `src/layouts/DesktopLayout.astro` with:
  - [ ] HTML5 doctype and `<head>` with meta tags
  - [ ] Import and apply `xp-theme.css`
  - [ ] Full-viewport container with XP blue background
  - [ ] `<slot />` for page content
  - [ ] Font-family set to Tahoma
  - [ ] Viewport meta tag for responsive behavior

### Task 5.2: Create index.astro Entry Point
- [ ] Create `src/pages/index.astro` using `DesktopLayout`
- [ ] Add basic page structure: wallpaper area, icon area (empty), taskbar mount point (empty)
- [ ] Verify: `pnpm dev` renders a blank XP-themed page

### Task 5.3: Write Integration Tests
- [ ] Create `tests/pages/index.test.ts` to verify:
  - [ ] Page renders with correct title
  - [ ] XP theme CSS is applied
  - [ ] Tahoma font is loaded
  - [ ] Full viewport container exists

### Task 5.4: Final Verification
- [ ] Run full test suite: `pnpm test run --coverage`
- [ ] Run typecheck: `pnpm astro check`
- [ ] Run modularity check: `node scripts/check-modularity.js`
- [ ] Verify: `pnpm dev` serves a blank page with XP blue background and Tahoma font

### Task 5.5: Conductor - User Manual Verification 'Phase 0 — Foundation & Scaffold' (Protocol in workflow.md)
