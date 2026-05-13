# Luna OS Portfolio — Agent Instructions

## Architecture

Single-page Astro 6 app (static site, Cloudflare Pages). Two viewports: **Windows XP Luna desktop** (≥768px) and **BIOS Safe Mode terminal** (<768px). Interactive pieces are React "Islands" mounted via Astro; everything else is zero-JS HTML.

## Conductor Methodology

This project is run via the **Conductor** methodology. All planning lives in `conductor/`:

- `conductor/index.md` — project context index
- `conductor/product.md` — product definition and vision
- `conductor/tech-stack.md` — technology stack (with change log)
- `conductor/workflow.md` — strict TDD workflow, commit rules, checkpoint protocol
- `conductor/tracks.md` — track registry
- `conductor/tracks/<track_id>/` — per-track spec + plan + metadata
- `conductor/archive/` — completed tracks moved here

**Do not implement code until a track has an approved spec (`spec.md`) and plan (`plan.md`).**

## Developer Commands

| Command                            | What it does                           |
| ---------------------------------- | -------------------------------------- |
| `pnpm dev`                         | Start dev server at **localhost:4321** |
| `pnpm build`                       | Production build to `dist/`            |
| `pnpm test`                        | `vitest run` (single run)              |
| `pnpm test:watch`                  | `vitest` (watch mode)                  |
| `pnpm test:coverage`               | `vitest run --coverage`                |
| `pnpm lint`                        | `eslint .`                             |
| `pnpm format`                      | `prettier --check .`                   |
| `pnpm format:fix`                  | `prettier --write .`                   |
| `pnpm typecheck`                   | `astro check`                          |
| `pnpm astro check`                 | Type checking                          |
| `node scripts/check-modularity.js` | Check no `src/` file exceeds 500 lines |

Use `CI=true` prefix for watch-mode tools to force single execution (e.g. `CI=true pnpm test`).

## Pre-Commit / Pre-Push

- **pre-commit** (via husky + lint-staged): ESLint fix + Prettier format on staged files, then modularity check
- **pre-push**: `astro check` (typecheck) then `vitest run --coverage` (enforces ≥80% coverage)

## Test Conventions

- Tests live in `tests/` directory (mirrors `src/` structure)
- Test files: `*.test.ts` (vitest picks up `tests/**/*.test.ts`)
- Coverage threshold: **80%** (statements, branches, functions, lines)
- Page integration tests read built output from `dist/` — requires `pnpm build` first
- Temporary test artifacts go in `src/__test_modularity__/` (gitignored)
- **TDD required**: write failing test first, then implement

## Tailwind CSS v4

**No `tailwind.config.*` file.** Configuration is CSS-first:

- `@import 'tailwindcss'` in `src/styles/global.css`
- `@theme { }` block in the same file defines custom design tokens
- XP color tokens are prefixed `--color-xp-*` (applied via Tailwind classes like `bg-xp-desktop`)
- Raw XP design tokens live in `src/styles/xp-theme.css` as CSS custom properties

## Astro Island Boundaries

| Component                             | Renderer | Directive        | When               |
| ------------------------------------- | -------- | ---------------- | ------------------ |
| Wallpaper, DesktopIcon, DesktopLayout | Astro    | —                | Static, zero JS    |
| Taskbar, WindowLayer                  | React    | `client:load`    | Always interactive |
| TerminalNav (mobile)                  | React    | `client:visible` | When scrolled in   |
| SafeModeShell, MetaTags               | Astro    | —                | Static             |

## Planned Architecture (from TDD)

Nano Stores will manage all reactive state:

- `src/stores/windows.ts` — window positions, z-index, open/close/minimize/maximize
- `src/stores/desktop.ts` — desktop state
- `src/stores/filesystem.ts` — virtual filesystem tree

Virtual filesystem: `C:\Software_Engineering`, `D:\Systems_Data`, `E:\Knowledge_Base`.

## Path Aliases

`@/` maps to `src/` (configured in `tsconfig.json`).

Example: `import { Foo } from '@/components/desktop/Foo'`

## Component Structure

Component directories under `src/components/`:

- `desktop/` — Astro static (Wallpaper, DesktopIcon)
- `taskbar/` — React (Taskbar, StartMenu, Clock)
- `window/` — React (WindowFrame, TitleBar, WindowContent)
- `apps/` — React (CmdPrompt, Explorer, TaskManager, HelpCenter)
- `mobile/` — Astro/React (SafeModeShell, TerminalNav)

Empty directories have `.gitkeep` placeholders.

## Commit Convention

```
<type>(<scope>): <description>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.

Plan updates get `conductor(plan):` prefix. Checkpoints get `conductor(checkpoint):`. Archive commits get `chore(conductor):`.

Every task commit gets a **git note** with task summary. After commit, update `plan.md` with the commit SHA.

## File Modularity

No file in `src/` may exceed **500 lines**. Enforced by `scripts/check-modularity.js` in pre-commit hook.

## Dev Server

`pnpm dev` serves at **http://localhost:4321**. No custom port config.
