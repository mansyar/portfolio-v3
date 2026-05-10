# Spec: Phase 0 — Foundation & Scaffold

## Overview

Bootstrap the Luna OS Portfolio project from scratch. This phase establishes the foundational architecture, tooling, and design system — producing a buildable Astro project with the XP theme skeleton. No interactive features yet; this is pure infrastructure.

## Technical Context

- **Framework:** Astro 5.x with React, MDX, and Tailwind CSS integrations
- **Language:** TypeScript (strict mode)
- **Package Manager:** pnpm
- **Testing:** Vitest with coverage reporting (≥ 80%)
- **Quality:** ESLint + Prettier + Husky + lint-staged
- **Design:** Custom CSS design tokens for Windows XP Luna theme

## Goals

1. Initialize a working Astro project with all required integrations
2. Create the full directory structure matching the TDD specification
3. Install and configure all tooling (ESLint, Prettier, TypeScript, Vitest)
4. Set up git hooks for pre-commit (lint, test, modularity) and pre-push (typecheck, coverage)
5. Create the complete XP design token system (CSS variables, Tailwind config)
6. Add Tahoma font files
7. Build the DesktopLayout.astro skeleton and index.astro entry point
8. Create a file modularity script (500-line limit per file in `src/`)
9. Verify: `pnpm dev` serves a blank page with correct fonts and XP blue background

## Acceptance Criteria

```
✅ Project builds and serves locally without errors
✅ Code quality tools (ESLint, Prettier, TypeScript, Vitest) are fully configured
✅ Git hooks enforce pre-commit (lint, test, modularity) and pre-push (typecheck, coverage >= 80%) rules
✅ Custom modularity script successfully fails if a file in src/ exceeds 500 lines
✅ XP design tokens are available in CSS (verified with a test element)
✅ Tahoma font loads correctly
✅ Directory structure matches TDD specification
✅ pnpm dev runs without errors showing the XP blue desktop background
```

## Out of Scope

- Desktop icons, wallpaper, or interactive UI components
- Window manager or any Nano Stores logic
- Taskbar, Start Menu, or any application windows
- Mobile Safe Mode
- Content (MDX files, resume PDF)
- GitHub Actions CI/CD pipeline
