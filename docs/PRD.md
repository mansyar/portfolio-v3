# PRD: Windows XP DevOps Portfolio (Luna OS)

**Author:** @mansyar  
**Version:** 2.0  
**Target Platform:** Cloudflare Pages (Free Tier)  
**Tech Stack:** Astro (Hybrid), React, Tailwind CSS, Nano Stores, MDX.

---

## 1. Executive Summary

A high-performance, retro-themed portfolio for a Software Engineer specializing in DevOps and Data Engineering. The site utilizes a **Windows XP "Luna"** aesthetic on desktop and transitions to a **"Safe Mode/BIOS"** terminal interface on mobile to ensure accessibility and performance.

---

## 2. Technical Stack & Infrastructure

| Layer                | Technology                   | Reason                                                                    |
| :------------------- | :--------------------------- | :------------------------------------------------------------------------ |
| **Framework**        | **Astro (Hybrid)**           | Zero-JS by default; SSR capability for functional CLI/Search.             |
| **Interactivity**    | **React**                    | Handles draggable windows and complex state as "Islands."                 |
| **State Management** | **Nano Stores + URL Params** | Ultra-lightweight state for window Z-index and deep-linking.              |
| **Styling**          | **Tailwind CSS**             | Custom Luna theme gradients and classic 3D borders.                       |
| **Content**          | **MDX**                      | Project write-ups and variative Knowledge Base articles (SE, AI, DevOps). |
| **Automation**       | **GitHub Actions**           | CRON-scheduled builds (every 24h) to sync GitHub API data.                |

---

## 3. UI/UX Architecture

### 3.1 The Desktop Experience

- **Wallpaper:** Bliss.webp (Optimized AVIF/WebP).
- **Taskbar:** Bottom-aligned with a blue gradient. Features a **Classic Start Menu** containing:
  - `Resume.exe` (Opens My Documents)
  - `Control Panel` (Opens Task Manager)
  - `Command Prompt` (Opens CLI)
  - `Shut Down...` (Triggers BIOS/Goodbye overlay)
- **Window Manager:** State-driven dragging, minimizing, and focusing using Nano Stores.
- **MetaTags Component:** Reusable Astro component injecting `<title>`, `<meta name="description">`, Open Graph tags (og:title, og:description, og:image, og:type), and JSON-LD Person schema into `<head>`.
- **404 Error Page:** Windows XP BSOD-themed page with `*** STOP: 0x000000FE (PORTFOLIO_NOT_FOUND)`, fake memory dump indicator, and "Press any key to restart" link to homepage.
- **Noscript Fallback:** Plain HTML links to all portfolio projects for users with JavaScript disabled.

### 3.2 The Mobile Experience (Safe Mode)

- **Trigger:** Viewport width < 768px.
- **Visuals:** High-contrast black/green terminal aesthetic.
- **Interaction:** Simplified text-based list navigation; no draggable windows.

---

## 4. File System & Content Mapping

### 🖥️ Desktop Icons

| Icon               | Type    | Content / Action                                                                                                                                                     |
| :----------------- | :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **My Computer**    | Folder  | Opens Explorer for `C:\Software_Engineering` and `D:\Systems_Data`.                                                                                                  |
| **My Documents**   | Folder  | `D:\My_Documents` Explorer view with `Resume.pdf` (opens in new tab), `Certs/` (empty placeholder), and `Contact.txt` (formatted contact card with clickable links). |
| **Knowledge Base** | App     | `E:\Knowledge_Base` (Variative articles: SE, AI, DevOps, etc.).                                                                                                      |
| **Command Prompt** | App     | Functional React terminal for CLI navigation.                                                                                                                        |
| **Recycle Bin**    | Archive | `\Recycle_Bin` virtual folder with deleted/archived item (`chasing-chapters (v1)`). Grayed-out icon, strikethrough name, disabled Restore button.                    |

### 📂 Directory Details

