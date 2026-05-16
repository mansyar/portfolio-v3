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

## Codebase Search (SocratiCode)

This project is indexed with SocratiCode. Always use its MCP tools to explore the codebase
before reading any files directly.

### Workflow

1. **Start most explorations with `codebase_search`.**
   Hybrid semantic + keyword search (vector + BM25, RRF-fused) runs in a single call.
   - Use broad, conceptual queries for orientation: "how is authentication handled",
     "database connection setup", "error handling patterns".
   - Use precise queries for symbol lookups: exact function names, constants, type names.
   - Prefer search results to infer which files to read — do not speculatively open files.
   - **When to use grep instead**: If you already know the exact identifier, error string,
     or regex pattern, grep/ripgrep is faster and more precise — no semantic gap to bridge.
     Use `codebase_search` when you're exploring, asking conceptual questions, or don't
     know which files to look in.

2. **Follow the graph before following imports.**
   Use `codebase_graph_query` to see what a file imports and what depends on it before
   diving into its contents. This prevents unnecessary reading of transitive dependencies.
   - **Before modifying or deleting a file**, check its dependents with `codebase_graph_query`
     to understand the blast radius.
   - **When planning a refactor**, use the graph to identify all affected files before
     making changes.

3. **Use Impact Analysis BEFORE refactoring, renaming, or deleting code.**
   The symbol-level call graph (`codebase_impact`, `codebase_flow`, `codebase_symbol`,
   `codebase_symbols`) goes one step deeper than the file graph: it knows which
   functions and methods call which.
   - `codebase_impact` answers "what breaks if I change X?" (blast radius — every file
     that transitively calls into the target).
   - `codebase_flow` answers "what does this code do?" by tracing forward from an entry
     point. Call with no `entrypoint` to discover candidate entry points (auto-detected
     via orphans, conventional names like `main()`, framework routes, tests).
   - `codebase_symbol` gives a 360° view of one function: definition, callers, callees.
   - `codebase_symbols` lists symbols in a file or searches by name.
   - Always prefer these over reading multiple files when the question is about
     dependencies between functions, not concepts.

4. **Read files only after narrowing down via search.**
   Once search results clearly point to 1–3 files, read only the relevant sections.
   Never read a file just to find out if it's relevant — search first.

5. **Use `codebase_graph_circular` when debugging unexpected behaviour.**
   Circular dependencies cause subtle runtime issues; check for them proactively.
   Also run `codebase_graph_circular` when you notice import-related errors or unexpected
   initialisation order.

6. **Check `codebase_status` if search returns no results.**
   The project may not be indexed yet. Run `codebase_index` if needed, then wait for
   `codebase_status` to confirm completion before searching.

7. **Leverage context artifacts for non-code knowledge.**
   Projects can define a `.socraticodecontextartifacts.json` config to expose database
   schemas, API specs, infrastructure configs, architecture docs, and other project
   knowledge that lives outside source code. These artifacts are auto-indexed alongside
   code during `codebase_index` and `codebase_update`.
   - Run `codebase_context` early to see what artifacts are available.
   - Use `codebase_context_search` to find specific schemas, endpoints, or configs
     before asking about database structure or API contracts.
   - If `codebase_status` shows artifacts are stale, run `codebase_context_index` to
     refresh them.

### When to use each tool

| Goal                                                                   | Tool                                                                        |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Understand what a codebase does / where a feature lives                | `codebase_search` (broad query)                                             |
| Find a specific function, constant, or type                            | `codebase_search` (exact name) or grep if you know already the exact string |
| Find exact error messages, log strings, or regex patterns              | grep / ripgrep                                                              |
| See what a file imports or what depends on it                          | `codebase_graph_query`                                                      |
| Check blast radius before modifying or deleting a file                 | `codebase_impact` (symbol-level) or `codebase_graph_query` (file-level)     |
| **What breaks if I change function X?**                                | `codebase_impact target=X`                                                  |
| **What does this entry point actually do?**                            | `codebase_flow entrypoint=X`                                                |
| **List entry points in this codebase**                                 | `codebase_flow` (no args)                                                   |
| **Who calls this function and what does it call?**                     | `codebase_symbol name=X`                                                    |
| **What functions/classes exist in this file?**                         | `codebase_symbols file=path`                                                |
| **Search for symbols by name across the project**                      | `codebase_symbols query=X`                                                  |
| Spot architectural problems                                            | `codebase_graph_circular`, `codebase_graph_stats`                           |
| Visualise module structure                                             | `codebase_graph_visualize`                                                  |
| Verify index is up to date                                             | `codebase_status`                                                           |
| Discover what project knowledge (schemas, specs, configs) is available | `codebase_context`                                                          |
| Find database tables, API endpoints, infra configs                     | `codebase_context_search`                                                   |
