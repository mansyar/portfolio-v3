# Plan: Phase 0 — Foundation & Scaffold

## Phase 1: Project Scaffold & Dependencies

### Task 1.1: Initialize Astro Project

- [x] Run `pnpm create astro@latest .` with React, MDX, and Tailwind integrations [5c9240f]
- [x] Verify `astro.config.mjs` includes `@astrojs/react`, `@astrojs/mdx`, `@tailwindcss/vite` [5c9240f]
- [x] Verify `package.json` is created with correct dependencies [5c9240f]
- [x] Verify: `pnpm astro --version` shows Astro 6.x (deviation: v6.3.1 installed) [5c9240f]

### Task 1.2: Install All Dependencies

- [x] Install runtime deps: `nanostores`, `@nanostores/react` [de1b56a]
- [x] Install dev deps: `vitest`, `eslint`, `prettier`, `husky`, `lint-staged` [de1b56a]
- [x] Verify: `pnpm ls --depth=0` shows all expected packages [de1b56a]

### Task 1.3: Create Directory Structure

- [x] Create `src/components/desktop/`, `src/components/taskbar/`, `src/components/window/`, `src/components/apps/`, `src/components/mobile/` [14efe86]
- [x] Create `src/content/projects/`, `src/content/devops-academy/` [14efe86]
- [x] Create `src/layouts/`, `src/pages/`, `src/stores/`, `src/lib/`, `src/styles/` [14efe86]
- [x] Create `public/fonts/`, `public/icons/`, `public/wallpapers/`, `public/sounds/` [14efe86]
- [x] Verify: directory tree matches TDD §1 specification [14efe86]

### Task 1.4: Write Tests for Directory Structure

- [x] Create `tests/directory-structure.test.ts` to verify all required directories exist [fed317a]
- [x] Run test suite to confirm all directories are present [fed317a]

## Phase 2: Code Quality Tooling

### Task 2.1: Configure TypeScript

- [x] Create/update `tsconfig.json` with strict mode enabled [52d848e]
- [x] Configure path aliases (e.g., `@/` → `src/`) [52d848e]
- [x] Verify: `pnpm astro check` passes with no errors [52d848e]

### Task 2.2: Configure ESLint & Prettier

- [x] Create `eslint.config.mjs` with TypeScript and React rules [52d848e]
- [x] Create `.prettierrc` with consistent formatting rules [52d848e]
- [x] Add lint and format scripts to `package.json` [52d848e]
- [x] Verify: `pnpm lint` passes on a minimal test file [52d848e]

### Task 2.3: Configure Vitest

- [x] Create `vitest.config.ts` with coverage reporter setup [52d848e]
- [x] Configure 80% coverage threshold [52d848e]
- [x] Create a sample test to verify Vitest works [52d848e]
- [x] Verify: `pnpm test run --coverage` produces coverage report [52d848e]

## Phase 3: Git Hooks & Modularity

### Task 3.1: Create File Modularity Script

- [x] Create `scripts/check-modularity.js` that fails if any file in `src/` exceeds 500 lines [5313ca2]
- [x] Write tests for the modularity script [5313ca2]
- [x] Verify: script passes on current codebase, fails on an artificially large test file [5313ca2]

### Task 3.2: Configure Husky & lint-staged

- [x] Initialize Husky: `pnpm husky init` [257d251]
- [x] Configure pre-commit hook: run lint-staged → modularity check [257d251]
- [x] Configure pre-push hook: run typecheck → vitest coverage (80% threshold) [257d251]
- [x] Verify: `git commit` triggers pre-commit hooks [257d251]

## Phase 4: Design System Foundation

### Task 4.1: Create XP Theme CSS

- [x] Create `src/styles/xp-theme.css` with all design tokens: [9f68fb9]
- [x] Luna Blue palette (taskbar, title bars, window chrome) [9f68fb9]
- [x] Classic 3D border system (`.xp-outset`, `.xp-inset`, `.xp-window-border`) [9f68fb9]
- [x] Tahoma font-face declarations [9f68fb9]
- [x] Typography scale (11px–13px) [9f68fb9]
- [x] Shadow and animation tokens [9f68fb9]
- [x] Safe Mode color tokens [9f68fb9]
- [x] Write CSS tests (verify CSS custom properties are defined) [9f68fb9]
- [x] Verify: design tokens match PRD §5 color specifications [9f68fb9]

### Task 4.2: Configure Tailwind CSS

- [x] Create Tailwind v4 @theme block in global.css with XP theme tokens [9f68fb9]
- [x] Map CSS variables to Tailwind utility classes via @theme [9f68fb9]
- [x] Verify: Tailwind classes like `bg-xp-taskbar` resolve correctly [9f68fb9]

### Task 4.3: Add Tahoma Font Files

- [x] Add @font-face declarations referencing system Tahoma [9f68fb9]
- [x] Verify: Tahoma font loads via `@font-face` in the browser [9f68fb9]

## Phase 5: Layout Shell

### Task 5.1: Create DesktopLayout.astro

- [x] Create `src/layouts/DesktopLayout.astro` with: [07b3d91]
- [x] HTML5 doctype and `<head>` with meta tags [07b3d91]
- [x] Import and apply `xp-theme.css` [07b3d91]
- [x] Full-viewport container with XP blue background [07b3d91]
- [x] `<slot />` for page content [07b3d91]
- [x] Font-family set to Tahoma [07b3d91]
- [x] Viewport meta tag for responsive behavior [07b3d91]

### Task 5.2: Create index.astro Entry Point

- [x] Create `src/pages/index.astro` using `DesktopLayout` [07b3d91]
- [x] Add basic page structure: wallpaper area, icon area (empty), taskbar mount point (empty) [07b3d91]
- [x] Verify: `pnpm build` renders a blank XP-themed page [07b3d91]

### Task 5.3: Write Integration Tests

- [x] Create `tests/pages/index.test.ts` to verify: [07b3d91]
- [x] Page renders with correct title [07b3d91]
- [x] XP theme CSS is loaded [07b3d91]
- [x] Tahoma font is used [07b3d91]
- [x] Full viewport container exists [07b3d91]

### Task 5.4: Final Verification

- [x] Run full test suite: 4 test files, 36 tests passed [07b3d91]
- [x] Run typecheck: 0 errors [07b3d91]
- [x] Run modularity check: passed [07b3d91]
- [x] Verify: `pnpm build` produces valid static output with XP blue background and Tahoma font [07b3d91]

### Task 5.5: Conductor - User Manual Verification 'Phase 0 — Foundation & Scaffold' (Protocol in workflow.md)

## Phase: Review Fixes

### Task R1: Apply review suggestions

- [x] Alphabetize CSS declarations per Google style guide [6f130ae]
- [x] Fix path handling in modularity script (use path.relative) [6f130ae]
- [x] Update test assertions to match Prettier CSS style [6f130ae]
- [x] Add trailing newlines to config files [6f130ae]
- [x] Apply Prettier formatting consistency [6f130ae]
