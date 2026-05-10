# Technology Stack

## Overview

The Luna OS Portfolio is built on a modern, performance-optimized web stack with zero-JS-by-default architecture. Interactive elements are delivered as isolated React "Islands" within the Astro framework, ensuring minimal JavaScript payload.

---

## Core Stack

| Layer                | Technology          | Version       | Purpose                                                         |
| -------------------- | ------------------- | ------------- | --------------------------------------------------------------- |
| **Framework**        | Astro               | ^6.x          | Zero-JS by default; hybrid SSR/SSG; content collections         |
| **UI Library**       | React               | ^19.x         | Interactive islands: windows, CLI, task manager                 |
| **Styling**          | Tailwind CSS        | ^4.x (v4.3.0) | Custom Luna theme with XP gradients and 3D borders; Vite plugin |
| **State Management** | Nano Stores         | ^0.11.x       | Ultra-lightweight reactive state for window management          |
| **React Bridge**     | @nanostores/react   | ^0.8.x        | React integration for Nano Stores                               |
| **Content**          | MDX + Astro Content | —             | Project write-ups and DevOps Academy articles                   |
| **Language**         | TypeScript          | ^5.x          | Strict type checking across all source files                    |

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

- MDX files in `src/content/projects/` and `src/content/devops-academy/`
- GitHub API data fetched at build time, merged into content collections
- Cache fallback on API failure for offline resilience

### Build Pipeline

```
git push → GitHub Actions → pnpm install → Fetch GitHub API → astro build → Cloudflare Pages
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
- **Impact:** Tailwind v4 uses CSS-first configuration (no `tailwind.config.*` file). Styling is done via `@import "tailwindcss"` in CSS files instead of Tailwind directives.
- **File affected:** Styling entry in Core Stack table, Integration table.
