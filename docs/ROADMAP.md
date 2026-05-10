# Roadmap: Luna OS Portfolio

**Parent Docs:** [PRD.md](./PRD.md) · [TDD.md](./TDD.md)  
**Version:** 1.0 · **Updated:** 2026-05-10  
**Methodology:** Vertical slicing — each track delivers a testable end-to-end feature.

---

## Overview

```mermaid
gantt
    title Luna OS — Development Phases
    dateFormat  YYYY-MM-DD
    axisFormat  %b %d

    section Phase 0
    Foundation & Scaffold         :p0, 2026-05-12, 2d

    section Phase 1
    Track 1A – Desktop Shell      :p1a, after p0, 4d
    Track 1B – Window Manager     :p1b, after p0, 5d
    Track 1C – Start Menu         :p1c, after p1b, 2d

    section Phase 2
    Track 2A – Explorer + Content :p2a, after p1b, 4d
    Track 2B – Command Prompt     :p2b, after p1b, 3d
    Track 2C – Task Manager       :p2c, after p1b, 3d
    Track 2D – Help Center        :p2d, after p2a, 3d

    section Phase 3
    Track 3A – GitHub Data Sync   :p3a, after p2a, 2d
    Track 3B – URL State Persist  :p3b, after p1c, 2d
    Track 3C – My Docs & Bin      :p3c, after p2a, 2d

    section Phase 4
    Track 4A – Mobile Safe Mode   :p4a, after p2b, 4d
    Track 4B – Accessibility      :p4b, after p4a, 2d
    Track 4C – SEO & Performance  :p4c, after p4b, 2d

    section Phase 5
    Track 5A – CI/CD & Deploy     :p5a, after p4c, 2d
```

---

## Phase 0 — Foundation & Scaffold

> Bootstrap the project, install dependencies, and establish the design system. No features yet — just a buildable, styled skeleton.

### Tasks