- **C:\Software_Engineering:** Features `icarus-server-manager` and `chasing-chapters`.
- **D:\Systems_Data:** Features `tubular-bexus-osw` and data-heavy system logs.
- **D:\My_Documents:** Portfolio documents — `Resume.pdf` (opens in new tab), `Certs/` (empty placeholder for future certificates), `Contact.txt` (contact info card).
- **\Recycle_Bin:** Virtual root-level folder (not a drive) containing archived/deleted items — `chasing-chapters (v1)` with grayed-out styling.
- **E:\Knowledge_Base:** MDX articles spanning Software Engineering, AI, DevOps, and more, browsed through the Knowledge Base application.

---

## 5. Specialized Application Specs

### 5.1 Command Prompt (cmd.exe)

- **Functional CLI:** A React island implementing a full terminal emulator with 9 commands, command history, and tab completion.
- **Prompt Format:** `C:\ [MANSYAR]>` with current directory tracking and bracket-separated username.
- **Visual Style:** Black background (`#000000`), green text (`#00aa00`), Courier New / Consolas monospace font, blinking block cursor.
- **Commands:**
  | Command | Aliases | Description |
  |---------|---------|-------------|
  | `help` | `/?` | Lists all available commands with descriptions |
  | `ls` | `dir` | Lists files/folders in current directory with type indicators |
  | `cd` | `chdir` | Change directory (supports `.`, `..`, `\`, absolute paths) |
  | `cat` | `type` | Displays project/article frontmatter metadata by slug |
  | `clear` | `cls` | Clears terminal output, re-shows welcome banner |
  | `neofetch` | — | Tux ASCII art + comprehensive system information card |
  | `open` | — | Opens Explorer to project folder or PDF in new tab |
  | `whoami` | — | Displays current username (`mansyar\administrator`) |
  | `echo` | — | Outputs provided text verbatim |
- **Tab Completion:** Auto-completes command names, folder paths for `cd`, and file slugs for `cat`/`type`/`open`.
- **History:** Arrow key (↑/↓) command history, per-session, deduplicates consecutive identical commands.
- **Error Handling:** XP-style error messages for unknown commands, invalid paths, and missing files.
- **Integration:** Coexists with Explorer, navigates the same `FILE_SYSTEM` tree, `open` command triggers Explorer navigation.

### 5.2 Task Manager (Control Panel)

- **Tab System:** Two XP-style tabs: **Processes** (inset/outset chrome, Tahoma font, keyboard arrow key navigation)
- **Processes Tab:** Lists 8 DevOps-themed process entries with 5 columns (Image Name, PID, CPU, Mem Usage, Description):
  - CPU % fluctuates ±3% randomly every 1s (clamped 0–100%), updated via ref-based DOM manipulation
  - Row selection with XP blue highlight (`#0A246A`); End Process button disabled when no row selected
  - "End Process" shows XP warning dialog: blue gradient title bar, process-specific warning text, SVG warning icon, OK/Cancel
- **Performance Tab:** Two Canvas-based line graphs (pure Canvas API, no charting libraries):
  - **Skills Utilization** (CPU): green `#00ff00` line on black `#000000` grid, 60-point rolling buffer
  - **Knowledge Base** (Memory): same visual treatment
  - Both update every 1s with ±2% random fluctuation, data scrolls left
  - Y-axis percentage labels, XP-style grid lines
- **Visual Style:** Tahoma 11px, 3D borders, `#ECE9D8` dialog chrome, exact XP color matching
- **Accessibility:** `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-hidden`, keyboard navigation

### 5.3 Knowledge Base

- **React Island:** `KnowledgeBase.tsx` with component-local state (no Nano Stores needed).
- **Layout:** Two-column layout — left sidebar (blue `#d3e5fa` panel) with search bar + category tree, right content pane with article list (top) and detail view (bottom).
- **Category Sidebar:** Auto-discovered from article frontmatter `category` field. "All Articles" default selected. Clicking filters the article list.
- **Article List:** Shows title, category badge, and description excerpt. Alternating row backgrounds with hover highlight. Clicking an article opens it in the detail pane.
- **Detail Pane:** Renders pre-compiled HTML via `dangerouslySetInnerHTML`. Metadata header shows title, category badge (blue `#0046d5`), and last updated date. Scrollable content area.
- **Search:** Text input at top of sidebar. Real-time filtering by title or description (case-insensitive). Crosses category boundaries — shows matches from all categories regardless of active category filter.
- **Content Pipeline:** Articles stored as MDX in `src/content/articles/`. At build time, `scripts/compile-articles.mjs` parses frontmatter (manual YAML, no `gray-matter`) and renders body to HTML via `marked` (1-package lightweight approach). Output: `src/lib/generated/articles-content.json` (~1.6KB for 5 articles).
- **Build Integration:** `"build": "node scripts/prebuild.mjs && astro build"` — the prebuild orchestrator runs all 4 pre-processing scripts (fetch-github-stats, compile-articles, compile-projects, generate-filesystem) before Astro, total ~3.44s.
- **Articles:** 5 articles across 3 categories: DevOps (Docker Basics, Linux Essentials, CI/CD Pipeline), Software Engineering (Microservices Patterns), AI (LLM Fine-Tuning Guide).
- **Accessibility:** Full WCAG AA compliance across all components. ARIA roles include `role="region"` + `aria-label="Knowledge Base"` on outer container, `role="searchbox"` on search input, `role="navigation"` + `aria-label="Article categories"` on category sidebar.

---

## 6. DevOps & Deployment Strategy

1.  **Data Sync:** Build-time GitHub API fetching via `scripts/prebuild.mjs` orchestrator:
    - `fetch-github-stats.mjs` — fetches stars, commits, and last push date from `GET /repos/{owner}/{repo}` and commits endpoint (Link header parsing for total count). Supports `GITHUB_TOKEN` env var for authenticated requests (60/hr limit without token is sufficient for 3 repos). Caches to `github-cache.json`.
    - `compile-articles.mjs` — compiles article MDX → `articles-content.json` (metadata + HTML).
    - `compile-projects.mjs` — compiles project MDX → `projects-content.json` (frontmatter + body HTML with GitHub data merge overwriting hardcoded stars/commits/lastCommit).
    - `generate-filesystem.mjs` — builds dynamic `FILE_SYSTEM` tree (`filesystem.json`) from compiled JSON outputs (no redundant MDX re-parsing).
    - Cache fallback: on GitHub API failure, reads `github-cache.json`. Warning on cache hit, error + exit on cache miss.
2.  **Asset Pipeline:** Images are converted to WebP; icons remain high-quality SVGs.
3.  **Deployment:**
    - **Push to `main`:** Cloudflare Pages native CI automatically detects the push, runs `pnpm build`, and deploys the static `dist/` folder. No wrangler-action or custom deploy command needed.
    - **CRON (00:00 UTC daily):** GitHub Actions workflow runs `pnpm build` to refresh GitHub data, then curls a Cloudflare deploy hook URL (`CLOUDFLARE_DEPLOY_HOOK_URL`) to trigger a new deployment.
    - **Pre-push quality gate:** Husky hook runs `astro check` (typecheck) + `vitest run --coverage` (≥80% threshold) before allowing push to remote.
    - **Live URL:** `https://portfolio-os.ansyar-world.top` via custom domain with automatic Cloudflare SSL.
    - **Fallback URL:** `https://portfolio-v3.m-ansyarafi.workers.dev` (Cloudflare Pages default).
    - **Build command:** `pnpm build` — runs `node scripts/prebuild.mjs && astro build`.
4.  **State Persistence:** URL search params (`?w=`, `?focus=`, `?start=`, `?path=`) are handled entirely client-side via Nano Stores syncing to `history.replaceState()`/`pushState()`. No Cloudflare Functions or edge logic needed — the static site serves the same HTML regardless of URL params, and hydration happens in the browser on load.

---

## 7. Success Metrics

- **Performance:** < 100ms TBT (Total Blocking Time). Production build < 5s.
- **SEO:** Full Open Graph support, JSON-LD structured data (Person schema), crawlable static content.
- **Authenticity:** Design mirrors 2001-era Windows XP pixel-for-pixel (3D borders, blue gradients).
- **Utility:** Mobile "Safe Mode" must be fully navigable in under 1.5 seconds.
- **Accessibility:** Full keyboard navigability, WCAG AA color contrast, screen reader support with ARIA roles, reduced motion support. All animations disabled under `@media (prefers-reduced-motion: reduce)`.
- **Resilience:** Error states for every failure mode (API offline, 404 page, JS disabled via `<noscript>`).
