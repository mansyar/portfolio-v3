# Luna OS Portfolio

A high-performance, retro-themed portfolio website for a Software Engineer specializing in DevOps and Data Engineering.

**Desktop:** Windows XP "Luna" interface with draggable windows, Start Menu, file explorer, and command prompt.

**Mobile:** BIOS-style Safe Mode terminal — a deliberate themed experience, not a downgrade.

Built with Astro, React, Tailwind CSS v4, Nano Stores, and MDX. Deployed on Cloudflare Pages.

## Architecture

Single-page Astro 6 app. Interactive elements are React "Islands" mounted via Astro; everything else is zero-JS HTML rendered at build time.

| Viewport | Theme                     |
| -------- | ------------------------- |
| ≥768px   | Windows XP Luna desktop   |
| <768px   | Safe Mode / BIOS terminal |

State management via Nano Stores (windows, desktop, filesystem). Content is MDX in Astro content collections, enriched at build time from the GitHub API.

## Commands

| Command              | Action                                          |
| -------------------- | ----------------------------------------------- |
| `pnpm dev`           | Start dev server at `localhost:4321`            |
| `pnpm build`         | Production build to `dist/`                     |
| `pnpm preview`       | Preview production build locally                |
| `pnpm test`          | Run Vitest tests                                |
| `pnpm test:coverage` | Run tests with coverage report (≥80% threshold) |
| `pnpm lint`          | ESLint check                                    |
| `pnpm format:fix`    | Prettier format                                 |
| `pnpm typecheck`     | Astro type checking                             |

## Project Structure

```
src/
├── components/
│   ├── desktop/     # Astro: Wallpaper, DesktopIcon
│   ├── taskbar/     # React: Taskbar, StartMenu, Clock
│   ├── window/      # React: WindowFrame, TitleBar
│   ├── apps/        # React: CmdPrompt, Explorer, TaskManager, HelpCenter
│   └── mobile/      # Astro/React: SafeModeShell, TerminalNav
├── content/
│   ├── projects/         # MDX project write-ups
│   └── devops-academy/   # MDX educational articles
├── layouts/         # DesktopLayout.astro (shell)
├── pages/           # index.astro (single page entry)
├── stores/          # Nano Stores (windows, desktop, filesystem)
├── lib/             # GitHub API fetcher, CLI commands, constants
└── styles/          # XP design tokens + Tailwind v4 config
```

## Agent Onboarding

For AI agents (OpenCode, Claude, etc.), see [AGENTS.md](./AGENTS.md) for the Conductor methodology workflow, TDD requirements, commit conventions, and project-specific rules.