- [ ] Init Astro project with React, MDX, Tailwind integrations ([TDD §1](./TDD.md#1-project-structure))
- [ ] Create directory structure: `components/`, `stores/`, `content/`, `lib/`, `styles/` ([TDD §1](./TDD.md#1-project-structure))
- [ ] Install all dependencies with `pnpm` ([TDD §13](./TDD.md#13-dependencies))
- [ ] Set up ESLint & Prettier for code formatting and linting
- [ ] Set up TypeScript for strict typechecking
- [ ] Set up Vitest for unit testing and coverage reporting
- [ ] Create a custom file modularity script (e.g. `scripts/check-modularity.js`) to ensure files in `src/` do not exceed 500 lines
- [ ] Configure Husky and lint-staged for git hooks:
  - [ ] **pre-commit**: use `lint-staged` to run lint, vitest (related tests), and file modularity check on staged files
  - [ ] **pre-push**: run typecheck and vitest coverage (enforcing 80% threshold)
- [ ] Create `src/styles/xp-theme.css` with full design token set ([TDD §5](./TDD.md#5-design-tokens--style-specification))
- [ ] Add Tahoma font files to `public/fonts/` ([TDD §5.2](./TDD.md#52-typography))
- [ ] Configure `tailwind.config.mjs` to extend with XP theme tokens
- [ ] Create `DesktopLayout.astro` skeleton ([TDD §6](./TDD.md#6-component-inventory))
- [ ] Create `index.astro` mounting the layout ([TDD §1](./TDD.md#1-project-structure))
- [ ] Verify: `pnpm dev` serves a blank page with correct fonts and XP blue background

### Acceptance Criteria

```
✅ Project builds and serves locally without errors
✅ Code quality tools (ESLint, Prettier, TypeScript, Vitest) are fully configured
✅ Git hooks enforce pre-commit (lint, test, modularity) and pre-push (typecheck, coverage >= 80%) rules
✅ Custom modularity script successfully fails if a file in `src/` exceeds 500 lines
✅ XP design tokens are available in CSS (verified with a test element)
✅ Tahoma font loads correctly
✅ Directory structure matches TDD §1
```

### Key Files Created

```
src/styles/xp-theme.css
src/layouts/DesktopLayout.astro
src/pages/index.astro
tailwind.config.mjs
astro.config.mjs
```

---

## Phase 1 — Core Shell

### Track 1A — Desktop Shell

> Wallpaper, desktop icons grid, and static taskbar. Clicking icons does nothing yet — the window manager doesn't exist.

**Refs:** [PRD §3.1](./PRD.md#31-the-desktop-experience) · [TDD §5.3](./TDD.md#53-classic-3d-border-system) · [TDD §5.4](./TDD.md#54-icon-sources) · [TDD §6 Astro Components](./TDD.md#astro-components-static)

#### Tasks

- [ ] Add `bliss.webp` / `bliss.avif` to `public/wallpapers/`
- [ ] Create `Wallpaper.astro` — responsive `<picture>` element ([TDD §6](./TDD.md#astro-components-static))
- [ ] Create desktop icon SVGs (My Computer, My Documents, Help, CMD, Recycle Bin) ([TDD §5.4](./TDD.md#54-icon-sources))
- [ ] Create `DesktopIcon.astro` — icon + label with hover highlight ([TDD §6](./TDD.md#astro-components-static), [TDD §9](./TDD.md#9-animations--transitions))
- [ ] Layout icon grid on desktop (left-aligned vertical column, XP-style)
- [ ] Create static `Taskbar` shell (blue gradient bar, Start button, clock) ([PRD §3.1](./PRD.md#31-the-desktop-experience), [TDD §5.1](./TDD.md#51-color-palette))
- [ ] Create `Clock` component showing current time in system tray

#### Acceptance Criteria

```
✅ Desktop shows Bliss wallpaper, 5 icons, and a blue taskbar
✅ Icons highlight on hover with XP-style blue selection
✅ Taskbar has green Start button (non-functional) and live clock
✅ Looks authentically XP at a glance
```

---

### Track 1B — Window Manager

> The core engineering challenge. Implement the Nano Stores-driven window system with open/close/drag/minimize/maximize/focus.

**Refs:** [TDD §3 (all subsections)](./TDD.md#3-window-manager-specification) · [TDD §6 React Islands](./TDD.md#react-islands-interactive)

#### Tasks

- [ ] Create `src/stores/windows.ts` with `$windows`, `$zCounter`, `$activeWindow` stores ([TDD §3.1](./TDD.md#31-window-state-schema))
- [ ] Implement all window actions: `openWindow`, `closeWindow`, `minimizeWindow`, `maximizeWindow`, `restoreWindow`, `focusWindow`, `moveWindow`, `resizeWindow` ([TDD §3.3](./TDD.md#33-window-actions))
- [ ] Create `WindowLayer.tsx` — iterates `$windows`, renders `WindowFrame` for each ([TDD §6](./TDD.md#react-islands-interactive))
- [ ] Create `WindowFrame.tsx` — chrome, 3D borders, rounded top corners ([TDD §5.3](./TDD.md#53-classic-3d-border-system))
- [ ] Create `TitleBar.tsx` — icon, title, min/max/close buttons ([TDD §6](./TDD.md#react-islands-interactive))
- [ ] Implement drag logic (title bar only, viewport-constrained) ([TDD §3.4](./TDD.md#34-behavior-rules))
- [ ] Implement edge/corner resize with min size constraints ([TDD §3.2](./TDD.md#32-default-window-configs), [TDD §3.4](./TDD.md#34-behavior-rules))
- [ ] Implement z-index stacking and focus-on-click ([TDD §3.4](./TDD.md#34-behavior-rules))
- [ ] Implement minimize/maximize/restore with CSS transitions ([TDD §9](./TDD.md#9-animations--transitions))
- [ ] Wire desktop icon double-click → `openWindow()` ([TDD §3.3](./TDD.md#33-window-actions))
- [ ] Update `Taskbar` to show buttons for open windows ([TDD §3.4 Taskbar toggle](./TDD.md#34-behavior-rules))
- [ ] Implement taskbar button toggle behavior (focus/minimize/restore) ([TDD §3.4](./TDD.md#34-behavior-rules))
- [ ] Mount `WindowLayer` as React island with `client:load` in `DesktopLayout.astro` ([TDD §1 Island Boundary Rules](./TDD.md#island-boundary-rules))

#### Acceptance Criteria

```
✅ Double-clicking a desktop icon opens a window with placeholder content
✅ Windows can be dragged by title bar (viewport-constrained)
✅ Windows can be resized from edges/corners (min size enforced)
✅ Clicking a window brings it to front (z-index updates)
✅ Min/max/close buttons work with correct XP-style transitions
✅ Taskbar shows buttons for all open windows
✅ Taskbar toggle: click focused → minimize, click minimized → restore, click unfocused → focus
✅ Multiple windows can be open simultaneously without state conflicts
```

---

### Track 1C — Start Menu

> Fully interactive Start Menu with two-column layout, user header, and program list that opens windows.

**Refs:** [PRD §3.1](./PRD.md#31-the-desktop-experience) · [TDD §7.3](./TDD.md#73-start-menu-layout) · [TDD §9](./TDD.md#9-animations--transitions)

#### Tasks

- [ ] Create `StartMenu.tsx` with two-column layout ([TDD §7.3](./TDD.md#73-start-menu-layout))
- [ ] Add blue header bar with user avatar and name
- [ ] Add left column: pinned apps (Resume, Explorer, Task Manager, CMD)
- [ ] Add right column: system folders (My Documents, My Computer, Control Panel, Help)
- [ ] Add bottom bar with "Shut Down..." button
- [ ] Wire menu items to `openWindow()` + close Start Menu
- [ ] Implement slide-up/slide-down animation ([TDD §9](./TDD.md#9-animations--transitions))
- [ ] Close Start Menu on click-outside or Escape key
- [ ] Implement "Shut Down" → BSOD/goodbye overlay ([PRD §3.1](./PRD.md#31-the-desktop-experience))

#### Acceptance Criteria

```
✅ Clicking Start button opens the two-column menu with slide-up animation
✅ Menu items open corresponding windows and close the menu
✅ Clicking outside or pressing Escape closes the menu
✅ "Shut Down" shows a styled BSOD overlay
✅ Menu matches XP Start Menu layout (blue header, white left, light blue right)
```

---

## Phase 2 — Applications

### Track 2A — Explorer + Content

> File explorer with breadcrumb navigation through the virtual filesystem. Project MDX content renders inside the window.

**Refs:** [PRD §4](./PRD.md#4-file-system--content-mapping) · [TDD §4.1](./TDD.md#41-project-mdx-frontmatter) · [TDD §4.3](./TDD.md#43-virtual-filesystem-tree) · [TDD §6](./TDD.md#react-islands-interactive)

#### Tasks

- [ ] Create `src/content/config.ts` with `projects` collection schema ([TDD §4.1](./TDD.md#41-project-mdx-frontmatter))
- [ ] Write MDX files for `icarus-server-manager`, `portable-mc-manager`, `tubular-bexus-osw`, and other featured projects ([PRD §4](./PRD.md#-directory-details))
- [ ] Create `src/lib/constants.ts` with `FILE_SYSTEM` tree built from content collections ([TDD §4.3](./TDD.md#43-virtual-filesystem-tree))
- [ ] Create `Explorer.tsx` — address bar, toolbar, breadcrumb, file list pane ([TDD §6](./TDD.md#react-islands-interactive))
- [ ] Implement folder navigation (`cd` into directories, back button)
- [ ] Render file list with 16×16 icons, name, size, type columns (XP detail view)
- [ ] Clicking a project file opens its MDX content in the Explorer detail pane
- [ ] Wire "My Computer" icon → Explorer at root (`C:\`, `D:\`, `E:\`)
- [ ] Wire drive icons to their respective folders ([PRD §4](./PRD.md#-desktop-icons))

#### Acceptance Criteria

```
✅ Double-click My Computer → Explorer opens showing C:, D:, E: drives
✅ Navigate into C:\Software_Engineering → see project files listed
✅ Click a project → MDX content renders in the Explorer window
✅ Breadcrumb updates and is clickable for navigation
✅ Back button works correctly
✅ File list matches XP Explorer detail view aesthetically
```

---

### Track 2B — Command Prompt

> Functional terminal emulator with command parsing, history, and filesystem navigation.

**Refs:** [PRD §5.1](./PRD.md#51-command-prompt-cmdexe) · [TDD §7.1](./TDD.md#71-command-prompt) · [TDD §4.3](./TDD.md#43-virtual-filesystem-tree)

#### Tasks

- [ ] Create `CmdPrompt.tsx` — black terminal with blinking cursor ([TDD §7.1](./TDD.md#71-command-prompt))
- [ ] Create `src/lib/commands.ts` — command registry and parser ([TDD §1](./TDD.md#1-project-structure))
- [ ] Implement all commands: `help`, `ls`/`dir`, `cd`, `cat`, `clear`/`cls`, `neofetch`, `open`, `whoami`, `echo` ([TDD §7.1](./TDD.md#71-command-prompt))
- [ ] Implement command history via ↑/↓ arrow keys (stored in window state) ([TDD §7.1](./TDD.md#71-command-prompt))
- [ ] Navigate the same `FILE_SYSTEM` tree used by Explorer ([TDD §4.3](./TDD.md#43-virtual-filesystem-tree))
- [ ] `open` command triggers `openWindow()` for the target ([TDD §7.1](./TDD.md#71-command-prompt))
- [ ] Unknown commands show XP-style error message ([TDD §7.1](./TDD.md#71-command-prompt))
- [ ] Auto-scroll to bottom on new output
- [ ] Create `neofetch` ASCII art + system info layout

#### Acceptance Criteria

```
✅ CMD opens with "C:\MANSYAR>" prompt and blinking cursor
✅ All 9 commands produce correct output
✅ `cd` + `ls` navigate the virtual filesystem consistently with Explorer
✅ `open resume.pdf` opens the PDF in a new tab
✅ Arrow keys cycle through command history
✅ Unknown command shows: "'xyz' is not recognized as an internal or external command."
```

---

### Track 2C — Task Manager

> Processes list and animated performance graphs representing skills.

**Refs:** [PRD §5.2](./PRD.md#52-task-manager-control-panel) · [TDD §7.2](./TDD.md#72-task-manager)

#### Tasks

- [ ] Create `TaskManager.tsx` with tab switching (Processes / Performance) ([TDD §7.2](./TDD.md#72-task-manager))
- [ ] Implement Processes tab with table: Image Name, PID, CPU, Mem, Description ([TDD §7.2](./TDD.md#72-task-manager))
- [ ] Animate CPU % with ±3% random fluctuation every 1s ([TDD §7.2](./TDD.md#72-task-manager))
- [ ] Implement Performance tab with `<canvas>` or SVG line graphs ([TDD §7.2](./TDD.md#72-task-manager))
- [ ] Green line on black grid, scrolling left, updating every 1s
- [ ] Style tabs and chrome to match XP Task Manager

#### Acceptance Criteria

```
✅ Task Manager opens with Processes tab showing 8+ skill entries
✅ CPU percentages animate with subtle fluctuation
✅ Performance tab shows two live-updating line graphs
✅ Tab switching works correctly
✅ Visually matches XP Task Manager aesthetic
```

---

### Track 2D — Help & Support Center

> MDX article browser styled as the XP Help and Support Center pane.

**Refs:** [PRD §5.3](./PRD.md#53-help--support-center) · [TDD §4.1](./TDD.md#41-project-mdx-frontmatter) (devopsAcademy schema) · [TDD §6](./TDD.md#react-islands-interactive)

#### Tasks

- [ ] Create `src/content/config.ts` `devopsAcademy` collection schema ([TDD §4.1](./TDD.md#41-project-mdx-frontmatter))
- [ ] Write initial MDX articles from `devops-from-scratch` repo ([PRD §5.3](./PRD.md#53-help--support-center))
- [ ] Create `HelpCenter.tsx` — blue/white pane with search bar and sidebar ([PRD §5.3](./PRD.md#53-help--support-center))
- [ ] Implement sidebar category tree navigation
- [ ] Implement basic text search filtering over articles
- [ ] Render selected MDX article in the main content pane
- [ ] Style to match XP "Help and Support Center" window

#### Acceptance Criteria

```
✅ Help & Support opens showing categories in sidebar
✅ Clicking a category shows its articles
✅ Clicking an article renders MDX content
✅ Search bar filters articles by title/description
✅ Layout matches the classic XP Help pane aesthetic
```

---

## Phase 3 — Integration & Data

### Track 3A — GitHub Data Sync

> Build-time GitHub API fetching to populate project metadata (stars, commits, last push).

**Refs:** [PRD §6](./PRD.md#6-devops--deployment-strategy) · [TDD §4.2](./TDD.md#42-github-api-data-shape) · [TDD §14](./TDD.md#14-build--deploy-pipeline)

#### Tasks

- [ ] Create `src/lib/github.ts` with `fetchRepoStats()` ([TDD §4.2](./TDD.md#42-github-api-data-shape))
- [ ] Integrate into Astro build pipeline — fetch data, merge into content collection entries
- [ ] Cache last-good API response in `src/content/_cache/github.json` ([TDD §11](./TDD.md#11-error-states))
- [ ] Fallback to cache on API failure with console warning ([TDD §11](./TDD.md#11-error-states))
- [ ] Verify fetched data appears in Explorer project listings and CMD `cat` output

#### Acceptance Criteria

```
✅ `pnpm build` fetches live GitHub data and injects into project content
✅ Explorer shows real star counts and last commit dates
✅ If GitHub API is unreachable, build succeeds using cached data
```

---

### Track 3B — URL State Persistence

> Sync window state to URL search params for deep-linking and share-ability.

**Refs:** [TDD §2](./TDD.md#2-routing--url-strategy)

#### Tasks

- [ ] Create URL ↔ store sync logic in `src/stores/windows.ts` ([TDD §2](./TDD.md#2-routing--url-strategy))
- [ ] On page load: parse `?w=`, `?focus=`, `?start=`, `?path=` → hydrate stores
- [ ] On store change: debounced `replaceState()` to update URL (no reload) ([TDD §2](./TDD.md#2-routing--url-strategy))
- [ ] Test all deep-link examples from TDD §2

#### Acceptance Criteria

```
✅ Opening windows updates the URL with correct params
✅ Pasting a URL with `?w=cmd,taskmanager&focus=cmd` opens both windows with CMD focused
✅ Closing all windows returns URL to clean `/`
✅ Browser back/forward navigates window state history
```

---

### Track 3C — My Documents & Recycle Bin

> My Documents contains resume, certs, and contact info. Recycle Bin links to legacy content.

**Refs:** [PRD §4](./PRD.md#-desktop-icons) · [TDD §4.4](./TDD.md#44-resume)

#### Tasks

- [ ] Add `resume.pdf` to `public/` ([TDD §4.4](./TDD.md#44-resume))
- [ ] Create My Documents Explorer view: `Resume.pdf`, `Certs/` folder, `Contact.txt`
- [ ] PDF click → `window.open()` in new tab ([TDD §4.4](./TDD.md#44-resume))
- [ ] Create Recycle Bin Explorer view with links to `mansyar.github.io` and old repos ([PRD §4](./PRD.md#-desktop-icons))

#### Acceptance Criteria

```
✅ My Documents opens showing Resume.pdf, Certs folder, Contact.txt
✅ Clicking Resume.pdf opens the PDF in a new browser tab
✅ Recycle Bin shows legacy project links (styled as "deleted" files)
```

---

## Phase 4 — Mobile & Polish

### Track 4A — Mobile Safe Mode

> Full mobile experience: BIOS boot sequence, terminal menu navigation, all content accessible.

**Refs:** [PRD §3.2](./PRD.md#32-the-mobile-experience-safe-mode) · [TDD §8](./TDD.md#8-mobile-safe-mode-specification)

#### Tasks

- [ ] Create `SafeModeShell.astro` — black screen with green monospace text ([TDD §8](./TDD.md#8-mobile-safe-mode-specification))
- [ ] Implement boot sequence animation (line-by-line text, 50ms/line) ([TDD §8](./TDD.md#8-mobile-safe-mode-specification), [TDD §9](./TDD.md#9-animations--transitions))
- [ ] Create numbered menu system: `[1] Projects [2] Skills [3] About [4] Contact` ([TDD §8](./TDD.md#8-mobile-safe-mode-specification))
- [ ] Render all content (projects, skills, about, contact) as monospace text blocks
- [ ] Implement `[0] Back` navigation ([TDD §8](./TDD.md#8-mobile-safe-mode-specification))
- [ ] Add CRT scanline + curvature CSS effects ([TDD §8](./TDD.md#8-mobile-safe-mode-specification))
- [ ] Conditional rendering: viewport < 768px → Safe Mode, else → Desktop ([PRD §3.2](./PRD.md#32-the-mobile-experience-safe-mode))

#### Acceptance Criteria

```
✅ Resizing browser below 768px shows the Safe Mode boot sequence
✅ Boot text appears line-by-line, then shows numbered menu
✅ All 4 menu options render their content correctly
✅ [0] Back returns to previous menu
✅ CRT visual effects are visible and subtle
✅ All portfolio content is accessible on mobile
```

---

### Track 4B — Accessibility

> Keyboard navigation, ARIA roles, focus management, and reduced motion support.

**Refs:** [TDD §10](./TDD.md#10-accessibility-strategy)

#### Tasks

- [ ] Add ARIA roles to all interactive components ([TDD §10](./TDD.md#10-accessibility-strategy))
- [ ] Implement keyboard navigation: `Tab` cycles icons → taskbar → windows ([TDD §10](./TDD.md#10-accessibility-strategy))
- [ ] `Enter` activates focused element, `Escape` closes menus/windows ([TDD §10](./TDD.md#10-accessibility-strategy))
- [ ] Focus management: opening window moves focus to it, closing returns focus ([TDD §10](./TDD.md#10-accessibility-strategy))
- [ ] Add `aria-hidden="true"` to decorative elements ([TDD §10](./TDD.md#10-accessibility-strategy))
- [ ] Add `@media (prefers-reduced-motion: reduce)` to disable animations ([TDD §10](./TDD.md#10-accessibility-strategy))
- [ ] Verify color contrast passes WCAG AA

#### Acceptance Criteria

```
✅ Entire site navigable with keyboard only (no mouse required)
✅ Screen reader announces windows, menus, and content correctly
✅ Focus is visible and moves logically
✅ Animations disabled with prefers-reduced-motion
```

---

### Track 4C — SEO & Performance

> Meta tags, Open Graph, structured data, performance tuning to hit TBT < 100ms.

**Refs:** [PRD §7](./PRD.md#7-success-metrics) · [TDD §12](./TDD.md#12-seo--meta-strategy)

#### Tasks

- [ ] Create `MetaTags.astro` component ([TDD §6](./TDD.md#astro-components-static), [TDD §12](./TDD.md#12-seo--meta-strategy))
- [ ] Add title, description, OG tags, and structured data ([TDD §12](./TDD.md#12-seo--meta-strategy))
- [ ] Generate `og-preview.png` screenshot ([TDD §12](./TDD.md#12-seo--meta-strategy))
- [ ] Create 404 page styled as BSOD ([TDD §11](./TDD.md#11-error-states))
- [ ] Optimize asset pipeline: AVIF/WebP images, font subsetting ([PRD §6](./PRD.md#6-devops--deployment-strategy))
- [ ] Audit with Lighthouse — target TBT < 100ms ([PRD §7](./PRD.md#7-success-metrics))
- [ ] Add `<noscript>` fallback listing all projects ([TDD §11](./TDD.md#11-error-states))

#### Acceptance Criteria

```
✅ Lighthouse Performance score > 90
✅ TBT < 100ms
✅ OG preview renders correctly when shared on social media
✅ 404 page shows a styled BSOD
✅ Content accessible with JavaScript disabled via <noscript>
```

---

## Phase 5 — Deploy

### Track 5A — CI/CD & Launch

> GitHub Actions pipeline with CRON-triggered rebuilds, Cloudflare Pages deployment.

**Refs:** [PRD §6](./PRD.md#6-devops--deployment-strategy) · [TDD §14](./TDD.md#14-build--deploy-pipeline)

#### Tasks

- [ ] Create `.github/workflows/deploy.yml` ([TDD §14](./TDD.md#14-build--deploy-pipeline))
- [ ] Configure build steps: `pnpm install` → fetch GitHub data → `astro build` → deploy
- [ ] Add CRON trigger: `0 0 * * *` (daily at 00:00 UTC) ([PRD §6](./PRD.md#6-devops--deployment-strategy))
- [ ] Configure Cloudflare Pages project
- [ ] Set up custom domain (`mansyar.dev`) with SSL
- [ ] Smoke test: push to main → site live within 2 minutes

#### Acceptance Criteria

```
✅ Push to main triggers automatic build and deploy
✅ Site is live on mansyar.dev with SSL
✅ CRON job triggers daily build to refresh GitHub data
✅ Build completes in under 60 seconds
```

---

## Track Dependency Graph

```mermaid
graph TD
    P0[Phase 0: Foundation] --> T1A[Track 1A: Desktop Shell]
    P0 --> T1B[Track 1B: Window Manager]
    T1B --> T1C[Track 1C: Start Menu]
    T1B --> T2A[Track 2A: Explorer + Content]
    T1B --> T2B[Track 2B: Command Prompt]
    T1B --> T2C[Track 2C: Task Manager]
    T2A --> T2D[Track 2D: Help Center]
    T2A --> T3A[Track 3A: GitHub Data Sync]
    T1C --> T3B[Track 3B: URL State Persist]
    T2A --> T3C[Track 3C: My Docs & Bin]
    T2B --> T4A[Track 4A: Mobile Safe Mode]
    T4A --> T4B[Track 4B: Accessibility]
    T4B --> T4C[Track 4C: SEO & Performance]
    T4C --> T5A[Track 5A: CI/CD & Launch]

    style P0 fill:#4a9eff,color:#fff
    style T1A fill:#3b8f3f,color:#fff
    style T1B fill:#3b8f3f,color:#fff
    style T1C fill:#3b8f3f,color:#fff
    style T2A fill:#e67e22,color:#fff
    style T2B fill:#e67e22,color:#fff
    style T2C fill:#e67e22,color:#fff
    style T2D fill:#e67e22,color:#fff
    style T3A fill:#9b59b6,color:#fff
    style T3B fill:#9b59b6,color:#fff
    style T3C fill:#9b59b6,color:#fff
    style T4A fill:#e74c3c,color:#fff
    style T4B fill:#e74c3c,color:#fff
    style T4C fill:#e74c3c,color:#fff
    style T5A fill:#1abc9c,color:#fff
```

### Parallel Work Opportunities

| Tracks that can run in parallel | After |
|:---|:---|
| Track 1A + Track 1B | Phase 0 |
| Track 2A + Track 2B + Track 2C | Track 1B |
| Track 3A + Track 3B + Track 3C | Their respective deps |

---

## Legend

| Status | Meaning |
|:---|:---|
| `- [ ]` | Not started |
| `- [x]` | Complete |
| `🚧` | In progress |
| `🔴` | Blocked |
