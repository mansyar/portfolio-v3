# PRD: Windows XP DevOps Portfolio (Luna OS)

**Author:** @mansyar  
**Version:** 1.4  
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

### 3.2 The Mobile Experience (Safe Mode)

- **Trigger:** Viewport width < 768px.
- **Visuals:** High-contrast black/green terminal aesthetic.
- **Interaction:** Simplified text-based list navigation; no draggable windows.

---

## 4. File System & Content Mapping

### 🖥️ Desktop Icons

| Icon               | Type    | Content / Action                                                    |
| :----------------- | :------ | :------------------------------------------------------------------ |
| **My Computer**    | Folder  | Opens Explorer for `C:\Software_Engineering` and `D:\Systems_Data`. |
| **My Documents**   | Folder  | Contains `Resume.pdf`, `Certs/` folder, and contact info.           |
| **Knowledge Base** | App     | `E:\Knowledge_Base` (Variative articles: SE, AI, DevOps, etc.).     |
| **Command Prompt** | App     | Functional React terminal for CLI navigation.                       |
| **Recycle Bin**    | Archive | Links to `mansyar.github.io` (Legacy) and old repositories.         |

### 📂 Directory Details

- **C:\Software_Engineering:** Features `icarus-server-manager` and `portable-mc-manager`.
- **D:\Systems_Data:** Features `tubular-bexus-osw` and data-heavy system logs.
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

- **UI:** Classic blue/white pane with a search bar and sidebar with category tree navigation.
- **Content:** Renders MDX articles spanning Software Engineering, AI, DevOps, and more, styled as classic Windows XP Knowledge Base articles.

---

## 6. DevOps & Deployment Strategy

1.  **Data Sync:** Astro fetches GitHub repo stats during build time using `Astro.fetchContent` or custom loaders.
2.  **Asset Pipeline:** Images are converted to WebP; icons remain high-quality SVGs.
3.  **Deployment:**
    - Automatic deploy on `git push`.
    - CRON Job via GitHub Actions triggers a build at 00:00 UTC daily to update commit counts/repo data.
4.  **Edge Logic:** Cloudflare Functions handle the URL Search Param parsing for window state persistence.

---

## 7. Success Metrics

- **Performance:** < 100ms TBT (Total Blocking Time).
- **Authenticity:** Design mirrors 2001-era Windows XP pixel-for-pixel (3D borders, blue gradients).
- **Utility:** Mobile "Safe Mode" must be fully navigable in under 1.5 seconds.
