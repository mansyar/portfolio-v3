# Technology Stack

## Overview

The Luna OS Portfolio is built on a modern, performance-optimized web stack with zero-JS-by-default architecture. Interactive elements are delivered as isolated React "Islands" within the Astro framework, ensuring minimal JavaScript payload.

---

## Core Stack

| Layer                 | Technology          | Version       | Purpose                                                         |
| --------------------- | ------------------- | ------------- | --------------------------------------------------------------- |
| **Framework**         | Astro               | ^6.x          | Zero-JS by default; hybrid SSR/SSG; content collections         |
| **UI Library**        | React               | ^19.x         | Interactive islands: windows, CLI, task manager                 |
| **Styling**           | Tailwind CSS        | ^4.x (v4.3.0) | Custom Luna theme with XP gradients and 3D borders; Vite plugin |
| **State Management**  | Nano Stores         | ^1.3.0        | Ultra-lightweight reactive state for window management          |
| **React Bridge**      | @nanostores/react   | ^1.1.0        | React integration for Nano Stores                               |
| **Content**           | MDX + Astro Content | —             | Project write-ups and DevOps Academy articles                   |
| **Language**          | TypeScript          | ^5.x          | Strict type checking across all source files                    |
| **Schema Validation** | Zod                 | ^4.x          | Runtime validation for content collection frontmatter schemas   |
| **Markdown Renderer** | marked              | ^18.x         | Build-time MDX-to-HTML compilation for Knowledge Base articles  |

## Integrations

| Integration | Package             | Purpose                                          |
| ----------- | ------------------- | ------------------------------------------------ |
| React       | `@astrojs/react`    | Mount React islands in Astro                     |
| MDX         | `@astrojs/mdx`      | Render MDX content collections                   |
| Tailwind    | `@tailwindcss/vite` | Utility-first CSS v4 with XP theme (Vite plugin) |

## Tooling & Quality

| Tool                    | Purpose                                                      |
| ----------------------- | ------------------------------------------------------------ |
| **pnpm**                | Fast, disk-efficient package manager                         |
| **ESLint**              | Code linting and consistency                                 |
| **Prettier**            | Automatic code formatting                                    |
| **Vitest**              | Unit testing with coverage reporting (>80% threshold)        |
| **Husky + lint-staged** | Git hooks: pre-commit lint/test, pre-push typecheck/coverage |
| **TypeScript**          | Strict mode throughout                                       |

## Infrastructure & Deployment

| Service              | Purpose                                               |
| -------------------- | ----------------------------------------------------- |
| **Cloudflare Pages** | Static site hosting (free tier)                       |
| **GitHub Actions**   | CI/CD pipeline + CRON-triggered daily rebuilds        |
| **GitHub API**       | Build-time data: repo stars, commits, last push dates |

## Architecture Patterns

### Island Architecture

- Static content rendered as HTML by Astro (zero JS)
- Interactive components mounted as React islands with `client:load` or `client:visible`
- `client:load` for always-interactive components (Taskbar, WindowLayer)
- `client:visible` for scroll-triggered interactivity (Mobile TerminalNav)

### State Management

- Nano Stores for all reactive state (window positions, z-index, filesystem)
- URL search params for state persistence and deep-linking (`?w=cmd,taskmanager&focus=cmd`)
- Computed stores for derived state (e.g., `$taskbarWindows`)

### Content Pipeline

- MDX files in `src/content/projects/` and `src/content/articles/`
- GitHub API data fetched at build time via `fetch-github-stats.mjs`, cached in `github-cache.json`
- Project MDX compiled with GitHub data merge via `compile-projects.mjs` → `projects-content.json`
- Article MDX compiled via `compile-articles.mjs` → `articles-content.json`
- Dynamic FILE_SYSTEM tree generated from compiled JSON via `generate-filesystem.mjs`
- Cache fallback on API failure for offline resilience

### Build Pipeline

```
git push → GitHub Actions → pnpm install → node scripts/prebuild.mjs → astro build → Cloudflare Pages
```

The `prebuild.mjs` orchestrator runs 4 sub-scripts in sequence:

```
prebuild.mjs
 ├── 1. fetch-github-stats.mjs   — Fetch live stars, last commit, commit count from GitHub API
 ├── 2. compile-articles.mjs     — Compile article MDX → JSON (articles-content.json)
 ├── 3. compile-projects.mjs     — Compile project MDX → JSON with GitHub data merge (projects-content.json)
 └── 4. generate-filesystem.mjs  — Build dynamic FILE_SYSTEM tree from compiled JSON (filesystem.json)
```

## Performance Budgets

| Metric                    | Target       |
| ------------------------- | ------------ |
| Total JS bundle (gzipped) | < 100KB      |
| Total Blocking Time (TBT) | < 100ms      |
| Lighthouse Performance    | > 90         |
| Build time                | < 60 seconds |

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge — latest 2 versions)
- The XP aesthetic is optimized for desktop; Safe Mode serves mobile
- No IE11 support (consistent with XP's end-of-life)

## Out of Scope (v1)

- Tab-completion in Command Prompt
- Right-click context menus
- Custom window themes/skins
- Real-time collaboration features
- Backend server or database

---

## Change Log

### 2026-05-14 — Track 3C: My Documents & Recycle Bin — Virtual filesystem additions

- **Reason:** Track 3C requires My Documents (Resume.pdf, Certs/, Contact.txt) on D: drive and a virtual Recycle Bin at root level for displaying archived/deleted project items.
- **Impact:** `D:\My_Documents` added as sibling folder to `D:\Systems_Data`. `\Recycle_Bin` added as virtual root-level folder (not a drive) via special-cased `getChildren()`/`resolvePath()` in `filesystem.ts`. New data exports: `CONTACT_METADATA` (6 fields), `RECYCLE_BIN_METADATA` with archive status. `scripts/generate-filesystem.mjs` updated to include static My_Documents entries. Explorer reused for both views.
- **Packages added:** None (pure data + component changes).
- **Files affected:** `src/lib/constants.ts`, `src/lib/filesystem.ts`, `src/lib/projects-data.ts`, `src/stores/windows.ts`, `src/components/apps/Explorer.tsx`, `src/components/apps/ExplorerDetailPane.tsx`, `src/components/apps/ExplorerFileList.tsx`, `src/components/window/WindowLayer.tsx`, `src/styles/global.css`, `scripts/generate-filesystem.mjs`, `public/resume.pdf`
- **Tests added:** `tests/filesystem.test.ts` (22 tests — core utilities + My Documents/Recycle Bin filesystem), `tests/explorer.test.tsx` (10 new My Documents + Recycle Bin + Resume click tests)

### 2026-05-13 — Track 3A: GitHub Data Sync — Build pipeline overhaul

- **Reason:** Track 3A requires live GitHub data (stars, commits, last commit date) to be fetched at build time and merged into project MDX content. The build pipeline was restructured with a `prebuild.mjs` orchestrator that runs 4 sub-scripts in sequence.
- **Impact:** Build command changed from `node scripts/compile-articles.mjs && astro build` to `node scripts/prebuild.mjs && astro build`. Four new scripts: `fetch-github-stats.mjs`, `compile-projects.mjs`, `generate-filesystem.mjs`, and `prebuild.mjs`.
- **New generated files:** `src/lib/generated/projects-content.json` (project MDX + GitHub data), `src/lib/generated/filesystem.json` (dynamic FS tree). `github-cache.json` added as gitignored cache.
- **Static tree preserved:** `src/lib/constants.ts` keeps the static `FILE_SYSTEM` for dev mode; build-time generation produces matching dynamic tree.
- **Packages added:** None (uses existing `marked` for MDX rendering).
- **Files affected:** `package.json`, `.gitignore`, `conductor/tech-stack.md`

### 2026-05-13 — Added `marked` for build-time MDX compilation

- **Reason:** Track 2D (Knowledge Base) requires a lightweight markdown-to-HTML renderer for the `compile-articles.mjs` build script.
- **Impact:** `node scripts/compile-articles.mjs` runs before `astro build`. Articles are now pre-compiled to JSON for runtime use by the KnowledgeBase React island.
- **Files affected:** `package.json`, `scripts/compile-articles.mjs`
- **Packages added:** `marked`

### 2026-05-11 — Astro v5.x → v6.x

- **Reason:** `pnpm create astro@latest` installed the latest stable release (v6.3.1).
- **Impact:** No breaking changes for this project's usage. Zero-JS-by-default architecture, content collections, and SSR/SSG modes remain unchanged.
- **File affected:** Framework version in Core Stack table.

### 2026-05-11 — Added jsdom + @testing-library/react for React component testing

- **Reason:** Needed to write proper unit tests for React islands (Clock, Taskbar).
- **Impact:** Vitest environment changed from Node to jsdom. New test file extension `.tsx` added to include pattern. React components can now be rendered and queried in tests.
- **Files affected:** `vitest.config.ts`, `tests/setup.ts`
- **Packages added:** `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/dom`

### 2026-05-11 — Tailwind Integration: `@astrojs/tailwind` → `@tailwindcss/vite`

- **Reason:** Astro 6 with Tailwind CSS v4 uses the Vite plugin directly instead of the legacy Astro integration.
- **Impact:** Tailwind v4 uses CSS-first configuration (no `tailwind.config.*` file). Styling is done via `@import "tailwindcss" in CSS files instead of Tailwind directives.
- **File affected:** Styling entry in Core Stack table, Integration table.

### 2026-05-12 — Added Zod for content collection schema validation

- **Reason:** Track 2A content collections require runtime schema validation for MDX frontmatter. Extracted schemas into `src/lib/content-schemas.ts` (testable without `astro:content`) and imported into `src/content.config.ts` for Astro's `defineCollection`.
- **Impact:** New `zod` dependency. Content schemas are now independently testable via vitest. Astro 6 content config uses `glob` loader in `src/content.config.ts`.
- **Files affected:** `package.json`, `src/content.config.ts`, `src/lib/content-schemas.ts`
- **Packages added:** `zod`
